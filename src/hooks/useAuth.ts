import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth/authService';
import { LoginCredentials, RegisterData } from '@/types/models.types';

/**
 * Custom hook for authentication
 */
export const useAuth = () => {
  const { user, token, isAuthenticated, login: setLogin, logout: setLogout } = useAuthStore();

  const login = async (credentials: LoginCredentials) => {
    const authData = await authService.login(credentials);
    setLogin(authData.user, authData.token);
    return authData;
  };

  const register = async (data: RegisterData) => {
    const authData = await authService.register(data);
    setLogin(authData.user, authData.token);
    return authData;
  };

  const logout = () => {
    authService.logout();
    setLogout();
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
  };
};

