import React, { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import image from "@/public/tempImages/image.png"
import smallChartImg from "@/public/images/smallChart.png"
import smallChartWhiteImg from "@/public/images/smallChartWhite.png"
import { useGlobalContext } from "@/GlobalContext/GlobalContext"
import PortfolioRightSidebar from "./PortfolioRightSidebar"
import PortfolioAssets from "./assets/PortfolioAssets"
import PortfolioQueue from "./queue/PortfolioQueue"
import PortfolioNfts from "./nfts/PortfolioNfts"

function PortfolioTable() {
  const { darkTheme } = useGlobalContext()
  const [selectedTab, setSelectedTab] = useState("Tokens")

  return (
    <div
      className={`min-h-[70%] w-full flex
     flex-col ${darkTheme ? "bg-background-darktheme" : "bg-neutral-0"}`}
    >
      <div
        className={`flex w-full gap-[32px] h-[47px] ${darkTheme ? "bg-background-darktheme text-neutral-125" : "text-neutral-625"} px-[16px] pt-[16px]`}
      >
        <div
          className={`cursor-pointer pb-[8px] w-[80px] text-center text-base
          ${darkTheme ? selectedTab === "Tokens" ? "text-primary-400 font-semibold border-b-2 border-solid border-primary-400" : "text-neutral-200 font-regular" : selectedTab === "Tokens" ? "text-primary-500 font-semibold border-b-2 border-solid border-primary-500" : "text-neutral-400 font-regular" } `}
          onClick={() => {
            setSelectedTab("Tokens")
          }}
        >
          Tokens
        </div>
        <div
          className={`cursor-pointer pb-[8px] w-[80px] text-center text-base
          ${darkTheme ? selectedTab === "Nfts" ? "text-primary-400 font-semibold border-b-2 border-solid border-primary-400" : "text-neutral-200 font-regular" : selectedTab === "Nfts" ? "text-primary-500 font-semibold border-b-2 border-solid border-primary-500" : "text-neutral-400 font-regular" } `}
          onClick={() => {
            setSelectedTab("Nfts")
          }}
        >
          NFTs
        </div>
        <div
          className={`cursor-pointer text-base
          ${darkTheme ? selectedTab === "Queue" ? "text-primary-400 font-semibold border-b-2 border-solid border-primary-400" : "text-neutral-200 font-regular" : selectedTab === "Queue" ? "text-primary-500 font-semibold border-b-2 border-solid border-primary-500" : "text-neutral-400 font-regular" } `}
          onClick={() => {
            setSelectedTab("Queue")
          }}
        >
          Queue
        </div>
        <div className={`cursor-pointer pb-[8px] w-[80px] text-center text-base
          ${darkTheme ? selectedTab === "History" ? "text-primary-400 font-semibold border-b-2 border-solid border-primary-400" : "text-neutral-200 font-regular" : selectedTab === "History" ? "text-primary-500 font-semibold border-b-2 border-solid border-primary-500" : "text-neutral-400 font-regular" } `}
          >History</div>
      </div>

      <div className="overflow-auto">
        {selectedTab === "Tokens" && <PortfolioAssets></PortfolioAssets>}
        {selectedTab === "Nfts" && <PortfolioNfts></PortfolioNfts>}
        {selectedTab === "Queue" && <PortfolioQueue></PortfolioQueue>}
      </div>
    </div>
  )
}

export default PortfolioTable