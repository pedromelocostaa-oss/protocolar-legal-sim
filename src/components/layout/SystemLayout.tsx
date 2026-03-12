import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, User, ChevronRight, ChevronDown, LayoutDashboard, FolderOpen, CalendarDays, Settings, FileText, Search, MoreHorizontal } from "lucide-react";
import { ReactNode, useState } from "react";

interface SystemLayoutProps {
  children: ReactNode;
  title?: string;
  showSidebar?: boolean;
}

const SystemLayout = ({ children, title = "Quadro de avisos", showSidebar = true }: SystemLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [processoOpen, setProcessoOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* PJE-style teal header bar */}
      <header className="pje-header">
        <div className="flex items-center gap-2">
          <button
            className="pje-header-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <Menu size={16} />
          </button>
          <span className="text-[13px] font-semibold tracking-wide">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px]">{user?.name}</span>
          <button onClick={handleLogout} className="pje-header-avatar">
            <User size={14} />
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Left Sidebar */}
        {showSidebar && !sidebarCollapsed && (
          <aside className="pje-sidebar">
            {/* Search */}
            <div className="px-2 py-1.5 border-b" style={{ borderColor: "hsl(220, 12%, 88%)" }}>
              <div className="flex items-center gap-1">
                <Search size={12} className="text-muted-foreground" />
                <input
                  className="text-[11px] border-none bg-transparent outline-none flex-1"
                  placeholder="Acesso rápido"
                />
              </div>
            </div>

            <SidebarItem
              icon={<LayoutDashboard size={14} />}
              label="Painel"
              disabled
            />

            {/* Processo with submenu */}
            <div>
              <button
                className="pje-sidebar-item w-full"
                onClick={() => setProcessoOpen(!processoOpen)}
              >
                <FolderOpen size={14} />
                <span className="flex-1 text-left font-semibold">PROCESSO</span>
                {processoOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </button>
              {processoOpen && (
                <div className="pje-sidebar-submenu">
                  <button
                    className="pje-sidebar-subitem"
                    onClick={() => navigate("/processo")}
                  >
                    Novo processo
                  </button>
                  <button className="pje-sidebar-subitem opacity-40 cursor-not-allowed" disabled>
                    Novo processo incidental
                  </button>
                  <button
                    className="pje-sidebar-subitem"
                    onClick={() => navigate("/meus-processos")}
                  >
                    Não protocolado
                  </button>
                  <button
                    className="pje-sidebar-subitem"
                    onClick={() => navigate("/meus-processos")}
                  >
                    Pesquisar
                  </button>
                  <button className="pje-sidebar-subitem opacity-40 cursor-not-allowed" disabled>
                    Outras ações
                  </button>
                </div>
              )}
            </div>

            <SidebarItem
              icon={<FileText size={14} />}
              label="Atividades"
              disabled
            />
            <SidebarItem
              icon={<CalendarDays size={14} />}
              label="Audiências e sessões"
              disabled
            />
            <SidebarItem
              icon={<Settings size={14} />}
              label="Configuração"
              disabled
            />
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 bg-background">{children}</main>
      </div>
    </div>
  );
};

const SidebarItem = ({
  icon,
  label,
  onClick,
  active,
  disabled,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
}) => (
  <button
    className={`pje-sidebar-item w-full ${disabled ? "opacity-40 cursor-not-allowed" : ""} ${active ? "pje-sidebar-item-active" : ""}`}
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
  >
    {icon}
    <span className="flex-1 text-left">{label}</span>
    <ChevronRight size={12} className="opacity-40" />
  </button>
);

export default SystemLayout;
