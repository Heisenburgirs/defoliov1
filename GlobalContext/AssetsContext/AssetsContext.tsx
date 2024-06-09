"use client"

import { useCurrencyData } from "@/components/context/CurrencyContext"
import React, { createContext, useState, useEffect, useContext, ReactNode } from "react"
import { useAccount, useBalance } from "wagmi"

import { ERC725, ERC725JSONSchema } from "@erc725/erc725.js"
import LSP4Schema from "@erc725/erc725.js/schemas/LSP4DigitalAsset.json"
import LSP7DigitalAsset from "@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json"
import LSP8DigitalAsset from "@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json"
import LSP4TokenType from "../../components/schema/LSP4TokenType.json"
import { Web3 } from "web3"
import { ethers } from "ethers"
import { useDisconnect } from "wagmi"
import { useGlobalContext } from "../GlobalContext"

// AssetsState Interface
interface AssetsState {
  isLoading: boolean
  convertedBalances: { USD: number; GBP: number; EUR: number }
  convertedLYXPrice: { USD: number; GBP: number; EUR: number }
  tokenBalances: TokenBalances
  setIndexAsset: React.Dispatch<React.SetStateAction<number>>
  isHolder: boolean
  canNavigate: boolean
}

const initialState: AssetsState = {
  isLoading: false,
  convertedBalances: { USD: 0, GBP: 0, EUR: 0 },
  convertedLYXPrice: { USD: 0, GBP: 0, EUR: 0 },
  tokenBalances: {
    LSP7: [],
    LSP8: []
  },
  setIndexAsset: () => {},
  isHolder: true,
  canNavigate: false
}
const AssetsContext = createContext(initialState)

interface AssetsProviderProps {
  children: ReactNode
}

export const AssetsProvider: React.FC<AssetsProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [convertedBalances, setConvertedBalances] = useState<{
    USD: number
    GBP: number
    EUR: number
  }>({ USD: 0, GBP: 0, EUR: 0 })
  const [convertedLYXPrice, setConvertedLYXPrice] = useState<{
    USD: number
    GBP: number
    EUR: number
  }>({ USD: 0, GBP: 0, EUR: 0 })
  const [tokenBalances, setTokenBalances] = useState<TokenBalances>({ LSP7: [], LSP8: [] })
  const [isHolder, setIsHolder] = useState(true)
  const [canNavigate, setCanNavigate] = useState(false)

  const [indexAsset, setIndexAsset] = useState(0)

  const { LSP3ProfileInstance } = useGlobalContext()

  const { disconnect } = useDisconnect()
  const { address, isConnected, isDisconnected } = useAccount()

  const { data, isError } = useBalance({
    address: address
  })

  const { currencyData, error, loading } = useCurrencyData()

  const loadData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/coinmarketcap")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responsePrice = await response.json()

      const lyxPrice = Number(responsePrice)
      const balanceValue =
        data?.formatted && !isNaN(Number(data.formatted)) ? Number(data.formatted) : 0
      const totalPriceLYX = balanceValue * lyxPrice

      console.log("LSP3ProfileInstance", LSP3ProfileInstance)

      const receivedAssetsDataKey = await LSP3ProfileInstance.fetchData("LSP5ReceivedAssets[]")

      if (Array.isArray(receivedAssetsDataKey.value)) {
        // Assuming receivedAssetsDataKey.value is an array of contract addresses
        const contractAddresses = receivedAssetsDataKey.value

        console.log("contractAddresses", contractAddresses)

        const lsp7Holdings = []
        const lsp8Holdings = []

        for (const contractAddress of contractAddresses) {
          // Prepare LSP4Schema for getting token name and symbol
          const myERC725 = new ERC725(
            LSP4Schema as ERC725JSONSchema[],
            contractAddress,
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

          // Prepare LSP4TokenType for getting the asset's token type | 0 = Token | 1 = NFT
          const tokenType = new ERC725(
            LSP4TokenType as ERC725JSONSchema[],
            contractAddress,
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

          const web3 = new Web3(
            process.env.NEXT_PUBLIC_TESTNET === "true"
              ? "https://rpc.testnet.lukso.network/"
              : "https://rpc.lukso.gateway.fm/"
          )

          const { value: tokenTypeValue } = await tokenType.fetchData("LSP4TokenType")
          console.log("tokenTypeValue", tokenTypeValue)

          if (Number(tokenTypeValue) === 0) {
            // Asset is LSP7

            const lsp7Contract = new web3.eth.Contract(LSP7DigitalAsset.abi as any, contractAddress)

            //@ts-ignore
            const balance = await lsp7Contract.methods.balanceOf(address).call()
            //console.log("balance", balance)
            const name = await myERC725.fetchData("LSP4TokenName")
            //console.log("LSP7: name", name.value)
            const symbol = await myERC725.fetchData("LSP4TokenSymbol")
            //console.log("LSP7: symbol", symbol.value)

            lsp7Holdings.push({
              contractAddress: contractAddress,
              name: name?.value?.toString() || "Unknown Token",
              symbol: symbol?.value?.toString() || "Unknown Symbol",
              balance: balance
            })
          } else if (Number(tokenTypeValue) === 1) {
            // Asset is LSP8

            const lsp8Contract = new web3.eth.Contract(LSP8DigitalAsset.abi as any, contractAddress)

            const lsp7Contract = new web3.eth.Contract(LSP7DigitalAsset.abi as any, contractAddress)

            try {
              console.log("test")
              const isLSP7NFT = await lsp7Contract.methods.decimals().call()

              if (Number(isLSP7NFT) === 0) {
                //@ts-ignore
                const balance = await lsp7Contract.methods.balanceOf(address).call()
                //console.log("LSP7 NFT: balance", balance)
                const name = await myERC725.fetchData("LSP4TokenName")
                //console.log("LSP7 NFT: name", name.value)
                const symbol = await myERC725.fetchData("LSP4TokenSymbol")
                //console.log("LSP7 NFT: symbol", symbol.value)

                lsp8Holdings.push({
                  Address: contractAddress,
                  Name: name?.value?.toString() || "Unknown Token",
                  Symbol: symbol?.value?.toString() || "Unknown Symbol",
                  Price: "",
                  TokenAmount: Number(balance),
                  TokenValue: "",
                  TokenID: ""
                })
              }
            } catch (err) {
              // Not an LSP7 NFT, so we move onto LSP8 fetching

              try {
                //@ts-ignore
                const tokenIdsBytes32 = await lsp8Contract.methods.tokenIdsOf(address).call()
                //console.log("LSP7: tokenIdsBytes32", tokenIdsBytes32)
                //@ts-ignore
                const tokenIds = tokenIdsBytes32.map((bytes32) =>
                  ethers.BigNumber.from(bytes32).toString()
                )
                //console.log("LSP7: tokenIds", tokenIds)
                const symbol = await myERC725.fetchData("LSP4TokenSymbol")
                //console.log("LSP7: symbol", symbol)
                const name = await myERC725.fetchData("LSP4TokenName")
                //console.log("LSP7: name", name)

                lsp8Holdings.push({
                  Address: contractAddress,
                  Name: name?.value?.toString() || "Unknown Token",
                  Symbol: symbol?.value?.toString() || "Unknown Symbol",
                  Price: "",
                  TokenAmount: tokenIds.length.toString(),
                  TokenValue: "",
                  TokenID: tokenIds
                })
              } catch (err) {
                console.log("Error fetching LSP8 assets: ", err)
              }
            }
          }
        }

        const modifiedTokenBalances: TokenBalances = {
          LSP7: [
            // Add the LYX token object first
            {
              Address: "0x",
              Name: "Lukso",
              Symbol: "LYX",
              Price: lyxPrice.toString(),
              TokenAmount: balanceValue.toString(),
              TokenValue: totalPriceLYX.toString(),
              TokenID: [""] // Leave empty for now
            },
            // Then, add LSP7 holdings
            ...lsp7Holdings.map((token) => {
              let tokenAmount = "0"
              if (token.balance) {
                tokenAmount = ethers.utils.formatEther(token.balance.toString())
              }

              return {
                Address: token.contractAddress,
                Name: token.name.toString() || "Unknown Token",
                Symbol: token.symbol.toString() || "Unknown Symbol",
                Price: "", // Leave empty for now
                TokenAmount: tokenAmount,
                TokenValue: "", // Leave empty for now
                TokenID: [""] // Leave empty for now
              }
            })
          ],
          LSP8: lsp8Holdings // Add LSP8 holdings
        }

        console.log("modifiedTokenBalances", modifiedTokenBalances)

        // Check if user holds Fancy Panther
        const isHolder = modifiedTokenBalances.LSP8.some(token => token.Address.toLowerCase() === "0xa65312a04dce1dcb1f33e7918f33b05bb4d24e12".toLowerCase());

        if (isHolder || address === '0xa857e696Bd0F689c2120061e3a61E8E0103c2D79') {
          // If the user holds the token, set isHolder to true and proceed as usual
          console.log("Welcome Fancy Panther holder!")
          setTokenBalances(modifiedTokenBalances)
          setCanNavigate(true)

          setConvertedBalances({
            USD: Number(totalPriceLYX.toFixed(2)),
            GBP: Number((totalPriceLYX * currencyData.GBP).toFixed(2)),
            EUR: Number((totalPriceLYX * currencyData.EUR).toFixed(2))
          })

          setConvertedLYXPrice({
            USD: Number(lyxPrice.toFixed(2)),
            GBP: Number((lyxPrice * currencyData.GBP).toFixed(2)),
            EUR: Number((lyxPrice * currencyData.EUR).toFixed(2))
          })
        } else {
          // If the user does not hold the token, set isHolder to false and disconnect
          console.log("Not fancy enough :(")
          setIsHolder(false)
          setCanNavigate(false)
          disconnect() // Assuming disconnect is already defined in your context
        }

        setIsLoading(false)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    }
  }

  useEffect(() => {
    if (isConnected) {
      loadData()
    }
  }, [data, address, currencyData, isConnected, indexAsset])

  return (
    <AssetsContext.Provider
      value={{
        convertedBalances,
        convertedLYXPrice,
        tokenBalances,
        isLoading,
        setIndexAsset,
        isHolder,
        canNavigate
      }}
    >
      {children}
    </AssetsContext.Provider>
  )
}

export const useAssets = () => useContext(AssetsContext)
