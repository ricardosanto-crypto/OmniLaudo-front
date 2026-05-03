import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { toast } from 'sonner';
import { DataTable, ColumnDef } from '../../components/ui/data-table';
import { Button } from '../../components/ui/button';
import { 
  Plus, FileText, Quote, Trash2,
  Bold, Italic, List, ListOrdered, Heading2, Undo, Redo, X,
  Search
} from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { cn } from '../../lib/utils';
import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import { PageWrapper } from '../../components/layout/PageWrapper';

// ... (Types and API Legacy remain same)

// ── Página Principal ───────────────────────────────────
export function Configuracoes() {
  const [activeTab, setActiveTab] = useState<'modelos' | 'frases'>('modelos');
  const [showEditor, setShowEditor] = useState(false);
  const [search, setSearch] = useState('');

  const { data: modelos = [], isLoading: loadingModelos } = useModelos();
  const { data: frases = [], isLoading: loadingFrases } = useFrases();
  const deleteFrase = useDeleteFrase();
  const deleteModelo = useDeleteModelo();

  const filteredModelos = useMemo(() => {
    return modelos.filter(m => m.nome.toLowerCase().includes(search.toLowerCase()) || 
                              m.procedimentoCodigo.includes(search));
  }, [modelos, search]);

  const filteredFrases = useMemo(() => {
    return frases.filter(f => f.titulo.toLowerCase().includes(search.toLowerCase()) || 
                             f.categoria.toLowerCase().includes(search.toLowerCase()));
  }, [frases, search]);

  const modeloColumns: ColumnDef<ModeloLaudo>[] = [
    { 
      header: 'Modelo', 
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shrink-0">
            <FileText size={16} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-foreground truncate">{item.nome}</span>
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-70">
              Proc: {item.procedimentoCodigo}
            </span>
          </div>
        </div>
      )
    },
    {
      header: 'Conteúdo (Preview)',
      cell: (item) => (
        <div 
          className="text-muted-foreground text-[11px] line-clamp-1 max-w-[500px] italic opacity-60"
          dangerouslySetInnerHTML={{ __html: item.conteudoPadrao.replace(/<[^>]*>?/gm, ' ') }}
        />
      ),
    },
    {
      header: '',
      className: 'text-right w-[60px]',
      cell: (item) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
          onClick={() => deleteModelo.mutate(item.id)}
        >
          <Trash2 size={14} />
        </Button>
      ),
    },
  ];

  const fraseColumns: ColumnDef<Frase>[] = [
    { 
      header: 'Título da Frase', 
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shrink-0">
            <Quote size={16} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-foreground truncate">{item.titulo}</span>
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-70">
              Cat: {item.categoria}
            </span>
          </div>
        </div>
      )
    },
    {
      header: 'Texto',
      cell: (item) => (
        <div 
          className="text-muted-foreground text-[11px] line-clamp-1 max-w-[500px] italic opacity-60"
          dangerouslySetInnerHTML={{ __html: item.conteudo.replace(/<[^>]*>?/gm, ' ') }}
        />
      ),
    },
    {
      header: '',
      className: 'text-right w-[60px]',
      cell: (item) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
          onClick={() => deleteFrase.mutate(item.id)}
        >
          <Trash2 size={14} />
        </Button>
      ),
    },
  ];

  return (
    <PageWrapper
      title="Templates & Frases"
      description="Gerencie modelos de laudo e frases rápidas para agilizar o diagnóstico diário."
      breadcrumbs={[
        { label: 'Configurações', to: '/configuracoes' },
        { label: 'Templates & Frases', to: '/configuracoes/templates' },
      ]}
      actions={
        !showEditor && (
          <Button
            onClick={() => setShowEditor(true)}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 text-xs font-bold uppercase shadow-lg shadow-primary/20"
          >
            <Plus size={16} /> {activeTab === 'modelos' ? 'Novo Modelo' : 'Nova Frase'}
          </Button>
        )
      }
    >
      <div className="space-y-4">
        {/* Filtros e Busca */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/40 backdrop-blur-sm p-3 rounded-[1.2rem] border border-border/50 shadow-sm">
          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl border border-border/50">
            <button 
              onClick={() => { setActiveTab('modelos'); setShowEditor(false); }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                activeTab === 'modelos' ? "bg-card text-blue-500 shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <FileText size={14} />
              Modelos <span className="opacity-40">({modelos.length})</span>
            </button>
            <button 
              onClick={() => { setActiveTab('frases'); setShowEditor(false); }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                activeTab === 'frases' ? "bg-card text-amber-500 shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Quote size={14} />
              Frases <span className="opacity-40">({frases.length})</span>
            </button>
          </div>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder={`Buscar ${activeTab === 'modelos' ? 'modelos...' : 'frases...'}`}
              className="pl-10 h-10 bg-background/50 border-border/60 focus:border-primary transition-all rounded-xl text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Editor (aparece quando clica em "Novo") */}
        {showEditor && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            {activeTab === 'modelos' 
              ? <ModeloEditor onClose={() => setShowEditor(false)} /> 
              : <FraseEditor onClose={() => setShowEditor(false)} />
            }
          </div>
        )}

        {/* Listagem */}
        <div className="bg-card/30 backdrop-blur-sm rounded-[1.5rem] border border-border/50 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-border/50 bg-muted/10 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-2">
              <div className={cn("w-1 h-3 rounded-full", activeTab === 'modelos' ? "bg-blue-500" : "bg-amber-500")} />
              {activeTab === 'modelos' ? 'Modelos de Laudo' : 'Biblioteca de Frases'}
            </h3>
            <span className="text-[10px] font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border border-border/40">
              {activeTab === 'modelos' ? filteredModelos.length : filteredFrases.length} registros
            </span>
          </div>

          {activeTab === 'modelos' ? (
            <DataTable
              columns={modeloColumns}
              data={filteredModelos}
              isLoading={loadingModelos}
              emptyMessage={search ? "Nenhum resultado para esta busca." : "Nenhum item cadastrado."}
            />
          ) : (
            <DataTable
              columns={fraseColumns}
              data={filteredFrases}
              isLoading={loadingFrases}
              emptyMessage={search ? "Nenhum resultado para esta busca." : "Nenhum item cadastrado."}
            />
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

// ── Types e API (mantidos para o arquivo não ficar incompleto) ──
interface Frase { id: string; titulo: string; conteudo: string; categoria: string; }
interface ModeloLaudo { id: string; nome: string; conteudoPadrao: string; procedimentoCodigo: string; }

function getApiLegacy() {
  const token = useAuthStore.getState().token;
  return axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), },
  });
}

function useFrases() { return useQuery({ queryKey: ['frases'], queryFn: async () => (await getApiLegacy().get('/frases')).data as Frase[] }); }
function useCreateFrase() { const qc = useQueryClient(); return useMutation({ mutationFn: (data: Omit<Frase, 'id'>) => getApiLegacy().post('/frases', data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['frases'] }); toast.success('Frase criada!'); } }); }
function useDeleteFrase() { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => getApiLegacy().delete(`/frases/${id}`), onSuccess: () => { qc.invalidateQueries({ queryKey: ['frases'] }); toast.success('Frase removida!'); } }); }
function useModelos() { return useQuery({ queryKey: ['modelos-laudo'], queryFn: async () => (await getApiLegacy().get('/modelos-laudo')).data as ModeloLaudo[] }); }
function useCreateModelo() { const qc = useQueryClient(); return useMutation({ mutationFn: (data: Omit<ModeloLaudo, 'id'>) => getApiLegacy().post('/modelos-laudo', data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['modelos-laudo'] }); toast.success('Modelo criado!'); } }); }
function useDeleteModelo() { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => getApiLegacy().delete(`/modelos-laudo/${id}`), onSuccess: () => { qc.invalidateQueries({ queryKey: ['modelos-laudo'] }); toast.success('Modelo removido!'); } }); }

function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;
  const btnClass = (active: boolean) => cn("p-1.5 rounded transition-colors", active ? "bg-blue-600/20 text-blue-500" : "text-muted-foreground hover:bg-muted hover:text-foreground");
  return (
    <div className="flex items-center gap-1 border-b border-border px-3 py-2 bg-muted/30">
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))}><Bold size={15} /></button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))}><Italic size={15} /></button>
      <div className="mx-1 h-4 w-px bg-border" />
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading'))}><Heading2 size={15} /></button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))}><List size={15} /></button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))}><ListOrdered size={15} /></button>
      <div className="mx-1 h-4 w-px bg-border" />
      <button onClick={() => editor.chain().focus().undo().run()} className="p-1.5 rounded text-muted-foreground hover:bg-muted"><Undo size={15} /></button>
      <button onClick={() => editor.chain().focus().redo().run()} className="p-1.5 rounded text-muted-foreground hover:bg-muted"><Redo size={15} /></button>
    </div>
  );
}

function FraseEditor({ onClose }: { onClose: () => void }) {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('geral');
  const createFrase = useCreateFrase();
  const editor = useEditor({ extensions: [StarterKit, Placeholder.configure({ placeholder: 'Digite o conteúdo...' })], content: '', editorProps: { attributes: { class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[200px] px-4 py-3' } } });
  const handleSave = () => { if (!titulo || !editor?.getHTML()) return toast.error('Preencha tudo'); createFrase.mutate({ titulo, conteudo: editor.getHTML(), categoria }, { onSuccess: () => onClose() }); };
  return (
    <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden mb-6">
      <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-muted/30"><h3 className="text-xs font-black uppercase tracking-widest">Nova Frase</h3><button onClick={onClose}><X size={16} /></button></div>
      <div className="grid grid-cols-2 gap-4 p-4 border-b border-border">
        <div className="space-y-1"><Label className="text-[10px] font-bold uppercase">Título</Label><Input value={titulo} onChange={e => setTitulo(e.target.value)} /></div>
        <div className="space-y-1"><Label className="text-[10px] font-bold uppercase">Categoria</Label><Input value={categoria} onChange={e => setCategoria(e.target.value)} /></div>
      </div>
      <EditorToolbar editor={editor} /><EditorContent editor={editor} />
      <div className="flex justify-end gap-2 p-4 bg-muted/20"><Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button><Button size="sm" onClick={handleSave} disabled={createFrase.isPending}>Salvar</Button></div>
    </div>
  );
}

function ModeloEditor({ onClose }: { onClose: () => void }) {
  const [nome, setNome] = useState('');
  const [procedimentoCodigo, setProcedimentoCodigo] = useState('');
  const createModelo = useCreateModelo();
  const editor = useEditor({ extensions: [StarterKit, Placeholder.configure({ placeholder: 'Digite o corpo padrão...' })], content: '', editorProps: { attributes: { class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-3' } } });
  const handleSave = () => { if (!nome || !procedimentoCodigo || !editor?.getHTML()) return toast.error('Preencha tudo'); createModelo.mutate({ nome, conteudoPadrao: editor.getHTML(), procedimentoCodigo }, { onSuccess: () => onClose() }); };
  return (
    <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden mb-6">
      <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-muted/30"><h3 className="text-xs font-black uppercase tracking-widest">Novo Modelo</h3><button onClick={onClose}><X size={16} /></button></div>
      <div className="grid grid-cols-2 gap-4 p-4 border-b border-border">
        <div className="space-y-1"><Label className="text-[10px] font-bold uppercase">Nome</Label><Input value={nome} onChange={e => setNome(e.target.value)} /></div>
        <div className="space-y-1"><Label className="text-[10px] font-bold uppercase">Procedimento</Label><Input value={procedimentoCodigo} onChange={e => setProcedimentoCodigo(e.target.value)} /></div>
      </div>
      <EditorToolbar editor={editor} /><EditorContent editor={editor} />
      <div className="flex justify-end gap-2 p-4 bg-muted/20"><Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button><Button size="sm" onClick={handleSave} disabled={createModelo.isPending}>Salvar</Button></div>
    </div>
  );
}

