import axios from 'axios';

// This checks both common naming conventions
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/palate";

export const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});