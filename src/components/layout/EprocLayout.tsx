import { ReactNode, useState } from 'react';
import EprocHeader from './EprocHeader';
import EprocSidebar from './EprocSidebar';

interface EprocLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  intimacoesCount?: number;
}

export default function EprocLayout({ children, showSidebar = true, intimacoesCount = 0 }: EprocLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <EprocHeader
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        intimacoesNaoLidas={intimacoesCount}
      />
      <div className="flex flex-1 overflow-hidden">
        {showSidebar && <EprocSidebar collapsed={sidebarCollapsed} intimacoesCount={intimacoesCount} />}
        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: 'hsl(var(--bg-page))' }}>
          {children}
        </main>
      </div>
      <footer className="edu-footer">
        Simulador Educacional — Não possui vínculo com o TJMG · Desenvolvido para fins acadêmicos · Faculdade Milton Campos / Grupo Anima Educação
      </footer>
    </div>
  );
}
