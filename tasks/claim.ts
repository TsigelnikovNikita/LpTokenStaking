import { task } from "hardhat/config";

task("claim", "Allows to claim your reward")
    .setAction(async (taskArgs, hre) => {
        const ContractFactory = await hre.ethers.getContractFactory("LpTokenFarming");
        const contract = ContractFactory.attach(process.env.CONTRACT_ADDRESS || '');

        await contract.claim()
            .then(async () => {
                console.log("Reward was successfully claimed");
            }, (error : any) => {
                console.log(error.reason);
            });
    });
