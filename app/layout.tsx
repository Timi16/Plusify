import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import Providers from "./providers"           // ← add this
import { WalletProvider } from "@/lib/wallet-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "Plusify - Watch. Predict. Earn.",
  description: "The future of StreamFi - Live streaming meets prediction markets",
  generator: "Timicoding",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Providers>                       {/* ← wagmi/react-query context */}
          <WalletProvider>                {/* ← if this uses wagmi, it now sits under WagmiProvider */}
            <Suspense fallback={null}>{children}</Suspense>
          </WalletProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
