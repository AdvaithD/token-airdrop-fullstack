# Magna Take-Home Base Contracts

```
ERC20Factory address: 0x78d430d14Fa12c412C7Bf993416E6CE3EdC5E8f9
Airdrop address: 0x50Af2311F45317473C804447B72B52233aa32A73
```

## Smart Contracts:
- `MagnaToken.sol` -> an example ERC20 token that is deployed for the Airdrop.
  - Things to note:
    - The initial supply of tokens that are deployed is `(10**9) * (10**18)`. Keep this in mind when airdropping token amounts to addresses.
    - When deployed, this contract mints the tokens to the sender of the message (referred to in the source code as `msg.sender`).
- `Airdrop.sol` -> a simple airdrop contract that sends ERC20 tokens to an array of addresses.
  - Thing to note:
    - This contract makes use of the `Ownable` modifier, meaning that the address that deploys the contract is initially set as the `owner`, and thus further only that address may call `airdropTokens`.
    - `airdropTokens` requires that the length of the recipients matches the length of the token amounts, and this order matters. I.E the amount of tokens that `_recipients[0]` will receive will be `amount[0]`

## Contract Setup:
1. Run `yarn` in this directory to install all required dependencies.
2. Run `yarn hardhat compile` to generate the contract artifacts. These artifacts will be used so that you can interact with the contracts from your dapp.
3. Split your terminal into 2 windows. 
4. In one, run `yarn hardhat node` to run the hardhat chain locally on your machine. This will make the chain accessible at `http://localhost:8545`
5. In the other, run `yarn hardhat run scripts/deploy.ts`. Make sure to take note of the contract addresses that are printed to the console when this command is ran, as you will use these to call the contracts from your dapp. This deploy script does the following:
   1. Deploy the ERC20 token contract and mint tokens to Hardhat Account #0 (listed in the terminal output of the `yarn hardhat node` command).
   2. Deploy the Airdrop contract while passing our ERC20 token's address to the constructor of the Airdrop contract.

## Contract Tests:
We have included a suite of tests for the Airdrop contract that you can refer to for basic contract functionality. These can be ran by running `yarn hardhat test`. Feel free to edit the test cases to better understand the functionality/limitations of the Airdrop contract.

## Helpful Resources:
1. [web3.js](https://web3js.readthedocs.io/en/v1.8.0/) -> This library should be used to interact with your locally running smart contracts from your dapp.
2. [Initializing a contract in web3.js](https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html#new-contract) -> This function can be used to initialize a contract from your dapp. An example usage of this is as follows:

```
const airdropContract = new web3.eth.Contract(
  airdropArtifact as AbiItem[],
  airdropAddress
);
```
In the above example, `airdropArtifact` can be retrieved from the `artifacts/contracts` directory after running `yarn hardhat compile`. I'd recommend that you create a json file and store only the array value that corresponds to the key `abi`. `airdropAddress` can be retrieved from the console output after running `yarn hardhat run scripts/deploy.ts`.
3. [Calling smart contract functions in web3.js](https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html#id26) -> This function can call smart contract functions from your dapp. An example of this is as follows:

```
// reading from the chain uses .call()
const tokenBalance = await tokenContract.methods.balanceOf(someAddress).call({ from: someAddress });

// writing to the chain uses .send()
await airdropContract.methods.airdropTokens([someAddress], [someAmount]).send({ from: ownerAddress });
```
4. [ERC20 Token Allownaces](https://docs.openzeppelin.com/contracts/2.x/api/token/erc20#IERC20-allowance-address-address-) -> In order for a contract to send tokens on your behalf, you must approve the contract to do so, while specifying the amount of tokens as well. This section of OpenZeppelin's ERC20 documentation explains this in greater detail. Hint: you can see an example of this in `test/airdrop.test.ts`
5. [Connecting wallets to a dapp](https://github.com/WalletConnect/web3modal/blob/V2/docs/react.md) -> Web3Modal is a simple way to connect wallets to a dapp with a nice pre-configured button that uses hooks to interact with browser wallets. Feel free to use other options if you find them more appealing to you!
6. [Importing accounts to metamask](https://metamask.zendesk.com/hc/en-us/articles/360015489331-How-to-import-an-account) -> You can use this resource to learn how to import accounts to your Metamask browser extension wallet using their private keys. You can use all of the private keys that are emitted in the output of `yarn hardhat node`
