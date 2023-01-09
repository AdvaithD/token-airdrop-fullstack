// SPDX-License-Identifier: MIT
pragma solidity =0.8.17;

import "./interface/IERC20.sol";
import "./lib/Ownable.sol";

/// @notice Used to check if the airdrop administrator owns the token contract
interface IOwnable {
    function isOwner() external view returns (bool);
    function owner() external view returns (address);
}

contract Airdrop is Ownable {
    constructor() Ownable(msg.sender){}

    /// @notice Airdrop `token` to a list of `_recipients`
    /// @param token Token you want to airdrop
    /// @param _recipients List of recipients to airdrop
    /// @param amount List of amounts per user
    function airdropTokens(
        address token,
        address[] memory _recipients,
        uint256[] memory amount
    ) external {
        require(
            _recipients.length == amount.length,
            "Airdrop: Recipients and amount length mismatch"
        );
        require(
            IOwnable(token).owner() == msg.sender,
            "Airdrop: Only token owner can airdrop tokens"
        );
        for (uint256 i = 0; i < _recipients.length; i++) {
            IERC20(token).transferFrom(msg.sender, _recipients[i], amount[i]);
        }
    }
}
