import { Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import { ThemeToggle } from '../ui/theme-toggle';
import { useAuthStore } from '../../store/useAuthStore';

export function PageHeader() {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg group-hover:shadow-lg transition-all">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">OmniLaudo AI</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Diagnóstico Automatizado</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {user && (
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{user.nome}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {user.roles.join(', ')}
                </p>
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
