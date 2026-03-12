import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SystemLayout from "@/components/layout/SystemLayout";
import { Eye, FileText, Search } from "lucide-react";
import { useState } from "react";

const mockProcessos = [
  {
    numero: "5001234-89.2026.8.13.0024",
    classe: "[CÍVEL] PROCEDIMENTO COMUM CÍVEL (7)",
    assunto: "Acidente de Trânsito (10435)",
    comarca: "Belo Horizonte",
    orgao: "2ª Vara Cível",
    dataProtocolo: "10/03/2026 14:32:18",
    poloAtivo: "João da Silva",
    poloPassivo: "Empresa XYZ Ltda",
    status: "Protocolado",
    valorCausa: "50.000,00",
  },
  {
    numero: "5005678-12.2026.8.13.0024",
    classe: "[CÍVEL] PROCEDIMENTO COMUM CÍVEL (7)",
    assunto: "Indenização por Dano Moral (10433)",
    comarca: "Belo Horizonte",
    orgao: "1ª Vara Cível",
    dataProtocolo: "05/03/2026 09:15:44",
    poloAtivo: "Maria Oliveira Santos",
    poloPassivo: "Construtora ABC S.A.",
    status: "Protocolado",
    valorCausa: "30.000,00",
  },
];

const MeusProcessosPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filtroNumero, setFiltroNumero] = useState("");
  const [processoSelecionado, setProcessoSelecionado] = useState<typeof mockProcessos[0] | null>(null);

  if (!user) {
    navigate("/");
    return null;
  }

  const processosFiltrados = mockProcessos.filter((p) => {
    return !filtroNumero || p.numero.includes(filtroNumero);
  });

  return (
    <SystemLayout title="Meus Processos">
      <div className="p-3">
        {/* Filtro */}
        <div className="mb-3">
          <label className="form-label">Número do Processo</label>
          <div className="flex gap-2">
            <input
              className="form-field"
              style={{ maxWidth: 400 }}
              placeholder="Ex: 5001234-89.2026..."
              value={filtroNumero}
              onChange={(e) => setFiltroNumero(e.target.value)}
            />
            <button className="btn-primary flex items-center gap-1" onClick={() => {}}>
              <Search size={12} /> PESQUISAR
            </button>
            <button className="btn-secondary" onClick={() => setFiltroNumero("")}>LIMPAR</button>
          </div>
        </div>

        {/* Tabela */}
        <table className="data-table mb-2">
          <thead>
            <tr>
              <th>Número do Processo</th>
              <th>Classe Judicial</th>
              <th>Assunto Principal</th>
              <th>Comarca</th>
              <th>Órgão Julgador</th>
              <th>Data Protocolo</th>
              <th>Status</th>
              <th style={{ width: 60, textAlign: "center" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {processosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-muted-foreground">
                  Nenhum processo encontrado.
                </td>
              </tr>
            ) : (
              processosFiltrados.map((p, i) => (
                <tr
                  key={i}
                  className="cursor-pointer"
                  style={{ backgroundColor: processoSelecionado?.numero === p.numero ? "hsl(187, 45%, 95%)" : undefined }}
                  onClick={() => setProcessoSelecionado(p)}
                >
                  <td className="font-mono font-semibold" style={{ color: "hsl(187, 45%, 32%)" }}>{p.numero}</td>
                  <td>{p.classe}</td>
                  <td>{p.assunto}</td>
                  <td>{p.comarca}</td>
                  <td>{p.orgao}</td>
                  <td>{p.dataProtocolo}</td>
                  <td><span className="badge-success">{p.status}</span></td>
                  <td className="text-center">
                    <button className="btn-primary text-[10px] px-1.5 py-0.5 flex items-center gap-0.5 mx-auto" onClick={(e) => { e.stopPropagation(); setProcessoSelecionado(p); }}>
                      <Eye size={10} /> Ver
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="text-[10px] text-muted-foreground mb-3">
          {processosFiltrados.length} resultados encontrados
        </div>

        {/* Detalhe */}
        {processoSelecionado && (
          <div className="border bg-card p-3" style={{ borderColor: "hsl(220,12%,82%)" }}>
            <div className="text-[12px] font-bold mb-2">Detalhes do Processo — {processoSelecionado.numero}</div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
              <DetailRow label="Número" value={processoSelecionado.numero} />
              <DetailRow label="Status" value={processoSelecionado.status} />
              <DetailRow label="Classe Judicial" value={processoSelecionado.classe} />
              <DetailRow label="Assunto Principal" value={processoSelecionado.assunto} />
              <DetailRow label="Comarca" value={processoSelecionado.comarca} />
              <DetailRow label="Órgão Julgador" value={processoSelecionado.orgao} />
              <DetailRow label="Polo Ativo" value={processoSelecionado.poloAtivo} />
              <DetailRow label="Polo Passivo" value={processoSelecionado.poloPassivo} />
              <DetailRow label="Valor da Causa" value={`R$ ${processoSelecionado.valorCausa}`} />
              <DetailRow label="Data do Protocolo" value={processoSelecionado.dataProtocolo} />
            </div>
            <div className="mt-3">
              <button className="btn-secondary" onClick={() => setProcessoSelecionado(null)}>Fechar</button>
            </div>
          </div>
        )}
      </div>
    </SystemLayout>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-2 py-0.5 border-b" style={{ borderColor: "hsl(220, 12%, 92%)" }}>
    <span className="text-[10px] font-bold text-muted-foreground w-[140px] shrink-0">{label}:</span>
    <span className="text-[11px] text-foreground">{value}</span>
  </div>
);

export default MeusProcessosPage;
