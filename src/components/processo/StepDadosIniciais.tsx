import { useState } from "react";
import { useProcess } from "@/contexts/ProcessContext";
import {
  mockMaterias,
  mockJurisdicoes,
  mockClassesJudiciais,
} from "@/data/mockData";

const StepDadosIniciais = () => {
  const { data, setDadosIniciais, setCurrentStep } = useProcess();
  const [materia, setMateria] = useState(data.dadosIniciais?.materia || "");
  const [jurisdicao, setJurisdicao] = useState(data.dadosIniciais?.jurisdicao || "");
  const [classeJudicial, setClasseJudicial] = useState(data.dadosIniciais?.classeJudicial || "");
  const [included, setIncluded] = useState(!!data.dadosIniciais);
  const [msg, setMsg] = useState("");

  const handleIncluir = () => {
    if (!materia || !jurisdicao || !classeJudicial) {
      setMsg("Preencha todos os campos obrigatórios.");
      return;
    }
    setDadosIniciais({ materia, jurisdicao, competencia: "", classeJudicial });
    setIncluded(true);
    setMsg("");
  };

  return (
    <div>
      {!included ? (
        <>
          <div className="mb-3">
            <label className="form-label required">Matéria</label>
            <select className="form-field" value={materia} onChange={(e) => setMateria(e.target.value)}>
              <option value="">Selecione</option>
              {mockMaterias.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label required">Jurisdição</label>
            <select className="form-field" value={jurisdicao} onChange={(e) => setJurisdicao(e.target.value)}>
              <option value="">Selecione</option>
              {mockJurisdicoes.map((j) => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label required">Classe judicial</label>
            <select className="form-field" value={classeJudicial} onChange={(e) => setClasseJudicial(e.target.value)}>
              <option value="">Selecione</option>
              {mockClassesJudiciais.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {msg && <div className="alert-error mb-2">{msg}</div>}

          <button className="btn-primary" onClick={handleIncluir}>INCLUIR</button>
        </>
      ) : (
        <div>
          <div className="alert-success mb-3">Dados iniciais incluídos com sucesso.</div>
          <table className="data-table mb-3">
            <thead>
              <tr>
                <th>Matéria</th>
                <th>Jurisdição</th>
                <th>Classe Judicial</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{data.dadosIniciais?.materia}</td>
                <td>{data.dadosIniciais?.jurisdicao}</td>
                <td>{data.dadosIniciais?.classeJudicial}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StepDadosIniciais;
