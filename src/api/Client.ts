import axios from 'axios';

// const BASE_URL = 'http://192.168.100.3:5161';
const BASE_URL = 'https://api.foxtales.cc'; // PROD

const BASE_URL_API = `${BASE_URL}/api`;
export const BASE_URL_PSYCH = `${BASE_URL}/psychhub`;

export const apiClient = axios.create({
  baseURL: BASE_URL_API,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default apiClient;
