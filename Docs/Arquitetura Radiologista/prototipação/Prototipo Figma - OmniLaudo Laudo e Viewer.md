# 🎨 Prototipo Figma – OmniLaudo AI: Laudo e Visualização DICOM

**Especificação Visual Completa para Prototipagem**

---

## 📋 Visão Geral

Este documento fornece especificações visuais completas para criar o protótipo Figma do sistema de laudagem e visualização DICOM. Inclui design system, componentes, wireframes detalhados e instruções de implementação.

### Estrutura do Arquivo Figma

```
📁 OmniLaudo AI - Laudo & Viewer
├── 🎨 Design System
│   ├── Colors
│   ├── Typography
│   ├── Spacing & Grid
│   └── Components Base
├── 📱 Wireframes
│   ├── 01 - Tela de Laudagem (Desktop)
│   ├── 02 - Modal Comparação
│   ├── 03 - Modal Templates
│   └── 04 - Modal Assinatura
├── 🧩 Components
│   ├── Header
│   ├── DicomViewer
│   ├── Toolbox
│   ├── LaudoEditor
│   └── SidePanel
└── 📐 Assets
    ├── Icons
    ├── DICOM Mockups
    └── Illustrations
```

---

## 🎨 Design System

### 1.1 Cores (Color Palette)

```css
/* Primary Colors */
--primary-50: #e3f2fd;
--primary-100: #bbdefb;
--primary-200: #90caf9;
--primary-300: #64b5f6;
--primary-400: #42a5f5;
--primary-500: #2196f3;  /* Primary */
--primary-600: #1e88e5;
--primary-700: #1976d2;
--primary-800: #1565c0;
--primary-900: #0d47a1;

/* Secondary Colors */
--secondary-50: #fce4ec;
--secondary-100: #f8bbd9;
--secondary-200: #f48fb1;
--secondary-300: #f06292;
--secondary-400: #ec407a;
--secondary-500: #e91e63;  /* Secondary */
--secondary-600: #d81b60;
--secondary-700: #c2185b;
--secondary-800: #ad1457;
--secondary-900: #880e4f;

/* Neutral Colors */
--gray-50: #fafafa;
--gray-100: #f5f5f5;
--gray-200: #eeeeee;
--gray-300: #e0e0e0;
--gray-400: #bdbdbd;
--gray-500: #9e9e9e;
--gray-600: #757575;
--gray-700: #616161;
--gray-800: #424242;
--gray-900: #212121;

/* Status Colors */
--success: #4caf50;
--success-light: #81c784;
--warning: #ff9800;
--warning-light: #ffb74d;
--error: #f44336;
--error-light: #ef5350;
--info: #2196f3;
--info-light: #64b5f6;

/* DICOM Specific */
--dicom-bg: #1a1a1a;        /* DICOM viewer background */
--dicom-text: #ffffff;      /* DICOM overlay text */
--dicom-overlay: rgba(0,0,0,0.7);  /* DICOM info overlay */
--measurement: #ff6b35;     /* Measurement lines */
--annotation: #4ecdc4;      /* Annotation arrows/text */
```

### 1.2 Tipografia

```css
/* Font Family */
--font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-family-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;

/* Font Sizes */
--text-xs: 12px;     /* Small labels, captions */
--text-sm: 14px;     /* Body text, buttons */
--text-base: 16px;   /* Default body text */
--text-lg: 18px;     /* Large body text */
--text-xl: 20px;     /* Headings small */
--text-2xl: 24px;    /* Headings medium */
--text-3xl: 30px;    /* Headings large */
--text-4xl: 36px;    /* Display headings */

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;

/* Letter Spacing */
--tracking-tight: -0.025em;
--tracking-normal: 0;
--tracking-wide: 0.025em;
```

### 1.3 Spacing & Grid

```css
/* Spacing Scale (8px base) */
--space-1: 8px;      /* xs: 8px */
--space-2: 16px;     /* sm: 16px */
--space-3: 24px;     /* md: 24px */
--space-4: 32px;     /* lg: 32px */
--space-5: 40px;     /* xl: 40px */
--space-6: 48px;     /* 2xl: 48px */
--space-8: 64px;     /* 3xl: 64px */
--space-10: 80px;    /* 4xl: 80px */
--space-12: 96px;    /* 5xl: 96px */

/* Border Radius */
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-xl: 12px;
--radius-2xl: 16px;
--radius-full: 9999px;

/* Shadows */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

/* Layout Grid */
--grid-cols-12: repeat(12, minmax(0, 1fr));
--grid-cols-3: repeat(3, minmax(0, 1fr));
--grid-gap-4: 16px;
```

---

## 🧩 Componentes Base

### 2.1 Botões (Buttons)

#### Primary Button
```
┌─────────────────────────────────┐
│          [LABEL]                │
└─────────────────────────────────┘

Propriedades:
- Background: primary-500 (#2196f3)
- Text: white
- Border radius: 6px
- Padding: 8px 16px
- Font: medium, 14px
- Hover: primary-600
- Active: primary-700
- Disabled: gray-300, text gray-500
```

#### Secondary Button
```
┌─────────────────────────────────┐
│          [LABEL]                │
└─────────────────────────────────┘

Propriedades:
- Background: white
- Border: 1px solid gray-300
- Text: gray-700
- Border radius: 6px
- Padding: 8px 16px
- Font: medium, 14px
- Hover: gray-50
- Active: gray-100
```

#### Icon Button
```
┌─────┐
│  ⚙️  │
└─────┘

Propriedades:
- Size: 32px x 32px
- Background: transparent
- Border: none
- Icon: 16px, gray-600
- Hover: gray-100, rounded
- Active: primary-50
```

### 2.2 Inputs & Form Controls

#### Text Input
```
┌─────────────────────────────────┐
│ Placeholder text...             │
└─────────────────────────────────┘

Propriedades:
- Border: 1px solid gray-300
- Border radius: 6px
- Padding: 8px 12px
- Font: normal, 14px
- Focus: border primary-500, shadow
- Error: border error
```

#### Select Dropdown
```
┌─────────────────────────────────┐
│ Selected option          ▼     │
└─────────────────────────────────┘

Propriedades:
- Mesmo estilo do Text Input
- Ícone dropdown: chevron-down
- Options: hover gray-50
```

#### Checkbox
```
□ Unchecked    ☑ Checked

Propriedades:
- Size: 16px x 16px
- Border: 1px solid gray-300
- Border radius: 3px
- Checked: primary-500 background, white checkmark
```

### 2.3 Cards & Containers

#### Card Base
```
┌─────────────────────────────────┐
│                                 │
│        Card Content             │
│                                 │
└─────────────────────────────────┘

Propriedades:
- Background: white
- Border: 1px solid gray-200
- Border radius: 8px
- Shadow: shadow-sm
- Padding: 16px
```

#### Modal/Dialog
```
┌─────────────────────────────────────┐
│              Title                  │
│  ─────────────────────────────────  │
│                                     │
│        Modal Content                │
│                                     │
│          [Cancel]  [Confirm]        │
└─────────────────────────────────────┘

Propriedades:
- Background: white
- Border radius: 12px
- Shadow: shadow-xl
- Overlay: rgba(0,0,0,0.5)
- Max width: 500px
```

### 2.4 Tabs

#### Tab Navigation
```
┌─────────┬─────────┬─────────┐
│  Tab 1  │  Tab 2  │  Tab 3  │
└─────────┴─────────┴─────────┘

Propriedades:
- Background: gray-50
- Border radius: 6px (top)
- Active tab: primary-500 background, white text
- Inactive: gray-600 text, hover gray-100
- Font: medium, 14px
- Padding: 8px 16px
```

---

## 📱 Wireframes Detalhados

### 3.1 Tela Principal – Desktop (1920x1080)

#### Frame Setup
```
Frame: Desktop (1920x1080)
Background: gray-50
Grid: 12 columns, 16px gap
```

#### Header Component
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← VOLTAR                          PACIENTE INFO                    STATUS   │
├─────────────────────────────────────────────────────────────────────────────┤
│ [COMPARAR] [HISTÓRICO] [IMPRIMIR]  ...  [SALVAR RASCUNHO] [ENVIAR ASSINATURA] │
└─────────────────────────────────────────────────────────────────────────────┘

Layout:
- Height: 80px
- Background: white
- Border bottom: 1px solid gray-200
- Padding: 16px 24px

Elementos:
1. Botão Voltar (ícone + texto)
   - Position: left
   - Icon: arrow-left (16px)
   - Text: "Voltar" (14px, medium)

2. Info Paciente
   - Position: center-left
   - Name: "João Silva" (18px, semibold)
   - Details: "52 anos • M • RES. JOELHO" (14px, gray-600)
   - Date: "02/04/2026 09:30" (12px, gray-500)

3. Status Badge
   - Position: center-right
   - Text: "LAUDANDO" (12px, uppercase)
   - Background: warning-light
   - Color: warning (darker)

4. Action Buttons
   - Position: right
   - Buttons: secondary style
   - Spacing: 8px between
```

#### Main Grid Layout
```
┌───────────────────────────────────┬────────────────────────────────────┐
│                                   │                                    │
│         VIEWER DICOM              │         PAINEL LATERAL             │
│         (70% width)               │         (30% width)                │
│                                   │                                    │
│                                   │                                    │
├───────────────────────────────────┴────────────────────────────────────┤
│                                                                           │
│                          EDITOR DE LAUDO                                 │
│                          (100% width)                                    │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘

Grid Properties:
- Container: max-width 1200px, center aligned
- Gap: 24px
- Viewer: flex: 7 (70%)
- SidePanel: flex: 3 (30%)
- Editor: full width below
```

#### DICOM Viewer Section
```
┌─────────────────────────────────────────────────────────────────────┐
│  [TOOLBOX]                         [CONTROLES]  [INFO]               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                      CANVAS DICOM PRINCIPAL                         │
│                     (Imagem renderizada)                             │
│                                                                     │
│                      [Window Level: 60]                              │
│                      [Window Width: 512]                             │
│                                                                     │
│  Série 1 / 42  [< >]  Play ⏵                                        │
│  [████████████░░░░]  Imagem 12 de 42                                │
└─────────────────────────────────────────────────────────────────────┘

Canvas Properties:
- Background: dicom-bg (#1a1a1a)
- Aspect ratio: 1:1 (square)
- Border radius: 8px
- Shadow: shadow-md

Toolbar:
- Position: top
- Background: white
- Border radius: 6px
- Shadow: shadow-sm
- Tools: icon buttons in row

Controls:
- Position: top-right
- Sliders for W/L
- Input fields
- Style: compact

Info Overlay:
- Position: bottom-left
- Background: dicom-overlay
- Text: white
- Border radius: 4px
- Padding: 8px
```

#### Side Panel
```
┌─────────────────┐
│ [PACIENTE] [TEMPLATES] [HISTÓRICO]
├─────────────────┴─────────────────────────┐
│                                           │
│  ABA: PACIENTE                            │
│  ─────────────────────────────────────── │
│  Nome: João Silva                        │
│  Idade: 52 años • Sexo: M                │
│  CPF: 123.456.789-00                     │
│  Data Nasc: 15/12/1971                   │
│                                           │
│  Alergias: PENICILINA ⚠️                 │
│  Diagnóstico Clínico: Dor no joelho     │
│                                           │
│  ─────────────────────────────────────── │
│  HISTÓRICO DE EXAMES (este paciente)    │
│                                           │
│  📄 02/04/2026 – RES. JOELHO (ATUAL)    │
│  📄 18/03/2026 – RES. JOELHO            │
│  📄 05/01/2026 – RX TORAX               │
│                                           │
│  [Ver Comparação ↗]                     │
│                                           │
└─────────────────────────────────────────┘

Tabs:
- Style: tab navigation (section 2.4)
- Active: primary background
- Content: scrollable area
- Padding: 16px
```

#### Laudo Editor
```
┌─────────────────────────────────────────────────────────────────────┐
│ EDITOR – Laudo Descrição                                            │
├─────────────────────────────────────────────────────────────────────┤
│ [+ TEMPLATE] [🔍 Buscar] [B] [I] [Lista]                           │
│                                                                     │
│  DADOS TÉCNICOS:                                                    │
│  Modalidade: Ressonância Magnética (MRI)                           │
│  Equipamento: Siemens MAGNETOM – 3.0T                              │
│  Sequências: T1, T2, FLAIR, DTI                                    │
│  Data/Hora Exame: 02/04/2026 09:30                                 │
│  Realizado por: Tech. João da Silva                                │
│                                                                     │
│  DESCRIÇÃO:                                                        │
│  |As estruturas ósseas do joelho...                               │
│                                                                     │
│  CONCLUSÃO:                                                        │
│  |1. Sem alterações significativas...                             │
│                                                                     │
│  ───────────────────────────────────────────────────────────────── │
│  Status: RASCUNHO (última edição: 14:42)  [SALVAR] [ENVIAR]       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

Editor Properties:
- Background: white
- Border: 1px solid gray-200
- Border radius: 8px
- Shadow: shadow-sm
- Toolbar: top, gray-50 background
- Content: padding 16px
- Status bar: bottom, gray-100 background
```

---

## 🎯 Estados Interativos

### 4.1 Estados do Viewer

#### Estado: Ferramenta Ativa
```
Toolbox com botão "Pan" destacado:
┌─────┬─────┬─────┬─────┐
│ 🖱️  │ 🔍  │ ↻   │ 📏  │
└─────┴─────┴─────┴─────┘
  Pan   Zoom  Rot   Med

Propriedades:
- Active button: primary-500 background, white icon
- Inactive: transparent, gray-600 icon
- Hover: gray-100 background
```

#### Estado: Playback Ativo
```
Canvas com controles de playback:
┌─────────────────────────────────────┐
│  [⏸ Pausar]  [⏹ Parar]             │
│  Velocidade: [◄═══●═════►]  10 fps  │
│  Progresso: [████████░░░░░░░░░░] 42% │
└─────────────────────────────────────┘

Propriedades:
- Overlay no canvas
- Background: dicom-overlay
- Controls: white text, primary accent
- Position: bottom-center
```

### 4.2 Estados do Editor

#### Estado: Salvando
```
Botão "SALVAR RASCUNHO" durante save:
[SALVANDO... ⏳]

Propriedades:
- Background: primary-400
- Text: white
- Disabled state
- Spinner icon
```

#### Estado: Erro de Validação
```
Campo obrigatório vazio:
┌─────────────────────────────────┐
│ DESCRIÇÃO:                      │
│ [Campo obrigatório]             │
└─────────────────────────────────┘

Propriedades:
- Border: error border
- Background: error-light (very light)
- Error text: error color, 12px
- Icon: warning triangle
```

---

## 📐 Assets Necessários

### 5.1 Ícones (Icon Set)

#### Ferramentas DICOM
```
- pan: hand cursor icon
- zoom: magnifying glass
- rotate: rotate arrows
- flip-h: horizontal flip
- flip-v: vertical flip
- measure: ruler
- annotate: text bubble with arrow
- roi: target/crosshair
- window-level: contrast/brightness
- playback: play button
- compare: split view
- export: download arrow
```

#### Ações Gerais
```
- arrow-left: back navigation
- search: magnifying glass
- plus: add new
- edit: pencil
- save: floppy disk
- send: paper plane
- print: printer
- history: clock
- user: person silhouette
- settings: gear
- close: X mark
- checkmark: ✓
- warning: ! triangle
- info: i circle
```

### 5.2 Imagens DICOM Mockup

#### Placeholder DICOM
```
Criar imagens placeholder para o viewer:
- Background: dicom-bg (#1a1a1a)
- Content: "DICOM IMAGE PLACEHOLDER"
- Text: white, center aligned
- Border: 1px dashed gray-400
- Size: 512x512px (square)
```

#### Imagens de Exemplo
```
- Knee MRI T1 axial
- Knee MRI T2 axial  
- Knee MRI FLAIR
- Chest X-ray PA
- Brain CT axial

Propriedades:
- Size: 512x512px
- Format: PNG with transparency
- Medical appearance (grayscale)
```

### 5.3 Avatares e Placeholders

#### Avatar Placeholder
```
Círculo com inicial:
┌─────┐
│  JS  │
└─────┘

Propriedades:
- Size: 32px diameter
- Background: primary-100
- Text: primary-700, medium, 14px
- Border radius: 50%
```

---

## 🔧 Instruções de Implementação no Figma

### 6.1 Setup Inicial

1. **Criar novo arquivo Figma**
   - Name: "OmniLaudo AI - Laudo & Viewer"
   - Add cover image (medical theme)

2. **Configurar Design System**
   - Create "Design System" page
   - Add color swatches (section 1.1)
   - Add text styles (section 1.2)
   - Add component library (section 2)

3. **Configurar Grid e Layout**
   - Set up 12-column grid (16px gap)
   - Create frame templates for different screen sizes

### 6.2 Criando Componentes

1. **Atomic Components**
   - Buttons (primary, secondary, icon)
   - Inputs (text, select, checkbox)
   - Cards, modals, tabs

2. **Composite Components**
   - Header (with patient info and actions)
   - DICOM Viewer (canvas + controls)
   - Toolbox (icon buttons grid)
   - Laudo Editor (toolbar + content area)
   - Side Panel (tabs + content)

3. **Page Components**
   - Main Laudo Page (grid layout)
   - Modal Comparison
   - Modal Templates
   - Modal Signature

### 6.3 Estados e Interações

1. **Component Variants**
   - Button: default, hover, active, disabled
   - Input: default, focus, error
   - Tab: active, inactive

2. **Prototyping**
   - Link buttons to modals
   - Create hover states
   - Add loading states

### 6.4 Assets e Imagens

1. **Import Icons**
   - Use Lucide React icons (Figma plugin)
   - Or create custom medical icons

2. **DICOM Placeholders**
   - Create placeholder images
   - Add to assets library

3. **Medical Illustrations**
   - Body diagrams for reference
   - UI illustrations for empty states

---

## 📋 Checklist de Qualidade

### Design System
- [ ] All colors defined and named
- [ ] Typography scale complete
- [ ] Spacing tokens consistent
- [ ] Component library comprehensive

### Wireframes
- [ ] All screens designed
- [ ] Responsive breakpoints covered
- [ ] Interactive states defined
- [ ] Error states included

### Assets
- [ ] Icons complete and consistent
- [ ] Images optimized
- [ ] Placeholders realistic

### Documentation
- [ ] Component usage guidelines
- [ ] Interaction patterns documented
- [ ] Design decisions explained

---

## 🎨 Estilo Visual – Inspirações

### Medical UI Patterns
- Clean, minimal interface
- High contrast for medical images
- Clear hierarchy with typography
- Consistent spacing and alignment

### Color Psychology
- Blue (primary): Trust, professionalism, calm
- Green: Success, health, positive outcomes
- Orange: Warning, attention needed
- Red: Errors, critical issues

### Accessibility
- WCAG 2.1 AA compliance
- High contrast ratios
- Clear focus indicators
- Keyboard navigation support

---

## 🚀 Próximos Passos

1. **Import to Figma** seguindo as instruções acima
2. **Create interactive prototype** com links entre telas
3. **Share with stakeholders** para feedback
4. **Iterate based on feedback** e refine designs
5. **Hand off to development** com specs completas

Este documento fornece tudo necessário para criar um protótipo Figma profissional e completo do sistema OmniLaudo AI. 🎯
