# QA — Putra Glass V3

Tanggal: 20 Oktober 2026. Target: ekspor produksi lokal pada http://127.0.0.1:3333, bukan server development.

## Hasil akhir

| Pemeriksaan | Hasil |
|---|---|
| Validasi manifest sebelum build | Lolos, 4 produk dan referensi aset lokal |
| `npm run build` / ekspor `out/` | Lolos, seluruh route statis |
| `npm run lint` | Lolos, tanpa warning/error ESLint |
| `npx tsc --noEmit --incremental false` | Lolos |
| `npm test` | **57/57 lolos**, satu worker, tanpa retry atau force-click |
| Audit dependency produksi | 0 vulnerability pada `npm audit --omit=dev` |

Build: homepage 10.2 kB route / 215 kB first-load JS, dibanding baseline 127 kB / 230 kB. Shared JS 103 kB. CSS homepage yang di-inline 11.4 kB; stylesheet lain tetap terpisah. Engine 3D tidak dimuat pada kunjungan awal.

## Cakupan otomatis

36 kasus alur utama: 12 kasus pada desktop 1440×900, emulasi Pixel 7, dan HP 320×600. Mencakup metadata/structured data tanpa harga/rating, navigasi dan fokus drawer, identitas produk Leaf dari katalog, konfigurasi/UTM/pesan WhatsApp, validasi ukuran dan diameter Round, detail/antifog/FAQ keyboard, form lengkap/draft, consent/revocation, dua cerita forward/backward, rendering 3D/kamera/context-loss, axe, filter dan URL produk langsung.

17 kasus resilience: lebar 320/360/390/430/768/1024/1440/1920 tanpa overflow kontrol utama; resize, viewport pendek, reduced motion, anchor cerita; seluruh bab pada JavaScript nonaktif; WebGL tidak tersedia; kegagalan chunk; wheel tetap menggulir, mouse rotation, room mode dan lampu; empat geometri/ukuran; drag dan pinch touch melalui CDP; halaman katalog/produk/privasi dengan axe; FAQ pada preferensi warna light dan dark; drawer pada 320×600 serta 390×844.

Tambahan migrasi URL mencakup href navigasi tanpa fragment, route HTML/canonical/Open Graph/breadcrumb/sitemap, akses tanpa JavaScript, file TXT navigasi, link kampanye dan UTM, navigasi back/reload, seluruh halaman baru pada 320px dan state produk/ukuran lintas halaman.

4 kasus domain: normalisasi/validasi lead, kode UTM, endpoint kosong/error/timeout dengan handoff WhatsApp tetap tersedia, dan penolakan katalog duplikat/verifikasi rekaan/model tak didukung.

Axe memeriksa tag WCAG A/AA yang tersedia. Halaman utama tidak memiliki temuan serious/critical dalam keadaan yang diuji; FAQ terbuka/hover dan dialog tidak memiliki violation dalam scan regresinya. Ini bukan sertifikasi WCAG atau pengganti audit manual menyeluruh.

## Bug screenshot pengguna

- FAQ: aturan `prefers-color-scheme: dark` lama memberi latar gelap tanpa mengubah judul/deskripsi. Aturan parsial dihapus; ivory dan pasangan warna teks konsisten untuk kedua preferensi OS. Hover dan focus juga diperbaiki.
- Drawer HP: sticky WhatsApp disembunyikan saat menu terbuka, terpisah dari z-index. Drawer memakai tinggi viewport dinamis, safe area dan scroll internal; teks CTA membungkus dengan aman pada 320px.
- Fokus: root `scroll-padding` menggandakan offset section dan menyebabkan halaman meloncat ketika tombol di header sticky mendapat fokus. Offset dipusatkan pada `scroll-margin` section. Tes memeriksa posisi scroll sebelum/sesudah buka dan Escape.
- Dialog menutup pada perpindahan ke desktop, mengembalikan fokus, dan menutup saat tautan navigasi dipilih.

Preview in-app sudah dimuat ulang dan diperiksa secara visual. Klik pointer langsung pada menu mempertahankan posisi halaman. Screenshot tersimpan di `screenshots/faq-fixed-1440.png`, `screenshots/faq-fixed-390.png`, dan `screenshots/mobile-menu-fixed.png`.

## Investigasi baseline dan kegagalan selama implementasi

Audit sebelumnya mencatat 23/27 tes browser. Pada ekspor baseline yang dibangun ulang, suite lama lolos 27/27; empat kegagalan historis tidak terulang. Tidak tersedia bukti cukup untuk menetapkan satu akar masalah bagi keempat kegagalan historis tersebut. Suite lama juga mengandalkan force-click dan belum menunggu hidrasi secara eksplisit; suite pengganti menunggu hidrasi dan memakai interaksi normal.

Regresi yang ditemukan dan diperbaiki selama V3: overflow kontrol detail/viewer di HP; tombol submit form bergeser saat pesan validasi hilang di antara pointer-down/up; kehilangan konteks Canvas saat unmount disalahartikan sebagai error; pantulan 3D gelap pada sudut samping; serta masalah FAQ dan drawer di atas. Tes pembukaan FAQ menunggu animasi selesai sebelum mengukur kontras; tidak melewati pemeriksaan wajib.

## Performa laboratorium

Metode sama: Chromium lokal, cache kosong, 390×844, DPR 1, CPU ×4, latensi 150 ms, download 200000 byte/detik (1.6 Mbps), 3 run. Pengukuran akhir dijalankan setelah suite berhenti, tanpa build atau runner tes paralel. Detail mentah ada pada `performance-before.json` / `performance-after.json`.

| Median | Baseline | V3 |
|---|---:|---:|
| LCP | 3980 ms | 2084 ms |
| CLS | 0 | 0 |
| Transfer resource awal | 365278 byte | 397552 byte |

LCP membaik pada lingkungan lokal ini; transfer resource naik karena halaman/komponen baru. Angka transfer memakai Resource Timing, tidak menyertakan ukuran dokumen HTML. Tidak menyimpulkan performa produksi dari tiga run lokal. INP, field p75/CrUX, FPS berkelanjutan, suhu perangkat dan perangkat fisik belum diukur. Interaksi touch yang diuji merupakan emulasi, bukan pengujian perangkat nyata.

## Batas pengujian eksternal

Request vendor eksternal diblokir/intersep saat tes; tidak ada pesan pelanggan atau penjualan nyata dikirim. Persetujuan, payload event dan pemanggilan SDK diuji, tetapi penerimaan dashboard vendor dan konfigurasi akun tidak diverifikasi. Endpoint opsional diuji dengan respons simulasi, bukan menulis data ke layanan produksi. Tokopedia tetap tidak dapat diverifikasi.

Full development dependency audit masih melaporkan 5 high advisory pada rantai braces/micromatch/fast-glob milik ESLint; perbaikan otomatis yang ditawarkan memerlukan perubahan tooling mayor. Tidak melakukan force-upgrade. Dependency produksi bersih pada audit saat ini.

## Reproduksi dan deployment

Jalankan `npm ci`, `npm run build`, lalu `npm start` dan `npm test`. Pengukuran: `npm run measure -- after`. Jangan menjalankan build dan tes browser bersamaan terhadap direktori `out/` yang sama. Deploy isi lengkap `out/` sesuai README; tidak ada publikasi produksi pada pekerjaan ini.

## Verifikasi URL halaman

Setelah pemisahan route, suite penuh lolos 57/57 dalam 1.8 menit. Build mengekspor 18 entri statis/metadata. File TXT ekspor Next perlu MIME text/plain; server preview sebelumnya memberi application/octet-stream sehingga router melakukan reload penuh dan mereset state produk. MIME dan revalidasi TXT/XML diperbaiki; tes memastikan identitas Leaf dan ukuran/kota tetap terbawa dari katalog ke showroom. Lihat SEO_URLS.md untuk mapping route dan langkah Search Console setelah deployment.

Pemeriksaan canonical setelah migrasi menemukan dua tag canonical pada navigasi SPA yang dipicu terlalu awal oleh anchor kampanye. Pengalihan kampanye sekarang memuat dokumen tujuan secara penuh. Tes normal SPA dan enam anchor kampanye menegaskan hanya satu canonical dengan URL halaman tujuan. ID yang tidak dikenal tidak dipakai sebagai route.
