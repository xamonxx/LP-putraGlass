import React from 'react';

export function HowToOrderSection() {
  return (
    <section id="cara-pesan" style={{ background: '#F3F5F8', color: '#1B2233', padding: '104px 0' }}>
      <div className="wrap">
        <h2 className="h2 disp" style={{ margin: 0, color: '#253254' }}>
          cara pesan
        </h2>
        <ol className="steps" style={{ listStyle: 'none', margin: '48px 0 0', padding: 0 }}>
          <li style={{ borderTop: '2px solid #253254', paddingTop: '20px' }}>
            <p className="disp" style={{ margin: 0, fontSize: '22px', color: '#253254' }}>
              1. DP 50%
            </p>
            <p style={{ margin: '10px 0 0', fontSize: '15px', lineHeight: 1.6, color: '#4A5468' }}>
              Transfer DP ke BCA. Pesanan langsung masuk antrean produksi.
            </p>
          </li>
          <li style={{ borderTop: '2px solid #253254', paddingTop: '20px' }}>
            <p className="disp" style={{ margin: 0, fontSize: '22px', color: '#253254' }}>
              2. Produksi 1–5 hari kerja
            </p>
            <p style={{ margin: '10px 0 0', fontSize: '15px', lineHeight: 1.6, color: '#4A5468' }}>
              Kamu dapat foto dan video saat cerminnya dikerjakan.
            </p>
          </li>
          <li style={{ borderTop: '2px solid #253254', paddingTop: '20px' }}>
            <p className="disp" style={{ margin: 0, fontSize: '22px', color: '#253254' }}>
              3. Pelunasan dan kirim
            </p>
            <p style={{ margin: '10px 0 0', fontSize: '15px', lineHeight: 1.6, color: '#4A5468' }}>
              Foto produk dan packing dikirim dulu, lalu pelunasan dan nomor resi.
            </p>
          </li>
          <li style={{ borderTop: '2px solid #253254', paddingTop: '20px' }}>
            <p className="disp" style={{ margin: 0, fontSize: '22px', color: '#253254' }}>
              4. Pasang dan pakai
            </p>
            <p style={{ margin: '10px 0 0', fontSize: '15px', lineHeight: 1.6, color: '#4A5468' }}>
              Garansi aktif sejak barang sampai. Simpan video unboxing untuk klaim.
            </p>
          </li>
        </ol>
      </div>
    </section>
  );
}
