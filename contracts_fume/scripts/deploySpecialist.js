// scripts/deploySpecialist.js
const hre = require("hardhat");

async function main() {
  console.log("Preparando para implantar o contrato 'Specialist'...");

  const Specialist = await hre.ethers.getContractFactory("Specialist");
  const specialist = await Specialist.deploy();

  // Espera a implantação ser confirmada na blockchain
  await specialist.deployed();

  console.log(
    `\n>>> SUCESSO! <<<`
  );
  console.log(
    `Contrato "Specialist" implantado na rede '${hre.network.name}'.`
  );
  console.log(
    `Endereço do Contrato: ${specialist.address}`
  );
  console.log("\nCOPIE ESTE ENDEREÇO e cole-o no seu arquivo .env como NEXT_PUBLIC_NFT_CONTRACT_ADDRESS");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
