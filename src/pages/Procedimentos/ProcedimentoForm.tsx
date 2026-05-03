import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { Hash, Layers, Clock, Activity, Settings2 } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { applyFormErrors } from '../../services/errorHandler';
import { ProcedimentoResponse, ProcedimentoRequest } from '../../types/procedimento';
import { ModalidadeResponse } from '../../types/modalidade';
import { cn } from '../../lib/utils';

const procedimentoSchema = z.object({
  codigo: z.string().min(1, 'Código é obrigatório'),
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
  modalidadeId: z.string().min(1, 'Modalidade é obrigatória'),
  duracaoEstimadaMinutos: z.number().min(1, 'Mínimo de 1 minuto'),
});

type ProcedimentoFormInputs = z.infer<typeof procedimentoSchema>;

interface ProcedimentoFormProps {
  initialData?: ProcedimentoResponse | null;
  modalidades: ModalidadeResponse[];
  onSubmit: (data: ProcedimentoRequest) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export function ProcedimentoForm({ initialData, modalidades, onSubmit, isLoading, onCancel }: ProcedimentoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ProcedimentoFormInputs>({
    resolver: zodResolver(procedimentoSchema),
    defaultValues: { codigo: '', nome: '', descricao: '', modalidadeId: '', duracaoEstimadaMinutos: 15 },
  });

  useEffect(() => {
    reset({
      codigo: initialData?.codigo || '',
      nome: initialData?.nome || '',
      descricao: initialData?.descricao || '',
      modalidadeId: initialData?.modalidadeId || '',
      duracaoEstimadaMinutos: initialData?.duracaoEstimadaMinutos || 15,
    });
  }, [initialData, reset]);

  const handleFormSubmit = async (data: ProcedimentoFormInputs) => {
    try {
      await onSubmit({
        codigo: data.codigo.trim(),
        nome: data.nome.trim(),
        descricao: data.descricao?.trim(),
        modalidadeId: data.modalidadeId,
        duracaoEstimadaMinutos: data.duracaoEstimadaMinutos,
      });
    } catch (error) {
      applyFormErrors(error, setError);
    }
  };

  const FieldLabel = ({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) => (
    <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-1.5">
      <Icon size={10} />
      {children}
    </label>
  );

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col h-full">
      <div className="flex-1 flex flex-col gap-5 overflow-y-auto custom-scrollbar pb-1">

        {/* Modalidade */}
        <div>
          <FieldLabel icon={Settings2}>Modalidade Vinculada</FieldLabel>
          <select
            {...register('modalidadeId')}
            className={cn(
              'flex h-9 w-full rounded-xl border-2 bg-background px-3 py-1 text-sm shadow-sm transition-colors',
              'focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary',
              errors.modalidadeId ? 'border-destructive/60' : 'border-border hover:border-border/80'
            )}
          >
            <option value="" disabled>Selecione a Modalidade</option>
            {modalidades.map((m) => (
              <option key={m.id} value={m.id}>
                {m.sigla} - {m.nome}
              </option>
            ))}
          </select>
          {errors.modalidadeId && (
            <p className="text-[10px] text-destructive mt-1">{errors.modalidadeId.message}</p>
          )}
        </div>

        {/* Linha 1: Código + Duração */}
        <div className="flex gap-3 items-start">
          <div className="flex-1 min-w-0">
            <FieldLabel icon={Hash}>Código (TUSS)</FieldLabel>
            <Input
              {...register('codigo')}
              placeholder="Ex: 40101010"
              className={cn(
                'h-9 bg-background border-2 rounded-xl text-sm font-bold tracking-wider px-3',
                'placeholder:font-normal placeholder:tracking-normal placeholder:text-muted-foreground/40',
                'focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors',
                errors.codigo ? 'border-destructive/60' : 'border-border hover:border-border/80 focus-visible:border-primary'
              )}
            />
            {errors.codigo && (
              <p className="text-[10px] text-destructive mt-1">{errors.codigo.message}</p>
            )}
          </div>

          <div className="w-28 shrink-0">
            <FieldLabel icon={Clock}>Duração (min)</FieldLabel>
            <Input
              type="number"
              {...register('duracaoEstimadaMinutos', { valueAsNumber: true })}
              className={cn(
                'h-9 bg-background border-2 rounded-xl text-sm font-bold text-center',
                'focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors',
                errors.duracaoEstimadaMinutos ? 'border-destructive/60' : 'border-border hover:border-border/80 focus-visible:border-primary'
              )}
            />
            {errors.duracaoEstimadaMinutos && (
              <p className="text-[10px] text-destructive mt-1">{errors.duracaoEstimadaMinutos.message}</p>
            )}
          </div>
        </div>

        {/* Nome */}
        <div>
          <FieldLabel icon={Layers}>Nome do Procedimento</FieldLabel>
          <Input
            {...register('nome')}
            placeholder="Ex: RM DE CRÂNIO COM CONTRASTE"
            className={cn(
              'h-9 bg-background border-2 rounded-xl text-sm px-3 uppercase',
              'placeholder:text-muted-foreground/40 placeholder:normal-case',
              'focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors',
              errors.nome ? 'border-destructive/60' : 'border-border hover:border-border/80 focus-visible:border-primary'
            )}
            onChange={(e) => setValue('nome', e.target.value.toUpperCase())}
          />
          {errors.nome && (
            <p className="text-[10px] text-destructive mt-1">{errors.nome.message}</p>
          )}
        </div>

        {/* Descrição */}
        <div>
          <FieldLabel icon={Activity}>Descrição (Opcional)</FieldLabel>
          <textarea
            {...register('descricao')}
            placeholder="Detalhes adicionais sobre o procedimento..."
            className={cn(
              'flex min-h-[80px] w-full rounded-xl border-2 bg-background px-3 py-2 text-sm shadow-sm transition-colors resize-none custom-scrollbar',
              'placeholder:text-muted-foreground/40',
              'focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary',
              errors.descricao ? 'border-destructive/60' : 'border-border hover:border-border/80'
            )}
          />
          {errors.descricao && (
            <p className="text-[10px] text-destructive mt-1">{errors.descricao.message}</p>
          )}
        </div>

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
          {isLoading ? 'Salvando...' : initialData ? 'Salvar' : 'Criar Procedimento'}
        </Button>
      </div>
    </form>
  );
}
