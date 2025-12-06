export const INITIAL_VIEW_STATE = {
  longitude: 105.854444,
  latitude: 21.027778,
  zoom: 12,
  pitch: 45,
  bearing: 0,
};

// Ensure you have NEXT_PUBLIC_API_BASE_URL in your .env.local file
// Example: NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const MAP_DATA_ENDPOINT = `${API_BASE_URL}/api/v1/test`;
