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
