import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
  Building2,
  UserPlus,
  Activity,
  Plug
} from 'lucide-react';

interface SidebarSection {
  title: string;
  icon: React.ElementType;
  items: { label: string; to: string }[];
}

const sections: SidebarSection[] = [
  {
    title: 'ORGANIZAÇÃO',
    icon: Building2,
    items: [
      { label: 'Unidades de Atendimento', to: '/configuracoes/unidades' },
      { label: 'Salas de Exame', to: '/configuracoes/salas' },
      { label: 'Equipamentos', to: '/configuracoes/equipamentos' },
      { label: 'Modalidades', to: '/configuracoes/modalidades' },
      { label: 'Templates & Frases', to: '/configuracoes/templates' },
      { label: 'Convênios', to: '/configuracoes/convenios' },
      { label: 'Procedimentos (TUSS)', to: '/configuracoes/procedimentos' },
    ]
  },
  {
    title: 'USUÁRIOS',
    icon: UserPlus,
    items: [
      { label: 'Usuários', to: '/configuracoes/usuarios' },
      { label: 'Perfis & Permissões', to: '/configuracoes/perfis' },
      { label: 'Grupos', to: '/configuracoes/grupos' },
      { label: 'Políticas de Senha', to: '/configuracoes/senhas' },
      { label: 'MFA', to: '/configuracoes/mfa' },
    ]
  },
  {
    title: 'CLÍNICO',
    icon: Activity,
    items: [
      { label: 'Protocolos por modalidade', to: '/configuracoes/protocolos' },
      { label: 'DRL e dose', to: '/configuracoes/doses' },
      { label: 'Modelos de preparo', to: '/configuracoes/preparos' },
      { label: 'Termos de consentimento', to: '/configuracoes/termos' },
    ]
  },
  {
    title: 'INTEGRAÇÕES',
    icon: Plug,
    items: [
      { label: 'HL7 v2.5', to: '/configuracoes/hl7' },
      { label: 'MWL DICOM', to: '/configuracoes/mwl' },
      { label: 'Query/Retrieve', to: '/configuracoes/qr' },
      { label: 'RIS-HIS', to: '/configuracoes/ris-his' },
    ]
  }
];

export function SettingsLayout() {
  const location = useLocation();

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background">
      {/* Sidebar Lateral */}
      <aside className="w-64 flex flex-col border-r border-border bg-card/30 overflow-y-auto custom-scrollbar">
        <div className="py-6 space-y-8">
          {sections.map((section) => (
            <div key={section.title} className="space-y-2">
              <div className="px-6 flex items-center gap-3 text-muted-foreground/50">
                <section.icon size={16} strokeWidth={2} />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.15em]">
                  {section.title}
                </h3>
              </div>

              <div className="flex flex-col">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={cn(
                        "flex items-center px-12 py-2 text-[13px] font-medium transition-all border-l-4",
                        isActive
                          ? "text-primary border-primary bg-primary/5"
                          : "text-muted-foreground/70 hover:text-foreground border-transparent hover:bg-muted/30"
                      )}
                    >
                      <span className="tracking-tight">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Área de Conteúdo */}
      <main className="flex-1 overflow-y-auto bg-background/30 custom-scrollbar">
        <div className="max-w-[1400px] mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
