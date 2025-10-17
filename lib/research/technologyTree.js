export const TECHNOLOGY_TREE = {
  medical: {
    name: "Tecnologias Médicas",
    description: "Avanços em tratamentos e procedimentos médicos.",
    technologies: [
      {
        id: "med_basic_treatment",
        name: "Tratamento Básico",
        description: "Melhora a eficiência dos tratamentos básicos em 10%.",
        tier: 1,
        cost: { coins: 100, materials: [] },
        prerequisites: [],
        effects: { treatment_efficiency: 0.10 },
        icon: "💊",
      },
      {
        id: "med_advanced_surgery",
        name: "Cirurgia Avançada",
        description: "Permite realizar cirurgias complexas com maior taxa de sucesso.",
        tier: 2,
        cost: { coins: 500, materials: [{ id: "rare_material_a", quantity: 2 }] },
        prerequisites: ["med_basic_treatment"],
        effects: { surgery_success_rate: 0.15 },
        icon: "🔪",
      },
      {
        id: "med_nano_medicine",
        name: "Nanomedicina",
        description: "Tecnologia de ponta que usa nanorrobôs para tratamentos precisos.",
        tier: 3,
        cost: { coins: 2000, materials: [{ id: "epic_material_b", quantity: 3 }, { id: "rare_material_c", quantity: 5 }] },
        prerequisites: ["med_advanced_surgery"],
        effects: { treatment_efficiency: 0.25, surgery_success_rate: 0.20 },
        icon: "🤖",
      },
      {
        id: "med_regenerative_therapy",
        name: "Terapia Regenerativa",
        description: "Permite regenerar tecidos e órgãos danificados.",
        tier: 4,
        cost: { coins: 5000, materials: [{ id: "legendary_key_laboratorio", quantity: 1 }, { id: "epic_material_d", quantity: 5 }] },
        prerequisites: ["med_nano_medicine"],
        effects: { regeneration_rate: 0.50, patient_recovery_speed: 0.30 },
        icon: "🧬",
      },
    ],
  },
  research: {
    name: "Pesquisa e Desenvolvimento",
    description: "Avanços em pesquisa científica e desenvolvimento de novos medicamentos.",
    technologies: [
      {
        id: "res_basic_lab",
        name: "Laboratório Básico",
        description: "Melhora a velocidade de pesquisa em 10%.",
        tier: 1,
        cost: { coins: 150, materials: [] },
        prerequisites: [],
        effects: { research_speed: 0.10 },
        icon: "🔬",
      },
      {
        id: "res_advanced_analysis",
        name: "Análise Avançada",
        description: "Permite análises mais profundas de amostras e dados.",
        tier: 2,
        cost: { coins: 600, materials: [{ id: "rare_material_d", quantity: 2 }] },
        prerequisites: ["res_basic_lab"],
        effects: { research_speed: 0.20, discovery_chance: 0.10 },
        icon: "📊",
      },
      {
        id: "res_quantum_computing",
        name: "Computação Quântica",
        description: "Usa computadores quânticos para acelerar a pesquisa exponencialmente.",
        tier: 3,
        cost: { coins: 2500, materials: [{ id: "epic_material_e", quantity: 3 }, { id: "rare_material_f", quantity: 5 }] },
        prerequisites: ["res_advanced_analysis"],
        effects: { research_speed: 0.50, discovery_chance: 0.25 },
        icon: "💻",
      },
      {
        id: "res_ai_assistant",
        name: "Assistente de IA",
        description: "Um assistente de inteligência artificial que auxilia em todas as pesquisas.",
        tier: 4,
        cost: { coins: 6000, materials: [{ id: "legendary_key_consultorio", quantity: 1 }, { id: "epic_material_g", quantity: 5 }] },
        prerequisites: ["res_quantum_computing"],
        effects: { research_speed: 1.00, discovery_chance: 0.50, auto_research: true },
        icon: "🤖",
      },
    ],
  },
  infrastructure: {
    name: "Infraestrutura",
    description: "Melhorias na estrutura e equipamentos do hospital.",
    technologies: [
      {
        id: "inf_basic_renovation",
        name: "Renovação Básica",
        description: "Melhora a capacidade do hospital em 10%.",
        tier: 1,
        cost: { coins: 200, materials: [] },
        prerequisites: [],
        effects: { hospital_capacity: 0.10 },
        icon: "🏥",
      },
      {
        id: "inf_advanced_equipment",
        name: "Equipamentos Avançados",
        description: "Instala equipamentos de última geração em todas as salas.",
        tier: 2,
        cost: { coins: 800, materials: [{ id: "rare_material_e", quantity: 3 }] },
        prerequisites: ["inf_basic_renovation"],
        effects: { hospital_capacity: 0.20, treatment_efficiency: 0.15 },
        icon: "⚙️",
      },
      {
        id: "inf_smart_hospital",
        name: "Hospital Inteligente",
        description: "Automatiza processos e otimiza o fluxo de pacientes.",
        tier: 3,
        cost: { coins: 3000, materials: [{ id: "epic_material_f", quantity: 4 }, { id: "rare_material_g", quantity: 6 }] },
        prerequisites: ["inf_advanced_equipment"],
        effects: { hospital_capacity: 0.40, patient_flow: 0.30, automation_level: 0.50 },
        icon: "🏢",
      },
      {
        id: "inf_mega_complex",
        name: "Megacomplexo Hospitalar",
        description: "Transforma o hospital em um megacomplexo de saúde de classe mundial.",
        tier: 4,
        cost: { coins: 10000, materials: [{ id: "legendary_key_uti", quantity: 1 }, { id: "epic_material_h", quantity: 8 }] },
        prerequisites: ["inf_smart_hospital"],
        effects: { hospital_capacity: 1.00, treatment_efficiency: 0.50, patient_flow: 0.60, prestige: 100 },
        icon: "🏰",
      },
    ],
  },
  security: {
    name: "Segurança",
    description: "Sistemas de segurança para proteger o hospital de ameaças.",
    technologies: [
      {
        id: "sec_basic_security",
        name: "Segurança Básica",
        description: "Instala câmeras e alarmes básicos.",
        tier: 1,
        cost: { coins: 100, materials: [] },
        prerequisites: [],
        effects: { security_level: 0.10 },
        icon: "🔒",
      },
      {
        id: "sec_advanced_surveillance",
        name: "Vigilância Avançada",
        description: "Sistema de vigilância com reconhecimento facial e detecção de ameaças.",
        tier: 2,
        cost: { coins: 700, materials: [{ id: "rare_material_a", quantity: 2 }] },
        prerequisites: ["sec_basic_security"],
        effects: { security_level: 0.25, threat_detection: 0.20 },
        icon: "📹",
      },
      {
        id: "sec_combat_drones",
        name: "Drones de Combate",
        description: "Drones autônomos que patrulham e protegem o hospital.",
        tier: 3,
        cost: { coins: 3500, materials: [{ id: "epic_material_c", quantity: 4 }, { id: "rare_material_d", quantity: 6 }] },
        prerequisites: ["sec_advanced_surveillance"],
        effects: { security_level: 0.50, threat_neutralization: 0.40 },
        icon: "🚁",
      },
      {
        id: "sec_force_field",
        name: "Campo de Força",
        description: "Um campo de força impenetrável que protege o hospital de qualquer ameaça.",
        tier: 4,
        cost: { coins: 8000, materials: [{ id: "legendary_key_cirurgico", quantity: 1 }, { id: "epic_material_a", quantity: 7 }] },
        prerequisites: ["sec_combat_drones"],
        effects: { security_level: 1.00, threat_neutralization: 1.00, invulnerability: true },
        icon: "🛡️",
      },
    ],
  },
};

export const getTechnologyById = (techId) => {
  for (const category in TECHNOLOGY_TREE) {
    const tech = TECHNOLOGY_TREE[category].technologies.find(t => t.id === techId);
    if (tech) return tech;
  }
  return null;
};

export const canResearchTechnology = (techId, researchedTechs) => {
  const tech = getTechnologyById(techId);
  if (!tech) return false;

  // Verifica se todos os pré-requisitos foram pesquisados
  for (const prereq of tech.prerequisites) {
    if (!researchedTechs.includes(prereq)) {
      return false;
    }
  }

  return true;
};

