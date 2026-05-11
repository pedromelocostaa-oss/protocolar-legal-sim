import { Bell, LogOut, Settings, Search } from 'lucide-react';
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
  const [showAccessibility, setShowAccessibility] = useState(true);
  const [searchProcesso, setSearchProcesso] = useState('');
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

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchProcesso.trim()) {
      navigate(`/consulta-publica?q=${encodeURIComponent(searchProcesso.trim())}`);
    }
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div>
      {demoMode && (
        <div className="demo-banner">
          ⚠️ MODO DEMONSTRAÇÃO — Configure o Supabase para uso em produção. Credenciais: CPF 121.572.976-69 / Senha: Milton@2025
        </div>
      )}

      {/* ── Accessibility bar ── */}
      {showAccessibility && (
        <div className="eproc-accessibility-bar">
          <div className="flex items-center gap-3">
            <span>Portal de Serviços do TJMG</span>
            <span className="opacity-40">|</span>
            <button className="eproc-accessibility-btn">Alto Contraste</button>
            <span className="opacity-40">|</span>
            <button className="eproc-accessibility-btn">Acessibilidade</button>
          </div>
          <div className="flex items-center gap-3">
            <span className="opacity-60">{dateStr}</span>
            <button
              className="eproc-accessibility-btn opacity-60 hover:opacity-100"
              onClick={() => setShowAccessibility(false)}
              title="Fechar barra de acessibilidade"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ── Main header ── */}
      <header className="eproc-header-top">
        {/* Left: sidebar toggle + user dropdown */}
        <div className="flex items-center gap-2">
          <button
            className="eproc-header-btn text-[18px] font-bold leading-none px-1"
            onClick={onToggleSidebar}
            title="Menu"
          >
            ☰
          </button>

          {/* User dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-1.5 hover:opacity-80 cursor-pointer eproc-header-btn px-2"
              onClick={() => setShowMenu(!showMenu)}
            >
              <div className="eproc-header-avatar shrink-0">
                {user?.nome_completo?.charAt(0) ?? 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-[12px] font-semibold leading-tight truncate max-w-[140px]">
                  {user?.nome_completo}
                </div>
                <div className="text-[9px] opacity-70">
                  {user?.perfil === 'aluno' ? user.oab_simulado : 'Professor(a)'}
                </div>
              </div>
              <span className="text-[10px] opacity-70 ml-0.5">▼</span>
            </button>

            {showMenu && (
              <div
                className="absolute left-0 top-10 bg-white border border-border shadow-lg z-50 min-w-52"
                onMouseLeave={() => setShowMenu(false)}
              >
                <div className="px-4 py-2 border-b border-border">
                  <div className="text-[12px] font-bold text-foreground">{user?.nome_completo}</div>
                  <div className="text-[11px] text-muted-foreground">CPF: {user?.cpf}</div>
                  {user?.perfil === 'aluno' && (
                    <div className="text-[11px] text-muted-foreground">Matrícula: {user?.matricula}</div>
                  )}
                </div>
                {user?.perfil === 'aluno' && (
                  <button
                    className="w-full text-left px-4 py-2 text-[12px] hover:bg-muted flex items-center gap-2 text-foreground"
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

        {/* Center: TJMG logo + title */}
        <div className="flex flex-col items-center gap-0 absolute left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2">
            <span className="eproc-tjmg-logo">TJMG</span>
            <div>
              <div className="text-[15px] font-bold leading-tight">e-Proc</div>
              <div className="text-[9px] opacity-70 leading-tight">Peticionamento Eletrônico</div>
            </div>
          </div>
        </div>

        {/* Right: search + bell */}
        <div className="flex items-center gap-2">
          {/* Process search */}
          <div className="hidden md:flex items-center gap-1 relative">
            <input
              type="text"
              className="eproc-header-search"
              placeholder="Nº do processo..."
              value={searchProcesso}
              onChange={e => setSearchProcesso(e.target.value)}
              onKeyDown={handleSearch}
            />
            <button
              className="eproc-header-btn p-1"
              onClick={() => searchProcesso.trim() && navigate(`/consulta-publica?q=${encodeURIComponent(searchProcesso.trim())}`)}
              title="Consultar processo"
            >
              <Search size={14} />
            </button>
          </div>

          {/* Bell */}
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
        </div>
      </header>

      {/* ── Secondary navigation bar (jus.br links) ── */}
      <div className="eproc-header-sub">
        <button className="eproc-subheader-link font-bold" onClick={() => navigate('/dashboard')}>Início</button>
        <span className="opacity-40">|</span>
        <button className="eproc-subheader-link" onClick={() => navigate('/peticao-inicial')}>Petição Inicial</button>
        <span className="opacity-40">|</span>
        <button className="eproc-subheader-link" onClick={() => navigate('/consulta-publica')}>Consulta Processual</button>
        <span className="opacity-40">|</span>
        <button className="eproc-subheader-link" onClick={() => navigate('/intimacoes')}>Intimações</button>
        <span className="opacity-40">|</span>
        <button className="eproc-subheader-link" onClick={() => navigate('/meus-processos')}>Meus Processos</button>
        <span className="opacity-40">|</span>
        <button className="eproc-subheader-link" onClick={() => navigate('/meus-dados')}>Meus Dados</button>
        <div className="ml-auto hidden lg:flex items-center gap-1 opacity-70">
          <span className="text-[10px]">tjmg.jus.br</span>
          <span className="opacity-40">|</span>
          <span className="text-[10px]">cnj.jus.br</span>
        </div>
      </div>
    </div>
  );
}
