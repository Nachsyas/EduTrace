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
