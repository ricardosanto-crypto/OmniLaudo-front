import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { Input } from '../../components/ui/input';
import { useUnidades } from '../../hooks/useUnidades';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { SalaResponse } from '../../types/sala';
import { AcaoCrud } from '../../components/ui/acao-crud';
import { applyFormErrors } from '../../services/errorHandler';

const salaSchema = z.object({
  nome: z.string().min(1, 'Nome da sala é obrigatório'),
  unidadeId: z.string().min(1, 'Selecione uma unidade'),
});

export type SalaFormInputs = z.infer<typeof salaSchema>;

interface SalaFormProps {
  initialData?: SalaResponse | null;
  onSubmit: (data: SalaFormInputs) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export function SalaForm({ initialData, onSubmit, isLoading, onCancel }: SalaFormProps) {
  const { data: unidadesPage } = useUnidades(0, 100); 
  const { register, handleSubmit, control, reset, setError, formState: { errors } } = useForm<SalaFormInputs>({
    resolver: zodResolver(salaSchema),
    defaultValues: {
      nome: initialData?.nome || '',
      unidadeId: initialData?.unidadeId || ''
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        nome: initialData.nome,
        unidadeId: initialData.unidadeId
      });
    } else {
      reset({ nome: '', unidadeId: '' });
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: SalaFormInputs) => {
    try {
      await onSubmit(data);
    } catch (error) {
      applyFormErrors(error, setError);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Nome da Sala</label>
        <Input 
          {...register('nome')} 
          placeholder="Ex: Sala de Ressonância 01" 
          className={errors.nome ? 'border-red-500 focus-visible:ring-red-500' : ''}
        />
        {errors.nome && <p className="text-red-500 text-xs">{String(errors.nome.message)}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Unidade Responsável</label>
        <Controller
          control={control}
          name="unidadeId"
          render={({ field }) => {
            const selectedUnidade = unidadesPage?.content.find((un) => un.id === field.value);

            return (
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <SelectTrigger className={errors.unidadeId ? 'border-red-500 focus-visible:ring-red-500' : ''}>
                  <SelectValue placeholder="Selecione a unidade">
                    {selectedUnidade ? selectedUnidade.nome : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {unidadesPage?.content.map((un) => (
                    <SelectItem key={un.id} value={un.id}>{un.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          }}
        />
        {errors.unidadeId && <p className="text-red-500 text-xs">{String(errors.unidadeId.message)}</p>}
      </div>

      <AcaoCrud 
        onCancel={onCancel} 
        isLoading={isLoading} 
        labelSuccess={initialData ? "Salvar Alterações" : "Criar Sala"} 
      />
    </form>
  );
}
