import { useState } from "react";
import { useProcess } from "@/contexts/ProcessContext";
import { mockAssuntos } from "@/data/mockData";
import { Plus, X } from "lucide-react";

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
        <div className="mb-3">
          <label className="form-label">Buscar Assunto (por código ou descrição)</label>
          <input
            className="form-field max-w-md"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Digite pelo menos 2 caracteres..."
          />
        </div>

        {filtered.length > 0 && (
          <div className="mb-3 panel-section">
            <div className="panel-body p-0">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Descrição</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => (
                    <tr key={a.codigo}>
                      <td>{a.codigo}</td>
                      <td>{a.descricao}</td>
                      <td>
                        <button
                          className="btn-primary flex items-center gap-1"
                          onClick={() => addAssunto(a)}
                        >
                          <Plus size={12} /> Adicionar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mb-3">
          <h4 className="text-xs font-semibold mb-1">Assuntos Associados</h4>
          {data.assuntos.length === 0 ? (
            <p className="text-xs text-muted-foreground">Nenhum assunto adicionado.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descrição</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {data.assuntos.map((a) => (
                  <tr key={a.codigo}>
                    <td>{a.codigo}</td>
                    <td>{a.descricao}</td>
                    <td>
                      <button
                        className="btn-secondary flex items-center gap-1"
                        onClick={() => removeAssunto(a.codigo)}
                      >
                        <X size={12} /> Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => setCurrentStep(0)}>&larr; Voltar</button>
          <button className="btn-primary" onClick={() => setCurrentStep(2)}>Avançar &rarr;</button>
        </div>
      </div>
    </div>
  );
};

export default StepAssuntos;
