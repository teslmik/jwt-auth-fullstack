import axios from "axios";
import { ApiUrl } from "../enums/api-url.enum";

const $api = axios.create({
  withCredentials: true,
  baseURL: ApiUrl.API_URL
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;

  return config;
});

export default $api;
