import { copyToClipboard } from "@/app/utils/useCopyToCliptboard"
import { formatAddress } from "@/app/utils/useFormatAddress"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { NotificationType, notify } from "../toast/Toast"
import { isValidEthereumAddress } from "@/app/utils/useIsValidEthereumAddress"
import { ethers } from "ethers"
import { useAssets } from "@/GlobalContext/AssetsContext/AssetsContext"
import QRCode from "react-qr-code"
import Image from "next/image"
import copy from "@/public/icons/copy.svg"
import tooltip from "@/public/icons/tooltip.png"
import SearchBar from "../searchbar/SearchBar"
import TokenType from "../tokentype/TokenType"
import LSP7ABI from "@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json"
import LSP8ABI from "@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json"
import { numberToBytes32 } from "@/app/utils/useBytes32"
import Tooltip from "@mui/material/Tooltip"
import TransactionModal from "../modal/TransactionModal"
import { useVault } from "@/GlobalContext/VaultContext/VaultContext"
import { useKeymanager } from "@/GlobalContext/KeymanagerContext/KeymanagerContext"

const Transfer = ({}) => {
  const { address, isConnected } = useAccount()
  const { tokenBalances } = useAssets()
  const [isTransferInitiated, setIsTransferInitiated] = useState(false)
  const [tokenType, setTokenType] = useState<string>("LSP7")
  const [transactionStep, setTransactionStep] = useState(1)

  const { vaults, setIndexVault } = useVault()
  const { setIndexAsset } = useAssets()
  const { setIndexKey } = useKeymanager()

  const [menuSelected, setMenuSelected] = useState<string>("Send")
  const [everythingFilled, setEverythingFilled] = useState<boolean>(false)
  const [recipientAddress, setRecipientAddress] = useState<string>("")

  const initialAssetState = {
    Address: "",
    Name: "",
    Symbol: "",
    Price: "",
    TokenAmount: "",
    TokenValue: "",
    TokenID: []
  }

  const [selectedAsset, setSelectedAsset] = useState<TokenRow>({
    Address: "",
    Name: "",
    Symbol: "",
    Price: "",
    TokenAmount: "",
    TokenValue: "",
    TokenID: []
  })
  const [selectedTokenId, setSelectedTokenId] = useState<string>()
  const [sendAmount, setSendAmount] = useState<string>("")
  const [safeTransfer, setSafeTransfer] = useState<boolean>(false)

  const [isNFTSelected, setIsNFTSelected] = useState<boolean>(false)

  useEffect(() => {
    if (isNFTSelected && recipientAddress !== "" && selectedAsset.Address !== "") {
      setEverythingFilled(true)
    } else if (
      !isNFTSelected &&
      recipientAddress !== "" &&
      selectedAsset.Address !== "" &&
      sendAmount !== ""
    ) {
      setIsNFTSelected(false)
    }
  }, [isNFTSelected])

  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredLSP7Tokens = tokenBalances.LSP7.filter(
    (token) =>
      token.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.Symbol.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredLSP8Tokens = tokenBalances.LSP8.filter(
    (token) =>
      token.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.Symbol.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    if (
      (recipientAddress !== "" && selectedAsset.Address !== "" && sendAmount !== "") ||
      (recipientAddress !== "" && selectedAsset.Address !== "" && isNFTSelected)
    ) {
      setEverythingFilled(true)
    } else {
      setEverythingFilled(false)
    }
  }, [recipientAddress, selectedAsset, sendAmount])

  const transfer = async () => {
    if (selectedAsset)
      if (selectedAsset.Address != "0x") {
        if (!isValidEthereumAddress(selectedAsset?.Address)) {
          notify("Invalid token", NotificationType.Error)
          return
        }
      }

    // Check if recipientAddress is a valid Ethereum address
    if (!isValidEthereumAddress(recipientAddress)) {
      notify("Invalid recipient", NotificationType.Error)
      return
    }

    // Compare to balance
    if (Number(sendAmount) >= Number(selectedAsset.TokenAmount)) {
      notify("Amount Exceeds Balance", NotificationType.Error)
      return
    }

    const provider = new ethers.providers.Web3Provider(window.lukso)
    const signer = provider.getSigner()

    const isEOA = async (address: string) => {
      try {
        // Get the bytecode at the address
        const bytecode = await provider.getCode(address)

        // Check if the bytecode is empty
        return bytecode === "0x"
      } catch (error) {
        console.error("Error checking address:", error)
        return false
      }
    }

    try {
      // Await the result of isEOA
      const isEoa = await isEOA(recipientAddress)
      console.log(isEoa, safeTransfer)

      if (isEoa && !safeTransfer) {
        notify("Enable Safe Transfer", NotificationType.Error)
        return
      }

      const LSP8contract = new ethers.Contract(selectedAsset.Address, LSP8ABI.abi, signer)
      const LSP7contract = new ethers.Contract(selectedAsset.Address, LSP7ABI.abi, signer)

      setIsTransferInitiated(true)
      if (selectedAsset.Address === "0x") {
        try {
          const tx = await signer.sendTransaction({
            from: address,
            to: recipientAddress,
            value: ethers.utils.parseEther(sendAmount)
          })

          // Wait for the transaction to be mined
          const receipt = await tx.wait()

          setTransactionStep(3)
          notify("LYX transferred", NotificationType.Success)
          setSelectedAsset(initialAssetState)
          setRecipientAddress("")
          setIsNFTSelected(false)
          setEverythingFilled(false)
          setIndexAsset(1070)
          setIndexKey(1070)
          setIndexVault(1080)
        } catch (err) {
          // First, check if err is an object and has a 'code' property
          if (typeof err === "object" && err !== null && "code" in err) {
            // Now TypeScript knows err is an object and has a 'code' property
            const errorCode = (err as { code: unknown }).code
            if (errorCode === 4001) {
              // Handle user's rejection
              console.log("User declined the transaction")
              notify("Signature Declined", NotificationType.Error)
              setIsTransferInitiated(false)
            } else {
              // Handle other errors
              console.log("ERROR TRANSFERRING LYX ASSET", err)
              setIsTransferInitiated(true)
              notify("Error Transferring LYX Asset", NotificationType.Error)
              setTransactionStep(4)
            }
          } else {
            // Handle the case where err is not an object or doesn't have 'code'
            console.log("An unexpected error occurred", err)
            setTransactionStep(4)
          }
        }
      } else {
        if (isNFTSelected) {
          try {
            const transaction = await LSP8contract.transfer(
              address,
              recipientAddress,
              numberToBytes32(Number(selectedTokenId)),
              safeTransfer,
              "0x"
            )
            await transaction.wait()
            notify("NFT transferred", NotificationType.Success)
            setTransactionStep(3)
            setSelectedAsset(initialAssetState)
            setRecipientAddress("")
            setIsNFTSelected(false)
            setEverythingFilled(false)
            setIndexAsset(1070)
            setIndexKey(1070)
            setIndexVault(1080)
          } catch (err) {
            // First, check if err is an object and has a 'code' property
            if (typeof err === "object" && err !== null && "code" in err) {
              // Now TypeScript knows err is an object and has a 'code' property
              const errorCode = (err as { code: unknown }).code
              if (errorCode === 4001) {
                // Handle user's rejection
                console.log("User declined the transaction")
                notify("Signature Declined", NotificationType.Error)
                setIsTransferInitiated(false)
              } else {
                // Handle other errors
                console.log("ERROR TRANSFERRING LSP8 ASSET", err)
                setIsTransferInitiated(true)
                notify("Error Transferring LSP8 Asset", NotificationType.Error)
                setTransactionStep(4)
              }
            } else {
              // Handle the case where err is not an object or doesn't have 'code'
              console.log("An unexpected error occurred", err)
              setTransactionStep(4)
            }
          }
        } else {
          try {
            const amount = ethers.utils.parseUnits(sendAmount, "ether")

            const transaction = await LSP7contract.transfer(
              address,
              recipientAddress,
              amount,
              safeTransfer,
              "0x"
            )
            setIsTransferInitiated(true)
            await transaction.wait()
            notify("Token transferred", NotificationType.Success)
            setTransactionStep(3)
            setSelectedAsset(initialAssetState)
            setRecipientAddress("")
            setSendAmount("")
            setEverythingFilled(false)
            setIndexAsset(500)
            setIndexKey(5700)
            setIndexVault(7900)
          } catch (err) {
            // First, check if err is an object and has a 'code' property
            if (typeof err === "object" && err !== null && "code" in err) {
              // Now TypeScript knows err is an object and has a 'code' property
              const errorCode = (err as { code: unknown }).code
              if (errorCode === 4001) {
                // Handle user's rejection
                console.log("User declined the transaction")
                notify("Signature Declined", NotificationType.Error)
                setIsTransferInitiated(false)
              } else {
                // Handle other errors
                console.log("ERROR TRANSFERRING LSP7 ASSET", err)
                setIsTransferInitiated(true)
                notify("Error Transferring LSP7 Asset", NotificationType.Error)
                setTransactionStep(4)
              }
            } else {
              // Handle the case where err is not an object or doesn't have 'code'
              console.log("An unexpected error occurred", err)
              setTransactionStep(4)
            }
          }
        }
      }
    } catch (error) {
      console.error("Error determening EOA:", error)
    }
  }

  const test = async () => {}

  return (
    <div className={"flex sm:flex-col lg:flex-row w-full justify-center sm:pt-12 lg:pt-32"}>
      <div
        className={`flex flex-col gap-10 py-6 px-12 bg-white rounded-15 ${isTransferInitiated && "px-32"}`}
      >
        {isTransferInitiated ? (
          <div className="flex mt-48">
            <TransactionModal
              successMsg={`${isNFTSelected ? "NFT" : "Token"} Transferred`}
              onBackButtonClick={() => {
                setIsTransferInitiated(false)
              }}
              transactionStep={transactionStep}
              setTransactionStep={setTransactionStep}
              message1="Waiting for Confirmation"
              message2="Transaction Submitted"
              message3="Transaction Successful"
            />
          </div>
        ) : (
          <div className="border rounded-15 border-darkBlue border-opacity-50 py-4 px-8 flex flex-col gap-8">
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setMenuSelected("Send")
                }}
                className={`w-[150px] py-4 text-small text-darkBlue font-bold ${menuSelected === "Send" && "text-darkBlue border-b-2"}`}
              >
                Send
              </button>
              <button
                onClick={() => {
                  setMenuSelected("Receive")
                }}
                className={`w-[150px] py-4 text-small text-darkBlue font-bold ${menuSelected === "Receive" && "text-darkBlue border-b-2"}`}
              >
                Receive
              </button>
            </div>

            {menuSelected === "Send" ? (
              isConnected ? (
                <div className="flex flex-col gap-12">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <h1 className="text-darkBlue font-bold">Send To</h1>
                      <input
                        type="text"
                        placeholder="Enter address..."
                        onChange={(e) => {
                          setRecipientAddress(e.target.value)
                        }}
                        className="border border-darkBlue border-opacity-50 focus:outline-purple px-4 text-xsmall rounded-10 py-4"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <h1 onClick={test} className="text-darkBlue font-bold">
                        Asset
                      </h1>
                      <input
                        type="text"
                        placeholder="Select asset..."
                        onClick={() => setIsDropDownOpen(!isDropDownOpen)}
                        onChange={(e) => {
                          setIsDropDownOpen(!isDropDownOpen)
                        }}
                        value={selectedAsset?.Name}
                        className="w-full border border-darkBlue border-opacity-50 focus:outline-purple px-4 text-xsmall rounded-10 py-4"
                      />

                      {isDropDownOpen &&
                        (tokenBalances ? (
                          <div className="absolute inset-0 sm:h-[150vh] base:h-[149vh] lg:h-[127vh] bg-black bg-opacity-50 z-50 flex h-full justify-center items-center">
                            <div className="flex flex-col bg-background gap-8 px-4 py-8 lg:ml-[250px] sm:mt-[200px] lg:mt-[-150px] rounded-10 shadow">
                              <div className="flex w-full justify-evenly items-center text-darkBlue font-bold">
                                <div className="w-full text-center text-medium">
                                  Select asset to send
                                </div>
                                <div
                                  className="hover:cursor-pointer"
                                  onClick={() => {
                                    setIsDropDownOpen(false)
                                  }}
                                >
                                  X
                                </div>
                              </div>
                              <div className="flex flex-col keymanager:flex-row justify-between gap-4">
                                <TokenType tokenType={tokenType} setTokenType={setTokenType} />
                                <SearchBar
                                  placeholder="search tokens..."
                                  onSearch={(value) => setSearchQuery(value)}
                                />
                              </div>
                              <div className="flex flex-col gap-2 h-[400px] overflow-y-auto">
                                {tokenType === "LSP7"
                                  ? filteredLSP7Tokens.map((token, index) => (
                                    <div
                                      key={index}
                                      className="flex w-full justify-between items-center border-b border-darkBlue border-opacity-25 pr-6 hover:cursor-pointer"
                                      onClick={() => {
                                        setIsDropDownOpen(false)
                                        setSelectedAsset((prevState) => ({
                                          ...prevState,
                                          Name: token.Name,
                                          Address: token.Address,
                                          TokenAmount: token.TokenAmount
                                        }))
                                        setIsNFTSelected(false)
                                      }}
                                    >
                                      <div className="flex cursor-pointer px-2 py-4 transition">
                                        {token.Name}
                                      </div>
                                      <div>{Number(token.TokenAmount).toFixed(2)}</div>
                                    </div>
                                  ))
                                  : filteredLSP8Tokens.flatMap((token, index) =>
                                    token.TokenID.map((tokenId, tokenIdIndex) => (
                                      <div
                                        key={`${index}-${tokenIdIndex}`}
                                        className="flex w-full justify-between items-center border-b border-lightPink border-opacity-25 pr-6 hover:cursor-pointer"
                                        onClick={() => {
                                          setIsDropDownOpen(false)
                                          setSelectedAsset((prevState) => ({
                                            ...prevState,
                                            Address: token.Address,
                                            Name: token.Name,
                                            TokenID: [tokenId]
                                          }))
                                          setSelectedTokenId(tokenId)
                                          setIsNFTSelected(true)
                                        }}
                                      >
                                        <div className="flex cursor-pointer px-2 py-4 transition border-b border-lightPink border-opacity-25">
                                          {`${token.Name} - Token ID ${tokenId}`}
                                        </div>
                                      </div>
                                    ))
                                  )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                            <div className="bg-background p-4 max-w-md w-full rounded-10 shadow">
                              No assets...
                            </div>
                          </div>
                        ))}
                    </div>

                    <div
                      className={`flex flex-col gap-2 ${isNFTSelected ? "pointer-events-none opacity-50" : "opacity-100"}`}
                    >
                      <h1 className="text-darkBlue font-bold">Amount</h1>
                      <input
                        type="number"
                        placeholder="Enter amount..."
                        onChange={(e) => {
                          setSendAmount(e.target.value)
                        }}
                        className="border border-darkBlue border-opacity-50 focus:outline-purple px-4 text-xsmall rounded-10 py-4"
                      />
                      <div className="text-darkBlue text-sm pt-2">
                        Balance: {Number(selectedAsset.TokenAmount).toFixed(2)}
                      </div>
                    </div>

                    <div className="flex gap-2 items-center">
                      <div
                        onClick={() => {
                          setSafeTransfer(!safeTransfer)
                        }}
                        className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in"
                      >
                        <div
                          onChange={() => {
                            setSafeTransfer(!safeTransfer)
                          }}
                          className="toggle-checkbox absolute block rounded-15 w-5 h-5 rounded-full bg-white appearance-none cursor-pointer"
                          style={{
                            top: "2px",
                            left: safeTransfer ? "26px" : "2px",
                            transition: "left 0.2s"
                          }}
                        />
                        <label
                          className={`toggle-label block overflow-hidden h-6 w-12 rounded-full ${safeTransfer ? "bg-green bg-opacity-100" : "bg-black bg-opacity-20"} rounded-15 px-2 cursor-pointer`}
                          style={{ padding: "2px" }}
                        ></label>
                      </div>
                      <div className="text-xsmall text-darkBlue font-bold">Safe Transfer</div>
                      <Tooltip title="Allow transfer to non-Universal Profile addresses">
                        <Image src={tooltip} width={16} height={16} alt="Tooltip" />
                      </Tooltip>
                    </div>
                  </div>

                  <button
                    disabled={!everythingFilled}
                    onClick={transfer}
                    className={`w-full py-2 rounded-15 text-white bg-pink font-bold ${everythingFilled ? "hover:cursor-pointer" : "opacity-75 hover:cursor-not-allowed"}`}
                  >
                    Send
                  </button>
                </div>
              ) : (
                <div className="flex justify-center">
                  <ConnectButton />
                </div>
              )
            ) : isConnected ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <h1 className="text-darkBlue font-bold">Account</h1>
                  <input
                    type="text"
                    placeholder="Enter address..."
                    readOnly={true}
                    value={formatAddress(address || "0x0")}
                    className="border border-darkBlue border-opacity-50 focus:outline-purple px-4 text-xsmall rounded-10 py-4 pointer-events-none"
                  />
                </div>

                <div className="flex justify-center py-4 font-bold">
                  {address && <QRCode value={address} />}
                </div>
                <div
                  className="flex justify-center items-center gap-2 text-center py-2 rounded-15 bg-pink text-white hover:cursor-pointer"
                  onClick={() => {
                    copyToClipboard(address)
                    notify("Address Copied", NotificationType.Success)
                  }}
                >
                  {/*<Image src={copy} width={18} height={18} alt="Copy Address "/>*/}
                  <div>Copy Address</div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <ConnectButton />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Transfer
