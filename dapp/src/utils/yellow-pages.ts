interface YellowPage {
  shrine: `0x${string}`
  reality: `0x${string}`
  uniswapV3: `0x${string}`
  uniswapQuoter: `0x${string}`
  usdReference: `0x${string}`
  tribute:string
}

export const yellowPages: { [network: number]: YellowPage } = {
  1: {
    shrine: "0x",
    reality: "0x",
    uniswapV3: "0x",
    uniswapQuoter: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
    usdReference: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    tribute: "1000000000000000"
  },
  5: {
    shrine: "0x5F465CC6043732bDC99e3AbcC5d25A503054E5C8",
    reality: "0x6f80c5cbcf9fbc2da2f0675e56a5900bb70df72f",
    uniswapV3: "0x",
    uniswapQuoter: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
    usdReference: "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
    tribute: "1000000000000"
  },
  10: {
    shrine: "0x",
    reality: "0x",
    uniswapV3: "0x",
    uniswapQuoter: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
    usdReference: "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
    tribute: "1000000000000000"
  },
  56: {
    shrine: "0x",
    reality: "0x",
    uniswapV3: "0x",
    uniswapQuoter: "0x",
    usdReference: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
    tribute: "1000000000000000"
  },
  100: {
    shrine: "0x",
    reality: "0x",
    uniswapV3: "0x", // does not exist
    uniswapQuoter: "0x", // does not exist
    usdReference: "0xe91d153e0b41518a2ce8dd3d7944fa863463a97d",
    tribute: "1000000000000000"
  },
  137: {
    shrine: "0x",
    reality: "0x",
    uniswapV3: "0x",
    uniswapQuoter: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
    usdReference: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    tribute: "1000000000000000"
  },
  42161: {
    shrine: "0x",
    reality: "0x",
    uniswapV3: "0x",
    uniswapQuoter: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
    usdReference: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
    tribute: "1000000000000000"
  },
} as const
