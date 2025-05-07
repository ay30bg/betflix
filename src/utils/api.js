import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const { getAccessTokenSilently } = await import('@auth0/auth0-react').then(
    (module) => module.useAuth0()
  );
  try {
    const token = await getAccessTokenSilently();
    config.headers.Authorization = `Bearer ${token}`;
  } catch (err) {
    console.error('Failed to get token:', err);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;