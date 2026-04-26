import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Role } from '../types/auth';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  allowedRoles?: Role[]; 
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const [accessDeniedToastShown, setAccessDeniedToastShown] = useState(false);

  const hasPermission = !allowedRoles || allowedRoles.length === 0 || user?.roles.some((role) => allowedRoles.includes(role));
  const noPermission = allowedRoles && allowedRoles.length > 0 && !hasPermission;

  useEffect(() => {
    if (noPermission && !accessDeniedToastShown && isAuthenticated) {
      toast.error('Acesso Negado', {
        description: 'Você não tem permissão para acessar esta página.',
      });
      setAccessDeniedToastShown(true);
    }
  }, [noPermission, accessDeniedToastShown, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (noPermission) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
