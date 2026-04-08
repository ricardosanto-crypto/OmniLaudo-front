
- **Domain** não conhece nenhuma outra camada.
- **Application** orquestra casos de uso, usando interfaces de repositórios definidas no domínio.
- **Infrastructure** implementa essas interfaces e é injetada via IoC.
- **Interface** chama os casos de uso.

### 📦 Entidades Principais (Domain)

- **User** – com roles (ADMIN, MEDICO, TECNOLOGO, ATENDENTE)
- **Patient** – dados pessoais, histórico
- **MedicalOrder** – pedido médico
- **Appointment** – agendamento, vínculo com médico e equipamento
- **Equipment** – modalidade, localização
- **Budget** – orçamento e status
- **Exam** – estado do exame (AGENDADO, REALIZADO, LAUDO_FINALIZADO etc.), AccessionNumber
- **DicomStudy** – StudyInstanceUID, vínculo com Exam
- **DicomSeries** – séries do estudo
- **Report** – laudo com versões, autor, data assinatura
- **Signature** – assinatura técnica e médica (tipo, usuário, timestamp)
- **Template** – modelo de laudo (título, conteúdo, tipo de exame)
- **Phrase** – frase padronizada (texto, atalho, categoria)
- **AuditLog** – trilha de auditoria

---

## 5. Integrações Específicas

| Integração           | Protocolo/Interface          | Detalhes                                                                 |
|----------------------|------------------------------|--------------------------------------------------------------------------|
| **Worklist (MWL)**   | DICOM                         | Backend expõe um SCP para equipamentos consultarem agendamentos         |
| **Storage (C‑STORE)**| DICOM                         | Equipamentos enviam imagens; serviço dedicado recebe e repassa ao Orthanc |
| **Orthanc REST API** | HTTP / JSON                   | Busca de estudos, metadados, imagens para o viewer; sincronização       |
| **IA**               | REST (JSON)                   | Envio de texto (histórico, modalidade) e referências de imagens para sugestões |
| **Fila de Eventos**  | RabbitMQ / Kafka (futuro)     | Eventos como `ExamCreated`, `ImagesReceived`, `StudyLinked`, `ReportSigned` |

### 📡 Fluxo de Integração DICOM

1. **Agendamento** → gera `AccessionNumber` único.
2. **Worklist** → equipamento consulta e obtém os dados do paciente e exame.
3. **Execução** → equipamento gera imagens e envia via **C‑STORE**.
4. **Serviço DICOM** recebe, valida e armazena no Orthanc.
5. **Backend** consulta Orthanc (por AccessionNumber ou StudyInstanceUID) e vincula o estudo ao exame.
6. **Reconciliação manual** disponível para casos de falha na vinculação automática.

---

## 6. Segurança Enterprise

- **Autenticação:** JWT com refresh token. Futuro OAuth2 (Keycloak).
- **Autorização:** RBAC com perfis:
  - `ATENDENTE` – agenda, check-in
  - `TECNOLOGO` – execução, assinatura técnica
  - `MEDICO` – laudos, visualização, assinatura médica
  - `ADMIN` – gestão de usuários, configurações
- **Auditoria:** Tabela `audit_log` registra todas as ações sensíveis (criação, alteração, exclusão, acesso a laudos).
- **LGPD:** Dados sensíveis criptografados em repouso; consentimento do paciente registrado; políticas de retenção configuráveis.

---

## 7. Escalabilidade e Performance

- **Separação do serviço DICOM** – permite escalar independentemente do backend.
- **Backend stateless** – pode ser replicado horizontalmente.
- **Cache com Redis** – para sessões, dados de agenda, templates frequentes.
- **CDN para imagens** (futuro) – melhora carregamento de estudos grandes.
- **Banco de dados** – réplicas de leitura para consultas de visualização.
- **Filas assíncronas** – desacoplam processamento de imagens e notificações.

**Requisitos de performance:**
- Carregamento de imagens DICOM < 3s.
- Navegação em playback com 30 fps.
- Suporte a múltiplos exames simultâneos.

---

## 8. Observabilidade

- **Logs estruturados** (JSON) – centralizados (ELK ou Loki).
- **Tracing distribuído** – OpenTelemetry para rastrear chamadas entre backend, Orthanc e IA.
- **Métricas** – Prometheus + Grafana para monitoramento de:
  - Tempo de resposta da API
  - Taxa de erros
  - Uso de CPU/memória
  - Latência de integração DICOM

---

## 9. DevOps e Infraestrutura

### 🐳 Ambiente de Desenvolvimento
- Docker Compose com:
  - Backend Spring Boot
  - Frontend React
  - PostgreSQL
  - Orthanc (PACS)
  - RabbitMQ (opcional)

### 🔁 CI/CD (GitHub Actions / GitLab CI)
- Build automatizado
- Testes unitários e de integração
- Linting e segurança (SAST)
- Publicação de imagem Docker
- Deploy em Kubernetes (futuro)

### ☁️ Deploy em Produção
- Orquestração com Kubernetes (EKS, AKS, GKE)
- Ingress controller com TLS
- Volumes persistentes para Orthanc e PostgreSQL
- Auto-scaling baseado em carga

---

## 10. Roadmap de Evolução Arquitetural

| Fase | Entrega |
|------|---------|
| **1** | Clean Architecture + containers (Docker Compose) |
| **2** | Integração básica com Orthanc (envio e visualização) |
| **3** | Worklist DICOM e reconciliação manual |
| **4** | Eventos assíncronos (RabbitMQ) e desacoplamento |
| **5** | Serviço de IA (templates inteligentes) |
| **6** | Microserviços (separação de domínios: Agenda, Laudos, DICOM) |
| **7** | Integração HL7/FHIR para interoperabilidade hospitalar |
| **8** | Multi-tenancy e white-label para clínicas |

---

## 11. Como Utilizar este Documento com IA

Com esta especificação, você pode solicitar à IA a implementação de tarefas específicas seguindo a arquitetura, por exemplo:

- *“Crie o endpoint `POST /api/exams/{id}/report` com Spring Boot, usando Clean Architecture e os casos de uso `CreateReportUseCase` e `AddSignatureUseCase`.”*
- *“Implemente o serviço DICOM Worklist que consulta agendamentos no banco e responde no formato DICOM.”*
- *“Desenvolva o componente React para comparação de exames anteriores usando OHIF.”*

---

## ✅ Próximos Passos

Este documento serve como guia definitivo para o desenvolvimento do **OmniLaudo AI**. Para salvar como arquivo Markdown, copie este conteúdo para um arquivo com extensão `.md` e abra com qualquer editor de Markdown (VS Code, Typora, etc.). Caso queira convertê-lo para PDF ou Word, utilize ferramentas como `pandoc` ou exporte diretamente do editor.