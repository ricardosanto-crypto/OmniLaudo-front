import { motion } from 'framer-motion';
import { Clock, CheckCircle, Activity, User, ArrowRight, LucideIcon } from 'lucide-react';
import { AgendamentoResponse, StatusAgendamento } from '../../types/agendamento';
import { format } from 'date-fns';
import { useUpdateAgendamentoStatus } from '../../hooks/useAgendamentos';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';

interface KanbanBoardProps {
  agendamentos: AgendamentoResponse[];
}

interface ColunaDef {
  id: StatusAgendamento;
  titulo: string;
  icone: LucideIcon;
  corBase: string;
  nextStatus?: StatusAgendamento;
}

const COLUNAS: ColunaDef[] = [
  { id: 'AGENDADO', titulo: 'Chegadas', icone: Clock, corBase: 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900', nextStatus: 'EM_ATENDIMENTO' },
  { id: 'EM_ATENDIMENTO', titulo: 'Em Sala (Exame)', icone: Activity, corBase: 'border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/20', nextStatus: 'AGUARDANDO_LAUDO' },
  { id: 'AGUARDANDO_LAUDO', titulo: 'PACS / Laudar', icone: User, corBase: 'border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20' }, // Médico assina, logo nao tem botão manual geralmente
  { id: 'LAUDADO', titulo: 'Finalizados', icone: CheckCircle, corBase: 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20' }
];

export function KanbanBoard({ agendamentos }: KanbanBoardProps) {
  const { mutate: updateStatus, isPending } = useUpdateAgendamentoStatus();

  return (
    <div className="flex flex-col lg:flex-row gap-6 overflow-x-auto pb-6 pt-2 h-[calc(100vh-220px)] hide-scrollbar">
      {COLUNAS.map((coluna) => {
        const items = agendamentos.filter(a => a.status === coluna.id);

        return (
          <div key={coluna.id} className={cn("flex flex-col min-w-[300px] w-full lg:w-1/4 rounded-2xl border p-4 shadow-sm backdrop-blur-sm", coluna.corBase)}>
            {/* Header da Coluna */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/50">
              <div className="flex items-center gap-2">
                <coluna.icone className="w-5 h-5 opacity-70" />
                <h3 className="font-bold text-sm tracking-tight text-foreground uppercase">{coluna.titulo}</h3>
              </div>
              <span className="bg-background px-2.5 py-0.5 rounded-full text-xs font-black shadow-sm">{items.length}</span>
            </div>

            {/* Lista de Cards */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {items.length === 0 ? (
                <div className="h-24 border border-dashed border-border/60 rounded-xl flex items-center justify-center text-xs text-muted-foreground font-medium">
                  Vazio
                </div>
              ) : (
                items.map((item, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={item.id}
                    className="bg-card rounded-xl p-3 shadow-sm border border-border group relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold bg-muted px-2 py-0.5 rounded text-muted-foreground tracking-wider">
                        {format(new Date(item.dataHoraAgendada), 'HH:mm')}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1 rounded">
                        {item.equipamentoModalidade}
                      </span>
                    </div>
                    
                    <h4 className="font-bold text-sm text-foreground mb-1 leading-tight">{item.pacienteNome}</h4>
                    
                    <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] uppercase font-bold text-slate-500">{item.procedimentoNome}</p>
                      <p className="text-[10px] text-slate-400">{item.equipamentoNome}</p>
                    </div>

                    {coluna.nextStatus && (
                      <div className="mt-3 flex justify-end">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-full text-[10px] uppercase font-black tracking-widest h-7"
                          disabled={isPending}
                          onClick={() => updateStatus({ id: item.id, status: coluna.nextStatus as StatusAgendamento })}
                        >
                          Avançar <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
