/*
 * These are constructor arguments of deployed contract. You are able to add any data, even
 * complex. Read more https://hardhat.org/plugins/nomiclabs-hardhat-etherscan#complex-arguments 
 */
module.exports = [
    process.env.LP_TOKEN_ADDRESS,
    process.env.REWARD_TOKEN_ADDRESS,
    process.env.FARMING_EPOCH,
    process.env.REWARD_PER_FARMING_EPOCH,
    process.env.LOCK_EPOCH,
  ];
