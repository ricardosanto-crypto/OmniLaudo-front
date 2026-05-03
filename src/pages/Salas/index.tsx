import { useState, useMemo } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../../components/ui/sheet';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  Building2, 
  DoorOpen,
} from 'lucide-react';
import { useSalas, useInativarSala, useCreateSala, useUpdateSala } from '../../hooks/useSalas';
import { useUnidades } from '../../hooks/useUnidades';
import { RoleGuard } from '../../components/auth/RoleGuard';
import { Button } from '../../components/ui/button';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { DataTable, ColumnDef } from '../../components/ui/data-table';
import { SalaResponse, SalaRequest } from '../../types/sala';
import { SalaForm } from './SalaForm';
import { Input } from '../../components/ui/input';
import { cn } from '../../lib/utils';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../components/ui/select';

export function Salas() {
  const [page, setPage] = useState(0);
  const size = 10;
  const [search, setSearch] = useState('');
  const [selectedUnidade, setSelectedUnidade] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [salaEmEdicao, setSalaEmEdicao] = useState<SalaResponse | null>(null);

  const { data: pageSalas, isLoading, isError, error } = useSalas(page, size);
  const { data: unidadesPage } = useUnidades(0, 100);
  const inativar = useInativarSala();
  const criarSala = useCreateSala();
  const atualizarSala = useUpdateSala();

  const handleInativar = (id: string) => {
    if (window.confirm('Deseja realmente inativar esta sala?')) {
      inativar.mutate(id);
    }
  };

  const handleNovaSala = () => {
    setSalaEmEdicao(null);
    setIsSheetOpen(true);
  };

  const handleEditarSala = (sala: SalaResponse) => {
    setSalaEmEdicao(sala);
    setIsSheetOpen(true);
  };

  const unidadeMap = useMemo(() => {
    const map = new Map<string, string>();
    unidadesPage?.content.forEach((unidade) => {
      map.set(unidade.id, unidade.nome);
    });
    return map;
  }, [unidadesPage]);

  const filteredData = useMemo(() => {
    if (!pageSalas?.content) return [];
    return pageSalas.content.filter(s => {
      const matchesSearch = s.nome.toLowerCase().includes(search.toLowerCase());
      const matchesUnidade = selectedUnidade === 'all' ? true : s.unidadeId === selectedUnidade;
      const matchesStatus = statusFilter === 'all' ? true : (statusFilter === 'active' ? s.ativo : !s.ativo);
      return matchesSearch && matchesUnidade && matchesStatus;
    });
  }, [pageSalas, search, selectedUnidade, statusFilter]);

  const columns: ColumnDef<SalaResponse>[] = [
    {
      header: 'Sala de Exame',
      cell: (item) => (
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0 shadow-sm">
            <DoorOpen size={14} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-foreground truncate tracking-tight text-[13px]">{item.nome}</span>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1 opacity-80">
              ID: {item.id.slice(0, 8)}
            </span>
          </div>
        </div>
      )
    },
    {
      header: 'Unidade',
      cell: (item) => (
        <div className="flex items-center gap-2 text-[12px] font-medium text-foreground/90">
          <Building2 size={12} className="text-muted-foreground" />
          {unidadeMap.get(item.unidadeId) || item.unidadeNome || 'Unidade não vinculada'}
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (item) => (
        <div className={cn(
          "inline-flex items-center gap-1.5 px-1.5 py-0 rounded border text-[10px] font-bold uppercase tracking-wider",
          item.ativo
            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
            : "bg-rose-500/10 text-rose-500 border-rose-500/20"
        )}>
          <div className={cn("h-1 w-1 rounded-full", item.ativo ? "bg-emerald-500" : "bg-rose-500")} />
          {item.ativo ? 'Operacional' : 'Inativa'}
        </div>
      ),
    },
    {
      header: <span className="sr-only">Ações</span>,
      className: 'text-right',
      cell: (item) => (
        <RoleGuard allowedRoles={['SUPERADMIN', 'ADMIN']}>
          <div className="flex justify-end gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-primary transition-colors"
              onClick={() => handleEditarSala(item)}
            >
              <Edit size={12} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive transition-colors"
              disabled={!item.ativo || inativar.isPending}
              onClick={() => handleInativar(item.id)}
            >
              <Trash2 size={12} />
            </Button>
          </div>
        </RoleGuard>
      ),
    },
  ];

  if (isError) return <div className="p-8 text-red-500">Erro: {error?.message}</div>;

  return (
    <PageWrapper
      title="Salas de Exames"
      description="Gerencie as salas e espaços físicos destinados à realização de procedimentos."
      breadcrumbs={[
        { label: 'Configurações', to: '/configuracoes' },
        { label: 'Salas', to: '/configuracoes/salas' },
      ]}
      actions={
        <RoleGuard allowedRoles={['SUPERADMIN', 'ADMIN']}>
          <Button
            onClick={handleNovaSala}
            size="sm"
            className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs font-semibold uppercase shadow-sm shadow-primary/20"
          >
            <Plus size={14} /> Nova Sala
          </Button>
        </RoleGuard>
      }
    >
      <div className="space-y-3">
        {/* Filtros e Busca */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-card/40 backdrop-blur-sm p-3 rounded-xl border border-border/50 shadow-sm">
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Buscar sala por nome..."
              className="pl-8 h-8 bg-background/50 border-border/60 focus:border-primary transition-all rounded-lg text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <Select value={selectedUnidade} onValueChange={(v) => setSelectedUnidade(v || 'all')}>
              <SelectTrigger className="h-8 w-full md:w-[180px] bg-background/50 border-border/60 rounded-lg text-[11px] font-semibold uppercase tracking-tight">
                <SelectValue placeholder="Todas as Unidades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Unidades</SelectItem>
                {unidadesPage?.content.map(u => (
                  <SelectItem key={u.id} value={u.id}>{u.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border/50">
              <button
                onClick={() => setStatusFilter('all')}
                className={cn(
                  "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all",
                  statusFilter === 'all' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Todas
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={cn(
                  "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all",
                  statusFilter === 'active' ? "bg-card text-emerald-500 shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Ativas
              </button>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-card/30 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden shadow-sm">
          <div className="p-3 border-b border-border/50 bg-muted/10 flex items-center justify-between">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground flex items-center gap-1.5">
              <div className="w-1 h-2.5 bg-primary rounded-full" />
              Salas por Unidade
            </h3>
            <span className="text-[10px] font-semibold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded border border-border/40">
              {filteredData.length} registros
            </span>
          </div>

          <DataTable
            columns={columns}
            data={filteredData}
            isLoading={isLoading}
            emptyMessage="Nenhuma sala encontrada."
            pageInfo={pageSalas ? { number: pageSalas.number, totalPages: pageSalas.totalPages, totalElements: pageSalas.totalElements } : undefined}
            onPageChange={setPage}
          />
        </div>

        {/* Sheet lateral — slide da direita para esquerda */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent
            side="right"
            className="flex flex-col gap-0 p-0 w-full sm:max-w-[480px] bg-background border-l border-border/60 shadow-2xl"
          >
            <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/40 shrink-0">
              <SheetTitle className="text-[18px] font-semibold tracking-tight">
                {salaEmEdicao ? 'Gerenciar Sala' : 'Nova Sala'}
              </SheetTitle>
              <SheetDescription className="text-[12px] text-muted-foreground">
                {salaEmEdicao ? 'Edite os dados da sala abaixo.' : 'Preencha os dados para cadastrar uma nova sala.'}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5">
              <SalaForm
                initialData={salaEmEdicao}
                onSubmit={async (data: SalaRequest) => {
                  if (salaEmEdicao) {
                    await atualizarSala.mutateAsync({ id: salaEmEdicao.id, data });
                  } else {
                    await criarSala.mutateAsync(data);
                  }
                  setIsSheetOpen(false);
                }}
                isLoading={criarSala.isPending || atualizarSala.isPending}
                onCancel={() => setIsSheetOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </PageWrapper>
  );
}

