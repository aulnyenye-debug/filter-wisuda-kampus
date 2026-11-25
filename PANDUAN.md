# PANDUAN DARI NOL — Topik 1: Filter Wajah "Wisuda dan Kampus"

Proyek ini sudah lengkap (kode + 2 model GLB beranimasi). Tugas Anda: pasang alat, jalankan, deploy, uji, dokumentasi.

## A. Pasang alat (sekali saja, di laptop)
1. **Visual Studio Code** → https://code.visualstudio.com → install.
2. **Git** → https://git-scm.com/downloads → install (Next terus).
3. **Akun GitHub** → https://github.com → Sign up.
4. **Browser Chrome** di laptop. HP: Chrome (Android) / Safari (iPhone).
5. Di VS Code: ikon Extensions (kotak 4) → cari **Live Server** (Ritwick Dey) → Install.
Python/Node.js TIDAK perlu (GLB sudah jadi).

## B. Buka proyek
1. Ekstrak `filter-wisuda.zip` ke mis. `Documents/filter-wisuda`.
2. VS Code → File → Open Folder → pilih folder itu.
3. Klik kanan `index.html` → **Open with Live Server**. Browser membuka `http://127.0.0.1:5500`.
4. Klik **Mulai Kamera** → Allow kamera. Webcam laptop bekerja karena `localhost` dianggap aman.
   Harus terlihat: topi toga di kepala, tombol ◀ ▶ ganti filter, tombol bulat putih = foto.
5. Jika ukuran/posisi aksesori kurang pas: buka `http://127.0.0.1:5500/?debug=1`, geser slider,
   salin baris `"position"` dan `"scale"` yang tampil ke `data/filters.json`, simpan, muat ulang.

## C. Upload ke GitHub + HTTPS (wajib agar jalan di HP)
1. github.com → **New repository** → nama `filter-wisuda-kampus` → Public → Create (jangan centang README).
2. Di VS Code: Terminal → New Terminal, lalu ketik satu per satu (ganti USERNAME):
```
git config --global user.name "Nama Anda"
git config --global user.email "email-github-anda@mail.com"
git init
git add .
git commit -m "feat: prototipe awal filter wajah"
git branch -M main
git remote add origin https://github.com/USERNAME/filter-wisuda-kampus.git
git push -u origin main
```
   (Login GitHub muncul di browser, setujui.)
3. Repo di GitHub → **Settings → Pages** → Source: *Deploy from a branch* → Branch `main`, folder `/ (root)` → Save.
4. Tunggu 1–2 menit. Alamat: `https://USERNAME.github.io/filter-wisuda-kampus/` — inilah tautan HTTPS untuk UTS.
5. Tambahkan anggota: Settings → Collaborators → Add people (semua 5–6 anggota).

## D. Kerja kelompok (semua anggota WAJIB punya commit)
Tiap anggota: `git clone https://github.com/USERNAME/filter-wisuda-kampus.git`, buat branch
(`git checkout -b nama-tugas`), kerjakan, `git add .`, `git commit -m "pesan jelas"`, `git push`, lalu Pull Request.
| Peran | Commit yang bisa dikerjakan |
|---|---|
| 1 PM | README, deploy Pages, kode QR, merge PR |
| 2 Tracking | tuning `anchor`/posisi di `data/filters.json`, uji cahaya |
| 3 Aset | buat 1–2 aksesori baru (Blender/Sketchfab CC0), isi `docs/asset-licenses.md` |
| 4 UI/UX | rapikan `css/style.css`, thumbnail filter |
| 5 Data | tambah filter di `filters.json`, validasi data |
| 6 QA | `docs/device-matrix.md`, issue log (GitHub → Issues), video demo |

## E. Uji di HP
1. Buka tautan Pages di HP (Chrome Android / Safari iPhone) → Mulai Kamera → izinkan.
2. Uji: toga menempel saat kepala menoleh, tombol ganti filter, foto → Simpan, izin ditolak (pesan merah muncul), muat ulang (filter terakhir diingat).
3. Isi hasilnya apa adanya di `docs/device-matrix.md` (termasuk jika gagal di iPhone).
4. Setiap kali ubah kode: `git add .` → `git commit -m "..."` → `git push`; tunggu ±1 menit lalu muat ulang paksa (HP: tutup tab lalu buka lagi).

## F. Tambah aksesori/filter sendiri (nilai tambah)
1. Cari model GLB berlisensi CC0/CC-BY (Poly Pizza, Sketchfab filter "Downloadable" + lisensi). Simpan ke `assets/` (<1 MB lebih baik).
2. Tambah blok di `data/filters.json` (salin blok yang ada). Anchor: **10** = dahi atas (topi), **168** = antara mata (kacamata), **1** = ujung hidung, **152** = dagu.
3. Catat sumber & lisensi di `docs/asset-licenses.md`.
4. Jangan pakai karakter berhak cipta.

## G. Luaran UTS (centang)
- [ ] Repo GitHub, semua anggota punya commit
- [ ] Tautan HTTPS Pages + kode QR (buat di https://www.qr-code-generator.com atau qrcode-monkey.com, simpan gambarnya ke repo)
- [ ] Video demo 1–2 menit (rekam layar HP)
- [ ] README.md rapi (sudah ada kerangka)
- [ ] docs/device-matrix.md ≥ 2 perangkat (Android + iPhone/alasan)
- [ ] docs/asset-licenses.md
- [ ] Peer assessment diisi pribadi
- [ ] Buka tautan di HP lain yang belum pernah dipakai

## H. Jika error
| Gejala | Solusi |
|---|---|
| Layar hitam / tombol Mulai tidak bereaksi | Buka lewat Live Server/HTTPS, bukan klik dua kali file. Tekan F12 → tab Console, baca pesan merah. |
| "Gagal memuat model" | Nama file di `filters.json` harus sama persis dengan di `assets/` (huruf besar/kecil berpengaruh di GitHub Pages). |
| Halaman Pages 404 | Tunggu 2 menit; cek Settings → Pages sudah Save. |
| Kamera tidak muncul di HP | Pastikan alamat `https://`, izinkan kamera di pengaturan browser. |
| iPhone gagal | iOS 16.4+ diperlukan (import map). Catat apa adanya di device-matrix. |
| Aksesori terlalu besar/kecil/miring | Pakai `?debug=1` (bagian B.5). |
| Perubahan tak tampil di HP | Cache: tutup tab, buka lagi, atau tambahkan `?v=2` di akhir alamat. |
