import type { Metadata } from 'next';
import './globals.css';
import { ExperienceProvider } from '../components/ExperienceProvider';
import { TrackingConsent } from '../components/TrackingConsent';
import { ClientInit } from '../components/ClientInit';
import { CookieBanner } from '../components/CookieBanner';
import { StickyWhatsApp } from '../components/StickyWhatsApp';
import { INSTAGRAM_URL, TIKTOK_URL } from '../lib/constants';
export const metadata: Metadata = {
  metadataBase: new URL('https://putraglass.id'),
  title: { default: 'Putra Glass — Cermin LED & Showroom Interaktif', template: '%s | Putra Glass' },
  description: 'Jelajahi koleksi cermin LED Putra Glass. Lihat simulasi 3D, rancang ukuran Anda, dan konsultasikan kebutuhan langsung dengan workshop Citatah, Bandung Barat.',
  openGraph: { title: 'Putra Glass — Cahaya yang membentuk ruang', description: 'Koleksi cermin LED dan custom. Jelajahi bentuk, cahaya, dan kemungkinan untuk ruang Anda.', url: 'https://putraglass.id', siteName: 'Putra Glass', locale: 'id_ID', type: 'website', images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Cermin LED Putra Glass' }] },
  twitter: { card: 'summary_large_image', images: ['/og.jpg'] },
  alternates: { canonical: 'https://putraglass.id' }, robots: { index: true, follow: true },
};
const business = { '@context': 'https://schema.org', '@type': 'LocalBusiness', name: 'Putra Glass', image: 'https://putraglass.id/og.jpg', telephone: '+6281237533173', url: 'https://putraglass.id', hasMap: 'https://maps.app.goo.gl/EfXTbzY7PCQ4TPUn6', address: { '@type': 'PostalAddress', streetAddress: 'Jalan Nasional III, Citatah', addressLocality: 'Kec. Cipatat', addressRegion: 'Kabupaten Bandung Barat', postalCode: '40554', addressCountry: 'ID' }, sameAs: [INSTAGRAM_URL, TIKTOK_URL] };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="id"><head><link rel="preload" href="/fonts/plus-jakarta-sans-latin-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(business) }}/></head><body>
    <a href="#main-content" className="skip-link">Lewati ke konten utama</a>
    <ExperienceProvider><ClientInit/>{children}<StickyWhatsApp/><CookieBanner/></ExperienceProvider>
    <TrackingConsent config={{ meta: process.env.NEXT_PUBLIC_META_PIXEL_ID, tiktok: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID, ga: process.env.NEXT_PUBLIC_GA_ID, clarity: process.env.NEXT_PUBLIC_CLARITY_ID }}/>
  </body></html>;
}