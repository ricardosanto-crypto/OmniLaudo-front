import { useEffect, useRef, useState } from 'react';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';

interface DicomViewportProps {
  imageId: string | null; // ex: 'wadouri:http://localhost:3001/api/v1/dicom/proxy/instancia/123/file'
  activeTool: string;
  pacienteNome: string;
  onImageScroll?: (direction: number) => void; // +1 pra frente, -1 pra trás
}

export function DicomViewport({ imageId, activeTool, pacienteNome, onImageScroll }: DicomViewportProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [viewportData, setViewportData] = useState({ zoom: 1, windowWidth: 0, windowCenter: 0 });

  // Efeito de Montagem/Desmontagem do Elemento
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    cornerstone.enable(element);

    // Escuta mudanças de zoom/contraste aplicadas pelo médico via mouse
    const onImageRendered = () => {
      const viewport = cornerstone.getViewport(element);
      if (viewport) {
        setViewportData({
          zoom: viewport.scale,
          windowWidth: viewport.voi.windowWidth,
          windowCenter: viewport.voi.windowCenter,
        });
      }
    };
    element.addEventListener('cornerstoneimagerendered', onImageRendered);

    // Listener de scroll do mouse para trocar as imagens (slices)
    const onWheel = (e: WheelEvent) => {
      if (onImageScroll) {
        const direction = e.deltaY > 0 ? 1 : -1;
        onImageScroll(direction);
      }
    };
    element.addEventListener('wheel', onWheel);

    return () => {
      element.removeEventListener('cornerstoneimagerendered', onImageRendered);
      element.removeEventListener('wheel', onWheel);
      cornerstone.disable(element);
    };
  }, []);

  // Efeito para carregar a imagem quando o ID mudar
  useEffect(() => {
    const element = elementRef.current;
    if (!element || !imageId) return;

    cornerstone.loadImage(imageId).then((image: any) => {
      cornerstone.displayImage(element, image);

      // Adicionando ferramentas padrão após a imagem carregar
      cornerstoneTools.addToolForElement(element, cornerstoneTools.WwwcTool); // Contraste
      cornerstoneTools.addToolForElement(element, cornerstoneTools.PanTool);  // Mover
      cornerstoneTools.addToolForElement(element, cornerstoneTools.ZoomTool); // Lupa

      // Seta a ferramenta W/L (Contraste) como ativa por padrão
      cornerstoneTools.setToolActiveForElement(element, 'Wwwc', { mouseButtonMask: 1 });
    }).catch((err: any) => console.error("Erro ao carregar DICOM:", err));
  }, [imageId]);

  // Efeito para trocar a ferramenta ativa quando o state 'activeTool' mudar na header
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (activeTool !== 'cursor') {
      cornerstoneTools.setToolActiveForElement(element, activeTool, { mouseButtonMask: 1 });
    }
  }, [activeTool]);

  return (
    <div className="relative flex h-full w-full bg-black" onContextMenu={(e) => e.preventDefault()}>
      {/* Container do Canvas */}
      <div ref={elementRef} className="absolute inset-0" />

      {/* OVERLAYS (Desabilitam pointer-events para não atrapalhar o mouse no canvas) */}
      <div className="pointer-events-none absolute inset-0 p-4 font-mono text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
        {/* Top Left */}
        <div className="absolute top-4 left-4 flex flex-col text-green-400">
          <span className="font-bold">{pacienteNome}</span>
          {imageId ? <span>Carregado via WADO</span> : <span>Aguardando imagem...</span>}
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
