import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

import "@rainbow-me/rainbowkit/styles.css"
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit"
import { configureChains, createClient, goerli, WagmiConfig } from "wagmi"
import { polygon, optimism, arbitrum, gnosis } from "wagmi/chains"

import { infuraProvider } from "wagmi/providers/infura"
import { publicProvider } from "wagmi/providers/public"
import { SWRConfig } from "swr"

const { chains, provider } = configureChains(
  // Ethereum Mainnet costs are too large.
  // BSC is unreliable.
  // Gnosis does not hold UniswapV3, but it shall be included for OTC trading.
  [polygon, gnosis, optimism, arbitrum, goerli],
  [
    infuraProvider({ apiKey: import.meta.env.INFURA_KEY as string }),
    publicProvider(),
  ]
)

const { connectors } = getDefaultWallets({
  appName: "Mirage Shrine",
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider theme={darkTheme()} chains={chains}>
        <SWRConfig
          value={{
            revalidateOnFocus: true,
            refreshWhenHidden: false,
            revalidateOnMount: true,
            revalidateIfStale: false,
          }}
        >
          <App />
        </SWRConfig>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
)
