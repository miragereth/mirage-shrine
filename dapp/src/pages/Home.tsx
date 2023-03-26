import { getNetwork, getProvider } from "@wagmi/core"
import useSWR from "swr"
import { ProphecyCard } from "../components/ProphecyCard"
import { getAllProphecies } from "../utils/get-prophecy"

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 grid-flow-row">
      {prophecies.map((prophecy) => (
        <ProphecyCard key={prophecy.inquiryId} prophecy={prophecy} />
      ))}
      {prophecies.map((prophecy) => (
        <ProphecyCard key={prophecy.inquiryId} prophecy={prophecy} />
      ))}
      {prophecies.map((prophecy) => (
        <ProphecyCard key={prophecy.inquiryId} prophecy={prophecy} />
      ))}
      {prophecies.map((prophecy) => (
        <ProphecyCard key={prophecy.inquiryId} prophecy={prophecy} />
      ))}
      {prophecies.map((prophecy) => (
        <ProphecyCard key={prophecy.inquiryId} prophecy={prophecy} />
      ))}
    </div>
  )
}

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <ProphecyList />
    </div>
  )
}
