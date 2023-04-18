import React, { useState } from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

import "@rainbow-me/rainbowkit/styles.css"
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit"
import { configureChains, createClient, WagmiConfig } from "wagmi"
import { polygon, optimism, arbitrum, gnosis } from "wagmi/chains"

import { infuraProvider } from "wagmi/providers/infura"
import { publicProvider } from "wagmi/providers/public"
import { SWRConfig } from "swr"
import { DarkModeContext } from "./utils/dark-mode-refresher"

const { chains, provider } = configureChains(
  // Ethereum Mainnet costs are too large.
  // BSC is unreliable.
  // Gnosis does not hold UniswapV3, but it shall be included for OTC trading in future versions.
  [polygon],
  [
    infuraProvider({ apiKey: import.meta.env.VITE_INFURA_KEY as string }),
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

const DarkModeWorld = () => {
  const [_, refresh] = useState<{}>({})
  return (
    <DarkModeContext.Provider value={refresh}>
      <RainbowKitProvider
        theme={localStorage.theme === "dark" ? darkTheme() : undefined}
        chains={chains}
      >
        <SWRConfig
          value={{
            revalidateOnFocus: false,
            refreshWhenHidden: false,
            revalidateOnMount: true,
            revalidateIfStale: false,
            dedupingInterval: 10000000,
          }}
        >
          <App />
        </SWRConfig>
      </RainbowKitProvider>
    </DarkModeContext.Provider>
  )
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <DarkModeWorld />
    </WagmiConfig>
  </React.StrictMode>
)
