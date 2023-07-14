import { ethers } from "hardhat";

async function main() {
  //const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  //const unlockTime = currentTimestampInSeconds + 60;

  //const lockedAmount = ethers.utils.parseEther("0.001");

  const phoneCardContract = await ethers.getContractFactory("PhoneCard");
  const phoneCard = await phoneCardContract.deploy();

  await phoneCard.deployed();

  console.log(
    `PhoneCard deployed to ${phoneCard.address} on Celo testnet!`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
