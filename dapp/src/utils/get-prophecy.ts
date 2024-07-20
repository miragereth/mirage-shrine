import { erc20ABI, getContract, Provider } from "@wagmi/core"
import { BigNumber, providers } from "ethers"
import { FateABI, MirageShrineABI, RealityABI } from "./abis"
import { getUniswapInfo, UniswapInfo } from "./get-uniswap-info"
import { bytes23ToString } from "./rune"
import { yellowPages, manualProviders, ValidNet } from "./yellow-pages"

const randomBetween = (min: number, max: number) =>
  Math.floor(min + Math.random() * (max - min))

export const sleep = (seconds = 0.5): Promise<void> => {
  if (seconds === 0) seconds = randomBetween(2, 5)
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

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

  const inquiryPromise: Promise<[string, string, BigNumber]> = reality
    .queryFilter(inquiryFilter, 8695890)
    .then((logs) => {
      const onlyQuestion = logs[0].args as any
      const txHash = logs[0].transactionHash
      return [
        txHash,
        onlyQuestion.question as string,
        onlyQuestion.created as BigNumber,
      ]
    })

  const [scryTxHash, inquiry, createdAt] = await inquiryPromise

  await sleep()

  const inquiryResultPromise = async () => {
    let result
    try {
      result = await reality.resultFor(got.inquiryId)
    } catch (e) {
      result = null
    }
    return result
  }

  const inquiryResult = await inquiryResultPromise()

  await sleep()

  //const runeBytes = await fate.info().then((info) => info[0])

  await sleep()

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
  const essenceSymbol = await essenceSymbolPromise()
  await sleep()

  // const essenceDecimalsPromise = async () => {
  //   let result = null
  //   try {
  //     result = await essenceToken.decimals()
  //   } catch (e) {
  //     console.log("Not a token", { prophecy: got })
  //   }
  //   return result
  // }

  //const essenceDecimals = await essenceDecimalsPromise()
  //await sleep()

  // const uniswapInfoPromise = getUniswapInfo({
  //   essence: got.essence,
  //   yes: got.yes,
  //   no: got.no,
  //   networkId: p.networkId,
  //   provider: p.provider,
  // })

  // const uniswapInfo = await uniswapInfoPromise
  //await sleep()

  const uniswapInfo = {
    yes: { buy: null, sell: null },
    no: { buy: null, sell: null },
  }

  await sleep()

  //const rune = bytes23ToString(runeBytes)

  let aura = [Aura.Forthcoming, Aura.Blighted, Aura.Fulfilled, Aura.Mirage][
    got.aura
  ]

  if (aura === Aura.Forthcoming) {
    // There is a reality result
    if (inquiryResult !== null) {
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
    rune: "",
    essence: got.essence,
    essenceSymbol,
    essenceDecimals: 18, // assume this so that it loads faster
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

export const getAllProphecies = async (p: { networkId: number }) => {
  if (isNaN(p.networkId)) return
  const provider = new providers.JsonRpcProvider(
    manualProviders[p.networkId as ValidNet]
  )
  const shrine = getContract({
    address: yellowPages[p.networkId].shrine,
    abi: MirageShrineABI,
    signerOrProvider: provider,
  })
  const prophecyCount = await shrine.count()

  await sleep()
  const prophecyPromises = []
  for (let i = 0; i < prophecyCount.toNumber(); i++) {
    await sleep()
    prophecyPromises.push(
      getProphecy({
        prophecyId: i,
        networkId: p.networkId,
        provider: provider,
      })
    )
  }

  const prophecies = await Promise.all(prophecyPromises)
  return prophecies
}
