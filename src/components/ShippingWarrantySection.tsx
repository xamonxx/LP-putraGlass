import React from 'react';
import { GARANSI_INFO } from '../lib/constants';

export function ShippingWarrantySection() {
  return (
    <section id="pengiriman-garansi" style={{ background: '#F3F5F8', color: '#1B2233', padding: '96px 0' }}>
      <div className="wrap">
        <h2 className="h2 disp" style={{ margin: 0, color: '#253254' }}>
          pengiriman dan garansi.
        </h2>
        <p style={{ margin: '18px 0 0', maxWidth: '36em', fontSize: '18px', lineHeight: 1.6, color: '#4A5468' }}>
          Kami memastikan setiap cermin sampai di lokasimu dalam kondisi utuh dan siap dinyalakan.
        </p>

        <div className="shipping-grid">
          {/* Blok Pengiriman */}
          <div className="shipping-card" style={{ background: '#FFFFFF', borderRadius: '16px', border: '1.5px solid #DCE3ED', boxShadow: '0 8px 24px rgba(20, 28, 51, 0.04)' }}>
            <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '12px', background: 'rgba(39,80,135,0.08)', color: '#275087' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <h3 className="disp" style={{ margin: '20px 0 0', fontSize: '24px', color: '#253254' }}>
              Pengiriman Seluruh Indonesia
            </h3>
            <p style={{ margin: '14px 0 0', fontSize: '16px', lineHeight: 1.6, color: '#4A5468' }}>
              Dikirim ke seluruh Indonesia atau ambil sendiri langsung di workshop kami di Citatah. Kiriman luar kota dikemas paking kayu bertulang rapat berlapis bubble wrap tebal; untuk area dalam kota Bandung Raya dapat menggunakan kurir instan mobil. Ongkir dihitung akurat oleh admin sesuai alamat tujuanmu.
            </p>
          </div>

          {/* Blok Garansi */}
          <div className="shipping-card" style={{ background: '#FFFFFF', borderRadius: '16px', border: '1.5px solid #DCE3ED', boxShadow: '0 8px 24px rgba(20, 28, 51, 0.04)' }}>
            <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '12px', background: 'rgba(37,211,102,0.1)', color: '#06301A' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 className="disp" style={{ margin: '20px 0 0', fontSize: '24px', color: '#253254' }}>
              Garansi Pengiriman & Lampu
            </h3>
            <p style={{ margin: '14px 0 0', fontSize: '16px', lineHeight: 1.6, color: '#4A5468' }}>
              Garansi pengiriman selama {GARANSI_INFO.pengiriman} dan garansi fungsi lampu selama {GARANSI_INFO.fungsiLampu}. {GARANSI_INFO.syaratKlaim}
            </p>
            {/* Note status TODO menunggu konfirmasi owner terisolasi di konstanta */}
            <p style={{ margin: '14px 0 0', fontSize: '12px', color: '#4A5768' }}>
              Status: Aktif saat barang diterima klien. ({GARANSI_INFO.catatanOwner})
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
