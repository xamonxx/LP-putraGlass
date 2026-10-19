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
│   ├── app/               # Layout, metadata SEO, JSON-LD, robots, sitemap
│   ├── components/        # Komponen UI 11 bagian landing page
│   ├── config/            # Konstanta statis & gambaran harga contoh
│   ├── data/              # FAQ, testimoni, metadata gambar, data animasi
│   └── lib/               # UTM tracking, event funnel, A/B test, lead form
├── scripts/
│   └── post-build.js      # Post-build inliner untuk critical CSS
├── workers/
│   └── lead/              # Cloudflare Worker penerima lead form (deploy terpisah)
└── serve.js               # Preview server statis dengan kompresi gzip
```

---

## ⚙️ Variabel Lingkungan

Salin `.env.example` ke `.env.local`. Semua opsional — kosong berarti fitur mati.

| Variabel | Fungsi |
| --- | --- |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | TikTok Pixel |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity (heatmap + session replay) |
| `NEXT_PUBLIC_LEAD_ENDPOINT` | URL Worker penerima lead. Kosong = form tetap jalan, lead langsung diteruskan ke WhatsApp tanpa disimpan. |

Semua skrip pelacak dimatikan otomatis bila `localStorage.pg_cookie_consent === 'denied'`.

---

## 📈 Funnel & Instrumentasi

Satu pintu event: `trackEvent(name, params, standard)` di `src/lib/tracking.ts` mengirim ke Meta, TikTok, GA4, dan Clarity sekaligus, selalu menyertakan `lead_code` (hasil pemetaan UTM) dan varian eksperimen aktif.

| Tahap | Bagian | Event |
| --- | --- | --- |
| TOFU | Hero, Model | `section_view`, `scroll_depth` (25/50/75/100), `model_click` |
| MOFU | Rancang, Detail, Antifog, Testimoni | `configurator_start`, `configurator_send`, `testimonial_view`, `testimonial_swipe`, `dwell_time` (30s/90s) |
| BOFU | Cara pesan, Form, FAQ, Workshop | `lead_form_start`, `lead_form_step`, `lead_form_abandon`, `faq_open`, `workshop_photo_open` |
| Aksi | WhatsApp, Form | `generate_lead` (Meta `Lead` / TikTok `Contact`), `lead_submit` (Meta `Lead` / TikTok `SubmitForm`) |
| Exit | Dialog exit-intent | `exit_intent_show`, `exit_intent_accept`, `exit_intent_dismiss` |

### A/B Test
`src/lib/experiments.ts` membagi pengunjung secara deterministik (FNV-1a atas ID pengunjung di `localStorage`), tanpa SDK dan tanpa request jaringan. Eksperimen aktif: `hero_headline`, `cta_style`, `form_position`. Varian ikut terkirim di setiap event sebagai `exp_<id>`.

---

## 📥 Endpoint Lead (opsional)

Form 3 langkah di bagian `#konsultasi` selalu berakhir di WhatsApp. Bila ingin lead juga tersimpan dan ada notifikasi Telegram, deploy Worker di `workers/lead/` lalu isi `NEXT_PUBLIC_LEAD_ENDPOINT`. Langkah lengkap ada di `workers/lead/README.md`.

---

## 📦 Catatan Dependensi

Runtime: `react`, `react-dom`, `next`, `embla-carousel-react` (carousel model & testimoni), `@radix-ui/react-accordion` (FAQ), `@radix-ui/react-dialog` (lightbox & exit-intent), `react-hook-form` (form lead).

Yang sengaja **tidak** dipakai:
- **Tailwind / UI kit** — styling tetap CSS variable + CSS Modules agar identitas warna `--glow-*` tidak tergusur.
- **Library animasi** (`motion`, GSAP) — semua gerak memakai CSS `@keyframes` dan `animation-timeline: view()/scroll()`; menghapus `motion` memangkas ±50 kB dari First Load JS.
- **Validator runtime** (`zod`) — validasi form ditulis tangan di `src/lib/lead.ts`, memangkas ±25 kB.

First Load JS halaman `/`: **180 kB** (103 kB di antaranya shared chunk Next/React).
