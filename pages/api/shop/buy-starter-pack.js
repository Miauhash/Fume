// pages/api/shop/buy-starter-pack.js (VERSÃO FINAL E AUTOCONTIDA)
import { ethers } from 'ethers';
import prisma from '../../../lib/prisma';
import { FUMEGATOR_SPECIALIST_ABI } from '../../../lib/abi.js';
import dotenv from 'dotenv';
import path from 'path';

export default async function handler(req, res) {
    // --- CARREGA O .ENV MANUALMENTE ---
    try {
        const envPath = path.resolve(process.cwd(), '.env.production');
        dotenv.config({ path: envPath });
    } catch (e) {
        console.error("ERRO FATAL AO LER .ENV", e);
        return res.status(500).json({ message: "Configuração do servidor não encontrada." });
    }
    // ------------------------------------

    if (req.method !== 'POST') return res.status(405).json({ message: 'Método não permitido.' });

    const { userWallet, transactionHash } = req.body;
    const walletAddress = userWallet.toLowerCase().replace('ronin:', '0x');

    if (!userWallet || !transactionHash) {
        return res.status(400).json({ message: "Dados inválidos." });
    }

    try {
        // --- VERIFICAÇÃO DE PAGAMENTO ---
        const provider = new ethers.providers.JsonRpcProvider(process.env.SAIGON_RPC_URL);
        const tx = await provider.getTransaction(transactionHash);
        const expectedValue = ethers.utils.parseEther("0.5");
        const treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_WALLET_ADDRESS_RONIN.toLowerCase().replace('ronin:', '0x');
        if (!tx || tx.from.toLowerCase() !== walletAddress || tx.to.toLowerCase() !== treasuryAddress || !tx.value.eq(expectedValue)) {
            throw new Error("Verificação da transação de pagamento falhou.");
        }
        console.log("Pagamento verificado com sucesso.");

        // --- LÓGICA DE TRANSFERÊNCIA ---
        const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
        const VAULT_PRIVATE_KEY = process.env.MINTER_PRIVATE_KEY;
        const vaultAddress = new ethers.Wallet(VAULT_PRIVATE_KEY).address.toLowerCase();

        const vaultWallet = new ethers.Wallet(VAULT_PRIVATE_KEY, provider);
        const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, FUMEGATOR_SPECIALIST_ABI, vaultWallet);
        
        const availableNfts = await prisma.nft.findMany({
            where: { ownerWallet: vaultAddress },
            take: 2,
            orderBy: { tokenId: 'asc' }
        });

        if (availableNfts.length < 2) throw new Error("Estoque de NFTs para o Starter Pack esgotado.");

        for (const nft of availableNfts) {
            const transferTx = await contract.safeTransferFrom(vaultAddress, walletAddress, nft.tokenId);
            await transferTx.wait(1);
            await prisma.nft.update({
                where: { tokenId: nft.tokenId },
                data: { ownerWallet: walletAddress.toLowerCase() }
            });
        }
        
        res.status(200).json({ success: true, message: 'Starter Pack entregue com sucesso!' });

    } catch (error) {
        console.error(`[buy-starter-pack] ERRO CRÍTICO para ${walletAddress}:`, error);
        res.status(500).json({ message: error.message || "Erro ao processar a entrega." });
    }
}