import '@rainbow-me/rainbowkit/styles.css'
import '@styles/globals.css'
import { ConnectButton, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import type { AppProps } from 'next/app'
import { NextPage } from 'next'
import NextHead from 'next/head'
import { ReactElement, ReactNode } from 'react'
import React from 'react'
import { useAccount, WagmiConfig } from 'wagmi'
import { chains, client } from '@utils/wagmi'
import { Inter } from '@next/font/google'
const inter = Inter()

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

// Connect wallet helper component
const PleaseConnectWallet = (): React.ReactElement => {
  return (
    <div className="bg-white py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="sm:text-center">
          <h2 className="text-lg font-semibold leading-8 text-indigo-600">
            Please connect your wallet
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            A better way to airdrop tokens.
          </p>
          <div className="flex flex-col items-center mt-6 text-lg leading-8 text-gray-600">
            <ConnectButton />
          </div>
        </div>
      </div>
    </div>
  )
}

// If wallet is connected -> display app
// Else -> display connect prompt
export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  const { isConnected } = useAccount()

  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <>
      <div className={inter.className}>
        <WagmiConfig client={client}>
          <RainbowKitProvider chains={chains}>
            <NextHead>
              <title>MagnaDrop</title>
            </NextHead>
            {isConnected ? (
              <>{mounted && getLayout(<Component {...pageProps} />)}</>
            ) : (
              <>
                <PleaseConnectWallet />
              </>
            )}
          </RainbowKitProvider>
        </WagmiConfig>
      </div>
    </>
  )
}
