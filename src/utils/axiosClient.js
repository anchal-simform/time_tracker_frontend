import axios from 'axios';
import { BASE_URL, COOKIE_KEYS } from '../constants';
import { getCookie } from './cookieManager';

const axiosClient = axios.create({
  baseURL: BASE_URL
});

// ERROR COLLECTOR V1
const parseErrorCode = (error) => {
  if (error.response) {
    if (error.response?.status === 401) {
      // Redirect to login
    }
  }
  return Promise.reject(error.response ?? error);
};

const axiosRequestInterceptor = (config) => {
  const TOKEN = getCookie(COOKIE_KEYS.token);
  if (TOKEN) {
    config.headers = {
      Authorization: `Bearer ${TOKEN}`
    };
  }
  return config;
};

axiosClient.interceptors.request.use(axiosRequestInterceptor, (error) => {
  console.error('[REQUEST_ERROR]', error);
  return Promise.reject(error);
});

// Response parsing interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return parseErrorCode(error);
  }
);

export default axiosClient;
