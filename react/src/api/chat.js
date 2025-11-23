import axiosInstance from './axios';
import './axiosInterceptors';

export async function fetchMessages({ limit } = {}) {
  const config = {};

  if (typeof limit !== 'undefined') {
    config.params = { limit };
  }

  const response = await axiosInstance.get('/api/messages/', config);
  return response.data;
}

export async function sendMessage({ text }) {
  const response = await axiosInstance.post('/api/messages/', {
    text,
  });
  return response.data;
}
