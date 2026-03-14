# MailFlow — Gmail Email Automation 
**Free, open-source, sends from your real Gmail = no spam box.**

---

## How It Works
- Uses **Gmail API** (OAuth2) — emails are sent from her real Gmail account
- Because emails come from her actual Gmail, they land in **inbox, not spam**
- Supports **bulk sending**, **personalization** ({{name}}, {{company}}), and **templates**
- Upload any CSV, send to hundreds of contacts with one click

---

## Setup (One-Time, ~15 minutes)

### Step 1 — Get a free Gmail API credential

1. Go to https://console.cloud.google.com
2. Click **"New Project"** → name it "MailFlow" → Create
3. Left menu: **APIs & Services → Enable APIs** → search **"Gmail API"** → Enable
4. Left menu: **APIs & Services → OAuth consent screen**
   - Choose **External**, fill in App name "MailFlow", your email, save
   - Add scope: `https://www.googleapis.com/auth/gmail.send`
   - Add your Gmail as a **Test user**
5. Left menu: **Credentials → Create Credentials → OAuth 2.0 Client ID**
   - App type: **Web application**
   - Authorized redirect URIs: `http://localhost:8000/auth/callback`
   - Download the JSON → rename it `credentials.json`
6. Copy `credentials.json` into the `backend/` folder

---

### Step 2 — Run the Backend (Python)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
Backend runs at http://localhost:8000

---

### Step 3 — Run the Frontend (React)

```bash
cd frontend
npm install
npm run dev
```
Frontend runs at http://localhost:5173

---

### Step 4 — Connect Gmail

1. Open http://localhost:5173 in browser
2. Click **"Connect Gmail"** in the sidebar
3. Sign in with her work Gmail → Allow permissions
4. Done! You'll see "● Connected" in the sidebar

---

## Using the App

### Sending Emails

1. **Contacts tab** → Upload a CSV file with columns: `email, name, company` (any extra columns can be used for personalization)
2. **Compose tab** → Write subject + body. Use `{{name}}`, `{{company}}`, `{{email}}` etc. to personalize
3. Click **Send** → watches progress → check Results tab

### CSV Format Example
```
email,name,company,role
alice@acme.com,Alice,Acme Corp,CEO
bob@startup.io,Bob,StartupIO,CTO
```

### Personalization Tags
In subject or body, use:
- `{{name}}` → Contact's name
- `{{company}}` → Company name
- `{{email}}` → Their email
- `{{role}}` → Any column from your CSV!

### Templates
- Compose an email → click "Save as Template"
- Reuse it anytime from the Templates tab

---

## Tips for Good Inbox Delivery

1. **Keep delay at 2+ seconds** — prevents Gmail rate limiting
2. **Send < 500/day** — Gmail's free limit
3. **Personalize** — personalized emails get fewer spam reports
4. **Clean your list** — remove invalid/old emails to keep your sender reputation healthy
5. **Don't use spammy words** — avoid ALL CAPS, excessive exclamation marks!!!, "Free money"

---

## File Structure
```
email-automation/
  backend/
    main.py          ← FastAPI server
    requirements.txt ← Python dependencies
    credentials.json ← (you add this) Google OAuth credentials
    token.pickle     ← (auto-created) Gmail auth token
    templates.json   ← (auto-created) saved templates
  frontend/
    src/
      App.jsx        ← React UI
    package.json
```