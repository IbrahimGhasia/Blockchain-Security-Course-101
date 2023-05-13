// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

interface ISavingsAccount {
    function deposite() external payable;
    function withdraw() external;
}

contract Investor is Ownable {
    ISavingsAccount public immutable savingsAccount;

    constructor(address savingsAccountAddress) {
        savingsAccount = ISavingsAccount(savingsAccountAddress);
    }

    function depositeIntoSavingsAccount() external payable onlyOwner {
        savingsAccount.deposite{ value: msg.value }();
    }

    function withdrawFromSavingsAccount() external onlyOwner {
        savingsAccount.withdraw();
    }

    receive() external payable {
        payable(owner()).transfer(address(this).balance);
    }
}