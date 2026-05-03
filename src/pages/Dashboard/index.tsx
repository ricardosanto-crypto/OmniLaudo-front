import { useState } from 'react';
import { Users, Calendar, Clock, CheckCircle, ChevronDown, RefreshCw } from 'lucide-react';
import { useDashboardStats } from '../../hooks/useDashboard';
import { useAuthStore } from '../../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardAdmin } from './components/DashboardAdmin';

export function Dashboard() {
  const { data: stats, isLoading, refetch } = useDashboardStats();
  const { hasRole } = useAuthStore();

  const isMedico = hasRole('MEDICO');
  const isTecnologo = hasRole('TECNOLOGO');
  const isGestor = hasRole('SUPERADMIN') || hasRole('ADMIN');

  // Determine available tabs based on roles
  const availableTabs = [];
  if (isGestor) availableTabs.push({ id: 'gestao', label: 'Visão Gestão' });
  if (isMedico) availableTabs.push({ id: 'fila', label: 'Minha Fila de Laudos' });
  if (isTecnologo) availableTabs.push({ id: 'worklist', label: 'Worklist da Sala' });

  // Determine smart default tab (in a real app, this checks urgent exams)
  const defaultTab = availableTabs.length > 0 ? availableTabs[0].id : 'gestao';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const currentStats = stats || {
    agendamentosHoje: 0, examesEmEspera: 0, backlogLaudos: 0, laudadosHoje: 0, canceladosHoje: 0, historicoSemanal: []
  };

  const getDashboardTitle = () => {
    if (activeTab === 'gestao') return "Dashboard Operacional";
    if (activeTab === 'fila') return "Minha Fila Diagnóstica";
    if (activeTab === 'worklist') return "Operação da Sala";
    return "Dashboard";
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <span className="text-sm font-medium text-slate-500">Carregando métricas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background flex flex-col items-center transition-colors overflow-x-hidden">
      <div className="w-full max-w-[1600px] px-6 md:px-8 py-6">
        
        {/* Switcher de Contexto (Apenas para perfis múltiplos) */}
        {availableTabs.length > 1 && (
          <div className="flex items-center gap-2 mb-6 border-b border-border">
            {availableTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-[13px] font-bold border-b-2 transition-colors relative -mb-[1px] ${
                  activeTab === tab.id 
                    ? 'border-blue-600 text-blue-700 dark:text-blue-400' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Header do Dashboard (Filtros globais) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
          <div>
            <span className="text-[11px] font-medium text-muted-foreground mb-1 block tracking-wide">Operação / Painel</span>
            <h1 className="text-[26px] font-bold tracking-tight text-foreground leading-none">
              {getDashboardTitle()}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filtro Unidade (Apenas SUPERADMIN/ADMIN) */}
            {isGestor && activeTab === 'gestao' && (
              <button className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-md shadow-sm text-[13px] font-medium text-foreground hover:bg-accent transition-colors">
                Todas as Unidades
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            )}

            {/* Atualizar */}
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-md shadow-sm text-[13px] font-bold text-foreground hover:bg-accent transition-colors"
            >
              <RefreshCw className={`h-4 w-4 text-muted-foreground ${isRefreshing ? 'animate-spin text-blue-600 dark:text-blue-400' : ''}`} />
              Atualizar
            </button>
          </div>
        </div>

        {/* Renderiza o painel ativo */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'gestao' ? (
              <DashboardAdmin />
            ) : (
              // Visão Antiga Medico / Tecnologo (mantida para não quebrar produção)
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2 rounded-md bg-blue-50 text-blue-600"><Users className="h-4 w-4" /></div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Total de Agendamentos</p>
                      <p className="text-[28px] font-bold text-slate-800 leading-none">{currentStats.agendamentosHoje}</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2 rounded-md bg-amber-50 text-amber-600"><Clock className="h-4 w-4" /></div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Fila de Exames</p>
                      <p className="text-[28px] font-bold text-slate-800 leading-none">{activeTab === 'fila' ? currentStats.backlogLaudos : currentStats.examesEmEspera}</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2 rounded-md bg-emerald-50 text-emerald-600"><CheckCircle className="h-4 w-4" /></div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Laudados (Hoje)</p>
                      <p className="text-[28px] font-bold text-slate-800 leading-none">{currentStats.laudadosHoje}</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2 rounded-md bg-red-50 text-red-600"><Calendar className="h-4 w-4" /></div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Cancelamentos</p>
                      <p className="text-[28px] font-bold text-slate-800 leading-none">{currentStats.canceladosHoje}</p>
                    </div>
                  </div>
                </div>

                {activeTab !== 'worklist' && currentStats.historicoSemanal.length > 0 && (
                  <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-[14px] font-bold text-slate-800 mb-6">Produtividade - Últimos 7 Dias</h3>
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={currentStats.historicoSemanal} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="data" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }} dy={10}
                          tickFormatter={(val) => {
                            const date = new Date(val);
                            return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                          }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }} />
                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                        <Bar dataKey="realizados" name="Exames Feitos" fill="#2563eb" radius={[2, 2, 0, 0]} barSize={16} />
                        <Bar dataKey="agendados" name="Agendados" fill="#0ea5e9" radius={[2, 2, 0, 0]} barSize={16} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
