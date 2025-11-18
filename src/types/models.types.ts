/**
 * User model
 */
export interface User {
  id: string;
  fullname: string;
  email: string;
  phone?: string;
  role?: UserRole;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserRole = 'admin' | 'staff' | 'user' | 'guest';
export type UserId = string;

/**
 * Auth models - Match backend DTOs
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullname: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  userId: string;
  fullname: string;
  email: string;
  token: string;
  expiresAt: string;
}

/**
 * User DTOs
 */
export interface CreateUserDto {
  fullname: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UpdateUserDto {
  fullname?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export type UserWithoutPassword = Omit<User, 'password'>;
export type UserBasicInfo = Pick<User, 'id' | 'fullname' | 'email'>;

