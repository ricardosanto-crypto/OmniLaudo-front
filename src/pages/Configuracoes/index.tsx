import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { toast } from 'sonner';
import { DataTable, ColumnDef } from '../../components/ui/data-table';
import { Button } from '../../components/ui/button';
import { 
  Plus, FileText, Quote, Trash2,
  Bold, Italic, List, ListOrdered, Heading2, Undo, Redo, X
} from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { cn } from '../../lib/utils';
import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';

// ── Types ──────────────────────────────────────────────
interface Frase {
  id: string;
  titulo: string;
  conteudo: string;
  categoria: string;
}

interface ModeloLaudo {
  id: string;
  nome: string;
  conteudoPadrao: string;
  procedimentoCodigo: string;
}

// ── API Legacy (rotas /api/ sem /v1/) ──────────────────
function getApiLegacy() {
  const token = useAuthStore.getState().token;
  return axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

// ── Hooks ──────────────────────────────────────────────
function useFrases() {
  return useQuery({
    queryKey: ['frases'],
    queryFn: async () => {
      const res = await getApiLegacy().get('/frases');
      return res.data as Frase[];
    },
  });
}

function useCreateFrase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Frase, 'id'>) => getApiLegacy().post('/frases', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['frases'] }); toast.success('Frase criada!'); },
  });
}

function useDeleteFrase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => getApiLegacy().delete(`/frases/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['frases'] }); toast.success('Frase removida!'); },
  });
}

function useModelos() {
  return useQuery({
    queryKey: ['modelos-laudo'],
    queryFn: async () => {
      const res = await getApiLegacy().get('/modelos-laudo');
      return res.data as ModeloLaudo[];
    },
  });
}

function useCreateModelo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ModeloLaudo, 'id'>) => getApiLegacy().post('/modelos-laudo', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['modelos-laudo'] }); toast.success('Modelo criado!'); },
  });
}

function useDeleteModelo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => getApiLegacy().delete(`/modelos-laudo/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['modelos-laudo'] }); toast.success('Modelo removido!'); },
  });
}

// ── Editor Toolbar ─────────────────────────────────────
function EditorToolbar({ editor }: { editor: any }) {
  if (!editor) return null;

  const btnClass = (active: boolean) =>
    cn("p-1.5 rounded transition-colors", active ? "bg-blue-600/20 text-blue-500" : "text-muted-foreground hover:bg-muted hover:text-foreground");

  return (
    <div className="flex items-center gap-1 border-b border-border px-3 py-2 bg-muted/30">
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))} title="Negrito">
        <Bold size={15} />
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))} title="Itálico">
        <Italic size={15} />
      </button>
      <div className="mx-1 h-4 w-px bg-border" />
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading'))} title="Subtítulo">
        <Heading2 size={15} />
      </button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))} title="Lista">
        <List size={15} />
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))} title="Lista Numerada">
        <ListOrdered size={15} />
      </button>
      <div className="mx-1 h-4 w-px bg-border" />
      <button onClick={() => editor.chain().focus().undo().run()} className="p-1.5 rounded text-muted-foreground hover:bg-muted hover:text-foreground" title="Desfazer">
        <Undo size={15} />
      </button>
      <button onClick={() => editor.chain().focus().redo().run()} className="p-1.5 rounded text-muted-foreground hover:bg-muted hover:text-foreground" title="Refazer">
        <Redo size={15} />
      </button>
    </div>
  );
}

// ── Editor de Frase ────────────────────────────────────
function FraseEditor({ onClose }: { onClose: () => void }) {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('geral');
  const createFrase = useCreateFrase();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Digite o conteúdo da frase aqui...' }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[200px] px-4 py-3',
      },
    },
  });

  const handleSave = () => {
    if (!titulo || !editor?.getHTML()) {
      toast.error('Preencha todos os campos.');
      return;
    }
    createFrase.mutate(
      { titulo, conteudo: editor.getHTML(), categoria },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-muted/30">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-tight">Nova Frase</h3>
        <button onClick={onClose} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-4 p-4 border-b border-border">
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Título</Label>
          <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Normal sem alterações" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Categoria</Label>
          <Input value={categoria} onChange={(e) => setCategoria(e.target.value)} placeholder="Ex: achados, impressao" />
        </div>
      </div>

      {/* TipTap Editor */}
      <EditorToolbar editor={editor} />
      <div className="min-h-[200px] max-h-[400px] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 border-t border-border p-4 bg-muted/20">
        <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
        <Button size="sm" onClick={handleSave} disabled={createFrase.isPending}>
          {createFrase.isPending ? 'Salvando...' : 'Salvar Frase'}
        </Button>
      </div>
    </div>
  );
}

// ── Editor de Modelo ───────────────────────────────────
function ModeloEditor({ onClose }: { onClose: () => void }) {
  const [nome, setNome] = useState('');
  const [procedimentoCodigo, setProcedimentoCodigo] = useState('');
  const createModelo = useCreateModelo();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Digite o corpo padrão do laudo aqui...\n\nACHADOS:\n...\n\nIMPRESSÃO:\n...' }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-3',
      },
    },
  });

  const handleSave = () => {
    if (!nome || !procedimentoCodigo || !editor?.getHTML()) {
      toast.error('Preencha todos os campos.');
      return;
    }
    createModelo.mutate(
      { nome, conteudoPadrao: editor.getHTML(), procedimentoCodigo },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-muted/30">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-tight">Novo Modelo de Laudo</h3>
        <button onClick={onClose} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-4 p-4 border-b border-border">
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nome do Modelo</Label>
          <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: TC Crânio Normal" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Código do Procedimento</Label>
          <Input value={procedimentoCodigo} onChange={(e) => setProcedimentoCodigo(e.target.value)} placeholder="Ex: 40803123" />
        </div>
      </div>

      {/* TipTap Editor */}
      <EditorToolbar editor={editor} />
      <div className="min-h-[300px] max-h-[500px] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 border-t border-border p-4 bg-muted/20">
        <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
        <Button size="sm" onClick={handleSave} disabled={createModelo.isPending}>
          {createModelo.isPending ? 'Salvando...' : 'Salvar Modelo'}
        </Button>
      </div>
    </div>
  );
}

// ── Página Principal ───────────────────────────────────
export function Configuracoes() {
  const [activeTab, setActiveTab] = useState<'modelos' | 'frases'>('modelos');
  const [showEditor, setShowEditor] = useState(false);

  const { data: modelos = [], isLoading: loadingModelos } = useModelos();
  const { data: frases = [], isLoading: loadingFrases } = useFrases();
  const deleteFrase = useDeleteFrase();
  const deleteModelo = useDeleteModelo();

  const modeloColumns: ColumnDef<ModeloLaudo>[] = [
    { header: 'Nome', accessorKey: 'nome' },
    { header: 'Procedimento', accessorKey: 'procedimentoCodigo' },
    {
      header: 'Preview',
      cell: (item) => (
        <div 
          className="text-muted-foreground text-xs line-clamp-2 max-w-[400px] prose-sm"
          dangerouslySetInnerHTML={{ __html: item.conteudoPadrao }}
        />
      ),
    },
    {
      header: '',
      className: 'text-right w-[80px]',
      cell: (item) => (
        <button 
          onClick={() => deleteModelo.mutate(item.id)}
          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded hover:bg-destructive/10"
          title="Remover"
        >
          <Trash2 size={14} />
        </button>
      ),
    },
  ];

  const fraseColumns: ColumnDef<Frase>[] = [
    { header: 'Título', accessorKey: 'titulo' },
    { header: 'Categoria', accessorKey: 'categoria' },
    {
      header: 'Preview',
      cell: (item) => (
        <div 
          className="text-muted-foreground text-xs line-clamp-2 max-w-[400px] prose-sm"
          dangerouslySetInnerHTML={{ __html: item.conteudo }}
        />
      ),
    },
    {
      header: '',
      className: 'text-right w-[80px]',
      cell: (item) => (
        <button 
          onClick={() => deleteFrase.mutate(item.id)}
          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded hover:bg-destructive/10"
          title="Remover"
        >
          <Trash2 size={14} />
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb + Title */}
        <div className="flex flex-col gap-1 mb-6">
          <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-widest">
            <span className="text-slate-500">OmniLaudo</span>
            <span className="text-blue-500">&gt;</span>
            <span className="text-blue-500">Configurações</span>
          </div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            Templates &amp; Frases
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-6 border-b border-border">
          <button
            onClick={() => { setActiveTab('modelos'); setShowEditor(false); }}
            className={`flex items-center gap-2 pb-3 px-1 text-sm font-bold uppercase tracking-tight border-b-2 transition-all ${
              activeTab === 'modelos' ? 'border-blue-600 text-blue-600' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText size={16} />
            Modelos de Laudo ({modelos.length})
          </button>
          <button
            onClick={() => { setActiveTab('frases'); setShowEditor(false); }}
            className={`flex items-center gap-2 pb-3 px-1 text-sm font-bold uppercase tracking-tight border-b-2 transition-all ${
              activeTab === 'frases' ? 'border-blue-600 text-blue-600' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Quote size={16} />
            Frases Rápidas ({frases.length})
          </button>

          <div className="flex-1" />

          {!showEditor && (
            <Button size="sm" className="gap-2 mb-2" onClick={() => setShowEditor(true)}>
              <Plus size={14} /> {activeTab === 'modelos' ? 'Novo Modelo' : 'Nova Frase'}
            </Button>
          )}
        </div>

        {/* Editor (aparece quando clica em "Novo") */}
        {showEditor && (
          <div className="mb-6">
            {activeTab === 'modelos' 
              ? <ModeloEditor onClose={() => setShowEditor(false)} /> 
              : <FraseEditor onClose={() => setShowEditor(false)} />
            }
          </div>
        )}

        {/* Tabela */}
        {activeTab === 'modelos' && (
          <DataTable
            columns={modeloColumns}
            data={modelos}
            isLoading={loadingModelos}
            emptyMessage="Nenhum modelo de laudo cadastrado. Crie o primeiro clicando em 'Novo Modelo'."
          />
        )}

        {activeTab === 'frases' && (
          <DataTable
            columns={fraseColumns}
            data={frases}
            isLoading={loadingFrases}
            emptyMessage="Nenhuma frase cadastrada. Crie a primeira clicando em 'Nova Frase'."
          />
        )}
      </main>
    </div>
  );
}
