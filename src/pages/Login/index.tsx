import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import { ApiResponse } from '../../types/api';
import { TokenResponse, AuthUser, Role } from '../../types/auth';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  HelpCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Scan,
  Activity,
  MonitorDot,
  FileText,
} from 'lucide-react';

import logoFundoBranco from '../../assets/LogoFundoBranco.png';
import logoFundoPreto from '../../assets/LogoFundoPreto.png';
import loginHeroBg from '../../assets/login-hero-bg.png';

const loginSchema = z.object({
  email: z.string().email('Formato de e-mail inválido').nonempty('O e-mail é obrigatório'),
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  lembrar: z.boolean().optional(),
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

// Animated floating icon used in the hero panel
function FloatingIcon({ icon: Icon, delay, x, y }: { icon: React.ElementType; delay: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute text-blue-400/20"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: [0.15, 0.3, 0.15],
        scale: [0.9, 1.1, 0.9],
        y: [0, -12, 0],
      }}
      transition={{
        duration: 5,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <Icon className="h-8 w-8" />
    </motion.div>
  );
}

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginFn = useAuthStore((state) => state.login);
  const from = location.state?.from?.pathname || '/';
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      lembrar: true
    }
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
      toast.success(`Bem-vindo, ${user.nome}!`);
      navigate(from, { replace: true });
    },
    // Error handled by global MutationCache in queryClient.ts
  });

  return (
    <div className="h-screen w-screen flex bg-[#070a10] overflow-hidden">
      {/* ───────── LEFT: Hero Panel ───────── */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-12 overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={loginHeroBg}
            alt=""
            className="w-full h-full object-cover opacity-65"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#070a10]/80 via-[#070a10]/60 to-blue-950/40" />
        </div>

        {/* Floating medical icons */}
        <FloatingIcon icon={Scan} delay={0} x="15%" y="20%" />
        <FloatingIcon icon={Activity} delay={1.2} x="70%" y="15%" />
        <FloatingIcon icon={MonitorDot} delay={2.4} x="25%" y="65%" />
        <FloatingIcon icon={FileText} delay={3.6} x="65%" y="55%" />

        {/* Top: Branding */}
        <div className="relative z-10">
          <img src={logoFundoPreto} alt="OmniLaudo" className="h-10 w-auto" />
        </div>

        {/* Center: Hero copy */}
        <div className="relative z-10 max-w-lg">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl font-bold text-white leading-tight mb-4"
          >
            Seu fluxo de imagem
            <br />
            diagnóstica em um só lugar.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-slate-400 text-sm leading-relaxed max-w-md"
          >
            Solicitação, agendamento, execução, laudo e PACS integrados.
            Gerencie toda a operação da sua clínica de diagnóstico por imagem
            com eficiência e segurança.
          </motion.p>
        </div>

        {/* Bottom: Compliance badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="relative z-10"
        >
          <div className="flex flex-wrap gap-3">
            {['LGPD', 'ANVISA RDC 330/2019', 'DICOM 3.0', 'HL7'].map((badge) => (
              <span
                key={badge}
                className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-700/50 rounded-md bg-slate-800/30 backdrop-blur-sm"
              >
                {badge}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-slate-600 mt-4">
            © {new Date().getFullYear()} OmniLaudo · Plataforma de Diagnóstico por Imagem
          </p>
        </motion.div>
      </motion.div>

      {/* ───────── RIGHT: Login Form ───────── */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Top-right actions */}
        <div className="p-8 flex justify-end items-center gap-6 text-slate-400 text-xs font-medium">
          <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600 transition-colors">
            PT-BR <ChevronDown className="h-3.5 w-3.5" />
          </div>
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-600 transition-colors">
            <HelpCircle className="h-4 w-4" /> Suporte
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 -mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-[420px]"
          >
            {/* Mobile-only logo */}
            <div className="lg:hidden mb-10">
              <img src={logoFundoBranco} alt="OmniLaudo" className="h-10 w-auto" />
            </div>

            {/* Form header */}
            <div className="mb-6 text-center">
              <p className="text-[10px] font-bold text-blue-700 uppercase tracking-[0.15em] mb-2">
                Acesse sua conta
              </p>
              <h2 className="text-2xl font-bold text-[#0f172a] tracking-tight mb-3">
                Entrar no OmniLaudo
              </h2>
              <p className="text-slate-500 text-xs leading-relaxed mx-auto max-w-[300px]">
                Use seu e-mail corporativo e senha cadastrada para acessar o sistema clínico.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="login-email" className="text-xs font-semibold text-slate-700">
                  E-mail corporativo
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="marina.rocha@omnilaudo.com.br"
                    {...register('email')}
                    className={`
                      w-full h-11 pl-11 pr-4 text-sm rounded border bg-white text-[#0f172a]
                      transition-all duration-200 outline-none
                      placeholder:text-slate-300
                      focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600
                      ${errors.email ? 'border-red-400' : 'border-slate-200 hover:border-slate-300'}
                    `}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 font-medium mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="login-senha" className="text-xs font-semibold text-slate-700">
                    Senha
                  </label>
                  <Link
                    to="/esqueci-senha"
                    className="text-xs font-semibold text-blue-700 hover:text-blue-800 transition-colors"
                  >
                    Esqueci minha senha
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    id="login-senha"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    {...register('senha')}
                    className={`
                      w-full h-11 pl-11 pr-11 text-sm rounded border bg-white text-[#0f172a]
                      transition-all duration-200 outline-none
                      placeholder:text-slate-300
                      focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600
                      ${errors.senha ? 'border-red-400' : 'border-slate-200 hover:border-slate-300'}
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.senha && (
                  <p className="text-xs text-red-500 font-medium mt-1">{errors.senha.message}</p>
                )}
              </div>

              {/* Remember me checkbox */}
              <div className="flex items-center gap-3">
                <div className="relative flex items-center h-5">
                  <input
                    id="lembrar"
                    type="checkbox"
                    {...register('lembrar')}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
                <label htmlFor="lembrar" className="text-xs text-slate-500 cursor-pointer select-none">
                  Manter-me conectado
                </label>
              </div>

              {/* Submit - Rounded-md like image */}
              <motion.button
                type="submit"
                disabled={mutation.isPending}
                whileTap={{ scale: mutation.isPending ? 1 : 0.98 }}
                className={`
                  w-full h-12 rounded-md font-bold text-sm flex items-center justify-center gap-2
                  transition-all duration-200
                  ${mutation.isPending
                    ? 'bg-blue-300 text-white cursor-not-allowed'
                    : 'bg-[#1d4ed8] text-white hover:bg-[#1e40af] shadow-md shadow-blue-900/10'}
                `}
              >
                {mutation.isPending ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Autenticando...
                  </>
                ) : (
                  <>
                    Acessar <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Compliance Alert Box */}
            <div className="mt-8 p-4 rounded border border-slate-100 bg-slate-50/50 flex gap-3">
              <CheckCircle2 className="h-4 w-4 text-slate-300 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-400 leading-relaxed">
                 Seus acessos são auditados conforme <strong className="text-slate-600">LGPD</strong> e <strong className="text-slate-600">ANVISA RDC 330/2019</strong>. 
                 O uso indevido sujeita o usuário às sanções administrativas e legais cabíveis.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="p-8 mt-auto flex flex-wrap justify-between items-center border-t border-slate-50 text-xs text-slate-400 gap-4">
           <div className="flex items-center gap-2">
             <MonitorDot className="h-3.5 w-3.5" />
             <span>Sessão expira após 30 min de inatividade</span>
           </div>
           <div className="flex items-center gap-6">
             <span className="hover:text-blue-600 cursor-pointer">Termos de uso</span>
             <span className="hover:text-blue-600 cursor-pointer">Privacidade</span>
             <span className="hover:text-blue-600 cursor-pointer">Solicitar acesso</span>
           </div>
        </div>
      </div>
    </div>
  );
}
