import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { mockActivities } from "@/data/mockData";
import SystemLayout from "@/components/layout/SystemLayout";
import { FileText, Clock, BookOpen, GraduationCap } from "lucide-react";

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <SystemLayout>
      <div className="breadcrumb">
        <span>Início</span>
        <span>&gt;</span>
        <span>Painel do Aluno</span>
      </div>

      <div className="p-2">
        {/* Info bar */}
        <div
          className="flex items-center gap-4 p-2 mb-2 border text-[10px]"
          style={{
            backgroundColor: "hsl(210, 50%, 95%)",
            borderColor: "hsl(210, 50%, 80%)",
            color: "hsl(210, 50%, 30%)",
          }}
        >
          <div className="flex items-center gap-1">
            <GraduationCap size={12} />
            <span><strong>Aluno:</strong> {user.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen size={12} />
            <span><strong>Matrícula:</strong> {user.matricula}</span>
          </div>
          <div className="flex items-center gap-1">
            <span><strong>Curso:</strong> {user.curso}</span>
          </div>
          <div className="flex items-center gap-1">
            <span><strong>Instituição:</strong> {user.instituicao}</span>
          </div>
        </div>

        {/* Activities table */}
        <div className="panel-section mb-2">
          <div className="panel-header flex items-center gap-1">
            <FileText size={11} />
            Atividades Disponíveis
          </div>
          <div className="p-0">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: "30%" }}>Título</th>
                  <th>Disciplina</th>
                  <th>Professor(a)</th>
                  <th>Prazo</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {mockActivities.map((act) => (
                  <tr key={act.id}>
                    <td className="font-semibold">{act.title}</td>
                    <td>{act.disciplina}</td>
                    <td>{act.professor}</td>
                    <td>
                      <span className="flex items-center gap-0.5">
                        <Clock size={9} />
                        {act.prazo}
                      </span>
                    </td>
                    <td>
                      <span className="badge-warning">{act.status}</span>
                    </td>
                    <td>
                      <button
                        className="btn-primary"
                        onClick={() => navigate("/processo")}
                      >
                        Realizar atividade
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity details panel */}
        <div className="panel-section">
          <div className="panel-header">Detalhes da Atividade Selecionada</div>
          <div className="panel-body">
            <div className="grid grid-cols-4 gap-x-3 gap-y-1 text-[10px]">
              <div>
                <span className="font-bold uppercase text-muted-foreground">Atividade:</span>
                <div>{mockActivities[0].title}</div>
              </div>
              <div>
                <span className="font-bold uppercase text-muted-foreground">Disciplina:</span>
                <div>{mockActivities[0].disciplina}</div>
              </div>
              <div>
                <span className="font-bold uppercase text-muted-foreground">Professor(a):</span>
                <div>{mockActivities[0].professor}</div>
              </div>
              <div>
                <span className="font-bold uppercase text-muted-foreground">Prazo:</span>
                <div>{mockActivities[0].prazo}</div>
              </div>
              <div className="col-span-4 mt-1">
                <span className="font-bold uppercase text-muted-foreground">Descrição:</span>
                <div>{mockActivities[0].descricao}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SystemLayout>
  );
};

export default HomePage;
