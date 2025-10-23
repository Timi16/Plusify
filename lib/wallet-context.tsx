"use client"

import { createContext, useContext, type ReactNode } from "react"
import { ThirdwebProvider } from "thirdweb/react"
import { client } from "./thirdweb-client"

interface WalletContextType {
  connected: boolean
  address: string | null
  balance: number
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const contextValue: WalletContextType = {
    connected: false,
    address: null,
    balance: 1000, // Default balance for demo
    connect: async () => {
      console.log("Wallet connection initiated")
    },
    disconnect: () => {
      console.log("Wallet disconnected")
    },
  }

  return (
    <ThirdwebProvider>
      <WalletContext.Provider value={contextValue}>{children}</WalletContext.Provider>
    </ThirdwebProvider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

export { client }