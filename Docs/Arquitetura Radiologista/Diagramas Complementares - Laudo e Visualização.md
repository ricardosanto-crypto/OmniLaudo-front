# 📊 Diagramas Complementares – Fluxo de Laudo e Visualização

**OmniLaudo AI** – Visualizações do Fluxo de Trabalho

---

## 1. Fluxo Completo: Do Exame ao Laudo Finalizado

```mermaid
graph TD
    A["📋 EXAME REALIZADO<br/>(Estado: REALIZADO)"] -->|Imagens no PACS| B["🔄 Radiologista<br/>seleciona exame"]
    
    B -->|Carrega dados| C["👁️ VISUALIZAÇÃO<br/>(Estado: LAUDANDO)"]
    
    C -->|Analisa imagens| D["🔍 Ferramentas DICOM<br/>- Zoom, Pan, Medições<br/>- Anotações<br/>- Comparação anterior"]
    
    D -->|Coleta dados| E["📝 REDAÇÃO DO LAUDO<br/>- Templates<br/>- Frases padronizadas<br/>- Descrição + Conclusão"]
    
    E -->|Insere evidências| F["📸 Captura de Imagens<br/>- Anotações relevantes<br/>- Medições importantes<br/>- Integrações ao laudo"]
    
    F -->|Valida e Submete| G["✔️  VALIDAÇÃO<br/>- Campos obrigatórios<br/>- Mínimo de caracteres<br/>- Sem placeholders"]
    
    G -->|Se OK| H["🔐 AGUARDANDO<br/>ASSINATURA TÉCNICA<br/>(Estado: AGUARDANDO_ASSINATURA_TECNICA)"]
    
    G -->|Se FALHA| I["❌ Erro: Campo faltante<br/>Volta para edição"]
    
    I --> E
    
    H -->|Tecnólogo revisa| J["👨‍💼 ASSINATURA TÉCNICA<br/>- Confirma qualidade<br/>- Registra responsabilidade<br/>- Timestamp + User"]
    
    J -->|Assina| K["✅ LAUDO FINALIZADO<br/>(Estado: LAUDO_FINALIZADO)<br/>- Imutável<br/>- Pronto para entrega"]
    
    K -->|Médico requisitante| L["🏥 RESULTADO DISPONÍVEL<br/>- Download PDF<br/>- Com assinaturas<br/>- Pronto para paciente"]
    
    style A fill:#e1f5ff
    style C fill:#fff3e0
    style E fill:#f3e5f5
    style H fill:#ffe0b2
    style K fill:#c8e6c9
    style L fill:#81c784
```

---

## 2. Anatomy – Tela de Laudagem (Componentes)

```mermaid
graph TB
    subgraph A ["HEADER – Informações do Exame"]
        A1["👤 Paciente<br/>João Silva • 52 anos"]
        A2["📋 Exame<br/>RES. JOELHO (MRI)"]
        A3["📊 Status<br/>LAUDANDO"]
        A4["🔘 Botões Ação<br/>COMPARAR • SALVAR • ENVIAR"]
    end
    
    subgraph B ["ÁREA CENTRAL – 60%"]
        B1["🖼️  VIEWER DICOM<br/>(Canvas com imagem)"]
        B2["🧰 TOOLBOX<br/>Pan • Zoom • Medições<br/>Anotações • Playback"]
        B3["📐 Controles<br/>Window/Level • Zoom • Rotação"]
        B4["🎬 SÉRIE THUMBNAILS<br/>T1-Axial • T2-Axial • FLAIR"]
    end
    
    subgraph C ["PAINEL LATERAL – 40%"]
        C1["👥 TAB: PACIENTE<br/>Dados pessoais • Histórico"]
        C2["📚 TAB: TEMPLATES<br/>Templates sugeridos<br/>Frases rápidas"]
        C3["📜 TAB: HISTÓRICO<br/>Versões do laudo<br/>Assinaturas"]
    end
    
    subgraph D ["EDITOR – 100%"]
        D1["📄 BLOCOS ESTRUTURADOS<br/>- DADOS TÉCNICOS (auto)<br/>- DESCRIÇÃO (obrigatório)<br/>- CONCLUSÃO (obrigatório)<br/>- RECOMENDAÇÕES (opcional)"]
        D2["🔗 INTEGRAÇÃO VIEWER<br/>Capturar imagem → Inserir laudo<br/>Anotações → Referências"]
        D3["💾 CONTROLES<br/>SALVAR RASCUNHO • ENVIAR ASSINATURA"]
    end
    
    A --> B
    B --> C
    B --> D
    C --> D
    
    style A fill:#cfe9fc
    style B fill:#fff9c4
    style C fill:#f0f4c3
    style D fill:#f3e5f5
```

---

## 3. Fluxo de Estados – Máquina de Estados

```mermaid
stateDiagram-v2
    [*] --> AGUARDANDO_LAUDO: Exame realizado<br/>e imagens disponíveis
    
    AGUARDANDO_LAUDO --> LAUDANDO: Radiologista<br/>abre exame
    
    LAUDANDO --> SALVO_RASCUNHO: [SALVAR RASCUNHO]
    
    SALVO_RASCUNHO --> LAUDANDO: [Continuar editando]
    
    LAUDANDO --> LAUDANDO: Edita conteúdo<br/>Visualiza imagens<br/>Faz anotações
    
    LAUDANDO --> ERRO_VALIDACAO: [ENVIAR ASSINATURA]<br/>Campos faltantes
    
    ERRO_VALIDACAO --> LAUDANDO: Corrige campos
    
    SALVO_RASCUNHO --> AGUARDANDO_ASSINATURA_TECNICA: [ENVIAR ASSINATURA]<br/>Validação OK
    
    LAUDANDO --> AGUARDANDO_ASSINATURA_TECNICA: [ENVIAR ASSINATURA]<br/>Validação OK
    
    AGUARDANDO_ASSINATURA_TECNICA --> LAUDO_FINALIZADO: Tecnólogo<br/>[ASSINA TECNICAMENTE]
    
    LAUDO_FINALIZADO --> [*]: Laudo pronto<br/>para entrega
    
    note right of LAUDANDO
        Editor desbloqueado
        Múltiplas edições
        Rascunho salvo em BD
    end note
    
    note right of AGUARDANDO_ASSINATURA_TECNICA
        Editor bloqueado (readonly)
        Aguardando ação técnico
        Notificação enviada
    end note
    
    note right of LAUDO_FINALIZADO
        Editor bloqueado (readonly)
        Imutável
        Pronto para PDF/entrega
    end note
```

---

## 4. Viewer DICOM – Modo Side-by-Side

```mermaid
graph TB
    subgraph Atual ["EXAME ATUAL (02/04/2026)"]
        A1["🔍 Canvas<br/>Série T1-Axial"]
        A2["Imagem 15 / 42"]
        A3["Thumbnails abaixo"]
    end
    
    subgraph Anterior ["EXAME ANTERIOR (18/03/2026)"]
        B1["🔍 Canvas<br/>Série T1-Axial"]
        B2["Imagem 15 / 35"]
        B3["Thumbnails abaixo"]
    end
    
    subgraph Sync ["SINCRONIZAÇÕES ATIVAS"]
        S1["✔️  Scroll sincronizado"]
        S2["✔️  Window/Level sincronizado"]
        S3["✔️  Zoom sincronizado"]
    end
    
    A1 ---|Controles compartilhados| B1
    A2 ---|Navegação sincronizada| B2
    Atual ---|Via| Sync
    Anterior ---|Via| Sync
    
    style Atual fill:#c8e6c9
    style Anterior fill:#fff9c4
    style Sync fill:#bbdefb
```

---

## 5. Ciclo de Edição – Radiologista

```mermaid
sequenceDiagram
    participant R as Radiologista
    participant UI as Interface React
    participant API as API Backend
    participant BD as Database
    
    R->>UI: 1. Abre exame
    UI->>API: GET /exams/{id}/series
    API->>UI: Carrega séries DICOM
    UI->>UI: Renderiza viewer first image
    UI->>R: ✓ Exame carregado
    
    R->>UI: 2. Navega, mede, anota
    UI->>UI: Ferramentas ativas (pan, zoom, medição)
    UI->>R: ✓ Ferramentas respondendo
    
    R->>UI: 3. Insere template
    UI->>API: GET /templates?examType=RES_JOELHO
    API->>UI: Retorna templates
    UI->>UI: Insere no editor
    UI->>R: ✓ Template inserido
    
    R->>UI: 4. Edita laudo
    UI->>UI: Detecta mudanças
    UI->>R: ✓ Editor respondendo (unsavedChanges=true)
    
    R->>UI: 5. Clica CAPTURAR IMAGEM
    UI->>UI: Captura canvas + anotações
    UI->>UI: Abre modal "Inserir em qual bloco?"
    R->>UI: Seleciona "DESCRIÇÃO"
    UI->>UI: Insere imagem no editor
    UI->>R: ✓ Imagem inserida como Figura 1
    
    R->>UI: 6. Clica SALVAR RASCUNHO
    UI->>API: PATCH /laudos/{id}<br/>{ descricao, conclusao, ... }
    API->>BD: Atualiza laudo (status=rascunho)
    API->>UI: ✓ Salvo com sucesso
    UI->>R: 🟢 Toast: "Laudo salvo"
    UI->>UI: unsavedChanges=false
    
    Note over R,UI: Radiologista continua editando<br/>ou clica ENVIAR...
    
    R->>UI: 7. Clica ENVIAR ASSINATURA
    UI->>UI: Validações<br/>✓ descricao não vazia<br/>✓ conclusao não vazia<br/>✓ >= 100 chars
    UI->>API: PATCH /laudos/{id}<br/>{ status: AGUARDANDO_ASSINATURA_TECNICA }
    API->>BD: Atualiza estado<br/>Bloqueia edição
    API->>UI: ✓ Enviado com sucesso
    UI->>R: 🟢 Toast: "Laudo enviado para assinatura"
    UI->>UI: Editor ← disabled (readonly)
```

---

## 6. Ciclo de Assinatura – Tecnólogo

```mermaid
sequenceDiagram
    participant T as Tecnólogo
    participant UI as Interface React
    participant API as API Backend
    participant BD as Database
    
    T->>UI: 1. Acessa exame<br/>(estado: AGUARDANDO_ASSINATURA_TECNICA)
    UI->>API: GET /exams/{id}
    API->>UI: Carrega laudo redigido
    UI->>UI: Renderiza VIEWER (readonly)<br/>Renderiza LAUDO (readonly)
    UI->>T: ✓ Exame carregado
    
    T->>UI: 2. Visualiza laudo
    T->>UI: Revisa imagens (readonly)
    UI->>T: ✓ Todas ferramentas viewer readonlyT->>UI: 3. Clica ASSINAR TECNICAMENTE
    UI->>UI: Modal de confirmação<br/>"Você atesua a qualidade técnica?"
    UI->>T: [CONFIRMAR] [CANCELAR]
    
    T->>UI: 4. Confirma assinatura
    UI->>API: POST /laudos/{id}/signatures<br/>{ type: 'TECNICO',<br/>  userId: tech.id }<br/>
    API->>BD: Registra assinatura<br/>Atualiza estado → LAUDO_FINALIZADO
    API->>UI: ✓ Assinatura registrada
    UI->>T: 🟢 Toast: "Laudo assinado com sucesso"
    
    UI->>UI: Estado muda: LAUDO_FINALIZADO
    UI->>UI: Editor ← bloqueado (imutável)
    UI->>T: Opções agora:<br/>[VISUALIZAR] [IMPRIMIR]<br/>[HISTÓRICO DE VERSÕES]
```

---

## 7. Comparação – Fluxo de Interação

```mermaid
graph TB
    A["Radiologista Laudando<br/>(Exame 02/04/2026)"] -->|Clica COMPARAR| B["Modal: Selecionar exame<br/>para comparação"]
    
    B -->|Lista exames anteriores| C["18/03/2026 – RES. JOELHO<br/>35 séries<br/>05/01/2026 – RES. JOELHO<br/>40 séries"]
    
    C -->|Seleciona 18/03/2026<br/>Clica COMPARAR| D["Modo SIDE-BY-SIDE<br/>Ativa automaticamente"]
    
    D -->|Layout muda| E["┌─────────┬─────────┐<br/>│ ATUAL   │ ANTERIOR│<br/>│ 02/04   │ 18/03  │<br/>└─────────┴─────────┘"]
    
    E -->|Scroll em Atual| F["Sincronização<br/>Anterior também<br/>navega"]
    
    E -->|Clica em Anterior| G["Modal: Alternar para<br/>Modo OVERLAY?<br/>[SIM] [NÃO]"]
    
    G -->|SIM| H["┌────────────┐<br/>│ OVERLAY    │<br/>│ Atual      │<br/>│ + Anterior │<br/>│ Opacity: 60%<br/>└────────────┘"]
    
    H -->|Slider opacidade| I["Blending em<br/>tempo real"]
    
    E -->|Clica volta| J["Modo SIDE-BY-SIDE<br/>desativado<br/>Volta single view"]
    
    style A fill:#fff3e0
    style D fill:#c8e6c9
    style H fill:#bbdefb
    style J fill:#fff3e0
```

---

## 8. Arquitetura de Componentes React

```mermaid
graph TD
    App["🎯 App.tsx"]
    
    subgraph Layout ["Layout Principal"]
        Header["Header.tsx<br/>- Info paciente<br/>- Botões ação"]
        Grid["MainGrid.tsx<br/>- 3 colunas responsivas"]
    end
    
    subgraph Viewer ["Seção Viewer (60%)"]
        DicomViewer["DicomViewer.tsx<br/>- Canvas Cornerstone<br/>- Renderização DICOM"]
        Toolbox["Toolbox.tsx<br/>- Pan, Zoom, Medições<br/>- Anotações, Playback"]
        ImageControl["ImageControl.tsx<br/>- Window/Level<br/>- Zoom, Rotação"]
        Thumbnails["SeriesThumbnails.tsx<br/>- Seleção de série<br/>- Lazy loading"]
    end
    
    subgraph Lateral ["Painel Lateral (30%)"]
        PatientTab["PatientTab.tsx<br/>- Dados do paciente<br/>- Histórico exames"]
        TemplatesTab["TemplatesTab.tsx<br/>- Templates encontrados<br/>- Frases rápidas"]
        HistoryTab["HistoryTab.tsx<br/>- Versões do laudo<br/>- Assinaturas"]
    end
    
    subgraph Editor ["Editor (100%)"]
        LaudoEditor["LaudoEditor.tsx<br/>- Blocos estruturados<br/>- Rich text editing"]
        TemplateModal["TemplateInsertModal.tsx<br/>- Seleção de template"]
        SignatureSection["SignatureSection.tsx<br/>- Botões Submit"]
    end
    
    App --> Layout
    Layout --> Grid
    Grid --> Viewer
    Grid --> Lateral
    Grid --> Editor
    
    Viewer --> DicomViewer
    Viewer --> Toolbox
    Viewer --> ImageControl
    Viewer --> Thumbnails
    
    Lateral --> PatientTab
    Lateral --> TemplatesTab
    Lateral --> HistoryTab
    
    Editor --> LaudoEditor
    Editor --> TemplateModal
    Editor --> SignatureSection
    
    style App fill:#e3f2fd
    style Layout fill:#f3e5f5
    style Viewer fill:#fff9c4
    style Lateral fill:#f0f4c3
    style Editor fill:#fce4ec
```

---

## 9. Redux Store – State Structure

```mermaid
graph TB
    Store["🏪 Redux Store"]
    
    subgraph ExamState ["ExamState"]
        exam["exam: {<br/>  id, type, date,<br/>  patientId...<br/>}"]
        series["series: [{<br/>  uid, name,<br/>  imageCount...<br/>}]"]
    end
    
    subgraph ViewerState ["ViewerState"]
        activeSeries["activeSeries:<br/>DicomSeries | null"]
        imgIndex["activeImageIndex:<br/>number"]
        tools["viewerTools: {<br/>  activeTool,<br/>  windowLevel,<br/>  windowWidth,<br/>  zoom...<br/>}"]
    end
    
    subgraph ComparisonState ["ComparisonState"]
        compMode["comparisonMode:<br/>'none'|'side-by-side'<br/>|'overlay'"]
        compImages["comparisonSeries:<br/>DicomSeries | null"]
        opacity["comparisonOpacity:<br/>0-100"]
    end
    
    subgraph LaudoState ["LaudoState"]
        content["laudoContent: {<br/>  descricao,<br/>  conclusao,<br/>  recomendacoes<br/>}"]
        status["laudoStatus:<br/>LAUDANDO |<br/>AGUARDANDO_ASSINATURA"]
        modified["unsavedChanges:<br/>boolean"]
    end
    
    subgraph UIState ["UIState"]
        sideTab["sidebarTab:<br/>PACIENTE|TEMPLATES<br/>|HISTORICO"]
        playback["playback: {<br/>  isPlaying,<br/>  speed (1-30)<br/>}"]
    end
    
    Store --> ExamState
    Store --> ViewerState
    Store --> ComparisonState
    Store --> LaudoState
    Store --> UIState
    
    style Store fill:#2196f3,color:#fff
    style ExamState fill:#81c784
    style ViewerState fill:#ffd54f
    style ComparisonState fill:#64b5f6
    style LaudoState fill:#ce93d8
    style UIState fill:#ffab91
```

---

## 10. Fluxo de Captura Imagem → Inserir no Laudo

```mermaid
sequenceDiagram
    participant R as Radiologista
    participant V as Viewer
    participant UI as Modal/Editor
    participant A as API
    
    R->>V: Faz medição importante
    V->>V: Desenha linha 15mm
    V->>R: ✓ Medição visível na imagem
    
    R->>V: Clica [➕ Capturar Laudo]
    V->>UI: Abre modal de confirmação
    V->>UI: Preview: Imagem + medição
    UI->>R: "Inserir em qual bloco?<br/>[DESCRIÇÃO] [CONCLUSÃO]<br/>[RECOMENDAÇÕES]"
    
    R->>UI: Seleciona DESCRIÇÃO
    UI->>A: POST /images/capture<br/>{ canvasData, measured }
    A->>A: Localiza imagem<br/>Salva PNG temporário
    A->>UI: ✓ URL: /temp-images/fig-001.png
    
    UI->>UI: Fecha modal
    UI->>UI: Editor focus em DESCRIÇÃO
    UI->>UI: Insere markdown:<br/>"![Fig. 1 - Medição...](url)"
    
    R->>UI: Vê imagem inserida no editor
    R->>UI: Continua digitando abaixo da imagem
    
    R->>UI: Clica SALVAR
    A->>A: Persiste laudo + referência imagem
    UI->>R: ✓ Laudo salvo com figura
    
    Note over R,A: Quando finalizar e assinar,<br/>imagens temporárias<br/>são movidas para persistent storage
```

---

## 11. Matriz de Permissões – Por Perfil

```mermaid
graph TB
    subgraph Radiologista ["👨‍⚕️ RADIOLOGISTA"]
        R1["✅ Visualizar DICOM<br/>+ Todas ferramentas"]
        R2["✅ Editar laudo<br/>(criar rascunhos)"]
        R3["✅ Comparar com exames<br/>anteriores"]
        R4["✅ Enviar para<br/>assinatura técnica"]
        R5["❌ Assinar tecnicamente<br/>❌ Editar Laudo Finalizado"]
    end
    
    subgraph Tecnologo ["👨‍💼 TECNÓLOGO"]
        T1["✅ Visualizar DICOM<br/>(readonly)"]
        T2["❌ Editar laudo"]
        T3["✅ Assinar<br/>tecnicamente"]
        T4["✅ Acessar histórico<br/>de suas execuções"]
        T5["❌ Comparar<br/>❌ Navegar livremente exames"]
    end
    
    subgraph Medico ["🩺 MÉDICO REQUISITANTE"]
        M1["✅ Ver resultado<br/>finalizado"]
        M2["✅ Download PDF"]
        M3["❌ Editar ou<br/>redigir laudo"]
        M4["❌ Acessar rascunhos"]
        M5["❌ Visualizar DICOM<br/>com ferramentas"]
    end
    
    subgraph Admin ["🛡️ ADMIN"]
        A1["✅ Gerenciar usuários<br/>e permissões"]
        A2["✅ Auditoria<br/>completa"]
        A3["✅ Acesso a todos<br/>os laudos"]
        A4["❌ Não redigir laudos<br/>(segregação)"]
    end
    
    style Radiologista fill:#c8e6c9
    style Tecnologo fill:#fff9c4
    style Medico fill:#bbdefb
    style Admin fill:#f0f4c3
```

---

## 12. Performance – Estratégia de Carregamento

```mermaid
graph LR
    A["Radiologista abre<br/>exame"] -->B["1. Renderizar<br/>primeira imagem<br/>(< 1s)"]
    
    B -->|Background| C["2. Baixar série<br/>completa<br/>(3-10s)"]
    
    B -->|Enquanto carrega| D["3. Exibir skeleton<br/>com barras progresso"]
    
    C -->|Conforme chega| E["4. Cache em memória<br/>(últimas 3 séries)"]
    
    E -->F["5. Renderizar conforme<br/>usuario navega"]
    
    A -->|Paralelo| G["Fetch paciente data<br/>Templates<br/>Histórico de versões"]
    
    G -->|Paralelo| H["Fetch exames anteriores<br/>(apenas metadata)"]
    
    style A fill:#fff
    style B fill:#c8e6c9
    style C fill:#fff9c4
    style D fill:#bbdefb
    style E fill:#ffe0b2
    style F fill:#f0f4c3
```

---

## 13. Tratamento de Erros – Fluxo

```mermaid
stateDiagram-v2
    [*] --> Operacao
    
    Operacao --> Validacao
    
    Validacao -->|✗ Falha| ErroUI
    
    ErroUI -->|Toast mostrado| Recuperacao1
    
    Validacao -->|✓ OK| API
    
    API -->|✗ Erro| ErroAPI
    
    ErroAPI -->|Retry automático| API
    
    ErroAPI -->|Falhas > 3x| ErrorModal
    
    ErrorModal -->|Retry manual| API
    
    ErrorModal -->|Cancelar| Recuperacao2
    
    API -->|✓ OK| Sucesso
    
    Sucesso --> ToastSuccess: Exibir feedback
    
    ToastSuccess --> [*]
    
    Recuperacao1 -->|Usuário corrige| Operacao
    
    Recuperacao2 -->|Estado revertido| Operacao
    
    note right of ErroUI
        Toast: "Campo obrigatório"
        Toast: "Falha ao carregar série"
    end note
    
    note right of ErrorModal
        UI amigável
        Descrição do problema
        Opção de retry e fallback
    end note
```

---

## 14. Timeline – Roadmap de Desenvolvimento

```mermaid
gantt
    title Desenvolvimento OmniLaudo Frontend – Laudo & Viewer
    
    section Sprint 1: MVP Básico
    Setup & Tooling           :s1_1, 2026-04-03, 5d
    Componente DicomViewer    :s1_2, 2026-04-06, 7d
    Componente LaudoEditor    :s1_3, 2026-04-10, 7d
    Redux Setup               :s1_4, 2026-04-12, 3d
    API Integration           :s1_5, 2026-04-15, 5d
    
    section Sprint 2: Ferramentas
    Medições & Anotações      :s2_1, 2026-04-20, 7d
    Playback/Sequenciamento   :s2_2, 2026-04-24, 5d
    Exportar Imagens          :s2_3, 2026-04-27, 3d
    
    section Sprint 3: Avançado
    Comparação Side-by-Side   :s3_1, 2026-05-01, 7d
    Comparação Overlay        :s3_2, 2026-05-05, 5d
    Assinatura Técnica        :s3_3, 2026-05-08, 7d
    Versionamento             :s3_4, 2026-05-12, 5d
    
    section Sprint 4: Polish
    Responsividade            :s4_1, 2026-05-15, 5d
    Testes (Unit + E2E)       :s4_2, 2026-05-18, 10d
    Performance Optimization  :s4_3, 2026-05-25, 5d
    Acessibilidade (WCAG)     :s4_4, 2026-05-28, 5d
    
    section Release
    QA & Testing              :rel_1, 2026-06-02, 5d
    Deploy Staging            :rel_2, 2026-06-07, 3d
    Launch Production         :rel_3, 2026-06-10, 1d
```

---

## 15. Checklist – Antes de Iniciar Desenvolvimento

### Fase Preparatória

```
□ Design System / UI Kit definido
  - Cores, tipografia, componentes base
  - Tokens (spacings, radius, shadows)

□ Prototipo em Figma/Adobe XD
  - Todos os estados da UI
  - Interações mouse/teclado
  - Responsive (desktop, tablet)

□ Ambiente de Desenvolvimento
  - Node.js + npm/yarn
  - TypeScript config
  - ESLint + Prettier
  - Jest + React Testing Library

□ Backend APIs Documentadas
  - Endpoints para exames, séries, laudos
  - Autenticação JWT
  - Tratamento de erros

□ Integração DICOM
  - Cornerstone.js versionado
  - Orthanc API disponível
  - CORS configurado

□ Performance Baseline
  - Benchmark: carregamento série < 3s
  - Memory profiling Cornerstone
  - Network throttling tests

□ Segurança
  - CSP headers configurados
  - XSS prevention
  - Input validation

□ Observabilidade
  - Logger setup (Pino/loglevel)
  - Error tracking (Sentry)
  - Analytics events
```

---

## 🎯 Conclusão

Estes diagramas complementam a especificação textual, fornecendo:

✅ **Visualização clara** dos fluxos de trabalho  
✅ **Sequência de ações** e interações  
✅ **Arquitetura de componentes** React  
✅ **Estrutura de estado** global  
✅ **Permissões e segurança** por perfil  
✅ **Timeline realista** de desenvolvimento  

Use este documento como referência durante:
- Prototipagem em Figma
- Code review com time
- Testing e QA
- Documentação de API
