import React, { useEffect, useState } from "react"
import Image from "next/image"
import { useAssets } from "@/GlobalContext/AssetsContext/AssetsContext"
import { useGlobalContext } from "@/GlobalContext/GlobalContext"
import closeGrey from "@/public/images/closeGrey.png"
import closeWhite from "@/public/images/closeWhite.png"

const PortfolioRightSidebar = ({ sidebarOpen, asset, removeSelectedAsset }: any) => {
  const { darkTheme } = useGlobalContext()
  const [sidebarWidth, setSidebarWidth] = useState("w-[0px]")

  useEffect(() => {
    if (sidebarOpen) setSidebarWidth("w-[320px]")
    else setSidebarWidth("w-[0px]")
  }, [sidebarOpen])

  return (
    <div
      className={`fixed top-0 right-0 h-full border-l border-solid
     sidebar ${sidebarWidth} ${darkTheme ? "bg-background-darktheme border-neutral-625" : "bg-white border-neutral-250"} sidebar z-50`}
    >
      <div className="flex flex-col p-[16px] w-full h-full gap-[18px]">
        <div className="flex w-full justify-between items-center">
          <div className="flex gap-[16px] items-center">
            <img src={asset?.image || ""} className="h-[28px] w-[28px]"></img>
            <span
              className={`font-semibold text-large uppercase ${darkTheme ? "text-white" : "text-neutral-875"}`}
            >
              {asset?.name || ""}
            </span>
          </div>
          <img
            src={darkTheme ? closeWhite.src : closeGrey.src}
            className="h-[32px] w-[32px] cursor-pointer"
            onClick={() => {
              setSidebarWidth("0px")
              removeSelectedAsset()
            }}
          ></img>
        </div>
        <div className="flex w-full flex-col gap-[6px]">
          <span className={`text-base ${darkTheme ? "text-neutral-125" : "text-neutral-625"}`}>
            {asset?.ticker?.toUpperCase() || ""} balance
          </span>
          <span
            className={`text-header font-semibold ${darkTheme ? "text-white" : "text-neutral-875"}`}
          >
            506.9524
          </span>
        </div>
        {sidebarOpen && (
          <div className="flex w-full gap-[10px] justify-between">
            <div className="h-[40px] cursor-pointer justify-center items-center flex bg-primary-500 rounded-50 w-full">
              <span className={`font-semibold ${darkTheme ? "text-neutral-875" : "text-white"}`}>
                Send
              </span>
            </div>
            <div
              className={`h-[40px] cursor-pointer rounded-50 border border-solid justify-center
           ${darkTheme ? "border-neutral-625" : "border-neutral-250"} items-center flex w-full`}
            >
              <span className={`font-semibold ${darkTheme ? "text-white" : "text-neutral-875"}`}>
                Send
              </span>
            </div>
            <div
              className={`h-[40px] cursor-pointer rounded-50 border border-solid justify-center
           ${darkTheme ? "border-neutral-625" : "border-neutral-250"} items-center flex w-full`}
            >
              <span className={`font-semibold ${darkTheme ? "text-white" : "text-neutral-875"}`}>
                Swap
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PortfolioRightSidebar
