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
      
      // Get full user info including role from backend
      const userInfo = await authService.getCurrentUser();
      
      setUser(userInfo);
      
      // Redirect based on role
      const userRole = userInfo.role?.toLowerCase();
      
      switch (userRole) {
        case 'admin':
          navigate('/admin');
          break;
        case 'staff':
          navigate('/staff');
          break;
        case 'user':
        default:
          navigate('/');
          break;
      }
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
  const { setUser, setToken } = useAuthStore();

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      // Perform registration (will also save token/user to localStorage)
      const authData = await authService.register(data);

      // Keep the in-memory auth store in sync so other hooks/components can
      // immediately rely on the token/user (mirrors useLogin behaviour).
      setToken(authData.token);
      setUser({ id: authData.userId, fullname: authData.fullname, email: authData.email });

      // Create wallet for the user. Backend reads the user id from token claims,
      // so no payload is required. Don't block registration on wallet creation
      // failure, but log for debugging.
      try {
        await walletService.createWallet(undefined);
      } catch (walletErr) {
        // eslint-disable-next-line no-console
        console.warn('Wallet creation failed after register:', walletErr);
      }

      // Return success so calling component can decide next step (no auto-login)
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