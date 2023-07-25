const StakingCoin = artifacts.require("StakingCoin");
const StakingContract = artifacts.require("StakingContract");

contract("StakingCoin", function (accounts) {
  it("should put 1000000 StakingCoin in the first account", async function () {
    const stakingCoinInstance = await StakingCoin.deployed();
    const balance = await stakingCoinInstance.balanceOf.call(accounts[0]);
    assert.equal(
      balance.toString(),
      "1000000000000000000000000",
      "1000000 wasn't in the first account"
    );
  });

  it("should transfer StakingCoin correctly", async function () {
    const stakingCoinInstance = await StakingCoin.deployed();
    const amount = 10;

    await stakingCoinInstance.transfer(accounts[1], amount, {
      from: accounts[0]
    });
    const balance0 = await stakingCoinInstance.balanceOf.call(accounts[0]);
    const balance1 = await stakingCoinInstance.balanceOf.call(accounts[1]);

    assert.equal(
      balance0.toString(),
      "999999999999999999999990",
      "Amount wasn't correctly taken from the sender"
    );
    assert.equal(
      balance1.toString(),
      "10",
      "Amount wasn't correctly sent to the receiver"
    );
  });
});

contract("StakingContract", function (accounts) {
  it("should stake StakingCoin correctly", async function () {
    const stakingCoinInstance = await StakingCoin.deployed();
    const stakingContractInstance = await StakingContract.deployed();
    const amount = 10;

    await stakingCoinInstance.approve(stakingContractInstance.address, amount, {
      from: accounts[0]
    });
    await stakingContractInstance.stake(amount, { from: accounts[0] });

    const stakingBalance = await stakingContractInstance.stakingBalance.call(
      accounts[0]
    );
    assert.equal(
      stakingBalance.toString(),
      "10",
      "Amount wasn't correctly staked"
    );
  });

  it("should unstake StakingCoin correctly", async function () {
    const stakingCoinInstance = await StakingCoin.deployed();
    const stakingContractInstance = await StakingContract.deployed();
    const amount = 5;

    await stakingContractInstance.unstake(amount, { from: accounts[0] });

    const stakingBalance = await stakingContractInstance.stakingBalance.call(
      accounts[0]
    );
    assert.equal(
      stakingBalance.toString(),
      "5",
      "Amount wasn't correctly unstaked"
    );
  });

  it("should distribute and claim rewards correctly", async function () {
    const stakingCoinInstance = await StakingCoin.deployed();
    const stakingContractInstance = await StakingContract.deployed();
    const stakeAmount = web3.utils.toWei("1000", "ether"); // Staking a larger amount
    const account = accounts[0];

    // Approve and stake tokens
    await stakingCoinInstance.approve(
      stakingContractInstance.address,
      stakeAmount,
      { from: account }
    );
    await stakingContractInstance.stake(stakeAmount, { from: account });

    // Distribute rewards
    await stakingContractInstance.distributeRewards({ from: account });

    // Check reward balance
    const rewardBalanceBefore = await stakingContractInstance.rewards.call(
      account
    );
    assert.notEqual(
      rewardBalanceBefore.toString(),
      "0",
      "No rewards were distributed"
    );

    // Claim rewards
    await stakingContractInstance.claimRewards({ from: account });

    // Check reward balance after claiming
    const rewardBalanceAfter = await stakingContractInstance.rewards.call(
      account
    );
    assert.equal(
      rewardBalanceAfter.toString(),
      "0",
      "Rewards were not correctly claimed"
    );

    // Check STK balance
    const stakingCoinBalance = await stakingCoinInstance.balanceOf.call(
      account
    );
    assert(
      BigInt(stakingCoinBalance.toString()) >= BigInt(stakeAmount),
      "STK balance did not increase after claiming rewards"
    );
  });
});
