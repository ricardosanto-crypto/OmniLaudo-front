import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { toast } from 'sonner';

// Hooks
import { useAgendamentoById } from '@/hooks/useAgendamentos';
import { useEstudoByAgendamento, useOrthancSeries } from '@/hooks/useDicom';

// Components
import { WorkspaceHeader } from './components/WorkspaceHeader';
import { SeriesSidebar } from './components/SeriesSidebar';
import { DicomViewport } from './components/DicomViewport';
import { ReportPanel } from './components/ReportPanel';

export function WorkspaceMedico() {
  const { id } = useParams(); // ID do Agendamento
  const navigate = useNavigate();

  // Controles de UI
  const [activeTool, setActiveTool] = useState('Wwwc');
  const [activeSeriesId, setActiveSeriesId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // 1. Fetch de Dados (React Query)
  const { data: agendamento, isLoading: loadAgend } = useAgendamentoById(id);
  const { data: estudo, isLoading: loadEstudo } = useEstudoByAgendamento(id);
  const { data: series, isLoading: loadSeries } = useOrthancSeries(estudo?.idOrthanc);

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
  const handleScroll = (direction: number) => {
    if (!serieAtiva) return;
    
    setActiveImageIndex(prev => {
      const next = prev + direction;
      // Garante que não saia dos limites da lista de imagens
      if (next >= 0 && next < serieAtiva.instancias.length) {
        return next;
      }
      return prev;
    });
  };

  // 4. Montar a URL do Cornerstone com o Token JWT e a rota correta do Proxy
  //wadouri: informa ao Cornerstone que ele deve usar o wado-image-loader
  
  // URL que bate no Spring Boot, que por sua vez bate no Orthanc e devolve os bytes .dcm
  const dicomUrl = instanciaAtivaId 
    ? `wadouri:http://localhost:3001/api/v1/dicom/proxy/instancia/${instanciaAtivaId}/file` 
    : null;

  // Renderização de Loading elegante
  if (loadAgend || loadEstudo || loadSeries) {
    return <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-white">Carregando Workspace DICOM...</div>;
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
        isSaving={false}
        onFinalizar={() => {
           toast.success("Laudo assinado digitalmente!");
           navigate('/worklist');
        }}
      />

      <ResizablePanelGroup orientation="horizontal" className="flex-1">
        
        {/* LADO ESQUERDO: Cornerstone e Sidebar */}
        <ResizablePanel defaultSize={65} minSize={30}>
          <ResizablePanelGroup orientation="horizontal">
            
            <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
              <SeriesSidebar 
                series={series || []} 
                activeSeriesId={activeSeriesId} 
                onSelectSeries={(id) => {
                  setActiveSeriesId(id);
                  setActiveImageIndex(0); // Reseta a imagem pro começo da série
                }} 
              />
            </ResizablePanel>
            
            <ResizableHandle className="w-1 bg-slate-800 hover:bg-blue-500 active:bg-blue-600 transition-colors" />
            
            <ResizablePanel defaultSize={80} className="relative">
              <DicomViewport 
                imageId={dicomUrl}
                activeTool={activeTool}
                pacienteNome={agendamento.pacienteNome}
                onImageScroll={handleScroll}
              />
              {/* Overlay de contador de imagens */}
              {serieAtiva && (
                <div className="absolute bottom-4 right-4 pointer-events-none rounded bg-black/60 px-2 py-1 font-mono text-xs text-blue-400 backdrop-blur-sm border border-slate-800">
                  IMAGEM: {activeImageIndex + 1} / {serieAtiva.instancias.length}
                </div>
              )}
            </ResizablePanel>

          </ResizablePanelGroup>
        </ResizablePanel>

        <ResizableHandle withHandle className="w-1.5 bg-slate-800 hover:bg-blue-500 active:bg-blue-600 transition-colors" />

        {/* LADO DIREITO: TipTap Editor */}
        <ResizablePanel defaultSize={35} minSize={25}>
          <ReportPanel />
        </ResizablePanel>

      </ResizablePanelGroup>

      {/* STATUS BAR */}
      <footer className="flex h-7 shrink-0 items-center justify-between bg-slate-950 border-t border-slate-900 px-4 text-[10px] text-slate-500">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className={estudo ? "h-1.5 w-1.5 rounded-full bg-emerald-500" : "h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"} />
            {estudo ? 'Conectado ao PACS' : 'Aguardando Sincronização DICOM'}
          </div>
        </div>
        <div className="flex items-center gap-4 font-bold tracking-wider">
          <span className="flex items-center gap-1"><kbd className="bg-slate-800 px-1 rounded">F2</kbd> Assinar e Próximo</span>
        </div>
      </footer>
    </div>
  );
}
