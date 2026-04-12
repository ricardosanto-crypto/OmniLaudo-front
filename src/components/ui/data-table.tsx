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
              data.map((item, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-muted/20 transition-colors">
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
