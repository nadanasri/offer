import axios from 'axios';

export const API = axios.create({
  baseURL: 'http://localhost:3004', // Base server URL
});

export default API;
