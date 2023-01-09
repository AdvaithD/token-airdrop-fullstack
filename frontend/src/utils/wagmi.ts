import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createClient } from 'wagmi'
import { polygonMumbai } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'

const { chains, provider, webSocketProvider } = configureChains(
  [polygonMumbai],
  [
    alchemyProvider({ apiKey: `UMRGB-eJSGwtjt3_dzIuUOZWp0hVkYLT` }),
    infuraProvider({ apiKey: `28ef6d3c61f74747a89a788fdea860d2` }),
    publicProvider(),
  ],
)

const { connectors } = getDefaultWallets({
  appName: `MagnaDrop`,
  chains,
})

export const client = createClient({
  logger: {
    warn: (message) => console.warn(message),
  },
  // autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
})

export { chains }
