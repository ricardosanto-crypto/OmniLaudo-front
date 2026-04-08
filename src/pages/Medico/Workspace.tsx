import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, FileCheck, MessageSquare, Zap, Maximize } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useModelosLaudo, useFinalizarLaudo } from '../../hooks/useLaudos';
import { toast } from 'sonner';
import { MESSAGES } from '../../constants/messages';

export function WorkspaceMedico() {
  const { id } = useParams(); // ID do Agendamento/Exame
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'laudo' | 'paciente'>('laudo');

  // Configuração do Editor de Laudo
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Comece a descrever os achados...' }),
    ],
    content: '',
  });

  const { data: modelos } = useModelosLaudo();
  const { mutate: finalizar, isPending: isFinishing } = useFinalizarLaudo();

  const handleAplicarTemplate = (conteudo: string) => {
    editor?.commands.setContent(conteudo);
    toast.success(MESSAGES.SUCCESS.TEMPLATE_APPLIED);
  };

  const handleFinalizarExame = () => {
    if (!id) return;
    finalizar(id, {
        onSuccess: () => {
            navigate('/worklist');
        }
    });
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <PageWrapper>
      <div className="h-screen w-full flex flex-col bg-slate-950 overflow-hidden text-slate-200">
        {/* Barra de Topo Ultra-Slim */}
        <header className="h-12 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={() => navigate(-1)}>
              <ChevronLeft size={18} />
            </Button>
            <div className="flex flex-col">
              <h2 className="text-xs font-bold text-slate-100 uppercase">JOÃO DA SILVA</h2>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">RM CRÂNIO COM CONTRASTE</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:bg-slate-800" onClick={toggleFullscreen} title="Tela Cheia">
              <Maximize size={16} />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-slate-400 hover:bg-slate-800 hover:text-white">
              <Save size={14} className="mr-2" /> Rascunho
            </Button>
            <Button 
              size="sm" 
              className="h-8 bg-green-600 hover:bg-green-700 text-white border-0"
              onClick={handleFinalizarExame}
              disabled={isFinishing}
            >
              <FileCheck size={14} className="mr-2" /> Finalizar e Assinar
            </Button>
          </div>
        </header>

        {/* Área Principal (Híbrida) */}
        <main className="flex-1 flex overflow-hidden">
          
          {/* LADO ESQUERDO: Visualizador DICOM (Placeholder funcional) */}
          <section className="flex-1 relative bg-black flex items-center justify-center border-r border-slate-800">
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              <div className="bg-slate-900/90 p-2 rounded border border-slate-800 text-[10px] text-slate-400 font-mono backdrop-blur-sm">
                <p>W: 512 L: 60</p>
                <p>Zoom: 100%</p>
              </div>
            </div>
            
            <div className="text-slate-800 flex flex-col items-center">
              <div className="w-80 h-80 border-2 border-dashed border-slate-900 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-sm font-mono uppercase tracking-[0.2em] text-slate-700">DICOM Viewer Area</span>
              </div>
              <p className="mt-4 text-[10px] text-slate-600 italic uppercase tracking-widest">Sincronizado com Accession Number</p>
            </div>
          </section>

          {/* LADO DIREITO: Laudário */}
          <section className="w-[500px] bg-white flex flex-col shadow-2xl shrink-0">
            <div className="flex border-b border-slate-100">
              <button 
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${activeTab === 'laudo' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-slate-400'}`}
                onClick={() => setActiveTab('laudo')}
              >
                Laudo
              </button>
              <button 
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${activeTab === 'paciente' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-slate-400'}`}
                onClick={() => setActiveTab('paciente')}
              >
                Ficha do Paciente
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
              {activeTab === 'laudo' ? (
                <div className="space-y-6">
                  {/* Sugestões de Templates */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sugestões (TUSS):</span>
                    <div className="flex flex-wrap gap-2">
                      {modelos?.map(m => (
                        <Button 
                          key={m.id} 
                          variant="outline" 
                          className="h-7 text-[10px] border-slate-200 hover:border-amber-300 hover:bg-amber-50" 
                          onClick={() => handleAplicarTemplate(m.conteudoPadrao)}
                        >
                          <Zap size={10} className="mr-1 text-amber-500" /> {m.nome}
                        </Button>
                      ))}
                      {!modelos?.length && <span className="text-[10px] text-slate-300">Nenhum template específico encontrado.</span>}
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 ring-primary-100 transition-shadow">
                    <EditorContent 
                      editor={editor} 
                      className="prose prose-slate prose-sm max-w-none min-h-[500px] p-6 outline-none text-slate-700" 
                    />
                  </div>
                </div>
              ) : (
                <div className="text-slate-500 text-xs italic p-4 text-center border-2 border-dashed border-slate-100 rounded-xl">
                  Histórico clínico e alergias do paciente aparecem aqui...
                </div>
              )}
            </div>
          </section>
        </main>

        {/* Footer do Sistema */}
        <footer className="h-8 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-4 text-[10px] text-slate-500 shrink-0">
          <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Radiologista: Dr. Admin Matriz
          </p>
          <div className="flex gap-6 uppercase font-bold tracking-tighter">
            <span className="flex items-center gap-1.5"><MessageSquare size={10} /> F1: Ajuda</span>
            <span className="flex items-center gap-1.5"><Zap size={10} /> Ctrl + S: Salvar</span>
          </div>
        </footer>
      </div>
    </PageWrapper>
  );
}
