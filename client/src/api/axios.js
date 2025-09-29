// axios.js

import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000", // fallback for dev
  withCredentials: true, // if using cookies
});

export default instance;
