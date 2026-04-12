import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold, Italic, List, ListOrdered,
  ExternalLink, ChevronRight, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';

export function ReportPanel() {
  const [activeTab, setActiveTab] = useState('laudo');
  const { user } = useAuthStore();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Digite / para comandos ou comece a laudar...' }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm prose-slate max-w-none focus:outline-none min-h-full',
      },
    },
  });

  const wordCount = editor?.getText().split(/\s+/).filter(word => word.length > 0).length || 0;
  const charCount = editor?.getText().length || 0;

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-[-10px_0_30px_rgba(0,0,0,0.3)]">
      {/* Tabs */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4">
        <div className="flex gap-6 text-xs font-bold uppercase tracking-wider">
          <button onClick={() => setActiveTab('laudo')} className={cn("h-12 border-b-2 transition-colors", activeTab === 'laudo' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300")}>Laudo</button>
          <button onClick={() => setActiveTab('ficha')} className={cn("h-12 border-b-2 transition-colors", activeTab === 'ficha' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300")}>Ficha Clínica</button>
        </div>
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><ExternalLink size={16} /></button>
      </div>

      {activeTab === 'laudo' && (
        <>
          {/* Modelos (IA / Snippets) */}
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-4 py-2">
            <Activity size={14} className="text-purple-500" />
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Modelos:</span>
            <div className="flex gap-2">
              <button className="rounded-full bg-slate-200 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700">Padrão Normal</button>
              <button className="rounded-full bg-slate-200 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700">Achados Isquemia</button>
            </div>
          </div>

          {/* Toolbar TipTap */}
          <div className="flex items-center gap-1 border-b border-slate-100 dark:border-slate-800 px-4 py-2 text-slate-500 dark:text-slate-400">
            <button onClick={() => editor?.chain().focus().toggleBold().run()} className={cn("p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800", editor?.isActive('bold') && "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white")}><Bold size={16} /></button>
            <button onClick={() => editor?.chain().focus().toggleItalic().run()} className={cn("p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800", editor?.isActive('italic') && "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white")}><Italic size={16} /></button>
            <div className="mx-1 h-4 w-px bg-slate-200 dark:bg-slate-800" />
            <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className={cn("p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800", editor?.isActive('bulletList') && "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white")}><List size={16} /></button>
            <button onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={cn("p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800", editor?.isActive('orderedList') && "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white")}><ListOrdered size={16} /></button>
          </div>

          {/* Área de Digitação */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <EditorContent editor={editor} />
          </div>

          {/* Footer do Editor */}
          <div className="flex h-10 shrink-0 items-center justify-between border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 text-xs text-slate-400 dark:text-slate-500">
            <span>{charCount} chars - {wordCount} palavras</span>
            <div className="flex items-center gap-2 cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <span className="font-medium text-slate-600 dark:text-slate-400">Assinatura: Dr(a). {user?.nome?.split(' ')[0]}</span>
              <ChevronRight size={14} className="rotate-90" />
            </div>
          </div>
        </>
      )}

      {activeTab === 'ficha' && (
        <div className="flex-1 p-6 text-sm text-slate-500 italic">
          Histórico clínico do paciente carregado do Prontuário Eletrônico será exibido aqui.
        </div>
      )}
    </div>
  );
}
