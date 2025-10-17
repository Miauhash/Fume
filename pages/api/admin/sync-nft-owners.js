// /pages/api/admin/sync-nft-owners.js (VERSÃO FINAL E AUTOCONTIDA)
import { ethers } from 'ethers';
import prisma from '../../../lib/prisma';
import dotenv from 'dotenv';
import path from 'path';

// Força o carregamento do .env.production para garantir
dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });

// <<< O ABI COMPLETO DO CONTRATO V2 ESTÁ AGORA DIRETAMENTE AQUI DENTRO >>>
const FUMEGATOR_SPECIALIST_ABI = [
	{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "OwnableInvalidOwner", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "OwnableUnauthorizedAccount", "type": "error" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "quantity", "type": "uint256" } ], "name": "mintBatch", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "newBaseURI", "type": "string" } ], "name": "setBaseURI", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "ownerOf", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "tokenURI", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }
];

async function fetchMetadata(url) {
    if (!url) return null;
    try {
        const response = await fetch(url);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.warn(`Falha ao buscar metadados de ${url}`);
        return null;
    }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não permitido.' });
    }

    const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY;
    const authHeader = req.headers.authorization;
    if (!ADMIN_SECRET || authHeader !== `Bearer ${ADMIN_SECRET}`) {
        return res.status(401).json({ message: 'Não autorizado.' });
    }
    
    res.status(202).json({ message: "Sincronização iniciada. Monitore os logs do servidor." });

    console.log("Iniciando sincronização completa de NFTs...");
    try {
        const provider = new ethers.providers.JsonRpcProvider(process.env.SAIGON_RPC_URL);
        const contract = new ethers.Contract(process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS, FUMEGATOR_SPECIALIST_ABI, provider);

        const totalSupply = (await contract.totalSupply()).toNumber();
        console.log(`Total de NFTs para verificar na blockchain: ${totalSupply}`);

        if (totalSupply === 0) {
            console.log("Nenhum NFT mintado ainda. Sincronização concluída.");
            return;
        }

        for (let i = 0; i < totalSupply; i++) {
            const tokenId = i;
            try {
                const owner = await contract.ownerOf(tokenId);
                const ownerAddress = owner.toLowerCase();
                const tokenUri = await contract.tokenURI(tokenId);
                
                let metadata = { name: `Specialist #${tokenId}`, image: '', rarity: 'Unknown' };

                const fetchedMeta = await fetchMetadata(tokenUri);
                if (fetchedMeta) {
                    metadata.name = fetchedMeta.name;
                    metadata.image = fetchedMeta.image;
                    const rarityAttr = fetchedMeta.attributes?.find(a => a.trait_type === 'Rarity');
                    if (rarityAttr) metadata.rarity = rarityAttr.value;
                }
                
                await prisma.nft.upsert({
                    where: { tokenId: tokenId },
                    update: { ownerWallet: ownerAddress, name: metadata.name, image: metadata.image, rarity: metadata.rarity },
                    create: { tokenId: tokenId, ownerWallet: ownerAddress, name: metadata.name, image: metadata.image, rarity: metadata.rarity }
                });
                
                if (i > 0 && i % 100 === 0) {
                    console.log(`Sincronizado até o Token ID: ${i}`);
                }

            } catch (error) {
                if (error.message && !error.message.includes("execution reverted")) {
                    console.warn(`Erro ao processar Token ID ${tokenId}:`, error.message);
                }
            }
        }
        console.log("Sincronização completa (donos e metadados) concluída com sucesso!");

    } catch (error) {
        console.error("ERRO CRÍTICO DURANTE A SINCRONIZAÇÃO:", error);
    }
}