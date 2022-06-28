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
     * Amount of the seconds in one farming epoch
     */
    uint public farmingEpoch;
    /**
     * Amount of percent from user's stake wich they get for every farmingEpoch time 
     */
    uint public rewardPerFarmingEpoch;
    /**
     * The time in the seconds for wich staked tokens will be locked
     */
    uint public lockEpoch;

    struct Staking {
        uint stakingTokensAmount;
        uint lastGetRewardTime;
        uint stakingTime;
    }

    mapping (address => Staking) stakers;

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
    event Staked(address indexed user, uint amount);

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
        lpToken.transferFrom(msg.sender, address(this), amount);

        Staking storage staking = stakers[msg.sender];

        staking.stakingTokensAmount += amount;
        staking.lastGetRewardTime = block.timestamp;
        staking.stakingTime = block.timestamp;

        emit Staked(msg.sender, amount);
    }

    function claim() external {

    }

    function unstake() external {

    }
}
