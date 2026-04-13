import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { toast } from 'sonner';

// Hooks
import { useAgendamentoById } from '@/hooks/useAgendamentos';
import { useEstudoByAgendamento, useOrthancSeries } from '@/hooks/useDicom';

// Components
import { WorkspaceHeader } from './components/WorkspaceHeader';
import { DicomViewport } from './components/DicomViewport';
import { ReportPanel } from './components/ReportPanel';
import { cn } from '@/lib/utils';

// ── Hooks do Laudo ────────────────────────────────────

import { 
  useLaudoByAgendamento, 
  useSalvarLaudo, 
  useFinalizarLaudo, 
  useAssinarTecnica, 
  useHomologar, 
  useAssinaturas 
} from '@/hooks/useLaudos';

// Removido LeftSidebar, Séries agora ficam no ReportPanel (Sanfona)

// ── Workspace Principal ────────────────────────────────

export function WorkspaceMedico() {
  const { id } = useParams(); // ID do Agendamento
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isModoEditor = searchParams.get('modo') === 'editor';

  // Controles de UI
  const [activeTool, setActiveTool] = useState('Wwwc');
  const [activeSeriesId, setActiveSeriesId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [gridLayout, setGridLayout] = useState<number>(1);
  const [viewportResetCounter, setViewportResetCounter] = useState<number>(0);
  const [viewportInvertCounter, setViewportInvertCounter] = useState<number>(0);

  // 1. Fetch de Dados (React Query)
  const { data: agendamento, isLoading: loadAgend } = useAgendamentoById(id);
  const { data: estudo, isLoading: loadEstudo } = useEstudoByAgendamento(id);
  const { data: series, isLoading: loadSeries } = useOrthancSeries(estudo?.idOrthanc);
  const { data: laudo } = useLaudoByAgendamento(id);
  const { data: assinaturas = [] } = useAssinaturas(id);

  // Mutations
  const salvarLaudo = useSalvarLaudo();
  const finalizarLaudo = useFinalizarLaudo();
  const assinarTecnica = useAssinarTecnica();
  const homologarLaudo = useHomologar();

  // Referência para pegar o conteúdo do editor
  const [editorContent, setEditorContent] = useState('');

  // 2. Auto-selecionar a primeira série quando carregarem
  useEffect(() => {
    if (series && series.length > 0 && !activeSeriesId) {
      setActiveSeriesId(series[0].id);
      setActiveImageIndex(0);
    }
  }, [series, activeSeriesId]);

  const serieAtiva = series?.find((s: any) => s.id === activeSeriesId);
  const instanciaAtivaId = serieAtiva ? serieAtiva.instancias[activeImageIndex] : null;

  // 3. Lógica de Scroll (Navegação pelas imagens da série)
  const handleScroll = useCallback((direction: number) => {
    if (!serieAtiva) return;
    setActiveImageIndex(prev => {
      const next = prev + direction;
      if (next >= 0 && next < serieAtiva.instancias.length) return next;
      return prev;
    });
  }, [serieAtiva]);

  // 4. URL do Cornerstone
  const dicomUrl = instanciaAtivaId 
    ? `wadouri:http://localhost:3001/api/v1/dicom/proxy/instancia/${instanciaAtivaId}/file` 
    : null;

  // 5. Ações - Salvar Rascunho
  const handleSalvar = () => {
    if (!id || !agendamento) return;
    salvarLaudo.mutate({
      agendamentoId: id,
      medicoId: '', // será pego do @AuthenticationPrincipal no backend
      achados: editorContent,
      impressao: '',
    });
  };

  // 6. Ações - Finalizar e Assinar (Médico faz direto)
  const handleFinalizar = async () => {
    if (!id || !agendamento) return;
    try {
      const saveRes = await salvarLaudo.mutateAsync({
        agendamentoId: id,
        medicoId: '',
        achados: editorContent,
        impressao: '',
      });
      
      const laudoId = saveRes.data?.id;
      if (!laudoId) { toast.error('Erro: Laudo não foi criado.'); return; }

      await finalizarLaudo.mutateAsync(laudoId);
      toast.success('Laudo assinado digitalmente!');
      navigate('/worklist-medico');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Erro ao finalizar laudo.');
    }
  };

  // 7. Ações - Assinar Técnica (Tecnólogo envia para homologação)
  const handleAssinarTecnica = async () => {
    if (!id || !agendamento) return;
    try {
      const saveRes = await salvarLaudo.mutateAsync({
        agendamentoId: id,
        medicoId: '',
        achados: editorContent,
        impressao: '',
      });
      
      const laudoId = saveRes.data?.id;
      if (!laudoId) { toast.error('Erro: Laudo não foi criado.'); return; }

      await assinarTecnica.mutateAsync(laudoId);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Erro ao assinar.');
    }
  };

  // 8. Ações - Homologar (Médico revisa e assina)
  const handleHomologar = async () => {
    if (!id || !agendamento) return;
    try {
      // Salva eventuais edições do médico
      const saveRes = await salvarLaudo.mutateAsync({
        agendamentoId: id,
        medicoId: '',
        achados: editorContent,
        impressao: '',
      });
      
      const laudoId = saveRes.data?.id;
      if (!laudoId) { toast.error('Erro: Laudo não encontrado.'); return; }

      await homologarLaudo.mutateAsync(laudoId);
      navigate('/worklist-medico');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Erro ao homologar laudo.');
    }
  };

  // Renderização de Loading
  if (loadAgend || loadEstudo || loadSeries) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <span className="text-sm font-medium text-blue-400">Carregando Workspace DICOM...</span>
        </div>
      </div>
    );
  }

  if (!agendamento) {
    return <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-red-500">Agendamento não encontrado.</div>;
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-950 font-sans">
      
      <WorkspaceHeader 
        pacienteNome={agendamento.pacienteNome}
        accessionNumber={agendamento.accessionNumber}
        modalidade={agendamento.equipamentoModalidade}
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        isSaving={salvarLaudo.isPending}
        laudoStatus={laudo?.status}
        onSalvar={handleSalvar}
        onAssinarTecnica={handleAssinarTecnica}
        onHomologar={handleHomologar}
        onFinalizar={handleFinalizar}
        onToggleGrid={() => setGridLayout((prev: number) => prev === 1 ? 2 : prev === 2 ? 4 : 1)}
        onResetViewport={() => setViewportResetCounter((prev: number) => prev + 1)}
        onInvertViewport={() => setViewportInvertCounter((prev: number) => prev + 1)}
        isModoEditor={isModoEditor}
      />

      <div className="flex-1 overflow-hidden relative">
        {isModoEditor ? (
          <div className="h-full w-full bg-slate-900 overflow-y-auto">
             <ReportPanel 
              laudoInicial={laudo?.achados || ''}
              onContentChange={setEditorContent}
              assinaturas={assinaturas}
              series={series || []}
              activeSeriesId={activeSeriesId}
              isModoEditor={true}
              onSelectSeries={(sid) => {
                setActiveSeriesId(sid);
                setActiveImageIndex(0);
              }}
            />
          </div>
        ) : (
          <ResizablePanelGroup id="workspace-layout" orientation="horizontal">
            {/* VIEWPORT DICOM (Esquerda e Centro) */}
            <ResizablePanel id="panel-viewport" defaultSize={70} minSize={30} className="relative bg-black p-0.5">
              <div className={cn("h-full w-full grid gap-0.5", gridLayout === 2 ? "grid-cols-2" : gridLayout === 4 ? "grid-cols-2 grid-rows-2" : "grid-cols-1")}>
                {Array.from({ length: gridLayout }).map((_, idx) => (
                  <div key={`${idx}-${gridLayout}`} className="relative h-full w-full overflow-hidden rounded-md border border-slate-800">
                    <DicomViewport 
                      imageId={dicomUrl}
                      activeTool={activeTool}
                      onImageScroll={(direction) => {
                        handleScroll(direction);
                      }}
                      resetCounter={viewportResetCounter}
                      invertCounter={viewportInvertCounter}
                    />
                    {/* Overlay de contador de imagens */}
                    {serieAtiva && (
                      <div className="absolute bottom-4 right-4 pointer-events-none rounded bg-black/60 px-2 py-1 font-mono text-xs text-blue-400 backdrop-blur-sm border border-slate-800">
                        IMAGEM: {activeImageIndex + 1} / {serieAtiva.instancias.length}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle className="w-1.5 bg-slate-800 hover:bg-blue-500 active:bg-blue-600 transition-colors" />

            {/* LADO DIREITO: Editor */}
            <ResizablePanel id="panel-editor" defaultSize={30} minSize={20}>
              <ReportPanel 
                laudoInicial={laudo?.achados || ''}
                onContentChange={setEditorContent}
                assinaturas={assinaturas}
                series={series || []}
                activeSeriesId={activeSeriesId}
                onSelectSeries={(sid) => {
                  setActiveSeriesId(sid);
                  setActiveImageIndex(0);
                }}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>

      {/* STATUS BAR */}
      <footer className="flex h-7 shrink-0 items-center justify-between bg-slate-950 border-t border-slate-900 px-4 text-[10px] text-slate-500">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className={estudo ? "h-1.5 w-1.5 rounded-full bg-emerald-500" : "h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"} />
            {estudo ? 'Conectado ao PACS' : 'Aguardando Sincronização DICOM'}
          </div>
          {laudo && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600">|</span>
              <span className={cn(
                "font-bold uppercase",
                laudo.status === 'FINALIZADO' ? 'text-emerald-500' : 'text-amber-500'
              )}>
                {laudo.status === 'FINALIZADO' ? '✓ Laudado' : '● Rascunho'}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 font-bold tracking-wider">
          <span className="flex items-center gap-1"><kbd className="bg-slate-800 px-1 rounded">F2</kbd> Assinar e Próximo</span>
        </div>
      </footer>
    </div>
  );
}
