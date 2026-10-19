'use client';

import React, { useState, useEffect } from 'react';
import { buildWhatsAppLink, getStoredLeadSource, trackLeadClick } from '../lib/tracking';

export function StickyWhatsApp() {
  const [showSticky, setShowSticky] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      // Tampil setelah hero lewat (sekitar 500px scroll)
      const heroEl = document.getElementById('hero');
      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        // Ketika bagian bawah hero sudah di atas layar
        setShowSticky(rect.bottom < 60);
      } else {
        setShowSticky(window.scrollY > 450);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const WA_MSG = 'Halo Putra Glass, saya mau konsultasi cermin LED custom.';
  const waUrl = buildWhatsAppLink(WA_MSG);

  return (
    <div
      className="sticky-wa-wrapper"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 90,
        padding: '10px 16px',
        background: 'linear-gradient(to top, rgba(20, 28, 51, 0.95) 0%, rgba(20, 28, 51, 0.75) 80%, rgba(20, 28, 51, 0) 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        transform: showSticky ? 'translateY(0)' : 'translateY(120%)',
        transition: 'transform 200ms ease-out',
        pointerEvents: showSticky ? 'auto' : 'none',
      }}
    >
      <a
        className="wa"
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Tanya harga cermin LED custom melalui WhatsApp"
        onClick={(e) => {
            // Hitung ulang saat diklik supaya kode sumber iklan (UTM) yang terbaru ikut terkirim
            e.currentTarget.href = buildWhatsAppLink(WA_MSG, getStoredLeadSource());
            trackLeadClick('sticky_mobile_wa');
          }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          width: '100%',
          height: '56px',
          borderRadius: '14px',
          background: '#25D366',
          color: '#06301A',
          fontWeight: 700,
          fontSize: '16px',
          textDecoration: 'none',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.35)',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#06301A" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
        </svg>
        Tanya Harga di WhatsApp
      </a>

      <style jsx>{`
        @media (min-width: 861px) {
          .sticky-wa-wrapper {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
