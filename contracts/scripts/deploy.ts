import { ethers } from "hardhat";

async function main() {
  console.log("Deployed Factory + Implementation + Airdropper")
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Factory Contract (erc20 impl is deployed inside factory's constructor)
  const ERC20Factory = await ethers.getContractFactory("ERC20Factory")
  const factory = await ERC20Factory.deploy()

  console.log("ERC20Factory address:", factory.address);

  // Airdrop Contract
  const Airdrop = await ethers.getContractFactory("Airdrop");
  const airdrop = await Airdrop.deploy();
  console.log("Airdrop address:", airdrop.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
