import axios from 'axios';

const api = axios.create({
  baseURL: 'https://lifestyle-survey.onrender.com/api/surveys',
});

export default api;
