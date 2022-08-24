import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://172.23.241.209:3000/api',
});
