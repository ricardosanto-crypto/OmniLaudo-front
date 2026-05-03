import { useForm, useWatch, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import {
  MapPin,
  Phone,
  Fingerprint,
  CircleDot,
  Building2,

  ExternalLink,
  Share2,
  Search,
  Loader2
} from 'lucide-react';
import { Input } from '../../components/ui/input';
import { UnidadeRequest, UnidadeResponse } from '../../types/unidade';
import { Button } from '../../components/ui/button';
import { applyFormErrors } from '../../services/errorHandler';
import { cn } from '../../lib/utils';

const unidadeSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório'),
  cnpj: z.string().optional(),
  telefone: z.string().optional(),
  cep: z.string().optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().length(2, 'A sigla do estado deve ter 2 letras').optional().or(z.literal('')),
});

type UnidadeFormInputs = z.infer<typeof unidadeSchema>;

interface UnidadeFormProps {
  initialData?: UnidadeResponse | null;
  onSubmit: (data: UnidadeRequest) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

function MapPreview({ control }: { control: Control<UnidadeFormInputs> }) {
  const [debouncedMapQuery, setDebouncedMapQuery] = useState('');

  const logradouro = useWatch({ control, name: 'logradouro' });
  const numero = useWatch({ control, name: 'numero' });
  const cidade = useWatch({ control, name: 'cidade' });
  const estado = useWatch({ control, name: 'estado' });

  useEffect(() => {
    const parts = [logradouro, numero, cidade, estado].filter(Boolean);
    const query = parts.length > 0 ? encodeURIComponent(parts.join(', ')) : '';
    
    const handler = setTimeout(() => {
      setDebouncedMapQuery(query);
    }, 800);

    return () => clearTimeout(handler);
  }, [logradouro, numero, cidade, estado]);

  if (!debouncedMapQuery) return null;

  return (
    <div className="mt-4 border border-border/50 rounded-xl overflow-hidden bg-muted/10 shadow-sm relative group h-40">
      
      {/* Botões Overlay Customizados */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            const url = `https://www.google.com/maps/search/?api=1&query=${debouncedMapQuery}`;
            if (navigator.share) {
              navigator.share({ title: 'Localização da Unidade', url }).catch(() => {});
            } else {
              navigator.clipboard.writeText(url);
              alert('Link copiado para a área de transferência!');
            }
          }}
          className="flex items-center gap-1.5 bg-background/90 backdrop-blur-sm border border-border px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg hover:bg-background transition-colors text-foreground"
        >
          <Share2 size={12} />
          Compartilhar
        </button>
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${debouncedMapQuery}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-primary/90 backdrop-blur-sm border border-primary px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg hover:bg-primary transition-colors text-primary-foreground"
        >
          <ExternalLink size={12} />
          Abrir no Maps
        </a>
      </div>

      {/* Container do iframe (cortando o top-left) */}
      <div className="absolute inset-0 top-[-56px] w-full h-[calc(100%+56px)] bg-muted flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
        <iframe 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          loading="lazy" 
          allowFullScreen 
          src={`https://maps.google.com/maps?q=${debouncedMapQuery}&t=m&z=15&output=embed&iwloc=near`}
        />
      </div>
    </div>
  );
}

export function UnidadeForm({ initialData, onSubmit, isLoading, onCancel }: UnidadeFormProps) {
  const [isFetchingCep, setIsFetchingCep] = useState(false);

  const { register, handleSubmit, reset, setValue, setError, control, formState: { errors } } = useForm<UnidadeFormInputs>({
    resolver: zodResolver(unidadeSchema),
    defaultValues: {
      nome: initialData?.nome || '',
      cnpj: initialData?.cnpj || '',
      telefone: initialData?.telefone || '',
      cep: initialData?.cep || '',
      logradouro: initialData?.logradouro || '',
      numero: initialData?.numero || '',
      complemento: initialData?.complemento || '',
      bairro: initialData?.bairro || '',
      cidade: initialData?.cidade || '',
      estado: initialData?.estado || '',
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        nome: initialData.nome,
        cnpj: initialData.cnpj || '',
        telefone: initialData.telefone || '',
        cep: initialData.cep || '',
        logradouro: initialData.logradouro || '',
        numero: initialData.numero || '',
        complemento: initialData.complemento || '',
        bairro: initialData.bairro || '',
        cidade: initialData.cidade || '',
        estado: initialData.estado || '',
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: UnidadeFormInputs) => {
    try {
      await onSubmit(data as UnidadeRequest);
    } catch (error) {
      applyFormErrors(error, setError);
    }
  };

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      setIsFetchingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setValue('logradouro', data.logradouro, { shouldValidate: true });
          setValue('bairro', data.bairro, { shouldValidate: true });
          setValue('cidade', data.localidade, { shouldValidate: true });
          setValue('estado', data.uf, { shouldValidate: true });
        }
      } catch (err) {
        console.error('Erro ao buscar CEP:', err);
      } finally {
        setIsFetchingCep(false);
      }
    }
  };

  const PropertyRow = ({ label, icon: Icon, children, error }: { label: string, icon: React.ElementType, children: React.ReactNode, error?: string }) => (
    <div className="flex sm:items-center gap-2 py-1 flex-col sm:flex-row items-start min-h-[26px]">
      <div className="flex items-center gap-2 w-28 shrink-0 text-muted-foreground pt-1 sm:pt-0">
        <Icon size={14} strokeWidth={1.5} />
        <span className="text-[11px] font-medium text-muted-foreground cursor-pointer">
          {label}
        </span>
      </div>
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center min-h-[26px] w-full">
        {children}
        {error && <p className="text-[10px] font-semibold text-destructive sm:ml-2 mt-1 sm:mt-0">{error}</p>}
      </div>
    </div>
  );

  const inputClass = "h-7 bg-muted/20 border border-border/40 hover:bg-muted/40 focus:bg-background focus:border-primary shadow-sm rounded-md text-xs font-medium px-2 transition-all w-full";



  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="space-y-6 mb-5">
          
          {/* Identificação Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
              <div className="h-[1px] flex-1 bg-border/50" />
              <span>Identificação</span>
              <div className="h-[1px] flex-1 bg-border/50" />
            </h3>
            
            <div className="space-y-0.5">
              <PropertyRow label="Nome" icon={Building2} error={errors.nome?.message}>
                <Input {...register('nome')} placeholder="Ex: Unidade Central" className={cn(inputClass, "max-w-[280px]")} />
              </PropertyRow>

              <PropertyRow label="CNPJ" icon={Fingerprint} error={errors.cnpj?.message}>
                <Input {...register('cnpj')} placeholder="Ex: 00.000.000/0000-00" className={cn(inputClass, "max-w-[280px]")} />
              </PropertyRow>

              <PropertyRow label="Telefone" icon={Phone} error={errors.telefone?.message}>
                <Input {...register('telefone')} placeholder="Ex: (00) 0000-0000" className={cn(inputClass, "max-w-[280px]")} />
              </PropertyRow>

              <PropertyRow label="Status" icon={CircleDot}>
                <div className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-bold gap-1.5 border border-emerald-500/20">
                  <div className="w-1 h-1 rounded-full bg-emerald-500" />
                  {initialData?.ativo !== false ? 'Ativa' : 'Inativa'}
                </div>
              </PropertyRow>
            </div>
          </div>

          {/* Endereço Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
              <div className="h-[1px] flex-1 bg-border/50" />
              <span>Localização</span>
              <div className="h-[1px] flex-1 bg-border/50" />
            </h3>

            <div className="space-y-0.5">
              <PropertyRow label="CEP" icon={Search} error={errors.cep?.message}>
                <div className="relative w-full max-w-[140px]">
                  <Input 
                    {...register('cep')} 
                    onBlur={handleCepBlur}
                    placeholder="00000-000" 
                    className={inputClass} 
                    maxLength={9}
                  />
                  {isFetchingCep && <Loader2 className="absolute right-2 top-1.5 h-4 w-4 animate-spin text-muted-foreground" />}
                </div>
              </PropertyRow>

              <PropertyRow label="Logradouro" icon={MapPin} error={errors.logradouro?.message}>
                <Input {...register('logradouro')} placeholder="Avenida, Rua..." className={cn(inputClass, "max-w-[280px]")} />
              </PropertyRow>

              <div className="flex gap-4">
                <div className="flex-1">
                  <PropertyRow label="Número" icon={MapPin} error={errors.numero?.message}>
                    <Input {...register('numero')} placeholder="1000" className={cn(inputClass, "max-w-[100px]")} />
                  </PropertyRow>
                </div>
              </div>

              <PropertyRow label="Complemento" icon={MapPin} error={errors.complemento?.message}>
                <Input {...register('complemento')} placeholder="Sala 101, Andar 2" className={cn(inputClass, "max-w-[280px]")} />
              </PropertyRow>

              <PropertyRow label="Bairro" icon={MapPin} error={errors.bairro?.message}>
                <Input {...register('bairro')} placeholder="Centro" className={cn(inputClass, "max-w-[280px]")} />
              </PropertyRow>

              <div className="flex gap-4 items-center">
                <PropertyRow label="Cidade" icon={MapPin} error={errors.cidade?.message}>
                  <Input {...register('cidade')} placeholder="São Paulo" className={cn(inputClass, "max-w-[160px]")} />
                </PropertyRow>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-muted-foreground">UF</span>
                  <Input {...register('estado')} placeholder="SP" maxLength={2} className={cn(inputClass, "w-12 uppercase")} />
                </div>
              </div>
            </div>

            {/* Mapa Preview */}
            <MapPreview control={control} />
          </div>
        </div>
      </div>

      <div className="pt-4 mt-2 flex items-center justify-end gap-3 shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="h-8 px-4 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          size="sm"
          className="h-8 px-4 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm shadow-primary/20"
        >
          {isLoading ? "Salvando..." : (initialData ? "Salvar Unidade" : "Criar Unidade")}
        </Button>
      </div>
    </form>
  );
}
