import axios from 'axios';

// Get the backend API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// In production, use the full backend URL. In development, use /api with proxy
const isDevelopment = import.meta.env.DEV;
const API_BASE_URL = isDevelopment 
  ? (import.meta.env.VITE_API_BASE_PATH || '/api')
  : API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Export API URL for image URLs
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_URL}/${imagePath}`;
};

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

