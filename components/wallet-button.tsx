"use client"

import { Wallet } from "lucide-react"
import { ConnectButton } from "thirdweb/react"
import { client, defaultChain } from "@/lib/thirdweb-client"
import { wallets } from "@/lib/thirdweb-client"

export function WalletButton() {
  return (
    <ConnectButton
      client={client}
      chain={defaultChain}
      appMetadata={{
        name: "Plusify",
        description: "Live Streaming Prediction Platform on Avalanche",
        url: typeof window !== "undefined" ? window.location.origin : "",
      }}
      wallets={wallets}
      connectModal={{
        size: "wide",
        title: "Connect Wallet",
        titleIcon: "wallet",
      }}
    />
  )
}
