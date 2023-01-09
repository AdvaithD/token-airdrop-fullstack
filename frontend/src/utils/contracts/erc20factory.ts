import { ethers } from 'ethers'

export const createABI = [
  {
    inputs: [
      {
        internalType: `address`,
        name: `owner`,
        type: `address`,
      },
      {
        internalType: `string`,
        name: `name_`,
        type: `string`,
      },
      {
        internalType: `string`,
        name: `symbol_`,
        type: `string`,
      },
      {
        internalType: `uint256`,
        name: `totalSupply_`,
        type: `uint256`,
      },
      {
        internalType: `uint8`,
        name: `decimals_`,
        type: `uint8`,
      },
    ],
    name: `create`,
    outputs: [
      {
        internalType: `address`,
        name: `erc20Clone`,
        type: `address`,
      },
    ],
    stateMutability: `nonpayable`,
    type: `function`,
  },
] as const

export const FACTORY_ABI_FULL = [
  {
    inputs: [],
    stateMutability: `nonpayable`,
    type: `constructor`,
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: `address`,
        name: `_owner`,
        type: `address`,
      },
      {
        indexed: true,
        internalType: `address`,
        name: `_spender`,
        type: `address`,
      },
      {
        indexed: false,
        internalType: `uint256`,
        name: `_value`,
        type: `uint256`,
      },
    ],
    name: `Approval`,
    type: `event`,
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: `address`,
        name: `clone`,
        type: `address`,
      },
      {
        indexed: false,
        internalType: `string`,
        name: `name`,
        type: `string`,
      },
      {
        indexed: false,
        internalType: `string`,
        name: `symbol`,
        type: `string`,
      },
      {
        indexed: false,
        internalType: `address`,
        name: `operator`,
        type: `address`,
      },
    ],
    name: `ERC20Deployed`,
    type: `event`,
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: `address`,
        name: `previousOwner`,
        type: `address`,
      },
      {
        indexed: true,
        internalType: `address`,
        name: `newOwner`,
        type: `address`,
      },
    ],
    name: `OwnershipTransferred`,
    type: `event`,
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: `address`,
        name: `_from`,
        type: `address`,
      },
      {
        indexed: true,
        internalType: `address`,
        name: `_to`,
        type: `address`,
      },
      {
        indexed: false,
        internalType: `uint256`,
        name: `_value`,
        type: `uint256`,
      },
    ],
    name: `Transfer`,
    type: `event`,
  },
  {
    inputs: [
      {
        internalType: `address`,
        name: `owner`,
        type: `address`,
      },
      {
        internalType: `string`,
        name: `name_`,
        type: `string`,
      },
      {
        internalType: `string`,
        name: `symbol_`,
        type: `string`,
      },
      {
        internalType: `uint256`,
        name: `totalSupply_`,
        type: `uint256`,
      },
      {
        internalType: `uint8`,
        name: `decimals_`,
        type: `uint8`,
      },
    ],
    name: `create`,
    outputs: [
      {
        internalType: `address`,
        name: `erc20Clone`,
        type: `address`,
      },
    ],
    stateMutability: `nonpayable`,
    type: `function`,
  },
  {
    inputs: [
      {
        internalType: `address`,
        name: ``,
        type: `address`,
      },
      {
        internalType: `uint256`,
        name: ``,
        type: `uint256`,
      },
    ],
    name: `erc20s`,
    outputs: [
      {
        internalType: `address`,
        name: ``,
        type: `address`,
      },
    ],
    stateMutability: `view`,
    type: `function`,
  },
  {
    inputs: [
      {
        internalType: `address`,
        name: `owner`,
        type: `address`,
      },
    ],
    name: `getERC20s`,
    outputs: [
      {
        internalType: `address[]`,
        name: ``,
        type: `address[]`,
      },
    ],
    stateMutability: `view`,
    type: `function`,
  },
  {
    inputs: [],
    name: `implementation`,
    outputs: [
      {
        internalType: `address`,
        name: ``,
        type: `address`,
      },
    ],
    stateMutability: `view`,
    type: `function`,
  },
  {
    inputs: [
      {
        internalType: `address`,
        name: `implementation_`,
        type: `address`,
      },
      {
        internalType: `bytes32`,
        name: `salt`,
        type: `bytes32`,
      },
    ],
    name: `predictDeterministicAddress`,
    outputs: [
      {
        internalType: `address`,
        name: ``,
        type: `address`,
      },
    ],
    stateMutability: `view`,
    type: `function`,
  },
] as const

const erc20factory = {
  address: ethers.utils.getAddress(
    `0x89db961F6556A918507EC295c238a19cBBfC6D26`,
  ),
  abi: [
    {
      inputs: [],
      stateMutability: `nonpayable`,
      type: `constructor`,
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: `address`,
          name: `_owner`,
          type: `address`,
        },
        {
          indexed: true,
          internalType: `address`,
          name: `_spender`,
          type: `address`,
        },
        {
          indexed: false,
          internalType: `uint256`,
          name: `_value`,
          type: `uint256`,
        },
      ],
      name: `Approval`,
      type: `event`,
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: `address`,
          name: `clone`,
          type: `address`,
        },
        {
          indexed: false,
          internalType: `string`,
          name: `name`,
          type: `string`,
        },
        {
          indexed: false,
          internalType: `string`,
          name: `symbol`,
          type: `string`,
        },
        {
          indexed: false,
          internalType: `address`,
          name: `operator`,
          type: `address`,
        },
      ],
      name: `ERC20Deployed`,
      type: `event`,
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: `address`,
          name: `previousOwner`,
          type: `address`,
        },
        {
          indexed: true,
          internalType: `address`,
          name: `newOwner`,
          type: `address`,
        },
      ],
      name: `OwnershipTransferred`,
      type: `event`,
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: `address`,
          name: `_from`,
          type: `address`,
        },
        {
          indexed: true,
          internalType: `address`,
          name: `_to`,
          type: `address`,
        },
        {
          indexed: false,
          internalType: `uint256`,
          name: `_value`,
          type: `uint256`,
        },
      ],
      name: `Transfer`,
      type: `event`,
    },
    {
      inputs: [
        {
          internalType: `address`,
          name: `owner`,
          type: `address`,
        },
        {
          internalType: `string`,
          name: `name_`,
          type: `string`,
        },
        {
          internalType: `string`,
          name: `symbol_`,
          type: `string`,
        },
        {
          internalType: `uint256`,
          name: `totalSupply_`,
          type: `uint256`,
        },
        {
          internalType: `uint8`,
          name: `decimals_`,
          type: `uint8`,
        },
      ],
      name: `create`,
      outputs: [
        {
          internalType: `address`,
          name: `erc20Clone`,
          type: `address`,
        },
      ],
      stateMutability: `nonpayable`,
      type: `function`,
    },
    {
      inputs: [
        {
          internalType: `address`,
          name: ``,
          type: `address`,
        },
        {
          internalType: `uint256`,
          name: ``,
          type: `uint256`,
        },
      ],
      name: `erc20s`,
      outputs: [
        {
          internalType: `address`,
          name: ``,
          type: `address`,
        },
      ],
      stateMutability: `view`,
      type: `function`,
    },
    {
      inputs: [
        {
          internalType: `address`,
          name: `owner`,
          type: `address`,
        },
      ],
      name: `getERC20s`,
      outputs: [
        {
          internalType: `address[]`,
          name: ``,
          type: `address[]`,
        },
      ],
      stateMutability: `view`,
      type: `function`,
    },
    {
      inputs: [],
      name: `implementation`,
      outputs: [
        {
          internalType: `address`,
          name: ``,
          type: `address`,
        },
      ],
      stateMutability: `view`,
      type: `function`,
    },
    {
      inputs: [
        {
          internalType: `address`,
          name: `implementation_`,
          type: `address`,
        },
        {
          internalType: `bytes32`,
          name: `salt`,
          type: `bytes32`,
        },
      ],
      name: `predictDeterministicAddress`,
      outputs: [
        {
          internalType: `address`,
          name: ``,
          type: `address`,
        },
      ],
      stateMutability: `view`,
      type: `function`,
    },
  ],
}

export default erc20factory
