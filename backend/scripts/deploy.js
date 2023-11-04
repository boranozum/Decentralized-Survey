const hre = require("hardhat");
const fs = require('fs/promises')

async function main() {

  const SurveyContract = await hre.ethers.getContractFactory("SurveyContract");
  const surveyContract = await SurveyContract.deploy();

  await surveyContract.waitForDeployment();
  await writeDeploymentInfo(surveyContract, 'survey_contract.json')
}

async function writeDeploymentInfo(contract, filename=""){
  const data = {
    contract: {
      address: contract.target,
      signerAddress: contract.runner.address,
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
