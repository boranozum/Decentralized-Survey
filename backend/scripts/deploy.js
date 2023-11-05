const hre = require("hardhat");
const fs = require('fs/promises')

async function main() {

  const Polling = await hre.ethers.getContractFactory("Polling");
  const polling = await Polling.deploy();

  await polling.deployed();
  await writeDeploymentInfo(polling, 'polling.json')
}

async function writeDeploymentInfo(contract, filename=""){

  // console.log(contract);
  const data = {
    contract: {
      address: contract.target,
      signerAddress: contract.signer.address,
      abi: contract.interface.format()
    },
  };

  const content = JSON.stringify(data, null, 2);
  await fs.writeFile(filename, content, {encoding: "utf-8"});
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
