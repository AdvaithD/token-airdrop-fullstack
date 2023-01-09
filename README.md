## MangaDrop - Monorepo

## **Frontend**

**Run locally:**

```
cd frontend && yarn
yarn dev
# http://localhost:3000
# this should allow you use deploy tokens and distribute tokens using matic mumbai
# MATI Faucet: https://faucet.polygon.technology/
```

### **Frontend Architecture**

The frontend has three main routes: `/deploy`, `/tokens` and `/airdrop`

**`/deploy`:** Allows users to deploy an ERC20 token. Contains a form to input `name`, `symbol` and `totalSupply`. On clicking deploy, a [wagmi](https:/wagmi.sh) hook is called to create a new ERC20 token via the factory.

**`/tokens`:** Displays a list of tokens deployed by the user currently signed in.

**`/airdrop`:** A form that allows users to execute airdrops. This has two steps: an approval transaction, followed by an airdrop transaction. Most of the logic for this is located in [useAirDropTokens](./frontend/src/hooks/useAirdropTokens.tsx)

In order to pass in an airdrop config, you need up upload a csv file with the format `<address>,<amount>`

Sample airdrop format:

```
0x70997970C51812dc3A010C7d01b50e0d17dc79C8,10000
0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC,10000
0x90F79bf6EB2c4f870365E785982E1f101E93b906,10000
```

### **Contracts**

1. Install dependencies: `cd contracts && yarn`
2. Compile: `yarn hardhat compile`
3. Run tests: `yarn hardhat test`
4. Generate documentation: `yarn hardhat docgen` (generates html docs at `./contracts/contracts/docgen/`).
   Most contracts implement the NatSpec documentation format, which docgen picks up.
5. Deploy: `yarn hardhat run scripts/deploy.ts` (use the `--network` flag, although note that you don't need to deploy anything to use the app locally)

### Contract Architecture

There are three contracts: `ERC20Factory`, `ERC20Impl` and `Airdrop`

**`ERC20Factory`:** The `ERC20Factory` contract deploys ERC20 clones. After deployment, the factory calls `initialize` to set up the ERC20 metadata and mint the initial total supply to the owner's wallet. It also contains a helper `.getERC20s()` function that returns all tokens deployed by a given user.

Users can call `create()` on the factory to create deterministic ERC20 clones. The factory contract uses openzeppelin's [Clones](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/proxy/Clones.sol) lib.

**`ERC20Impl`:** The `ERC20Impl` contract is deployed inside `ERC20Factory's` constructor (shown below). This is mainly used to create ERC20 clones, and is a condensed version of EIP-20 (excludes functions like `burn()` and `permit()`)

```
constructor() {
    implementation = address(new ERC20Impl(address(this)));
}
```

**`Airdrop`:** The airdrop contract is responsible for airdropping tokens within a single transaction. Users can call `.airdropTokens()` passing in a `token` they've deployed along with an airdrop config.

The function checks if the ERC20 token is owned by the person calling the airdrop function, and proceeds to distribute tokens (assuming the airdrop contract has the necessary allowance).

### Launch Readiness

To plan for a widespread release, I'd work on the following features:

1. Deploy across multiple chains, and configure wagmi to support them.
2. Build a simple backend - Index token deploys, and historical airdrop calls and store them in a DB. This reduces the load on eth providers. For example, it's resource intensive to get `name`, `symbol`, `decimals` on the `/tokens` page from the client, which could be mitigated with a minimal backend.
3. Write more tests covering edge cases.

### Tradeoffs

1. I decided against working on anything backend related in the interest of time, which was instead spent working on the factory pattern using clones.
2. There could be a significant imporovement in terms of error handling, and verbose alerts on the frontend (invalid allowance, error simulating transaction before broadcasting it etc)
