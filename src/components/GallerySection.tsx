'use client';

import React, { useState } from 'react';
import { PictureImage } from './PictureImage';

interface GalleryItem {
  id: string;
  category: 'kamar-mandi' | 'kamar-tidur' | 'salon-barber' | 'hotel-kafe';
  title: string;
  location: string;
  imgName: string;
  frameRadius: string;
  shapeName: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: '1',
    category: 'hotel-kafe',
    title: 'Cermin LED Panjang Area Komersial',
    location: 'Area Wastafel Hotel, Bandung',
    imgName: 'pasang-hotel',
    frameRadius: '16px',
    shapeName: 'Wide Rectangle',
  },
  {
    id: '2',
    category: 'hotel-kafe',
    title: 'Cermin LED Kapsul Dinding Kafe',
    location: 'Kafe Sentosa, Bandung Barat',
    imgName: 'pasang-cafe',
    frameRadius: '999px',
    shapeName: 'Capsul',
  },
  {
    id: '3',
    category: 'kamar-mandi',
    title: 'Cermin Kapsul Wastafel Kayu',
    location: 'Kamar Mandi Utama Rumah Tinggal, Jakarta Selatan',
    imgName: 'pasang-capsul',
    frameRadius: '999px',
    shapeName: 'Capsul',
  },
  {
    id: '4',
    category: 'salon-barber',
    title: 'Cermin Asimetris Uji Nyala Workshop',
    location: 'Studio Salon & Barbershop, Tangerang',
    imgName: 'workshop-led',
    frameRadius: '24px 60px 24px 60px',
    shapeName: 'Leaf',
  },
];

const FILTERS = [
  { id: 'semua', label: 'Semua' },
  { id: 'kamar-mandi', label: 'Kamar Mandi' },
  { id: 'kamar-tidur', label: 'Kamar Tidur' },
  { id: 'salon-barber', label: 'Salon & Barbershop' },
  { id: 'hotel-kafe', label: 'Hotel & Kafe' },
] as const;

export function GallerySection() {
  const [activeFilter, setActiveFilter] = useState<string>('semua');

  const filteredItems = activeFilter === 'semua'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeFilter);

  return (
    <section id="galeri" style={{ background: '#F3F5F8', color: '#1B2233', padding: '104px 0' }}>
      <div className="wrap">
        <h2 className="h2 disp" style={{ margin: 0, color: '#253254' }}>
          hasil pemasangan asli.
        </h2>
        <p style={{ margin: '18px 0 0', maxWidth: '36em', fontSize: '18px', lineHeight: 1.6, color: '#4A5468' }}>
          Foto asli cermin terpasang dari portofolio klien dan workshop kami di Citatah. Bentuk bingkai foto mengikuti bentuk potongan cermin aslinya.
        </p>

        {/* Filter Buttons */}
        <div
          role="group"
          aria-label="Filter galeri"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '40px' }}
        >
          {FILTERS.map((f) => {
            const isSel = f.id === activeFilter;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                aria-pressed={isSel}
                style={{
                  minHeight: '42px',
                  padding: '0 18px',
                  borderRadius: '999px',
                  border: `1.5px solid ${isSel ? '#253254' : '#D0D8E4'}`,
                  background: isSel ? '#253254' : '#FFFFFF',
                  color: isSel ? '#FFFFFF' : '#4A5468',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="gallery-card">
              <div className="gallery-card-img" style={{ width: '100%', borderRadius: item.frameRadius, overflow: 'hidden', background: '#0F1528', boxShadow: '0 8px 24px rgba(20,28,51,0.08)' }}>
                <PictureImage
                  name={item.imgName}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>

              <div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#275087', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Bentuk: {item.shapeName}
                </span>
                <h3 className="disp" style={{ margin: '4px 0 0', fontSize: '18px', color: '#253254' }}>
                  {item.title}
                </h3>
                <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#455268' }}>
                  {item.location}
                </p>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div style={{ padding: '40px 0', gridColumn: '1 / -1', color: '#455268', fontStyle: 'italic' }}>
              [Foto pemasangan untuk kategori ini sedang disiapkan dari dokumentasi proyek terbaru]
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
