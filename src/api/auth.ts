import axios from 'axios';

export const loginApi = async (username: string, password: string) => {
  const response = await axios.post('https://dummyjson.com/auth/login', {
    username,
    password,
    expiresInMins: 30, 
  });
  return response.data;
};

export const refreshApi = async (refreshToken: string) => {
  const response = await axios.post('https://dummyjson.com/auth/refresh', {
    refreshToken,
    expiresInMins: 30,
  });
  return response.data;
};
