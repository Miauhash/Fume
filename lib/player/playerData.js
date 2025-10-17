import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getPlayerStatus(walletAddress) {
  let player = await prisma.playerData.findUnique({
    where: { walletAddress },
  });

  if (!player) {
    // Inicializa dados do jogador se não existirem
    player = await prisma.playerData.create({
      data: {
        walletAddress,
        coins: 1000, // Moedas iniciais
        materials: { material_A: 50, material_B: 20 }, // Materiais iniciais
        researchedTechnologies: [],
        missionProgress: {},
      },
    });
  }
  return player;
}

export async function updatePlayerStatus(walletAddress, updates) {
  const player = await prisma.playerData.update({
    where: { walletAddress },
    data: updates,
  });
  return player;
}

export async function addResearchedTechnology(walletAddress, techId) {
  const player = await getPlayerStatus(walletAddress);
  const currentTechnologies = player.researchedTechnologies ? JSON.parse(player.researchedTechnologies) : [];
  if (!currentTechnologies.includes(techId)) {
    currentTechnologies.push(techId);
    await updatePlayerStatus(walletAddress, { researchedTechnologies: JSON.stringify(currentTechnologies) });
  }
  return currentTechnologies;
}

export async function addPlayerCoins(walletAddress, amount) {
  const player = await getPlayerStatus(walletAddress);
  const newCoins = player.coins + amount;
  await updatePlayerStatus(walletAddress, { coins: newCoins });
  return newCoins;
}

export async function deductPlayerCoins(walletAddress, amount) {
  const player = await getPlayerStatus(walletAddress);
  if (player.coins < amount) {
    throw new Error("Moedas insuficientes.");
  }
  const newCoins = player.coins - amount;
  await updatePlayerStatus(walletAddress, { coins: newCoins });
  return newCoins;
}

export async function addPlayerMaterials(walletAddress, materialId, amount) {
  const player = await getPlayerStatus(walletAddress);
  const currentMaterials = player.materials ? JSON.parse(player.materials) : {};
  currentMaterials[materialId] = (currentMaterials[materialId] || 0) + amount;
  await updatePlayerStatus(walletAddress, { materials: JSON.stringify(currentMaterials) });
  return currentMaterials;
}

export async function deductPlayerMaterials(walletAddress, materialId, amount) {
  const player = await getPlayerStatus(walletAddress);
  const currentMaterials = player.materials ? JSON.parse(player.materials) : {};
  if ((currentMaterials[materialId] || 0) < amount) {
    throw new Error(`Material ${materialId} insuficiente.`);
  }
  currentMaterials[materialId] -= amount;
  await updatePlayerStatus(walletAddress, { materials: JSON.stringify(currentMaterials) });
  return currentMaterials;
}

// Funções para gerenciar expedições ativas (usando o modelo Expedition do Prisma)
export async function addActiveExpedition(expeditionData) {
  const newExpedition = await prisma.expedition.create({ data: expeditionData });
  return newExpedition;
}

export async function removeActiveExpedition(expeditionId) {
  await prisma.expedition.delete({
    where: { id: expeditionId },
  });
}

export async function getActiveExpeditions(userWallet) {
  const expeditions = await prisma.expedition.findMany({
    where: { userWallet, rewardClaimed: false },
  });
  return expeditions;
}

export async function claimExpeditionReward(expeditionId) {
  const expedition = await prisma.expedition.update({
    where: { id: expeditionId },
    data: { rewardClaimed: true },
  });
  return expedition;
}

// Funções para gerenciar progresso de missões
export async function updateMissionProgress(walletAddress, missionId, progress) {
  const player = await getPlayerStatus(walletAddress);
  const currentMissionProgress = player.missionProgress ? JSON.parse(player.missionProgress) : {};
  currentMissionProgress[missionId] = { ...currentMissionProgress[missionId], ...progress };
  await updatePlayerStatus(walletAddress, { missionProgress: JSON.stringify(currentMissionProgress) });
  return currentMissionProgress[missionId];
}

export async function getMissionProgress(walletAddress, missionId) {
  const player = await getPlayerStatus(walletAddress);
  const currentMissionProgress = player.missionProgress ? JSON.parse(player.missionProgress) : {};
  return currentMissionProgress[missionId];
}

// Funções para gerenciar dados de RPG dos NFTs
export async function getNftRpgData(contractAddress, tokenId) {
  let nftRpg = await prisma.nftRpgData.findUnique({
    where: { contractAddress_tokenId: { contractAddress, tokenId } },
  });

  if (!nftRpg) {
    // Se não existir, inicializa com dados padrão
    nftRpg = await prisma.nftRpgData.create({
      data: {
        contractAddress,
        tokenId,
        ownerWallet: ":temporary:", // Será atualizado quando o NFT for associado a um jogador
        class: "Surgeon", // Classe padrão, pode ser aleatorizado ou definido na mintagem
        level: 1,
        xp: 0,
        efficiency: 10,
        resistance: 10,
        charisma: 10,
        unlockedSkills: "[]",
        skillPoints: 0,
      },
    });
  }
  return nftRpg;
}

export async function updateNftRpgData(contractAddress, tokenId, updates) {
  const nftRpg = await prisma.nftRpgData.update({
    where: { contractAddress_tokenId: { contractAddress, tokenId } },
    data: updates,
  });
  return nftRpg;
}

export async function getPlayerNftsRpgData(walletAddress) {
  const nftsRpg = await prisma.nftRpgData.findMany({
    where: { ownerWallet: walletAddress },
  });
  return nftsRpg;
}

// Funções para Boss Fights
export async function createBossFight(fightData) {
  const newFight = await prisma.bossFight.create({ data: fightData });
  return newFight;
}

export async function getBossFight(fightId) {
  const fight = await prisma.bossFight.findUnique({
    where: { id: fightId },
  });
  return fight;
}

export async function updateBossFight(fightId, updates) {
  const updatedFight = await prisma.bossFight.update({
    where: { id: fightId },
    data: updates,
  });
  return updatedFight;
}

// Funções para Expedition Choices
export async function createExpeditionChoice(choiceData) {
  const newChoice = await prisma.expeditionChoice.create({ data: choiceData });
  return newChoice;
}

