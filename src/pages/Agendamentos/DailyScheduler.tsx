import { useMemo } from 'react';
import { format, getHours, getMinutes } from 'date-fns';
import { AgendamentoResponse } from '../../types/agendamento';
import { cn } from '../../lib/utils';
import { Clock } from 'lucide-react';

interface DailySchedulerProps {
  agendamentos: AgendamentoResponse[];
}

// Escala: 1 Hora = 120px, 30 min = 60px
const HOUR_HEIGHT = 120;
const START_HOUR = 7;
const END_HOUR = 20;
const HOURS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => i + START_HOUR);

export function DailyScheduler({ agendamentos }: DailySchedulerProps) {
  const equipamentos = useMemo(() => {
    const map = new Map<string, { id: string, nome: string, modalidade: string }>();
    agendamentos.forEach(a => {
      if (!map.has(a.equipamentoId)) {
        map.set(a.equipamentoId, { id: a.equipamentoId, nome: a.equipamentoNome, modalidade: a.equipamentoModalidade });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.modalidade.localeCompare(b.modalidade));
  }, [agendamentos]);

  return (
    <div className="bg-white dark:bg-slate-950 rounded-2xl border shadow-sm border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[calc(100vh-220px)] font-sans">
      
      {/* Header (Eixo X) */}
      <div className="flex bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900 sticky top-0 z-20">
        <div className="w-20 shrink-0 border-r border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950" />
        
        {equipamentos.length === 0 ? (
           <div className="flex-1 p-4 text-center text-sm font-medium text-slate-500">
             Nenhuma máquina escalada para hoje.
           </div>
        ) : (
          equipamentos.map(eq => (
            <div key={eq.id} className="flex-1 min-w-[280px] border-r border-slate-100 dark:border-slate-900 py-4 flex items-center justify-center text-center">
              <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                {eq.modalidade} {eq.nome.replace(eq.modalidade, '').trim()}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Grid Principal */}
      <div className="flex-1 overflow-y-auto overflow-x-auto relative custom-scrollbar bg-slate-50/30 dark:bg-slate-900/10">
        <div className="flex min-w-max">
          
          {/* Coluna Eixo Y (Horários) */}
          <div className="w-20 shrink-0 border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 select-none z-10 sticky left-0">
            {HOURS.map(hour => (
              <div key={hour} className="relative" style={{ height: `${HOUR_HEIGHT}px` }}>
                <div className="absolute top-0 w-full text-center -mt-2.5">
                  <span className="text-[11px] font-semibold text-slate-400">{hour.toString().padStart(2, '0')}:00</span>
                </div>
                <div className="absolute top-1/2 w-full text-center -mt-2.5">
                  <span className="text-[10px] font-medium text-slate-300 dark:text-slate-600">{hour.toString().padStart(2, '0')}:30</span>
                </div>
              </div>
            ))}
          </div>

          {/* Colunas dos Equipamentos */}
          {equipamentos.map(eq => (
            <div key={eq.id} className="flex-1 min-w-[280px] border-r border-slate-100 dark:border-slate-800 relative">
              {/* Linhas de Grade (Horas e Meias Horas) */}
              {HOURS.map(hour => (
                <div key={hour} className="relative" style={{ height: `${HOUR_HEIGHT}px` }}>
                  <div className="absolute top-0 w-full border-t border-slate-100 dark:border-slate-800/60" />
                  <div className="absolute top-1/2 w-full border-t border-dashed border-slate-100 dark:border-slate-800/40" />
                </div>
              ))}

              {agendamentos
                .filter(a => a.equipamentoId === eq.id)
                .map(agend => {
                  const date = new Date(agend.dataHoraAgendada);
                  const h = getHours(date);
                  const m = getMinutes(date);
                  
                  if (h < START_HOUR || h > END_HOUR) return null;

                  const topOffset = ((h - START_HOUR) * HOUR_HEIGHT) + ((m / 60) * HOUR_HEIGHT);
                  const duracaoVisual = Math.max(agend.duracaoEstimadaMinutos || 30, 20); 
                  const height = (duracaoVisual / 60) * HOUR_HEIGHT;

                  // Lógica de Cores baseadas no estilo da imagem
                  const isCancelado = agend.status === 'CANCELADO';
                  const isAtendimento = agend.status === 'EM_ATENDIMENTO';
                  const isFinished = agend.status === 'AGUARDANDO_LAUDO' || agend.status === 'LAUDADO';

                  let backgroundColor = "bg-emerald-50 dark:bg-emerald-950/20";
                  let borderColor = "border-emerald-500";
                  let textColor = "text-slate-800 dark:text-slate-200";
                  let isDashed = false;

                  if (isCancelado) {
                    backgroundColor = "bg-slate-50 dark:bg-slate-900/50";
                    borderColor = "border-slate-400";
                    textColor = "text-slate-500";
                    isDashed = true;
                  } else if (isAtendimento) {
                     backgroundColor = "bg-amber-50 dark:bg-amber-950/20";
                     borderColor = "border-amber-500";
                  } else if (isFinished) {
                     backgroundColor = "bg-blue-50 dark:bg-blue-950/20";
                     borderColor = "border-blue-500";
                  }

                  // Seguro ficticio para demonstração caso não tenha no payload (a API atual não traz nome do convenio no dto base, assumimos 'Particular' ou algo provindo do procedimento)
                  const seguro = agend.procedimentoNome.includes('Particular') ? 'Particular' : 'Unimed';

                  return (
                    <div
                      key={agend.id}
                      className={cn(
                        "absolute left-1 right-2 p-3 overflow-hidden transition-all hover:z-10 hover:shadow-md cursor-pointer flex flex-col rounded-r-lg",
                        backgroundColor,
                        isDashed ? "border-l-4 border-dashed" : "border-l-4 border-solid",
                        borderColor
                      )}
                      style={{
                        top: `${topOffset}px`,
                        height: `${height - 4}px`, // Subtrai uma folga pra não colar no próximo
                        minHeight: '40px'
                      }}
                    >
                      <div className="flex-1">
                        <p className={cn("text-[13px] font-bold leading-tight", textColor)}>{agend.pacienteNome}</p>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">{seguro}</p>
                      </div>
                      <div className="mt-auto flex items-center gap-1.5 text-slate-400">
                        <Clock size={12} />
                        <span className="text-[10px] font-medium">{duracaoVisual} min</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
