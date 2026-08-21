import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

export const api = axios.create({
  baseURL: 'https://dummyjson.com',
});

// Request Interceptor: Attach Token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle 401 & Silent Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = useAuthStore.getState().refreshToken;
      if (!refreshToken) {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh the token
        const res = await axios.post('https://dummyjson.com/auth/refresh', {
          refreshToken,
          expiresInMins: 30,
        });

        const newAccessToken = res.data.token;
        const newRefreshToken = res.data.refreshToken;
        
        // Update the store
        useAuthStore.getState().setAccessToken(newAccessToken);
        if (newRefreshToken) {
          useAuthStore.setState({ refreshToken: newRefreshToken });
        }

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
