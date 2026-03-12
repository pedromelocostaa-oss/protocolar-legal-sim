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
import { CheckCircle } from "lucide-react";

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
        <a href="#" onClick={(e) => { e.preventDefault(); navigate("/home"); }}>Início</a>
        <span>&gt;</span>
        <span>Processo</span>
        <span>&gt;</span>
        <span>Novo Processo</span>
        <span>&gt;</span>
        <span className="font-bold text-foreground">{steps[currentStep]}</span>
      </div>

      <div className="p-2">
        {/* Step indicator bar */}
        <div className="panel-section mb-2">
          <div className="panel-header flex items-center gap-1">
            <CheckCircle size={11} />
            Novo Processo — Cadastro
          </div>
          <div className="tab-bar">
            {steps.map((step, i) => (
              <button
                key={i}
                className={`tab-item ${i === currentStep ? "active" : ""}`}
                onClick={() => setCurrentStep(i)}
              >
                <span
                  className="inline-flex items-center justify-center w-3.5 h-3.5 text-[8px] font-bold mr-0.5 border"
                  style={{
                    borderColor: i === currentStep ? "hsl(220, 70%, 30%)" : "hsl(220, 8%, 55%)",
                    backgroundColor: i < currentStep ? "hsl(220, 70%, 30%)" : "transparent",
                    color: i < currentStep ? "white" : "inherit",
                    borderRadius: "1px",
                  }}
                >
                  {i < currentStep ? "✓" : i + 1}
                </span>
                {step}
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
