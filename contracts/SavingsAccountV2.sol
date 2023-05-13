// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.9;

import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

contract SavingsAccountV2 is ReentrancyGuard {
    using Address for address payable;
    mapping(address => uint256) public balanceOf;

    function deposite() external payable nonReentrant {
        balanceOf[msg.sender] += msg.value;
    }

    function withdraw() external nonReentrant {
        require(balanceOf[msg.sender] > 0, "Nothing to withdraw");
        uint256 amountDeposited = balanceOf[msg.sender];
        payable(msg.sender).sendValue(amountDeposited);
        balanceOf[msg.sender] = 0;
    }
}