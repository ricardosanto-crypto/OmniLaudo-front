import { 
  ChevronLeft, LayoutGrid, MousePointer2, Contrast, Hand, 
  Search, Ruler, Ratio, RotateCcw, CloudCog, CheckCircle, Send,
  Circle, Square, Target, Eraser, Sun, Type, StickyNote
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';

interface WorkspaceHeaderProps {
  pacienteNome: string;
  accessionNumber: string;
  modalidade: string;
  activeTool: string;
  setActiveTool: (tool: string) => void;
  isSaving: boolean;
  laudoStatus?: string;
  onSalvar?: () => void;
  onAssinarTecnica?: () => void;
  onHomologar?: () => void;
  onFinalizar: () => void;
  onResetViewport: () => void;
  onToggleGrid: () => void;
  onInvertViewport: () => void;
  isModoEditor?: boolean;
}

export function WorkspaceHeader({
  pacienteNome, accessionNumber, modalidade, 
  activeTool, setActiveTool, isSaving, laudoStatus,
  onSalvar, onAssinarTecnica, onHomologar, onFinalizar,
  onResetViewport, onToggleGrid, onInvertViewport,
  isModoEditor = false
}: WorkspaceHeaderProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const isTecnologo = user?.roles?.includes('TECNOLOGO') && !user?.roles?.includes('MEDICO');
  const isMedico = user?.roles?.includes('MEDICO') || user?.roles?.includes('SUPERADMIN') || user?.roles?.includes('ADMIN');

  const tools = [
    { id: 'Wwwc', icon: Contrast, label: 'Contraste (W/L)' },
    { id: 'Pan', icon: Hand, label: 'Mover (Pan)' },
    { id: 'Zoom', icon: Search, label: 'Zoom' },
    { id: 'Length', icon: Ruler, label: 'Medir' },
    { id: 'Angle', icon: Ratio, label: 'Ângulo' },
    { id: 'EllipticalRoi', icon: Circle, label: 'Elipse (ROI)' },
    { id: 'RectangleRoi', icon: Square, label: 'Retângulo (ROI)' },
    { id: 'Probe', icon: Target, label: 'Sonda (HU)' },
    { id: 'TextMarker', icon: StickyNote, label: 'Anotação Direta' },
    { id: 'ArrowAnnotate', icon: Type, label: 'Seta com Texto' },
    { id: 'Eraser', icon: Eraser, label: 'Borracha' },
  ];

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950 px-4">
      {/* Contexto do Paciente */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => navigate('/worklist-medico')}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col">
          <h1 className="text-sm font-bold text-white line-clamp-1">{pacienteNome}</h1>
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span className="font-mono text-blue-400">{accessionNumber}</span>
            <span className="h-2.5 w-px bg-slate-800" />
            <span className="font-bold uppercase tracking-wider text-slate-500">{modalidade}</span>
          </div>
        </div>
      </div>

      {/* DICOM Toolbar (Centro) - Oculta no modo editor */}
      {!isModoEditor && (
        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/50 p-1 backdrop-blur-sm">
          <button
            onClick={() => setActiveTool('cursor')}
            className={cn("flex h-8 w-8 items-center justify-center rounded-md transition-all", activeTool === 'cursor' ? "bg-slate-800 text-blue-400" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200")}
          >
            <MousePointer2 size={16} />
          </button>
          <div className="mx-1 h-4 w-px bg-slate-800" />
          
          {tools.map((tool) => (
            <button
              key={tool.id}
              title={tool.label}
              onClick={() => setActiveTool(tool.id)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md transition-all",
                activeTool === tool.id ? "bg-slate-800 text-blue-400 shadow-sm" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              )}
            >
              <tool.icon size={16} />
            </button>
          ))}
          
          <div className="mx-1 h-4 w-px bg-slate-800" />
          <button onClick={onInvertViewport} title="Inverter Cores" className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800/50 hover:text-slate-200">
            <Sun size={16} />
          </button>
          <button onClick={onResetViewport} title="Resetar Visualização" className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800/50 hover:text-slate-200">
            <RotateCcw size={16} />
          </button>
          <button onClick={onToggleGrid} title="Alternar Layout do Grid" className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800/50 hover:text-blue-400 focus:bg-slate-800">
            <LayoutGrid size={16} />
          </button>
        </div>
      )}

      {/* Ações da Direita — Condicionais por papel */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 mr-2">
          <CloudCog size={16} className={isSaving ? "animate-pulse" : ""} />
          <span>{isSaving ? 'Salvando...' : 'Sincronizado'}</span>
        </div>

        {/* Todos podem salvar rascunho */}
        <Button variant="outline" size="sm" onClick={onSalvar} className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white">
          Salvar Rascunho
        </Button>

        {/* TECNÓLOGO: "Assinar Técnica" (se laudo é RASCUNHO) */}
        {isTecnologo && laudoStatus !== 'AGUARDANDO_HOMOLOGACAO' && laudoStatus !== 'FINALIZADO' && (
          <Button 
            size="sm" 
            onClick={onAssinarTecnica}
            className="bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-900/20"
          >
            <Send size={16} className="mr-2" />
            Assinar Técnica
          </Button>
        )}

        {/* TECNÓLOGO: Badge "Aguardando" (se já assinou) */}
        {isTecnologo && laudoStatus === 'AGUARDANDO_HOMOLOGACAO' && (
          <Button size="sm" disabled className="bg-amber-800/50 text-amber-300 border border-amber-700">
            ⏳ Aguardando Homologação
          </Button>
        )}

        {/* MÉDICO: "Homologar e Assinar" (se laudo aguarda homologação) */}
        {isMedico && laudoStatus === 'AGUARDANDO_HOMOLOGACAO' && (
          <Button 
            size="sm" 
            onClick={onHomologar}
            className="bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/20"
          >
            <CheckCircle size={16} className="mr-2" />
            Homologar e Assinar
          </Button>
        )}

        {/* MÉDICO: "Finalizar e Assinar" (laudo RASCUNHO — faz direto sem precisar de técnico) */}
        {isMedico && (laudoStatus === 'RASCUNHO' || !laudoStatus) && (
          <Button 
            size="sm" 
            onClick={onFinalizar}
            className="bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/20"
          >
            <CheckCircle size={16} className="mr-2" />
            Finalizar e Assinar
          </Button>
        )}

        {/* Laudo já finalizado */}
        {laudoStatus === 'FINALIZADO' && (
          <Button size="sm" disabled className="bg-emerald-900/30 text-emerald-400 border border-emerald-800">
            ✓ Laudo Homologado
          </Button>
        )}
      </div>
    </header>
  );
}
