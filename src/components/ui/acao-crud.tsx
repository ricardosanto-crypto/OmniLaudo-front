// src/components/ui/acao-crud.tsx
import { Button } from "./button";
import { Loader2, Save, X } from "lucide-react";

interface AcaoCrudProps {
  onCancel: () => void;
  isLoading: boolean;
  labelSuccess?: string;
  labelCancel?: string;
}

export function AcaoCrud({ 
  onCancel, 
  isLoading, 
  labelSuccess = "Salvar Alterações", 
  labelCancel = "Cancelar" 
}: AcaoCrudProps) {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t dark:border-slate-800 mt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel} 
        disabled={isLoading}
        className="text-gray-500 dark:text-slate-400 dark:border-slate-700 dark:hover:bg-slate-800"
      >
        <X size={16} className="mr-2" /> {labelCancel}
      </Button>
      <Button 
        type="submit" 
        disabled={isLoading}
        className="bg-primary-500 hover:bg-primary-600 min-w-[140px]"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save size={16} className="mr-2" />
        )}
        {isLoading ? "Processando..." : labelSuccess}
      </Button>
    </div>
  );
}
