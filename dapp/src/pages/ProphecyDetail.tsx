import {
  erc20ABI,
  getContract,
  getNetwork,
  getProvider,
  Signer,
} from "@wagmi/core"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { useAccount, useNetwork, useSigner } from "wagmi"
import { MirageShrineABI } from "../utils/abis"
import { Aura, getAllProphecies, Prophecy } from "../utils/get-prophecy"
import { yellowPages, manualExplorers, validNet } from "../utils/yellow-pages"
import {
  CalendarFrame,
  fixAmount,
  Inquiry,
  OddsDisplay,
  TokenDisplay,
} from "../components/ProphecyCard"
import useSWR from "swr"
import { getProphecyBalances } from "../utils/get-balance"
import { BigNumber, constants, ethers } from "ethers"
import { formatUnits, parseUnits } from "ethers/lib/utils.js"
import { Trade } from "../utils/get-uniswap-info"
import { ReactSVG } from "react-svg"

import WhatshotIcon from "@mui/icons-material/Whatshot"
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty"
import CoronavirusIcon from "@mui/icons-material/Coronavirus"
import CheckIcon from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"

import LoopRoundedIcon from "@mui/icons-material/LoopRounded"
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded"
import CycloneIcon from "@mui/icons-material/Cyclone"

const ProphecyCore: React.FC<{ prophecy: Prophecy }> = (p) => {
  const emojis = [
    <WhatshotIcon />,
    <CoronavirusIcon />,
    <CheckIcon />,
    <CloseIcon />,
    <HourglassEmptyIcon />,
  ]

  const { chainId } = useParams()
  return (
    <div className="">
      <div
        className="flex justify-between rounded-3xl border-2 border-transparent
        bg-orange-200 p-2 dark:bg-slate-800"
      >
        <div>
          <div className="mr-1 flex w-24 flex-row items-center justify-between">
            <div className="mr-1">{emojis[p.prophecy.aura]}</div>
            <CalendarFrame horizon={p.prophecy.horizon} />
          </div>
          <div
            className="mr-1 mt-2 flex w-24 flex-row items-center justify-between
              rounded-2xl bg-orange-100 dark:bg-slate-700"
          >
            <a
              href={`https://reality.eth.limo/app/#!/network/${chainId}/question/${
                yellowPages[Number(chainId) as number].reality
              }-${p.prophecy.inquiryId}`}
              target="_blank"
              className="opacity-80 hover:opacity-100"
            >
              <div className="m-3 flex">
                <img
                  src="./assets/reality-icon.png"
                  className="h-6 w-6 hover:animate-spin"
                />
              </div>
            </a>
            <a
              href={`${manualExplorers[Number(chainId) as validNet]}/tx/${
                p.prophecy.scryTxHash
              }`}
              target="_blank"
              className="opacity-80 hover:opacity-100"
            >
              <div className="m-3 flex">
                <img
                  src="./assets/etherscan.ico"
                  className="h-6 w-6 hover:animate-spin"
                />
              </div>
            </a>
          </div>
        </div>
        <Inquiry inquiry={p.prophecy.inquiry} short={false} />
        <div className="mt-1 flex flex-col">
          <TokenDisplay
            decimals={p.prophecy.essenceDecimals}
            supply={p.prophecy.fateSupply}
            symbol={p.prophecy.essenceSymbol}
            small={false}
          />
          <div className="mt-3" />
          <OddsDisplay uniswapInfo={p.prophecy.uniswapInfo} small={false} />
        </div>
      </div>
    </div>
  )
}

const Distill: React.FC<{ prophecy: Prophecy }> = (p) => {
  const network = getNetwork()
  const { chainId } = useParams()
  const provider = getProvider()
  const { data: signer } = useSigner()
  const account = useAccount()
  const {
    data: balances,
    isLoading,
    mutate,
  } = useSWR(
    `${chainId}:prophecyBalances/${p.prophecy.prophecyId}/${account.address}`,
    () =>
      getProphecyBalances({
        networkId: Number(chainId) as number,
        provider,
        owner: account.address as `0x${string}`, // todo, what when not connected?
        prophecy: p.prophecy,
      })
  )

  const [amount, setAmount] = useState<string>("")
  if (isLoading || balances === undefined) return <div>loading...</div>

  if (balances.essence === null) return <div>Bad token</div>

  const approve = async () => {
    const tx = await getContract({
      address: p.prophecy.essence,
      abi: erc20ABI,
      signerOrProvider: signer as Signer,
    }).approve(
      yellowPages[network.chain?.id as number].shrine,
      constants.MaxUint256
    )

    await tx.wait()
    setTimeout(() => mutate(), 3000)
  }

  const distill = async () => {
    const tx = await getContract({
      address: yellowPages[network.chain?.id as number].shrine,
      abi: MirageShrineABI,
      signerOrProvider: signer as Signer,
    }).distill(
      BigNumber.from(p.prophecy.prophecyId),
      ethers.utils.parseUnits(amount, p.prophecy.essenceDecimals as number)
    )
    await tx.wait()
    setTimeout(() => mutate(), 3000)
  }

  const valid =
    signer !== undefined &&
    amount !== "" &&
    Number.parseFloat(amount) !== 0 &&
    ethers.utils
      .parseUnits(amount, p.prophecy.essenceDecimals as number)
      .lte(balances.essence)

  const approveButtonMessage =
    signer === undefined
      ? "Connect Wallet"
      : balances.essence.eq(BigNumber.from(0))
      ? "No essence"
      : amount === ""
      ? "Type an amount"
      : !ethers.utils
          .parseUnits(amount, p.prophecy.essenceDecimals as number)
          .lte(balances.essence)
      ? "Not enough balance"
      : `Approve ${p.prophecy.essenceSymbol}`

  const distillButtonMessage =
    signer === undefined
      ? "Connect Wallet"
      : balances.essence.eq(BigNumber.from(0))
      ? "No essence"
      : amount === ""
      ? "Type an amount"
      : !ethers.utils
          .parseUnits(amount, p.prophecy.essenceDecimals as number)
          .lte(balances.essence)
      ? "Not enough balance"
      : "Distill"

  const needsAllowance =
    valid &&
    ethers.utils
      .parseUnits(amount, p.prophecy.essenceDecimals as number)
      .gt(balances.essenceAllowance as BigNumber)

  const handleAmountChange = (i: any) => {
    if (typeof i === "string" && /^[0-9]+\.?[0-9]*$/.test(i)) {
      setAmount(i)
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* Essence Display */}
      <div className="my-1 flex w-full flex-col rounded-2xl bg-orange-300 dark:bg-slate-700">
        <div className="flex flex-row items-center justify-between p-3">
          {/* Input */}
          <input
            className="w-2/3 bg-transparent text-4xl"
            value={amount}
            onChange={(e) => {
              handleAmountChange(e.target.value)
            }}
            placeholder="0"
          />
          {/* Essence Symbol */}
          <span className="rounded-2xl bg-orange-200 py-1 px-2 text-2xl font-bold dark:bg-slate-600">
            {p.prophecy.essenceSymbol}
          </span>
        </div>
        {/* Balance */}
        <div className="mb-1 flex flex-row">
          <div className="grow" />
          <div className="mr-3 mb-1 flex grow-0 flex-row">
            <span className="mx-1  text-sm">
              Balance:{" "}
              {fixAmount(
                balances.essence,
                p.prophecy.essenceDecimals as number
              )}
            </span>
            <button
              className={`text-sm ${
                balances.essence?.eq(BigNumber.from(0)) ||
                (amount !== "" &&
                  balances.essence?.eq(
                    parseUnits(amount, p.prophecy.essenceDecimals as number)
                  ))
                  ? "hidden"
                  : ""
              } text-blue-400`}
              onClick={() => {
                setAmount(
                  formatUnits(
                    (balances.essence as BigNumber).toString(),
                    p.prophecy.essenceDecimals as number
                  )
                )
              }}
            >
              Max
            </button>
          </div>
        </div>
      </div>
      {/* Fates Display */}
      <div className="my-1 flex w-full flex-row items-center justify-between">
        {/* Yes Display */}
        <div className="flex w-5/12 flex-col rounded-2xl bg-orange-300 dark:bg-slate-700">
          <div className="flex flex-row items-center justify-between p-3">
            {/* Input */}
            <input
              className="w-2/3 bg-transparent text-2xl"
              value={amount}
              onChange={(e) => {
                handleAmountChange(e.target.value)
              }}
              placeholder="0"
            />
            {/* Essence Symbol */}
            <span className="rounded-2xl bg-orange-200 py-1 px-2 text-lg font-bold dark:bg-slate-600">
              YES
            </span>
          </div>
          {/* Balance */}
          <div className="mb-1 flex flex-row">
            <div className="grow" />
            <div className="mr-3 mb-1 flex grow-0 flex-row">
              <span className="mx-1 text-sm">
                Balance:{" "}
                {fixAmount(balances.yes, p.prophecy.essenceDecimals as number)}
              </span>
            </div>
          </div>
        </div>
        {/* Distill Icon */}
        <ScienceRoundedIcon fontSize="large" />
        {/* No Display */}
        <div className="flex w-5/12 flex-col rounded-2xl bg-orange-300 dark:bg-slate-700">
          <div className="flex flex-row items-center justify-between p-3">
            {/* Input */}
            <input
              className="w-2/3 bg-transparent text-2xl"
              value={amount}
              onChange={(e) => {
                handleAmountChange(e.target.value)
              }}
              placeholder="0"
            />
            {/* Essence Symbol */}
            <span className="rounded-2xl bg-orange-200 py-1 px-2 text-lg font-bold dark:bg-slate-600">
              NO
            </span>
          </div>
          {/* Balance */}
          <div className="mb-1 flex flex-row">
            <div className="grow" />
            <div className="mr-3 mb-1 flex grow-0 flex-row">
              <span className="mx-1 text-sm">
                Balance:{" "}
                {fixAmount(balances.no, p.prophecy.essenceDecimals as number)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="mt-1 flex w-full">
        {needsAllowance ? (
          <button
            className={`h-12 w-full rounded-2xl bg-blue-300 p-1 text-lg dark:bg-blue-500 ${
              valid ? "" : "cursor-not-allowed"
            }`}
            disabled={!valid}
            onClick={() => {
              approve()
            }}
          >
            {approveButtonMessage}
          </button>
        ) : (
          <button
            className={`h-12 w-full rounded-2xl text-lg ${
              valid
                ? "bg-orange-300 dark:bg-blue-500"
                : "cursor-not-allowed bg-orange-100 opacity-60 dark:bg-slate-900"
            } p-1`}
            disabled={!valid}
            onClick={distill}
          >
            {distillButtonMessage}
          </button>
        )}
      </div>
    </div>
  )
}

const Blend: React.FC<{ prophecy: Prophecy }> = (p) => {
  const network = getNetwork()
  const { chainId } = useParams()
  const provider = getProvider()
  const { data: signer } = useSigner()
  const account = useAccount()
  const {
    data: balances,
    isLoading,
    mutate,
  } = useSWR(
    `${chainId}:prophecyBalances/${p.prophecy.prophecyId}/${account.address}`,
    () =>
      getProphecyBalances({
        networkId: Number(chainId) as number,
        provider,
        owner: account.address as `0x${string}`, // todo, what when not connected?
        prophecy: p.prophecy,
      })
  )

  const [amount, setAmount] = useState<string>("")
  if (isLoading || balances === undefined) return <div>loading...</div>

  if (balances.essence === null) return <div>Bad token</div>

  const blend = async () => {
    const tx = await getContract({
      address: yellowPages[network.chain?.id as number].shrine,
      abi: MirageShrineABI,
      signerOrProvider: signer as Signer,
    }).blend(
      BigNumber.from(p.prophecy.prophecyId),
      ethers.utils.parseUnits(amount, p.prophecy.essenceDecimals as number)
    )
    await tx.wait()
    setTimeout(() => mutate(), 3000)
  }

  const valid =
    signer !== undefined &&
    amount !== "" &&
    Number.parseFloat(amount) !== 0 &&
    ethers.utils
      .parseUnits(amount, p.prophecy.essenceDecimals as number)
      .lte(balances.yes) &&
    ethers.utils
      .parseUnits(amount, p.prophecy.essenceDecimals as number)
      .lte(balances.no)

  const blendButtonMessage =
    signer === undefined
      ? "Connect Wallet"
      : balances.yes.eq(BigNumber.from(0)) && balances.no.eq(BigNumber.from(0))
      ? "Lacking Fate"
      : balances.yes.eq(BigNumber.from(0))
      ? "Lack of YES Fate"
      : balances.no.eq(BigNumber.from(0))
      ? "Lack of NO Fate"
      : amount === ""
      ? "Type an amount"
      : ethers.utils
          .parseUnits(amount, p.prophecy.essenceDecimals as number)
          .gt(balances.yes) &&
        ethers.utils
          .parseUnits(amount, p.prophecy.essenceDecimals as number)
          .gt(balances.no)
      ? "Amount exceeds both Fates"
      : ethers.utils
          .parseUnits(amount, p.prophecy.essenceDecimals as number)
          .gt(balances.yes)
      ? "Not enough YES Fate"
      : ethers.utils
          .parseUnits(amount, p.prophecy.essenceDecimals as number)
          .gt(balances.no)
      ? "Not enough NO Fate"
      : "Blend"

  const handleAmountChange = (i: any) => {
    if (typeof i === "string" && /^[0-9]+\.?[0-9]*$/.test(i)) {
      setAmount(i)
    }
  }

  const lesserFateAmount = balances.yes.lt(balances.no)
    ? balances.yes
    : balances.no

  const amountIsLesserFate =
    formatUnits(lesserFateAmount, p.prophecy.essenceDecimals as number) ===
    amount

  const setMaxOfLesserFate = () => {
    setAmount(
      formatUnits(lesserFateAmount, p.prophecy.essenceDecimals as number)
    )
  }

  return (
    <div className="flex flex-col items-center">
      {/* Fates Display */}
      <div className="my-1 flex w-full flex-row items-center justify-between">
        {/* Yes Display */}
        <div className="flex w-5/12 flex-col rounded-2xl bg-orange-300 dark:bg-slate-700">
          <div className="flex flex-row items-center justify-between p-3">
            {/* Input */}
            <input
              className="w-2/3 bg-transparent text-2xl"
              value={amount}
              onChange={(e) => {
                handleAmountChange(e.target.value)
              }}
              placeholder="0"
            />
            {/* Essence Symbol */}
            <span className="rounded-2xl bg-orange-200 py-1 px-2 text-lg font-bold dark:bg-slate-600">
              YES
            </span>
          </div>
          {/* Balance */}
          <div className="mb-1 flex flex-row">
            <div className="grow" />
            <div className="mr-3 mb-1 flex grow-0 flex-row">
              <span className="mx-1 text-sm">
                Balance:{" "}
                {fixAmount(balances.yes, p.prophecy.essenceDecimals as number)}
              </span>
              <button
                className={`text-sm ${
                  lesserFateAmount.eq(BigNumber.from(0)) || amountIsLesserFate
                    ? "hidden"
                    : ""
                } text-blue-400`}
                onClick={() => {
                  setMaxOfLesserFate()
                }}
              >
                Max
              </button>
            </div>
          </div>
        </div>
        {/* Blend Icon */}
        <CycloneIcon fontSize="large" />
        {/* No Display */}
        <div className="flex w-5/12 flex-col rounded-2xl bg-orange-300 dark:bg-slate-700">
          <div className="flex flex-row items-center justify-between p-3">
            {/* Input */}
            <input
              className="w-2/3 bg-transparent text-2xl"
              value={amount}
              onChange={(e) => {
                handleAmountChange(e.target.value)
              }}
              placeholder="0"
            />
            {/* Essence Symbol */}
            <span className="rounded-2xl bg-orange-200 py-1 px-2 text-lg font-bold dark:bg-slate-600">
              NO
            </span>
          </div>
          {/* Balance */}
          <div className="mb-1 flex flex-row">
            <div className="grow" />
            <div className="mr-3 mb-1 flex grow-0 flex-row">
              <span className="mx-1 text-sm">
                Balance:{" "}
                {fixAmount(balances.no, p.prophecy.essenceDecimals as number)}
              </span>
              <button
                className={`text-sm ${
                  lesserFateAmount.eq(BigNumber.from(0)) || amountIsLesserFate
                    ? "hidden"
                    : ""
                } text-blue-400`}
                onClick={() => {
                  setMaxOfLesserFate()
                }}
              >
                Max
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Essence Display */}
      <div className="my-1 flex w-full flex-col rounded-2xl bg-orange-300 dark:bg-slate-700">
        <div className="flex flex-row items-center justify-between p-3">
          {/* Input */}
          <input
            className="w-2/3 bg-transparent text-4xl"
            value={amount}
            onChange={(e) => {
              handleAmountChange(e.target.value)
            }}
            placeholder="0"
          />
          {/* Essence Symbol */}
          <span className="rounded-2xl bg-orange-200 py-1 px-2 text-2xl font-bold dark:bg-slate-600">
            {p.prophecy.essenceSymbol}
          </span>
        </div>
        {/* Balance */}
        <div className="mb-1 flex flex-row">
          <div className="grow" />
          <div className="mr-3 mb-1 flex grow-0 flex-row">
            <span className="mx-1  text-sm">
              Balance:{" "}
              {fixAmount(
                balances.essence,
                p.prophecy.essenceDecimals as number
              )}
            </span>
          </div>
        </div>
      </div>
      {/* Button */}
      <div className="mt-1 flex w-full">
        <button
          className={`h-12 w-full rounded-2xl text-lg ${
            valid
              ? "bg-orange-300 dark:bg-blue-500"
              : "cursor-not-allowed bg-orange-100 opacity-60 dark:bg-slate-900"
          } p-1`}
          disabled={!valid}
          onClick={blend}
        >
          {blendButtonMessage}
        </button>
      </div>
    </div>
  )
}

const Ascend: React.FC<{
  name: string
  balance: BigNumber
  decimals: number
  essenceSymbol: string
  prophecyId: number
  mutate: () => void
}> = (p) => {
  const network = useNetwork()
  const amount = formatUnits(p.balance, p.decimals as number)
  const { data: signer } = useSigner()

  const ascend = async () => {
    const tx = await getContract({
      address: yellowPages[network.chain?.id as number].shrine,
      abi: MirageShrineABI,
      signerOrProvider: signer as Signer,
    }).ascend(BigNumber.from(p.prophecyId))
    await tx.wait()
    setTimeout(() => p.mutate(), 3000)
  }

  return (
    <div className="flex w-full flex-col items-center">
      {/* Fate */}
      <div className="my-1 flex w-full flex-col rounded-2xl bg-orange-300 dark:bg-slate-700">
        <div className="flex flex-row items-center justify-between p-3">
          <span className="text-3xl">{amount}</span>
          {/* Fate Symbol */}
          <span className="rounded-2xl bg-orange-200 py-1 px-2 text-2xl font-bold dark:bg-slate-600">
            {p.name}
          </span>
        </div>
      </div>
      {/* Arrow Icon */}
      <div className="relative m-[-18px] h-8 w-8 items-center rounded-lg border-2 border-slate-800 bg-slate-700">
        <div className="inline-flex h-full w-full items-center justify-center self-center">
          <ReactSVG src="../assets/down-arrow.svg" />
        </div>
      </div>

      {/* Essence */}
      <div className="mt-2 mb-1 flex w-full flex-col rounded-2xl bg-orange-300 dark:bg-slate-700">
        <div className="flex flex-row items-center justify-between p-3">
          <span className="text-3xl">{amount}</span>
          {/* Essence Symbol */}
          <span className="rounded-2xl bg-orange-200 py-1 px-2 text-2xl font-bold dark:bg-slate-600">
            {p.essenceSymbol}
          </span>
        </div>
      </div>

      <button
        className="mt-1 w-full rounded-2xl bg-slate-600 p-2"
        onClick={ascend}
      >
        Ascend
      </button>
    </div>
  )
}

const Alchemy: React.FC<{ prophecy: Prophecy }> = (p) => {
  const [alchemyMode, setAlchemyMode] = useState<"Distill" | "Blend">("Distill")
  const { chainId } = useParams()
  const provider = getProvider()
  const account = useAccount()
  const { data: balances, mutate } = useSWR(
    `${chainId}:prophecyBalances/${p.prophecy.prophecyId}/${account.address}`,
    () =>
      getProphecyBalances({
        networkId: Number(chainId) as number,
        provider,
        owner: account.address as `0x${string}`,
        prophecy: p.prophecy,
      })
  )

  if (p.prophecy.aura === Aura.Entranced) {
    return (
      <div className="m-2 flex w-96 flex-row items-center justify-center rounded-2xl bg-orange-200 p-2 dark:bg-slate-800">
        <HourglassEmptyIcon className="mr-2" />
        <p>
          Prophecy being resolved in{" "}
          <a
            href={`https://reality.eth.limo/app/#!/network/${chainId}/question/${
              yellowPages[Number(chainId) as number].reality
            }-${p.prophecy.inquiryId}`}
            target="_blank"
            className="rounded-2xl bg-orange-100 py-1 px-2 font-semibold opacity-80 hover:opacity-100 dark:bg-slate-700"
          >
            <img
              src="./assets/reality-icon.png"
              className="mb-1 inline h-5 w-5"
            />{" "}
            Reality
          </a>
        </p>
      </div>
    )
  } else if (p.prophecy.aura === Aura.Fulfilled) {
    return (
      <div className="m-2 flex w-96 flex-col items-center rounded-2xl bg-orange-200 p-2 dark:bg-slate-800">
        <div className="flex flex-row">
          <CheckIcon className="mr-2" />
          <span>The prophecy was fulfilled.</span>
        </div>
        {balances?.yes.gt(BigNumber.from(0)) && (
          <Ascend
            name="YES"
            balance={balances.yes}
            decimals={p.prophecy.essenceDecimals as number}
            essenceSymbol={p.prophecy.essenceSymbol as string}
            prophecyId={p.prophecy.prophecyId}
            mutate={mutate}
          />
        )}
      </div>
    )
  } else if (p.prophecy.aura === Aura.Mirage) {
    return (
      <div className="m-2 flex w-96 flex-col items-center rounded-2xl bg-orange-200 p-2 dark:bg-slate-800">
        <div className="flex flex-row">
          <CloseIcon className="mr-2" />
          <span>The prophecy was a mirage.</span>
        </div>

        {balances?.no.gt(BigNumber.from(0)) && (
          <Ascend
            name="NO"
            balance={balances.no}
            decimals={p.prophecy.essenceDecimals as number}
            essenceSymbol={p.prophecy.essenceSymbol as string}
            prophecyId={p.prophecy.prophecyId}
            mutate={mutate}
          />
        )}
      </div>
    )
  } else if (p.prophecy.aura === Aura.Blighted) {
    return (
      <div className="m-2 flex w-96 flex-row items-center justify-center rounded-2xl bg-orange-200 p-2 dark:bg-slate-800">
        <CoronavirusIcon className="mr-2" />
        <p>
          This prophecy predicted a forbidden future. Those who took part paid
          the price.
        </p>
      </div>
    )
  }

  return (
    <div className="my-3 w-full">
      <div
        className="flex flex-col justify-between rounded-3xl border-2 border-transparent
        bg-orange-200 p-2 dark:bg-slate-800"
      >
        <div className="mb-1 flex flex-row items-center justify-between">
          <span className="ml-2 text-xl">{alchemyMode}</span>
          <button
            className="flex flex-row items-center rounded-2xl bg-orange-300 p-2 text-xl dark:bg-slate-700"
            onClick={() => {
              if (alchemyMode === "Blend") {
                setAlchemyMode("Distill")
              } else {
                setAlchemyMode("Blend")
              }
            }}
          >
            <LoopRoundedIcon fontSize="medium" className="mr-1" />{" "}
            {alchemyMode === "Distill" ? "Blend" : "Distill"}
          </button>
        </div>

        <div className={`${alchemyMode === "Distill" ? "" : "hidden"}`}>
          <Distill prophecy={p.prophecy} />
        </div>
        <div className={`${alchemyMode === "Blend" ? "" : "hidden"}`}>
          <Blend prophecy={p.prophecy} />
        </div>
      </div>
    </div>
  )
}

const FateMarketView: React.FC<{
  trade: Trade
  name: string
  fateAddress: `0x${string}`
  essenceAddress: `0x${string}`
}> = (p) => {
  const { chainId } = useParams()
  const chainName = {
    1: "mainnet",
    5: "goerli",
    10: "optimism",
    137: "polygon",
    42161: "arbitrum",
  }[Number(chainId) as number] as string
  return (
    <div className="m-1 flex min-h-full w-full flex-col items-center rounded-2xl bg-orange-300 p-2 dark:bg-slate-900">
      {/* Essence Symbol */}
      <span className="mb-1 rounded-2xl bg-orange-200 py-1 px-2 text-lg font-bold dark:bg-slate-600">
        {p.name}
      </span>
      <div className="flex flex-col">
        {p.trade.buy !== null && (
          <a
            target="_blank"
            href={`https://app.uniswap.org/#/swap?inputCurrency=${p.essenceAddress}&outputCurrency=${p.fateAddress}&chain=${chainName}`}
            className="m-1 w-32 rounded-2xl border-2 border-transparent bg-orange-200 p-2 text-center opacity-70 hover:border-black hover:opacity-100 dark:bg-slate-700 dark:hover:border-white"
          >
            Buy{" "}
            <span className="font-bold text-green-900 dark:text-green-200">
              {p.trade.buy}
            </span>
          </a>
        )}
        {p.trade.sell !== null && (
          <a
            target="_blank"
            href={`https://app.uniswap.org/#/swap?inputCurrency=${p.fateAddress}&outputCurrency=${p.essenceAddress}&chain=${chainName}`}
            className="m-1 w-32 rounded-2xl border-2 border-transparent bg-orange-200 p-2 text-center opacity-70 hover:border-black hover:opacity-100 dark:bg-slate-700 dark:hover:border-white"
          >
            Sell{" "}
            <span className="font-bold text-red-700 dark:text-red-500">
              {p.trade.sell}
            </span>
          </a>
        )}
        <a
          target="_blank"
          href={`https://app.uniswap.org/#/add/${p.fateAddress}/${p.essenceAddress}/10000?minPrice=0.50663&maxPrice=0.50663&chain=${chainName}`}
          className="m-1 w-32 rounded-2xl border-2 border-transparent bg-pink-400 p-2 text-center
            opacity-70 hover:border-black hover:opacity-100 dark:bg-pink-700 dark:hover:border-white"
        >
          {`${
            p.trade.sell === null && p.trade.buy === null
              ? "Create a Pool"
              : "Add Liquidity"
          }`}
        </a>
      </div>
    </div>
  )
}

const Market: React.FC<{ prophecy: Prophecy }> = (p) => {
  const { chainId } = useParams()
  if (chainId === "100")
    return <div>Uniswap does not exist in Gnosis Chain.</div>
  return (
    <div className="flex w-96 flex-col items-center rounded-2xl bg-orange-200 p-3 dark:bg-slate-800">
      <div className="flex w-full flex-row">
        <span className="m-1 grow-0 text-xl">Marketplace</span>
        <div className="grow" />
      </div>
      <div className="flex w-full flex-row justify-between">
        <FateMarketView
          trade={p.prophecy.uniswapInfo.yes}
          name="YES"
          fateAddress={p.prophecy.yes}
          essenceAddress={p.prophecy.essence}
        />
        <FateMarketView
          trade={p.prophecy.uniswapInfo.no}
          name="NO"
          fateAddress={p.prophecy.no}
          essenceAddress={p.prophecy.essence}
        />
      </div>
    </div>
  )
}
const MatterInteraction: React.FC<{ prophecy: Prophecy }> = (p) => {
  if (p.prophecy.essenceDecimals === null) {
    return <div>This token is broken, this prophecy will be forgotten.</div>
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center p-1">
      <Alchemy prophecy={p.prophecy} />
      <Market prophecy={p.prophecy} />
    </div>
  )
}

export const ProphecyPage: React.FC = (p) => {
  const { prophecyId, chainId } = useParams()
  const id = Number(prophecyId as string)

  const { data: prophecies, isLoading } = useSWR(`${chainId}:prophecies`, () =>
    getAllProphecies({ networkId: Number(chainId) as number })
  )

  if (isLoading || prophecies === undefined) return <div>loading...</div>

  const prophecy = prophecies[id]

  if (prophecy === undefined) return <div>loading...</div>

  return (
    <div className="flex w-full flex-col items-center">
      <div className="scale-[0.75] md:scale-100">
        <ProphecyCore prophecy={prophecy} />
      </div>

      <MatterInteraction prophecy={prophecy} />
    </div>
  )
}
