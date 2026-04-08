import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../components/ui/input';
import { AcaoCrud } from '../../components/ui/acao-crud';

const pacienteSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  sobrenome: z.string().min(1, 'Sobrenome é obrigatório'),
  documento: z.string().min(1, 'Documento (CPF) é obrigatório'),
  dataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  genero: z.string().min(1, 'Gênero é obrigatório'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  telefone: z.string().optional(),
  seguroSaude: z.string().optional(),
  numeroCarteiraSeguro: z.string().optional(),
});

export function PacienteForm({ initialData, onSubmit, isLoading, onCancel }: any) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(pacienteSchema),
    defaultValues: initialData || {}
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto px-1">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-gray-500">Nome</label>
          <Input {...register('nome')} />
          {errors.nome && <p className="text-red-500 text-xs">{String(errors.nome.message)}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-gray-500">Sobrenome</label>
          <Input {...register('sobrenome')} />
          {errors.sobrenome && <p className="text-red-500 text-xs">{String(errors.sobrenome.message)}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-gray-500">CPF / Documento</label>
          <Input {...register('documento')} />
          {errors.documento && <p className="text-red-500 text-xs">{String(errors.documento.message)}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-gray-500">Data de Nascimento</label>
          <Input type="date" {...register('dataNascimento')} />
          {errors.dataNascimento && <p className="text-red-500 text-xs">{String(errors.dataNascimento.message)}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-gray-500">Gênero</label>
          <select 
            {...register('genero')} 
            className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Selecione</option>
            <option value="MASCULINO">Masculino</option>
            <option value="FEMININO">Feminino</option>
            <option value="OUTRO">Outro</option>
          </select>
          {errors.genero && <p className="text-red-500 text-xs">{String(errors.genero.message)}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-gray-500">Telefone</label>
          <Input {...register('telefone')} placeholder="(11) 99999-9999" />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold uppercase text-gray-500">Convênio / Seguro Saúde</label>
        <Input {...register('seguroSaude')} placeholder="Ex: Unimed, Bradesco..." />
      </div>

      <AcaoCrud 
        onCancel={onCancel} 
        isLoading={isLoading} 
        labelSuccess={initialData ? "Salvar Alterações" : "Salvar Paciente"} 
      />
    </form>
  );
}
