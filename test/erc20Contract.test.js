const MyToken = artifacts.require("MyToken");

contract("MyToken", (accounts) => {
  let token;
  const owner = accounts[0];
  const recipient = accounts[1];

  beforeEach(async () => {
    token = await MyToken.new("MyToken", "MTK", 18, 1000, { from: owner });
  });

  it("should mint tokens correctly", async () => {
    await token.mint(500, recipient, { from: owner });
    const balance = await token.balanceOf(recipient);
    assert.equal(balance, 500, "Minting did not work correctly");
  });

  it("should not allow non-owners to mint tokens", async () => {
    try {
      await token.mint(500, recipient, { from: recipient });
      assert.fail("Non-owner was able to mint tokens");
    } catch (error) {
      assert.ok(
        error.toString().includes("revert Only owner can perform this action"),
        "Wrong error message"
      );
    }
  });

  it("should burn tokens correctly", async () => {
    await token.mint(500, owner, { from: owner });
    await token.burn(200, { from: owner });
    const balance = await token.balanceOf(owner);
    assert.equal(balance.toString(), "1300", "Burning did not work correctly");
  });

  it("should not allow non-owners to burn tokens", async () => {
    try {
      await token.burn(200, { from: recipient });
      assert.fail("Non-owner was able to burn tokens");
    } catch (error) {
      assert.ok(
        error.toString().includes("revert Only owner can perform this action"),
        "Wrong error message"
      );
    }
  });

  it("should pause and unpause contract correctly", async () => {
    await token.pause({ from: owner });
    let paused = await token.paused();
    assert.equal(paused, true, "Contract did not pause correctly");

    await token.unpause({ from: owner });
    paused = await token.paused();
    assert.equal(paused, false, "Contract did not unpause correctly");
  });

  it("should not allow non-owners to pause contract", async () => {
    try {
      await token.pause({ from: recipient });
      assert.fail("Non-owner was able to pause contract");
    } catch (error) {
      assert.ok(
        error.toString().includes("revert Only owner can perform this action"),
        "Wrong error message"
      );
    }
  });
});
