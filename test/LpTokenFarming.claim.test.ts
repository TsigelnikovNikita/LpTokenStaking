import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { testUtils } from "./test.utils";


describe("LpTokenFarming.claim", () => {
  let lpTokenFarming : Contract;
  let lpToken : Contract;
  let rewardToken : Contract;

  let user1 : Signer;
  let user2 : Signer;
  let lpTokenFarmingOwner : Signer;
  let lpTokenOwner : Signer;

  let farmingEpoch = 10;
  let rewardPerFarmingEpoch = 10;
  let lockEpoch = 10;

  beforeEach(async () => {
    [user1, user2, lpTokenFarmingOwner, lpTokenOwner] = await ethers.getSigners();

    const lpTokenFactory = await ethers.getContractFactory("ERC20", lpTokenOwner);
    const rewardTokenFactory = await ethers.getContractFactory("ERC20", lpTokenFarmingOwner);
    const LpTokenFarmingFactory = await ethers.getContractFactory("LpTokenFarming", lpTokenFarmingOwner);

    lpToken = await lpTokenFactory.deploy("LP Token", "LPT");
    rewardToken = await rewardTokenFactory.deploy("Crypton Studio", "CRS");
    lpTokenFarming = await LpTokenFarmingFactory.deploy(lpToken.address, rewardToken.address, farmingEpoch,
                                                                                    rewardPerFarmingEpoch, lockEpoch);

    await lpToken.deployed();
    await rewardToken.deployed();
    await lpTokenFarming.deployed();

    await lpToken.connect(lpTokenOwner).mint(await user1.getAddress(), 100000);
    await rewardToken.connect(lpTokenFarmingOwner).mint(lpTokenFarming.address, 10000000000);

    await lpToken.connect(user1).approve(lpTokenFarming.address, 100000);
    await lpTokenFarming.connect(user1).stake(1000);
  });

  it("Must throw an expection if user can't claim reward yet", async () => {
    await expect(lpTokenFarming.connect(user1).claim())
      .to.revertedWith("LpTokenFarming: caller can't claim reward yet");
  });

  it("Must throw an expection if user doesn't have staking", async () => {
    await expect(lpTokenFarming.connect(user2).claim())
      .to.revertedWith("LpTokenFarming: caller doesn't have staking");
  });

  it("Must throw an expection if lpTokenFarming doesn't have enough liquidity for reward payment", async () => {
    await rewardToken.connect(lpTokenFarmingOwner).burn(lpTokenFarming.address, 10000000000);
    await testUtils.mineBlocks(farmingEpoch + 1);

    await expect(lpTokenFarming.connect(user1).claim())
      .to.revertedWith("LpTokenFarming: not enough liquidity for reward payment");
  });

  it("Must claim reward correctly", async () => {
    await testUtils.mineBlocks(farmingEpoch + 1);

    await expect(() => lpTokenFarming.connect(user1).claim())
      .to.changeTokenBalances(rewardToken, [user1, lpTokenFarming], [100, -100]);
  });

  it("Must claim reward for three epoch correctly", async () => {
    await testUtils.mineBlocks((farmingEpoch + 1) * 3);

    await expect(() => lpTokenFarming.connect(user1).claim())
      .to.changeTokenBalances(rewardToken, [user1, lpTokenFarming], [300, -300]);
  });

  it("Must claim reward correctly with 'inconvenient' numbers", async () => {
    lpTokenFarming.connect(lpTokenFarmingOwner).setRewardPerFarmingEpoch(38);
    await lpTokenFarming.connect(user1).stake(1234);

    await testUtils.mineBlocks(farmingEpoch + 1);

    await expect(() => lpTokenFarming.connect(user1).claim())
      .to.changeTokenBalances(rewardToken, [user1, lpTokenFarming], [848, -848]);
  });

  it("Must emit a Claimed event", async () => {
    await testUtils.mineBlocks(farmingEpoch + 1);

    await expect(lpTokenFarming.connect(user1).claim())
      .to.emit(lpTokenFarming, "Claimed")
      .withArgs(await user1.getAddress(), 100);
  });

  it("Must update staker's staking info", async () => {
    await testUtils.mineBlocks(farmingEpoch + 1);

    await lpTokenFarming.connect(user1).claim();

    const lastBlockNumber = (await ethers.provider.getBlock("latest")).number;
    const staking = await lpTokenFarming.stakers(await user1.getAddress());

    expect(staking.lastGetRewardTime).to.eq(lastBlockNumber);
  });
});
