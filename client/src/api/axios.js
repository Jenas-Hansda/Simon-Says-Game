import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // update for production
});

export default instance;
