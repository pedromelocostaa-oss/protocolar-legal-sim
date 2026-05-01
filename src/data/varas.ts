export interface Vara {
  codigo: string;
  nome: string;
  competencia: string;
  cidade: string;
}

export const varasFicticias: Vara[] = [
  { codigo: '3800', nome: '1ª Vara Federal de Belo Horizonte', competencia: 'Cível', cidade: 'Belo Horizonte' },
  { codigo: '3801', nome: '2ª Vara Federal de Belo Horizonte', competencia: 'Cível', cidade: 'Belo Horizonte' },
  { codigo: '3802', nome: '3ª Vara Federal de Belo Horizonte', competencia: 'Cível/Fazenda Pública', cidade: 'Belo Horizonte' },
  { codigo: '3803', nome: '4ª Vara Federal de Belo Horizonte', competencia: 'Previdenciária', cidade: 'Belo Horizonte' },
  { codigo: '3804', nome: '5ª Vara Federal de Belo Horizonte', competencia: 'Previdenciária', cidade: 'Belo Horizonte' },
  { codigo: '3805', nome: '6ª Vara Federal de Belo Horizonte', competencia: 'Criminal', cidade: 'Belo Horizonte' },
  { codigo: '3806', nome: '1ª Vara Federal de Contagem', competencia: 'Cível', cidade: 'Contagem' },
  { codigo: '3807', nome: '1ª Vara Federal de Juiz de Fora', competencia: 'Cível', cidade: 'Juiz de Fora' },
  { codigo: '3808', nome: '2ª Vara Federal de Juiz de Fora', competencia: 'Previdenciária', cidade: 'Juiz de Fora' },
  { codigo: '3809', nome: 'Juizado Especial Federal de Belo Horizonte', competencia: 'JEF', cidade: 'Belo Horizonte' },
  { codigo: '3810', nome: '1ª Vara Federal de Uberlândia', competencia: 'Cível', cidade: 'Uberlândia' },
  { codigo: '3811', nome: '2ª Vara Federal de Uberlândia', competencia: 'Previdenciária', cidade: 'Uberlândia' },
];

export const juizesFicticios: Record<string, string> = {
  '3800': 'Dr. Antônio Carlos Mendes',
  '3801': 'Dra. Renata Oliveira Fonseca',
  '3802': 'Dr. Paulo Roberto Nascimento',
  '3803': 'Dra. Cristiane Alves Souza',
  '3804': 'Dr. Marcelo Lima Santos',
  '3805': 'Dra. Fernanda Costa Xavier',
  '3806': 'Dr. Ricardo Borges Pereira',
  '3807': 'Dra. Ana Paula Ferreira',
  '3808': 'Dr. Eduardo Rocha Lima',
  '3809': 'Dra. Juliana Martins Costa',
  '3810': 'Dr. Carlos Henrique Prado',
  '3811': 'Dra. Sandra Regina Teixeira',
};

export function sortearVara(varasPermitidas?: string[]): Vara {
  const lista = varasPermitidas
    ? varasFicticias.filter(v => varasPermitidas.includes(v.codigo))
    : varasFicticias;
  return lista[Math.floor(Math.random() * lista.length)];
}

export function getVaraNome(codigo: string): string {
  return varasFicticias.find(v => v.codigo === codigo)?.nome ?? codigo;
}

export function getJuiz(varaCode: string): string {
  return juizesFicticios[varaCode] ?? 'Dr. João da Silva';
}
