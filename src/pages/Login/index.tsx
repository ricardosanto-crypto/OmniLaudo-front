import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import { ApiResponse } from '../../types/api';
import { TokenResponse, AuthUser } from '../../types/auth';

// Componentes do Shadcn
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

const loginSchema = z.object({
  email: z.string().email('Formato de e-mail inválido').nonempty('O e-mail é obrigatório'),
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

function parseJwt(token: string): Partial<AuthUser> | null {
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
    onSuccess: (response) => {
      const token = response.data?.token;
      if (token) {
        const decoded = parseJwt(token);
        
        const user: AuthUser = {
          id: (decoded as any)?.sub || '',
          nome: (decoded as any)?.nome || 'Usuário',
          email: (decoded as any)?.sub || '',
          roles: (decoded as any)?.roles || [],
          // Correção: Lendo o array de unidades do JWT (se seu backend enviar no futuro)
          // Se o backend ainda não injeta 'unidadesIds' no JWT, ele inicia vazio de forma segura
          unidadesIds: (decoded as any)?.unidadesIds || [], 
        };
        
        loginFn(token, user);
        navigate(from, { replace: true });
      }
    },
    // NOTA: Não precisamos mais de 'onError' aqui! 
    // O MutationCache global no queryClient.ts intercepta e exibe o Toast.
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary-600">OmniLaudo AI</CardTitle>
          <CardDescription>Insira suas credenciais para acessar o sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">E-mail</label>
              <Input
                type="email"
                placeholder="exemplo@omnilaudo.com.br"
                {...register('email')}
                className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Senha</label>
              <Input
                type="password"
                placeholder="••••••••"
                {...register('senha')}
                className={errors.senha ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {errors.senha && <span className="text-red-500 text-xs">{errors.senha.message}</span>}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary-500 hover:bg-primary-600" 
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Autenticando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
