'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LivepeerConfig, createReactClient, studioProvider } from '@livepeer/react';

// Wagmi config
const config = createConfig({
  chains: [mainnet],
  transports: { [mainnet.id]: http() },
});

// Livepeer client - CRITICAL: This was missing!
const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_API_KEY || '',
  }),
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <LivepeerConfig client={livepeerClient}>
          {children}
        </LivepeerConfig>
      </QueryClientProvider>
    </WagmiProvider>
  );
}