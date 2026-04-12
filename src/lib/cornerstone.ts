import dicomParser from 'dicom-parser';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneMath from 'cornerstone-math';
import * as cornerstoneTools from 'cornerstone-tools';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import Hammer from 'hammerjs';
import { useAuthStore } from '../store/useAuthStore';

// Variável para garantir que só inicialize uma vez
let isInitialized = false;

export function initCornerstone() {
  if (isInitialized) return;

  // 1. Fornece as dependências externas para as bibliotecas do ecossistema Cornerstone
  cornerstoneTools.external.cornerstone = cornerstone;
  cornerstoneTools.external.Hammer = Hammer;
  cornerstoneTools.external.cornerstoneMath = cornerstoneMath;

  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

  // 2. Inicializa o Cornerstone Tools
  cornerstoneTools.init({
    globalToolSyncEnabled: true,
    showSVGCursors: true,
  });

  // 3. Configuração dos Web Workers (Alta Performance para decodificar .dcm)
  // Usamos o unpkg para carregar os workers dinamicamente no Vite sem dor de cabeça de build
  const config = {
    webWorkerPath: 'https://unpkg.com/cornerstone-wado-image-loader@4.1.5/dist/cornerstoneWADOImageLoaderWebWorker.min.js',
    taskConfiguration: {
      decodeTask: {
        codecsPath: 'https://unpkg.com/cornerstone-wado-image-loader@4.1.5/dist/cornerstoneWADOImageLoaderCodecs.min.js',
      },
    },
  };
  cornerstoneWADOImageLoader.webWorkerManager.initialize(config);

  // 4. O SEGREDO DO TECH LEAD: Injetando o JWT nas requisições WADO
  cornerstoneWADOImageLoader.configure({
    beforeSend: function (xhr: XMLHttpRequest) {
      // Pega o token atualizado direto do Zustand (sua store)
      const token = useAuthStore.getState().token;
      
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      
      // Opcional: Adicione headers extras se seu proxy precisar
      // xhr.setRequestHeader('Accept', 'application/dicom');
    }
  });

  isInitialized = true;
  console.log('🟩 Cornerstone.js inicializado com sucesso (WADO + Tools + JWT Auth)');
}
