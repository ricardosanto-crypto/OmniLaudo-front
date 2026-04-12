import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

// Tipagem mockada para o front, isso virá do back
export interface SerieDicomView {
  id: string;
  descricao: string;
  modalidade: string;
  totalImagens: number;
  previewUrl: string; // O endpoint do PNG que consertamos
}

interface SeriesSidebarProps {
  series: SerieDicomView[];
  activeSeriesId: string | null;
  onSelectSeries: (id: string) => void;
}

export function SeriesSidebar({ series, activeSeriesId, onSelectSeries }: SeriesSidebarProps) {
  return (
    <div className="flex h-full w-full flex-col bg-slate-900">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-800 px-3">
        <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
          <button className="text-slate-100">Atual</button>
          <button className="text-slate-500 hover:text-slate-300">Histórico</button>
        </div>
        <button className="text-slate-500 hover:text-slate-300"><ChevronLeft size={16} /></button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
        {series.map((serie, index) => {
          const isActive = activeSeriesId === serie.id;
          return (
            <div 
              key={serie.id}
              onClick={() => onSelectSeries(serie.id)}
              className={cn(
                "group relative cursor-pointer rounded-lg border-2 p-2 transition-all",
                isActive ? "border-blue-600 bg-slate-800/50 shadow-md" : "border-transparent bg-slate-900 hover:bg-slate-800"
              )}
            >
              <div className="absolute top-3 left-3 z-10 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                #{index + 1}
              </div>
              <div className="flex gap-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded border border-slate-700 bg-black relative">
                  <img 
                    src={serie.previewUrl} 
                    alt={serie.descricao}
                    className="h-full w-full object-cover opacity-80"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='; // Spacer transparente
                    }}
                  />
                </div>
                <div className={cn("flex flex-col justify-center", !isActive && "opacity-70 group-hover:opacity-100")}>
                  <span className="w-fit rounded bg-purple-900/50 px-1 py-0.5 text-[8px] font-bold text-purple-400 border border-purple-800/50">
                    {serie.modalidade}
                  </span>
                  <span className="mt-1 text-sm font-bold leading-tight text-slate-100">{serie.descricao}</span>
                  <span className="mt-0.5 text-[10px] text-slate-400">{serie.totalImagens} imagens</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
