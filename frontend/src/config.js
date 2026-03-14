// MailFlow Configuration
// Automatically determines API_URL based on environment

let API_URL;

if (process.env.NODE_ENV === 'production') {
  // Production: Use backend deployed on Render or your server
  // Change to your actual backend URL after deployment
  API_URL = process.env.REACT_APP_API_URL || "https://your-backend.onrender.com";
} else {
  // Development: Use localhost
  API_URL = "http://localhost:8000";
}

const config = { API_URL };
export default config;
