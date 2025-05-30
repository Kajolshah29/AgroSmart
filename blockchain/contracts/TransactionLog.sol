// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TransactionLog {
    event TransactionRecorded(address indexed buyer, address indexed seller, uint amount, string paymentHash);

    function recordTransaction(address seller, uint amount, string memory paymentHash) public {
        emit TransactionRecorded(msg.sender, seller, amount, paymentHash);
    }
}
