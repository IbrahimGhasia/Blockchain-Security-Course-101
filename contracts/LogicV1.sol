// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.9;

contract LogicV1 {
    uint256 public x;

    function increaseX() external {
        x++;
    }
}