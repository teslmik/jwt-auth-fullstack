import axios from 'axios';

import { AuthResponce } from '../types/types';

const ApiUrl = import.meta.env.VITE_APP_API_URL as string;

const api = axios.create({
  baseURL: ApiUrl,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;

  return config;
});

api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status == 401 && error.config && !error.config._isRetry) {
      originalRequest._isRetry = true;
      try {
        const response = await axios.get<AuthResponce>(`${ApiUrl}/refresh`, { withCredentials: true });
        localStorage.setItem('token', response.data.accessToken);
        return api.request(originalRequest);
      } catch (error) {
        console.log('error: ', error);
      }
    }
    throw error;
  },
);

export default api;
