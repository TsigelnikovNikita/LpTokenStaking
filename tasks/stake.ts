import { task } from "hardhat/config";

task("stake", "Allows to stake `amount` of tokens")
    .addParam("amount", "Amount of tokens for staking")
    .setAction(async (taskArgs, hre) => {
        const ContractFactory = await hre.ethers.getContractFactory("LpTokenFarming");
        const contract = ContractFactory.attach(process.env.CONTRACT_ADDRESS || '');

        await contract.stake(taskArgs.amount)
            .then(async () => {
                console.log("Tokens was successfully staked");
            }, (error : any) => {
                console.log(error.reason);
            });
    });
