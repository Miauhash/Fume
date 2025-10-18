#!/bin/bash

# Este script configura a funcionalidade de Expedições.
# 1. Atualiza o schema do Prisma.
# 2. Aplica as mudanças ao banco de dados.
# 3. Cria todos os endpoints da API necessários.

echo "--- INICIANDO CONFIGURAÇÃO DAS EXPEDIÇÕES ---"

# Passo 1: Atualizar o schema.prisma
PRISMA_SCHEMA_PATH="prisma/schema.prisma"
echo ">> Verificando o schema do Prisma em $PRISMA_SCHEMA_PATH..."

# Adiciona o model Expedition APENAS se ele ainda não existir no arquivo
if ! grep -q "model Expedition" "$PRISMA_SCHEMA_PATH"; then
    echo ">> Modelo 'Expedition' não encontrado. Adicionando ao schema..."
    # Usamos 'cat <<EOF >>' para adicionar um bloco de texto ao final do arquivo
    cat <<EOF >> "$PRISMA_SCHEMA_PATH"

model Expedition {
  id             String   @id @default(uuid())
  userWallet     String
  nftId          Int
  missionType    String
  startedAt      DateTime
  endsAt         DateTime
  rewardToken    String
  rewardAmount   Float
  rewardClaimed  Boolean  @default(false)
  createdAt      DateTime @default(now())

  @@index([userWallet])
}
EOF
    echo ">> Schema atualizado com sucesso."
else
    echo ">> Modelo 'Expedition' já existe no schema. Pulando."
fi

# Passo 2: Aplicar as mudanças no banco de dados
echo ""
echo ">> Aplicando as mudanças do schema ao banco de dados..."
npx prisma db push
echo ">> Banco de dados atualizado com sucesso."

# Passo 3: Criar os arquivos da API
API_DIR="pages/api/expeditions"
echo ""
echo ">> Criando/Atualizando os arquivos da API em $API_DIR..."
mkdir -p "$API_DIR" # Cria o diretório se ele não existir

# API para /status
cat <<EOF > "$API_DIR/status.js"
// pages/api/expeditions/status.js
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido.' });
  }
  const { wallet } = req.query;
  if (!wallet) {
    return res.status(400).json({ message: 'A carteira do usuário é obrigatória.' });
  }
  try {
    const expeditions = await prisma.expedition.findMany({
      where: { userWallet: wallet },
      orderBy: { startedAt: 'desc' },
    });
    res.status(200).json(expeditions);
  } catch (error) {
    console.error('Erro ao buscar status das expedições:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}
EOF

# API para /start
cat <<EOF > "$API_DIR/start.js"
// pages/api/expeditions/start.js
import prisma from '../../../lib/prisma';
import { getMissionConfig } from '../../../lib/missionConfig';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    const { userWallet, nftId, missionType } = req.body;
    const MISSION_CONFIG = getMissionConfig();
    if (!userWallet || !nftId || !missionType || !MISSION_CONFIG[missionType]) {
        return res.status(400).json({ message: 'Invalid mission data provided.' });
    }
    try {
        const existingExpedition = await prisma.expedition.findFirst({
            where: { nftId: nftId, rewardClaimed: false },
        });
        if (existingExpedition) {
            return res.status(400).json({ message: 'This Specialist is already on an expedition.' });
        }
        const mission = MISSION_CONFIG[missionType];
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + mission.duration * 1000);
        const newExpedition = await prisma.expedition.create({
            data: {
                userWallet,
                nftId: nftId,
                missionType,
                startedAt: startTime,
                endsAt: endTime,
                rewardToken: mission.rewardToken,
                rewardAmount: mission.rewardAmount,
                rewardClaimed: false,
            },
        });
        res.status(200).json({ message: 'Expedition started successfully!', expedition: newExpedition });
    } catch (error) {
        console.error("Error starting expedition:", error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}
EOF

# API para /claim
cat <<EOF > "$API_DIR/claim.js"
// pages/api/expeditions/claim.js
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido.' });
  }
  const { userWallet, expeditionId } = req.body;
  if (!userWallet || !expeditionId) {
    return res.status(400).json({ message: 'Informações incompletas para coletar a recompensa.' });
  }
  try {
    const result = await prisma.$transaction(async (tx) => {
      const expedition = await tx.expedition.findUnique({ where: { id: expeditionId } });
      if (!expedition) throw new Error('Expedição não encontrada.');
      if (expedition.userWallet !== userWallet) throw new Error('Você não tem permissão para coletar esta expedição.');
      if (expedition.rewardClaimed) throw new Error('A recompensa para esta expedição já foi coletada.');
      if (new Date() < new Date(expedition.endsAt)) throw new Error('A expedição ainda não terminou.');
      
      const gameState = await tx.gameState.findUnique({ where: { wallet: userWallet } });
      if (!gameState) throw new Error('Estado do jogo não encontrado para este usuário.');
      
      const state = gameState.state;
      const { rewardToken, rewardAmount } = expedition;
      state.balances[rewardToken] = (state.balances[rewardToken] || 0) + rewardAmount;
      
      await tx.gameState.update({
        where: { wallet: userWallet },
        data: { state: state },
      });
      const updatedExpedition = await tx.expedition.update({
        where: { id: expeditionId },
        data: { rewardClaimed: true },
      });
      return { updatedExpedition, rewardToken, rewardAmount };
    });
    res.status(200).json({
      message: \`Recompensa de \${result.rewardAmount} \${result.rewardToken} coletada com sucesso!\`,
      expedition: result.updatedExpedition,
    });
  } catch (error) {
    console.error('Erro ao coletar recompensa da expedição:', error);
    res.status(400).json({ message: error.message || 'Erro interno no servidor.' });
  }
}
EOF

# API para /make-choice
cat <<EOF > "$API_DIR/make-choice.js"
// pages/api/expeditions/make-choice.js
import { processExpeditionChoice } from '../../../lib/expeditions/expeditionChoices';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    const { walletAddress, nftId, expeditionId, scenarioId, choiceId } = req.body;
    if (!walletAddress || !nftId || !expeditionId || !scenarioId || !choiceId) {
        return res.status(400).json({ error: 'Dados da escolha incompletos.' });
    }
    try {
        const result = processExpeditionChoice(scenarioId, choiceId);
        // NOTA: A lógica para aplicar as recompensas ao jogador (XP, moedas, etc.)
        // deve ser adicionada aqui, interagindo com o seu banco de dados.
        res.status(200).json({ result });
    } catch (error) {
        console.error("Erro ao processar escolha da expedição:", error);
        res.status(500).json({ error: 'Erro interno ao processar a escolha.' });
    }
}
EOF

echo ">> Arquivos da API criados com sucesso."
echo ""
echo "--- CONFIGURAÇÃO DAS EXPEDIÇÕES CONCLUÍDA ---"
echo "Lembre-se de reiniciar o servidor de desenvolvimento (npm run dev) para aplicar todas as mudanças."
