'use client';

import React, { useState } from 'react';
import { PictureImage } from './PictureImage';

interface Hotspot {
  id: number;
  x: number; // percentage
  y: number; // percentage
  title: string;
  desc: string;
  imgName?: string;
  placeholder?: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 1,
    x: 32,
    y: 18,
    title: 'Kaca cermin 5 mm grade 1',
    desc: 'Bebas distorsi gelombang dengan lapisan perak murni yang memantulkan bayangan jernih dan awet bertahun-tahun.',
    placeholder: '[foto kaca cermin 5 mm potongan presisi]',
  },
  {
    id: 2,
    x: 84,
    y: 35,
    title: 'Bevel 10 mm dipoles rapi',
    desc: 'Setiap sudut dan tepian kaca dibevel selebar 10 mm lalu dipoles mesin hingga licin, aman disentuh dan berkilau mewah.',
    imgName: 'detail-bevel',
  },
  {
    id: 3,
    x: 76,
    y: 65,
    title: 'LED 3 warna premium',
    desc: 'Strip LED 5050 lurus dengan kerapatan tinggi terbungkus rapi di balik bingkai, menghasilkan bias cahaya merata tanpa bayang titik.',
    imgName: 'detail-led',
  },
  {
    id: 4,
    x: 48,
    y: 82,
    title: 'Touchscreen atau sensor tangan',
    desc: 'Sensor cerdas responsif langsung di permukaan kaca. Sentuh lembut untuk menyalakan, mematikan, atau mengganti warna cahaya.',
    imgName: 'detail-touch',
  },
  {
    id: 5,
    x: 20,
    y: 68,
    title: 'Versi baterai 6000 mAh Type-C',
    desc: 'Solusi estetik tanpa kabel menjuntai dan tanpa bobok dinding. Dapat diisi ulang dengan kabel Type-C HP standar.',
    placeholder: '[foto baterai 6000 mAh cas Type-C]',
  },
  {
    id: 6,
    x: 22,
    y: 38,
    title: 'Rangka belakang & gantungan siap pasang',
    desc: 'Kombinasi frame EVA foam penahan lembap dan plat gantungan kayu + besi presisi. Cermin terpasang kokoh dan rata ke dinding.',
    placeholder: '[foto frame EVA foam dan gantungan]',
  },
];

export function HotspotDetailSection() {
  const [activeSpot, setActiveSpot] = useState<Hotspot>(HOTSPOTS[1]);

  return (
    <section id="detail-produk" style={{ background: '#F3F5F8', color: '#1B2233', padding: '104px 0' }}>
      <div className="wrap">
        <h2 className="h2 disp" style={{ margin: 0, color: '#253254' }}>
          detail yang tidak terlihat di foto biasa.
        </h2>
        <p style={{ margin: '18px 0 0', maxWidth: '36em', fontSize: '18px', lineHeight: 1.6, color: '#4A5468' }}>
          Dari kaca cermin 5 mm grade 1, bevel 10 mm, hingga rangka penahan lembap di bagian belakang. Sentuh titik-titik di bawah untuk melihat detailnya.
        </p>

        <div className="hotspot-grid" style={{ marginTop: '56px' }}>
          {/* Foto Utama dengan Titik Hotspot */}
          <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', background: '#0F1528', boxShadow: '0 20px 50px rgba(20,28,51,0.12)' }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 11' }}>
              <PictureImage
                name="pasang-hotel"
                alt="Cermin LED Putra Glass tampilan depan untuk inspeksi detail"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />

              {/* Hotspot Dots */}
              {HOTSPOTS.map((spot) => {
                const isActive = spot.id === activeSpot.id;
                return (
                  <button
                    key={spot.id}
                    type="button"
                    onClick={() => setActiveSpot(spot)}
                    aria-label={`Titik ${spot.id}: ${spot.title}`}
                    style={{
                      position: 'absolute',
                      left: `${spot.x}%`,
                      top: `${spot.y}%`,
                      transform: 'translate(-50%, -50%)',
                      width: isActive ? '36px' : '28px',
                      height: isActive ? '36px' : '28px',
                      borderRadius: '999px',
                      background: isActive ? '#9CCFC2' : '#253254',
                      border: '2px solid #FFFFFF',
                      boxShadow: isActive ? '0 0 0 6px rgba(156,207,194,0.35), 0 4px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.25)',
                      color: isActive ? '#06301A' : '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      transition: 'all 220ms ease-out',
                      zIndex: 5,
                    }}
                  >
                    {spot.id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel Detail Aktif */}
          <div className="hotspot-panel" style={{ borderRadius: '18px', background: '#FFFFFF', border: '1.5px solid #D5DCE6', boxShadow: '0 12px 30px rgba(37,50,84,0.06)', display: 'flex', flexDirection: 'column', transition: 'opacity 220ms ease' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '26px',
                  height: '26px',
                  borderRadius: '999px',
                  background: 'rgba(156,207,194,0.2)',
                  color: '#275087',
                  fontSize: '13px',
                  fontWeight: 800,
                }}
              >
                {activeSpot.id}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#455268', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Titik Spesifikasi
              </span>
            </div>

            <h3 className="disp" style={{ margin: 0, fontSize: '24px', color: '#253254' }}>
              {activeSpot.title}
            </h3>

            <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.6, color: '#4A5468' }}>
              {activeSpot.desc}
            </p>

            {/* Foto Close-up atau Placeholder Terlabel */}
            <div style={{ marginTop: '8px', borderRadius: '12px', overflow: 'hidden', background: '#F3F5F8', border: '1px solid #E2E8F0' }}>
              {activeSpot.imgName ? (
                <div style={{ position: 'relative', width: '100%', height: '180px' }}>
                  <PictureImage
                    name={activeSpot.imgName}
                    alt={activeSpot.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    height: '140px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                    textAlign: 'center',
                    color: '#8A97A8',
                    fontSize: '14px',
                    fontStyle: 'italic',
                  }}
                >
                  {activeSpot.placeholder}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
