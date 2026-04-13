import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronDown
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { cn } from '../../lib/utils';

interface NavItemProps {
  to: string;
  label: string;
  isActive: boolean;
}

function NavItem({ to, label, isActive }: NavItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        "relative flex items-center px-4 py-2 text-xs font-bold transition-all rounded-md tracking-tight uppercase",
        isActive 
          ? "bg-muted text-foreground shadow-sm" 
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      )}
    >
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
    <nav className="hidden lg:flex items-center gap-2">
      <NavItem 
        to="/" 
        label="Dashboard" 
        isActive={location.pathname === "/"} 
      />
      
      <NavItem 
        to="/pacientes" 
        label="Pacientes" 
        isActive={location.pathname === "/pacientes"} 
      />

      <NavItem 
        to="/agendamentos" 
        label="Agenda" 
        isActive={location.pathname === "/agendamentos"} 
      />

      <RoleGuard allowedRoles={['SUPERADMIN', 'TECNOLOGO', 'ADMIN']}>
        <NavItem 
          to="/worklist" 
          label="Execução" 
          isActive={location.pathname === "/worklist"} 
        />
      </RoleGuard>

      <RoleGuard allowedRoles={['SUPERADMIN', 'MEDICO', 'ADMIN', 'TECNOLOGO']}>
        <NavItem 
          to="/worklist-medico" 
          label="Laudos" 
          isActive={location.pathname === "/worklist-medico" || location.pathname.startsWith("/workspace")} 
        />
      </RoleGuard>

      <RoleGuard allowedRoles={['SUPERADMIN', 'ADMIN']}>
        <div className="relative group">
          <button className={cn(
            "flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-tight transition-all rounded-md",
            ["/unidades", "/salas", "/equipamentos", "/configuracoes"].includes(location.pathname)
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}>
            Configurações
            <ChevronDown className="h-3 w-3 opacity-50" />
          </button>
          
          <div className="absolute left-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-1">
            <Link to="/unidades" className="block px-4 py-2 text-xs font-bold uppercase text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Unidades</Link>
            <Link to="/salas" className="block px-4 py-2 text-xs font-bold uppercase text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Salas</Link>
            <Link to="/equipamentos" className="block px-4 py-2 text-xs font-bold uppercase text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Equipamentos</Link>
            <div className="h-px bg-border mx-2 my-1" />
            <Link to="/configuracoes" className="block px-4 py-2 text-xs font-bold uppercase text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Templates & Frases</Link>
          </div>
        </div>
      </RoleGuard>
    </nav>
  );
}

