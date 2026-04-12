import { 
  ChevronLeft, LayoutGrid, MousePointer2, Contrast, Hand, 
  Search, Ruler, Ratio, RotateCcw, CloudCog, CheckCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface WorkspaceHeaderProps {
  pacienteNome: string;
  accessionNumber: string;
  modalidade: string;
  activeTool: string;
  setActiveTool: (tool: string) => void;
  isSaving: boolean;
  onFinalizar: () => void;
}

export function WorkspaceHeader({
  pacienteNome, accessionNumber, modalidade, 
  activeTool, setActiveTool, isSaving, onFinalizar
}: WorkspaceHeaderProps) {
  const navigate = useNavigate();

  const tools = [
    { id: 'Wwwc', icon: Contrast, label: 'Contraste (W/L)' },
    { id: 'Pan', icon: Hand, label: 'Mover (Pan)' },
    { id: 'Zoom', icon: Search, label: 'Zoom' },
    { id: 'Length', icon: Ruler, label: 'Medir' },
    { id: 'Angle', icon: Ratio, label: 'Ângulo' },
  ];

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950 px-4">
      {/* Contexto do Paciente */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => navigate('/worklist')}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-inner uppercase">
          {pacienteNome.substring(0, 2)}
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm font-bold text-slate-100 uppercase tracking-wide">{pacienteNome}</h1>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-wider font-medium">
            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">ACC: {accessionNumber}</span>
            <span className="rounded bg-purple-900/50 px-1.5 py-0.5 text-purple-300 border border-purple-800/50">{modalidade}</span>
          </div>
        </div>
      </div>

      {/* DICOM Toolbar (Centro) */}
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
        <button title="Resetar" className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800/50 hover:text-slate-200">
          <RotateCcw size={16} />
        </button>
        <button title="Layout do Grid" className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800/50 hover:text-slate-200">
          <LayoutGrid size={16} />
        </button>
      </div>

      {/* Ações da Direita */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 mr-2">
          <CloudCog size={16} className={isSaving ? "animate-pulse" : ""} />
          <span>{isSaving ? 'Salvando...' : 'Sincronizado'}</span>
        </div>
        <Button variant="outline" size="sm" className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white">
          Salvar Rascunho
        </Button>
        <Button 
          size="sm" 
          onClick={onFinalizar}
          className="bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/20"
        >
          <CheckCircle size={16} className="mr-2" />
          Finalizar e Assinar
        </Button>
      </div>
    </header>
  );
}
