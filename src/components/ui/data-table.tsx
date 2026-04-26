import React, { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from './skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

// Definição genérica de uma coluna
export interface ColumnDef<T> {
  header: string | ReactNode;
  accessorKey?: keyof T; // Para renderização direta de uma chave do objeto
  cell?: (item: T) => ReactNode; // Para renderização customizada (ex: botões, badges)
  className?: string; // Para alinhamentos (ex: text-right)
}

// Interface de Paginação (espelhando seu backend)
interface PageInfo {
  number: number;
  totalPages: number;
  totalElements: number;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: ReactNode;
  pageInfo?: PageInfo;
  onPageChange?: (newPage: number) => void;
  renderSubComponent?: (item: T) => ReactNode;
  rowIdAccessor?: (item: T, index: number) => string | number; // Necessário para controle de expansão
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  emptyMessage = 'Nenhum registro encontrado.',
  pageInfo,
  onPageChange,
  renderSubComponent,
  rowIdAccessor = (_, i: number) => i,
}: DataTableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<Record<string | number, boolean>>({});

  const toggleRow = (id: string | number) => {
    if (!renderSubComponent) return; // Só permite clique se existir subComponent
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              {columns.map((col, index) => (
                <TableHead key={index} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                   {columns.map((_, j) => (
                    <TableCell key={`cell-${j}`}>
                      <Skeleton className="h-6 w-full opacity-20" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, rowIndex) => {
                const rowId = rowIdAccessor(item, rowIndex);
                const isExpanded = !!expandedRows[rowId];
                return (
                  <React.Fragment key={rowId}>
                    <TableRow 
                      onClick={() => toggleRow(rowId)}
                      className={cn("transition-colors", renderSubComponent ? "cursor-pointer hover:bg-muted/30" : "hover:bg-muted/20")}
                    >
                      {columns.map((col, colIndex) => (
                        <TableCell key={colIndex} className={col.className}>
                          {col.cell
                            ? col.cell(item)
                            : col.accessorKey
                            ? (item[col.accessorKey] as ReactNode)
                            : null}
                        </TableCell>
                      ))}
                    </TableRow>
                    {isExpanded && renderSubComponent && (
                      <TableRow className="bg-muted/10 hover:bg-muted/10">
                        <TableCell colSpan={columns.length} className="p-0 border-b">
                          <div className="overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                            {renderSubComponent(item)}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      {pageInfo && onPageChange && (
        <div className="p-4 border-t border-border text-sm text-muted-foreground flex justify-between items-center bg-card/50">
          <span>
            Página {(Number(pageInfo.number) || 0) + 1} de {Number(pageInfo.totalPages) || 1}
          </span>
          <div className="flex items-center gap-4">
            <span>{Number(pageInfo.totalElements) || 0} registros</span>
            <div className="flex gap-2">
              <button
                onClick={() => onPageChange(Number(pageInfo.number) - 1)}
                disabled={Number(pageInfo.number) === 0 || isLoading}
                className="px-3 py-1.5 border border-border rounded-lg hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Anterior
              </button>
              <button
                onClick={() => onPageChange(Number(pageInfo.number) + 1)}
                disabled={Number(pageInfo.number) >= (Number(pageInfo.totalPages) || 1) - 1 || isLoading}
                className="px-3 py-1.5 border border-border rounded-lg hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
