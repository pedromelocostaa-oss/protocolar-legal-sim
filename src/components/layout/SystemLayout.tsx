import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, User, ChevronDown, Home, FileText, Settings, HelpCircle, Bell } from "lucide-react";
import { ReactNode, useState } from "react";

const SystemLayout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [processoMenuOpen, setProcessoMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const currentDate = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header Bar - Dark navy */}
      <header
        className="flex items-center justify-between px-3 py-1.5"
        style={{ backgroundColor: "hsl(222, 47%, 20%)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="text-[11px] font-bold tracking-wider uppercase"
            style={{ color: "hsl(220, 20%, 95%)" }}
          >
            SAPE — Sistema Acadêmico de Processo Eletrônico
          </div>
          <span
            className="text-[9px] px-1.5 py-0.5 rounded-sm font-semibold"
            style={{
              backgroundColor: "hsl(220, 60%, 55%)",
              color: "hsl(0, 0%, 100%)",
            }}
          >
            SIMULADO
          </span>
        </div>
        <div
          className="flex items-center gap-3 text-[10px]"
          style={{ color: "hsl(220, 20%, 85%)" }}
        >
          <span className="hidden sm:inline">{currentDate}</span>
          <button className="hover:opacity-80 relative">
            <Bell size={12} />
          </button>
          <div className="flex items-center gap-1 border-l pl-3" style={{ borderColor: "hsl(222, 30%, 30%)" }}>
            <User size={11} />
            <span className="font-semibold">{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-0.5 hover:opacity-80 ml-1"
          >
            <LogOut size={11} />
            <span>Sair</span>
          </button>
        </div>
      </header>

      {/* Navigation Bar - Slightly lighter navy */}
      <nav
        className="flex items-center px-1 py-0"
        style={{ backgroundColor: "hsl(220, 20%, 30%)" }}
      >
        <NavButton
          active={location.pathname === "/home"}
          onClick={() => navigate("/home")}
          icon={<Home size={11} />}
        >
          Início
        </NavButton>

        <div
          className="relative"
          onMouseEnter={() => setProcessoMenuOpen(true)}
          onMouseLeave={() => setProcessoMenuOpen(false)}
        >
          <NavButton
            active={location.pathname === "/processo"}
            onClick={() => navigate("/processo")}
            icon={<FileText size={11} />}
            hasDropdown
          >
            Processo
          </NavButton>
          {processoMenuOpen && (
            <div
              className="absolute top-full left-0 z-50 min-w-[160px] border shadow-lg"
              style={{
                backgroundColor: "hsl(220, 20%, 28%)",
                borderColor: "hsl(220, 20%, 22%)",
              }}
            >
              <button
                className="block w-full text-left px-3 py-1.5 text-[10px] hover:opacity-90"
                style={{ color: "hsl(220, 15%, 90%)" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "hsl(220, 30%, 38%)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                onClick={() => {
                  navigate("/processo");
                  setProcessoMenuOpen(false);
                }}
              >
                Novo Processo
              </button>
              <button
                className="block w-full text-left px-3 py-1.5 text-[10px] hover:opacity-90"
                style={{ color: "hsl(220, 15%, 90%)" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "hsl(220, 30%, 38%)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                onClick={() => {
                  navigate("/meus-processos");
                  setProcessoMenuOpen(false);
                }}
              >
                Meus Processos
              </button>
            </div>
          )}
        </div>

        <NavButton disabled icon={<Settings size={11} />}>
          Configurações
        </NavButton>

        <NavButton disabled icon={<HelpCircle size={11} />}>
          Ajuda
        </NavButton>
      </nav>

      {/* Content */}
      <main className="flex-1 bg-background">{children}</main>

      {/* Footer */}
      <footer
        className="px-3 py-1 text-[9px] text-center border-t"
        style={{
          backgroundColor: "hsl(220, 14%, 94%)",
          borderColor: "hsl(220, 12%, 80%)",
          color: "hsl(220, 10%, 45%)",
        }}
      >
        SAPE — Sistema Acadêmico de Processo Eletrônico Simulado | Ambiente exclusivamente acadêmico | Sem vínculo com órgãos oficiais | v1.0.0
      </footer>
    </div>
  );
};

const NavButton = ({
  children,
  active,
  onClick,
  icon,
  hasDropdown,
  disabled,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
  hasDropdown?: boolean;
  disabled?: boolean;
}) => (
  <button
    onClick={disabled ? undefined : onClick}
    className={`flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold transition-colors ${
      disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
    }`}
    style={{
      backgroundColor: active ? "hsl(220, 30%, 38%)" : "transparent",
      color: "hsl(220, 15%, 92%)",
    }}
    onMouseEnter={(e) => {
      if (!disabled && !active) e.currentTarget.style.backgroundColor = "hsl(220, 30%, 38%)";
    }}
    onMouseLeave={(e) => {
      if (!disabled && !active) e.currentTarget.style.backgroundColor = "transparent";
    }}
    disabled={disabled}
  >
    {icon}
    {children}
    {hasDropdown && <ChevronDown size={9} />}
  </button>
);

export default SystemLayout;
