# 🎨 Design Tokens – OmniLaudo AI

**Sistema de Design Completo para Figma + Desenvolvimento**

---

## 📋 Estrutura dos Tokens

Este arquivo contém todos os design tokens organizados por categoria, prontos para implementação em Figma e desenvolvimento frontend.

```json
{
  "color": {
    "primary": {
      "50": "#e3f2fd",
      "100": "#bbdefb",
      "200": "#90caf9",
      "300": "#64b5f6",
      "400": "#42a5f5",
      "500": "#2196f3",
      "600": "#1e88e5",
      "700": "#1976d2",
      "800": "#1565c0",
      "900": "#0d47a1"
    },
    "secondary": {
      "50": "#fce4ec",
      "100": "#f8bbd9",
      "200": "#f48fb1",
      "300": "#f06292",
      "400": "#ec407a",
      "500": "#e91e63",
      "600": "#d81b60",
      "700": "#c2185b",
      "800": "#ad1457",
      "900": "#880e4f"
    },
    "neutral": {
      "50": "#fafafa",
      "100": "#f5f5f5",
      "200": "#eeeeee",
      "300": "#e0e0e0",
      "400": "#bdbdbd",
      "500": "#9e9e9e",
      "600": "#757575",
      "700": "#616161",
      "800": "#424242",
      "900": "#212121"
    },
    "status": {
      "success": "#4caf50",
      "success-light": "#81c784",
      "warning": "#ff9800",
      "warning-light": "#ffb74d",
      "error": "#f44336",
      "error-light": "#ef5350",
      "info": "#2196f3",
      "info-light": "#64b5f6"
    },
    "dicom": {
      "bg": "#1a1a1a",
      "text": "#ffffff",
      "overlay": "rgba(0,0,0,0.7)",
      "measurement": "#ff6b35",
      "annotation": "#4ecdc4"
    }
  },
  "typography": {
    "fontFamily": {
      "primary": "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      "mono": "'JetBrains Mono', 'Fira Code', 'Consolas', monospace"
    },
    "fontSize": {
      "xs": "12px",
      "sm": "14px",
      "base": "16px",
      "lg": "18px",
      "xl": "20px",
      "2xl": "24px",
      "3xl": "30px",
      "4xl": "36px"
    },
    "fontWeight": {
      "light": "300",
      "normal": "400",
      "medium": "500",
      "semibold": "600",
      "bold": "700"
    },
    "lineHeight": {
      "tight": "1.25",
      "snug": "1.375",
      "normal": "1.5",
      "relaxed": "1.625",
      "loose": "2"
    },
    "letterSpacing": {
      "tight": "-0.025em",
      "normal": "0",
      "wide": "0.025em"
    }
  },
  "spacing": {
    "1": "8px",
    "2": "16px",
    "3": "24px",
    "4": "32px",
    "5": "40px",
    "6": "48px",
    "8": "64px",
    "10": "80px",
    "12": "96px"
  },
  "borderRadius": {
    "sm": "4px",
    "md": "6px",
    "lg": "8px",
    "xl": "12px",
    "2xl": "16px",
    "full": "9999px"
  },
  "shadow": {
    "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
  }
}
```

---

## 🎨 Component Tokens

### Buttons

```json
{
  "button": {
    "primary": {
      "background": "{color.primary.500}",
      "color": "{color.neutral.50}",
      "borderRadius": "{borderRadius.md}",
      "padding": "{spacing.2} {spacing.4}",
      "fontSize": "{typography.fontSize.sm}",
      "fontWeight": "{typography.fontWeight.medium}",
      "hover": {
        "background": "{color.primary.600}"
      },
      "active": {
        "background": "{color.primary.700}"
      },
      "disabled": {
        "background": "{color.neutral.300}",
        "color": "{color.neutral.500}"
      }
    },
    "secondary": {
      "background": "{color.neutral.50}",
      "color": "{color.neutral.700}",
      "border": "1px solid {color.neutral.300}",
      "borderRadius": "{borderRadius.md}",
      "padding": "{spacing.2} {spacing.4}",
      "fontSize": "{typography.fontSize.sm}",
      "fontWeight": "{typography.fontWeight.medium}",
      "hover": {
        "background": "{color.neutral.100}"
      },
      "active": {
        "background": "{color.neutral.200}"
      }
    },
    "icon": {
      "size": "32px",
      "background": "transparent",
      "color": "{color.neutral.600}",
      "borderRadius": "{borderRadius.md}",
      "hover": {
        "background": "{color.neutral.100}"
      },
      "active": {
        "background": "{color.primary.50}",
        "color": "{color.primary.600}"
      }
    }
  }
}
```

### Inputs

```json
{
  "input": {
    "base": {
      "border": "1px solid {color.neutral.300}",
      "borderRadius": "{borderRadius.md}",
      "padding": "{spacing.2} {spacing.3}",
      "fontSize": "{typography.fontSize.sm}",
      "fontFamily": "{typography.fontFamily.primary}",
      "background": "{color.neutral.50}",
      "color": "{color.neutral.900}",
      "focus": {
        "borderColor": "{color.primary.500}",
        "boxShadow": "0 0 0 3px {color.primary.100}"
      },
      "error": {
        "borderColor": "{color.status.error}",
        "boxShadow": "0 0 0 3px {color.status.error-light}"
      }
    }
  }
}
```

### Cards & Containers

```json
{
  "card": {
    "base": {
      "background": "{color.neutral.50}",
      "border": "1px solid {color.neutral.200}",
      "borderRadius": "{borderRadius.lg}",
      "boxShadow": "{shadow.sm}",
      "padding": "{spacing.4}"
    }
  },
  "modal": {
    "overlay": "rgba(0, 0, 0, 0.5)",
    "container": {
      "background": "{color.neutral.50}",
      "borderRadius": "{borderRadius.xl}",
      "boxShadow": "{shadow.xl}",
      "maxWidth": "500px",
      "padding": "{spacing.6}"
    }
  }
}
```

---

## 📐 Layout System

### Grid System

```css
/* CSS Grid Classes */
.grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--space-4);
}

.grid-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.grid-sidebar {
  display: grid;
  grid-template-columns: 7fr 3fr;
  gap: var(--space-6);
}

/* Flex Utilities */
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.gap-2 { gap: var(--space-2); }
.gap-3 { gap: var(--space-3); }
.gap-4 { gap: var(--space-4); }
```

### Spacing Utilities

```css
/* Margin */
.m-1 { margin: var(--space-1); }
.m-2 { margin: var(--space-2); }
.m-3 { margin: var(--space-3); }
.m-4 { margin: var(--space-4); }

.mt-1 { margin-top: var(--space-1); }
.mb-2 { margin-bottom: var(--space-2); }
.ml-3 { margin-left: var(--space-3); }
.mr-4 { margin-right: var(--space-4); }

/* Padding */
.p-1 { padding: var(--space-1); }
.p-2 { padding: var(--space-2); }
.p-3 { padding: var(--space-3); }
.p-4 { padding: var(--space-4); }

.pt-1 { padding-top: var(--space-1); }
.pb-2 { padding-bottom: var(--space-2); }
.pl-3 { padding-left: var(--space-3); }
.pr-4 { padding-right: var(--space-4); }
```

---

## 🎯 Component Variants

### Button Variants

```json
{
  "buttonVariants": {
    "primary": "button.primary",
    "secondary": "button.secondary",
    "danger": {
      "extends": "button.primary",
      "background": "{color.status.error}",
      "hover": {
        "background": "{color.status.error} darken 10%"
      }
    },
    "success": {
      "extends": "button.primary",
      "background": "{color.status.success}",
      "hover": {
        "background": "{color.status.success} darken 10%"
      }
    }
  }
}
```

### Status Variants

```json
{
  "statusVariants": {
    "laudando": {
      "background": "{color.status.warning-light}",
      "color": "{color.status.warning}",
      "text": "LAUDANDO"
    },
    "aguardando_assinatura": {
      "background": "{color.primary.100}",
      "color": "{color.primary.700}",
      "text": "AGUARDANDO ASSINATURA"
    },
    "finalizado": {
      "background": "{color.status.success-light}",
      "color": "{color.status.success}",
      "text": "FINALIZADO"
    }
  }
}
```

---

## 📱 Responsive Breakpoints

```css
/* Breakpoints */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;

/* Responsive Grid */
@media (max-width: 768px) {
  .grid-sidebar {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
  
  .viewer-section {
    order: 1;
  }
  
  .sidebar-section {
    order: 2;
  }
  
  .editor-section {
    order: 3;
  }
}

@media (max-width: 640px) {
  .header-actions {
    flex-direction: column;
    gap: var(--space-2);
  }
  
  .toolbox {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-1);
  }
}
```

---

## 🎨 Figma Implementation Guide

### 1. Setting Up Design Tokens in Figma

1. **Create Local Styles**
   - Go to Assets panel → Local styles
   - Create color styles for each token
   - Create text styles for typography
   - Create effect styles for shadows

2. **Organize with Naming Convention**
   ```
   Color/Primary/500
   Color/Status/Success
   Text/Body/Base
   Effect/Shadow/Medium
   ```

3. **Create Component Properties**
   - Use Figma's component properties for variants
   - Define boolean properties for states (hover, active, disabled)
   - Use instance swaps for different sizes

### 2. Auto-Layout Setup

```json
{
  "autoLayout": {
    "button": {
      "direction": "horizontal",
      "align": "center",
      "padding": "{spacing.2} {spacing.4}",
      "gap": "{spacing.2}"
    },
    "card": {
      "direction": "vertical",
      "align": "stretch",
      "padding": "{spacing.4}",
      "gap": "{spacing.3}"
    },
    "modal": {
      "direction": "vertical",
      "align": "stretch",
      "padding": "{spacing.6}",
      "gap": "{spacing.4}"
    }
  }
}
```

### 3. Component Structure

```
Button Component
├── Base Frame (Auto-layout)
│   ├── Icon (optional)
│   └── Text Label
└── Variants
    ├── Primary
    ├── Secondary
    ├── Icon Only
    └── States (Hover, Active, Disabled)
```

---

## 🚀 CSS Implementation

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-primary-500: #2196f3;
  --color-neutral-50: #fafafa;
  --color-status-success: #4caf50;
  
  /* Typography */
  --font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size-base: 16px;
  --font-weight-medium: 500;
  
  /* Spacing */
  --space-2: 16px;
  --space-4: 32px;
  
  /* Border Radius */
  --radius-md: 6px;
  
  /* Shadows */
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Dark Theme (DICOM Viewer) */
.dicom-viewer {
  --color-bg: #1a1a1a;
  --color-text: #ffffff;
  --color-overlay: rgba(0, 0, 0, 0.7);
}
```

### Utility Classes

```css
/* Button Utilities */
.btn {
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  padding: var(--space-2) var(--space-4);
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--color-primary-500);
  color: var(--color-neutral-50);
}

.btn-primary:hover {
  background: var(--color-primary-600);
}

/* Layout Utilities */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.grid-sidebar {
  display: grid;
  grid-template-columns: 7fr 3fr;
  gap: var(--space-6);
}

/* Responsive */
@media (max-width: 768px) {
  .grid-sidebar {
    grid-template-columns: 1fr;
  }
}
```

---

## 📋 Checklist de Implementação

### Figma Setup
- [ ] Design tokens criados
- [ ] Component library completa
- [ ] Auto-layout configurado
- [ ] Variants definidos
- [ ] Responsive breakpoints

### CSS Implementation
- [ ] CSS custom properties
- [ ] Utility classes
- [ ] Component styles
- [ ] Responsive styles
- [ ] Dark theme (DICOM)

### Quality Assurance
- [ ] Consistent spacing
- [ ] Accessible colors (WCAG AA)
- [ ] Keyboard navigation
- [ ] Focus indicators
- [ ] Error states

---

## 🔗 Recursos Adicionais

### Figma Plugins Recomendados
- **Design Tokens**: Para exportar tokens automaticamente
- **Anima**: Para micro-interações
- **Stark**: Para acessibilidade
- **TeleportHQ**: Para handoff ao desenvolvimento

### Ferramentas de Desenvolvimento
- **Style Dictionary**: Para gerar tokens em múltiplos formatos
- **Tailwind CSS**: Framework utility-first
- **Storybook**: Para documentação de componentes

### Referências
- [Material Design](https://material.io/design)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

Este sistema de design fornece uma base sólida e escalável para o desenvolvimento do OmniLaudo AI, garantindo consistência visual e experiência de usuário excepcional. 🎨✨
