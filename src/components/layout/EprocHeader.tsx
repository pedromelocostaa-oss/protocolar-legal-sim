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
            <div className="w-8 h-8 flex items-center justify-center bg-white/20 font-bold text-[14px] rounded">⚖</div>
            <div>
              <div className="text-[13px] font-bold leading-tight">e-Proc — Simulador Educacional</div>
              <div className="text-[10px] opacity-70">Faculdade Milton Campos · Grupo Anima Educação</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[10px] opacity-60 hidden md:block">{dateStr}</span>

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
        <span className="opacity-50">|</span>
        <span className="opacity-60">Justiça Federal · TRF 1ª Região · Simulador Educacional</span>
        <span className="opacity-50 ml-auto text-[10px]">
          Simulador Educacional — Não possui vínculo com a Justiça Federal ou TRF1
        </span>
      </div>
    </div>
  );
}
