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
import { useNetwork } from "wagmi"
import { Home } from "./pages/Home"
import { ProphecyPage } from "./pages/ProphecyDetail"
import { ScryPage } from "./pages/Scry"
import { ReactSVG } from "react-svg"
import { DarkModeContext } from "./utils/dark-mode-refresher"
import LightModeIcon from "@mui/icons-material/LightMode"
import DarkModeIcon from "@mui/icons-material/DarkMode"
import GitHubIcon from "@mui/icons-material/GitHub"
import TwitterIcon from "@mui/icons-material/Twitter"
import HelpIcon from "@mui/icons-material/Help"

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
          className="hover:animation-linear hover:animation-continue mr-2 h-8 w-8 hover:animate-spin"
          src="../assets/yy.svg"
        />
        <nav className="flex flex-row items-center">
          <NavLink
            className={({ isActive }) =>
              `w-28 py-1 px-4 font-bold ${isActive ? "" : "opacity-60"}`
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
        <div className="mr-2 flex flex-row items-center">
          <a
            href="https://github.com/miragereth/mirage-shrine/blob/master/HELP.md"
            target="_blank"
            className="mr-1"
          >
            <HelpIcon />
          </a>
          <a
            href="https://github.com/miragereth/mirage-shrine"
            target="_blank"
            className="mr-1"
          >
            <GitHubIcon />
          </a>
          <a
            href="https://twitter.com/miragereth"
            target="_blank"
            className="mr-1"
          >
            <TwitterIcon />
          </a>
          <a href="https://discord.gg/4mRTZKMH9s" target="_blank">
            <ReactSVG
              className="mt-1 h-6 w-6 fill-black dark:fill-white"
              src="../assets/discord-icon.svg"
            />
          </a>
        </div>
        <button
          onClick={() => {
            darkModeToggle()
          }}
          className="px-2 py-1"
        >
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
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
