interface YellowPage {
  shrine: `0x${string}`
  reality: `0x${string}`
  uniswapV3: `0x${string}`
  uniswapQuoter: `0x${string}`
  usdReference: `0x${string}`
  defaultEssence: `0x${string}`
  tribute: string
}

export const yellowPages: { [network: number]: YellowPage } = {
  5: {
    shrine: "0x5F465CC6043732bDC99e3AbcC5d25A503054E5C8",
    reality: "0x6f80c5cbcf9fbc2da2f0675e56a5900bb70df72f",
    uniswapV3: "0x",
    uniswapQuoter: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
    usdReference: "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
    defaultEssence: "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
    tribute: "1000000000000",
  },
  10: {
    shrine: "0x",
    reality: "0x",
    uniswapV3: "0x",
    uniswapQuoter: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
    usdReference: "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
    defaultEssence: "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
    tribute: "1000000000000000",
  },
  100: {
    shrine: "0x",
    reality: "0x",
    uniswapV3: "0x", // does not exist
    uniswapQuoter: "0x", // does not exist
    usdReference: "0xe91d153e0b41518a2ce8dd3d7944fa863463a97d",
    defaultEssence: "0xe91d153e0b41518a2ce8dd3d7944fa863463a97d",
    tribute: "1000000000000000",
  },
  137: {
    shrine: "0x",
    reality: "0x",
    uniswapV3: "0x",
    uniswapQuoter: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
    usdReference: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    defaultEssence: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    tribute: "1000000000000000",
  },
  42161: {
    shrine: "0x",
    reality: "0x",
    uniswapV3: "0x",
    uniswapQuoter: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
    usdReference: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
    defaultEssence: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
    tribute: "1000000000000000",
  },
} as const

export type validNet = 5 | 10 | 100 | 137 | 421611
export const manualProviders = {
  5: `https://goerli.infura.io/v3/${import.meta.env.VITE_INFURA_KEY}`,
  10: `https://optimism-mainnet.infura.io/v3/${
    import.meta.env.VITE_INFURA_KEY
  }`,
  100: "https://gnosischain-rpc.gateway.pokt.network",
  137: `https://polygon-mainnet.infura.io/v3/${
    import.meta.env.VITE_INFURA_KEY
  }`,
  421611: `https://arbitrum-mainnet.infura.io/v3/${
    import.meta.env.VITE_INFURA_KEY
  }`,
} as const

export const manualExplorers = {
  5: "https://goerli.etherscan.io",
  10: "https://optimistic.etherscan.io",
  100: "https://gnosisscan.io",
  137: "https://polygonscan.com/",
  421611: "https://arbiscan.io/",
} as const

export const manualNativeTokens = {
  5: "ETH",
  10: "ETH",
  100: "xDAI",
  137: "MATIC",
  421611: "ETH",
} as const
