'use client';

import React, { useState, useRef, useCallback } from 'react';
import { PictureImage } from './PictureImage';

export function AntifogDemoSection() {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 - 100
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons === 1) {
      updatePosition(e.clientX);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSliderPos((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPos((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <section id="antifog" style={{ background: '#141C33', color: '#FFFFFF', padding: '104px 0' }}>
      <div className="wrap">
        <h2 className="h2 disp" style={{ margin: 0, color: '#FFFFFF' }}>
          tetap jernih setelah mandi air panas.
        </h2>
        <p style={{ margin: '18px 0 0', maxWidth: '36em', fontSize: '18px', lineHeight: 1.6, color: '#C9D2E0' }}>
          Geser untuk melihat bedanya setelah mandi air panas. Pad pemanas tipis di balik cermin menguapkan embun dalam hitungan detik.
        </p>

        {/* Interactive Before/After Split Slider using hardware-accelerated clip-path */}
        <div style={{ marginTop: '56px', maxWidth: '820px', marginInline: 'auto' }}>
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16 / 10',
              borderRadius: '20px',
              overflow: 'hidden',
              cursor: 'ew-resize',
              userSelect: 'none',
              touchAction: 'none',
              boxShadow: '0 24px 70px rgba(0, 0, 0, 0.45)',
              border: '1.5px solid #26314F',
            }}
          >
            {/* Sisi Bersih (Clean - Layer Bawah) */}
            <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <PictureImage
                name="pasang-capsul"
                alt="Cermin LED Putra Glass jernih bebas embun dengan pad antifog"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <span
                style={{
                  position: 'absolute',
                  right: '24px',
                  bottom: '24px',
                  background: 'rgba(20, 28, 51, 0.75)',
                  backdropFilter: 'blur(8px)',
                  color: '#9CCFC2',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: '1px solid rgba(156,207,194,0.3)',
                }}
              >
                Dengan Antifog
              </span>
            </div>

            {/* Sisi Berembun (Foggy - Layer Atas dengan Clip-path) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                WebkitClipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
              }}
            >
              <PictureImage
                name="pasang-capsul"
                alt="Cermin berembun tanpa antifog"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  filter: 'blur(6px) brightness(0.9)',
                }}
              />
              {/* Steam / Fog Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(ellipse at center, rgba(235, 243, 255, 0.45) 0%, rgba(200, 215, 240, 0.35) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    background: 'rgba(20,28,51,0.8)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#BFCBD9',
                    letterSpacing: '0.04em',
                  }}
                >
                  [foto antifog berembun]
                </span>
              </div>
              <span
                style={{
                  position: 'absolute',
                  left: '24px',
                  bottom: '24px',
                  background: 'rgba(20, 28, 51, 0.75)',
                  backdropFilter: 'blur(8px)',
                  color: '#FFC98A',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: '1px solid rgba(255,201,138,0.3)',
                }}
              >
                Tanpa Antifog
              </span>
            </div>

            {/* Garis Pemisah (Divider Line) */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${sliderPos}%`,
                width: '2px',
                background: '#FFFFFF',
                boxShadow: '0 0 8px rgba(0,0,0,0.5)',
                pointerEvents: 'none',
              }}
            />

            {/* Slider Handle Button */}
            <div
              tabIndex={0}
              role="slider"
              aria-label="Penggeser sebelum dan sesudah antifog"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(sliderPos)}
              onKeyDown={handleKeyDown}
              style={{
                position: 'absolute',
                top: '50%',
                left: `${sliderPos}%`,
                transform: 'translate(-50%, -50%)',
                width: '44px',
                height: '44px',
                borderRadius: '999px',
                background: '#FFFFFF',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4), 0 0 0 3px rgba(156,207,194,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                padding: '0 8px',
                cursor: 'ew-resize',
                zIndex: 10,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#253254" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#253254" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>

          <p style={{ margin: '18px 0 0', textAlign: 'center', fontSize: '14px', color: '#9FB0C8' }}>
            Geser lingkaran putih ke kiri atau kanan untuk membandingkan.
          </p>
        </div>
      </div>
    </section>
  );
}
