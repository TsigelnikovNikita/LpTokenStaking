require("dotenv").config();

task("task template", "Description of the task")
    .addParam("ParamName", "This is a mandatory param")
    .addOptionalParam("ParamName", "This is not a mandatory param")
    .setAction(async (taskArgs) => {
        const ContractFactory = await ethers.getContractFactory("ContractName");
        const contract = await ContractFactory.attach(process.env.CONTRACT_ADDRESS);

        await contract.method(taskArgs.arg1, taskArgs.arg2)
            .then(async (result) => {
                console.log(`success ${result}`);
            }, (error) => {
                console.log(error.reason);
            });
    });
