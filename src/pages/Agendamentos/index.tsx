import { useState } from 'react';
import { CalendarDays, Plus } from 'lucide-react';
import { useAgendamentos, useCreateAgendamento } from '../../hooks/useAgendamentos';
import { DataTable, ColumnDef } from '../../components/ui/data-table';
import { AgendamentoResponse } from '../../types/agendamento';
import { AgendamentoForm } from './AgendamentoForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { format } from 'date-fns';
import { PageWrapper } from '../../components/layout/PageWrapper';

export function Agendamentos() {
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: pageAgend, isLoading, isError, error } = useAgendamentos(page, 10);
  const { mutate: criar, isPending: isCreating } = useCreateAgendamento();

  const columns: ColumnDef<AgendamentoResponse>[] = [
    { 
      header: 'Horário', 
      cell: (i) => (
        <div className="flex flex-col">
          <span className="font-bold text-foreground">{format(new Date(i.dataHoraAgendada), 'HH:mm')}</span>
          <span className="text-[10px] text-gray-500">{format(new Date(i.dataHoraAgendada), 'dd/MM/yyyy')}</span>
        </div>
      )
    },
    { header: 'Paciente', accessorKey: 'pacienteNome', className: 'font-semibold text-foreground' },
    { 
      header: 'Exame', 
      cell: (i) => (
        <div className="flex flex-col">
          <span className="text-sm">{i.procedimentoNome}</span>
          <span className="text-[10px] text-primary-600 font-bold uppercase">{i.equipamentoModalidade} - {i.equipamentoNome}</span>
        </div>
      )
    },
    { 
      header: 'Status', 
      cell: (i) => (
        <span className="bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900/40 text-[10px] font-black uppercase tracking-wider">
          {i.status}
        </span>
      )
    },
    { header: 'Accession', accessorKey: 'accessionNumber', className: 'text-[10px] font-mono text-gray-400' }
  ];

  if (isError) return <div className="p-8 text-red-500">Erro: {error?.message}</div>;

  return (
    <PageWrapper
      title="Agenda do Dia"
      description="Gestão de horários e fila de execução clínica com sincronização DICOM."
      breadcrumbs={[
        { label: 'Dashboard', to: '/' },
        { label: 'Agendamentos', to: '/agendamentos' },
      ]}
      backLink={{ label: 'Voltar ao Dashboard', to: '/' }}
      actions={
        <Button onClick={() => setIsModalOpen(true)} className="bg-primary-500 hover:bg-primary-600 text-white">
          <Plus size={18} className="mr-2" /> Novo Agendamento
        </Button>
      }
    >
      <div className="space-y-8">
        <DataTable
          columns={columns}
          data={pageAgend?.content || []}
          isLoading={isLoading}
          emptyMessage={
            <div className="flex flex-col items-center justify-center py-12 opacity-30">
              <CalendarDays size={64} className="mb-4 text-slate-400" />
              <p className="text-xl font-bold text-slate-900">Nenhum exame para hoje.</p>
              <p className="text-sm text-slate-500 mt-1">Sua agenda está limpa. Aproveite para revisar laudos!</p>
            </div>
          }
          pageInfo={pageAgend ? { number: pageAgend.number, totalPages: pageAgend.totalPages, totalElements: pageAgend.totalElements } : undefined}
          onPageChange={setPage}
        />

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Agendar Exame</DialogTitle>
              <DialogDescription>
                Selecione o paciente, o equipamento e o procedimento. O sistema verificará a disponibilidade automaticamente.
              </DialogDescription>
            </DialogHeader>
            <AgendamentoForm
              isLoading={isCreating}
              onCancel={() => setIsModalOpen(false)}
              onSubmit={(data: any) => criar(data, { onSuccess: () => setIsModalOpen(false) })}
            />
          </DialogContent>
        </Dialog>
      </div>
    </PageWrapper>
  );
}
