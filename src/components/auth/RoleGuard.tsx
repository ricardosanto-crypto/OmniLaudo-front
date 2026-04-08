import { ReactNode } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Role } from '../../types/auth';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: Role[];
  fallback?: ReactNode; // Opcional: O que renderizar se não tiver permissão
}

export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const { user } = useAuthStore();

  if (!user) return <>{fallback}</>;

  // Verifica se o usuário possui alguma das roles permitidas
  const hasPermission = user.roles.some((role) => allowedRoles.includes(role));

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
