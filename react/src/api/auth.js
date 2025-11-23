import axiosInstance from './axios';
import './axiosInterceptors';

export async function registerMember({ username, password }) {
  const response = await axiosInstance.post('/api/register/', {
    username,
    password,
  });
  return response.data;
}

export async function loginMember({ username, password }) {
  const response = await axiosInstance.post('/api/login/', {
    username,
    password,
  });
  return response.data;
}

export async function fetchProfile() {
  const response = await axiosInstance.get('/api/profile/');
  return response.data;
}
