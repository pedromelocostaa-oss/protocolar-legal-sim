export interface ClasseProcessual {
  codigo: string;
  descricao: string;
  grupo: string;
}

export interface AssuntoCNJ {
  codigo: string;
  descricao: string;
  area: string;
}

export const classesProcessuais: ClasseProcessual[] = [
  { codigo: '7', descricao: 'Procedimento Comum Cível', grupo: 'CÍVEL' },
  { codigo: '120', descricao: 'Mandado de Segurança Cível', grupo: 'CONSTITUCIONAL' },
  { codigo: '65', descricao: 'Ação Civil Pública', grupo: 'CÍVEL' },
  { codigo: '436', descricao: 'Procedimento do Juizado Especial Cível', grupo: 'JEF' },
  { codigo: '32', descricao: 'Consignação em Pagamento', grupo: 'CÍVEL' },
  { codigo: '156', descricao: 'Cumprimento de Sentença', grupo: 'EXECUÇÃO' },
  { codigo: '159', descricao: 'Execução de Título Extrajudicial', grupo: 'EXECUÇÃO' },
  { codigo: '281', descricao: 'Ação Rescisória', grupo: 'CÍVEL' },
  { codigo: '1028', descricao: 'Habeas Data', grupo: 'CONSTITUCIONAL' },
  { codigo: '58', descricao: 'Interdito Proibitório', grupo: 'CÍVEL' },
  { codigo: '1116', descricao: 'Ação de Alimentos', grupo: 'FAMÍLIA' },
  { codigo: '475', descricao: 'Inventário e Partilha', grupo: 'SUCESSÕES' },
  { codigo: '48', descricao: 'Embargos de Terceiro', grupo: 'CÍVEL' },
  { codigo: '12078', descricao: 'Cumprimento de Sentença contra a Fazenda Pública', grupo: 'EXECUÇÃO' },
  { codigo: '81', descricao: 'Busca e Apreensão em Alienação Fiduciária', grupo: 'CÍVEL' },
  { codigo: '40119', descricao: 'Benefício Previdenciário – Aposentadoria por Invalidez', grupo: 'PREVIDENCIÁRIO' },
  { codigo: '40120', descricao: 'Benefício Previdenciário – Auxílio-Doença', grupo: 'PREVIDENCIÁRIO' },
  { codigo: '40121', descricao: 'Revisão de Benefício Previdenciário', grupo: 'PREVIDENCIÁRIO' },
  { codigo: '1117', descricao: 'Regulamentação de Visitas', grupo: 'FAMÍLIA' },
  { codigo: '1118', descricao: 'Guarda e Responsabilidade', grupo: 'FAMÍLIA' },
];

export const assuntosCNJ: AssuntoCNJ[] = [
  { codigo: '10431', descricao: 'Responsabilidade Civil', area: 'DIREITO CIVIL' },
  { codigo: '10433', descricao: 'Indenização por Dano Moral', area: 'DIREITO CIVIL' },
  { codigo: '10434', descricao: 'Indenização por Dano Material', area: 'DIREITO CIVIL' },
  { codigo: '10435', descricao: 'Indenização por Dano Moral – Acidente de Trânsito', area: 'DIREITO CIVIL' },
  { codigo: '10445', descricao: 'Erro Médico', area: 'DIREITO CIVIL' },
  { codigo: '10450', descricao: 'Obrigação de Fazer / Não Fazer', area: 'DIREITO CIVIL' },
  { codigo: '10455', descricao: 'Contratos em Geral', area: 'DIREITO CIVIL' },
  { codigo: '10470', descricao: 'Dano Estético', area: 'DIREITO CIVIL' },
  { codigo: '10460', descricao: 'Responsabilidade do Fornecedor', area: 'DIREITO DO CONSUMIDOR' },
  { codigo: '10461', descricao: 'Defeito / Vício do Produto', area: 'DIREITO DO CONSUMIDOR' },
  { codigo: '10462', descricao: 'Práticas Abusivas', area: 'DIREITO DO CONSUMIDOR' },
  { codigo: '9991', descricao: 'Responsabilidade da Administração', area: 'DIREITO ADMINISTRATIVO' },
  { codigo: '9992', descricao: 'Indenização por Dano Moral – Responsabilidade Pública', area: 'DIREITO ADMINISTRATIVO' },
  { codigo: '10219', descricao: 'Servidor Público Civil', area: 'DIREITO ADMINISTRATIVO' },
  { codigo: '10288', descricao: 'Sistema Remuneratório e Benefícios', area: 'DIREITO ADMINISTRATIVO' },
  { codigo: '6119', descricao: 'RMI – Renda Mensal Inicial, Reajustes e Revisões', area: 'DIREITO PREVIDENCIÁRIO' },
  { codigo: '6153', descricao: 'Benefício Previdenciário – Revisão', area: 'DIREITO PREVIDENCIÁRIO' },
  { codigo: '7769', descricao: 'Abatimento Proporcional do Preço', area: 'DIREITO DO CONSUMIDOR' },
  { codigo: '15301', descricao: 'Dano Moral Coletivo Decorrente de Dano Ambiental', area: 'DIREITO AMBIENTAL' },
  { codigo: '1156', descricao: 'Direito do Consumidor – Geral', area: 'DIREITO DO CONSUMIDOR' },
];

export const prioridades = [
  'Idoso (60 a 80 anos)',
  'Idoso (acima de 80 anos)',
  'Portador de doença grave',
  'Pessoa com deficiência',
  'Violência doméstica e familiar',
  'Estatuto da Criança e do Adolescente',
  'Medida de urgência',
  'Juízo 100% Digital',
  'Pessoa em situação de rua',
  'Adolescente acautelado',
];

export const tiposDocumento = [
  'Petição Inicial',
  'Procuração',
  'Documento de Identidade',
  'CPF',
  'Comprovante de Residência',
  'Laudo Médico/Pericial',
  'Contrato',
  'Nota Fiscal / Recibo',
  'Boletim de Ocorrência',
  'Certidão',
  'Declaração',
  'Fotografias',
  'Extrato Bancário',
  'Prontuário Médico',
  'Outros',
];

export const tiposPeticaoIncidental = [
  'Contestação',
  'Réplica',
  'Agravo de Instrumento',
  'Apelação',
  'Embargos de Declaração',
  'Impugnação ao Cumprimento de Sentença',
  'Exceção de Incompetência',
  'Reconvenção',
  'Manifestação',
  'Petição (genérica)',
  'Juntada de Documentos',
  'Substabelecimento',
  'Renúncia ao Prazo',
  'Ciência',
  'Memorial',
  'Recurso – Agravo Interno',
  'Requerimento de Provas',
  'Informações Complementares',
  'Desistência',
  'Acordo / Homologação',
];
