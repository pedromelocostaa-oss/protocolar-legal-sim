import { useState } from "react";
import { useProcess } from "@/contexts/ProcessContext";
import { mockPrioridades } from "@/data/mockData";
import { Plus } from "lucide-react";

const StepCaracteristicas = () => {
  const { data, setCaracteristicas } = useProcess();
  const [justicaGratuita, setJusticaGratuita] = useState(data.caracteristicas?.justicaGratuita ?? false);
  const [pedidoLiminar, setPedidoLiminar] = useState(data.caracteristicas?.pedidoLiminar ?? false);
  const [valorCausa, setValorCausa] = useState(data.caracteristicas?.valorCausa ?? "");
  const [segredoJustica, setSegredoJustica] = useState(data.caracteristicas?.segredoJustica ?? false);
  const [motivoSigilo, setMotivoSigilo] = useState(data.caracteristicas?.motivoSigilo ?? "");
  const [prioridade, setPrioridade] = useState("");
  const [prioridades, setPrioridades] = useState<string[]>([]);
  const [msgSalvar, setMsgSalvar] = useState(false);
  const [msgSigilo, setMsgSigilo] = useState(false);

  const handleSalvar = () => {
    setCaracteristicas({ justicaGratuita, pedidoLiminar, valorCausa, segredoJustica, motivoSigilo });
    setMsgSalvar(true);
    setTimeout(() => setMsgSalvar(false), 3000);
  };

  const handleGravarSigilo = () => {
    setCaracteristicas({ justicaGratuita, pedidoLiminar, valorCausa, segredoJustica, motivoSigilo });
    setMsgSigilo(true);
    setTimeout(() => setMsgSigilo(false), 3000);
  };

  const handleAddPrioridade = () => {
    if (prioridade && !prioridades.includes(prioridade)) {
      setPrioridades([...prioridades, prioridade]);
      setPrioridade("");
    }
  };

  return (
    <div>
      {/* Row 1: Justiça Gratuita, Pedido de liminar, Valor da causa */}
      <div className="flex gap-6 mb-3 items-end">
        <div>
          <label className="form-label">Justiça Gratuita? *</label>
          <div className="flex gap-3">
            <label className="pje-radio">
              <input type="radio" name="justicaGratuita" checked={justicaGratuita} onChange={() => setJusticaGratuita(true)} />
              Sim
            </label>
            <label className="pje-radio">
              <input type="radio" name="justicaGratuita" checked={!justicaGratuita} onChange={() => setJusticaGratuita(false)} />
              Não
            </label>
          </div>
        </div>

        <div>
          <label className="form-label">Pedido de liminar ou de antecipação de tutela? *</label>
          <div className="flex gap-3">
            <label className="pje-radio">
              <input type="radio" name="pedidoLiminar" checked={pedidoLiminar} onChange={() => setPedidoLiminar(true)} />
              Sim
            </label>
            <label className="pje-radio">
              <input type="radio" name="pedidoLiminar" checked={!pedidoLiminar} onChange={() => setPedidoLiminar(false)} />
              Não
            </label>
          </div>
        </div>

        <div>
          <label className="form-label">Valor da causa (R$) *</label>
          <input className="form-field" style={{ width: 200 }} value={valorCausa} onChange={(e) => setValorCausa(e.target.value)} placeholder="0,00" />
        </div>
      </div>

      <button className="btn-primary mb-4" onClick={handleSalvar}>SALVAR</button>
      {msgSalvar && <div className="alert-success mb-3">Dados salvos com sucesso.</div>}

      {/* Segredo de Justiça */}
      <div className="mb-3">
        <label className="form-label">Segredo de Justiça</label>
        <div className="flex gap-3 mb-2">
          <label className="pje-radio">
            <input type="radio" name="segredoJustica" checked={segredoJustica} onChange={() => setSegredoJustica(true)} />
            Sim
          </label>
          <label className="pje-radio">
            <input type="radio" name="segredoJustica" checked={!segredoJustica} onChange={() => setSegredoJustica(false)} />
            Não
          </label>
        </div>
        {segredoJustica && (
          <div className="mb-2">
            <label className="form-label">Motivo do sigilo</label>
            <input className="form-field" style={{ maxWidth: 400 }} value={motivoSigilo} onChange={(e) => setMotivoSigilo(e.target.value)} />
          </div>
        )}
      </div>

      <button className="btn-primary mb-4" onClick={handleGravarSigilo}>GRAVAR SIGILO</button>
      {msgSigilo && <div className="alert-success mb-3">Sigilo gravado com sucesso.</div>}

      {/* Prioridade de processo */}
      <div className="mb-3">
        <div className="flex gap-4">
          <div>
            <label className="form-label">Prioridade de processo *</label>
            <select className="form-field" style={{ width: 250 }} value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
              <option value="">Selecione</option>
              {mockPrioridades.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="form-label">Prioridade em processo</label>
            <table className="data-table">
              <thead>
                <tr><th>Prioridade do Processo</th></tr>
              </thead>
              <tbody>
                {prioridades.length === 0 ? (
                  <tr><td className="text-center text-muted-foreground">0 resultados encontrados</td></tr>
                ) : (
                  prioridades.map((p) => <tr key={p}><td>{p}</td></tr>)
                )}
              </tbody>
            </table>
          </div>
        </div>
        <button className="btn-primary mt-2 flex items-center gap-1" onClick={handleAddPrioridade}>
          INCLUIR
        </button>
      </div>
    </div>
  );
};

export default StepCaracteristicas;
