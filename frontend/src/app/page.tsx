'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  GraduationCap, ArrowRight, Sparkles, LogOut
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Register GSAP ScrollTrigger plugin on client-side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Home() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const router = useRouter()

  // Input for quick search that redirects to the dashboard
  const [searchAddress, setSearchAddress] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const triggerRef = useRef<HTMLDivElement>(null)

  // GSAP ScrollTrigger Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro sections reveal
      gsap.from('.gsap-reveal-hero', {
        opacity: 0,
        y: 30,
        duration: 1.0,
        stagger: 0.15,
        ease: 'power4.out',
      })

      // Feature Parallax Sections
      gsap.from('.gsap-feature-card', {
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 50,
        duration: 1.2,
        stagger: 0.25,
        ease: 'power3.out'
      })
    })

    return () => ctx.revert()
  }, [])

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchAddress || searchAddress.length !== 42) {
      setErrorMsg('Alamat Ethereum tidak valid. Harus 42 karakter.')
      return
    }
    router.push(`/dashboard?address=${searchAddress}`)
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#030303]">
      {/* Sleek Dynamic Indigo Aurora Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-violet-600/10 rounded-full blur-[180px] pointer-events-none" />

      {/* 1. Header (Premium Glassmorphism Navigation) */}
      <header className="sticky top-0 z-50 w-full px-6 py-4 border-b border-white/5 bg-neutral-950/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-glow text-white">EduTrace</span>
              <span className="text-[10px] block font-mono text-indigo-400 font-semibold tracking-wider uppercase">Tri-Core DApp</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {React.createElement('w3m-button')}
            {isConnected && (
              <button 
                onClick={() => disconnect()}
                className="p-2 border border-white/10 rounded-lg hover:border-red-500/30 hover:bg-red-500/5 text-neutral-400 hover:text-red-400 transition-all cursor-pointer"
                title="Disconnect Wallet"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Storytelling Hero Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-16 flex flex-col gap-24 z-10">
        
        <section className="text-center flex flex-col items-center gap-8 max-w-4xl mx-auto">
          <div className="gsap-reveal-hero px-4 py-1.5 border border-indigo-500/30 bg-indigo-500/5 rounded-full text-indigo-400 text-xs font-semibold tracking-wider uppercase flex items-center gap-2 shadow-inner">
            <Sparkles className="w-3.5 h-3.5" /> NSEC 2026 Enterprise Web3 + AI Showcase
          </div>
          <h1 className="gsap-reveal-hero text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Ledger Rapor Akademik <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-500">
              Soulbound & AI Prediktif
            </span>
          </h1>
          <p className="gsap-reveal-hero text-lg text-neutral-400 leading-relaxed max-w-2xl">
            Sistem rekam nilai transparan off-chain terintegrasi **Smart Contracts ERC-5192 (Soulbound)** dan analisis klasifikasi runtun waktu **PyTorch LSTM** untuk memprediksi kelulusan siswa.
          </p>

          {/* Premium Call-to-Actions */}
          <div className="gsap-reveal-hero flex flex-col sm:flex-row items-center gap-4 mt-4 w-full justify-center">
            <Link 
              href="/dashboard"
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/15 flex items-center justify-center gap-2 cursor-pointer group"
            >
              Launch Dashboard Terminal
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Quick Query Bar */}
          <form onSubmit={handleQuickSearch} className="gsap-reveal-hero flex flex-col gap-3 w-full max-w-lg mt-4">
            <div className="flex gap-2 w-full">
              <input 
                type="text" 
                value={searchAddress}
                onChange={(e) => {
                  setSearchAddress(e.target.value)
                  setErrorMsg('')
                }}
                className="flex-1 bg-neutral-900/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/50 text-white font-mono"
                placeholder="Query cepat alamat Ethereum (0x...)"
              />
              <button 
                type="submit"
                className="bg-neutral-900 border border-white/10 hover:border-indigo-500/40 text-neutral-300 hover:text-white px-6 py-3 rounded-xl transition-all cursor-pointer font-semibold text-sm"
              >
                Cari
              </button>
            </div>
            {errorMsg && <p className="text-red-400 text-left text-xs font-mono">{errorMsg}</p>}
          </form>
        </section>

        {/* 3. Feature Animation Storytelling (GSAP ScrollTrigger) */}
        <section ref={triggerRef} className="flex flex-col gap-12 border-t border-white/5 pt-20">
          <div className="text-center flex flex-col items-center gap-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-mono text-indigo-400 font-semibold tracking-wider uppercase">Pipeline Integrasi</span>
            <h2 className="text-3xl font-bold text-white tracking-tight">Bagaimana Tri-Core Bekerja?</h2>
            <p className="text-sm text-neutral-400">
              Sinkronisasi mulus data blockchain terenkripsi IPFS dengan analitik analitis runtun waktu off-chain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="gsap-feature-card p-8 bg-neutral-950/40 border border-white/5 rounded-2xl flex flex-col gap-4">
              <span className="text-4xl font-extrabold text-indigo-500/20 font-mono">01</span>
              <h4 className="text-lg font-bold text-white">Guru Mint SBT Rapor</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Guru mengunggah JSON nilai murid ke IPFS, lalu memanggil fungsi `mintReportCard(student, cid)`. Smart contract ERC-5192 mengunci ijazah secara permanen.
              </p>
            </div>

            <div className="gsap-feature-card p-8 bg-neutral-950/40 border border-white/5 rounded-2xl flex flex-col gap-4">
              <span className="text-4xl font-extrabold text-teal-500/20 font-mono">02</span>
              <h4 className="text-lg font-bold text-white">Go Indexer Menangkap Event</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Go indexer asinkron menangkap emit event secara instan menggunakan standard RPC poller, menarik metadata JSON dari IPFS, dan memaketkan data ke PostgreSQL.
              </p>
            </div>

            <div className="gsap-feature-card p-8 bg-neutral-950/40 border border-white/5 rounded-2xl flex flex-col gap-4">
              <span className="text-4xl font-extrabold text-purple-500/20 font-mono">03</span>
              <h4 className="text-lg font-bold text-white">PyTorch LSTM Meramal</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Go pipeline memicu microservice Python FastAPI. Model LSTM memproses riwayat nilai dan attendance rate untuk memetakan dropout risk & karir cluster.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* 4. Footer */}
      <footer className="w-full border-t border-white/5 py-6 px-6 mt-16 text-center text-neutral-600 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 EduTrace Monorepo. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-neutral-400 transition-colors">EIP-5192 Soulbound Ledger</a>
            <a href="#" className="hover:text-neutral-400 transition-colors">PyTorch Off-chain LSTM</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
