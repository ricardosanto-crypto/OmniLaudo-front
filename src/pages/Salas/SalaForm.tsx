import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { 
  Building2,
  CircleDot,
  Layout,
  DoorOpen
} from 'lucide-react';
import { Input } from '../../components/ui/input';
import { useUnidades } from '../../hooks/useUnidades';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { applyFormErrors } from '../../services/errorHandler';
import { SalaResponse, SalaRequest } from '../../types/sala';

const salaSchema = z.object({
  nome: z.string().min(1, 'O título é obrigatório'),
  unidadeId: z.string().min(1, 'A unidade é obrigatória'),
});

export type SalaFormInputs = z.infer<typeof salaSchema>;

interface SalaFormProps {
  initialData?: SalaResponse | null;
  onSubmit: (data: SalaRequest) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export function SalaForm({ initialData, onSubmit, isLoading, onCancel }: SalaFormProps) {
  const { data: unidadesPage } = useUnidades(0, 100);
  const { register, handleSubmit, control, reset, setError, formState: { errors } } = useForm<SalaFormInputs>({
    resolver: zodResolver(salaSchema),
    defaultValues: {
      nome: initialData?.nome || '',
      unidadeId: initialData?.unidadeId || '',
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        nome: initialData.nome,
        unidadeId: initialData.unidadeId,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: SalaFormInputs) => {
    try {
      await onSubmit(data as SalaRequest);
    } catch (error) {
      applyFormErrors(error, setError);
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

  const inputClass = "h-7 bg-muted/20 border border-border/40 hover:bg-muted/40 focus:bg-background focus:border-primary shadow-sm rounded-md text-xs font-medium px-2 transition-all w-full max-w-[280px]";

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="space-y-0.5 mb-5">
          <PropertyRow label="Nome" icon={DoorOpen} error={errors.nome?.message}>
            <Input {...register('nome')} placeholder="Ex: Sala de Ressonância 01" className={inputClass} />
          </PropertyRow>

          <PropertyRow label="Unidade" icon={Building2} error={errors.unidadeId?.message}>
            <Controller
              control={control}
              name="unidadeId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <SelectTrigger className={inputClass}>
                    <SelectValue placeholder="Selecione a unidade..." />
                  </SelectTrigger>
                  <SelectContent>
                    {unidadesPage?.content.map(u => (
                      <SelectItem key={u.id} value={u.id}>{u.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </PropertyRow>

          <PropertyRow label="Status" icon={CircleDot}>
            <div className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-bold gap-1.5 border border-emerald-500/20">
              <div className="w-1 h-1 rounded-full bg-emerald-500" />
              {initialData?.ativo !== false ? 'Ativa' : 'Inativa'}
            </div>
          </PropertyRow>

          <PropertyRow label="Tipo" icon={Layout}>
            <div className="inline-flex px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold border border-primary/20">
              Exame de Imagem
            </div>
          </PropertyRow>
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
          {isLoading ? "Salvando..." : (initialData ? "Salvar Sala" : "Criar Sala")}
        </Button>
      </div>
    </form>
  );
}
