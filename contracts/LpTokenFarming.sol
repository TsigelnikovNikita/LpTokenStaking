//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

 // TODO: don't forget remove this after ending development!
import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LpTokenFarming is Ownable {
    IERC20 immutable public lpToken;
    IERC20 immutable public rewardToken;

    /**
     * Amount of the blocks in one farming epoch. Suppose that one block is generated every 15 seconds
     */
    uint public farmingEpoch;
    /**
     * Amount of percent from user's stake wich they get for every farmingEpoch time 
     */
    uint public rewardPerFarmingEpoch;
    /**
     * The time in the blocks for wich staked tokens will be locked. Suppose that one block is generated every 15
     * seconds
     */
    uint public lockEpoch;

    struct Staking {
        uint stakingTokensAmount;
        uint lastGetRewardTime;
        uint stakingTime;
    }

    mapping (address => Staking) public stakers;

    constructor(address lpTokenAddress,
                address rewardTokenAddress,
                uint _farmingEpoch,
                uint _rewardPerFarmingEpoch,
                uint _lockEpoch) {
        require(lpTokenAddress != address(0x0), "LpTokenFarming: address of lpToken is equal to zero");
        require(rewardTokenAddress != address(0x0), "LpTokenFarming: address of rewardToken is equal to zero");
        lpToken = IERC20(lpTokenAddress);
        rewardToken = IERC20(rewardTokenAddress);

        farmingEpoch = _farmingEpoch;
        rewardPerFarmingEpoch = _rewardPerFarmingEpoch;
        lockEpoch = _lockEpoch;
    }

    /**
     * MODIFIERS
     */

    /**
     * @dev emitted from {stake} function
     */
    event Staked(address indexed user, uint amount);
    /**
     * @dev emitted from {claim} function
     */
    event Claimed(address indexed user, uint amount);
    /**
     * @dev emitted from {unstake} function
     */
    event Unstaked(address indexed user, uint amount);

    /**
     * FUNCTIONS
     */

    /**
     * @dev Allows to change epoch of farming. This function can call only Owner of contract.
     *
     * @param newFarmingEpoch new value for `farmingEpoch` 
     */
    function setFarmingEpoch(uint newFarmingEpoch) external onlyOwner {
        farmingEpoch = newFarmingEpoch;
    }

    /**
     * @dev Allows to change epoch of locking of stake. This function can call only Owner of contract.
     *
     * @param newLockEpoch new value for `lockEpoch` 
     */
    function setLockEpoch(uint newLockEpoch) external onlyOwner {
        lockEpoch = newLockEpoch;
    }

    /**
     * @dev Allows to change reward for stake per farming epoch. This function can call only Owner of contract.
     *
     * @param newRewardPerFarmingEpoch new value for `rewardPerFarmingEpoch` 
     */
    function setRewardPerFarmingEpoch(uint newRewardPerFarmingEpoch) external onlyOwner {
        rewardPerFarmingEpoch = newRewardPerFarmingEpoch;
    }

    /**
     * @dev Allows to stake `amount` of tokens. Before calling this function user must to call approve function from
     * `lpToken` address. This function resets `lastGetRewardTime` and `statingTime` of staker.
     *
     * @param amount amount of staking tokens
     *
     * emit {Staked} event
     */
    function stake(uint amount) external {
        require(amount > 0, "LpTokenFarming: amount must be greater than zero");
        require(lpToken.allowance(msg.sender, address(this)) >= amount,
                                                                "LpTokenFarming: caller didn't allow amount of tokens");
        require(lpToken.balanceOf(msg.sender) >= amount, "LpTokenFarming: caller doesn't have such amount of tokens");
        lpToken.transferFrom(msg.sender, address(this), amount);

        Staking storage staking = stakers[msg.sender];

        staking.stakingTokensAmount += amount;
        staking.lastGetRewardTime = block.number;
        staking.stakingTime = block.number;

        emit Staked(msg.sender, amount);
    }

    /**
     * @dev Allows to claim reward for farming of lpTokens. Function will throw an exception if contract doesn't have
     * enough liquidity for reward payment. If everything is okay, contract will transfer user's reward to the user.
     *
     * emit {Claimed} event
     */
    function claim() external {
        Staking storage staking = stakers[msg.sender];

        uint stakingTime = block.number - staking.lastGetRewardTime;
        require(stakingTime > farmingEpoch, "LpTokenFarming: caller can't claim reward yet");
        uint amountOfFarmingEpoch = stakingTime / farmingEpoch;

        uint claimPerEpoch = (rewardPerFarmingEpoch * staking.stakingTokensAmount) / 100;
        uint totalClaim = claimPerEpoch * amountOfFarmingEpoch;

        require(rewardToken.balanceOf(address(this)) >= totalClaim,
                                                            "LpTokenFarming: not enough liquidity for reward payment");

        staking.lastGetRewardTime = block.number;
        rewardToken.transfer(msg.sender, totalClaim);

        emit Claimed(msg.sender, totalClaim);
    }

    /**
     * @dev Allows to unstake all {lpToken} amount from the LpTokenFarming contract. Be careful, unstake function
     * doesn't call {claim} function! This means that you need to call {claim} before {unstake} yourself.
     *
     * emit {Unstaked} event
     */
    function unstake() external {
        Staking storage staking = stakers[msg.sender];

        require(staking.stakingTokensAmount > 0, "LpTokenFarming: caller doesn't have staking");
        require(block.number - staking.stakingTime > lockEpoch, "LpTokenFarming: caller can't unstake tokens yet");

        uint stakingTokensAmount = staking.stakingTokensAmount;
        delete stakers[msg.sender];
        lpToken.transfer(msg.sender, stakingTokensAmount);

        emit Unstaked(msg.sender, stakingTokensAmount);
    }
}
