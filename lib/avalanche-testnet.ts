import { defineChain } from "thirdweb"

// Keep your existing Avalanche chain
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

// Add Solana chains
// export const solanaMainnet = defineChain({
//   id: 900, // Solana uses non-standard chain IDs
//   name: "Solana Mainnet",
//   nativeCurrency: {
//     name: "Solana",
//     symbol: "SOL",
//     decimals: 9,
//   },
//   rpc: "https://api.mainnet-beta.solana.com",
//   testnet: false,
// })

export const solanaDevnet = defineChain({
  id: 901,
  name: "Solana Devnet",
  nativeCurrency: {
    name: "Solana",
    symbol: "SOL",
    decimals: 9,
  },
  rpc: "https://api.devnet.solana.com",
  testnet: true,
})

export const SUPPORTED_CHAIN_IDS = [43113, 901] // Support both chains

export const isSupportedChain = (chainId: number | undefined): chainId is number =>
  chainId !== undefined && SUPPORTED_CHAIN_IDS.includes(Number(chainId))