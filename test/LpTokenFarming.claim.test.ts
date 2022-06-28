import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { testUtils } from "./test.utils";


describe("LpTokenFarming.claim", () => {
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

  it("Must throw an expection if user can't claim reward yet", async () => {
    await expect(lpTokenFarming.connect(user).claim())
      .to.revertedWith("LpTokenFarming: caller can't claim reward yet");
  });

  it("Must throw an expection if lpTokenFarming doesn't have enough liquidity for reward payment", async () => {
    await rewardToken.connect(lpTokenFarmingOwner).burn(lpTokenFarming.address, 10000000000);
    await testUtils.setNextBlockTimestamp(farmingEpoch + 1);

    await expect(lpTokenFarming.connect(user).claim())
      .to.revertedWith("LpTokenFarming: not enough liquidity for reward payment");
  });

  it("Must claim reward correctly", async () => {
    await testUtils.setNextBlockTimestamp(farmingEpoch + 1);

    await expect(() => lpTokenFarming.connect(user).claim())
      .to.changeTokenBalances(rewardToken, [user, lpTokenFarming], [100, -100]);
  });

  it("Must claim reward for three epoch correctly", async () => {
    await testUtils.setNextBlockTimestamp((farmingEpoch + 1) * 3);

    await expect(() => lpTokenFarming.connect(user).claim())
      .to.changeTokenBalances(rewardToken, [user, lpTokenFarming], [300, -300]);
  });

  it("Must claim reward correctly with 'inconvenient' numbers", async () => {
    lpTokenFarming.connect(lpTokenFarmingOwner).setRewardPerFarmingEpoch(38);
    await lpTokenFarming.connect(user).stake(1234);

    await testUtils.setNextBlockTimestamp(farmingEpoch + 1);

    await expect(() => lpTokenFarming.connect(user).claim())
      .to.changeTokenBalances(rewardToken, [user, lpTokenFarming], [848, -848]);
  });

  it("Must emit a Staked event", async () => {    
    await testUtils.setNextBlockTimestamp(farmingEpoch + 1);

    await expect(lpTokenFarming.connect(user).claim())
      .to.emit(lpTokenFarming, "Claimed")
      .withArgs(await user.getAddress(), 100);
  });

  it("Must update staker's staking info", async () => {    
    await testUtils.setNextBlockTimestamp(farmingEpoch + 1);

    await lpTokenFarming.connect(user).claim();

    const lastBlockTimestamp = (await ethers.provider.getBlock("latest")).timestamp;
    const staking = await lpTokenFarming.stakers(await user.getAddress());

    expect(staking.lastGetRewardTime).to.eq(lastBlockTimestamp);
  });
});
