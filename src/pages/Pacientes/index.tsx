import { useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { usePacientes, useCreatePaciente, useUpdatePaciente, useDeletePaciente } from '../../hooks/usePacientes';
import { DataTable, ColumnDef } from '../../components/ui/data-table';
import { PacienteResponse, PacienteRequest } from '../../types/paciente';
import { PacienteForm } from './PacienteForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { PageWrapper } from '../../components/layout/PageWrapper';

export function Pacientes() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPaciente, setEditingPaciente] = useState<PacienteResponse | null>(null);

  const { data: pagePacientes, isLoading, isError, error } = usePacientes(page, 10, search);
  const criar = useCreatePaciente();
  const atualizar = useUpdatePaciente();
  const inativar = useDeletePaciente();

  const handleEdit = (paciente: PacienteResponse) => {
    const dataFmt = typeof paciente.dataNascimento === 'string' 
      ? paciente.dataNascimento.split('T')[0] 
      : Array.isArray(paciente.dataNascimento) 
        ? `${paciente.dataNascimento[0]}-${String(paciente.dataNascimento[1]).padStart(2,'0')}-${String(paciente.dataNascimento[2]).padStart(2,'0')}`
        : '';
        
    setEditingPaciente({ ...paciente, dataNascimento: dataFmt } as PacienteResponse);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Deseja realmente inativar este paciente?")) {
      inativar.mutate(id);
    }
  };

  const columns: ColumnDef<PacienteResponse>[] = [
    { header: 'Nome Completo', cell: (i) => `${i.nome} ${i.sobrenome}`, className: 'font-medium text-foreground' },
    { header: 'Documento', accessorKey: 'documento', className: 'text-muted-foreground font-mono text-xs' },
    { header: 'Telefone', cell: (i) => i.telefone || '-', className: 'text-muted-foreground' },
    { header: 'Convênio', cell: (i) => i.seguroSaude || 'Particular', className: 'text-muted-foreground' },
    {
      header: <span className="sr-only">Ações</span>,
      className: 'text-right',
      cell: (i) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50" onClick={() => handleEdit(i)}>
            <Edit size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:bg-red-50" onClick={() => handleDelete(i.id)}>
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  if (isError) return <div className="p-8 text-red-500">Erro: {error?.message}</div>;

  return (
    <PageWrapper
      title="Pacientes"
      description="Gerencie prontuários, histórico e dados pessoais com segurança e agilidade."
      breadcrumbs={[{ label: 'Dashboard', to: '/' }, { label: 'Pacientes', to: '/pacientes' }]}
      actions={
        <Button onClick={() => { setEditingPaciente(null); setIsModalOpen(true); }} className="bg-primary-500 hover:bg-primary-600 text-white">
          <Plus size={18} className="mr-2" /> Novo Paciente
        </Button>
      }
    >
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome ou sobrenome..." className="pl-9 dark:bg-card dark:border-border" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={pagePacientes?.content || []}
          isLoading={isLoading}
          emptyMessage={search ? 'Nenhum paciente encontrado.' : 'Nenhum paciente cadastrado.'}
          pageInfo={pagePacientes ? { number: pagePacientes.number, totalPages: pagePacientes.totalPages, totalElements: pagePacientes.totalElements } : undefined}
          onPageChange={setPage}
        />

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{editingPaciente ? 'Editar Paciente' : 'Cadastrar Novo Paciente'}</DialogTitle>
              <DialogDescription>Preencha os dados básicos do paciente.</DialogDescription>
            </DialogHeader>
            <PacienteForm
              initialData={editingPaciente}
              isLoading={criar.isPending || atualizar.isPending}
              onCancel={() => { setIsModalOpen(false); setEditingPaciente(null); }}
              // A MÁGICA ACONTECE AQUI: mutateAsync propaga o erro para o Form e não fecha o modal
              onSubmit={async (data: PacienteRequest) => {
                if (editingPaciente) {
                  await atualizar.mutateAsync({ id: editingPaciente.id, data });
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
