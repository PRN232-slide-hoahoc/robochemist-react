import { axiosInstance } from '../api/axios.config';
import { ApiResponse } from '@/types/api.types';
import { LoginCredentials, RegisterData, AuthResponse } from '@/types/models.types';
import { endpoints } from '../api/endpoints';
import { STORAGE_KEYS } from '@/utils/constants/config';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      endpoints.auth.login,
      credentials
    );
    const authData = response.data.data;
    
    // Save token to localStorage
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authData.token);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(authData.user));
    
    return authData;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      endpoints.auth.register,
      data
    );
    const authData = response.data.data;
    
    // Save token to localStorage
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authData.token);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(authData.user));
    
    return authData;
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  getCurrentUser(): string | null {
    return localStorage.getItem(STORAGE_KEYS.USER_DATA);
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();

