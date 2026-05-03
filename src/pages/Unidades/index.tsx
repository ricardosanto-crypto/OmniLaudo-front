import { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Edit,
  Search,
  Filter,
  Download,
  Building2,
  MapPin,
  Phone,
} from 'lucide-react';
import { useUnidades, useInativarUnidade, useCreateUnidade, useUpdateUnidade } from '../../hooks/useUnidades';
import { RoleGuard } from '../../components/auth/RoleGuard';
import { Button } from '../../components/ui/button';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { DataTable, ColumnDef } from '../../components/ui/data-table';
import { UnidadeResponse, UnidadeRequest } from '../../types/unidade';
import { UnidadeForm } from './UnidadeForm';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../../components/ui/sheet';
import { Input } from '../../components/ui/input';
import { cn } from '../../lib/utils';

export function Unidades() {
  const [page, setPage] = useState(0);
  const size = 10;
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Estados de Controle do Panel (Dialog)
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [unidadeEmEdicao, setUnidadeEmEdicao] = useState<UnidadeResponse | null>(null);

  // Hooks de Dados (TanStack Query)
  const { data: pageUnidades, isLoading, isError, error } = useUnidades(page, size);
  const inativar = useInativarUnidade();
  const criarUnidade = useCreateUnidade();
  const atualizarUnidade = useUpdateUnidade();

  // Filtros locais (enquanto o backend não tem busca completa implementada)
  const filteredData = useMemo(() => {
    if (!pageUnidades?.content) return [];
    return pageUnidades.content.filter(u => {
      const matchesSearch = u.nome.toLowerCase().includes(search.toLowerCase()) ||
        (u.cnpj && u.cnpj.includes(search));
      const matchesStatus = statusFilter === 'all' ? true : (statusFilter === 'active' ? u.ativo : !u.ativo);
      return matchesSearch && matchesStatus;
    });
  }, [pageUnidades, search, statusFilter]);

  const handleInativar = (id: string) => {
    if (window.confirm('Tem certeza que deseja inativar esta unidade?')) {
      inativar.mutate(id);
    }
  };

  const handleEditarUnidade = (unidade: UnidadeResponse) => {
    setUnidadeEmEdicao(unidade);
    setIsSheetOpen(true);
  };

  // Definição das Colunas
  const columns: ColumnDef<UnidadeResponse>[] = [
    {
      header: 'Unidade',
      cell: (item) => (
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0 shadow-sm">
            <Building2 size={14} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-foreground truncate tracking-tight text-[13px]">{item.nome}</span>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1 opacity-80">
              <MapPin size={10} /> {item.cnpj || 'CNPJ não informado'}
            </span>
          </div>
        </div>
      )
    },
    {
      header: 'Contato',
      cell: (item) => (
        <div className="flex flex-col">
          <span className="text-[12px] font-medium text-foreground/80 flex items-center gap-1.5">
            <Phone size={12} className="text-muted-foreground" /> {item.telefone || '-'}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-tight">CNPJ: {item.cnpj || 'não informado'}</span>
        </div>
      )
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
          {item.ativo ? 'Ativa' : 'Inativa'}
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
              onClick={() => handleEditarUnidade(item)}
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

  if (isError) return <div className="p-8 text-red-500">Erro ao carregar: {error?.message}</div>;

  return (
    <PageWrapper
      title="Unidades"
      description="Configure as filiais, clínicas e unidades de atendimento com segurança."
      breadcrumbs={[
        { label: 'Configurações', to: '/configuracoes' },
        { label: 'Unidades', to: '/configuracoes/unidades' },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-semibold uppercase hidden sm:flex border-border/60">
            <Download size={14} /> Exportar CSV
          </Button>
          <RoleGuard allowedRoles={['SUPERADMIN', 'ADMIN']}>
            <Button
              onClick={() => { setUnidadeEmEdicao(null); setIsSheetOpen(true); }}
              size="sm"
              className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs font-semibold uppercase shadow-sm shadow-primary/20"
            >
              <Plus size={14} /> Nova Unidade
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
              placeholder="Buscar unidade por nome ou CNPJ..."
              className="pl-8 h-8 bg-background/50 border-border/60 focus:border-primary transition-all rounded-lg text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:block">
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground bg-muted border border-border rounded-md shadow-sm">⌘K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border/50">
              <button
                onClick={() => setStatusFilter('all')}
                className={cn(
                  "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all",
                  statusFilter === 'all' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Todos
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

            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-border/60 lg:hidden">
              <Filter size={14} />
            </Button>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-card/30 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden shadow-sm">
          <div className="p-3 border-b border-border/50 bg-muted/10 flex items-center justify-between">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground flex items-center gap-1.5">
              <div className="w-1 h-2.5 bg-primary rounded-full" />
              Listagem de Unidades
            </h3>
            <span className="text-[10px] font-semibold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded border border-border/40">
              {filteredData.length} registros
            </span>
          </div>

          <DataTable
            columns={columns}
            data={filteredData}
            isLoading={isLoading}
            pageInfo={pageUnidades ? { number: pageUnidades.number, totalPages: pageUnidades.totalPages, totalElements: pageUnidades.totalElements } : undefined}
            onPageChange={setPage}
            emptyMessage={search ? "Nenhuma unidade encontrada para esta busca." : "Nenhuma unidade cadastrada."}
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
                {unidadeEmEdicao ? 'Gerenciar Unidade' : 'Nova Unidade'}
              </SheetTitle>
              <SheetDescription className="text-[12px] text-muted-foreground">
                {unidadeEmEdicao ? 'Edite os dados da unidade abaixo.' : 'Preencha os dados para cadastrar uma nova unidade.'}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5">
              <UnidadeForm
                initialData={unidadeEmEdicao}
                isLoading={criarUnidade.isPending || atualizarUnidade.isPending}
                onCancel={() => setIsSheetOpen(false)}
                onSubmit={async (data: UnidadeRequest) => {
                  if (unidadeEmEdicao) {
                    await atualizarUnidade.mutateAsync({ id: unidadeEmEdicao.id, data });
                  } else {
                    await criarUnidade.mutateAsync(data);
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
