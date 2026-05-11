import {
  LayoutDashboard, FolderOpen,
  Settings, Users, BookOpen, ClipboardList,
  List, Globe,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ReactNode, useState } from 'react';

interface SidebarItemProps {
  icon?: ReactNode;
  label: string;
  path?: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  badge?: number;
}

function SidebarItem({ icon, label, path, onClick, active, disabled, badge }: SidebarItemProps) {
  const navigate = useNavigate();
  const handleClick = disabled ? undefined : (onClick ?? (path ? () => navigate(path) : undefined));
  return (
    <button
      className={`pje-sidebar-item w-full ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${active ? 'pje-sidebar-item-active' : ''}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {icon ?? <span className="text-[10px] opacity-60">▸</span>}
      <span className="flex-1 text-left">{label}</span>
      {badge != null && badge > 0 && (
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white bg-red-500">{badge}</span>
      )}
      {!badge && <span className="text-[11px] opacity-30">›</span>}
    </button>
  );
}

interface ExpandableProps {
  icon?: ReactNode;
  label: string;
  children: ReactNode;
  defaultOpen?: boolean;
  active?: boolean;
}

function ExpandableItem({ icon, label, children, defaultOpen = false, active }: ExpandableProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        className={`pje-sidebar-item w-full ${active ? 'pje-sidebar-item-active' : ''}`}
        onClick={() => setOpen(!open)}
      >
        {icon ?? <span className="text-[10px] opacity-60">▸</span>}
        <span className="flex-1 text-left font-semibold">{label}</span>
        {open ? <span className="text-[11px]">▾</span> : <span className="text-[11px]">›</span>}
      </button>
      {open && <div className="pje-sidebar-submenu">{children}</div>}
    </div>
  );
}

function SubItem({ label, path, active, disabled }: { label: string; path?: string; active?: boolean; disabled?: boolean }) {
  const navigate = useNavigate();
  return (
    <button
      className={`pje-sidebar-subitem w-full ${active ? 'pje-sidebar-subitem-active' : ''} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      onClick={disabled ? undefined : (path ? () => navigate(path) : undefined)}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

interface EprocSidebarProps {
  collapsed: boolean;
  intimacoesCount?: number;
}

export default function EprocSidebar({ collapsed, intimacoesCount = 0 }: EprocSidebarProps) {
  const { user } = useAuth();
  const location = useLocation();
  const at = (p: string) => location.pathname === p;
  const startsWith = (p: string) => location.pathname.startsWith(p);

  if (collapsed) return null;

  const isAluno = user?.perfil === 'aluno';
  const isProfessor = user?.perfil === 'professor';

  return (
    <aside className="pje-sidebar overflow-y-auto">
      {/* --- ALUNO --- */}
      {isAluno && (
        <>
          <SidebarItem label="Painel" path="/dashboard" active={at('/dashboard')} />

          <ExpandableItem
            label="Peticionar"
            defaultOpen={startsWith('/peticao') || startsWith('/processo')}
            active={startsWith('/peticao') || startsWith('/processo')}
          >
            <SubItem label="Petição Inicial (Nova Ação)" path="/peticao-inicial" active={at('/peticao-inicial')} />
          </ExpandableItem>

          <ExpandableItem
            label="Meus Processos"
            defaultOpen={startsWith('/meus-processos') || startsWith('/processo/')}
            active={startsWith('/meus-processos') || startsWith('/processo/')}
          >
            <SubItem label="Processos Ativos" path="/meus-processos?status=ativo" active={false} />
            <SubItem label="Processos Encerrados" path="/meus-processos?status=encerrado" active={false} />
            <SubItem label="Todos" path="/meus-processos" active={at('/meus-processos')} />
          </ExpandableItem>

          <SidebarItem
            label="Intimações e Citações"
            path="/intimacoes"
            active={at('/intimacoes')}
            badge={intimacoesCount}
          />

        </>
      )}

      {/* --- PROFESSOR --- */}
      {isProfessor && (
        <>
          <SidebarItem icon={<LayoutDashboard size={14} />} label="Painel da Turma" path="/prof/dashboard" active={at('/prof/dashboard')} />

          <ExpandableItem
            icon={<BookOpen size={14} />}
            label="Tarefas"
            defaultOpen={startsWith('/prof/tarefas')}
            active={startsWith('/prof/tarefas')}
          >
            <SubItem label="Nova Tarefa" path="/prof/tarefas/nova" active={at('/prof/tarefas/nova')} />
            <SubItem label="Gerenciar Tarefas" path="/prof/tarefas" active={at('/prof/tarefas')} />
          </ExpandableItem>

          <SidebarItem
            icon={<ClipboardList size={14} />}
            label="Petições Recebidas"
            path="/prof/peticoes"
            active={at('/prof/peticoes')}
          />

          <SidebarItem
            icon={<Users size={14} />}
            label="Gerenciar Alunos"
            path="/prof/alunos"
            active={at('/prof/alunos')}
          />

          <ExpandableItem
            icon={<FolderOpen size={14} />}
            label="Processos"
            defaultOpen={startsWith('/prof/processos')}
            active={startsWith('/prof/processos')}
          >
            <SubItem label="Todos os Processos" path="/prof/processos" active={at('/prof/processos')} />
          </ExpandableItem>

          <SidebarItem
            icon={<Globe size={14} />}
            label="Consulta Processual"
            path="/consulta-publica"
            active={at('/consulta-publica')}
          />

          <SidebarItem
            icon={<List size={14} />}
            label="Gerenciar Turmas"
            path="/prof/turmas"
            active={at('/prof/turmas')}
            disabled
          />

          <SidebarItem icon={<Settings size={14} />} label="Configurações" disabled />
        </>
      )}

      {/* Educational disclaimer */}
      <div className="mt-auto p-2 border-t border-border">
        <div className="text-[9px] text-muted-foreground leading-tight">
          Simulador Educacional<br />
          Não possui vínculo com<br />
          o TJMG
        </div>
      </div>
    </aside>
  );
}
