import { useState } from "react";
import { useProcess } from "@/contexts/ProcessContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { generateProcessNumber, getCurrentDateTime, mockOrgaosJulgadores } from "@/data/mockData";
import { CheckCircle, Download, ArrowLeft } from "lucide-react";

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
        <div
          className="panel-header flex items-center gap-1"
          style={{ backgroundColor: "hsl(120, 40%, 36%)" }}
        >
          <CheckCircle size={12} />
          Protocolo Realizado com Sucesso
        </div>
        <div className="panel-body">
          <div
            className="text-center py-3 mb-2 border"
            style={{
              backgroundColor: "hsl(120, 40%, 96%)",
              borderColor: "hsl(120, 40%, 75%)",
            }}
          >
            <div className="text-[11px] font-bold text-foreground mb-0.5 uppercase">Processo Protocolado</div>
            <div className="text-lg font-bold text-primary">{numProcesso}</div>
          </div>

          <fieldset className="pje-fieldset">
            <legend className="pje-fieldset-legend">Dados do Protocolo</legend>
            <table className="data-table">
              <tbody>
                <tr><td className="font-bold" style={{ width: "200px" }}>Número do Processo</td><td>{numProcesso}</td></tr>
                <tr><td className="font-bold">Data/Hora do Protocolo</td><td>{dataProtocolo}</td></tr>
                <tr><td className="font-bold">Órgão Julgador</td><td>{orgaoJulgador}</td></tr>
                <tr><td className="font-bold">Classe Judicial</td><td>{data.dadosIniciais?.classeJudicial}</td></tr>
                <tr><td className="font-bold">Assunto Principal</td><td>{data.assuntos[0]?.descricao || "—"}</td></tr>
                <tr><td className="font-bold">Peticionante</td><td>{user?.name}</td></tr>
                <tr>
                  <td className="font-bold">Status</td>
                  <td><span className="badge-success">Protocolado</span></td>
                </tr>
              </tbody>
            </table>
          </fieldset>

          <fieldset className="pje-fieldset">
            <legend className="pje-fieldset-legend">Documentos Protocolados</legend>
            <table className="data-table">
              <thead><tr><th>Tipo</th><th>Descrição</th></tr></thead>
              <tbody>
                <tr><td>{data.peticao?.tipoDocumento}</td><td>{data.peticao?.descricao}</td></tr>
                {data.peticao?.anexos.map((a) => (
                  <tr key={a.id}><td>{a.tipoDocumento}</td><td>{a.descricao} ({a.nomeArquivo})</td></tr>
                ))}
              </tbody>
            </table>
          </fieldset>

          <div className="flex gap-2 mt-2">
            <button className="btn-primary flex items-center gap-0.5" onClick={() => window.print()}>
              <Download size={10} /> Baixar Recibo
            </button>
            <button className="btn-secondary flex items-center gap-0.5" onClick={handleVoltarHome}>
              <ArrowLeft size={10} /> Voltar para Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="panel-section">
        <div className="panel-header">Protocolando...</div>
        <div className="panel-body text-center py-8">
          <div className="animate-spin h-6 w-6 border-3 border-primary border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-[10px] text-muted-foreground">Realizando distribuição automática e protocolo do processo...</p>
          <p className="text-[9px] text-muted-foreground mt-0.5">Aguarde...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-section">
      <div className="panel-header">6. Resumo e Protocolo</div>
      <div className="panel-body">
        {/* Dados Iniciais */}
        <fieldset className="pje-fieldset">
          <legend className="pje-fieldset-legend">Dados Iniciais</legend>
          {data.dadosIniciais ? (
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <div><span className="font-bold">Matéria:</span> {data.dadosIniciais.materia}</div>
              <div><span className="font-bold">Jurisdição:</span> {data.dadosIniciais.jurisdicao}</div>
              <div><span className="font-bold">Competência:</span> {data.dadosIniciais.competencia}</div>
              <div><span className="font-bold">Classe:</span> {data.dadosIniciais.classeJudicial}</div>
            </div>
          ) : <p className="text-[10px] text-destructive">Dados iniciais não preenchidos.</p>}
        </fieldset>

        {/* Assuntos */}
        <fieldset className="pje-fieldset">
          <legend className="pje-fieldset-legend">Assuntos</legend>
          {data.assuntos.length > 0 ? (
            <table className="data-table">
              <thead><tr><th>Código</th><th>Descrição</th></tr></thead>
              <tbody>
                {data.assuntos.map((a) => <tr key={a.codigo}><td>{a.codigo}</td><td>{a.descricao}</td></tr>)}
              </tbody>
            </table>
          ) : <p className="text-[10px] text-destructive">Nenhum assunto adicionado.</p>}
        </fieldset>

        {/* Partes */}
        <fieldset className="pje-fieldset">
          <legend className="pje-fieldset-legend">Polo Ativo</legend>
          {data.partes.filter((p) => p.polo === "ativo").length > 0 ? (
            <table className="data-table">
              <thead><tr><th>Tipo</th><th>Nome</th><th>CPF/CNPJ</th></tr></thead>
              <tbody>
                {data.partes.filter((p) => p.polo === "ativo").map((p) => (
                  <tr key={p.id}><td>{p.tipoParte}</td><td>{p.nome}</td><td>{p.cpfCnpj}</td></tr>
                ))}
              </tbody>
            </table>
          ) : <p className="text-[10px] text-destructive">Nenhuma parte no polo ativo.</p>}
        </fieldset>

        <fieldset className="pje-fieldset">
          <legend className="pje-fieldset-legend">Polo Passivo</legend>
          {data.partes.filter((p) => p.polo === "passivo").length > 0 ? (
            <table className="data-table">
              <thead><tr><th>Tipo</th><th>Nome</th><th>CPF/CNPJ</th></tr></thead>
              <tbody>
                {data.partes.filter((p) => p.polo === "passivo").map((p) => (
                  <tr key={p.id}><td>{p.tipoParte}</td><td>{p.nome}</td><td>{p.cpfCnpj}</td></tr>
                ))}
              </tbody>
            </table>
          ) : <p className="text-[10px] text-destructive">Nenhuma parte no polo passivo.</p>}
        </fieldset>

        {/* Características */}
        <fieldset className="pje-fieldset">
          <legend className="pje-fieldset-legend">Características</legend>
          {data.caracteristicas ? (
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <div><span className="font-bold">Justiça Gratuita:</span> {data.caracteristicas.justicaGratuita ? "Sim" : "Não"}</div>
              <div><span className="font-bold">Liminar:</span> {data.caracteristicas.pedidoLiminar ? "Sim" : "Não"}</div>
              <div><span className="font-bold">Valor da Causa:</span> R$ {data.caracteristicas.valorCausa}</div>
              <div><span className="font-bold">Segredo de Justiça:</span> {data.caracteristicas.segredoJustica ? "Sim" : "Não"}</div>
            </div>
          ) : <p className="text-[10px] text-destructive">Características não preenchidas.</p>}
        </fieldset>

        {/* Petição */}
        <fieldset className="pje-fieldset">
          <legend className="pje-fieldset-legend">Documento Principal</legend>
          {data.peticao ? (
            <div className="text-[10px]">
              <div><span className="font-bold">Tipo:</span> {data.peticao.tipoDocumento}</div>
              <div><span className="font-bold">Descrição:</span> {data.peticao.descricao}</div>
              <div className="mt-1"><span className="font-bold">Conteúdo:</span></div>
              <div
                className="border p-1.5 max-h-24 overflow-y-auto text-[9px] font-mono mt-0.5 whitespace-pre-wrap"
                style={{
                  backgroundColor: "hsl(220, 14%, 96%)",
                  borderColor: "hsl(220, 12%, 80%)",
                }}
              >
                {data.peticao.conteudo.substring(0, 500)}{data.peticao.conteudo.length > 500 ? "..." : ""}
              </div>
              {data.peticao.anexos.length > 0 && (
                <div className="mt-1.5">
                  <span className="font-bold">Anexos:</span>
                  <table className="data-table mt-0.5">
                    <thead><tr><th>Tipo</th><th>Descrição</th><th>Arquivo</th></tr></thead>
                    <tbody>
                      {data.peticao.anexos.map((a) => (
                        <tr key={a.id}><td>{a.tipoDocumento}</td><td>{a.descricao}</td><td>{a.nomeArquivo}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : <p className="text-[10px] text-destructive">Petição não inserida.</p>}
        </fieldset>

        <div className="flex justify-between mt-2">
          <button className="btn-secondary" onClick={() => setCurrentStep(4)}>&laquo; Voltar para edição</button>
          <button className="btn-primary" onClick={handleProtocolar}>Protocolar</button>
        </div>
      </div>
    </div>
  );
};

export default StepResumo;
