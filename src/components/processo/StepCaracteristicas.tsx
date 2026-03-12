import { useState } from "react";
import { useProcess } from "@/contexts/ProcessContext";

const StepCaracteristicas = () => {
  const { data, setCaracteristicas, setCurrentStep } = useProcess();
  const [justicaGratuita, setJusticaGratuita] = useState(data.caracteristicas?.justicaGratuita ?? false);
  const [pedidoLiminar, setPedidoLiminar] = useState(data.caracteristicas?.pedidoLiminar ?? false);
  const [valorCausa, setValorCausa] = useState(data.caracteristicas?.valorCausa ?? "");
  const [segredoJustica, setSegredoJustica] = useState(data.caracteristicas?.segredoJustica ?? false);
  const [motivoSigilo, setMotivoSigilo] = useState(data.caracteristicas?.motivoSigilo ?? "");
  const [msg, setMsg] = useState("");

  const handleSalvar = () => {
    if (!valorCausa) {
      setMsg("Informe o valor da causa.");
      return;
    }
    setCaracteristicas({ justicaGratuita, pedidoLiminar, valorCausa, segredoJustica, motivoSigilo });
    setMsg("Características salvas com sucesso.");
  };

  return (
    <div className="panel-section">
      <div className="panel-header">4. Características do Processo</div>
      <div className="panel-body">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="form-label">Justiça Gratuita?</label>
            <select className="form-field" value={justicaGratuita ? "Sim" : "Não"} onChange={(e) => setJusticaGratuita(e.target.value === "Sim")}>
              <option>Não</option>
              <option>Sim</option>
            </select>
          </div>
          <div>
            <label className="form-label">Pedido de Liminar ou Antecipação de Tutela?</label>
            <select className="form-field" value={pedidoLiminar ? "Sim" : "Não"} onChange={(e) => setPedidoLiminar(e.target.value === "Sim")}>
              <option>Não</option>
              <option>Sim</option>
            </select>
          </div>
          <div>
            <label className="form-label">Valor da Causa (R$) *</label>
            <input className="form-field" value={valorCausa} onChange={(e) => setValorCausa(e.target.value)} placeholder="0,00" />
          </div>
          <div>
            <label className="form-label">Segredo de Justiça?</label>
            <select className="form-field" value={segredoJustica ? "Sim" : "Não"} onChange={(e) => setSegredoJustica(e.target.value === "Sim")}>
              <option>Não</option>
              <option>Sim</option>
            </select>
          </div>
          {segredoJustica && (
            <div className="col-span-2">
              <label className="form-label">Motivo do Sigilo</label>
              <input className="form-field" value={motivoSigilo} onChange={(e) => setMotivoSigilo(e.target.value)} />
            </div>
          )}
        </div>

        <div className="mb-3 p-2 border border-border rounded-sm bg-muted">
          <h4 className="text-xs font-semibold mb-1">Prioridades Processuais</h4>
          <p className="text-[10px] text-muted-foreground">Funcionalidade disponível em versão futura.</p>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <button className="btn-success" onClick={handleSalvar}>Salvar</button>
          {msg && <span className="text-xs text-success">{msg}</span>}
        </div>

        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => setCurrentStep(2)}>&larr; Voltar</button>
          <button className="btn-primary" onClick={() => setCurrentStep(4)}>Avançar &rarr;</button>
        </div>
      </div>
    </div>
  );
};

export default StepCaracteristicas;
