// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./StakingCoin.sol";

contract StakingContract {
    enum StakingType { STATIC, DYNAMIC }
    StakingType public stakingType;
    bool public autoCompound;
    uint256 public totalStaked;
    address[] public stakers;
    StakingCoin public stakingCoin;

    mapping(address => uint256) public stakingBalance;
    mapping(address => uint256) public lastClaimBlock;
    mapping(address => uint256) public rewards;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);


    constructor(address _stakingCoinAddress) {
        stakingCoin = StakingCoin(_stakingCoinAddress);
    }

    function stake(uint256 _amount) public {
        stakingCoin.transferFrom(msg.sender, address(this), _amount);
        stakingBalance[msg.sender] += _amount;
        totalStaked += _amount;
        stakers.push(msg.sender);  // Add the sender to the list of stakers
        emit Staked(msg.sender, _amount);
    }

    function unstake(uint256 _amount) public {
        require(stakingBalance[msg.sender] >= _amount);
        stakingBalance[msg.sender] -= _amount;
        totalStaked -= _amount;
        stakingCoin.transfer(msg.sender, _amount);
        emit Unstaked(msg.sender, _amount);
    }


    function setStakingType(StakingType _stakingType) public {
        stakingType = _stakingType;
    }

    function setAutoCompound(bool _autoCompound) public {
        autoCompound = _autoCompound;
    }

    function distributeRewards() public {
    uint256 totalReward = 1 * 1e18; // 1 token per block
    uint256 decimals = 1e18;
    uint256 rewardPerToken = totalReward * decimals / totalStaked;

        for (uint i = 0; i < stakers.length; i++) {
        address staker = stakers[i];
        uint256 stakedAmount = stakingBalance[staker];
        rewards[staker] += stakedAmount * rewardPerToken / decimals;
        }
    }


    function claimRewards() public {
        uint256 reward = rewards[msg.sender];
        require(reward > 0, "No rewards available");
        rewards[msg.sender] = 0;
        stakingCoin.transfer(msg.sender, reward);
    }
}
