import { erc20ABI, getContract, Provider } from "@wagmi/core"
import { BigNumber } from "ethers"
import { Prophecy } from "./get-prophecy"
import { yellowPages } from "./yellow-pages"

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
