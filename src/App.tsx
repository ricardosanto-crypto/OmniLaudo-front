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
import { WorkspaceMedico } from './pages/Medico/Workspace';
import { RoleGuard } from './components/auth/RoleGuard';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Activity, 
  FileText, 
  Stethoscope,
  Building, 
  Settings, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useDashboardStats, useChartData, usePieData } from './hooks/useDashboard';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6'];

function Dashboard() {
  const { data: stats } = useDashboardStats();
  const { data: chartData } = useChartData();
  const { data: pieData } = usePieData();

  const defaultStats = {
    pacientes: 0,
    agendamentosHoje: 0,
    examesPendentes: 0,
    laudosFinalizados: 0
  };

  const currentStats = stats || defaultStats;
  const currentChartData = chartData || [];
  const currentPieData = pieData || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-950 dark:to-blue-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Pacientes</p>
                <p className="text-3xl font-bold text-gray-900">{currentStats.pacientes.toLocaleString()}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Agendamentos Hoje</p>
                <p className="text-3xl font-bold text-gray-900">{currentStats.agendamentosHoje}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Exames Pendentes</p>
                <p className="text-3xl font-bold text-gray-900">{currentStats.examesPendentes}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Laudos Finalizados</p>
                <p className="text-3xl font-bold text-gray-900">{currentStats.laudosFinalizados}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Exames por Mês
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={currentChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="exames" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-600" />
              Distribuição por Modalidade
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={currentPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {currentPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <RoleGuard allowedRoles={['SUPERADMIN', 'ADMIN']}>
              <Link 
                to="/unidades" 
                className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:shadow-md transition-all group"
              >
                <Building className="h-8 w-8 text-blue-600 mr-4" />
                <div>
                  <span className="text-lg font-semibold text-blue-900 group-hover:text-blue-700">Gerenciar Unidades</span>
                  <p className="text-sm text-blue-700">Configure filiais e matrizes</p>
                </div>
              </Link>

              <Link 
                to="/salas" 
                className="flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg hover:shadow-md transition-all group"
              >
                <Settings className="h-8 w-8 text-green-600 mr-4" />
                <div>
                  <span className="text-lg font-semibold text-green-900 group-hover:text-green-700">Gerenciar Salas</span>
                  <p className="text-sm text-green-700">Administre salas de exames</p>
                </div>
              </Link>

              <Link 
                to="/equipamentos" 
                className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg hover:shadow-md transition-all group"
              >
                <Activity className="h-8 w-8 text-purple-600 mr-4" />
                <div>
                  <span className="text-lg font-semibold text-purple-900 group-hover:text-purple-700">Equipamentos</span>
                  <p className="text-sm text-purple-700">Inventário e configuração DICOM</p>
                </div>
              </Link>
            </RoleGuard>

            <Link
              to="/pacientes"
              className="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg hover:shadow-md transition-all group"
            >
              <Users className="h-8 w-8 text-indigo-600 mr-4" />
              <div>
                <span className="text-lg font-semibold text-indigo-900 group-hover:text-indigo-700">Pacientes</span>
                <p className="text-sm text-indigo-700">Prontuário e histórico</p>
              </div>
            </Link>

            <Link
              to="/agendamentos"
              className="flex items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg hover:shadow-md transition-all group"
            >
              <Calendar className="h-8 w-8 text-orange-600 mr-4" />
              <div>
                <span className="text-lg font-semibold text-orange-900 group-hover:text-orange-700">Agendamentos</span>
                <p className="text-sm text-orange-700">Agenda do dia e fila</p>
              </div>
            </Link>

            <RoleGuard allowedRoles={['SUPERADMIN', 'TECNOLOGO', 'ADMIN']}>
              <Link
                to="/worklist"
                className="flex items-center p-4 bg-gradient-to-r from-cyan-50 to-cyan-100 border border-cyan-200 rounded-lg hover:shadow-md transition-all group"
              >
                <Stethoscope className="h-8 w-8 text-cyan-600 mr-4" />
                <div>
                  <span className="text-lg font-semibold text-cyan-900 group-hover:text-cyan-700">Executar Exames</span>
                  <p className="text-sm text-cyan-700">Painel técnico e Worklist DICOM</p>
                </div>
              </Link>
            </RoleGuard>

            <RoleGuard allowedRoles={['SUPERADMIN', 'MEDICO', 'ADMIN']}>
              <Link
                to="/worklist"
                className="flex items-center p-4 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-lg hover:shadow-md transition-all group"
              >
                <FileText className="h-8 w-8 text-slate-600 mr-4" />
                <div>
                  <span className="text-lg font-semibold text-slate-900 group-hover:text-slate-700">Laudar Exames</span>
                  <p className="text-sm text-slate-700">Central de diagnóstico e laudos</p>
                </div>
              </Link>
            </RoleGuard>
          </div>
        </motion.div>
      </main>
    </div>
  );
}


function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <QueryClientProvider client={queryClient}>
      {!isLoginPage && <PageHeader />}
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
          {/* Aqui entrarão rotas como /usuarios, /equipamentos */}
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['SUPERADMIN', 'TECNOLOGO', 'ADMIN', 'MEDICO']} />}>
          <Route path="/worklist" element={<WorklistTecnologo />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['SUPERADMIN', 'MEDICO', 'ADMIN']} />}>
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