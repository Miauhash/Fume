// pages/api/shop/buy-product.js (VERSÃO FINAL COM LEITURA MANUAL DO .ENV)
import { ethers } from 'ethers';
import prisma from '../../../lib/prisma';
import { FUMEGATOR_SPECIALIST_ABI } from '../../../lib/abi.js';
import fs from 'fs';
import path from 'path';

// --- FUNÇÃO DE FORÇA BRUTA PARA LER O .ENV ---
function getEnvVariables() {
    try {
        const envPath = path.resolve(process.cwd(), '.env.production');
        const fileContent = fs.readFileSync(envPath, 'utf8');
        const envConfig = {};
        fileContent.split('\n').forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith('#')) {
                const [key, ...valueParts] = trimmedLine.split('=');
                const value = valueParts.join('=').replace(/^"|"$/g, ''); // Remove quotes
                if (key) envConfig[key.trim()] = value.trim();
            }
        });
        console.log("[ENV MANUAL] Variáveis carregadas com sucesso.");
        return envConfig;
    } catch (error) {
        console.error("[ENV MANUAL] ERRO FATAL ao ler o arquivo .env.production:", error);
        return null;
    }
}
// ---------------------------------------------

function getVaultContract(env) {
    const NFT_CONTRACT_ADDRESS = env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS; 
    const VAULT_PRIVATE_KEY = env.MINTER_PRIVATE_KEY;
    const RPC_URL = env.SAIGON_RPC_URL;

    if (!VAULT_PRIVATE_KEY || !RPC_URL || !NFT_CONTRACT_ADDRESS) return null;
    
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const vaultWallet = new ethers.Wallet(VAULT_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, FUMEGATOR_SPECIALIST_ABI, provider);
    return contract.connect(vaultWallet);
}

const PRODUCTS = {
    'starter_pack': {
        price: "0.5",
        deliver: async (contract, recipient, env) => {
            const vaultAddress = env.MINTER_WALLET_ADDRESS.toLowerCase();
            const availableNfts = await prisma.nft.findMany({
                where: { ownerWallet: vaultAddress },
                take: 2,
                orderBy: { tokenId: 'asc' }
            });

            if (availableNfts.length < 2) throw new Error("Estoque de NFTs para o Starter Pack esgotado.");
            
            for (const nft of availableNfts) {
                const tx = await contract.safeTransferFrom(vaultAddress, recipient, nft.tokenId);
                await tx.wait(1);
                await prisma.nft.update({
                    where: { tokenId: nft.tokenId },
                    data: { ownerWallet: recipient.toLowerCase() }
                });
            }
        }
    }
};

export default async function handler(req, res) {
    // Carrega as variáveis manualmente no início de cada requisição
    const env = getEnvVariables();
    if (!env) {
        return res.status(500).json({ message: "Falha crítica ao carregar a configuração do servidor." });
    }

    const { userWallet, productId, transactionHash } = req.body;
    const product = PRODUCTS[productId];
    const walletAddress = userWallet.toLowerCase().replace('ronin:', '0x');

    if (!userWallet || !product || !transactionHash) {
        return res.status(400).json({ message: "Dados inválidos." });
    }

    try {
        const provider = new ethers.providers.JsonRpcProvider(env.SAIGON_RPC_URL);
        const tx = await provider.getTransaction(transactionHash);
        const expectedValue = ethers.utils.parseEther(product.price);
        const treasuryAddress = env.NEXT_PUBLIC_TREASURY_WALLET_ADDRESS_RONIN.toLowerCase().replace('ronin:', '0x');

        if (!tx || tx.from.toLowerCase() !== walletAddress || tx.to.toLowerCase() !== treasuryAddress || !tx.value.eq(expectedValue)) {
            throw new Error("Verificação da transação de pagamento falhou.");
        }
        
        const contract = getVaultContract(env);
        if (!contract) {
            throw new Error("Falha ao inicializar o contrato do Cofre.");
        }
        
        await product.deliver(contract, walletAddress, env);

        res.status(200).json({ success: true, message: 'Operação concluída com sucesso!' });

    } catch (error) {
        console.error(`[buy-product] ERRO CRÍTICO NO HANDLER para ${walletAddress}:`, error);
        res.status(500).json({ message: error.message || "Erro ao processar a entrega." });
    }
}