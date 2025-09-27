// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://simon-says-game-ss1b.onrender.com',
});

export default API;
