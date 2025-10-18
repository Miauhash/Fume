// bot/syncOwners.js (VERSÃO CORRIGIDA)
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { ethers } = require('ethers');

// <<< ESTA É A LINHA QUE FOI CORRIGIDA >>>
// Agora, ele importa o conteúdo inteiro do arquivo, que é o nosso ABI.
const FUMEGATOR_SPECIALIST_ABI = require('../lib/abi.js');

const prisma = new PrismaClient();

// --- CONFIGURAÇÃO ---
const RPC_URL = process.env.SAIGON_RPC_URL;
const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
// --------------------

async function syncOwners() {
    console.log("--- INICIANDO SCRIPT DE SINCRONIZAÇÃO DE DONOS ---");

    if (!RPC_URL || !NFT_CONTRACT_ADDRESS || !FUMEGATOR_SPECIALIST_ABI) {
        console.error("ERRO FATAL: Variáveis de ambiente (RPC_URL, NFT_CONTRACT_ADDRESS) ou ABI não foram carregados. Verifique seu arquivo .env e o caminho do ABI.");
        return;
    }

    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, FUMEGATOR_SPECIALIST_ABI, provider);

    console.log("Conectado à Ronin e ao contrato de NFT.");

    const nftsInDb = await prisma.nft.findMany();
    if (nftsInDb.length === 0) {
        console.error("ERRO: Nenhum NFT encontrado no banco de dados. Execute 'populateNfts.js' primeiro.");
        return;
    }
    console.log(`Encontrados ${nftsInDb.length} NFTs no banco de dados para verificar.`);

    let updatedCount = 0;

    for (const nft of nftsInDb) {
        try {
            const trueOwner = await contract.ownerOf(nft.tokenId);
            const formattedTrueOwner = trueOwner.toLowerCase();
            const currentOwnerInDb = nft.ownerWallet ? nft.ownerWallet.toLowerCase() : null;

            if (formattedTrueOwner !== currentOwnerInDb) {
                console.log(`[ATUALIZAÇÃO] Token #${nft.tokenId}: Dono no BD era ${currentOwnerInDb}, mas o dono real é ${formattedTrueOwner}. Atualizando...`);
                
                await prisma.nft.update({
                    where: { tokenId: nft.tokenId },
                    data: { ownerWallet: formattedTrueOwner },
                });
                updatedCount++;
            }
        } catch (error) {
            console.error(`ERRO ao verificar o dono do Token #${nft.tokenId}:`, error.message);
        }
    }

    console.log(`--- SINCRONIZAÇÃO COMPLETA ---`);
    console.log(`Total de ${updatedCount} registros de donos de NFT foram atualizados.`);
}

syncOwners()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());