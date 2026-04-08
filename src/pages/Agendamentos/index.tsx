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
          <span className="font-bold text-gray-900">{format(new Date(i.dataHoraAgendada), 'HH:mm')}</span>
          <span className="text-[10px] text-gray-500">{format(new Date(i.dataHoraAgendada), 'dd/MM/yyyy')}</span>
        </div>
      )
    },
    { header: 'Paciente', accessorKey: 'pacienteNome', className: 'font-medium text-gray-900' },
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
        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-[10px] font-bold border border-blue-200 uppercase">
          {i.status}
        </span>
      )
    },
    { header: 'Accession', accessorKey: 'accessionNumber', className: 'text-[10px] font-mono text-gray-400' }
  ];

  if (isError) return <div className="p-8 text-red-500">Erro: {error?.message}</div>;

  return (
    <PageWrapper>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <CalendarDays className="text-primary-500" /> 
              Agenda do Dia
            </h1>
            <p className="text-sm text-gray-500">Gestão de horários e fila de execução clínica.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="bg-primary-500 hover:bg-primary-600 text-white">
            <Plus size={18} className="mr-2" /> Novo Agendamento
          </Button>
        </div>

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
