import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type ProtectedRouteProps = {
  children: ReactNode;
  requireAdmin?: boolean;
};

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, profile, loading, profileLoading, profileError } = useAuth();

  if (loading || (requireAdmin && user && profileLoading)) {
    return <main className="page-loading" role="status">Checking your account…</main>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && (profileError || profile?.role !== 'admin')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
