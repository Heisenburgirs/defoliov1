import React, { useEffect, useState } from "react"
import { useGlobalContext } from "@/GlobalContext/GlobalContext"
import Tooltip from "../tooltip/Tooltip"

const TotalAssets: React.FC = () => {
  const { darkTheme } = useGlobalContext()

  return (
    <div
      className={`${darkTheme ? "bg-background-darktheme" : "bg-neutral-0"} shadow-bottom-200 w-full h-full flex flex-col rounded-t-50 p-[16px] gap-[24px]`}
    >
      <div className="flex-[0.3] flex-col pl-[8px] pt-[8px]">
        <Tooltip text="Total assets" position="top">
          <h2
            className={`${darkTheme ? "text-neutral-0" : "text-neutral-700"} w-full text-base leading-base`}
          >
            Total assets
          </h2>
        </Tooltip>
        <div className="flex items-end gap-[12px]">
          <h1
            className={`${darkTheme ? "text-neutral-0" : "text-neutral-700"}  text-header font-semibold leading-header`}
          >
            $700,272.54
          </h1>
          {/* TODO: Portfolu value increase/decrease based on historical portoflio value
            <h3 className={"text-base text-positive-275 leading-header"}>+24%</h3>
          */}
        </div>
      </div>

      <div
        className={`${darkTheme ? "bg-neutral-900 text-neutral-0" : "bg-neutral-50 text-neutral-700 "} flex-[0.7] rounded-50 flex w-full h-full justify-center items-center`}
      >
        Historical Portfolio Value (TBA)
      </div>
    </div>
  )
}

export default TotalAssets
