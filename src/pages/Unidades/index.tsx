import { useState } from 'react';
import { Building2, Plus, Trash2, Edit } from 'lucide-react';
import { useUnidades, useInativarUnidade, useCreateUnidade, useUpdateUnidade } from '../../hooks/useUnidades';
import { RoleGuard } from '../../components/auth/RoleGuard';
import { Button } from '../../components/ui/button';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { DataTable, ColumnDef } from '../../components/ui/data-table';
import { UnidadeResponse } from '../../types/unidade';
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
  const { mutate: inativar, isPending: isDeleting } = useInativarUnidade();
  const { mutate: criar, isPending: isCreating } = useCreateUnidade();
  const { mutate: atualizar, isPending: isUpdating } = useUpdateUnidade();

  const handleInativar = (id: string) => {
    if (window.confirm('Tem certeza que deseja inativar esta unidade?')) {
      inativar(id);
    }
  };

  const handleEditarUnidade = (unidade: UnidadeResponse) => {
    setUnidadeEmEdicao(unidade);
    setIsModalOpen(true);
  };

  // Definição Declarativa das Colunas da Tabela
  const columns: ColumnDef<UnidadeResponse>[] = [
    { header: 'Nome', accessorKey: 'nome', className: 'font-medium text-gray-900' },
    { header: 'CNPJ', cell: (item) => item.cnpj || '-' },
    { header: 'Telefone', cell: (item) => item.telefone || '-' },
    {
      header: 'Status',
      cell: (item) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
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
              disabled={!item.ativo || isDeleting}
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
    <PageWrapper>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="text-primary-500" /> 
              Unidades
            </h1>
            <p className="text-sm text-gray-500">Configure as filiais, clínicas e unidades de atendimento.</p>
          </div>
          <RoleGuard allowedRoles={['SUPERADMIN', 'ADMIN']}>
            <Button onClick={() => { setUnidadeEmEdicao(null); setIsModalOpen(true); }} className="bg-primary-500 hover:bg-primary-600 text-white">
              <Plus size={18} className="mr-2" /> Nova Unidade
            </Button>
          </RoleGuard>
        </div>

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
              isLoading={isCreating || isUpdating} 
              onCancel={() => setIsModalOpen(false)}
              onSubmit={(data: any) => {
                if (unidadeEmEdicao) {
                  atualizar({ id: unidadeEmEdicao.id, data }, { onSuccess: () => setIsModalOpen(false) });
                } else {
                  criar(data, { onSuccess: () => setIsModalOpen(false) });
                }
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </PageWrapper>
  );
}
