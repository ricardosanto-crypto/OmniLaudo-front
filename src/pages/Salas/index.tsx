import { useState } from 'react';
import { DoorOpen, Plus, Trash2, Edit } from 'lucide-react';
import { useSalas, useInativarSala, useCreateSala, useUpdateSala } from '../../hooks/useSalas';
import { RoleGuard } from '../../components/auth/RoleGuard';
import { DataTable, ColumnDef } from '../../components/ui/data-table';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { SalaResponse, SalaRequest } from '../../types/sala';

import { SalaForm } from './SalaForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';

export function Salas() {
  const [page, setPage] = useState(0);
  const size = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salaEmEdicao, setSalaEmEdicao] = useState<SalaResponse | null>(null);

  const { data: pageSalas, isLoading, isError, error } = useSalas(page, size);
  const { mutate: inativar, isPending: isDeleting } = useInativarSala();
  const { mutate: criarSala, isPending: isCreating } = useCreateSala();
  const { mutate: atualizarSala, isPending: isUpdating } = useUpdateSala();

  const handleInativar = (id: string) => {
    if (window.confirm('Deseja realmente inativar esta sala?')) {
      inativar(id);
    }
  };

  const handleNovaSala = () => {
    setSalaEmEdicao(null);
    setIsModalOpen(true);
  };

  const handleEditarSala = (sala: SalaResponse) => {
    setSalaEmEdicao(sala);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: SalaRequest) => {
    if (salaEmEdicao) {
      atualizarSala(
        { id: salaEmEdicao.id, data },
        { onSuccess: () => setIsModalOpen(false) }
      );
    } else {
      criarSala(data, { onSuccess: () => setIsModalOpen(false) });
    }
  };

  const columns: ColumnDef<SalaResponse>[] = [
    { header: 'Nome da Sala', accessorKey: 'nome', className: 'font-medium text-gray-900' },
    { header: 'Unidade', accessorKey: 'unidadeNome' },
    {
      header: 'Status',
      cell: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
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
              onClick={() => handleEditarSala(item)}
            >
              <span className="sr-only">Editar sala</span>
              <Edit size={18} />
            </button>
            <button
              className="text-red-500 hover:text-red-700 p-2 disabled:opacity-50"
              title="Inativar"
              disabled={!item.ativo || isDeleting}
              onClick={() => handleInativar(item.id)}
            >
              <span className="sr-only">Inativar sala</span>
              <Trash2 size={18} />
            </button>
          </div>
        </RoleGuard>
      ),
    },
  ];

  if (isError) return <div className="p-8 text-red-500">Erro: {error?.message}</div>;

  return (
    <PageWrapper>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <DoorOpen className="text-primary-500" />
              Gestão de Salas
            </h1>
            <p className="text-sm text-gray-500">Administre as salas de exames de cada unidade.</p>
          </div>

          <RoleGuard allowedRoles={['SUPERADMIN', 'ADMIN']}>
            <button 
              onClick={handleNovaSala} 
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors"
            >
              <Plus size={18} /> Nova Sala
            </button>
          </RoleGuard>
        </div>

        <DataTable
          columns={columns}
          data={pageSalas?.content || []}
          isLoading={isLoading}
          emptyMessage="Nenhuma sala encontrada."
          pageInfo={pageSalas ? { number: pageSalas.number, totalPages: pageSalas.totalPages, totalElements: pageSalas.totalElements } : undefined}
          onPageChange={setPage}
        />

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{salaEmEdicao ? 'Editar Sala' : 'Cadastrar Nova Sala'}</DialogTitle>
              <DialogDescription>
                {salaEmEdicao 
                  ? 'Atualize os dados da sala selecionada.' 
                  : 'Preencha os dados abaixo para cadastrar uma nova sala.'}
              </DialogDescription>
            </DialogHeader>
            <SalaForm 
              initialData={salaEmEdicao} 
              onSubmit={handleSubmit} 
              isLoading={isCreating || isUpdating} 
              onCancel={() => setIsModalOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>
    </PageWrapper>
  );
}
