import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { ThemeToggle } from '../ui/theme-toggle';
import { useAuthStore } from '../../store/useAuthStore';
import { MainNav } from './MainNav';
import { MobileNav } from './MobileNav';
import logoBranco from '../../assets/LogoFundoBranco.png';
import logoPreto from '../../assets/LogoFundoPreto.png';

export function PageHeader() {
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background transition-all">
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center group shrink-0">
              <img src={logoBranco} alt="OmniLaudo" className="h-8 dark:hidden object-contain" />
              <img src={logoPreto} alt="OmniLaudo" className="h-8 hidden dark:block object-contain" />
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
