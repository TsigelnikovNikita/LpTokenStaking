import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";

// used for rejectedWith. More details here https://www.chaijs.com/plugins/chai-as-promised/
require("chai").use(require('chai-as-promised'));

describe("LpTokenFarming.constructor", () => {
  let lpToken : Contract;
  let rewardToken : Contract;
  let LpTokenFarmingFactory : ContractFactory;

  let farmingEpoch = 10;
  let rewardPerFarmingEpoch = 10;
  let lockEpoch = 10;

  beforeEach(async () => {
    const lpTokenFactory = await ethers.getContractFactory("ERC20");
    const rewardTokenFactory = await ethers.getContractFactory("ERC20");
    LpTokenFarmingFactory = await ethers.getContractFactory("LpTokenFarming");

    lpToken = await lpTokenFactory.deploy("LP Token", "LPT");
    rewardToken = await rewardTokenFactory.deploy("Crypton Studio", "CRS");

    await lpToken.deployed();
    await rewardToken.deployed();
  });

  it("Must throw an expection if address of lpToken is equal to zero", async () => {
    await expect(LpTokenFarmingFactory.deploy(ethers.constants.AddressZero, rewardToken.address, farmingEpoch,
                                                                                    rewardPerFarmingEpoch, lockEpoch))
      .to.be.revertedWith("LpTokenFarming: address of lpToken is equal to zero");
  });

  it("Must throw an expection if address of rewardToken is equal to zero", async () => {
    await expect(LpTokenFarmingFactory.deploy(lpToken.address, ethers.constants.AddressZero, farmingEpoch,
                                                                                    rewardPerFarmingEpoch, lockEpoch))
      .to.be.revertedWith("LpTokenFarming: address of rewardToken is equal to zero");
  });

  it("Must throw an expection if address of rewardToken is equal to zero", async () => {
    const lpTokenFarming = await LpTokenFarmingFactory.deploy(lpToken.address, rewardToken.address, farmingEpoch,
                                                                                      rewardPerFarmingEpoch, lockEpoch);
    lpTokenFarming.deployed();

    expect(await lpTokenFarming.lpToken()).to.eq(lpToken.address);
    expect(await lpTokenFarming.rewardToken()).to.eq(rewardToken.address);
    expect(await lpTokenFarming.farmingEpoch()).to.eq(farmingEpoch);
    expect(await lpTokenFarming.rewardPerFarmingEpoch()).to.eq(rewardPerFarmingEpoch);
    expect(await lpTokenFarming.lockEpoch()).to.eq(lockEpoch);
  });
});
