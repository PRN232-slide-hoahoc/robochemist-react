import { axiosInstance } from '../api/axios.config';
import { ApiResponse } from '@/types/api.types';
import { LoginCredentials, RegisterData, AuthResponse, User } from '@/types/models.types';
import { API_ENDPOINTS } from '@/utils/constants/api';
import { STORAGE_KEYS } from '@/utils/constants/config';

class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    
    const authData = response.data.data;
    
    // Save token and user data to localStorage
    this.saveAuthData(authData);
    
    return authData;
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    
    const authData = response.data.data;
    
    // Save token and user data to localStorage
    this.saveAuthData(authData);
    
    return authData;
  }

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<User> {
    const response = await axiosInstance.get<ApiResponse<User>>(
      API_ENDPOINTS.AUTH.ME
    );
    
    return response.data.data;
  }

  /**
   * Validate token
   */
  async validateToken(): Promise<boolean> {
    try {
      await axiosInstance.get(API_ENDPOINTS.AUTH.VALIDATE_TOKEN);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  /**
   * Get stored user data
   */
  getStoredUser(): User | null {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (!userData) return null;
    
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Save auth data to localStorage
   */
  private saveAuthData(authData: AuthResponse): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authData.token);
    
    // Convert AuthResponse to User object
    const user: User = {
      userId: authData.userId,
      fullname: authData.fullname,
      email: authData.email,
    };
    
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  }
}

export const authService = new AuthService();

