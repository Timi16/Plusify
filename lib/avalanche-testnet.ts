import { defineChain } from "thirdweb"

// Define Avalanche C-Chain Testnet
export const avalancheTestnet = defineChain({
  id: 43113,
  name: "Avalanche C-Chain Testnet",
  nativeCurrency: {
    name: "Avalanche",
    symbol: "AVAX",
    decimals: 18,
  },
  rpc: "https://api.avax-test.network/ext/bc/C/rpc",
  blockExplorers: [
    {
      name: "SnowTrace",
      url: "https://testnet.snowtrace.io",
    },
  ],
  testnet: true,
})

export const SUPPORTED_CHAIN_ID = 43113

export const isSupportedChain = (chainId: number | undefined): chainId is number =>
  chainId !== undefined && Number(chainId) === SUPPORTED_CHAIN_ID
