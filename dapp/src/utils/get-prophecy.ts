import { erc20ABI, getContract, Provider, readContract } from "@wagmi/core"
import { BigNumber } from "ethers"
import { FateABI, MirageShrineABI, RealityABI } from "./abis"
import { getUniswapInfo, UniswapInfo } from "./get-uniswap-info"
import { bytes23ToString } from "./rune"
import { yellowPages } from "./yellow-pages"

export enum Aura {
  Forthcoming,
  Blighted,
  Fulfilled,
  Mirage,
  Entranced,
}

export interface Prophecy {
  prophecyId: number
  scryTxHash: string
  rune: string
  createdAt: Date
  horizon: Date
  inquiry: string
  inquiryId: `0x${string}`
  essence: `0x${string}`
  essenceSymbol: string | null
  essenceDecimals: number | null
  fateSupply: BigNumber
  yes: `0x${string}`
  no: `0x${string}`
  aura: Aura
  uniswapInfo: UniswapInfo
}

export const getProphecy = async (p: {
  prophecyId: number
  networkId: number
  provider: Provider
}) => {
  const shrine = getContract({
    address: yellowPages[p.networkId].shrine,
    abi: MirageShrineABI,
    signerOrProvider: p.provider,
  })

  const got = await shrine.prophecies(BigNumber.from(p.prophecyId))
  const fate = getContract({
    address: got.no,
    abi: FateABI,
    signerOrProvider: p.provider,
  })
  const reality = getContract({
    address: yellowPages[p.networkId].reality,
    abi: RealityABI,
    signerOrProvider: p.provider,
  })

  const scryFilter = shrine.filters.Scry(BigNumber.from(p.prophecyId), null)

  const scryTxHashPromise = shrine
    .queryFilter(scryFilter, 8695890)
    .then((logs) => {
      return logs[0].transactionHash // It would be convenient for logs to bring their time.
    })

  const inquiryFilter = reality.filters.LogNewQuestion(
    got.inquiryId,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  )

  const inquiryPromise: Promise<[string, BigNumber]> = reality
    .queryFilter(inquiryFilter, 8695890)
    .then((logs) => {
      const onlyQuestion = logs[0].args as any
      return [
        onlyQuestion.question as string,
        onlyQuestion.created as BigNumber,
      ]
    })

  const inquiryResultPromise = async () => {
    let result
    try {
      result = await reality.resultFor(got.inquiryId)
    } catch (e) {
      result = null
    }
    return result
  }

  const runeBytesPromise = fate.info().then((info) => info[0])

  const essenceToken = getContract({
    address: got.essence,
    abi: erc20ABI,
    signerOrProvider: p.provider,
  })

  const essenceSymbolPromise = async () => {
    let result = null
    try {
      result = await essenceToken.symbol()
    } catch (e) {
      console.log("Not a token", { prophecy: got })
    }
    return result
  }
  const essenceDecimalsPromise = async () => {
    let result = null
    try {
      result = await essenceToken.decimals()
    } catch (e) {
      console.log("Not a token", { prophecy: got })
    }
    return result
  }

  const uniswapInfoPromise = getUniswapInfo({
    essence: got.essence,
    yes: got.yes,
    no: got.no,
    networkId: p.networkId,
    provider: p.provider,
  })

  const [
    [inquiry, createdAt],
    runeBytes,
    essenceSymbol,
    essenceDecimals,
    scryTxHash,
    uniswapInfo,
    inquiryResult,
  ] = await Promise.all([
    inquiryPromise,
    runeBytesPromise,
    essenceSymbolPromise(),
    essenceDecimalsPromise(),
    scryTxHashPromise,
    uniswapInfoPromise,
    inquiryResultPromise(),
  ])

  const rune = bytes23ToString(runeBytes)

  let aura = [Aura.Forthcoming, Aura.Blighted, Aura.Fulfilled, Aura.Mirage][
    got.aura
  ]

  if (aura === Aura.Forthcoming) {
    // There is a reality result
    if (inquiryResult !== null) {
      console.log({inquiryResult})
      if (BigNumber.from(inquiryResult).eq(BigNumber.from(0))) {
        aura = Aura.Mirage
      } else if (BigNumber.from(inquiryResult).eq(BigNumber.from(1))) {
        aura = Aura.Fulfilled
      } else {
        aura = Aura.Blighted
      }
    } else if (new Date().getTime() > got.horizon * 1000) {
      // Over the horizon
      aura = Aura.Entranced
    }
  }

  const prophecy: Prophecy = {
    prophecyId: p.prophecyId,
    scryTxHash,
    rune: rune,
    essence: got.essence,
    essenceSymbol,
    essenceDecimals,
    horizon: new Date(got.horizon * 1000),
    createdAt: new Date(createdAt.toNumber() * 1000),
    aura: aura,
    no: got.no,
    yes: got.yes,
    fateSupply: got.fateSupply,
    inquiryId: got.inquiryId,
    inquiry: inquiry,
    uniswapInfo,
  }

  return prophecy
}

export const getAllProphecies = async (p: {
  networkId: number
  provider: Provider
}) => {
  const shrine = getContract({
    address: yellowPages[p.networkId].shrine,
    abi: MirageShrineABI,
    signerOrProvider: p.provider,
  })
  const prophecyCount = await shrine.count()

  const prophecyPromises = []

  for (let i = 0; i < prophecyCount.toNumber(); i++) {
    prophecyPromises.push(
      getProphecy({
        prophecyId: i,
        networkId: p.networkId,
        provider: p.provider,
      })
    )
  }

  const prophecies = await Promise.all(prophecyPromises)
  return prophecies
}
