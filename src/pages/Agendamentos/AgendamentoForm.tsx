import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { Input } from '../../components/ui/input';
import { usePacientes } from '../../hooks/usePacientes';
import { useEquipamentos } from '../../hooks/useEquipamentos';
import { useProcedimentosByModalidade } from '../../hooks/useProcedimentos';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { AcaoCrud } from '../../components/ui/acao-crud';
import { applyFormErrors } from '../../services/errorHandler';

import { PacienteResponse } from '../../types/paciente';
import { EquipamentoResponse } from '../../types/equipamento';
import { ProcedimentoResponse } from '../../types/procedimento';
import { AgendamentoRequest } from '../../types/agendamento';

const agendamentoSchema = z.object({
  pacienteId: z.string().min(1, 'Selecione o paciente'),
  equipamentoId: z.string().min(1, 'Selecione o equipamento'),
  procedimentoNome: z.string().min(1, 'Nome do procedimento é obrigatório'),
  procedimentoCodigo: z.string().min(1, 'Código TUSS é obrigatório'),
  dataHoraAgendada: z.string().min(1, 'Data e hora são obrigatórias'),
  duracaoEstimadaMinutos: z.coerce.number().default(30),
});

type AgendamentoFormInputs = z.infer<typeof agendamentoSchema>;

interface AgendamentoFormProps {
  onSubmit: (data: AgendamentoRequest) => Promise<void>; // PROMISE AQUI É A CHAVE!
  isLoading: boolean;
  onCancel: () => void;
}

export function AgendamentoForm({ onSubmit, isLoading, onCancel }: AgendamentoFormProps) {
  const [modalidadeSelecionada, setModalidadeSelecionada] = useState<string>();
  const { data: pacientes } = usePacientes(0, 100);
  const { data: equipamentos } = useEquipamentos(0, 100);
  const { data: procedimentosData, isLoading: isLoadingProcedimentos } = useProcedimentosByModalidade(modalidadeSelecionada);
  
  // Garantia de tipo limpa (sem "as any")
  const procedimentos = (Array.isArray(procedimentosData) ? procedimentosData : []) as ProcedimentoResponse[];

  const { register, handleSubmit, control, watch, setValue, setError, formState: { errors } } = useForm<AgendamentoFormInputs>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(agendamentoSchema) as any,
    defaultValues: { duracaoEstimadaMinutos: 30 }
  });

  const equipamentoIdSelecionado = watch('equipamentoId');

  // Quando selecionar um equipamento, atualizar a modalidade e limpar o procedimento
  useEffect(() => {
    if (equipamentoIdSelecionado && equipamentos?.content) {
      const equip = (equipamentos.content as EquipamentoResponse[]).find((e) => e.id === equipamentoIdSelecionado);
      setModalidadeSelecionada(equip?.modalidade);
      setValue('procedimentoCodigo', '');
      setValue('procedimentoNome', '');
    } else {
      setModalidadeSelecionada(undefined);
    }
  }, [equipamentoIdSelecionado, equipamentos, setValue]);

  // WRAPPER DE INTERCEPTAÇÃO DE ERROS
  const handleFormSubmit = async (data: AgendamentoFormInputs) => {
    try {
      await onSubmit(data as AgendamentoRequest);
    } catch (error) {
      // Injeta os erros recebidos do Spring Boot direto nos inputs do React
      applyFormErrors(error, setError);
    }
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <form onSubmit={handleSubmit(handleFormSubmit as any)} className="space-y-4 py-2">
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase text-muted-foreground">Paciente</label>
        <Controller
          control={control}
          name="pacienteId"
          render={({ field }) => {
            const selectedPaciente = (pacientes?.content as PacienteResponse[])?.find((p) => p.id === field.value);
            return (
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <SelectTrigger className={errors.pacienteId ? 'border-red-500 focus-visible:ring-red-500' : ''}>
                  <SelectValue placeholder="Selecione o paciente">
                    {selectedPaciente ? `${selectedPaciente.nome} ${selectedPaciente.sobrenome} (${selectedPaciente.documento})` : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(pacientes?.content as PacienteResponse[])?.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.nome} {p.sobrenome} ({p.documento})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          }}
        />
        {errors.pacienteId && <p className="text-red-500 text-xs">{String(errors.pacienteId.message)}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase text-muted-foreground">Equipamento / Exame</label>
        <Controller
          control={control}
          name="equipamentoId"
          render={({ field }) => {
            const selectedEquipamento = (equipamentos?.content as EquipamentoResponse[])?.find((e) => e.id === field.value);
            return (
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <SelectTrigger className={errors.equipamentoId ? 'border-red-500 focus-visible:ring-red-500' : ''}>
                  <SelectValue placeholder="Selecione o equipamento">
                    {selectedEquipamento ? `${selectedEquipamento.nome} (${selectedEquipamento.modalidade})` : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(equipamentos?.content as EquipamentoResponse[])?.map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.nome} ({e.modalidade})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          }}
        />
        {errors.equipamentoId && <p className="text-red-500 text-xs">{String(errors.equipamentoId.message)}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase text-muted-foreground">Procedimento (TUSS)</label>
        {procedimentos.length === 0 && modalidadeSelecionada && !isLoadingProcedimentos ? (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800/50 rounded text-yellow-800 dark:text-yellow-400 text-xs font-bold">
            Nenhum procedimento disponível para esta modalidade. Verifique com o administrador.
          </div>
        ) : (
          <Controller
            control={control}
            name="procedimentoCodigo"
            render={({ field }) => {
              const selectedProc = procedimentos.find((p) => p.codigo === field.value);
              return (
                <Select 
                  onValueChange={(codigo) => {
                    const proc = procedimentos.find((p) => p.codigo === codigo);
                    if (proc) {
                      setValue('procedimentoCodigo', proc.codigo);
                      setValue('procedimentoNome', proc.nome);
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      setValue('duracaoEstimadaMinutos', (proc.duracaoEstimadaMinutos as any) || 30);
                      field.onChange(codigo);
                    }
                  }} 
                  value={field.value || ""}
                  disabled={!modalidadeSelecionada || procedimentos.length === 0}
                >
                  <SelectTrigger className={errors.procedimentoCodigo ? 'border-red-500 focus-visible:ring-red-500' : ''}>
                    <SelectValue placeholder={modalidadeSelecionada ? (isLoadingProcedimentos ? "Carregando procedimentos..." : "Selecione um procedimento") : "Selecione um equipamento primeiro"}>
                      {selectedProc ? `${selectedProc.codigo} - ${selectedProc.nome}` : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {procedimentos.length > 0 ? (
                      procedimentos.map((p) => (
                        <SelectItem key={p.id} value={p.codigo}>
                          {p.codigo} - {p.nome} ({p.duracaoEstimadaMinutos} min)
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500 dark:text-slate-500">Sem procedimentos disponíveis</div>
                    )}
                  </SelectContent>
                </Select>
              );
            }}
          />
        )}
        {errors.procedimentoCodigo && <p className="text-red-500 text-xs">{String(errors.procedimentoCodigo.message)}</p>}
      </div>

      {/* Campo oculto que o Zod exige mas que preenchemos na seleção do Select */}
      <input type="hidden" {...register('procedimentoNome')} />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-muted-foreground">Data e Hora</label>
          <Input 
            type="datetime-local" 
            {...register('dataHoraAgendada')} 
            className={errors.dataHoraAgendada ? 'border-red-500 focus-visible:ring-red-500' : ''}
          />
          {errors.dataHoraAgendada && <p className="text-red-500 text-xs">{String(errors.dataHoraAgendada.message)}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-muted-foreground">Duração (min)</label>
          <Input 
            type="number" 
            {...register('duracaoEstimadaMinutos')} 
            className={errors.duracaoEstimadaMinutos ? 'border-red-500 focus-visible:ring-red-500' : ''}
          />
        </div>
      </div>

      <AcaoCrud 
        onCancel={onCancel} 
        isLoading={isLoading} 
        labelSuccess="Confirmar Agendamento" 
      />
    </form>
  );
}
