import axios, { AxiosError } from 'axios';
import { ApiError } from '../utils/errors';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response) {
      throw new ApiError(
        error.response.data.error?.message || 'API request failed',
        error.response.data.error?.code || 'API_ERROR',
        error.response.status
      );
    }
    throw new ApiError('Network error', 'NETWORK_ERROR', 500);
  }
);

export default api;