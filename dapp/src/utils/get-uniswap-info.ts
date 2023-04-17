import { Provider } from "@wagmi/core"
import { BigNumber, ethers } from "ethers"
import { QuoterABI } from "./abis"
import { yellowPages } from "./yellow-pages"

export interface Trade {
  buy: number | null
  sell: number | null
}
export interface UniswapInfo {
  yes: Trade
  no: Trade
}

const unavailable: Trade = { buy: null, sell: null }

export const getUniswapInfo = async (p: {
  essence: `0x${string}`
  yes: `0x${string}`
  no: `0x${string}`
  networkId: number
  provider: Provider
}): Promise<UniswapInfo> => {
  // UniswapV3 is not available in Gnosis Chain
  if (p.networkId === 100) {
    return { no: unavailable, yes: unavailable }
  }

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
      return { yes: unavailable, no: unavailable }
    }
  }

  const noBuyPromise = async () => {
    let noBuy = null
    try {
      noBuy = await quoter.callStatic.quoteExactInputSingle(
        p.essence,
        p.no,
        10000, // 1% v3 fee,
        dollarOfEssence,
        0
      )
    } catch (_) {
      //console.log("Quote for no buy failed")
    }
    return noBuy
  }

  const noSellPromise = async () => {
    let noSell = null
    try {
      noSell = await quoter.callStatic.quoteExactOutputSingle(
        p.no,
        p.essence,
        10000, // 1% v3 fee,
        dollarOfEssence,
        0
      )
    } catch (_) {
      //console.log("Quote for no sell failed")
    }
    return noSell
  }

  const yesBuyPromise = async () => {
    let yesBuy = null

    try {
      yesBuy = await quoter.callStatic.quoteExactInputSingle(
        p.essence,
        p.yes,
        10000, // 1% v3 fee,
        dollarOfEssence,
        0
      )
    } catch (e) {
      //console.log("Quote for yes buy failed")
    }
    return yesBuy
  }

  const yesSellPromise = async () => {
    let yesSell = null

    try {
      yesSell = await quoter.callStatic.quoteExactOutputSingle(
        p.yes,
        p.essence,
        10000, // 1% v3 fee,
        dollarOfEssence,
        0
      )
    } catch (e) {
      //console.log("Quote for yes sell failed")
    }
    return yesSell
  }
  const [noBuy, noSell, yesBuy, yesSell] = await Promise.all([
    noBuyPromise(),
    noSellPromise(),
    yesBuyPromise(),
    yesSellPromise(),
  ])

  const noBuyRatio =
    noBuy === null
      ? null
      : BigNumber.from(dollarOfEssence)
          .mul(BigNumber.from(10000))
          .div(noBuy)
          .toNumber() / 10000

  const noSellRatio =
    noSell === null
      ? null
      : BigNumber.from(dollarOfEssence)
          .mul(BigNumber.from(10000))
          .div(noSell)
          .toNumber() / 10000

  const yesBuyRatio =
    yesBuy === null
      ? null
      : BigNumber.from(dollarOfEssence)
          .mul(BigNumber.from(10000))
          .div(yesBuy)
          .toNumber() / 10000

  const yesSellRatio =
    yesSell === null
      ? null
      : BigNumber.from(dollarOfEssence)
          .mul(BigNumber.from(10000))
          .div(yesSell)
          .toNumber() / 10000

  return {
    yes: { buy: yesBuyRatio, sell: yesSellRatio },
    no: { buy: noBuyRatio, sell: noSellRatio },
  }
}
