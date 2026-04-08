import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiResponse } from '../types/api';

// Função utilitária para ler o contrato do seu Spring Boot e disparar o Toast correto
const handleGlobalFeedback = (payload: unknown, isError: boolean = false) => {
  // Fazemos o cast (seguro pois nosso Axios interceptor garante esse formato)
  const response = payload as ApiResponse<unknown>;

  if (response && response.message) {
    switch (response.type) {
      case 'success':
        toast.success(response.message);
        break;
      case 'warn':
        toast.warning(response.message);
        break;
      case 'error':
        toast.error(response.message);
        break;
      default:
        // Fallback caso o backend não mande o 'type' mas mande a mensagem
        isError ? toast.error(response.message) : toast.info(response.message);
    }
  } else if (isError) {
    // Fallback extremo para erros não tratados/rede
    toast.error('Ocorreu um erro inesperado de comunicação.');
  }
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
  // Captura global de erros em consultas (GET)
  queryCache: new QueryCache({
    onError: (error) => handleGlobalFeedback(error, true),
  }),
  // Captura global de SUCESSO e ERRO em mutações (POST, PUT, DELETE)
  mutationCache: new MutationCache({
    onSuccess: (data) => handleGlobalFeedback(data, false),
    onError: (error) => handleGlobalFeedback(error, true),
  }),
});
