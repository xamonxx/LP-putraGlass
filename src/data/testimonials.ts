/**
 * Testimoni pelanggan Putra Glass.
 *
 * ⚠️ PERINGATAN KONTEN — WAJIB DIBACA SEBELUM TAYANG
 * Isi di bawah ini adalah CONTOH / PLACEHOLDER konten marketing, bukan ulasan asli.
 * PRD melarang testimoni karangan dan menyatakan bagian "Kata pembeli" baru boleh
 * ditampilkan setelah ada minimal 6 ulasan asli (screenshot marketplace atau
 * WhatsApp) yang sudah diizinkan pembelinya, dengan nama dan nomor disamarkan.
 * Ganti seluruh isi array ini dengan ulasan asli sebelum produksi, atau jangan
 * wire section testimoni ke halaman.
 */

export interface Testimonial {
  id: string;
  nama: string;
  kota: string;
  produk: string;
  /** 4 atau 5 */
  rating: 4 | 5;
  teks: string;
  /** ISO 8601, tanggal ulasan ditulis */
  tanggal: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'rina-bandung',
    nama: 'Rina S.',
    kota: 'Bandung',
    produk: 'Cermin LED capsul 60 × 120 cm, touchscreen',
    rating: 5,
    teks: 'Ambil sendiri di workshop Citatah, sekalian lihat cerminnya diuji nyala. Cahaya hangatnya pas banget buat kamar mandi, nggak silau.',
    tanggal: '2026-09-12',
  },
  {
    id: 'andre-jakarta',
    nama: 'Andre P.',
    kota: 'Jakarta Selatan',
    produk: 'Cermin LED rectangle 80 × 100 cm, antifog',
    rating: 5,
    teks: 'Packing kayunya rapat banget, sampai Jakarta mulus tanpa lecet. Antifognya kepakai tiap habis mandi air panas, kacanya tetap bening.',
    tanggal: '2026-08-28',
  },
  {
    id: 'dewi-surabaya',
    nama: 'Dewi A.',
    kota: 'Surabaya',
    produk: 'Cermin LED leaf 50 × 90 cm, sensor tangan',
    rating: 5,
    teks: 'Dikasih foto dan video pas lagi dikerjakan, jadi tenang nunggunya. Sampai Surabaya 4 hari, langsung nyala pas dicoba.',
    tanggal: '2026-08-05',
  },
  {
    id: 'hendra-bekasi',
    nama: 'Hendra W.',
    kota: 'Bekasi',
    produk: '6 unit cermin half moon untuk barbershop',
    rating: 4,
    teks: 'Pesan 6 unit buat barbershop, ukurannya sama persis semua dan jadwal produksinya tepat. Ongkirnya agak terasa, tapi hasilnya sepadan.',
    tanggal: '2026-07-19',
  },
  {
    id: 'maya-denpasar',
    nama: 'Maya K.',
    kota: 'Denpasar',
    produk: 'Cermin LED oval 60 × 80 cm, baterai Type-C',
    rating: 5,
    teks: 'Versi baterai jadi penyelamat karena di kamar nggak ada colokan dekat dinding. Sekali cas awet berhari-hari.',
    tanggal: '2026-07-02',
  },
  {
    id: 'yusuf-medan',
    nama: 'Yusuf R.',
    kota: 'Medan',
    produk: 'Cermin LED custom 110 × 180 cm untuk lobi hotel',
    rating: 4,
    teks: 'Ukuran custom buat lobi hotel dilayani tanpa ribet, tinggal kirim ukuran lewat WhatsApp. Kirim ke Medan lebih lama, tapi diinfokan resinya terus.',
    tanggal: '2026-06-23',
  },
];
