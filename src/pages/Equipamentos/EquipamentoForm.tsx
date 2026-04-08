import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { Input } from '../../components/ui/input';
import { useSalas } from '../../hooks/useSalas';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { AcaoCrud } from '../../components/ui/acao-crud';

const equipamentoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  modalidade: z.string().min(1, 'Modalidade é obrigatória'),
  fabricante: z.string().optional(),
  modelo: z.string().optional(),
  numeroSerie: z.string().optional(),
  salaId: z.string().optional(),
  dicomHabilitado: z.boolean().default(false),
  dicomAeTitle: z.string().optional(),
  dicomPort: z.coerce.number().optional(),
  emManutencao: z.boolean().default(false),
  calibrado: z.boolean().default(false),
});

const MODALIDADES = ['MRI', 'CT', 'RX', 'US', 'MG', 'DX'];

export function EquipamentoForm({ initialData, onSubmit, isLoading, onCancel }: any) {
  const { data: salasPage } = useSalas(0, 100);
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: zodResolver(equipamentoSchema),
    defaultValues: {
      nome: '',
      modalidade: '',
      fabricante: '',
      modelo: '',
      numeroSerie: '',
      salaId: '',
      dicomHabilitado: false,
      dicomAeTitle: '',
      dicomPort: undefined,
      emManutencao: false,
      calibrado: false,
      ...initialData
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
        dicomPort: initialData.dicomPort || undefined,
        emManutencao: initialData.emManutencao || false,
        calibrado: initialData.calibrado || false,
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2 max-h-[70vh] overflow-y-auto px-1">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nome do Equipamento</label>
          <Input {...register('nome')} placeholder="Ex: Ressonância 01" />
          {errors.nome && <p className="text-red-500 text-xs">{String(errors.nome.message)}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Modalidade</label>
          <Controller
            control={control}
            name="modalidade"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
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
          <label className="text-sm font-medium">Fabricante</label>
          <Input {...register('fabricante')} placeholder="Ex: Siemens" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Modelo</label>
          <Input {...register('modelo')} placeholder="Ex: MAGNETOM Trio" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Número de Série</label>
          <Input {...register('numeroSerie')} placeholder="Ex: SN123456" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Sala</label>
          <Controller
            control={control}
            name="salaId"
            render={({ field }) => {
              const selectedSala = salasPage?.content.find(s => s.id === field.value);
              return (
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <SelectTrigger>
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
          <label htmlFor="dicomHabilitado" className="text-sm font-medium cursor-pointer">DICOM Habilitado</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="calibrado" {...register('calibrado')} className="rounded" />
          <label htmlFor="calibrado" className="text-sm font-medium cursor-pointer">Calibrado</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="emManutencao" {...register('emManutencao')} className="rounded" />
          <label htmlFor="emManutencao" className="text-sm font-medium cursor-pointer">Em Manutenção</label>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-bold mb-2">Configurações DICOM</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">AE Title</label>
            <Input {...register('dicomAeTitle')} placeholder="OMNILA_MRI_01" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Porta DICOM</label>
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
