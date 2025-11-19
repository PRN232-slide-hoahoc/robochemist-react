/**
 * Application routes
 */
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  WALLET: '/wallet',
  PAYMENT_CALLBACK: '/payment/callback',
  SLIDES: '/slides',
  TEMPLATES: '/templates',
  ORDERS: '/orders',
  EXAMS: '/exams',
  STAFF: '/staff',
  ADMIN: '/admin',
  NOT_FOUND: '/404',
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type RouteValues = (typeof ROUTES)[RouteKeys];

