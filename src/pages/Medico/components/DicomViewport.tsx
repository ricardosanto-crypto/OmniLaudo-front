import { useEffect, useRef, useState } from 'react';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';

interface DicomViewportProps {
  imageId: string | null; // ex: 'wadouri:http://localhost:3001/api/v1/dicom/proxy/instancia/123/file'
  activeTool: string;
  onImageScroll?: (direction: number) => void; // +1 pra frente, -1 pra trás
  resetCounter?: number;
  invertCounter?: number;
}

export function DicomViewport({ imageId, activeTool, onImageScroll, resetCounter, invertCounter }: DicomViewportProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const toolsReady = useRef(false);
  const [viewportData, setViewportData] = useState({ zoom: 1, windowWidth: 0, windowCenter: 0 });
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Referência mutável para onImageScroll (evita stale closures)
  const scrollRef = useRef(onImageScroll);
  scrollRef.current = onImageScroll;

  // Efeito de Montagem/Desmontagem do Elemento Cornerstone
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    cornerstone.enable(element);

    // Escuta mudanças de zoom/contraste aplicadas pelo médico via mouse
    const onImageRendered = () => {
      try {
        const viewport = cornerstone.getViewport(element);
        if (viewport) {
          setViewportData({
            zoom: viewport.scale,
            windowWidth: viewport.voi.windowWidth,
            windowCenter: viewport.voi.windowCenter,
          });
        }
      } catch { /* element may be disabled */ }
    };
    element.addEventListener('cornerstoneimagerendered', onImageRendered);

    // Listener de scroll do mouse para trocar as imagens (slices)
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (scrollRef.current) {
        const direction = e.deltaY > 0 ? 1 : -1;
        scrollRef.current(direction);
      }
    };
    element.addEventListener('wheel', onWheel, { passive: false });

    // ResizeObserver: Cornerstone PRECISA ser notificado quando o container muda de tamanho
    // Sem isso, o canvas fica com dimensões 0x0 → tela preta
    const resizeObserver = new ResizeObserver(() => {
      try {
        cornerstone.resize(element, true);
      } catch { /* element may not have an image yet */ }
    });
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
      element.removeEventListener('cornerstoneimagerendered', onImageRendered);
      element.removeEventListener('wheel', onWheel);
      try {
        cornerstone.disable(element);
      } catch { /* already disabled */ }
    };
  }, []);

  // Efeito para carregar a imagem quando o ID mudar
  useEffect(() => {
    const element = elementRef.current;
    if (!element || !imageId) return;

    setIsLoading(true);
    setLoadError(null);

    cornerstone.loadImage(imageId).then((image: any) => {
      // Se a Imagem/DICOM vier sem metadados de espaçamento físico (ex: Simuladores),
      // forçamos uma calibração 1:1, fazendo a Régua passar a ler Milímetros ('mm') em vez de 'px'.
      if (!image.rowPixelSpacing || !image.columnPixelSpacing) {
        image.rowPixelSpacing = 1.0; 
        image.columnPixelSpacing = 1.0;
      }

      cornerstone.displayImage(element, image);

      // Registra as ferramentas no ELEMENTO apenas na primeira vez
      if (!toolsReady.current) {
        cornerstoneTools.addToolForElement(element, cornerstoneTools.WwwcTool);
        cornerstoneTools.addToolForElement(element, cornerstoneTools.PanTool);
        cornerstoneTools.addToolForElement(element, cornerstoneTools.ZoomTool);
        cornerstoneTools.addToolForElement(element, cornerstoneTools.LengthTool);
        cornerstoneTools.addToolForElement(element, cornerstoneTools.AngleTool);
        cornerstoneTools.addToolForElement(element, cornerstoneTools.EllipticalRoiTool);
        cornerstoneTools.addToolForElement(element, cornerstoneTools.RectangleRoiTool);
        cornerstoneTools.addToolForElement(element, cornerstoneTools.ProbeTool);
        cornerstoneTools.addToolForElement(element, cornerstoneTools.ArrowAnnotateTool);
        cornerstoneTools.addToolForElement(element, cornerstoneTools.TextMarkerTool, {
          configuration: {
            markers: ['Anotação', 'Nódulo', 'Cisto', 'Lesão', 'Cálculo'],
            current: 'Anotação',
            ascending: true,
            loop: true,
          }
        });
        cornerstoneTools.addToolForElement(element, cornerstoneTools.EraserTool);
        toolsReady.current = true;
      }

      // Ativa a ferramenta padrão (Contraste W/L)
      try {
        cornerstoneTools.setToolActiveForElement(element, 'Wwwc', { mouseButtonMask: 1 });
      } catch { /* tool may already be active */ }

      setIsLoading(false);

      // Fit-to-window: ajusta o zoom para caber no container
      cornerstone.resize(element, true);

    }).catch((err: any) => {
      console.error("Erro ao carregar DICOM:", err);
      setLoadError(err?.message || 'Erro ao carregar imagem DICOM');
      setIsLoading(false);
    });
  }, [imageId]);

  // Efeito para trocar a ferramenta ativa quando o state 'activeTool' mudar na header
  useEffect(() => {
    const element = elementRef.current;
    if (!element || !toolsReady.current) return;

    // Desabilita todas as tools antes de ativar a nova
    const allTools = [
      'Wwwc', 'Pan', 'Zoom', 'Length', 'Angle',
      'EllipticalRoi', 'RectangleRoi', 'Probe', 'ArrowAnnotate', 'TextMarker', 'Eraser'
    ];

    if (activeTool === 'cursor') {
      // Modo cursor: desabilita tudo
      allTools.forEach(name => {
        try { cornerstoneTools.setToolPassiveForElement(element, name); } catch { }
      });
      return;
    }

    // Ativa a tool selecionada
    allTools.forEach(name => {
      try {
        if (name === activeTool) {
          cornerstoneTools.setToolActiveForElement(element, name, { mouseButtonMask: 1 });
        } else {
          cornerstoneTools.setToolPassiveForElement(element, name);
        }
      } catch { }
    });
  }, [activeTool]);

  // Efeito para observer o gatilho de RESET (acionado pelas ferramentas da Header)
  useEffect(() => {
    const element = elementRef.current;
    if (element && resetCounter && resetCounter > 0) {
      try { 
        cornerstone.reset(element);
      } catch (err) {
        console.error("Erro ao resetar viewport:", err);
      }
    }
  }, [resetCounter]);

  // Efeito para observer o gatilho de INVERTER CORES
  useEffect(() => {
    const element = elementRef.current;
    if (element && invertCounter && invertCounter > 0) {
      try { 
        const viewport = cornerstone.getViewport(element);
        if (viewport) {
          viewport.invert = !viewport.invert;
          cornerstone.setViewport(element, viewport);
        }
      } catch (err) {
        console.error("Erro ao inverter cores:", err);
      }
    }
  }, [invertCounter]);

  // Efeito para observer redimensionamento da tela (ResizeObserver)
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let rafId: number;
    const resizeObserver = new ResizeObserver(() => {
      // Usa requestAnimationFrame para evitar "ResizeObserver loop limit exceeded" e engasgos severos (throttling)
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        try {
          if (element) cornerstone.resize(element, true);
        } catch (e) {
          console.warn("Erro ao fazer resize do cornerstone:", e);
        }
      });
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-black" onContextMenu={(e) => e.preventDefault()}>
      {/* Container do Canvas Cornerstone */}
      <div ref={elementRef} className="absolute inset-0" />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            <span className="text-xs font-medium text-blue-400">Carregando DICOM...</span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {loadError && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-lg bg-red-950/80 border border-red-900 px-4 py-3 text-center">
            <p className="text-sm font-medium text-red-400">Erro ao carregar imagem</p>
            <p className="text-xs text-red-500/80 mt-1">{loadError}</p>
          </div>
        </div>
      )}

      {/* OVERLAYS (Desabilitam pointer-events para não atrapalhar o mouse no canvas) */}
      <div className="pointer-events-none absolute inset-0 p-4 font-mono text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
        {/* Top Left */}
        <div className="absolute top-4 left-4 flex flex-col text-green-400">
        </div>

        {/* Bottom Left */}
        <div className="absolute bottom-4 left-4 flex flex-col text-amber-400">
          <span className="font-bold">Zoom: {(viewportData.zoom * 100).toFixed(0)}%</span>
          <span>W: {viewportData.windowWidth.toFixed(0)} L: {viewportData.windowCenter.toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
}
