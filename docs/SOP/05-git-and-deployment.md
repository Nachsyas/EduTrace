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
