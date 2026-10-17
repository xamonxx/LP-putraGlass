'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CONFIGURATOR_SHAPES } from '../lib/constants';
import { hitungHargaCustom } from '../../../src/lib/pricing/custom-pricing';
import { LeadSourceCode, buildWhatsAppLink, getStoredLeadSource, trackLeadClick, trackViewContent, trackConfiguratorStart } from '../lib/tracking';

export function ConfiguratorSection() {
  const [shape, setShape] = useState<string>('capsul');
  const [w, setW] = useState<string>('60');
  const [h, setH] = useState<string>('80');
  const [led, setLed] = useState<'3_warna' | '1_warna'>('3_warna');
  const [ctrl, setCtrl] = useState<'touchscreen' | 'sensor_baterai'>('touchscreen');
  const [fog, setFog] = useState<boolean>(true);
  const [city, setCity] = useState<string>('');
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [leadCode, setLeadCode] = useState<LeadSourceCode>('LP-LANGSUNG');

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackViewContent('konfigurator');
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    setLeadCode(getStoredLeadSource());
    return () => observer.disconnect();
  }, []);

  const onUserInteraction = () => {
    if (!hasStarted) {
      setHasStarted(true);
      trackConfiguratorStart();
    }
  };

  const isRound = shape === 'round';
  const numW = Math.max(0, Number(w) || 0);
  const numH = isRound ? numW : Math.max(0, Number(h) || 0);

  // Kalkulasi harga via shared pure module
  const calcResult = hitungHargaCustom({
    panjang_cm: numH,
    lebar_cm: numW,
    lampu: led,
    kontrol: ctrl,
    antifog: fog,
    bentuk: shape,
    qty: 1,
  });

  // Skala pratinjau 1.5 px/cm
  const sc = 1.5;
  const cw = Math.min(200, Math.max(30, numW || 30));
  const chh = Math.min(200, Math.max(30, numH || 30));
  const pvW = Math.round(cw * sc);
  const pvH = Math.round(chh * sc);
  const pvTop = Math.max(0, Math.round((230 - 140 - chh / 2) * sc));

  const curShapeObj = CONFIGURATOR_SHAPES.find((s) => s.id === shape) || CONFIGURATOR_SHAPES[1];
  const pvRadius = curShapeObj.radius;

  const dimText = isRound ? `Ø ${numW} cm` : `${numW} × ${numH} cm`;
  const areaText = isRound
    ? `Dihitung dari kotak luar ${(calcResult.luas_m2).toFixed(2).replace('.', ',')} m²`
    : `Luas ${(calcResult.luas_m2).toFixed(2).replace('.', ',')} m²`;

  const priceDisplayText = calcResult.isValid
    ? calcResult.formatted_harga_satuan
    : (calcResult.pesan || 'Isi ukuran minimal 30 cm');

  // Format pesan WhatsApp sesuai PRD
  const waMsg = [
    'Halo Putra Glass, saya mau tanya cermin LED custom:',
    `- Bentuk: ${curShapeObj.label}`,
    `- Ukuran: ${dimText}`,
    `- Lampu: ${led === '3_warna' ? 'LED 3 warna' : 'LED 1 warna'}`,
    `- Kontrol: ${ctrl === 'touchscreen' ? 'Touchscreen' : 'Sensor tangan + baterai'}`,
    `- Antifog: ${fog ? 'Ya' : 'Tidak'}`,
    '- Jumlah: 1 unit',
    `- Kota: ${city.trim() || '-'}`,
    calcResult.isValid
      ? `Estimasi di website: ${calcResult.formatted_harga_satuan} (belum ongkir)`
      : 'Estimasi di website: (ukuran custom)',
  ].join('\n');

  const waHref = buildWhatsAppLink(waMsg, leadCode);

  return (
    <section
      ref={sectionRef}
      id="rancang"
      style={{ background: '#141C33', color: '#FFFFFF', padding: '104px 0' }}
    >
      <div className="wrap">
        <h2 className="h2 disp" style={{ margin: 0 }}>
          rancang cerminmu, lihat estimasinya.
        </h2>
        <p style={{ margin: '18px 0 0', maxWidth: '34em', fontSize: '18px', lineHeight: 1.6, color: '#C9D2E0' }}>
          Isi ukuran yang kamu butuhkan. Kami tunjukkan seberapa besar cerminnya dan kira-kira harganya.
        </p>

        <div className="rancang" style={{ marginTop: '56px' }}>
          {/* Form Konfigurasi */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Pilihan Bentuk */}
            <div>
              <p style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 600, color: '#C9D2E0' }}>
                Bentuk
              </p>
              <div role="group" aria-label="Bentuk" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {CONFIGURATOR_SHAPES.map((s) => {
                  const isSel = s.id === shape;
                  return (
                    <button
                      key={s.id}
                      className="opt"
                      type="button"
                      onClick={() => {
                        onUserInteraction();
                        setShape(s.id);
                      }}
                      aria-pressed={isSel}
                      style={{
                        minHeight: '44px',
                        padding: '0 16px',
                        borderRadius: '10px',
                        border: `1.5px solid ${isSel ? '#9CCFC2' : 'rgba(191,203,217,0.35)'}`,
                        background: isSel ? 'rgba(156,207,194,0.14)' : 'rgba(255,255,255,0.02)',
                        color: '#FFFFFF',
                        fontFamily: 'inherit',
                        fontSize: '15px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Dimensi */}
            <div style={{ display: 'grid', gridTemplateColumns: isRound ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#C9D2E0' }}>
                {isRound ? 'Diameter (cm)' : 'Lebar (cm)'}
                <input
                  className="fld"
                  type="number"
                  inputMode="numeric"
                  min="30"
                  max="200"
                  value={w}
                  onChange={(e) => {
                    onUserInteraction();
                    setW(e.target.value);
                  }}
                />
              </label>
              {!isRound && (
                <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#C9D2E0' }}>
                  Tinggi (cm)
                  <input
                    className="fld"
                    type="number"
                    inputMode="numeric"
                    min="30"
                    max="200"
                    value={h}
                    onChange={(e) => {
                      onUserInteraction();
                      setH(e.target.value);
                    }}
                  />
                </label>
              )}
            </div>

            {/* Pilihan Lampu */}
            <div>
              <p style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 600, color: '#C9D2E0' }}>
                Lampu
              </p>
              <div role="group" aria-label="Lampu" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <button
                  className="opt"
                  type="button"
                  onClick={() => {
                    onUserInteraction();
                    setLed('3_warna');
                  }}
                  aria-pressed={led === '3_warna'}
                  style={{
                    minHeight: '44px',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: `1.5px solid ${led === '3_warna' ? '#9CCFC2' : 'rgba(191,203,217,0.35)'}`,
                    background: led === '3_warna' ? 'rgba(156,207,194,0.14)' : 'rgba(255,255,255,0.02)',
                    color: '#FFFFFF',
                    fontFamily: 'inherit',
                    fontSize: '15px',
                    fontWeight: 600,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  LED 3 warna
                  <span style={{ display: 'block', fontSize: '12px', fontWeight: 400, color: '#9FB0C8' }}>
                    Rp1.750.000 per m²
                  </span>
                </button>

                <button
                  className="opt"
                  type="button"
                  onClick={() => {
                    onUserInteraction();
                    setLed('1_warna');
                  }}
                  aria-pressed={led === '1_warna'}
                  style={{
                    minHeight: '44px',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: `1.5px solid ${led === '1_warna' ? '#9CCFC2' : 'rgba(191,203,217,0.35)'}`,
                    background: led === '1_warna' ? 'rgba(156,207,194,0.14)' : 'rgba(255,255,255,0.02)',
                    color: '#FFFFFF',
                    fontFamily: 'inherit',
                    fontSize: '15px',
                    fontWeight: 600,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  LED 1 warna
                  <span style={{ display: 'block', fontSize: '12px', fontWeight: 400, color: '#9FB0C8' }}>
                    Rp1.550.000 per m²
                  </span>
                </button>
              </div>
            </div>

            {/* Pilihan Kontrol */}
            <div>
              <p style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 600, color: '#C9D2E0' }}>
                Kontrol
              </p>
              <div role="group" aria-label="Kontrol" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <button
                  className="opt"
                  type="button"
                  onClick={() => {
                    onUserInteraction();
                    setCtrl('touchscreen');
                  }}
                  aria-pressed={ctrl === 'touchscreen'}
                  style={{
                    minHeight: '44px',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: `1.5px solid ${ctrl === 'touchscreen' ? '#9CCFC2' : 'rgba(191,203,217,0.35)'}`,
                    background: ctrl === 'touchscreen' ? 'rgba(156,207,194,0.14)' : 'rgba(255,255,255,0.02)',
                    color: '#FFFFFF',
                    fontFamily: 'inherit',
                    fontSize: '15px',
                    fontWeight: 600,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  Touchscreen
                  <span style={{ display: 'block', fontSize: '12px', fontWeight: 400, color: '#9FB0C8' }}>
                    Termasuk
                  </span>
                </button>

                <button
                  className="opt"
                  type="button"
                  onClick={() => {
                    onUserInteraction();
                    setCtrl('sensor_baterai');
                  }}
                  aria-pressed={ctrl === 'sensor_baterai'}
                  style={{
                    minHeight: '44px',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: `1.5px solid ${ctrl === 'sensor_baterai' ? '#9CCFC2' : 'rgba(191,203,217,0.35)'}`,
                    background: ctrl === 'sensor_baterai' ? 'rgba(156,207,194,0.14)' : 'rgba(255,255,255,0.02)',
                    color: '#FFFFFF',
                    fontFamily: 'inherit',
                    fontSize: '15px',
                    fontWeight: 600,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  Sensor tangan + baterai
                  <span style={{ display: 'block', fontSize: '12px', fontWeight: 400, color: '#9FB0C8' }}>
                    +Rp250.000, tanpa colokan
                  </span>
                </button>
              </div>
            </div>

            {/* Antifog Pad Checkbox */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', minHeight: '44px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={fog}
                onChange={(e) => {
                  onUserInteraction();
                  setFog(e.target.checked);
                }}
                style={{ width: '22px', height: '22px', accentColor: '#9CCFC2', cursor: 'pointer' }}
              />
              Tambah antifog <span style={{ fontWeight: 400, color: '#9FB0C8' }}>+Rp200.000, tidak berembun setelah mandi</span>
            </label>

            {/* Kota Tujuan */}
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#C9D2E0' }}>
              Kota tujuan
              <input
                className="fld"
                type="text"
                placeholder="contoh: Surabaya, atau ambil sendiri"
                value={city}
                onChange={(e) => {
                  onUserInteraction();
                  setCity(e.target.value);
                }}
              />
            </label>
          </div>

          {/* Pratinjau Visual & Estimasi */}
          <div style={{ borderRadius: '16px', background: '#0F1528', border: '1px solid #26314F', padding: '28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div aria-hidden="true" style={{ position: 'relative', height: '345px', borderBottom: '2px solid #3A4766', overflow: 'hidden' }}>
              {/* Siluet orang 170 cm (tinggi 255 px = 170 * 1.5) */}
              <svg width="84" height="255" viewBox="0 0 56 170" style={{ position: 'absolute', left: '8px', bottom: 0 }} fill="#2A3552" stroke="#5B6A8C" strokeWidth="1">
                <circle cx="28" cy="12" r="11" />
                <rect x="10" y="26" width="36" height="72" rx="14" />
                <rect x="14" y="94" width="12" height="76" rx="6" />
                <rect x="30" y="94" width="12" height="76" rx="6" />
              </svg>

              {/* Cermin skala 1.5 px/cm */}
              <div
                className="pv-mirror"
                style={{
                  position: 'absolute',
                  left: '120px',
                  top: `${pvTop}px`,
                  width: `${pvW}px`,
                  height: `${pvH}px`,
                  borderRadius: pvRadius,
                  background: 'linear-gradient(160deg, #3A4560, #1B2238)',
                  boxShadow: '0 0 36px rgba(255,201,138,0.28), inset 0 0 0 1.5px rgba(191,203,217,0.6)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: '8%',
                    borderRadius: pvRadius,
                    border: '3px solid #FFC98A',
                    boxShadow: '0 0 10px #FFC98A, inset 0 0 6px rgba(255,201,138,0.6)',
                  }}
                />
              </div>
            </div>

            <p style={{ margin: 0, fontSize: '13px', color: '#9FB0C8' }}>
              Siluet orang 170 cm sebagai pembanding ukuran.
            </p>

            <div>
              <p className="disp" style={{ margin: 0, fontSize: '40px', lineHeight: 1 }}>
                {dimText}
              </p>
              <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#9FB0C8' }}>
                {areaText}
              </p>
            </div>

            <div style={{ paddingTop: '18px', borderTop: '1px solid #26314F' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#C9D2E0' }}>Estimasi produk</p>
              <p
                className="disp"
                aria-live="polite"
                style={{ margin: '6px 0 0', fontSize: '36px', lineHeight: 1.1, color: '#FFC98A' }}
              >
                {priceDisplayText}
              </p>
              <p style={{ margin: '8px 0 0', fontSize: '13px', lineHeight: 1.5, color: '#9FB0C8' }}>
                Belum termasuk ongkir. Harga final dikonfirmasi admin di WhatsApp.
              </p>
            </div>

            <a
              className="wa"
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                trackLeadClick('configurator_wa_btn');
                e.currentTarget.href = buildWhatsAppLink(waMsg, getStoredLeadSource());
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
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
              Kirim rancangan ke WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
