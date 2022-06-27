const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LpTokenFarming.setFarmingEpoch", () => {
  let lpTokenFarming;
  let user;
  let lpTokenFarmingOwner;

  let farmingEpoch = 10;
  let rewardPerFarmingEpoch = 10;
  let lockEpoch = 10;

  beforeEach(async () => {
    [user, lpTokenFarmingOwner] = await ethers.getSigners();

    const lpTokenFactory = await ethers.getContractFactory("ERC20");
    const rewardTokenFactory = await ethers.getContractFactory("ERC20");
    const LpTokenFarmingFactory = await ethers.getContractFactory("LpTokenFarming", lpTokenFarmingOwner);

    const lpToken = await lpTokenFactory.deploy("LP Token", "LPT");
    const rewardToken = await rewardTokenFactory.deploy("Crypton Studio", "CRS");
    lpTokenFarming = await LpTokenFarmingFactory.deploy(lpToken.address, rewardToken.address, farmingEpoch,
                                                                                    rewardPerFarmingEpoch, lockEpoch);

    await lpToken.deployed();
    await rewardToken.deployed();
    await lpTokenFarming.deployed();
  });

  it("Must throw an expection if caller isn't the owner", async () => {
    await expect(lpTokenFarming.connect(user).setFarmingEpoch(10))
      .to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Must set farmingEpoch correctly ", async () => {
    expect(await lpTokenFarming.farmingEpoch()).to.eq(farmingEpoch);

    await lpTokenFarming.connect(lpTokenFarmingOwner).setFarmingEpoch(100);

    expect(await lpTokenFarming.farmingEpoch()).to.eq(100);
  });
});

describe("LpTokenFarming.setLockEpoch", () => {
  let lpTokenFarming;
  let user;
  let lpTokenFarmingOwner;

  let farmingEpoch = 10;
  let rewardPerFarmingEpoch = 10;
  let lockEpoch = 10;

  beforeEach(async () => {
    [user, lpTokenFarmingOwner] = await ethers.getSigners();

    const lpTokenFactory = await ethers.getContractFactory("ERC20");
    const rewardTokenFactory = await ethers.getContractFactory("ERC20");
    const LpTokenFarmingFactory = await ethers.getContractFactory("LpTokenFarming", lpTokenFarmingOwner);

    const lpToken = await lpTokenFactory.deploy("LP Token", "LPT");
    const rewardToken = await rewardTokenFactory.deploy("Crypton Studio", "CRS");
    lpTokenFarming = await LpTokenFarmingFactory.deploy(lpToken.address, rewardToken.address, farmingEpoch,
                                                                                    rewardPerFarmingEpoch, lockEpoch);

    await lpToken.deployed();
    await rewardToken.deployed();
    await lpTokenFarming.deployed();
  });

  it("Must throw an expection if caller isn't the owner", async () => {
    await expect(lpTokenFarming.connect(user).setLockEpoch(10))
      .to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Must set lockEpoch correctly ", async () => {
    expect(await lpTokenFarming.lockEpoch()).to.eq(farmingEpoch);

    await lpTokenFarming.connect(lpTokenFarmingOwner).setLockEpoch(100);

    expect(await lpTokenFarming.lockEpoch()).to.eq(100);
  });
});

describe("LpTokenFarming.setRewardPerFarmingEpoch", () => {
  let lpTokenFarming;
  let user;
  let lpTokenFarmingOwner;

  let farmingEpoch = 10;
  let rewardPerFarmingEpoch = 10;
  let lockEpoch = 10;

  beforeEach(async () => {
    [user, lpTokenFarmingOwner] = await ethers.getSigners();

    const lpTokenFactory = await ethers.getContractFactory("ERC20");
    const rewardTokenFactory = await ethers.getContractFactory("ERC20");
    const LpTokenFarmingFactory = await ethers.getContractFactory("LpTokenFarming", lpTokenFarmingOwner);

    const lpToken = await lpTokenFactory.deploy("LP Token", "LPT");
    const rewardToken = await rewardTokenFactory.deploy("Crypton Studio", "CRS");
    lpTokenFarming = await LpTokenFarmingFactory.deploy(lpToken.address, rewardToken.address, farmingEpoch,
                                                                                    rewardPerFarmingEpoch, lockEpoch);

    await lpToken.deployed();
    await rewardToken.deployed();
    await lpTokenFarming.deployed();
  });

  it("Must throw an expection if caller isn't the owner", async () => {
    await expect(lpTokenFarming.connect(user).setRewardPerFarmingEpoch(10))
      .to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Must set rewardPerFarmingEpoch correctly ", async () => {
    expect(await lpTokenFarming.rewardPerFarmingEpoch()).to.eq(farmingEpoch);

    await lpTokenFarming.connect(lpTokenFarmingOwner).setRewardPerFarmingEpoch(100);

    expect(await lpTokenFarming.rewardPerFarmingEpoch()).to.eq(100);
  });
});
