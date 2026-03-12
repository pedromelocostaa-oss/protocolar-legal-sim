import { useState } from "react";
import { useProcess } from "@/contexts/ProcessContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { generateProcessNumber, getCurrentDateTime, mockOrgaosJulgadores } from "@/data/mockData";

const StepResumo = () => {
  const { data, setCurrentStep, resetProcess } = useProcess();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [protocolado, setProtocolado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numProcesso, setNumProcesso] = useState("");
  const [dataProtocolo, setDataProtocolo] = useState("");
  const [orgaoJulgador, setOrgaoJulgador] = useState("");

  const handleProtocolar = () => {
    setLoading(true);
    setTimeout(() => {
      setNumProcesso(generateProcessNumber());
      setDataProtocolo(getCurrentDateTime());
      setOrgaoJulgador(mockOrgaosJulgadores[Math.floor(Math.random() * mockOrgaosJulgadores.length)]);
      setLoading(false);
      setProtocolado(true);
    }, 3000);
  };

  const handleVoltarHome = () => {
    resetProcess();
    navigate("/home");
  };

  if (protocolado) {
    return (
      <div className="panel-section">
        <div className="panel-header bg-success text-success-foreground" style={{ backgroundColor: "hsl(140, 45%, 40%)" }}>
          Protocolo Realizado com Sucesso
        </div>
        <div className="panel-body">
          <div className="text-center mb-4">
            <div className="text-lg font-bold text-foreground mb-1">Processo Protocolado</div>
            <div className="text-2xl font-bold text-primary mb-2">{numProcesso}</div>
          </div>

          <table className="data-table mb-4">
            <tbody>
              <tr><td className="font-semibold">Número do Processo</td><td>{numProcesso}</td></tr>
              <tr><td className="font-semibold">Data/Hora do Protocolo</td><td>{dataProtocolo}</td></tr>
              <tr><td className="font-semibold">Órgão Julgador</td><td>{orgaoJulgador}</td></tr>
              <tr><td className="font-semibold">Classe Judicial</td><td>{data.dadosIniciais?.classeJudicial}</td></tr>
              <tr><td className="font-semibold">Assunto Principal</td><td>{data.assuntos[0]?.descricao || "—"}</td></tr>
              <tr><td className="font-semibold">Peticionante</td><td>{user?.name}</td></tr>
              <tr><td className="font-semibold">Status</td><td className="text-success font-bold">Protocolado com sucesso</td></tr>
            </tbody>
          </table>

          <div className="mb-3">
            <h4 className="text-xs font-bold mb-1">Documentos Protocolados</h4>
            <table className="data-table">
              <thead><tr><th>Tipo</th><th>Descrição</th></tr></thead>
              <tbody>
                <tr><td>{data.peticao?.tipoDocumento}</td><td>{data.peticao?.descricao}</td></tr>
                {data.peticao?.anexos.map((a) => (
                  <tr key={a.id}><td>{a.tipoDocumento}</td><td>{a.descricao} ({a.nomeArquivo})</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-2">
            <button className="btn-primary" onClick={() => window.print()}>Baixar Recibo</button>
            <button className="btn-secondary" onClick={handleVoltarHome}>Voltar para Home</button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="panel-section">
        <div className="panel-header">Protocolando...</div>
        <div className="panel-body text-center py-10">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Realizando distribuição automática e protocolo do processo...</p>
          <p className="text-xs text-muted-foreground mt-1">Aguarde...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-section">
      <div className="panel-header">6. Resumo e Protocolo</div>
      <div className="panel-body">
        {/* Dados Iniciais */}
        <div className="mb-3">
          <h4 className="text-xs font-bold mb-1 border-b border-border pb-1">Dados Iniciais</h4>
          {data.dadosIniciais ? (
            <div className="grid grid-cols-2 gap-1 text-xs mt-1">
              <div><span className="font-semibold">Matéria:</span> {data.dadosIniciais.materia}</div>
              <div><span className="font-semibold">Jurisdição:</span> {data.dadosIniciais.jurisdicao}</div>
              <div><span className="font-semibold">Competência:</span> {data.dadosIniciais.competencia}</div>
              <div><span className="font-semibold">Classe:</span> {data.dadosIniciais.classeJudicial}</div>
            </div>
          ) : <p className="text-xs text-destructive">Dados iniciais não preenchidos.</p>}
        </div>

        {/* Assuntos */}
        <div className="mb-3">
          <h4 className="text-xs font-bold mb-1 border-b border-border pb-1">Assuntos</h4>
          {data.assuntos.length > 0 ? (
            <ul className="text-xs mt-1">
              {data.assuntos.map((a) => <li key={a.codigo}>{a.codigo} — {a.descricao}</li>)}
            </ul>
          ) : <p className="text-xs text-destructive">Nenhum assunto adicionado.</p>}
        </div>

        {/* Partes */}
        <div className="mb-3">
          <h4 className="text-xs font-bold mb-1 border-b border-border pb-1">Polo Ativo</h4>
          {data.partes.filter((p) => p.polo === "ativo").length > 0 ? (
            <ul className="text-xs mt-1">
              {data.partes.filter((p) => p.polo === "ativo").map((p) => (
                <li key={p.id}>{p.tipoParte}: {p.nome} — {p.cpfCnpj}</li>
              ))}
            </ul>
          ) : <p className="text-xs text-destructive">Nenhuma parte no polo ativo.</p>}

          <h4 className="text-xs font-bold mb-1 border-b border-border pb-1 mt-2">Polo Passivo</h4>
          {data.partes.filter((p) => p.polo === "passivo").length > 0 ? (
            <ul className="text-xs mt-1">
              {data.partes.filter((p) => p.polo === "passivo").map((p) => (
                <li key={p.id}>{p.tipoParte}: {p.nome} — {p.cpfCnpj}</li>
              ))}
            </ul>
          ) : <p className="text-xs text-destructive">Nenhuma parte no polo passivo.</p>}
        </div>

        {/* Características */}
        <div className="mb-3">
          <h4 className="text-xs font-bold mb-1 border-b border-border pb-1">Características</h4>
          {data.caracteristicas ? (
            <div className="grid grid-cols-2 gap-1 text-xs mt-1">
              <div><span className="font-semibold">Justiça Gratuita:</span> {data.caracteristicas.justicaGratuita ? "Sim" : "Não"}</div>
              <div><span className="font-semibold">Liminar:</span> {data.caracteristicas.pedidoLiminar ? "Sim" : "Não"}</div>
              <div><span className="font-semibold">Valor da Causa:</span> R$ {data.caracteristicas.valorCausa}</div>
              <div><span className="font-semibold">Segredo de Justiça:</span> {data.caracteristicas.segredoJustica ? "Sim" : "Não"}</div>
            </div>
          ) : <p className="text-xs text-destructive">Características não preenchidas.</p>}
        </div>

        {/* Petição */}
        <div className="mb-3">
          <h4 className="text-xs font-bold mb-1 border-b border-border pb-1">Documento Principal</h4>
          {data.peticao ? (
            <div className="text-xs mt-1">
              <div><span className="font-semibold">Tipo:</span> {data.peticao.tipoDocumento}</div>
              <div><span className="font-semibold">Descrição:</span> {data.peticao.descricao}</div>
              <div className="mt-1"><span className="font-semibold">Conteúdo:</span></div>
              <div className="border border-border rounded-sm p-2 bg-muted max-h-32 overflow-y-auto text-[11px] font-mono mt-1 whitespace-pre-wrap">
                {data.peticao.conteudo.substring(0, 500)}{data.peticao.conteudo.length > 500 ? "..." : ""}
              </div>
              {data.peticao.anexos.length > 0 && (
                <div className="mt-2">
                  <span className="font-semibold">Anexos:</span>
                  <ul className="mt-1">
                    {data.peticao.anexos.map((a) => (
                      <li key={a.id}>{a.tipoDocumento}: {a.descricao} ({a.nomeArquivo})</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : <p className="text-xs text-destructive">Petição não inserida.</p>}
        </div>

        <div className="flex gap-2 border-t border-border pt-3">
          <button className="btn-secondary" onClick={() => setCurrentStep(4)}>&larr; Voltar para edição</button>
          <button className="btn-primary" onClick={handleProtocolar}>Protocolar</button>
        </div>
      </div>
    </div>
  );
};

export default StepResumo;
