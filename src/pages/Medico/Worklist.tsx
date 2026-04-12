import { useState } from 'react';
import { FileText, Search, Activity } from 'lucide-react';
import { useAgendamentos } from '@/hooks/useAgendamentos';
import { DataTable, ColumnDef } from '@/components/ui/data-table';
import { AgendamentoResponse } from '@/types/agendamento';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { cn } from '@/lib/utils';

export function WorklistMedico() {
  const [page, setPage] = useState(0);
  const { data: pageAgend, isLoading } = useAgendamentos(page, 10);

  // Filtramos apenas exames realizados ou que já tenham o DICOM pronto para leitura
  const examesParaLaudar = pageAgend?.content.filter(i => i.status === 'REALIZADO') || [];

  const columns: ColumnDef<AgendamentoResponse>[] = [
    {
      header: 'Prioridade',
      cell: (i) => (
        <div className="flex items-center gap-2">
          <div className={cn("h-2 w-2 rounded-full", i.prioridade === 'URGENTE' ? "bg-red-500 animate-pulse" : "bg-blue-500")} />
          <span className="text-[10px] font-bold uppercase">{i.prioridade || 'NORMAL'}</span>
        </div>
      )
    },
    { header: 'Data/Hora', cell: (i) => i.dataHoraAgendada },
    { header: 'Paciente', accessorKey: 'pacienteNome', className: 'font-semibold text-foreground' },
    { header: 'Exame', accessorKey: 'procedimentoNome', className: 'text-muted-foreground italic' },
    {
      header: 'Modalidade', cell: (i) => (
        <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
          {i.equipamentoModalidade}
        </span>
      )
    },
    {
      header: <span className="sr-only">Ações</span>,
      className: 'text-right',
      cell: (i) => (
        <Link to={`/workspace/${i.id}`}>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-md group">
            <FileText size={14} className="mr-2 group-hover:scale-110 transition-transform" />
            Laudar
          </Button>
        </Link>
      )
    }
  ];

  return (
    <PageWrapper title="Laudar Exames">
      <div className="p-8 max-w-7xl mx-auto space-y-6">

        {/* Header Elegante */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card border border-border p-8 rounded-2xl shadow-sm overflow-hidden relative backdrop-blur-sm">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 pointer-events-none">
            <Activity size={200} />
          </div>

          <div className="flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-200 dark:shadow-blue-900/40">
              <FileText size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Fila de Diagnóstico</h1>
              <p className="text-muted-foreground text-sm">Exames finalizados aguardando emissão de laudo técnico.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-muted/30 border border-border px-5 py-3 rounded-xl text-center min-w-[120px]">
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Pendentes</p>
              <p className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">{examesParaLaudar.length}</p>
            </div>
            <div className="bg-emerald-100/5 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 px-5 py-3 rounded-xl text-center min-w-[120px]">
              <p className="text-[10px] text-emerald-600 dark:text-emerald-500 uppercase font-black tracking-widest mb-1">Hoje</p>
              <p className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400">0</p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" size={18} />
            <Input placeholder="Buscar por nome do paciente..." className="pl-10 h-10 border-slate-200 dark:border-slate-800 dark:bg-slate-900" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-10 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 dark:hover:bg-slate-800">Todas Modalidades</Button>
            <Button variant="outline" className="h-10 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 dark:hover:bg-slate-800">Prioridade</Button>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden backdrop-blur-sm">
          <DataTable
            columns={columns}
            data={examesParaLaudar}
            isLoading={isLoading}
            emptyMessage="Não há exames aguardando diagnóstico no momento."
            pageInfo={pageAgend ? { number: pageAgend.number, totalPages: pageAgend.totalPages, totalElements: examesParaLaudar.length } : undefined}
            onPageChange={setPage}
          />
        </div>

      </div>
    </PageWrapper>
  );
}
