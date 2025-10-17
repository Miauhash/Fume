// run.js (SCRIPT AUTÔNOMO FINAL - COM RESOLUÇÃO DE IMPORTS)
const { ethers } = require('ethers');
const fs = require('fs-extra');
const path = require('path');
const solc = require('solc');
const dotenv = require('dotenv');

dotenv.config();

// --- CONFIGURAÇÕES PRINCIPAIS ---
const SAIGON_RPC_URL = process.env.SAIGON_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const MINT_TO_ADDRESS = "ronin:583f863de13C33A97B587797B76b255E834a65AC"; // <<< SUBSTITUA PELO SEU ENDEREÇO
const BASE_URI = "https://www.fumegator.xyz/nfts/final_output/";
const QUANTITY_TO_MINT = 9000;
const CONTRACT_NAME = "Specialist";
const CONTRACT_FILE_NAME = "Specialist.sol";
// ------------------------------------

// <<< NOVA FUNÇÃO PARA RESOLVER IMPORTS DO OPENZEPPELIN >>>
function findImports(importPath) {
    try {
        // Tenta encontrar o arquivo dentro de node_modules
        const fullPath = require.resolve(importPath);
        const source = fs.readFileSync(fullPath, 'utf8');
        return { contents: source };
    } catch (error) {
        return { error: `File not found: ${error.message}` };
    }
}

async function main() {
  if (!SAIGON_RPC_URL || !PRIVATE_KEY || !MINT_TO_ADDRESS.startsWith("ronin:")) {
    console.error("ERRO: Verifique as variáveis SAIGON_RPC_URL, PRIVATE_KEY e MINT_TO_ADDRESS.");
    return;
  }

  // === ETAPA 1: COMPILAR O CONTRATO DINAMICAMENTE ===
  console.log("1/4 - Compilando o contrato...");
  const contractPath = path.resolve(__dirname, 'contracts', CONTRACT_FILE_NAME);
  const sourceCode = fs.readFileSync(contractPath, 'utf8');

  const input = {
    language: 'Solidity',
    sources: {
      [CONTRACT_FILE_NAME]: {
        content: sourceCode,
      },
    },
    settings: {
      // <<< ADICIONA O CALLBACK DE IMPORT >>>
      "remappings": [
        "@openzeppelin/=node_modules/@openzeppelin/"
      ],
      "outputSelection": {
        "*": {
          "*": ["abi", "evm.bytecode"],
        },
      },
    },
  };

  // <<< ATUALIZA A CHAMADA DE COMPILAÇÃO PARA INCLUIR O CALLBACK >>>
  const compiledOutput = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

  // Verifica se houve erros de compilação
  if (compiledOutput.errors) {
      let hasError = false;
      compiledOutput.errors.forEach((error) => {
          if (error.severity === 'error') {
              console.error("ERRO DE COMPILAÇÃO:", error.formattedMessage);
              hasError = true;
          }
      });
      if (hasError) {
          console.error("\nFalha na compilação. Corrija os erros acima.");
          return;
      }
  }

  const contractArtifact = compiledOutput.contracts[CONTRACT_FILE_NAME][CONTRACT_NAME];
  const abi = contractArtifact.abi;
  const bytecode = contractArtifact.evm.bytecode.object;
  console.log("Contrato compilado com sucesso.");

  // === ETAPA 2: CONECTAR E IMPLANTAR ===
  const provider = new ethers.providers.JsonRpcProvider(SAIGON_RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  console.log(`\n2/4 - Conectado à rede. Usando a carteira: ${wallet.address}`);
  console.log("Implantando o contrato 'Specialist'...");
  const SpecialistFactory = new ethers.ContractFactory(abi, bytecode, wallet);
  const specialistContract = await SpecialistFactory.deploy();
  await specialistContract.deployed();
  const contractAddress = specialistContract.address;
  console.log(">>> Contrato implantado com sucesso!");
  console.log(">>> Endereço do Contrato:", contractAddress);

  // === ETAPA 3: MINTAR OS NFTS ===
  console.log(`\n3/4 - Iniciando a mintagem de ${QUANTITY_TO_MINT} NFTs...`);
  const recipient = MINT_TO_ADDRESS.replace('ronin:', '0x');
  for (let i = 0; i < QUANTITY_TO_MINT; i++) {
    const tokenId = i;
    const tokenURI = `${BASE_URI}${tokenId}.json`;
    console.log(`[${i + 1}/${QUANTITY_TO_MINT}] Mintando NFT #${tokenId}...`);
    try {
        const tx = await specialistContract.safeMint(recipient, tokenURI);
        const receipt = await tx.wait(); 
        console.log(`  -> Sucesso! Transação: ${receipt.transactionHash.slice(0, 10)}...`);
    } catch (error) {
        console.error(`  !!! FALHA ao mintar NFT #${tokenId}:`, error.message);
    }
  }

  // === ETAPA 4: FINALIZAÇÃO ===
  console.log(`\n4/4 - Processo finalizado!`);
  console.log(`Guarde o endereço do contrato: ${contractAddress}`);
}

main().catch((error) => {
  console.error("\n--- UM ERRO INESPERADO OCORREU ---");
  console.error(error);
  process.exitCode = 1;
});
