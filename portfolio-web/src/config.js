export const getApiUrl = () => {
  // Use VITE_API_URL if defined (standard for development)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Fallback for local development
  // Removing the trailing /api because components add /api/ themselves
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return "http://localhost:4000";
  }
  
  // Standard relative path for Vercel deployment
  // Returning empty string so the URL starts with /api/...
  return "";
};

export const API_BASE = getApiUrl();
