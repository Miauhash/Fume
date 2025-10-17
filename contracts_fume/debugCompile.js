// debugCompile.js
const fs = require('fs');
const path = require('path');
const solc = require('solc');

const CONTRACT_FILE_NAME = "Specialist.sol";

try {
  console.log("--- Iniciando depuração da compilação ---");
  
  const contractPath = path.resolve(__dirname, 'contracts', CONTRACT_FILE_NAME);
  console.log(`Lendo o arquivo do contrato em: ${contractPath}`);
  
  const sourceCode = fs.readFileSync(contractPath, 'utf8');
  console.log("Código-fonte lido com sucesso.");

  const input = {
    language: 'Solidity',
    sources: {
      [CONTRACT_FILE_NAME]: {
        content: sourceCode,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'], // <<< Pede TUDO ao compilador
        },
      },
    },
  };

  console.log("Enviando para o compilador solc...");
  const compiledOutputRaw = solc.compile(JSON.stringify(input));
  const compiledOutput = JSON.parse(compiledOutputRaw);

  console.log("\n--- COMPILAÇÃO CONCLUÍDA ---");
  console.log("A estrutura completa do objeto de saída é:");
  
  // Imprime a estrutura do objeto de forma legível
  console.log(JSON.stringify(compiledOutput, null, 2));

  // Tenta acessar o nosso artefato para ver se ele existe
  if (compiledOutput.contracts && compiledOutput.contracts[CONTRACT_FILE_NAME] && compiledOutput.contracts[CONTRACT_FILE_NAME][CONTRACT_NAME]) {
      console.log("\n>>> SUCESSO: O artefato do contrato foi encontrado no caminho esperado!");
  } else {
      console.error("\n>>> FALHA: O artefato do contrato NÃO foi encontrado no caminho esperado.");
      console.error("Analise a estrutura impressa acima para encontrar o caminho correto.");
  }

} catch (error) {
  console.error("\n--- UM ERRO OCORREU DURANTE A DEPURAÇÃO ---");
  console.error(error);
}
