import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SystemLayout from "@/components/layout/SystemLayout";
import { Eye, FileText, Search } from "lucide-react";
import { useState } from "react";

const mockProcessos = [
  {
    numero: "5001234-89.2026.8.13.0024",
    classe: "Procedimento Comum Cível",
    assunto: "Responsabilidade Civil",
    comarca: "Belo Horizonte",
    orgao: "2ª Vara Cível",
    dataProtocolo: "10/03/2026 14:32:18",
    poloAtivo: "João da Silva",
    poloPassivo: "Empresa XYZ Ltda",
    status: "Protocolado",
    valorCausa: "R$ 50.000,00",
  },
  {
    numero: "5005678-12.2026.8.13.0024",
    classe: "Procedimento Comum Cível",
    assunto: "Indenização por Dano Moral",
    comarca: "Belo Horizonte",
    orgao: "1ª Vara Cível",
    dataProtocolo: "05/03/2026 09:15:44",
    poloAtivo: "Maria Oliveira Santos",
    poloPassivo: "Construtora ABC S.A.",
    status: "Protocolado",
    valorCausa: "R$ 30.000,00",
  },
];

const MeusProcessosPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filtroNumero, setFiltroNumero] = useState("");
  const [filtroClasse, setFiltroClasse] = useState("");
  const [processoSelecionado, setProcessoSelecionado] = useState<typeof mockProcessos[0] | null>(null);

  if (!user) {
    navigate("/");
    return null;
  }

  const processosFiltrados = mockProcessos.filter((p) => {
    const matchNumero = !filtroNumero || p.numero.includes(filtroNumero);
    const matchClasse = !filtroClasse || p.classe.toLowerCase().includes(filtroClasse.toLowerCase());
    return matchNumero && matchClasse;
  });

  return (
    <SystemLayout>
      <div className="breadcrumb">
        <a href="#" onClick={(e) => { e.preventDefault(); navigate("/home"); }}>Início</a>
        <span>&gt;</span>
        <span>Processo</span>
        <span>&gt;</span>
        <span className="font-bold text-foreground">Meus Processos</span>
      </div>

      <div className="p-2">
        <div className="panel-section mb-2">
          <div className="panel-header flex items-center gap-1">
            <FileText size={11} />
            Meus Processos
          </div>
          <div className="p-2">
            {/* Filtros */}
            <fieldset className="border px-2 py-1.5 mb-2" style={{ borderColor: "hsl(220, 12%, 80%)" }}>
              <legend className="text-[9px] font-bold uppercase px-1" style={{ color: "hsl(220, 30%, 35%)" }}>
                Filtros
              </legend>
              <div className="grid grid-cols-3 gap-2 items-end">
                <div className="form-field">
                  <label>Número do Processo</label>
                  <input
                    type="text"
                    placeholder="Ex: 5001234-89.2026..."
                    value={filtroNumero}
                    onChange={(e) => setFiltroNumero(e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label>Classe Judicial</label>
                  <input
                    type="text"
                    placeholder="Ex: Procedimento Comum"
                    value={filtroClasse}
                    onChange={(e) => setFiltroClasse(e.target.value)}
                  />
                </div>
                <div>
                  <button
                    className="btn-pje flex items-center gap-1"
                    onClick={() => { setFiltroNumero(""); setFiltroClasse(""); }}
                  >
                    <Search size={10} />
                    Limpar Filtros
                  </button>
                </div>
              </div>
            </fieldset>

            {/* Tabela de processos */}
            <div className="overflow-x-auto">
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th>Número do Processo</th>
                    <th>Classe Judicial</th>
                    <th>Assunto Principal</th>
                    <th>Comarca</th>
                    <th>Órgão Julgador</th>
                    <th>Data Protocolo</th>
                    <th>Status</th>
                    <th style={{ width: "60px", textAlign: "center" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {processosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-4 text-[10px]" style={{ color: "hsl(220, 10%, 50%)" }}>
                        Nenhum processo encontrado.
                      </td>
                    </tr>
                  ) : (
                    processosFiltrados.map((p, i) => (
                      <tr
                        key={i}
                        className="cursor-pointer"
                        style={{ backgroundColor: processoSelecionado?.numero === p.numero ? "hsl(220, 60%, 95%)" : undefined }}
                        onClick={() => setProcessoSelecionado(p)}
                      >
                        <td className="font-mono font-semibold" style={{ color: "hsl(220, 60%, 35%)" }}>{p.numero}</td>
                        <td>{p.classe}</td>
                        <td>{p.assunto}</td>
                        <td>{p.comarca}</td>
                        <td>{p.orgao}</td>
                        <td>{p.dataProtocolo}</td>
                        <td>
                          <span
                            className="inline-block px-1.5 py-0.5 text-[9px] font-bold rounded-sm"
                            style={{
                              backgroundColor: "hsl(140, 40%, 90%)",
                              color: "hsl(140, 50%, 25%)",
                              border: "1px solid hsl(140, 30%, 75%)",
                            }}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn-pje text-[9px] px-1.5 py-0.5 inline-flex items-center gap-0.5"
                            onClick={(e) => { e.stopPropagation(); setProcessoSelecionado(p); }}
                          >
                            <Eye size={9} />
                            Ver
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="text-[9px] mt-1" style={{ color: "hsl(220, 10%, 50%)" }}>
              Exibindo {processosFiltrados.length} de {mockProcessos.length} processo(s)
            </div>
          </div>
        </div>

        {/* Detalhe do processo selecionado */}
        {processoSelecionado && (
          <div className="panel-section">
            <div className="panel-header flex items-center gap-1">
              <Eye size={11} />
              Detalhes do Processo — {processoSelecionado.numero}
            </div>
            <div className="p-2">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <DetailRow label="Número" value={processoSelecionado.numero} mono />
                <DetailRow label="Status" value={processoSelecionado.status} />
                <DetailRow label="Classe Judicial" value={processoSelecionado.classe} />
                <DetailRow label="Assunto Principal" value={processoSelecionado.assunto} />
                <DetailRow label="Comarca" value={processoSelecionado.comarca} />
                <DetailRow label="Órgão Julgador" value={processoSelecionado.orgao} />
                <DetailRow label="Polo Ativo" value={processoSelecionado.poloAtivo} />
                <DetailRow label="Polo Passivo" value={processoSelecionado.poloPassivo} />
                <DetailRow label="Valor da Causa" value={processoSelecionado.valorCausa} />
                <DetailRow label="Data do Protocolo" value={processoSelecionado.dataProtocolo} />
              </div>

              <div className="mt-2 pt-1.5 border-t flex gap-1" style={{ borderColor: "hsl(220, 12%, 85%)" }}>
                <button className="btn-pje flex items-center gap-1" onClick={() => setProcessoSelecionado(null)}>
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SystemLayout>
  );
};

const DetailRow = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
  <div className="flex gap-2 py-0.5 border-b" style={{ borderColor: "hsl(220, 12%, 92%)" }}>
    <span className="text-[9px] font-bold uppercase w-[120px] shrink-0" style={{ color: "hsl(220, 15%, 45%)" }}>
      {label}:
    </span>
    <span className={`text-[10px] ${mono ? "font-mono" : ""}`} style={{ color: "hsl(220, 20%, 20%)" }}>
      {value}
    </span>
  </div>
);

export default MeusProcessosPage;
