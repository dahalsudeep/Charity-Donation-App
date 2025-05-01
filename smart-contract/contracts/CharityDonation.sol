// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CharityDonation {
    address public owner;
    uint public totalDonations;

    struct Donation {
        address donor;
        uint amount;
    }

    Donation[] public donations;

    constructor() {
        owner = msg.sender;
    }

    function donate() external payable {
        require(msg.value > 0, "Donation must be greater than 0");
        donations.push(Donation(msg.sender, msg.value));
        totalDonations += msg.value;
    }

    function getDonations() external view returns (Donation[] memory) {
        return donations;
    }

    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }
}
