# 🤖 PROMPT MASTER — Bootstrap EduTrace (Enterprise Web3 + AI DApp)

> **TUJUAN FILE INI**: File ini adalah **prompt master lengkap** untuk di-copy-paste ke AI agent (Google Antigravity, Cursor, Claude Code, dll) agar AI dapat **mereplikasi seluruh struktur arsitektur Web3, AI microservices, dan standar animasi UI tingkat Awwwards** untuk proyek `EduTrace` dari nol secara identik.
>
> **CARA PAKAI**:
> 1. Buka workspace/folder kosong.
> 2. Copy SELURUH isi file ini ke prompt AI agent.
> 3. AI akan otomatis membuat semua file & folder sesuai dengan blueprint.

---

# ============================================================
# BAGIAN 1 — INSTRUKSI UTAMA UNTUK AI AGENT
# ============================================================

## 🎯 Misi Kamu (AI Agent)
Halo AI Agent! Kamu ditugaskan untuk melakukan bootstrap dokumentasi dan SOP untuk proyek **EduTrace** (Sistem Rapor Cerdas Terdesentralisasi). Ini adalah proyek NSEC 2026 berskala *Enterprise* yang menggabungkan *Smart Contracts*, *Artificial Intelligence* (Analitik Prediktif), dan Antarmuka Web 3D. Kamu WAJIB mengikuti instruksi di bawah secara berurutan dan TANPA SKIP.

## ⚙️ Stack Proyek (STANDAR INDUSTRI — FIXED)

| Pilar | Komponen | Teknologi Profesional |
|-------|----------|-----------------------|
| **Web3 (Core)** | Smart Contracts | **Solidity + Foundry** (Forge/Cast) |
| **Web3 (Core)** | Token Standard | **EIP-5192 (Soulbound Token)** |
| **Frontend** | Framework | **Next.js 15 (App Router) + TypeScript** |
| **Frontend** | Web3 Integration| **Wagmi v2 + Viem + AppKit** |
| **Frontend** | UI & Animasi | **Tailwind + Shadcn + GSAP + Three.js + Framer Motion** |
| **Backend** | API & Indexer | **Go (Golang)** murni net/http |
| **AI Data** | Microservice | **Python (FastAPI) + PyTorch (LSTM)** |
| **Database** | Relational & IPFS| **Supabase (PostgreSQL) + Pinata (IPFS)** |

## 🚫 LARANGAN MUTLAK
1. ❌ JANGAN gunakan framework Web3 usang (Truffle, Hardhat, Web3.js, Ethers.js lawas). WAJIB Foundry & Viem.
2. ❌ JANGAN buat antarmuka statis. UI WAJIB menggunakan GSAP/Lenis/Three.js untuk animasi.
3. ❌ JANGAN taruh AI logic di Smart Contract. AI harus berjalan di *off-chain* Python API.
4. ❌ JANGAN buat backend code/frontend code di tahap ini. HANYA buat struktur dokumentasi, SOP, dan SKILLS.
5. ❌ JANGAN ubah delimiter `===== FILE: path =====`.

## ✅ URUTAN EKSEKUSI (WAJIB BERURUTAN)
Step 1  → Buat root files (.gitignore, AGENTS.md, README.md)
Step 2  → Buat folder docs/SOP/ (Isi 5 SOP Utama)
Step 3  → Buat folder docs/architecture/ (3 file arsitektur)
Step 4  → Buat folder docs/features/ (1 file template)
Step 5  → Buat folder docs/todo/ (1 file master todo)
Step 6  → Buat folder .agents/skills/ (Isi 5 SKILL khusus)
Step 7  → Validasi semua 18 file sudah dibuat.
Step 8  → Lapor ke user dengan ringkasan.


## 📁 STRUKTUR FOLDER FINAL
/
│
├── .agents/skills/
│   ├── read-sop/SKILL.md
│   ├── create-smart-contract/SKILL.md
│   ├── implement-3d-ui/SKILL.md
│   ├── build-ai-service/SKILL.md
│   └── write-tests/SKILL.md
│
├── docs/
│   ├── SOP/
│   │   ├── 01-web3-standards.md
│   │   ├── 02-ui-animation-standards.md
│   │   ├── 03-ai-model-workflow.md
│   │   ├── 04-go-indexer-standards.md
│   │   └── 05-git-and-deployment.md
│   ├── architecture/
│   │   ├── system-design.md
│   │   ├── project-structure.md
│   │   └── data-flow.md
│   ├── features/
│   │   └── feature-template.md
│   └── todo/
│       └── master-todo.md
│
├── .gitignore
├── AGENTS.md
└── README.md


---

# ============================================================
# BAGIAN 2 — KONTEN PERSIS SETIAP FILE (COPY EXACTLY)
# ============================================================

## 📄 FILE 1 — `.gitignore`
===== FILE: .gitignore =====

Frontend (Next.js)
.next/
node_modules/
out/
build/

Backend (Go)
/backend/bin/
/backend/tmp/

AI Microservice (Python)
pycache/
*.pyc
.venv/
venv/

Smart Contracts (Foundry)
/contracts/out/
/contracts/cache/
/contracts/broadcast/

Environment
.env
.env.local
.DS_Store
===== END FILE =====


## 📄 FILE 2 — `AGENTS.md`
===== FILE: AGENTS.md =====

EduTrace — AI Agent Instructions
MANDATORY: Aturan ketat pengembangan DApp tingkat Enterprise. WAJIB BACA SEBELUM CODING!

🧬 Arsitektur Tri-Core
contracts/ (Solidity/Foundry): Soulbound Token (SBT) EIP-5192.

frontend/ (Next.js/Three.js): UI/UX GSAP & Web3 Provider Wagmi.

services/ (Go & Python): Go untuk Web3 Event Indexing, Python untuk LSTM Predictive AI.

🤖 Aturan AI Agent
Selalu jalankan skill read-sop sebelum memulai task apa pun.

Jangan gunakan library di luar tech stack yang diizinkan di docs/SOP/.

Backend Go menggunakan Clean Architecture 4-Layer.

Frontend Next.js HANYA menggunakan App Router.
===== END FILE =====


## 📄 FILE 3 — `README.md`
===== FILE: README.md =====

🚀 Deskripsi
EduTrace memecahkan manipulasi nilai dan deteksi putus sekolah dini melalui:

Web3 (Immutable Ledger): Minting rapor sebagai Soulbound Token (SBT).

AI (Analitik Prediktif): Model LSTM menganalisis time-series nilai siswa untuk deteksi dini drop-out dan rekomendasi karier.

🛠 Tech Stack
Blockchain: Solidity, Foundry, ERC-5192.

Frontend: Next.js 15, Wagmi v2, Viem, GSAP, Three.js, Tailwind.

Backend: Go (Event Indexer), Python (FastAPI LSTM Model).

Database: Supabase (PostgreSQL), IPFS (Pinata).
===== END FILE =====


## 📄 FILE 4 — `docs/SOP/01-web3-standards.md`
===== FILE: docs/SOP/01-web3-standards.md =====

SOP 01 — Web3 & Smart Contract Standards
1. Development Engine
WAJIB menggunakan Foundry. Tidak boleh menggunakan Hardhat.

Build: forge build

Test: forge test -vvv

2. EIP-5192 Soulbound Token (SBT)
Semua ijazah/rapor menggunakan ERC721 yang di-override dengan EIP-5192.

Token tidak boleh bisa ditransfer (locked status wajib true).

3. Gas Optimization
Simpan data berat (nilai detail, JSON) di IPFS (Pinata).

Simpan hanya IPFS Hash (CID) di dalam Smart Contract.

4. Frontend Integration
DILARANG menggunakan web3.js atau ethers.js.

WAJIB menggunakan Wagmi v2 dan Viem.

Gunakan @web3modal/wagmi (AppKit) untuk wallet connection.
===== END FILE =====


## 📄 FILE 5 — `docs/SOP/02-ui-animation-standards.md`
===== FILE: docs/SOP/02-ui-animation-standards.md =====

SOP 02 — UI/UX & Animation Standards (Awwwards-Level)
1. Core Principles
No Static Sites: Desain statis dilarang keras. Semua halaman harus terasa "hidup".

Smooth Scroll: Gunakan @studio-freight/lenis di level layout.tsx.

2. Animation Libraries
GSAP: Untuk scroll-triggers, paralaks, dan hero sequences.

Framer Motion: Untuk micro-interactions (hover, active states, modals).

Three.js (@react-three/fiber): WAJIB digunakan untuk memvisualisasikan "Kurva Belajar Prediktif AI" dalam bentuk partikel 3D yang interaktif.

3. UI Framework
Gunakan Tailwind CSS.

Gunakan komponen dasar dari Shadcn UI.

Padukan dengan Aceternity UI (Background Beams, Tracing Beams, Bento Grids) untuk efek futuristik.
===== END FILE =====


## 📄 FILE 6 — `docs/SOP/03-ai-model-workflow.md`
===== FILE: docs/SOP/03-ai-model-workflow.md =====

SOP 03 — AI Predictive Model Workflow
1. Lingkungan (Python)
Gunakan FastAPI untuk serving API.

Gunakan PyTorch atau TensorFlow untuk melatih model LSTM (Long Short-Term Memory).

2. Logika Prediksi
Input: Time-series nilai akademik siswa dari SD hingga SMA, data absensi, data demografi (diambil dari Supabase).

Output:

Probabilitas (persentase) risiko drop-out atau tertinggal.

Rekomendasi karir (Clustering/Classification).

3. Off-Chain Execution
AI TIDAK berjalan di blockchain (terlalu mahal).

Python API dipanggil secara asinkron. Hasil prediksi (skor AI) akan di-hash dan disimpan ke Blockchain sebagai bukti integritas (opsional).
===== END FILE =====


## 📄 FILE 7 — `docs/SOP/04-go-indexer-standards.md`
===== FILE: docs/SOP/04-go-indexer-standards.md =====

SOP 04 — Go Backend & Event Indexer
1. Peran Go
Bertindak sebagai "jembatan" antara Blockchain, Database Relasional, dan AI.

Mendengarkan (listen) ke Smart Contract Events (misal: event ReportCardMinted(address student, string cid)).

2. Arsitektur Clean Architecture
Layer: Domain → UseCase → Repository → Handler/Listener.

Murni menggunakan net/http untuk REST endpoint.

3. Alur Indexing
Go mendengarkan event Blockchain menggunakan go-ethereum/ethclient (binding dari abigen).

Mengambil detail data dari IPFS (CID).

Menyimpan data relasional ke Supabase (PostgreSQL).

Memicu endpoint AI (Python FastAPI) untuk meramal ulang kurva siswa.
===== END FILE =====


## 📄 FILE 8 — `docs/SOP/05-git-and-deployment.md`
===== FILE: docs/SOP/05-git-and-deployment.md =====

SOP 05 — Git & Deployment Strategy
1. Branching
main (Production)

develop (Integration)

feature/* (Tugas baru)

smart-contract/* (Khusus Solidity)

2. Deployment
Frontend (Next.js): Vercel.

Backend (Go) & AI (Python): Docker Compose -> VPS (DigitalOcean/AWS).

Smart Contract: forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast.
===== END FILE =====


## 📄 FILE 9 — `docs/architecture/system-design.md`
===== FILE: docs/architecture/system-design.md =====

System Design EduTrace
Cuplikan kode
graph TD
    subgraph Client [Frontend - Next.js + GSAP + Three.js]
        UI[Awwwards UI]
        WAGMI[Wagmi/Viem]
    end

    subgraph Blockchain [Web3 Layer]
        SC[Smart Contracts - SBT Rapor]
    end

    subgraph Storage [Decentralized Storage]
        IPFS[Pinata IPFS]
    end

    subgraph Backend [Off-chain Services]
        GO[Go Event Indexer]
        DB[(Supabase PostgreSQL)]
        AI[Python FastAPI LSTM]
    end

    UI <-->|Connect Wallet| WAGMI
    WAGMI <-->|Mint/Read| SC
    UI -->|Fetch Metadata| IPFS
    
    SC -->|Emit Events| GO
    GO -->|Simpan History| DB
    GO -->|Kirim Dataset| AI
    AI -->|Kembalikan Prediksi| GO
    GO -->|API Rest| UI
===== END FILE =====


## 📄 FILE 10 — `docs/architecture/project-structure.md`
===== FILE: docs/architecture/project-structure.md =====

Project Structure
edutrace-monorepo/
├── contracts/               # Pilar 1: Smart Contracts (Foundry)
│   ├── src/                 # Solidity files
│   ├── test/                # Forge tests
│   └── script/              # Deployment scripts
│
├── frontend/                # Pilar 2: Next.js Web3 App
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # UI, GSAP, Three.js canvas
│   │   ├── hooks/           # Wagmi custom hooks
│   │   └── lib/             # Viem config, utils
│
├── services/                # Pilar 3: Backend & AI
│   ├── go-indexer/          # Clean Architecture Go app
│   └── python-ai/           # FastAPI, PyTorch models
│
└── docs/                    # Dokumentasi Master
===== END FILE =====


## 📄 FILE 11 — `docs/architecture/data-flow.md`
===== FILE: docs/architecture/data-flow.md =====

Data Flow — Rekam Jejak Seumur Hidup
Input (Institusi): Guru login via dompet Web3, mengunggah data nilai JSON ke IPFS.

Minting (Smart Contract): Guru memanggil fungsi mintReportCard(studentAddress, ipfsCID).

Indexing (Go): Go listener menangkap event mintReportCard, menarik JSON dari IPFS, merapikan data, dan menyimpannya di PostgreSQL.

Prediksi (Python AI): Go memanggil API AI. Model LSTM membaca riwayat nilai dari PostgreSQL dan mengembalikan Risk Score & Career Recommendation.

Visualisasi (Next.js): Siswa login, dashboard menarik data AI dari API Go dan data blockchain dari Viem, merendernya dalam grafik 3D interaktif.
===== END FILE =====


## 📄 FILE 12 — `docs/features/feature-template.md`
===== FILE: docs/features/feature-template.md =====

📄 Feature Document Template
🏷️ Feature: [Nama Fitur]
Pilar Terlibat: ☐ Contracts | ☐ Frontend | ☐ Go API | ☐ Python AI

📋 Deskripsi
[Jelaskan fitur secara singkat]

📐 Technical Design
Smart Contract Interface (Jika ada): ...

API Endpoint (Jika ada): ...

UI/Animation Behavior: ...

🧪 Test Scenarios
[Gambarkan Skenario Uji Forge / Unit Test]
===== END FILE =====


## 📄 FILE 13 — `docs/todo/master-todo.md`
===== FILE: docs/todo/master-todo.md =====

📋 Master To-Do List EduTrace
Phase 1: Smart Contracts (Web3 Core)
[ ] Inisialisasi Foundry project.

[ ] Buat ERC721 Token Standard.

[ ] Implementasi EIP-5192 (Soulbound logic).

[ ] Tulis Forge Tests (100% coverage untuk logic minting).

Phase 2: Backend Infrastructure
[ ] Setup Supabase PostgreSQL.

[ ] Buat Go Event Listener untuk Smart Contract events.

[ ] Setup Python FastAPI environment & dummy LSTM model.

Phase 3: Frontend Foundation
[ ] Setup Next.js 15 App Router.

[ ] Integrasi Wagmi v2 + AppKit WalletConnect.

[ ] Setup Lenis Smooth Scroll & Tailwind.

Phase 4: UI/UX & AI Visualization
[ ] Buat Landing Page dengan GSAP ScrollTrigger.

[ ] Buat Dashboard Siswa dengan Bento Grid.

[ ] Implementasi Three.js Canvas untuk AI Learning Curve 3D.
===== END FILE =====


## 📄 FILE 14 — `.agents/skills/read-sop/SKILL.md`
===== FILE: .agents/skills/read-sop/SKILL.md =====
name: Read Project SOP
description: Membaca SOP sebelum menulis kode Web3, Go, atau Python.
Read Project SOP
WAJIB BACA:

docs/SOP/01-web3-standards.md

docs/SOP/02-ui-animation-standards.md

docs/SOP/03-ai-model-workflow.md

docs/architecture/system-design.md

Pastikan kamu memahami batasan penggunaan Foundry, GSAP, dan off-chain AI.
===== END FILE =====


## 📄 FILE 15 — `.agents/skills/create-smart-contract/SKILL.md`
===== FILE: .agents/skills/create-smart-contract/SKILL.md =====
name: Create Foundry Smart Contract
description: Menulis dan menguji Smart Contract Solidity dengan Foundry.
Create Smart Contract
WAJIB di dalam folder contracts/src/.

Gunakan versi pragma solidity ^0.8.20.

Selalu buat pasangan test file di contracts/test/.

Wajib gunakan modifier untuk Role-Based Access Control (RBAC).
===== END FILE =====


## 📄 FILE 16 — `.agents/skills/implement-3d-ui/SKILL.md`
===== FILE: .agents/skills/implement-3d-ui/SKILL.md =====
name: Implement 3D/Animated UI
description: Merancang UI Next.js dengan animasi GSAP, Framer Motion, atau Three.js.
Implement 3D UI
Gunakan Tailwind untuk styling dasar.

Gunakan gsap.context() saat memakai GSAP di dalam React (useEffect).

Pisahkan komponen <Canvas> Three.js agar tidak menyebabkan re-render di DOM biasa.

Terapkan Aceternity UI components jika diminta.
===== END FILE =====


## 📄 FILE 17 — `.agents/skills/build-ai-service/SKILL.md`
===== FILE: .agents/skills/build-ai-service/SKILL.md =====
name: Build AI Service
description: Membuat endpoint Python FastAPI untuk model prediktif.
Build AI Service
Buat router FastAPI.

Buat class pydantic untuk input validasi.

Jika model belum dilatih, buat fungsi mocking yang mengembalikan response probabilitas yang logis.
===== END FILE =====


## 📄 FILE 18 — `.agents/skills/write-tests/SKILL.md`
===== FILE: .agents/skills/write-tests/SKILL.md =====
name: Write Tests
description: Menulis Forge test, Go test, atau PyTest.
Write Tests
Solidity: Gunakan forge-std/Test.sol.

Go: Gunakan standard testing package & table-driven tests.

Python: Gunakan pytest dan FastAPI.testclient.
===== END FILE =====


---

# ============================================================
# BAGIAN 3 — VALIDASI & VERIFIKASI HASIL
# ============================================================

Setelah semua file dibuat, AI Agent **HARUS** memverifikasi:
- 18 file telah terbuat dengan sempurna.
- File `.agents/skills/` berisi 5 file SKILL.md yang terfokus pada Web3, AI, dan 3D UI.
- Semua stack yang disebutkan di `AGENTS.md` mematuhi aturan standar industri (Foundry, Next.js, Go, Python).

---

# ============================================================
# BAGIAN 4 — LAPORAN AKHIR
# ============================================================

```text
✅ Bootstrap proyek EduTrace (Enterprise Web3 + AI) selesai!

📁 Struktur yang dibuat:
- .agents/skills/ (5 skill folder untuk arsitektur Tri-Core)
- docs/SOP/ (5 file SOP standar industri Web3/Animasi/AI/Go)
- docs/architecture/ (3 file desain sistem)
- docs/features & docs/todo (2 file manajerial)
- Root files (3 file)

📊 Total: 18 file dokumentasi master

🎯 Standar Industri Ditegakkan:
- Smart Contract: Solidity, Foundry, ERC-5192 (SBT).
- Frontend: Next.js 15, Wagmi v2, GSAP, Three.js.
- Layanan Off-chain: Go (Event Indexer) & Python (LSTM API).

🚀 Siap untuk membangun sistem pendidikan masa depan!
============================================================
BAGIAN 5 — INSTRUKSI ASSEMBLY
============================================================
Cari delimiter ===== FILE: <path> =====.

Buat direktori parent jika belum ada (contoh: docs/SOP/).

Tulis konten persis tanpa menyertakan baris delimiter tersebut.

Gunakan UTF-8 dan eksekusi hingga tuntas!