/**
 * Pertanyaan umum (BOFU) Putra Glass.
 * Sumber fakta: docs/PRD.md dan src/config/harga-contoh.ts.
 * Dipakai dua kali: tampilan akordeon di FaqSection dan JSON-LD `FAQPage` di halaman.
 * Jawaban ditulis tanpa HTML supaya aman dipakai langsung di schema.
 */

import { GAMBARAN_HARGA_CONTOH } from '../config/harga-contoh';

export interface FaqItem {
  id: string;
  pertanyaan: string;
  jawaban: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'harga',
    pertanyaan: 'Berapa harga cermin LED custom?',
    jawaban:
      'Cermin custom dihitung per meter persegi: LED 3 warna premium Rp1.750.000/m² dan LED 1 warna basic Rp1.550.000/m². Sensor tangan + baterai menambah Rp250.000 per unit, antifog Rp200.000 per unit. ' +
      GAMBARAN_HARGA_CONTOH.teks +
      ' Luas dihitung dari lebar × tinggi ÷ 10.000, dan bentuk bulat atau oval dihitung dari kotak luarnya. Pakai kalkulator di bagian "Rancang cerminmu" untuk estimasi ukuranmu sendiri; ongkir selalu dihitung terpisah oleh admin.',
  },
  {
    id: 'lama-produksi',
    pertanyaan: 'Berapa lama cermin saya jadi?',
    jawaban:
      'Produksi 1–5 hari kerja setelah DP 50% masuk. Selama dikerjakan kami kirim foto dan video prosesnya lewat WhatsApp, lalu foto packing dan nomor resi saat barang berangkat. Lama kiriman sendiri menyusul sesuai kota tujuan dan ekspedisi yang dipakai.',
  },
  {
    id: 'kirim-luar-kota',
    pertanyaan: 'Bisa kirim ke luar kota? Aman tidak di jalan?',
    jawaban:
      'Bisa, kami kirim ke seluruh Indonesia. Kiriman luar kota dikemas paking kayu bertulang rapat, sedangkan dalam kota bisa pakai kurir instan. Ongkir dihitung sesuai kota tujuan dan dibayar sesuai tarif ekspedisi, atau kamu bisa ambil sendiri di workshop Citatah, Bandung Barat.',
  },
  // TODO isi fakta dari owner — detail garansi dan syarat klaim masih "keputusan terbuka" di PRD (angka di bawah masih menunggu konfirmasi owner)
  {
    id: 'garansi',
    pertanyaan: 'Garansinya apa saja?',
    jawaban:
      'Garansi aktif sejak barang sampai di tanganmu: garansi pengiriman (barang pecah atau rusak di jalan) dan garansi fungsi lampu LED. Masa dan syarat klaim final sedang dikunci bersama owner, jadi sebelum pesan mintalah ketentuan tertulisnya ke admin lewat WhatsApp supaya tidak ada salah paham. Yang pasti: simpan video unboxing utuh dan foto resi, karena keduanya dipakai saat klaim.',
  },
  {
    id: 'pemasangan',
    pertanyaan: 'Harganya sudah termasuk pemasangan?',
    jawaban:
      'Belum. Jasa pemasangan tidak termasuk dan tidak kami kerjakan. Tapi cermin dikirim siap pasang: bagian belakang sudah memakai frame EVA foam dan gantungan kayu + besi, jadi tukang atau teknisi di tempatmu tinggal menggantungnya di dinding. Kalau ragu soal posisi dan titik gantungan, kirim foto dindingnya ke admin.',
  },
  // TODO isi fakta dari owner — aturan perawatan lapisan antifog (suhu, bahan pembersih, umur pakai) belum ada di PRD
  {
    id: 'antifog',
    pertanyaan: 'Antifog itu apa dan bagaimana merawatnya?',
    jawaban:
      'Antifog adalah pemanas tipis di balik kaca yang membuat cermin tetap bening saat ruangan penuh uap setelah mandi air panas; tambahannya Rp200.000 per unit. Bedanya bisa kamu lihat di bagian demo antifog pada halaman ini. Untuk panduan perawatan dan pembersih yang aman dipakai, tanyakan ke admin lewat WhatsApp supaya kamu dapat jawaban yang sesuai unit yang dipesan.',
  },
  // TODO isi fakta dari owner — batas ukuran custom paling kecil dan paling besar masih "keputusan terbuka" di PRD
  {
    id: 'ukuran-custom',
    pertanyaan: 'Ukuran paling besar berapa? Bisa bentuk di luar katalog?',
    jawaban:
      'Bentuk dan ukuran bebas, dihitung per m², termasuk bentuk di luar katalog seperti leaf, hex, half moon, sampai coakan khusus. Batas ukuran paling kecil dan paling besar yang bisa diproduksi aman tergantung kaca dan pengiriman, jadi kirim ukuran yang kamu butuhkan ke WhatsApp — admin langsung konfirmasi bisa atau tidak sebelum kamu bayar DP.',
  },
  {
    id: 'cara-ukur',
    pertanyaan: 'Bagaimana cara mengukur sebelum pesan?',
    jawaban:
      'Ukur lebar dan tinggi area dinding yang mau diisi dalam sentimeter (untuk cermin bulat cukup diameternya), lalu kurangi sedikit supaya masih ada ruang di kiri-kanan. Di konfigurator, ukuranmu ditampilkan di samping siluet orang 170 cm dan wastafel 80 cm sebagai pembanding, jadi kelihatan seberapa besar hasilnya. Kalau masih ragu, kirim foto ruangan dan ukuran kasarnya ke admin untuk dicek dulu.',
  },
  {
    id: 'pembayaran',
    pertanyaan: 'Cara bayarnya bagaimana?',
    jawaban:
      'DP 50% lewat transfer untuk memulai produksi, pelunasan sebelum barang dikirim. Setelah pelunasan kami kirim foto packing dan resi. Untuk kebutuhan banyak unit (hotel, kafe, kontraktor interior) skema pembayaran dan jadwal produksinya dibicarakan terpisah di jalur proyek.',
  },
  {
    id: 'after-sales',
    pertanyaan: 'Kalau lampunya bermasalah setelah dipakai, saya hubungi siapa?',
    jawaban:
      'Hubungi admin di nomor WhatsApp yang sama dengan nomor pemesananmu, +62 812-3753-3173. Riwayat pesananmu tercatat di aplikasi admin, jadi tidak perlu menjelaskan ulang dari awal. Sertakan video singkat kondisi cermin saat lampu dinyalakan supaya penanganannya bisa langsung diarahkan ke penggantian part atau pengecekan unit.',
  },
];
