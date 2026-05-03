import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { Hash, Layers, Palette } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { applyFormErrors } from '../../services/errorHandler';
import { ModalidadeResponse, ModalidadeRequest } from '../../types/modalidade';
import { cn } from '../../lib/utils';

const modalidadeSchema = z.object({
  sigla: z.string().min(1, 'Sigla é obrigatória').max(10, 'Máximo 10 caracteres'),
  nome: z.string().min(1, 'Nome é obrigatório'),
  corHex: z.string().optional(),
});

type ModalidadeFormInputs = z.infer<typeof modalidadeSchema>;

interface ModalidadeFormProps {
  initialData?: ModalidadeResponse | null;
  onSubmit: (data: ModalidadeRequest) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

const DEFAULT_COLOR = '#4F46E5';

const CORES_SUGERIDAS = [
  { label: 'Índigo',     hex: '#4F46E5', desc: 'RM' },
  { label: 'Esmeralda', hex: '#10B981', desc: 'US' },
  { label: 'Âmbar',     hex: '#F59E0B', desc: 'RX' },
  { label: 'Violeta',   hex: '#8B5CF6', desc: 'TC' },
  { label: 'Rosa',      hex: '#EC4899', desc: 'MG' },
  { label: 'Ciano',     hex: '#06B6D4', desc: 'NM' },
  { label: 'Laranja',   hex: '#F97316', desc: 'PET' },
  { label: 'Vermelho',  hex: '#EF4444', desc: 'Angio' },
];

export function ModalidadeForm({ initialData, onSubmit, isLoading, onCancel }: ModalidadeFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ModalidadeFormInputs>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(modalidadeSchema) as any,
    defaultValues: { sigla: '', nome: '', corHex: DEFAULT_COLOR },
  });

  useEffect(() => {
    reset({
      sigla: initialData?.sigla || '',
      nome: initialData?.nome || '',
      corHex: initialData?.corHex || DEFAULT_COLOR,
    });
  }, [initialData, reset]);

  const handleFormSubmit = async (data: ModalidadeFormInputs) => {
    try {
      await onSubmit({
        sigla: data.sigla.toUpperCase(),
        nome: data.nome,
        corHex: data.corHex || undefined,
      });
    } catch (error) {
      applyFormErrors(error, setError);
    }
  };

  const corAtual = watch('corHex') || DEFAULT_COLOR;
  const siglaAtual = watch('sigla');
  const nomeAtual = watch('nome');

  const FieldLabel = ({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) => (
    <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-1.5">
      <Icon size={10} />
      {children}
    </label>
  );

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSubmit={handleSubmit(handleFormSubmit as any)}
      className="flex flex-col h-full"
    >
      <div className="flex-1 flex flex-col gap-5 overflow-y-auto custom-scrollbar pb-1">

        {/* Linha 1: Sigla + Color Picker */}
        <div className="flex gap-3 items-start">
          <div className="flex-1 min-w-0">
            <FieldLabel icon={Hash}>Sigla</FieldLabel>
            <Input
              {...register('sigla')}
              placeholder="Ex: MR, CT, US"
              maxLength={10}
              className={cn(
                'h-9 bg-background border-2 rounded-xl text-sm font-bold uppercase tracking-wider px-3',
                'placeholder:font-normal placeholder:tracking-normal placeholder:text-muted-foreground/40',
                'focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors',
                errors.sigla
                  ? 'border-destructive/60'
                  : 'border-border hover:border-border/80 focus-visible:border-primary'
              )}
              onChange={(e) => setValue('sigla', e.target.value.toUpperCase())}
            />
            {errors.sigla && (
              <p className="text-[10px] text-destructive mt-1">{errors.sigla.message}</p>
            )}
          </div>

          <div className="shrink-0">
            <FieldLabel icon={Palette}>Cor</FieldLabel>
            <label
              className="flex items-center gap-2 h-9 px-2.5 rounded-xl border-2 border-border hover:border-border/80 bg-background cursor-pointer transition-colors"
              title="Escolher cor"
            >
              <div
                className="w-5 h-5 rounded-md shrink-0 shadow-sm border border-white/10"
                style={{ backgroundColor: corAtual }}
              />
              <span className="text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                {corAtual.toUpperCase()}
              </span>
              <input
                type="color"
                value={corAtual}
                onChange={(e) => setValue('corHex', e.target.value)}
                className="sr-only"
              />
            </label>
          </div>
        </div>

        {/* Nome */}
        <div>
          <FieldLabel icon={Layers}>Nome Completo</FieldLabel>
          <Input
            {...register('nome')}
            placeholder="Ex: Ressonância Magnética"
            className={cn(
              'h-9 bg-background border-2 rounded-xl text-sm px-3',
              'placeholder:text-muted-foreground/40',
              'focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors',
              errors.nome
                ? 'border-destructive/60'
                : 'border-border hover:border-border/80 focus-visible:border-primary'
            )}
          />
          {errors.nome && (
            <p className="text-[10px] text-destructive mt-1">{errors.nome.message}</p>
          )}
        </div>

        {/* Cores sugeridas */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-border/40" />
            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 px-1">
              Atalhos de Cor
            </span>
            <div className="h-px flex-1 bg-border/40" />
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {CORES_SUGERIDAS.map((cor) => {
              const isSelected = corAtual.toLowerCase() === cor.hex.toLowerCase();
              return (
                <button
                  key={cor.hex}
                  type="button"
                  onClick={() => setValue('corHex', cor.hex)}
                  className={cn(
                    'group flex flex-col items-center gap-1 py-2 px-1 rounded-xl border transition-all duration-150',
                    isSelected
                      ? 'border-current shadow-sm'
                      : 'border-border/50 hover:border-border bg-muted/5 hover:bg-muted/20'
                  )}
                  style={isSelected ? { borderColor: `${cor.hex}70`, backgroundColor: `${cor.hex}12` } : undefined}
                >
                  <div
                    className="w-5 h-5 rounded-full shadow-sm transition-transform group-hover:scale-110"
                    style={{ backgroundColor: cor.hex, boxShadow: isSelected ? `0 0 0 3px ${cor.hex}35` : undefined }}
                  />
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider leading-none"
                    style={{ color: isSelected ? cor.hex : undefined }}
                  >
                    {cor.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Preview badge — aparece só quando tem sigla */}
        {siglaAtual && (
          <div
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl border"
            style={{ borderColor: `${corAtual}40`, backgroundColor: `${corAtual}0d` }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0"
              style={{ backgroundColor: `${corAtual}25`, color: corAtual }}
            >
              {siglaAtual.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-bold truncate" style={{ color: corAtual }}>
                {siglaAtual.toUpperCase()}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {nomeAtual || 'Nome da modalidade'}
              </p>
            </div>
            <span
              className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0"
              style={{ backgroundColor: `${corAtual}20`, color: corAtual }}
            >
              Preview
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-border/40 flex items-center justify-end gap-2 shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="h-8 px-4 text-[12px] font-medium"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          size="sm"
          className="h-8 px-5 text-[12px] font-semibold rounded-xl shadow-md shadow-primary/20"
        >
          {isLoading ? 'Salvando...' : initialData ? 'Salvar' : 'Criar Modalidade'}
        </Button>
      </div>
    </form>
  );
}
