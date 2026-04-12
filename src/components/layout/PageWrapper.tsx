import { motion } from "framer-motion";
import { ReactNode } from "react";
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
    >
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="rounded-[2rem] border border-border bg-card/90 shadow-sm p-6 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="space-y-3">
              {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="text-sm text-slate-500 flex flex-wrap items-center gap-2">
                  {breadcrumbs.map((item, index) => (
                    <span key={item.to} className="inline-flex items-center gap-2">
                      <Link to={item.to} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                        {item.label}
                      </Link>
                      {index < breadcrumbs.length - 1 && <span className="text-slate-400">/</span>}
                    </span>
                  ))}
                </nav>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 justify-between">
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h1>
                  {description && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-2xl">{description}</p>}
                </div>
                {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
              </div>
            </div>

            {backLink && (
              <div className="self-start">
                <Link
                  to={backLink.to}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  {backLink.label}
                </Link>
              </div>
            )}
          </div>
        </div>

        {children}
      </div>
    </motion.div>
  );
}
