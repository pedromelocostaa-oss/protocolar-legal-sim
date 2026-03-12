import { useState } from "react";
import { useProcess, Anexo } from "@/contexts/ProcessContext";
import { mockTiposDocumento } from "@/data/mockData";
import { Plus, X, FileText } from "lucide-react";

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

  // Anexo form
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
      setMsg("Insira o conteúdo da petição.");
      return;
    }
    setPeticao({ tipoDocumento, descricao, numero, sigiloso, conteudo, anexos });
    setSaved(true);
    setMsg("Petição salva com sucesso.");
  };

  const handleAddAnexo = () => {
    if (!anexoDesc || !anexoFile) {
      setMsg("Preencha descrição e arquivo do anexo.");
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
    setMsg("Anexo adicionado.");
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
      setMsg("Salve a petição antes de assinar.");
      return;
    }
    setSigning(true);
    setTimeout(() => {
      setSigning(false);
      setSigned(true);
      setMsg("Documento(s) assinado(s) digitalmente com sucesso.");
    }, 2000);
  };

  return (
    <div className="panel-section">
      <div className="panel-header">5. Petições e Documentos</div>
      <div className="panel-body">
        {/* Petition form */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div>
            <label className="form-label">Tipo de Documento</label>
            <select className="form-field" value={tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)}>
              {mockTiposDocumento.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Descrição</label>
            <input className="form-field" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Número (opcional)</label>
            <input className="form-field" value={numero} onChange={(e) => setNumero(e.target.value)} />
          </div>
        </div>

        <div className="mb-3">
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={sigiloso} onChange={(e) => setSigiloso(e.target.checked)} />
            Documento sigiloso
          </label>
        </div>

        <div className="mb-3">
          <label className="form-label">Conteúdo da Petição</label>
          <textarea
            className="form-field min-h-[250px] font-mono text-xs"
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            placeholder="Digite ou cole o conteúdo da petição inicial aqui..."
          />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <button className="btn-success" onClick={handleSalvar}>Salvar</button>
          {msg && <span className="text-xs text-success">{msg}</span>}
        </div>

        {/* Anexos */}
        <div className="border-t border-border pt-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold">Anexos</h4>
            {saved && (
              <button className="btn-primary flex items-center gap-1" onClick={() => setShowAnexoForm(true)}>
                <Plus size={12} /> Adicionar
              </button>
            )}
          </div>

          {!saved && (
            <p className="text-[10px] text-muted-foreground">Salve a petição para habilitar adição de anexos.</p>
          )}

          {showAnexoForm && (
            <div className="border border-border rounded-sm p-3 mb-2 bg-muted">
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <label className="form-label">Tipo</label>
                  <select className="form-field" value={anexoTipo} onChange={(e) => setAnexoTipo(e.target.value)}>
                    {mockTiposDocumento.filter((t) => t !== "Petição Inicial").map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Descrição *</label>
                  <input className="form-field" value={anexoDesc} onChange={(e) => setAnexoDesc(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Número</label>
                  <input className="form-field" value={anexoNum} onChange={(e) => setAnexoNum(e.target.value)} />
                </div>
              </div>
              <div className="mb-2">
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={anexoSig} onChange={(e) => setAnexoSig(e.target.checked)} />
                  Sigiloso
                </label>
              </div>
              <div className="mb-2">
                <label className="form-label">Arquivo (simulado)</label>
                <input
                  className="form-field"
                  value={anexoFile}
                  onChange={(e) => setAnexoFile(e.target.value)}
                  placeholder="Ex: procuracao.pdf"
                />
              </div>
              <div className="flex gap-2">
                <button className="btn-primary" onClick={handleAddAnexo}>Confirmar</button>
                <button className="btn-secondary" onClick={() => setShowAnexoForm(false)}>Cancelar</button>
              </div>
            </div>
          )}

          {anexos.length > 0 && (
            <table className="data-table">
              <thead>
                <tr><th>Tipo</th><th>Descrição</th><th>Arquivo</th><th>Sigiloso</th><th>Ação</th></tr>
              </thead>
              <tbody>
                {anexos.map((a) => (
                  <tr key={a.id}>
                    <td>{a.tipoDocumento}</td>
                    <td>{a.descricao}</td>
                    <td className="flex items-center gap-1"><FileText size={12} /> {a.nomeArquivo}</td>
                    <td>{a.sigiloso ? "Sim" : "Não"}</td>
                    <td>
                      <button className="btn-secondary flex items-center gap-1" onClick={() => removeAnexo(a.id)}>
                        <X size={12} /> Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Assinar */}
        <div className="border-t border-border pt-3 mb-3">
          {signing ? (
            <div className="text-xs text-accent flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-accent border-t-transparent rounded-full" />
              Processando assinatura digital...
            </div>
          ) : signed ? (
            <div className="text-xs text-success font-semibold">Documento(s) assinado(s) digitalmente.</div>
          ) : (
            <button className="btn-primary" onClick={handleAssinar}>
              {anexos.length > 0 ? "Assinar documento(s)" : "Assinar sem anexos"}
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => setCurrentStep(3)}>&larr; Voltar</button>
          {signed && (
            <button className="btn-primary" onClick={() => setCurrentStep(5)}>Avançar &rarr;</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepPeticao;
