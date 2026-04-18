# 📄 PRD – Sistema RIS + PACS com IA (OmniLaudo AI)

## 1. Visão Geral

**Nome do sistema:** OmniLaudo AI

**Objetivo:**  
Plataforma completa de gestão de exames de imagem (RIS) integrada a PACS, com suporte a DICOM e inteligência artificial para auxílio na elaboração de laudos radiológicos. A solução cobre desde o agendamento até a entrega do laudo, garantindo rastreabilidade, eficiência operacional e padronização.

## 2. Problema

- **Falta de integração** entre agenda, execução do exame, PACS e laudo.
- **Retrabalho manual** na coleta de dados e reconciliação de imagens.
- **Baixa produtividade** dos radiologistas devido à ausência de ferramentas inteligentes.
- **Dificuldade de gestão** de equipamentos, horários e fluxo de pacientes.
- **Ausência de padronização** nos laudos e nos processos.
- **Visualização limitada** que dificulta a comparação com exames anteriores e a análise dinâmica das imagens.

## 3. Público‑alvo

- Clínicas de diagnóstico por imagem
- Hospitais
- Médicos radiologistas
- Técnicos em radiologia (tecnólogos)
- Equipes de recepção e atendimento
- Administradores de TI e gestores clínicos

## 4. Objetivos

- Integrar ponta a ponta: **pedido → agenda → orçamento → check‑in → execução → PACS → laudo → entrega**.
- Reduzir erros operacionais e conflitos de agendamento.
- Aumentar a produtividade dos radiologistas com IA e templates.
- Garantir conformidade com padrões DICOM e boas práticas de integração.
- Oferecer trilha de auditoria completa e segurança conforme LGPD.
- **Estabelecer responsabilidades claras** por meio da assinatura técnica (tecnólogo) e co‑assinatura médica.
- **Acelerar a criação de laudos** com o uso de templates e frases padronizadas.
- **Potencializar a análise diagnóstica** com ferramentas avançadas de visualização, incluindo comparação com exames anteriores e sequenciamento dinâmico.

---

## 5. Funcionalidades (Requisitos Funcionais)

### 5.1 Gestão de Pacientes
- Cadastro completo (dados pessoais, contato, convênio, etc.)
- Histórico de exames
- Vinculação automática a pedidos médicos e agendamentos

### 5.2 Agenda de Exames
- Agendamento a partir de pedido médico
- Seleção de:
  - Data e horário
  - Médico disponível
  - Equipamento (RX, Tomografia, Ressonância, etc.)
- Controle de conflitos (médico e equipamento)
- Remarcação e cancelamento
- Gestão de fila de espera

### 5.3 Orçamento e Aprovação
- Geração automática de orçamento baseado no exame
- Status: *aprovado*, *reprovado*, *pendente*
- (Futuro) vínculo com convênios e autorização online

### 5.4 Check‑in e Confirmação
- Registro de chegada do paciente
- Liberação do exame para realização
- Impressão de pulseira / etiqueta (opcional)

### 5.5 Execução do Exame
- Envio automático dos dados para o equipamento via **DICOM MWL (Worklist)**
- Associação paciente + exame + equipamento
- Registro da realização e geração de imagens
- Atualização do estado do exame

### 5.6 Integração com PACS (Orthanc)
- Envio automático das imagens via **DICOM C‑STORE**
- Armazenamento estruturado (Study / Series)
- Organização por paciente, estudo e série
- Sincronização com o Orthanc via sua **REST API**

### 5.7 Visualizador DICOM – Ferramentas Avançadas
O visualizador web oferecerá um conjunto completo de ferramentas para análise de imagens, com foco em usabilidade e precisão diagnóstica.

#### 5.7.1 Funcionalidades Básicas
- Zoom, pan, rotação, flip (horizontal/vertical)
- Ajuste de janela (window width/level) manual e predefinidos
- Ferramentas de medição:
  - Comprimento
  - Ângulo
  - Área (poligonal, elipse)
  - ROI (Região de Interesse) com estatísticas básicas (média, desvio)
- Anotações (texto livre, setas, formas)

#### 5.7.2 Comparação com Exames Anteriores
- Exibição simultânea de até 2 estudos (exame atual vs. exame anterior)
- Modos de visualização:
  - **Lado a lado** (side-by-side) com sincronização de navegação (scroll sincronizado)
  - **Sobreposição** (overlay) com opacidade ajustável
- Seleção de qualquer exame anterior do mesmo paciente (por modalidade, data, região anatômica)
- Destaque visual da data e tipo do exame comparado

#### 5.7.3 Sequenciamento (Playback)
- Navegação automática pelas imagens de uma série (modo "play")
- Controles: play/pause, velocidade ajustável, direção (forward/backward)
- Loop contínuo ou único ciclo
- Útil para estudos dinâmicos (ex.: ressonância cardíaca, angiografia)

#### 5.7.4 Ferramentas Adicionais
- **MIP (Maximum Intensity Projection)** para estudos de angio
- **Reconstrução multiplanar (MPR)** básica para tomografia (futuro)
- **Exportação de imagens** (PNG, JPEG, DICOM)
- **Sincronização com laudo:** captura de imagem/anotação diretamente para o laudo

### 5.8 Laudos Médicos
- Editor de laudo com rascunho e versionamento
- **Templates e frases prontas:**  
  - Biblioteca de templates por tipo de exame (ex.: “Ressonância de Joelho”, “Tomografia de Tórax”)  
  - Frases padronizadas (ex.: “Sem alterações significativas”, “Processo inflamatório em...”)
  - Personalização por clínica/médico
  - Inserção rápida via atalhos ou busca textual
- **Assinatura do técnico (tecnólogo):** registro de quem realizou o exame e atestou a qualidade técnica
- **Co‑assinatura do médico radiologista:** assinatura digital do laudo, com registro de data/hora
- Laudo finalizado não pode ser alterado; qualquer revisão exige novo versionamento
- Visualização do histórico de versões com identificação dos signatários

### 5.9 IA para Laudos
- **Sugestão automática** de conteúdo baseado no tipo de exame e imagens (modelos treinados)
- **Correção de texto** e padronização de nomenclatura
- **Templates inteligentes** que se adaptam ao contexto (integração com a biblioteca de templates)
- (Futuro) extração automática de achados das imagens

### 5.10 Entrega de Resultados
- Download do laudo em PDF (com as duas assinaturas visíveis)
- Impressão direta
- (Futuro) Portal do paciente com acesso online

### 5.11 Gestão de Usuários e Perfis
- Controle por perfil: recepcionista, **tecnólogo**, radiologista, administrador, gestor
- Autenticação com JWT / OAuth2
- Trilha de auditoria de todas as ações

---

## 6. Estados do Exame

O exame percorre os seguintes estados, garantindo rastreabilidade total:

| Estado | Descrição |
|--------|-----------|
| **AGENDADO** | Exame agendado, aguardando check‑in |
| **AGUARDANDO_ATENDIMENTO** | Paciente aguardando sua vez para ser chamado |
| **EM_ATENDIMENTO** | Paciente confirmado, exame liberado para execução |
| **AGUARDANDO_LAUDO** | Imagens disponíveis, laudo ainda não iniciado |
| **LAUDADO** | Radiologista conclui laudo 
| **LAUDO_ASSINADO** | Laudo assinado pelo técnico e pelo médico, disponível para entrega |

---

## 7. Regras de Negócio

### Agenda
- Não pode haver conflito de horário para médico ou equipamento.
- O exame só pode ser agendado se houver pedido médico válido.

### Orçamento
- O exame só pode ser realizado se o orçamento estiver aprovado (ou isento).

### Check‑in
- Exame só pode passar para *EM_ATENDIMENTO* após check‑in.

### Execução e DICOM
- Todo exame deve gerar um **AccessionNumber** único.
- O envio para Worklist deve ocorrer imediatamente após o agendamento.
- As imagens recebidas devem ser vinculadas automaticamente ao exame usando *StudyInstanceUID* e *AccessionNumber*.
- Deve existir reconciliação manual para casos de falha na vinculação automática.

### Laudos e Assinaturas
- Apenas **tecnólogos** (perfil técnico) podem realizar a **assinatura técnica**, atestando a correta execução e qualidade do exame.
- Apenas **médicos radiologistas** podem realizar a **co‑assinatura médica**, validando o laudo.
- Um exame só é considerado **finalizado** após ambas as assinaturas (quando a política da instituição exigir ambas).
- Laudo assinado não pode ser alterado; qualquer revisão exige um novo versionamento, com novas assinaturas.
- Um exame pode ter apenas **um laudo final**, mas pode ter rascunhos intermediários.

### Visualização e Comparação
- Apenas exames do mesmo paciente podem ser comparados.
- Acesso a exames anteriores respeita as permissões de perfil (ex.: radiologista pode visualizar todos, técnico apenas os que executou).
- O sistema deve garantir a confidencialidade durante a exibição simultânea.

### PACS
- Todo exame realizado deve ser enviado ao PACS (Orthanc).
- A estrutura DICOM (Study / Series) deve ser respeitada.

### Segurança
- Autenticação obrigatória para qualquer acesso.
- Controle por perfil.
- Auditoria completa de criação, leitura, atualização e exclusão.

---

## 8. Requisitos Não Funcionais

- **Performance:**  
  - Suporte a múltiplos exames simultâneos.  
  - Carregamento de imagens DICOM em menos de 3 segundos.  
  - Navegação fluida (playback) com no mínimo 30 fps para séries comuns.

- **Escalabilidade:**  
  - Arquitetura baseada em containers (Docker).  
  - Preparado para cloud (Kubernetes no futuro).

- **Disponibilidade:**  
  - 99,5% de uptime para operações críticas.

- **Qualidade:**  
  - Testes automatizados (unitários, integração, e2e).  
  - Logs estruturados e monitoramento (Prometheus, Grafana).

---

## 9. Modelo de Dados (Entidades Principais)

- **User** – usuários do sistema (recepcionista, tecnólogo, médico, admin)
- **Patient** – dados cadastrais do paciente
- **MedicalOrder** – pedido médico recebido
- **Appointment** – agendamento do exame
- **Equipment** – equipamento utilizado (RX, CT, etc.)
- **Budget** – orçamento e aprovação
- **Exam** – representa a ocorrência do exame (estado, datas, vínculos)
- **DicomStudy** – dados do estudo DICOM (StudyInstanceUID, AccessionNumber)
- **DicomSeries** – séries do estudo
- **Report** – laudo (versões, autor, data assinatura)
- **Signature** – registro das assinaturas (tipo: técnica ou médica, usuário, data/hora, versão do laudo)
- **Template** – templates de laudo (título, conteúdo, tipo de exame associado, usuário criador, compartilhamento)
- **Phrase** – frases padronizadas (texto, atalho, categoria, usuário criador)
- **AuditLog** – log de todas as ações

---

## 10. Arquitetura (Visão Inicial)
Frontend (React) → API Gateway (Spring Boot) → Serviços
↓
Banco PostgreSQL
↓
Orthanc (PACS) ←→ Equipamentos DICOM


- **Backend:** Spring Boot, REST API, integração DICOM (dcm4che, ou cliente Orthanc)
- **Frontend:** React com visualizador DICOM (Cornerstone.js / OHIF) customizado para suportar as novas ferramentas
- **Banco:** PostgreSQL
- **Infra:** Docker, orquestração futura em Kubernetes
- **Integrações:**  
  - Orthanc (REST + DICOM)  
  - Equipamentos via DICOM MWL e C‑STORE  
  - (Futuro) IA – serviço separado consumido via API

---

## 11. Integrações Específicas

| Integração | Protocolo/Interface | Objetivo |
|------------|---------------------|----------|
| Worklist (MWL) | DICOM | Enviar agendamentos para equipamentos |
| Storage (C‑STORE) | DICOM | Receber imagens dos equipamentos |
| Orthanc REST API | HTTP / JSON | Gerenciar estudos, séries, buscar metadados e imagens |
| Equipamentos | DICOM (MWL/Storage) | Comunicação nativa com modalidades |
| IA | REST (JSON) | Envio de dados de imagem e texto para sugestão de laudo |

---

## 12. Segurança e Conformidade

- **Autenticação:** JWT (access + refresh tokens)
- **Autorização:** RBAC com perfis predefinidos
- **Auditoria:** registro em tabela `audit_log` de todas as ações sensíveis
- **LGPD:**  
  - Dados sensíveis (saúde) protegidos em trânsito e repouso  
  - Políticas de retenção e anonimização configuráveis  
  - Consentimento do paciente registrado

---

## 13. Roadmap (Sugestão de Fases)

| Fase | Entregas |
|------|----------|
| **1** | Cadastro de pacientes, agenda, gestão de usuários |
| **2** | Check‑in, execução, estados do exame, orçamento |
| **3** | Integração Orthanc (envio e visualização de imagens) |
| **4** | Visualizador básico (zoom, pan, ajuste de janela) |
| **5** | Laudos básicos + versionamento + templates e frases |
| **6** | **Ferramentas avançadas no viewer:** medições, anotações, exportação |
| **7** | **Comparação com exames anteriores** e sequenciamento (playback) |
| **8** | Worklist DICOM (MWL) e reconciliação automática |
| **9** | **Assinatura técnica e co‑assinatura médica** |
| **10** | IA para laudos (templates inteligentes, sugestões) |
| **11** | Portal do paciente, relatórios gerenciais |