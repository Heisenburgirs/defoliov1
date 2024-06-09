"use client"

import React, { useState } from "react";
import { useGlobalContext } from "@/GlobalContext/GlobalContext";
//import { useAccount } from "wagmi";
import Image from "next/image"
import { Sun, Moon, ChevronDown, Wallet, Copy, ExternalLink, LogOut } from "lucide-react";
import logo from "@/public/fancy_panther.png"

function PortfolioHeader({ selectedMenuItem, setSelectedMenuItem }: any) {
  //const [showOverlay, setShowOverlay] = useState(false)

  const { setDarkTheme, darkTheme } = useGlobalContext()
  //const { address, isConnected } = useAccount()

  const [accountDropdown, setAccountDropdown] = useState(false);

  return (
    <>
      <div className={`flex w-full items-end md:px-[16px] h-[63px] md:py-[12px] border-b ${darkTheme ? "bg-background-darktheme border-neutral-600" : "bg-neutral-0 border-neutral-100"}`}>
        <div className="flex w-full gap-4 items-center justify-end">
          {darkTheme ? (
            <Moon size={20} color={"#FFF"} onClick={() => {setDarkTheme && setDarkTheme(!darkTheme)}} className="hover:cursor-pointer"/>
          )
            :
            (
              <Sun size={20} color={"#41474D"} onClick={() => {setDarkTheme && setDarkTheme(!darkTheme)}} className="hover:cursor-pointer"/>
            )
          }
          <div className="flex gap-[12px]">
            <div className={`${darkTheme ? "border-neutral-500 bg-neutral-800" : "border-neutral-200 bg-neutral-0"} flex items-center justify-center gap-[7px] w-[120px] h-[36px] border rounded-full shadow-bottom-100 hover:cursor-pointer`}>
              <div className={`${darkTheme ? "text-neutral-0" : "text-neutral-875"} text-small leading-logo`}>16.4825 LYX</div>
              <Wallet size={16} color={darkTheme ? "#FFFFFF" : "#41474D"} />
            </div>
            <div onClick={() => {setAccountDropdown(!accountDropdown)}} className={`${darkTheme ? "border-neutral-500 bg-neutral-800" : "border-neutral-200 bg-neutral-0"} flex items-center justify-start pl-[2px] gap-[7px] w-[70px] h-[36px] border rounded-full shadow-bottom-100 hover:cursor-pointer`}>
              <div className="flex items-center gap-[10px]">
                <Image src={logo} alt="Defolio" width={32} height={32} className="rounded-full" />
              </div>
              <ChevronDown size={16} color={darkTheme ? "#F8F8F8" : "#2B3239"} className="hover:cursor-pointer"/>
            </div>
            {accountDropdown &&
                <div className={`${darkTheme ? "border-neutral-500 bg-neutral-800" : "border-neutral-100 bg-neutral-0"} absolute right-[14px] top-[56px] w-[272px] h-[134px] p-[8px] gap-[4px] border rounded-100 shadow-bottom-300`}>
                  <div className={` ${darkTheme ? "border-neutral-500 bg-neutral-700" : "bg-neutral-50"} flex gap-[16px] p-[8px] rounded-50 self-stretch items-center`}>
                    <Image src={logo} alt="Profile" width={48} height={48} className="rounded-full" />
                    <div className="flex flex-col flex-auto items-start">
                      <span className={`${darkTheme ? "text-neutral-0" : "text-neutral-700"} text-base font-semibold leading-base`}>Johndoe</span>
                      <div className="flex justify-between items-center self-stretch">
                        <span className={`${darkTheme ? "text-neutral-0" : "text-neutral-700"} text-small leading-base`}>d38efg...ef2u13</span>
                        <div className="flex items-center gap-[6px]">
                          <span className={` ${darkTheme ? "bg-neutral-800 border-neutral-500" : "bg-neutral-0 border-neutral-200"} w-[28px] h-[28px] p-[6px] border rounded-50 hover:cursor-pointer`}>
                            <Copy size={14} color={darkTheme ? "#FFFFFF" : "#2B3239"} />
                          </span>
                          <span className={` ${darkTheme ? "bg-neutral-800 border-neutral-500" : "bg-neutral-0 border-neutral-200"} w-[28px] h-[28px] p-[6px] border rounded-50 hover:cursor-pointer`}>
                            <ExternalLink size={14} color={darkTheme ? "#FFFFFF" : "#2B3239"} />
                          </span>
                        </div> 
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex h-[50px] px-[8px] pt-[5px] items-center gap-[10px] flex-auto hover:cursor-pointer">
                    <LogOut size={20} color={darkTheme ? "#F2779A" : "#EA4C89"} />
                    <span className={`${darkTheme ? "text-neutral-0" : "text-neutral-700"} text-base leading-base`}>Logout</span>
                  </div>
                </div>
            }
          </div>
        </div>

        <w3m-button />
        {/*<ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                // Note: If your app doesn't use authentication, you
                // can remove all 'authenticationStatus' checks
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus ||
                    authenticationStatus === 'authenticated');

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      'style': {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button onClick={openConnectModal} type="button"
                            className={`font-semibold bg-primary-500 rounded-50 text-white px-4 py-2 rounded-md`}
                          >
                            Connect Wallet
                          </button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <button onClick={openChainModal} type="button"
                            className={`bg-negative-500 rounded-50 text-white px-4 py-2 rounded-md`}
                          >
                            Wrong network
                          </button>
                        );
                      }

                      return (
                        <div style={{ display: 'flex', gap: 12 }}>
                          <button
                            onClick={openChainModal}
                            style={{ display: 'flex', alignItems: 'center' }}
                            type="button"
                          >
                            {chain.hasIcon && (
                              <div
                                style={{
                                  background: chain.iconBackground,
                                  width: 12,
                                  height: 12,
                                  borderRadius: 999,
                                  overflow: 'hidden',
                                  marginRight: 4,
                                }}
                              >
                                {chain.iconUrl && (
                                  <Image
                                    alt={chain.name ?? 'Chain icon'}
                                    src={chain.iconUrl}
                                    style={{ width: 12, height: 12 }}
                                  />
                                )}
                              </div>
                            )}
                            {chain.name}
                          </button>

                          <button onClick={openAccountModal} type="button">
                            {account.displayName}
                            {account.displayBalance
                              ? ` (${account.displayBalance})`
                              : ''}
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>*/}
      </div>
    </>
  )
}

export default PortfolioHeader
