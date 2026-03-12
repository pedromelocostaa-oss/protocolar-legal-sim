import { useState } from "react";
import { useProcess, Parte } from "@/contexts/ProcessContext";
import { mockTiposParte, mockEstados } from "@/data/mockData";
import { X } from "lucide-react";

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
  };

  return (
    <div className="border border-border rounded-sm p-3 mb-3">
      <h4 className="text-xs font-bold mb-2 uppercase text-accent">
        {polo === "ativo" ? "Polo Ativo" : "Polo Passivo"} — Cadastrar Parte
      </h4>
      <div className="grid grid-cols-3 gap-2 mb-2">
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
          <label className="form-label">CPF/CNPJ *</label>
          <input className="form-field" value={form.cpfCnpj} onChange={(e) => set("cpfCnpj", e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="col-span-2">
          <label className="form-label">Nome Completo *</label>
          <input className="form-field" value={form.nome} onChange={(e) => set("nome", e.target.value)} />
        </div>
        <div>
          <label className="form-label">CEP</label>
          <input className="form-field" value={form.cep} onChange={(e) => set("cep", e.target.value)} />
        </div>
        <div>
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
        <div>
          <label className="form-label">Bairro</label>
          <input className="form-field" value={form.bairro} onChange={(e) => set("bairro", e.target.value)} />
        </div>
        <div>
          <label className="form-label">Cidade</label>
          <input className="form-field" value={form.cidade} onChange={(e) => set("cidade", e.target.value)} />
        </div>
        <div>
          <label className="form-label">Estado</label>
          <select className="form-field" value={form.estado} onChange={(e) => set("estado", e.target.value)}>
            <option value="">Selecione...</option>
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
        {msg && <span className="text-xs text-destructive">{msg}</span>}
      </div>
    </div>
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

        {poloAtivo.length > 0 && (
          <div className="mb-3">
            <h4 className="text-xs font-bold mb-1">Polo Ativo</h4>
            <table className="data-table">
              <thead>
                <tr><th>Tipo</th><th>Nome</th><th>CPF/CNPJ</th><th>Cidade/UF</th><th>Ação</th></tr>
              </thead>
              <tbody>
                {poloAtivo.map((p) => (
                  <tr key={p.id}>
                    <td>{p.tipoParte}</td>
                    <td>{p.nome}</td>
                    <td>{p.cpfCnpj}</td>
                    <td>{p.cidade}/{p.estado}</td>
                    <td>
                      <button className="btn-secondary flex items-center gap-1" onClick={() => removeParte(p.id)}>
                        <X size={12} /> Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <ParteForm polo="passivo" onAdd={addParte} />

        {poloPassivo.length > 0 && (
          <div className="mb-3">
            <h4 className="text-xs font-bold mb-1">Polo Passivo</h4>
            <table className="data-table">
              <thead>
                <tr><th>Tipo</th><th>Nome</th><th>CPF/CNPJ</th><th>Cidade/UF</th><th>Ação</th></tr>
              </thead>
              <tbody>
                {poloPassivo.map((p) => (
                  <tr key={p.id}>
                    <td>{p.tipoParte}</td>
                    <td>{p.nome}</td>
                    <td>{p.cpfCnpj}</td>
                    <td>{p.cidade}/{p.estado}</td>
                    <td>
                      <button className="btn-secondary flex items-center gap-1" onClick={() => removeParte(p.id)}>
                        <X size={12} /> Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => setCurrentStep(1)}>&larr; Voltar</button>
          <button className="btn-primary" onClick={() => setCurrentStep(3)}>Avançar &rarr;</button>
        </div>
      </div>
    </div>
  );
};

export default StepPartes;
