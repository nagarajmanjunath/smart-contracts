const StakingCoin = artifacts.require("StakingCoin");
const StakingContract = artifacts.require("StakingContract");

module.exports = function (deployer) {
  deployer.deploy(StakingCoin).then(function () {
    return deployer.deploy(StakingContract, StakingCoin.address);
  });
};
