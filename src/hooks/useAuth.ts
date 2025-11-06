import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth/authService';
import { LoginCredentials, RegisterData } from '@/types/models.types';
import { walletService } from '@/services/wallet/walletService';
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
      setUser({ id: data.userId, fullname: data.fullname, email: data.email });
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
      const authData = await authService.register(data);

      // After registration, the authService saves token/user to localStorage.
      // Use the saved token (axiosInstance attaches it) to create a wallet for the user.
      try {
        await walletService.createWallet({ userId: authData.userId });
      } catch (walletErr) {
        // Don't block registration on wallet creation failure, but log it for debugging.
        // Components can show a notice if desired.
        // eslint-disable-next-line no-console
        console.warn('Wallet creation failed after register:', walletErr);
      }

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
  // isAuthenticated is expected to be a function on the store, but persisted state
  // or other issues might overwrite it. Be defensive and handle both cases.
  const authFlag = typeof isAuthenticated === 'function' ? isAuthenticated() : Boolean(isAuthenticated);
  const logout = useLogout();
  return { user, token, isAuthenticated: authFlag, logout };
};