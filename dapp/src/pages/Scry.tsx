import { Log } from "@ethersproject/abstract-provider"
import { getContract, getNetwork } from "@wagmi/core"
import { BigNumber, Signer } from "ethers"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  useProvider,
  useSigner,
} from "wagmi"
import { MirageShrineABI } from "../utils/abis"
import { randomRune } from "../utils/rune"
import { yellowPages } from "../utils/yellow-pages"

const isoStringToDate = (s: string): Date => {
  const [y, m, d] = s.split("-").map(Number)
  return new Date(y, m - 1, d)
}

const isoRegex = /^\d{4}-([0][1-9]|1[0-2])-([0-2][1-9]|[1-3]0|3[01])$/
const addressRegex = /^0x[a-fA-F0-9]{40}$/

const ScryForm: React.FC = () => {
  const network = getNetwork()
  const navigate = useNavigate()
  const provider = useProvider()
  const { data: signer } = useSigner()
  const [horizonField, setHorizonField] = useState<string>("")
  const [essence, setEssence] = useState<string>("")
  const [inquiry, setInquiry] = useState<string>("")
  const currentNetworkId = network.chain?.id as number

  const scry = async () => {
    if (signer === undefined) return
    const rune = randomRune()
    const horizon = Math.floor(isoStringToDate(horizonField).getTime() / 1000)
    const shrine = getContract({
      address: yellowPages[currentNetworkId].shrine,
      abi: MirageShrineABI,
      signerOrProvider: signer as Signer,
    })

    const tx = await shrine.scry(
      horizon,
      essence as `0x${string}`,
      rune as `0x${string}`,
      inquiry,
      { value: BigNumber.from(yellowPages[currentNetworkId].tribute) }
    )

    await tx.wait()

    // https://github.com/ethers-io/ethers.js/discussions/2895#discussioncomment-2563795
    const receipt = await provider.getTransactionReceipt(tx.hash)
    const scryLog = receipt.logs.find(
      (log) =>
        log.address === yellowPages[currentNetworkId].shrine &&
        log.topics[0] ===
          "0x56aae38b92d5fab163d450f2070ce3d8646dad1f4280ff03b18e47090f50f7f8"
    ) as Log
    const prophecyId = BigNumber.from(scryLog.data).toNumber()
    navigate(`/chain/${network.chain?.id}/prophecy/${prophecyId}`)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        scry()
      }}
      className="w-full max-w-sm"
    >
      <div className="flex flex-wrap">
        <div className="w-full">
          <label>Essence</label>
          <input
            placeholder="essence token"
            value={essence}
            onChange={(e) => setEssence(e.target.value)}
          />
        </div>
        <div className="w-full">
          <label>Inquiry</label>
          <textarea
            placeholder="inquiry"
            value={inquiry}
            onChange={(e) => setInquiry(e.target.value)}
          />
        </div>
        <div className="w-full">
          <label>Horizon</label>
          <input
            placeholder="horizon date"
            value={horizonField}
            onChange={(e) => setHorizonField(e.target.value)}
          />
        </div>
        <div className="w-full">
          <button type="submit">Scry</button>
        </div>
      </div>
    </form>
  )
}

export const ScryPage: React.FC = () => {
  const network = getNetwork()
  return (
    <div>
      <Link
        to={`/chain/${network.chain?.id}`}
        className="block w-full bg-green-300 py-2 px-4 text-center font-bold rounded hover:border hover:border-green-700"
      >
        Return
      </Link>
      <ScryForm />
    </div>
  )
}
