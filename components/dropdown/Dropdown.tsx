import React, { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import image from "@/public/tempImages/image.png"
import smallChartImg from "@/public/images/smallChart.png"
import smallChartWhiteImg from "@/public/images/smallChartWhite.png"
import { useGlobalContext } from "@/GlobalContext/GlobalContext"
import PortfolioHeader from "../PortfolioHeader"
import {
  ChevronDown,
  CircleUserRound,
  KeyRound,
  Moon,
  Sun,
  TrendingUp,
  Vault,
  WalletCards
} from "lucide-react"

const options = ["Tokens", "Nfts", "Queue", "History"]

function Dropdown() {
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
    <div className="relative inline-block text-left w-[90px]">
      <div>
        <button
          type="button"
          onClick={toggleDropdown}
          className={`inline-flex justify-between items-center justify-center
                   rounded-50 border border-solid gap-[6px] ${darkTheme ? "border-neutral-625" : "border-neutral-250"}
                   w-full shadow-bottom-200 rounded-md shadow-sm px-[12px] py-[8px]`}
        >
          <span className={`${darkTheme ? "text-white" : "text-neutral-875"} text-small`}>
            {selectedOption}
          </span>
          <ChevronDown size={16} color={darkTheme ? "#fff" : "#2B3239"} />
        </button>
      </div>
      {isOpen && (
        <div
          className={`origin-top-right w-[90px] rounded-50 mt-[5px] text-left items-start absolute rounded-md border border-solid 
                focus:outline-none ${darkTheme ? "border-neutral-625" : "border-neutral-250"}`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              className={`block w-full text-left px-[12px] py-[4px] text-small ${darkTheme ? "text-white" : "text-neutral-875"}`}
              role="menuitem"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dropdown
