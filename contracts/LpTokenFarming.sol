//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

 // TODO: don't forget remove this after ending development!
import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LpTokenFarming is Ownable {
    IERC20 immutable public lpToken;
    IERC20 immutable public rewardToken;

    uint public farmingEpoch;
    uint public rewardPerEpoch;

    constructor(address lpTokenAddress, address rewardTokenAddress) {
        require(lpTokenAddress != address(0x0), "LpTokenFarming: address of lpToken can't be equal to zero");
        require(rewardTokenAddress != address(0x0), "LpTokenFarming: address of rewardToken can't be equal to zero");
        lpToken = IERC20(lpTokenAddress);
        rewardToken = IERC20(rewardTokenAddress);
    }

    function setFarmingEpoch(uint newFarmingEpoch) external onlyOwner {
        farmingEpoch = newFarmingEpoch;
    }

    function setRewardPerEpoch(uint newRewardPerEpoch) external onlyOwner {
        rewardPerEpoch = newRewardPerEpoch;
    }

    function stake(uint amount) external {

    }

    function claim() external {

    }

    function unstake() external {
        
    }
}
