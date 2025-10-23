import { createThirdwebClient } from "thirdweb"
import { inAppWallet, createWallet } from "thirdweb/wallets"
import { avalancheTestnet } from "./avalanche-testnet"

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "cab0f839b00d345e2f54dfc1177888ed"
const secretKey =
  process.env.THIRDWEB_SECRET_KEY ||
  "M1Ptd4OLN5Wld3AkNO-ny4Y3IcNBno6q4kD-FQyG833m8rCFjkMZ5eu4DNhmLCJUmN-fl-r6_QzbL_LRPB2-aQ"

export const client = createThirdwebClient({
  clientId: clientId,
  secretKey: secretKey,
})

export const defaultChain = avalancheTestnet

export const wallets = [
  inAppWallet({
    auth: {
      options: ["google", "facebook", "telegram", "email", "x", "passkey"],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
  createWallet("com.trustwallet.app"),
]
