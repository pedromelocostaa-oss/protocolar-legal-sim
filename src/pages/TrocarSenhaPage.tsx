import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function TrocarSenhaPage() {
  const { trocarSenha, user } = useAuth();
  const navigate = useNavigate();
  const [nova, setNova] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validarSenha = (s: string): string | null => {
    if (s.length < 8) return 'A senha deve ter pelo menos 8 caracteres.';
    if (!/[A-Z]/.test(s)) return 'A senha deve conter pelo menos uma letra maiúscula.';
    if (!/[0-9]/.test(s)) return 'A senha deve conter pelo menos um número.';
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const validationError = validarSenha(nova);
    if (validationError) { setError(validationError); return; }
    if (nova !== confirmar) { setError('As senhas não coincidem.'); return; }

    setLoading(true);
    const { error: trocarError } = await trocarSenha(nova);
    setLoading(false);

    if (trocarError) { setError(trocarError); return; }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-[420px]">
        <div className="bg-white border border-border shadow-sm">
          {/* Header */}
          <div className="panel-header">TROCA DE SENHA — PRIMEIRO ACESSO</div>

          <div className="p-6">
            <div className="alert-info mb-4">
              <strong>Bem-vindo(a), {user?.nome_completo}!</strong><br />
              Por segurança, você deve criar uma nova senha antes de continuar.
              A senha padrão do sistema não pode ser mantida.
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label required">Nova Senha</label>
                <input
                  type="password"
                  className="form-field"
                  value={nova}
                  onChange={(e) => setNova(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="new-password"
                  required
                />
                <div className="mt-1 text-[11px] text-muted-foreground">
                  Requisitos: mínimo 8 caracteres, 1 maiúscula, 1 número.
                </div>
              </div>

              <div>
                <label className="form-label required">Confirmar Nova Senha</label>
                <input
                  type="password"
                  className="form-field"
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                  placeholder="Repita a senha"
                  autoComplete="new-password"
                  required
                />
              </div>

              {/* Password strength indicator */}
              {nova && (
                <div className="space-y-1">
                  {[
                    { ok: nova.length >= 8, label: 'Mínimo 8 caracteres' },
                    { ok: /[A-Z]/.test(nova), label: '1 letra maiúscula' },
                    { ok: /[0-9]/.test(nova), label: '1 número' },
                  ].map((req) => (
                    <div key={req.label} className="flex items-center gap-1.5 text-[11px]">
                      <span className={req.ok ? 'text-green-600' : 'text-red-500'}>
                        {req.ok ? '✓' : '✗'}
                      </span>
                      <span className={req.ok ? 'text-green-700' : 'text-muted-foreground'}>{req.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {error && <div className="alert-error">{error}</div>}

              <button
                type="submit"
                className="btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'SALVANDO...' : 'SALVAR E CONTINUAR'}
              </button>
            </form>
          </div>
        </div>

        <div className="edu-footer mt-4">
          Simulador Educacional — Não possui vínculo com a Justiça Federal ou TRF1
        </div>
      </div>
    </div>
  );
}
