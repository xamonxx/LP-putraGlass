# Putra Glass – Landing Page (GLASSLP)

Landing page resmi Putra Glass (`putraglass.id`) yang dibangun dengan **Next.js 15**, **TypeScript**, dan ekspor HTML statis (`output: "export"`).

---

## 🛠️ Pengembangan (Local Development)

```bash
# 1. Pasang dependensi
npm install

# 2. Jalankan server pengembangan
npm run dev

# 3. Jalankan pengecekan linter
npm run lint
```

Server lokal berjalan di `http://localhost:3000`.

---

## 🚀 Build & Deploy Statis

Landing page ini menghasilkan artefak statis murni di folder `out/` (tanpa runtime Node.js di server produksi).

```bash
# 1. Kompilasi & ekspor HTML/CSS/JS statis
npm run build

# 2. Preview hasil build statis secara lokal
npm start
# (menjalankan serve.js dengan kompresi gzip di http://localhost:3333)
```

### Deploy Produksi (Caddy / Nginx)
Salin seluruh isi folder `out/` ke direktori web server (misalnya `/var/www/putraglass.id/html`).
Caddyfile contoh:
```caddyfile
putraglass.id {
    root * /var/www/putraglass.id/html
    file_server
    encode gzip zstd
}
```

---

## 📁 Struktur Berkas

```text
├── docs/
│   ├── PRD.md             # Dokumen kebutuhan produk landing page
│   └── acuan/             # Screenshot acuan desain desktop & mobile
├── public/                # Font woff2 self-hosted, aset gambar WebP/AVIF
├── src/
│   ├── app/               # Layout, metadata SEO, robots, sitemap
│   ├── components/        # Komponen UI 8 bagian landing page
│   ├── config/            # Konstanta statis & gambaran harga contoh
│   └── lib/               # UTM tracking, pixel event, dan konstanta kontak
├── scripts/
│   └── post-build.js      # Post-build inliner untuk critical CSS
└── serve.js               # Preview server statis dengan kompresi gzip
```
