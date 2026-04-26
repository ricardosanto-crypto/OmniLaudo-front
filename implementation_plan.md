# OmniLaudo — Análise de Gap & Plano de Prototipação

## Visão Geral

Este documento compara o **estado atual** do frontend + backend OmniLaudo com os **7 protótipos de design** e a **especificação dashboard-spec.docx** para identificar tudo o que falta implementar.

---

## 1. Resumo do Estado Atual vs. Protótipos

### Frontend Atual

| Área | O que existe | Status |
|------|-------------|--------|
| **Login** | Formulário e hero split-screen | ✅ Refatorado (Fase 1) |
| **Esqueci Senha** | Página dedicada isolada | ✅ Refatorado (Fase 1) |
| **Dashboard** | 4 KPIs básicos + gráfico de barras semanal | ⚠️ MVP — falta 90% do spec |
| **Header/Nav** | Navbar simples com links + avatar + logout | ⚠️ Funcional mas sem busca global, filtros, notificações |
| **Worklist Técnico** | Existe (lazy loaded) | ⚠️ Sem drawer lateral, sem alertas, sem status DICOM |
| **Worklist Médico** | Existe (lazy loaded) | ⚠️ Sem hierarquia de urgência, sem badges pulsantes |
| **Workspace Médico** | Existe (OHIF/Cornerstone viewer) | ✅ Parcial — base funcional |
| **Agendamento** | Página existe (Cockpit por Sala) | ❌ Não existe — é uma lista/tabela simples |
| **Cadastro Paciente** | Página existe | ⚠️ Sem wizard de 4 passos, sem duplicatas, sem convenio |
| **Configurações** | Página existe (CRUD de itens) | ⚠️ Sem layout lateral (sidebar + painel), sem sessões ativas |
| **Visualizador DICOM** | Cornerstone.js integrado | ⚠️ Sem comparação side-by-side, sem sugestões IA |

### Backend Atual

| Recurso | Endpoint | Status |
|---------|----------|--------|
| Auth (login/validate) | `POST /auth/login`, `GET /auth/validate` | ✅ OK |
| Dashboard Stats | `GET /dashboard/me` | ⚠️ Retorna apenas 5 campos básicos |
| Agendamentos CRUD | `GET/POST /agendamentos`, `PATCH /{id}/status` | ✅ Parcial |
| Pacientes CRUD | Full CRUD | ✅ OK |
| Laudos | Full workflow (salvar, assinar, homologar, finalizar, retificar) | ✅ OK |
| Worklist DICOM | `GET /worklist`, `POST /ris/study_ready` | ✅ OK |
| Equipamentos CRUD | Full CRUD | ✅ OK |
| Salas CRUD | Full CRUD | ✅ OK |
| Unidades CRUD | Full CRUD | ✅ OK |
| Usuários CRUD | Full CRUD | ✅ OK |
| Auditoria | `GET /auditoria` | ✅ OK |
| Orçamentos | `GET /orcamentos`, `GET /{id}` | ⚠️ Somente leitura |
| Estudos DICOM | CRUD + por agendamento | ✅ OK |
| DICOM Proxy | Preview, download, séries, upload, archive | ✅ OK |
| Pedidos Médicos | `GET/POST /pedidos-medicos` | ✅ OK |
| **Alertas de Exceção** | — | ❌ **NÃO EXISTE** |
| **Health Check PACS** | — | ❌ **NÃO EXISTE** |
| **Perf. Radiologista** | — | ❌ **NÃO EXISTE** |
| **Dashboard filtrado** | — | ❌ **NÃO EXISTE** |
| **Tempo de espera** | — | ❌ **NÃO EXISTE** |

---

## 2. Gap Detalhado — Frontend (Protótipos vs. Atual)

### 2.1 LOGIN E AUTENTICAÇÃO

✅ **Status**: Refatorado (Fase 1 entregue). Layout split-screen implementado, com branding exclusivo OmniLaudo e página própria de recuperação de senha. Funcionalidades adicionais (seletor de clínica) adiadas.

### 2.2 DASHBOARD (Protótipo + Spec)

> [!CAUTION]
> O dashboard atual é um **MVP simplificado** com 4 KPIs e 1 gráfico. O spec exige **5 layouts diferentes** por perfil com ~25 componentes modulares.

| Componente do Spec | Prioridade | Status |
|-------------------|------------|--------|
| **7 KPIs c/ sparkline** (SUPERADMIN) | 🔴 Alta | ❌ Faltam TAT Médio, TAT Crítico, No-show%, Ocupação Salas |
| **Switcher de Contexto** (abas por perfil) | 🔴 Alta | ❌ Não existe |
| **Gráfico Throughput por Hora** (barras agrupadas) | 🔴 Alta | ❌ Atual é semanal, spec pede horário |
| **Tabela Fila por Modalidade** | 🔴 Alta | ❌ Não existe |
| **Card Status das Unidades** | 🟡 Média | ❌ Não existe |
| **Coluna Alertas de Exceção** | 🔴 Alta | ❌ Não existe (backend também) |
| **Feed de Eventos do Sistema** | 🟡 Média | ❌ Não existe |
| **Card "Minha Fila de Laudos"** (Médico) | 🔴 Alta | ⚠️ Parcial (existe worklist-medico) |
| **4 KPIs pessoais do Médico** | 🔴 Alta | ❌ Faltam (Meu TAT, Urgências Ativas) |
| **Card Atividade Recente** (Médico) | 🟡 Média | ❌ Não existe |
| **Card "Minha Worklist"** (Tecnólogo) | 🟡 Média | ⚠️ Parcial |
| **Card Status DICOM/PACS** (Tecnólogo) | 🟡 Média | ❌ Não existe |
| **Card "Pacientes em Preparo"** | 🟡 Média | ❌ Não existe |
| **Card "Pacientes de Hoje"** (Recepção) | 🟡 Média | ❌ Não existe |
| **Card "Pendências de Convênio"** | 🟢 Baixa | ❌ Não existe |
| **Card "Ações Rápidas"** (Recepção) | 🟡 Média | ❌ Não existe |
| **Card Performance por Radiologista** (Admin) | 🟡 Média | ❌ Não existe |
| **Filtro global de Unidade** (Header) | 🔴 Alta | ❌ Não existe |
| **Filtro global de Data** (Header) | 🔴 Alta | ❌ Não existe |
| **Busca global (Ctrl+K)** | 🟡 Média | ❌ Não existe |
| **Badge de Notificações** | 🟡 Média | ❌ Não existe |
| **Personalizar Dashboard** (multi-perfil) | 🟢 Baixa | ❌ Não existe |

### 2.3 WORKLIST (Protótipo vs. Atual)

| Elemento | Status |
|----------|--------|
| Abas de status (Aguardando check-in, Aguardando preparo, Em sala, etc.) | ❌ |
| Painel lateral (drawer 40%) com detalhes do paciente ao clicar | ❌ |
| Alertas Críticos (alergia a contraste, função renal) | ❌ |
| Dados clínicos relevantes (peso, altura, IMC, creatinina) | ❌ |
| Protocolo sugerido (kVp, Pitch, Espessura, etc.) | ❌ |
| Filtros (Modalidade, Sala, Prioridade) | ⚠️ Parcial |
| Badges de prioridade (URGÊNCIA / EMERGÊNCIA / ELETIVO) | ❌ |
| Trocar sala | ❌ |

### 2.4 AGENDAMENTO — Cockpit por Sala (Protótipo)

> [!IMPORTANT]
> Esta é uma **tela completamente nova**. O protótipo mostra um calendário visual tipo timeline/Gantt por sala com:

| Elemento | Status |
|----------|--------|
| Timeline visual por hora (07:00-19:00) | ❌ Completamente novo |
| Salas como linhas (TC-01, TC-02, RM-01, etc.) | ❌ |
| Blocos coloridos por exame | ❌ |
| Indicador de horário atual (linha vermelha) | ❌ |
| Drawer lateral com detalhes do agendamento | ❌ |
| Botões "Realizar Check-in", "Reagendar" | ❌ |
| Integração DICOM (MWL Confirmado badge) | ❌ |
| Histórico do agendamento (timeline) | ❌ |
| Filtros: Unidade, Modalidade, Data | ❌ |
| Botões "Bloquear horário", "Novo agendamento" | ❌ |

### 2.5 CADASTRO PACIENTE (Protótipo)

| Elemento | Status |
|----------|--------|
| Wizard de 4 passos (Identificação → Contato → Convênio → Anamnese) | ❌ |
| Detecção de duplicatas (sidebar com % de match) | ❌ |
| Botões "Mesclar" / "Diferente" | ❌ |
| Checklist de validação (CPF válido, convênio ativo, CNS) | ❌ |
| Auto-save de rascunho | ❌ |
| Campo de convênio/plano/acomodação | ⚠️ Não existe no backend |
| Validação de elegibilidade | ❌ |

### 2.6 CONFIGURAÇÕES (Protótipo)

| Elemento | Status |
|----------|--------|
| Sidebar de navegação (Organização / Usuários / Clínico / Integrações) | ❌ |
| Tabela de usuários com filtros (Perfil, Unidade, Status) | ⚠️ Parcial |
| Painel lateral com detalhes do usuário | ❌ |
| Sessões Ativas (IP, browser, localização) | ❌ |
| Permissões efetivas | ❌ |
| Tabs (Resumo, Sessões ativas, Permissões, Auditoria) | ❌ |
| Importar CSV | ❌ |
| Convite de usuário (botão "Convidar") | ❌ |

### 2.7 VISUALIZADOR DICOM (Protótipo)

| Elemento | Status |
|----------|--------|
| Viewer DICOM base (Cornerstone.js) | ✅ Existe |
| Lista de estudos anteriores do paciente | ❌ |
| Lista de séries com thumbnail e contagem | ⚠️ Parcial |
| Editor de laudo integrado (lado direito) | ⚠️ Parcial |
| Seletor de modelo de laudo | ⚠️ Parcial |
| Sugestões da IA Assistente | ❌ |
| Comparação com estudo anterior | ❌ |
| Barra de ferramentas avançada (MPR, medição, etc.) | ⚠️ Parcial |
| Tempo de leitura | ❌ |
| Botão "Próximo da fila" | ❌ |

---

## 3. Gap Detalhado — Backend

### 3.1 Endpoints Faltantes (conforme Tabela 16 do spec)

| # | Endpoint | Descrição | Impacto |
|---|----------|-----------|---------|
| 1 | `GET /api/v1/alertas?unidade=:id` | Alertas de exceção em tempo real | 🔴 Dashboard SUPERADMIN/ADMIN |
| 2 | `GET /api/v1/unidades/:id/health` | Uptime do PACS por unidade (consulta Orthanc) | 🔴 Card Status Unidades |
| 3 | `GET /api/v1/dashboard/radiologistas` | Performance agrupada por médico | 🟡 Card exclusivo ADMIN |
| 4 | `GET /api/v1/dashboard/me?unidadeId=:id` | Dashboard filtrado por unidade | 🔴 Filtro global |
| 5 | `GET /api/v1/agendamentos/espera` | Tempo de espera no saguão | 🟡 KPI Recepcionista |

### 3.2 Expansão do `DashboardStatsDTO` Necessária

O DTO atual retorna apenas 5 campos. O spec exige **7 KPIs + gráfico por hora + fila por modalidade**:

```diff
 public class DashboardStatsDTO {
     private long agendamentosHoje;
     private long examesEmEspera;
     private long backlogLaudos;
     private long laudadosHoje;
     private long canceladosHoje;
+    private String tatMedio;          // "2h 15m" — tempo médio REALIZADO → LAUDADO
+    private String tatCritico;        // P95 do TAT
+    private double noShowPercentual;  // canceladosHoje / agendamentosHoje * 100
+    private double ocupacaoSalas;     // exames em execução / capacidade * 100
+    private List<FilaModalidadeDTO> filasPorModalidade;
+    private List<ThroughputHoraDTO> throughputPorHora;
     private List<GraficoBarraDTO> historicoSemanal;
 }

+public class FilaModalidadeDTO {
+    private String modalidade;  // RM, TC, US, RX, MMG
+    private long agendados;
+    private long emExecucao;
+    private long aguardandoLaudo;
+    private long slaRisco;
+}

+public class ThroughputHoraDTO {
+    private String hora;  // "06:00", "07:00", etc.
+    private Map<String, Long> porModalidade; // {TC: 5, RM: 3, ...}
+}
```

### 3.3 Campos Faltantes nas Entidades

| Entidade | Campo Faltante | Necessário Para |
|----------|---------------|-----------------|
| `Agendamento` | `urgenciaPedido` (enum) direto | Ordenação da fila do médico |
| `Agendamento` | `tempoEsperaSaguao` (computed) | KPI Recepcionista |
| `Paciente` | `convenio`, `plano`, `acomodacao`, `titularidade` | Tela de cadastro |
| `Paciente` | `cns`, `peso`, `altura` | Dados clínicos |
| `Unidade` | `orthancUrl`, `orthancUser`, `orthancPassword` | Health check por unidade |
| `Usuario` | `fotoUrl`, `especialidade` | Header + Cards |

### 3.4 Entidade `Alerta` — Nova (Necessária)

```java
@Entity
@Table(name = "alertas")
public class Alerta {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Enumerated(EnumType.STRING)
    private SeveridadeAlerta severidade; // CRITICO, ATENCAO, INFORMATIVO
    
    private String titulo;      // "Falha DICOM C-STORE"
    private String descricao;   // "Exame #98124 travado há 15m"
    private String tipo;        // CONTRASTE_EXTRAVASADO, FALHA_DICOM, SLA_ESTOURADO, etc.
    
    @ManyToOne private Unidade unidade;
    private boolean resolvido;
    private Instant criadoEm;
    private Instant resolvidoEm;
}
```

---

## 4. Gap — Componentes Globais Reutilizáveis (Spec Seção 9)

| Componente | Status |
|-----------|--------|
| **Header Global** com busca Ctrl+K, filtro unidade, filtro data, badge notificações | ❌ Redesenho |
| **Card KPI Padrão** (90px, sparkline, variação vs. ontem) | ❌ Novo componente |
| **Badge de Status** (AGENDADO=cinza, EM_ATENDIMENTO=azul, etc.) | ❌ Novo componente |
| **Badge de Urgência** (EMERGENCIA=vermelho pulsante, URGENTE=âmbar) | ❌ Novo componente |
| **Badge de Modalidade** (RM=azul escuro, TC=verde, etc. com cores fixas) | ❌ Novo componente |
| **Drawer** (painel lateral 40%, fundo escurecido) | ❌ Novo componente |
| **Skeleton Loader** por card (não spinner genérico) | ⚠️ Existe Skeleton base |

---

## 5. Plano de Implementação Proposto

### Fase 1 — Tela de Login & Fundação [✅ CONCLUÍDA]

- [x] Redesenho total do Login (split-screen).
- [x] Criação da página "Esqueci minha senha".
- [x] Definição de tokens no Tailwind e ajustes básicos.

---

### Fase 2 — Dashboard Modular por Perfil (Core da Spec)

#### Backend:
- [ ] Expandir `DashboardStatsDTO` com TAT, No-show, Ocupação, Fila por Modalidade, Throughput por hora
- [ ] Criar entidade `Alerta` + `AlertaRepository` + `AlertaService`
- [ ] Criar `GET /api/v1/alertas`
- [ ] Criar `GET /api/v1/unidades/{id}/health` (health check Orthanc)
- [ ] Criar `GET /api/v1/dashboard/radiologistas`
- [ ] Adicionar filtro `?unidadeId=` ao endpoint `/dashboard/me`

#### Frontend:
- [ ] Criar `<DashboardSuperAdmin>` com 7 KPIs + Throughput + Fila Modalidade + Status Unidades + Alertas
- [ ] Criar `<DashboardAdmin>` (SUPERADMIN sem card unidades + Performance Radiologista)
- [ ] Criar `<DashboardMedico>` com Minha Fila + KPIs pessoais + Atividade Recente
- [ ] Criar `<DashboardTecnologo>` com Worklist + Status DICOM + Pacientes em Preparo
- [ ] Criar `<DashboardAtendente>` com Pacientes de Hoje + Pendências + Ações Rápidas
- [ ] Implementar `<ContextSwitcher>` (tabs por perfil com smart default)
- [ ] Integrar no `/` com lógica de montagem baseada em `user.roles`

---

### Fase 3 — Telas Principais (Worklist, Agendamento, Pacientes, Configurações)

- [ ] **Worklist Técnico**: Abas de status + Drawer lateral + Alertas clínicos + Protocolo sugerido
- [ ] **Worklist Médico**: Fila com hierarquia de urgência + badges pulsantes + botão LAUDAR
- [ ] **Agendamento Cockpit**: Timeline visual por sala (tipo Gantt) — componente novo completo
- [ ] **Cadastro Paciente**: Wizard 4 passos + detecção duplicatas + validação
- [ ] **Configurações**: Sidebar + tabela com drawer lateral + sessões ativas

---

### Fase 4 — Polish &UX

- [ ] Responsividade tablet/mobile conforme spec seção 12
- [ ] Estados de carregamento (Skeleton loaders por card)
- [ ] Estados de erro com "Tentar novamente"

---

## 6. Diretrizes e Decisões Tomadas (Open Questions Resolvidas)

* **Branding:** Decidido uso exclusivo de "OmniLaudo" (sem sufixos AI ou RadCore).
* **Fluxos de Worklist:** As telas de `/worklist` (Tecnólogo) e `/worklist-medico` (Médico) permanecerão sendo telas **isoladas e independentes**. O dashboard apresentará apenas um *card de resumo* com atalho para estas páginas.
* **Complexidade de Convênios:** Para o Cadastro de Paciente, o sistema atenderá demandas locais mais simples; a integração complexa de autorizações TUSS e múltiplos convênios estruturados foi simplificada por enquanto.
* **Tempo Real (Websockets):** Implementação de SSE/Websockets foi **postergada** para o futuro. O foco inicial será a construção e apresentação estática (com refresh/polling leve).
* **Seletor de Clínicas no Login:** Funcionalidade postergada para futuras iterações (para médicos com atuação multi-clínica).
