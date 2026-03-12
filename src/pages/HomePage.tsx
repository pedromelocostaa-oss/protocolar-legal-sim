import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { mockActivities } from "@/data/mockData";
import SystemLayout from "@/components/layout/SystemLayout";

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
        <span>Atividades</span>
      </div>
      <div className="p-4">
        <div className="panel-section">
          <div className="panel-header">Atividades Disponíveis</div>
          <div className="panel-body p-0">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Disciplina</th>
                  <th>Professor</th>
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
                    <td>{act.prazo}</td>
                    <td>
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-sm bg-warning text-warning-foreground">
                        {act.status}
                      </span>
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

        <div className="mt-4 panel-section">
          <div className="panel-header">Detalhes da Atividade</div>
          <div className="panel-body">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="font-semibold">Atividade:</span>{" "}
                {mockActivities[0].title}
              </div>
              <div>
                <span className="font-semibold">Disciplina:</span>{" "}
                {mockActivities[0].disciplina}
              </div>
              <div>
                <span className="font-semibold">Professor(a):</span>{" "}
                {mockActivities[0].professor}
              </div>
              <div>
                <span className="font-semibold">Prazo:</span>{" "}
                {mockActivities[0].prazo}
              </div>
              <div className="col-span-2">
                <span className="font-semibold">Descrição:</span>{" "}
                {mockActivities[0].descricao}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SystemLayout>
  );
};

export default HomePage;
