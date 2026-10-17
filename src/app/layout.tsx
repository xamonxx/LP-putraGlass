import type { Metadata } from 'next';
import './globals.css';
import { INSTAGRAM_URL, TIKTOK_URL } from '../lib/constants';

export const metadata: Metadata = {
  metadataBase: new URL('https://putraglass.id'),
  title: 'Cermin LED Custom Bandung – Putra Glass',
  description: 'Dibuat per pesanan di workshop Citatah, Bandung Barat. Cermin LED bentuk bebas, tiga warna cahaya dalam satu sentuhan. Kirim ke seluruh Indonesia.',
  keywords: ['cermin led', 'cermin custom bandung', 'cermin led bandung', 'putra glass', 'cermin wastafel', 'cermin kamar mandi led'],
  authors: [{ name: 'Putra Glass' }],
  creator: 'Putra Glass',
  openGraph: {
    title: 'Cermin LED Custom Bandung – Putra Glass',
    description: 'Dibuat per pesanan di workshop Citatah, Bandung Barat. Bentuk bebas, tiga warna cahaya dalam satu sentuhan.',
    url: 'https://putraglass.id',
    siteName: 'Putra Glass',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/assets/pasang-hotel.jpg',
        width: 1200,
        height: 630,
        alt: 'Cermin LED Putra Glass',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cermin LED Custom Bandung – Putra Glass',
    description: 'Dibuat per pesanan di workshop Citatah, Bandung Barat. Bentuk bebas, tiga warna cahaya dalam satu sentuhan.',
    images: ['/assets/pasang-hotel.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://putraglass.id',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Putra Glass',
  image: 'https://putraglass.id/assets/pasang-hotel.jpg',
  description: 'Spesialis fabrikasi cermin LED custom, kaca es, kaca moru, dan kaca arsitektural di Bandung Barat.',
  telephone: '+6281237533173',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jalan Nasional III, Citatah',
    addressLocality: 'Kec. Cipatat',
    addressRegion: 'Kabupaten Bandung Barat',
    postalCode: '40554',
    addressCountry: 'ID',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -6.845,
    longitude: 107.425,
  },
  url: 'https://putraglass.id',
  priceRange: 'Rp500.000 - Rp4.000.000',
  sameAs: [INSTAGRAM_URL, TIKTOK_URL],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const tiktokPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="id">
      <head>
        {/* Preload font bobot 800 wajib sesuai PRD */}
        <link
          rel="preload"
          href="/fonts/plus-jakarta-sans-latin-800.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
          fetchPriority="high"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `@font-face{font-family:'Plus Jakarta Sans';font-style:normal;font-weight:800;font-display:swap;src:url('/fonts/plus-jakarta-sans-latin-800.woff2') format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Meta Pixel */}
        {metaPixelId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${metaPixelId}');fbq('track', 'PageView');`,
            }}
          />
        )}

        {/* TikTok Pixel */}
        {tiktokPixelId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `!function (w, d, t) {w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${tiktokPixelId}');ttq.page();}(window, document, 'ttq');`,
            }}
          />
        )}

        {/* Google Analytics 4 */}
        {gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${gaId}');`,
              }}
            />
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
