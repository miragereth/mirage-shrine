import { getProvider } from "@wagmi/core"
import { getNetwork } from "@wagmi/core"
import { BigNumber, FixedNumber } from "ethers"
import { Link } from "react-router-dom"
import { getAllProphecies, Prophecy } from "../utils/get-prophecy"
import { yellowPages } from "../utils/yellow-pages"
import useSWR from "swr"
import { formatUnits } from "ethers/lib/utils.js"

export const CalendarFrame: React.FC<{ horizon: Date }> = (p) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]

  return (
    <div className="bg-stone-200 border border-gray-300 p-3 w-20 h-20 flex flex-col justify-center items-center rounded">
      <div className="text-xl font-bold flex">
        <span className="mr-1">{p.horizon.getDate()}</span>
        <span>{months[p.horizon.getMonth()]}</span>
      </div>
      <div className="text-lg font-semibold">
        <span>{p.horizon.getFullYear()}</span>
      </div>
    </div>
  )
}

export const fixAmount = (amount: BigNumber, decimals: number) =>
  FixedNumber.fromValue(amount, decimals)
    .toUnsafeFloat()
    .toFixed(3)
    .replace(/\.?0+$/, "")

export const Inquiry: React.FC<{ inquiry: string; short: boolean }> = (p) => {
  const shortLength = 100
  return (
    <div className="relative bg-white p-3 shadow-lg rounded inline-block">
      <blockquote className="italic text-lg">
        {p.short
          ? `${p.inquiry.substring(0, shortLength)}${
              p.inquiry.length > shortLength ? "..." : ""
            }`
          : p.inquiry}
      </blockquote>
      <span className="absolute top-0 left-0 text-4xl opacity-60">&ldquo;</span>
      <span className="absolute bottom-0 right-0 text-4xl opacity-60">
        &rdquo;
      </span>
    </div>
  )
}

export const TokenDisplay: React.FC<{
  supply: BigNumber
  decimals: number | null
  symbol: string | null
}> = (p) => {
  if (p.symbol === null || p.decimals === null) {
    return (
      <div className="bg-amber-400 rounded-2xl text-white flex p-1 text-center">
        <span>⚠️ Error</span>
      </div>
    )
  }

  const fixedAmount = fixAmount(p.supply, p.decimals)

  return (
    <div className="bg-gray-600 rounded-2xl text-white flex items-center p-1">
      <span className="mr-2">{fixedAmount}</span>
      <span className="text-base font-bold">{p.symbol}</span>
    </div>
  )
}

export const OddsDisplay: React.FC<{
  yes: number | null
  no: number | null
}> = (p) => {
  return (
    <div className="flex justify-evenly">
      {p.yes === null ? (
        <span className="bg-gray-300 rounded-2xl text-black p-1">—</span>
      ) : (
        <span className="bg-green-300 rounded-2xl text-black p-1">
          {p.yes * 100}%
        </span>
      )}
      {p.no === null ? (
        <span className="bg-gray-300 rounded-2xl text-black p-1">—</span>
      ) : (
        <span className="bg-red-300 rounded-2xl text-black p-1">
          {p.no * 100}%
        </span>
      )}
    </div>
  )
}

const ProphecyCard: React.FC<{ prophecy: Prophecy }> = (p) => {
  const network = getNetwork()

  return (
    <Link to={`/chain/${network.chain?.id}/prophecy/${p.prophecy.prophecyId}`}>
      <div className="flex hover:border hover:border-black shadow-lg">
        <CalendarFrame horizon={p.prophecy.horizon} />
        <Inquiry inquiry={p.prophecy.inquiry} short={true} />
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
    </Link>
  )
}

const ProphecyList: React.FC = () => {
  const network = getNetwork()
  const provider = getProvider()

  const {
    data: prophecies,
    isLoading,
    error,
  } = useSWR(`${network.chain?.id}:prophecies`, () =>
    getAllProphecies({ networkId: network.chain?.id as number, provider })
  )

  if (error) return <div>There was an issue</div>
  if (isLoading || prophecies === undefined) return <div>Loading...</div>

  return (
    <div>
      {prophecies.map((prophecy) => (
        <ProphecyCard key={prophecy.inquiryId} prophecy={prophecy} />
      ))}
    </div>
  )
}

export const Home: React.FC = () => {
  const network = getNetwork()
  return (
    <div className="origin-center">
      <Link
        to={`/chain/${network.chain?.id}/scry`}
        className="block w-10/12 bg-green-300 py-2 px-4 text-center font-bold rounded hover:border hover:border-green-700"
      >
        <span className="text-2xl mr-8">➕ Scry ➕</span>
        <span>
          {`💰${formatUnits(
            yellowPages[network.chain?.id as number].tribute,
            18
          )} ${network.chain?.nativeCurrency.symbol}`}
        </span>
      </Link>

      <ProphecyList />
    </div>
  )
}
