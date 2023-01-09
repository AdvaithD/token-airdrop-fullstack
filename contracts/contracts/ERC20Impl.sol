// SPDX-License-Identifier: MIT
pragma solidity =0.8.17;

import {Ownable} from "./lib/Ownable.sol";
import {IERC20Events, IERC20} from "./interface/IERC20.sol";

/**
 * @title ERC20
 * @dev ERC20 Implementation
 */
contract ERC20Impl is Ownable, IERC20, IERC20Events {
    /// @notice Token total supply
    uint256 public override totalSupply;

    /// @notice Token name
    string public override name;

    /// @notice Token symbol
    string public override symbol;

    /// @notice Token decimals
    uint8 public override decimals;

    /// @notice Token balance
    mapping(address => uint256) public override balanceOf;

    /// @notice Token allowance
    mapping(address => mapping(address => uint256)) public override allowance;

    /// @notice Factory that deploys clones (we use one erc20 implementation for all clones)
    address public immutable factory;

    /// @dev Ownable parameter is irrelevant since this is a logic contract and deployed once.
    constructor(address factory_) Ownable(address(0)) {
        factory = factory_;
    }

    /// @notice Set initial parameters, mint initial supply to owner and set the owner.
    /// @dev Only callable by the factory
    /// @param owner_ The owner of the token contract
    /// @param name_ The name of the token
    /// @param symbol_ The symbol of the token
    /// @param totalSupply_ The totalSupply of the token
    /// @param decimals_ The decimals of the token
    function initialize(
        address owner_,
        string memory name_,
        string memory symbol_,
        uint256 totalSupply_,
        uint8 decimals_
    ) external override returns (address) {
        // ensure that this function is only callable by the factory
        require(msg.sender == factory, "unauthorized caller");

        // set owner
        _setOwner(address(0), owner_);

        // set metadata
        name = name_;
        symbol = symbol_;
        decimals = decimals_;

        // mint initial supply
        _mint(owner_, totalSupply_);

        return address(this);
    }

    // ============ ERC-20 Methods ============

    /// @notice Approve `spender` to transfer up to `value` from `msg.sender`
    /// @dev This will overwrite the approval value for `spender`
    ///  and is subject to issues noted [here](https://eips.ethereum.org/EIPS/eip-20#approve)
    /// @param spender The address of the account which may transfer tokens
    /// @param value The number of tokens that are approved
    /// @return Whether or not the approval succeeded
    function approve(address spender, uint256 value)
        external
        override
        returns (bool)
    {
        _approve(msg.sender, spender, value);

        return true;
    }

    /// @notice Transfer `value` tokens from `msg.sender` to `to`
    /// @param to The address of the destination account
    /// @param value The number of tokens to transfer
    /// @return Whether or not the transfer succeeded
    function transfer(address to, uint256 value)
        external
        override
        returns (bool)
    {
        _transfer(msg.sender, to, value);

        return true;
    }

    /// @notice Transfer `value` tokens from `from` to `to`
    /// @param from The address of the source account
    /// @param to The address of the destination account
    /// @param value The number of tokens to transfer
    /// @return Whether or not the transfer succeeded
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external override returns (bool) {
        if (allowance[from][msg.sender] != type(uint256).max) {
            allowance[from][msg.sender] -= value;
        }

        _transfer(from, to, value);

        return true;
    }

    /// @notice Mint `value` tokens to `to`
    /// @dev Only callable by the owner, throws otherwise
    /// @param to The account to mint tokens to
    /// @param value The number of tokens to mint
    function mint(address to, uint256 value) external override onlyOwner {
        _mint(to, value);
    }

    // ============ Internal Methods ============

    function _transfer(
        address from,
        address to,
        uint256 value
    ) internal {
        require(to != address(0), "ERC20: transfer to the zero address");

        balanceOf[from] -= value;

        // Cannot overflow because the sum of all user
        // balances can't exceed the max uint256 value.
        unchecked {
            balanceOf[to] += value;
        }

        emit Transfer(from, to, value);
    }

    function _mint(address to, uint256 value) internal {
        require(to != address(0), "ERC20: mint to the zero address");

        totalSupply += value;

        // Cannot overflow because the sum of all user
        // balances can't exceed the max uint256 value.
        unchecked {
            balanceOf[to] += value;
        }

        emit Transfer(address(0), to, value);
    }

    function _approve(
        address _owner,
        address spender,
        uint256 value
    ) internal {
        allowance[_owner][spender] = value;

        emit Approval(_owner, spender, value);
    }
}
