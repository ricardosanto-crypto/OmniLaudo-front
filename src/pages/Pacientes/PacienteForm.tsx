import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../components/ui/input';
import { AcaoCrud } from '../../components/ui/acao-crud';
import { PacienteResponse, PacienteRequest } from '../../types/paciente';
import { applyFormErrors } from '../../services/errorHandler'; // <-- NOVO IMPORT

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

type PacienteFormInputs = z.infer<typeof pacienteSchema>;

interface PacienteFormProps {
  initialData?: PacienteResponse | null;
  onSubmit: (data: PacienteRequest) => Promise<void>; // <-- AGORA É UMA PROMISE
  isLoading: boolean;
  onCancel: () => void;
}

export function PacienteForm({ initialData, onSubmit, isLoading, onCancel }: PacienteFormProps) {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<PacienteFormInputs>({
    resolver: zodResolver(pacienteSchema),
    defaultValues: (initialData || {}) as PacienteFormInputs
  });

  // WRAPPER DE INTERCEPTAÇÃO DE ERRO
  const handleFormSubmit = async (data: PacienteFormInputs) => {
    try {
      await onSubmit(data);
    } catch (error) {
      // Injeta os erros do Spring Boot nos campos correspondentes do React Hook Form
      applyFormErrors(error, setError);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto px-1">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-muted-foreground">Nome</label>
          <Input {...register('nome')} className={errors.nome ? 'border-red-500 focus-visible:ring-red-500' : ''} />
          {errors.nome && <p className="text-red-500 text-xs">{String(errors.nome.message)}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-muted-foreground">Sobrenome</label>
          <Input {...register('sobrenome')} className={errors.sobrenome ? 'border-red-500 focus-visible:ring-red-500' : ''} />
          {errors.sobrenome && <p className="text-red-500 text-xs">{String(errors.sobrenome.message)}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-muted-foreground">CPF / Documento</label>
          <Input {...register('documento')} className={errors.documento ? 'border-red-500 focus-visible:ring-red-500' : ''} />
          {errors.documento && <p className="text-red-500 text-xs">{String(errors.documento.message)}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-muted-foreground">Data de Nascimento</label>
          <Input type="date" {...register('dataNascimento')} className={errors.dataNascimento ? 'border-red-500 focus-visible:ring-red-500' : ''} />
          {errors.dataNascimento && <p className="text-red-500 text-xs">{String(errors.dataNascimento.message)}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-muted-foreground">Gênero</label>
          <select 
            {...register('genero')} 
            className={`w-full h-8 rounded-lg border bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 ${errors.genero ? 'border-red-500 focus-visible:ring-red-500' : 'border-input'}`}
          >
            <option value="">Selecione</option>
            <option value="MASCULINO">Masculino</option>
            <option value="FEMININO">Feminino</option>
            <option value="OUTRO">Outro</option>
          </select>
          {errors.genero && <p className="text-red-500 text-xs">{String(errors.genero.message)}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-muted-foreground">Telefone</label>
          <Input {...register('telefone')} placeholder="(11) 99999-9999" />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold uppercase text-muted-foreground">Convênio / Seguro Saúde</label>
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
