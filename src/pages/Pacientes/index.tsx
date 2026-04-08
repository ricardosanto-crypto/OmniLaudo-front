import { useState } from 'react';
import { Users, Plus, Search, FileText } from 'lucide-react';
import { usePacientes, useCreatePaciente } from '../../hooks/usePacientes';
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

  const { data: pagePacientes, isLoading, isError, error } = usePacientes(page, 10, search);
  const { mutate: criar, isPending: isCreating } = useCreatePaciente();

  const columns: ColumnDef<PacienteResponse>[] = [
    { 
      header: 'Nome Completo', 
      cell: (i) => `${i.nome} ${i.sobrenome}`, 
      className: 'font-medium text-gray-900' 
    },
    { header: 'Documento', accessorKey: 'documento' },
    { header: 'Telefone', cell: (i) => i.telefone || '-' },
    { header: 'Convênio', cell: (i) => i.seguroSaude || 'Particular' },
    {
      header: <span className="sr-only">Ações</span>,
      className: 'text-right',
      cell: (_i) => (
        <Button variant="ghost" size="sm" className="text-primary-500 hover:text-primary-700 hover:bg-primary-50">
          <FileText size={16} className="mr-2" /> 
          Ver Ficha
        </Button>
      )
    }
  ];

  if (isError) return <div className="p-8 text-red-500">Erro: {error?.message}</div>;

  return (
    <PageWrapper>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-4 w-full md:w-auto">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="text-primary-500" /> 
              Pacientes
            </h1>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Buscar por nome ou sobrenome..." 
                className="pl-9" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-primary-500 hover:bg-primary-600 text-white w-full md:w-auto"
          >
            <Plus size={18} className="mr-2" /> 
            Novo Paciente
          </Button>
        </div>

        <DataTable 
          columns={columns} 
          data={pagePacientes?.content || []} 
          isLoading={isLoading}
          emptyMessage={search ? "Nenhum paciente encontrado para esta busca." : "Nenhum paciente cadastrado."}
          pageInfo={pagePacientes ? { number: pagePacientes.number, totalPages: pagePacientes.totalPages, totalElements: pagePacientes.totalElements } : undefined}
          onPageChange={setPage}
        />

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Paciente</DialogTitle>
              <DialogDescription>
                Preencha os dados básicos do paciente. Campos como Convênio e E-mail são opcionais.
              </DialogDescription>
            </DialogHeader>
            <PacienteForm 
              isLoading={isCreating} 
              onCancel={() => setIsModalOpen(false)}
              onSubmit={(data: any) => criar(data, { onSuccess: () => setIsModalOpen(false) })}
            />
          </DialogContent>
        </Dialog>
      </div>
    </PageWrapper>
  );
}
