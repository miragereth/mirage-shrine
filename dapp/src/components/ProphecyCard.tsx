import { BigNumber, FixedNumber } from "ethers"
import { Link, useParams } from "react-router-dom"
import { Prophecy } from "../utils/get-prophecy"
import { UniswapInfo } from "../utils/get-uniswap-info"

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
        className={`italic w-${p.short ? "60" : "120"} ${
          p.inquiry !== "" ? "text-justify" : "text-center"
        } text-${p.short ? "sm" : "base"}`}
      >
        {p.inquiry !== ""
          ? p.short
            ? `${p.inquiry.substring(0, shortLength)}${
                p.inquiry.length > shortLength ? "..." : ""
              }`
            : p.inquiry
          : "(empty)"}
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
  small: boolean
}> = (p) => {
  if (p.symbol === null || p.decimals === null) {
    return (
      <div className="flex rounded-2xl bg-amber-400 p-1 text-center">
        <span>⚠️ Error</span>
      </div>
    )
  }

  const fixedAmount = fixAmount(p.supply, p.decimals)
  // Do not bombard their attention with worthless amounts
  const shown = Number(fixedAmount) < 0.01 ? "~" : fixedAmount.substring(0, 4)
  const concatEssence = p.symbol.substring(0, 4)
  return (
    <div className="flex flex-row items-center justify-between rounded-2xl bg-orange-100 pl-2 dark:bg-slate-900">
      <span className={`${p.small ? "text-sm" : ""} w-8 text-center`}>
        {shown}
      </span>
      <div className="flex items-center rounded-2xl bg-white p-1 dark:bg-black">
        <span
          className={`${p.small ? "text-sm" : ""}  ${p.small ? "w-10" : "w-14"}
            ${p.small ? "mx-1" : ""}
            text-center font-bold `}
        >
          {concatEssence}
        </span>
      </div>
    </div>
  )
}

export const OddsDisplay: React.FC<{
  uniswapInfo: UniswapInfo
  small: boolean
}> = (p) => {
  console.log(p.uniswapInfo)
  const parseOdd = (n: number): string => `${n * 100}`.substring(0, 4) + "%"
  const size = `${p.small ? "w-11 h-7 text-sm" : "w-14 h-8"}`
  if (
    p.uniswapInfo.no.buy === null &&
    p.uniswapInfo.no.sell === null &&
    p.uniswapInfo.yes.buy === null &&
    p.uniswapInfo.yes.sell === null
  ) {
    // show empty
    return (
      <span
        className={`${
          p.small ? "h-7 w-[22]" : "h-8 w-28"
        } rounded-2xl border-2 border-white
        py-1 text-center font-bold text-black opacity-50`}
      />
    )
  }
  return (
    <div className="flex justify-center">
      {p.uniswapInfo.yes.buy === null ? (
        <span
          className={`${size} rounded-l-2xl border-2 border-white
          py-1 text-center font-bold text-black opacity-50`}
        />
      ) : (
        <span
          className={`${size} rounded-l-2xl bg-green-300 py-1 text-center
        dark:bg-green-800 dark:text-white`}
        >
          {parseOdd(p.uniswapInfo.yes.buy)}
        </span>
      )}
      {p.uniswapInfo.no.buy === null ? (
        <span
          className={`${size} rounded-r-2xl border-2 border-white 
        py-1 text-center font-bold text-black opacity-50`}
        />
      ) : (
        <span
          className={`${size} rounded-r-2xl bg-red-300 py-1 text-center dark:bg-red-800 dark:text-white`}
        >
          {parseOdd(p.uniswapInfo.no.buy)}
        </span>
      )}
    </div>
  )
}

export const ProphecyCard: React.FC<{ prophecy: Prophecy }> = (p) => {
  const { chainId } = useParams()

  const emojis = ["🕯️", "🦠", "✔️", "❌", "⌛"]

  return (
    <div className="">
      <Link to={`/chain/${chainId}/prophecy/${p.prophecy.prophecyId}`}>
        <div
          className="flex justify-between rounded-3xl border-2 border-transparent
        bg-orange-200 p-2 opacity-80 hover:border-zinc-400 hover:opacity-100
          dark:bg-slate-800"
        >
          <div className="mr-1 flex w-28 flex-row items-center justify-between">
            <div className="mr-1">{emojis[p.prophecy.aura]}</div>
            <CalendarFrame horizon={p.prophecy.horizon} />
          </div>
          <Inquiry inquiry={p.prophecy.inquiry} short={true} />
          <div className="flex flex-col justify-evenly">
            <TokenDisplay
              decimals={p.prophecy.essenceDecimals}
              supply={p.prophecy.fateSupply}
              symbol={p.prophecy.essenceSymbol}
              small
            />
            <OddsDisplay uniswapInfo={p.prophecy.uniswapInfo} small />
          </div>
        </div>
      </Link>
    </div>
  )
}
