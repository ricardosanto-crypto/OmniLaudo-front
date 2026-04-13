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
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function Dashboard() {
  const { data: stats } = useDashboardStats();

  const currentStats = stats || {
    pacientes: 0,
    agendamentosHoje: 0,
    examesPendentes: 0,
    laudosFinalizados: 0
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Dashboard Header */}
        <div className="flex flex-col gap-1 mb-6">
          <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-widest">
            <span className="text-slate-500">OmniLaudo</span>
            <span className="text-blue-500">&gt;</span>
            <span className="text-blue-500">Dashboard</span>
          </div>
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Visão Geral da Operação
            </h1>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total de Pacientes', value: currentStats.pacientes.toLocaleString(), icon: Users, color: 'blue', change: '+3.2%', trend: 'up' },
            { label: 'Agendamentos Hoje', value: currentStats.agendamentosHoje, icon: Calendar, color: 'cyan', change: '+8.7%', trend: 'up' },
            { label: 'Exames Pendentes', value: currentStats.examesPendentes, icon: Clock, color: 'orange', change: '-12%', trend: 'down' },
            { label: 'Laudos Finalizados', value: currentStats.laudosFinalizados, icon: CheckCircle, color: 'emerald', change: '+5.1%', trend: 'up' },
          ].map((item, i) => (
            <motion.div 
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (i + 1) }}
              className="bg-card rounded-xl border border-border p-5 relative overflow-hidden group shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div className={cn(
                  "p-2 rounded-lg transition-colors",
                  item.color === 'blue' && "bg-blue-500/10 text-blue-500",
                  item.color === 'cyan' && "bg-cyan-500/10 text-cyan-500",
                  item.color === 'orange' && "bg-orange-500/10 text-orange-500",
                  item.color === 'emerald' && "bg-emerald-500/10 text-emerald-500",
                )}>
                  <item.icon className="h-4 w-4" />
                </div>
              </div>
              <div>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-2xl font-bold text-foreground tracking-tight">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-card rounded-2xl border border-border p-8 shadow-sm"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-base font-bold text-foreground mb-0.5 uppercase tracking-tight">Exames por Mês</h3>
                <p className="text-[10px] text-slate-500 font-medium">Realizados vs Agendados — Jan a Jun 2026</p>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={[
                { name: 'Jan', realizados: 42, agendados: 48 },
                { name: 'Fev', realizados: 52, agendados: 55 },
                { name: 'Mar', realizados: 46, agendados: 50 },
                { name: 'Abr', realizados: 60, agendados: 65 },
                { name: 'Mai', realizados: 55, agendados: 60 },
                { name: 'Jun', realizados: 67, agendados: 71 },
              ]} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0e111a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 600 }}
                />
                <Bar dataKey="realizados" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="agendados" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Realizados</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Agendados</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-card rounded-xl border border-border p-6 flex flex-col shadow-sm"
          >
            <div className="mb-6">
              <h3 className="text-base font-bold text-foreground mb-0.5 uppercase tracking-tight">Por Modalidade</h3>
              <p className="text-[10px] text-slate-500 font-medium">Distribuição do mês atual</p>
            </div>
            
            <div className="relative flex-1 flex flex-col justify-center items-center min-h-[200px]">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Ressonância', value: 35 },
                      { name: 'Tomografia', value: 28 },
                      { name: 'Ultrassom', value: 22 },
                      { name: 'Raio-X', value: 15 },
                    ]}
                    cx="50%" cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    <Cell fill="#2563eb" />
                    <Cell fill="#06b6d4" />
                    <Cell fill="#8b5cf6" />
                    <Cell fill="#6366f1" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pt-1.5">
                <p className="text-2xl font-bold text-foreground leading-none">321</p>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Exames</p>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              {[
                { name: 'Ressonância', value: 35, color: 'bg-blue-600' },
                { name: 'Tomografia', value: 28, color: 'bg-cyan-500' },
                { name: 'Ultrassom', value: 22, color: 'bg-purple-500' },
                { name: 'Raio-X', value: 15, color: 'bg-indigo-500' },
              ].map(item => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <div className={cn("h-1 w-1 rounded-full", item.color)} />
                      <span className="text-slate-500">{item.name}</span>
                    </div>
                    <span className="text-foreground">{item.value}%</span>
                  </div>
                  <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      className={cn("h-full rounded-full", item.color)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

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