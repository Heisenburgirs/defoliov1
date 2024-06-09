import React, { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import smallChartImg from "@/public/images/smallChart.png"
import smallChartWhiteImg from "@/public/images/smallChartWhite.png"
import { useGlobalContext } from "@/GlobalContext/GlobalContext"
import PortfolioRightSidebar from "../PortfolioRightSidebar"
import assets from "@/app/utils/tempAssets"

function PortfolioAssets() {
  const [selectedAssetIndex, setSelectedAssetIndex] = useState(-1)
  const [selectedAsset, setSelectedAsset] = useState<any>(null)
  const { darkTheme } = useGlobalContext()

  const getBgColor = (repartition: number) => {
    if (darkTheme && repartition > 50) {
      return "bg-primary-500"
    }
    if (darkTheme && repartition >= 25 && repartition < 51) {
      return "bg-white"
    }
    if (darkTheme && repartition < 25) {
      return "bg-neutral-250"
    }
    if (!darkTheme && repartition > 50) {
      return "bg-primary-500"
    }
    if (!darkTheme && repartition >= 25 && repartition < 51) {
      return "bg-neutral-875"
    }
    if (!darkTheme && repartition < 25) {
      return "bg-neutral-500"
    }
  }

  const getBorderStyle = (asset: any, index: number) => {
    if (selectedAsset && asset) {
      if (selectedAsset.ticker === asset.ticker) {
        if (darkTheme) {
          return "rounded-50 bg-neutral-600"
        }
        return "rounded-50 bg-neutral-50"
      }
    }
    if (darkTheme) {
      if (index >= 0 && selectedAssetIndex !== index) {
        return "border-background-600"
      }
      if (selectedAssetIndex > -1 && selectedAssetIndex === index) {
        return "rounded-50 bg-neutral-600"
      }
    } else {
      if (index >= 0 && selectedAssetIndex !== index) {
        return "transition-all border-neutral-0"
      }
      if (selectedAssetIndex > -1 && selectedAssetIndex === index) {
        return "transition-all rounded-50 bg-neutral-50"
      }
    }
  }

  return (
    <div className={`overflow-auto w-full ${darkTheme ? 'bg-background-darktheme border-neutral-600' : 'border-neutral-100'} border-t border-solid`}>
      <div className="flex flex-col px-[16px]">
        <div className="flex w-full px-[8px] py-[20px]">
          <div
            className={`flex-1 text-left text-xsmall ${darkTheme ? 'text-neutral-200' : 'text-neutral-400'} 
                font-semibold  tracking-wider`}>
            {/* todo number of assets */}
            Assets (8)
          </div>
          <div
            className={`flex-1 text-left text-xsmall ${darkTheme ? 'text-neutral-200' : 'text-neutral-400'} 
                font-semibold  tracking-wider`}>
            Value
          </div>
          <div
            className={`flex-1 text-left text-xsmall ${darkTheme ? 'text-neutral-200' : 'text-neutral-400'} 
                font-semibold  tracking-wider`}>
            Repartition
          </div>
          <div
            className={`flex-1 text-end text-xsmall ${darkTheme ? 'text-neutral-200' : 'text-neutral-400'} 
                font-semibold  tracking-wider`}>
            Total
          </div>
          <div
            className={`flex-1 text-end text-xsmall ${darkTheme ? 'text-neutral-200' : 'text-neutral-400'} 
                font-semibold  tracking-wider`}>
            Value
          </div>
        </div>
        {assets.map((asset, index) => {
          return (
            <div
              key={index}
              onClick={() => {
                selectedAsset && selectedAsset.ticker === asset.ticker
                  ? setSelectedAsset(null)
                  : setSelectedAsset(asset)
              }}
              onMouseEnter={() => setSelectedAssetIndex(index)}
              onMouseLeave={() => setSelectedAssetIndex(-1)}
              className={`flex w-full h-[56px] cursor-pointer px-[8px] ${getBorderStyle(asset, index)}`}
            >
              <div className="flex-1 flex gap-[16px] items-center">
                <img src={asset.image.src || ""} className="h-[24px] w-[24px]"></img>
                <div className="flex gap-[8px] items-center">
                  <span
                    className={`font-semibold text-large  ${darkTheme ? "text-neutral-0" : "text-neutral-700"}`}
                  >
                    {asset.name}
                  </span>
                  <span className={`${darkTheme ? "text-neutral-200" : "text-neutral-400"} uppercase`}>{asset.ticker}</span>
                </div>
              </div>
              <div className="flex flex-1 gap-[4px] items-center">
                {darkTheme ? (
                  <img src={smallChartWhiteImg.src} className="h-[14px] w-[14px]"></img>
                ) : (
                  <img src={smallChartImg.src} className="h-[14px] w-[14px]"></img>
                )}
                <span
                  className={`text-large  ${darkTheme ? "text-white" : "text-neutral-875"}`}
                >
                  ${asset.value || 0}
                </span>
              </div>
              <div className="flex-1 flex gap-[8px] items-center">
                <span
                  className={`text-large  ${darkTheme ? "text-white" : "text-neutral-875"}`}
                >
                  {asset.repartition || 0}%
                </span>
                <div
                  className={`w-[130px] h-[6px] ${darkTheme ? "bg-neutral-625" : "bg-neutral-125"} rounded-50`}
                >
                  <div
                    style={{ width: `${asset.repartition || 0}%` }}
                    className={`h-full
                           ${getBgColor(asset.repartition || 0)} rounded-50`}
                  ></div>
                </div>
              </div>
              <div
                className="flex flex-1 whitespace-nowrap justify-end items-center"
                style={{ border: 0 }}
              >
                <span
                  className={`text-large  ${darkTheme ? "text-white" : "text-neutral-875"}`}
                >
                  {asset.total || 0} LYX
                </span>
              </div>
              <div
                className="flex flex-1 whitespace-nowrap justify-end items-center"
                style={{ border: 0 }}
              >
                <span
                  className={`text-large  ${darkTheme ? "text-white" : "text-neutral-875"}`}
                >
                  ${asset.valueUsd || 0}
                </span>
              </div>
            </div>
          )
        })}
      </div>
      {selectedAsset && (
        <PortfolioRightSidebar
          sidebarOpen={selectedAsset !== null}
          asset={selectedAsset}
          removeSelectedAsset={() => {
            setSelectedAsset(null)
          }}
        ></PortfolioRightSidebar>
      )}
    </div>
  )
}

export default PortfolioAssets
