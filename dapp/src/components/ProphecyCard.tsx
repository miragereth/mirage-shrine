import { BigNumber, FixedNumber } from "ethers"
import { Link, useParams } from "react-router-dom"
import { Prophecy } from "../utils/get-prophecy"
import { UniswapInfo } from "../utils/get-uniswap-info"
import WhatshotIcon from "@mui/icons-material/Whatshot"
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty"
import CoronavirusIcon from "@mui/icons-material/Coronavirus"
import CheckIcon from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"

const compactor = new Intl.NumberFormat(
  // currently we are using only english number formatting because other
  // languages can result in very different string length, which we need to deal with.
  // (en: 10.2k, de: 10.200)
  "en", // currentLocale.value,
  {
    notation: "compact",
    compactDisplay: "short",
  }
)

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
      className="flex h-[72px] w-[72px] flex-col items-center justify-center rounded-3xl bg-orange-300
    dark:bg-slate-900"
    >
      <div className="flex text-lg font-bold">
        <span className="mr-1">{p.horizon.getDate()}</span>
        <span>{months[p.horizon.getMonth()]}</span>
      </div>
      <div className="text-base font-semibold">
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
  const shortLength = 56
  return (
    <div className={`flex flex-row items-center ${p.short ? "w-48" : ""}`}>
      <div className="flex min-h-full flex-col justify-between">
        <div className="text-2xl">&ldquo;</div>
        <div className="grow" />
      </div>
      <blockquote
        className={`w-60 break-words italic ${
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
      <div className="mx-[2px] flex min-h-full flex-col justify-between">
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

  const compacted = compactor.format(Number(fixedAmount))
  // For big amounts, the numbers are shown compacted
  // For tiny numbers, check if they're below threshold
  // Do not bombard their attention with worthless amounts
  const shown = Number(fixedAmount) < 0.01 ? "~" : compacted
  const concatEssence = p.symbol.substring(0, 4)
  return (
    <div className="flex flex-row items-center justify-between rounded-2xl bg-orange-100 pl-1 dark:bg-slate-900">
      <span className={`${p.small ? "w-8 text-sm" : "w-10"} text-center`}>
        {shown}
      </span>
      <div className="flex items-center rounded-2xl bg-white p-1 dark:bg-black">
        <span
          className={`${p.small ? "mx-[1px] w-9 text-xs" : "w-14"}
            text-center font-bold`}
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
  const parseOdd = (n: number): string => {
    const percent = n * 100
    if (percent >= 10) {
      return Math.floor(percent).toString()
    } else {
      return percent.toString().substring(0, 3)
    }
  }
  const size = `${p.small ? "w-10 h-7 text-sm py-1" : "w-14 h-8 py-1"}`
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
          p.small ? "h-7 w-[80px]" : "h-8 w-28"
        } rounded-2xl border-2 border-white
        py-1 text-center font-bold text-black opacity-50`}
      />
    )
  }
  const no =
    p.uniswapInfo.no.buy === null && p.uniswapInfo.no.sell === null
      ? null
      : p.uniswapInfo.no.buy === null
      ? `${parseOdd(p.uniswapInfo.no.sell as number)}%*`
      : p.uniswapInfo.no.sell === null
      ? `${parseOdd(p.uniswapInfo.no.buy as number)}%*`
      : `${parseOdd((p.uniswapInfo.no.buy + p.uniswapInfo.no.sell) / 2)}%`

  const yes =
    p.uniswapInfo.yes.buy === null && p.uniswapInfo.yes.sell === null
      ? null
      : p.uniswapInfo.yes.buy === null
      ? `${parseOdd(p.uniswapInfo.yes.sell as number)}%*`
      : p.uniswapInfo.yes.sell === null
      ? `${parseOdd(p.uniswapInfo.yes.buy as number)}%*`
      : `${parseOdd((p.uniswapInfo.yes.buy + p.uniswapInfo.yes.sell) / 2)}%`

  return (
    <div className="flex justify-center">
      {yes === null ? (
        <span
          className={`${size} rounded-l-2xl border-2 border-white opacity-50`}
        />
      ) : (
        <span
          className={`${size} rounded-l-2xl bg-green-300 text-center
        dark:bg-green-800 dark:text-white`}
        >
          {yes}
        </span>
      )}
      {no === null ? (
        <span
          className={`${size} rounded-r-2xl border-2 border-white opacity-50`}
        />
      ) : (
        <span
          className={`${size} rounded-r-2xl bg-red-300 text-center dark:bg-red-800 dark:text-white`}
        >
          {no}
        </span>
      )}
    </div>
  )
}

export const ProphecyCard: React.FC<{ prophecy: Prophecy }> = (p) => {
  const { chainId } = useParams()

  const emojis = [
    <WhatshotIcon />,
    <CoronavirusIcon />,
    <CheckIcon />,
    <CloseIcon />,
    <HourglassEmptyIcon />,
  ]

  return (
    <div className="scale-95 md:scale-100 lg:scale-110">
      <Link to={`/chain/${chainId}/prophecy/${p.prophecy.prophecyId}`}>
        <div
          className="flex w-full justify-between rounded-3xl
        border-2 border-transparent bg-orange-200 p-[5px] opacity-80 hover:border-zinc-400
          hover:opacity-100 dark:bg-slate-800"
        >
          <div className="mr-1 flex w-24 flex-row items-center justify-between">
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
