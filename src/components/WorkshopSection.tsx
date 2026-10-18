import React from 'react';
import { MAPS_URL } from '../lib/constants';
import { PictureImage } from './PictureImage';

export function WorkshopSection() {
  return (
    <section id="workshop" style={{ background: '#141C33', color: '#FFFFFF', padding: '104px 0' }}>
      <div className="wrap">
        {/* Large Hero Card */}
        <div className="ws-hero">
          <PictureImage
            name="pasang-hotel"
            alt="Cermin LED panjang hasil workshop Putra Glass terpasang di area wastafel komersial"
            sizes="(max-width: 860px) calc(100vw - 40px), 1144px"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(10,14,28,0.94) 0%, rgba(10,14,28,0.62) 42%, rgba(10,14,28,0.12) 100%), linear-gradient(to right, rgba(10,14,28,0.55), rgba(10,14,28,0) 60%)',
            }}
          />
          <div className="ws-content" style={{ position: 'relative', padding: '56px', maxWidth: '820px', zIndex: 2 }}>
            <p style={{ margin: 0, display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 600, color: '#FFE9C7' }}>
              <span
                aria-hidden="true"
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '999px',
                  background: '#FFC98A',
                  boxShadow: '0 0 10px #FFC98A, 0 0 22px #FFC98A',
                }}
              />
              Workshop Citatah, Bandung Barat
            </p>
            <h2 className="ws-h disp" style={{ margin: '16px 0 0', lineHeight: 0.98 }}>
              dipotong, dipoles, dan dinyalakan di Citatah.
            </h2>
            <p style={{ margin: '20px 0 0', maxWidth: '34em', fontSize: '18px', lineHeight: 1.6, color: '#D5DCE8' }}>
              Setiap cermin dikerjakan dan diuji nyala di workshop kami sendiri, lalu dikemas paking kayu bertulang untuk kiriman luar kota.
            </p>
            <ul className="specs" style={{ listStyle: 'none', margin: '32px 0 0', padding: 0 }}>
              <li>
                <span className="disp" style={{ fontSize: '30px' }}>5 mm</span>
                <span style={{ fontSize: '13px', color: '#B7C3D6' }}>kaca cermin grade 1</span>
              </li>
              <li>
                <span className="disp" style={{ fontSize: '30px' }}>10 mm</span>
                <span style={{ fontSize: '13px', color: '#B7C3D6' }}>bevel dipoles rapi</span>
              </li>
              <li>
                <span className="disp" style={{ fontSize: '30px' }}>3 warna</span>
                <span style={{ fontSize: '13px', color: '#B7C3D6' }}>LED 5050 lurus</span>
              </li>
              <li>
                <span className="disp" style={{ fontSize: '30px' }}>4.000+</span>
                <span style={{ fontSize: '13px', color: '#B7C3D6' }}>unit terkirim sejak 2025</span>
              </li>
            </ul>
            <a
              className="ghost"
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '32px',
                minHeight: '48px',
                padding: '0 20px',
                borderRadius: '12px',
                border: '1.5px solid rgba(255,255,255,0.55)',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '15px',
                textDecoration: 'none',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                background: 'rgba(255,255,255,0.06)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
                <circle cx="12" cy="9.5" r="2.5" />
              </svg>
              Lihat lokasi workshop
            </a>
          </div>
        </div>

        {/* 4 Process Cards connected by continuous glowing line */}
        <h3 className="disp" style={{ margin: '88px 0 0', fontSize: '30px' }}>
          dari lembar kaca sampai menyala di tempatmu
        </h3>
        <ol className="proc" style={{ listStyle: 'none', margin: '40px 0 0', padding: '26px 0 0' }}>
          <li className="step">
            <span className="step-dot" aria-hidden="true" />
            <div className="step-img">
              <PictureImage
                name="workshop-poles"
                alt="Pekerja memoles tepi kaca cermin"
                sizes="(max-width: 860px) 72vw, 280px"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <p className="disp" style={{ margin: '18px 0 0', fontSize: '20px' }}>
              1. Potong dan bevel
            </p>
            <p style={{ margin: '8px 0 0', fontSize: '15px', lineHeight: 1.55, color: '#B7C3D6' }}>
              Kaca dipotong sesuai ukuranmu, tepinya dibevel 10 mm lalu dipoles mesin.
            </p>
          </li>

          <li className="step">
            <span className="step-dot" aria-hidden="true" />
            <div className="step-img">
              <PictureImage
                name="proses-led"
                alt="Strip LED menyala di cermin persegi yang sedang dirakit"
                sizes="(max-width: 860px) 72vw, 280px"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <p className="disp" style={{ margin: '18px 0 0', fontSize: '20px' }}>
              2. Pasang LED
            </p>
            <p style={{ margin: '8px 0 0', fontSize: '15px', lineHeight: 1.55, color: '#B7C3D6' }}>
              Strip LED dipasang lurus mengikuti bentuk, lengkap dengan touchscreen atau sensor.
            </p>
          </li>

          <li className="step">
            <span className="step-dot" aria-hidden="true" />
            <div className="step-img">
              <PictureImage
                name="workshop-led"
                alt="Uji nyala cermin bentuk leaf pada malam hari"
                sizes="(max-width: 860px) 72vw, 280px"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <p className="disp" style={{ margin: '18px 0 0', fontSize: '20px' }}>
              3. Uji nyala
            </p>
            <p style={{ margin: '8px 0 0', fontSize: '15px', lineHeight: 1.55, color: '#B7C3D6' }}>
              Setiap cermin dinyalakan dan dicek tiga warnanya sebelum dikemas.
            </p>
          </li>

          <li className="step">
            <span className="step-dot" aria-hidden="true" />
            <div className="step-img">
              <PictureImage
                name="pasang-cafe"
                alt="Cermin LED kapsul terpasang di dinding kafe"
                sizes="(max-width: 860px) 72vw, 280px"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <p className="disp" style={{ margin: '18px 0 0', fontSize: '20px' }}>
              4. Terpasang di tempatmu
            </p>
            <p style={{ margin: '8px 0 0', fontSize: '15px', lineHeight: 1.55, color: '#B7C3D6' }}>
              Dikirim dengan paking kayu bertulang, atau ambil sendiri di workshop.
            </p>
          </li>
        </ol>
      </div>
    </section>
  );
}
