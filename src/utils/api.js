import axios from 'axios';

// Get the backend API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Remove trailing slash if present
const cleanApiUrl = API_URL.replace(/\/$/, '');

// Check if API_URL is a full URL (starts with http:// or https://)
const isFullUrl = cleanApiUrl.startsWith('http://') || cleanApiUrl.startsWith('https://');

// If a full URL is provided, use it directly. Otherwise, use static '/api' path with proxy
const API_BASE_URL = isFullUrl ? cleanApiUrl : '/api';

// Debug logging
console.log('🔧 API Configuration:', {
  API_URL: cleanApiUrl,
  API_BASE_URL,
  isFullUrl
});

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
  return `${cleanApiUrl}/${imagePath}`;
};

// Request interceptor - Add token and log requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Log the full URL being called (for debugging)
  const fullUrl = config.baseURL + config.url;
  console.log('API Request:', {
    method: config.method?.toUpperCase(),
    url: fullUrl,
    baseURL: config.baseURL,
    path: config.url
  });
  
  return config;
}, (error) => {
  console.error('API Request Error:', error);
  return Promise.reject(error);
});

// Response interceptor - Log errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      message: error.message,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullURL: error.config?.baseURL + error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default api;

