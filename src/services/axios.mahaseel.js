import axios from 'axios';

const axiosApiInstance = axios.create({
  // baseURL: "https://us-central1-takweed-eg.cloudfunctions.net",
  baseURL: process.env.REACT_APP_BASE_URL_MAHASEEL,
  // baseURL: 'http://197.49.51.241',
  // baseURL: 'http://localhost:3002',
});
// console.log(process.env.BASE_URL);
// Request interceptor for API calls
axiosApiInstance.interceptors.request.use(
  async (config) => {
    // const value = await redisClient.get(rediskey)

    const token = localStorage.getItem('token');
    // const keys = JSON.parse(value)
    config.headers = {
      ...config.headers,
      Accept: 'application/json',
    };
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// Response interceptor for API calls
axiosApiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      window.location.replace('/login');
      // sessionStorage.clear();
      // localStorage.removeItem('user');
      // localStorage.removeItem('token');
      // localStorage.removeItem('_r');
    }
    return Promise.reject(error);
  }
);

export default axiosApiInstance;
