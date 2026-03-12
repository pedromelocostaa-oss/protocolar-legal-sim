import { useState } from "react";
import { useProcess } from "@/contexts/ProcessContext";
import { mockAssuntos } from "@/data/mockData";
import { Plus, X } from "lucide-react";

const StepAssuntos = () => {
  const { data, addAssunto, removeAssunto } = useProcess();
  const [busca, setBusca] = useState("");
  const [codigo, setCodigo] = useState("");

  const filtered = (busca.length >= 2 || codigo.length >= 2)
    ? mockAssuntos.filter(
        (a) =>
          (busca.length >= 2 && a.descricao.toLowerCase().includes(busca.toLowerCase())) ||
          (codigo.length >= 2 && a.codigo.includes(codigo))
      )
    : [];

  return (
    <div className="flex gap-4">
      {/* Left: Assuntos Associados */}
      <div className="flex-1">
        <div className="text-[12px] font-bold mb-2">Assuntos Associados*</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Cod.</th>
              <th>Assunto Principal</th>
              <th>Assunto</th>
              <th>Complementar?</th>
              <th style={{ width: 50 }}></th>
            </tr>
          </thead>
          <tbody>
            {data.assuntos.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-muted-foreground">
                  0 resultados encontrados
                </td>
              </tr>
            ) : (
              data.assuntos.map((a) => (
                <tr key={a.codigo}>
                  <td>{a.codigo}</td>
                  <td>{a.descricao.split("|")[0]?.trim()}</td>
                  <td className="text-[10px]">{a.descricao}</td>
                  <td>Não</td>
                  <td>
                    <button
                      className="text-destructive hover:underline text-[10px]"
                      onClick={() => removeAssunto(a.codigo)}
                    >
                      <X size={12} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="text-[10px] text-muted-foreground mt-1">
          {data.assuntos.length} resultados encontrados
        </div>
      </div>

      {/* Right: Search */}
      <div style={{ width: 350 }}>
        <div className="mb-2">
          <label className="form-label">Assunto</label>
          <input
            className="form-field"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Digite o assunto..."
          />
        </div>
        <div className="mb-2">
          <label className="form-label">Código</label>
          <input
            className="form-field"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder=""
          />
        </div>
        <div className="flex gap-2 mb-3">
          <button className="btn-primary" onClick={() => {}}>PESQUISAR</button>
          <button className="btn-secondary" onClick={() => { setBusca(""); setCodigo(""); }}>LIMPAR</button>
        </div>

        {/* Search results */}
        <div className="text-[12px] font-bold mb-2">Assuntos*</div>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 30 }}></th>
              <th>Cod.</th>
              <th>Assunto</th>
              <th>Complementar?</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-muted-foreground">
                  {busca.length < 2 && codigo.length < 2 ? "Digite para pesquisar" : "Nenhum resultado"}
                </td>
              </tr>
            ) : (
              filtered.map((a) => (
                <tr key={a.codigo}>
                  <td>
                    <button
                      className="text-success hover:opacity-80"
                      onClick={() => addAssunto(a)}
                      title="Adicionar"
                    >
                      <Plus size={14} />
                    </button>
                  </td>
                  <td>{a.codigo}</td>
                  <td className="text-[10px]">{a.descricao}</td>
                  <td>Não</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StepAssuntos;
