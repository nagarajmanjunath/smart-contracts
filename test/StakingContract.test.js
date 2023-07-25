// Import the required libraries
const StakingCoin = artifacts.require("StakingCoin");
const StakingContract = artifacts.require("StakingContract");

// Start the test block
contract("StakingContract", function (accounts) {
  // Test case for staking

  // Define the mint amount
  const mintAmount = web3.utils.toWei("1000", "ether");
  it("should mint tokens to the contract", async function () {
    // Get instances of the contracts
    const stakingCoinInstance = await StakingCoin.deployed();
    const stakingContractInstance = await StakingContract.deployed();

    // Get the initial balance of the contract
    const contractBalanceBefore = await stakingCoinInstance.balanceOf.call(
      stakingContractInstance.address
    );

    // Mint new tokens
    await stakingCoinInstance.mint(stakingContractInstance.address, mintAmount);

    // Calculate the expected balance by adding the mint amount and the initial balance
    const expectedBalance = web3.utils
      .toBN(mintAmount)
      .add(web3.utils.toBN(contractBalanceBefore))
      .toString();

    // Check the contract's balance after minting
    const contractBalanceAfter = await stakingCoinInstance.balanceOf.call(
      stakingContractInstance.address
    );
    assert.equal(
      contractBalanceAfter.toString(),
      expectedBalance,
      "The contract does not have the correct balance after minting"
    );
  });
  it("should stake correctly", async function () {
    const stakingCoinInstance = await StakingCoin.deployed();
    const stakingContractInstance = await StakingContract.deployed();
    const amount = 1000;

    // Call the stake function from the first account
    await stakingCoinInstance.approve(stakingContractInstance.address, amount);
    await stakingContractInstance.stake(amount, { from: accounts[0] });

    // Retrieve the staking balance of the first account
    const balance = await stakingContractInstance.stakingBalance(accounts[0]);

    // Check if the staking balance is correct
    assert.equal(
      balance.toString(),
      amount.toString(),
      "The staking balance is incorrect"
    );
  });

  // Test case for reward distribution
  it("should distribute rewards correctly", async function () {
    const stakingContractInstance = await StakingContract.deployed();
    const amount = 1000;

    // Set rewardRate to 100 (100%)
    await stakingContractInstance.updateRewardRate(100);

    // Call the distributeRewards function for the first account
    await stakingContractInstance.distributeRewards(accounts[0]);

    // Retrieve the rewards of the first account
    const rewards = await stakingContractInstance.rewards(accounts[0]);

    // Check if the rewards are correct
    assert.equal(
      rewards.toString(),
      amount.toString(),
      "The rewards are incorrect"
    );
  });

  // Test case for reward claiming
  it("should claim rewards correctly", async function () {
    const stakingContractInstance = await StakingContract.deployed();
    const stakingCoinInstance = await StakingCoin.deployed();
    const initialBalance = await stakingCoinInstance.balanceOf(accounts[0]);

    // Call the claimRewards function from the first account
    await stakingContractInstance.claimRewards({ from: accounts[0] });

    // Retrieve the balance and rewards of the first account
    const finalBalance = await stakingCoinInstance.balanceOf(accounts[0]);
    const rewards = await stakingContractInstance.rewards(accounts[0]);

    const expectedFinalBalance = web3.utils
      .toBN(initialBalance)
      .add(web3.utils.toBN(1000))
      .toString();

    // Check if the rewards and balance are correct
    assert.equal(rewards.toString(), "0", "The rewards were not claimed");
    assert.equal(
      finalBalance.toString(),
      expectedFinalBalance,
      "The final balance is incorrect"
    );
  });
});
