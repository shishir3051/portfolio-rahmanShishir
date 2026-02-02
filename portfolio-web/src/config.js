export const getApiUrl = () => {
  // Hardcoded production URL as primary fallback to ensure it works on Vercel
  const PRODUCTION_URL = "https://portfolio-rahmanshishir.onrender.com";
  
  // If we are in development (localhost), use localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
     return import.meta.env.VITE_API_URL || "http://localhost:4000";
  }
  
  // Otherwise use the hardcoded production URL
  return PRODUCTION_URL;
};

export const API_BASE = getApiUrl();
