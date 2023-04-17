import { Log } from "@ethersproject/abstract-provider"
import { getContract, getNetwork } from "@wagmi/core"
import { BigNumber, Signer } from "ethers"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAccount, useBalance, useProvider, useSigner } from "wagmi"
import {
  CalendarFrame,
  fixAmount,
  Inquiry,
  OddsDisplay,
  TokenDisplay,
} from "../components/ProphecyCard"
import { MirageShrineABI } from "../utils/abis"
import { getTokenSymbol } from "../utils/get-balance"
import { randomRune } from "../utils/rune"
import {
  manualNativeTokens,
  validNet,
  yellowPages,
} from "../utils/yellow-pages"
import { AutoExpandingTextarea } from "./Auto"
import useSWR from "swr"

type Setter = React.Dispatch<React.SetStateAction<string>>

const NewScryForm: React.FC<{
  year: string
  month: string
  day: string
  setYear: Setter
  setMonth: Setter
  setDay: Setter
  inquiry: string
  setInquiry: Setter
}> = (p) => {
  const { chainId } = useParams()
  const { data: symbol } = useSWR(
    `${chainId}:symbol/${
      yellowPages[Number(chainId) as number].defaultEssence
    }`,
    () =>
      getTokenSymbol({
        //provider,
        networkId: Number(chainId),
        token: yellowPages[Number(chainId) as number]
          .defaultEssence as `0x${string}`,
      })
  )
  return (
    <div className="flex flex-col rounded-2xl bg-orange-200 dark:bg-slate-800">
      <div className="p-4">
        <div className="">Create a Prophecy</div>
        <div className="flex flex-row justify-evenly">
          <div className="w-56 py-3">
            <div className="py-1">Horizon</div>
            {/* <div className="text-xs">Time of resolution</div> */}
            <div className="">
              <div className="flex w-44 flex-row justify-between">
                <div className="flex flex-col items-center">
                  <input
                    className="w-20 rounded-xl bg-orange-100 py-1 text-center text-2xl font-bold dark:bg-slate-600"
                    value={p.year}
                    onChange={(e) => {
                      const s = e.target.value
                      if (
                        s === "" ||
                        (s.length <= 4 && !s.includes(".") && !isNaN(Number(s)))
                      )
                        p.setYear(e.target.value)
                    }}
                  />
                  <span className="text-sm opacity-50">yyyy</span>
                </div>
                <div className="flex flex-col items-center">
                  <input
                    className="w-10 rounded-xl bg-orange-100 py-1 text-center text-2xl font-bold dark:bg-slate-600"
                    value={p.month}
                    onChange={(e) => {
                      const s = e.target.value
                      if (
                        s === "" ||
                        (s.length <= 2 && !s.includes(".") && !isNaN(Number(s)))
                      )
                        p.setMonth(e.target.value)
                    }}
                  />

                  <span className="text-sm opacity-50">mm</span>
                </div>
                <div className="flex flex-col items-center">
                  <input
                    className="w-10 rounded-xl bg-orange-100 py-1 text-center text-2xl font-bold dark:bg-slate-600"
                    value={p.day}
                    onChange={(e) => {
                      const s = e.target.value
                      if (
                        s === "" ||
                        (s.length <= 2 && !s.includes(".") && !isNaN(Number(s)))
                      )
                        p.setDay(e.target.value)
                    }}
                  />
                  <span className="text-sm opacity-50">dd</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-32 flex-col items-center py-3">
            <div className="py-1">Essence</div>
            {/* <div className="text-xs">Underlying redeemption</div> */}
            <div className="flex w-20 items-center justify-evenly rounded-2xl bg-white p-1 dark:bg-black">
              <span className="text-base font-bold ">{symbol || "..."}</span>
            </div>
          </div>
        </div>
        <div className="py-2">
          <div className="py-2">Inquiry</div>
          <AutoExpandingTextarea
            className="w-full rounded-xl bg-orange-100 p-3 text-base dark:bg-slate-700"
            value={p.inquiry}
            onChange={(value) => {
              p.setInquiry(value)
            }}
          />
        </div>
      </div>
    </div>
  )
}

const ProphecyPreview: React.FC<{
  horizon: Date
  inquiry: string
}> = (p) => {
  return (
    <div className="w-fit">
      <div
        className="flex justify-between rounded-3xl border-2 border-transparent
    bg-orange-200 p-3 dark:bg-slate-800"
      >
        <div className="mx-1 flex w-20 flex-row items-center justify-between">
          <CalendarFrame horizon={p.horizon} />
        </div>
        <Inquiry inquiry={p.inquiry} short={true} />
        <div className="flex flex-col justify-evenly">
          <TokenDisplay
            decimals={18}
            supply={BigNumber.from("1000000000000000000")}
            symbol={"WETH"}
            small
          />
          <OddsDisplay
            uniswapInfo={{
              yes: { buy: null, sell: null },
              no: { buy: null, sell: null },
            }}
            small
          />
        </div>
      </div>
    </div>
  )
}

export const ScryPage: React.FC = () => {
  const network = getNetwork()
  const provider = useProvider()
  const navigate = useNavigate()

  const [year, setYear] = useState<string>("2024")
  const [month, setMonth] = useState<string>("08")
  const [day, setDay] = useState<string>("12")
  const [loadedLocalStorage, setLoadedLocalStorage] = useState<boolean>(false)
  const { data: signer } = useSigner()
  const { address } = useAccount()
  const { data: signerBalance } = useBalance({
    address: address,
  })
  const { chainId } = useParams()

  // In this first version, no way to choose Essence.
  // This speeds up development.
  const essence = yellowPages[Number(chainId) as number].defaultEssence
  const [inquiry, setInquiry] = useState<string>("")
  const horizon = new Date(Number(year), Number(month) - 1, Number(day))

  const scry = async () => {
    if (signer === undefined) return
    const rune = randomRune()
    const shrine = getContract({
      address: yellowPages[network.chain?.id as number].shrine,
      abi: MirageShrineABI,
      signerOrProvider: signer as Signer,
    })

    const tx = await shrine.scry(
      horizon.getTime() / 1000,
      essence as `0x${string}`,
      rune as `0x${string}`,
      inquiry,
      {
        value: BigNumber.from(yellowPages[network.chain?.id as number].tribute),
      }
    )

    await tx.wait()

    // https://github.com/ethers-io/ethers.js/discussions/2895#discussioncomment-2563795
    const receipt = await provider.getTransactionReceipt(tx.hash)
    const scryLog = receipt.logs.find(
      (log) =>
        log.address === yellowPages[network.chain?.id as number].shrine &&
        log.topics[0] ===
          "0x56aae38b92d5fab163d450f2070ce3d8646dad1f4280ff03b18e47090f50f7f8"
    ) as Log
    const prophecyId = BigNumber.from(scryLog.topics[1]).toNumber()
    navigate(`/chain/${network.chain?.id}/prophecy/${prophecyId}`)
  }

  useEffect(() => {
    if (localStorage.scryForm) {
      const form = JSON.parse(localStorage.scryForm)
      setYear(form.year)
      setMonth(form.month)
      setDay(form.day)
      setInquiry(form.inquiry)
    }
    setLoadedLocalStorage(true)
  }, [])

  if (loadedLocalStorage)
    localStorage.scryForm = JSON.stringify({ year, month, day, inquiry })

  // inquiry is empty
  const disabledScry =
    signer === undefined ||
    signerBalance === undefined || // if not enough funds to pay tribute
    signerBalance.value.lte(
      BigNumber.from(yellowPages[network.chain?.id as number].tribute)
    ) ||
    inquiry === "" ||
    new Date() >= horizon // date is in the past

  const buttonMessage =
    signer === undefined
      ? "Connect Wallet"
      : signerBalance === undefined || // if not enough funds to pay tribute
        signerBalance.value.lte(
          BigNumber.from(yellowPages[network.chain?.id as number].tribute)
        )
      ? "Not enough funds to pay tribute"
      : inquiry === ""
      ? "Write your inquiry"
      : new Date() >= horizon
      ? "Date must be in the future"
      : "Scry"

  return (
    <div className="flex flex-col items-center">
      <NewScryForm
        year={year}
        month={month}
        day={day}
        setYear={setYear}
        setMonth={setMonth}
        setDay={setDay}
        inquiry={inquiry}
        setInquiry={setInquiry}
      />
      <div className="flex flex-col items-center py-4">
        <div className="py-2">Preview</div>
        <ProphecyPreview horizon={horizon} inquiry={inquiry} />
      </div>
      <div className="flex flex-col rounded-3xl bg-orange-300 p-5 dark:bg-slate-800">
        {/* One must apologize for the following logical entanglement */}
        <button
          onClick={() => {
            scry()
          }}
          className={`${
            disabledScry ? "cursor-not-allowed" : "cursor-pointer"
          } w-80 border-2 border-transparent ${
            disabledScry
              ? "hover:border-red-500"
              : "hover:border-black dark:hover:border-white"
          } rounded-2xl ${
            disabledScry ? "bg-red-300" : "bg-orange-400"
          } p-1 text-xl  ${
            disabledScry ? "dark:bg-red-800" : "dark:bg-blue-600"
          }
          ${disabledScry ? "opacity-60" : ""}`}
          disabled={disabledScry}
        >
          {buttonMessage}
        </button>
        <p
          className={`mt-1 text-sm 
          ${disabledScry ? "opacity-60" : ""}`}
        >
          You will tribute{" "}
          <b>
            {fixAmount(
              BigNumber.from(yellowPages[Number(chainId) as number].tribute),
              18
            )}{" "}
            {manualNativeTokens[Number(chainId) as validNet]}
          </b>{" "}
          to the Mirage Shrine.
        </p>
      </div>
    </div>
  )
}
