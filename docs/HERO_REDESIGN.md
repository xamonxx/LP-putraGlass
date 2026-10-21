# Hero homepage — background adaptif

20 Oktober 2026. Hero awal homepage memakai dua gambar yang disuplai pengguna, menggantikan layout dua kolom dan foto Rectangle terpisah. Halaman katalog/showroom/FAQ tetap memakai URL halaman dan navbar solid yang sudah tersedia.

## Sumber visual

- Landscape: `Gambar ChatGPT 20 Okt 2026, 11.40.44-1.png`, 1672×941.
- Portrait: `Gambar ChatGPT 20 Okt 2026, 11.40.45-2.png`, 941×1672.
- Kedua gambar merupakan ilustrasi digital yang disuplai pengguna, bukan dokumentasi instalasi atau bukti spesifikasi produk. Caption hero menyatakan “Visualisasi suasana · ilustrasi digital”.

Aset lokal hasil optimasi ada di `public/img/hero/`. Landscape mempunyai lebar 768/1024/1440/1672; portrait 320/480/768/941. Setiap ukuran tersedia dalam AVIF dan WebP tanpa upscale. Rentang AVIF sekitar 17–98 kB; sumber PNG tidak dimuat dari direktori Downloads saat website dijalankan.

Regenerasi: `node scripts/prepare-hero-images.cjs landscape.png portrait.png`. Tool memerlukan sharp yang sudah ada sebagai dependency proyek. Aset asli tidak diubah.

## Komposisi

Picture memilih portrait pada lebar <=1023px dengan orientasi portrait. Desktop, tablet landscape dan HP landscape memakai gambar lebar. Object-fit cover menjaga proporsi; titik fokus portrait ke kanan mempertahankan koleksi cermin. Judul/tombol tetap berupa HTML, bukan teks yang digabung ke bitmap.

Desktop: teks di sisi dinding kiri, cermin di kanan. HP: judul di area kosong atas, CTA di area lantai bawah agar bidang cermin tidak tertutup. Tablet portrait: teks digeser dari area tanaman; paragraf pendukung disederhanakan secara visual. Viewport pendek mempunyai tinggi konten minimum agar CTA dan visual tidak bertumpuk. Overlay lokal membantu keterbacaan pada layar pendek tanpa mengubah gambar sumber.

Navbar homepage fixed di atas gambar, transparan pada posisi awal dan ivory dengan blur/border halus setelah scroll >20px. Kembali ke atas mengembalikan transparansi. Tinggi header tetap diukur untuk offset sticky storytelling; tidak ada perubahan tinggi ketika warnanya berganti. Drawer HP tetap berlapis di atas konten dan menyembunyikan sticky WhatsApp. Tanpa JavaScript navbar memakai latar ivory yang terbaca, dan gambar/link utama tetap tersedia. Reduced motion menonaktifkan transisi.

CSS hero berada di `src/components/HeroSection.module.css`; overlay navbar di `Showroom.module.css`; mode overlay hanya diberikan oleh homepage. Pengaturan ini tidak memakai ID sebagai URL navigasi dan tidak mengubah konfigurasi viewer.

## Verifikasi

Tes hero memilih aset pada 320×600, 390×844, 390×668, 768×1024, 1024×768, 1440×900, 1920×1080 dan 844×390. Pemeriksaan meliputi gambar terdecode, sumber portrait/landscape, judul di bawah navbar, tombol tidak keluar area hero, transisi warna scroll/scroll balik, posisi layout tetap, navbar solid halaman lain dan fallback tanpa JavaScript. Suite bisnis/3D/consent/routing sebelumnya dijalankan kembali.

Screenshot: `screenshots/hero-background-1440.png`, `screenshots/hero-background-390.png`, `screenshots/hero-background-768.png`. Preview dan ukuran emulasi diperiksa; ini tidak menggantikan pengujian perangkat fisik.

## Transisi cahaya (v2)

Hero kini memakai aset terbaru di `public/img/hero/lighting/`: desktop 768/1280/1920/2560/3840 (WebP dari JPEG yang tertanam di SVG desktop) dan mobile 320/480/768/1080/1440/2160 (dari WebP mobile pengguna). SVG sumber ±5 MB tidak dimuat; `sizes` memperhitungkan crop cover sehingga gambar 4K hanya dipilih bila layar membutuhkannya. Regenerasi: `node scripts/prepare-hero-lighting.cjs desktop.svg mobile.webp`. File sumber tidak diubah. Aset `landscape-*`/`portrait-*` lama tidak lagi dirujuk.

`src/components/HeroLighting.tsx` menambahkan lapisan SVG inline ringan (~1 kB gzip) di atas foto: jalur garis LED keempat cermin dilacak dari render inspeksi 0,4× (`screenshots/lighting-source-*.png`). viewBox sama dengan rasio gambar dan `preserveAspectRatio` mengikuti `object-position` (desktop `xMidYMid slice`, portrait `xMaxYMid slice`), jadi posisi lampu tetap tepat saat resize/rotasi. Per artwork: satu lapisan `saturation` abu-abu menetralkan kuning bawaan di sekitar LED, tiga lapisan `color` (Hangat `#FFC58A`, Natural `#FFF0D0`, Putih `#EAF4FF`) memberi warna baru, dan tiga lapisan `screen` tipis menegaskan garis LED. Semua dibatasi stroke blur di sekitar cermin; dinding, lantai dan isi cermin tidak berubah hue. Animasi hanya mengubah `opacity` lapisan Natural/Putih (tanpa repaint).

Perilaku: siklus 24 dtk (tahan 5 dtk, transisi 3 dtk `easeInOut`) dimulai setelah gambar dimuat; jeda saat hero keluar viewport atau tab tersembunyi. Memilih warna menghentikan siklus dan transisi 1,2 dtk; siklus lanjut dari warna terpilih hanya setelah tombol Lanjutkan. Reduced motion: Hangat statis, tanpa tombol animasi, pilihan manual langsung. State terpisah dari konfigurator/kamera. Tanpa JavaScript foto tetap tampil dengan lapisan Hangat. Ini simulasi visual, bukan representasi Kelvin atau spesifikasi produk.

Tes: `hero lighting cycles, pauses, takes manual picks and respects visibility` dan `hero lighting is static warm under reduced motion…` di `tests/resilience.spec.ts`.
