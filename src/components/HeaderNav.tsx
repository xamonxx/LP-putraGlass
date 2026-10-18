'use client';

import React from 'react';
import { buildWhatsAppLink, getStoredLeadSource, trackLeadClick } from '../lib/tracking';

export function HeaderNav() {
  const WA_MSG = 'Halo Putra Glass, saya mau tanya cermin LED.';
  const waUrl = buildWhatsAppLink(WA_MSG);

  return (
    <header style={{ padding: '22px 0', position: 'relative', zIndex: 10 }}>
      <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#FFFFFF' }} aria-label="Putra Glass Beranda">
          <svg width="44" height="24" viewBox="0 0 44 24" aria-hidden="true">
            <rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" fill="#A6A6A6" />
            <rect x="15" y="5" width="14" height="14" transform="rotate(45 22 12)" fill="#253254" stroke="rgba(255,255,255,.45)" strokeWidth="1" />
            <rect x="25" y="5" width="14" height="14" transform="rotate(45 32 12)" fill="#BFCBD9" />
          </svg>
          <span style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '0.08em' }}>PUTRA GLASS</span>
        </a>

        <nav className="nav-links" aria-label="Menu utama" style={{ gap: '32px', fontSize: '15px' }}>
          <a href="#model" style={{ color: '#C9D2E0', textDecoration: 'none' }}>Model</a>
          <a href="#rancang" style={{ color: '#C9D2E0', textDecoration: 'none' }}>Rancang</a>
          <a href="#cara-pesan" style={{ color: '#C9D2E0', textDecoration: 'none' }}>Cara pesan</a>
          <a href="#workshop" style={{ color: '#C9D2E0', textDecoration: 'none' }}>Workshop</a>
        </nav>

        <a
          className="wa"
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            // Hitung ulang saat diklik supaya kode sumber iklan (UTM) yang terbaru ikut terkirim
            e.currentTarget.href = buildWhatsAppLink(WA_MSG, getStoredLeadSource());
            trackLeadClick('header_nav');
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            padding: '0 16px',
            borderRadius: '10px',
            background: '#25D366',
            color: '#06301A',
            fontWeight: 600,
            fontSize: '14px',
            textDecoration: 'none',
          }}
        >
          Chat WhatsApp
        </a>
      </div>
    </header>
  );
}
