import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth/authService';
import { LoginCredentials, RegisterData } from '@/types/models.types';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const data = await authService.login(credentials);
      setToken(data.token);
      setUser({ userId: data.userId, fullname: data.fullname, email: data.email });
      navigate('/dashboard');
    } catch (err: any) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  return { login, isLoading };
};

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      await authService.register(data);
      // Không auto login, chỉ return success để component xử lý
      return { success: true };
    } catch (err: any) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  return { register, isLoading };
};

export const useLogout = () => {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();
  return () => {
    authService.logout();
    clearAuth();
    navigate('/login');
  };
};

export const useAuth = () => {
  const { user, token, isAuthenticated } = useAuthStore();
  return { user, token, isAuthenticated: isAuthenticated() };
};