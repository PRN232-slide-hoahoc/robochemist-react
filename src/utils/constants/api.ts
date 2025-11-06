/**
 * API endpoints - Mapped to API Gateway routes
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/v1/User/login',
    REGISTER: '/auth/v1/User/register',
    ME: '/auth/v1/User/me',
    VALIDATE_TOKEN: '/auth/v1/User/validate-token',
    PUBLIC: '/auth/v1/User/public',
    PROTECTED: '/auth/v1/User/protected',
  },
  USERS: {
    BASE: '/auth/v1/User',
    BY_ID: (id: string) => `/auth/v1/User/${id}`,
  },
  TEMPLATES: {
    BASE: '/template/template',
    BY_ID: (id: string) => `/template/template/${id}`,
    UPLOAD: '/template/template/upload',
    DOWNLOAD: (id: string) => `/template/template/${id}/download`,
  },
  SLIDES: {
    BASE: '/slides',
  },
  WALLET: {
    BASE: '/wallet',
  },
  EXAM: {
    BASE: '/exam',
  },
} as const;

/**
 * API configuration - Point to API Gateway
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:5001',
  TIMEOUT: 30000, // Increased timeout for file uploads
} as const;

