import axios from 'axios';

// Fallback to localhost if the variable is missing to prevent the app from crashing
const baseURL = import.meta.env?.VITE_API_URL ?? "http://localhost:8080/api/palate";

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});