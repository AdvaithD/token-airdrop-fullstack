import ERC20_FACTORY, { FACTORY_ABI_FULL } from '@utils/contracts/erc20factory'
import { ethers } from 'ethers'
import { useContractRead } from 'wagmi'

// hook to get tokens deployed by a user
export const useGetTokens = (address: `0x${string}`) => {
  // get tokens deployed by an address
  const { data: tokensDeployed, isLoading: isTokensLoading } = useContractRead({
    address: ERC20_FACTORY.address,
    abi: FACTORY_ABI_FULL,
    functionName: `getERC20s`,
    args: [ethers.utils.getAddress(address || `0x`)],
  })

  return { tokensDeployed, isTokensLoading }
}
