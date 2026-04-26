import { useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useUnidades, useInativarUnidade, useCreateUnidade, useUpdateUnidade } from '../../hooks/useUnidades';
import { RoleGuard } from '../../components/auth/RoleGuard';
import { Button } from '../../components/ui/button';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { DataTable, ColumnDef } from '../../components/ui/data-table';
import { UnidadeResponse, UnidadeRequest } from '../../types/unidade';
import { UnidadeForm } from './UnidadeForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';

export function Unidades() {
  const [page, setPage] = useState(0);
  const size = 10;

  // Estados de Controle do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unidadeEmEdicao, setUnidadeEmEdicao] = useState<UnidadeResponse | null>(null);

  // Hooks de Dados (TanStack Query)
  const { data: pageUnidades, isLoading, isError, error } = useUnidades(page, size);
  const inativar = useInativarUnidade();
  const criar = useCreateUnidade();
  const atualizar = useUpdateUnidade();

  const handleInativar = (id: string) => {
    if (window.confirm('Tem certeza que deseja inativar esta unidade?')) {
      inativar.mutate(id);
    }
  };

  const handleEditarUnidade = (unidade: UnidadeResponse) => {
    setUnidadeEmEdicao(unidade);
    setIsModalOpen(true);
  };

  // Definição Declarativa das Colunas da Tabela
  const columns: ColumnDef<UnidadeResponse>[] = [
    { header: 'Nome', accessorKey: 'nome', className: 'font-semibold text-foreground' },
    { header: 'CNPJ', cell: (item) => item.cnpj || '-' },
    { header: 'Telefone', cell: (item) => item.telefone || '-' },
    {
      header: 'Status',
      cell: (item) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider border ${
            item.ativo 
              ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/40' 
              : 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/40'
          }`}
        >
          {item.ativo ? 'Ativa' : 'Inativa'}
        </span>
      ),
    },
    {
      header: <span className="sr-only">Ações</span>,
      className: 'text-right',
      cell: (item) => (
        <RoleGuard allowedRoles={['SUPERADMIN', 'ADMIN']}>
          <div className="flex justify-end gap-2">
            <button 
              className="text-primary-500 hover:text-primary-700 p-2" 
              title="Editar"
              onClick={() => handleEditarUnidade(item)}
            >
              <span className="sr-only">Editar unidade</span>
              <Edit size={18} />
            </button>
            <button
              className="text-red-500 hover:text-red-700 p-2 disabled:opacity-50"
              title="Inativar"
              disabled={!item.ativo || inativar.isPending}
              onClick={() => handleInativar(item.id)}
            >
              <span className="sr-only">Inativar unidade</span>
              <Trash2 size={18} />
            </button>
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
        { label: 'Dashboard', to: '/' },
        { label: 'Unidades', to: '/unidades' },
      ]}
      backLink={{ label: 'Voltar ao Dashboard', to: '/' }}
      actions={
        <RoleGuard allowedRoles={['SUPERADMIN', 'ADMIN']}>
          <Button
            onClick={() => { setUnidadeEmEdicao(null); setIsModalOpen(true); }}
            className="bg-primary-500 hover:bg-primary-600 text-white"
          >
            <Plus size={18} className="mr-2" /> Nova Unidade
          </Button>
        </RoleGuard>
      }
    >
      <div className="space-y-8">
        <DataTable
          columns={columns}
          data={pageUnidades?.content || []}
          isLoading={isLoading}
          pageInfo={pageUnidades ? { number: pageUnidades.number, totalPages: pageUnidades.totalPages, totalElements: pageUnidades.totalElements } : undefined}
          onPageChange={setPage}
        />

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{unidadeEmEdicao ? 'Editar Unidade' : 'Cadastrar Unidade'}</DialogTitle>
              <DialogDescription>
                Certifique-se de que o CNPJ seja válido para emissão de notas fiscais.
              </DialogDescription>
            </DialogHeader>
            <UnidadeForm
              initialData={unidadeEmEdicao}
              isLoading={criar.isPending || atualizar.isPending}
              onCancel={() => setIsModalOpen(false)}
              onSubmit={async (data: UnidadeRequest) => {
                if (unidadeEmEdicao) {
                  await atualizar.mutateAsync({ id: unidadeEmEdicao.id, data });
                } else {
                  await criar.mutateAsync(data);
                }
                setIsModalOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </PageWrapper>
  );
}
