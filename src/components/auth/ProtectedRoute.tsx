import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import type { UserRole } from '@/types/models.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = '/login',
}) => {
  const { user, isAuthenticated } = useAuthStore();
  
  // Check if authenticated
  const isAuth = typeof isAuthenticated === 'function' ? isAuthenticated() : Boolean(isAuthenticated);
  
  if (!isAuth) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check role if specified
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role?.toLowerCase();
    const hasAccess = allowedRoles.some(role => role.toLowerCase() === userRole);
    
    if (!hasAccess) {
      // Redirect to appropriate page based on current role
      switch (userRole) {
        case 'admin':
          return <Navigate to="/admin" replace />;
        case 'staff':
          return <Navigate to="/staff" replace />;
        case 'user':
        default:
          return <Navigate to="/" replace />;
      }
    }
  }

  return <>{children}</>;
};
