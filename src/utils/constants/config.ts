/**
 * Application configuration
 */
export const APP_CONFIG = {
  NAME: 'RoboChemist',
  VERSION: '1.0.0',
  DESCRIPTION: 'RoboChemist Application',
  LOCALE: 'vi-VN',
} as const;

/**
 * Pagination configuration
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

/**
 * reCAPTCHA configuration
 */
export const RECAPTCHA_CONFIG = {
  SITE_KEY: import.meta.env.VITE_RECAPTCHA_SITE_KEY || '',
  // Test key for localhost (always passes)
  // Production: Get your own key from https://www.google.com/recaptcha/admin
} as const;

