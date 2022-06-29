import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { testUtils } from "./test.utils";


describe("LpTokenFarming.unstake", () => {
  let lpTokenFarming : Contract;
  let lpToken : Contract;
  let rewardToken : Contract;

  let user : Signer;
  let lpTokenFarmingOwner : Signer;
  let lpTokenOwner : Signer;

  let farmingEpoch = 10;
  let rewardPerFarmingEpoch = 10;
  let lockEpoch = 10;

  beforeEach(async () => {
    [user, lpTokenFarmingOwner, lpTokenOwner] = await ethers.getSigners();

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

    await lpToken.connect(lpTokenOwner).mint(await user.getAddress(), 100000);
    await rewardToken.connect(lpTokenFarmingOwner).mint(lpTokenFarming.address, 10000000000);

    await lpToken.connect(user).approve(lpTokenFarming.address, 100000);
    await lpTokenFarming.connect(user).stake(1000);
  });

  it("Must throw an expection if user can't unstake tokens yet", async () => {
    await expect(lpTokenFarming.connect(user).unstake())
      .to.revertedWith("LpTokenFarming: caller can't unstake tokens yet");
  });

  it("Must throw an expection if user doesn't have staking", async () => {
    await testUtils.mineBlocks(lockEpoch + 1);

    await lpTokenFarming.connect(user).unstake();

    await expect(lpTokenFarming.connect(user).unstake())
      .to.revertedWith("LpTokenFarming: caller doesn't have staking");
  });

  it("Must unstake tokens correctly", async () => {
    await testUtils.mineBlocks(lockEpoch + 1);

    await expect(() => lpTokenFarming.connect(user).unstake())
      .to.changeTokenBalances(lpToken, [user, lpTokenFarming], [1000, -1000]);
  });

  it("Must emit a Unstaked event", async () => {
    await testUtils.mineBlocks(farmingEpoch + 1);

    await expect(lpTokenFarming.connect(user).unstake())
      .to.emit(lpTokenFarming, "Unstaked")
      .withArgs(await user.getAddress(), 1000);
  });

  it("Must remove staker's staking info", async () => {
    await testUtils.mineBlocks(farmingEpoch + 1);

    await lpTokenFarming.connect(user).unstake();

    const staking = await lpTokenFarming.stakers(await user.getAddress());

    expect(staking.lastGetRewardTime).to.eq(0);
    expect(staking.stakingTokensAmount).to.eq(0);
    expect(staking.stakingTime).to.eq(0);
  });
});
