// MailFlow Configuration
// Automatically determines API_URL based on environment

let API_URL;

if (process.env.NODE_ENV === 'production') {
  // Production: Use backend deployed on Render
  API_URL = process.env.REACT_APP_API_URL || "https://email-automation-8lva.onrender.com";
} else {
  // Development: Use localhost
  API_URL = "http://localhost:8000";
}

const config = { API_URL };
export default config;
