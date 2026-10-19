'use client';

import React, { useState } from 'react';
import { PictureImage } from './PictureImage';
import { DETAIL_ANIMASI_SVGS } from '../data/detail-animations';
import { Reveal } from './Reveal';
import styles from './HotspotDetailSection.module.css';

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
    <section id="detail" className={styles.section}>
      <div className="wrap">
        <Reveal trackSection="detail">
          <h2 className="h2 disp" style={{ margin: 0, color: 'var(--navy)' }}>
            detail yang tidak terlihat di foto biasa.
          </h2>
          <p style={{ margin: 'var(--space-4) 0 0', maxWidth: '38em', fontSize: 'var(--font-body-lg)', lineHeight: 'var(--line-height-normal)', color: '#4A5468' }}>
            Sentuh titik di foto. Tiap titik membuka bagian cermin yang biasanya tersembunyi.
          </p>
        </Reveal>

        <div className={styles.layout}>
          {/* Kolom Kiri: Foto Utama + Hotspots + Tab Bar */}
          <Reveal>
            <div>
              <div className={styles.baseWrapper}>
                <PictureImage
                  name="detail-base"
                  alt="Foto cermin LED Putra Glass terpasang di dinding wastafel untuk eksplorasi detail"
                  sizes="(max-width: 860px) 100vw, 680px"
                  className={styles.baseImage}
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
                      className={styles.hotspotBtn}
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                      }}
                    >
                      <span className={`${styles.hotspotCircle} ${isActive ? styles.active : ''}`}>
                        {item.id}
                        {isActive && <span className={styles.hotspotPulse} aria-hidden="true" />}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Pill Tabs 1 - 6: muat satu baris di desktop, geser di HP */}
              <div className={styles.tabsBar} role="tablist" aria-label="Daftar titik detail">
                {DETAIL_ITEMS.map((item, idx) => {
                  const isActive = idx === activeIdx;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveIdx(idx)}
                      className={`${styles.tabBtn} ${isActive ? styles.active : ''}`}
                    >
                      <span className={styles.tabNum}>{item.id}</span>
                      <span>{item.tabLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Kolom Kanan: Detail Card (Animasi SVG 4:3 Inline + Konten + Prev/Next) */}
          <Reveal variant="scale" delay={140}>
            <div className={styles.card}>
              {/* Media Animasi SVG 4:3 (Inline rendering dengan key agar restart saat dibuka) */}
              <div className={styles.mediaWrap}>
                <div
                  key={activeIdx}
                  dangerouslySetInnerHTML={{ __html: DETAIL_ANIMASI_SVGS[activeIdx] }}
                  style={{ width: '100%', height: '100%', display: 'flex' }}
                />

                {/* Label Kecil Pojok Kiri Atas: "Animasi" */}
                <span className={styles.animationLabel}>
                  Animasi
                </span>
              </div>

              {/* Teks Informasi */}
              <div className={styles.content}>
                <span className={styles.counter}>
                  {cur.id} dari {DETAIL_ITEMS.length}
                </span>
                <h3 className={`disp ${styles.title}`}>
                  {cur.title}
                </h3>
                <p className={styles.description}>
                  {cur.desc}
                </p>
              </div>

              {/* Tombol Sebelumnya & Berikutnya */}
              <div className={styles.navControls}>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Titik detail sebelumnya"
                  className={styles.navBtn}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Titik detail berikutnya"
                  className={styles.navBtn}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
