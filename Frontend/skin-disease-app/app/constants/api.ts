// constants/api.ts

// Base URL of your local Django backend
export const BASE_URL = "https://freelance-backend-mrtn.onrender.com";

// Django API endpoints
export const DJANGO_API = {
  PREDICT_URL: `${BASE_URL}/api/predict/skin-disease/`,
  API_KEY: "", // keep empty if not used
};

// Dummy default export ONLY to silence Expo Router
// (Remove this if the file is outside `app/`)
export default {};
