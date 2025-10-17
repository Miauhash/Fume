export const BOSSES = {
  "boss_plague_doctor": {
    id: "boss_plague_doctor",
    name: "Dr. Pestilência",
    description: "Um médico corrompido que espalha doenças ao invés de curá-las.",
    tier: 1,
    health: 5000,
    attack: 150,
    defense: 100,
    abilities: [
      {
        id: "toxic_cloud",
        name: "Nuvem Tóxica",
        description: "Libera uma nuvem tóxica que causa dano contínuo.",
        damage: 200,
        effect: "poison",
        cooldown: 3,
      },
      {
        id: "plague_strike",
        name: "Golpe da Peste",
        description: "Um golpe poderoso que infecta o alvo.",
        damage: 300,
        effect: "disease",
        cooldown: 2,
      },
    ],
    weaknesses: ["Pharmacist", "fire"],
    rewards: {
      xp: 1000,
      coins: 500,
      items: [
        { id: "plague_doctor_mask", quantity: 1, rarity: "epic" },
        { id: "epic_material_a", quantity: 3 },
        { id: "rare_material_b", quantity: 5 },
      ],
    },
    spawnConditions: {
      minLevel: 5,
      location: "Enfermaria",
      triggerEvent: "plague_outbreak",
    },
  },
  "boss_mad_surgeon": {
    id: "boss_mad_surgeon",
    name: "Cirurgião Insano",
    description: "Um cirurgião que perdeu a sanidade e agora experimenta em pacientes vivos.",
    tier: 2,
    health: 8000,
    attack: 250,
    defense: 150,
    abilities: [
      {
        id: "surgical_precision",
        name: "Precisão Cirúrgica",
        description: "Um corte preciso que ignora parte da defesa.",
        damage: 400,
        effect: "armor_pierce",
        cooldown: 2,
      },
      {
        id: "organ_harvest",
        name: "Colheita de Órgãos",
        description: "Remove órgãos do alvo, causando dano massivo.",
        damage: 600,
        effect: "bleed",
        cooldown: 4,
      },
      {
        id: "anesthetic_gas",
        name: "Gás Anestésico",
        description: "Libera gás que reduz a velocidade de ataque.",
        damage: 100,
        effect: "slow",
        cooldown: 3,
      },
    ],
    weaknesses: ["Therapist", "ice"],
    rewards: {
      xp: 2000,
      coins: 1000,
      items: [
        { id: "mad_surgeon_scalpel", quantity: 1, rarity: "epic" },
        { id: "epic_material_b", quantity: 5 },
        { id: "rare_material_c", quantity: 8 },
        { id: "legendary_key_cirurgico", quantity: 1 },
      ],
    },
    spawnConditions: {
      minLevel: 8,
      location: "Centro Cirúrgico",
      triggerEvent: "surgical_disaster",
    },
  },
  "boss_experiment_gone_wrong": {
    id: "boss_experiment_gone_wrong",
    name: "Experimento Falho",
    description: "Uma criatura resultante de um experimento de laboratório que deu terrivelmente errado.",
    tier: 3,
    health: 12000,
    attack: 350,
    defense: 200,
    abilities: [
      {
        id: "mutation_burst",
        name: "Explosão de Mutação",
        description: "Libera energia mutagênica que causa dano em área.",
        damage: 500,
        effect: "aoe",
        cooldown: 3,
      },
      {
        id: "regeneration",
        name: "Regeneração",
        description: "Regenera uma porcentagem da vida máxima.",
        damage: 0,
        effect: "heal",
        healAmount: 1000,
        cooldown: 5,
      },
      {
        id: "toxic_tentacles",
        name: "Tentáculos Tóxicos",
        description: "Ataca com tentáculos que envenenam.",
        damage: 400,
        effect: "poison",
        cooldown: 2,
      },
    ],
    weaknesses: ["Researcher", "lightning"],
    rewards: {
      xp: 3500,
      coins: 2000,
      items: [
        { id: "mutagen_sample", quantity: 1, rarity: "legendary" },
        { id: "epic_material_c", quantity: 8 },
        { id: "rare_material_d", quantity: 10 },
        { id: "legendary_key_laboratorio", quantity: 1 },
      ],
    },
    spawnConditions: {
      minLevel: 12,
      location: "Laboratório",
      triggerEvent: "experiment_breach",
    },
  },
  "boss_death_itself": {
    id: "boss_death_itself",
    name: "A Própria Morte",
    description: "A personificação da morte, vindo buscar as almas do Hospital Fumegator.",
    tier: 4,
    health: 20000,
    attack: 500,
    defense: 300,
    abilities: [
      {
        id: "soul_reap",
        name: "Ceifar Alma",
        description: "Tenta ceifar a alma do alvo, causando dano massivo.",
        damage: 1000,
        effect: "instant_death_chance",
        cooldown: 5,
      },
      {
        id: "death_aura",
        name: "Aura da Morte",
        description: "Uma aura que drena a vida de todos ao redor.",
        damage: 300,
        effect: "life_drain",
        cooldown: 3,
      },
      {
        id: "summon_undead",
        name: "Invocar Mortos-Vivos",
        description: "Invoca mortos-vivos para lutar ao seu lado.",
        damage: 0,
        effect: "summon",
        cooldown: 4,
      },
      {
        id: "final_judgment",
        name: "Julgamento Final",
        description: "Um ataque devastador que pode acabar com a batalha.",
        damage: 1500,
        effect: "ultimate",
        cooldown: 8,
      },
    ],
    weaknesses: ["Surgeon", "holy"],
    rewards: {
      xp: 10000,
      coins: 5000,
      items: [
        { id: "deaths_scythe", quantity: 1, rarity: "legendary" },
        { id: "epic_material_d", quantity: 15 },
        { id: "rare_material_e", quantity: 20 },
        { id: "legendary_key_uti", quantity: 1 },
        { id: "immortality_serum", quantity: 1, rarity: "legendary" },
      ],
    },
    spawnConditions: {
      minLevel: 16,
      location: "UTI",
      triggerEvent: "death_awakening",
    },
  },
};

export const getBossById = (bossId) => {
  return BOSSES[bossId];
};

export const getAvailableBosses = (playerLevel, location) => {
  return Object.values(BOSSES).filter(boss => {
    return boss.spawnConditions.minLevel <= playerLevel &&
           (location ? boss.spawnConditions.location === location : true);
  });
};

export const calculateDamage = (attacker, defender, ability) => {
  let baseDamage = ability ? ability.damage : attacker.attack;
  
  // Aplica defesa
  const damageReduction = defender.defense / (defender.defense + 100);
  let finalDamage = baseDamage * (1 - damageReduction);

  // Aplica fraquezas
  if (ability && defender.weaknesses) {
    if (defender.weaknesses.includes(attacker.class)) {
      finalDamage *= 1.5; // 50% de dano extra
    }
  }

  return Math.floor(finalDamage);
};

export const processBossTurn = (boss, bossState, players) => {
  // Atualiza cooldowns
  for (const ability of boss.abilities) {
    if (bossState.cooldowns[ability.id] > 0) {
      bossState.cooldowns[ability.id]--;
    }
  }

  // Escolhe uma habilidade disponível
  const availableAbilities = boss.abilities.filter(
    ability => !bossState.cooldowns[ability.id] || bossState.cooldowns[ability.id] === 0
  );

  if (availableAbilities.length === 0) {
    // Ataque básico
    return {
      type: "basic_attack",
      damage: boss.attack,
      target: players[Math.floor(Math.random() * players.length)],
    };
  }

  // Escolhe uma habilidade aleatória
  const ability = availableAbilities[Math.floor(Math.random() * availableAbilities.length)];
  bossState.cooldowns[ability.id] = ability.cooldown;

  return {
    type: "ability",
    ability: ability,
    target: players[Math.floor(Math.random() * players.length)],
  };
};

