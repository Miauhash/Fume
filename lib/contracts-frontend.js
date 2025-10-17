// lib/contracts-frontend.js (VERSÃO FINAL COM SINTAXE CORRIGIDA E ENDEREÇO HARDCODED)
import { ethers } from 'ethers';
import { FUMEGATOR_SPECIALIST_ABI } from './abi.js';

export const getFumegatorSpecialistContract_READONLY = (provider) => {
    // <<< ENDEREÇO DO NOVO CONTRATO FIXO PARA GARANTIR >>>
    const NFT_CONTRACT_ADDRESS = "0x067871fF63776B6718A149a9130874DBe2428E83";

    if (!provider) return null;
    return new ethers.Contract(NFT_CONTRACT_ADDRESS, FUMEGATOR_SPECIALIST_ABI, provider);
};

// --- Lógica dos Tokens ERC-20 (permanece a mesma) ---
const ERC20_ABI = [ "function name() view returns (string)", "function symbol() view returns (string)", "function balanceOf(address account) view returns (uint256)" ];
export const TOKEN_CONTRACT_ADDRESSES = { INSULINE: process.env.NEXT_PUBLIC_INSULINE_CONTRACT_ADDRESS, ZOLGENSMA: process.env.NEXT_PUBLIC_ZOLGENSMA_CONTRACT_ADDRESS, LUXUTURNA: process.env.NEXT_PUBLIC_LUXUTURNA_CONTRACT_ADDRESS, ZYNTEGLO: process.env.NEXT_PUBLIC_ZYNTEGLO_CONTRACT_ADDRESS, VIDA: process.env.NEXT_PUBLIC_VIDA_CONTRACT_ADDRESS, };

// <<< A CORREÇÃO ESTÁ AQUI: 'providerOrSigner' sem o espaço >>>
export const getTokenContract = (tokenSymbol, providerOrSigner) => { 
    const tokenKey = tokenSymbol.toUpperCase(); 
    const address = TOKEN_CONTRACT_ADDRESSES[tokenKey]; 
    if (!address) throw new Error(`Endereço de contrato não encontrado para o token: ${tokenSymbol}`); 
    return new ethers.Contract(address, ERC20_ABI, providerOrSigner); 
};