// Configuração das classes de NFT e seus bônus

export const CLASSES = {
  Surgeon: {
    name: "Cirurgião",
    miningBonus: 12,
    description: "Especialista em procedimentos complexos, com habilidades cirúrgicas avançadas.",
    skillTree: {
      tier1: [
        { id: "surgeon_1", name: "Mãos Firmes", effect: "+2% Eficiência", cost: 100 },
        { id: "surgeon_2", name: "Precisão Cirúrgica", effect: "+3% Bônus de Mineração", cost: 150 },
      ],
      tier2: [
        { id: "surgeon_3", name: "Cirurgia Avançada", effect: "+5% Eficiência", cost: 300 },
        { id: "surgeon_4", name: "Maestria em Bisturi", effect: "+5% Bônus de Mineração", cost: 350 },
      ],
      tier3: [
        { id: "surgeon_5", name: "Grande Cirurgião", effect: "+10% Eficiência e +5% Bônus de Mineração", cost: 600 },
      ],
    },
  },
  Researcher: {
    name: "Pesquisador",
    miningBonus: 10,
    description: "Cientista dedicado à descoberta de novos tratamentos e tecnologias.",
    skillTree: {
      tier1: [
        { id: "researcher_1", name: "Mente Analítica", effect: "+2% Carisma", cost: 100 },
        { id: "researcher_2", name: "Pesquisa Eficiente", effect: "+3% Bônus de Mineração", cost: 150 },
      ],
      tier2: [
        { id: "researcher_3", name: "Descoberta Inovadora", effect: "+5% Carisma", cost: 300 },
        { id: "researcher_4", name: "Laboratório Avançado", effect: "+5% Bônus de Mineração", cost: 350 },
      ],
      tier3: [
        { id: "researcher_5", name: "Gênio Científico", effect: "+10% Carisma e +5% Bônus de Mineração", cost: 600 },
      ],
    },
  },
  Pharmacist: {
    name: "Farmacêutico",
    miningBonus: 8,
    description: "Especialista em medicamentos e compostos químicos.",
    skillTree: {
      tier1: [
        { id: "pharmacist_1", name: "Conhecimento Químico", effect: "+2% Resistência", cost: 100 },
        { id: "pharmacist_2", name: "Formulação Eficiente", effect: "+3% Bônus de Mineração", cost: 150 },
      ],
      tier2: [
        { id: "pharmacist_3", name: "Mestre em Compostos", effect: "+5% Resistência", cost: 300 },
        { id: "pharmacist_4", name: "Farmácia Avançada", effect: "+5% Bônus de Mineração", cost: 350 },
      ],
      tier3: [
        { id: "pharmacist_5", name: "Alquimista Moderno", effect: "+10% Resistência e +5% Bônus de Mineração", cost: 600 },
      ],
    },
  },
  Therapist: {
    name: "Terapeuta",
    miningBonus: 5,
    description: "Especialista em saúde mental e bem-estar dos pacientes.",
    skillTree: {
      tier1: [
        { id: "therapist_1", name: "Empatia", effect: "+2% Carisma", cost: 100 },
        { id: "therapist_2", name: "Terapia Eficaz", effect: "+3% Bônus de Mineração", cost: 150 },
      ],
      tier2: [
        { id: "therapist_3", name: "Psicologia Avançada", effect: "+5% Carisma", cost: 300 },
        { id: "therapist_4", name: "Mestre em Terapia", effect: "+5% Bônus de Mineração", cost: 350 },
      ],
      tier3: [
        { id: "therapist_5", name: "Curador de Almas", effect: "+10% Carisma e +5% Bônus de Mineração", cost: 600 },
      ],
    },
  },
};

// Função para calcular XP necessário para subir de nível
export function getXPForLevel(level) {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

// Função para calcular os atributos base de um NFT no nível atual
export function calculateAttributes(baseAttributes, level, skills) {
  let efficiency = baseAttributes.efficiency;
  let resistance = baseAttributes.resistance;
  let charisma = baseAttributes.charisma;

  // Adiciona bônus por nível
  efficiency += (level - 1) * 2;
  resistance += (level - 1) * 2;
  charisma += (level - 1) * 2;

  // Adiciona bônus de habilidades
  if (skills && skills.length > 0) {
    skills.forEach((skillId) => {
      // Implementar lógica de bônus de habilidades aqui
      // Por exemplo, verificar se a habilidade aumenta eficiência, resistência ou carisma
    });
  }

  return { efficiency, resistance, charisma };
}

// Função para obter o bônus de mineração total
export function getMiningBonus(className, level, skills) {
  const classData = CLASSES[className];
  if (!classData) return 0;

  let bonus = classData.miningBonus;

  // Adiciona bônus por nível (0.5% por nível)
  bonus += (level - 1) * 0.5;

  // Adiciona bônus de habilidades
  if (skills && skills.length > 0) {
    skills.forEach((skillId) => {
      // Implementar lógica de bônus de mineração de habilidades aqui
      if (skillId.includes("_2") || skillId.includes("_4")) {
        bonus += 3;
      }
      if (skillId.includes("_5")) {
        bonus += 5;
      }
    });
  }

  return bonus;
}

