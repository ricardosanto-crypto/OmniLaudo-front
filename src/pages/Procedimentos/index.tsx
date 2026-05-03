import { useState, useMemo } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '../../components/ui/sheet';
import { Plus, Trash2, Edit, Search, Stethoscope } from 'lucide-react';
import { useProcedimentos, useDeleteProcedimento, useCreateProcedimento, useUpdateProcedimento } from '../../hooks/useProcedimentos';
import { useModalidades } from '../../hooks/useModalidades';
import { RoleGuard } from '../../components/auth/RoleGuard';
import { Button } from '../../components/ui/button';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { DataTable, ColumnDef } from '../../components/ui/data-table';
import { ProcedimentoResponse, ProcedimentoRequest } from '../../types/procedimento';
import { ProcedimentoForm } from './ProcedimentoForm';
import { Input } from '../../components/ui/input';
import { cn } from '../../lib/utils';

export function Procedimentos() {
  const [page, setPage] = useState(0);
  const size = 10;
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [procedimentoEmEdicao, setProcedimentoEmEdicao] = useState<ProcedimentoResponse | null>(null);

  const { data: pageProcedimentos, isLoading, isError, error } = useProcedimentos(page, size);
  const { data: pageModalidades } = useModalidades(0, 100);
  const deleteProcedimento = useDeleteProcedimento();
  const criarProcedimento = useCreateProcedimento();
  const atualizarProcedimento = useUpdateProcedimento();

  const handleInativar = (id: string) => {
    if (window.confirm('Deseja realmente inativar este procedimento?')) {
      deleteProcedimento.mutate(id);
    }
  };

  const handleNovo = () => {
    setProcedimentoEmEdicao(null);
    setIsSheetOpen(true);
  };

  const handleEditar = (procedimento: ProcedimentoResponse) => {
    setProcedimentoEmEdicao(procedimento);
    setIsSheetOpen(true);
  };

  const filteredData = useMemo(() => {
    if (!pageProcedimentos?.content) return [];
    return pageProcedimentos.content.filter((p) => {
      const matchesSearch =
        p.codigo.toLowerCase().includes(search.toLowerCase()) ||
        p.nome.toLowerCase().includes(search.toLowerCase()) ||
        p.modalidadeSigla.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' ? true : statusFilter === 'active' ? p.ativo : !p.ativo;
      return matchesSearch && matchesStatus;
    });
  }, [pageProcedimentos, search, statusFilter]);

  const columns: ColumnDef<ProcedimentoResponse>[] = [
    {
      header: 'Código & Nome',
      cell: (item) => (
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm border bg-indigo-500/10 border-indigo-500/20 text-indigo-500">
            <Stethoscope size={14} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-foreground tracking-tight text-[13px] truncate">{item.nome}</span>
            <span className="text-[11px] font-mono text-muted-foreground">{item.codigo}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Modalidade',
      cell: (item) => {
        const modalidadeObj = pageModalidades?.content.find(m => m.id === item.modalidadeId);
        const cor = modalidadeObj?.corHex || '#888';
        return (
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full border border-border/50 shadow-sm shrink-0 flex items-center justify-center text-[8px] font-black"
              style={{ backgroundColor: `${cor}25`, color: cor, borderColor: `${cor}50` }}
            >
              {item.modalidadeSigla.substring(0, 2)}
            </div>
            <span className="text-[11px] font-bold text-muted-foreground">{item.modalidadeSigla}</span>
          </div>
        );
      },
    },
    {
      header: 'Duração (min)',
      cell: (item) => (
        <span className="text-[12px] font-mono font-semibold text-muted-foreground">
          {item.duracaoEstimadaMinutos} min
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (item) => (
        <div
          className={cn(
            'inline-flex items-center gap-1.5 px-1.5 py-0 rounded border text-[10px] font-bold uppercase tracking-wider',
            item.ativo
              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
          )}
        >
          <div
            className={cn('h-1 w-1 rounded-full', item.ativo ? 'bg-emerald-500' : 'bg-rose-500')}
          />
          {item.ativo ? 'Ativo' : 'Inativo'}
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
              onClick={() => handleEditar(item)}
            >
              <Edit size={12} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive transition-colors"
              disabled={!item.ativo || deleteProcedimento.isPending}
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
      title="Procedimentos TUSS"
      description="Gerencie o catálogo de procedimentos médicos (TUSS). Eles são vinculados às modalidades e usados no agendamento."
      breadcrumbs={[
        { label: 'Configurações', to: '/configuracoes' },
        { label: 'Procedimentos', to: '/configuracoes/procedimentos' },
      ]}
      actions={
        <RoleGuard allowedRoles={['SUPERADMIN', 'ADMIN']}>
          <Button
            onClick={handleNovo}
            size="sm"
            className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs font-semibold uppercase shadow-sm shadow-primary/20"
          >
            <Plus size={14} /> Novo Procedimento
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
              placeholder="Buscar por código, nome ou sigla..."
              className="pl-8 h-8 bg-background/50 border-border/60 focus:border-primary transition-all rounded-lg text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border/50">
            <button
              onClick={() => setStatusFilter('all')}
              className={cn(
                'px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all',
                statusFilter === 'all'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={cn(
                'px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all',
                statusFilter === 'active'
                  ? 'bg-card text-emerald-500 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Ativos
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-card/30 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden shadow-sm">
          <div className="p-3 border-b border-border/50 bg-muted/10 flex items-center justify-between">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground flex items-center gap-1.5">
              <div className="w-1 h-2.5 bg-primary rounded-full" />
              Catálogo TUSS
            </h3>
            <span className="text-[10px] font-semibold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded border border-border/40">
              {filteredData.length} registros
            </span>
          </div>

          <DataTable
            columns={columns}
            data={filteredData}
            isLoading={isLoading}
            emptyMessage="Nenhum procedimento encontrado. Clique em 'Novo Procedimento' para adicionar."
            pageInfo={pageProcedimentos ? { number: pageProcedimentos.number, totalPages: pageProcedimentos.totalPages, totalElements: pageProcedimentos.totalElements } : undefined}
            onPageChange={setPage}
          />
        </div>

        {/* Sheet lateral direito */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent
            side="right"
            className="flex flex-col gap-0 p-0 w-full sm:max-w-[420px] bg-background border-l border-border/60 shadow-2xl"
          >
            <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/40 shrink-0">
              <SheetTitle className="text-[18px] font-semibold tracking-tight">
                {procedimentoEmEdicao ? 'Editar Procedimento' : 'Novo Procedimento'}
              </SheetTitle>
              <SheetDescription className="text-[12px] text-muted-foreground">
                {procedimentoEmEdicao
                  ? 'Altere os dados do procedimento abaixo.'
                  : 'Adicione um novo procedimento TUSS ao catálogo.'}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-hidden px-6 py-5">
              <ProcedimentoForm
                initialData={procedimentoEmEdicao}
                modalidades={pageModalidades?.content || []}
                onSubmit={async (data: ProcedimentoRequest) => {
                  if (procedimentoEmEdicao) {
                    await atualizarProcedimento.mutateAsync({ id: procedimentoEmEdicao.id, data });
                  } else {
                    await criarProcedimento.mutateAsync(data);
                  }
                  setIsSheetOpen(false);
                }}
                isLoading={criarProcedimento.isPending || atualizarProcedimento.isPending}
                onCancel={() => setIsSheetOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </PageWrapper>
  );
}
