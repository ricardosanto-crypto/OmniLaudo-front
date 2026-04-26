import { useMemo, useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useSalas, useInativarSala, useCreateSala, useUpdateSala } from '../../hooks/useSalas';
import { useUnidades } from '../../hooks/useUnidades';
import { RoleGuard } from '../../components/auth/RoleGuard';
import { DataTable, ColumnDef } from '../../components/ui/data-table';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { SalaResponse, SalaRequest } from '../../types/sala';
import { Button } from '../../components/ui/button';
import { SalaForm } from './SalaForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';

export function Salas() {
  const [page, setPage] = useState(0);
  const size = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
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
    setIsModalOpen(true);
  };

  const handleEditarSala = (sala: SalaResponse) => {
    setSalaEmEdicao(sala);
    setIsModalOpen(true);
  };

  const unidadeMap = useMemo(() => {
    const map = new Map<string, string>();
    unidadesPage?.content.forEach((unidade) => {
      map.set(unidade.id, unidade.nome);
    });
    return map;
  }, [unidadesPage]);

  const columns: ColumnDef<SalaResponse>[] = [
    { header: 'Nome da Sala', accessorKey: 'nome', className: 'font-semibold text-foreground' },
    {
      header: 'Unidade',
      cell: (item) => unidadeMap.get(item.unidadeId) || item.unidadeNome || item.unidadeId,
    },
    {
      header: 'Status',
      cell: (item) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider border ${
          item.ativo 
            ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/40' 
            : 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/40'
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
              disabled={!item.ativo || inativar.isPending}
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
    <PageWrapper
      title="Gestão de Salas"
      description="Administre as salas de exames de cada unidade com controle total."
      breadcrumbs={[
        { label: 'Dashboard', to: '/' },
        { label: 'Salas', to: '/salas' },
      ]}
      backLink={{ label: 'Voltar ao Dashboard', to: '/' }}
      actions={
        <RoleGuard allowedRoles={['SUPERADMIN', 'ADMIN']}>
          <Button
            onClick={handleNovaSala}
            className="bg-primary-500 hover:bg-primary-600 text-white"
          >
            <Plus size={18} className="mr-2" /> Nova Sala
          </Button>
        </RoleGuard>
      }
    >
      <div className="space-y-8">
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
              onSubmit={async (data: SalaRequest) => {
                if (salaEmEdicao) {
                  await atualizarSala.mutateAsync({ id: salaEmEdicao.id, data });
                } else {
                  await criarSala.mutateAsync(data);
                }
                setIsModalOpen(false);
              }}
              isLoading={criarSala.isPending || atualizarSala.isPending}
              onCancel={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </PageWrapper>
  );
}
