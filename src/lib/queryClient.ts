import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiResponse } from '../types/api';
import { FormValidationError } from '../services/errorHandler';

const handleGlobalFeedback = (payload: unknown, isError: boolean = false) => {
  // Se for erro de formulário, ignora. A função applyFormErrors do componente cuida disso.
  if (payload instanceof FormValidationError) return;

  const response = payload as ApiResponse<unknown>;

  if (response && response.message && !isError) {
    // Apenas mensagens de sucesso passam por aqui automaticamente
    switch (response.type) {
      case 'success': toast.success(response.message); break;
      case 'warn': toast.warning(response.message); break;
      case 'error': toast.error(response.message); break;
      default: toast.info(response.message);
    }
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
  queryCache: new QueryCache({
    // Os erros (GET) já são tratados no interceptor do Axios via handleApiError
  }),
  mutationCache: new MutationCache({
    onSuccess: (data) => handleGlobalFeedback(data, false),
    // Os erros (POST/PUT/DELETE) já são tratados no interceptor do Axios
  }),
});
