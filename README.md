# Smart Contracts Repository

This repository hosts an implementation of the ERC20 token standard and a staking contract, all written in Solidity. The contracts have been developed using Solidity 0.8.19v and are accompanied by test cases that can be executed with the Truffle framework.

## Prerequisites

1. Node.js and npm (Node Package Manager)
2. Solidity compiler 0.8.19
3. Installation

## Contents

- Contracts folder :- which contains three file

  - `erc20.sol` which is standard token creation `erc20` contract with paused and unpaused methods.
  - `Staking.sol` which contains implementation for token staking and distribution.of award and claim award.
  - `StakingCoin.sol` which is standard token with 1mil total supply.

- Test folder :- which contains tests for `erc20token` and `staking contracts`.

## Steps for running code

```

git clone git@github.com:nagarajmanjunath/smart-contracts.git
cd smart-contracts

npm install -g truffle
npm install ethereumjs-testrpc web3@0.20.1

```

## Running Tests

- To run all test cases, use the following command:

```
truffle test
```

- If you wish to run a single test case, use the following command, replacing ./test/erc20Contract.test.js with the path to your test file:

```
truffle test ./test/erc20Contract.test.js
```
