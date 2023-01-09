import { ERC20Impl__factory } from './../typechain-types/factories/contracts/ERC20Impl__factory';
import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import { ecsign } from "ethereumjs-util";
import { BigNumber } from "ethers";
import { solidityPack } from "ethers/lib/utils";
import { any } from 'hardhat/internal/core/params/argumentTypes';
const { provider } = waffle;
import {Airdrop, ERC20Factory} from "../typechain-types"

const { keccak256, defaultAbiCoder, toUtf8Bytes, hexlify } = ethers.utils;
const { MaxUint256 } = ethers.constants;

const TOTAL_SUPPLY = BigNumber.from(1000);
const TRANSFER_AMOUNT = BigNumber.from(40);

interface TokenConfigType {
  name: String;
  symbol: String;
  totalSupply: BigNumber;
  decimals: number
}

describe("ERC20 Impl through a Factory", () => {
  let deployer: any,
    operator: any,
    holder: any,
    recipient: any,
    logic: any,
    factory: any,
    airdrop: any,
    proxyAddress: any,
    token: any,
    addr1: any,
    addr2: any,
    addr3: any;

  before(async () => {
    [deployer, operator, holder, recipient, addr1, addr2, addr3] = await provider.getWallets();
  });

  beforeEach(async () => {
    // Deploy the ERC20 Factory
    const Factory = (await ethers.getContractFactory("ERC20Factory")).connect(operator);
    factory = (await Factory.deploy()) as ERC20Factory
    await factory.deployed();

    const Airdrop = (await ethers.getContractFactory("Airdrop")).connect(operator);
    airdrop = (await Airdrop.deploy()) as Airdrop
    await airdrop.deployed();
  });

  describe("token deployment", () => {
    const computeERC20Address = async (ownerAddress: String, tokenConfig: TokenConfigType) => {
      const saltArgs = ethers.utils.defaultAbiCoder.encode(
        ["address", "string", "string", "uint256"],
        [ownerAddress, tokenConfig.name, tokenConfig.symbol, tokenConfig.totalSupply]
      );

      const salt = ethers.utils.keccak256(saltArgs);

      return factory.callStatic.predictDeterministicAddress(
        logic,
        salt,
      )
    };

    beforeEach(async () => {
      const tokenConfig: TokenConfigType = {
        name: "test token",
        symbol: "TEST",
        totalSupply: TOTAL_SUPPLY,
        decimals: 18
      };

      const tokenProxyTx = await factory
        .connect(operator)
        .create(
          operator.address,
          tokenConfig.name,
          tokenConfig.symbol,
          tokenConfig.totalSupply,
          tokenConfig.decimals,
        );

      const receipt = await tokenProxyTx.wait();
      proxyAddress = receipt.events[2].args.clone

      // Use the proxy address and the logic ABI.
      token = ERC20Impl__factory.connect(proxyAddress, operator)

      let ownershipTransferIndex = 0;
      expect(receipt.events[ownershipTransferIndex].event).to.eq("OwnershipTransferred");
      expect(receipt.events[ownershipTransferIndex].args.previousOwner).to.eq(ethers.constants.AddressZero);
      expect(receipt.events[ownershipTransferIndex].args.newOwner).to.eq(operator.address);

      let erc20TransferIndex = 1;
      expect(receipt.events[erc20TransferIndex].event).to.eq("Transfer");
      expect(receipt.events[erc20TransferIndex].args._from).to.eq(ethers.constants.AddressZero);
      expect(receipt.events[erc20TransferIndex].args._to).to.eq(operator.address);
      expect(receipt.events[erc20TransferIndex].args._value).to.eq(tokenConfig.totalSupply);

      let erc20ProxyDeployedIndex = 2;
      expect(receipt.events[erc20ProxyDeployedIndex].event).to.eq("ERC20Deployed");
      expect(receipt.events[erc20ProxyDeployedIndex].args.clone).to.eq(proxyAddress);
      expect(receipt.events[erc20ProxyDeployedIndex].args.name).to.eq(tokenConfig.name);
      expect(receipt.events[erc20ProxyDeployedIndex].args.symbol).to.eq(tokenConfig.symbol);
      expect(receipt.events[erc20ProxyDeployedIndex].args.operator).to.eq(operator.address);
    });

    it("initialize:fail", async () => {
      await expect(token.initialize(operator.address, "", "", 0, 0)).to.be
        .reverted;
    });

    it("name, symbol, decimals, totalSupply, balanceOf", async () => {
      const name = await token.name();
      expect(name).to.eq("test token");
      expect(await token.symbol()).to.eq("TEST");
      expect(await token.decimals()).to.eq(18);
      expect(await token.totalSupply()).to.eq(1000);
      expect(await token.balanceOf(operator.address)).to.eq(1000);
    });

    it("transfer:fail", async () => {
      await expect(token.transfer(holder.address, TOTAL_SUPPLY.add(1))).to.be
        .reverted;
      await expect(token.connect(holder).transfer(operator.address, 1)).to.be
        .reverted;
    });

    it("approve", async () => {
      await expect(token.approve(holder.address, TRANSFER_AMOUNT))
        .to.emit(token, "Approval")
        .withArgs(operator.address, holder.address, TRANSFER_AMOUNT);
      expect(await token.allowance(operator.address, holder.address)).to.eq(
        TRANSFER_AMOUNT
      );
    });

    it("transferOwnership:fail", async () => {
      await expect(
        token.connect(holder).transferOwnership(holder.address)
      ).to.be.revertedWith("caller is not the owner.");
    });

    it("transferOwnership", async () => {
      expect(await token.owner()).to.eq(operator.address);
      await token.connect(operator).transferOwnership(holder.address);
      await token.connect(holder).acceptOwnership();
      expect(await token.owner()).to.eq(holder.address);
      // Can no longer mint.
      await expect(
        token.connect(operator).mint(holder.address, TRANSFER_AMOUNT)
      ).to.be.revertedWith("caller is not the owner.");
      await token.connect(holder).transferOwnership(operator.address);
      await token.connect(operator).acceptOwnership();
      expect(await token.owner()).to.eq(operator.address);
    });

    it("mint", async () => {
      let holderBalance = await token.balanceOf(holder.address);
      expect(await token.balanceOf(holder.address)).to.eq(0);
      await expect(
        token.mint(ethers.constants.AddressZero, TRANSFER_AMOUNT)
      ).to.be.revertedWith("ERC20: mint to the zero address");
      await token.connect(operator).mint(holder.address, TRANSFER_AMOUNT);
      holderBalance = await token.balanceOf(holder.address);
      expect(await token.balanceOf(holder.address)).to.eq(TRANSFER_AMOUNT);
    });

    it("transfer", async () => {
      await expect(
        token.transfer(ethers.constants.AddressZero, TRANSFER_AMOUNT)
      ).to.be.revertedWith("ERC20: transfer to the zero address");
      await expect(token.transfer(holder.address, TRANSFER_AMOUNT))
        .to.emit(token, "Transfer")
        .withArgs(operator.address, holder.address, TRANSFER_AMOUNT);
      expect(await token.balanceOf(operator.address)).to.eq(
        TOTAL_SUPPLY.sub(TRANSFER_AMOUNT)
      );
      expect(await token.balanceOf(holder.address)).to.eq(TRANSFER_AMOUNT);
    });

    it("transferFrom", async () => {
      await token.connect(operator).approve(holder.address, TRANSFER_AMOUNT);

      expect(await token.allowance(operator.address, holder.address)).to.eq(
        TRANSFER_AMOUNT
      );

      await expect(
        token
          .connect(holder)
          .transferFrom(operator.address, recipient.address, TRANSFER_AMOUNT)
      )
        .to.emit(token, "Transfer")
        .withArgs(operator.address, recipient.address, TRANSFER_AMOUNT);
      expect(await token.allowance(operator.address, holder.address)).to.eq(0);
      expect(await token.balanceOf(operator.address)).to.eq(
        TOTAL_SUPPLY.sub(TRANSFER_AMOUNT)
      );
      expect(await token.balanceOf(recipient.address)).to.eq(TRANSFER_AMOUNT);
    });

    it("transferFrom:max", async () => {
      await token.connect(operator).approve(holder.address, MaxUint256);
      await expect(
        token
          .connect(holder)
          .transferFrom(operator.address, recipient.address, TRANSFER_AMOUNT)
      )
        .to.emit(token, "Transfer")
        .withArgs(operator.address, recipient.address, TRANSFER_AMOUNT.toString());
      // The allowance doesn't change, since we approved the max amount.
      expect(
        (await token.allowance(operator.address, holder.address)).toString()
      ).to.eq(MaxUint256.toString());
      expect(await token.balanceOf(operator.address)).to.eq(
        TOTAL_SUPPLY.sub(TRANSFER_AMOUNT).toString()
      );
      expect(await token.balanceOf(recipient.address)).to.eq(TRANSFER_AMOUNT);
    });

    it("airdrop owner should equal operator", async () => {
        expect(await airdrop.owner()).to.eq(operator.address);
    })

    it("Reverts if airdropTokens is called by nonowner", async function () {
        await expect(
          airdrop.connect(addr1).airdropTokens(token.address, [addr1.address], [100])
        ).to.be.revertedWith("Airdrop: Only token owner can airdrop tokens");
    });

    it("Reverts if airdropTokens is called with different length arrays", async function () {
        await expect(
        airdrop.connect(operator).airdropTokens(token.address, [addr1.address], [100, 200])
        ).to.be.revertedWith("Airdrop: Recipients and amount length mismatch");
    });

    it("Airdrop Happy Path", async () => {
        const balanceBefore = await token.balanceOf(operator.address);

        await token.approve(airdrop.address, 600);
        await airdrop.airdropTokens(token.address, [addr1.address, addr2.address, addr3.address], [100, 200,300]);

        expect(await token.balanceOf(addr1.address)).to.equal(100);
        expect(await token.balanceOf(addr2.address)).to.equal(200);
        expect(await token.balanceOf(addr3.address)).to.equal(300);

        // check if balance reduces by 600
        expect(await token.balanceOf(operator.address)).to.equal(
          balanceBefore.sub(600)
        );
    })
  });
});
