const hre = require("hardhat");

async function main() {
  const CharityDonation = await hre.ethers.getContractFactory("CharityDonation");
  const contract = await CharityDonation.deploy();
  await contract.deployed();
  console.log(`Contract deployed to: ${contract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
