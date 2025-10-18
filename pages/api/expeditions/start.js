// pages/api/expeditions/start.js (VERSÃO FINAL E CORRETA)
import prisma from '../../../lib/prisma';
import { getMissionConfig } from '../../../lib/missionConfig';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // O frontend envia 'nftId', que é o tokenId do NFT.
    const { userWallet, nftId, missionType } = req.body;
    
    // Pegamos o endereço do contrato do nosso arquivo .env, pois todos os NFTs são do mesmo contrato.
    const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;

    const MISSION_CONFIG = getMissionConfig();
    const parsedTokenId = parseInt(nftId, 10);

    if (!userWallet || isNaN(parsedTokenId) || !NFT_CONTRACT_ADDRESS || !missionType || !MISSION_CONFIG[missionType]) {
        return res.status(400).json({ message: 'Dados da missão inválidos. Verifique os parâmetros e as variáveis de ambiente.' });
    }

    try {
        const existingExpedition = await prisma.expedition.findFirst({
            where: {
                tokenId: parsedTokenId, // Procura pelo tokenId
                contractAddress: NFT_CONTRACT_ADDRESS, // E pelo contractAddress
                rewardClaimed: false,
            },
        });

        if (existingExpedition) {
            return res.status(400).json({ message: 'Este Especialista já está em uma expedição.' });
        }
        
        const mission = MISSION_CONFIG[missionType];
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + mission.duration * 1000);

        const newExpedition = await prisma.expedition.create({
            data: {
                userWallet,
                tokenId: parsedTokenId, // Salva o tokenId vindo do frontend
                contractAddress: NFT_CONTRACT_ADDRESS, // Salva o contractAddress vindo do .env
                missionType,
                startedAt: startTime,
                endsAt: endTime,
                rewardToken: mission.rewardToken,
                rewardAmount: mission.rewardAmount,
                rewardClaimed: false,
            },
        });

        res.status(200).json({ message: 'Expedição iniciada com sucesso!', expedition: newExpedition });

    } catch (error) {
        console.error(`[API ERRO] /api/expeditions/start:`, error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
}