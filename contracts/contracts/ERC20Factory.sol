// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {ERC20Impl} from "./ERC20Impl.sol";
import {IERC20Factory, IERC20FactoryEvents} from "./interface/IERC20Factory.sol";
import {IOwnableEvents} from "./lib/Ownable.sol";
import {IERC20Events} from "./interface/IERC20.sol";
import {Clones} from "./lib/Clones.sol";

interface IERC20 {
    function initialize(
        address owner_,
        string memory name_,
        string memory symbol_,
        uint256 totalSupply_,
        uint8 decimals_
    ) external;
}

/**
 * @title ERC20Factory
 * @notice The `ERC20Factory` contract deploys ERC20 clones. After deployment, the
 * factory calls `initialize` to set up the ERC20 metadata and mint the initial total
 * supply to the owner's wallet.
 */
contract ERC20Factory is
    IERC20Factory,
    IERC20FactoryEvents,
    IERC20Events,
    IOwnableEvents
{
    /// @notice Address that holds the clone implementation
    address public immutable implementation;

    /// @notice Registry of user -> deployed erc20 contracts
    /// @dev Used on the frontend to retrieve a list of deployed ERC20's 
    mapping(address => address[]) public erc20s;

    constructor() {
        implementation = address(new ERC20Impl(address(this)));
    }

    //======== Deploy function =========

    /// @notice Deploy an ERC20 clone.
    /// @param owner the owner of the ERC20 token
    /// @param name_ the ERC20 metadata name parameter
    /// @param symbol_ the ERC20 metadata symbol parameter
    /// @param totalSupply_ the ERC20 token initial supply, minted to `owner`
    /// @param decimals_ the ERC20 token decimals
    function create(
        address owner,
        string memory name_,
        string memory symbol_,
        uint256 totalSupply_,
        uint8 decimals_
    ) external override returns (address erc20Clone) {
        erc20Clone = Clones.cloneDeterministic(
            implementation,
            keccak256(abi.encode(owner, name_, symbol_, totalSupply_))
        );

        IERC20(erc20Clone).initialize(
            owner,
            name_,
            symbol_,
            totalSupply_,
            decimals_
        );

        /// @dev Add the clone to the list of clones for the owner
        erc20s[owner].push(erc20Clone);

        /// @dev Emit ERC20Deployed event
        emit ERC20Deployed(erc20Clone, name_, symbol_, owner);
    }

    function getERC20s(address owner)
        external
        view
        returns (address[] memory)
    {
        address[] memory tokens = erc20s[owner];
        return tokens;
    }


    /// @notice predict the deterministic address of the ERC20 clone
    /// @param implementation_ the address of the erc20 implementation
    /// @param salt the salt used to generate the deterministic address
    function predictDeterministicAddress(address implementation_, bytes32 salt)
        external
        view
        override
        returns (address)
    {
        return
            Clones.predictDeterministicAddress(
                implementation_,
                salt,
                address(this)
            );
    }
}
