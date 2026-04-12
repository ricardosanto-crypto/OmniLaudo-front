import { useState, ChangeEvent } from 'react';
import { Play, CheckCircle, UserCheck, Activity, Search, UploadCloud } from 'lucide-react';
import { useAgendamentos, useUpdateAgendamentoStatus } from '../../hooks/useAgendamentos';
import { useUploadDicom } from '../../hooks/useUploadDicom';
import { DataTable, ColumnDef } from '../../components/ui/data-table';
import { AgendamentoResponse, StatusAgendamento } from '../../types/agendamento';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../../components/layout/PageWrapper';

export function WorklistTecnologo() {
  const [page, setPage] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedAgendamento, setSelectedAgendamento] = useState<AgendamentoResponse | null>(null);
  const { data: pageAgend, isLoading } = useAgendamentos(page, 10);
  const { mutate: updateStatus } = useUpdateAgendamentoStatus();
  const { mutate: uploadDicom, isPending: isUploading } = useUploadDicom();

  const openUploadDialog = (agendamento: AgendamentoResponse) => {
    setSelectedAgendamento(agendamento);
    setSelectedFiles([]);
    setIsDialogOpen(true);
  };

  const closeUploadDialog = () => {
    setIsDialogOpen(false);
    setSelectedAgendamento(null);
    setSelectedFiles([]);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const submitUpload = () => {
    if (!selectedAgendamento || selectedFiles.length === 0) return;

    uploadDicom({
      accessionNumber: selectedAgendamento.accessionNumber,
      patientId: selectedAgendamento.pacienteId,
      patientName: selectedAgendamento.pacienteNome,
      examType: selectedAgendamento.procedimentoNome,
      modality: selectedAgendamento.equipamentoModalidade,
      description: selectedAgendamento.procedimentoNome,
      files: selectedFiles,
    });
    closeUploadDialog();
  };

  // Função para avançar o fluxo integrando com o back
  const handleAvancarFluxo = (id: string, statusAtual: StatusAgendamento) => {
    let proximoStatus: StatusAgendamento | null = null;

    if (statusAtual === 'AGENDADO') proximoStatus = 'EM_ATENDIMENTO';
    else if (statusAtual === 'EM_ATENDIMENTO') proximoStatus = 'EXECUTANDO';
    else if (statusAtual === 'EXECUTANDO') proximoStatus = 'REALIZADO';

    if (proximoStatus) {
      updateStatus({ id, status: proximoStatus });
    }
  };

  const columns: ColumnDef<AgendamentoResponse>[] = [
    { 
      header: 'Status', 
      cell: (i) => {
        const styles: Record<string, string> = {
          AGENDADO: "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700",
          EM_ATENDIMENTO: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50",
          EXECUTANDO: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50 animate-pulse",
          REALIZADO: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50",
          CANCELADO: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50",
        };
        return (
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${styles[i.status] || styles.AGENDADO}`}>
            {i.status}
          </span>
        );
      }
    },
    { header: 'Paciente', accessorKey: 'pacienteNome', className: 'font-semibold text-foreground' },
    { 
      header: 'Accession Number', 
      cell: (i) => (
        <code className="bg-slate-800 text-slate-100 px-2 py-1 rounded text-xs tracking-widest font-mono">
          {i.accessionNumber}
        </code>
      )
    },
    { header: 'Equipamento', cell: (i) => `${i.equipamentoNome} (${i.equipamentoModalidade})` },
    {
      header: <span className="sr-only">Ação</span>,
      className: 'text-right',
      cell: (i) => (
        <div className="flex justify-end gap-2">
          {i.status === 'AGENDADO' && (
            <Button 
                size="sm" 
                variant="outline" 
                className="text-amber-600 border-amber-600 hover:bg-amber-50" 
                onClick={() => handleAvancarFluxo(i.id, i.status)}
            >
              <UserCheck size={14} className="mr-2" /> Check-in
            </Button>
          )}
          {i.status === 'EM_ATENDIMENTO' && (
            <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700 text-white" 
                onClick={() => handleAvancarFluxo(i.id, i.status)}
            >
              <Play size={14} className="mr-2" /> Iniciar Exame
            </Button>
          )}
          {i.status === 'EXECUTANDO' && (
            <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700 text-white" 
                onClick={() => handleAvancarFluxo(i.id, i.status)}
            >
              <CheckCircle size={14} className="mr-2" /> Finalizar
            </Button>
          )}
          {(i.status === 'EM_ATENDIMENTO' || i.status === 'EXECUTANDO') && (
            <Button
              size="sm"
              variant="outline"
              className="text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              onClick={() => openUploadDialog(i)}
            >
              <UploadCloud size={14} className="mr-2" /> Upload
            </Button>
          )}
          {i.status === 'REALIZADO' && (
            <Link to={`/workspace/${i.id}`}>
              <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg">
                <Activity size={14} className="mr-2" /> Laudar
              </Button>
            </Link>
          )}
        </div>
      )
    }
  ];

  return (
    <PageWrapper title="Painel de Execução">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center bg-card p-6 rounded-2xl text-foreground shadow-xl border border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-500 rounded-lg">
              <Activity size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Painel de Execução</h1>
              <p className="text-slate-400 dark:text-slate-500 text-sm">Controle de fluxo técnico e Worklist DICOM.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase font-bold">Fila de Espera</p>
                <p className="text-xl font-mono text-foreground">{pageAgend?.totalElements || 0}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-slate-500" size={18} />
              <Input placeholder="Buscar paciente na fila..." className="pl-10 dark:bg-slate-900 dark:border-slate-800" />
          </div>
          <Button variant="outline" className="dark:border-slate-800 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-400">Filtrar por Sala</Button>
        </div>

        <DataTable 
          columns={columns} 
          data={pageAgend?.content || []} 
          isLoading={isLoading}
          emptyMessage="Nenhum paciente aguardando exame."
          pageInfo={pageAgend ? { number: pageAgend.number, totalPages: pageAgend.totalPages, totalElements: pageAgend.totalElements } : undefined}
          onPageChange={setPage}
        />

        <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) closeUploadDialog(); setIsDialogOpen(open); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload de DICOM</DialogTitle>
              <DialogDescription>
                Faça upload do arquivo DICOM real para o exame selecionado e envie para o Orthanc.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Paciente</label>
                <p className="text-base text-slate-900 dark:text-white">{selectedAgendamento?.pacienteNome || 'Nenhum paciente selecionado'}</p>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Accession Number</label>
                <p className="text-sm text-slate-700 dark:text-slate-400 font-mono">{selectedAgendamento?.accessionNumber || '-'}</p>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="dicom-file">
                  Arquivo DICOM
                </label>
                <input
                  id="dicom-file"
                  type="file"
                  accept=".dcm,.dicom"
                  multiple
                  onChange={handleFileChange}
                  className="block w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2 text-sm text-slate-700 dark:text-slate-300 shadow-sm"
                />
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  {selectedFiles.length > 0 
                    ? `${selectedFiles.length} arquivo(s) selecionado(s).` 
                    : "Selecione um ou mais arquivos DICOM para enviar diretamente ao Orthanc (Teste)."}
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={closeUploadDialog}>Cancelar</Button>
                <Button
                  disabled={selectedFiles.length === 0 || isUploading}
                  onClick={submitUpload}
                >
                  {isUploading ? 'Enviando...' : 'Enviar para Orthanc'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageWrapper>
  );
}
