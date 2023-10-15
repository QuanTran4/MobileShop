import axios from "axios";
import { useSelector } from "react-redux";

const BASE_URL = "/api";
const TOKEN = JSON.parse(localStorage.getItem('user'))?.accessToken || null;
export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { token: `Bearer ${TOKEN}` },
});
