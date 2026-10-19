'use client';

import React, { useState, useEffect } from 'react';
import {
  LeadSourceCode,
  buildWhatsAppLink,
  getStoredLeadSource,
  trackLeadClick,
} from '../lib/tracking';
import { Reveal } from './Reveal';

const TIMELINE_STEPS = [
  {
    num: '02',
    title: 'DP 50%',
    badge: 'Transfer BCA',
    desc: 'Transfer DP, pesananmu langsung masuk antrean produksi.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Produksi',
    badge: '1–5 hari kerja',
    desc: 'Dipotong, dibevel, dan dirakit di workshop Citatah. Kamu dapat foto dan video saat cerminnya dikerjakan.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <line x1="12" y1="2" x2="12" y2="6" />
        <line x1="12" y1="18" x2="12" y2="22" />
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
        <line x1="2" y1="12" x2="6" y2="12" />
        <line x1="18" y1="12" x2="22" y2="12" />
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Pelunasan dan kirim',
    badge: 'Foto packing + resi',
    desc: 'Foto produk dan packing dikirim dulu, baru pelunasan. Luar kota dikemas packing kayu.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    num: '05',
    title: 'Pasang dan pakai',
    badge: 'Garansi aktif',
    desc: 'Garansi aktif sejak barang sampai. Simpan video unboxing untuk klaim.',
    isSuccess: true,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06301A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
];

export function HowToOrderSection() {
  const [leadCode, setLeadCode] = useState<LeadSourceCode>('LP-LANGSUNG');

  useEffect(() => {
    setLeadCode(getStoredLeadSource());
  }, []);

  const waMsg = 'Halo Putra Glass, saya mau konsultasi cermin LED.';
  const waHref = buildWhatsAppLink(waMsg, leadCode);

  const handleSendWA = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackLeadClick('cara_pesan_konsultasi');
    e.currentTarget.href = buildWhatsAppLink(waMsg, getStoredLeadSource());
  };

  return (
    <section id="cara-pesan" style={{ background: '#F3F5F8', color: '#1B2233', padding: '96px 0' }}>
      <div className="wrap">
        <Reveal trackSection="cara-pesan">
          <h2 className="h2 disp" style={{ margin: 0, color: '#253254' }}>
            cara pesan
          </h2>
          <p style={{ margin: '14px 0 0', maxWidth: '38em', fontSize: '18px', lineHeight: 1.6, color: '#4A5468' }}>
            Dari chat pertama sampai cermin terpasang. Di setiap tahap kamu dapat kabar dan fotonya.
          </p>
        </Reveal>

        <div className="cara-pesan-layout" style={{ marginTop: '48px' }}>
          {/* Kolom Kiri: Kartu Navy 01 MULAI DI SINI */}
          <Reveal>
          <div
            className="card-mulai"
            style={{
              background: '#141C33',
              borderRadius: '20px',
              padding: '36px',
              border: '1.5px solid rgba(156, 207, 194, 0.25)',
              boxShadow: '0 20px 50px rgba(20, 28, 51, 0.22)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            {/* Badge 01 MULAI DI SINI */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: '#9CCFC2',
                  color: '#06301A',
                  fontSize: '12px',
                  fontWeight: 800,
                }}
              >
                01
              </span>
              <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', color: '#9CCFC2', textTransform: 'uppercase' }}>
                MULAI DI SINI
              </span>
            </div>

            <h3 className="disp" style={{ margin: 0, fontSize: '32px', color: '#FFFFFF', lineHeight: 1.15 }}>
              konsultasi gratis di WhatsApp.
            </h3>

            <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.65, color: '#D5DCE8' }}>
              Kirim ukuran dinding, foto ruangan, atau rancangan dari website. Admin bantu pilih bentuk, ukuran, dan lampu, lalu kirim harga final dan PDF penawaran.
            </p>

            {/* 3 Poin Centang */}
            <ul style={{ listStyle: 'none', margin: '6px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#BFCBD9', lineHeight: 1.5 }}>
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '999px',
                    background: 'rgba(156, 207, 194, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9CCFC2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Bisa tanya dulu, belum ada kewajiban beli
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#BFCBD9', lineHeight: 1.5 }}>
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '999px',
                    background: 'rgba(156, 207, 194, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9CCFC2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Harga final dan PDF penawaran resmi
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#BFCBD9', lineHeight: 1.5 }}>
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '999px',
                    background: 'rgba(156, 207, 194, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9CCFC2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Saran ukuran sesuai dinding dan wastafelmu
              </li>
            </ul>

            {/* Tombol Hijau Mulai Konsultasi */}
            <div style={{ marginTop: '8px' }}>
              <a
                className="wa"
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleSendWA}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  height: '52px',
                  padding: '0 24px',
                  borderRadius: '12px',
                  background: '#25D366',
                  color: '#06301A',
                  fontWeight: 700,
                  fontSize: '16px',
                  textDecoration: 'none',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06301A" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
                </svg>
                Mulai konsultasi
              </a>
            </div>
          </div>
          </Reveal>

          {/* Kolom Kanan: Timeline Vertikal 02 - 05 */}
          <div className="timeline-container">
            {/* Garis LED Penghubung Vertikal */}
            <div className="timeline-line" aria-hidden="true" />

            <div className="timeline-list">
              {TIMELINE_STEPS.map((step, idx) => (
                <Reveal key={step.num} delay={idx * 110}>
                <div className="timeline-row">
                  {/* Node Berikon */}
                  <div className={`timeline-node ${step.isSuccess ? 'success-node' : ''}`}>
                    {step.icon}
                  </div>

                  {/* Kartu Putih */}
                  <div className="timeline-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="disp" style={{ fontSize: '18px', color: '#253254' }}>
                        {step.num} {step.title}
                      </span>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          padding: '3px 10px',
                          borderRadius: '6px',
                          background: step.isSuccess ? 'rgba(156,207,194,0.2)' : 'rgba(39,80,135,0.08)',
                          color: step.isSuccess ? '#166534' : '#275087',
                        }}
                      >
                        {step.badge}
                      </span>
                    </div>
                    <p style={{ margin: '6px 0 0', fontSize: '14px', lineHeight: 1.55, color: '#4A5468' }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cara-pesan-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
          gap: 48px;
          align-items: center;
        }

        .timeline-container {
          position: relative;
          padding-left: 28px;
        }

        .timeline-line {
          position: absolute;
          left: 28px;
          top: 30px;
          bottom: 40px;
          width: 2px;
          background: linear-gradient(to bottom, #BFCBD9 0%, #FFC98A 50%, #9CCFC2 100%);
          box-shadow: 0 0 6px rgba(255, 201, 138, 0.4);
          transform: translateX(-50%);
        }

        .timeline-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .timeline-row {
          position: relative;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .timeline-node {
          position: relative;
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: #FFFFFF;
          border: 1.5px solid #D5DCE6;
          box-shadow: 0 4px 14px rgba(20, 28, 51, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #253254;
          z-index: 2;
        }

        .timeline-node.success-node {
          background: #9CCFC2;
          border-color: #9CCFC2;
          box-shadow: 0 0 16px rgba(156, 207, 194, 0.5);
        }

        .timeline-card {
          flex: 1;
          background: #FFFFFF;
          border-radius: 14px;
          border: 1.5px solid #E2E8F0;
          padding: 18px 22px;
          box-shadow: 0 4px 14px rgba(20, 28, 51, 0.04);
        }

        @media (max-width: 860px) {
          .cara-pesan-layout {
            grid-template-columns: minmax(0, 1fr) !important;
            gap: 16px !important;
          }

          .card-mulai {
            padding: 16px !important;
            gap: 12px !important;
          }

          .card-mulai h3.disp {
            font-size: 22px !important;
          }

          .timeline-container {
            padding-left: 16px;
          }

          .timeline-line {
            left: 16px;
          }

          .timeline-list {
            gap: 8px !important;
          }

          .timeline-row {
            gap: 10px;
          }

          .timeline-node {
            width: 32px;
            height: 32px;
            border-radius: 8px;
          }

          .timeline-node svg {
            width: 15px;
            height: 15px;
          }

          .timeline-card {
            padding: 8px 12px;
          }

          .timeline-card span.disp {
            font-size: 15px !important;
          }

          .timeline-card p {
            font-size: 12px !important;
            margin-top: 2px !important;
            line-height: 1.4 !important;
          }
        }
      `}</style>
    </section>
  );
}
