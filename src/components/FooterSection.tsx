'use client';

import React from 'react';
import {
  WORKSHOP_ADDRESS,
  PHONE_DISPLAY,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  TIKTOK_HANDLE,
  TIKTOK_URL,
} from '../lib/constants';
import { buildWhatsAppLink, trackLeadClick } from '../lib/tracking';

export function FooterSection() {
  const waUrl = buildWhatsAppLink('Halo Putra Glass, saya mau kirim ukuran cermin.');

  return (
    <footer id="proyek" style={{ background: '#F3F5F8', color: '#1B2233', padding: '96px 0 64px' }}>
      <div className="wrap" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '32px' }}>
        <div style={{ maxWidth: '660px' }}>
          <h2 className="h2 disp" style={{ margin: 0, color: '#253254' }}>
            ukuran apa pun, bentuk apa pun. kirim, kami kerjakan.
          </h2>
          <p style={{ margin: '18px 0 0', fontSize: '17px', lineHeight: 1.6, color: '#4A5468' }}>
            Cermin LED, kaca es, kaca polos 3–8 mm, sampai kaca moru, dipotong sesuai ukuran di lapangan. Untuk rumah, kantor, toko, hotel, kafe, atau proyek interior. Kirim satu ukuran atau daftar sekaligus, kami siapkan penawaran dan jadwal produksinya.
          </p>
        </div>

        <a
          className="wa"
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackLeadClick('footer_wa_btn')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
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
          Kirim ukuran lewat WhatsApp
        </a>
      </div>

      <div className="wrap" style={{ marginTop: '72px' }}>
        <div
          style={{
            paddingTop: '28px',
            borderTop: '1px solid #D5DCE6',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="44" height="24" viewBox="0 0 44 24" aria-hidden="true">
              <rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" fill="#A6A6A6" />
              <rect x="15" y="5" width="14" height="14" transform="rotate(45 22 12)" fill="#253254" />
              <rect x="25" y="5" width="14" height="14" transform="rotate(45 32 12)" fill="#BFCBD9" />
            </svg>
            <span style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '0.08em', color: '#253254' }}>
              PUTRA GLASS
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 32px', fontSize: '14px', lineHeight: 1.5, color: '#4A5468' }}>
            <span>{WORKSHOP_ADDRESS}</span>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#275087', fontWeight: 600 }}>
              WhatsApp {PHONE_DISPLAY}
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" style={{ color: '#275087' }}>
              Instagram {INSTAGRAM_HANDLE}
            </a>
            <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" style={{ color: '#275087' }}>
              TikTok {TIKTOK_HANDLE}
            </a>
          </div>
        </div>

        <div style={{ marginTop: '24px', fontSize: '12px', color: '#4A5768' }}>
          © {new Date().getFullYear()} Putra Glass. Seluruh hak cipta dilindungi. Workshop Citatah, Cipatat, Bandung Barat.
        </div>
      </div>
    </footer>
  );
}
