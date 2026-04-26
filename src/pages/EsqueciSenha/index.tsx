import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  ArrowLeft,
  Send,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  MonitorDot,
  Scan,
  Activity,
  MonitorDot as MonitorIcon,
  FileText,
} from 'lucide-react';

import logoFundoBranco from '../../assets/LogoFundoBranco.png';
import logoFundoPreto from '../../assets/LogoFundoPreto.png';
import loginHeroBg from '../../assets/login-hero-bg.png';

const forgotSchema = z.object({
  email: z.string().email('Formato de e-mail inválido').nonempty('O e-mail é obrigatório'),
});

type ForgotFormInputs = z.infer<typeof forgotSchema>;

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

export function EsqueciSenha() {
  const [sent, setSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotFormInputs>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = (data: ForgotFormInputs) => {
    // TODO: Integrate with backend endpoint POST /api/v1/auth/forgot-password
    setSubmittedEmail(data.email);
    setSent(true);
  };

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
        <FloatingIcon icon={MonitorIcon} delay={2.4} x="25%" y="65%" />
        <FloatingIcon icon={FileText} delay={3.6} x="65%" y="55%" />

        {/* Top: Branding */}
        <div className="relative z-10">
          <img src={logoFundoPreto} alt="OmniLaudo" className="h-10 w-auto" />
        </div>

        {/* Center: Hero copy */}
        <div className="relative z-10 max-w-lg mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl font-bold text-white leading-tight mb-4"
          >
            Recupere seu
            <br />
            acesso seguro.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-slate-400 text-sm leading-relaxed max-w-md"
          >
            Enviaremos um link de redefinição de senha para o e-mail
            associado à sua conta. O link é válido por 30 minutos.
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

      {/* ───────── RIGHT: Form Panel ───────── */}
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
            <div className="lg:hidden mb-10 text-center">
              <img src={logoFundoBranco} alt="OmniLaudo" className="h-10 w-auto mx-auto" />
            </div>

            <AnimatePresence mode="wait">
              {!sent ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Form header */}
                  <div className="mb-8 text-center">
                    <p className="text-[10px] font-bold text-blue-700 uppercase tracking-[0.15em] mb-2">
                      Recuperar acesso
                    </p>
                    <h2 className="text-2xl font-bold text-[#0f172a] tracking-tight mb-3">
                      Esqueceu sua senha?
                    </h2>
                    <p className="text-slate-500 text-xs leading-relaxed mx-auto max-w-[300px]">
                      Informe seu e-mail corporativo e enviaremos as instruções de redefinição.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-1.5">
                      <label htmlFor="forgot-email" className="text-xs font-semibold text-slate-700">
                        E-mail corporativo
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                          id="forgot-email"
                          type="email"
                          placeholder="marina.rocha@omnilaudo.com.br"
                          {...register('email')}
                          autoFocus
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

                    <motion.button
                      type="submit"
                      whileTap={{ scale: 0.98 }}
                      className="w-full h-12 rounded-md font-bold text-sm flex items-center justify-center gap-2
                        bg-[#1d4ed8] text-white hover:bg-[#1e40af] shadow-md shadow-blue-900/10
                        transition-all duration-200"
                    >
                      Enviar link de redefinição <Send className="h-4 w-4" />
                    </motion.button>

                    <Link
                      to="/login"
                      className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors mt-6"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Voltar ao login
                    </Link>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                    className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center"
                  >
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                  </motion.div>

                  <h2 className="text-2xl font-bold text-[#0f172a] tracking-tight mb-2">
                    E-mail enviado!
                  </h2>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">
                    Enviamos as instruções para: <strong className="text-[#0f172a]">{submittedEmail}</strong>
                  </p>
                  
                  <div className="space-y-4">
                    <Link
                      to="/login"
                      className="block w-full h-12 rounded-md font-bold text-sm
                        bg-[#1d4ed8] text-white hover:bg-[#1e40af] shadow-md shadow-blue-900/10
                        transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" /> Voltar ao login
                    </Link>

                    <button
                      onClick={() => setSent(false)}
                      className="text-xs font-semibold text-slate-400 hover:text-blue-600 transition-all"
                    >
                      Não recebeu? Tentar novamente
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Compliance Notice */}
            <div className="mt-12 p-4 rounded border border-slate-100 bg-slate-50/50 flex gap-3">
              <CheckCircle2 className="h-4 w-4 text-slate-300 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-400 leading-relaxed">
                 Todos os processos de recuperação de acesso são auditados conforme exigências da <strong className="text-slate-600">LGPD</strong>.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="p-8 mt-auto flex flex-wrap justify-between items-center border-t border-slate-50 text-xs text-slate-400 gap-4">
           <div className="flex items-center gap-2">
             <MonitorDot className="h-3.5 w-3.5" />
             <span>Recuperação segura OmniLaudo</span>
           </div>
           <div className="flex items-center gap-6">
             <span className="hover:text-blue-600 cursor-pointer">Termos de uso</span>
             <span className="hover:text-blue-600 cursor-pointer">Privacidade</span>
             <span className="hover:text-blue-600 cursor-pointer">Suporte</span>
           </div>
        </div>
      </div>
    </div>
  );
}
