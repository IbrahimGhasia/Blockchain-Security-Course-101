// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

// inherting from ownable makes the deployer of the contract the owner by default.
contract Vault is Ownable {
    bytes32 private password;   // solidity will not generate a getter function for private variables!

    constructor (bytes32 _password) {
        password = _password;
    }

    modifier checkPassword(bytes32 _password) {
        require(password == _password, "Wrong password.");
        _;
    }

    function deposite() external payable onlyOwner {}

    function withdraw(bytes32 _password) external checkPassword(_password) {
        payable(msg.sender).transfer(address(this).balance);
    }
}