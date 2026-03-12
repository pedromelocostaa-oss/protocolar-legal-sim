import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm">
        <div className="panel-section">
          <div className="panel-header text-center">
            Sistema Acadêmico de Processo Eletrônico Simulado
          </div>
          <div className="panel-body">
            <p className="text-xs text-muted-foreground text-center mb-4">
              Ambiente exclusivamente acadêmico para fins de estudo e simulação.
              Este sistema não possui vínculo com qualquer órgão oficial.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="form-label">E-mail institucional</label>
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
                <label className="form-label">Senha</label>
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
                <a href="#" className="text-xs text-accent hover:underline">
                  Esqueci minha senha
                </a>
              </div>
            </form>
            <div className="mt-4 pt-3 border-t border-border">
              <p className="text-[10px] text-muted-foreground text-center">
                PJE Simulado — Ferramenta acadêmica de simulação de peticionamento eletrônico.
                Qualquer credencial de demonstração é aceita neste ambiente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
