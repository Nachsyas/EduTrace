import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import LenisScroll from '../components/LenisScroll'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  title: 'EduTrace — Decentralized Soulbound Student Ledger',
  description: 'Immutable student report card logging backed by EIP-5192 Soulbound Tokens and time-series LSTM dropout predictive analysis.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased dark`} suppressHydrationWarning>
      <body className="min-h-full bg-neutral-950 text-neutral-100 font-sans flex flex-col selection:bg-indigo-500 selection:text-white" suppressHydrationWarning>
        <Providers>
          {/* Smooth Scroll Kinetic Engine */}
          <LenisScroll />
          {children}
        </Providers>
      </body>
    </html>
  )
}
