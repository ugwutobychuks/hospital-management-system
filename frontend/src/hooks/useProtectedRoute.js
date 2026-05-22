import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const useProtectedRoute = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated || !token) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, token, navigate]);

  return { isAuthenticated, token };
};