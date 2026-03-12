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
  "Dados Iniciais",
  "Assuntos",
  "Partes",
  "Características",
  "Petições e Documentos",
  "Resumo e Protocolo",
];

const ProcessoContent = () => {
  const { currentStep, setCurrentStep } = useProcess();
  const navigate = useNavigate();

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
    <>
      <div className="breadcrumb">
        <a href="#" onClick={() => navigate("/home")}>Início</a>
        <span>&gt;</span>
        <span>Processo</span>
        <span>&gt;</span>
        <span>Novo Processo</span>
        <span>&gt;</span>
        <span className="font-semibold text-foreground">{steps[currentStep]}</span>
      </div>

      <div className="p-4">
        <div className="panel-section mb-3">
          <div className="panel-header">Novo Processo — Cadastro</div>
          <div className="tab-bar">
            {steps.map((step, i) => (
              <button
                key={i}
                className={`tab-item ${i === currentStep ? "active" : ""}`}
                onClick={() => setCurrentStep(i)}
              >
                {i + 1}. {step}
              </button>
            ))}
          </div>
        </div>

        {renderStep()}
      </div>
    </>
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
      <SystemLayout>
        <ProcessoContent />
      </SystemLayout>
    </ProcessProvider>
  );
};

export default ProcessoPage;
