import { useState } from "react";
import { useProcess, Parte } from "@/contexts/ProcessContext";
import { mockTiposParte, mockEstados } from "@/data/mockData";
import { X, Plus } from "lucide-react";

const emptyParte = (polo: "ativo" | "passivo"): Omit<Parte, "id"> => ({
  polo,
  tipoParte: polo === "ativo" ? "Autor" : "Réu",
  nome: "",
  cpfCnpj: "",
  tipoPessoa: "Física",
  cep: "",
  endereco: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
  email: "",
  telefone: "",
});

const ParteForm = ({
  polo,
  onAdd,
}: {
  polo: "ativo" | "passivo";
  onAdd: (p: Parte) => void;
}) => {
  const [form, setForm] = useState(emptyParte(polo));
  const [msg, setMsg] = useState("");
  const [expanded, setExpanded] = useState(false);

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleAdd = () => {
    if (!form.nome || !form.cpfCnpj) {
      setMsg("Nome e CPF/CNPJ são obrigatórios.");
      return;
    }
    onAdd({ ...form, id: crypto.randomUUID() } as Parte);
    setForm(emptyParte(polo));
    setMsg("");
    setExpanded(false);
  };

  return (
    <fieldset className="pje-fieldset">
      <legend className="pje-fieldset-legend">
        {polo === "ativo" ? "Polo Ativo" : "Polo Passivo"} — Cadastrar Parte
      </legend>

      {!expanded ? (
        <button className="btn-primary flex items-center gap-0.5" onClick={() => setExpanded(true)}>
          <Plus size={10} /> Adicionar Parte ao {polo === "ativo" ? "Polo Ativo" : "Polo Passivo"}
        </button>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-1.5 mb-1.5">
            <div>
              <label className="form-label">Tipo de Parte</label>
              <select className="form-field" value={form.tipoParte} onChange={(e) => set("tipoParte", e.target.value)}>
                {mockTiposParte.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Tipo de Pessoa</label>
              <select className="form-field" value={form.tipoPessoa} onChange={(e) => set("tipoPessoa", e.target.value as "Física" | "Jurídica")}>
                <option>Física</option>
                <option>Jurídica</option>
              </select>
            </div>
            <div>
              <label className="form-label required">CPF/CNPJ</label>
              <input className="form-field" value={form.cpfCnpj} onChange={(e) => set("cpfCnpj", e.target.value)} />
            </div>
            <div>
              <label className="form-label required">Nome Completo</label>
              <input className="form-field" value={form.nome} onChange={(e) => set("nome", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-5 gap-1.5 mb-1.5">
            <div>
              <label className="form-label">CEP</label>
              <input className="form-field" value={form.cep} onChange={(e) => set("cep", e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className="form-label">Endereço</label>
              <input className="form-field" value={form.endereco} onChange={(e) => set("endereco", e.target.value)} />
            </div>
            <div>
              <label className="form-label">Número</label>
              <input className="form-field" value={form.numero} onChange={(e) => set("numero", e.target.value)} />
            </div>
            <div>
              <label className="form-label">Complemento</label>
              <input className="form-field" value={form.complemento} onChange={(e) => set("complemento", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-5 gap-1.5 mb-1.5">
            <div>
              <label className="form-label">Bairro</label>
              <input className="form-field" value={form.bairro} onChange={(e) => set("bairro", e.target.value)} />
            </div>
            <div>
              <label className="form-label">Cidade</label>
              <input className="form-field" value={form.cidade} onChange={(e) => set("cidade", e.target.value)} />
            </div>
            <div>
              <label className="form-label">UF</label>
              <select className="form-field" value={form.estado} onChange={(e) => set("estado", e.target.value)}>
                <option value="">--</option>
                {mockEstados.map((e) => <option key={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">E-mail</label>
              <input className="form-field" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div>
              <label className="form-label">Telefone</label>
              <input className="form-field" value={form.telefone} onChange={(e) => set("telefone", e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-primary" onClick={handleAdd}>Adicionar</button>
            <button className="btn-secondary" onClick={() => setExpanded(false)}>Cancelar</button>
            {msg && <span className="text-[10px] text-destructive font-semibold">{msg}</span>}
          </div>
        </>
      )}
    </fieldset>
  );
};

const PartesTable = ({
  title,
  partes,
  onRemove,
}: {
  title: string;
  partes: Parte[];
  onRemove: (id: string) => void;
}) => {
  if (partes.length === 0) return null;
  return (
    <fieldset className="pje-fieldset">
      <legend className="pje-fieldset-legend">{title}</legend>
      <table className="data-table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Nome</th>
            <th>CPF/CNPJ</th>
            <th>Cidade/UF</th>
            <th style={{ width: "70px" }}>Ação</th>
          </tr>
        </thead>
        <tbody>
          {partes.map((p) => (
            <tr key={p.id}>
              <td>{p.tipoParte}</td>
              <td>{p.nome}</td>
              <td>{p.cpfCnpj}</td>
              <td>{p.cidade}{p.estado ? `/${p.estado}` : ""}</td>
              <td>
                <button className="btn-danger flex items-center gap-0.5" onClick={() => onRemove(p.id)}>
                  <X size={10} /> Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </fieldset>
  );
};

const StepPartes = () => {
  const { data, addParte, removeParte, setCurrentStep } = useProcess();

  const poloAtivo = data.partes.filter((p) => p.polo === "ativo");
  const poloPassivo = data.partes.filter((p) => p.polo === "passivo");

  return (
    <div className="panel-section">
      <div className="panel-header">3. Partes</div>
      <div className="panel-body">
        <ParteForm polo="ativo" onAdd={addParte} />
        <PartesTable title="Polo Ativo — Partes Cadastradas" partes={poloAtivo} onRemove={removeParte} />

        <ParteForm polo="passivo" onAdd={addParte} />
        <PartesTable title="Polo Passivo — Partes Cadastradas" partes={poloPassivo} onRemove={removeParte} />

        <div className="flex justify-between mt-2">
          <button className="btn-secondary" onClick={() => setCurrentStep(1)}>&laquo; Voltar</button>
          <button className="btn-primary" onClick={() => setCurrentStep(3)}>Avançar &raquo;</button>
        </div>
      </div>
    </div>
  );
};

export default StepPartes;
