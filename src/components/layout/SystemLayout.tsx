import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { ReactNode } from "react";

const SystemLayout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-header-bg text-header-fg flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="text-sm font-bold tracking-wide">
            SAPE — Sistema Acadêmico de Processo Eletrônico
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 hover:underline"
          >
            <LogOut size={14} />
            Sair
          </button>
        </div>
      </header>

      {/* Nav Bar */}
      <nav className="bg-card border-b border-border px-4 py-1 flex items-center gap-4 text-xs">
        <button
          onClick={() => navigate("/home")}
          className="hover:text-accent font-semibold py-1"
        >
          Início
        </button>
        <button
          onClick={() => navigate("/processo")}
          className="hover:text-accent font-semibold py-1"
        >
          Processo
        </button>
      </nav>

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border px-4 py-2 text-[10px] text-muted-foreground text-center">
        SAPE — Sistema Acadêmico de Processo Eletrônico Simulado | Ambiente exclusivamente acadêmico | Sem vínculo com órgãos oficiais
      </footer>
    </div>
  );
};

export default SystemLayout;
