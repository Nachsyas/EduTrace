'use client'

import React, { useState, ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import { mainnet, sepolia, foundry } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

// Public WalletConnect Project ID for initial bootstrap and local execution
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '82c0fa0f575c3ad969b82fa7e56230f2'

const metadata = {
  name: 'EduTrace',
  description: 'EduTrace - Decentralized Soulbound Student Ledger',
  url: 'https://edutrace.org',
  icons: ['https://avatars.githubusercontent.com/u/17922993'],
}

const chains = [foundry, sepolia, mainnet] as const

// 1. Create standard, highly robust, and perfectly SSR-safe Wagmi Config using Web3Modal's official wrapper
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true, // Enables seamless server-side rendering support
})

// 2. Initialize Web3Modal only on the client-side to prevent SSR ReferenceErrors
if (typeof window !== 'undefined') {
  createWeb3Modal({
    wagmiConfig: config,
    projectId,
  })
}

interface ProvidersProps {
  children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  // Ensure QueryClient is instantiated once per session to avoid memory leaks during hot reloads
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }))

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
