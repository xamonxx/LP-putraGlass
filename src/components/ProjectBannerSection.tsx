'use client';

import React from 'react';
import { buildWhatsAppLink, trackLeadClick } from '../lib/tracking';

export function ProjectBannerSection() {
  const waUrl = buildWhatsAppLink('Halo Putra Glass, saya ingin konsultasi penawaran dan jadwal produksi untuk kebutuhan proyek interior / komersial.');

  return (
    <section id="proyek-banner" style={{ background: '#253254', color: '#FFFFFF', padding: '80px 0' }}>
      <div className="wrap">
        <div className="project-grid">
          <div>
            <span style={{ display: 'inline-block', fontSize: '13px', fontWeight: 800, color: '#9CCFC2', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Jalur Pengadaan Proyek
            </span>
            <h2 className="h2 disp" style={{ margin: '12px 0 0', color: '#FFFFFF' }}>
              butuh banyak unit untuk hotel, kafe, atau proyek interior?
            </h2>
            <p style={{ margin: '20px 0 0', fontSize: '17px', lineHeight: 1.6, color: '#D5DCE8' }}>
              Kirim daftar ukurannya, kami siapkan jadwal produksi terukur dan penawaran khusus proyek. Kami juga memproses berbagai varian kaca arsitektural:
            </p>

            <ul style={{ margin: '18px 0 0', paddingLeft: '20px', fontSize: '15px', lineHeight: 1.8, color: '#BFCBD9' }}>
              <li><strong>Jenis kaca:</strong> Kaca es (sandblast atau acid frosted), kaca polos 3–8 mm, hingga kaca moru (fluted glass).</li>
              <li><strong>Finishing tepi:</strong> Clean cut, flat polished, pencil polished, beveled mesin, dan coakan khusus saklar/stopkontak.</li>
            </ul>

            <div style={{ marginTop: '36px' }}>
              <a
                className="wa"
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackLeadClick('project_banner_btn')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  minHeight: '52px',
                  padding: '0 28px',
                  borderRadius: '12px',
                  background: '#25D366',
                  color: '#06301A',
                  fontWeight: 600,
                  fontSize: '16px',
                  textDecoration: 'none',
                }}
              >
                Diskusikan proyek
              </a>
            </div>
          </div>

          {/* Kartu Ringkasan Proyek */}
          <div
            style={{
              borderRadius: '20px',
              background: '#1A233A',
              border: '1px solid #3A4766',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <h3 className="disp" style={{ margin: 0, fontSize: '22px', color: '#FFFFFF' }}>
              Kapasitas Workshop Putra Glass
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              <div>
                <p className="disp" style={{ margin: 0, fontSize: '28px', color: '#FFC98A' }}>4.000+</p>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#9FB0C8' }}>Unit terkirim sejak 2025</p>
              </div>
              <div>
                <p className="disp" style={{ margin: 0, fontSize: '28px', color: '#9CCFC2' }}>1–5 Hari</p>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#9FB0C8' }}>Standar produksi batch</p>
              </div>
              <div>
                <p className="disp" style={{ margin: 0, fontSize: '28px', color: '#FFFFFF' }}>5050 LED</p>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#9FB0C8' }}>Grade komersial awet</p>
              </div>
              <div>
                <p className="disp" style={{ margin: 0, fontSize: '28px', color: '#FFFFFF' }}>Paking Kayu</p>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#9FB0C8' }}>Bertulang kuat kirim luar pulau</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
