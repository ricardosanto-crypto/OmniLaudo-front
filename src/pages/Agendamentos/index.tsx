import { useState } from 'react';
import { KanbanSquare, List, Map, CalendarDays, Plus, XCircle } from 'lucide-react';
import { useAgendamentos, useCreateAgendamento, useUpdateAgendamentoStatus } from '../../hooks/useAgendamentos';
import { DataTable, ColumnDef } from '../../components/ui/data-table';
import { AgendamentoResponse } from '../../types/agendamento';
import { AgendamentoForm } from './AgendamentoForm';
import { KanbanBoard } from './KanbanBoard';
import { DailyScheduler } from './DailyScheduler';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { format } from 'date-fns';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { cn } from '../../lib/utils';

export function Agendamentos() {
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'map'>('list');

  const { data: pageAgend, isLoading, isError, error } = useAgendamentos(page, 10);
  const { mutate: criar, isPending: isCreating } = useCreateAgendamento();
  const { mutate: cancelar } = useUpdateAgendamentoStatus();

  const handleCancelar = (id: string) => {
    if (window.confirm("Você tem certeza que deseja cancelar este Agendamento? Isso não poderá ser desfeito.")) {
      cancelar({ id, status: 'CANCELADO' });
    }
  };

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
      cell: (i) => {
        const bgColors: Record<string, string> = {
          'AGENDADO': 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
          'EM_ATENDIMENTO': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-400',
          'CANCELADO': 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-400',
        };
        const colorClass = bgColors[i.status] || 'bg-amber-100 text-amber-700 border-amber-200';
        return (
          <span className={`px-2 py-0.5 rounded border text-[10px] font-black uppercase tracking-wider ${colorClass}`}>
            {i.status}
          </span>
        );
      }
    },
    { header: 'Accession', accessorKey: 'accessionNumber', className: 'text-[10px] font-mono text-gray-400' },
    {
      header: <span className="sr-only">Ações</span>,
      className: 'text-right',
      cell: (i) => (
        <div className="flex justify-end gap-2">
          {i.status === 'AGENDADO' && (
            <Button 
                size="sm" 
                variant="outline" 
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-900/30" 
                onClick={() => handleCancelar(i.id)}
            >
              <XCircle size={14} className="mr-2" /> Cancelar
            </Button>
          )}
        </div>
      )
    }
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
        {/* Módulo de View Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1 w-fit border border-border">
          <button 
             onClick={() => setViewMode('list')}
             className={cn("flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all", viewMode === 'list' ? 'bg-white dark:bg-slate-800 shadow-sm text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-foreground')}
          >
             <List size={16} /> Lista Geral
          </button>
          <button 
             onClick={() => setViewMode('kanban')}
             className={cn("flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all", viewMode === 'kanban' ? 'bg-white dark:bg-slate-800 shadow-sm text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-foreground')}
          >
             <KanbanSquare size={16} /> Fluxo
          </button>
          <button 
             onClick={() => setViewMode('map')}
             className={cn("flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all", viewMode === 'map' ? 'bg-white dark:bg-slate-800 shadow-sm text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-foreground')}
          >
             <Map size={16} /> Máquinas
          </button>
        </div>

        {viewMode === 'list' && (
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
        )}
        
        {viewMode === 'kanban' && <KanbanBoard agendamentos={pageAgend?.content || []} />}
        {viewMode === 'map' && <DailyScheduler agendamentos={pageAgend?.content || []} />}

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
