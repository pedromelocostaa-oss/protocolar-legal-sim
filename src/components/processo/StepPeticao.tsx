import { useState } from "react";
import { useProcess, Anexo } from "@/contexts/ProcessContext";
import { mockTiposDocumento, mockTiposDocumentoAnexo } from "@/data/mockData";
import { Plus, X, FileText, File } from "lucide-react";

const StepPeticao = () => {
  const { data, setPeticao } = useProcess();

  const [tipoDocumento, setTipoDocumento] = useState(data.peticao?.tipoDocumento || "Petição Inicial");
  const [descricao, setDescricao] = useState(data.peticao?.descricao || "Petição Inicial");
  const [numero, setNumero] = useState(data.peticao?.numero || "");
  const [sigiloso, setSigiloso] = useState(data.peticao?.sigiloso || false);
  const [conteudo, setConteudo] = useState(data.peticao?.conteudo || "");
  const [anexos, setAnexos] = useState<Anexo[]>(data.peticao?.anexos || []);
  const [mode, setMode] = useState<"pdf" | "editor">("pdf");
  const [pdfFile, setPdfFile] = useState<string>("");

  // Anexo form
  const [showAnexoTipo, setShowAnexoTipo] = useState(false);
  const [anexoTipo, setAnexoTipo] = useState("");
  const [anexoDesc, setAnexoDesc] = useState("");
  const [anexoNum, setAnexoNum] = useState("");
  const [anexoSig, setAnexoSig] = useState(false);
  const [anexoFile, setAnexoFile] = useState("");

  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);
  const [msg, setMsg] = useState("");

  const handleFileUpload = () => {
    // Simulate file upload
    const fakeName = `documento_${Date.now()}.pdf`;
    setPdfFile(fakeName);
    setMsg("");
  };

  const handleSave = () => {
    const content = mode === "editor" ? conteudo : `[Arquivo PDF: ${pdfFile}]`;
    if (!content && mode === "editor") {
      setMsg("Insira o conteúdo da petição.");
      return;
    }
    if (mode === "pdf" && !pdfFile) {
      setMsg("Adicione um arquivo PDF.");
      return;
    }
    setPeticao({ tipoDocumento, descricao, numero, sigiloso, conteudo: content, anexos });
    setMsg("");
  };

  const handleAddAnexo = () => {
    if (!anexoFile) return;
    const newAnexo: Anexo = {
      id: crypto.randomUUID(),
      tipoDocumento: anexoTipo || "Outros",
      descricao: anexoDesc || anexoFile,
      numero: anexoNum,
      sigiloso: anexoSig,
      nomeArquivo: anexoFile,
    };
    const updated = [...anexos, newAnexo];
    setAnexos(updated);
    if (data.peticao) {
      setPeticao({ ...data.peticao, anexos: updated });
    }
    setAnexoTipo("");
    setAnexoDesc("");
    setAnexoNum("");
    setAnexoSig(false);
    setAnexoFile("");
    setShowAnexoTipo(false);
  };

  const removeAnexo = (id: string) => {
    const updated = anexos.filter((a) => a.id !== id);
    setAnexos(updated);
    if (data.peticao) {
      setPeticao({ ...data.peticao, anexos: updated });
    }
  };

  const handleAssinar = () => {
    setSigning(true);
    setTimeout(() => {
      setSigning(false);
      setSigned(true);
    }, 2000);
  };

  return (
    <div>
      {/* Document metadata row */}
      <div className="grid grid-cols-4 gap-3 mb-3 items-end">
        <div>
          <label className="form-label required">Tipo de documento</label>
          <select className="form-field" value={tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)}>
            {mockTiposDocumento.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Descrição *</label>
          <input className="form-field" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        </div>
        <div>
          <label className="form-label">Número (opcional) *</label>
          <input className="form-field" value={numero} onChange={(e) => setNumero(e.target.value)} />
        </div>
        <div>
          <label className="pje-checkbox mt-4">
            <input type="checkbox" checked={sigiloso} onChange={(e) => setSigiloso(e.target.checked)} />
            Sigiloso
          </label>
        </div>
      </div>

      {/* Sua petição */}
      <div className="mb-3">
        <label className="form-label">Sua petição:</label>
        <div className="flex gap-3 mb-2">
          <label className="pje-radio">
            <input type="radio" name="mode" checked={mode === "pdf"} onChange={() => setMode("pdf")} />
            Arquivo PDF
          </label>
          <label className="pje-radio">
            <input type="radio" name="mode" checked={mode === "editor"} onChange={() => setMode("editor")} />
            Editor de texto
          </label>
        </div>

        <div className="alert-warning mb-3">
          Atenção: um documento anexado no modo "Arquivo PDF" será perdido caso uma minuta seja salva no modo "Editor de Texto".
        </div>

        {mode === "pdf" ? (
          <div className="flex items-center gap-3 mb-3">
            <button className="btn-primary" onClick={handleFileUpload}>ADICIONAR</button>
            {pdfFile && (
              <div className="flex items-center gap-2 border px-2 py-1" style={{ borderColor: "hsl(220,12%,80%)" }}>
                <File size={14} />
                <span className="text-[11px]">{pdfFile}</span>
                <button onClick={() => setPdfFile("")} className="text-muted-foreground hover:text-destructive">
                  <X size={12} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <textarea
            className="form-field min-h-[200px] font-mono text-[11px] leading-relaxed mb-3"
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            placeholder="Digite ou cole o conteúdo da petição inicial aqui..."
            style={{ resize: "vertical" }}
          />
        )}

        {msg && <div className="alert-error mb-2">{msg}</div>}
      </div>

      {/* Anexos section */}
      <div className="mb-3">
        <label className="form-label">Anexos:</label>
        <div className="flex gap-2 mb-2">
          <button
            className="btn-primary"
            onClick={() => {
              const fakeName = `anexo_${Date.now()}.pdf`;
              setAnexoFile(fakeName);
              setShowAnexoTipo(true);
            }}
          >
            ADICIONAR
          </button>
          <button className="btn-secondary" onClick={() => { setAnexoFile(""); setShowAnexoTipo(false); }}>LIMPAR</button>
          <span className="text-[10px] text-muted-foreground self-center">Arquivos suportados</span>
        </div>

        {/* Marcar/Desmarcar todos */}
        {anexos.length > 0 && (
          <div className="text-[10px] text-muted-foreground mb-2">
            Marcar/Desmarcar todos
          </div>
        )}

        {/* List of uploaded anexos */}
        {anexos.map((a) => (
          <div key={a.id} className="flex items-center gap-3 border px-2 py-1.5 mb-1" style={{ borderColor: "hsl(220,12%,82%)" }}>
            <FileText size={14} className="text-muted-foreground" />
            <div className="flex-1">
              <div className="text-[11px] font-semibold">{a.nomeArquivo}</div>
              <div className="text-[10px] text-muted-foreground">Tipo: {a.tipoDocumento} | {a.descricao}</div>
            </div>
            <button onClick={() => removeAnexo(a.id)} className="text-destructive">
              <X size={12} />
            </button>
          </div>
        ))}

        {/* Anexo type/desc form */}
        {showAnexoTipo && anexoFile && (
          <div className="border p-3 mt-2" style={{ borderColor: "hsl(220,12%,82%)", backgroundColor: "hsl(220,14%,97%)" }}>
            <div className="flex items-center gap-2 mb-2">
              <File size={14} />
              <span className="text-[11px] font-semibold">{anexoFile}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div>
                <label className="form-label">Tipo de documento</label>
                <select className="form-field" value={anexoTipo} onChange={(e) => setAnexoTipo(e.target.value)}>
                  <option value="">Selecione o tipo</option>
                  {mockTiposDocumentoAnexo.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Descrição</label>
                <input className="form-field" value={anexoDesc} onChange={(e) => setAnexoDesc(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div>
                <label className="form-label">Número (opcional)</label>
                <input className="form-field" value={anexoNum} onChange={(e) => setAnexoNum(e.target.value)} />
              </div>
              <div>
                <label className="pje-checkbox mt-5">
                  <input type="checkbox" checked={anexoSig} onChange={(e) => setAnexoSig(e.target.checked)} />
                  Sigiloso (opcional)
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-primary" onClick={handleAddAnexo}>ADICIONAR</button>
              <button className="btn-secondary" onClick={() => { setAnexoFile(""); setShowAnexoTipo(false); }}>LIMPAR</button>
            </div>
          </div>
        )}
      </div>

      {/* Sign button */}
      <div className="flex justify-end">
        {signing ? (
          <div className="flex items-center gap-2 text-[11px]">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            Processando assinatura...
          </div>
        ) : signed ? (
          <div className="alert-success">Documento(s) assinado(s) com sucesso.</div>
        ) : (
          <button className="btn-primary" onClick={handleAssinar}>
            ASSINAR DOCUMENTO(S)
          </button>
        )}
      </div>
    </div>
  );
};

export default StepPeticao;
