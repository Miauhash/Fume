export const EXPEDITION_SCENARIOS = {
  "expedition_1h": {
    id: "expedition_1h",
    name: "Expedição Rápida",
    duration: 3600,
    baseReward: { token: "INSULINE", amount: 0.0001, xp: 50 },
    scenarios: [
      {
        id: "quick_1",
        title: "Paciente em Pânico",
        description: "Você encontra um paciente em pânico no corredor. Como você age?",
        choices: [
          {
            id: "calm_patient",
            text: "Acalmar o paciente com palavras gentis",
            requirements: { class: "Therapist", level: 1 },
            outcomes: {
              success: { 
                message: "O paciente se acalma e agradece. Você ganha confiança.",
                rewards: { xp: 30, coins: 10, charisma: 2 }
              },
              failure: {
                message: "O paciente não responde bem e continua em pânico.",
                rewards: { xp: 10 }
              }
            },
            successRate: 0.8,
          },
          {
            id: "sedate_patient",
            text: "Sedar o paciente imediatamente",
            requirements: { class: "Surgeon", level: 1 },
            outcomes: {
              success: { 
                message: "O paciente é sedado com sucesso e levado para a enfermaria.",
                rewards: { xp: 25, coins: 15, efficiency: 2 }
              },
              failure: {
                message: "A sedação falha e o paciente fica mais agitado.",
                rewards: { xp: 5 }
              }
            },
            successRate: 0.7,
          },
          {
            id: "ignore_patient",
            text: "Ignorar e continuar a expedição",
            requirements: null,
            outcomes: {
              success: { 
                message: "Você continua, mas sente que poderia ter ajudado.",
                rewards: { xp: 15 }
              }
            },
            successRate: 1.0,
          },
        ],
      },
      {
        id: "quick_2",
        title: "Suprimentos Perdidos",
        description: "Você encontra uma caixa de suprimentos médicos abandonada. O que fazer?",
        choices: [
          {
            id: "take_supplies",
            text: "Levar os suprimentos para o hospital",
            requirements: null,
            outcomes: {
              success: { 
                message: "Você leva os suprimentos e eles são úteis.",
                rewards: { xp: 20, items: [{ id: "small_medkit", quantity: 1 }] }
              }
            },
            successRate: 1.0,
          },
          {
            id: "investigate_supplies",
            text: "Investigar a origem dos suprimentos",
            requirements: { class: "Researcher", level: 2 },
            outcomes: {
              success: { 
                message: "Você descobre que os suprimentos são de alta qualidade e raros.",
                rewards: { xp: 40, items: [{ id: "medium_medkit", quantity: 1 }] }
              },
              failure: {
                message: "Você não consegue determinar a origem.",
                rewards: { xp: 15 }
              }
            },
            successRate: 0.6,
          },
          {
            id: "leave_supplies",
            text: "Deixar os suprimentos onde estão",
            requirements: null,
            outcomes: {
              success: { 
                message: "Você deixa os suprimentos, mas se pergunta se fez a escolha certa.",
                rewards: { xp: 10 }
              }
            },
            successRate: 1.0,
          },
        ],
      },
    ],
  },
  "expedition_4h": {
    id: "expedition_4h",
    name: "Expedição Média",
    duration: 14400,
    baseReward: { token: "INSULINE", amount: 0.0005, xp: 100 },
    scenarios: [
      {
        id: "medium_1",
        title: "Criatura Estranha",
        description: "Uma criatura estranha bloqueia seu caminho. Como você reage?",
        choices: [
          {
            id: "fight_creature",
            text: "Lutar contra a criatura",
            requirements: { class: "Surgeon", level: 3 },
            outcomes: {
              success: { 
                message: "Você derrota a criatura e obtém um material raro.",
                rewards: { xp: 80, coins: 30, items: [{ id: "rare_material_a", quantity: 1 }], resistance: 3 }
              },
              failure: {
                message: "A criatura te fere, mas você consegue escapar.",
                rewards: { xp: 30, resistance: -2 }
              }
            },
            successRate: 0.6,
          },
          {
            id: "study_creature",
            text: "Estudar a criatura de longe",
            requirements: { class: "Researcher", level: 3 },
            outcomes: {
              success: { 
                message: "Você aprende sobre a criatura e ganha conhecimento valioso.",
                rewards: { xp: 100, coins: 20, charisma: 3 }
              },
              failure: {
                message: "A criatura percebe você e foge.",
                rewards: { xp: 40 }
              }
            },
            successRate: 0.7,
          },
          {
            id: "avoid_creature",
            text: "Evitar a criatura e procurar outro caminho",
            requirements: null,
            outcomes: {
              success: { 
                message: "Você encontra um caminho alternativo com segurança.",
                rewards: { xp: 50, efficiency: 2 }
              }
            },
            successRate: 1.0,
          },
        ],
      },
      {
        id: "medium_2",
        title: "Laboratório Abandonado",
        description: "Você encontra um laboratório abandonado. Deseja explorá-lo?",
        choices: [
          {
            id: "explore_lab",
            text: "Explorar o laboratório",
            requirements: { class: "Pharmacist", level: 4 },
            outcomes: {
              success: { 
                message: "Você encontra fórmulas valiosas e equipamentos.",
                rewards: { xp: 120, coins: 50, items: [{ id: "rare_material_b", quantity: 2 }] }
              },
              failure: {
                message: "O laboratório está contaminado e você precisa sair rapidamente.",
                rewards: { xp: 40, resistance: -3 }
              }
            },
            successRate: 0.5,
          },
          {
            id: "secure_lab",
            text: "Garantir a segurança do laboratório",
            requirements: { class: "Surgeon", level: 4 },
            outcomes: {
              success: { 
                message: "Você protege o laboratório para uso futuro.",
                rewards: { xp: 90, coins: 40, efficiency: 3 }
              },
              failure: {
                message: "Você não consegue proteger o laboratório adequadamente.",
                rewards: { xp: 50 }
              }
            },
            successRate: 0.6,
          },
          {
            id: "ignore_lab",
            text: "Ignorar o laboratório e continuar",
            requirements: null,
            outcomes: {
              success: { 
                message: "Você continua sua expedição sem incidentes.",
                rewards: { xp: 60 }
              }
            },
            successRate: 1.0,
          },
        ],
      },
    ],
  },
  "expedition_12h": {
    id: "expedition_12h",
    name: "Expedição Longa",
    duration: 43200,
    baseReward: { token: "INSULINE", amount: 0.001, xp: 200 },
    scenarios: [
      {
        id: "long_1",
        title: "Cidade Fantasma",
        description: "Você chega a uma cidade fantasma. Há sinais de vida recente. Investigar?",
        choices: [
          {
            id: "investigate_city",
            text: "Investigar a cidade completamente",
            requirements: { class: "Researcher", level: 6 },
            outcomes: {
              success: { 
                message: "Você descobre um esconderijo com recursos valiosos.",
                rewards: { xp: 250, coins: 100, items: [{ id: "epic_material_a", quantity: 1 }, { id: "rare_material_c", quantity: 3 }] }
              },
              failure: {
                message: "Você é emboscado por saqueadores e perde alguns recursos.",
                rewards: { xp: 80, coins: -20 }
              }
            },
            successRate: 0.5,
          },
          {
            id: "search_survivors",
            text: "Procurar por sobreviventes",
            requirements: { class: "Therapist", level: 6 },
            outcomes: {
              success: { 
                message: "Você encontra sobreviventes e os leva para o hospital.",
                rewards: { xp: 300, coins: 80, charisma: 5 }
              },
              failure: {
                message: "Você não encontra ninguém, mas ganha experiência.",
                rewards: { xp: 120 }
              }
            },
            successRate: 0.6,
          },
          {
            id: "leave_city",
            text: "Deixar a cidade e continuar",
            requirements: null,
            outcomes: {
              success: { 
                message: "Você evita riscos desnecessários.",
                rewards: { xp: 100, efficiency: 3 }
              }
            },
            successRate: 1.0,
          },
        ],
      },
    ],
  },
};

export const getExpeditionScenario = (expeditionId) => {
  return EXPEDITION_SCENARIOS[expeditionId];
};

export const processChoice = (choice, playerData, nftData) => {
  // Verifica requisitos
  if (choice.requirements) {
    if (choice.requirements.class && nftData.class !== choice.requirements.class) {
      return { success: false, message: "Classe incorreta para esta escolha." };
    }
    if (choice.requirements.level && nftData.level < choice.requirements.level) {
      return { success: false, message: "Nível insuficiente para esta escolha." };
    }
  }

  // Calcula sucesso baseado na taxa de sucesso
  const roll = Math.random();
  const success = roll < choice.successRate;

  // Retorna o resultado apropriado
  if (success && choice.outcomes.success) {
    return { success: true, outcome: choice.outcomes.success };
  } else if (!success && choice.outcomes.failure) {
    return { success: false, outcome: choice.outcomes.failure };
  } else {
    return { success: true, outcome: choice.outcomes.success };
  }
};

