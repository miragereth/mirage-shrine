import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useContext, useEffect, useState } from "react"
import {
  createHashRouter,
  createRoutesFromElements,
  NavLink,
  Route,
  RouterProvider,
  useNavigate,
  Outlet,
  useParams,
} from "react-router-dom"
import { useNetwork, useProvider } from "wagmi"
import { Home } from "./pages/Home"
import { ProphecyPage } from "./pages/ProphecyDetail"
import { ScryPage } from "./pages/Scry"
import { ReactSVG } from "react-svg"
import { DarkModeContext } from "./utils/dark-mode-refresher"
import Brightness5Icon from "@mui/icons-material/Brightness5"
import DarkModeIcon from "@mui/icons-material/DarkMode"

const Navbar: React.FC = (p) => {
  const { chainId } = useParams()
  const [darkMode, setDarkMode] = useState<boolean>()
  const refresher = useContext(DarkModeContext)

  const darkModeRefresh = () => {
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    if (localStorage.theme === "dark" || localStorage.theme !== "light") {
      document.documentElement.classList.add("dark")
      localStorage.theme = "dark"
      setDarkMode(true)
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.theme = "light"
      setDarkMode(false)
    }
  }

  const darkModeToggle = () => {
    if (localStorage.theme === "dark") {
      localStorage.theme = "light"
    } else {
      localStorage.theme = "dark"
    }
    darkModeRefresh()
    refresher({})
  }

  useEffect(() => {
    darkModeRefresh()
  }, [])

  return (
    // Navbar
    <div className="fixed z-50 flex w-full flex-row items-center justify-between bg-orange-100 bg-opacity-80 p-5 dark:bg-slate-700 dark:bg-opacity-80">
      <div className="flex flex-row items-center">
        <ReactSVG
          className="hover:animation-linear hover:animation-continue mr-5 h-8 w-8 hover:animate-spin"
          src="../assets/yy.svg"
        />
        <nav className="flex flex-row items-center">
          <NavLink
            className={({ isActive }) =>
              `w-32 py-1 px-4 font-bold ${isActive ? "" : "opacity-60"}`
            }
            to={`chain/${chainId}`}
            end
          >
            Prophecies
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `py-1 px-4 font-bold ${isActive ? "" : "opacity-60"}`
            }
            to={`chain/${chainId}/scry`}
          >
            Scry
          </NavLink>
        </nav>
      </div>
      <div className="flex flex-row items-center">
        <button
          onClick={() => {
            darkModeToggle()
          }}
          className="px-4 py-1"
        >
          {darkMode ? <Brightness5Icon /> : <DarkModeIcon />}
        </button>
        <div className="hidden sm:block">
          <ConnectButton />
        </div>
      </div>
    </div>
  )
}

// https://reactrouter.com/en/6.9.0/components/outlet
const Layout: React.FC = (p) => {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center pt-24">
        <Outlet />
      </div>
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
    <Route path="/" element={<Layout />}>
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

const App: React.FC = () => {
  return <RouterProvider router={router} />
}

export default App
