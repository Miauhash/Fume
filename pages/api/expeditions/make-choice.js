// pages/api/expeditions/make-choice.js (VERSÃO CORRIGIDA E FUNCIONAL)

import prisma from '../../../lib/prisma';
// <<< CORREÇÃO: Importamos as ferramentas corretas do arquivo do cérebro >>>
import { EXPEDITION_SCENARIOS, processChoice } from '../../../lib/expeditions/expeditionChoices';

// Função para buscar os dados do NFT e do jogador (você pode expandir isso)
async function getEntityData(walletAddress, nftId) {
    // Busca o NFT pelo seu ID único do banco de dados
    const nft = await prisma.nft.findUnique({
        where: { id: nftId },
    });
    // Busca o estado do jogador
    const player = await prisma.gameState.findUnique({
        where: { wallet: walletAddress },
    });
    return { nftData: nft, playerData: player };
}


export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { walletAddress, nftId, expeditionId, scenarioId, choiceId } = req.body;

    if (!walletAddress || !nftId || !expeditionId || !scenarioId || !choiceId) {
        return res.status(400).json({ error: 'Dados da escolha incompletos.' });
    }

    try {
        // 1. Encontrar o cenário e a escolha nos nossos dados de configuração
        const expeditionConfig = EXPEDITION_SCENARIOS[expeditionId];
        const scenario = expeditionConfig?.scenarios.find(s => s.id === scenarioId);
        const choice = scenario?.choices.find(c => c.id === choiceId);

        if (!choice) {
            return res.status(404).json({ error: 'Cenário ou escolha não encontrados.' });
        }

        // 2. Buscar os dados atuais do jogador e do NFT do banco de dados
        //    (IMPORTANTE: Esta parte assume que você tem uma forma de buscar os dados.
        //     Se não, teremos que criar essa lógica)
        const { nftData, playerData } = await getEntityData(walletAddress, nftId);
        if (!nftData || !playerData) {
            return res.status(404).json({ error: 'Não foi possível encontrar os dados do NFT ou do jogador.' });
        }

        // 3. Usar a função 'processChoice' para determinar o resultado
        const result = processChoice(choice, playerData, nftData);

        // 4. (FUTURO) Aplicar as recompensas do 'result.outcome.rewards' ao banco de dados
        //    Ex: await prisma.gameState.update(...)

        // 5. Retornar o resultado para o frontend
        res.status(200).json({ result: result.outcome });

    } catch (error) {
        console.error("Erro ao processar escolha da expedição:", error);
        res.status(500).json({ error: 'Erro interno ao processar a escolha.' });
    }
}