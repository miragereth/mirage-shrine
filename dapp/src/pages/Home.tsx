import useSWR from "swr"
import { ProphecyCard } from "../components/ProphecyCard"
import { getAllProphecies } from "../utils/get-prophecy"
import { useParams } from "react-router-dom"

const ProphecyList: React.FC = () => {
  const { chainId } = useParams()
  const {
    data: prophecies,
    isLoading,
    error,
  } = useSWR(`${chainId}:prophecies`, () =>
    getAllProphecies({
      networkId: Number(chainId) as number,
    })
  )
  if (error) return <div>There was an issue</div>
  if (isLoading || prophecies === undefined) return <div>Loading...</div>

  return (
    <div className="grid grid-flow-row grid-cols-1 gap-3 lg:grid-cols-2">
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
