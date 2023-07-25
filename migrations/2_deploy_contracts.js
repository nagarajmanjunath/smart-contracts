const StakingCoin = artifacts.require("StakingCoin");
const StakingContract = artifacts.require("StakingContract");

module.exports = async function (deployer) {
  await deployer.deploy(StakingCoin);
  const stakingCoin = await StakingCoin.deployed();

  const rewardRate = web3.utils.toWei("0.0000000000000001", "ether"); // 0.01 tokens per block
  await deployer.deploy(StakingContract, stakingCoin.address, rewardRate);
};
