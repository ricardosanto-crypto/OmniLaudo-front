import { useParams, useSearchParams } from 'react-router-dom';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import { WorkspaceHeader } from './components/WorkspaceHeader';
import { DicomViewport } from './components/DicomViewport';
import { ReportPanel } from './components/ReportPanel';
import { useWorkspaceController } from './hooks/useWorkspaceController';

export function WorkspaceMedico() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isModoEditor = searchParams.get('modo') === 'editor';

  // O componente View delega toda a inteligência para o Controller
  const ctrl = useWorkspaceController(id);

  if (ctrl.isLoadingGlobally) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <span className="text-sm font-medium text-blue-400">Carregando Workspace DICOM...</span>
        </div>
      </div>
    );
  }

  if (!ctrl.agendamento) {
    return <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-red-500">Agendamento não encontrado.</div>;
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-950 font-sans">
      
      <WorkspaceHeader 
        pacienteNome={ctrl.agendamento.pacienteNome}
        accessionNumber={ctrl.agendamento.accessionNumber}
        modalidade={ctrl.agendamento.equipamentoModalidade}
        activeTool={ctrl.activeTool}
        setActiveTool={ctrl.setActiveTool}
        isSaving={ctrl.isSaving}
        laudoStatus={ctrl.laudo?.status}
        onSalvar={ctrl.handleSalvar}
        onAssinarTecnica={ctrl.handleAssinarTecnica}
        onHomologar={ctrl.handleHomologar}
        onFinalizar={ctrl.handleFinalizar}
        onToggleGrid={ctrl.handleToggleGrid}
        onResetViewport={ctrl.handleResetViewport}
        onInvertViewport={ctrl.handleInvertViewport}
        isModoEditor={isModoEditor}
      />

      <div className="flex-1 overflow-hidden relative">
        {isModoEditor ? (
          <div className="h-full w-full bg-slate-900 overflow-y-auto">
             <ReportPanel 
              laudoInicial={ctrl.laudo?.achados || ''}
              onContentChange={ctrl.setEditorContent}
              assinaturas={ctrl.assinaturas}
              series={ctrl.series || []}
              activeSeriesId={ctrl.activeSeriesId}
              isModoEditor={true}
              onSelectSeries={(sid) => {
                ctrl.setActiveSeriesId(sid);
                ctrl.setActiveImageIndex(0);
              }}
            />
          </div>
        ) : (
          <ResizablePanelGroup id="workspace-layout" orientation="horizontal">
            {/* VIEWPORT DICOM */}
            <ResizablePanel id="panel-viewport" defaultSize={70} minSize={30} className="relative bg-black p-0.5">
              <div className={cn("h-full w-full grid gap-0.5", ctrl.gridLayout === 2 ? "grid-cols-2" : ctrl.gridLayout === 4 ? "grid-cols-2 grid-rows-2" : "grid-cols-1")}>
                {Array.from({ length: ctrl.gridLayout }).map((_, idx) => (
                  <div key={`${idx}-${ctrl.gridLayout}`} className="relative h-full w-full overflow-hidden rounded-md border border-slate-800">
                    <DicomViewport 
                      imageId={ctrl.dicomUrl}
                      activeTool={ctrl.activeTool}
                      onImageScroll={ctrl.handleScroll}
                      resetCounter={ctrl.viewportResetCounter}
                      invertCounter={ctrl.viewportInvertCounter}
                    />
                    {ctrl.serieAtiva && (
                      <div className="absolute bottom-4 right-4 pointer-events-none rounded bg-black/60 px-2 py-1 font-mono text-xs text-blue-400 backdrop-blur-sm border border-slate-800">
                        IMAGEM: {ctrl.activeImageIndex + 1} / {ctrl.serieAtiva.instancias.length}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle className="w-1.5 bg-slate-800 hover:bg-blue-500 active:bg-blue-600 transition-colors" />

            {/* EDITOR */}
            <ResizablePanel id="panel-editor" defaultSize={30} minSize={20}>
              <ReportPanel 
                laudoInicial={ctrl.laudo?.achados || ''}
                onContentChange={ctrl.setEditorContent}
                assinaturas={ctrl.assinaturas}
                series={ctrl.series || []}
                activeSeriesId={ctrl.activeSeriesId}
                onSelectSeries={(sid) => {
                  ctrl.setActiveSeriesId(sid);
                  ctrl.setActiveImageIndex(0);
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
            <span className={ctrl.estudo ? "h-1.5 w-1.5 rounded-full bg-emerald-500" : "h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"} />
            {ctrl.estudo ? 'Conectado ao PACS' : 'Aguardando Sincronização DICOM'}
          </div>
          {ctrl.laudo && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600">|</span>
              <span className={cn("font-bold uppercase", ctrl.laudo.status === 'FINALIZADO' ? 'text-emerald-500' : 'text-amber-500')}>
                {ctrl.laudo.status === 'FINALIZADO' ? '✓ Laudado' : '● Rascunho'}
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
