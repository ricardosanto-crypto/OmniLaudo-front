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

const agendamentoSchema = z.object({
  pacienteId: z.string().min(1, 'Selecione o paciente'),
  equipamentoId: z.string().min(1, 'Selecione o equipamento'),
  procedimentoNome: z.string().min(1, 'Nome do procedimento é obrigatório'),
  procedimentoCodigo: z.string().min(1, 'Código TUSS é obrigatório'),
  dataHoraAgendada: z.string().min(1, 'Data e hora são obrigatórias'),
  duracaoEstimadaMinutos: z.coerce.number().default(30),
});

export function AgendamentoForm({ onSubmit, isLoading, onCancel }: any) {
  const [modalidadeSelecionada, setModalidadeSelecionada] = useState<string>();
  const { data: pacientes } = usePacientes(0, 100);
  const { data: equipamentos } = useEquipamentos(0, 100);
  const { data: procedimentosData, isLoading: isLoadingProcedimentos } = useProcedimentosByModalidade(modalidadeSelecionada);
  const procedimentos = Array.isArray(procedimentosData) ? procedimentosData : [];

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(agendamentoSchema),
    defaultValues: { duracaoEstimadaMinutos: 30 }
  });

  const equipamentoIdSelecionado = watch('equipamentoId');

  // Quando selecionar um equipamento, atualizar a modalidade e limpar o procedimento
  useEffect(() => {
    if (equipamentoIdSelecionado && equipamentos?.content) {
      const equip = equipamentos.content.find((e: any) => e.id === equipamentoIdSelecionado);
      setModalidadeSelecionada(equip?.modalidade);
      setValue('procedimentoCodigo', '');
      setValue('procedimentoNome', '');
    } else {
      setModalidadeSelecionada(undefined);
    }
  }, [equipamentoIdSelecionado, equipamentos, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Paciente</label>
        <Controller
          control={control}
          name="pacienteId"
          render={({ field }) => {
            const selectedPaciente = pacientes?.content?.find((p: any) => p.id === field.value);
            return (
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o paciente">
                    {selectedPaciente ? `${selectedPaciente.nome} ${selectedPaciente.sobrenome} (${selectedPaciente.documento})` : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {pacientes?.content?.map((p: any) => (
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
        <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Equipamento / Exame</label>
        <Controller
          control={control}
          name="equipamentoId"
          render={({ field }) => {
            const selectedEquipamento = equipamentos?.content?.find((e: any) => e.id === field.value);
            return (
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o equipamento">
                    {selectedEquipamento ? `${selectedEquipamento.nome} (${selectedEquipamento.modalidade})` : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {equipamentos?.content?.map((e: any) => (
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
        <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Procedimento (TUSS)</label>
        {procedimentos.length === 0 && modalidadeSelecionada && !isLoadingProcedimentos ? (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800/50 rounded text-yellow-800 dark:text-yellow-400 text-xs">
            Nenhum procedimento disponível para esta modalidade. Verifique com o administrador.
          </div>
        ) : (
          <Controller
            control={control}
            name="procedimentoCodigo"
            render={({ field }) => {
              const selectedProc = procedimentos.find((p: any) => p.codigo === field.value);
              return (
                <Select 
                  onValueChange={(codigo) => {
                    const proc = procedimentos.find((p: any) => p.codigo === codigo);
                    if (proc) {
                      setValue('procedimentoCodigo', proc.codigo);
                      setValue('procedimentoNome', proc.nome);
                      setValue('duracaoEstimadaMinutos', proc.duracaoEstimadaMinutos || 30);
                      field.onChange(codigo);
                    }
                  }} 
                  value={field.value || ""}
                  disabled={!modalidadeSelecionada || procedimentos.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={modalidadeSelecionada ? (isLoadingProcedimentos ? "Carregando procedimentos..." : "Selecione um procedimento") : "Selecione um equipamento primeiro"}>
                      {selectedProc ? `${selectedProc.codigo} - ${selectedProc.nome}` : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {procedimentos.length > 0 ? (
                      procedimentos.map((p: any) => (
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

      <input type="hidden" {...register('procedimentoNome')} />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Data e Hora</label>
          <Input type="datetime-local" {...register('dataHoraAgendada')} />
          {errors.dataHoraAgendada && <p className="text-red-500 text-xs">{String(errors.dataHoraAgendada.message)}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Duração (min)</label>
          <Input type="number" {...register('duracaoEstimadaMinutos')} />
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
