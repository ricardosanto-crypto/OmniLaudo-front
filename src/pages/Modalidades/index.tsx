import { useState, useMemo } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '../../components/ui/sheet';
import { Plus, Trash2, Edit, Search, Layers } from 'lucide-react';
import { useModalidades, useInativarModalidade, useCreateModalidade, useUpdateModalidade } from '../../hooks/useModalidades';
import { RoleGuard } from '../../components/auth/RoleGuard';
import { Button } from '../../components/ui/button';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { DataTable, ColumnDef } from '../../components/ui/data-table';
import { ModalidadeResponse, ModalidadeRequest } from '../../types/modalidade';
import { ModalidadeForm } from './ModalidadeForm';
import { Input } from '../../components/ui/input';
import { cn } from '../../lib/utils';

export function Modalidades() {
  const [page, setPage] = useState(0);
  const size = 20;
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [modalidadeEmEdicao, setModalidadeEmEdicao] = useState<ModalidadeResponse | null>(null);

  const { data: pageModalidades, isLoading, isError, error } = useModalidades(page, size);
  const inativar = useInativarModalidade();
  const criarModalidade = useCreateModalidade();
  const atualizarModalidade = useUpdateModalidade();

  const handleInativar = (id: string) => {
    if (window.confirm('Deseja realmente inativar esta modalidade?')) {
      inativar.mutate(id);
    }
  };

  const handleNovaModalidade = () => {
    setModalidadeEmEdicao(null);
    setIsSheetOpen(true);
  };

  const handleEditarModalidade = (modalidade: ModalidadeResponse) => {
    setModalidadeEmEdicao(modalidade);
    setIsSheetOpen(true);
  };

  const filteredData = useMemo(() => {
    if (!pageModalidades?.content) return [];
    return pageModalidades.content.filter((m) => {
      const matchesSearch =
        m.sigla.toLowerCase().includes(search.toLowerCase()) ||
        m.nome.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' ? true : statusFilter === 'active' ? m.ativo : !m.ativo;
      return matchesSearch && matchesStatus;
    });
  }, [pageModalidades, search, statusFilter]);

  const columns: ColumnDef<ModalidadeResponse>[] = [
    {
      header: 'Modalidade',
      cell: (item) => (
        <div className="flex items-center gap-2.5">
          <div
            className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm border"
            style={
              item.corHex
                ? {
                    backgroundColor: `${item.corHex}18`,
                    borderColor: `${item.corHex}30`,
                    color: item.corHex,
                  }
                : undefined
            }
          >
            {item.corHex ? (
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.corHex }} />
            ) : (
              <Layers size={14} className="text-muted-foreground" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-foreground tracking-tight text-[13px]">{item.sigla}</span>
            <span className="text-[11px] text-muted-foreground truncate">{item.nome}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Cor do Badge',
      cell: (item) =>
        item.corHex ? (
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full border border-border/50 shadow-sm shrink-0"
              style={{ backgroundColor: item.corHex }}
            />
            <span className="text-[11px] font-mono text-muted-foreground">{item.corHex}</span>
          </div>
        ) : (
          <span className="text-[11px] text-muted-foreground/50 italic">Não definida</span>
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
              onClick={() => handleEditarModalidade(item)}
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
      title="Modalidades de Equipamento"
      description="Gerencie os tipos de equipamentos disponíveis. As modalidades aqui cadastradas ficam disponíveis ao criar equipamentos."
      breadcrumbs={[
        { label: 'Configurações', to: '/configuracoes' },
        { label: 'Modalidades', to: '/configuracoes/modalidades' },
      ]}
      actions={
        <RoleGuard allowedRoles={['SUPERADMIN', 'ADMIN']}>
          <Button
            onClick={handleNovaModalidade}
            size="sm"
            className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs font-semibold uppercase shadow-sm shadow-primary/20"
          >
            <Plus size={14} /> Nova Modalidade
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
              placeholder="Buscar por sigla ou nome..."
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
              Todas
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
              Ativas
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-card/30 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden shadow-sm">
          <div className="p-3 border-b border-border/50 bg-muted/10 flex items-center justify-between">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground flex items-center gap-1.5">
              <div className="w-1 h-2.5 bg-primary rounded-full" />
              Tipos de Equipamento
            </h3>
            <span className="text-[10px] font-semibold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded border border-border/40">
              {filteredData.length} registros
            </span>
          </div>

          <DataTable
            columns={columns}
            data={filteredData}
            isLoading={isLoading}
            emptyMessage="Nenhuma modalidade encontrada. Clique em 'Nova Modalidade' para adicionar."
            pageInfo={
              pageModalidades
                ? {
                    number: pageModalidades.number,
                    totalPages: pageModalidades.totalPages,
                    totalElements: pageModalidades.totalElements,
                  }
                : undefined
            }
            onPageChange={setPage}
          />
        </div>

        {/* Sheet lateral direito — slide da direita para esquerda */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent
            side="right"
            className="flex flex-col gap-0 p-0 w-full sm:max-w-[420px] bg-background border-l border-border/60 shadow-2xl"
          >
            <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/40 shrink-0">
              <SheetTitle className="text-[18px] font-semibold tracking-tight">
                {modalidadeEmEdicao ? 'Editar Modalidade' : 'Nova Modalidade'}
              </SheetTitle>
              <SheetDescription className="text-[12px] text-muted-foreground">
                {modalidadeEmEdicao
                  ? 'Altere os dados da modalidade abaixo.'
                  : 'Adicione um novo tipo de equipamento ao catálogo.'}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-hidden px-6 py-5">
              <ModalidadeForm
                initialData={modalidadeEmEdicao}
                onSubmit={async (data: ModalidadeRequest) => {
                  if (modalidadeEmEdicao) {
                    await atualizarModalidade.mutateAsync({ id: modalidadeEmEdicao.id, data });
                  } else {
                    await criarModalidade.mutateAsync(data);
                  }
                  setIsSheetOpen(false);
                }}
                isLoading={criarModalidade.isPending || atualizarModalidade.isPending}
                onCancel={() => setIsSheetOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </PageWrapper>
  );
}
