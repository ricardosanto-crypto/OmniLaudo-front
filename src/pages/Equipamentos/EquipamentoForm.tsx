import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import {
  Cpu,
  Settings,
  Info,
  ShieldCheck,
  DoorOpen,
  Building2,
  Fingerprint,
  Layers
} from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useSalas } from '../../hooks/useSalas';
import { useModalidades } from '../../hooks/useModalidades';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { applyFormErrors } from '../../services/errorHandler';
import { cn } from '../../lib/utils';
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


export function EquipamentoForm({ initialData, onSubmit, isLoading, onCancel }: EquipamentoFormProps) {
  const { data: salasPage } = useSalas(0, 100);
  const { data: modalidadesPage } = useModalidades(0, 100);
  const { register, handleSubmit, control, reset, setError, watch, formState: { errors } } = useForm<EquipamentoFormInputs>({
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
        dicomPort: initialData.dicomPort ?? undefined,
        emManutencao: initialData.emManutencao || false,
        calibrado: initialData.calibrado || false,
      } as EquipamentoFormInputs);
    }
  }, [initialData, reset]);

  const handleFormSubmit: SubmitHandler<EquipamentoFormInputs> = async (data) => {
    try {
      await onSubmit(data as EquipamentoRequest);
    } catch (error) {
      applyFormErrors(error, setError);
    }
  };

  const PropertyRow = ({ label, icon: Icon, children, error }: { label: string, icon: React.ElementType, children: React.ReactNode, error?: string }) => (
    <div className="flex sm:items-center gap-2 py-1 flex-col sm:flex-row items-start min-h-[26px]">
      <div className="flex items-center gap-2 w-28 shrink-0 text-muted-foreground pt-1 sm:pt-0">
        <Icon size={14} strokeWidth={1.5} />
        <Label className="text-[11px] font-medium text-muted-foreground cursor-pointer">
          {label}
        </Label>
      </div>
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center min-h-[26px] w-full">
        {children}
        {error && <p className="text-[10px] font-semibold text-destructive sm:ml-2 mt-1 sm:mt-0">{error}</p>}
      </div>
    </div>
  );

  const inputClass = "h-7 bg-muted/20 border border-border/40 hover:bg-muted/40 focus:bg-background focus:border-primary shadow-sm rounded-md text-xs font-medium px-2 transition-all w-full max-w-[280px]";

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSubmit={handleSubmit(handleFormSubmit as any)}
      className="flex flex-col h-full"
    >
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        
        {/* Properties List */}
        <div className="space-y-0.5 mb-5">
          <PropertyRow label="Nome" icon={Cpu} error={errors.nome?.message}>
            <Input {...register('nome')} placeholder="Ex: Ressonância 01 - Bloco A" className={inputClass} />
          </PropertyRow>

          <PropertyRow label="Modalidade" icon={Layers} error={errors.modalidade?.message}>
            <Controller
              control={control}
              name="modalidade"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <SelectTrigger className={inputClass}>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {modalidadesPage?.content
                      .filter(m => m.ativo)
                      .map(m => (
                        <SelectItem key={m.sigla} value={m.sigla}>
                          <span className="flex items-center gap-1.5">
                            {m.corHex && (
                              <span
                                className="inline-block w-2 h-2 rounded-full"
                                style={{ backgroundColor: m.corHex }}
                              />
                            )}
                            {m.sigla} — {m.nome}
                          </span>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            />
          </PropertyRow>

          <PropertyRow label="Localização" icon={DoorOpen} error={errors.salaId?.message}>
            <Controller
              control={control}
              name="salaId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <SelectTrigger className={inputClass}>
                    <SelectValue placeholder="Vincular a uma sala..." />
                  </SelectTrigger>
                  <SelectContent>
                    {salasPage?.content.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </PropertyRow>

          <PropertyRow label="Fabricante" icon={Building2} error={errors.fabricante?.message}>
            <Input {...register('fabricante')} placeholder="Ex: GE, Siemens..." className={inputClass} />
          </PropertyRow>

          <PropertyRow label="Modelo" icon={Settings} error={errors.modelo?.message}>
            <Input {...register('modelo')} placeholder="Ex: MAGNETOM Trio" className={inputClass} />
          </PropertyRow>

          <PropertyRow label="Nº de Série" icon={Fingerprint} error={errors.numeroSerie?.message}>
            <Input {...register('numeroSerie')} placeholder="Ex: SN-998877" className={inputClass} />
          </PropertyRow>

          <PropertyRow label="Status" icon={Info}>
            <div className="flex flex-wrap gap-2 px-1.5 -ml-1.5">
              <label className="cursor-pointer group flex items-center">
                <input type="checkbox" {...register('emManutencao')} className="sr-only" />
                <div className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors border",
                  watch('emManutencao') ? "bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-sm" : "bg-muted/50 text-muted-foreground border-border/50 group-hover:bg-muted"
                )}>
                  <div className={cn("w-1 h-1 rounded-full transition-colors", watch('emManutencao') ? "bg-amber-500" : "bg-muted-foreground/40")} />
                  Em Manutenção
                </div>
              </label>

              <label className="cursor-pointer group flex items-center">
                <input type="checkbox" {...register('calibrado')} className="sr-only" />
                <div className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors border",
                  watch('calibrado') ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-sm" : "bg-muted/50 text-muted-foreground border-border/50 group-hover:bg-muted"
                )}>
                  <ShieldCheck size={10} className={cn("transition-colors", watch('calibrado') ? "text-emerald-600" : "text-muted-foreground/60")} />
                  Calibrado
                </div>
              </label>
            </div>
          </PropertyRow>
        </div>

        {/* Project Description Block (DICOM) */}
        <div className="bg-slate-50 dark:bg-muted/10 rounded-xl p-4 border border-slate-100 dark:border-border/50 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-foreground">Conectividade DICOM</h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-[10px] font-medium text-muted-foreground">Habilitar Comunicação</span>
              <input type="checkbox" {...register('dicomHabilitado')} className="h-3.5 w-3.5 rounded border-border/60 text-primary focus:ring-primary" />
            </label>
          </div>
          
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            Permite que o equipamento envie imagens diretamente para o PACS/OmniLaudo. Preencha os dados de rede para estabelecer a conexão AET.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-[10px] font-semibold text-muted-foreground">AE Title</Label>
              <Input {...register('dicomAeTitle')} placeholder="OMNILA_MRI_01" className="h-8 bg-background/50 border-border/60 rounded-lg text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-semibold text-muted-foreground">Endereço IP</Label>
              <Input {...register('dicomIp')} placeholder="192.168.x.x" className="h-8 bg-background/50 border-border/60 rounded-lg text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-semibold text-muted-foreground">Porta</Label>
              <Input type="number" {...register('dicomPort')} placeholder="104" className="h-8 bg-background/50 border-border/60 rounded-lg text-xs" />
            </div>
          </div>
        </div>

      </div>

      <div className="pt-4 mt-2 flex items-center justify-end gap-3 shrink-0">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="text-[13px] font-medium"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-6 rounded-lg shadow-sm text-[13px] font-medium"
        >
          {isLoading ? "Salvando..." : "Salvar Equipamento"}
        </Button>
      </div>
    </form>
  );
}
