import { useState } from "react";
import { useProcess, Anexo } from "@/contexts/ProcessContext";
import { mockTiposDocumento } from "@/data/mockData";
import { Plus, X, FileText, Upload, Shield } from "lucide-react";

const StepPeticao = () => {
  const { data, setPeticao, setCurrentStep } = useProcess();

  const [tipoDocumento, setTipoDocumento] = useState(data.peticao?.tipoDocumento || "Petição Inicial");
  const [descricao, setDescricao] = useState(data.peticao?.descricao || "Petição Inicial");
  const [numero, setNumero] = useState(data.peticao?.numero || "");
  const [sigiloso, setSigiloso] = useState(data.peticao?.sigiloso || false);
  const [conteudo, setConteudo] = useState(data.peticao?.conteudo || "");
  const [anexos, setAnexos] = useState<Anexo[]>(data.peticao?.anexos || []);
  const [saved, setSaved] = useState(!!data.peticao);
  const [msg, setMsg] = useState("");

  const [showAnexoForm, setShowAnexoForm] = useState(false);
  const [anexoTipo, setAnexoTipo] = useState("Procuração");
  const [anexoDesc, setAnexoDesc] = useState("");
  const [anexoNum, setAnexoNum] = useState("");
  const [anexoSig, setAnexoSig] = useState(false);
  const [anexoFile, setAnexoFile] = useState("");

  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);

  const handleSalvar = () => {
    if (!conteudo) {
      setMsg("error:Insira o conteúdo da petição.");
      return;
    }
    setPeticao({ tipoDocumento, descricao, numero, sigiloso, conteudo, anexos });
    setSaved(true);
    setMsg("success:Petição salva com sucesso.");
  };

  const handleAddAnexo = () => {
    if (!anexoDesc || !anexoFile) {
      setMsg("error:Preencha descrição e arquivo do anexo.");
      return;
    }
    const newAnexo: Anexo = {
      id: crypto.randomUUID(),
      tipoDocumento: anexoTipo,
      descricao: anexoDesc,
      numero: anexoNum,
      sigiloso: anexoSig,
      nomeArquivo: anexoFile,
    };
    const updated = [...anexos, newAnexo];
    setAnexos(updated);
    setPeticao({ tipoDocumento, descricao, numero, sigiloso, conteudo, anexos: updated });
    setAnexoDesc("");
    setAnexoNum("");
    setAnexoFile("");
    setAnexoSig(false);
    setShowAnexoForm(false);
    setMsg("success:Anexo adicionado com sucesso.");
  };

  const removeAnexo = (id: string) => {
    const updated = anexos.filter((a) => a.id !== id);
    setAnexos(updated);
    if (data.peticao) {
      setPeticao({ ...data.peticao, anexos: updated });
    }
  };

  const handleAssinar = () => {
    if (!saved) {
      setMsg("error:Salve a petição antes de assinar.");
      return;
    }
    setSigning(true);
    setMsg("");
    setTimeout(() => {
      setSigning(false);
      setSigned(true);
      setMsg("success:Documento(s) assinado(s) digitalmente com sucesso.");
    }, 2000);
  };

  const msgType = msg.split(":")[0];
  const msgText = msg.split(":").slice(1).join(":");

  return (
    <div className="panel-section">
      <div className="panel-header">5. Petições e Documentos</div>
      <div className="panel-body">
        {/* Document metadata */}
        <fieldset className="pje-fieldset">
          <legend className="pje-fieldset-legend">Documento Principal</legend>
          <div className="grid grid-cols-4 gap-1.5 mb-1.5">
            <div>
              <label className="form-label">Tipo de Documento</label>
              <select className="form-field" value={tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)}>
                {mockTiposDocumento.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="form-label">Descrição</label>
              <input className="form-field" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Número (opcional)</label>
              <input className="form-field" value={numero} onChange={(e) => setNumero(e.target.value)} />
            </div>
          </div>

          <div className="mb-1.5">
            <label className="pje-checkbox">
              <input type="checkbox" checked={sigiloso} onChange={(e) => setSigiloso(e.target.checked)} />
              Documento sigiloso
            </label>
          </div>
        </fieldset>

        {/* Editor */}
        <fieldset className="pje-fieldset">
          <legend className="pje-fieldset-legend">Editor de Texto</legend>
          <div
            className="mb-1 flex items-center gap-1 px-1 py-0.5 border-b"
            style={{
              backgroundColor: "hsl(220, 14%, 94%)",
              borderColor: "hsl(220, 12%, 80%)",
            }}
          >
            <span className="text-[9px] text-muted-foreground">Barra de ferramentas (simulada)</span>
          </div>
          <textarea
            className="form-field min-h-[220px] font-mono text-[10px] leading-tight"
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            placeholder="Digite ou cole o conteúdo da petição inicial aqui..."
            style={{ resize: "vertical" }}
          />
        </fieldset>

        {msg && (
          <div className={msgType === "success" ? "alert-success mb-1.5" : "alert-error mb-1.5"}>
            {msgText}
          </div>
        )}

        <div className="flex items-center gap-2 mb-2">
          <button className="btn-success" onClick={handleSalvar}>Salvar</button>
        </div>

        {/* Attachments */}
        <fieldset className="pje-fieldset">
          <legend className="pje-fieldset-legend flex items-center gap-1">
            <Upload size={10} /> Anexos
          </legend>

          {!saved && (
            <p className="text-[9px] text-muted-foreground italic">Salve a petição para habilitar adição de anexos.</p>
          )}

          {saved && !showAnexoForm && (
            <button className="btn-primary flex items-center gap-0.5 mb-1.5" onClick={() => setShowAnexoForm(true)}>
              <Plus size={10} /> Adicionar Anexo
            </button>
          )}

          {showAnexoForm && (
            <div
              className="p-2 mb-1.5 border"
              style={{
                backgroundColor: "hsl(220, 14%, 96%)",
                borderColor: "hsl(220, 12%, 80%)",
              }}
            >
              <div className="grid grid-cols-4 gap-1.5 mb-1.5">
                <div>
                  <label className="form-label">Tipo</label>
                  <select className="form-field" value={anexoTipo} onChange={(e) => setAnexoTipo(e.target.value)}>
                    {mockTiposDocumento.filter((t) => t !== "Petição Inicial").map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label required">Descrição</label>
                  <input className="form-field" value={anexoDesc} onChange={(e) => setAnexoDesc(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Número</label>
                  <input className="form-field" value={anexoNum} onChange={(e) => setAnexoNum(e.target.value)} />
                </div>
                <div>
                  <label className="form-label required">Arquivo (simulado)</label>
                  <input
                    className="form-field"
                    value={anexoFile}
                    onChange={(e) => setAnexoFile(e.target.value)}
                    placeholder="Ex: procuracao.pdf"
                  />
                </div>
              </div>
              <div className="mb-1.5">
                <label className="pje-checkbox">
                  <input type="checkbox" checked={anexoSig} onChange={(e) => setAnexoSig(e.target.checked)} />
                  Sigiloso
                </label>
              </div>
              <div className="flex gap-1.5">
                <button className="btn-primary" onClick={handleAddAnexo}>Confirmar</button>
                <button className="btn-secondary" onClick={() => setShowAnexoForm(false)}>Cancelar</button>
              </div>
            </div>
          )}

          {anexos.length > 0 && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Descrição</th>
                  <th>Arquivo</th>
                  <th>Sigiloso</th>
                  <th style={{ width: "70px" }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {anexos.map((a) => (
                  <tr key={a.id}>
                    <td>{a.tipoDocumento}</td>
                    <td>{a.descricao}</td>
                    <td className="flex items-center gap-0.5"><FileText size={10} /> {a.nomeArquivo}</td>
                    <td>{a.sigiloso ? "Sim" : "Não"}</td>
                    <td>
                      <button className="btn-danger flex items-center gap-0.5" onClick={() => removeAnexo(a.id)}>
                        <X size={10} /> Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </fieldset>

        {/* Sign */}
        <fieldset className="pje-fieldset">
          <legend className="pje-fieldset-legend flex items-center gap-1">
            <Shield size={10} /> Assinatura Digital
          </legend>
          {signing ? (
            <div className="flex items-center gap-2 text-[10px] text-accent py-1">
              <div className="animate-spin h-3.5 w-3.5 border-2 border-accent border-t-transparent rounded-full" />
              Processando assinatura digital... Aguarde.
            </div>
          ) : signed ? (
            <div className="alert-success">Documento(s) assinado(s) digitalmente com sucesso.</div>
          ) : (
            <button className="btn-primary" onClick={handleAssinar}>
              {anexos.length > 0 ? "Assinar documento(s)" : "Assinar sem anexos"}
            </button>
          )}
        </fieldset>

        <div className="flex justify-between mt-2">
          <button className="btn-secondary" onClick={() => setCurrentStep(3)}>&laquo; Voltar</button>
          {signed && (
            <button className="btn-primary" onClick={() => setCurrentStep(5)}>Avançar &raquo;</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepPeticao;
