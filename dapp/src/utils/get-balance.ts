import { erc20ABI, getContract, Provider } from "@wagmi/core"
import { BigNumber, providers } from "ethers"
import { Prophecy } from "./get-prophecy"
import { manualProviders, ValidNet, yellowPages } from "./yellow-pages"

export const getBalanceOf = async (p: {
  networkId: number
  provider: Provider
  owner: `0x${string}`
  tokenAddress: `0x${string}`
}) => {
  const token = getContract({
    address: p.tokenAddress,
    abi: erc20ABI,
    signerOrProvider: p.provider,
  })

  let balance = null
  try {
    balance = await token.balanceOf(p.owner)
  } catch (e) {}

  return balance
}

export const getAllowanceOf = async (p: {
  networkId: number
  provider: Provider
  owner: `0x${string}`
  to: `0x${string}`
  tokenAddress: `0x${string}`
}) => {
  const token = getContract({
    address: p.tokenAddress,
    abi: erc20ABI,
    signerOrProvider: p.provider,
  })

  let balance = null
  try {
    balance = await token.allowance(p.owner, p.to)
  } catch (e) {}

  return balance
}

export const getProphecyBalances = async (p: {
  networkId: number
  provider: Provider
  owner: `0x${string}`
  prophecy: Prophecy
}) => {
  if (p.owner === undefined) return

  const [essence, essenceAllowance, yes, no] = await Promise.all([
    getBalanceOf({
      networkId: p.networkId,
      provider: p.provider,
      owner: p.owner,
      tokenAddress: p.prophecy.essence,
    }),
    getAllowanceOf({
      networkId: p.networkId,
      provider: p.provider,
      owner: p.owner,
      tokenAddress: p.prophecy.essence,
      to: yellowPages[p.networkId].shrine,
    }),
    getBalanceOf({
      networkId: p.networkId,
      provider: p.provider,
      owner: p.owner,
      tokenAddress: p.prophecy.yes,
    }),
    getBalanceOf({
      networkId: p.networkId,
      provider: p.provider,
      owner: p.owner,
      tokenAddress: p.prophecy.no,
    }),
  ])

  return {
    essence,
    essenceAllowance,
    yes: yes as BigNumber,
    no: no as BigNumber,
  }
}

export const getTokenSymbol = async (p: {
  networkId: number
  token: `0x${string}`
}) => {
  if (isNaN(p.networkId)) return
  const provider = new providers.JsonRpcProvider(
    manualProviders[p.networkId as ValidNet]
  )
  const essenceToken = getContract({
    address: p.token,
    abi: erc20ABI,
    signerOrProvider: provider,
  })
  const symbolPromise = async () => {
    let result = null
    try {
      result = await essenceToken.symbol()
    } catch (e) {
      console.log("Not a token", { token: p.token })
    }
    return result
  }

  const symbol = await symbolPromise()
  return symbol
}
