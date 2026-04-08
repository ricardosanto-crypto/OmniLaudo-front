import { ReactNode } from 'react';
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
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  emptyMessage = 'Nenhum registro encontrado.',
  pageInfo,
  onPageChange,
}: DataTableProps<T>) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
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
                      <Skeleton className="h-6 w-full bg-slate-100 dark:bg-slate-800" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-gray-50 transition-colors">
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação do Spring Boot */}
      {pageInfo && onPageChange && (
        <div className="p-4 border-t border-gray-200 text-sm text-gray-500 flex justify-between items-center bg-white">
          <span>
            Mostrando página {pageInfo.number + 1} de {pageInfo.totalPages || 1}
          </span>
          <div className="flex items-center gap-4">
            <span>Total: {pageInfo.totalElements} registros</span>
            <div className="flex gap-2">
              <button
                onClick={() => onPageChange(pageInfo.number - 1)}
                disabled={pageInfo.number === 0 || isLoading}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => onPageChange(pageInfo.number + 1)}
                disabled={pageInfo.number >= pageInfo.totalPages - 1 || isLoading}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
