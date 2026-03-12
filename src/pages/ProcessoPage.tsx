import { useNavigate } from "react-router-dom";
import { ProcessProvider, useProcess } from "@/contexts/ProcessContext";
import SystemLayout from "@/components/layout/SystemLayout";
import StepDadosIniciais from "@/components/processo/StepDadosIniciais";
import StepAssuntos from "@/components/processo/StepAssuntos";
import StepPartes from "@/components/processo/StepPartes";
import StepCaracteristicas from "@/components/processo/StepCaracteristicas";
import StepPeticao from "@/components/processo/StepPeticao";
import StepResumo from "@/components/processo/StepResumo";
import { useAuth } from "@/contexts/AuthContext";

const steps = [
  "DADOS INICIAIS",
  "ASSUNTOS",
  "PARTES",
  "CARACTERÍSTICAS",
  "INCLUIR PETIÇÕES E DOCUMENTOS",
  "PROTOCOLAR INICIAL",
];

const ProcessoContent = () => {
  const { currentStep, setCurrentStep, data } = useProcess();

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <StepDadosIniciais />;
      case 1: return <StepAssuntos />;
      case 2: return <StepPartes />;
      case 3: return <StepCaracteristicas />;
      case 4: return <StepPeticao />;
      case 5: return <StepResumo />;
      default: return <StepDadosIniciais />;
    }
  };

  return (
    <div>
      {/* Process data summary bar */}
      <div className="pje-process-bar">
        <div className="grid grid-cols-3 gap-x-6 gap-y-0.5">
          <div>
            <span className="pje-process-bar-label">Número do processo</span>
            <span className="pje-process-bar-value">—</span>
          </div>
          <div>
            <span className="pje-process-bar-label">Órgão julgador</span>
            <span className="pje-process-bar-value">—</span>
          </div>
          <div>
            <span className="pje-process-bar-label">Data da distribuição</span>
            <span className="pje-process-bar-value">—</span>
          </div>
          <div>
            <span className="pje-process-bar-label">Jurisdição</span>
            <span className="pje-process-bar-value">{data.dadosIniciais?.jurisdicao || "—"}</span>
          </div>
          <div>
            <span className="pje-process-bar-label">Classe</span>
            <span className="pje-process-bar-value">{data.dadosIniciais?.classeJudicial || "—"}</span>
          </div>
          <div>
            <span className="pje-process-bar-label">Valor de causa</span>
            <span className="pje-process-bar-value">{data.caracteristicas?.valorCausa || "0,00"}</span>
          </div>
        </div>
      </div>

      {/* PJE-style text tab navigation */}
      <div className="pje-tab-bar">
        {steps.map((step, i) => (
          <button
            key={i}
            className={`pje-tab-item ${i === currentStep ? "active" : ""}`}
            onClick={() => setCurrentStep(i)}
          >
            {step}
          </button>
        ))}
      </div>

      {/* Step content */}
      <div className="p-3">
        {renderStep()}
      </div>
    </div>
  );
};

const ProcessoPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <ProcessProvider>
      <SystemLayout title="Cadastro de processo" showSidebar={false}>
        <ProcessoContent />
      </SystemLayout>
    </ProcessProvider>
  );
};

export default ProcessoPage;
