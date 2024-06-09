import React, { ReactNode } from "react"
import { AssetsProvider } from "./AssetsContext/AssetsContext"
import { KeymanagerProvider } from "./KeymanagerContext/KeymanagerContext"
import { VaultProvider } from "./VaultContext/VaultContext"
import { SessionKeysprovider } from "./SessionContext/SessionContext"
import { GlobalContext } from "./GlobalContext"

interface GlobalWrapperProps {
  children: ReactNode
}

const GlobalWrapper: React.FC<GlobalWrapperProps> = ({ children }) => {
  return (
    <GlobalContext>
      <SessionKeysprovider>
        <VaultProvider>
          <KeymanagerProvider>
            <AssetsProvider>{children}</AssetsProvider>
          </KeymanagerProvider>
        </VaultProvider>
      </SessionKeysprovider>
    </GlobalContext>
  )
}

export default GlobalWrapper
