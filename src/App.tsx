import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/sonner';
import { queryClient } from './lib/queryClient';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PageHeader } from './components/layout/PageHeader';
import { Login } from './pages/Login';
import { Unidades } from './pages/Unidades';
import { Salas } from './pages/Salas';
import { Equipamentos } from './pages/Equipamentos';
import { Pacientes } from './pages/Pacientes';
import { Agendamentos } from './pages/Agendamentos';
import { WorklistTecnologo } from './pages/Tecnologo/Worklist';
import { WorklistMedico } from './pages/Medico/Worklist';
import { WorkspaceMedico } from './pages/Medico/Workspace';
import { Configuracoes } from './pages/Configuracoes';
import { cn } from './lib/utils';
import {
  Users,
  Calendar,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useDashboardStats } from './hooks/useDashboard';
import { useAuthStore } from './store/useAuthStore';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats();
  const { hasRole } = useAuthStore();

  const isMedico = hasRole('MEDICO');
  const isTecnologo = hasRole('TECNOLOGO');

  const currentStats = stats || {
    agendamentosHoje: 0,
    examesEmEspera: 0,
    backlogLaudos: 0,
    laudadosHoje: 0,
    canceladosHoje: 0,
    historicoSemanal: []
  };

  const dashboardTitle = isMedico ? "Meu Painel Diagnóstico" : isTecnologo ? "Operação da Sala" : "Visão Geral da Clínica";

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <span className="text-sm">Carregando métricas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col gap-1 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              {dashboardTitle}
            </h1>
          </div>
        </div>

        {/* Cards principais orientados à ação */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-card rounded-xl border border-border p-5 relative overflow-hidden group shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><Users className="h-4 w-4" /></div>
            </div>
            <div>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total de Agendamentos (Hoje)</p>
              <p className="text-2xl font-bold text-foreground tracking-tight">{currentStats.agendamentosHoje}</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-card rounded-xl border border-border p-5 relative overflow-hidden group shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500"><Clock className="h-4 w-4" /></div>
            </div>
            <div>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Backlog / Fila de Exames</p>
              <p className="text-2xl font-bold text-foreground tracking-tight">{isMedico ? currentStats.backlogLaudos : currentStats.examesEmEspera}</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-card rounded-xl border border-border p-5 relative overflow-hidden group shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><CheckCircle className="h-4 w-4" /></div>
            </div>
            <div>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Laudados (Hoje)</p>
              <p className="text-2xl font-bold text-foreground tracking-tight">{currentStats.laudadosHoje}</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-card rounded-xl border border-border p-5 relative overflow-hidden group shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 rounded-lg bg-red-500/10 text-red-500"><Calendar className="h-4 w-4" /></div>
            </div>
            <div>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Cancelamentos e Remarcações</p>
              <p className="text-2xl font-bold text-foreground tracking-tight">{currentStats.canceladosHoje}</p>
            </div>
          </motion.div>
        </div>

        {/* Gráfico Analítico Simples e Direto (Oculto para Tecnólogos) */}
        {!isTecnologo && currentStats.historicoSemanal.length > 0 && (
          <div className="grid grid-cols-1 mb-10">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
              className="bg-card rounded-2xl border border-border p-8 shadow-sm">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-base font-bold text-foreground mb-0.5 uppercase tracking-tight">Produtividade - Últimos 7 Dias</h3>
                  <p className="text-[10px] text-slate-500 font-medium">Agendados vs Realizados (Com Laudo Solicitado ou Finalizado)</p>
                </div>
              </div>

              {currentStats.historicoSemanal.length === 0 || currentStats.historicoSemanal.every(d => d.agendados === 0 && d.realizados === 0) ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 h-[320px] bg-slate-50/50 dark:bg-slate-900/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                  <div className="text-slate-300 dark:text-slate-700 mb-3"><Calendar className="h-12 w-12" /></div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Nenhum exame laudado ou agendado nos últimos 7 dias.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={currentStats.historicoSemanal} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                    <XAxis dataKey="data" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} dy={10}
                      tickFormatter={(val) => {
                        const date = new Date(val); // Ajuste formato YYYY-MM-DD
                        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                      }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0e111a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                      itemStyle={{ fontSize: '10px', fontWeight: 600 }}
                    />
                    <Bar dataKey="realizados" name="Exames Feitos" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={24} />
                    <Bar dataKey="agendados" name="Agendados" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              )}

              <div className="flex justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Exames Feitos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Agendados</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}


function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isWorkspace = location.pathname.startsWith('/workspace');

  return (
    <QueryClientProvider client={queryClient}>
      {!isLoginPage && !isWorkspace && <PageHeader />}
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Rotas genéricas (Qualquer usuário logado) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/agendamentos" element={<Agendamentos />} />
          {/* Coloque aqui as rotas que todos podem ver, ex: /meu-perfil */}
        </Route>

        {/* Rotas restritas para ADMINS e SUPERADMINS */}
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

      {/* O Toaster fica na raiz, visível em todas as rotas */}
      <Toaster position="top-right" richColors closeButton />
    </QueryClientProvider>
  );
}

export default App;