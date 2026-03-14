"""
Configuration file for Email Automation Backend
Manages environment variables and URL configuration for local dev and cloud deployment
"""
import os

# ─── Backend Configuration ────────────────────────────────────────────────────
# Backend URL for OAuth callbacks and tracking pixels
# Default: http://localhost:8000 (local dev)
# Production: https://your-backend.onrender.com
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
OAUTH_CALLBACK_URL = f"{BACKEND_URL}/auth/callback"

# ─── Frontend Configuration ───────────────────────────────────────────────────
# Frontend URL for CORS configuration
# Add your Netlify or frontend deployment URLs here
DEFAULT_FRONTEND_URLS = [
    "http://localhost:3000",      # React local dev
    "http://localhost:5173",      # Vite local dev
]

# Get frontend URL from environment (for production)
FRONTEND_URL = os.getenv("FRONTEND_URL", "")

# ─── Allowed Origins (CORS) ───────────────────────────────────────────────────
ALLOWED_ORIGINS = [
    "http://localhost:3000",      # React local dev
    "http://localhost:5173",      # Vite local dev
    "http://localhost:8000",      # Backend local (for testing)
    "https://qcemailautomation.netlify.app",  # Production frontend
]

# Add frontend URL if set in environment
if FRONTEND_URL:
    ALLOWED_ORIGINS.append(FRONTEND_URL)

# Add any additional frontend URLs from env (comma-separated)
extra_origins = os.getenv("EXTRA_ORIGINS", "")
if extra_origins:
    ALLOWED_ORIGINS.extend([url.strip() for url in extra_origins.split(",")])

# Remove duplicates while preserving order
ALLOWED_ORIGINS = list(dict.fromkeys(ALLOWED_ORIGINS))

# ─── Gmail Configuration ──────────────────────────────────────────────────────
GMAIL_RATE_LIMIT_HOURLY = int(os.getenv("GMAIL_RATE_LIMIT_HOURLY", "400"))

# ─── Debug Mode ───────────────────────────────────────────────────────────────
DEBUG = os.getenv("DEBUG", "false").lower() == "true"

# ─── File Paths ───────────────────────────────────────────────────────────────
DATA_FOLDER = os.getenv("DATA_FOLDER", ".")
TOKEN_FILE = os.path.join(DATA_FOLDER, "token.pickle")
CREDENTIALS_FILE = os.path.join(DATA_FOLDER, "credentials.json")
CAMPAIGNS_FILE = os.path.join(DATA_FOLDER, "campaigns.json")
TEMPLATES_FILE = os.path.join(DATA_FOLDER, "templates.json")
SENT_HASHES_FILE = os.path.join(DATA_FOLDER, "sent_hashes.json")
TRACKING_FILE = os.path.join(DATA_FOLDER, "tracking.json")

# ─── Email Configuration ──────────────────────────────────────────────────────
GMAIL_SCOPES = [
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.modify",
]

# ─── Display Configuration ────────────────────────────────────────────────────
if DEBUG:
    print(f"[CONFIG] Backend URL: {BACKEND_URL}")
    print(f"[CONFIG] Frontend URL: {FRONTEND_URL or 'Not set (using defaults)'}")
    print(f"[CONFIG] Allowed Origins: {ALLOWED_ORIGINS}")
