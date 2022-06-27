const hre = require("hardhat");

const CONTRACT_NAME="CONTRACT_NAME";

async function main() {
    const contractFactory = await hre.ethers.getContractFactory(CONTRACT_NAME);
    await hre.storageLayout.export();

    const contract = await contractFactory.deploy();
    await contract.deployed();
    console.log(`${CONTRACT_NAME} deployed to: ${contract.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
});