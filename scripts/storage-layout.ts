import hre from "hardhat";

// Change name of contract here
const CONTRACT_NAME="LpTokenFarming";
const MOCK_TOKEN_ADDRESS_1 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const MOCK_TOKEN_ADDRESS_2 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

const farmingEpoch = 10;
const rewardPerFarmingEpoch = 10;
const lockEpoch = 10;

/*
 * This script will generate and show report of storage layout of your contract using
 * hardhat-storage-layout package.
 * More details here: https://www.npmjs.com/package/hardhat-storage-layout
 */ 
async function main() {
    await hre.storageLayout.export();

    const contractFactory = await hre.ethers.getContractFactory(CONTRACT_NAME);
    const contract = await contractFactory.deploy(MOCK_TOKEN_ADDRESS_1, MOCK_TOKEN_ADDRESS_2,
                                                                        farmingEpoch, rewardPerFarmingEpoch, lockEpoch);
    await contract.deployed();
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
});
