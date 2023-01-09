import { Card } from 'flowbite-react'
import { NextPageWithLayout } from './_app'
import Layout from '@components/Layout'
import { ReactElement, useState } from 'react'
import ERC20_FACTORY, { FACTORY_ABI_FULL } from '@utils/contracts/erc20factory'
import { ERC20_IMPL_ABI_FULL } from '@utils/contracts/erc20'
import { useAccount, useContractRead, useProvider } from 'wagmi'
import { ethers } from 'ethers'
import React from 'react'

type tokenInfo = {
  address: `0x${string}`
  name: string
  symbol: string
  supply: string
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Retrieve tokens deployed by a user
const Page: NextPageWithLayout = () => {
  const { address } = useAccount()

  const { data, isLoading } = useContractRead({
    address: ERC20_FACTORY.address,
    abi: FACTORY_ABI_FULL,
    functionName: `getERC20s`,
    args: [ethers.utils.getAddress(address || `0x`)],
  })

  return (
    <>
      <div className="mx-auto w-3/5 text-center">
        <Card>
          <h5 className="text-2xl mb-4 font-bold tracking-tight text-gray-900 dark:text-white">
            Your Tokens:
          </h5>
          {isLoading && <div>Loading...</div>}
          {!isLoading && data && (
            <ul className="space-y-4">
              {data.map((token: `0x${string}`, index: number) => (
                <li key={index} className="flex items-center text-center">
                  <svg
                    className="h-6 w-6 flex-none fill-sky-100 stroke-sky-500 stroke-2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="12" r="11" />
                    <path
                      d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9"
                      fill="none"
                    />
                  </svg>
                  <p className="ml-4">
                    <code className="text-sm font-bold text-gray-900">
                      {token}
                    </code>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Page
