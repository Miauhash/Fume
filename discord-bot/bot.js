// /scripts/test-ethers.js
require('dotenv').config({ path: '.env.production' });
const { ethers } = require('ethers');

async function main() {
    console.log("--- INICIANDO TESTE ISOLADO DO ETHERS ---");

    const RPC_URL = process.env.SAIGON_RPC_URL;
    const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
    const VAULT_PRIVATE_KEY = process.env.MINTER_PRIVATE_KEY;

    if (!RPC_URL || !NFT_CONTRACT_ADDRESS || !VAULT_PRIVATE_KEY) {
        console.error("ERRO: Variáveis de ambiente não foram carregadas.");
        return;
    }

    console.log("Variáveis de ambiente carregadas com sucesso.");

    try {
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        const vaultWallet = new ethers.Wallet(VAULT_PRIVATE_KEY, provider);

        const abi = [ "function totalSupply() view returns (uint256)" ];
        
        const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, abi, vaultWallet);
        
        console.log("Contrato inicializado. Tentando chamar totalSupply...");
        
        const totalSupply = await contract.totalSupply();
        
        console.log("✅✅✅ SUCESSO! Conexão com o contrato funciona!");
        console.log(`Total Supply: ${totalSupply.toString()}`);

    } catch (error) {
        console.error("❌❌❌ FALHA no teste do Ethers:", error);
    }
}

main();