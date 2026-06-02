'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { 
  Shield, Database, Cpu, GraduationCap, ArrowLeft, ArrowRight, 
  UserCheck, AlertTriangle, Sparkles, LogOut, CheckCircle2, 
  BookOpen, Clock, Activity, Award, Copy, Check, TrendingUp, PieChart, Briefcase
} from 'lucide-react'
import ThreeCurve from '../../components/ThreeCurve'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

// Full pre-populated curriculum of 57 courses based on student data
const AVAILABLE_COURSES = [
  { code: '24060511D22', name: 'ALGORITHM COMPLEXITY', sks: 2 },
  { code: '24060512F16', name: 'ANIMATION AND SCENARIO CREATOR (OPT SUBJ)', sks: 3 },
  { code: '24000011B03', name: 'BAHASA ARAB KOMUNIKATIF', sks: 2 },
  { code: '24000011B04', name: 'BAHASA ARAB PRAKTIS', sks: 2 },
  { code: '24000011A03', name: 'BAHASA INDONESIA', sks: 2 },
  { code: '24000011B06', name: 'BAHASA INGGRIS AKADEMIK', sks: 3 },
  { code: '24060512F21', name: 'BUSINESS PROCESS MANAGEMENT (OPT SUBJ)', sks: 3 },
  { code: '24060511D06', name: 'CALCULUS 2', sks: 2 },
  { code: '20060512C10', name: 'CLOUD COMPUTING (OPT SUBJ)', sks: 3 },
  { code: '24060511D20', name: 'COMPUTER NETWORK', sks: 3 },
  { code: '24060511D24', name: 'COMPUTER NETWORK PRACTICUM', sks: 1 },
  { code: '24060512F23', name: 'DATA ANALYSIS AND VISUALIZATION (OPT SUBJ)', sks: 3 },
  { code: '20060511C09', name: 'DATA SCIENCE', sks: 3 },
  { code: '24060511D18', name: 'DATABASE', sks: 2 },
  { code: '24060511D26', name: 'DATABASE PRACTICUM', sks: 1 },
  { code: '20060512C15', name: 'DATAMINING (OPT SUBJ)', sks: 3 },
  { code: '24060511D09', name: 'DIGITAL SYSTEM', sks: 2 },
  { code: '24060511D11', name: 'DIGITAL SYSTEM PRACTICUM', sks: 1 },
  { code: '24060512F22', name: 'ENTERPRISE ARCHITECTURE (OPT SUBJ)', sks: 3 },
  { code: '0455201', name: 'FISIKA DASAR I', sks: 2 },
  { code: '20060512C26', name: 'GAME PRODUCTION (OPT SUBJ)', sks: 3 },
  { code: '20060512C12', name: 'GEOGRAPHICAL INFORMATION SYSTEM (OPT SUBJ)', sks: 3 },
  { code: '24060512F09', name: 'GEOGRAPHICAL INFORMATION SYSTEM (OPT SUBJ)', sks: 3 },
  { code: '24060512F02', name: 'INFORMATIKA MEDIS (OPT SUBJ)', sks: 3 },
  { code: '20060512C05', name: 'INFORMATION RETREIVAL (OPT SUBJ)', sks: 3 },
  { code: '1565027', name: 'INTERAKSI MANUSIA & KOMPUTER', sks: 3 },
  { code: '20060512C23', name: 'INTERNET MARKETING (OPT SUBJ)', sks: 3 },
  { code: '20060512C08', name: 'INTERNET OF THING (OPT SUBJ)', sks: 3 },
  { code: '24060512F24', name: 'IT GOVERNANCE (OPT SUBJ)', sks: 3 },
  { code: '1565054', name: 'IT GOVERNANCE MK PILIHAN 2', sks: 3 },
  { code: '24000011A02', name: 'KEWARGANEGARAAN', sks: 2 },
  { code: '20060512C19', name: 'KNOWLEDGE ENGINEERING (OPT SUBJ)', sks: 3 },
  { code: '1565019', name: 'KOMPUTER VISION', sks: 3 },
  { code: '1565051', name: 'KUALITAS PERANGKAT LUNAK MK PILIHAN 1', sks: 3 },
  { code: '1700119', name: 'KULIAH KERJA MAHASISWA (KKM)', sks: 2 },
  { code: '24060511D07', name: 'LINEAR ALGEBRA', sks: 3 },
  { code: '20060512C01', name: 'MACHINE LEARNING (OPT SUBJ)', sks: 3 },
  { code: '1565030', name: 'MANAJEMEN PROYEK', sks: 2 },
  { code: '20060511C08', name: 'MOBILE PROGRAMMING', sks: 3 },
  { code: '24060512F11', name: 'MULTIPLATFORM PROGRAMMING (OPT SUBJ)', sks: 3 },
  { code: '20060512C04', name: 'NATURAL LANGUAGE PROCESSING (OPT SUBJ)', sks: 3 },
  { code: '24060511D08', name: 'OBJECT ORIENTED PROGRAMMING', sks: 3 },
  { code: '24060511D10', name: 'OBJECT ORIENTED PROGRAMMING PRACTICUM', sks: 1 },
  { code: '24060512F13', name: 'PERENCANAAN STRATEGIS TEKNOLOGI INFORMASI (OPT SUBJ)', sks: 3 },
  { code: '1865046', name: 'PRAKTEK KERJA LAPANGAN PKL', sks: 2 },
  { code: '20060512C09', name: 'ROBOTIC (OPT SUBJ)', sks: 3 },
  { code: '1565047', name: 'SEMINAR PROPOSAL PENELITIAN', sks: 2 },
  { code: '1565048', name: 'SKRIPSI', sks: 6 },
  { code: '24060512F19', name: 'SOFT COMPUTING (OPT SUBJ)', sks: 3 },
  { code: '24060511D19', name: 'SOFTWARE ENGINEERING', sks: 3 },
  { code: '24060511D23', name: 'SOFTWARE ENGINEERING PRACTICUM', sks: 1 },
  { code: '24060512F20', name: 'SOFTWARE QUALITY (OPT SUBJ)', sks: 3 },
  { code: '20060512C22', name: 'START-UP DEVELOPMENT (OPT SUBJ)', sks: 3 },
  { code: '24000011B10', name: 'STUDI AL-QURAN DAN AL-HADITS', sks: 2 },
  { code: '20060512C11', name: 'SYSTEM SECURITY (OPT SUBJ)', sks: 3 },
  { code: '1565029', name: 'TECHNOPRENEURSHIP', sks: 2 },
  { code: '20060512C25', name: 'USER INTERFACE & GAME ENVIRONMENT (OPT SUBJ)', sks: 3 },
  { code: '24060511D21', name: 'WEB PROGRAMMING', sks: 2 },
  { code: '24060511D25', name: 'WEB PROGRAMMING PRACTICUM', sks: 1 }
]

interface VectorCurveProps {
  dropoutRisk: number
}

function VectorCurve({ dropoutRisk }: VectorCurveProps) {
  const isHighRisk = dropoutRisk >= 40.0
  const pathColor = isHighRisk ? '#ef4444' : '#6366f1'
  const gradientId = isHighRisk ? 'redGlowGrad' : 'indigoGlowGrad'

  // An optimal curve slopes upwards (from bottom-left to top-right)
  // An alert curve slopes downwards (from top-left to bottom-right)
  const pathD = isHighRisk 
    ? "M 0,80 Q 200,40 400,120 T 800,240 T 1200,280"
    : "M 0,280 Q 200,240 400,160 T 800,80 T 1200,40"

  const fillD = isHighRisk
    ? `${pathD} L 1200,340 L 0,340 Z`
    : `${pathD} L 1200,340 L 0,340 Z`

  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-neutral-950/20 backdrop-blur-[2px]">
      <svg className="w-full h-full absolute inset-0 block" viewBox="0 0 1200 340" preserveAspectRatio="none">
        <defs>
          <linearGradient id="indigoGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="redGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#f97316" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.0" />
          </linearGradient>
          <filter id="svgGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Shimmering Animated Area Fill */}
        <path 
          d={fillD} 
          fill={`url(#${gradientId})`}
          className="opacity-70 transition-all duration-1000 ease-in-out"
        />

        {/* Main curved path with neon glow */}
        <path 
          d={pathD} 
          fill="none" 
          stroke={pathColor} 
          strokeWidth="6" 
          filter="url(#svgGlow)"
          className="opacity-40 transition-all duration-1000 ease-in-out"
          strokeLinecap="round"
        />
        <path 
          d={pathD} 
          fill="none" 
          stroke="#ffffff" 
          strokeWidth="2.5" 
          className="opacity-90 transition-all duration-1000 ease-in-out"
          strokeLinecap="round"
        />

        {/* Animated particles flying along path */}
        <circle r="5" fill="#ffffff" filter="url(#svgGlow)">
          <animateMotion 
            dur="6s" 
            repeatCount="indefinite" 
            path={pathD}
          />
        </circle>
        <circle r="4.5" fill={isHighRisk ? '#f97316' : '#a855f7'} filter="url(#svgGlow)">
          <animateMotion 
            dur="8s" 
            begin="3s"
            repeatCount="indefinite" 
            path={pathD}
          />
        </circle>
      </svg>

      {/* Floating status tag */}
      <div className="absolute bottom-4 left-4 z-10 py-1.5 px-3 border border-white/5 bg-black/60 backdrop-blur-md rounded-lg flex items-center gap-2 select-none">
        <div className={`w-2 h-2 rounded-full ${isHighRisk ? 'bg-red-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} />
        <span className="text-[10px] font-mono text-neutral-400 font-bold tracking-wider uppercase">
          {isHighRisk ? 'Declining Curve (Vector Mode)' : 'Ascending Curve (Vector Mode)'}
        </span>
      </div>
    </div>
  )
}

function SkillRadarChart({ skills }: { skills: Record<string, number> }) {
  const keys = Object.keys(skills);
  if (keys.length === 0) return <div className="text-neutral-500 text-xs font-mono text-center">No skills mapped</div>;
  
  const center = 50;
  const r = 35;
  const points = keys.map((key, i) => {
    const angle = (i * 2 * Math.PI) / keys.length - Math.PI / 2;
    const value = skills[key] / 100;
    const x = center + r * value * Math.cos(angle);
    const y = center + r * value * Math.sin(angle);
    return { x, y, label: key, score: skills[key] };
  });
  
  const polygonPath = points.map(p => `${p.x},${p.y}`).join(' ');
  
  return (
    <div className="w-full flex flex-col items-center justify-center p-1 gap-2 select-none">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100">
          {/* Circular grid lines */}
          {[0.25, 0.5, 0.75, 1].map((factor, idx) => (
            <circle
              key={idx}
              cx={center}
              cy={center}
              r={r * factor}
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="0.5"
            />
          ))}
          {/* Radial grid lines */}
          {points.map((p, i) => {
            const angle = (i * 2 * Math.PI) / keys.length - Math.PI / 2;
            const endX = center + r * Math.cos(angle);
            const endY = center + r * Math.sin(angle);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={endX}
                y2={endY}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="0.5"
              />
            );
          })}
          {/* The skill polygon */}
          <polygon
            points={polygonPath}
            fill="rgba(99, 102, 241, 0.15)"
            stroke="#6366f1"
            strokeWidth="1.5"
            className="drop-shadow-[0_0_6px_rgba(99,102,241,0.5)]"
          />
          {/* Label markers */}
          {points.map((p, i) => {
            const angle = (i * 2 * Math.PI) / keys.length - Math.PI / 2;
            const textX = center + (r + 8) * Math.cos(angle);
            const textY = center + (r + 4) * Math.sin(angle);
            return (
              <text
                key={i}
                x={textX}
                y={textY}
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="#a3a3a3"
                fontSize="4"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {p.label} ({p.score.toFixed(0)})
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function JobMatcherWidget({ jobMatching, salary }: { jobMatching: any, salary: any }) {
  const position = jobMatching?.position || "Fullstack DApp Developer"
  const companies = jobMatching?.recommended_companies || ["Binance", "Ethereum Foundation", "Google Research"]
  const minSal = salary?.min_salary || 18000000
  const maxSal = salary?.max_salary || 28000000
  const currency = salary?.currency || "IDR"
  
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  }
  
  return (
    <div className="flex flex-col gap-3.5 select-none text-left">
      <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-2xl">
        <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider font-semibold">Matched Position</span>
        <p className="text-xs font-bold text-white mt-0.5">{position}</p>
      </div>
      
      <div className="flex flex-col gap-1.5">
        <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider font-semibold">Target Employers</span>
        <div className="flex flex-wrap gap-1.5">
          {companies.map((c: string, idx: number) => (
            <span 
              key={idx} 
              className="px-2.5 py-1 text-[9px] font-bold font-mono rounded-lg border border-white/10 bg-neutral-900/80 text-indigo-300 flex items-center gap-1.5 shadow"
            >
              <span className="w-1 h-1 rounded-full bg-indigo-400" />
              {c}
            </span>
          ))}
        </div>
      </div>
      
      <div className="p-2.5 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-2xl">
        <span className="text-[9px] font-mono text-indigo-300 uppercase tracking-wider font-bold">Estimated Market Salary</span>
        <p className="text-sm font-mono font-extrabold text-glow text-white mt-0.5">
          {formatCurrency(minSal)} - {formatCurrency(maxSal)}
        </p>
      </div>
    </div>
  )
}

function StartupWidget({ startup }: { startup: any }) {
  const domain = startup?.industry_domain || "Web3 Dev Tools"
  const probability = startup?.success_probability || 84.5
  
  return (
    <div className="flex flex-col gap-3 select-none text-left mb-3">
      <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-2xl">
        <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider font-semibold">Startup Domain</span>
        <p className="text-xs font-bold text-white mt-0.5">{domain}</p>
      </div>
      
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center text-[9px] font-mono font-semibold text-neutral-400">
          <span>Success Probability</span>
          <span className="text-teal-400 text-glow font-bold">{probability.toFixed(1)}%</span>
        </div>
        {/* Progress bar container */}
        <div className="w-full h-2 bg-white/[0.02] border border-white/5 rounded-full overflow-hidden p-[1px]">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-teal-400 to-indigo-500 transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(20,184,166,0.5)]"
            style={{ width: `${probability}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function RoadmapWidget({ roadmap }: { roadmap: string[] }) {
  const list = roadmap && roadmap.length > 0 ? roadmap : ["Mempelajari Fundamental Pemrograman Web3 & AI"]
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  
  return (
    <div className="flex flex-col gap-2 w-full mt-1 text-left">
      <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider font-semibold">Continuous Learning Roadmap</span>
      <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1 scrollbar-none">
        {list.map((step: string, idx: number) => {
          const isOpen = openIdx === idx
          return (
            <div 
              key={idx}
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              className="p-2 border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] rounded-xl cursor-pointer flex flex-col gap-1 transition-all"
            >
              <div className="flex items-center gap-2">
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-mono font-bold ${isOpen ? 'bg-indigo-500 text-white shadow-[0_0_6px_#6366f1]' : 'bg-neutral-800 text-neutral-400'}`}>
                  {idx + 1}
                </div>
                <span className="text-[10px] font-semibold text-white leading-tight flex-1 truncate">{step}</span>
              </div>
              {isOpen && (
                <p className="text-[9px] text-neutral-400 pl-5 leading-relaxed pt-1 border-t border-white/5 mt-1 font-mono">
                  {idx === 0 
                    ? "Fokus pada penguasaan teori fundamental, struktur sintaksis, dan perancangan arsitektur awal."
                    : idx === 1 
                    ? "Melakukan implementasi taktis, optimasi efisiensi gas/memori, dan pengujian end-to-end terintegrasi."
                    : "Membangun proyek dunia nyata berskala enterprise, audit keamanan, dan peluncuran produksi massal."}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DashboardContent() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const searchParams = useSearchParams()
  const router = useRouter()

  // Read initial search address from URL parameter ?address=0x...
  const queryAddress = searchParams.get('address') || ''

  // Form input for manual student search
  const [searchAddress, setSearchAddress] = useState(queryAddress)
  const [studentData, setStudentData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isPerformanceMode, setIsPerformanceMode] = useState(false)

  // Form input for dynamic student grade adding sandbox
  const [selectedCourseCode, setSelectedCourseCode] = useState(AVAILABLE_COURSES[0].code)
  const [selectedGradeValue, setSelectedGradeValue] = useState('4.0') // A
  const [selectedAttendanceAbsences, setSelectedAttendanceAbsences] = useState('0')
  const [isMintingMock, setIsMintingMock] = useState(false)
  const [mintSuccessMsg, setMintSuccessMsg] = useState('')
  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([])

  // Wallet address copy to clipboard state
  const [copied, setCopied] = useState(false)
  const handleCopyAddress = () => {
    if (!studentData) return
    navigator.clipboard.writeText(studentData.student.student_address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Address truncation helper
  const truncateAddress = (addr: string) => {
    if (!addr || addr.length < 12) return addr
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  }

  // Tab control for grand academic KHS ledger
  const [activeTab, setActiveTab] = useState('Genap 2025/2026')

  const TABS = [
    { id: 'Genap 2025/2026', label: 'Genap 25/26 (Ongoing)' },
    { id: 'Ganjil 2025/2026', label: 'Ganjil 25/26' },
    { id: 'Genap 2024/2025', label: 'Genap 24/25' },
    { id: 'Ganjil 2024/2025', label: 'Ganjil 24/25' },
    { id: 'Genap 2023/2024', label: 'Genap 23/24' },
    { id: 'Ganjil 2023/2024', label: 'Ganjil 23/24' },
    { id: 'Semua', label: 'Semua Transkrip' }
  ]

  // GSAP stagger animation trigger ref
  const bentoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (studentData && bentoRef.current) {
      // Trigger stunning cascade stagger entry for dashboard cards
      gsap.fromTo('.bento-card', 
        { opacity: 0, y: 35, scale: 0.96 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.8, 
          stagger: 0.06, 
          ease: 'power3.out',
          clearProps: 'transform' // Clear GSAP inline transform so CSS hover transition works smoothly!
        }
      )
    }
  }, [studentData])

  // Nachsyas Arham Mumtaz Nashohi Student Profile (NIM: 230605110041) pre-populated
  const daffaStudentProfile = {
    student: {
      student_address: '0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496',
      name: 'Nachsyas Arham Mumtaz Nashohi',
      email: 'NIM: 230605110041 | nachsyas@edutrace.org',
    },
    report_cards: [
      { token_id: 1, cid: 'QmXoyp1eg2jotzWJaR24G1t75v847mJ675G8mG687v2G8z', minted_at: new Date().toISOString() }
    ],
    academic_records: [
      // 8 ongoing courses for active semester 2025/2026 Genap
      { subject: 'KOMPUTER VISION', score: 0.0, grade: '-', sks: 3, academic_year: '2025/2026', semester: 'Genap' },
      { subject: 'INTERAKSI MANUSIA & KOMPUTER', score: 0.0, grade: '-', sks: 3, academic_year: '2025/2026', semester: 'Genap' },
      { subject: 'MANAJEMEN PROYEK', score: 0.0, grade: '-', sks: 2, academic_year: '2025/2026', semester: 'Genap' },
      { subject: 'DATA SCIENCE', score: 0.0, grade: '-', sks: 3, academic_year: '2025/2026', semester: 'Genap' },
      { subject: 'CLOUD COMPUTING (OPT SUBJ)', score: 0.0, grade: '-', sks: 3, academic_year: '2025/2026', semester: 'Genap' },
      { subject: 'DATAMINING (OPT SUBJ)', score: 0.0, grade: '-', sks: 3, academic_year: '2025/2026', semester: 'Genap' },
      { subject: 'USER INTERFACE & GAME ENVIRONMENT (OPT SUBJ)', score: 0.0, grade: '-', sks: 3, academic_year: '2025/2026', semester: 'Genap' },
      { subject: 'DATA ANALYSIS AND VISUALIZATION (OPT SUBJ)', score: 0.0, grade: '-', sks: 3, academic_year: '2025/2026', semester: 'Genap' },

      // 52 completed courses (Baseline GPA = 3.82, total SKS = 115)
      { subject: 'KALKULUS', score: 95.0, grade: 'A', sks: 3, academic_year: '2023/2024', semester: 'Ganjil' },
      { subject: 'ALGORITMA & PEMROGRAMAN 1', score: 95.0, grade: 'A', sks: 3, academic_year: '2023/2024', semester: 'Ganjil' },
      { subject: 'MATEMATIKA DISKRIT', score: 87.5, grade: 'B+', sks: 3, academic_year: '2023/2024', semester: 'Ganjil' },
      { subject: 'PRAKTIKUM ALGORITMA & PEMROGRAMAN 1', score: 87.5, grade: 'B+', sks: 1, academic_year: '2023/2024', semester: 'Ganjil' },
      { subject: 'INTRODUCTION TO COMPUTER SCIENCE', score: 95.0, grade: 'A', sks: 3, academic_year: '2023/2024', semester: 'Ganjil' },
      { subject: 'PANCASILA', score: 87.5, grade: 'B+', sks: 2, academic_year: '2023/2024', semester: 'Ganjil' },
      { subject: 'BAHASA INDONESIA', score: 95.0, grade: 'A', sks: 2, academic_year: '2023/2024', semester: 'Ganjil' },
      { subject: 'BAHASA ARAB I', score: 95.0, grade: 'A', sks: 2, academic_year: '2023/2024', semester: 'Ganjil' },
      { subject: 'BAHASA ARAB II', score: 95.0, grade: 'A', sks: 2, academic_year: '2023/2024', semester: 'Ganjil' },
      { subject: 'FILSAFAT ILMU', score: 87.5, grade: 'B+', sks: 2, academic_year: '2023/2024', semester: 'Ganjil' },
      
      { subject: 'ELEKTRONIKA DIGITAL', score: 95.0, grade: 'A', sks: 3, academic_year: '2023/2024', semester: 'Genap' },
      { subject: 'PEMROGRAMAN BERORIENTASI OBYEK', score: 87.5, grade: 'B+', sks: 3, academic_year: '2023/2024', semester: 'Genap' },
      { subject: 'PRAKTIKUM ELEKTRONIKA DIGITAL', score: 87.5, grade: 'B+', sks: 1, academic_year: '2023/2024', semester: 'Genap' },
      { subject: 'PRAKTIKUM PEMROGRAMAN BERORIENTASI OBYEK', score: 95.0, grade: 'A', sks: 1, academic_year: '2023/2024', semester: 'Genap' },
      { subject: 'LINEAR ALGEBRA', score: 95.0, grade: 'A', sks: 3, academic_year: '2023/2024', semester: 'Genap' },
      { subject: 'STATISTICS', score: 87.5, grade: 'B+', sks: 3, academic_year: '2023/2024', semester: 'Genap' },
      { subject: 'KEWARGANEGARAAN', score: 95.0, grade: 'A', sks: 2, academic_year: '2023/2024', semester: 'Genap' },
      { subject: 'BAHASA ARAB III', score: 87.5, grade: 'B+', sks: 2, academic_year: '2023/2024', semester: 'Genap' },
      { subject: 'BAHASA ARAB IV', score: 95.0, grade: 'A', sks: 2, academic_year: '2023/2024', semester: 'Genap' },
      { subject: 'SEJARAH PERADABAN ISLAM', score: 87.5, grade: 'B+', sks: 2, academic_year: '2023/2024', semester: 'Genap' },
      { subject: 'TEOSOFI', score: 87.5, grade: 'B+', sks: 2, academic_year: '2023/2024', semester: 'Genap' },
      
      { subject: 'STRUKTUR DATA', score: 80.0, grade: 'B', sks: 3, academic_year: '2024/2025', semester: 'Ganjil' },
      { subject: 'BASIS DATA', score: 87.5, grade: 'B+', sks: 3, academic_year: '2024/2025', semester: 'Ganjil' },
      { subject: 'SISTEM KOMPUTER', score: 95.0, grade: 'A', sks: 3, academic_year: '2024/2025', semester: 'Ganjil' },
      { subject: 'PRAKTIKUM STRUKTUR DATA', score: 95.0, grade: 'A', sks: 1, academic_year: '2024/2025', semester: 'Ganjil' },
      { subject: 'PRAKTIKUM BASIS DATA', score: 95.0, grade: 'A', sks: 1, academic_year: '2024/2025', semester: 'Ganjil' },
      { subject: 'PRAKTIKUM SISTEM KOMPUTER', score: 95.0, grade: 'A', sks: 1, academic_year: '2024/2025', semester: 'Ganjil' },
      { subject: 'NUMERICAL METHODS', score: 95.0, grade: 'A', sks: 3, academic_year: '2024/2025', semester: 'Ganjil' },
      { subject: 'BAHASA INGGRIS I', score: 95.0, grade: 'A', sks: 3, academic_year: '2024/2025', semester: 'Ganjil' },
      { subject: 'STUDI AL-QUR\'AN DAN AL-HADITS', score: 87.5, grade: 'B+', sks: 2, academic_year: '2024/2025', semester: 'Ganjil' },
      { subject: 'STUDI FIQIH', score: 95.0, grade: 'A', sks: 2, academic_year: '2024/2025', semester: 'Ganjil' },
      
      { subject: 'PEMROGRAMAN WEB', score: 95.0, grade: 'A', sks: 3, academic_year: '2024/2025', semester: 'Genap' },
      { subject: 'REKAYASA PERANGKAT LUNAK', score: 87.5, grade: 'B+', sks: 3, academic_year: '2024/2025', semester: 'Genap' },
      { subject: 'JARINGAN KOMPUTER', score: 95.0, grade: 'A', sks: 3, academic_year: '2024/2025', semester: 'Genap' },
      { subject: 'TECHNOPRENEURSHIP', score: 95.0, grade: 'A', sks: 2, academic_year: '2024/2025', semester: 'Genap' },
      { subject: 'PRAKTIKUM PEMROGRAMAN WEB', score: 95.0, grade: 'A', sks: 1, academic_year: '2024/2025', semester: 'Genap' },
      { subject: 'PRAKTIKUM REKAYASA PERANGKAT LUNAK', score: 95.0, grade: 'A', sks: 1, academic_year: '2024/2025', semester: 'Genap' },
      { subject: 'PRAKTIKUM GRAFIKA KOMPUTER', score: 95.0, grade: 'A', sks: 1, academic_year: '2024/2025', semester: 'Genap' },
      { subject: 'PRAKTIKUM JARINGAN KOMPUTER', score: 95.0, grade: 'A', sks: 1, academic_year: '2024/2025', semester: 'Genap' },
      { subject: 'ARTIFICIAL INTELLIGENCE', score: 95.0, grade: 'A', sks: 3, academic_year: '2024/2025', semester: 'Genap' },
      { subject: 'COMPUTER GRAPHIC', score: 87.5, grade: 'B+', sks: 3, academic_year: '2024/2025', semester: 'Genap' },
      { subject: 'BAHASA INGGRIS II', score: 95.0, grade: 'A', sks: 3, academic_year: '2024/2025', semester: 'Genap' },
      
      { subject: 'SISTEM INFORMASI', score: 95.0, grade: 'A', sks: 3, academic_year: '2025/2026', semester: 'Ganjil' },
      { subject: 'PEMROGRAMAN MULTIMEDIA & GAME', score: 95.0, grade: 'A', sks: 3, academic_year: '2025/2026', semester: 'Ganjil' },
      { subject: 'SISTEM TERDISTRIBUSI & KEAMANAN', score: 95.0, grade: 'A', sks: 3, academic_year: '2025/2026', semester: 'Ganjil' },
      { subject: 'SISTEM OPERASI', score: 95.0, grade: 'A', sks: 3, academic_year: '2025/2026', semester: 'Ganjil' },
      { subject: 'PRAKTIKUM PEMROGRAMAN MOBILE', score: 87.5, grade: 'B+', sks: 1, academic_year: '2025/2026', semester: 'Ganjil' },
      { subject: 'PRAKTIKUM SISTEM INFORMASI', score: 95.0, grade: 'A', sks: 1, academic_year: '2025/2026', semester: 'Ganjil' },
      { subject: 'PRAKTIKUM PEMROGRAMAN MULTIMEDIA & GAME', score: 95.0, grade: 'A', sks: 1, academic_year: '2025/2026', semester: 'Ganjil' },
      { subject: 'PRAKTIKUM SISTEM TERDISTRIBUSI & KEAMANAN', score: 95.0, grade: 'A', sks: 1, academic_year: '2025/2026', semester: 'Ganjil' },
      { subject: 'RESEARCH METHODOLOGY', score: 95.0, grade: 'A', sks: 3, academic_year: '2025/2026', semester: 'Ganjil' },
      { subject: 'MOBILE PROGRAMMING', score: 87.5, grade: 'B+', sks: 3, academic_year: '2025/2026', semester: 'Ganjil' }
    ],
    attendance_records: [
      { absences: 2, total_classes: 100 }
    ],
    prediction: {
      dropout_risk: 1.82,
      career_recommendation: 'AI Systems Engineer & Smart Contract Architect',
      skill_profile: {
        primary_domain: 'Advanced Data Science & Cryptography',
        skills_breakdown: {
          'Cryptography': 98.5,
          'Machine Learning': 95.0,
          'Decentralized Systems': 95.0
        }
      },
      job_matching: {
        position: 'AI & Smart Contract Research Lead',
        recommended_companies: ['Binance', 'Ethereum Foundation', 'Google Research']
      },
      salary_projection: {
        currency: 'IDR',
        min_salary: 22000000.0,
        max_salary: 35000000.0
      },
      startup_probability: {
        industry_domain: 'Decentralized AI & Oracle Networks',
        success_probability: 91.5
      },
      learning_roadmap: [
        'Mendalami Kriptografi Tingkat Lanjut (Zero-Knowledge Proofs)',
        'Mempelajari Teori Konsensus & Protokol Layer-2',
        'Membangun Multi-Agent Predictor Time-Series'
      ]
    }
  }

  // Fetch Student profile & predictions from the Go Indexer Backend
  const fetchStudent = async (addr: string) => {
    setIsLoading(true)
    setErrorMsg('')
    setStudentData(null)

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
      const res = await fetch(`${backendUrl}/api/student/${addr}`)
      if (!res.ok) {
        throw new Error('Data nilai mahasiswa tidak ditemukan di indexer. Silakan simulasikan Minting terlebih dahulu.')
      }
      const data = await res.json()
      setStudentData(data)
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memuat profil mahasiswa dari Go backend. Menggunakan Profil Rencana Daffa.')
      // Use demo fallback so that UI is never blank
      setStudentData(daffaStudentProfile)
    } finally {
      setIsLoading(false)
    }
  }

  // Trigger automatic fetch if address is in URL query parameters or active wallet is connected
  useEffect(() => {
    if (queryAddress && queryAddress.length === 42) {
      setSearchAddress(queryAddress)
      fetchStudent(queryAddress)
    } else if (address) {
      setSearchAddress(address)
      fetchStudent(address)
    } else {
      // Load Daffa's customized profile immediately on mount
      setStudentData(daffaStudentProfile)
    }
  }, [queryAddress, address])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchAddress || searchAddress.length !== 42) {
      setErrorMsg('Alamat Ethereum tidak valid. Harus 42 karakter.')
      return
    }
    // Update query parameter seamlessly
    router.push(`/dashboard?address=${searchAddress}`)
  }

  // Handle highly interactive manual grading form submit (Cetak Rapor & Recalculate)
  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentData) return

    setIsMintingMock(true)
    setSimulatedLogs([])
    setMintSuccessMsg('')

    // Find the course details from AVAILABLE_COURSES
    const targetCourse = AVAILABLE_COURSES.find(c => c.code === selectedCourseCode)
    if (!targetCourse) return

    // Convert numeric grade value (4.0, 3.5, 3.0) to standard letter and scores
    let letterGrade = 'A'
    let percentageScore = 95.0
    const numericVal = parseFloat(selectedGradeValue)
    if (numericVal === 4.0) { letterGrade = 'A'; percentageScore = 95.0; }
    else if (numericVal === 3.5) { letterGrade = 'B+'; percentageScore = 87.5; }
    else if (numericVal === 3.0) { letterGrade = 'B'; percentageScore = 80.0; }
    else if (numericVal === 2.0) { letterGrade = 'C'; percentageScore = 70.0; }
    else { letterGrade = 'D'; percentageScore = 55.0; }

    const absencesCount = parseInt(selectedAttendanceAbsences) || 0

    // Add simulation terminal logs for standard developer transparency
    const newLogs = [
      `[1/4] Compiling data payload for course: ${targetCourse.name} (${targetCourse.code}) - ${targetCourse.sks} SKS`,
      `[2/4] Uploading metadata payload to IPFS (Simulating Pinata gateway broadcast)...`,
      `[3/4] Broadcast successful! IPFS Hash generated: QmSimulate${Math.random().toString(36).substring(2, 10).toUpperCase()}x402D`,
      `[4/4] Sending transaction to Ethereum Smart Contract (EIP-5192 locking) ...`,
      `✔ Rapor berhasil dicetak! Blok transaksi divalidasi dan di-indeks secara instan.`
    ]
    setSimulatedLogs(newLogs)

    // Simulate delay for gorgeous visual feedback
    setTimeout(() => {
      // 1. Check if the subject already exists in student records (e.g. as an ongoing course)
      const existingIdx = studentData.academic_records.findIndex(
        (r: any) => r.subject.toLowerCase() === targetCourse.name.toLowerCase()
      )

      let updatedRecords;
      if (existingIdx > -1) {
        // In-place update of existing ongoing course record
        updatedRecords = [...studentData.academic_records]
        updatedRecords[existingIdx] = {
          ...updatedRecords[existingIdx],
          score: percentageScore,
          grade: letterGrade,
          sks: targetCourse.sks // Ensure correct SKS
        }
      } else {
        // Compile new dynamic record and append
        const newRecord = {
          subject: targetCourse.name,
          score: percentageScore,
          grade: letterGrade,
          sks: targetCourse.sks,
          academic_year: '2025/2026',
          semester: 'Genap'
        }
        updatedRecords = [newRecord, ...studentData.academic_records]
      }

      // 2. Dynamic GPA (IPK) & SKS recalculation!
      let totalSKS = 0
      let totalWeighted = 0.0
      
      updatedRecords.forEach((rec: any) => {
        // Skip In Progress / Ongoing courses
        if (rec.grade === '-' || rec.grade === 'ONGOING') return

        let recVal = 4.0
        if (rec.grade === 'A') recVal = 4.0
        else if (rec.grade === 'B+') recVal = 3.5
        else if (rec.grade === 'B') recVal = 3.0
        else if (rec.grade === 'C') recVal = 2.0
        else recVal = 1.0

        const recSks = rec.sks || 3
        totalSKS += recSks
        totalWeighted += (recSks * recVal)
      })

      const newGPA = totalSKS > 0 ? totalWeighted / totalSKS : 0.0

      // 3. LSTM Risk Recalculator
      const presenceRate = ((100 - absencesCount) / 100)
      const baseRisk = Math.max(0.45, 100.0 - (newGPA * 25.0) - (presenceRate * 5.0))
      const roundedRisk = parseFloat(baseRisk.toFixed(2))

      let recommendation = 'Advanced Research & Data Science Track'
      if (newGPA >= 3.8) recommendation = 'AI Systems Researcher & Quantum Computing Specialist'
      else if (newGPA >= 3.5) recommendation = 'Full Stack Software Architect'
      else recommendation = 'Technology Operations Specialist'

      // Recalculate 5 metrics dynamically
      let primaryDomain = "Software Engineering & Decentralized Tech"
      let skills: Record<string, number> = {
        "Programming": percentageScore,
        "Analytical Thinking": percentageScore,
        "System Design": percentageScore
      }
      
      if (percentageScore >= 85.0) {
        primaryDomain = "Advanced Data Science & Cryptography"
        skills = {
          "Cryptography": percentageScore * 1.05,
          "Machine Learning": percentageScore,
          "Decentralized Systems": percentageScore
        }
      }
      
      const jobMatching = {
        position: primaryDomain === "Advanced Data Science & Cryptography" 
          ? "Blockchain Security Engineer" 
          : "Fullstack DApp Developer",
        recommended_companies: primaryDomain === "Advanced Data Science & Cryptography"
          ? ["Binance", "Ethereum Foundation", "Google Research"]
          : ["GoTo", "Binance", "Traveloka"]
      }
      
      const salaryProjection = {
        currency: "IDR",
        min_salary: percentageScore * 200000,
        max_salary: percentageScore * 320000
      }
      
      const startupProbability = {
        industry_domain: primaryDomain === "Advanced Data Science & Cryptography"
          ? "Decentralized Finance (DeFi) Protocols"
          : "Web3 Developer Infrastructure Tools",
        success_probability: 40.0 + (percentageScore * 0.5)
      }
      
      const learningRoadmap = primaryDomain === "Advanced Data Science & Cryptography"
        ? ["Mendalami Kriptografi Tingkat Lanjut (Zero-Knowledge Proofs)", "Mempelajari Teori Konsensus", "Mempelajari AI Predictor"]
        : ["Mendalami Optimasi Smart Contract", "Membangun Real-Time Go Indexer", "Implementasi 3D Interactive WebGL"]

      // 4. Update complete state!
      setStudentData({
        ...studentData,
        academic_records: updatedRecords,
        attendance_records: [
          { absences: absencesCount, total_classes: 100 }
        ],
        prediction: {
          dropout_risk: roundedRisk,
          career_recommendation: recommendation,
          skill_profile: {
            primary_domain: primaryDomain,
            skills_breakdown: skills
          },
          job_matching: jobMatching,
          salary_projection: salaryProjection,
          startup_probability: startupProbability,
          learning_roadmap: learningRoadmap
        }
      })

      setIsMintingMock(false)
      setMintSuccessMsg(`Mata kuliah ${targetCourse.name} sukses digrading & dimasukkan ke Ledger Rapor!`)
    }, 1500)
  }

  // Calculate live GPA (IPK) and SKS inside the client based on state
  const calculateLiveStats = () => {
    if (!studentData || !studentData.academic_records) return { gpa: 3.82, sks: 115 }
    let totalSKS = 0
    let totalWeighted = 0.0

    studentData.academic_records.forEach((rec: any) => {
      // Skip ongoing courses
      if (rec.grade === '-' || rec.grade === 'ONGOING') return

      // Determine letter grade from score if missing (e.g. from backend API)
      let letterGrade = rec.grade
      if (!letterGrade) {
        if (rec.score >= 90) letterGrade = 'A'
        else if (rec.score >= 85) letterGrade = 'B+'
        else if (rec.score >= 75) letterGrade = 'B'
        else if (rec.score >= 60) letterGrade = 'C'
        else letterGrade = 'D'
      }

      let recVal = 4.0
      if (letterGrade === 'A') recVal = 4.0
      else if (letterGrade === 'B+') recVal = 3.5
      else if (letterGrade === 'B') recVal = 3.0
      else if (letterGrade === 'C') recVal = 2.0
      else recVal = 1.0

      // Match SKS from AVAILABLE_COURSES if missing
      let recSks = rec.sks
      if (!recSks) {
        const match = AVAILABLE_COURSES.find(c => c.name.toLowerCase() === rec.subject.toLowerCase())
        recSks = match ? match.sks : 3
      }

      totalSKS += recSks
      totalWeighted += (recSks * recVal)
    })

    return {
      gpa: totalSKS > 0 ? parseFloat((totalWeighted / totalSKS).toFixed(2)) : 0.0,
      sks: totalSKS
    }
  }

  const liveStats = calculateLiveStats()

  const compileScores = (records: any[]) => {
    if (!records) return []
    return records.map((r: any) => r.score)
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#030303]">
      {/* Sleek Dynamic Indigo Aurora Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-violet-600/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full px-6 py-4 border-b border-white/5 bg-neutral-950/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-glow text-white">EduTrace</span>
              <span className="text-[10px] block font-mono text-indigo-400 font-semibold tracking-wider uppercase">Tri-Core DApp</span>
            </div>
          </Link>
          
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

      {/* Main Terminal Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col gap-10 z-10">
        
        {/* Navigation & Command Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/5 pb-6">
          <div className="flex flex-col gap-2">
            <Link href="/" className="text-xs text-neutral-500 hover:text-indigo-400 transition-colors flex items-center gap-1 font-mono">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Landing Page
            </Link>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Activity className="w-6 h-6 text-indigo-400 animate-pulse" /> Student Ledger Terminal
            </h1>
          </div>
          
          {/* Quick Query Input */}
          <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
            <input 
              type="text" 
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              className="flex-1 md:w-96 bg-neutral-900/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/50 text-white font-mono transition-colors"
              placeholder="Cari Alamat Mahasiswa (0x...)"
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold px-6 py-3 rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-indigo-500/10"
            >
              {isLoading ? 'Loading...' : 'Query'}
            </button>
          </form>
        </div>

        {errorMsg && (
          <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl text-indigo-400 text-xs flex items-center gap-3 animate-pulse">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Bento Grid */}
        <AnimatePresence mode="wait">
          {studentData && (
            <div 
              ref={bentoRef}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              
              {/* Row 1, Col 1: Profile & Identity Details */}
              <div className="bento-card glass-card p-6 rounded-3xl flex flex-col justify-between min-h-[340px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />
                
                <div className="flex flex-col gap-1.5 z-10">
                  <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider font-mono">Identitas Mahasiswa</span>
                  <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-glow transition-all">{studentData.student.name}</h3>
                  <p className="text-xs text-neutral-400 font-mono">{studentData.student.email}</p>
                </div>

                {/* Circular SVG GPA Rating Gauge */}
                <div className="flex items-center gap-6 my-5 z-10">
                  <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0 bg-white/[0.01] rounded-full p-1 border border-white/5 shadow-inner">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="rgba(255, 255, 255, 0.02)"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="url(#gpaGradient)"
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={2 * Math.PI * 40 * (1 - (liveStats.gpa / 4.0))}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                      <defs>
                        <linearGradient id="gpaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-xl font-extrabold text-glow text-amber-400 font-mono leading-none">{liveStats.gpa}</span>
                      <span className="text-[7px] font-mono text-neutral-500 uppercase tracking-wider mt-0.5">GPA / IPK</span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-3 justify-center">
                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-0.5">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider font-semibold">Total Kredit Lulus</span>
                      <span className="text-xl font-extrabold text-glow text-indigo-400 font-mono">{liveStats.sks} SKS</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 mt-auto z-10">
                  <div className="flex items-center justify-between gap-2 py-1.5 px-3 border border-indigo-500/20 bg-indigo-500/5 rounded-xl w-full">
                    <div className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-[9px] font-mono text-indigo-300 font-bold uppercase tracking-wider">Soulbound Token EIP-5192</span>
                    </div>
                    <button 
                      onClick={handleCopyAddress}
                      className="p-1 border border-white/10 bg-black/40 hover:bg-neutral-900 rounded-lg text-neutral-400 hover:text-white transition-all cursor-pointer"
                      title="Copy Address"
                    >
                      {copied ? <Check className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400 bg-neutral-900/60 p-3 rounded-xl border border-white/5 truncate flex justify-between items-center">
                    <span>{truncateAddress(studentData.student.student_address)}</span>
                    <span className="text-[8px] px-1.5 py-0.5 bg-teal-500/10 border border-teal-500/20 rounded font-bold text-teal-400 uppercase tracking-widest">Locked</span>
                  </div>
                </div>
              </div>              {/* Row 1, Col 2 & 3: Three.js Interactive 3D Learning Curve or Animated SVG Vector Curve */}
              <div className="bento-card glass-card lg:col-span-2 rounded-3xl min-h-[340px] relative overflow-hidden flex flex-col justify-between p-6 group">
                <div className="flex items-start justify-between z-10 pointer-events-none w-full">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider font-mono">
                      {isPerformanceMode ? 'Kurva Belajar Vektor 2D' : 'Kurva Belajar 3D AI'}
                    </span>
                    <h4 className="text-lg font-bold text-white group-hover:text-glow transition-all">Visualisasi Real-Time Model Prediksi</h4>
                  </div>
                  
                  {/* Dynamic Performance Mode Toggle */}
                  <div className="flex items-center gap-2 pointer-events-auto">
                    <button
                      onClick={() => setIsPerformanceMode(!isPerformanceMode)}
                      className={`px-3 py-2 border rounded-xl text-[9px] font-mono font-bold tracking-wider uppercase transition-all shadow-md flex items-center gap-1.5 cursor-pointer ${
                        isPerformanceMode 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-black/60 border-white/5 text-neutral-400 hover:text-white hover:border-white/20'
                      }`}
                      title={isPerformanceMode ? 'Switch to Interactive 3D' : 'Switch to Lightweight SVG (Zero CPU)'}
                    >
                      <Activity className={`w-3.5 h-3.5 ${isPerformanceMode ? 'animate-pulse text-emerald-400' : 'text-neutral-400'}`} />
                      <span>{isPerformanceMode ? 'Performance: ON (2D)' : 'Performance: OFF (3D)'}</span>
                    </button>
                  </div>
                </div>
 
                {/* Render Adaptive Curve Visualizer */}
                <div className="absolute inset-0 z-0">
                  {isPerformanceMode ? (
                    <VectorCurve 
                      dropoutRisk={studentData.prediction ? studentData.prediction.dropout_risk : 1.82} 
                    />
                  ) : (
                    <ThreeCurve 
                      scores={compileScores(studentData.academic_records)} 
                      dropoutRisk={studentData.prediction ? studentData.prediction.dropout_risk : 1.82} 
                      startupProbability={studentData.prediction?.startup_probability?.success_probability || 0}
                    />
                  )}
                </div>
              </div>

              {/* Row 2, Col 1: LSTM Prediction Metrics */}
              <div className="bento-card glass-card p-6 rounded-3xl flex flex-col justify-between min-h-[290px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
                
                <div className="flex items-center justify-between z-10">
                  <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                    <Cpu className="w-4 h-4 text-indigo-400" /> LSTM Dropout Forecast
                  </span>
                  <div className="text-[9px] font-bold px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded uppercase font-mono tracking-wider">
                    AI Engine Live
                  </div>
                </div>

                {/* Visual Glow Indicator based on risk */}
                <div className="flex items-center gap-5 my-4 z-10">
                  <div className="flex flex-col gap-1">
                    <span className="text-5xl font-extrabold text-glow text-white leading-none font-mono">
                      {studentData.prediction ? studentData.prediction.dropout_risk : '0.0'}%
                    </span>
                    <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider font-mono mt-1">Dropout Risk Rate</span>
                  </div>
                  
                  {/* Glowing warning visual */}
                  <div className="relative w-12 h-12 flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 rounded-full animate-pulse shadow-lg shadow-emerald-500/10">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_12px_#34d399]" />
                  </div>
                </div>

                <div className="mt-auto border-t border-white/5 pt-4 z-10">
                  <p className="text-white font-bold text-sm leading-snug group-hover:text-glow transition-all">
                    {studentData.prediction ? studentData.prediction.career_recommendation : 'Applied Science Track'}
                  </p>
                  <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider font-mono mt-0.5 block">AI Recommended Cluster</span>
                </div>
              </div>

              {/* Row 2, Col 2: Presence/Attendance Circular Ring */}
              <div className="bento-card glass-card p-6 rounded-3xl min-h-[290px] flex flex-col justify-between group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                    <Clock className="w-4 h-4 text-purple-400" /> Rasio Kehadiran
                  </span>
                  <span className="text-[9px] text-purple-400 font-mono font-bold tracking-wider">Time-Series</span>
                </div>

                {studentData.attendance_records && studentData.attendance_records.length > 0 ? (
                  (() => {
                    const att = studentData.attendance_records[0]
                    const total = att.total_classes || 100
                    const absences = att.absences || 0
                    const presenceRate = ((total - absences) / total) * 100

                    return (
                      <div className="flex items-center gap-6 my-4 z-10">
                        {/* Circular Attendance SVG ring */}
                        <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0 bg-white/[0.01] rounded-full p-1 border border-white/5 shadow-inner">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                              stroke="rgba(255, 255, 255, 0.02)"
                              strokeWidth="8"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                              stroke="url(#presenceGradient)"
                              strokeWidth="8"
                              strokeDasharray={2 * Math.PI * 40}
                              strokeDashoffset={2 * Math.PI * 40 * (1 - (presenceRate / 100))}
                              strokeLinecap="round"
                              className="transition-all duration-1000 ease-out"
                            />
                            <defs>
                              <linearGradient id="presenceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#06b6d4" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-xl font-extrabold text-glow text-white font-mono leading-none">{presenceRate.toFixed(0)}%</span>
                            <span className="text-[7px] font-mono text-neutral-500 uppercase tracking-wider mt-0.5">HADIR</span>
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col gap-2">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xl font-extrabold text-white text-glow leading-none font-mono">
                              {presenceRate.toFixed(1)}%
                            </span>
                            <span className="text-[9px] text-neutral-400 font-bold uppercase font-mono tracking-wider">Presence Ratio</span>
                          </div>
                          <div className="flex items-center justify-between text-xs font-mono border-t border-white/5 pt-2 mt-1">
                            <span className="text-amber-400 font-bold">{absences} Absen</span>
                            <span className="text-neutral-500">{total} Kelas</span>
                          </div>
                        </div>
                      </div>
                    )
                  })()
                ) : (
                  <p className="text-neutral-500 text-xs">Data presensi tidak tersedia.</p>
                )}

                <div className="border-t border-white/5 pt-3 text-[10px] text-neutral-400 flex items-center gap-2 mt-auto">
                  <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>Integritas presensi sinkron IPFS.</span>
                </div>
              </div>

              {/* Row 2, Col 3: Teacher Sandbox Panel (Embedded beautifully inside Grid!) */}
              <div className="bento-card glass-card p-6 rounded-3xl min-h-[290px] flex flex-col justify-between relative overflow-hidden group border border-indigo-500/10 hover:border-indigo-500/30 transition-all">
                {/* Glowing rotating style gradient effect in background */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/0 to-indigo-500/10 opacity-30 group-hover:opacity-50 transition-opacity pointer-events-none" />
                
                <div className="flex items-center justify-between z-10">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                    <Award className="w-4 h-4 text-indigo-400" /> Teacher Sandbox
                  </span>
                  <span className="text-[8px] px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded font-bold uppercase tracking-wider font-mono">Panel Guru</span>
                </div>

                {/* Compact Interactive Grading Form */}
                <form onSubmit={handleTeacherSubmit} className="flex flex-col gap-3 my-3 z-10">
                  {/* Select Course dropdown */}
                  <div className="flex flex-col gap-1">
                    <select 
                      value={selectedCourseCode}
                      onChange={(e) => setSelectedCourseCode(e.target.value)}
                      className="bg-black/80 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white focus:outline-none focus:border-indigo-500/50 font-mono w-full transition-colors"
                    >
                      {AVAILABLE_COURSES.map(course => (
                        <option key={course.code} value={course.code}>
                          [{course.code}] {course.name.length > 25 ? course.name.substring(0, 25) + '...' : course.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Grade select */}
                    <div className="flex flex-col gap-0.5">
                      <select 
                        value={selectedGradeValue}
                        onChange={(e) => setSelectedGradeValue(e.target.value)}
                        className="bg-black/80 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white focus:outline-none focus:border-indigo-500/50 font-mono transition-colors"
                      >
                        <option value="4.0">A (4.0)</option>
                        <option value="3.5">B+ (3.5)</option>
                        <option value="3.0">B (3.0)</option>
                        <option value="2.0">C (2.0)</option>
                        <option value="1.0">D (1.0)</option>
                      </select>
                    </div>

                    {/* Absences select */}
                    <div className="flex flex-col gap-0.5">
                      <input 
                        type="number" 
                        min="0"
                        max="100"
                        value={selectedAttendanceAbsences}
                        onChange={(e) => setSelectedAttendanceAbsences(e.target.value)}
                        className="bg-black/80 border border-white/10 rounded-xl px-3 py-2 text-[10px] focus:outline-none focus:border-indigo-500/50 text-white font-mono text-center transition-colors"
                        placeholder="Absen"
                      />
                    </div>
                  </div>

                  {/* Dynamic mini Console log message */}
                  <div className="h-6 overflow-hidden flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {isMintingMock ? (
                        <motion.span 
                          key="loading"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-[9px] font-mono text-indigo-400 animate-pulse uppercase tracking-wider"
                        >
                          Minting EIP-5192 SBT...
                        </motion.span>
                      ) : mintSuccessMsg ? (
                        <motion.span 
                          key="success"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-[9px] font-mono text-teal-400 font-semibold truncate max-w-[200px]"
                        >
                          ✔ Grading sukses!
                        </motion.span>
                      ) : (
                        <motion.span 
                          key="idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-[8px] font-mono text-neutral-500 tracking-wide"
                        >
                          Sistem akan ter-recalculate secara live.
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isMintingMock}
                    className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-[11px] py-2 px-4 rounded-xl font-bold transition-all shadow-md hover:shadow-indigo-500/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isMintingMock ? 'Cetak Rapor...' : 'Cetak & Hubungkan Ledger'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              {/* Row 3: 5 Detailed AI Metrics Widgets */}
              {/* Row 3, Col 1: Skill Profiling (Radar Chart) */}
              <div className="bento-card glass-card p-6 rounded-3xl min-h-[340px] flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />
                <div className="flex items-center justify-between z-10">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold">
                    <GraduationCap className="w-4 h-4 text-indigo-400" /> Skill Profiling
                  </span>
                  <span className="text-[8px] px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded font-bold uppercase tracking-wider font-mono">Radar Model</span>
                </div>
                <div className="my-3 z-10 flex-1 flex items-center justify-center">
                  <SkillRadarChart skills={studentData.prediction?.skill_profile?.skills_breakdown || {
                    "Programming": 75.0,
                    "Analytical Thinking": 75.0,
                    "System Design": 75.0
                  }} />
                </div>
                <div className="border-t border-white/5 pt-3 text-[10px] text-neutral-400 flex items-center gap-2 mt-auto z-10">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="truncate">Domain: {studentData.prediction?.skill_profile?.primary_domain || "Software Engineering & Decentralized Tech"}</span>
                </div>
              </div>

              {/* Row 3, Col 2: Job Matching & Salary Projection */}
              <div className="bento-card glass-card p-6 rounded-3xl min-h-[340px] flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/10 transition-colors" />
                <div className="flex items-center justify-between z-10">
                  <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold">
                    <Briefcase className="w-4 h-4 text-purple-400" /> Career Matcher
                  </span>
                  <span className="text-[8px] px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded font-bold uppercase tracking-wider font-mono">Recruiter Match</span>
                </div>
                <div className="my-4 z-10 flex-1">
                  <JobMatcherWidget 
                    jobMatching={studentData.prediction?.job_matching} 
                    salary={studentData.prediction?.salary_projection} 
                  />
                </div>
                <div className="border-t border-white/5 pt-3 text-[10px] text-neutral-400 flex items-center gap-2 mt-auto z-10 font-mono">
                  <Database className="w-3.5 h-3.5 text-purple-400" />
                  <span>Live market salary indices synced.</span>
                </div>
              </div>

              {/* Row 3, Col 3: Startup Success & Learning Roadmap */}
              <div className="bento-card glass-card p-6 rounded-3xl min-h-[340px] flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-teal-500/10 transition-colors" />
                <div className="flex items-center justify-between z-10">
                  <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold">
                    <TrendingUp className="w-4 h-4 text-teal-400" /> Startup & Roadmap
                  </span>
                  <span className="text-[8px] px-2 py-0.5 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded font-bold uppercase tracking-wider font-mono">Resilience Index</span>
                </div>
                <div className="my-2 z-10 flex-1 flex flex-col justify-between">
                  <StartupWidget startup={studentData.prediction?.startup_probability} />
                  <RoadmapWidget roadmap={studentData.prediction?.learning_roadmap} />
                </div>
                <div className="border-t border-white/5 pt-3 text-[10px] text-neutral-400 flex items-center gap-2 mt-auto z-10">
                  <Award className="w-3.5 h-3.5 text-teal-400" />
                  <span>Step-by-step custom tutorial compiled.</span>
                </div>
              </div>

              {/* Row 4: Spacious tabbed academic ledger card (Grand Ledger KHS!) */}
              <div className="bento-card glass-card p-8 rounded-3xl lg:col-span-3 min-h-[400px] flex flex-col gap-6 group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-teal-400 animate-pulse" />
                    <div>
                      <h4 className="text-xl font-bold text-white group-hover:text-glow transition-all">Grand Academic Ledger (KHS)</h4>
                      <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Ledger Rapor Akademik Terenkripsi EIP-5192</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-neutral-900/60 p-1 border border-white/5 rounded-xl text-[10px] font-mono text-neutral-400 w-fit">
                    <PieChart className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Total: {studentData.academic_records.length} Records</span>
                  </div>
                </div>

                {/* Horizontal Semester tab navigators */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full border-b border-white/5">
                  {TABS.map(tab => {
                    const isSelected = activeTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-xs rounded-xl font-medium transition-all font-mono flex-shrink-0 cursor-pointer ${
                          isSelected 
                            ? 'bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-glow' 
                            : 'border border-transparent text-neutral-400 hover:text-white hover:bg-white/[0.02]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    )
                  })}
                </div>

                {/* Tab Content: Semester course capsule grid */}
                <div className="flex-1">
                  {(() => {
                    const filteredRecords = studentData.academic_records.filter((rec: any) => {
                      if (activeTab === 'Semua') return true
                      const targetSem = activeTab.split(' ')[0]
                      const targetYear = activeTab.substring(targetSem.length + 1)
                      return rec.semester === targetSem && rec.academic_year === targetYear
                    })

                    if (filteredRecords.length === 0) {
                      return (
                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-neutral-500 font-mono">
                          <BookOpen className="w-8 h-8 text-neutral-600 animate-pulse" />
                          <span className="text-xs">Tidak ada record nilai untuk semester ini.</span>
                        </div>
                      )
                    }

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                        <AnimatePresence mode="popLayout">
                          {filteredRecords.map((rec: any, idx: number) => {
                            let letterGrade = rec.grade
                            if (!letterGrade) {
                              if (rec.score >= 90) letterGrade = 'A'
                              else if (rec.score >= 85) letterGrade = 'B+'
                              else if (rec.score >= 75) letterGrade = 'B'
                              else if (rec.score >= 60) letterGrade = 'C'
                              else letterGrade = 'D'
                            }

                            let recSks = rec.sks
                            if (!recSks) {
                              const match = AVAILABLE_COURSES.find(c => c.name.toLowerCase() === rec.subject.toLowerCase())
                              recSks = match ? match.sks : 3
                            }

                            const isOngoing = letterGrade === '-'

                            return (
                              <motion.div
                                key={rec.subject}
                                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                className={`p-4 border rounded-2xl flex items-center justify-between transition-all hover:bg-white/[0.02] ${
                                  isOngoing 
                                    ? 'bg-indigo-500/[0.02] border-indigo-500/20 hover:border-indigo-500/40 shadow-lg shadow-indigo-500/[0.02]' 
                                    : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                                }`}
                              >
                                <div className="flex flex-col gap-1">
                                  <span className="text-sm font-bold text-white truncate max-w-[170px]">{rec.subject}</span>
                                  <span className="text-[9px] font-mono text-neutral-400 flex items-center gap-1.5">
                                    <span>{rec.academic_year || '2025/2026'}</span>
                                    <span className="w-1 h-1 rounded-full bg-neutral-600" />
                                    <span className="text-indigo-400 font-semibold">{recSks} SKS</span>
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <span className={`font-mono font-bold text-xs ${
                                    isOngoing 
                                      ? 'text-indigo-400 tracking-wider text-[10px]' 
                                      : (letterGrade === 'A' || letterGrade === 'B+' ? 'text-teal-400' : 'text-amber-400')
                                  }`}>
                                    {isOngoing ? 'ONGOING' : letterGrade}
                                  </span>
                                  <span className={`w-2 h-2 rounded-full ${
                                    isOngoing 
                                      ? 'bg-indigo-400 animate-pulse shadow-[0_0_8px_#6366f1]' 
                                      : (letterGrade === 'A' || letterGrade === 'B+' ? 'bg-teal-400 shadow-[0_0_6px_#14b8a6]' : 'bg-amber-400')
                                  }`} />
                                </div>
                              </motion.div>
                            )
                          })}
                        </AnimatePresence>
                      </div>
                    )
                  })()}
                </div>
              </div>

            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-6 px-6 mt-16 text-center text-neutral-600 text-xs font-mono">
        <p>© 2026 EduTrace Monorepo. All rights reserved.</p>
      </footer>
    </div>
  )
}

// 2. Main Page default export enclosing DashboardContent inside a React Suspense Boundary
export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-neutral-400">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500" />
          <span className="text-xs font-mono tracking-widest uppercase text-glow">Initializing Ledger Terminal...</span>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
