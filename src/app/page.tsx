import React from 'react';
import { ClientInit } from '../components/ClientInit';
import { HeaderNav } from '../components/HeaderNav';
import { HeroSection } from '../components/HeroSection';
import { ModelSection } from '../components/ModelSection';
import { ConfiguratorSection } from '../components/ConfiguratorSection';
import { HotspotDetailSection } from '../components/HotspotDetailSection';
import { AntifogDemoSection } from '../components/AntifogDemoSection';
import { GallerySection } from '../components/GallerySection';
import { ProjectBannerSection } from '../components/ProjectBannerSection';
import { HowToOrderSection } from '../components/HowToOrderSection';
import { WorkshopSection } from '../components/WorkshopSection';
import { ShippingWarrantySection } from '../components/ShippingWarrantySection';
import { FaqSection } from '../components/FaqSection';
import { FooterSection } from '../components/FooterSection';
import { StickyWhatsApp } from '../components/StickyWhatsApp';
import { CookieBanner } from '../components/CookieBanner';

export default function LandingPage() {
  return (
    <div className="pg" style={{ minHeight: '100%', position: 'relative' }}>
      <ClientInit />

      {/* 1. Navigasi & Hero (Dark) */}
      <HeaderNav />
      <main>
        <HeroSection />

        {/* 2. Custom atau Model Jadi (Light) */}
        <ModelSection />

        {/* 3. Konfigurator Rancang Cerminmu (Dark) */}
        <ConfiguratorSection />

        {/* 4. Detail yang Tidak Terlihat di Foto (Light) */}
        <HotspotDetailSection />

        {/* 5. Demo Antifog (Dark) */}
        <AntifogDemoSection />

        {/* 6. Galeri Pemasangan Asli (Light) */}
        <GallerySection />

        {/* 7. Untuk Proyek (Pita Lebar) */}
        <ProjectBannerSection />

        {/* 8. Cara Pesan (Light) */}
        <HowToOrderSection />

        {/* 9. Workshop Citatah & 4 Alur Proses (Dark) */}
        <WorkshopSection />

        {/* 10. Pengiriman & Garansi (Light) */}
        <ShippingWarrantySection />

        {/* 11. Pertanyaan Umum - FAQ 6 Pertanyaan (Light) */}
        <FaqSection />
      </main>

      {/* 12. Penutup & Footer */}
      <FooterSection />

      {/* 13. Tombol WhatsApp Menempel (HP Only) */}
      <StickyWhatsApp />

      {/* 14. Cookie Banner */}
      <CookieBanner />
    </div>
  );
}
