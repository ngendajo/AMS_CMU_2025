import axios from 'axios';
import baseUrl from './baseUrl';

alert(baseUrl)

export const axiosPrivate = axios.create({
    baseURL: baseUrl
});

export default axios.create({
    baseURL: baseUrl,
    headers: { 'Content-Type': 'application/json'},
    withCredentials:true
});