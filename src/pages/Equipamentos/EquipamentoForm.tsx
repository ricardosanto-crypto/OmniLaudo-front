import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { Input } from '../../components/ui/input';
import { useSalas } from '../../hooks/useSalas';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { AcaoCrud } from '../../components/ui/acao-crud';
import { applyFormErrors } from '../../services/errorHandler';

import { EquipamentoResponse, EquipamentoRequest } from '../../types/equipamento';

const equipamentoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  modalidade: z.string().min(1, 'Modalidade é obrigatória'),
  fabricante: z.string().optional(),
  modelo: z.string().optional(),
  numeroSerie: z.string().optional(),
  salaId: z.string().optional(),
  dicomHabilitado: z.boolean(),
  dicomAeTitle: z.string().optional(),
  dicomIp: z.string().optional(),
  dicomPort: z.coerce.number().optional(),
  emManutencao: z.boolean(),
  calibrado: z.boolean(),
});

type EquipamentoFormInputs = z.infer<typeof equipamentoSchema>;

interface EquipamentoFormProps {
  initialData?: EquipamentoResponse | null;
  onSubmit: (data: EquipamentoRequest) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

const MODALIDADES = ['MRI', 'CT', 'RX', 'US', 'MG', 'DX'];

export function EquipamentoForm({ initialData, onSubmit, isLoading, onCancel }: EquipamentoFormProps) {
  const { data: salasPage } = useSalas(0, 100);
  const { register, handleSubmit, control, reset, setError, formState: { errors } } = useForm<EquipamentoFormInputs>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(equipamentoSchema) as any,
    defaultValues: {
      nome: '',
      modalidade: '',
      fabricante: '',
      modelo: '',
      numeroSerie: '',
      salaId: '',
      dicomHabilitado: false,
      dicomAeTitle: '',
      dicomIp: '',
      dicomPort: undefined,
      emManutencao: false,
      calibrado: false,
    }
  });

  useEffect(() => { 
    if (initialData) {
      reset({
        nome: initialData.nome || '',
        modalidade: initialData.modalidade || '',
        fabricante: initialData.fabricante || '',
        modelo: initialData.modelo || '',
        numeroSerie: initialData.numeroSerie || '',
        salaId: initialData.salaId ? String(initialData.salaId) : '',
        dicomHabilitado: initialData.dicomHabilitado || false,
        dicomAeTitle: initialData.dicomAeTitle || '',
        dicomIp: initialData.dicomIp || '',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dicomPort: (initialData.dicomPort as any) ?? undefined,
        emManutencao: initialData.emManutencao || false,
        calibrado: initialData.calibrado || false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: EquipamentoFormInputs) => {
    try {
      await onSubmit(data as EquipamentoRequest);
    } catch (error) {
      applyFormErrors(error, setError);
    }
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <form onSubmit={handleSubmit(handleFormSubmit as any)} className="space-y-4 py-2 max-h-[70vh] overflow-y-auto px-1">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground uppercase text-[10px] font-bold">Nome do Equipamento</label>
          <Input 
            {...register('nome')} 
            placeholder="Ex: Ressonância 01" 
            className={errors.nome ? 'border-red-500 focus-visible:ring-red-500' : ''}
          />
          {errors.nome && <p className="text-red-500 text-xs">{String(errors.nome.message)}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground uppercase text-[10px] font-bold">Modalidade</label>
          <Controller
            control={control}
            name="modalidade"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <SelectTrigger className={errors.modalidade ? 'border-red-500 focus-visible:ring-red-500' : ''}>
                  <SelectValue placeholder="Selecione">
                    {field.value ? field.value : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {MODALIDADES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />
          {errors.modalidade && <p className="text-red-500 text-xs">{String(errors.modalidade.message)}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground uppercase text-[10px] font-bold">Fabricante</label>
          <Input 
            {...register('fabricante')} 
            placeholder="Ex: Siemens" 
            className={errors.fabricante ? 'border-red-500 focus-visible:ring-red-500' : ''}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground uppercase text-[10px] font-bold">Modelo</label>
          <Input 
            {...register('modelo')} 
            placeholder="Ex: MAGNETOM Trio" 
            className={errors.modelo ? 'border-red-500 focus-visible:ring-red-500' : ''}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground uppercase text-[10px] font-bold">Número de Série</label>
          <Input 
            {...register('numeroSerie')} 
            placeholder="Ex: SN123456" 
            className={errors.numeroSerie ? 'border-red-500 focus-visible:ring-red-500' : ''}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground uppercase text-[10px] font-bold">Sala</label>
          <Controller
            control={control}
            name="salaId"
            render={({ field }) => {
              const selectedSala = salasPage?.content.find(s => s.id === field.value);
              return (
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <SelectTrigger className={errors.salaId ? 'border-red-500 focus-visible:ring-red-500' : ''}>
                    <SelectValue placeholder="Selecione a sala">
                      {selectedSala ? selectedSala.nome : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {salasPage?.content.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />
          {errors.salaId && <p className="text-red-500 text-xs">{String(errors.salaId.message)}</p>}
        </div>
      </div>

      <div className="flex gap-6 py-2">
        <div className="flex items-center gap-2">
          <input type="checkbox" id="dicomHabilitado" {...register('dicomHabilitado')} className="rounded" />
          <label htmlFor="dicomHabilitado" className="text-sm font-medium cursor-pointer text-muted-foreground uppercase text-[10px] font-bold">DICOM Habilitado</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="calibrado" {...register('calibrado')} className="rounded" />
          <label htmlFor="calibrado" className="text-sm font-medium cursor-pointer text-muted-foreground uppercase text-[10px] font-bold">Calibrado</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="emManutencao" {...register('emManutencao')} className="rounded" />
          <label htmlFor="emManutencao" className="text-sm font-medium cursor-pointer text-muted-foreground uppercase text-[10px] font-bold">Em Manutenção</label>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <h3 className="text-[10px] font-bold mb-2 uppercase text-primary-500 tracking-wider">Configurações DICOM</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground uppercase text-[10px] font-bold">AE Title</label>
            <Input {...register('dicomAeTitle')} placeholder="OMNILA_MRI_01" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground uppercase text-[10px] font-bold">Endereço IP</label>
            <Input {...register('dicomIp')} placeholder="Ex: 192.168.1.50" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground uppercase text-[10px] font-bold">Porta</label>
            <Input type="number" {...register('dicomPort')} placeholder="104" />
          </div>
        </div>
      </div>

      <AcaoCrud 
        onCancel={onCancel} 
        isLoading={isLoading} 
        labelSuccess={initialData ? "Salvar Alterações" : "Cadastrar Equipamento"} 
      />
    </form>
  );
}
