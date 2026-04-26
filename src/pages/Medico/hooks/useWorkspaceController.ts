import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgendamentoById } from '@/hooks/useAgendamentos';
import { useEstudoByAgendamento, useOrthancSeries, OrthancSeries } from '@/hooks/useDicom';
import { initCornerstone } from '@/lib/cornerstone';
import {
  useLaudoByAgendamento,
  useSalvarLaudo,
  useFinalizarLaudo,
  useAssinarTecnica,
  useHomologar,
  useAssinaturas
} from '@/hooks/useLaudos';

export function useWorkspaceController(agendamentoId: string | undefined) {
  const navigate = useNavigate();

  // ── INICIALIZAÇÃO LAZY DO CORNERSTONE ──
  useEffect(() => {
    initCornerstone();
  }, []);

  // ── ESTADOS DA UI ──
  const [activeTool, setActiveTool] = useState('Wwwc');
  const [activeSeriesId, setActiveSeriesId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [gridLayout, setGridLayout] = useState<number>(1);
  const [viewportResetCounter, setViewportResetCounter] = useState<number>(0);
  const [viewportInvertCounter, setViewportInvertCounter] = useState<number>(0);
  const [editorContent, setEditorContent] = useState('');

  // ── BUSCA DE DADOS (Queries) ──
  const { data: agendamento, isLoading: loadAgend } = useAgendamentoById(agendamentoId);
  const { data: estudo, isLoading: loadEstudo } = useEstudoByAgendamento(agendamentoId);
  const { data: series, isLoading: loadSeries } = useOrthancSeries(estudo?.idOrthanc);
  const { data: laudo } = useLaudoByAgendamento(agendamentoId);
  const { data: assinaturas = [] } = useAssinaturas(agendamentoId);

  // ── MUTAÇÕES ──
  const salvarLaudo = useSalvarLaudo();
  const finalizarLaudo = useFinalizarLaudo();
  const assinarTecnica = useAssinarTecnica();
  const homologarLaudo = useHomologar();

  const isLoadingGlobally = loadAgend || loadEstudo || loadSeries;

  // ── EFEITOS ──
  useEffect(() => {
    if (series && series.length > 0 && !activeSeriesId) {
      setActiveSeriesId(series[0].id);
      setActiveImageIndex(0);
    }
  }, [series, activeSeriesId]);

  // ── LÓGICAS DERIVADAS ──
  const serieAtiva = (series as OrthancSeries[] | undefined)?.find((s) => s.id === activeSeriesId);
  const instanciaAtivaId = serieAtiva ? serieAtiva.instancias[activeImageIndex] : null;

  const handleScroll = useCallback((direction: number) => {
    if (!serieAtiva) return;
    setActiveImageIndex(prev => {
      const next = prev + direction;
      if (next >= 0 && next < serieAtiva.instancias.length) return next;
      return prev;
    });
  }, [serieAtiva]);

  const dicomUrl = instanciaAtivaId 
    ? `wadouri:${import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1'}/dicom/proxy/instancia/${instanciaAtivaId}/file` 
    : null;

  // ── AÇÕES ──
  const handleSalvar = () => {
    if (!agendamentoId || !agendamento) return;
    salvarLaudo.mutate({
      agendamentoId,
      medicoId: '', 
      achados: editorContent,
      impressao: '',
    });
  };

  const handleFinalizar = async () => {
    if (!agendamentoId || !agendamento) return;
    try {
      const saveRes = await salvarLaudo.mutateAsync({
        agendamentoId, medicoId: '', achados: editorContent, impressao: '',
      });
      const laudoId = saveRes.data?.id;
      if (!laudoId) throw new Error('Laudo não criado.');

      await finalizarLaudo.mutateAsync(laudoId);
      navigate('/worklist-medico');
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const handleAssinarTecnica = async () => {
    if (!agendamentoId || !agendamento) return;
    try {
      const saveRes = await salvarLaudo.mutateAsync({
        agendamentoId, medicoId: '', achados: editorContent, impressao: '',
      });
      const laudoId = saveRes.data?.id;
      if (!laudoId) throw new Error('Laudo não criado.');

      await assinarTecnica.mutateAsync(laudoId);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const handleHomologar = async () => {
    if (!agendamentoId || !agendamento) return;
    try {
      const saveRes = await salvarLaudo.mutateAsync({
        agendamentoId, medicoId: '', achados: editorContent, impressao: '',
      });
      const laudoId = saveRes.data?.id;
      if (!laudoId) throw new Error('Laudo não criado.');

      await homologarLaudo.mutateAsync(laudoId);
      navigate('/worklist-medico');
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const handleToggleGrid = () => setGridLayout(prev => prev === 1 ? 2 : prev === 2 ? 4 : 1);
  const handleResetViewport = () => setViewportResetCounter(prev => prev + 1);
  const handleInvertViewport = () => setViewportInvertCounter(prev => prev + 1);

  return {
    agendamento, estudo, series, laudo, assinaturas, isLoadingGlobally,
    activeTool, setActiveTool, activeSeriesId, setActiveSeriesId,
    activeImageIndex, setActiveImageIndex, gridLayout, viewportResetCounter,
    viewportInvertCounter, setEditorContent, serieAtiva, dicomUrl,
    handleScroll, handleSalvar, handleFinalizar, handleAssinarTecnica,
    handleHomologar, handleToggleGrid, handleResetViewport, handleInvertViewport,
    isSaving: salvarLaudo.isPending
  };
}
