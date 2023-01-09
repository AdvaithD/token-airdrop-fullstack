import { BigNumber, ethers } from 'ethers'
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi'

import { toast } from 'react-hot-toast'
import ERC20_FACTORY, { createABI } from '@utils/contracts/erc20factory'
const DEFAULT_SUPPLY = `1000000000000000000000000`

const useDeployErc20 = (name: string, symbol: string, supply: any) => {
  const { address } = useAccount()

  // prepare
  const { config } = usePrepareContractWrite({
    address: ethers.utils.getAddress(ERC20_FACTORY.address),
    abi: createABI,
    functionName: `create`,
    args: [
      ethers.utils.getAddress(String(address)),
      name,
      symbol,
      BigNumber.from(ethers.utils.parseEther(supply || DEFAULT_SUPPLY)),
      18,
    ],
    onError(error) {
      console.log(`Error Preparing deploy contract write`, error)
    },
  })

  // write
  const { write: writeDeploy, data: dataDeploy } = useContractWrite({
    ...config,
    onError() {
      console.log(`Error in useContractWrite`)
    },
  })

  // wait for txn
  const { status: statusDeploy } = useWaitForTransaction({
    confirmations: 1,
    hash: dataDeploy?.hash,
    onSuccess: () => {
      console.log(`Successfully mined deploy txn`)
      toast.success(`Successfully deployed ERC20 - 1 confirmation`, {
        icon: `🎉`,
      })
    },
  })

  return {
    writeDeploy,
    dataDeploy,
    statusDeploy,
  }
}

export default useDeployErc20
