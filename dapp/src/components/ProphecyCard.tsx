import { getNetwork } from "@wagmi/core"
import { BigNumber, FixedNumber } from "ethers"
import { Link } from "react-router-dom"
import { Prophecy } from "../utils/get-prophecy"

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
    <div
      className="flex h-20 w-20 flex-col items-center justify-center rounded-3xl bg-orange-300
    dark:bg-slate-900"
    >
      <div className="flex text-xl font-bold">
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
    <div className={`flex flex-row items-center ${p.short ? "w-64" : ""}`}>
      <div className="flex min-h-full flex-col justify-between">
        <div className="text-2xl">&ldquo;</div>
        <div className="grow" />
      </div>
      <blockquote
        className={`italic w-${p.short ? "60" : "120"} text-justify text-${
          p.short ? "sm" : "base"
        }`}
      >
        {p.short
          ? `${p.inquiry.substring(0, shortLength)}${
              p.inquiry.length > shortLength ? "..." : ""
            }`
          : p.inquiry}
      </blockquote>
      <div className="flex min-h-full flex-col justify-between px-2">
        <div className="grow" />
        <div className="grow-0 text-2xl">&rdquo;</div>
      </div>
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
      <div className="flex rounded-2xl bg-amber-400 p-1 text-center">
        <span>⚠️ Error</span>
      </div>
    )
  }

  const fixedAmount = fixAmount(p.supply, p.decimals)

  return (
    <div className="flex flex-row items-center rounded-2xl bg-orange-100 pl-2 dark:bg-slate-900">
      <span className="mr-2">{fixedAmount}</span>
      <div className="flex items-center rounded-2xl p-1 dark:bg-black">
        🐔
        <span className="text-base font-bold">{p.symbol}</span>
      </div>
    </div>
  )
}

export const OddsDisplay: React.FC<{
  yes: number | null
  no: number | null
}> = (p) => {
  return (
    <div className="flex justify-center">
      {p.yes === null ? (
        <span
          className="w-16 rounded-l-2xl bg-gray-300 py-1 pl-1 text-center font-bold
          text-black dark:bg-gray-500"
        >
          —
        </span>
      ) : (
        <span
          className="w-16 rounded-l-2xl bg-green-300 py-1 pl-1 text-center dark:bg-green-800
        dark:text-white"
        >
          {p.yes * 100}%
        </span>
      )}
      {p.no === null ? (
        <span
          className="w-16 rounded-r-2xl bg-gray-300 py-1 pr-1 text-center font-bold
        text-black dark:bg-gray-500"
        >
          —
        </span>
      ) : (
        <span className="w-16 rounded-r-2xl bg-red-300 py-1 pr-1 text-center dark:bg-red-800 dark:text-white">
          {p.no * 100}%
        </span>
      )}
    </div>
  )
}

export const ProphecyCard: React.FC<{ prophecy: Prophecy }> = (p) => {
  const network = getNetwork()

  const emojis = ["🕯️", "🦠", "✔️", "❌", "⌛"]

  return (
    <div className="w-fit">
      <Link
        to={`/chain/${network.chain?.id}/prophecy/${p.prophecy.prophecyId}`}
      >
        <div
          className="flex justify-between rounded-3xl border-2 border-transparent
        bg-orange-200 p-3 opacity-80 hover:border-zinc-400 hover:opacity-100
          dark:bg-slate-800"
        >
          <div className="mx-1 flex w-28 flex-row items-center justify-between">
            {emojis[p.prophecy.aura]}
            <CalendarFrame horizon={p.prophecy.horizon} />
          </div>
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
    </div>
  )
}
