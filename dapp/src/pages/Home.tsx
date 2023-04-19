import useSWR from "swr"
import { ProphecyCard } from "../components/ProphecyCard"
import { getAllProphecies } from "../utils/get-prophecy"
import { useParams } from "react-router-dom"
import { CircularProgress } from "@mui/material"

export const Home: React.FC = () => {
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
  if (isLoading || prophecies === undefined) return <CircularProgress />

  return (
    <div className="grid grid-flow-row grid-cols-1 gap-1 md:grid-cols-2 md:gap-2 lg:gap-x-12 lg:gap-y-4 xl:grid-cols-3">
      {prophecies.map((prophecy) => (
        <ProphecyCard key={prophecy.inquiryId} prophecy={prophecy} />
      ))}
    </div>
  )
}
