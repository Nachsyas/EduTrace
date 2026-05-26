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
