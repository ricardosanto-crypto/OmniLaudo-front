export const kpiData = [
  { label: 'TAT Médio', value: '2h 15m', var: '-12m', isPositive: true, sparkline: [12, 10, 8, 15, 10, 8, 5], desc: 'Tempo médio de resposta geral da operação (Turnaround Time)' },
  { label: 'TAT Crítico', value: '45m', var: '+5m', isPositive: false, sparkline: [5, 6, 4, 8, 10, 12, 15], desc: 'Tempo de liberação para laudos de emergência' },
  { label: 'Agendados Hoje', value: '1.248', var: '+4%', isPositive: true, sparkline: [50, 60, 55, 80, 90, 110, 120], desc: 'Volume total de exames programados para hoje' },
  { label: 'Em Execução', value: '42', var: '-2', isPositive: false, sparkline: [20, 25, 30, 22, 18, 25, 20], desc: 'Pacientes que estão neste momento em sala' },
  { label: 'No-show', value: '12.4%', var: '-1.2%', isPositive: true, sparkline: [15, 14, 12, 13, 11, 10, 9], desc: 'Taxa de abstenção/falta dos pacientes' },
  { label: 'Laudos Pendentes', value: '315', var: '-42', isPositive: true, sparkline: [350, 340, 330, 310, 290, 280, 270], desc: 'Exames concluídos que aguardam digitação ou assinatura' },
  { label: 'Ocupação de Salas', value: '84%', var: '+2%', isPositive: true, sparkline: [70, 75, 80, 82, 85, 83, 84], desc: 'Percentual de uso da capacidade total dos equipamentos' }
];

export const throughputData = [
  { time: '06:00', TC: 15, RM: 10, RX: 20, US: 18, MMG: 2 },
  { time: '07:00', TC: 20, RM: 12, RX: 35, US: 25, MMG: 5 },
  { time: '08:00', TC: 25, RM: 15, RX: 45, US: 38, MMG: 8 },
  { time: '09:00', TC: 30, RM: 18, RX: 50, US: 42, MMG: 12 },
  { time: '10:00', TC: 35, RM: 22, RX: 55, US: 45, MMG: 15 },
  { time: '11:00', TC: 28, RM: 18, RX: 48, US: 38, MMG: 10 },
  { time: '12:00', TC: 22, RM: 15, RX: 35, US: 30, MMG: 5 },
  { time: '13:00', TC: 20, RM: 12, RX: 30, US: 25, MMG: 8 },
  { time: '14:00', TC: 32, RM: 20, RX: 50, US: 40, MMG: 14 },
  { time: '15:00', TC: 38, RM: 25, RX: 58, US: 45, MMG: 18 },
  { time: '16:00', TC: 40, RM: 28, RX: 60, US: 48, MMG: 20 },
  { time: '17:00', TC: 35, RM: 22, RX: 52, US: 42, MMG: 15 },
  { time: '18:00', TC: 28, RM: 18, RX: 45, US: 35, MMG: 10 },
  { time: '19:00', TC: 20, RM: 15, RX: 30, US: 25, MMG: 6 },
  { time: '20:00', TC: 15, RM: 10, RX: 20, US: 18, MMG: 4 },
  { time: '21:00', TC: 10, RM: 8, RX: 15, US: 12, MMG: 2 },
  { time: '22:00', TC: 5, RM: 4, RX: 8, US: 6, MMG: 1 },
];

export const filaModalidadeData = [
  { mod: 'RM', agend: 342, exec: 12, laudo: 84, slaRisco: 14 },
  { mod: 'TC', agend: 280, exec: 8, laudo: 62, slaRisco: 5 },
  { mod: 'US', agend: 415, exec: 18, laudo: 115, slaRisco: 22 },
  { mod: 'RX', agend: 180, exec: 4, laudo: 30, slaRisco: 2 },
  { mod: 'MMG', agend: 95, exec: 2, laudo: 24, slaRisco: null },
];

export const statusUnidadesData = [
  { name: 'Unidade Paulista', uptime: '99.9%', fila: 128, tecs: 8, tags: ['TC', 'RM', 'US'] },
  { name: 'Unidade Moema', uptime: '99.5%', fila: 84, tecs: 5, tags: ['RM', 'US', 'TC'] },
  { name: 'Unidade Tatuapé', uptime: '100%', fila: 142, tecs: 10, tags: ['TC', 'RM', 'RX', 'US'] },
  { name: 'Unidade Lapa', uptime: '98.2%', fila: 65, tecs: 4, tags: ['US', 'RX', 'RM'] },
];

export const alertasData = [
  { type: 'critical', title: 'Contraste Extravasado', location: 'Paulista', time: '10:42', desc: 'Paciente: João M. Silva (RM-02)' },
  { type: 'critical', title: 'Paciente Alérgico em Sala', location: 'Moema', time: '10:38', desc: 'TC-01: Alergia a iodo severa registrada.' },
  { type: 'warning', title: 'Falha DICOM C-STORE', location: 'Tatuapé', time: '10:25', desc: 'Exame #98124 travado há 15m (PACS_MAIN)' },
  { type: 'warning', title: 'MWL Sem Retorno', location: 'Lapa', time: '10:15', desc: 'Timeout no query da modalidade US-03' },
  { type: 'warning', title: 'SLA Estourado (Laudo)', location: 'Paulista', time: '09:50', desc: 'Exame #98011 (TC Crânio) > 4h sem laudo' },
];

export const eventosData = [
  { time: '10:45', title: 'Laudo Assinado', desc: 'Dra. Marina Rocha assinou accession #10293 (RM)' },
  { time: '10:12', title: 'Sincronização PACS', desc: '45 estudos sincronizados com sucesso (Main Storage)' },
  { time: '09:30', title: 'Novo Usuário Logado', desc: 'Téc. Fernando operando TC-02 na Unidade Moema' },
  { time: '08:50', title: 'Backup Diário', desc: 'Backup de rotina finalizado em 4m20s' }
];
