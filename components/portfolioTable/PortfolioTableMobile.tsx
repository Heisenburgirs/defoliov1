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
import PortfolioHeader from "../PortfolioHeader"
import {
  ChevronDown,
  CircleUserRound,
  KeyRound,
  Moon,
  SearchIcon,
  Sun,
  TrendingUp,
  Vault,
  WalletCards
} from "lucide-react"
import Dropdown from "../dropdown/Dropdown"
import Search from "../search/Search"
import assets from "@/app/utils/tempAssets"

const options = ["Tokens", "Nfts", "Queue", "History"]

function PortfolioTableMobile() {
  const [selectedTab, setSelectedTab] = useState("Assets")
  const { setDarkTheme, darkTheme } = useGlobalContext()
  const [selectedOption, setSelectedOption] = useState(options[0])
  const [isOpen, setIsOpen] = useState(false)
  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleSelect = (option: any) => {
    setSelectedOption(option)
    setIsOpen(false)
  }

  return (
    <>
      <div
        style={{ height: "calc(100dvh - 80px)", width: "calc(100% - 16px)" }}
        className={`flex flex-col mb-[8px] mt-[8px] rounded-50 shadow-bottom-200 
    ${darkTheme ? "bg-background-darktheme border border-solid border-neutral-750" : "bg-white border border-solid border-neutral-125"}`}
      >
        <div className="w-full p-[16px] justify-between flex items-center">
          <div className="flex flex-col gap-[8px]">
            <span className={`text-small ${darkTheme ? "text-neutral-125" : "text-neutral-625"}`}>
              Total assets
            </span>
            <div className="flex items-center gap-[12px]">
              <span
                className={`text-header flex items-center gap-[8px] mr-[12px]
            font-semibold ${darkTheme ? "text-neutral-125" : "text-neutral-625"}`}
              >
                $1423.23{" "}
                <TrendingUp size={20} color={darkTheme ? "#91D390" : "#72C56E"}></TrendingUp>
                <span
                  className={`text-small ${darkTheme ? "text-positive-275" : "text-positive-500"}`}
                >
                  24%
                </span>
              </span>
            </div>
          </div>
          {darkTheme ? (
            <Moon
              size={25}
              color={"#FFF"}
              onClick={() => {
                setDarkTheme && setDarkTheme(!darkTheme)
              }}
              className="hover:cursor-pointer"
            />
          ) : (
            <Sun
              size={25}
              color={"#41474D"}
              onClick={() => {
                setDarkTheme && setDarkTheme(!darkTheme)
              }}
              className="hover:cursor-pointer"
            />
          )}
        </div>
        <div
          className={`flex flex-col w-full border-t border-solid ${darkTheme ? "border-neutral-750" : "border-neutral-125"}`}
        >
          <div className="flex w-full px-[10px] py-[16px] justify-between">
            <Dropdown></Dropdown>
            <div className="relative flex gap-[8px]">
              <span className="inset-y-0 left-0 flex items-center">
                <SearchIcon size={16} color={darkTheme ? "#D6D8DB" : "#7D8286"} />
              </span>
              <Search></Search>
            </div>
          </div>
        </div>
        <div
          className={`flex flex-col w-full h-full border-t border-solid overflow-auto ${darkTheme ? "border-neutral-750" : "border-neutral-125"}`}
        >
          <div className="flex w-full px-[10px] py-[16px] justify-between">
            <span className={`${darkTheme ? "text-neutral-125" : "text-neutral-625"} text-small`}>
              Assets (8)
            </span>
            <span
              className={`${darkTheme ? "text-neutral-125" : "text-neutral-625"} text-small text-end`}
            >
              Value
            </span>
          </div>
          <div className="flex flex-col w-full px-[8px] pb-[8px] h-full overflow-y-auto gap-[8px]">
            {assets.map((asset, index) => {
              return (
                <div
                  key={index}
                  className={`w-full flex justify-between items-center min-h-[40px] h-[40px] border-solid border-t ${darkTheme ? "border-neutral-50" : "border-neutral-50"}`}
                >
                  <div className="flex items-center justify-center gap-[18px]">
                    <img src={asset.image.src || ""} className="h-[20px] w-[20px]"></img>
                    <span
                      className={`${darkTheme ? "text-white" : "text-neutral-875"} font-semibold`}
                    >
                      {asset.name || ""}
                    </span>
                    <span
                      className={`${darkTheme ? "text-neutral-250" : "text-neutral-500"} uppercase text-small`}
                    >
                      {asset.ticker || ""}
                    </span>
                  </div>
                  <span className={`${darkTheme ? "text-white" : "text-neutral-875"} text-end`}>
                    ${asset.valueUsd}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div
        className={`${darkTheme ? "bg-background-darktheme" : "bg-white"} flex justify-between w-full h-[80px]`}
      >
        <div
          onClick={() => {
            setSelectedTab("Assets")
          }}
          className={`flex flex-col justify-center items-center border-t border-solid w-full gap-[8px] 
          ${
    darkTheme && selectedTab === "Assets"
      ? "border-primary-275"
      : !darkTheme && selectedTab === "Assets"
        ? "border-primary-500"
        : selectedTab !== "Assets" && darkTheme
          ? "border-neutral-750"
          : "border-neutral-125"
    }`}
        >
          <WalletCards
            size={20}
            color={
              darkTheme && selectedTab === "Assets"
                ? "#FA7FB2"
                : !darkTheme && selectedTab === "Assets"
                  ? "#E3679A"
                  : selectedTab !== "Assets" && darkTheme
                    ? "#F1F1F1"
                    : "#41474D"
            }
          />
          <span
            className={`text-small ${
              darkTheme && selectedTab === "Assets"
                ? "text-primary-275"
                : !darkTheme && selectedTab === "Assets"
                  ? "text-primary-500"
                  : selectedTab !== "Assets" && darkTheme
                    ? "text-neutral-125"
                    : "text-neutral-750"
            }`}
          >
            Assets
          </span>
        </div>
        <div
          onClick={() => {
            setSelectedTab("Keys")
          }}
          className={`flex flex-col justify-center items-center border-t border-solid w-full gap-[8px] 
          ${
    darkTheme && selectedTab === "Keys"
      ? "border-primary-275"
      : !darkTheme && selectedTab === "Keys"
        ? "border-primary-500"
        : selectedTab !== "Keys" && darkTheme
          ? "border-neutral-750"
          : "border-neutral-125"
    }`}
        >
          <KeyRound
            size={20}
            color={
              darkTheme && selectedTab === "Keys"
                ? "#FA7FB2"
                : !darkTheme && selectedTab === "Keys"
                  ? "#E3679A"
                  : selectedTab !== "Keys" && darkTheme
                    ? "#F1F1F1"
                    : "#41474D"
            }
          />
          <span
            className={`text-small ${
              darkTheme && selectedTab === "Keys"
                ? "text-primary-275"
                : !darkTheme && selectedTab === "Keys"
                  ? "text-primary-500"
                  : selectedTab !== "Keys" && darkTheme
                    ? "text-neutral-125"
                    : "text-neutral-750"
            }`}
          >
            Keys
          </span>
        </div>
        <div
          onClick={() => {
            setSelectedTab("Vault")
          }}
          className={`flex flex-col justify-center items-center border-t border-solid w-full gap-[8px] 
          ${
    darkTheme && selectedTab === "Vault"
      ? "border-primary-275"
      : !darkTheme && selectedTab === "Vault"
        ? "border-primary-500"
        : selectedTab !== "Vault" && darkTheme
          ? "border-neutral-750"
          : "border-neutral-125"
    }`}
        >
          <Vault
            size={20}
            color={
              darkTheme && selectedTab === "Vault"
                ? "#FA7FB2"
                : !darkTheme && selectedTab === "Vault"
                  ? "#E3679A"
                  : selectedTab !== "Vault" && darkTheme
                    ? "#F1F1F1"
                    : "#41474D"
            }
          />
          <span
            className={`text-small ${
              darkTheme && selectedTab === "Vault"
                ? "text-primary-275"
                : !darkTheme && selectedTab === "Vault"
                  ? "text-primary-500"
                  : selectedTab !== "Vault" && darkTheme
                    ? "text-neutral-125"
                    : "text-neutral-750"
            }`}
          >
            Vault
          </span>
        </div>
        <div
          onClick={() => {
            setSelectedTab("Profiles")
          }}
          className={`flex flex-col justify-center items-center border-t border-solid w-full gap-[8px] 
         ${
    darkTheme && selectedTab === "Profiles"
      ? "border-primary-275"
      : !darkTheme && selectedTab === "Profiles"
        ? "border-primary-500"
        : selectedTab !== "Profiles" && darkTheme
          ? "border-neutral-750"
          : "border-neutral-125"
    }`}
        >
          <CircleUserRound
            size={20}
            color={
              darkTheme && selectedTab === "Profiles"
                ? "#FA7FB2"
                : !darkTheme && selectedTab === "Profiles"
                  ? "#E3679A"
                  : selectedTab !== "Profiles" && darkTheme
                    ? "#F1F1F1"
                    : "#41474D"
            }
          />
          <span
            className={`text-small ${
              darkTheme && selectedTab === "Profiles"
                ? "text-primary-275"
                : !darkTheme && selectedTab === "Profiles"
                  ? "text-primary-500"
                  : selectedTab !== "Profiles" && darkTheme
                    ? "text-neutral-125"
                    : "text-neutral-750"
            }`}
          >
            Profiles
          </span>
        </div>
      </div>
    </>
  )
}

export default PortfolioTableMobile
