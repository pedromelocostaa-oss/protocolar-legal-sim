export const mockStudent = {
  id: "1",
  name: "Ana Beatriz de Souza",
  email: "ana.souza@universidade.edu.br",
  matricula: "2023.1.001234",
  curso: "Direito",
  instituicao: "Universidade Federal Acadêmica",
};

export const mockActivities = [
  {
    id: "1",
    title: "Petição Inicial – Responsabilidade Civil",
    disciplina: "Processo Civil I",
    professor: "Professor Carlos Andrade",
    prazo: "20/03/2026",
    status: "Não iniciada" as const,
    descricao:
      "Elabore e protocole uma petição inicial de ação de responsabilidade civil por danos morais e materiais, seguindo o fluxo completo de peticionamento eletrônico.",
  },
];

export const mockMaterias = ["Cível", "Criminal", "Trabalhista", "Fazenda Pública"];

export const mockJurisdicoes = [
  "Belo Horizonte",
  "São Paulo",
  "Rio de Janeiro",
  "Brasília",
  "Curitiba",
  "Porto Alegre",
  "Salvador",
  "Recife",
  "Fortaleza",
];

export const mockCompetencias = [
  "Cível",
  "Família",
  "Fazenda Pública",
  "Juizado Especial Cível",
  "Vara de Sucessões",
];

export const mockClassesJudiciais = [
  "Procedimento Comum Cível",
  "Procedimento do Juizado Especial Cível",
  "Execução de Título Extrajudicial",
  "Cumprimento de Sentença",
  "Mandado de Segurança",
  "Ação Civil Pública",
  "Habeas Corpus",
];

export const mockOrgaosJulgadores = [
  "1ª Vara Cível",
  "2ª Vara Cível",
  "3ª Vara Cível",
  "4ª Vara Cível",
  "1ª Vara de Família",
  "2ª Vara de Família",
  "Juizado Especial Cível",
];

export const mockAssuntos = [
  { codigo: "10431", descricao: "Responsabilidade Civil" },
  { codigo: "10433", descricao: "Indenização por Dano Moral" },
  { codigo: "10434", descricao: "Indenização por Dano Material" },
  { codigo: "10435", descricao: "Perdas e Danos" },
  { codigo: "10445", descricao: "Acidente de Trânsito" },
  { codigo: "10446", descricao: "Erro Médico" },
  { codigo: "10450", descricao: "Obrigação de Fazer / Não Fazer" },
  { codigo: "10455", descricao: "Contratos" },
  { codigo: "10460", descricao: "Direito do Consumidor" },
  { codigo: "10470", descricao: "Dano Estético" },
];

export const mockTiposParte = [
  "Autor",
  "Réu",
  "Terceiro Interessado",
  "Litisconsorte",
  "Assistente",
];

export const mockTiposDocumento = [
  "Petição Inicial",
  "Procuração",
  "Documento de Identificação",
  "Comprovante de Residência",
  "Laudo Pericial",
  "Contrato",
  "Nota Fiscal",
  "Boletim de Ocorrência",
  "Certidão",
  "Declaração",
  "Outros",
];

export const mockEstados = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
  "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
  "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

export function generateProcessNumber(): string {
  const seq = String(Math.floor(1000000 + Math.random() * 9000000));
  const dig = String(Math.floor(10 + Math.random() * 90));
  const ano = "2026";
  const just = "8";
  const trib = "13";
  const orig = "0024";
  return `${seq}-${dig}.${ano}.${just}.${trib}.${orig}`;
}

export function getCurrentDateTime(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}
