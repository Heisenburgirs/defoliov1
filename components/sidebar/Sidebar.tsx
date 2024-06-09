import React, { useState } from "react"
import Image from "next/image"
import { useAssets } from "@/GlobalContext/AssetsContext/AssetsContext"
import { useGlobalContext } from "@/GlobalContext/GlobalContext"
import { WalletCards, KeyRound, Vault, PanelRightOpen } from "lucide-react"

import logoPink from "../../public/logo_pink.svg"

const Sidebar = ({ selectedMenuItem, setSelectedMenuItem }: any) => {
  const [isExtended, setIsExtended] = useState(true)
  const [isSidebarBtnShown, setIsSidebarBtnShown] = useState(true)

  const { canNavigate } = useAssets()
  const { darkTheme } = useGlobalContext()

  const handleExtendClick = () => {
    setIsExtended(!isExtended)
  }

  const sidebarWidth = isExtended ? "232px" : "72px"

  const menuItems = [
    { name: "Assets", icon: WalletCards },
    { name: "Keymanager", icon: KeyRound },
    { name: "Vaults", icon: Vault }
  ]

  const getColor = (item: { name: string }) => {
    if (darkTheme) {
      return selectedMenuItem === item.name ? '#F2779A' : ' #FFFFFF'; // Dark theme colors
    } else {
      return selectedMenuItem === item.name ? '#EA4C89' : '#2B3239'; // Light theme colors
    }
  }

  return (
    <div
      className={`${darkTheme ? "bg-background-darktheme border-neutral-600" : "bg-white border-neutral-100"} border-r hidden lg:flex text-darkBlue flex flex-col sidebar shadow-[rgba(0,0,0,0.1)_1px_0px_4px_0px]`}
      onMouseEnter={() => {
        setIsSidebarBtnShown(true)
      }}
      onMouseLeave={() => {
        setIsSidebarBtnShown(false)
      }}
      style={{ width: sidebarWidth }}
    >
      <div className="flex flex-col">
        {isExtended ? (
          <div
            className={`flex items-center justify-between py-[16px] px-[20px] border-b ${darkTheme ? "border-neutral-600" : "border-neutral-100"}`}
          >
            <div className="flex gap-[0.85rem] items-center justify-center">
              <Image src={logoPink} alt="Defolio" width={25.375} height={28} />
              <div
                className={`text-logo ${darkTheme ? "text-neutral-0" : "text-neutral-875"} font-semibold`}
              >
                Defolio
              </div>
            </div>

            <PanelRightOpen
              size={20}
              color={darkTheme ? "#FFFFFF" : "#41474D"}
              onClick={handleExtendClick}
              className="hover:cursor-pointer"
            />
          </div>
        ) : (
          <div
            className={`flex items-center justify-between py-[18px] px-[20px] border-b ${darkTheme ? "border-neutral-600" : "border-neutral-100"}`}
          >
            <Image
              src={logoPink}
              alt="Defolio"
              width={25.375}
              height={28}
              onClick={handleExtendClick}
            />
          </div>
        )}
      </div>

      <div className="py-[16px]">
        {menuItems.map((item) => (
          <span
            key={item.name}
            onClick={() => !canNavigate && item.name !== "Vaults" && setSelectedMenuItem(item.name)}
            className={`
              ${selectedMenuItem === item.name && "border-r-4 border-solid border-pink"} 
              ${isExtended ? "justify-start" : "justify-center"}
              ${!canNavigate && "opacity-100 cursor-not-allowed"}
              ${darkTheme ? "hover:bg-neutral-875" : "hover:bg-neutral-50"}
              ${item.name === "Vaults" && "opacity-50"}
              cursor-pointer flex w-full text-left
              gap-[12px] items-center font-semibold transition-all
          `}
          >
            {isExtended ? (
              <div className="flex items-center gap-[12px] py-[10px] pl-[24px]">
                <item.icon
                  size={20}
                  color={getColor(item)}
                />
                <span className={`${darkTheme ? selectedMenuItem === item.name ? 'text-primary-400' : 'text-neutral-0' : selectedMenuItem === item.name ? 'text-primary-500' : 'text-neutral-700'} max-w-[100%] whitespace-nowrap overflow-hidden`}>{item.name}</span>
              </div>
            ) : (
              <div className="flex">
                <div className="py-[12px]">
                  <item.icon size={20} color={getColor(item)} />
                </div>
              </div>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
