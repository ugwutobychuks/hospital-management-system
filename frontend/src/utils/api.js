const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://98.84.56.161:3000';

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    const data = await response.json();
    
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

export const api = {
  login: (email, password) => apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  
  getDoctors: () => apiRequest('/api/v1/doctors'),
  getPatients: () => apiRequest('/api/v1/patients'),
  getAppointments: () => apiRequest('/api/v1/appointments'),
  getMedications: () => apiRequest('/api/v1/medications'),
  health: () => apiRequest('/health'),
};

export default api;
