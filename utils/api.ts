import axios from 'axios';

// Replace with your laptop's IP address found via 'hostname -I'
// const BASE_URL = 'http://localhost:8080/api/palate';
const BASE_URL = 'https://palate-backend.onrender.com/api/palate';
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});