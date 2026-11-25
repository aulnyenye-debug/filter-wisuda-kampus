# Filter Wajah "Wisuda dan Kampus" (AR Smartphone v0.5)

Aplikasi AR berbasis web: aksesori 3D bertema kampus menempel di wajah lewat kamera HP.
Pemrosesan 100% di perangkat; tidak ada video/foto yang diunggah.

**Demo:** https://USERNAME.github.io/filter-wisuda-kampus/  (ganti)

## Fitur
- 2 aksesori GLB: Topi Toga (tassel berayun) dan Kacamata Berkilau (bintang berputar)
- Tombol ganti filter, tombol ambil foto (simpan/bagikan ke perangkat)
- Pesan jelas bila izin kamera ditolak
- Filter terakhir tersimpan (localStorage); data filter di `data/filters.json`

## Menjalankan
Buka folder di VS Code → Live Server (laptop), atau buka tautan GitHub Pages (HP). Wajib HTTPS/localhost.
Mode penyesuaian aksesori: tambahkan `?debug=1` di alamat.

## Teknologi
Three.js 0.160.0, MindAR 1.2.5 (face tracking), GLTFLoader, GitHub Pages.

## Struktur
`index.html` · `js/main.js` · `css/style.css` · `data/filters.json` · `assets/*.glb` · `docs/` · `tools/gen_assets.py`

## Batasan yang diketahui
(isi dari hasil uji; mis. tracking melemah di cahaya redup, iOS < 16.4 tidak didukung)

## Tim
| Nama | Peran |
|---|---|
