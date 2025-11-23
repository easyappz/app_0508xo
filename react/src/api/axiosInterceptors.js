import instance from './axios';

// Attach request interceptor to add Authorization header with bearer token from localStorage
instance.interceptors.request.use(
  (config) => {
    try {
      const token = window.localStorage ? window.localStorage.getItem('authToken') : null;
      if (token) {
        if (!config.headers) {
          config.headers = {};
        }
        config.headers.Authorization = 'Bearer ' + token;
      }
    } catch (e) {
      // If localStorage is not available or any error occurs, proceed without token
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
