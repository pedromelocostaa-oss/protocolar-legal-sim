import { useState } from "react";
import { useProcess } from "@/contexts/ProcessContext";
import { mockAssuntos } from "@/data/mockData";
import { Plus, X, Search } from "lucide-react";

const StepAssuntos = () => {
  const { data, addAssunto, removeAssunto, setCurrentStep } = useProcess();
  const [busca, setBusca] = useState("");

  const filtered = busca.length >= 2
    ? mockAssuntos.filter(
        (a) =>
          a.descricao.toLowerCase().includes(busca.toLowerCase()) ||
          a.codigo.includes(busca)
      )
    : [];

  return (
    <div className="panel-section">
      <div className="panel-header">2. Assuntos</div>
      <div className="panel-body">
        <fieldset className="pje-fieldset">
          <legend className="pje-fieldset-legend">Buscar Assunto</legend>
          <div className="flex items-end gap-2 mb-2">
            <div className="flex-1">
              <label className="form-label">Código ou Descrição</label>
              <div className="flex items-center gap-1">
                <Search size={11} className="text-muted-foreground" />
                <input
                  className="form-field"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Digite pelo menos 2 caracteres..."
                />
              </div>
            </div>
          </div>

          {filtered.length > 0 && (
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: "80px" }}>Código</th>
                  <th>Descrição</th>
                  <th style={{ width: "80px" }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.codigo}>
                    <td>{a.codigo}</td>
                    <td>{a.descricao}</td>
                    <td>
                      <button
                        className="btn-primary flex items-center gap-0.5"
                        onClick={() => addAssunto(a)}
                      >
                        <Plus size={10} /> Adicionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </fieldset>

        <fieldset className="pje-fieldset">
          <legend className="pje-fieldset-legend">Assuntos Associados ao Processo</legend>
          {data.assuntos.length === 0 ? (
            <p className="text-[10px] text-muted-foreground italic">Nenhum assunto adicionado.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: "80px" }}>Código</th>
                  <th>Descrição</th>
                  <th style={{ width: "80px" }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {data.assuntos.map((a) => (
                  <tr key={a.codigo}>
                    <td>{a.codigo}</td>
                    <td>{a.descricao}</td>
                    <td>
                      <button
                        className="btn-danger flex items-center gap-0.5"
                        onClick={() => removeAssunto(a.codigo)}
                      >
                        <X size={10} /> Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </fieldset>

        <div className="flex justify-between mt-2">
          <button className="btn-secondary" onClick={() => setCurrentStep(0)}>&laquo; Voltar</button>
          <button className="btn-primary" onClick={() => setCurrentStep(2)}>Avançar &raquo;</button>
        </div>
      </div>
    </div>
  );
};

export default StepAssuntos;
