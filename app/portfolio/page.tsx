"use client"

import { useState } from "react"
import "../globals.css"
import Keymanager from "@/components/keymanager/Keymanager"
import Sidebar from "@/components/sidebar/Sidebar"
import PortfolioHeader from "@/components/PortfolioHeader"
import PortfolioTable from "@/components/portfolioTable/PortfolioTable"

// Navbar Menu
import { useGlobalContext } from "@/GlobalContext/GlobalContext"
import TotalAssets from "@/components/totalAssets/TotalAssets"
import PortfolioTableMobile from "@/components/portfolioTable/PortfolioTableMobile"

export default function Portfolio() {
  const [selectedMenuItem, setSelectedMenuItem] = useState("Assets")

  const { darkTheme } = useGlobalContext()

  return (
    <div className="flex">
      <Sidebar
        selectedMenuItem={selectedMenuItem}
        setSelectedMenuItem={(e: any) => setSelectedMenuItem(e)}
      />

      {/* pc page */}
      <div
        className={`hidden lg:flex flex-col h-[100dvh] w-full ${darkTheme ? "bg-neutral-900" : "bg-neutral-50"}`}
      >
        <PortfolioHeader
          selectedMenuItem={selectedMenuItem}
          setSelectedMenuItem={(e: any) => setSelectedMenuItem(e)}
        ></PortfolioHeader>

        {selectedMenuItem === "Assets" && (
          <div
            className={`${darkTheme ? "bg-neutral-900" : "bg-neutral-50"} flex flex-col w-full px-[16px] pt-[16px]`}
            style={{ height: "calc(100dvh - 79px)" }}
          >
            {/* Total Assets Component */}
            <TotalAssets />

            {/* Asset Table Component */}
            <PortfolioTable />
          </div>
        )}

        {selectedMenuItem === "Keymanager" && (
          <div
            className={`${darkTheme ? "bg-neutral-900" : "bg-neutral-50"} flex flex-col w-full gap-[16px] px-[16px] pt-[16px]`}
            style={{ height: "calc(100dvh - 79px)" }}
          >
            {/* Keymanager Component */}
            <Keymanager />
          </div>
        )}
        {/* <main className="flex flex-col lg:flex-row w-full h-full sm:px-4 sm:py-6 lg:py-6 gap-8">
          <section className="flex flex-col gap-6 w-full h-full">
            {
              selectedMenuItem == "Assets" &&
              <Assets />
            }
            {
              selectedMenuItem == "Manager" &&
              <Keymanager />
            }
            {
              selectedMenuItem == "Transfer" &&
              <Transfer />
            }
            {
              selectedMenuItem == "Vault" &&
              <Vault />
            }
            {
              selectedMenuItem == "Session Keys" &&
              <Session />
            } 
          </section>
        </main> */}
      </div>

      {/* mobile page */}
      <div
        className={`flex lg:hidden flex-col h-[100dvh] items-center w-full ${darkTheme ? "bg-black" : "bg-neutral-50"} overflow-hidden`}
      >
        <PortfolioTableMobile></PortfolioTableMobile>
      </div>
    </div>
  )
}