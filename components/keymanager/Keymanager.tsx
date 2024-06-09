import React, { useState, useEffect } from "react"
import Image from "next/image"
import "../../app/globals.css"
import LSP6Schema from "@erc725/erc725.js/schemas/LSP6KeyManager.json"
import ERC725, { ERC725JSONSchema } from "@erc725/erc725.js"
import { useAccount } from "wagmi"
import { ToggleSwitch } from "../toggle/Toggle"
import { PopupButton } from "../popupButton/PopupButton"
import { formatAddress } from "@/app/utils/useFormatAddress"
import { isValidEthereumAddress } from "@/app/utils/useIsValidEthereumAddress"
import { ethers } from "ethers"
import UniversalProfile from "@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json"

import lightPurpleArrow from "@/public/icons/lightPurple_arrow.png"
import purpleArrow from "@/public/icons/purple_arrow.png"
import { notify, NotificationType } from "../toast/Toast"
import TransactionModal from "../modal/TransactionModal"
import { useKeymanager } from "@/GlobalContext/KeymanagerContext/KeymanagerContext"
import { useAssets } from "@/GlobalContext/AssetsContext/AssetsContext"
import { useVault } from "@/GlobalContext/VaultContext/VaultContext"

const Keymanager = () => {
  const { address, isConnected } = useAccount()
  const [hover, setHover] = useState(false)
  const [isAdditionInitiated, setIsAdditionInitiated] = useState(false)
  const [isChangePermissionInitiated, setIsChangePermissionInitiated] = useState(false)
  const [transactionStep, setTransactionStep] = useState(1)

  const {
    controllersPermissions,
    changedPermissions,
    isLoading,
    setControllersPermissions,
    setChangedPermissions,
    setIndexKey
  } = useKeymanager()
  const { vaults, setIndexVault } = useVault()
  const { setIndexAsset } = useAssets()

  // Manage controllers
  const [visibilityStates, setVisibilityStates] = useState<VisibilityState>({})
  const [dropdownVisible, setDropdownVisible] = useState<Record<string, boolean>>({})

  const [arePermissionsChanged, setArePermissionsChanged] = useState(false)
  const [controllerAddresses, setControllerAddresses] = useState<
    { address: string; permissions: string[] }[]
  >([])

  const togglePermissionsDropdown = (controllerAddress: string) => {
    if (visibilityStates[controllerAddress]) {
      // Start closing animation immediately
      setDropdownVisible((prev) => ({ ...prev, [controllerAddress]: false }))

      // Delay hiding the dropdown until animation completes
      setTimeout(() => {
        setVisibilityStates((prevStates) => ({
          ...prevStates,
          [controllerAddress]: false
        }))
      }, 500) // 500ms matches the duration of the 'conceal' animation
    } else {
      // Open dropdown immediately and start opening animation
      setVisibilityStates((prevStates) => ({
        ...prevStates,
        [controllerAddress]: true
      }))
      setDropdownVisible((prev) => ({ ...prev, [controllerAddress]: true }))
    }
  }

  const updatePermission = (controllerAddress: string, permissionKey: string) => {
    setArePermissionsChanged(true)

    setChangedPermissions2((currentPermissions) =>
      currentPermissions.map((controller) => {
        if (controller.address === controllerAddress) {
          // Update the permissions
          const updatedPermissions = {
            ...controller.permissions,
            // @ts-ignore
            [permissionKey]: !controller.permissions[permissionKey]
          }

          return { ...controller, permissions: updatedPermissions, isChanged: true }
        }
        return controller
      })
    )

    setControllerAddresses((currentAddresses) => {
      const addressIndex = currentAddresses.findIndex((c) => c.address === controllerAddress)

      if (addressIndex > -1) {
        // Address exists, update permissions
        let updatedPermissions = [...currentAddresses[addressIndex].permissions]
        const permissionExists = updatedPermissions.includes(permissionKey)

        if (permissionExists) {
          // Remove the permission
          updatedPermissions = updatedPermissions.filter((key) => key !== permissionKey)
        } else {
          // Add the permission
          updatedPermissions.push(permissionKey)
        }

        if (updatedPermissions.length === 0) {
          // If no permissions left, remove the address
          return [
            ...currentAddresses.slice(0, addressIndex),
            ...currentAddresses.slice(addressIndex + 1)
          ]
        } else {
          // Update the address with modified permissions
          const updatedAddress = {
            ...currentAddresses[addressIndex],
            permissions: updatedPermissions
          }
          return [
            ...currentAddresses.slice(0, addressIndex),
            updatedAddress,
            ...currentAddresses.slice(addressIndex + 1)
          ]
        }
      } else {
        // Address does not exist, create a new entry
        const newAddress = { address: controllerAddress, permissions: [permissionKey] }
        return [...currentAddresses, newAddress]
      }
    })
  }

  useEffect(() => {
    if (controllerAddresses.length > 0) {
      setArePermissionsChanged(true)
    } else {
      setArePermissionsChanged(false)
    }
  }, [controllerAddresses])

  const handleReset = () => {
    // Clear everything from changedPermissions
    setTransactionStep(1)
    setChangedPermissions(controllersPermissions)
    setControllerAddresses([])
  }

  // Existing Controller Permissions
  const handleConfirm = async () => {
    setArePermissionsChanged(false)
    setIsChangePermissionInitiated(true)
    setTransactionStep(1)
    const erc725 = new ERC725(
      LSP6Schema as ERC725JSONSchema[],
      address,
      "https://rpc.lukso.gateway.fm"
    )

    const provider = new ethers.providers.Web3Provider(window.lukso)
    const signer = provider.getSigner()

    const myUniversalProfile = new ethers.Contract(address || "", UniversalProfile.abi, signer)

    const controllersWithChanges = changedPermissions.filter((controller) => controller.isChanged)

    console.log(controllersWithChanges)

    const encodedDataArray = controllersWithChanges.map((controller) => {
      // Encode the permissions for this controller
      const encodedPermissions = erc725.encodePermissions(controller.permissions)

      // Prepare the data for blockchain update
      const data = erc725.encodeData([
        {
          keyName: "AddressPermissions:Permissions:<address>",
          dynamicKeyParts: controller.address,
          value: encodedPermissions
        }
      ])

      return {
        address: controller.address,
        encodedData: data
      }
    })

    const allKeys = encodedDataArray.flatMap((item) => item.encodedData.keys)
    const allValues = encodedDataArray.flatMap((item) => item.encodedData.values)

    try {
      const tx = await myUniversalProfile.setDataBatch(allKeys, allValues)

      const receipt = await tx.wait()
      setTransactionStep(3)
      setIndexAsset(500)
      setIndexKey(5700)
      setIndexVault(7900)
      setArePermissionsChanged(false)
    } catch (err) {
      // First, check if err is an object and has a 'code' property
      if (typeof err === "object" && err !== null && "code" in err) {
        // Now TypeScript knows err is an object and has a 'code' property
        const errorCode = (err as { code: unknown }).code
        if (errorCode === 4001) {
          // Handle user's rejection
          console.log("User declined the transaction")
          notify("Signature Declined", NotificationType.Error)
          setIsChangePermissionInitiated(false)
        } else {
          // Handle other errors
          console.log("ERROR SETTING CONTROLLER", err)
          setIsChangePermissionInitiated(true)
          notify("Error Setting Controller", NotificationType.Error)
          setTransactionStep(4)
        }
      } else {
        // Handle the case where err is not an object or doesn't have 'code'
        console.log("An unexpected error occurred", err)
        setTransactionStep(4)
      }
    }
  }

  // Dynamic render of permissions
  const menuItems: string[] = [
    "Add Controller",
    "Add Extensions",
    "Call",
    "Change Extensions",
    "Change Owner",
    "Decrypt",
    "Delegate Call",
    "Deploy",
    "Edit Permissions",
    "Ecnrypt",
    "Eexecute Relay Call",
    "Reentrancy",
    "Set Data",
    "Sign",
    "Static Call",
    "Super Call",
    "Super Delegate Call",
    "Super Set Data",
    "Super Static Call",
    "Super Transfer Value",
    "Transfer Value",
    "Add Universal Receiver Delegate",
    "Change Universal Receiver Delegate"
  ]

  const menuItemsDescriptions: string[] = [
    "Allow adding new controllers to manage the wallet.",
    "Permit the addition of extensions to enhance wallet functionality.",
    "Authorize interactions with other smart contracts, enabling changes to them.",
    "Grant the ability to modify or replace existing wallet extensions.",
    "Enable the transfer of ownership rights of the wallet to another address.",
    "Allow decryption of encrypted messages using the wallet's keys.",
    "Permit running code from any smart contract inside the wallet's environment.",
    "Enable deploying new smart contracts from the wallet.",
    "Grant authority to modify the permissions of other controllers.",
    "Allow encryption of messages using the wallet's keys.",
    "Enable execution of relay calls for advanced transaction handling.",
    "Allow successive executions, possibly in the context of smart contracts.",
    "Permit modification or setting of data within the wallet or its associated contracts.",
    "Enable the wallet to connect or sign messages, proving identity or consent.",
    "Allow interactions with smart contracts in a read-only mode, without making changes.",
    "Grant enhanced calling capabilities, potentially with elevated privileges.",
    "Allow high-level delegate calls with more extensive authority.",
    "Enable advanced data setting capabilities, possibly with wider scope.",
    "Permit advanced read-only interactions with smart contracts.",
    "Allow transfer of value or assets with elevated permissions.",
    "Enable the transfer of native tokens or assets from the wallet.",
    "Allow addition of delegates for universal receiver functionality.",
    "Permit modifications to the delegates of the universal receiver."
  ]

  const permissionMapping = {
    ADDCONTROLLER: "Add Controller",
    ADDEXTENSIONS: "Add Extensions",
    ADDUNIVERSALRECEIVERDELEGATE: "Add Universal Receiver Delegate",
    CALL: "Call",
    CHANGEEXTENSIONS: "Change Extensions",
    CHANGEOWNER: "Change Owner",
    CHANGEUNIVERSALRECEIVERDELEGATE: "Change Universal Receiver Delegate",
    DECRYPT: "Decrypt",
    DELEGATECALL: "Delegate Call",
    DEPLOY: "Deploy",
    EDITPERMISSIONS: "Edit Permissions",
    ENCRYPT: "Ecnrypt",
    EXECUTE_RELAY_CALL: "Eexecute Relay Call",
    REENTRANCY: "Reentrancy",
    SETDATA: "Set Data",
    SIGN: "Sign",
    STATICCALL: "Static Call",
    SUPER_CALL: "Super Call",
    SUPER_DELEGATECALL: "Super Delegate Call",
    SUPER_SETDATA: "Super Set Data",
    SUPER_STATICCALL: "Super Static Call",
    SUPER_TRANSFERVALUE: "Super Transfer Value",
    TRANSFERVALUE: "Transfer Value"
  }

  const chunkSizeOptions = [
    [4, 4, 5, 5, 3, 2],
    [3, 3, 3, 3, 2, 2, 2, 2, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ]

  const getChunkSizesForScreenSize = () => {
    if (window.innerWidth <= 500) {
      return chunkSizeOptions[2]
    } else if (window.innerWidth <= 768) {
      return chunkSizeOptions[1]
    } else if (window.innerWidth <= 2920) {
      return chunkSizeOptions[0]
    }

    return chunkSizeOptions[0]
  }

  const [chunkSizes, setChunkSizes] = useState(getChunkSizesForScreenSize())

  useEffect(() => {
    const handleResize = () => {
      setChunkSizes(getChunkSizesForScreenSize())
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [window.innerWidth])

  const dynamicChunkArray = (array: string[], sizes: number[]): string[][] => {
    let index = 0
    return sizes.map((size) => {
      const chunk = array.slice(index, index + size)
      index += size
      return chunk
    })
  }

  const chunkedMenuItems = dynamicChunkArray(menuItems, chunkSizes)

  type PermissionKey = keyof typeof permissionMapping

  const selectPermissions = (permission: string) => {
    setSelectedPermissions((prevSelected) => {
      // Find the key in permissionMapping that corresponds to the selected permission
      const permissionKey = Object.keys(permissionMapping).find(
        (key) => permissionMapping[key as PermissionKey] === permission
      ) as PermissionKey | undefined

      if (!permissionKey) {
        // If there is no corresponding key, return the previous state
        return prevSelected
      }

      if (prevSelected.includes(permissionKey)) {
        // Remove the key if it's already selected
        return prevSelected.filter((item) => item !== permissionKey)
      } else {
        // Add the key if it's not already selected
        return [...prevSelected, permissionKey]
      }
    })
  }

  // Add New Controller
  const [addController, setAddController] = useState<boolean>(false)
  const [hasProvidedAddress, setHasProvidedAddress] = useState<boolean>(false)
  const [inputAddress, setInputAddress] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  const addNewController = async () => {
    // Check if the input address is already a controller
    const isAlreadyController = controllersPermissions.some(
      (controller) => controller.address === inputAddress
    )

    if (isAlreadyController) {
      notify("Address Already Controller", NotificationType.Error)
      return
    }

    if (selectedPermissions.length === 0) {
      notify("Select Permission", NotificationType.Error)
      return
    }

    setIsAdditionInitiated(true)

    const provider = new ethers.providers.Web3Provider(window.lukso)
    const signer = provider.getSigner()

    const erc725 = new ERC725(
      LSP6Schema as ERC725JSONSchema[],
      address,
      "https://rpc.lukso.gateway.fm"
    )

    // Create an object with these keys, each set to true
    const permissionsObject = selectedPermissions.reduce<PermissionsEncoded>((acc, permission) => {
      acc[permission] = true
      return acc
    }, {})

    // Now encode the permissions using erc725.encodePermissions
    const beneficiaryPermissions = erc725.encodePermissions(permissionsObject)

    const addressPermissionsArray = await erc725.getData("AddressPermissions[]")
    const controllers = addressPermissionsArray.value

    if (!Array.isArray(controllers)) {
      notify("Unexpected Error", NotificationType.Error)
      throw new Error("Controllers is not an array")
    }

    const permissionData = erc725.encodeData([
      // the permission of the beneficiary address
      {
        keyName: "AddressPermissions:Permissions:<address>",
        dynamicKeyParts: inputAddress,
        value: beneficiaryPermissions
      },
      // the new list controllers addresses (= addresses with permissions set on the UP)
      // + the incremented `AddressPermissions[]` array length
      {
        keyName: "AddressPermissions[]",
        // @ts-ignore
        value: [...controllers, inputAddress]
      }
    ])

    //@ts-ignore
    const myUniversalProfile = new ethers.Contract(address, UniversalProfile.abi, signer)

    try {
      const tx = await myUniversalProfile.setDataBatch(permissionData.keys, permissionData.values)
      setTransactionStep(2)

      const receipt = await tx.wait()
      setTransactionStep(3)
      setSelectedPermissions([""])
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
          setIsAdditionInitiated(false)
          setSelectedPermissions([""])
        } else {
          // Handle other errors
          console.log("ERROR SETTING CONTROLLER", err)
          setIsAdditionInitiated(true)
          notify("Error Setting Controller", NotificationType.Error)
          setTransactionStep(4)
          setSelectedPermissions([""])
        }
      } else {
        // Handle the case where err is not an object or doesn't have 'code'
        console.log("An unexpected error occurred", err)
        setSelectedPermissions([""])
        setTransactionStep(4)
      }
    }
  }

  // Dummy data

  const [changedPermissions2, setChangedPermissions2] = useState([
    {
      address: "0x1111111111111111111111111111111111111111",
      permissions: {
        ADDCONTROLLER: true,
        ADDEXTENSIONS: true,
        ADDUNIVERSALRECEIVERDELEGATE: false,
        CALL: true,
        CHANGEEXTENSIONS: false,
        CHANGEOWNER: false,
        CHANGEUNIVERSALRECEIVERDELEGATE: false,
        DECRYPT: false,
        DELEGATECALL: true,
        DEPLOY: true,
        EDITPERMISSIONS: false,
        ENCRYPT: true,
        EXECUTE_RELAY_CALL: false,
        REENTRANCY: false,
        SETDATA: true,
        SIGN: false,
        STATICCALL: false,
        SUPER_CALL: true,
        SUPER_DELEGATECALL: true,
        SUPER_SETDATA: false,
        SUPER_STATICCALL: true,
        SUPER_TRANSFERVALUE: true,
        TRANSFERVALUE: true
      },
      isChanged: true
    },
    {
      address: "0x2222222222222222222222222222222222222222",
      permissions: {
        ADDCONTROLLER: false,
        ADDEXTENSIONS: true,
        ADDUNIVERSALRECEIVERDELEGATE: false,
        CALL: true,
        CHANGEEXTENSIONS: true,
        CHANGEOWNER: false,
        CHANGEUNIVERSALRECEIVERDELEGATE: false,
        DECRYPT: true,
        DELEGATECALL: false,
        DEPLOY: true,
        EDITPERMISSIONS: true,
        ENCRYPT: false,
        EXECUTE_RELAY_CALL: false,
        REENTRANCY: true,
        SETDATA: false,
        SIGN: true,
        STATICCALL: true,
        SUPER_CALL: false,
        SUPER_DELEGATECALL: true,
        SUPER_SETDATA: false,
        SUPER_STATICCALL: false,
        SUPER_TRANSFERVALUE: true,
        TRANSFERVALUE: false
      },
      isChanged: false
    },
    {
      address: "0x3333333333333333333333333333333333333333",
      permissions: {
        ADDCONTROLLER: false,
        ADDEXTENSIONS: false,
        ADDUNIVERSALRECEIVERDELEGATE: true,
        CALL: false,
        CHANGEEXTENSIONS: true,
        CHANGEOWNER: false,
        CHANGEUNIVERSALRECEIVERDELEGATE: false,
        DECRYPT: true,
        DELEGATECALL: false,
        DEPLOY: false,
        EDITPERMISSIONS: true,
        ENCRYPT: false,
        EXECUTE_RELAY_CALL: true,
        REENTRANCY: true,
        SETDATA: false,
        SIGN: false,
        STATICCALL: false,
        SUPER_CALL: true,
        SUPER_DELEGATECALL: false,
        SUPER_SETDATA: true,
        SUPER_STATICCALL: false,
        SUPER_TRANSFERVALUE: false,
        TRANSFERVALUE: true
      },
      isChanged: true
    }
  ])

  return (
    <div
      className={"flex flex-col gap-6 h-full bg-white rounded-15 shadow px-6 py-8 overflow-auto hide-scrollbar"}
    >
      {addController ? (
        isAdditionInitiated ? (
          <TransactionModal
            successMsg="Controller Successfuly Set"
            onBackButtonClick={() => {
              setAddController(false)
            }}
            transactionStep={transactionStep}
            setTransactionStep={setTransactionStep}
            message1="Waiting for Confirmation"
            message2="Transaction Submitted"
            message3="Transaction Successful"
          />
        ) : (
          <>
            <div
              className="flex gap-2 px-4 items-center text-darkBlue hover:text-lightPink hover:cursor-pointer transition text-small"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onClick={() => {
                setAddController(false)
              }}
            >
              <div className="transition ease-in-out duration-200">
                {/*<Image 
                  src={hover ? purpleArrow : lightPurpleArrow} 
                  width={24} 
                  height={24} 
                  alt="Back"
                  className="hover:cursor-pointer"
                />*/}
              </div>
              <div>← Back</div>
            </div>
            <div className="flex flex-col py-6 sm:px-2 lg:px-16 gap-16 justify-center items-center">
              <div className="flex flex-col gap-4 justify-center items-center">
                <div className="text-darkBlue font-bold text-medium">Add New Controller</div>
                <div className="text-darkBlue text-medium text-center">
                  Choose permissions you wish this controller to have on your Universal Profile
                </div>
              </div>
              <input
                type="text"
                placeholder="Enter address..."
                className="px-4 py-2 sm:w-[200px] base:w-[350px] md:w-[500px] border border-darkBlue rounded-15 focus:outline-purple"
                onChange={(e) => {
                  setInputAddress(e.target.value)
                  setHasProvidedAddress(isValidEthereumAddress(e.target.value))
                }}
              />
              <div className="flex w-full flex-col gap-4 items-center justify-center">
                {chunkedMenuItems.map((chunk, chunkIndex) => (
                  <div key={chunkIndex} className="flex gap-2">
                    {chunk.map((item, itemIndex) => {
                      // Find the key in permissionMapping that corresponds to the display value
                      const permissionKey = Object.keys(permissionMapping).find(
                        (key) => permissionMapping[key as PermissionKey] === item
                      )

                      // Check if this key is in the selectedPermissions array
                      const isSelected =
                        permissionKey &&
                        selectedPermissions.includes(permissionKey as PermissionKey)

                      return (
                        <div
                          key={itemIndex}
                          className={`py-2 px-4 border border-darkBlue text-darkBlue hover:bg-purple hover:text-white hover:bg-pink hover:border-pink hover:cursor-pointer rounded-15 text-xsmall transition ${isSelected && "bg-pink text-white border-pink opacity-100"}`}
                          onClick={() => selectPermissions(item)}
                        >
                          {item}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
              <button
                className={`py-2 px-6 bg-lightPink bg-opacity-75 text-medium rounded-15 text-white transition
                  ${hasProvidedAddress ? "bg-purple bg-opacity-100" : "cursor-not-allowed opacity-50"}`}
                onClick={addNewController}
                disabled={!hasProvidedAddress}
              >
                Finalize Controller
              </button>
            </div>
          </>
        )
      ) : isChangePermissionInitiated ? (
        <TransactionModal
          successMsg="Controller Successfuly Updated"
          onBackButtonClick={() => {
            setIsChangePermissionInitiated(false)
          }}
          transactionStep={transactionStep}
          setTransactionStep={setTransactionStep}
          message1="Waiting for Confirmation"
          message2="Transaction Submitted"
          message3="Transaction Successful"
        />
      ) : (
        <>
          <div className="flex sm:gap-4 keymanager:gap-0 sm:flex-col keymanager:flex-row w-full keymanager:justify-between keymanager:items-center">
            <div className="flex flex-col gap-2">
              <div className="text-medium font-bold text-darkBlue">Controller Permissions</div>
              <div className="sm:text-xsmall md:text-small text-darkBlue opacity-90">
                Remove, add and manage controller permissions
              </div>
            </div>
            <div
              onClick={() => {
                if (isConnected) setAddController(true)
              }}
              className="w-[135px] py-2 px-4 rounded-50 text-center text-small border border-darkBlue text-darkBlue font-bold hover:cursor-pointer hover:bg-darkBlue hover:text-white transition"
            >
              Add Controller
            </div>
          </div>
          <PopupButton
            isVisible={arePermissionsChanged}
            onReset={handleReset}
            onConfirm={handleConfirm}
            controllerAddresses={controllerAddresses.map((controller) => controller.address)}
          />
          <div className="flex flex-col w-full gap-2">
            <div className="border-b border-lightPink border-opacity-10 pb-2 hidden sm:table-header-group grid grid-cols-12">
              <div className="flex w-full justify-between items-center">
                <div className="text-darkBlue font-bold flex opacity-75">Controllers</div>
                <div className="text-darkBlue font-bold flex opacity-75">Permissions</div>
              </div>
            </div>

            {isLoading ? (
              <div className="loading opacity-75 w-full flex justify-center items-center p-16">
                <span className="loading__dot"></span>
                <span className="loading__dot"></span>
                <span className="loading__dot"></span>
              </div>
            ) : (
              changedPermissions2.map((controller, index) => (
                <div
                  key={index}
                  className="hidden sm:table-header-group grid grid-cols-12 border border-lightPink border-opacity-25 rounded-15 py-2 px-4"
                >
                  <div className="flex w-full justify-between items-center py-2">
                    <div className="flex items-center gap-4 sm:col-span-2 base:col-span-1 lg:col-span-5 text-darkBlue font-normal">
                      <div className="text-small font-bold">
                        {formatAddress(controller.address)}
                      </div>
                    </div>
                    <div className="sm:col-span-1 lg:col-span-4 text-darkBlue font-normal flex">
                      <div
                        onClick={() => {
                          togglePermissionsDropdown(controller.address)
                        }}
                        className="font-bold text-xsmall transition hover:cursor-pointer"
                      >
                        show more
                      </div>
                    </div>
                  </div>
                  {visibilityStates[controller.address] && (
                    <div
                      className={`flex w-full ${dropdownVisible[controller.address] ? "animate-reveal" : "animate-conceal"} py-4 transition sm:gap-4 md:gap-2 grid :grid-cols-1 keymanager:grid-cols-2 xl:grid-cols-3 text-xsmall overflow-y-auto hide-scrollbar`}
                      style={{ animationFillMode: "forwards" }}
                    >
                      <div className="flex flex-col gap-4 py-2">
                        <div className="font-bold text-[18px] text-darkBlue">Ownership</div>
                        <div className="flex flex-col justify-between gap-8 h-full">
                          <div className="flex gap-[10px] items-center">
                            <div className="flex flex-col sm:w-full md:w-[300px] gap-4 gap-[10px]">
                              <div className="flex w-full justify-between">
                                <span className="font-bold opacity-90 text-darkBlue text-xsmall">
                                  Change Owner
                                </span>
                                <ToggleSwitch
                                  isToggled={controller.permissions.CHANGEOWNER}
                                  onToggle={() =>
                                    updatePermission(controller.address, "CHANGEOWNER")
                                  }
                                  controllerAddress={controller.address}
                                  permissionKey="CHANGEOWNER"
                                />
                              </div>
                              <span className="opacity-75 text-darkBlue text-xxsmall">
                                Enable the transfer of ownership rights to another address
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-[10px] items-center">
                            <div className="flex flex-col sm:w-full md:w-[300px] gap-4 gap-[10px]">
                              <div className="flex w-full justify-between">
                                <span className="font-bold opacity-90 rounded-50 text-center text-small">
                                  Add Controller
                                </span>
                                <ToggleSwitch
                                  isToggled={controller.permissions.ADDCONTROLLER}
                                  onToggle={() =>
                                    updatePermission(controller.address, "ADDCONTROLLER")
                                  }
                                  controllerAddress={controller.address}
                                  permissionKey="ADDCONTROLLER"
                                />
                              </div>
                              <span className="opacity-75 text-darkBlue text-xxsmall">
                                Allow adding new controllers to manage the wallet
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-[10px] items-center">
                            <div className="flex flex-col sm:w-full md:w-[300px] gap-4 gap-[10px]">
                              <div className="flex w-full justify-between">
                                <span className="font-bold opacity-90 text-darkBlue text-xsmall">
                                  Edit Permissions
                                </span>
                                <ToggleSwitch
                                  isToggled={controller.permissions.EDITPERMISSIONS}
                                  onToggle={() =>
                                    updatePermission(controller.address, "EDITPERMISSIONS")
                                  }
                                  controllerAddress={controller.address}
                                  permissionKey="EDITPERMISSIONS"
                                />
                              </div>
                              <span className="opacity-75 text-darkBlue text-xxsmall">
                                Grant authority to modify the permissions of other controllers
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4 py-2">
                        <div className="font-bold text-[18px] text-darkBlue">Signature</div>
                        <div className="flex flex-col keymanager:h-full keymanager:justify-between gap-4">
                          <div className="flex flex-col sm:w-full md:w-[300px] gap-4 gap-[10px]">
                            <div className="flex w-full justify-between">
                              <span className="font-bold opacity-90 text-darkBlue text-xsmall">
                                Encrypt
                              </span>
                              <ToggleSwitch
                                isToggled={controller.permissions.ENCRYPT}
                                onToggle={() => updatePermission(controller.address, "ENCRYPT")}
                                controllerAddress={controller.address}
                                permissionKey="ENCRYPT"
                              />
                            </div>
                            <span className="opacity-75 text-darkBlue text-xxsmall">
                              Allow encryption of messages using the wallet&apos;s keys
                            </span>
                          </div>
                          <div className="flex flex-col sm:w-full md:w-[300px] gap-4 gap-[10px]">
                            <div className="flex w-full justify-between">
                              <span className="font-bold opacity-90 text-darkBlue text-xsmall">
                                Decrypt
                              </span>
                              <ToggleSwitch
                                isToggled={controller.permissions.DECRYPT}
                                onToggle={() => updatePermission(controller.address, "DECRYPT")}
                                controllerAddress={controller.address}
                                permissionKey="DECRYPT"
                              />
                            </div>
                            <span className="opacity-75 text-darkBlue text-xxsmall">
                              Allow decryption of encrypted messages using the wallet&apos;s keys
                            </span>
                          </div>
                          <div className="flex flex-col sm:w-full md:w-[300px] gap-4 gap-[10px]">
                            <div className="flex w-full justify-between">
                              <span className="font-bold opacity-90 text-darkBlue text-xsmall">
                                Sign
                              </span>
                              <ToggleSwitch
                                isToggled={controller.permissions.SIGN}
                                onToggle={() => updatePermission(controller.address, "SIGN")}
                                controllerAddress={controller.address}
                                permissionKey="SIGN"
                              />
                            </div>
                            <span className="opacity-75 text-darkBlue text-xxsmall">
                              Enable the wallet to sign messages, proving identity/consent
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4 py-2">
                        <div className="font-bold text-[18px] text-darkBlue">Asset Management</div>
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col sm:w-full md:w-[300px] gap-4 gap-[10px]">
                            <div className="flex w-full justify-between">
                              <span className="font-bold opacity-90 text-darkBlue text-xsmall">
                                Super Transfer Value
                              </span>
                              <ToggleSwitch
                                isToggled={controller.permissions.SUPER_TRANSFERVALUE}
                                onToggle={() =>
                                  updatePermission(controller.address, "SUPER_TRANSFERVALUE")
                                }
                                controllerAddress={controller.address}
                                permissionKey="SUPER_TRANSFERVALUE"
                              />
                            </div>
                            <span className="opacity-75 text-darkBlue text-xxsmall">
                              Allow transfer of value or assets with elevated permissions
                            </span>
                          </div>
                          <div className="flex flex-col sm:w-full md:w-[300px] gap-4 gap-[10px]">
                            <div className="flex w-full justify-between">
                              <span className="font-bold opacity-90 text-darkBlue text-xsmall">
                                Transfer Value
                              </span>
                              <ToggleSwitch
                                isToggled={controller.permissions.TRANSFERVALUE}
                                onToggle={() =>
                                  updatePermission(controller.address, "TRANSFERVALUE")
                                }
                                controllerAddress={controller.address}
                                permissionKey="TRANSFERVALUE"
                              />
                            </div>
                            <span className="opacity-75 text-darkBlue text-xxsmall">
                              Enable the transfer of native tokens or assets from the wallet
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4 py-2">
                        <div className="font-bold text-[18px] text-darkBlue">Calls</div>
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col sm:w-full md:w-[300px] gap-4 gap-[10px]">
                            <div className="flex w-full justify-between">
                              <span className="font-bold opacity-90 text-darkBlue text-xsmall">
                                Super Call
                              </span>
                              <ToggleSwitch
                                isToggled={controller.permissions.SUPER_CALL}
                                onToggle={() => updatePermission(controller.address, "SUPER_CALL")}
                                controllerAddress={controller.address}
                                permissionKey="SUPER_CALL"
                              />
                            </div>
                            <span className="opacity-75 text-darkBlue text-xxsmall">
                              Grant enhanced calling capabilities, potentially with elevated
                              privileges
                            </span>
                          </div>
                          <div className="flex flex-col sm:w-full md:w-[300px] gap-4 gap-[10px]">
                            <div className="flex w-full justify-between">
                              <span className="font-bold opacity-90 text-darkBlue text-xsmall">
                                Call
                              </span>
                              <ToggleSwitch
                                isToggled={controller.permissions.CALL}
                                onToggle={() => updatePermission(controller.address, "CALL")}
                                controllerAddress={controller.address}
                                permissionKey="CALL"
                              />
                            </div>
                            <span className="opacity-75 text-darkBlue text-xxsmall">
                              Authorize interactions with other smart contracts, enabling changes to
                              them
                            </span>
                          </div>
                          <div className="flex flex-col sm:w-full md:w-[300px] gap-4 gap-[10px]">
                            <div className="flex w-full justify-between">
                              <span className="font-bold opacity-90 text-darkBlue text-xsmall">
                                Super Static Call
                              </span>
                              <ToggleSwitch
                                isToggled={controller.permissions.SUPER_STATICCALL}
                                onToggle={() =>
                                  updatePermission(controller.address, "SUPER_STATICCALL")
                                }
                                controllerAddress={controller.address}
                                permissionKey="SUPER_STATICCALL"
                              />
                            </div>
                            <span className="opacity-75 text-darkBlue text-xxsmall">
                              Permit advanced read-only interactions with smart contracts
                            </span>
                          </div>
                          <div className="flex flex-col sm:w-full md:w-[300px] gap-4 gap-[10px]">
                            <div className="flex w-full justify-between">
                              <span className="font-bold opacity-90 text-darkBlue text-xsmall">
                                Static Call
                              </span>
                              <ToggleSwitch
                                isToggled={controller.permissions.STATICCALL}
                                onToggle={() => updatePermission(controller.address, "STATICCALL")}
                                controllerAddress={controller.address}
                                permissionKey="STATICCALL"
                              />
                            </div>
                            <span className="opacity-75 text-darkBlue text-xxsmall">
                              Allow interactions with smart contracts in a read-only mode
                            </span>
                          </div>
                          <div className="flex flex-col sm:w-full md:w-[300px] gap-4 gap-[10px]">
                            <div className="flex w-full justify-between">
                              <span className="font-bold opacity-90 text-darkBlue text-xsmall">
                                Super Delegate Call
                              </span>
                              <ToggleSwitch
                                isToggled={controller.permissions.SUPER_DELEGATECALL}
                                onToggle={() =>
                                  updatePermission(controller.address, "SUPER_DELEGATECALL")
                                }
                                controllerAddress={controller.address}
                                permissionKey="SUPER_DELEGATECALL"
                              />
                            </div>
                            <span className="opacity-75 text-darkBlue text-xxsmall">
                              Allow high-level delegate calls with more extensive authority
                            </span>
                          </div>
                          <div className="flex flex-col sm:w-full md:w-[300px] gap-4 gap-[10px]">
                            <div className="flex w-full justify-between">
                              <span className="font-bold opacity-90 text-darkBlue text-xsmall">
                                Delegate Call
                              </span>
                              <ToggleSwitch
                                isToggled={controller.permissions.DELEGATECALL}
                                onToggle={() =>
                                  updatePermission(controller.address, "DELEGATECALL")
                                }
                                controllerAddress={controller.address}
                                permissionKey="DELEGATECALL"
                              />
                            </div>
                            <span className="opacity-75 text-darkBlue text-xxsmall">
                              Permit running code from any smart contract inside the wallet&apos;s
                              environment
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4 py-2 keymanager:mt-[-380px] extension:mt-[-365px] extension2:mt-[-350px] md:mt-[-325px] xl:mt-0">
                        <div className="font-bold text-[18px] text-darkBlue">Extensions</div>
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col sm:w-full md:w-[300px] gap-4 gap-[10px]">
                            <div className="flex w-full justify-between">
                              <span className="font-bold opacity-90 text-darkBlue text-xsmall">
                                Add Extensions
                              </span>
                              <ToggleSwitch
                                isToggled={controller.permissions.ADDEXTENSIONS}
                                onToggle={() =>
                                  updatePermission(controller.address, "ADDEXTENSIONS")
                                }
                                controllerAddress={controller.address}
                                permissionKey="ADDEXTENSIONS"
                              />
                            </div>
                            <span className="opacity-75 text-darkBlue text-xxsmall">
                              Permit the addition of extensions to enhance wallet functionality
                            </span>
                          </div>
                          <div className="flex flex-col sm:w-full md:w-[300px] gap-4 gap-[10px]">
                            <div className="flex w-full justify-between">
                              <span className="font-bold opacity-90 text-darkBlue text-xsmall">
                                Change Extensions
                              </span>
                              <ToggleSwitch
                                isToggled={controller.permissions.CHANGEEXTENSIONS}
                                onToggle={() =>
                                  updatePermission(controller.address, "CHANGEEXTENSIONS")
                                }
                                controllerAddress={controller.address}
                                permissionKey="CHANGEEXTENSIONS"
                              />
                            </div>
                            <span className="opacity-75 text-darkBlue text-xxsmall">
                              Grant the ability to modify or replace existing wallet extensions
                            </span>
                          </div>
                          <div className="flex flex-col sm:w-full md:w-[300px] gap-4 gap-[10px]">
                            <div className="flex w-full justify-between">
                              <span className="font-bold opacity-90 text-darkBlue text-xsmall">
                                Add URD
                              </span>
                              <ToggleSwitch
                                isToggled={controller.permissions.ADDUNIVERSALRECEIVERDELEGATE}
                                onToggle={() =>
                                  updatePermission(
                                    controller.address,
                                    "ADDUNIVERSALRECEIVERDELEGATE"
                                  )
                                }
                                controllerAddress={controller.address}
                                permissionKey="ADDUNIVERSALRECEIVERDELEGATE"
                              />
                            </div>
                            <span className="opacity-75 text-darkBlue text-xxsmall">
                              Allow addition of delegates for universal receiver functionality
                            </span>
                          </div>
                          <div className="flex flex-col sm:w-full md:w-[300px] gap-4 gap-[10px]">
                            <div className="flex w-full justify-between">
                              <span className="font-bold opacity-90 text-darkBlue text-xsmall">
                                Change URD
                              </span>
                              <ToggleSwitch
                                isToggled={controller.permissions.CHANGEUNIVERSALRECEIVERDELEGATE}
                                onToggle={() =>
                                  updatePermission(
                                    controller.address,
                                    "CHANGEUNIVERSALRECEIVERDELEGATE"
                                  )
                                }
                                controllerAddress={controller.address}
                                permissionKey="CHANGEUNIVERSALRECEIVERDELEGATE"
                              />
                            </div>
                            <span className="opacity-75 text-darkBlue text-xxsmall">
                              Permit modifications to the delegates of the universal receiver
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4 py-2  md:mt-0">
                        <div className="font-bold text-[18px] text-darkBlue">Relay & Execution</div>
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col sm:w-full md:w-[300px] gap-4 gap-[10px]">
                            <div className="flex w-full justify-between">
                              <span className="font-bold opacity-90 text-darkBlue text-xsmall">
                                Execute Relay Call
                              </span>
                              <ToggleSwitch
                                isToggled={controller.permissions.EXECUTE_RELAY_CALL}
                                onToggle={() =>
                                  updatePermission(controller.address, "EXECUTE_RELAY_CALL")
                                }
                                controllerAddress={controller.address}
                                permissionKey="EXECUTE_RELAY_CALL"
                              />
                            </div>
                            <span className="opacity-75 text-darkBlue text-xxsmall">
                              Enable execution of relay calls for advanced transaction handling
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4 py-2 keymanager:mt-[-100px] md:mt-[-50px] xl:mt-0">
                        <div className="font-bold text-[18px] text-darkBlue">
                          Contract Management
                        </div>
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col sm:w-full md:w-[300px] gap-4 gap-[10px]">
                            <div className="flex w-full justify-between">
                              <span className="font-bold opacity-90 text-darkBlue text-xsmall">
                                Deploy
                              </span>
                              <ToggleSwitch
                                isToggled={controller.permissions.DEPLOY}
                                onToggle={() => updatePermission(controller.address, "DEPLOY")}
                                controllerAddress={controller.address}
                                permissionKey="DEPLOY"
                              />
                            </div>
                            <span className="opacity-75 text-darkBlue text-xxsmall">
                              Enable deploying new smart contracts from the wallet
                            </span>
                          </div>
                          <div className="flex flex-col sm:w-full md:w-[300px] gap-4 gap-[10px]">
                            <div className="flex w-full justify-between">
                              <span className="font-bold opacity-90 text-darkBlue text-xsmall">
                                Super Set Data
                              </span>
                              <ToggleSwitch
                                isToggled={controller.permissions.SUPER_SETDATA}
                                onToggle={() =>
                                  updatePermission(controller.address, "SUPER_SETDATA")
                                }
                                controllerAddress={controller.address}
                                permissionKey="SUPER_SETDATA"
                              />
                            </div>
                            <span className="opacity-75 text-darkBlue text-xxsmall">
                              Enable advanced data setting capabilities, possibly with wider scope
                            </span>
                          </div>
                          <div className="flex flex-col sm:w-full md:w-[300px] gap-4 gap-[10px]">
                            <div className="flex w-full justify-between">
                              <span className="font-bold opacity-90 text-darkBlue text-xsmall">
                                Set Data
                              </span>
                              <ToggleSwitch
                                isToggled={controller.permissions.SETDATA}
                                onToggle={() => updatePermission(controller.address, "SETDATA")}
                                controllerAddress={controller.address}
                                permissionKey="SETDATA"
                              />
                            </div>
                            <span className="opacity-75 text-darkBlue text-xxsmall">
                              Permit modification or setting of data within the wallet or its
                              associated contracts
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 py-2 base:grid-row-6">
                        <div className="font-bold text-[18px] text-darkBlue">Safety</div>
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col sm:w-full md:w-[300px] gap-4 gap-[10px]">
                            <div className="flex w-full justify-between">
                              <span className="font-bold opacity-90 text-darkBlue text-xsmall">
                                Re-entrancy
                              </span>
                              <ToggleSwitch
                                isToggled={controller.permissions.REENTRANCY}
                                onToggle={() => updatePermission(controller.address, "REENTRANCY")}
                                controllerAddress={controller.address}
                                permissionKey="REENTRANCY"
                              />
                            </div>
                            <span className="opacity-75 text-darkBlue text-xxsmall">
                              Allow successive executions, possibly in the context of smart
                              contracts
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Keymanager
