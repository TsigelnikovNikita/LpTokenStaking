import { ethers, network } from "hardhat";

export namespace testUtils {
    export async function setNextBlockTimestamp(newTimestamp : number) {
        const lastBlockTimestamp = (await ethers.provider.getBlock("latest")).timestamp;
        await network.provider.send("evm_setNextBlockTimestamp", [lastBlockTimestamp + newTimestamp]);
    }
}
