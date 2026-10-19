import React from 'react';
import { ClientInit } from '../components/ClientInit';
import { HeaderNav } from '../components/HeaderNav';
import { HeroSection } from '../components/HeroSection';
import { ModelSection } from '../components/ModelSection';
import { ConfiguratorSection } from '../components/ConfiguratorSection';
import { HotspotDetailSection } from '../components/HotspotDetailSection';
import { AntifogDemoSection } from '../components/AntifogDemoSection';
import { TestimonialSection } from '../components/TestimonialSection';
import { HowToOrderSection } from '../components/HowToOrderSection';
import { LeadFormSection } from '../components/LeadFormSection';
import { WorkshopSection } from '../components/WorkshopSection';
import { FaqSection } from '../components/FaqSection';
import { FooterSection } from '../components/FooterSection';
import { StickyWhatsApp } from '../components/StickyWhatsApp';
import { CookieBanner } from '../components/CookieBanner';
import { ExitIntentDialog } from '../components/ExitIntentDialog';

export default function LandingPage() {
  return (
    <div className="pg" style={{ minHeight: '100%', position: 'relative' }}>
      <ClientInit />

      {/* Navigasi */}
      <HeaderNav />

      <main>
        {/* 1. Hero */}
        <HeroSection />

        {/* 2. Model */}
        <ModelSection />

        {/* 3. Rancang */}
        <ConfiguratorSection />

        {/* 4. Detail */}
        <HotspotDetailSection />

        {/* 5. Antifog */}
        <AntifogDemoSection />

        {/* 6. Bukti sosial */}
        <TestimonialSection />

        {/* 7. Cara pesan */}
        <HowToOrderSection />

        {/* 8. Tangkap lead */}
        <LeadFormSection />

        {/* 9. Workshop */}
        <WorkshopSection />

        {/* 10. FAQ */}
        <FaqSection />
      </main>

      {/* 11. Penutup */}
      <FooterSection />

      {/* Tombol WhatsApp Menempel (HP Only) */}
      <StickyWhatsApp />

      {/* Cookie Banner */}
      <CookieBanner />

      {/* Penawaran saat user hendak pergi */}
      <ExitIntentDialog />
    </div>
  );
}
