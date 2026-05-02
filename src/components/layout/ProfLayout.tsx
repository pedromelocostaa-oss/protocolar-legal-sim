import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProfLayoutProps {
  children: ReactNode;
}

const NAV = [
  { label: 'Dashboard', path: '/prof/dashboard' },
  { label: 'Turmas e Alunos', path: '/prof/alunos' },
  { label: 'Tarefas', path: '/prof/tarefas' },
  { label: 'Petições Recebidas', path: '/prof/peticoes' },
];

export default function ProfLayout({ children }: ProfLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f3f4f6' }}>
      {/* Top bar */}
      <header
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ background: '#ffffff', borderColor: '#e5e7eb' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 flex items-center justify-center"
            style={{ background: '#1e40af' }}
          >
            <svg width="18" height="20" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 1L1 5v8c0 6.5 4.3 11.8 10 13.5C16.7 24.8 21 19.5 21 13V5L11 1z" fill="white" fillOpacity="0.3" stroke="white" strokeWidth="1.2"/>
              <text x="11" y="15.5" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="bold" fontFamily="Arial">JF</text>
            </svg>
          </div>
          <div>
            <div className="text-[13px] font-bold" style={{ color: '#1e3a5f' }}>SIMULADOR e-PROC</div>
            <div className="text-[10px]" style={{ color: '#6b7280' }}>Sistema de Gestão Acadêmica</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[12px] hidden sm:block" style={{ color: '#374151' }}>
            Prof. {user?.nome_completo}
          </span>
          <button
            className="text-[11px] px-3 py-1 border cursor-pointer"
            style={{ color: '#1e40af', borderColor: '#1e40af', background: 'transparent' }}
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <nav
          className="flex flex-col border-r overflow-y-auto"
          style={{ width: '180px', minWidth: '180px', background: '#ffffff', borderColor: '#e5e7eb' }}
        >
          {NAV.map(item => (
            <button
              key={item.path}
              className="text-left px-4 py-2.5 text-[12px] border-b cursor-pointer transition-colors"
              style={{
                borderColor: '#f3f4f6',
                background: isActive(item.path) ? '#1e40af' : 'transparent',
                color: isActive(item.path) ? '#ffffff' : '#374151',
                fontWeight: isActive(item.path) ? 700 : 400,
              }}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
          <div className="mt-auto border-t" style={{ borderColor: '#e5e7eb' }}>
            <button
              className="w-full text-left px-4 py-2.5 text-[12px] cursor-pointer"
              style={{ color: '#dc2626' }}
              onClick={handleLogout}
            >
              Sair
            </button>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto" style={{ background: '#f9fafb' }}>
          {children}
        </main>
      </div>

      <footer
        className="text-center py-1 text-[9px] border-t"
        style={{ color: '#9ca3af', borderColor: '#e5e7eb', background: 'transparent', opacity: 0.4 }}
      >
        Simulador Educacional e-Proc — Não possui vínculo com a Justiça Federal ou TRF1 · Faculdade Milton Campos / Grupo Anima Educação
      </footer>
    </div>
  );
}
