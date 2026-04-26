import React, { Suspense, useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/sonner';
import { queryClient } from './lib/queryClient';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PageHeader } from './components/layout/PageHeader';
import { useAuthStore } from './store/useAuthStore';
import { api } from './services/api';
import { Loader2 } from 'lucide-react';

// Imports EAGER (O que precisa carregar rápido, logo no começo)
import { Login } from './pages/Login';

// Função utilitária para fazer o Lazy Load suportar Named Exports (export function Tela)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lazyLoad = (importFunc: () => Promise<any>, exportName: string) => {
  return React.lazy(() => importFunc().then(module => ({ default: module[exportName] })));
};

// Imports LAZY (Code Splitting - Arquivos separados baixados sob demanda)
const Dashboard = lazyLoad(() => import('./pages/Dashboard'), 'Dashboard');
const Unidades = lazyLoad(() => import('./pages/Unidades'), 'Unidades');
const Salas = lazyLoad(() => import('./pages/Salas'), 'Salas');
const Equipamentos = lazyLoad(() => import('./pages/Equipamentos'), 'Equipamentos');
const Pacientes = lazyLoad(() => import('./pages/Pacientes'), 'Pacientes');
const Agendamentos = lazyLoad(() => import('./pages/Agendamentos'), 'Agendamentos');
const Configuracoes = lazyLoad(() => import('./pages/Configuracoes'), 'Configuracoes');
const WorklistTecnologo = lazyLoad(() => import('./pages/Tecnologo/Worklist'), 'WorklistTecnologo');
const WorklistMedico = lazyLoad(() => import('./pages/Medico/Worklist'), 'WorklistMedico');
const WorkspaceMedico = lazyLoad(() => import('./pages/Medico/Workspace'), 'WorkspaceMedico');

// Loading Skeleton genérico (usado na checagem de auth e no carregamento das rotas lazy)
export const TelaLoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-3 text-muted-foreground">
      <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      <span className="text-sm font-medium uppercase tracking-widest">Carregando módulo...</span>
    </div>
  </div>
);

// Componente que bloqueia a renderização até validar o token com o Java
export const AppWithAuthValidation = () => {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const validateStoredToken = async () => {
      const { token, logout } = useAuthStore.getState();
      if (token) {
        try {
          await api.get('/auth/validate');
        } catch (err: unknown) {
          const error = err as { response?: { status: number } };
          if (error.response?.status === 401 || error.response?.status === 403) {
            logout();
          }
        }
      }
      setIsInitializing(false); // Libera a renderização APÓS validar
    };
    
    validateStoredToken();
  }, []);

  if (isInitializing) {
    return <TelaLoadingFallback />;
  }

  return <App />;
};

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isWorkspace = location.pathname.startsWith('/workspace');

  return (
    <QueryClientProvider client={queryClient}>
      {!isLoginPage && !isWorkspace && <PageHeader />}
      
      {/* O Suspense intercepta as telas Lazy e exibe o Fallback enquanto baixa o JS */}
      <Suspense fallback={<TelaLoadingFallback />}>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pacientes" element={<Pacientes />} />
            <Route path="/agendamentos" element={<Agendamentos />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['SUPERADMIN', 'ADMIN']} />}>
            <Route path="/unidades" element={<Unidades />} />
            <Route path="/salas" element={<Salas />} />
            <Route path="/equipamentos" element={<Equipamentos />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['SUPERADMIN', 'TECNOLOGO', 'ADMIN', 'MEDICO']} />}>
            <Route path="/worklist" element={<WorklistTecnologo />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['SUPERADMIN', 'MEDICO', 'ADMIN', 'TECNOLOGO']} />}>
            <Route path="/worklist-medico" element={<WorklistMedico />} />
            <Route path="/workspace/:id" element={<WorkspaceMedico />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      <Toaster position="top-right" richColors closeButton />
    </QueryClientProvider>
  );
}

export default App;