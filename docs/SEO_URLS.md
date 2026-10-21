# URL halaman untuk Google Search Console

20 Oktober 2026. Navigasi publik menggunakan halaman statis tersendiri, bukan URL fragment.

| Tautan lama | Halaman sekarang |
|---|---|
| `/#model` | `/katalog` |
| `/#rancang` | `/showroom` |
| `/#workshop` | `/tentang` |
| `/#cara-pesan` | `/cara-pesan` |
| `/#konsultasi` | `/konsultasi` |
| `/#faq` | `/faq` |

Setiap halaman mempunyai HTML hasil ekspor, satu H1, judul/deskripsi, canonical miliknya sendiri, Open Graph URL dan breadcrumb. Sitemap memuat URL bersih dan robots.txt menunjuk sitemap produksi. Halaman utama tetap menyediakan pengalaman scroll storytelling lengkap. Tombol bab/skip cerita melakukan scroll tanpa menambah fragment pada address bar.

ID HTML tetap digunakan untuk label form, ARIA, target scroll dan kompatibilitas. ID tersebut tidak menentukan URL indeks. Skip link aksesibilitas ke main-content tetap memakai anchor native agar berfungsi tanpa JavaScript. Tautan kampanye lama yang memakai fragment dikenali di browser dan diganti ke halaman baru, dengan parameter UTM tetap terbawa. Karena fragment tidak dikirim ke server, ini merupakan navigasi pengganti di klien, bukan klaim redirect HTTP 301. Pengalihan memuat HTML tujuan dengan location.replace, sehingga metadata homepage tidak tertinggal sebagai canonical kedua ketika hidrasi awal belum selesai.

Manifest route dan metadata: `src/lib/site-pages.ts`. Breadcrumb/frame: `src/components/PageFrame.tsx`. Redirect kampanye: `ClientInit.tsx`. Seluruh route baru dihasilkan ke `out/` oleh Next.js static export; tidak hanya mengganti teks URL menggunakan History API pada halaman yang sama.

Server preview mengirim XML sebagai application/xml, robots dan file navigasi Next `.txt` sebagai text/plain, serta meminta revalidasi HTML/TXT/XML. File TXT hasil ekspor harus ikut di-deploy karena digunakan navigasi App Router. MIME yang salah dapat membuat browser melakukan full reload dan menghapus state konfigurator saat berpindah halaman. Konfigurasi hosting statis harus mempertahankan tipe TXT/XML dan tidak mengganti file TXT dengan index.html.

## Setelah dipublikasikan

Deploy seluruh isi out/ ke hosting yang sudah dipakai. Pertahankan canonical produksi `https://putraglass.id`. Di properti Search Console milik domain itu, kirim `https://putraglass.id/sitemap.xml`, kemudian gunakan URL Inspection untuk memeriksa halaman baru. Preview localhost tidak dipublikasikan dan tidak disubmit ke Google pada pekerjaan ini. Status indeks dan laporan kunjungan organik bergantung pada crawl Google; tidak ada klaim bahwa halaman baru sudah terindeks. Klik, rotasi viewer, dan interaksi form tetap merupakan event analitik tersendiri.

Dasar teknis: [Google Search Central — URL structure](https://developers.google.com/search/docs/crawling-indexing/url-structure), bagian tentang URL fragments. Google umumnya tidak mendukung fragment untuk mengganti konten halaman.

## Verifikasi

Tes memeriksa href publik tanpa fragment, akses 200 dan konten tanpa JavaScript, satu H1, judul unik, canonical/Open Graph/breadcrumb, sitemap XML, file navigasi TXT, fallback 404, compatibility link/UTM, navigasi back/reload, overflow dan axe pada 320px, serta state konfigurator lintas halaman. Lihat QA_REPORT.md untuk hasil suite akhir.
