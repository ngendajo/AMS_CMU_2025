import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api'

export const axiosPrivate = axios.create({
    baseURL: BASE_URL
});

export default axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: { 'Content-Type': 'application/json'},
    withCredentials:true
});