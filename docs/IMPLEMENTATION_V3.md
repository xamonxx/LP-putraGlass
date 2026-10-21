# Putra Glass V3 — hasil implementasi

Showroom arsitektural dengan cerita “Dari cahaya, menjadi bagian dari ruang Anda” sudah diterapkan di checkout ini. Ekspor produksi tersedia di `out/`; preview berjalan pada http://127.0.0.1:3333 . Perubahan Git yang sudah ada dipertahankan dan tidak dibuat commit atau publikasi produksi.

## Pengalaman halaman

Hero → cerita cahaya → koleksi → showroom/configurator → detail dan antifog → workshop → cara pesan → konsultasi → FAQ → footer. Ivory/stone/charcoal, aksen champagne, fotografi lokal, tipografi editorial Plus Jakarta Sans lokal, dan CSS Modules.

Dua section story memakai CSS sticky dan Motion Values dari `motion/react`. Batas pin >=1024px lebar, >=700px tinggi, tanpa reduced motion; tambahan scroll 240svh / 180svh di luar panggung. Header diukur dengan ResizeObserver. Empat bab, progress, skip link, transisi pendek, navigasi keyboard, scroll balik dan direct anchor tersedia. Versi HP, pendek, reduced motion dan tanpa JS menampilkan konten berurutan. Story tidak mengubah konfigurasi atau kamera viewer.

## Katalog, data, dan viewer

Manifest terpusat berisi Capsul, Rectangle, Leaf, Half Moon, provenance, kelengkapan data, status verifikasi dan descriptor visualisasi. Importer JSON dry-run memvalidasi skema/aset/duplikasi; mode write menghasilkan gambar responsif AVIF/WebP lokal. Tidak menebak harga, stok, ukuran, rating atau URL marketplace.

Halaman `/katalog` dan `/produk/capsul`, `/produk/rectangle`, `/produk/leaf`, `/produk/half-moon` diekspor statis, termasuk metadata, canonical, breadcrumb dan Product tanpa offers palsu. Anchor lama seperti `#model`, `#rancang`, `#detail`, `#antifog`, `#workshop`, `#cara-pesan`, `#konsultasi`, `#faq`, `#proyek` tetap tersedia.

Viewer Three.js/Fiber 9/Drei dimuat hanya setelah dipilih. Foto, studio 3D dan ruang simulasi; satu Canvas; geometri Capsul/Rectangle/Oval/Round; lingkungan pantul lokal; drag, touch/pinch dan kontrol kamera keyboard. Dimensi/lampu/fitur tersinkron dengan state konfigurator, kamera tetap terpisah. Demand rendering, DPR konservatif, pause offscreen, cleanup dan fallback foto menangani perangkat/engine yang gagal. Leaf/Half Moon memakai foto. Semua model perkiraan diberi label simulasi.

Konfigurator menjaga pilihan lama, preset, validasi dan identitas produk pada navigasi klien. Form terpisah mempertahankan draft, UTM, endpoint lead opsional dan fallback WhatsApp. Angka contoh tidak lagi tampil sebagai harga publik. Tidak ditambahkan fitur produk di luar opsi yang sudah tersedia.

## Konten dan pengukuran bisnis

Testimoni placeholder tidak dirender; klaim garansi yang belum terkonfirmasi diganti arahan konsultasi. Tracker hanya dimuat setelah persetujuan dan pengiriman event memeriksa consent. Event eksplorasi katalog/viewer/bab terpisah dari generate_lead; tiap bab dideduplikasi per sesi dan interaksi kamera diagregasi. Klik WhatsApp tidak dianggap penjualan. Metadata API, LocalBusiness, FAQ, sitemap, halaman privasi dan pengaturan consent tetap tersedia.

## Koreksi dari screenshot pengguna

FAQ tetap ivory pada OS dark mode dengan teks terbaca. Drawer HP menyembunyikan bar WhatsApp, punya safe area dan scroll internal, serta menutup saat pindah ke desktop. Offset anchor ganda dihapus agar fokus tombol menu tidak menggeser halaman. Build/lint/TypeScript dan 57 tes lolos pada ekspor akhir; rincian, batas pengujian dan metrik tersedia di QA_REPORT.md.

## Artefak

- [Audit awal](REDESIGN_AUDIT.md)
- [Design system dan storyboard/rentang scroll](DESIGN_SYSTEM.md)
- [Manifest aset dan importer](PRODUCT_ASSET_MANIFEST.md)
- [Arsitektur 3D](3D_ARCHITECTURE.md)
- [Tracking dan consent](CRO_TRACKING.md)
- [QA dan performa](QA_REPORT.md)
- [URL halaman dan Search Console](SEO_URLS.md)
- [Inventaris perubahan](CHANGED_FILES.md)
- [Run/deployment statis](../README.md)

## Batas versi ini

Model parametris merupakan perkiraan visual, bukan CAD terverifikasi. Leaf/Half Moon belum punya geometri. Tidak ada GLB terverifikasi, AR, checkout atau pembayaran. Data Tokopedia, harga, stok, ukuran baku, garansi numerik dan identitas pelanggan belum diverifikasi. Pengukuran field, perangkat fisik dan penerimaan tracker di akun vendor masih memerlukan lingkungan/akses pemilik. Tidak ada klaim bahwa pemeriksaan tersebut telah dilakukan.

## Pembaruan URL publik

Navigasi sekarang memakai halaman statis terpisah tanpa #, termasuk /showroom, /tentang, /cara-pesan, /konsultasi dan /faq. ID internal dan anchor kampanye historis tetap kompatibel; ClientInit mengganti tautan lama ke URL halaman. Metadata dan sitemap mengikuti route masing-masing. Lihat SEO_URLS.md.

## Hero adaptif dari gambar pengguna

Hero homepage kini full-bleed dengan art direction portrait/landscape, teks HTML, caption ilustrasi digital, dan navbar transparan yang menjadi ivory saat scroll. Lihat [HERO_REDESIGN.md](HERO_REDESIGN.md) untuk provenance aset, optimasi dan pengujian.
