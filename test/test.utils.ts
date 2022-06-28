import { ethers, network } from "hardhat";

export namespace testUtils {
    export async function setNextBlockTimestamp(newTimestamp : number) {
        const lastBlockTimestamp = (await ethers.provider.getBlock("latest")).timestamp;
        await network.provider.send("evm_setNextBlockTimestamp", [lastBlockTimestamp + newTimestamp]);
    }

    export async function mineBlocks(newNumber : number) {
        await network.provider.send("hardhat_mine", ["0x" + (newNumber).toString(16)]);
    }
}
