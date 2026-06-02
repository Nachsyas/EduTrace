// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {EduTraceSBT} from "../src/EduTraceSBT.sol";

contract DeploySBT is Script {
    function run() external {
        // Retrieve deployment private key/address from environment variables if present
        uint256 deployerPrivateKey = vm.envOr("PRIVATE_KEY", uint256(0));
        address adminAddress;

        if (deployerPrivateKey != 0) {
            adminAddress = vm.addr(deployerPrivateKey);
            vm.startBroadcast(deployerPrivateKey);
        } else {
            // Fallback for local testing/simulation (e.g. anvil default accounts or msg.sender)
            adminAddress = msg.sender;
            vm.startBroadcast();
        }

        // Deploy the Soulbound Token contract
        new EduTraceSBT(
            "EduTrace Student Report Card",
            "EDUTRACE-SBT",
            adminAddress
        );

        vm.stopBroadcast();
    }
}
