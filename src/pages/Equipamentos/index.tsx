import { useState, useMemo } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../../components/ui/sheet';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Cpu, 
  Wrench, 
  ShieldAlert, 
  Activity, 
  Download,
  Filter,
} from 'lucide-react';
import { useEquipamentos, useCreateEquipamento, useUpdateEquipamento, useDeleteEquipamento } from '../../hooks/useEquipamentos';
import { DataTable, ColumnDef } from '../../components/ui/data-table';
import { EquipamentoResponse, EquipamentoRequest } from '../../types/equipamento';
import { EquipamentoForm } from './EquipamentoForm';
import { RoleGuard } from '../../components/auth/RoleGuard';
import { Button } from '../../components/ui/button';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Input } from '../../components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../components/ui/select';

export function Equipamentos() {
  const [page, setPage] = useState(0);
  const size = 10;
  const [search, setSearch] = useState('');
  const [modalidadeFilter, setModalidadeFilter] = useState<string>('all');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [equipEmEdicao, setEquipEmEdicao] = useState<EquipamentoResponse | null>(null);

  const { data: pageEquip, isLoading, isError, error } = useEquipamentos(page, size);
  const criar = useCreateEquipamento();
  const atualizar = useUpdateEquipamento();
  const inativar = useDeleteEquipamento();

  const handleEdit = (equip: EquipamentoResponse) => {
    setEquipEmEdicao({
      ...equip,
      salaId: equip.salaId ? String(equip.salaId) : undefined
    });
    setIsSheetOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Deseja realmente inativar este equipamento? Isso o removerá na lista de agendamentos e sua modalidade do PACS.")) {
      inativar.mutate(id);
    }
  };

  const filteredData = useMemo(() => {
    if (!pageEquip?.content) return [];
    return pageEquip.content.filter(e => {
      const matchesSearch = e.nome.toLowerCase().includes(search.toLowerCase()) ||
        (e.fabricante?.toLowerCase().includes(search.toLowerCase()));
      const matchesModalidade = modalidadeFilter === 'all' ? true : e.modalidade === modalidadeFilter;
      return matchesSearch && matchesModalidade;
    });
  }, [pageEquip, search, modalidadeFilter]);

  const modalities = useMemo(() => {
    if (!pageEquip?.content) return [];
    return Array.from(new Set(pageEquip.content.map(e => e.modalidade)));
  }, [pageEquip]);

  const columns: ColumnDef<EquipamentoResponse>[] = [
    {
      header: 'Equipamento',
      cell: (item) => (
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0 shadow-sm">
            <Cpu size={14} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-foreground truncate tracking-tight text-[13px]">{item.nome}</span>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1 opacity-80">
              {item.fabricante || 'Fabricante não informado'}
            </span>
          </div>
        </div>
      )
    },
    {
      header: 'Modalidade',
      cell: (i) => (
        <span className="bg-blue-500/10 text-blue-500 px-1.5 py-0 rounded border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider">
          {i.modalidade}
        </span>
      )
    },
    {
      header: 'Localização',
      cell: (i) => (
        <div className="flex flex-col">
          <span className="text-[12px] font-medium text-foreground/90">{i.salaNome || 'Sem Sala'}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-tight">Espaço Físico</span>
        </div>
      )
    },
    {
      header: 'Status & Saúde',
      cell: (i) => (
        <div className="flex flex-wrap gap-1">
          {i.emManutencao ? (
            <div className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-500 px-1.5 py-0 rounded border border-amber-500/20 text-[10px] font-bold uppercase tracking-wider">
              <Wrench size={10} /> Manutenção
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-500 px-1.5 py-0 rounded border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
              <Activity size={10} /> Operacional
            </div>
          )}

          {!i.calibrado && (
            <div className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-500 px-1.5 py-0 rounded border border-rose-500/20 text-[10px] font-bold uppercase tracking-wider">
              <ShieldAlert size={10} /> Calibração
            </div>
          )}
        </div>
      )
    },
    {
      header: <span className="sr-only">Ações</span>,
      className: 'text-right',
      cell: (i) => (
        <RoleGuard allowedRoles={['SUPERADMIN', 'ADMIN']}>
          <div className="flex justify-end gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-primary transition-colors"
              onClick={() => handleEdit(i)}
            >
              <Edit size={12} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive transition-colors"
              onClick={() => handleDelete(i.id)}
            >
              <Trash2 size={12} />
            </Button>
          </div>
        </RoleGuard>
      )
    }
  ];

  if (isError) return <div className="p-8 text-red-500">Erro: {error?.message}</div>;

  return (
    <PageWrapper
      title="Inventário de Equipamentos"
      description="Gerencie as máquinas DICOM, modalidades e status técnico de operação."
      breadcrumbs={[
        { label: 'Configurações', to: '/configuracoes' },
        { label: 'Equipamentos', to: '/configuracoes/equipamentos' },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-semibold uppercase hidden sm:flex border-border/60">
            <Download size={14} /> Relatório
          </Button>
          <RoleGuard allowedRoles={['SUPERADMIN', 'ADMIN']}>
            <Button
              onClick={() => { setEquipEmEdicao(null); setIsSheetOpen(true); }}
              size="sm"
              className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs font-semibold uppercase shadow-sm shadow-primary/20"
            >
              <Plus size={14} /> Novo Equipamento
            </Button>
          </RoleGuard>
        </div>
      }
    >
      <div className="space-y-3">
        {/* Filtros e Busca */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-card/40 backdrop-blur-sm p-3 rounded-xl border border-border/50 shadow-sm">
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Buscar por nome ou fabricante..."
              className="pl-8 h-8 bg-background/50 border-border/60 focus:border-primary transition-all rounded-lg text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <Select value={modalidadeFilter} onValueChange={(v) => setModalidadeFilter(v || 'all')}>
              <SelectTrigger className="h-8 w-full md:w-[150px] bg-background/50 border-border/60 rounded-lg text-[11px] font-semibold uppercase tracking-tight">
                <SelectValue placeholder="Todas Modalidades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Modalidades</SelectItem>
                {modalities.map(m => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-border/60">
              <Filter size={14} />
            </Button>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-card/30 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden shadow-sm">
          <div className="p-3 border-b border-border/50 bg-muted/10 flex items-center justify-between">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground flex items-center gap-1.5">
              <div className="w-1 h-2.5 bg-primary rounded-full" />
              Ativos Tecnológicos
            </h3>
            <span className="text-[10px] font-semibold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded border border-border/40">
              {filteredData.length} máquinas
            </span>
          </div>

          <DataTable
            columns={columns}
            data={filteredData}
            isLoading={isLoading}
            emptyMessage="Nenhum equipamento encontrado."
            pageInfo={pageEquip ? { number: pageEquip.number, totalPages: pageEquip.totalPages, totalElements: pageEquip.totalElements } : undefined}
            onPageChange={setPage}
          />
        </div>

        {/* Sheet lateral — slide da direita para esquerda */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent
            side="right"
            className="flex flex-col gap-0 p-0 w-full sm:max-w-[560px] bg-background border-l border-border/60 shadow-2xl"
          >
            <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/40 shrink-0">
              <SheetTitle className="text-[18px] font-semibold tracking-tight">
                {equipEmEdicao ? 'Gerenciar Equipamento' : 'Novo Equipamento'}
              </SheetTitle>
              <SheetDescription className="text-[12px] text-muted-foreground">
                {equipEmEdicao ? 'Edite os dados do equipamento abaixo.' : 'Preencha os dados do novo equipamento.'}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5">
              <EquipamentoForm
                initialData={equipEmEdicao}
                isLoading={criar.isPending || atualizar.isPending}
                onCancel={() => setIsSheetOpen(false)}
                onSubmit={async (data: EquipamentoRequest) => {
                  if (equipEmEdicao) {
                    await atualizar.mutateAsync({ id: equipEmEdicao.id, data });
                  } else {
                    await criar.mutateAsync(data);
                  }
                  setIsSheetOpen(false);
                }}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </PageWrapper>
  );
}

