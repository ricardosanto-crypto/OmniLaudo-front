import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/sonner'; // Import do Shadcn
import { queryClient } from './lib/queryClient'; // Nosso cliente global
import { ProtectedRoute } from './routes/ProtectedRoute';
import { Login } from './pages/Login';
import { Unidades } from './pages/Unidades';
import { Salas } from './pages/Salas';
import { Equipamentos } from './pages/Equipamentos';
import { Pacientes } from './pages/Pacientes';
import { Agendamentos } from './pages/Agendamentos';
import { WorklistTecnologo } from './pages/Tecnologo/Worklist';
import { WorkspaceMedico } from './pages/Medico/Workspace';
import { RoleGuard } from './components/auth/RoleGuard';
import { ThemeToggle } from './components/ui/theme-toggle';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard OmniLaudo</h1>
          <p className="text-gray-600">Gestão técnica e administrativa da clínica.</p>
        </div>
        <ThemeToggle />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RoleGuard allowedRoles={['SUPERADMIN', 'ADMIN']}>
          <Link 
            to="/unidades" 
            className="flex flex-col p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow group"
          >
            <span className="text-lg font-semibold text-gray-900 group-hover:text-primary-500 transition-colors">Gerenciar Unidades</span>
            <p className="text-sm text-gray-500 mt-1">Configure filiais e matrizes.</p>
          </Link>

          <Link 
            to="/salas" 
            className="flex flex-col p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow group"
          >
            <span className="text-lg font-semibold text-gray-900 group-hover:text-primary-500 transition-colors">Gerenciar Salas</span>
            <p className="text-sm text-gray-500 mt-1">Administre as salas de exames.</p>
          </Link>

          <Link 
            to="/equipamentos" 
            className="flex flex-col p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow group"
          >
            <span className="text-lg font-semibold text-gray-900 group-hover:text-primary-500 transition-colors">Equipamentos</span>
            <p className="text-sm text-gray-500 mt-1">Inventário e configuração DICOM.</p>
          </Link>
        </RoleGuard>

        {/* Rotas acessíveis para todos (Pacientes) */}
        <Link
          to="/pacientes"
          className="flex flex-col p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow group"
        >
          <span className="text-lg font-semibold text-gray-900 group-hover:text-primary-500 transition-colors">Pacientes</span>
          <p className="text-sm text-gray-500 mt-1">Prontuário e histórico de exames.</p>
        </Link>

        <Link
          to="/agendamentos"
          className="flex flex-col p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow group"
        >
          <span className="text-lg font-semibold text-gray-900 group-hover:text-primary-500 transition-colors">Agendamentos</span>
          <p className="text-sm text-gray-500 mt-1">Agenda do dia e fila de atendimento.</p>
        </Link>

        {/* Rotas acessíveis para Técnicos (Worklist) */}
        <RoleGuard allowedRoles={['SUPERADMIN', 'TECNOLOGO', 'ADMIN']}>
          <Link
            to="/worklist"
            className="flex flex-col p-6 bg-primary-500 border border-primary-600 rounded-xl hover:shadow-lg transition-all group"
          >
            <span className="text-lg font-semibold text-white">Executar Exames</span>
            <p className="text-sm text-primary-100 mt-1">Painel técnico e Worklist DICOM.</p>
          </Link>
        </RoleGuard>

        {/* Rotas acessíveis para Médicos (Laudário) */}
        <RoleGuard allowedRoles={['SUPERADMIN', 'MEDICO', 'ADMIN']}>
          <Link
            to="/worklist"
            className="flex flex-col p-6 bg-slate-900 border border-slate-800 rounded-xl hover:shadow-lg transition-all group"
          >
            <span className="text-lg font-semibold text-white">Laudar Exames</span>
            <p className="text-sm text-slate-400 mt-1">Central de diagnóstico e laudos.</p>
          </Link>
        </RoleGuard>
      </div>
    </div>
  );
}


function App() {
  return (
    <QueryClientProvider client={queryClient}>
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