# 🏥 OmniLaudo AI - Sistema Inteligente de Diagnóstico por Imagem

**OmniLaudo AI** é uma plataforma revolucionária para clínicas de radiologia e centros de diagnóstico por imagem. Combinando tecnologia de ponta com uma interface intuitiva, o sistema oferece uma experiência completa para gestão administrativa, execução técnica e diagnóstico médico.

## 🌟 Destaques do Sistema

### 📊 Dashboard Executivo
- **Métricas em Tempo Real**: Visualização instantânea de pacientes, agendamentos e produtividade
- **Análises Gráficas**: Tendências mensais e distribuição por modalidade
- **Interface Moderna**: Design responsivo com animações suaves e gradientes médicos

### 🔐 Autenticação Segura
- **Login Profissional**: Interface elegante com elementos médicos
- **Controle de Acesso**: Sistema de roles (SuperAdmin, Admin, Médico, Tecnólogo)
- **Conformidade**: Implementação de melhores práticas de segurança

### 🏛️ Gestão Administrativa Completa
- **Multi-Unidade**: Suporte a filiais e matrizes
- **Controle de Salas**: Gerenciamento de ocupação e equipamentos
- **Inventário DICOM**: Configuração completa de modalidades e comunicação

### 📅 Fluxo Integrado de Atendimento
- **Agendamento Inteligente**: Sistema completo com códigos TUSS
- **Recepção Otimizada**: Check-in rápido e gestão de filas
- **Prontuário Eletrônico**: Histórico completo do paciente

### 🛠️ Worklist Técnica Avançada
- **Painel de Controle**: Monitoramento em tempo real da fila de exames
- **Fluxo Automatizado**: Controle de status com integração DICOM
- **Upload Seguro**: Envio de imagens para PACS Orthanc

### 🩺 Workspace Médico Premium
- **Visualizador DICOM**: Interface híbrida com viewer integrado
- **Editor Inteligente**: Templates automáticos e editor rico
- **Assinatura Digital**: Finalização com integridade e sigilo

## 🚀 Arquitetura Técnica

### Frontend
- **⚡ Vite + React 18**: Performance excepcional e hot reload
- **🔷 TypeScript**: Tipagem estática para maior confiabilidade
- **🎨 Tailwind CSS**: Estilização utility-first moderna
- **🧩 Shadcn/UI**: Componentes acessíveis e customizáveis
- **📊 Recharts**: Gráficos interativos e responsivos
- **🎭 Framer Motion**: Animações fluidas e micro-interações
- **📝 TipTap**: Editor de texto rico profissional

### Backend Integration
- **🔄 TanStack Query**: Cache inteligente e sincronização de estado
- **📡 Axios**: Cliente HTTP com interceptors globais
- **🛡️ Error Handling**: Tratamento centralizado de erros
- **🔐 JWT Authentication**: Autenticação stateless segura

### Infraestrutura
- **🏥 PACS Orthanc**: Armazenamento e distribuição de imagens DICOM
- **📋 HL7/DICOM**: Padrões médicos para interoperabilidade
- **☁️ Cloud Ready**: Preparado para deploy em nuvem

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- Backend OmniLaudo API
- PACS Orthanc (opcional para desenvolvimento)

### Setup Rápido

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/omniluado-front.git
cd omniluado-front

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações

# Execute em modo desenvolvimento
npm run dev
```

### Build para Produção

```bash
# Build otimizado
npm run build

# Preview do build
npm run preview
```

## 📋 Funcionalidades por Perfil

### 👨‍💼 Super Admin / Admin
- ✅ Gestão completa de unidades e salas
- ✅ Configuração de equipamentos DICOM
- ✅ Relatórios administrativos
- ✅ Gerenciamento de usuários

### 👨‍⚕️ Médico Radiologista
- ✅ Acesso ao workspace de diagnóstico
- ✅ Visualização de imagens DICOM
- ✅ Editor de laudos com templates
- ✅ Assinatura digital de exames

### 🧑‍🔬 Tecnólogo
- ✅ Worklist técnica em tempo real
- ✅ Controle de fluxo de exames
- ✅ Upload de imagens DICOM
- ✅ Comunicação com equipamentos

### 👩‍💼 Recepção
- ✅ Agendamento de exames
- ✅ Cadastro de pacientes
- ✅ Gestão de convênios
- ✅ Controle de filas

## 🔧 Configuração Avançada

### Variáveis de Ambiente
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_ORTHANC_URL=http://localhost:8042
VITE_APP_NAME=OmniLaudo AI
```

### Personalização de Tema
O sistema utiliza CSS custom properties para fácil personalização:
```css
:root {
  --primary-500: #3B82F6;
  --accent-500: #10B981;
  /* ... outras variáveis */
}
```

## 📈 Performance e Escalabilidade

- **🚀 Lazy Loading**: Componentes carregados sob demanda
- **💾 Intelligent Caching**: TanStack Query para otimização de requests
- **📱 Responsive Design**: Interface adaptável a todos os dispositivos
- **♿ Acessibilidade**: Conformidade com WCAG 2.1
- **🔄 Real-time Updates**: WebSockets para notificações instantâneas

## 🤝 Contribuição

Contribuições são bem-vindas! Siga estes passos:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para detalhes.

## 📞 Suporte

Para suporte técnico ou dúvidas:
- 📧 Email: suporte@omniluado.com.br
- 📱 WhatsApp: (11) 99999-9999
- 📋 Documentação: [docs.omniluado.com.br](https://docs.omniluado.com.br)

---

**OmniLaudo AI** - Transformando o diagnóstico por imagem com inteligência artificial e excelência médica.

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