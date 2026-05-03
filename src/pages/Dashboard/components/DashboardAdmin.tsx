import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { AlertCircle, AlertTriangle, ArrowUpRight, ArrowDownRight, Activity, HelpCircle } from 'lucide-react';
import { useDashboardStats } from '../../../hooks/useDashboard';

function InfoTooltip({ content }: { content: string }) {
  return (
    <div className="group relative flex items-center">
      <HelpCircle className="w-[14px] h-[14px] text-muted-foreground/40 hover:text-foreground transition-colors cursor-help" />
      <div className="pointer-events-none absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 opacity-0 group-hover:opacity-100 transition-all bg-card border border-border text-foreground text-[11px] font-medium px-3 py-2 rounded-md shadow-xl text-center scale-95 group-hover:scale-100 origin-bottom">
        {content}
      </div>
    </div>
  );
}

export function DashboardAdmin() {
  const { data: stats } = useDashboardStats();

  if (!stats) return null;

  const { kpis, throughput, filaModalidade, statusUnidades, alertas, eventos } = stats;

  const maxSlaRisco = Math.max(...filaModalidade.map(r => r.slaRisco || 0));

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Zona A - KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {kpis.map((kpi, idx) => {
          const desc = {
            'TAT Médio': 'Tempo médio de resposta geral da operação (Turnaround Time)',
            'TAT Crítico': 'Tempo de liberação para laudos de emergência',
            'Agendados Hoje': 'Volume total de exames programados para hoje',
            'Em Execução': 'Pacientes que estão neste momento em sala',
            'No-show': 'Taxa de abstenção/falta dos pacientes agendados',
            'Laudos Pendentes': 'Exames concluídos que aguardam digitação ou assinatura',
            'Ocupação de Salas': 'Percentual de uso da capacidade total dos equipamentos'
          }[kpi.label] || 'Métrica de desempenho';

          return (
            <div key={idx} className="bg-card rounded-lg border border-border p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex flex-col justify-between h-[104px] transition-colors">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-muted-foreground font-semibold tracking-wide uppercase">{kpi.label}</span>
                <InfoTooltip content={desc} />
              </div>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                  <div className="text-[28px] font-bold text-foreground leading-none tracking-tight whitespace-nowrap">{kpi.value}</div>
                <div className="flex items-center gap-1 mt-1.5 whitespace-nowrap">
                  {kpi.var.startsWith('+') ? (
                    <ArrowUpRight className={`h-3 w-3 ${kpi.isPositive ? 'text-emerald-500 dark:text-white' : 'text-red-500'}`} strokeWidth={2.5} />
                  ) : (
                    <ArrowDownRight className={`h-3 w-3 ${kpi.isPositive ? 'text-emerald-500 dark:text-white' : 'text-red-500'}`} strokeWidth={2.5} />
                  )}
                  <span className={`text-[11px] font-bold ${kpi.isPositive ? 'text-emerald-600 dark:text-white' : 'text-red-600 dark:text-red-400'}`}>
                    {kpi.var}
                  </span>
                  <span className="text-[10px] text-muted-foreground/70 font-medium ml-0.5">vs ontem</span>
                </div>
              </div>
              <div className="w-[60px] h-8 ml-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={kpi.sparkline.map((val, i) => ({ val, i }))}>
                    <Line type="monotone" dataKey="val" stroke={kpi.isPositive ? '#10b981' : '#ef4444'} strokeWidth={1.5} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      })}
      </div>

      {/* Zona B - Gráficos e Filas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Throughput Chart (7/12) */}
        <div className="lg:col-span-7">
          <div className="bg-card rounded-lg border border-border p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors h-[400px] flex flex-col">
            <div className="flex items-center gap-2 mb-6 shrink-0">
              <h3 className="text-[14px] font-bold text-foreground">Throughput por hora (06:00 - 22:00)</h3>
              <InfoTooltip content="Volume de exames realizados por hora em cada modalidade" />
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={throughput} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.5} />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 500, opacity: 0.5 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 500, opacity: 0.5 }} />
                  <Tooltip 
                    cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    content={({ active, payload, label }: any) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-card/95 backdrop-blur-md border border-border p-3 rounded-lg shadow-2xl ring-1 ring-black/20 min-w-[120px]">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 border-b border-border/50 pb-1">{label}</p>
                            <div className="space-y-1.5">
                              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                              {payload.map((entry: any, index: number) => (
                                <div key={index} className="flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                    <span className="text-[11px] font-medium text-foreground/90">{entry.name}</span>
                                  </div>
                                  <span className="text-[11px] font-bold text-foreground">{entry.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="RM" fill="#1E40AF" radius={[2, 2, 0, 0]} barSize={4} />
                  <Bar dataKey="TC" fill="#065F46" radius={[2, 2, 0, 0]} barSize={4} />
                  <Bar dataKey="RX" fill="#92400E" radius={[2, 2, 0, 0]} barSize={4} />
                  <Bar dataKey="US" fill="#5B21B6" radius={[2, 2, 0, 0]} barSize={4} />
                  <Bar dataKey="MMG" fill="#831843" radius={[2, 2, 0, 0]} barSize={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-start gap-4 mt-4 ml-6">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-[#1E40AF]"></div><span className="text-[11px] text-muted-foreground font-bold">RM</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-[#065F46]"></div><span className="text-[11px] text-muted-foreground font-bold">TC</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-[#92400E]"></div><span className="text-[11px] text-muted-foreground font-bold">RX</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-[#5B21B6]"></div><span className="text-[11px] text-muted-foreground font-bold">US</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-[#831843]"></div><span className="text-[11px] text-muted-foreground font-bold">MMG</span></div>
            </div>
          </div>
        </div>

        {/* Fila por Modalidade (5/12) */}
        <div className="lg:col-span-5">
          <div className="bg-card rounded-lg border border-border p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors h-[400px] flex flex-col">
            <div className="flex items-center gap-2 mb-4 shrink-0">
              <h3 className="text-[14px] font-bold text-foreground">Fila por Modalidade</h3>
              <InfoTooltip content="Acompanhamento do fluxo de exames desde o agendamento até o laudo" />
            </div>
            <div className="overflow-y-auto flex-1 custom-scrollbar pr-1">
              <table className="w-full text-[12px] text-left">
                <thead className="text-[11px] text-muted-foreground/70 font-semibold border-b border-border/50">
                  <tr>
                    <th className="pb-3 pt-1">Mod.</th>
                    <th className="pb-3 pt-1 text-center">Agend.</th>
                    <th className="pb-3 pt-1 text-center">Exec.</th>
                    <th className="pb-3 pt-1 text-center">Laudo</th>
                    <th className="pb-3 pt-1 text-right">SLA Risco</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filaModalidade.map((row, i) => {
                    const isHighestRisk = row.slaRisco && row.slaRisco === maxSlaRisco && maxSlaRisco > 0;
                    return (
                      <tr key={i} className={`transition-colors ${isHighestRisk ? 'bg-red-50 dark:bg-red-950/30 hover:bg-red-100/50 dark:hover:bg-red-900/40' : 'hover:bg-secondary/50'}`}>
                        <td className="py-3.5 font-bold text-foreground pl-2">{row.mod}</td>
                        <td className="py-3.5 text-center text-muted-foreground">{row.agend}</td>
                        <td className="py-3.5 text-center font-bold text-blue-600 dark:text-blue-400">
                          {row.exec > 0 ? (
                            <div className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 font-bold text-[11px] relative">
                              <span className="absolute w-full h-full bg-blue-400 dark:bg-blue-600 rounded-full animate-pulse opacity-40"></span>
                              <span className="relative z-10">{row.exec}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground/50 font-medium">{row.exec}</span>
                          )}
                        </td>
                        <td className="py-3.5 text-center text-muted-foreground">{row.laudo}</td>
                        <td className={`py-3.5 text-right font-bold pr-2 ${row.slaRisco && row.slaRisco > 10 ? 'text-red-500' : 'text-red-500'}`}>{row.slaRisco || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Zona C - Infraestrutura e Eventos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Status das Unidades */}
        <div className="bg-card rounded-lg border border-border p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors flex flex-col h-[400px]">
          <div className="flex items-center gap-2 mb-4 shrink-0">
            <h3 className="text-[14px] font-bold text-foreground">Status das Unidades</h3>
            <InfoTooltip content="Disponibilidade dos equipamentos e ocupação atual por unidade" />
          </div>
          <div className="space-y-2.5 overflow-y-auto pr-2 flex-1 custom-scrollbar">
            {statusUnidades.map((unit, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-md bg-secondary/50 border border-border/50 hover:border-border transition-colors">
                <div className="flex flex-col gap-1.5">
                  <span className="font-bold text-[13px] text-foreground">{unit.name}</span>
                  <div className="flex gap-4 text-[11px] text-muted-foreground">
                    <span className={parseFloat(unit.uptime) < 99 ? 'text-orange-600 dark:text-orange-400 font-semibold' : 'text-muted-foreground'}>
                      Uptime: <span className={parseFloat(unit.uptime) >= 99 ? 'text-emerald-600 dark:text-white font-semibold' : ''}>{unit.uptime}</span>
                    </span>
                    <span>Fila: <span className="font-medium text-muted-foreground">{unit.fila}</span></span>
                    <span>Técs: <span className="font-medium text-muted-foreground">{unit.tecs}</span></span>
                  </div>
                </div>
                <div className="flex gap-1">
                  {unit.tags.map(t => {
                    let bg = 'bg-[#1E40AF]'; // RM azul escuro
                    if(t==='TC') bg = 'bg-[#065F46]'; // TC verde escuro
                    if(t==='RX') bg = 'bg-[#92400E]'; // RX marrom
                    if(t==='US') bg = 'bg-[#5B21B6]'; // US roxo
                    if(t==='MMG') bg = 'bg-[#831843]'; // MMG rosa escuro
                    return <span key={t} className={`text-[9px] font-bold text-white px-1.5 py-0.5 rounded-sm tracking-wide ${bg}`}>{t}</span>
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas de Exceção */}
        <div className="bg-card rounded-lg border border-border p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors flex flex-col h-[400px]">
          <div className="flex items-center gap-2 mb-5 shrink-0">
            <h3 className="text-[14px] font-bold text-foreground">Alertas de Exceção (Ativos)</h3>
            <InfoTooltip content="Eventos críticos e quebras de SLA que exigem ação imediata" />
          </div>
          <div className="space-y-3.5 overflow-y-auto pr-2 flex-1 custom-scrollbar">
            {alertas.map((alerta, i) => {
              const isCrit = alerta.type === 'critical';
              return (
                <div key={i} className={`p-4 rounded-md border ${isCrit ? 'bg-red-50/40 dark:bg-red-950/20 border-red-100 dark:border-red-900/30' : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-1.5">
                      {isCrit ? (
                        <AlertCircle className="w-[14px] h-[14px] text-red-600 dark:text-red-500 flex-shrink-0" strokeWidth={2.5} />
                      ) : (
                        <AlertTriangle className="w-[14px] h-[14px] text-amber-600 dark:text-amber-500 flex-shrink-0" strokeWidth={2.5} />
                      )}
                      <span className={`text-[13px] font-bold ${isCrit ? 'text-red-700 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'}`}>
                        {alerta.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground/70 font-medium whitespace-nowrap ml-2">
                      {alerta.location} • {alerta.time}
                    </span>
                  </div>
                  <p className={`text-[12px] mb-3 ml-5 ${isCrit ? 'text-red-900/70 dark:text-red-200/70' : 'text-amber-900/70 dark:text-amber-200/70'}`}>{alerta.desc}</p>
                  <div className="ml-5">
                    <button className={`text-[10px] font-bold px-3 py-1.5 rounded-sm border bg-card ${isCrit ? 'text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/40' : 'text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50 hover:bg-amber-50 dark:hover:bg-amber-950/40'} transition-colors shadow-sm`}>
                      Ação Rápida
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Eventos do Sistema */}
        <div className="bg-card rounded-lg border border-border p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors flex flex-col h-[400px]">
          <div className="flex items-center gap-2 mb-5 shrink-0">
            <h3 className="text-[14px] font-bold text-foreground">Eventos do Sistema (Últimos 60 min)</h3>
            <InfoTooltip content="Log de atividades recentes do sistema e ações de usuários" />
          </div>
          <div className="relative pl-3 space-y-6 overflow-y-auto pr-2 flex-1 custom-scrollbar">
            {/* Linha vertical conectando os eventos */}
            <div className="absolute left-[17px] top-2 bottom-2 w-px bg-border"></div>
            
            {eventos.map((evento, i) => (
              <div key={i} className="relative flex gap-4 items-start">
                <div className="bg-card border border-border rounded-full w-2.5 h-2.5 mt-1.5 z-10"></div>
                <div className="flex-1 flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-muted-foreground/70">{evento.time}</span>
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-3 h-3 text-muted-foreground/70" />
                      <span className="text-[13px] font-bold text-foreground">{evento.title}</span>
                    </div>
                  </div>
                  <p className="text-[12px] text-muted-foreground pl-[42px] leading-snug">{evento.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
