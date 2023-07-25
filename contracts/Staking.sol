// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./StakingCoin.sol";

contract StakingContract {
    StakingCoin public stakingCoin;
    uint256 public rewardRate;

    mapping(address => uint256) public stakingBalance;
    mapping(address => uint256) public rewards;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsDistributed(address indexed user, uint256 reward);

    constructor(address _stakingCoinAddress, uint256 _rewardRate) {
        stakingCoin = StakingCoin(_stakingCoinAddress);
        rewardRate = _rewardRate;
    }

    function stake(uint256 _amount) public {
        stakingCoin.transferFrom(msg.sender, address(this), _amount);
        stakingBalance[msg.sender] += _amount;
        emit Staked(msg.sender, _amount);
    }

    function unstake(uint256 _amount) public {
        require(stakingBalance[msg.sender] >= _amount);
        stakingBalance[msg.sender] -= _amount;
        stakingCoin.transfer(msg.sender, _amount);
        emit Unstaked(msg.sender, _amount);
    }

    function distributeRewards(address staker) public {
    uint256 reward = stakingBalance[staker] * rewardRate / 100;
    require(stakingCoin.balanceOf(address(this)) >= reward, "Not enough tokens to distribute as rewards");
    rewards[staker] += reward;
    emit RewardsDistributed(staker, reward);
    }


    function claimRewards() public {
        uint256 reward = rewards[msg.sender];
        require(reward > 0, "No rewards available for this account");
        require(stakingCoin.balanceOf(address(this)) >= reward, "Not enough tokens in the contract");
        rewards[msg.sender] = 0;
        stakingCoin.transfer(msg.sender, reward);
    }

    function calculateReward(address _staker) public view returns(uint256) {
        return stakingBalance[_staker] * rewardRate;
    }

    function updateRewardRate(uint256 _newRate) public {
        rewardRate = _newRate;
    }
}
