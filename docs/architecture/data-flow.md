Data Flow — Rekam Jejak Seumur Hidup
Input (Institusi): Guru login via dompet Web3, mengunggah data nilai JSON ke IPFS.

Minting (Smart Contract): Guru memanggil fungsi mintReportCard(studentAddress, ipfsCID).

Indexing (Go): Go listener menangkap event mintReportCard, menarik JSON dari IPFS, merapikan data, dan menyimpannya di PostgreSQL.

Prediksi (Python AI): Go memanggil API AI. Model LSTM membaca riwayat nilai dari PostgreSQL dan mengembalikan Risk Score & Career Recommendation.

Visualisasi (Next.js): Siswa login, dashboard menarik data AI dari API Go dan data blockchain dari Viem, merendernya dalam grafik 3D interaktif.
