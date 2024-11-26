import axios from 'axios';

export const Api = axios.create({
  baseURL: 'http://localhost:3004', // Base server URL
});

export default Api;
