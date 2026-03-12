import { useState } from "react";
import { useProcess } from "@/contexts/ProcessContext";
import {
  mockMaterias,
  mockJurisdicoes,
  mockCompetencias,
  mockClassesJudiciais,
} from "@/data/mockData";

const StepDadosIniciais = () => {
  const { data, setDadosIniciais, setCurrentStep } = useProcess();
  const [materia, setMateria] = useState(data.dadosIniciais?.materia || "");
  const [jurisdicao, setJurisdicao] = useState(data.dadosIniciais?.jurisdicao || "");
  const [competencia, setCompetencia] = useState(data.dadosIniciais?.competencia || "");
  const [classeJudicial, setClasseJudicial] = useState(data.dadosIniciais?.classeJudicial || "");
  const [included, setIncluded] = useState(!!data.dadosIniciais);
  const [msg, setMsg] = useState("");

  const handleIncluir = () => {
    if (!materia || !jurisdicao || !competencia || !classeJudicial) {
      setMsg("Preencha todos os campos obrigatórios.");
      return;
    }
    setDadosIniciais({ materia, jurisdicao, competencia, classeJudicial });
    setIncluded(true);
    setMsg("");
  };

  return (
    <div className="panel-section">
      <div className="panel-header">1. Dados Iniciais</div>
      <div className="panel-body">
        <fieldset className="pje-fieldset">
          <legend className="pje-fieldset-legend">Identificação do Processo</legend>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="form-label required">Matéria</label>
              <select className="form-field" value={materia} onChange={(e) => setMateria(e.target.value)}>
                <option value="">-- Selecione --</option>
                {mockMaterias.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label required">Jurisdição / Comarca</label>
              <select className="form-field" value={jurisdicao} onChange={(e) => setJurisdicao(e.target.value)}>
                <option value="">-- Selecione --</option>
                {mockJurisdicoes.map((j) => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label required">Competência</label>
              <select className="form-field" value={competencia} onChange={(e) => setCompetencia(e.target.value)}>
                <option value="">-- Selecione --</option>
                {mockCompetencias.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label required">Classe Judicial</label>
              <select className="form-field" value={classeJudicial} onChange={(e) => setClasseJudicial(e.target.value)}>
                <option value="">-- Selecione --</option>
                {mockClassesJudiciais.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </fieldset>

        <div className="flex items-center gap-2 mb-2">
          <button className="btn-primary" onClick={handleIncluir}>Incluir</button>
          {msg && <span className="text-[10px] text-destructive font-semibold">{msg}</span>}
        </div>

        {included && data.dadosIniciais && (
          <>
            <div className="alert-success mb-2">Dados iniciais incluídos com sucesso.</div>
            <table className="data-table mb-2">
              <thead>
                <tr>
                  <th>Matéria</th>
                  <th>Jurisdição</th>
                  <th>Competência</th>
                  <th>Classe Judicial</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{data.dadosIniciais.materia}</td>
                  <td>{data.dadosIniciais.jurisdicao}</td>
                  <td>{data.dadosIniciais.competencia}</td>
                  <td>{data.dadosIniciais.classeJudicial}</td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-end">
              <button className="btn-primary" onClick={() => setCurrentStep(1)}>
                Avançar &raquo;
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StepDadosIniciais;
