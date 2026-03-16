import { useState } from "react";
import { useProcess, Parte } from "@/contexts/ProcessContext";
import { mockTiposParte, mockTiposPartePassivo, mockTiposPessoa, mockEstados } from "@/data/mockData";
import { Plus, X, Edit2 } from "lucide-react";

const StepPartes = () => {
  const { data, addParte, removeParte } = useProcess();
  const [showModal, setShowModal] = useState(false);
  const [modalPolo, setModalPolo] = useState<"ativo" | "passivo">("ativo");
  const [modalStep, setModalStep] = useState(1);

  // Step 1 fields
  const [tipoParte, setTipoParte] = useState("");

  // Step 2 fields (pré-cadastro)
  const [tipoPessoa, setTipoPessoa] = useState("Física");
  const [brasileiro, setBrasileiro] = useState(true);
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [nomeSocial, setNomeSocial] = useState(false);
  const [passaporte, setPassaporte] = useState("");
  const [nacionalidade, setNacionalidade] = useState("");

  // Step 3 fields (complementação - endereço)
  const [cep, setCep] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  const [msg, setMsg] = useState("");

  const poloAtivo = data.partes.filter((p) => p.polo === "ativo");
  const poloPassivo = data.partes.filter((p) => p.polo === "passivo");

  const openModal = (polo: "ativo" | "passivo") => {
    setModalPolo(polo);
    setModalStep(1);
    setTipoParte("");
    setTipoPessoa("Física");
    setBrasileiro(true);
    setCpf("");
    setNome("");
    setNomeFantasia("");
    setNomeSocial(false);
    setPassaporte("");
    setNacionalidade("");
    setCep("");
    setEstado("");
    setCidade("");
    setBairro("");
    setLogradouro("");
    setNumero("");
    setComplemento("");
    setEmail("");
    setTelefone("");
    setMsg("");
    setShowModal(true);
  };

  const isJuridica = tipoPessoa === "Jurídica";
  const docLabel = isJuridica ? "CNPJ" : "CPF";
  const nomeLabel = isJuridica ? "Nome empresarial" : "Nome civil";

  const handleConfirm = () => {
    if (!nome || (!brasileiro && !passaporte) || (brasileiro && !cpf)) {
      setMsg(`${nomeLabel} e ${brasileiro ? docLabel : "Passaporte"} são obrigatórios.`);
      return;
    }
    setModalStep(2);
    setMsg("");
  };

  const handleVincular = () => {
    const parte: Parte = {
      id: crypto.randomUUID(),
      polo: modalPolo,
      tipoParte,
      nome,
      cpfCnpj: brasileiro ? cpf : passaporte,
      tipoPessoa: tipoPessoa as "Física" | "Jurídica",
      cep,
      endereco: logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      email,
      telefone,
    };
    addParte(parte);
    setShowModal(false);
  };

  const tiposParteOptions = modalPolo === "ativo" ? mockTiposParte : mockTiposPartePassivo;

  return (
    <div>
      {/* Polo Ativo */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <div className="text-[12px] font-bold mb-2">Polo Ativo</div>
          <div className="flex gap-2 mb-2">
            <button className="btn-primary flex items-center gap-1" onClick={() => openModal("ativo")}>
              <Plus size={12} /> Parte
            </button>
            <span className="text-[11px] text-muted-foreground self-center">+ Procurador | Terceiro Vinculado</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th></th>
                <th>Participante</th>
                <th style={{ width: 50 }}></th>
              </tr>
            </thead>
            <tbody>
              {poloAtivo.length === 0 ? (
                <tr><td colSpan={3} className="text-center text-muted-foreground">0 resultados encontrados</td></tr>
              ) : (
                poloAtivo.map((p) => (
                  <tr key={p.id}>
                    <td><Edit2 size={11} className="text-muted-foreground" /></td>
                    <td>{p.nome} — {p.tipoPessoa === "Jurídica" ? "CNPJ" : "CPF"}: {p.cpfCnpj} ({p.tipoParte})</td>
                    <td>
                      <button className="text-destructive" onClick={() => removeParte(p.id)}>
                        <X size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="text-[10px] text-muted-foreground mt-1">{poloAtivo.length} resultados encontrados</div>
        </div>

        {/* Polo Passivo */}
        <div className="flex-1">
          <div className="text-[12px] font-bold mb-2">Polo Passivo</div>
          <div className="flex gap-2 mb-2">
            <button className="btn-primary flex items-center gap-1" onClick={() => openModal("passivo")}>
              <Plus size={12} /> Parte
            </button>
            <span className="text-[11px] text-muted-foreground self-center">+ Procurador | Terceiro Vinculado</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th></th>
                <th>Participante</th>
                <th style={{ width: 50 }}></th>
              </tr>
            </thead>
            <tbody>
              {poloPassivo.length === 0 ? (
                <tr><td colSpan={3} className="text-center text-muted-foreground">0 resultados encontrados</td></tr>
              ) : (
                poloPassivo.map((p) => (
                  <tr key={p.id}>
                    <td><Edit2 size={11} className="text-muted-foreground" /></td>
                    <td>{p.nome} — CPF: {p.cpfCnpj} ({p.tipoParte})</td>
                    <td>
                      <button className="text-destructive" onClick={() => removeParte(p.id)}>
                        <X size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="text-[10px] text-muted-foreground mt-1">{poloPassivo.length} resultados encontrados</div>
        </div>
      </div>

      {/* Outros Participantes */}
      <div className="mb-4">
        <div className="text-[12px] font-bold mb-2">Outros Participantes</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Participante</th>
              <th>Procurador</th>
              <th>Terceiro Vinculado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={3} className="text-center text-muted-foreground">0 resultados encontrados</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="pje-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="pje-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pje-modal-header">
              <span>Associar parte ao processo</span>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>
            <div className="pje-modal-body">
              {modalStep === 1 && (
                <>
                  <div className="text-[12px] font-semibold mb-3 border-b pb-1" style={{ borderColor: "hsl(220,12%,85%)" }}>
                    1 Passo → Tipo de Vinculação
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Tipo da Parte</label>
                    <select className="form-field" value={tipoParte} onChange={(e) => setTipoParte(e.target.value)}>
                      <option value="">Selecione</option>
                      {tiposParteOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  {tipoParte && (
                    <>
                      <div className="text-[12px] font-semibold mb-3 border-b pb-1" style={{ borderColor: "hsl(220,12%,85%)" }}>
                        1° Passo • Pré-cadastro
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Tipo de pessoa *</label>
                        <div className="flex gap-4">
                          {mockTiposPessoa.map((t) => (
                            <label key={t} className="pje-radio">
                              <input
                                type="radio"
                                name="tipoPessoa"
                                checked={tipoPessoa === t}
                                onChange={() => setTipoPessoa(t)}
                              />
                              {t}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Brasileiro? *</label>
                        <div className="flex gap-4">
                          <label className="pje-radio">
                            <input type="radio" name="brasileiro" checked={brasileiro} onChange={() => setBrasileiro(true)} />
                            Sim
                          </label>
                          <label className="pje-radio">
                            <input type="radio" name="brasileiro" checked={!brasileiro} onChange={() => setBrasileiro(false)} />
                            Não
                          </label>
                        </div>
                      </div>

                      {brasileiro ? (
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="form-label required">{docLabel}</label>
                            <div className="flex gap-2">
                              <input className="form-field" value={cpf} onChange={(e) => setCpf(e.target.value)} />
                              <button className="btn-primary">PESQUISAR</button>
                              <button className="btn-secondary">LIMPAR</button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="form-label required">Passaporte</label>
                            <div className="flex gap-2">
                              <input className="form-field" value={passaporte} onChange={(e) => setPassaporte(e.target.value)} />
                              <button className="btn-primary">PESQUISAR</button>
                              <button className="btn-secondary">LIMPAR</button>
                            </div>
                          </div>
                          <div>
                            <label className="form-label required">Nacionalidade</label>
                            <input className="form-field" value={nacionalidade} onChange={(e) => setNacionalidade(e.target.value)} />
                          </div>
                        </div>
                      )}

                      <div className="mb-3">
                        <label className="form-label">{nomeLabel}</label>
                        <input className="form-field" value={nome} onChange={(e) => setNome(e.target.value)} />
                      </div>

                      {isJuridica && (
                        <div className="mb-3">
                          <label className="form-label">Nome fantasia</label>
                          <input className="form-field" value={nomeFantasia} onChange={(e) => setNomeFantasia(e.target.value)} />
                        </div>
                      )}

                      {!isJuridica && (
                        <div className="mb-3">
                          <label className="pje-checkbox">
                            <input type="checkbox" checked={nomeSocial} onChange={(e) => setNomeSocial(e.target.checked)} />
                            Nome social?
                          </label>
                        </div>
                      )}

                      {msg && <div className="alert-error mb-2">{msg}</div>}

                      <button className="btn-primary" onClick={handleConfirm}>CONFIRMAR</button>
                    </>
                  )}
                </>
              )}

              {modalStep === 2 && (
                <>
                  <div className="text-[12px] font-semibold mb-3 border-b pb-1" style={{ borderColor: "hsl(220,12%,85%)" }}>
                    2° Passo • Complementação do cadastro
                  </div>

                  <div className="mb-2">
                    <label className="form-label">Tipo da Parte</label>
                    <input className="form-field" value={tipoParte} disabled />
                  </div>

                  {/* Sub-tabs */}
                  <div className="pje-tab-bar mb-3">
                    <span className="pje-tab-item active">ENDEREÇOS</span>
                    <span className="pje-tab-item opacity-50">MEIOS DE CONTATO</span>
                    <span className="pje-tab-item opacity-50">OUTROS NOMES</span>
                    <span className="pje-tab-item opacity-50">OUTRAS FILIAÇÕES</span>
                  </div>

                  <div className="text-[11px] font-bold mb-2">ADICIONAR ENDEREÇO</div>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="form-label required">CEP (99999-999)</label>
                      <input className="form-field" value={cep} onChange={(e) => setCep(e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Estado</label>
                      <select className="form-field" value={estado} onChange={(e) => setEstado(e.target.value)}>
                        <option value="">Selecione</option>
                        {mockEstados.map((e) => <option key={e} value={e}>{e}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Cidade</label>
                      <input className="form-field" value={cidade} onChange={(e) => setCidade(e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="form-label">Bairro</label>
                      <input className="form-field" value={bairro} onChange={(e) => setBairro(e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label required">Logradouro</label>
                      <input className="form-field" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Número</label>
                      <input className="form-field" value={numero} onChange={(e) => setNumero(e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="form-label">Complemento</label>
                      <input className="form-field" value={complemento} onChange={(e) => setComplemento(e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">E-mail</label>
                      <input className="form-field" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Telefone</label>
                      <input className="form-field" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="btn-primary" onClick={handleVincular}>VINCULAR PARTE AO PROCESSO</button>
                    <button className="btn-secondary" onClick={() => setShowModal(false)}>CANCELAR</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepPartes;
