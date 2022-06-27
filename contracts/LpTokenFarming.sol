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
     * In seconds
     */
    uint public farmingEpoch;
    /**
     *  In percent. If rewardPerFarmingEpoch is equal to 5 it means 5% from amount of staking tokens
     */
    uint public rewardPerFarmingEpoch;
    /**
     * In seconds
     */
    uint public lockEpoch;

    struct Staking {
        uint stakingTokensAmount;
        uint lastGetRewardTime;
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

    function setFarmingEpoch(uint newFarmingEpoch) external onlyOwner {
        farmingEpoch = newFarmingEpoch;
    }

    function setRewardPerFarmingEpoch(uint newRewardPerFarmingEpoch) external onlyOwner {
        rewardPerFarmingEpoch = newRewardPerFarmingEpoch;
    }

    function stake(uint amount) external {
    }

    function claim() external {

    }

    function unstake() external {

    }
}
