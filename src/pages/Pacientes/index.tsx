import { useState } from 'react';
import { Users, Plus, Search, FileText, Edit, Trash2 } from 'lucide-react';
import { usePacientes, useCreatePaciente, useUpdatePaciente, useDeletePaciente } from '../../hooks/usePacientes';
import { DataTable, ColumnDef } from '../../components/ui/data-table';
import { PacienteResponse } from '../../types/paciente';
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
  const { mutate: criar, isPending: isCreating } = useCreatePaciente();
  const { mutate: atualizar, isPending: isUpdating } = useUpdatePaciente();
  const { mutate: inativar } = useDeletePaciente();

  const handleEdit = (paciente: PacienteResponse) => {
    // Format date from array/iso to YYYY-MM-DD for the date input
    const dataFmt = typeof paciente.dataNascimento === 'string' 
      ? paciente.dataNascimento.split('T')[0] 
      : Array.isArray(paciente.dataNascimento) 
        ? `${paciente.dataNascimento[0]}-${String(paciente.dataNascimento[1]).padStart(2,'0')}-${String(paciente.dataNascimento[2]).padStart(2,'0')}`
        : '';
        
    setEditingPaciente({
      ...paciente,
      dataNascimento: dataFmt
    } as any);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Deseja realmente inativar este paciente? Ele não aparecerá mais para novos agendamentos.")) {
      inativar(id);
    }
  };

  const columns: ColumnDef<PacienteResponse>[] = [
    { 
      header: 'Nome Completo', 
      cell: (i) => `${i.nome} ${i.sobrenome}`, 
      className: 'font-medium text-gray-900 dark:text-white' 
    },
    { header: 'Documento', accessorKey: 'documento', className: 'text-muted-foreground font-mono text-xs' },
    { header: 'Telefone', cell: (i) => i.telefone || '-', className: 'text-muted-foreground' },
    { header: 'Convênio', cell: (i) => i.seguroSaude || 'Particular', className: 'text-muted-foreground' },
    {
      header: <span className="sr-only">Ações</span>,
      className: 'text-right',
      cell: (i) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleEdit(i)}>
            <Edit size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(i.id)}>
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
      breadcrumbs={[
        { label: 'Dashboard', to: '/' },
        { label: 'Pacientes', to: '/pacientes' },
      ]}
      backLink={{ label: 'Voltar ao Dashboard', to: '/' }}
      actions={
        <Button
          onClick={() => {
            setEditingPaciente(null);
            setIsModalOpen(true);
          }}
          className="bg-primary-500 hover:bg-primary-600 text-white"
        >
          <Plus size={18} className="mr-2" />
          Novo Paciente
        </Button>
      }
    >
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-4 w-full md:w-auto">
            <div className="flex items-center gap-2 text-slate-600">
              <Users className="text-primary-500" />
              <span className="text-sm font-medium uppercase tracking-[0.18em]">Pacientes</span>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou sobrenome..."
                className="pl-9 dark:bg-card dark:border-border"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={pagePacientes?.content || []}
          isLoading={isLoading}
          emptyMessage={search ? 'Nenhum paciente encontrado para esta busca.' : 'Nenhum paciente cadastrado.'}
          pageInfo={pagePacientes ? { number: pagePacientes.number, totalPages: pagePacientes.totalPages, totalElements: pagePacientes.totalElements } : undefined}
          onPageChange={setPage}
        />

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{editingPaciente ? 'Editar Paciente' : 'Cadastrar Novo Paciente'}</DialogTitle>
              <DialogDescription>
                Preencha os dados básicos do paciente. Campos como Convênio e E-mail são opcionais.
              </DialogDescription>
            </DialogHeader>
            <PacienteForm
              initialData={editingPaciente}
              isLoading={isCreating || isUpdating}
              onCancel={() => {
                setIsModalOpen(false);
                setEditingPaciente(null);
              }}
              onSubmit={(data: any) => {
                if (editingPaciente) {
                  atualizar({ id: editingPaciente.id, data }, { onSuccess: () => setIsModalOpen(false) });
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
