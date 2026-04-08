import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from "next-themes";
import { useAuthStore } from './store/useAuthStore';
import { api } from './services/api';

// Função para validar token na inicialização
const validateStoredToken = async () => {
  const { token, logout } = useAuthStore.getState();

  if (token) {
    try {
      // Tenta fazer uma requisição simples para validar o token
      await api.get('/auth/validate');
    } catch (error: any) {
      // Se o token for inválido (401/403), limpa o estado
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('Token inválido detectado, fazendo logout automático');
        logout();
      }
    }
  }
};

// Componente que valida o token na montagem
const AppWithAuthValidation = () => {
  React.useEffect(() => {
    validateStoredToken();
  }, []);

  return <App />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AppWithAuthValidation />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)