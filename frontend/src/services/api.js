import axios from 'axios';

const api = axios.create({
<<<<<<< HEAD
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Helper function to resolve absolute asset URLs in local and production environments
export const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  
  const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  // Remove the trailing /api to get the base backend URL
  const serverURL = apiURL.endsWith('/api') ? apiURL.slice(0, -4) : apiURL;
  
  return `${serverURL}${path.startsWith('/') ? '' : '/'}${path}`;
};

=======
  baseURL: import.meta.env.VITE_API_URL || 'https://internshub-06.up.railway.app/api/',
});

>>>>>>> 5ad54ac356437c46391d42f18547dd0a7250531b
// Interceptor to automatically add Bearer token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle global errors (e.g. 401 unauthenticated)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register') && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
