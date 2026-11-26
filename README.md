🎓 Filter Wajah "Wisuda dan Kampus"

Miniproject UTS Praktikum AR dan VR KELOMPOK 1 · Prodi Teknologi Informasi · FIKTI UMSU · 2026

Aplikasi (HTTPS): https://aulnyenye-debug.github.io/filter-wisuda-kampus/

Deskripsi

Aplikasi AR berbasis web yang berjalan di browser HP tanpa instalasi. Kamera depan mendeteksi wajah, lalu aksesori 3D bertema wisuda menempel dan ikut bergerak. Foto hanya disimpan di perangkat pengguna.

Fitur

	•	2 aksesori 3D (GLB): Topi Toga (tassel berayun) dan Kacamata Berkilau (bintang berputar)
	•	Face tracking dengan MindAR dan Three.js
	•	Tombol ganti filter dan tombol ambil foto
	•	Pesan jelas jika izin kamera ditolak
	•	Filter terakhir tersimpan (localStorage)
	•	Data filter terpisah dari kode di data/filters.json

Cara menjalankan

	•	Di HP: buka tautan di atas (atau scan QR) dengan Chrome atau Safari, ketuk Mulai Kamera, lalu izinkan kamera.
	•	Di laptop: buka folder di VS Code, klik kanan index.html, pilih Open with Live Server.
	•	Penyesuaian posisi aksesori: tambahkan ?debug=1 di akhir alamat.

Struktur

index.html · js/main.js · css/style.css · data/filters.json · assets/ (model GLB) · docs/ (matriks perangkat dan lisensi aset)


## Batasan yang diketahui
- Filter wajah dapat berjalan dengan baik pada kondisi pencahayaan yang cukup.
- Pada kondisi pencahayaan yang gelap atau minim cahaya, sistem mengalami kesulitan dalam mendeteksi wajah.
- Dalam kondisi tersebut, filter terkadang tidak dapat mendeteksi wajah sehingga efek filter tidak muncul atau tidak mengikuti wajah dengan baik.

Catatan: Untuk mendapatkan hasil yang lebih optimal, disarankan menggunakan filter di tempat dengan pencahayaan yang cukup agar wajah dapat terdeteksi dengan lebih baik.


## Tim

| Nama | Peran |
|---|---|
| Dinda Aulia Putri (aulnyenye-debug) | Project Manager dan Integrator |
| Raihan Ali (taraa25565-debug) | Aset 3D dan Animasi |
| Febrio Alpasha (febriopasha) | Engineer Tracking |
| Annisa Natasya (annisanatasya-14) | QA dan Dokumentasi |
| Rais Alhazmi (raisalhazmi2110-netizen) | Interaksi dan UI/UX |
| Nabil Azmi (nabilazmi-vr) | Data dan Persistence |
