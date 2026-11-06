import axios from 'axios';

// All React pages send requests through this Axios instance.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('a3_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Cannot connect to the server.';

    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/')) {
      localStorage.removeItem('a3_token');
      localStorage.removeItem('a3_user');
      window.dispatchEvent(new Event('a3-session-expired'));
    }

    return Promise.reject(new Error(message));
  }
);

export function saveSession(authData) {
  localStorage.setItem('a3_token', authData.token);
  localStorage.setItem('a3_user', JSON.stringify(authData));
}

export function getSavedUser() {
  try {
    return JSON.parse(localStorage.getItem('a3_user') || 'null');
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem('a3_token');
  localStorage.removeItem('a3_user');
}

export default api;
