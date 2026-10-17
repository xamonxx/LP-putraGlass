/**
 * Konstanta Landing Page Putra Glass
 * Sesuai PRD dan Desain yang disetujui
 */

export const PHONE_NUMBER = '6281237533173';
export const PHONE_DISPLAY = '+62 812-3753-3173';
export const INSTAGRAM_HANDLE = '@putraglass.id';
export const INSTAGRAM_URL = 'https://instagram.com/putraglass.id';
export const TIKTOK_HANDLE = '@putraglass_';
export const TIKTOK_URL = 'https://tiktok.com/@putraglass_';
export const MAPS_URL = 'https://maps.app.goo.gl/EfXTbzY7PCQ4TPUn6';
export const WORKSHOP_ADDRESS = 'Jalan Nasional III, Citatah, Kec. Cipatat, Kabupaten Bandung Barat 40554';

// Garansi Produk - Diambil dari satu konstanta
// TODO: Menunggu konfirmasi owner mengenai detail teknis klaim dan durasi final
export const GARANSI_INFO = {
  pengiriman: '7 hari',
  fungsiLampu: '3 bulan',
  syaratKlaim: 'Wajib menyimpan video unboxing utuh tanpa jeda dan foto nomor resi pengiriman.',
  catatanOwner: 'TODO: Menunggu konfirmasi owner',
};

// Pilihan Warna Cahaya Hero
export const COLOR_TEMPS = [
  {
    id: 'hangat',
    label: 'Hangat',
    glow: '#FFC98A',
    soft: 'rgba(255,201,138,0.34)',
    wall: 'rgba(255,190,120,0.16)',
  },
  {
    id: 'natural',
    label: 'Natural',
    glow: '#FFE9C7',
    soft: 'rgba(255,233,199,0.30)',
    wall: 'rgba(255,233,199,0.13)',
  },
  {
    id: 'putih',
    label: 'Putih',
    glow: '#D6E6FF',
    soft: 'rgba(214,230,255,0.30)',
    wall: 'rgba(190,215,255,0.14)',
  },
] as const;

// Bentuk Cermin Konfigurator
export const CONFIGURATOR_SHAPES = [
  { id: 'rectangle', label: 'Rectangle', radius: '6px' },
  { id: 'capsul', label: 'Capsul', radius: '999px' },
  { id: 'oval', label: 'Oval', radius: '50%' },
  { id: 'round', label: 'Round', radius: '50%' },
] as const;

// FAQ 6 Pertanyaan Sesuai PRD
export const FAQ_LIST = [
  {
    tanya: 'Berapa lama cermin pesanan saya selesai diproduksi?',
    jawab: 'Waktu produksi standar adalah 1–5 hari kerja setelah konfirmasi transfer DP 50%. Selama proses pengerjaan, kami akan mengirimkan foto dan video progres cerminmu langsung dari workshop di Citatah.',
  },
  {
    tanya: 'Ukuran paling besar dan paling kecil yang bisa dibuat berapa?',
    jawab: 'Untuk custom cermin LED, ukuran yang dapat dipesan mulai dari minimal 30 × 30 cm hingga maksimal 120 × 200 cm untuk pengiriman reguler. Untuk proyek interior atau ukuran lebih besar dari itu, tim kami siap mendiskusikan teknis instalasi dan pengirimannya.',
  },
  {
    tanya: 'Apakah menggunakan colokan kabel atau sistem baterai?',
    jawab: 'Kami menyediakan dua opsi: sistem kabel colokan standar AC (panjang kabel 1,5 meter siap colok) atau versi baterai 6000 mAh isi ulang Type-C bagi kamu yang tidak ingin membobok dinding untuk jalur kabel.',
  },
  {
    tanya: 'Apakah harga cermin sudah termasuk jasa pemasangan?',
    jawab: 'Harga yang tertera belum termasuk jasa pemasangan di lokasi. Cermin kami sudah dilengkapi rangka kokoh dan gantungan presisi di bagian belakang yang siap dipasang langsung ke dinding menggunakan sekrup dan fischer.',
  },
  {
    tanya: 'Bagaimana alur dan metode pembayarannya?',
    jawab: 'Pembayaran dilakukan dengan uang muka (DP) 50% via transfer Bank BCA untuk memulai antrean produksi. Pelunasan 50% sisanya dilakukan setelah cermin selesai diuji nyala dan foto/video paking siap kirim kami tunjukkan kepadamu.',
  },
  {
    tanya: 'Apa saja garansi yang diberikan dan bagaimana cara klaimnya?',
    jawab: `Kami memberikan garansi aman sampai tujuan selama ${GARANSI_INFO.pengiriman} dan garansi fungsi lampu selama ${GARANSI_INFO.fungsiLampu}. Bila terjadi kendala, cukup kirimkan video unboxing utuh dan foto resi ke admin WhatsApp kami.`,
  },
];
