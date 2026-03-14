from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import base64, csv, io, json, os, time, uuid, re, hashlib
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import pickle, threading

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

SCOPES = [
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.modify",
]
TOKEN_FILE        = "token.pickle"
CREDENTIALS_FILE  = "credentials.json"
CAMPAIGNS_FILE    = "campaigns.json"
TEMPLATES_FILE    = "templates.json"
SENT_HASHES_FILE  = "sent_hashes.json"   # duplicate filtering
TRACKING_FILE     = "tracking.json"      # open tracking pixels

# ── Rate-limiter state (in-memory) ────────────────────────────────────────────
_rate_lock = threading.Lock()
_hourly_sent: List[float] = []   # timestamps of sends in current hour

def rate_check_and_record(limit_per_hour: int) -> bool:
    """Return True if we can send, False if hourly limit reached."""
    now = time.time()
    cutoff = now - 3600
    with _rate_lock:
        global _hourly_sent
        _hourly_sent = [t for t in _hourly_sent if t > cutoff]
        if len(_hourly_sent) >= limit_per_hour:
            return False
        _hourly_sent.append(now)
        return True

def hourly_remaining(limit_per_hour: int) -> int:
    now = time.time()
    cutoff = now - 3600
    with _rate_lock:
        recent = [t for t in _hourly_sent if t > cutoff]
    return max(0, limit_per_hour - len(recent))

# ── Gmail service ─────────────────────────────────────────────────────────────
def get_service():
    creds = None
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, "rb") as f:
            creds = pickle.load(f)
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
        with open(TOKEN_FILE, "wb") as f:
            pickle.dump(creds, f)
    if not creds or not creds.valid:
        return None
    return build("gmail", "v1", credentials=creds)

# ── Auth ──────────────────────────────────────────────────────────────────────
@app.get("/auth/status")
def auth_status():
    svc = get_service()
    if svc:
        p = svc.users().getProfile(userId="me").execute()
        return {"authenticated": True, "email": p.get("emailAddress")}
    return {"authenticated": False}

@app.get("/auth/login")
def auth_login():
    if not os.path.exists(CREDENTIALS_FILE):
        raise HTTPException(400, "credentials.json not found in backend/ folder.")
    flow = Flow.from_client_secrets_file(CREDENTIALS_FILE, scopes=SCOPES)
    flow.redirect_uri = "http://localhost:8000/auth/callback"
    url, state = flow.authorization_url(access_type="offline", include_granted_scopes="true")
    with open("oauth_state.json", "w") as f:
        json.dump({"state": state}, f)
    return {"auth_url": url}

@app.get("/auth/callback")
def auth_callback(code: str, state: str):
    flow = Flow.from_client_secrets_file(CREDENTIALS_FILE, scopes=SCOPES)
    flow.redirect_uri = "http://localhost:8000/auth/callback"
    flow.fetch_token(code=code)
    with open(TOKEN_FILE, "wb") as f:
        pickle.dump(flow.credentials, f)
    return {"message": "Authenticated! Close this tab and return to the app."}

# ── Upload credentials ────────────────────────────────────────────────────────
@app.post("/auth/credentials/upload")
async def upload_credentials(file: UploadFile = File(...)):
    """Upload credentials.json file from frontend. Saves as credentials.json regardless of input filename."""
    try:
        content = await file.read()
        # Validate JSON
        credentials_data = json.loads(content)
        if "type" not in credentials_data or "client_id" not in credentials_data:
            raise HTTPException(400, "Invalid credentials file. Must be Google OAuth credentials.json")
        # Save as credentials.json in backend folder
        with open(CREDENTIALS_FILE, "wb") as f:
            f.write(content)
        return {"message": f"Credentials uploaded successfully", "saved_as": CREDENTIALS_FILE}
    except json.JSONDecodeError:
        raise HTTPException(400, "Invalid JSON file")
    except Exception as e:
        raise HTTPException(400, f"Upload failed: {str(e)}")

# ── Contacts upload ───────────────────────────────────────────────────────────
@app.post("/contacts/upload")
async def upload_contacts(file: UploadFile = File(...)):
    raw = await file.read()
    decoded = raw.decode("utf-8-sig")
    reader = csv.DictReader(io.StringIO(decoded))
    contacts, seen_emails = [], set()
    for row in reader:
        c = {}
        for key, val in row.items():
            k = key.strip().lower().replace(" ", "_")
            if k in ("email", "email_address", "e-mail", "e_mail"):
                c["email"] = val.strip().lower()
            elif k in ("name", "full_name", "contact_name"):
                c["name"] = val.strip()
            elif k in ("company", "company_name", "organization", "agency"):
                c["company"] = val.strip()
            elif k in ("first_name", "firstname"):
                c["first_name"] = val.strip()
            elif k in ("phone", "mobile", "whatsapp"):
                c["phone"] = val.strip()
            elif k in ("segment", "type", "category"):
                c["segment"] = val.strip()
            elif k in ("language", "lang"):
                c["language"] = val.strip()
            else:
                c[key.strip()] = val.strip()
        email = c.get("email", "")
        if not email or not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            continue
        if email in seen_emails:          # deduplicate on upload
            continue
        seen_emails.add(email)
        if "name" not in c:
            c["name"] = c.get("first_name", email.split("@")[0].title())
        contacts.append(c)
    return {"contacts": contacts, "count": len(contacts), "skipped_duplicates": len(list(reader.fieldnames or [])) > 0}

# ── Duplicate filtering (cross-campaign) ──────────────────────────────────────
def load_sent_hashes() -> set:
    if os.path.exists(SENT_HASHES_FILE):
        with open(SENT_HASHES_FILE) as f:
            return set(json.load(f))
    return set()

def save_sent_hash(email: str, campaign_id: str):
    h = hashlib.md5(f"{email}:{campaign_id}".encode()).hexdigest()
    hashes = load_sent_hashes()
    hashes.add(h)
    with open(SENT_HASHES_FILE, "w") as f:
        json.dump(list(hashes), f)

def already_sent(email: str, campaign_id: str) -> bool:
    h = hashlib.md5(f"{email}:{campaign_id}".encode()).hexdigest()
    return h in load_sent_hashes()

@app.delete("/sent-hashes")
def clear_sent_hashes():
    if os.path.exists(SENT_HASHES_FILE):
        os.remove(SENT_HASHES_FILE)
    return {"cleared": True}

# ── Open tracking ─────────────────────────────────────────────────────────────
TRACKING_PIXEL = """<img src="http://localhost:8000/track/open/{token}" width="1" height="1" style="display:none" />"""

def load_tracking() -> dict:
    if os.path.exists(TRACKING_FILE):
        with open(TRACKING_FILE) as f:
            return json.load(f)
    return {}

def save_tracking(data: dict):
    with open(TRACKING_FILE, "w") as f:
        json.dump(data, f, indent=2)

def register_tracking_token(token: str, email: str, campaign_id: str):
    data = load_tracking()
    data[token] = {"email": email, "campaign_id": campaign_id, "opened_at": None, "opens": 0}
    save_tracking(data)

@app.get("/track/open/{token}")
def track_open(token: str):
    data = load_tracking()
    if token in data:
        data[token]["opens"] = data[token].get("opens", 0) + 1
        data[token]["opened_at"] = datetime.now().isoformat()
        save_tracking(data)
        # Also update campaign
        cid = data[token].get("campaign_id")
        email = data[token].get("email")
        if cid:
            campaigns = load_campaigns()
            for c in campaigns:
                if c["id"] == cid:
                    for r in c.get("results", []):
                        if r.get("email") == email:
                            r["opened"] = True
                            r["opened_at"] = data[token]["opened_at"]
            save_campaigns(campaigns)
    # Return 1x1 transparent GIF
    gif = base64.b64decode("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7")
    from fastapi.responses import Response
    return Response(content=gif, media_type="image/gif")

@app.get("/track/stats/{campaign_id}")
def track_stats(campaign_id: str):
    data = load_tracking()
    tokens = [v for v in data.values() if v.get("campaign_id") == campaign_id]
    opened = [t for t in tokens if t.get("opened_at")]
    return {"total": len(tokens), "opened": len(opened), "open_rate": round(len(opened)/max(len(tokens),1)*100, 1)}

# ── Bounce / reply detection ──────────────────────────────────────────────────
@app.get("/campaigns/{campaign_id}/replies")
def check_replies(campaign_id: str):
    """Scan inbox for replies to this campaign's emails."""
    svc = get_service()
    if not svc:
        raise HTTPException(401, "Not authenticated")
    campaigns = load_campaigns()
    campaign = next((c for c in campaigns if c["id"] == campaign_id), None)
    if not campaign:
        raise HTTPException(404, "Campaign not found")
    sent_emails = {r["email"] for r in campaign.get("results", []) if r.get("status") == "sent"}
    replies, bounces = [], []
    try:
        msgs = svc.users().messages().list(userId="me", q=f"in:inbox after:{campaign.get('sent_at','').split('T')[0] or '2024/1/1'}", maxResults=50).execute()
        for m in msgs.get("messages", []):
            detail = svc.users().messages().get(userId="me", id=m["id"], format="metadata",
                metadataHeaders=["From","Subject","To"]).execute()
            headers = {h["name"]: h["value"] for h in detail.get("payload", {}).get("headers", [])}
            from_addr = headers.get("From", "")
            subject = headers.get("Subject", "")
            email_match = re.search(r"[\w.+-]+@[\w-]+\.[a-z]+", from_addr)
            if email_match:
                addr = email_match.group(0).lower()
                if addr in sent_emails:
                    if "undelivered" in subject.lower() or "bounce" in subject.lower() or "failed" in subject.lower():
                        bounces.append({"email": addr, "subject": subject})
                    else:
                        replies.append({"email": addr, "subject": subject, "from": from_addr})
    except Exception as e:
        pass
    # Update campaign results
    for c in campaigns:
        if c["id"] == campaign_id:
            for r in c.get("results", []):
                if any(rep["email"] == r["email"] for rep in replies):
                    r["replied"] = True
                if any(b["email"] == r["email"] for b in bounces):
                    r["bounced"] = True
    save_campaigns(campaigns)
    return {"replies": replies, "bounces": bounces, "reply_count": len(replies), "bounce_count": len(bounces)}

# ── Build MIME message ────────────────────────────────────────────────────────
def build_message(sender: str, to: str, subject: str, body: str, is_html: bool,
                  cc: str = "", bcc: str = "", reply_to: str = "",
                  attachments: List[dict] = None, tracking_token: str = "") -> dict:
    msg = MIMEMultipart("mixed")
    msg["From"] = sender
    msg["To"] = to
    msg["Subject"] = subject
    if cc:   msg["Cc"] = cc
    if bcc:  msg["Bcc"] = bcc
    if reply_to: msg["Reply-To"] = reply_to

    alt = MIMEMultipart("alternative")
    final_body = body
    if is_html and tracking_token:
        pixel = TRACKING_PIXEL.format(token=tracking_token)
        final_body = body + pixel
    content_type = "html" if is_html else "plain"
    alt.attach(MIMEText(final_body, content_type, "utf-8"))
    msg.attach(alt)

    # Attachments
    for att in (attachments or []):
        part = MIMEBase("application", "octet-stream")
        file_data = base64.b64decode(att["data"])
        part.set_payload(file_data)
        encoders.encode_base64(part)
        part.add_header("Content-Disposition", f'attachment; filename="{att["filename"]}"')
        msg.attach(part)

    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
    return {"raw": raw}

# ── Personalization ───────────────────────────────────────────────────────────
def personalize(template: str, contact: dict) -> str:
    for key, val in contact.items():
        template = template.replace(f"{{{{{key}}}}}", str(val) if val else "")
    return template

# ── Campaigns persistence ─────────────────────────────────────────────────────
def load_campaigns() -> list:
    if os.path.exists(CAMPAIGNS_FILE):
        with open(CAMPAIGNS_FILE) as f:
            return json.load(f)
    return []

def save_campaigns(campaigns: list):
    with open(CAMPAIGNS_FILE, "w") as f:
        json.dump(campaigns, f, indent=2)

# ── Send Emails ───────────────────────────────────────────────────────────────
class SendPayload(BaseModel):
    subject: str
    body: str
    contacts: List[dict]
    delay_seconds: Optional[float] = 2.0
    is_html: Optional[bool] = True
    cc: Optional[str] = ""
    bcc: Optional[str] = ""
    reply_to: Optional[str] = ""
    attachments: Optional[List[dict]] = []   # [{filename, data (base64)}]
    enable_tracking: Optional[bool] = True
    rate_limit_per_hour: Optional[int] = 400
    skip_duplicates: Optional[bool] = True
    campaign_name: Optional[str] = ""
    campaign_type: Optional[str] = "general"  # general|followup|newsletter|promotion|itinerary
    segment: Optional[str] = ""
    language: Optional[str] = "en"

@app.post("/emails/send")
def send_emails(payload: SendPayload):
    svc = get_service()
    if not svc:
        raise HTTPException(401, "Not authenticated. Please connect Gmail first.")
    profile = svc.users().getProfile(userId="me").execute()
    sender = profile["emailAddress"]
    campaign_id = str(uuid.uuid4())[:8]
    results = []
    skipped_dup = 0

    for i, contact in enumerate(payload.contacts):
        email = contact.get("email", "").strip().lower()
        if not email:
            results.append({"email": "—", "status": "skipped", "reason": "no email"})
            continue

        # Duplicate filter
        if payload.skip_duplicates and already_sent(email, payload.campaign_name or "default"):
            results.append({"email": email, "status": "skipped", "reason": "already sent (duplicate filter)"})
            skipped_dup += 1
            continue

        # Rate limit
        if not rate_check_and_record(payload.rate_limit_per_hour):
            results.append({"email": email, "status": "rate_limited", "reason": f"Hourly limit {payload.rate_limit_per_hour} reached"})
            continue

        try:
            subj = personalize(payload.subject, contact)
            body = personalize(payload.body, contact)
            token = ""
            if payload.enable_tracking:
                token = str(uuid.uuid4())
                register_tracking_token(token, email, campaign_id)
            msg = build_message(sender, email, subj, body, payload.is_html,
                                payload.cc, payload.bcc, payload.reply_to,
                                payload.attachments, token)
            svc.users().messages().send(userId="me", body=msg).execute()
            if payload.skip_duplicates:
                save_sent_hash(email, payload.campaign_name or "default")
            results.append({"email": email, "status": "sent", "opened": False, "replied": False, "bounced": False, "tracking_token": token})
        except Exception as e:
            results.append({"email": email, "status": "failed", "reason": str(e)})

        if i < len(payload.contacts) - 1:
            time.sleep(payload.delay_seconds)

    sent  = sum(1 for r in results if r["status"] == "sent")
    failed= sum(1 for r in results if r["status"] == "failed")

    campaign = {
        "id": campaign_id,
        "name": payload.campaign_name or f"Campaign {datetime.now().strftime('%b %d %H:%M')}",
        "type": payload.campaign_type,
        "segment": payload.segment,
        "subject": payload.subject,
        "sent_at": datetime.now().isoformat(),
        "total": len(payload.contacts),
        "sent": sent, "failed": failed,
        "skipped_duplicates": skipped_dup,
        "results": results,
    }
    campaigns = load_campaigns()
    campaigns.insert(0, campaign)
    save_campaigns(campaigns)

    return {"campaign_id": campaign_id, "total": len(payload.contacts),
            "sent": sent, "failed": failed, "skipped_duplicates": skipped_dup, "results": results}

# ── Follow-up sequences ───────────────────────────────────────────────────────
class FollowUpStep(BaseModel):
    day: int           # send N days after the original email
    subject: str
    body: str
    skip_if_replied: bool = True

class FollowUpPayload(BaseModel):
    original_campaign_id: str
    steps: List[FollowUpStep]
    delay_seconds: float = 2.0
    is_html: bool = True

@app.post("/emails/followup")
def create_followup(payload: FollowUpPayload):
    """Register follow-up steps for a campaign. A background check runs them."""
    campaigns = load_campaigns()
    for c in campaigns:
        if c["id"] == payload.original_campaign_id:
            c["followup_steps"] = [s.dict() for s in payload.steps]
            c["followup_status"] = "scheduled"
    save_campaigns(campaigns)
    return {"scheduled": True, "steps": len(payload.steps)}

@app.get("/emails/followup/due")
def get_due_followups():
    """Returns follow-up emails that are due today (frontend can trigger send)."""
    now = datetime.now()
    campaigns = load_campaigns()
    due = []
    for c in campaigns:
        steps = c.get("followup_steps", [])
        sent_at = datetime.fromisoformat(c.get("sent_at", now.isoformat()))
        for step in steps:
            due_at = sent_at + timedelta(days=step["day"])
            if due_at.date() <= now.date() and not step.get("sent"):
                # Only contacts who didn't reply
                contacts = [r for r in c.get("results", [])
                            if r.get("status") == "sent" and not r.get("replied") and not r.get("bounced")]
                if contacts:
                    due.append({"campaign_id": c["id"], "campaign_name": c["name"],
                                "step": step, "contacts": contacts, "due_at": due_at.isoformat()})
    return due

# ── Rate limit status ──────────────────────────────────────────────────────────
@app.get("/rate-limit/status")
def rate_status(limit: int = 400):
    return {"limit_per_hour": limit, "remaining": hourly_remaining(limit),
            "used": limit - hourly_remaining(limit)}

# ── Campaigns ─────────────────────────────────────────────────────────────────
@app.get("/campaigns")
def get_campaigns():
    return load_campaigns()

@app.get("/campaigns/{campaign_id}")
def get_campaign(campaign_id: str):
    for c in load_campaigns():
        if c["id"] == campaign_id:
            return c
    raise HTTPException(404, "Campaign not found")

@app.delete("/campaigns/{campaign_id}")
def delete_campaign(campaign_id: str):
    campaigns = [c for c in load_campaigns() if c["id"] != campaign_id]
    save_campaigns(campaigns)
    return {"deleted": campaign_id}

# ── Templates ─────────────────────────────────────────────────────────────────
def load_templates():
    if os.path.exists(TEMPLATES_FILE):
        with open(TEMPLATES_FILE) as f:
            return json.load(f)
    return []

def save_templates(t):
    with open(TEMPLATES_FILE, "w") as f:
        json.dump(t, f, indent=2)

@app.get("/templates")
def get_templates():
    return load_templates()

class Template(BaseModel):
    id: Optional[str] = None
    name: str
    subject: str
    body: str
    category: Optional[str] = "general"   # general|itinerary|promotion|followup|newsletter|whatsapp

@app.post("/templates")
def create_template(t: Template):
    templates = load_templates()
    t.id = str(int(time.time() * 1000))
    templates.append(t.dict())
    save_templates(templates)
    return t

@app.put("/templates/{tid}")
def update_template(tid: str, t: Template):
    templates = load_templates()
    for i, tmpl in enumerate(templates):
        if tmpl.get("id") == tid:
            templates[i] = {**t.dict(), "id": tid}
            save_templates(templates)
            return templates[i]
    raise HTTPException(404, "Template not found")

@app.delete("/templates/{tid}")
def delete_template(tid: str):
    save_templates([t for t in load_templates() if t.get("id") != tid])
    return {"deleted": tid}

# ── DMC: Unsubscribe link handling ────────────────────────────────────────────
UNSUB_FILE = "unsubscribed.json"

def load_unsub():
    if os.path.exists(UNSUB_FILE):
        with open(UNSUB_FILE) as f:
            return set(json.load(f))
    return set()

@app.get("/unsubscribe/{token}")
def unsubscribe(token: str):
    try:
        email = base64.urlsafe_b64decode(token.encode()).decode()
    except Exception:
        raise HTTPException(400, "Invalid unsubscribe link")
    unsub = load_unsub()
    unsub.add(email)
    with open(UNSUB_FILE, "w") as f:
        json.dump(list(unsub), f)
    return {"message": f"{email} has been unsubscribed successfully."}

@app.get("/unsubscribed")
def get_unsubscribed():
    return list(load_unsub())

# ── DMC: WhatsApp message builder (text only, no API needed) ─────────────────
class WhatsAppPayload(BaseModel):
    template: str
    contacts: List[dict]

@app.post("/whatsapp/preview")
def whatsapp_preview(payload: WhatsAppPayload):
    previews = []
    for c in payload.contacts[:5]:
        msg = personalize(payload.template, c)
        phone = c.get("phone", "")
        previews.append({"phone": phone, "name": c.get("name",""), "message": msg,
                         "whatsapp_link": f"https://wa.me/{re.sub(r'[^0-9]','',phone)}?text={msg[:100].replace(' ','%20')}" if phone else ""})
    return previews