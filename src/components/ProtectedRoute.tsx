
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  allowedRoles?: ('admin' | 'client')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  allowedRoles = []
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    // You could return a loading spinner here
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if the route requires admin privileges
  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/acesso-negado" replace />;
  }

  // Check if the user's role is in the list of allowed roles (if provided)
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
