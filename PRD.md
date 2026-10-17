# PRD Landing Page Putra Glass

Oct 18, 2026 · @MKI

Landing page di domain utama Putra Glass mengubah pengunjung iklan, Instagram dan TikTok menjadi chat WhatsApp yang sudah berisi bentuk, ukuran, pilihan lampu dan kota, supaya admin bisa langsung mengirim penawaran. Aplikasi CS tetap terpisah di subdomain app.

## Tujuan dan ukuran sukses

Satu tugas utama: pengunjung menekan tombol WhatsApp dengan pesan yang sudah lengkap. Semua bagian halaman harus mendorong ke sana. Reach, like dan lama kunjungan bukan ukuran sukses.

| Ukuran | Target awal | Cara mengukur |
| --- | --- | --- |
| Klik WhatsApp per pengunjung dari iklan | ≥ 8% (dikoreksi setelah 2 minggu data) | Event `Lead` di Meta Pixel dan TikTok Pixel |
| Konfigurator diselesaikan lalu dikirim ke WhatsApp | ≥ 40% dari yang mulai | Event `configurator_start` dan `configurator_send` |
| Chat WhatsApp yang bisa dilacak sumbernya | 100% | Kode sumber di pesan otomatis, misalnya `LP-META`, dicatat admin di aplikasi CS |
| Closing rate chat dari landing page | Lebih tinggi dari chat biasa | Laporan per sumber di aplikasi CS, dibandingkan tiap periode closing (26–25) |
| Kecepatan tampil di HP | LCP ≤ 2,0 dtk di 4G | Lighthouse mobile dan data Search Console |

Tanpa kode sumber di pesan WhatsApp, iklan hanya bisa dinilai sampai klik. Karena itu kode sumber wajib ada sejak hari pertama.

## Pengunjung dan jalurnya

Sebagian besar pengunjung datang dari HP lewat iklan, jadi halaman dirancang untuk layar 360–430 px dulu, baru desktop.

| Pengunjung | Datang dari | Yang ingin diketahui | Yang membuatnya chat |
| --- | --- | --- | --- |
| Pemilik rumah yang sedang renovasi kamar mandi atau kamar | Iklan Meta dan TikTok, Instagram | Cocok tidak di ruangannya, harga kira-kira, berapa lama jadi | Melihat ukurannya di konfigurator dan estimasi harga |
| Pengelola proyek: hotel, kafe, salon, barbershop, kontraktor interior | Google, rekomendasi, Instagram | Bisa banyak unit, jadwal produksi, harga proyek | Jalur khusus proyek dengan pesan WhatsApp sendiri |
| Pembeli marketplace yang butuh ukuran di luar katalog | Toko Tokopedia/Shopee | Bisa custom atau tidak | Bagian "Custom atau model jadi" |

Jalur yang diinginkan:

1. Melihat iklan, lalu membuka halaman dengan pesan yang sama dengan iklannya.
2. Hero: cermin menyala, pengunjung mencoba ganti warna cahaya.
3. Memilih jalur: custom atau model jadi.
4. Mengisi konfigurator: bentuk, ukuran, lampu, kontrol, kota.
5. Menekan WhatsApp. Pesan terisi otomatis, lengkap dengan kode sumber.
6. Admin membalas dengan draft AI dan PDF penawaran dari aplikasi CS.

Link iklan memakai UTM (`utm_source`, `utm_campaign`). Halaman membaca UTM itu dan menerjemahkannya menjadi kode sumber singkat di pesan WhatsApp.

## Arah desain

Konsep: **cahaya yang bisa disentuh**. Halaman ini bersikap seperti produknya. Elemen yang diingat orang hanya satu: cermin di hero yang menyala saat halaman dibuka dan berganti warna cahaya saat disentuh, persis seperti touchscreen di cermin asli. Bagian lain tenang dan rapi supaya foto produk yang bicara. Desain visualnya ada di canvas [Landing Page Putra Glass](https://claude.ai/artifact/K4JVkHAkHD7kvcPs9BirYy) (desktop dan HP, tombol warna cahaya bisa dicoba).

### Palet warna

| Nama | Hex | Dipakai untuk |
| --- | --- | --- |
| Kamar gelap | `#141C33` | Latar hero dan demo antifog, seperti kamar mandi saat lampu dimatikan |
| Navy Putra Glass | `#253254` | Judul di bagian terang, footer |
| Biru Putra Glass | `#275087` | Link, tombol sekunder, garis fokus keyboard |
| Perak | `#BFCBD9` | Bingkai cermin, garis pemisah, ikon |
| Tepi kaca | `#9CCFC2` | Hanya untuk kilau bevel dan penanda pilihan aktif. Warna hijau ini diambil dari warna tepi kaca asli |
| Kertas dingin | `#F3F5F8` | Latar semua bagian terang |
| Cahaya hangat / natural / putih | `#FFC98A` / `#FFE9C7` / `#D6E6FF` | Hanya di dalam cahaya cermin dan pantulan ke ruangan. Tiga warna ini mengikuti pilihan pengunjung |

Tombol WhatsApp utama memakai hijau WhatsApp asli (`#25D366`) dengan teks gelap, karena orang sudah mengenalinya sebagai "chat".

### Tipografi

- **Plus Jakarta Sans ExtraBold (800) untuk judul, huruf kecil, jarak huruf dirapatkan −4%, line-height 0,95. Ini gaya judul di portofolio Putra Glass ("portfolio", "introduction"), jadi landing page langsung terasa satu brand**.
- **Plus Jakarta Sans** (400 dan 600) untuk teks, tombol dan form. Satu keluarga huruf untuk semuanya: lebih ringan dimuat, dan sama dengan aplikasi CS, PDF penawaran dan portofolio.
- Skala ukuran: 14, 16, 20, 25, 31, 39, 49 px di HP; judul hero 56–72 px di desktop. Teks paragraf maksimal 65 karakter per baris, line-height 1,6.
- Judul memakai huruf kecil seperti portofolio; teks lain memakai huruf kalimat. Tidak ada label huruf kapital semua.
- Judul tanpa efek tambahan. Satu-satunya efek ada di cermin hero, supaya tidak saling berebut perhatian (versi judul berpantulan sudah dicoba dan dibatalkan karena terbaca seperti teks rusak).

### Tata letak

Teks rata kiri di semua bagian. Bagian dipisahkan oleh pergantian latar (gelap dan terang), bukan oleh kartu. Bingkai foto di galeri mengikuti bentuk cermin di foto itu (rectangle, round, oval, capsul, leaf, hex, half moon, dan bentuk katalog lainnya), jadi bentuk bingkai memberi informasi. Logo tiga belah ketupat (abu, navy, perak) dipakai di navigasi dan footer; versi besarnya muncul samar di belakang cermin hero, seperti sampul portofolio.

```
HP (360–430 px)                 Desktop (≥ 1024 px)
+------------------------+      +-----------------------------------------+
|  [ cermin menyala ]    |      | Judul besar          |                  |
|   o hangat o natural    |      |                      |  [cermin capsul] |
|   o putih              |      | Subjudul             |   menyala        |
| Judul besar            |      | [WhatsApp] [Rancang] |  o o o warna     |
|                        |      | Dibuat di Citatah... |                  |
| [Chat WhatsApp]        |      +-----------------------------------------+
| [Rancang ukuranmu]     |      | Custom  |  Model jadi  (dua jalur)      |
+------------------------+      +-----------------------------------------+
```

Di HP, tombol WhatsApp menempel di bawah layar setelah hero lewat, tingginya 56 px.

### Yang sengaja dihindari

- Latar krem dengan aksen terakota, atau latar hitam dengan satu aksen neon.
- Deretan kartu membulat yang identik dengan bayangan abu-abu yang sama.
- Label kecil huruf kapital di atas setiap judul, panah "→" di tombol, dan satu kata berwarna beda di judul.
- Animasi muncul-dari-bawah di setiap bagian.
- Foto stok, angka klaim tanpa data ("1000+ pelanggan"), dan testimoni karangan.

Catatan review: rancangan pertama memakai latar gelap untuk seluruh halaman. Itu diubah: gelap hanya di hero dan demo antifog, sisanya terang, supaya warna foto produk tetap jujur dan halaman tidak jatuh ke pola "gelap + satu aksen". Penomoran 01/02/03 juga dibuang dari semua bagian kecuali alur pemesanan, karena hanya bagian itu yang memang berurutan.

## Struktur halaman dan copy

Urutan bagian mengikuti pertanyaan pengunjung: cocok tidak, berapa, bagaimana pesannya, bisa dipercaya tidak. Copy di bawah adalah versi pertama dan boleh diubah owner.

| Bagian | Isi | Copy utama |
| --- | --- | --- |
| Hero (gelap) | Cermin menyala, tombol 3 warna cahaya, judul, 2 tombol | "cermin LED yang ukurannya kamu tentukan." Sub: "Dibuat per pesanan di workshop kami di Citatah, Bandung Barat. Bentuk bebas, tiga warna cahaya dalam satu sentuhan." Tombol: "Tanya harga di WhatsApp" dan "Hitung estimasi harga". Baris bukti di bawah tombol: "Sejak Maret 2025, lebih dari 4.000 unit cermin dan kaca terkirim ke seluruh Indonesia." |
| Custom atau model jadi | Dua kolom berdampingan, masing-masing satu foto, 3 poin dan satu tombol. Model jadi memakai render katalog (dinding bertekstur dengan rak niche) yang diberi nama bentuknya | Custom: "Ukuran dan bentuk bebas, dihitung per m²." Model jadi: "Bentuk dan ukuran katalog, seri sandblast atau tanpa sandblast (NS), pilih touchscreen, sensor tangan, atau baterai." |
| Rancang cerminmu | Konfigurator (lihat bagian konfigurator) | "Isi ukuran yang kamu butuhkan. Kami tunjukkan seberapa besar cerminnya dan kira-kira harganya." |
| Detail yang tidak terlihat di foto | Satu foto cermin besar dengan 6 titik yang bisa disentuh | Kaca cermin 5 mm grade 1. Bevel 10 mm dipoles rapi. LED 3 warna. Touchscreen atau sensor tangan. Versi baterai 6000 mAh cas Type-C tanpa colokan. Bagian belakang: frame EVA foam dan gantungan kayu + besi, siap pasang. |
| Antifog (gelap) | Foto sebelum/sesudah dengan penggeser | "Geser untuk melihat bedanya setelah mandi air panas." |
| Hasil pemasangan | Foto pemasangan asli (hotel, kafe, rumah) dan foto workshop dari portofolio, filter per ruangan. Render katalog tidak dipakai di sini supaya jujur | Filter: Kamar mandi, Kamar tidur, Salon dan barbershop, Hotel dan kafe |
| Untuk proyek | Pita lebar dengan satu foto proyek dan tombol | "Butuh banyak unit untuk hotel, kafe, atau proyek interior? Kirim daftar ukurannya, kami siapkan jadwal produksi dan penawaran proyek." Di pita ini juga disebut kaca lain yang dikerjakan: kaca es (sandblast atau acid frosted), kaca polos 3–8 mm, kaca moru, finishing tepi clean cut, flat polished, pencil polished, beveled, dan coakan khusus Tombol: "Diskusikan proyek" |
| Cara pesan | 4 langkah berurutan (satu-satunya bagian bernomor) | 1. DP 50%. 2. Produksi 1–5 hari kerja, foto dan video dikirim saat dikerjakan. 3. Pelunasan dan kirim, foto packing dan resi dikirim. 4. Garansi aktif sejak barang sampai. |
| Pengiriman dan garansi | Dua blok teks pendek | "Dikirim ke seluruh Indonesia atau ambil sendiri di workshop. Luar kota dikemas paking kayu bertulang rapat; dalam kota bisa kurir instan. Ongkir dihitung sesuai kota tujuan." Garansi pengiriman 7 hari dan garansi fungsi lampu 3 bulan (menunggu konfirmasi) |
| Kata pembeli | Tangkapan ulasan asli dari marketplace atau WhatsApp, nama disamarkan dan dengan izin | Bagian ini disembunyikan sampai ada minimal 6 ulasan asli |
| Pertanyaan umum | 6 pertanyaan yang bisa dibuka-tutup | Berapa lama jadi? Ukuran paling besar berapa? Pakai colokan atau baterai? Termasuk pemasangan? Cara bayar? Garansinya apa saja? |
| Penutup dan footer | Ajakan terakhir, alamat dengan link Maps, kontak | "ukuran apa pun, bentuk apa pun. kirim, kami kerjakan." Sub: "Cermin LED, kaca es, kaca polos 3–8 mm, sampai kaca moru, dipotong sesuai ukuran di lapangan. Untuk rumah, kantor, toko, hotel, kafe, atau proyek interior." Footer: alamat workshop, WhatsApp +62 812-3753-3173, Instagram @putraglass.id, TikTok @putraglass\_ |

Bagian workshop (sesuai canvas): kartu foto besar pemasangan asli dengan judul di atasnya, baris spesifikasi (5 mm, 10 mm, 3 warna, 4.000+ unit) dan tombol lokasi; di bawahnya alur 4 foto proses (potong dan bevel, pasang LED, uji nyala, terpasang) yang dihubungkan garis cahaya LED. Di HP, alur proses bisa digeser ke samping.

Jawaban pertanyaan umum yang sudah pasti: produksi 1–5 hari kerja setelah DP; ada versi kabel dan versi baterai cas Type-C; jasa pemasangan tidak termasuk; pembayaran DP 50% lewat transfer, pelunasan sebelum dikirim. Ukuran maksimal dan detail garansi masuk ke keputusan terbuka.

## Animasi dan interaksi

Hanya ada satu gerak otomatis: cermin hero menyala saat halaman dibuka. Semua gerak lain terjadi karena pengunjung menyentuh sesuatu, dan menunjukkan apa yang berubah. Tidak ada animasi muncul saat scroll.

| Elemen | Pemicu | Gerak | Durasi | Jika reduced motion |
| --- | --- | --- | --- | --- |
| Cermin hero menyala | Halaman dibuka (sekali) | Garis LED merambat mengelilingi bentuk cermin, lalu cahaya mekar dan memantul ke dinding di belakangnya. | 900 ms merambat + 500 ms mekar, ease-in-out | Langsung menyala, tanpa rambatan |
| Ganti warna cahaya | Sentuh tombol warna, atau sentuh cerminnya | Warna cahaya dan pantulan di ruangan berganti halus. Getar 10 ms di Android | 350 ms, ease-out | Berganti seketika |
| Pratinjau konfigurator | Mengubah bentuk atau ukuran | Cermin berubah proporsi di samping siluet orang 170 cm dan wastafel 80 cm sebagai pembanding. Angka ukuran ikut berubah | 300 ms, spring ringan | Berubah seketika |
| Titik detail | Sentuh titik di foto | Panel kecil terbuka dari titik itu dengan foto close-up | 220 ms | Tanpa gerak membuka |
| Penggeser antifog | Geser jari atau tombol panah | Lapisan embun terbuka mengikuti jari | Real-time | Sama (gerak dikendalikan pengunjung) |
| Filter galeri | Sentuh filter | Foto berpindah posisi ke susunan baru | 250 ms | Susunan baru langsung tampil |
| Pertanyaan umum | Sentuh pertanyaan | Jawaban terbuka ke bawah | 200 ms | Langsung terbuka |
| Tombol WhatsApp menempel | Hero sudah lewat layar | Naik dari bawah sekali | 200 ms | Langsung tampil |

Aturan teknis: hanya menganimasikan `transform`, `opacity` dan `clip-path`. Pakai CSS dan Web Animations API, tanpa library animasi besar. Cahaya hero berhenti dihitung saat hero tidak terlihat di layar, supaya HP tidak panas dan baterai awet.

## Konfigurator Rancang Cerminmu

Konfigurator mengubah "mau tanya harga" menjadi pesan WhatsApp yang sudah bisa langsung dihitung admin. Harga di sini wajib sama dengan harga di aplikasi CS.

| Pilihan | Isi | Pengaruh ke estimasi |
| --- | --- | --- |
| Jalur | Custom atau model jadi | Custom dihitung per m². Model jadi: pilih bentuk, seri sandblast atau NS, satu dari 3 ukuran, lalu TC, ST atau BT; ST hanya muncul untuk bentuk yang memang tersedia |
| Bentuk | Daftar bentuk dari buku harga, sama dengan katalog: rectangle, wide rectangle, round, oval, wide oval, capsul, leaf, round leaf, hex, long hex, blunt square, half moon, half egg | Bentuk bulat dan oval dihitung dari kotak luarnya (menunggu konfirmasi) |
| Ukuran | Lebar × tinggi dalam cm, atau diameter untuk bulat | Luas m² = lebar × tinggi ÷ 10.000 |
| Lampu | LED 3 warna premium (Rp1.750.000/m²) atau LED 1 warna basic (Rp1.550.000/m²) | Harga per m² |
| Kontrol | Touchscreen, atau sensor tangan + baterai (+Rp250.000) | Tambahan per unit |
| Antifog | Ya atau tidak (+Rp200.000) | Tambahan per unit |
| Jumlah | 1–50 unit; di atas 5 unit muncul ajakan ke jalur proyek | Dikalikan jumlah |
| Kota | Ketik bebas, atau "ambil sendiri di workshop" | Tidak dihitung. Ongkir selalu dihitung admin |

Contoh: persegi panjang 60 × 80 cm, LED 3 warna, touchscreen, antifog = 0,48 m² × Rp1.750.000 + Rp200.000 = Rp1.040.000, ditampilkan sebagai "Estimasi produk Rp1.040.000, belum termasuk ongkir".

Aturan harga:

- Fungsi hitung harga dipisah menjadi satu modul yang dipakai bersama oleh aplikasi CS dan landing page. Tes otomatis memastikan 20 contoh kasus menghasilkan angka yang sama di keduanya.
- Harga publik di-generate menjadi file JSON saat build, dari buku harga aktif. Harga net, ongkir net, dan batas potongan tidak pernah masuk ke file itu.
- Kalau buku harga berubah, landing page di-build ulang. Isi katalog PDF lama (Rp1.330.000/m², garansi 2 minggu, gratis ongkir Bandung) sudah tidak berlaku dan tidak boleh dipakai.

Pesan WhatsApp yang terisi otomatis (link `wa.me/6281237533173?text=...`):

```
Halo Putra Glass, saya mau tanya cermin LED custom:
- Bentuk: Persegi panjang
- Ukuran: 60 x 80 cm
- Lampu: LED 3 warna
- Kontrol: Touchscreen
- Antifog: Ya
- Jumlah: 1 unit
- Kota: Surabaya
Estimasi di website: Rp1.040.000 (belum ongkir)
Kode: LP-META
```

Kode di baris terakhir berasal dari UTM: `LP-META`, `LP-TIKTOK`, `LP-IG`, `LP-GOOGLE`, atau `LP-LANGSUNG` jika tanpa UTM. Aplikasi CS membaca kode ini dari screenshot atau teks chat dan menyimpannya sebagai sumber lead. Landing page tidak menyimpan data pribadi apa pun.

## Spesifikasi teknis

Landing page berupa file statis (tanpa server Node), jadi paling cepat, paling murah dan paling sulit diretas.

| Area | Keputusan |
| --- | --- |
| Stack | Next.js 15 dengan `output: "export"` (HTML statis), TypeScript, CSS biasa atau Tailwind. Tanpa library animasi besar |
| Letak kode | Folder `landing/` di repo GLASSAPPS yang sama. Mengimpor modul harga murni dari aplikasi CS, tanpa memindah struktur aplikasi CS |
| Hosting | VPS Hostinger yang sama. Caddy menyajikan file statis di `putraglass.id`, mengalihkan `www` ke domain utama, dan HTTPS otomatis. Aplikasi CS tetap di `app.` |
| Anggaran performa | LCP ≤ 2,0 dtk di HP menengah 4G, CLS ≤ 0,05, INP ≤ 200 ms, JS awal ≤ 70 KB gzip, berat tampilan pertama ≤ 600 KB |
| Hero | Cermin dibuat dari SVG dan CSS, bukan foto, supaya tampil instan dan tajam di semua layar |
| Gambar | AVIF/WebP dengan beberapa ukuran (`srcset`), lazy-load di bawah layar pertama, lebar maksimal 1600 px |
| Font | Plus Jakarta Sans di-host sendiri (woff2, subset latin), hanya bobot 400, 600 dan 800, preload bobot 800 |
| SEO | Judul "Cermin LED Custom Bandung – Putra Glass", meta description, gambar Open Graph, schema `LocalBusiness` (alamat, koordinat, telepon, Instagram, TikTok), sitemap, robots.txt, bahasa `id` |
| Pelacakan | Meta Pixel, TikTok Pixel dan GA4: `PageView`, `ViewContent` saat konfigurator dibuka, `Lead` saat tombol WhatsApp ditekan. Conversions API menyusul di tahap 2 |
| Privasi | Pemberitahuan cookie sederhana sesuai UU PDP. Tidak ada form yang menyimpan data pribadi |
| Aksesibilitas | Kontras minimal AA, semua kontrol bisa dipakai dengan keyboard, garis fokus biru `#275087`, teks alt di semua foto, estimasi harga diumumkan ke pembaca layar (`aria-live`), reduced motion dihormati |
| Dukungan browser | Chrome Android 3 tahun terakhir, Safari iOS 15 ke atas, Chrome/Edge/Firefox desktop |
| Keamanan | Header keamanan dan CSP ketat di Caddy. Tidak ada kunci API atau rahasia di kode landing |

## Aset yang perlu disiapkan Putra Glass

Halaman ini bergantung pada foto asli. Foto HP sudah cukup asal terang, tajam dan diambil saat lampu cermin menyala.

- [ ] 1 video pendek (5–10 detik, vertikal dan horizontal): jari menyentuh touchscreen, cahaya berganti hangat, netral, dingin
- [ ] 6–10 foto cermin terpasang, minimal 2 per ruangan: kamar mandi, kamar tidur, salon atau barbershop, hotel atau kafe
- [ ] 1 foto cermin lurus dari depan dengan latar polos, untuk bagian titik detail
- [ ] 6 foto close-up: tepi bevel, LED menyala, panel touchscreen, sensor tangan, port cas Type-C, bagian belakang dengan gantungan
- [ ] 2 foto antifog: kondisi berembun dan bersih, dari sudut yang sama
- [ ] 2–3 foto workshop di Citatah: proses potong atau poles kaca
- [ ] Minimal 6 ulasan asli (screenshot marketplace atau WhatsApp) dengan izin pembeli; nama dan nomor disamarkan
- [ ] File logo resmi (SVG atau PNG resolusi tinggi)
- [ ] Link toko Tokopedia dan Shopee (kalau mau ditampilkan)
- [ ] Jam operasional workshop dan admin

Sudah diterima 18 Oktober 2026: 15 render katalog model jadi (rectangle, capsul, oval, leaf, half moon, hex, dan lainnya) dan portofolio 2026 berisi foto workshop, foto pemasangan, logo tiga belah ketupat, serta fakta bisnis (berdiri Maret 2025, 4.000+ unit terkirim, saluran Tokopedia, Shopee, Instagram, TikTok, workshop dan kontraktor). File logo vektor (SVG) dan foto pemasangan resolusi penuh masih dibutuhkan.

## Keputusan terbuka

Delapan hal ini perlu jawaban owner sebelum halaman ditayangkan. Kolom usulan dipakai kalau belum ada jawaban.

| Pertanyaan | Usulan sementara | Kenapa penting |
| --- | --- | --- |
| Tampilkan estimasi harga di konfigurator? | Ya, estimasi produk tanpa ongkir | Harga menyaring pengunjung yang tidak serius dan membuat chat lebih siap closing |
| Ukuran custom paling kecil dan paling besar? | 40 × 40 cm sampai 120 × 200 cm | Batas input konfigurator dan jawaban FAQ |
| Bentuk bulat dan oval dihitung dari kotak luarnya? | Ya | Angka landing harus sama dengan aplikasi CS |
| Ada harga minimum per unit? | Belum ada | Cermin kecil bisa menghasilkan angka yang terlalu murah |
| Garansi dan syarat klaim | Pengiriman 7 hari, fungsi lampu 3 bulan; video unboxing utuh, foto resi, lapor maksimal 7 hari | Tertulis di halaman, jadi mengikat |
| Packing kayu untuk semua kiriman atau luar kota saja? | Sudah terjawab di portofolio 2026: luar kota pakai paking kayu bertulang | Klaim yang salah memicu komplain |
| Tampilkan link Tokopedia dan Shopee? | Tidak di tahap 1 | Pengunjung bisa pindah ke marketplace dan tidak chat |
| Nama domain final | `putraglass.id` jika tersedia | Dipakai di SEO, link iklan dan PDF |

## Tahapan dan kriteria selesai

Lima tahap, masing-masing harus disetujui owner sebelum lanjut. Tahap 1 sengaja kecil supaya arah desain bisa dikoreksi sebelum banyak kode ditulis.

| Tahap | Isi | Selesai jika |
| --- | --- | --- |
| 1. Hero | Hero lengkap: cermin menyala, 3 warna cahaya, judul, tombol | Owner mencoba di HP sendiri dan setuju arah desainnya |
| 2. Konfigurator | Konfigurator, modul harga bersama, pesan WhatsApp, kode sumber | 20 kasus harga sama persis dengan aplikasi CS; pesan WhatsApp terbuka benar di Android dan iPhone |
| 3. Konten | Semua bagian lain dengan foto dan copy asli | Tidak ada teks contoh atau foto pengganti yang tersisa |
| 4. Pelacakan dan SEO | Pixel, GA4, schema, sitemap | Event `Lead` terlihat di alat uji Meta Events Manager dan TikTok |
| 5. Tayang | Deploy di VPS bersama aplikasi CS | Lighthouse mobile ≥ 95 di semua kategori; dicoba di 3 HP asli (Android kelas menengah, Android murah, iPhone) |

Setelah tayang (tahap 2 proyek): Conversions API Meta, uji A/B judul hero, dan laporan closing per kode sumber di dasbor owner.

## Prompt untuk omp

Unduh dokumen ini sebagai Markdown, simpan sebagai `landing/PRD.md` di repo, lalu tempel prompt di bawah. Prompt ini hanya untuk tahap 1, supaya arah desain disetujui dulu.

```
TUGAS: Landing page Putra Glass – TAHAP 1 (navigasi + hero). Baca landing/PRD.md sampai habis dulu.
Acuan visual: canvas "Landing Page Putra Glass" (screenshot desktop dan HP terlampir). Ikuti persis.

ATURAN
- Ikuti PRD persis: palet, font, konsep "cahaya yang bisa disentuh", daftar "yang sengaja dihindari".
- Jangan menyentuh kode aplikasi CS selain membaca modul harga.
- Jangan pakai foto stok, angka tanpa sumber, atau testimoni karangan.

1) SETUP
- Buat folder landing/ (Next.js 15, TypeScript, output: "export"). Script: npm run dev, npm run build
  (hasil di landing/out/).
- Font Plus Jakarta Sans (400, 600, 800) di-host sendiri, woff2 subset latin.
  Judul: 800, huruf kecil, letter-spacing -0.035em, word-spacing 0.04em.
- Token warna di :root sesuai tabel palet PRD.

2) NAVIGASI + HERO
- Navigasi: logo tiga belah ketupat + PUTRA GLASS, link Model / Hitung harga / Cara pesan / Workshop
  (disembunyikan di HP), tombol "Chat WhatsApp".
- Cermin bentuk capsul (bentuk asli di katalog) dari SVG + CSS (bukan foto), bingkai perak.
- Saat halaman dibuka: garis LED merambat mengelilingi cermin (900 ms), lalu cahaya mekar (500 ms)
  dan memantul ke dinding belakang. Sekali saja.
- 3 tombol warna cahaya (Hangat/Natural/Putih) + cermin itu sendiri bisa disentuh untuk ganti warna.
  Transisi 350 ms. Pilihan aktif ditandai warna tepi kaca. Bisa dengan keyboard, ada aria-pressed.
- Judul "cermin LED yang ukurannya kamu tentukan." tanpa efek tambahan. Subjudul sesuai PRD.
- Tombol: "Tanya harga di WhatsApp" (wa.me/6281237533173, pesan pembuka + kode sumber dari UTM:
  LP-META / LP-TIKTOK / LP-IG / LP-GOOGLE / LP-LANGSUNG) dan "Hitung estimasi harga" (ke #rancang).
- Baris bukti: "Sejak Maret 2025, lebih dari 4.000 unit cermin dan kaca terkirim ke seluruh Indonesia."
- HP: cermin kecil (150 x 260 px) di atas, judul 40 px. Judul dan kedua tombol harus terlihat
  di layar pertama 390 x 844 tanpa scroll.
- prefers-reduced-motion: cermin langsung menyala, ganti warna seketika.
- Animasi hanya transform/opacity/clip-path. Hentikan animasi cahaya saat hero tidak terlihat.

3) CEK SEBELUM LAPOR
- Lighthouse mobile build statis: Performance ≥ 95, Accessibility 100, LCP ≤ 2,0 dtk, CLS ≤ 0,05.
- JS awal ≤ 70 KB gzip.
- Screenshot hero di 360, 390, 768, 1440 px dan rekaman animasi menyala. Bandingkan dengan canvas.
- Cek ulang terhadap daftar "yang sengaja dihindari" di PRD, sebutkan satu per satu.
- Commit + push.

LAPORAN SINGKAT: screenshot 4 ukuran, rekaman animasi, skor Lighthouse, ukuran JS, hash commit.
```
