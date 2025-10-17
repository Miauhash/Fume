// lib/contracts-backend.js (VERSÃO FINAL PARA TRANSFERÊNCIA)
import { ethers } from 'ethers';
import { FUMEGATOR_SPECIALIST_ABI } from './abi.js';

/**
 * Cria uma instância do contrato conectada à carteira Minter/Cofre.
 * Usado para TRANSFERIR NFTs existentes.
 */
export const getVaultContract = () => {
    // Endereço do contrato onde os NFTs do Starter Pack estão
    const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS; 
    const VAULT_PRIVATE_KEY = process.env.MINTER_PRIVATE_KEY; // Usando a Minter como cofre
    const RPC_URL = process.env.SAIGON_RPC_URL;

    if (!VAULT_PRIVATE_KEY || !RPC_URL || !NFT_CONTRACT_ADDRESS) {
        console.error("[contracts-backend] ERRO: Variáveis para Cofre/Minter faltando.");
        return null;
    }
    try {
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        const vaultWallet = new ethers.Wallet(VAULT_PRIVATE_KEY, provider);
        const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, FUMEGATOR_SPECIALIST_ABI, provider);
        return contract.connect(vaultWallet);
    } catch (error) {
        console.error("[contracts-backend] ERRO ao criar instância do Cofre:", error);
        return null;
    }
};