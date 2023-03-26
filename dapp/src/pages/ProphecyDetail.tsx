import {
  erc20ABI,
  getContract,
  getNetwork,
  getProvider,
  Signer,
} from "@wagmi/core"
import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useAccount, useSigner } from "wagmi"
import { MirageShrineABI } from "../utils/abis"
import { getAllProphecies, Prophecy } from "../utils/get-prophecy"
import { yellowPages } from "../utils/yellow-pages"
import { CalendarFrame, Inquiry, OddsDisplay, TokenDisplay } from "../components/ProphecyCard"
import useSWR from "swr"
import { getProphecyBalances } from "../utils/get-balance"
import { BigNumber, constants, ethers } from "ethers"

const ProphecyCore: React.FC<{ prophecy: Prophecy }> = (p) => {
  return (
    <div className="flex">
      <CalendarFrame horizon={p.prophecy.horizon} />
      <Inquiry inquiry={p.prophecy.inquiry} short={false} />
      <div className="flex flex-col justify-evenly">
        <TokenDisplay
          decimals={p.prophecy.essenceDecimals}
          supply={p.prophecy.fateSupply}
          symbol={p.prophecy.essenceSymbol}
        />
        <OddsDisplay
          yes={p.prophecy.uniswapInfo.yesValue}
          no={p.prophecy.uniswapInfo.noValue}
        />
      </div>
    </div>
  )
}

const Distill: React.FC<{ prophecy: Prophecy }> = (p) => {
  const network = getNetwork()
  const provider = getProvider()
  const { data: signer } = useSigner()
  const account = useAccount()
  const {
    data: balances,
    isLoading,
    error,
    mutate,
  } = useSWR(
    `${network.chain?.id}:prophecyBalances/${p.prophecy.prophecyId}/${account.address}`,
    () =>
      getProphecyBalances({
        networkId: network.chain?.id as number,
        provider,
        owner: account.address as `0x${string}`,
        prophecy: p.prophecy,
      })
  )

  const [amount, setAmount] = useState<string>("")
  if (isLoading || balances === undefined) return <div>loading...</div>

  if (balances.essence === null) return <div>Bad token</div>

  const approve = async (full: boolean) => {
    await getContract({
      address: p.prophecy.essence,
      abi: erc20ABI,
      signerOrProvider: signer as Signer,
    }).approve(
      yellowPages[network.chain?.id as number].shrine,
      full
        ? constants.MaxUint256
        : ethers.utils.parseUnits(amount, p.prophecy.essenceDecimals as number)
    )

    mutate()
  }

  const distill = async () => {
    await getContract({
      address: yellowPages[network.chain?.id as number].shrine,
      abi: MirageShrineABI,
      signerOrProvider: signer as Signer,
    }).distill(
      BigNumber.from(p.prophecy.prophecyId),
      ethers.utils.parseUnits(amount, p.prophecy.essenceDecimals as number)
    )
    mutate()
  }

  const valid =
    /^([0-9]*[.])?[0-9]+/.test(amount) &&
    Number.parseFloat(amount) !== 0 &&
    ethers.utils
      .parseUnits(amount, p.prophecy.essenceDecimals as number)
      .lte(balances.essence)

  const needsAllowance =
    valid &&
    ethers.utils
      .parseUnits(amount, p.prophecy.essenceDecimals as number)
      .gt(balances.essenceAllowance as BigNumber)

  return (
    <div>
      <div>
        <span>
          Balance:{" "}
          {ethers.utils.formatUnits(
            balances.essence,
            p.prophecy.essenceDecimals as number
          )}{" "}
          {p.prophecy.essenceSymbol}
        </span>
      </div>
      <div className="flex my-2">
        <input
          className="border-black rounded-sm mr-1 border"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value)
          }}
          placeholder="0"
        />
        {needsAllowance ? (
          <div>
            <button
              className="bg-blue-300 rounded-lg p-1 mr-2"
              onClick={() => {
                approve(false)
              }}
            >
              Approve {amount} {p.prophecy.essenceSymbol}
            </button>
            <button
              className="bg-yellow-300 rounded-lg p-1 mr-2"
              onClick={() => {
                approve(true)
              }}
            >
              Full Approve
            </button>
          </div>
        ) : (
          <button
            className="bg-blue-300 rounded-lg p-1 mr-2"
            disabled={!valid}
            onClick={distill}
          >
            {valid ? "Distill" : "Bad amount"}
          </button>
        )}
      </div>
    </div>
  )
}

const Blend: React.FC<{ prophecy: Prophecy }> = (p) => {
  const network = getNetwork()
  const provider = getProvider()
  const { data: signer } = useSigner()
  const account = useAccount()
  const {
    data: balances,
    isLoading,
    mutate,
  } = useSWR(
    `${network.chain?.id}:prophecyBalances/${p.prophecy.prophecyId}/${account.address}`,
    () =>
      getProphecyBalances({
        networkId: network.chain?.id as number,
        provider,
        owner: account.address as `0x${string}`,
        prophecy: p.prophecy,
      })
  )

  const [amount, setAmount] = useState<string>("")
  if (isLoading || balances === undefined) return <div>loading...</div>

  if (balances.essence === null) return <div>Bad token</div>

  const blend = async () => {
    await getContract({
      address: yellowPages[network.chain?.id as number].shrine,
      abi: MirageShrineABI,
      signerOrProvider: signer as Signer,
    }).blend(
      BigNumber.from(p.prophecy.prophecyId),
      ethers.utils.parseUnits(amount, p.prophecy.essenceDecimals as number)
    )
    mutate()
  }

  const valid =
    /^([0-9]*[.])?[0-9]+/.test(amount) &&
    Number.parseFloat(amount) !== 0 &&
    ethers.utils
      .parseUnits(amount, p.prophecy.essenceDecimals as number)
      .lte(balances.yes) &&
    ethers.utils
      .parseUnits(amount, p.prophecy.essenceDecimals as number)
      .lte(balances.no)

  return (
    <div>
      <div>
        <div className="flex ">
          <span>
            Balance:{" "}
            {ethers.utils.formatUnits(
              balances.yes,
              p.prophecy.essenceDecimals as number
            )}
            {" YES - "}
            {ethers.utils.formatUnits(
              balances.no,
              p.prophecy.essenceDecimals as number
            )}
            {" NO"}
          </span>
        </div>
      </div>
      <div className="flex my-2">
        <input
          className="border-black rounded-sm mr-1 border"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value)
          }}
          placeholder="0"
        />

        <button
          className="bg-blue-300 rounded-lg p-1 mr-2"
          disabled={!valid}
          onClick={blend}
        >
          {valid ? "Blend" : "Bad amount"}
        </button>
      </div>
    </div>
  )
}

const Market: React.FC<{ prophecy: Prophecy }> = (p) => {
  const network = getNetwork()

  if (network.chain?.id === 100)
    return <div>Uniswap does not exist in Gnosis Chain.</div>

  return (
    <div className="flex my-10">
      <div className="bg-purple-300 mx-3 p-1">
        {p.prophecy.uniswapInfo.yesValue === null ? (
          <a
            target="_blank"
            href={`https://app.uniswap.org/#/add/${p.prophecy.yes}/${p.prophecy.essence}/10000?minPrice=0.50663&maxPrice=0.50663`}
          >
            Create a Pool for YES tokens 🦄
          </a>
        ) : (
          <a
            target="_blank"
            href={`https://app.uniswap.org/#/swap?inputCurrency=${p.prophecy.essence}&outputCurrency=${p.prophecy.yes}`}
          >
            Swap YES in Uniswap 🦄
          </a>
        )}
      </div>
      <div className="bg-purple-300 p-1">
        {p.prophecy.uniswapInfo.noValue === null ? (
          <a
            target="_blank"
            href={`https://app.uniswap.org/#/add/${p.prophecy.no}/${p.prophecy.essence}/10000?minPrice=0.50663&maxPrice=0.50663`}
          >
            Create a Pool for NO tokens 🦄
          </a>
        ) : (
          <a
            target="_blank"
            href={`https://app.uniswap.org/#/swap?inputCurrency=${p.prophecy.essence}&outputCurrency=${p.prophecy.no}`}
          >
            Swap NO in Uniswap 🦄
          </a>
        )}
      </div>
    </div>
  )
}

const MatterInteraction: React.FC<{ prophecy: Prophecy }> = (p) => {
  if (p.prophecy.essenceDecimals === null) {
    return <div>This token is broken, this prophecy ought to be forgotten.</div>
  }

  return (
    <div>
      <Distill prophecy={p.prophecy} />
      <Blend prophecy={p.prophecy} />
      <Market prophecy={p.prophecy} />
    </div>
  )
}

export const ProphecyPage: React.FC = (p) => {
  const { prophecyId, chainId } = useParams()
  const id = Number(prophecyId as string)
  const network = getNetwork()
  const provider = getProvider()

  const {
    data: prophecies,
    isLoading,
    error,
  } = useSWR(`${network.chain?.id}:prophecies`, () =>
    getAllProphecies({ networkId: network.chain?.id as number, provider })
  )

  if (isLoading || prophecies === undefined)
    return (
      <Link
        to={`/chain/${chainId}`}
        className="block w-full bg-green-300 py-2 px-4 text-center font-bold rounded hover:border hover:border-green-700"
      >
        Return
      </Link>
    )

  const prophecy = prophecies[id]

  return (
    <div className="mx-2">
      {" "}
      <Link
        to={`/chain/${chainId}`}
        className="block box-content w-full bg-green-300 py-2 px-4 text-center font-bold rounded hover:border hover:border-green-700"
      >
        Return
      </Link>{" "}
      <ProphecyCore prophecy={prophecy} />
      <div className="flex">
        <a
          href={`https://reality.eth.limo/app/#!/network/${
            network.chain?.id
          }/question/${yellowPages[network.chain?.id as number].reality}-${
            prophecy.inquiryId
          }`}
          target="_blank"
        >
          <span className="flex mr-3">
            <img src="./assets/reality-icon.png" />
            reality.eth
          </span>
        </a>
        <a
          href={`${network.chain?.blockExplorers?.default.url}/tx/${prophecy.scryTxHash}`}
          target="_blank"
        >
          transaction hash
        </a>
      </div>
      <MatterInteraction prophecy={prophecy} />
    </div>
  )
}
