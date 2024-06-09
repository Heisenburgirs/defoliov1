import { ethers } from "ethers"
import { useAccount } from "wagmi"
import LSP9Vault from "@lukso/lsp-smart-contracts/artifacts/LSP9Vault.json"
import UniversalProfile from "@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json"
import ERC725, { ERC725JSONSchema } from "@erc725/erc725.js"
import { VaultSchema } from "../schema/DeployedVaults"
import { VaultName } from "../schema/VaultName"
import { VaultDescription } from "../schema/VaultDescription"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import lightPurpleArrow from "@/public/icons/lightPurple_arrow.png"
import purpleArrow from "@/public/icons/purple_arrow.png"
import lightSettings from "@/public/icons/settings.png"
import settingsDark from "@/public/icons/settingsDark.png"
import TransactionModal from "../modal/TransactionModal"
import { NotificationType, notify } from "../toast/Toast"
import { useVault } from "@/GlobalContext/VaultContext/VaultContext"
import { formatAddress } from "@/app/utils/useFormatAddress"
import TokenType from "../tokentype/TokenType"
import SearchBar from "../searchbar/SearchBar"
import copy from "@/public/icons/copy.svg"
import externalLink from "@/public/icons/externalLink.svg"
import { copyToClipboard } from "@/app/utils/useCopyToCliptboard"
import LSP1UniversalReceiverDelegateVault from "@lukso/lsp-smart-contracts/artifacts/LSP1UniversalReceiverDelegateVault.json"
import { ERC725YDataKeys, PERMISSIONS } from "@lukso/lsp-smart-contracts/constants.js"
import { useKeymanager } from "@/GlobalContext/KeymanagerContext/KeymanagerContext"
import TransferVault from "../transfer/TransferVault"
import { useAssets } from "@/GlobalContext/AssetsContext/AssetsContext"
import refreshDark from "@/public/icons/refreshDark.png"
import refreshLight from "@/public/icons/refreshLight.png"

interface VaultObject {
  contract: string
  name: string
  desc: string
  tokenBalances: TokenBalances
  controllersPermissions: ControllerPermission[]
  changedPermissions: ControllerPermission[]
}

const Vault = () => {
  const { address, isConnected } = useAccount()
  const { vaults, setIndexVault } = useVault()
  const { setIndexAsset } = useAssets()
  const { setIndexKey } = useKeymanager()
  const [isLoading, setIsLoading] = useState(false)
  const [isSettingData, setIsSettingData] = useState(false)
  const [isSettingURD, setIsSettingURD] = useState(false)
  const [settings, setSettings] = useState(false)
  const [isSettingsUpdating, setIsSettingsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Settings
  const [updatedVaultName, setUpdatedVaultName] = useState<string>("")
  const [updatedVaultDesc, setUpdatedVaultDesc] = useState("")

  // Permissions for Vault
  const [isTransfer, setIsTransfer] = useState(false)

  const [addVault, setAddVault] = useState(false)
  const [hover, setHover] = useState(false)

  const [hasProvidedName, setHasProvidedName] = useState(false)
  const [hasProvidedDesc, setHasProvidedDesc] = useState(false)
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")

  const [isDeployingVault, setIsDeployingVault] = useState(false)
  const [transactionStep, setTransactionStep] = useState(1)

  const [isManage, setIsManage] = useState(false)
  const [tokenType, setTokenType] = useState<string>("LSP7")
  const [isDropdownVisible, setIsDropdownVisible] = useState<number | null>(null)
  const [balanceVisible, setBalanceVisible] = useState<boolean>(true)
  const [selectedVault, setSelectedVault] = useState<VaultObject>()

  const [searchQuery, setSearchQuery] = useState("")

  const filteredLSP7Tokens = selectedVault?.tokenBalances.LSP7.filter(
    (token) =>
      token.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.Symbol.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredLSP8Tokens = selectedVault?.tokenBalances.LSP8.filter(
    (token) =>
      token.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.Symbol.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const safeFilteredLSP7Tokens = filteredLSP7Tokens ?? []
  const safeFilteredLSP8Tokens = filteredLSP8Tokens ?? []

  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const [, forceRender] = useState(0)
  const handleDropdownClick = (index: number) => {
    if (index === isDropdownVisible) {
      setIsDropdownVisible(null) // Close if the same index is clicked
    } else {
      setIsDropdownVisible(index) // Open if a different index is clicked
    }
  }

  useEffect(() => {
    setHasProvidedName(!!name)
    setHasProvidedDesc(!!desc)
  }, [name, desc])

  const getData = async () => {
    console.log(vaults)
  }

  const deployVault = async () => {
    setIsDeployingVault(true)
    const provider = new ethers.providers.Web3Provider(window.lukso)
    const signer = provider.getSigner()
    const myUniversalProfile = new ethers.Contract(address || "", UniversalProfile.abi, signer)

    const vaultFactory = new ethers.ContractFactory(LSP9Vault.abi, LSP9Vault.bytecode)

    const erc725 = new ERC725(VaultSchema, address, "https://rpc.lukso.gateway.fm")

    const erc7255 = new ERC725(VaultName, address, "https://rpc.lukso.gateway.fm")

    const erc72555 = new ERC725(VaultDescription, address, "https://rpc.lukso.gateway.fm")

    const myErc725Contract = new ERC725(VaultSchema, address, "https://rpc.lukso.gateway.fm")

    const vaultURDFactory = new ethers.ContractFactory(
      LSP1UniversalReceiverDelegateVault.abi,
      LSP1UniversalReceiverDelegateVault.bytecode
    )

    try {
      const deployVault = await vaultFactory.connect(signer).deploy(address)

      // vault address
      const awaitVault = await deployVault.deployTransaction.wait()
      const vaultAddress = awaitVault.contractAddress
      console.log("Vault deployed: ", vaultAddress)

      try {
        setTransactionStep(2)
        const vaultURD = await vaultURDFactory.connect(signer).deploy()
        console.log("vaultURD", vaultURD)

        // URD address
        const awaitURD = await vaultURD.deployTransaction.wait()
        const URDaddress = awaitURD.contractAddress
        console.log("URDaddress", URDaddress)
        setIsSettingURD(true)

        // Deployed vault interface
        const vault = new ethers.Contract(vaultAddress, LSP9Vault.abi)

        // Encode
        const setDataCalldata = vault.interface.encodeFunctionData("setData", [
          ERC725YDataKeys.LSP1.LSP1UniversalReceiverDelegate,
          URDaddress
        ])
        console.log(setDataCalldata)

        const setURD = await myUniversalProfile.execute(0, vaultAddress, 0, setDataCalldata)

        console.log("setURD", setURD)

        try {
          setIsSettingData(true)

          const existingData = await myErc725Contract.fetchData("VaultsDeployed[]")

          let existingVaultsArray: string[]

          // Check if existingVaults is an array and handle accordingly
          if (Array.isArray(existingData.value)) {
            existingVaultsArray = existingData.value
          } else if (typeof existingData.value === "string") {
            // If it's a string, make it an array with that string as the only element
            existingVaultsArray = [existingData.value]
          } else {
            // If it's neither (or the data doesn't exist), start with an empty array
            existingVaultsArray = []
          }

          // Now existingVaultsArray is definitely an array, so we can spread it
          const updatedVaults = [...existingVaultsArray, vaultAddress]

          const data = erc725.encodeData([
            {
              keyName: "VaultsDeployed[]",
              value: updatedVaults
            }
          ])

          const data2 = erc7255.encodeData([
            {
              keyName: "VaultName:<address>",
              dynamicKeyParts: vaultAddress,
              value: name
            }
          ])

          const data3 = erc72555.encodeData([
            {
              keyName: "VaultDescription:<address>",
              dynamicKeyParts: vaultAddress,
              value: desc
            }
          ])

          // Assuming data, data2, and data3 are correctly encoded
          const allKeys = [...data.keys, ...data2.keys, ...data3.keys]
          const allValues = [...data.values, ...data2.values, ...data3.values]

          const setData = await myUniversalProfile.setDataBatch(allKeys, allValues)
          setTransactionStep(2)

          const txResult = await setData.wait()

          setIndexAsset(100)
          setIndexKey(100)
          setIndexVault(100)
          setTransactionStep(3)
        } catch (err) {
          // First, check if err is an object and has a 'code' property
          if (typeof err === "object" && err !== null && "code" in err) {
            // Now TypeScript knows err is an object and has a 'code' property
            const errorCode = (err as { code: unknown }).code
            if (errorCode === 4001) {
              // Handle user's rejection
              console.log("User declined the transaction")
              notify("Signature Declined", NotificationType.Error)
              setIsDeployingVault(false)
            } else {
              // Handle other errors
              console.log("ERROR SETTING DATA", err)
              setIsDeployingVault(true)
              notify("Error Setting Data", NotificationType.Error)
              setTransactionStep(4)
            }
          } else {
            // Handle the case where err is not an object or doesn't have 'code'
            console.log("ERROR SETTING DATA", err)
          }
        }
      } catch (err) {
        // First, check if err is an object and has a 'code' property
        if (typeof err === "object" && err !== null && "code" in err) {
          // Now TypeScript knows err is an object and has a 'code' property
          const errorCode = (err as { code: unknown }).code
          if (errorCode === 4001) {
            // Handle user's rejection
            console.log("User declined the transaction")
            notify("Signature Declined", NotificationType.Error)
            setIsDeployingVault(false)
          } else {
            // Handle other errors
            console.log("ERROR DEPLOYING URD", err)
            setIsDeployingVault(true)
            notify("Error Deploying URD", NotificationType.Error)
            setTransactionStep(4)
          }
        } else {
          // Handle the case where err is not an object or doesn't have 'code'
          console.log("ERROR DEPLOYING URD", err)
        }
      }
    } catch (err) {
      // First, check if err is an object and has a 'code' property
      if (typeof err === "object" && err !== null && "code" in err) {
        // Now TypeScript knows err is an object and has a 'code' property
        const errorCode = (err as { code: unknown }).code
        if (errorCode === 4001) {
          // Handle user's rejection
          console.log("User declined the transaction")
          notify("Signature Declined", NotificationType.Error)
          setIsDeployingVault(false)
        } else {
          // Handle other errors
          console.log("ERROR DEPLOYING VAULT", err)
          setIsDeployingVault(true)
          notify("Error Deploying Vault", NotificationType.Error)
          setTransactionStep(4)
        }
      } else {
        // Handle the case where err is not an object or doesn't have 'code'
        console.log("ERROR DEPLOYING VAULT", err)
      }
    }
  }

  const updateProfile = async (vaultAddress: string) => {
    const erc7255 = new ERC725(VaultName, address, "https://rpc.lukso.gateway.fm")

    const erc72555 = new ERC725(VaultDescription, address, "https://rpc.lukso.gateway.fm")

    let allKeys: string[] = []
    let allValues: string[] = []

    // Encode the vault name data if updatedVaultName is not empty
    if (updatedVaultName) {
      const data2 = erc7255.encodeData([
        {
          keyName: "VaultName:<address>",
          dynamicKeyParts: vaultAddress,
          value: updatedVaultName
        }
      ])
      allKeys = [...allKeys, ...data2.keys]
      allValues = [...allValues, ...data2.values]
    }

    // Encode the vault description data if updatedVaultDesc is not empty
    if (updatedVaultDesc) {
      const data3 = erc72555.encodeData([
        {
          keyName: "VaultDescription:<address>",
          dynamicKeyParts: vaultAddress,
          value: updatedVaultDesc
        }
      ])
      allKeys = [...allKeys, ...data3.keys]
      allValues = [...allValues, ...data3.values]
    }

    const provider = new ethers.providers.Web3Provider(window.lukso)
    const signer = provider.getSigner()
    const myUniversalProfile = new ethers.Contract(address || "", UniversalProfile.abi, signer)

    setIsSettingsUpdating(true)

    try {
      if (allKeys.length > 0 && allValues.length > 0) {
        const setData = await myUniversalProfile.setDataBatch(allKeys, allValues)

        const txResult = await setData.wait()

        setIndexAsset(1020)
        setIndexKey(1020)
        setIndexVault(1200)
        setTransactionStep(3)
      } else {
        // Handle the case where neither name nor description is updated
        notify("No updates to apply", NotificationType.Error)
      }
    } catch (err) {
      // First, check if err is an object and has a 'code' property
      if (typeof err === "object" && err !== null && "code" in err) {
        // Now TypeScript knows err is an object and has a 'code' property
        const errorCode = (err as { code: unknown }).code
        if (errorCode === 4001) {
          // Handle user's rejection
          console.log("User declined the transaction")
          notify("Signature Declined", NotificationType.Error)
        } else {
          // Handle other errors
          console.log("ERROR SETTING METADATA", err)
          notify("Error Setting Metadata", NotificationType.Error)
          setTransactionStep(4)
        }
      }
    }
  }

  const deleteVault = async (vaultAddress: string) => {
    setIsDeleting(true)
    const erc725 = new ERC725(VaultSchema, address, "https://rpc.lukso.gateway.fm")

    const provider = new ethers.providers.Web3Provider(window.lukso)
    const signer = provider.getSigner()
    const myUniversalProfile = new ethers.Contract(address || "", UniversalProfile.abi, signer)
    const myErc725Contract = new ERC725(VaultSchema, address, "https://rpc.lukso.gateway.fm")

    const existingData = await myErc725Contract.fetchData("VaultsDeployed[]")

    let existingVaultsArray: string[]

    // Check if existingVaults is an array and handle accordingly
    if (Array.isArray(existingData.value)) {
      existingVaultsArray = existingData.value
    } else if (typeof existingData.value === "string") {
      // If it's a string, make it an array with that string as the only element
      existingVaultsArray = [existingData.value]
    } else {
      // If it's neither (or the data doesn't exist), start with an empty array
      existingVaultsArray = []
    }

    // Filter out the vaultAddress you want to remove
    const updatedVaults = existingVaultsArray.filter((address) => address !== vaultAddress)

    // Encode the data for updating the UP
    const data = erc725.encodeData([
      {
        keyName: "VaultsDeployed[]",
        value: updatedVaults
      }
    ])

    setIsSettingsUpdating(true)

    try {
      const setData = await myUniversalProfile.setDataBatch(data.keys, data.values)

      const txResult = await setData.wait()

      setIndexAsset(1070)
      setIndexKey(1070)
      setIndexVault(1080)
      setTransactionStep(3)
    } catch (err) {
      // First, check if err is an object and has a 'code' property
      if (typeof err === "object" && err !== null && "code" in err) {
        // Now TypeScript knows err is an object and has a 'code' property
        const errorCode = (err as { code: unknown }).code
        if (errorCode === 4001) {
          // Handle user's rejection
          console.log("User declined the transaction")
          notify("Signature Declined", NotificationType.Error)
        } else {
          // Handle other errors
          console.log("ERROR REMOVING VAULT", err)
          notify("Error Removing Vault", NotificationType.Error)
          setTransactionStep(4)
        }
      }
    }
  }

  return (
    <div className="flex w-full h-full bg-white shadow rounded-15">
      <div className="flex flex-col py-8 px-6 w-full h-full gap-12">
        {isManage ? (
          <>
            <title>Manage Vault</title>
            {!isSettingsUpdating && (
              <div
                className="flex gap-2 px-4 items-center text-lightPink hover:text-darkBlue hover:cursor-pointer transition text-small z-50"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={() => {
                  settings
                    ? setSettings(false)
                    : isTransfer
                      ? setIsTransfer(false)
                      : setIsManage(false)
                }}
              >
                <div className="transition ease-in-out duration-200">
                  <Image
                    src={hover ? purpleArrow : lightPurpleArrow}
                    width={24}
                    height={24}
                    alt="Back"
                    className="hover:cursor-pointer"
                  />
                </div>
                <div>Back</div>
              </div>
            )}
            {settings ? (
              isSettingsUpdating ? (
                <TransactionModal
                  successMsg={isDeleting ? "Vault Deleted" : "Vault Successfully Edited"}
                  onBackButtonClick={() => {
                    setIsSettingsUpdating(false)
                    setTransactionStep(1)
                    setSettings(false)
                  }}
                  transactionStep={transactionStep}
                  setTransactionStep={setTransactionStep}
                  message1={isDeleting ? "Deleting Vault" : "Editing Vault"}
                  message2={""}
                  message3="Transaction Successful"
                />
              ) : (
                <div className="flex w-full h-full flex-col pl-4 gap-12">
                  <div className="flex flex-col gap-8">
                    <h1 className="text-darkBlue font-bold text-large">Settings</h1>
                    <div className="flex flex-col gap-2">
                      <h1 className="text-lightPink font-bold">Name</h1>
                      <input
                        type="text"
                        placeholder={selectedVault?.name || "Enter name..."}
                        className="px-4 py-2 sm:w-[200px] base:w-[350px] md:w-[500px] border border-lightPink rounded-15 focus:outline-purple"
                        onChange={(e) => {
                          setUpdatedVaultName(e.target.value)
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h1 className="text-lightPink font-bold">Description</h1>
                      <textarea
                        placeholder={selectedVault?.desc || "Enter description..."}
                        className="px-4 py-2 sm:w-[200px] base:w-[350px] md:w-[500px] border border-lightPink rounded-15 focus:outline-purple"
                        onChange={(e) => {
                          setUpdatedVaultDesc(e.target.value)
                        }}
                      />
                    </div>
                    <button
                      onClick={() => {
                        updateProfile(selectedVault?.contract || "")
                      }}
                      className="text-lightPink border border-lightPink rounded-15 hover:cursor-pointer hover:bg-purple hover:text-white transition py-2 w-[150px]"
                    >
                      Update Profile
                    </button>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="text-small text-red font-bold">DANGER ZONE</div>
                    <div
                      onClick={() => {
                        deleteVault(selectedVault?.contract || "")
                      }}
                      className="text-red border border-red rounded-15 hover:bg-red hover:text-white hover:cursor-pointer transition w-[150px] py-2 px-4 text-center"
                    >
                      Delete Vault
                    </div>
                  </div>
                </div>
              )
            ) : isTransfer ? (
              <div className="mt-[-100px]">
                {selectedVault && <TransferVault selectedVault={selectedVault} />}
              </div>
            ) : (
              <div className="flex w-full h-full flex-col gap-8 px-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex w-full justify-between">
                      <div className="flex items-center gap-2">
                        <div className="text-darkBlue font-bold text-large">
                          {selectedVault?.name}
                        </div>
                        <div
                          className="transition ease-in-out duration-200 rotate-hover"
                          onClick={() => {
                            setIndexVault(5), setIndexAsset(5), setIndexKey(5), forceRender(2)
                          }}
                        >
                          <Image
                            src={hover ? refreshDark : refreshLight}
                            width={16}
                            height={16}
                            alt="Settings"
                            className="hover:cursor-pointer"
                          />
                        </div>
                      </div>
                      <div
                        className="flex gap-2 items-center text-lightPink hover:text-darkBlue hover:cursor-pointer transition text-small"
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                        onClick={() => {
                          setSettings(true)
                        }}
                      >
                        <div>Settings</div>
                        <div className="transition ease-in-out duration-200">
                          <Image
                            src={hover ? settingsDark : lightSettings}
                            width={16}
                            height={16}
                            alt="Settings"
                            className="hover:cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-darkBlue">{selectedVault?.desc}</div>
                  </div>
                  <div
                    className="flex gap-2 items-center hover:cursor-pointer opacity-75"
                    onClick={() => {
                      copyToClipboard(selectedVault?.contract)
                      notify("Vault Address Copied", NotificationType.Success)
                    }}
                  >
                    <div className="text-darkBlue">
                      {formatAddress(selectedVault?.contract || "")}
                    </div>
                    <Image src={copy} width={12} height={12} alt="Copy vault address" />
                  </div>
                </div>

                <>
                  <div className="flex sm:flex-col md:flex-row sm:gap-4 md:gap-0 w-full justify-between">
                    <div className="flex gap-4 sm:flex-col base:flex-row">
                      <TokenType tokenType={tokenType} setTokenType={setTokenType} />
                      <div
                        onClick={() => {
                          setIsTransfer(true)
                        }}
                        className="keymanager:hidden text-center py-2 px-4 text-lightPink border border-lightPink hover:bg-lightPink hover:text-white transition hover:cursor-pointer rounded-15"
                      >
                        Send & Receive
                      </div>
                    </div>
                    <div className="flex gap-4 sm:flex-col base:flex-row">
                      <button
                        onClick={() => {
                          setIsTransfer(true)
                        }}
                        className="sm:hidden keymanager:flex text-center py-2 px-4 text-lightPink border border-lightPink hover:bg-lightPink hover:text-white transition hover:cursor-pointer rounded-15"
                      >
                        Send & Receive
                      </button>
                      <SearchBar
                        placeholder="Search for a token..."
                        onSearch={(value) => setSearchQuery(value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col w-full gap-2">
                    <div className="border-b border-lightPink border-opacity-10 pb-2 hidden sm:table-header-group grid grid-cols-12">
                      <div className="grid sm:grid-cols-4 lg:grid-cols-12">
                        <div className="sm:col-span-2 base:col-span-1 lg:col-span-4 text-darkBlue font-normal opacity-75 flex">
                          Token
                        </div>
                        <div className="sm:hidden base:justify-end md:justify-center lg:justify-start base:flex sm:col-span-1 lg:col-span-4 text-darkBlue font-normal opacity-75">
                          Price
                        </div>
                        <div className="base:justify-end lg:justify-start sm:col-span-1 lg:col-span-3 text-darkBlue font-normal opacity-75 flex">
                          Balance
                        </div>
                        <div className="sm:col-span-1 lg:col-span-1"></div>
                      </div>
                    </div>

                    {!isConnected ? (
                      <div className="flex items-center justify-center py-8 text-lightPink text-small">
                        Connect to see assets
                      </div>
                    ) : isLoading ? (
                      <div className="loading opacity-75 w-full flex justify-center items-center p-16">
                        <span className="loading__dot"></span>
                        <span className="loading__dot"></span>
                        <span className="loading__dot"></span>
                      </div>
                    ) : (
                      (tokenType === "LSP7" ? safeFilteredLSP7Tokens : safeFilteredLSP8Tokens).map(
                        (token, index) => (
                          <div
                            key={index}
                            className="border-b border-lightPink border-opacity-10 pb-2 hidden sm:table-header-group grid grid-cols-12 py-2"
                          >
                            <div className="grid sm:grid-cols-4 lg:grid-cols-12 items-center">
                              <div className="flex items-center gap-4 sm:col-span-2 base:col-span-1 lg:col-span-4 text-darkBlue font-normal opacity-75">
                                <div className="flex flex-col">
                                  <div className="text-small font-bold">{token.Name}</div>
                                  <div className="text-xsmall opacity-75">{token.Symbol}</div>
                                </div>
                              </div>
                              <div className="base:justify-end md:justify-center lg:justify-start sm:hidden base:flex sm:col-span-1 lg:col-span-4 text-darkBlue font-normal opacity-75 flex">
                                <div className="font-bold">...</div>
                              </div>
                              <div className="flex flex-col base:items-end lg:items-start sm:col-span-1 lg:col-span-3 text-darkBlue font-normal opacity-75">
                                <div className="font-bold">
                                  {balanceVisible
                                    ? parseFloat(token.TokenAmount) % 1 === 0
                                      ? parseInt(token.TokenAmount, 10)
                                      : parseFloat(token.TokenAmount).toFixed(2)
                                    : "***"}
                                </div>
                              </div>
                              <div
                                onClick={() => handleDropdownClick(index)}
                                className="relative flex flex-col gap-2 sm:col-span-1 lg:col-span-1 pr-2 w-full items-end justify-end hover:cursor-pointer"
                              >
                                <div className="w-[3px] h-[3px] rounded-[99px] bg-lightPink bg-opacity-75"></div>
                                <div className="w-[3px] h-[3px] rounded-[99px] bg-lightPink bg-opacity-75"></div>
                                <div className="w-[3px] h-[3px] rounded-[99px] bg-lightPink bg-opacity-75"></div>
                                {index === isDropdownVisible && (
                                  <div
                                    ref={dropdownRef}
                                    className={`absolute top-0 w-[220px] flex flex-col gap-4 py-4 z-50 justify-center items-center bg-white shadow rounded-10 py-2 px-4 border border-lightPink border-opacity-25 mr-[-10px] mt-[35px]  ${isDropdownVisible === index ? "animate-popup-in" : "animate-popup-out"}`}
                                    style={{ animationFillMode: "forwards" }}
                                  >
                                    <div className="flex gap-4 justify-center items-center">
                                      <Image
                                        src={copy}
                                        width={18}
                                        height={18}
                                        alt="Copy Token Address"
                                        className="ml-[-20px]"
                                      />
                                      <button
                                        onClick={() => {
                                          copyToClipboard(token.Address), handleDropdownClick(index)
                                          notify("Address Copied", NotificationType.Success)
                                        }}
                                        className="text-xsmall text-lightPink"
                                      >
                                        Copy token address
                                      </button>
                                    </div>
                                    <div className="flex gap-4 justify-center items-center">
                                      <Image
                                        src={externalLink}
                                        width={18}
                                        height={18}
                                        alt="Copy Token Address"
                                      />
                                      <a
                                        href={`https://explorer.execution.mainnet.lukso.network/address/${token.Address}`}
                                        target="_blank"
                                        onClick={() => {
                                          handleDropdownClick(index)
                                        }}
                                        className="text-xsmall text-lightPink" rel="noreferrer"
                                      >
                                        View on block explorer
                                      </a>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      )
                    )}
                  </div>
                </>
              </div>
            )}
          </>
        ) : addVault ? (
          isDeployingVault ? (
            <TransactionModal
              successMsg="Vault Successfully Created"
              onBackButtonClick={() => {
                setIsDeployingVault(false)
                setTransactionStep(1)
                setAddVault(false)
              }}
              transactionStep={transactionStep}
              setTransactionStep={setTransactionStep}
              message1="Deploying Vault"
              message2={
                isSettingData
                  ? "Setting Data"
                  : isSettingURD
                    ? "Setting URD"
                    : "Deploying Universal Delegate"
              }
              message3="Transaction Successful"
            />
          ) : (
            <>
              <title>New Vault</title>
              <div
                className="flex gap-2 px-4 items-center text-lightPink hover:text-darkBlue hover:cursor-pointer transition text-small"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={() => {
                  setAddVault(false)
                }}
              >
                <div className="transition ease-in-out duration-200">
                  <Image
                    src={hover ? purpleArrow : lightPurpleArrow}
                    width={24}
                    height={24}
                    alt="Back"
                    className="hover:cursor-pointer"
                  />
                </div>
                <div>Back</div>
              </div>
              <div className="flex flex-col w-full h-full items-center py-8 gap-16">
                <h1 className="text-medium font-bold text-darkBlue">Deploy New Vault</h1>
                <div className="flex flex-col gap-6 w-[400px]">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-lightPink">Name</h2>
                    <input
                      type="text"
                      className="rounded-15 border border-lightPink focus:outline-purple py-2 px-6 text-darkBlue font-bold"
                      placeholder="Enter vault name..."
                      onChange={(e) => {
                        setName(e.target.value)
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-lightPink">Description</h2>
                    <textarea
                      className="h-[350px] rounded-15 border border-lightPink focus:outline-purple py-2 px-6 text-darkBlue font-bold"
                      placeholder="Enter vault description..."
                      onChange={(e) => {
                        setDesc(e.target.value)
                      }}
                    />
                  </div>
                </div>
                <button
                  className={`py-2 px-12 bg-lightPink bg-opacity-75 text-medium rounded-15 text-white transition
                      ${hasProvidedName && hasProvidedDesc ? "bg-purple bg-opacity-100" : "cursor-not-allowed opacity-50"}`}
                  onClick={deployVault}
                  disabled={!hasProvidedName || !hasProvidedDesc}
                >
                  Finalize Vault
                </button>
              </div>
            </>
          )
        ) : (
          <>
            <title>Vaults</title>
            <div className="flex w-full justify-between">
              <h1 className="text-medium text-darkBlue font-bold">Your Vaults</h1>
              <div
                onClick={() => {
                  if (isConnected) setAddVault(true)
                }}
                className="w-[135px] py-2 px-4 rounded-15 text-xsmall border border-lightPink text-darkBlue font-bold hover:cursor-pointer hover:bg-purple hover:text-white transition"
              >
                Create a Vault
              </div>
            </div>
            <div
              className={`flex w-full h-full sm:justify-items-center keymanager:justify-items-start grid  ${vaults && vaults.length === 0 ? "grid grid-cols-1" : " sm:grid-cols-1 keymanager:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"}`}
            >
              {vaults.map((vault, index) => (
                <div
                  key={index}
                  className="sm:w-[200px] lg:w-[250px] h-[250px] border border-lightPink rounded-15 py-6 px-4 flex flex-col justify-between"
                >
                  <div className="flex flex-col gap-2">
                    <div className="text-medium text-darkBlue font-bold">
                      {vault.name.substring(0, 12)}
                    </div>
                    <div
                      className="flex items-center gap-2 hover:cursor-pointer"
                      onClick={() => {
                        copyToClipboard(vault.contract)
                        notify("Vault Copied!", NotificationType.Success)
                      }}
                    >
                      <div className="text-darkBlue text-xsmall font-bold opacity-75">
                        {formatAddress(vault.contract)}
                      </div>
                      <Image src={copy} width={12} height={12} alt="Copy vault address" />
                    </div>
                    <div className="text-darkBlue text-xsmall font-bold opacity-75">
                      {vault.desc.substring(0, 55) + "..."}
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      setIsManage(true)
                      setSelectedVault(vault)
                    }}
                    className="w-full text-center py-2 rounded-15 border border-lightPink text-darkBlue hover:cursor-pointer hover:bg-lightPink hover:text-white transition"
                  >
                    Manage
                  </div>
                </div>
              ))}
              {vaults && vaults.length === 0 && (
                <div className="flex w-full py-8 text-lightPink font-bold justify-center items-center grid-cols-4">
                  No Vaults Deployed
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Vault
