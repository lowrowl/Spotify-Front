import axios from 'axios';

const api = axios.create({
  baseURL: 'http://TU_BACKEND_URL/api', // reemplazar con tu URL real
});

export default api;
