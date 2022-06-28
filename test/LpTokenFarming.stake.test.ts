import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";


describe("LpTokenFarming.stake", () => {
  let lpTokenFarming : Contract;
  let lpToken : Contract;

  let user : Signer;
  let lpTokenFarmingOwner : Signer;
  let lpTokenOwner : Signer;

  let farmingEpoch = 10;
  let rewardPerFarmingEpoch = 10;
  let lockEpoch = 10;

  beforeEach(async () => {
    [user, lpTokenFarmingOwner, lpTokenOwner] = await ethers.getSigners();

    const lpTokenFactory = await ethers.getContractFactory("ERC20", lpTokenOwner);
    const rewardTokenFactory = await ethers.getContractFactory("ERC20");
    const LpTokenFarmingFactory = await ethers.getContractFactory("LpTokenFarming", lpTokenFarmingOwner);

    lpToken = await lpTokenFactory.deploy("LP Token", "LPT");
    const rewardToken = await rewardTokenFactory.deploy("Crypton Studio", "CRS");
    lpTokenFarming = await LpTokenFarmingFactory.deploy(lpToken.address, rewardToken.address, farmingEpoch,
                                                                                    rewardPerFarmingEpoch, lockEpoch);

    await lpToken.deployed();
    await rewardToken.deployed();
    await lpTokenFarming.deployed();

    await lpToken.connect(lpTokenOwner).mint(await user.getAddress(), 1000);
  });

  it("Must throw an expection if user didn't approve amount", async () => {
    await expect(lpTokenFarming.connect(user).stake(1000))
      .to.revertedWith("LpTokenFarming: caller didn't allow amount of tokens");
  });

  it("Must throw an expection if user doesn't have such amount of tokens", async () => {
    await lpToken.connect(lpTokenOwner).burn(await user.getAddress(), 1000);
    await lpToken.connect(user).approve(lpTokenFarming.address, 1000);

    await expect(lpTokenFarming.connect(user).stake(1000))
      .to.revertedWith("LpTokenFarming: caller doesn't have such amount of tokens");
  });

  it("Must set staking of user correctly", async () => {
    await lpToken.connect(user).approve(lpTokenFarming.address, 1000);

    await lpTokenFarming.connect(user).stake(1000);

    const staking = await lpTokenFarming.stakers(await user.getAddress());

    const lastBlockTimestamp = (await ethers.provider.getBlock("latest")).timestamp;
    expect(staking.stakingTokensAmount).to.eq(1000);
    expect(staking.lastGetRewardTime).to.eq(lastBlockTimestamp);
    expect(staking.stakingTime).to.eq(lastBlockTimestamp);
  });

  it("Must add amount to the stake and reset stakingTime and lastGetRewardTime", async () => {
    await lpToken.connect(user).approve(lpTokenFarming.address, 1000);

    await lpTokenFarming.connect(user).stake(500);

    let staking = await lpTokenFarming.stakers(await user.getAddress());

    const prevLastGetRewardTime = staking.lastGetRewardTime;
    const prevStakingTime = staking.stakingTime;

    await lpTokenFarming.connect(user).stake(500);

    staking = await lpTokenFarming.stakers(await user.getAddress());

    expect(staking.stakingTokensAmount).to.eq(1000);
    expect(staking.lastGetRewardTime).to.gt(prevLastGetRewardTime);
    expect(staking.stakingTime).to.gt(prevStakingTime);
  });

  it("Must emit a Staked event", async () => {
    await lpToken.connect(user).approve(lpTokenFarming.address, 1000);

    await expect(lpTokenFarming.connect(user).stake(500))
      .to.emit(lpTokenFarming, "Staked")
      .withArgs(await user.getAddress(), 500);
  });

  it("Must transfer amount of tokens from user to the lpTokenFarming contract", async () => {
    await lpToken.connect(user).approve(lpTokenFarming.address, 1000);

    await expect(() => lpTokenFarming.connect(user).stake(500))
      .to.changeTokenBalances(lpToken, [user, lpTokenFarming], [-500, 500]);
  });
});
