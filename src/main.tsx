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
      console.log('Token validado com sucesso');
    } catch (error: any) {
      // Apenas faz logout se for erro de autenticação (401/403)
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.warn('Token inválido ou expirado, fazendo logout automático');
        logout();
      } else if (error.code === 'ECONNABORTED' || error.message === 'Network Error' || !error.response) {
        // Ignora erros de conexão na inicialização
        console.warn('Erro de conexão ao validar token - mas continuamos com o token armazenado');
      } else {
        // Log de outros erros
        console.warn('Erro ao validar token:', error.response?.status);
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