import { Link } from 'react-router-dom';
import { Stethoscope, LogOut } from 'lucide-react';
import { ThemeToggle } from '../ui/theme-toggle';
import { useAuthStore } from '../../store/useAuthStore';
import { MainNav } from './MainNav';
import { MobileNav } from './MobileNav';

export function PageHeader() {
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background transition-all">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center space-x-3 group shrink-0">
              <div className="bg-blue-600 p-2 rounded-xl transition-all duration-300">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-foreground tracking-tight leading-none">
                  OmniLaudo AI
                </h1>
                <p className="text-[8px] uppercase font-bold text-blue-500 tracking-widest mt-0.5">
                  RIS / PACS Intelligence
                </p>
              </div>
            </Link>

            <div className="h-6 w-[1px] bg-border mx-1" />

            <MainNav />
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-foreground leading-none mb-0.5">{user.nome}</p>
                  <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter">
                    {user.roles[0]}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center border border-white/10 text-white font-bold text-[10px] ring-2 ring-white/5">
                  {user.nome.substring(0, 2).toUpperCase()}
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2 border-l border-border pl-4 ml-2">
              <ThemeToggle />
              <button 
                onClick={() => logout()}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-destructive/10"
                title="Sair"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>

            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
