import axios from 'axios';

const API_BASE = 'http://98.84.56.161:3000/api/auth';

const authApi = {
  // Register new user
  register: (userData) => {
    return axios.post(`${API_BASE}/register`, userData);
  },

  // Login user
  login: (email, password) => {
    return axios.post(`${API_BASE}/login`, {
      email,
      password,
    });
  },
};

export default authApi;
