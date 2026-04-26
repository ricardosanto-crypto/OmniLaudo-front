import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import { ApiResponse } from '../../types/api';
import { TokenResponse, AuthUser, Role } from '../../types/auth';
import { toast } from 'sonner';

// Componentes do Shadcn
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Stethoscope, Shield, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Formato de e-mail inválido').nonempty('O e-mail é obrigatório'),
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

interface JwtPayload {
  sub: string;
  nome?: string;
  roles?: string[];
  unidadesIds?: string[];
}

function parseJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginFn = useAuthStore((state) => state.login);
  const from = location.state?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation<ApiResponse<TokenResponse>, ApiResponse<null>, LoginFormInputs>({
    mutationFn: (data) => api.post('/auth/login', data).then((res) => res.data),
    onSuccess: (response: ApiResponse<TokenResponse>) => {
      const payload = response.data;
      const token = payload?.token;

      if (!token) {
        toast.error('Não foi possível autenticar. Verifique suas credenciais e tente novamente.');
        return;
      }

      const decoded = parseJwt(token);
      const user: AuthUser = {
        id: decoded?.sub || '',
        nome: decoded?.nome || 'Usuário',
        email: decoded?.sub || '',
        roles: (decoded?.roles as Role[]) || [],
        unidadesIds: decoded?.unidadesIds || [],
      };

      loginFn(token, user);
      navigate(from, { replace: true });
    },
    // NOTA: Não precisamos mais de 'onError' aqui! 
    // O MutationCache global no queryClient.ts intercepta e exibe o Toast.
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-20 transition-colors"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-20 transition-colors"></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="shadow-2xl border border-border bg-card/80 backdrop-blur-md">
          <CardHeader className="text-center pb-2">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-full w-fit"
            >
              <Stethoscope className="h-8 w-8 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              OmniLaudo AI
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-slate-400 mt-2">
              Sistema Inteligente de Diagnóstico por Imagem
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-slate-300 flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                  E-mail Institucional
                </label>
                <Input
                  type="email"
                  placeholder="medico@clinica.com.br"
                  {...register('email')}
                  className={`h-12 text-base dark:bg-slate-950 dark:border-slate-700 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300 focus-visible:ring-blue-500'}`}
                />
                {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-slate-300 flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                  Senha
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...register('senha')}
                  className={`h-12 text-base dark:bg-slate-950 dark:border-slate-700 ${errors.senha ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300 focus-visible:ring-blue-500'}`}
                />
                {errors.senha && <span className="text-red-500 text-xs">{errors.senha.message}</span>}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200" 
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Autenticando...
                  </div>
                ) : (
                  'Acessar Sistema'
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 dark:text-slate-500">
                Sistema seguro • Dados protegidos • Conformidade HIPAA
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
