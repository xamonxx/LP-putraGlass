'use client';

import React, { useState } from 'react';
import { PictureImage } from './PictureImage';
import { DETAIL_ANIMASI_SVGS } from '../data/detail-animations';

interface HotspotItem {
  id: number;
  x: number; // percentage from left
  y: number; // percentage from top
  tabLabel: string;
  title: string;
  desc: string;
}

const DETAIL_ITEMS: HotspotItem[] = [
  {
    id: 1,
    x: 22.5,
    y: 55,
    tabLabel: 'Kaca',
    title: 'Kaca cermin 5 mm grade 1',
    desc: 'Kaca cermin grade 1 setebal 5 mm, dipotong presisi sesuai ukuranmu. Bayangannya lurus, tidak bergelombang seperti cermin tipis.',
  },
  {
    id: 2,
    x: 86,
    y: 29,
    tabLabel: 'Bevel',
    title: 'Bevel 10 mm, dipoles halus',
    desc: 'Tepi kaca dibevel selebar 10 mm lalu dipoles sampai halus dan berkilau. Aman disentuh dan rapi dilihat dari samping.',
  },
  {
    id: 3,
    x: 53.75,
    y: 81,
    tabLabel: 'LED',
    title: 'LED 3 warna, menyala rata',
    desc: 'Cahaya mengikuti bentuk cermin tanpa titik-titik. Hangat, natural, atau putih, ganti dengan satu sentuhan.',
  },
  {
    id: 4,
    x: 41.25,
    y: 69,
    tabLabel: 'Touchscreen',
    title: 'Touchscreen atau sensor tangan',
    desc: 'Sentuh sekali untuk nyala, sentuh lagi untuk ganti warna. Mau tanpa colokan? Pilih sensor tangan dengan baterai 6000 mAh, cas Type-C.',
  },
  {
    id: 5,
    x: 75,
    y: 45,
    tabLabel: 'Antifog',
    title: 'Antifog, tidak berembun',
    desc: 'Pad pemanas tipis di balik kaca menjaga permukaan tetap jernih setelah mandi air panas. Lihat bedanya di bagian berikutnya.',
  },
  {
    id: 6,
    x: 10,
    y: 40,
    tabLabel: 'Belakang',
    title: 'Siap gantung dari pabrik',
    desc: 'Di belakang kaca ada frame EVA foam dan gantungan kayu plus besi yang sudah terpasang. Sampai di rumah, cermin tinggal digantung.',
  },
];

export function HotspotDetailSection() {
  const [activeIdx, setActiveIdx] = useState<number>(0);

  const cur = DETAIL_ITEMS[activeIdx];

  const handlePrev = () => {
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : DETAIL_ITEMS.length - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev < DETAIL_ITEMS.length - 1 ? prev + 1 : 0));
  };

  return (
    <section id="detail" style={{ background: '#F3F5F8', color: '#1B2233', padding: '96px 0' }}>
      <div className="wrap">
        <h2 className="h2 disp" style={{ margin: 0, color: '#253254' }}>
          detail yang tidak terlihat di foto biasa.
        </h2>
        <p style={{ margin: '16px 0 0', maxWidth: '38em', fontSize: '18px', lineHeight: 1.6, color: '#4A5468' }}>
          Sentuh titik di foto. Tiap titik membuka bagian cermin yang biasanya tersembunyi.
        </p>

        <div className="detail-layout" style={{ marginTop: '48px' }}>
          {/* Kolom Kiri: Foto Utama (16:9 utuh, tanpa crop) + Hotspots + Tab Bar */}
          <div className="detail-base-col">
            <div className="detail-base-wrapper">
              <PictureImage
                name="detail-base"
                alt="Foto cermin LED Putra Glass terpasang di dinding wastafel untuk eksplorasi detail"
                sizes="(max-width: 860px) 100vw, 680px"
                style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', display: 'block' }}
              />

              {/* 6 Interactive Hotspot Dots */}
              {DETAIL_ITEMS.map((item, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    aria-pressed={isActive}
                    aria-label={`Titik ${item.id}: ${item.tabLabel}`}
                    style={{
                      position: 'absolute',
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      transform: 'translate(-50%, -50%)',
                      width: '44px',
                      height: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'transparent',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      zIndex: 10,
                    }}
                  >
                    <span className={`hotspot-circle ${isActive ? 'active' : ''}`}>
                      {item.id}
                      {isActive && <span className="hotspot-pulse" aria-hidden="true" />}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Pill Tabs 1 - 6: muat satu baris di desktop, geser di HP */}
            <div className="detail-tabs-bar" role="tablist" aria-label="Daftar titik detail">
              {DETAIL_ITEMS.map((item, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveIdx(idx)}
                    className={`detail-tab-btn ${isActive ? 'active' : ''}`}
                  >
                    <span className="tab-num">{item.id}</span>
                    <span>{item.tabLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Kolom Kanan: Detail Card (Animasi SVG 4:3 Inline + Konten + Prev/Next) */}
          <div className="detail-card-col">
            <div className="detail-info-card">
              {/* Media Animasi SVG 4:3 (Inline rendering dengan key agar restart saat dibuka) */}
              <div className="detail-media-wrap">
                <div
                  key={activeIdx}
                  dangerouslySetInnerHTML={{ __html: DETAIL_ANIMASI_SVGS[activeIdx] }}
                  style={{ width: '100%', height: '100%', display: 'flex' }}
                />

                {/* Label Kecil Pojok Kiri Atas: "Animasi" */}
                <span
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '12px',
                    background: 'rgba(20, 28, 51, 0.78)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: '6px',
                    letterSpacing: '0.02em',
                    pointerEvents: 'none',
                    zIndex: 5,
                  }}
                >
                  Animasi
                </span>
              </div>

              {/* Teks Informasi */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#275087' }}>
                  {cur.id} dari {DETAIL_ITEMS.length}
                </span>
                <h3 className="disp" style={{ margin: 0, fontSize: '24px', color: '#253254', lineHeight: 1.2 }}>
                  {cur.title}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '15px', lineHeight: 1.6, color: '#4A5468' }}>
                  {cur.desc}
                </p>
              </div>

              {/* Tombol Sebelumnya & Berikutnya */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Titik detail sebelumnya"
                  className="nav-arrow-btn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Titik detail berikutnya"
                  className="nav-arrow-btn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .detail-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
          gap: 40px;
          align-items: start;
        }

        .detail-base-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: 18px;
          overflow: hidden;
          background: #0F1528;
          box-shadow: 0 16px 40px rgba(20, 28, 51, 0.12);
        }

        .detail-info-card {
          background: #FFFFFF;
          border-radius: 20px;
          border: 1.5px solid #E2E8F0;
          padding: 24px;
          box-shadow: 0 16px 40px rgba(20, 28, 51, 0.06);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .detail-media-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: 14px;
          overflow: hidden;
          background: #111830;
        }

        .detail-media-wrap :global(svg) {
          width: 100%;
          height: 100%;
          display: block;
        }

        .hotspot-circle {
          position: relative;
          width: 30px;
          height: 30px;
          border-radius: 999px;
          background: #253254;
          border: 2px solid rgba(255, 255, 255, 0.95);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 200ms ease, color 200ms ease;
        }

        .hotspot-circle.active {
          background: #9CCFC2;
          color: #06301A;
          border-color: #FFFFFF;
        }

        .hotspot-pulse {
          position: absolute;
          inset: -6px;
          border-radius: 999px;
          border: 2px solid #9CCFC2;
          animation: pulse-ring 1.8s cubic-bezier(0.24, 0, 0.38, 1) infinite;
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(0.9);
            opacity: 0.9;
          }
          70% {
            transform: scale(1.5);
            opacity: 0;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hotspot-pulse {
            animation: none !important;
            display: none !important;
          }
        }

        .detail-tabs-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          flex-wrap: nowrap;
        }

        .detail-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-height: 40px;
          padding: 0 16px;
          border-radius: 999px;
          border: 1.5px solid #D5DCE6;
          background: #FFFFFF;
          color: #253254;
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 180ms ease;
        }

        .detail-tab-btn.active {
          background: #141C33;
          border-color: #141C33;
          color: #FFFFFF;
        }

        .tab-num {
          font-size: 12px;
          font-weight: 800;
          opacity: 0.75;
        }

        .nav-arrow-btn {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          border: 1.5px solid #D5DCE6;
          background: #FFFFFF;
          color: #253254;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: border-color 150ms ease, background 150ms ease;
        }

        .nav-arrow-btn:hover {
          border-color: #275087;
          background: #F8FAFC;
        }

        @media (max-width: 860px) {
          .detail-layout {
            grid-template-columns: minmax(0, 1fr) !important;
            gap: 20px !important;
          }

          .detail-base-wrapper {
            border-radius: 0 !important;
            margin-left: -20px !important;
            margin-right: -20px !important;
            width: calc(100% + 40px) !important;
          }

          .detail-info-card {
            padding: 16px !important;
            gap: 12px !important;
          }

          .detail-info-card h3.disp {
            font-size: 20px !important;
          }

          .detail-info-card p {
            font-size: 14px !important;
            line-height: 1.5 !important;
          }

          .detail-tabs-bar {
            overflow-x: auto;
            scroll-padding-inline: 16px;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 4px;
            margin-top: 14px !important;
          }

          .detail-tabs-bar::-webkit-scrollbar {
            display: none;
          }

          .detail-tab-btn {
            flex-shrink: 0;
            padding: 0 14px;
            font-size: 13px;
          }
        }
      `}</style>
    </section>
  );
}
