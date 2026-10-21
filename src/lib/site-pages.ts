import type { Metadata } from 'next';

export const SITE_PAGES = {
  catalog: { path: '/katalog', label: 'Koleksi', title: 'Koleksi cermin LED', description: 'Kenali koleksi Capsul, Rectangle, Leaf, dan Half Moon Putra Glass. Lihat desainnya dan konsultasikan ukuran yang Anda butuhkan.' },
  showroom: { path: '/showroom', label: 'Showroom 3D', title: 'Showroom 3D cermin LED custom', description: 'Rancang bentuk, ukuran dan cahaya cermin LED Anda. Jelajahi simulasi 3D Putra Glass dan kirim rancangan untuk mendapatkan penawaran.' },
  about: { path: '/tentang', label: 'Cerita kami', title: 'Tentang Putra Glass dan workshop Citatah', description: 'Kenali Putra Glass di Citatah, Bandung Barat. Lihat dokumentasi pengerjaan kaca, perakitan LED dan pengujian cahaya di workshop kami.' },
  order: { path: '/cara-pesan', label: 'Cara pesan', title: 'Cara pesan cermin LED custom', description: 'Pelajari langkah pemesanan cermin LED Putra Glass: konsultasi model dan ukuran, penawaran, produksi di workshop, hingga pengiriman.' },
  consultation: { path: '/konsultasi', label: 'Konsultasi & penawaran', title: 'Konsultasi dan penawaran cermin LED', description: 'Sampaikan model dan ukuran cermin yang Anda butuhkan. Siapkan pesan konsultasi WhatsApp dan minta penawaran langsung dari Putra Glass.' },
  faq: { path: '/faq', label: 'FAQ', title: 'Pertanyaan umum cermin LED Putra Glass', description: 'Jawaban tentang harga custom, proses pemesanan, pengiriman, pemasangan, antifog dan perawatan cermin LED Putra Glass.' },
} as const;
export type SitePage = typeof SITE_PAGES[keyof typeof SITE_PAGES];
export function pageMetadata(page: SitePage): Metadata {
  return { title: page.title, description: page.description, alternates: { canonical: page.path }, openGraph: { title: page.title, description: page.description, url: page.path, images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Cermin LED Putra Glass' }] } };
}

// Historical campaign anchors remain supported, but navigation uses real pages.
export const LEGACY_PAGE_PATHS: Record<string, string> = {
  model: SITE_PAGES.catalog.path, rancang: SITE_PAGES.showroom.path,
  workshop: SITE_PAGES.about.path, 'cara-pesan': SITE_PAGES.order.path,
  konsultasi: SITE_PAGES.consultation.path, faq: SITE_PAGES.faq.path,
};
