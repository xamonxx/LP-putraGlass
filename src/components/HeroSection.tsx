'use client';

import React, { useState, useEffect, useRef } from 'react';
import { COLOR_TEMPS } from '../lib/constants';
import { LeadSourceCode, buildWhatsAppLink, getStoredLeadSource, trackLeadClick } from '../lib/tracking';

export function HeroSection() {
  const [activeTempIndex, setActiveTempIndex] = useState(0);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const heroRef = useRef<HTMLElement>(null);
  const [leadCode, setLeadCode] = useState<LeadSourceCode>('LP-LANGSUNG');

  const cur = COLOR_TEMPS[activeTempIndex];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    setLeadCode(getStoredLeadSource());

    return () => observer.disconnect();
  }, []);

  const handleNextTemp = () => {
    setActiveTempIndex((prev) => (prev + 1) % COLOR_TEMPS.length);
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // no-op
      }
    }
  };

  const handleSelectTemp = (index: number) => {
    setActiveTempIndex(index);
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // no-op
      }
    }
  };

  const waUrl = buildWhatsAppLink('Halo Putra Glass, saya mau tanya harga cermin LED.', leadCode);

  return (
    <section
      ref={heroRef}
      id="hero"
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '16px 0 96px',
        background: `radial-gradient(640px 560px at 72% 46%, ${isHeroVisible ? cur.wall : 'rgba(20,28,51,0)'}, rgba(20,28,51,0) 70%), #141C33`,
        transition: 'background 350ms ease-out',
      }}
    >
      <div className="wrap hero-grid">
        {/* Left Column: Text & CTAs */}
        <div>
          <h1 className="h1 disp" style={{ margin: 0, color: '#FFFFFF' }}>
            cermin LED yang ukurannya kamu tentukan.
          </h1>
          <p style={{ margin: '24px 0 0', maxWidth: '30em', fontSize: '18px', lineHeight: 1.6, color: '#C9D2E0' }}>
            Dibuat per pesanan di workshop kami di Citatah, Bandung Barat. Bentuk bebas, tiga warna cahaya dalam satu sentuhan.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '30px' }}>
            <a
              className="wa"
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                trackLeadClick('hero_wa_btn');
                e.currentTarget.href = buildWhatsAppLink('Halo Putra Glass, saya mau tanya harga cermin LED.', getStoredLeadSource());
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                minHeight: '52px',
                padding: '0 24px',
                borderRadius: '12px',
                background: '#25D366',
                color: '#06301A',
                fontWeight: 600,
                fontSize: '16px',
                textDecoration: 'none',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06301A" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
              </svg>
              Tanya harga di WhatsApp
            </a>
            <a
              className="ghost"
              href="#rancang"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                minHeight: '52px',
                padding: '0 24px',
                borderRadius: '12px',
                border: '1.5px solid #BFCBD9',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '16px',
                textDecoration: 'none',
                boxSizing: 'border-box',
              }}
            >
              Hitung estimasi harga
            </a>
          </div>
          <p style={{ margin: '26px 0 0', fontSize: '14px', lineHeight: 1.5, color: '#9FB0C8', maxWidth: '34em' }}>
            Sejak Maret 2025, lebih dari 4.000 unit cermin dan kaca terkirim ke seluruh Indonesia.
          </p>
        </div>

        {/* Right Column: Interactive Capsul Mirror & Color Controls */}
        <div className="hero-mirror" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px' }}>
          <div className="mirror-box">
            {/* Background 3 Diamonds Logo Motif */}
            <div className="diamonds" aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, opacity: 0.06 }}>
              <div style={{ position: 'absolute', left: '-290px', top: '-125px', width: '250px', height: '250px', transform: 'rotate(45deg)', background: '#A6A6A6' }} />
              <div style={{ position: 'absolute', left: '-125px', top: '-125px', width: '250px', height: '250px', transform: 'rotate(45deg)', background: '#6E85B5' }} />
              <div style={{ position: 'absolute', left: '40px', top: '-125px', width: '250px', height: '250px', transform: 'rotate(45deg)', background: '#BFCBD9' }} />
            </div>

            {/* Glowing Halo Wall Bounce */}
            <div
              className="halo"
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: '-80px',
                borderRadius: '999px',
                background: isHeroVisible ? `radial-gradient(closest-side, ${cur.soft}, rgba(20,28,51,0))` : 'transparent',
                pointerEvents: 'none',
              }}
            />

            {/* Mirror Touch Button */}
            <button
              className="mirror-btn"
              type="button"
              onClick={handleNextTemp}
              aria-label="Sentuh cermin untuk mengganti warna cahaya"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                padding: 0,
                border: 'none',
                borderRadius: '999px',
                cursor: 'pointer',
                overflow: 'hidden',
                background: 'linear-gradient(165deg, #3A4560 0%, #1E2740 42%, #2A3450 70%, #1B2238 100%)',
                boxShadow: 'inset 0 0 0 2px rgba(191,203,217,0.55), inset 0 0 0 6px rgba(156,207,194,0.10)',
              }}
            >
              {/* Glass surface reflection sheen */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(118deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.07) 44%, rgba(255,255,255,0) 58%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Glowing LED Strip SVG */}
              <svg
                aria-hidden="true"
                viewBox="0 0 300 520"
                preserveAspectRatio="none"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  overflow: 'visible',
                  filter: `drop-shadow(0 0 6px ${cur.glow}) drop-shadow(0 0 16px ${cur.glow})`,
                  pointerEvents: 'none',
                }}
              >
                <rect
                  className="led-trace"
                  x="22"
                  y="22"
                  width="256"
                  height="476"
                  rx="128"
                  ry="128"
                  fill="none"
                  stroke={cur.glow}
                  strokeWidth="7"
                  pathLength="1"
                />
              </svg>

              {/* Touchscreen Icon Sensor */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: '16%',
                  transform: 'translateX(-50%)',
                  width: '22px',
                  height: '22px',
                  border: '1.5px solid rgba(255,255,255,0.85)',
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(15,21,40,0.35)',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round">
                  <path d="M12 3v8" />
                  <path d="M6.3 7.3a8 8 0 1 0 11.4 0" />
                </svg>
              </div>
            </button>
          </div>

          {/* Color Temperature Pills */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div role="group" aria-label="Warna cahaya" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {COLOR_TEMPS.map((t, idx) => {
                const isSelected = idx === activeTempIndex;
                return (
                  <button
                    key={t.id}
                    className="pill"
                    type="button"
                    onClick={() => handleSelectTemp(idx)}
                    aria-pressed={isSelected}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      minHeight: '44px',
                      padding: '0 16px',
                      borderRadius: '999px',
                      border: `1.5px solid ${isSelected ? '#9CCFC2' : 'rgba(191,203,217,0.35)'}`,
                      background: isSelected ? 'rgba(156,207,194,0.14)' : 'rgba(255,255,255,0.02)',
                      color: '#FFFFFF',
                      fontFamily: 'inherit',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '999px',
                        background: t.glow,
                        boxShadow: `0 0 8px ${t.glow}`,
                      }}
                    />
                    {t.label}
                  </button>
                );
              })}
            </div>
            <p className="mirror-hint" style={{ margin: 0, fontSize: '13px', color: '#9FB0C8' }}>
              Sentuh cerminnya juga bisa, seperti touchscreen aslinya.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
