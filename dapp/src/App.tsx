import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useEffect } from "react"
import {
  createHashRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useNavigate,
} from "react-router-dom"
import { useNetwork, useProvider } from "wagmi"
import { Home } from "./pages/Home"
import { ProphecyPage } from "./pages/ProphecyDetail"
import { ScryPage } from "./pages/Scry"

const Wrap: React.FC<{ children: JSX.Element }> = (p) => {
  return (
    <div>
      <ConnectButton />
      {p.children}
    </div>
  )
}

const Redirect: React.FC = () => {
  const navigate = useNavigate()
  const network = useNetwork()

  useEffect(() => {
    navigate(`/chain/${network.chain?.id}`)
  }, [network.chain?.id])

  return null
}

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route path="chain">
        <Route path=":chainId">
          <Route path="prophecy">
            <Route path=":prophecyId" element={<ProphecyPage />} />
          </Route>
          <Route path="scry" element={<ScryPage />} />
          <Route path="" element={<Home />} />
        </Route>
      </Route>
      <Route path="" element={<Redirect />} />
    </Route>
  )
)

const ConnectedApp = () => {
  const network = useNetwork()
  const provider = useProvider()

  if (network.chain === undefined) {
    return <div>Please connect first</div>
  }

  return <RouterProvider router={router} />
}

const App = () => {
  return (
    <Wrap>
      <ConnectedApp />
    </Wrap>
  )
}

export default App
