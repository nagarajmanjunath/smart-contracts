const StakingCoin = artifacts.require("StakingCoin");
const StakingContract = artifacts.require("StakingContract");

contract("StakingContract", function (accounts) {
  // Define the mint amount
  const mintAmount = web3.utils.toWei("1000", "ether");
  const stakeAmount = web3.utils.toWei("500", "ether"); // Staking half of the minted amount

  it("should mint tokens to the contract", async function () {
    const stakingCoinInstance = await StakingCoin.deployed();
    const stakingContractInstance = await StakingContract.deployed();

    // Mint new tokens to the first account
    await stakingCoinInstance.mint(accounts[0], mintAmount);

    // Approve the staking contract to spend the account's tokens
    await stakingCoinInstance.approve(
      stakingContractInstance.address,
      mintAmount,
      { from: accounts[0] }
    );

    // Transfer the minted tokens to the staking contract
    await stakingCoinInstance.transfer(
      stakingContractInstance.address,
      mintAmount,
      { from: accounts[0] }
    );
  });

  it("should stake correctly", async function () {
    const stakingCoinInstance = await StakingCoin.deployed();
    const stakingContractInstance = await StakingContract.deployed();

    // Stake tokens
    await stakingContractInstance.stake(stakeAmount, { from: accounts[0] });

    // Check if the staking balance is correct
    const balance = await stakingContractInstance.stakingBalance(accounts[0]);
    assert.equal(
      balance.toString(),
      stakeAmount,
      "The staking balance is incorrect"
    );
  });

  it("should distribute rewards correctly", async function () {
    const stakingContractInstance = await StakingContract.deployed();

    // Distribute rewards
    await stakingContractInstance.distributeRewards(accounts[0]);

    // Check if the rewards are correct
    const rewards = await stakingContractInstance.rewards(accounts[0]);
    assert.notEqual(rewards.toString(), "0", "No rewards were distributed");
  });

  it("should claim rewards correctly", async function () {
    const stakingContractInstance = await StakingContract.deployed();
    const stakingCoinInstance = await StakingCoin.deployed();

    // Claim rewards
    await stakingContractInstance.claimRewards({ from: accounts[0] });

    // Check if the rewards have been claimed
    const rewards = await stakingContractInstance.rewards(accounts[0]);
    assert.equal(rewards.toString(), "0", "The rewards were not claimed");

    // Check if the account's balance increased after claiming rewards
    const balanceAfterClaim = await stakingCoinInstance.balanceOf(accounts[0]);
    assert.notEqual(
      balanceAfterClaim.toString(),
      mintAmount,
      "The account balance did not increase after claiming rewards"
    );
  });
});
