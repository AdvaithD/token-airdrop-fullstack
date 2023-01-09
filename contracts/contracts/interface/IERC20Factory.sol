// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

interface IERC20FactoryEvents {
    /// @notice New ERC20 clone deployed
    event ERC20Deployed(
        address clone,
        string name,
        string symbol,
        address operator
    );
}

interface IERC20Factory {
    /// @notice Deploy a new clone
    function create(
        address operator,
        string memory name_,
        string memory symbol_,
        uint256 totalSupply_,
        uint8 decimals_
    ) external returns (address erc20Clone);

    function predictDeterministicAddress(address logic_, bytes32 salt)
        external
        view
        returns (address);

    function getERC20s(address owner)
        external
        view
        returns (address[] memory);
}
