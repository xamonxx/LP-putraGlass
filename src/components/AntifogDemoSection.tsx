'use client';

import React, { useState } from 'react';
import { PictureImage } from './PictureImage';

export function AntifogDemoSection() {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 - 100

  return (
    <section id="antifog" style={{ background: '#141C33', color: '#FFFFFF', padding: '96px 0' }}>
      <div className="wrap">
        <div className="antifog-layout">
          {/* Kolom Kiri: Teks & CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 className="h2 disp" style={{ margin: 0, color: '#FFFFFF', lineHeight: 1.05 }}>
              tetap jernih setelah mandi air panas.
            </h2>
            <p style={{ margin: 0, fontSize: '17px', lineHeight: 1.6, color: '#C9D2E0', maxWidth: '32em' }}>
              Pad pemanas tipis di balik kaca menjaga permukaannya tetap hangat, jadi uap air tidak sempat mengembun. Kamu langsung bisa bercermin selesai mandi.
            </p>

            <ul style={{ listStyle: 'none', margin: '4px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#E2E8F0' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '999px',
                    background: '#9CCFC2',
                    boxShadow: '0 0 8px #9CCFC2',
                    flexShrink: 0,
                  }}
                />
                Bisa ditambahkan ke cermin LED custom.
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#E2E8F0' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '999px',
                    background: '#9CCFC2',
                    boxShadow: '0 0 8px #9CCFC2',
                    flexShrink: 0,
                  }}
                />
                Pilih &quot;Tambah antifog&quot; di langkah 03 saat merancang.
              </li>
            </ul>

            <div style={{ marginTop: '12px' }}>
              <a
                href="#rancang"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '48px',
                  padding: '0 24px',
                  borderRadius: '12px',
                  border: '1.5px solid rgba(255, 255, 255, 0.55)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '15px',
                  textDecoration: 'none',
                  transition: 'all 200ms ease',
                }}
              >
                Rancang dengan antifog
              </a>
            </div>
          </div>

          {/* Kolom Kanan: Slider 5:4 (Maks 640 px) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div
              className="slider-frame"
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '640px',
                aspectRatio: '5 / 4',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 24px 70px rgba(0, 0, 0, 0.55)',
                border: '1.5px solid #26314F',
                userSelect: 'none',
              }}
            >
              {/* Layer Bawah: antifog-dengan (Render Katalog Asli) */}
              <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                <PictureImage
                  name="antifog-dengan"
                  alt="Kaca cermin LED Putra Glass jernih dengan antifog dari render katalog"
                  sizes="(max-width: 860px) calc(100vw - 40px), 640px"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>

              {/* Layer Atas: antifog-tanpa (Simulasi Kaca Berembun) dengan Clip-Path */}
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
                  name="antifog-tanpa"
                  alt="Simulasi kaca cermin berembun tanpa antifog dari render katalog"
                  sizes="(max-width: 860px) calc(100vw - 40px), 640px"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>

              {/* Label Badge Kiri & Kanan */}
              <span
                style={{
                  position: 'absolute',
                  left: '16px',
                  bottom: '16px',
                  background: 'rgba(20, 28, 51, 0.82)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  color: '#FFFFFF',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  pointerEvents: 'none',
                  zIndex: 15,
                }}
              >
                Tanpa antifog
              </span>

              <span
                style={{
                  position: 'absolute',
                  right: '16px',
                  bottom: '16px',
                  background: 'rgba(20, 28, 51, 0.82)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  color: '#9CCFC2',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: '1px solid rgba(156, 207, 194, 0.35)',
                  pointerEvents: 'none',
                  zIndex: 15,
                }}
              >
                Dengan antifog
              </span>

              {/* Garis Pemisah Putih Vertikal */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${sliderPos}%`,
                  width: '2px',
                  background: '#FFFFFF',
                  boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
                  pointerEvents: 'none',
                  zIndex: 20,
                }}
              />

              {/* Knob Lingkaran Putih 48 px */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: `${sliderPos}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '48px',
                  height: '48px',
                  borderRadius: '999px',
                  background: '#FFFFFF',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.45), 0 0 0 3px rgba(156, 207, 194, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  padding: '0 9px',
                  pointerEvents: 'none',
                  zIndex: 22,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#253254" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#253254" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>

              {/* Transparent Range Input Covering the Whole Photo */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                aria-label="Penggeser perbandingan cermin dengan dan tanpa antifog"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'ew-resize',
                  zIndex: 30,
                  margin: 0,
                }}
              />
            </div>

            <p style={{ margin: '14px 0 0', fontSize: '13px', color: '#9FB0C8', textAlign: 'center', lineHeight: 1.5 }}>
              Geser garisnya. Kiri: simulasi kaca berembun. Kanan: kaca dengan antifog. Gambar dari render katalog Putra Glass.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .antifog-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
          gap: 56px;
          align-items: center;
        }

        @media (max-width: 860px) {
          .antifog-layout {
            grid-template-columns: minmax(0, 1fr) !important;
            gap: 24px !important;
          }

          .slider-frame {
            aspect-ratio: 5 / 4 !important;
            border-radius: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
