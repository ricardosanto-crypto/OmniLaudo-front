import { useState } from 'react';
import { Cpu, Plus, Edit } from 'lucide-react';
import { useEquipamentos, useCreateEquipamento, useUpdateEquipamento } from '../../hooks/useEquipamentos';
import { DataTable, ColumnDef } from '../../components/ui/data-table';
import { EquipamentoResponse } from '../../types/equipamento';
import { EquipamentoForm } from './EquipamentoForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { RoleGuard } from '../../components/auth/RoleGuard';
import { Button } from '../../components/ui/button';

export function Equipamentos() {
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [equipEmEdicao, setEquipEmEdicao] = useState<EquipamentoResponse | null>(null);

  const { data: pageEquip, isLoading, isError, error } = useEquipamentos(page, 10);
  const { mutate: criar, isPending: isCreating } = useCreateEquipamento();
  const { mutate: atualizar, isPending: isUpdating } = useUpdateEquipamento();

  const handleEdit = (equip: EquipamentoResponse) => {
    setEquipEmEdicao({
      ...equip,
      salaId: equip.salaId ? String(equip.salaId) : undefined
    });
    setIsModalOpen(true);
  };

  const columns: ColumnDef<EquipamentoResponse>[] = [
    { header: 'Nome', accessorKey: 'nome', className: 'font-medium text-gray-900' },
    { 
        header: 'Modalidade', 
        cell: (i) => <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">{i.modalidade}</span> 
    },
    { header: 'Fabricante', accessorKey: 'fabricante' },
    { header: 'Sala', accessorKey: 'salaNome' },
    {
      header: 'Status',
      cell: (i) => (
        <div className="flex gap-2">
          {i.emManutencao && <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold">MANUTENÇÃO</span>}
          {!i.calibrado && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold">NÃO CALIBRADO</span>}
          {i.ativo && !i.emManutencao && <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold">OPERACIONAL</span>}
        </div>
      )
    },
    {
      header: <span className="sr-only">Ações</span>,
      className: 'text-right',
      cell: (i) => (
        <RoleGuard allowedRoles={['SUPERADMIN', 'ADMIN']}>
          <button 
            className="text-primary-500 hover:bg-gray-100 p-2 rounded transition-colors" 
            title="Editar"
            onClick={() => handleEdit(i)}
          >
            <span className="sr-only">Editar equipamento</span>
            <Edit size={16} />
          </button>
        </RoleGuard>
      )
    }
  ];

  if (isError) return <div className="p-8 text-red-500">Erro: {error?.message}</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Cpu className="text-primary-500" /> 
            Equipamentos
          </h1>
          <p className="text-sm text-gray-500">Gerencie o inventário de modalidades e máquinas DICOM.</p>
        </div>
        <RoleGuard allowedRoles={['SUPERADMIN', 'ADMIN']}>
          <Button 
            onClick={() => { setEquipEmEdicao(null); setIsModalOpen(true); }} 
            className="bg-primary-500 hover:bg-primary-600 text-white"
          >
            <Plus size={18} className="mr-2" /> Novo Equipamento
          </Button>
        </RoleGuard>
      </div>

      <DataTable 
        columns={columns} 
        data={pageEquip?.content || []} 
        isLoading={isLoading}
        emptyMessage="Nenhum equipamento encontrado."
        pageInfo={pageEquip ? { number: pageEquip.number, totalPages: pageEquip.totalPages, totalElements: pageEquip.totalElements } : undefined}
        onPageChange={setPage}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{equipEmEdicao ? 'Editar Máquina' : 'Cadastrar Equipamento'}</DialogTitle>
            <DialogDescription>
              {equipEmEdicao 
                ? 'Atualize as configurações técnicas do equipamento selecionado.' 
                : 'Preencha os dados técnicos para registrar um novo equipamento DICOM.'}
            </DialogDescription>
          </DialogHeader>
          <EquipamentoForm 
            initialData={equipEmEdicao} 
            isLoading={isCreating || isUpdating} 
            onCancel={() => setIsModalOpen(false)}
            onSubmit={(data: any) => {
              if (equipEmEdicao) {
                atualizar({ id: equipEmEdicao.id, data }, { onSuccess: () => setIsModalOpen(false) });
              } else {
                criar(data, { onSuccess: () => setIsModalOpen(false) });
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
