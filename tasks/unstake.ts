import { task } from "hardhat/config";

task("unstake", "Allows to unstake staking tokens")
    .setAction(async (taskArgs, hre) => {
        const ContractFactory = await hre.ethers.getContractFactory("LpTokenFarming");
        const contract = ContractFactory.attach(process.env.CONTRACT_ADDRESS || '');

        await contract.unstake()
            .then(async () => {
                console.log("Tokens was successfully unstaked");
            }, (error : any) => {
                console.log(error.reason);
            });
    });
