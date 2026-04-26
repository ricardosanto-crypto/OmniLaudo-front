import { useState } from 'react';
import { FileText, Search, Activity, Eye, Download, ChevronDown } from 'lucide-react';
import { useAgendamentos } from '@/hooks/useAgendamentos';
import { useEstudoByAgendamento, useOrthancSeries, OrthancSeries } from '@/hooks/useDicom';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { DataTable, ColumnDef } from '@/components/ui/data-table';
import { AgendamentoResponse } from '@/types/agendamento';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { cn } from '@/lib/utils';

function AgendamentoExpandido({ agendamento }: { agendamento: AgendamentoResponse }) {
  const { data: estudo, isLoading: loadEstudo } = useEstudoByAgendamento(agendamento.id);
  const { data: series, isLoading: loadSeries } = useOrthancSeries(estudo?.idOrthanc);
  const [expandedSeries, setExpandedSeries] = useState<Record<string, boolean>>({});

  const downloadFile = (url: string, filename: string) => {
    toast.info('Iniciando download...');
    api.get(url, { responseType: 'blob' }).then(res => {
      const href = URL.createObjectURL(res.data);
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download concluído!');
    }).catch(() => toast.error('Falha ao baixar o arquivo.'));
  };

  if (loadEstudo || loadSeries) {
    return <div className="p-4 flex items-center gap-3 text-sm text-slate-500"><div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" /> Carregando dados do PACS...</div>;
  }

  if (!estudo) {
    return <div className="p-4 text-sm text-slate-500 italic">Nenhum estudo DICOM atrelado a este exame no PACS principal.</div>;
  }

  return (
    <div className="p-6 bg-slate-50/50 dark:bg-slate-900/20 m-2 rounded-xl border border-blue-500/10 shadow-inner">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Estudo PACS: <span className="text-blue-600 dark:text-blue-400">{agendamento.pacienteNome}</span>
          </h3>
          <p className="text-xs text-slate-500 flex gap-2 mt-1">
            <span>ID Orthanc: <span className="font-mono text-[10px]">{estudo.idOrthanc.split('-')[0]}...</span></span>
            <span>|</span>
            <span>Accession: {agendamento.accessionNumber}</span>
          </p>
        </div>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => downloadFile(`/dicom/proxy/estudo/${estudo.idOrthanc}/archive`, `${agendamento.pacienteNome.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_estudo.zip`)}
          className="bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-800/40 dark:text-blue-300"
        >
          <Download size={14} className="mr-2" />
          Baixar Estudo Completo (ZIP)
        </Button>
      </div>

      {series && series.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {series.map((serie: OrthancSeries, idx: number) => (
            <div key={serie.id} className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30 px-1.5 py-0.5 rounded border border-purple-200 dark:border-purple-800/30">
                    {serie.modalidade}
                  </span>
                  <span className="text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                    #{idx + 1}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate mb-1" title={serie.descricao}>
                  {serie.descricao}
                </h4>
                <p className="text-[10px] text-slate-500 mb-3">{serie.totalImagens} instâncias (imagens)</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-[10px] h-7 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900"
                  onClick={() => downloadFile(`/dicom/proxy/serie/${serie.id}/archive`, `serie_${serie.modalidade}_${idx+1}.zip`)}
                >
                  <Download size={12} className="mr-1.5" />
                  ZIP Série
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[10px] h-7 w-7 p-0 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500"
                  onClick={() => setExpandedSeries(prev => ({ ...prev, [serie.id]: !prev[serie.id] }))}
                  title="Ver Imagens Individuais"
                >
                   <ChevronDown size={14} className={cn("transition-transform", expandedSeries[serie.id] ? "rotate-180" : "")} />
                </Button>
              </div>

              {expandedSeries[serie.id] && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5 max-h-32 overflow-y-auto custom-scrollbar">
                  {serie.instancias.map((instanciaId: string, i: number) => (
                    <button
                      key={instanciaId}
                      onClick={() => downloadFile(`/dicom/proxy/instancia/${instanciaId}/file`, `${agendamento.pacienteNome}_slice_${i+1}.dcm`)}
                      className="text-[9px] px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/50 dark:hover:text-blue-400 transition-colors flex items-center gap-1 border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                      title="Baixar Arquivo .dcm"
                    >
                      <span>#{i + 1}</span>
                      <Download size={10} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic">Nenhuma série encontrada para este estudo.</p>
      )}
    </div>
  );
}

export function WorklistMedico() {
  const [page, setPage] = useState(0);
  const { data: pageAgend, isLoading } = useAgendamentos(page, 10);

  // Filtra exames aguardando laudo e laudados (para revisão/visualização)
  const examesParaLaudar = pageAgend?.content.filter(
    i => ['AGUARDANDO_LAUDO', 'LAUDADO'].includes(i.status)
  ) || [];

  const pendentes = examesParaLaudar.filter(i => i.status === 'AGUARDANDO_LAUDO').length;
  const laudados = examesParaLaudar.filter(i => i.status === 'LAUDADO').length;

  const columns: ColumnDef<AgendamentoResponse>[] = [
    {
      header: 'Status',
      cell: (i) => {
        const styles: Record<string, { bg: string; label: string }> = {
          AGUARDANDO_LAUDO: { bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20', label: '● Aguardando Laudo' },
          LAUDADO: { bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', label: '✓ Laudado' },
        };
        const style = styles[i.status] || styles.AGUARDANDO_LAUDO;
        return (
          <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold border", style.bg)}>
            {style.label}
          </span>
        );
      }
    },
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
      header: 'Médico',
      cell: (i) => (
        <span className="text-xs text-muted-foreground">
          {i.medicoNome || '—'}
        </span>
      )
    },
    {
      header: <span className="sr-only">Ações</span>,
      className: 'text-right',
      cell: (i) => (
        <Link to={`/workspace/${i.id}`}>
          {i.status === 'AGUARDANDO_LAUDO' ? (
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-md group">
              <FileText size={14} className="mr-2 group-hover:scale-110 transition-transform" />
              Laudar
            </Button>
          ) : (
            <Button size="sm" variant="outline" className="border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Eye size={14} className="mr-2" />
              Revisar
            </Button>
          )}
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
              <p className="text-muted-foreground text-sm">Exames aguardando laudo ou em processo de homologação.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-amber-500/5 border border-amber-500/20 px-5 py-3 rounded-xl text-center min-w-[120px]">
              <p className="text-[10px] text-amber-500 uppercase font-black tracking-widest mb-1">Pendentes</p>
              <p className="text-2xl font-mono font-bold text-amber-500">{pendentes}</p>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/20 px-5 py-3 rounded-xl text-center min-w-[120px]">
              <p className="text-[10px] text-emerald-500 uppercase font-black tracking-widest mb-1">Laudados</p>
              <p className="text-2xl font-mono font-bold text-emerald-500">{laudados}</p>
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
            renderSubComponent={(item) => <AgendamentoExpandido agendamento={item} />}
            rowIdAccessor={(item) => item.id}
          />
        </div>

      </div>
    </PageWrapper>
  );
}
