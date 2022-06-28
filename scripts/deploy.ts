import { ethers } from "hardhat";

const CONTRACT_NAME="CONTRACT_NAME";

async function main() {
    const contractFactory = await ethers.getContractFactory(CONTRACT_NAME);

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