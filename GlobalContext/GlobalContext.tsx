"use client"

import React, { ReactNode, createContext, useContext, useEffect, useState } from "react"
import UniversalProfile from "@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json"
import lsp3ProfileSchema from "@erc725/erc725.js/schemas/LSP3ProfileMetadata.json" assert { type: "json" }
import { ethers } from "ethers"
import { useAccount } from "wagmi"
import ERC725, { ERC725JSONSchema } from "@erc725/erc725.js"

// Initial state definitions
interface GlobalContextState {
  provider: any
  signer: any
  universalProfile?: any
  LSP3ProfileInstance?: any
  darkTheme?: boolean
  setDarkTheme?: (darkTheme: boolean) => void
}

const initialState: GlobalContextState = {
  provider: null,
  signer: null,
  universalProfile: null,
  LSP3ProfileInstance: null,
  darkTheme: false,
  setDarkTheme: () => {}
}

const GlobalTxContext = createContext(initialState)

interface GlobalProviderProps {
  children: ReactNode
}

export const GlobalContext = ({ children }: GlobalProviderProps) => {
  const { address, isConnected } = useAccount()
  const [provider, setProvider] = useState<any>()
  const [signer, setSigner] = useState<any>()
  const [universalProfile, setUniversalProfile] = useState<any>()
  const [LSP3ProfileInstance, setLSP3ProfileInstance] = useState<any>()

  const [darkTheme, setDarkTheme] = useState<boolean>(false)

  useEffect(() => {
    if (isConnected) {
      // Set provider, signer & universal profile
      const provider = new ethers.providers.Web3Provider(window.lukso)
      setProvider(provider)

      const signer = provider.getSigner()
      setSigner(signer)

      const LSP3ProfileInstance = new ERC725(
        lsp3ProfileSchema as ERC725JSONSchema[],
        address,
        process.env.NEXT_PUBLIC_TESTNET === "true"
          ? "https://rpc.testnet.lukso.network/"
          : "https://rpc.lukso.gateway.fm/",
        {
          ipfsGateway:
            process.env.NEXT_PUBLIC_TESTNET === "true"
              ? "https://api.universalprofile.cloud/ipfs"
              : `https://${process.env.NEXT_PUBLIC_IPFS_READ_GATEWAY}.mypinata.cloud/ipfs`
        }
      )

      console.log("LSP3ProfileInstanceCONTEXT", LSP3ProfileInstance)

      setUniversalProfile(new ethers.Contract(address || "", UniversalProfile.abi, signer))
      setLSP3ProfileInstance(LSP3ProfileInstance)
    }
  }, [address, isConnected])

  return (
    <GlobalTxContext.Provider
      value={{
        provider,
        signer,
        universalProfile,
        LSP3ProfileInstance,
        darkTheme,
        setDarkTheme
      }}
    >
      {children}
    </GlobalTxContext.Provider>
  )
}

export const useGlobalContext = () => useContext(GlobalTxContext)
