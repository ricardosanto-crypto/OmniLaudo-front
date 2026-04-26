import { Page } from './api';

export interface EquipamentoRequest {
  nome: string;
  modalidade: string; // Ex: MRI, CT, RX, US
  fabricante?: string;
  modelo?: string;
  numeroSerie?: string;
  salaId?: string;
  dicomHabilitado: boolean;
  dicomAeTitle?: string;
  dicomIp?: string;
  dicomPort?: number;
  emManutencao: boolean;
  calibrado: boolean;
}

export interface EquipamentoResponse extends EquipamentoRequest {
  id: string;
  ativo: boolean;
  // O backend pode retornar o nome da sala para facilitar a listagem
  salaNome?: string; 
}

export type EquipamentoPage = Page<EquipamentoResponse>;
