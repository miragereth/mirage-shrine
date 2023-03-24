import { Provider } from "@wagmi/core"
import { BigNumber, ethers } from "ethers"
import { QuoterABI } from "./abis"
import { yellowPages } from "./yellow-pages"

export interface UniswapInfo {
  yesValue: number | null
  noValue: number | null
}

export const getUniswapInfo = async (p: {
  essence: `0x${string}`
  yes: `0x${string}`
  no: `0x${string}`
  networkId: number
  provider: Provider
}): Promise<UniswapInfo> => {
  const quoter = new ethers.Contract(
    yellowPages[p.networkId].uniswapQuoter,
    QuoterABI,
    p.provider
  )

  let dollarOfEssence: BigNumber = BigNumber.from("100000") // testing

  if (yellowPages[p.networkId].usdReference !== p.essence.toLocaleLowerCase()) {
    try {
      dollarOfEssence = await quoter.callStatic.quoteExactInputSingle(
        yellowPages[p.networkId].usdReference,
        p.essence,
        3000, // 0.3% v3 fee
        BigNumber.from("10000000000000000000"),
        BigNumber.from("0")
      )
    } catch (_) {
      console.log("Can't get dollar reference")
      return { yesValue: null, noValue: null }
    }
  }

  let noes = null
  try {
    noes = await quoter.callStatic.quoteExactInputSingle(
      p.essence,
      p.no,
      10000, // 1% v3 fee,
      dollarOfEssence,
      0
    )
  } catch (_) {
    console.log("Quote for no failed")
  }

  let yeses = null

  try {
    yeses = await quoter.callStatic.quoteExactInputSingle(
      p.essence,
      p.yes,
      10000, // 1% v3 fee,
      dollarOfEssence,
      0
    )
  } catch (e) {
    console.log("Quote for yes failed")
    console.log(e)
  }

  const noRatio =
    noes === null
      ? null
      : BigNumber.from(dollarOfEssence)
          .mul(BigNumber.from(10000))
          .div(noes)
          .toNumber() / 10000
  const yesRatio =
    yeses === null
      ? null
      : BigNumber.from(dollarOfEssence)
          .mul(BigNumber.from(10000))
          .div(yeses)
          .toNumber() / 10000

  return { yesValue: yesRatio, noValue: noRatio }
}
