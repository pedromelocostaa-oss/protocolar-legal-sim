import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("ana.souza@universidade.edu.br");
  const [senha, setSenha] = useState("demo123");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, senha)) {
      navigate("/home");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: "hsl(220, 14%, 92%)" }}
    >
      {/* System identification bar at top */}
      <div
        className="fixed top-0 left-0 right-0 h-8 flex items-center justify-center"
        style={{ backgroundColor: "hsl(222, 47%, 20%)" }}
      >
        <span
          className="text-[11px] font-bold tracking-wider uppercase"
          style={{ color: "hsl(220, 20%, 95%)" }}
        >
          SAPE — Sistema Acadêmico de Processo Eletrônico
        </span>
      </div>

      <div className="w-full max-w-[340px] mt-8">
        {/* Login panel */}
        <div className="border" style={{ borderColor: "hsl(220, 12%, 78%)" }}>
          <div
            className="px-3 py-1.5 text-[11px] font-bold tracking-wide uppercase text-center"
            style={{
              backgroundColor: "hsl(222, 40%, 28%)",
              color: "hsl(0, 0%, 100%)",
            }}
          >
            Acesso ao Sistema
          </div>
          <div className="bg-card p-4">
            <form onSubmit={handleSubmit} className="space-y-2.5">
              <div>
                <label className="form-label">
                  <Mail size={10} className="inline mr-1" />
                  E-mail institucional
                </label>
                <input
                  type="email"
                  className="form-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aluno@universidade.edu.br"
                  required
                />
              </div>
              <div>
                <label className="form-label">
                  <Lock size={10} className="inline mr-1" />
                  Senha
                </label>
                <input
                  type="password"
                  className="form-field"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Entrar
              </button>
              <div className="text-center">
                <a
                  href="#"
                  className="text-[10px] hover:underline"
                  style={{ color: "hsl(220, 55%, 42%)" }}
                >
                  Esqueci minha senha
                </a>
              </div>
            </form>
          </div>
        </div>

        {/* Disclaimer */}
        <div
          className="mt-3 p-2 border text-center"
          style={{
            borderColor: "hsl(220, 12%, 82%)",
            backgroundColor: "hsl(220, 14%, 96%)",
          }}
        >
          <p className="text-[9px] text-muted-foreground leading-tight">
            Ambiente exclusivamente acadêmico para fins de estudo e simulação.
            Este sistema não possui vínculo com qualquer órgão oficial do Poder Judiciário.
            Qualquer credencial de demonstração é aceita neste ambiente.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 py-1 text-center" style={{ backgroundColor: "hsl(220, 14%, 94%)" }}>
        <p className="text-[9px] text-muted-foreground">
          SAPE v1.0.0 — Ferramenta acadêmica de simulação de peticionamento eletrônico
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
