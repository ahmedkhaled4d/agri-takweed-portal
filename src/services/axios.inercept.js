import axios from 'axios';

const axiosApiInstance = axios.create({
  // baseURL: 'https://us-central1-takweed-eg.cloudfunctions.net',
  baseURL: process.env.REACT_APP_BASE_URL,
  // baseURL: 'https://68fd-197-49-238-52.ngrok-free.app/takweed-eg/us-central1',
  // baseURL: 'https://0c2a-197-49-4-228.ngrok-free.app/takweed-eg/us-central1',

  // baseURL: 'http://localhost:3002',
});
// console.log(process.env.REACT_APP_BASE_URL);
// Request interceptor for API calls
axiosApiInstance.interceptors.request.use(
  async (config) => {
    // const value = await redisClient.get(rediskey)

    const token = localStorage.getItem('token');
    // const keys = JSON.parse(value)
    config.headers = {
      ...config.headers,
      Accept: 'application/json',
      // 'ngrok-skip-browser-warning': true,
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
    if (error.response?.status === 401 && !originalRequest._retry) {
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
