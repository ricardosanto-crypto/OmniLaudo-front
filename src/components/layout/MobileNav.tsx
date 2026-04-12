import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Activity, 
  FileText, 
  Settings,
  Building,
  Monitor,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) return null;

  const isAdmin = user.roles.some(role => ['SUPERADMIN', 'ADMIN'].includes(role));
  const isMedico = user.roles.some(role => ['SUPERADMIN', 'MEDICO', 'ADMIN'].includes(role));
  const isTecnologo = user.roles.some(role => ['SUPERADMIN', 'TECNOLOGO', 'ADMIN'].includes(role));

  const navItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard, show: true },
    { to: "/pacientes", label: "Pacientes", icon: Users, show: true },
    { to: "/agendamentos", label: "Agenda", icon: Calendar, show: true },
    { to: "/worklist", label: "Executar Exames", icon: Activity, show: isTecnologo },
    { to: "/worklist-medico", label: "Laudar Exames", icon: FileText, show: isMedico },
  ];

  const adminItems = [
    { to: "/unidades", label: "Unidades", icon: Building },
    { to: "/salas", label: "Salas", icon: Settings },
    { to: "/equipamentos", label: "Equipamentos", icon: Monitor },
  ];

  return (
    <div className="lg:hidden">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsOpen(true)}
        className="text-slate-600 dark:text-slate-400"
      >
        <Menu className="h-6 w-6" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[80%] max-w-sm bg-white dark:bg-slate-950 z-50 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                <span className="text-lg font-bold text-slate-900 dark:text-white">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {navItems.filter(item => item.show).map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl transition-colors",
                      location.pathname === item.to
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </Link>
                ))}

                {isAdmin && (
                  <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
                    <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Administração
                    </p>
                    {adminItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-xl transition-colors",
                          location.pathname === item.to
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 opacity-50" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {user.nome.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{user.nome}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">{user.roles.join(', ')}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
