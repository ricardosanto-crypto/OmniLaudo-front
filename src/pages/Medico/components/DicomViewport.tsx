import { useEffect, useRef, useState } from 'react';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';

interface DicomViewportProps {
  imageId: string | null;
  activeTool: string;
  onImageScroll?: (direction: number) => void;
  resetCounter?: number;
  invertCounter?: number;
}

export function DicomViewport({ imageId, activeTool, onImageScroll, resetCounter, invertCounter }: DicomViewportProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const toolsInitialized = useRef(false);
  const scrollRef = useRef(onImageScroll);

  const [viewportData, setViewportData] = useState({ zoom: 1, windowWidth: 0, windowCenter: 0 });
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mantém a ref de scroll sempre atualizada sem causar re-renders do useEffect principal
  useEffect(() => {
    scrollRef.current = onImageScroll;
  }, [onImageScroll]);

  // EFEITO 1: Inicialização e Limpeza do DOM do Cornerstone
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    cornerstone.enable(element);

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
      } catch { /* ignora se já foi destruído */ }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (scrollRef.current) {
        scrollRef.current(e.deltaY > 0 ? 1 : -1);
      }
    };

    element.addEventListener('cornerstoneimagerendered', onImageRendered);
    element.addEventListener('wheel', onWheel, { passive: false });

    // ResizeObserver com debounce via requestAnimationFrame
    let rafId: number;
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        try { if (element) cornerstone.resize(element, true); } catch { /* ignore */ }
      });
    });
    resizeObserver.observe(element);

    return () => {
      // CLEANUP BLINDADO (Evita memory leaks monstruosos de canvas)
      resizeObserver.disconnect();
      cancelAnimationFrame(rafId);
      element.removeEventListener('cornerstoneimagerendered', onImageRendered);
      element.removeEventListener('wheel', onWheel);
      try {
        cornerstone.disable(element);
      } catch { /* ignore */ }
      toolsInitialized.current = false; // Reset de tools na destruição da div
    };
  }, []);

  // EFEITO 2: Carregamento de Imagem DICOM
  useEffect(() => {
    const element = elementRef.current;
    if (!element || !imageId) return;

    setIsLoading(true);
    setLoadError(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cornerstone.loadImage(imageId).then((image: any) => {
      // Fallback para simuladores sem metadados físicos
      if (!image.rowPixelSpacing || !image.columnPixelSpacing) {
        image.rowPixelSpacing = 1.0; 
        image.columnPixelSpacing = 1.0;
      }

      cornerstone.displayImage(element, image);

      // Adiciona tools no elemento apenas 1x
      if (!toolsInitialized.current) {
        const tools = ['Wwwc', 'Pan', 'Zoom', 'Length', 'Angle', 'EllipticalRoi', 'RectangleRoi', 'Probe', 'ArrowAnnotate', 'Eraser'];
        tools.forEach(t => cornerstoneTools.addToolForElement(element, cornerstoneTools[`${t}Tool`]));
        
        cornerstoneTools.addToolForElement(element, cornerstoneTools.TextMarkerTool, {
          configuration: { markers: ['Anotação', 'Nódulo', 'Cisto'], current: 'Anotação', ascending: true, loop: true }
        });
        
        toolsInitialized.current = true;
      }

      setIsLoading(false);
      cornerstone.resize(element, true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).catch((err: any) => {
      console.error("Erro ao carregar DICOM:", err);
      setLoadError(err?.message || 'Erro ao carregar imagem DICOM');
      setIsLoading(false);
    });
  }, [imageId]);

  // EFEITO 3: Troca de Ferramenta Ativa
  useEffect(() => {
    const element = elementRef.current;
    if (!element || !toolsInitialized.current) return;

    const allTools = ['Wwwc', 'Pan', 'Zoom', 'Length', 'Angle', 'EllipticalRoi', 'RectangleRoi', 'Probe', 'ArrowAnnotate', 'TextMarker', 'Eraser'];

    allTools.forEach(name => {
      try {
        if (activeTool === 'cursor') {
          cornerstoneTools.setToolPassiveForElement(element, name);
        } else if (name === activeTool) {
          cornerstoneTools.setToolActiveForElement(element, name, { mouseButtonMask: 1 });
        } else {
          cornerstoneTools.setToolPassiveForElement(element, name);
        }
      } catch { /* ignore */ }
    });
  }, [activeTool, imageId]); // Depende do imageId para garantir que aplique após a imagem carregar

  // EFEITO 4: Reset & Invert
  useEffect(() => {
    if (elementRef.current && resetCounter && resetCounter > 0) {
      try { cornerstone.reset(elementRef.current); } catch { /* ignore */ }
    }
  }, [resetCounter]);

  useEffect(() => {
    const element = elementRef.current;
    if (element && invertCounter && invertCounter > 0) {
      try { 
        const viewport = cornerstone.getViewport(element);
        if (viewport) {
          viewport.invert = !viewport.invert;
          cornerstone.setViewport(element, viewport);
        }
      } catch { /* ignore */ }
    }
  }, [invertCounter]);

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-black" onContextMenu={(e) => e.preventDefault()}>
      <div ref={elementRef} className="absolute inset-0" />

      {isLoading && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            <span className="text-xs font-medium text-blue-400">Carregando DICOM...</span>
          </div>
        </div>
      )}

      {loadError && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-lg bg-red-950/80 border border-red-900 px-4 py-3 text-center">
            <p className="text-sm font-medium text-red-400">Erro ao carregar imagem</p>
            <p className="text-xs text-red-500/80 mt-1">{loadError}</p>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 p-4 font-mono text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
        <div className="absolute bottom-4 left-4 flex flex-col text-amber-400">
          <span className="font-bold">Zoom: {(viewportData.zoom * 100).toFixed(0)}%</span>
          <span>W: {viewportData.windowWidth.toFixed(0)} L: {viewportData.windowCenter.toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
}
