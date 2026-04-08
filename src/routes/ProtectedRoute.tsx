import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Role } from '../types/auth';
import { toast } from 'sonner';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  allowedRoles?: Role[]; 
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verifica se a rota exige roles específicas
  if (allowedRoles && allowedRoles.length > 0) {
    const hasPermission = user?.roles.some((role) => allowedRoles.includes(role));

    if (!hasPermission) {
      // Usamos useEffect para disparar o toast sem quebrar a renderização
      useEffect(() => {
        toast.error('Acesso Negado', {
          description: 'Você não tem permissão para acessar esta página.',
        });
      }, []);

      // Redireciona para o dashboard base caso não tenha permissão
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}
