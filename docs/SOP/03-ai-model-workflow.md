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
