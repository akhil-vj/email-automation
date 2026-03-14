# MailFlow — Gmail Email Automation 
**Free, open-source, sends from your real Gmail = no spam box.**

---

## 🚀 Deploy to Cloud (Render + Netlify)

### **Quick Setup: Change Backend URL (1 Line)**

Edit `frontend/src/config.js`:
```javascript
const API_URL = "http://localhost:8000"; // ← Change this to your backend URL
```

**Local:** `http://localhost:8000`
**Production:** `https://your-backend.onrender.com`

---

### **Step 1: Backend Setup (Render)**

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click **New +** → **Web Service**
3. Connect your GitHub repo (`email-automation`)
4. Fill form:
   - **Name:** `mailflow-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Click **Create Web Service** and wait for deployment
6. Copy your backend URL (e.g., `https://mailflow-backend.onrender.com`)

### **Step 2: Configure Backend Environment (Render)**

On Render dashboard → your service → **Environment** tab:

| Variable | Value |
|----------|-------|
| `BACKEND_URL` | `https://mailflow-backend.onrender.com` |
| `FRONTEND_URL` | `https://your-app.netlify.app` (add after Step 4) |

### **Step 3: Frontend Setup (Netlify)**

1. Go to [netlify.com](https://netlify.com) and sign in with GitHub
2. Click **Add new site** → **Import an existing project**
3. Select your GitHub repo
4. Fill form:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
5. Click **Deploy site** and wait
6. Copy your frontend URL (e.g., `https://your-app.netlify.app`)

### **Step 4: Update Frontend API URL**

Edit `frontend/src/config.js`:
```javascript
const API_URL = "https://your-backend.onrender.com"; // Your Render backend URL
```

**Then:**
1. Commit & push to GitHub
2. Netlify auto-deploys
3. Done!

### **Step 5: Update Render Backend with Frontend URL**

Go back to Render → your backend service → **Environment**:
- Add `FRONTEND_URL` = `https://your-app.netlify.app`
- Save and Render auto-redeploys

### **Step 6: Update OAuth Redirect in Google Cloud**

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Update **Authorized redirect URIs**:
   - Add: `https://your-backend.onrender.com/auth/callback`
   - Remove: `http://localhost:8000/auth/callback`
5. Save

---

### **Done!** 🎉

| Service | Local | Production |
|---------|-------|------------|
| **Backend** | `http://localhost:8000` | `https://your-backend.onrender.com` |
| **Frontend** | `http://localhost:3000` | `https://your-app.netlify.app` |
| **Config Location** | `frontend/src/config.js` | `frontend/src/config.js` |

---

## 📋 Local Development

### Quick Start (Any OS)

```bash
# Terminal 1: Backend (Python 3.8+)
cd backend
pip install -r requirements.txt
uvicorn main:app --reload  # Runs on http://localhost:8000

# Terminal 2: Frontend (Node 14+)
cd frontend
npm install
npm start  # Runs on http://localhost:3000
```

### Configuration

Create `frontend/.env.local`:
```
REACT_APP_API_URL=http://localhost:8000
```

---

## How It Works
- Uses **Gmail API** (OAuth2) — emails are sent from your real Gmail account
- Because emails come from your actual Gmail, they land in **inbox, not spam**
- Supports **bulk sending**, **personalization** ({{name}}, {{company}}), and **templates**
- Upload any CSV, send to hundreds of contacts with one click
- **Open tracking** — see who opened your emails
- **Reply detection** — tracks bounces and replies automatically

---

## Full Setup (One-Time, ~15 minutes)

### 1️⃣ Get Gmail API Credentials

1. Go to https://console.cloud.google.com
2. Create a **New Project** → name it "MailFlow"
3. Enable **Gmail API**:
   - Menu → **APIs & Services → Enable APIs**
   - Search "Gmail API" → Enable
4. Create **OAuth Consent Screen**:
   - Menu → **APIs & Services → OAuth consent screen**
   - Choose **External**, fill app name "MailFlow" and your email
   - Add scope: `https://www.googleapis.com/auth/gmail.send`
   - Add your Gmail as a **Test user**
5. Create **OAuth 2.0 Credentials**:
   - Menu → **Credentials → Create Credentials → OAuth 2.0 Client ID**
   - Type: **Web application**
   - Authorized redirect URIs: 
     - For local: `http://localhost:8000/auth/callback`
     - For production: `https://your-backend.onrender.com/auth/callback`
   - Download JSON file

### 2️⃣ Upload Credentials (Frontend)

1. Open your app (local or cloud)
2. Click **Settings** tab → **Upload credentials.json**
3. Select the JSON file you downloaded → Upload
4. App automatically validates and saves it

### 3️⃣ Connect Gmail

1. Click **Settings** tab → **Connect Gmail**
2. Sign in with your Gmail → Allow permissions
3. You'll see "● Connected" badge when done

---

## Using the App

## 📧 Sending Campaigns

**Step 1: Load Contacts**
- Go to **Contacts** tab
- Upload CSV with columns: `email, name, company, segment` (any extra columns work for personalization)
- Example:
  ```
  email,name,company,segment,destination
  alice@acme.com,Alice,Acme,Corporate,Maldives
  bob@startup.io,Bob,StartupIO,Adventure,Dubai
  ```

**Step 2: Compose Email**
- Click **Compose** tab
- Write subject and body
- Use personalization tags like `{{name}}`, `{{company}}`, `{{destination}}`
- Add attachments if needed (PDFs, images)
- Configure:
  - Campaign name & type
  - Segment filter (optional)
  - Enable tracking (recommended)
  - Delay between sends (default 2s)

**Step 3: Send**
- Click big **Send** button
- Watch real-time progress with status badges
- See delivery rate, failures, and skipped emails

**Step 4: Track Results**
- Go to **History** tab to see all campaigns
- Click a campaign to see:
  - Delivery rate
  - Open rate (if tracking enabled)
  - Reply detection
  - Bounce detection
  - Full recipient list with status

---

## 🎯 Features

| Feature | Details |
|---------|---------|
| **Personalization** | `{{name}}`, `{{company}}`, `{{email}}`, any CSV column |
| **Templates** | Save emails as reusable templates |
| **Open Tracking** | 1×1 pixel tracks who opens emails |
| **Reply Detection** | Scans inbox for replies & bounces |
| **Follow-up Sequences** | Automatic follow-up after N days |
| **WhatsApp Preview** | Preview as WhatsApp messages |
| **Segment Filtering** | Send to specific contact groups |
| **Rate Limiting** | Respects Gmail's 500/day free limit |
| **Duplicate Filtering** | Don't resend to same contact |
| **Unsubscribe Links** | Track opt-outs |
| **Campaign History** | Full analytics for every campaign |
| **Attachments** | Send PDFs, images, etc. with emails |

---

## 🔐 Backend API Endpoints

All endpoints are at your backend URL (local or Render)

### Authentication
- `GET /auth/status` — Check if Gmail connected
- `GET /auth/login` — Start OAuth flow
- `GET /auth/callback` — OAuth callback (auto)
- `POST /auth/credentials/upload` — Upload credentials.json

### Sending
- `POST /emails/send` — Send campaign
- `POST /emails/followup` — Setup follow-ups
- `GET /emails/followup/due` — Get due follow-ups

### Data Management
- `POST /contacts/upload` — Upload CSV
- `GET /campaigns` — List campaigns
- `DELETE /campaigns/{id}` — Delete campaign
- `GET /templates` — List templates
- `POST /templates` — Create template
- `PUT /templates/{id}` — Update template
- `DELETE /templates/{id}` — Delete template

### Tracking
- `GET /track/open/{token}` — Track email opens
- `GET /track/stats/{id}` — Get open rates
- `GET /campaigns/{id}/replies` — Check for replies
- `GET /rate-limit/status` — Rate limit status

---

## 📋 Tips for Best Results

1. **Email Warm-up** — Start with 50–100 emails/day, increase gradually
2. **Personalize** — Always include `{{name}}` at minimum
3. **Timing** — Use 2–3 second delays between sends
4. **List Quality** — Remove bounced/unsubscribed emails
5. **Subject Line** — Keep under 50 characters for mobile
6. **Avoid Spam Triggers** — No ALL CAPS, "urgent", "free money", etc.
7. **Monitor Reputation** — Check Gmail's "Send feedback" for spam reports
8. **Follow-ups** — Send 2–3 follow-ups 3, 7, and 14 days later

---

## 🛠️ Troubleshooting

### Backend on Render won't stay awake
- Upgrade from Free tier OR use a keep-alive service
- Render free tier spins down after 15 minutes of inactivity

### Frontend can't connect to backend
- Check `REACT_APP_API_URL` environment variable is set correctly
- Ensure backend is deployed and running
- Check browser console (F12) for CORS errors

### "Gmail not connected" error
- Ensure credentials.json was uploaded successfully
- Try clicking "Connect Gmail" → sign in again
- Check Gmail account has API enabled

### Emails not sending
- Verify Gmail is connected (check Settings tab)
- Check rate limit status in the UI
- Enable open tracking (helps track delivery)

---

## 📁 File Structure

```
email-automation/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── requirements.txt      # Python 3.8+ dependencies
│   ├── credentials.json      # Google OAuth credentials (uploaded via UI)
│   ├── token.pickle          # Gmail session token (auto-created)
│   ├── campaigns.json        # Campaign history
│   ├── templates.json        # Saved email templates
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main React UI
│   │   ├── App.css           # Styles
│   │   └── index.js          # Entry point
│   ├── package.json
│   └── .env.local            # Local environment config
├── Readme.md                 # This file
└── .gitignore                # Git ignore rules
```

---

## 📄 License
MIT — Use freely, modify, share. No warranty.