import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { Input } from '../../components/ui/input';
import { UnidadeRequest, UnidadeResponse } from '../../types/unidade';
import { AcaoCrud } from '../../components/ui/acao-crud';

const unidadeSchema = z.object({
  nome: z.string().min(1, 'O nome da unidade é obrigatório'),
  cnpj: z.string().optional(),
  endereco: z.string().optional(),
  telefone: z.string().optional(),
});

export type UnidadeFormInputs = z.infer<typeof unidadeSchema>;

interface UnidadeFormProps {
  initialData?: UnidadeResponse | null;
  onSubmit: (data: UnidadeRequest) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export function UnidadeForm({ initialData, onSubmit, isLoading, onCancel }: UnidadeFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UnidadeFormInputs>({
    resolver: zodResolver(unidadeSchema),
    defaultValues: {
      nome: initialData?.nome || '',
      cnpj: initialData?.cnpj || '',
      endereco: initialData?.endereco || '',
      telefone: initialData?.telefone || '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        nome: initialData.nome,
        cnpj: initialData.cnpj || '',
        endereco: initialData.endereco || '',
        telefone: initialData.telefone || '',
      });
    } else {
      reset({ nome: '', cnpj: '', endereco: '', telefone: '' });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Nome da Unidade <span className="text-red-500">*</span></label>
        <Input 
          placeholder="Ex: OmniLaudo - Matriz" 
          {...register('nome')} 
          className={errors.nome ? 'border-red-500' : ''} 
        />
        {errors.nome && <p className="text-red-500 text-xs">{errors.nome.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">CNPJ</label>
        <Input placeholder="Apenas números" {...register('cnpj')} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Endereço Completo</label>
        <Input placeholder="Av. Central, 1000" {...register('endereco')} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Telefone</label>
        <Input placeholder="(11) 99999-9999" {...register('telefone')} />
      </div>

      <AcaoCrud 
        onCancel={onCancel} 
        isLoading={isLoading} 
        labelSuccess={initialData ? "Salvar Alterações" : "Criar Unidade"} 
      />
    </form>
  );
}
