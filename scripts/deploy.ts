import { ethers } from "hardhat";

const CONTRACT_NAME="LpTokenFarming";

const LP_TOKEN_ADDRESS = process.env.LP_TOKEN_ADDRESS;
const REWARD_TOKEN_ADDRESS = process.env.REWARD_TOKEN_ADDRESS;

const farmingEpoch = process.env.FARMING_EPOCH;
const rewardPerFarmingEpoch = process.env.REWARD_PER_FARMING_EPOCH;
const lockEpoch = process.env.LOCK_EPOCH;

async function main() {
    const contractFactory = await ethers.getContractFactory(CONTRACT_NAME);

    const contract = await contractFactory.deploy(LP_TOKEN_ADDRESS, REWARD_TOKEN_ADDRESS,
                                                                        farmingEpoch, rewardPerFarmingEpoch, lockEpoch);
    console.log(`Transaction hash: ${contract.deployTransaction.hash}`);
    await contract.deployed();
    console.log(`${CONTRACT_NAME} deployed to: ${contract.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
});