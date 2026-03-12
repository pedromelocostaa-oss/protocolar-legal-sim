import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [cpf, setCpf] = useState("121.572.976-69");
  const [senha, setSenha] = useState("demo123");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(cpf, senha)) {
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* PJE-style header */}
      <header className="pje-header">
        <span className="text-[13px] font-semibold">Processo Eletrônico em Sistema Simulado</span>
        <div className="flex gap-2 text-[10px]">
          <span className="opacity-60 cursor-not-allowed">Entrar</span>
          <span className="opacity-60 cursor-not-allowed">Formas de acesso</span>
          <span className="opacity-60 cursor-not-allowed">Consulta processual</span>
          <span className="opacity-60 cursor-not-allowed">Push</span>
          <span className="opacity-60 cursor-not-allowed">Pré-requisitos</span>
          <span className="opacity-60 cursor-not-allowed">Manuais</span>
          <span className="opacity-60 cursor-not-allowed">Fale conosco</span>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center" style={{ backgroundColor: "hsl(220, 14%, 95%)" }}>
        <div className="text-center mb-6">
          <div className="text-[16px] font-bold text-foreground mb-1">
            Processo Eletrônico em Sistema Simulado - 1° Grau
          </div>
          <div className="text-[10px] text-muted-foreground">
            Ambiente exclusivamente acadêmico
          </div>
        </div>

        {/* Login box */}
        <div className="bg-card border p-6 w-full max-w-[380px]" style={{ borderColor: "hsl(220, 12%, 80%)" }}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="form-label">CPF/CNPJ</label>
              <input
                type="text"
                className="form-field"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="CPF/CNPJ"
                required
              />
            </div>
            <div>
              <label className="form-label">CERTIFICADO DIGITAL ou Senha</label>
              <input
                type="password"
                className="form-field"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Senha"
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              ENTRAR
            </button>
          </form>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 text-center max-w-[380px]">
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Ambiente exclusivamente acadêmico para fins de estudo e simulação.
            Este sistema não possui vínculo com qualquer órgão oficial do Poder Judiciário.
            Qualquer credencial de demonstração é aceita neste ambiente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
