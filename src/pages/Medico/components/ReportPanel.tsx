import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useQuery } from '@tanstack/react-query';
import {
  Bold, Italic, List, ListOrdered,
  ExternalLink, ChevronRight, Activity, Quote, ChevronDown, Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import axios from 'axios';
import { SerieDicomView } from './SeriesSidebar';

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

interface ModeloLaudo {
  id: string;
  nome: string;
  conteudoPadrao: string;
  procedimentoCodigo: string;
}

interface Frase {
  id: string;
  titulo: string;
  conteudo: string;
  categoria: string;
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

function useFrases() {
  return useQuery({
    queryKey: ['frases'],
    queryFn: async () => {
      const res = await getApiLegacy().get('/frases');
      return res.data as Frase[];
    },
  });
}

interface ReportPanelProps {
  laudoInicial?: string;
  onContentChange?: (content: string) => void;
  assinaturas?: any[];
  series?: SerieDicomView[];
  activeSeriesId?: string | null;
  onSelectSeries?: (seriesId: string) => void;
  isModoEditor?: boolean;
}

export function ReportPanel({ 
  laudoInicial = '', 
  onContentChange, 
  assinaturas = [],
  series = [],
  activeSeriesId = null,
  onSelectSeries,
  isModoEditor = false
}: ReportPanelProps) {
  const [activeTab, setActiveTab] = useState('laudo');
  const [showFrases, setShowFrases] = useState(false);
  const [isSeriesOpen, setIsSeriesOpen] = useState(false);
  const [isModelosOpen, setIsModelosOpen] = useState(false);
  const { user } = useAuthStore();
  const initialSet = useState(false);

  const { data: modelos = [] } = useModelos();
  const { data: frases = [] } = useFrases();

  // Agrupa frases por categoria
  const frasesPorCategoria = frases.reduce((acc, f) => {
    const cat = f.categoria || 'geral';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(f);
    return acc;
  }, {} as Record<string, Frase[]>);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Digite / para comandos ou comece a laudar...' }),
    ],
    content: laudoInicial || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm prose-slate dark:prose-invert max-w-none focus:outline-none min-h-full',
      },
    },
    onUpdate: ({ editor: e }) => {
      onContentChange?.(e.getHTML());
    },
  });

  // Carrega conteúdo inicial do laudo quando disponível
  useEffect(() => {
    if (editor && laudoInicial && !initialSet[0]) {
      editor.commands.setContent(laudoInicial);
      initialSet[1](true);
    }
  }, [editor, laudoInicial]);

  // Aplica um modelo (substitui todo o conteudo)
  const aplicarModelo = (modelo: ModeloLaudo) => {
    if (!editor) return;
    editor.commands.setContent(modelo.conteudoPadrao);
  };

  // Insere uma frase na posição atual do cursor
  const inserirFrase = (frase: Frase) => {
    if (!editor) return;
    editor.commands.insertContent(frase.conteudo);
    setShowFrases(false);
  };

  const wordCount = editor?.getText().split(/\s+/).filter(word => word.length > 0).length || 0;
  const charCount = editor?.getText().length || 0;

  return (
    <div className={cn(
      "flex h-full w-full min-w-0 overflow-hidden flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-[-10px_0_30px_rgba(0,0,0,0.3)]",
      isModoEditor && "bg-slate-100 dark:bg-slate-900 shadow-none"
    )}>
      {/* Tabs */}
      {!isModoEditor && (
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4">
          <div className="flex gap-4 sm:gap-6 text-xs font-bold uppercase tracking-wider overflow-x-auto custom-scrollbar whitespace-nowrap hide-scrollbar flex-1 mr-4">
            <button onClick={() => setActiveTab('laudo')} className={cn("h-12 border-b-2 transition-colors", activeTab === 'laudo' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300")}>Laudo</button>
            <button onClick={() => setActiveTab('ficha')} className={cn("h-12 border-b-2 transition-colors", activeTab === 'ficha' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300")}>Ficha Clínica</button>
            <button onClick={() => setActiveTab('historico')} className={cn("h-12 border-b-2 transition-colors", activeTab === 'historico' ? "border-green-600 text-green-600" : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300")}>Histórico Assinatura</button>
          </div>
          <button 
            title="Abrir como Janela Flutuante" 
            onClick={() => {
              const w = 700;
              const h = 900;
              const left = (window.screen.width / 2) - (w / 2);
              const top = (window.screen.height / 2) - (h / 2);
              window.open(window.location.pathname + '?modo=editor', 'WorkspaceEditor', `width=${w},height=${h},top=${top},left=${left},menubar=no,toolbar=no,location=no,status=no`);
            }}
            className="text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            <ExternalLink size={16} />
          </button>
        </div>
      )}

      {/* Accordion das Séries DICOM */}
      {!isModoEditor && (
        <div className="border-b border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => setIsSeriesOpen(!isSeriesOpen)}
            className="flex w-full items-center justify-between bg-slate-50 dark:bg-slate-900/50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 transition-colors focus:outline-none"
          >
            <div className="flex items-center gap-2">
              <Layers size={14} className="text-blue-500" />
              <span>Séries DICOM ({series.length})</span>
            </div>
            <ChevronDown size={14} className={cn("transition-transform duration-200", isSeriesOpen ? "rotate-180" : "rotate-0")} />
          </button>
          
          <div className={cn("overflow-hidden transition-all duration-300 ease-in-out bg-slate-100 dark:bg-slate-950", isSeriesOpen ? "max-h-64 border-t border-slate-200 dark:border-slate-800" : "max-h-0")}>
            <div className="p-2 space-y-1.5 overflow-y-auto max-h-64 custom-scrollbar">
              {series.length === 0 ? (
                <p className="text-center text-xs text-slate-500 py-4 italic">Nenhuma série DICOM encontrada</p>
              ) : (
                series.map((serie, index) => (
                  <button
                    key={serie.id}
                    onClick={() => onSelectSeries && onSelectSeries(serie.id)}
                    className={cn(
                      "w-full text-left rounded-md p-2 transition-all border",
                      activeSeriesId === serie.id 
                        ? "border-blue-500 bg-white dark:bg-slate-900 shadow-sm ring-1 ring-blue-500/20" 
                        : "border-transparent hover:bg-slate-200/50 dark:hover:bg-slate-900/50"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-bold text-slate-500 bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">#{index + 1}</span>
                      <span className="text-[9px] font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-1.5 py-0.5 rounded border border-purple-200 dark:border-purple-800/30">
                        {serie.modalidade}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate pr-2">{serie.descricao || `Série ${index + 1}`}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{serie.totalImagens} imagens</p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'laudo' && (
        <>
          {!isModoEditor && (
            <>
              {/* Modelos (do banco) - Sanfonado */}
              <div className="border-b border-slate-100 dark:border-slate-800">
                <button 
                  onClick={() => setIsModelosOpen(!isModelosOpen)}
                  className="flex w-full items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 px-4 py-2 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                >
                  <div className="flex items-center gap-2">
                    <Activity size={14} className="text-purple-500 shrink-0" />
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Modelos de Laudo ({modelos.length})
                    </span>
                  </div>
                  <ChevronDown size={14} className={cn("text-slate-400 transition-transform duration-200", isModelosOpen ? "rotate-180" : "rotate-0")} />
                </button>

                <div className={cn("overflow-hidden transition-all duration-300 ease-in-out bg-slate-50/30 dark:bg-slate-950", isModelosOpen ? "max-h-48 border-t border-slate-100 dark:border-slate-800/50" : "max-h-0")}>
                  <div className="p-3">
                    <div className="flex flex-wrap gap-2">
                      {modelos.length === 0 && (
                        <span className="text-[10px] text-slate-500 italic block w-full text-center py-2">Nenhum modelo cadastrado</span>
                      )}
                      {modelos.map((modelo) => (
                        <button
                          key={modelo.id}
                          onClick={() => aplicarModelo(modelo)}
                          className="rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20 dark:hover:border-blue-800/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm"
                          title={`Aplicar modelo: ${modelo.nome}`}
                        >
                          {modelo.nome}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Frases rápidas */}
              <div className="relative border-b border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setShowFrases(!showFrases)}
                  className="flex items-center gap-2 w-full px-4 py-2 bg-slate-50/30 dark:bg-slate-900/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <Quote size={14} className="text-cyan-500 shrink-0" />
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Frases Rápidas ({frases.length})
                  </span>
                  <ChevronDown size={12} className={cn("text-slate-400 transition-transform ml-auto", showFrases && "rotate-180")} />
                </button>
                
                {showFrases && (
                  <div className="max-h-[200px] overflow-y-auto border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 custom-scrollbar">
                    {frases.length === 0 && (
                      <p className="px-4 py-3 text-[11px] text-slate-500 italic">Nenhuma frase cadastrada. Vá em Configurações → Templates & Frases.</p>
                    )}
                    {Object.entries(frasesPorCategoria).map(([categoria, items]) => (
                      <div key={categoria}>
                        <p className="px-4 pt-2 pb-1 text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">{categoria}</p>
                        {items.map((frase) => (
                          <button
                            key={frase.id}
                            onClick={() => inserirFrase(frase)}
                            className="w-full text-left px-4 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                            title="Clique para inserir no cursor"
                          >
                            <span className="font-medium">{frase.titulo}</span>
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Toolbar TipTap */}
              <div className="flex items-center gap-1 border-b border-slate-100 dark:border-slate-800 px-4 py-2 text-slate-500 dark:text-slate-400">
                <button onClick={() => editor?.chain().focus().toggleBold().run()} className={cn("p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800", editor?.isActive('bold') && "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white")}><Bold size={16} /></button>
                <button onClick={() => editor?.chain().focus().toggleItalic().run()} className={cn("p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800", editor?.isActive('italic') && "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white")}><Italic size={16} /></button>
                <div className="mx-1 h-4 w-px bg-slate-200 dark:bg-slate-800" />
                <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className={cn("p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800", editor?.isActive('bulletList') && "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white")}><List size={16} /></button>
                <button onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={cn("p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800", editor?.isActive('orderedList') && "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white")}><ListOrdered size={16} /></button>
              </div>
            </>
          )}

          {/* Área de Digitação */}
          <div className={cn(
            "flex-1 overflow-y-auto custom-scrollbar p-6",
            isModoEditor && "flex justify-center bg-slate-100 dark:bg-slate-900"
          )}>
            <div className={cn(
              "bg-white p-8 min-h-full",
              isModoEditor ? "w-full max-w-[800px] shadow-xl rounded-md border border-slate-200 dark:border-slate-800" : "w-full",
              "text-slate-900" // Sempre texto escuro no papel
            )}>
              <EditorContent editor={editor} />
            </div>
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

      {activeTab === 'historico' && (
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50 dark:bg-slate-900/50">
          <div className="space-y-3">
            {assinaturas.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs text-slate-500 italic">Nenhuma assinatura registrada</p>
                <p className="text-[10px] text-slate-600 mt-1">O laudo ainda não foi finalizado</p>
              </div>
            ) : (
              assinaturas.map((ass: any) => (
                <div key={ass.id} className="rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 shadow-sm">
                  <div className="flex items-center gap-2 mb-1.5 border-b border-slate-100 dark:border-slate-700/50 pb-1.5">
                    <span className="text-emerald-500 font-bold text-[10px]">✓</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{ass.nomeUsuario}</span>
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex justify-between">
                      <p className="text-[10px] text-slate-500 dark:text-slate-400"><span className="font-bold uppercase">Tipo:</span> {ass.tipo}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400"><span className="font-bold uppercase">Perfil:</span> {ass.perfilUsuario}</p>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400"><span className="font-bold uppercase">Data:</span> {new Date(ass.dataAssinatura).toLocaleString('pt-BR')}</p>
                    {ass.notas && <p className="text-[10px] text-slate-600 dark:text-slate-300 italic mt-1 bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded">{ass.notas}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
