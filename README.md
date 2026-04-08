# 🛰️ OmniLaudo RIS/PACS - Frontend

**OmniLaudo** é uma plataforma de ponta para gestão de Clínicas de Radiologia e Centros de Diagnóstico por Imagem. O sistema integra agendamento, recepção, worklist técnica e um ambiente de diagnóstico completo para médicos radiologistas.

## ✨ Principais Funcionalidades

### 🏛️ Gestão Administrativa
*   **Gestão de Unidades**: Configure múltiplas clínicas, filiais e centros de custo.
*   **Controle de Salas**: Gerencie a ocupação física e disponibilidade de equipamentos.
*   **Inventário DICOM**: Cadastro de modalidades (RM, TC, RX, US) com configurações de AE Title e portas de comunicação.

### 📅 Fluxo de Agendamento e Recepção
*   **Agenda Inteligente**: Visualização de horários, procedimentos TUSS e status em tempo real.
*   **Cadastro Cinclínico**: Registro completo de pacientes com integração de convênios.

### 🛠️ Worklist do Tecnólogo (Técnico)
*   **Painel de Execução**: Monitoramento da fila de pacientes em tempo real.
*   **Controle de Status**: Fluxo de trabalho automatizado (Check-in -> Iniciar -> Finalizar).
*   **Integração DICOM**: Sincronização de Accession Number para modalidades de imagem.

### 🩺 Workspace do Médico (Laudário)
*   **Ambiente Híbrido**: Interface otimizada com DICOM Viewer integrado e Editor de Texto Rico.
*   **Templates Inteligentes**: Aplicação rápida de modelos de laudo baseados no código TUSS.
*   **Assinatura Digital**: Finalização de exames com status de sigilo e integridade.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando o estado da arte do desenvolvimento web moderno:

*   **⚡ Vite + React (TypeScript)**: Core da aplicação com performance superior.
*   **🎨 CSS & Tailwind**: Estilização flexível e moderna.
*   **🧩 Shadcn UI**: Componentes de interface baseados em Radix & Base UI.
*   **🔄 TanStack Query (React Query)**: Gerenciamento de estado de servidor e cache inteligente.
*   **📡 Axios**: Consumo de API REST com tratamento global de erros.
*   **✨ Framer Motion**: Animações fluidas entre páginas.
*   **✍️ TipTap**: Editor de texto rico de alto nível para laudários.

## 🛠️ Instalação e Execução

### Pré-requisitos
*   Node.js (v18+)
*   API Rest OmniLaudo (Backend Java/Spring Boot)

### Passo a Passo

1. **Clonar o repositório**
   ```bash
   git clone https://github.com/seu-usuario/OmniLaudo-front.git
   cd OmniLaudo-front
   ```

2. **Instalar dependências**
   ```bash
   npm install
   ```

3. **Configurar variáveis de ambiente**
   Crie um arquivo `.env` na raiz:
   ```env
   VITE_API_URL=http://localhost:3001/api/v1
   ```

4. **Rodar em desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Gerar build de produção**
   ```bash
   npm run build
   ```

## 🏗️ Padrões de Projeto

O sistema segue os padrões de engenharia de software utilizados em sistemas de alta escala (Padrão SGP):
*   **Global Error Handling**: Interceptadores Axios tratam erros de rede, autenticação e validação Java (@Valid) globalmente.
*   **CRUD Actions**: Componentes padronizados para feedback visual e estados de carregamento.
*   **Role Based Security**: Navegação protegida baseada em permissões (SUPERADMIN, ADMIN, MEDICO, TECNOLOGO).

---
© 2026 OmniLaudo - Todos os direitos reservados.