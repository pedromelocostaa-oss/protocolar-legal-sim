import { Bell, User, Menu, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase, DEMO_MODE } from '@/integrations/supabase/client';

interface EprocHeaderProps {
  onToggleSidebar: () => void;
  intimacoesNaoLidas?: number;
}

export default function EprocHeader({ onToggleSidebar, intimacoesNaoLidas = 0 }: EprocHeaderProps) {
  const { user, logout, demoMode } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [unread, setUnread] = useState(intimacoesNaoLidas);

  useEffect(() => {
    if (!user || demoMode) return;
    const loadUnread = async () => {
      const { count } = await supabase!
        .from('intimacoes')
        .select('*', { count: 'exact', head: true })
        .eq('destinatario_id', user.id)
        .eq('lida', false);
      setUnread(count ?? 0);
    };
    loadUnread();
    const interval = setInterval(loadUnread, 30000);
    return () => clearInterval(interval);
  }, [user, demoMode]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div>
      {demoMode && (
        <div className="demo-banner">
          ⚠️ MODO DEMONSTRAÇÃO — Configure o Supabase para uso em produção. Credenciais: CPF 121.572.976-69 / Senha: Milton@2025
        </div>
      )}
      {/* Top blue bar */}
      <header className="eproc-header-top">
        <div className="flex items-center gap-3">
          <button className="eproc-header-btn" onClick={onToggleSidebar} title="Menu">
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center bg-white/10">
              <svg width="22" height="26" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 1L1 5v8c0 6.5 4.3 11.8 10 13.5C16.7 24.8 21 19.5 21 13V5L11 1z" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="1.2"/>
                <path d="M11 3.5L3 7v6c0 5 3.3 9.2 8 10.8C15.7 22.2 19 18 19 13V7L11 3.5z" fill="white" fillOpacity="0.08"/>
                <text x="11" y="15.5" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="bold" fontFamily="Arial" letterSpacing="0.5">JF</text>
                <line x1="6" y1="17.5" x2="16" y2="17.5" stroke="white" strokeWidth="0.8" strokeOpacity="0.5"/>
              </svg>
            </div>
            <div>
              <div className="text-[14px] font-bold leading-tight">e-Proc</div>
              <div className="text-[10px] opacity-70">Peticionamento Eletrônico — 1º Grau</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[11px] opacity-80 hidden md:block">Seção Judiciária de Minas Gerais</span>
          <span className="text-[10px] opacity-50 hidden lg:block">{dateStr}</span>

          {/* Notifications bell */}
          {user?.perfil === 'aluno' && (
            <button
              className="eproc-header-btn relative"
              onClick={() => navigate('/intimacoes')}
              title="Intimações e Citações"
            >
              <Bell size={16} />
              {unread > 0 && (
                <span className="notif-badge">{unread > 9 ? '9+' : unread}</span>
              )}
            </button>
          )}

          {/* User menu */}
          <div className="relative">
            <button
              className="flex items-center gap-2 hover:opacity-80 cursor-pointer"
              onClick={() => setShowMenu(!showMenu)}
            >
              <div className="eproc-header-avatar">
                {user?.nome_completo?.charAt(0) ?? 'U'}
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-[12px] font-semibold leading-tight">{user?.nome_completo}</div>
                <div className="text-[10px] opacity-70">
                  {user?.perfil === 'aluno' ? `OAB Simulado: ${user.oab_simulado}` : 'Professor(a)'}
                </div>
              </div>
            </button>
            {showMenu && (
              <div
                className="absolute right-0 top-10 bg-white border border-border shadow-lg z-50 min-w-48"
                onMouseLeave={() => setShowMenu(false)}
              >
                <div className="px-4 py-2 border-b border-border">
                  <div className="text-[12px] font-bold">{user?.nome_completo}</div>
                  <div className="text-[11px] text-muted-foreground">CPF: {user?.cpf}</div>
                  {user?.perfil === 'aluno' && (
                    <div className="text-[11px] text-muted-foreground">Matrícula: {user?.matricula}</div>
                  )}
                </div>
                {user?.perfil === 'aluno' && (
                  <button
                    className="w-full text-left px-4 py-2 text-[12px] hover:bg-muted flex items-center gap-2"
                    onClick={() => { setShowMenu(false); navigate('/meus-dados'); }}
                  >
                    <Settings size={13} /> Meus Dados
                  </button>
                )}
                <button
                  className="w-full text-left px-4 py-2 text-[12px] hover:bg-muted flex items-center gap-2 text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut size={13} /> Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Secondary navigation bar */}
      <div className="eproc-header-sub">
        <button className="eproc-subheader-link font-bold" onClick={() => {}}>Início</button>
        <span className="opacity-40">|</span>
        <button className="eproc-subheader-link" onClick={() => {}}>Petição Inicial</button>
        <span className="opacity-40">|</span>
        <button className="eproc-subheader-link" onClick={() => {}}>Consulta Processual</button>
        <span className="opacity-40">|</span>
        <button className="eproc-subheader-link" onClick={() => {}}>Intimações</button>
        <span className="opacity-40">|</span>
        <button className="eproc-subheader-link" onClick={() => {}}>Manuais</button>
        <span className="opacity-40">|</span>
        <button className="eproc-subheader-link" onClick={() => {}}>Fale Conosco</button>
      </div>
    </div>
  );
}
