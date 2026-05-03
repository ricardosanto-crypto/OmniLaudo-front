import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  to: string;
}

interface PageWrapperProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  backLink?: {
    label: string;
    to: string;
  };
  actions?: ReactNode;
  children: ReactNode;
}

export function PageWrapper({ title, description, breadcrumbs, backLink, actions, children }: PageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full"
    >
      <div className="py-2 space-y-6">
        {/* Novo Header Padronizado */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-1">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                {breadcrumbs.map((item, index) => (
                  <React.Fragment key={item.to}>
                    <Link to={item.to} className="hover:text-primary transition-colors">
                      {item.label}
                    </Link>
                    {index < breadcrumbs.length - 1 && <span className="opacity-40">/</span>}
                  </React.Fragment>
                ))}
              </nav>
            )}

            <div className="flex flex-col gap-2">
              <h1 className="text-[26px] font-bold tracking-tight text-foreground leading-none">
                {breadcrumbs && breadcrumbs.length > 0 
                  ? `${breadcrumbs[breadcrumbs.length - 1].label} — ${title}`
                  : title
                }
              </h1>
              {description && <p className="text-sm text-muted-foreground max-w-2xl">{description}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {actions && <div className="flex items-center gap-2">{actions}</div>}
            {backLink && (
              <Link
                to={backLink.to}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-bold uppercase tracking-tight text-foreground transition hover:bg-accent shadow-sm"
              >
                {backLink.label}
              </Link>
            )}
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
