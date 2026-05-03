import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard,
  Users,
  CalendarDays,
  Activity,
  FileSignature,
  Settings
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { cn } from '../../lib/utils';

interface NavItemProps {
  to: string;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
}

function NavItem({ to, label, icon: Icon, isActive }: NavItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        "relative flex items-center gap-2 px-3 py-2 text-xs font-bold transition-all rounded-md tracking-tight uppercase",
        isActive 
          ? "bg-muted text-foreground shadow-sm" 
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
      {isActive && (
        <motion.div
          layoutId="activeNav"
          className="absolute inset-0 bg-muted rounded-md -z-10"
          initial={false}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
}

function RoleGuard({ allowedRoles, children }: { allowedRoles: string[], children: React.ReactNode }) {
  const { user } = useAuthStore();
  if (!user || !user.roles.some(role => allowedRoles.includes(role))) return null;
  return <>{children}</>;
}

export function MainNav() {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) return null;

  return (
    <nav className="hidden lg:flex items-center gap-1">
      <NavItem 
        to="/" 
        label="Dashboard" 
        icon={LayoutDashboard}
        isActive={location.pathname === "/"} 
      />
      
      <NavItem 
        to="/pacientes" 
        label="Pacientes" 
        icon={Users}
        isActive={location.pathname === "/pacientes"} 
      />

      <NavItem 
        to="/agendamentos" 
        label="Agenda" 
        icon={CalendarDays}
        isActive={location.pathname === "/agendamentos"} 
      />

      <RoleGuard allowedRoles={['SUPERADMIN', 'TECNOLOGO', 'ADMIN']}>
        <NavItem 
          to="/worklist" 
          label="Execução" 
          icon={Activity}
          isActive={location.pathname === "/worklist"} 
        />
      </RoleGuard>

      <RoleGuard allowedRoles={['SUPERADMIN', 'MEDICO', 'ADMIN', 'TECNOLOGO']}>
        <NavItem 
          to="/worklist-medico" 
          label="Laudos" 
          icon={FileSignature}
          isActive={location.pathname === "/worklist-medico" || location.pathname.startsWith("/workspace")} 
        />
      </RoleGuard>

      <RoleGuard allowedRoles={['SUPERADMIN', 'ADMIN']}>
        <NavItem 
          to="/configuracoes/unidades" 
          label="Configurações" 
          icon={Settings}
          isActive={location.pathname.startsWith("/configuracoes")} 
        />
      </RoleGuard>
    </nav>
  );
}

