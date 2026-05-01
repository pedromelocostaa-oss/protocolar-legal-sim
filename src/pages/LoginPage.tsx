import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { formatCpf } from '@/lib/masks';

export default function LoginPage() {
  const { login, demoMode } = useAuth();
  const navigate = useNavigate();
  const [cpf, setCpf] = useState(demoMode ? '121.572.976-69' : '');
  const [senha, setSenha] = useState(demoMode ? 'Milton@2025' : '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCpf(e.target.value));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!cpf || !senha) { setError('Preencha CPF e senha.'); return; }

    setLoading(true);
    const { error: loginError } = await login(cpf, senha);
    setLoading(false);

    if (loginError) { setError(loginError); return; }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'hsl(213, 30%, 92%)' }}>
      {demoMode && (
        <div className="demo-banner">
          ⚠️ MODO DEMONSTRAÇÃO — CPF: 121.572.976-69 | Senha: Milton@2025 (aluno) &nbsp;|&nbsp; CPF: 000.000.000-01 (professor)
        </div>
      )}

      {/* Top e-Proc header */}
      <header style={{ background: 'hsl(210, 100%, 20%)' }} className="text-white">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            <div className="text-[22px]">⚖</div>
            <div>
              <div className="text-[14px] font-bold">e-Proc — Simulador Educacional</div>
              <div className="text-[10px] opacity-70">Faculdade Milton Campos · Grupo Anima Educação</div>
            </div>
          </div>
          <div className="text-[11px] opacity-70 hidden md:block">
            Justiça Federal · TRF 1ª Região · Simulador
          </div>
        </div>
        <div
          className="flex items-center gap-4 px-4 py-1 text-[11px]"
          style={{ background: 'hsl(213, 100%, 28%)' }}
        >
          <span className="font-bold">Entrar</span>
          <span className="opacity-50 cursor-not-allowed">Formas de acesso</span>
          <span
            className="cursor-pointer hover:underline opacity-80"
            onClick={() => window.location.href = '/consulta-publica'}
          >
            Consulta processual
          </span>
          <span className="opacity-50 cursor-not-allowed">Manuais</span>
          <span className="opacity-50 cursor-not-allowed">Fale conosco</span>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center mb-6">
          <div className="text-[18px] font-bold text-foreground mb-1">
            e-Proc · Processo Eletrônico — 1º Grau
          </div>
          <div className="text-[12px] text-muted-foreground">
            Sistema de Simulação Educacional · Acesse com CPF e senha
          </div>
        </div>

        {/* Login card */}
        <div className="bg-white border border-border shadow-sm w-full max-w-[360px]">
          <div
            className="px-4 py-2 text-white text-[12px] font-bold"
            style={{ background: 'hsl(210, 100%, 20%)' }}
          >
            IDENTIFICAÇÃO DO USUÁRIO
          </div>
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="form-label required">CPF</label>
              <input
                type="text"
                className={`form-field ${error ? 'form-field-error' : ''}`}
                value={cpf}
                onChange={handleCpfChange}
                placeholder="000.000.000-00"
                maxLength={14}
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="form-label required">Senha</label>
              <input
                type="password"
                className={`form-field ${error ? 'form-field-error' : ''}`}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            {error && <div className="alert-error">{error}</div>}

            <button
              type="submit"
              className="btn-primary w-full text-center"
              disabled={loading}
            >
              {loading ? 'AGUARDE...' : 'ACESSAR'}
            </button>
          </form>
        </div>

        {/* Info panel */}
        <div className="mt-6 max-w-[360px] w-full">
          <div className="bg-white border border-border p-4">
            <div className="panel-header mb-2">SOBRE O SIMULADOR</div>
            <ul className="text-[11px] text-muted-foreground space-y-1 list-disc list-inside">
              <li>Ambiente exclusivamente educacional</li>
              <li>Replica a interface do e-Proc TRF1</li>
              <li>Dados e processos são fictícios</li>
              <li>Acesso controlado por professor</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="edu-footer py-3">
        Simulador Educacional e-Proc — Não possui vínculo com a Justiça Federal ou TRF1 · Desenvolvido para fins acadêmicos · Faculdade Milton Campos / Grupo Anima Educação
      </footer>
    </div>
  );
}
