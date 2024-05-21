import axios from 'axios';
import { getCookies } from './cookieToken';

// instantiate axios
const http = axios.create({
  // baseURL: 'https://ht7qu8h638.execute-api.us-west-2.amazonaws.com/omni-dev',
  baseURL: import.meta.env.APP_URL_API,
  timeout: 10000,
});

// request interceptor
http.interceptors.request.use(
  (config) => {
    const token = getCookies('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// response interceptor
http.interceptors.response.use(
  // status code 200
  (response) => response,
  // status code not equal to 200
  (error) => Promise.reject(error)
);

export { http };
