import React, { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import image from "@/public/tempImages/image.png"
import smallChartImg from "@/public/images/smallChart.png"
import smallChartWhiteImg from "@/public/images/smallChartWhite.png"
import { useGlobalContext } from "@/GlobalContext/GlobalContext"
import PortfolioRightSidebar from "../PortfolioRightSidebar"
import arrowRed from "@/public/images/arrowRed.png"
import arrowOrange from "@/public/images/arrowOrange.png"
import { Clock4, ArrowUpRight } from "lucide-react"
import PortfolioQueueRightSidebar from "../PortfolioQueueRightSidebar"
import Tooltip from "../../tooltip/Tooltip"

const assets = [
  {
    name: "lukso",
    ticker: "lyx",
    image: image.src,
    value: 10.93,
    repartition: 51,
    total: 35429.59,
    valueUsd: 354194.35
  },
  {
    name: "lukso",
    ticker: "czi",
    image: image.src,
    value: 10.93,
    repartition: 50,
    total: 35429.59,
    valueUsd: 354194.35
  },
  {
    name: "lukso",
    ticker: "usdt",
    image: image.src,
    value: 10.93,
    repartition: 25,
    total: 35429.59,
    valueUsd: 354194.35
  },
  {
    name: "lukso",
    ticker: "eth",
    image: image.src,
    value: 10.93,
    repartition: 24,
    total: 35429.59,
    valueUsd: 354194.35
  }
]

function PortfolioQueue() {
  const [selectedAssetIndex, setSelectedAssetIndex] = useState(-1)
  const [selectedAsset, setSelectedAsset] = useState<any>(null)
  const { darkTheme } = useGlobalContext()

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
    <div
      className={`overflow-auto w-full rounded-50 ${darkTheme ? "bg-background-darktheme border-neutral-600" : "border-neutral-100"} border-t border-solid`}
    >
      <div className="flex flex-col px-[16px]">
        <div className="flex w-full px-[8px] py-[20px]">
          <div
            className={`flex-1 text-left text-xsmall ${darkTheme ? 'text-neutral-200' : 'text-neutral-400'} 
                font-semibold uppercase tracking-wider`}
          >
            Action
          </div>
          <div
            className={`flex-1 text-left text-xsmall ${darkTheme ? 'text-neutral-200' : 'text-neutral-400'} 
                font-semibold uppercase tracking-wider`}
          >
            assets
          </div>
          <div
            className={`flex-1 text-left text-xsmall ${darkTheme ? 'text-neutral-200' : 'text-neutral-400'} 
                font-semibold uppercase tracking-wider`}
          >
            recipient
          </div>
          <div
            className={`flex-1 text-end text-xsmall ${darkTheme ? 'text-neutral-200' : 'text-neutral-400'} 
                font-semibold uppercase tracking-wider`}
          >
            created
          </div>
          <div
            className={`flex-1 text-end text-xsmall ${darkTheme ? 'text-neutral-200' : 'text-neutral-400'} 
                font-semibold uppercase tracking-wider`}
          >
            status
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
              className={`flex w-full h-[80px] cursor-pointer px-[8px] pb-[16px] ${getBorderStyle(asset, index)}`}
            >
              <div className="flex-1 flex gap-[16px] items-center">
                <ArrowUpRight
                  size={20}
                  color={darkTheme ? "#D47A72" : "#F84337"}
                  className="w-[25px] h-[25px]"
                />
                <div className="flex gap-[8px] items-center">
                  <span
                    className={`font-semibold text-base uppercase ${darkTheme ? "text-neutral-0" : "text-neutral-875"}`}
                  >
                    SEND #344
                  </span>
                </div>
              </div>
              <div className="flex flex-1 gap-[4px] items-center top-[5px] relative items-center">
                <div className="flex flex-col gap-[4px]">
                  <span
                    className={`${darkTheme ? 'text-neutral-200' : 'text-neutral-400'} text-base`}
                  >
                    4 tokens, 3 nfts
                  </span>
                  <Tooltip text="Lukso" position="top">
                    <div className="flex relative">
                      <img src={image.src} className=" h-[24px] w-[24px]"></img>
                      <img
                        src={image.src}
                        className=" h-[24px] w-[24px] absolute left-[21px]"
                      ></img>
                      <img
                        src={image.src}
                        className=" h-[24px] w-[24px] absolute left-[43px]"
                      ></img>
                      <img
                        src={image.src}
                        className=" h-[24px] w-[24px] absolute left-[66px]"
                      ></img>
                    </div>
                  </Tooltip>
                </div>
              </div>
              <div className="flex flex-1 gap-[4px] items-center top-[5px] relative items-center">
                <div className="flex flex-col gap-[4px]">
                  <span
                    className={`${darkTheme ? 'text-neutral-200' : 'text-neutral-400'} text-base`}
                  >
                    4 recipients
                  </span>
                  <div className="flex relative">
                    <img src={image.src} className=" h-[24px] w-[24px]"></img>
                    <img src={image.src} className=" h-[24px] w-[24px] absolute left-[21px]"></img>
                    <img src={image.src} className=" h-[24px] w-[24px] absolute left-[43px]"></img>
                    <img src={image.src} className=" h-[24px] w-[24px] absolute left-[66px]"></img>
                  </div>
                </div>
              </div>
              <div
                className="flex flex-1 whitespace-nowrap justify-end items-center"
                style={{ border: 0 }}
              >
                <span
                  className={`${darkTheme ? 'text-neutral-200' : 'text-neutral-400'} text-base`}
                >
                  1 day ago
                </span>
              </div>
              <div
                className="flex flex-1 whitespace-nowrap justify-end items-center"
                style={{ border: 0 }}
              >
                <div
                  className={`flex h-[24px] rounded-full ${darkTheme ? "bg-warning-700" : "bg-warning-50"} p-[8px] justify-center items-center gap-[4px]`}
                >
                  <Clock4 size={16} color={darkTheme ? "#FBCD70" : "#D79330"} />
                  <span
                    className={`${darkTheme ? "text-warning-400" : "text-warning-600"} text-small font-semibold`}
                  >
                    Pending
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {selectedAsset && (
        <PortfolioQueueRightSidebar
          sidebarOpen={selectedAsset !== null}
          asset={selectedAsset}
          removeSelectedAsset={() => {
            setSelectedAsset(null)
          }}
        ></PortfolioQueueRightSidebar>
      )}
    </div>
  )
}

export default PortfolioQueue
