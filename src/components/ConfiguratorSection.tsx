'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GAMBARAN_HARGA_CONTOH } from '../config/harga-contoh';
import {
  LeadSourceCode,
  buildWhatsAppLink,
  getStoredLeadSource,
  trackLeadClick,
  trackViewContent,
  trackConfiguratorStart,
  trackConfiguratorSend,
} from '../lib/tracking';

interface ShapeItem {
  id: string;
  label: string;
}

const SHAPES: ShapeItem[] = [
  { id: 'rectangle', label: 'Rectangle' },
  { id: 'capsul', label: 'Capsul' },
  { id: 'oval', label: 'Oval' },
  { id: 'round', label: 'Round' },
];

const COLOR_TEMPS = [
  { id: 'hangat', label: 'Hangat', glow: '#FFC98A' },
  { id: 'natural', label: 'Natural', glow: '#FFE9C7' },
  { id: 'putih', label: 'Putih', glow: '#D6E6FF' },
] as const;

export function ConfiguratorSection() {
  const [shape, setShape] = useState<string>('capsul');
  const [w, setW] = useState<string>('60');
  const [h, setH] = useState<string>('80');
  const [led, setLed] = useState<'3_warna' | '1_warna'>('3_warna');
  const [ctrl, setCtrl] = useState<'touchscreen' | 'sensor_baterai'>('touchscreen');
  const [fog, setFog] = useState<boolean>(true);
  const [city, setCity] = useState<string>('');
  const [colorTemp, setColorTemp] = useState<'hangat' | 'natural' | 'putih'>('hangat');
  const [isLampOn, setIsLampOn] = useState<boolean>(true);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [leadCode, setLeadCode] = useState<LeadSourceCode>('LP-LANGSUNG');

  // Animation tween state for smooth SVG geometry transitions on Safari/iOS
  const [animW, setAnimW] = useState<number>(60);
  const [animH, setAnimH] = useState<number>(80);

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackViewContent('konfigurator');
        }
      },
      { threshold: 0.15 }
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
  const numW = Number(w) || 0;
  const numH = isRound ? numW : Number(h) || 0;

  const isOutOfRange = numW < 30 || numW > 200 || (!isRound && (numH < 30 || numH > 200));

  // Clamped values for SVG visual preview (30 - 200 cm)
  const targetW = Math.min(200, Math.max(30, numW || 30));
  const targetH = isRound ? targetW : Math.min(200, Math.max(30, numH || 30));

  // Smooth requestAnimationFrame tween for width & height
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (Math.abs(animW - targetW) < 0.5 && Math.abs(animH - targetH) < 0.5) return;

    // Animasi ukuran sengaja selalu jalan (termasuk mode hemat daya) atas permintaan pemilik.
    let rafId: number;
    const startW = animW;
    const startH = animH;
    const startTime = performance.now();
    const duration = 450; // ms

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // cubic-bezier(.34, 1.2, .64, 1) approximation
      const ease = Math.sin(progress * Math.PI * 0.5) * (1 + 0.15 * Math.sin(progress * Math.PI));
      const factor = Math.min(1.05, Math.max(0, ease));

      setAnimW(startW + (targetW - startW) * factor);
      setAnimH(startH + (targetH - startH) * factor);

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setAnimW(targetW);
        setAnimH(targetH);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- tween berangkat dari posisi animasi terakhir
  }, [targetW, targetH]);

  const activeColorObj = COLOR_TEMPS.find((t) => t.id === colorTemp) || COLOR_TEMPS[0];
  const curShapeObj = SHAPES.find((s) => s.id === shape) || SHAPES[1];

  const dimDisplay = isRound ? `Ø ${numW || 30} cm` : `${numW || 30}×${numH || 30} cm`;
  const dimDisplayFormatted = isRound ? `Ø ${numW || 30} cm` : `${numW || 30} × ${numH || 30} cm`;

  // SVG Geometry calculations
  const mirrorW = animW;
  const mirrorH = animH;
  const mirrorLeft = 190 - mirrorW / 2;
  const mirrorTop = Math.max(18, 90 - mirrorH / 2);

  // Corner radii
  let rx = 3;
  let ry = 3;
  if (shape === 'capsul') {
    rx = Math.min(mirrorW, mirrorH) / 2;
    ry = rx;
  } else if (shape === 'oval' || shape === 'round') {
    rx = mirrorW / 2;
    ry = isRound ? rx : mirrorH / 2;
  }

  const ledInset = Math.min(4, Math.max(2, Math.min(mirrorW, mirrorH) * 0.08));

  // Build WhatsApp text
  const waLampText = led === '3_warna' ? 'LED 3 warna' : `LED 1 warna ${colorTemp}`;
  const waLines = [
    'Halo Putra Glass, saya mau minta harga cermin LED custom:',
    `- Bentuk: ${curShapeObj.label}`,
    `- Ukuran: ${dimDisplayFormatted}`,
    `- Lampu: ${waLampText}`,
    `- Kontrol: ${ctrl === 'touchscreen' ? 'Touchscreen' : 'Sensor tangan'}`,
    `- Antifog: ${fog ? 'Ya' : 'Tidak'}`,
    `- Kota: ${city.trim() || '-'}`,
  ];
  const waFullMsg = waLines.join('\n');
  const waHref = buildWhatsAppLink(waFullMsg, leadCode);

  const handleSendWhatsApp = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackLeadClick('configurator_wa_btn');
    trackConfiguratorSend();
    e.currentTarget.href = buildWhatsAppLink(waFullMsg, getStoredLeadSource());
  };

  const handleApplyPreset = (pw: number, ph: number) => {
    onUserInteraction();
    setW(String(pw));
    setH(String(ph));
  };

  const specSummary = [
    led === '3_warna' ? 'LED 3 warna' : `LED 1 warna ${colorTemp}`,
    ctrl === 'touchscreen' ? 'touchscreen' : 'sensor tangan',
    fog ? 'antifog' : null,
    city.trim() ? `kirim ke ${city.trim()}` : null,
  ].filter(Boolean).join(', ');

  return (
    <section
      ref={sectionRef}
      id="rancang"
      style={{
        background: '#141C33',
        color: '#FFFFFF',
        padding: '104px 0',
        position: 'relative',
      }}
    >
      <div className="wrap">
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '24px',
          }}
        >
          <div>
            <h2 className="h2 disp" style={{ margin: 0, color: '#FFFFFF' }}>
              rancang cerminmu.
            </h2>
            <div className="h2 disp" style={{ color: '#9CCFC2', marginTop: '4px' }}>
              lihat langsung di dinding.
            </div>
          </div>
          <p
            style={{
              margin: 0,
              maxWidth: '32em',
              fontSize: '16px',
              lineHeight: 1.6,
              color: '#D5DCE8',
            }}
          >
            Atur bentuk, ukuran, dan cahayanya. Kirim rancangannya, admin balas dengan harga final dan PDF penawaran.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="rancang-container" style={{ marginTop: '56px' }}>
          {/* Kolom Kiri: Pratinjau Sticky */}
          <div className="rancang-preview-col">
            <div
              style={{
                background: '#0F1528',
                border: '1.5px solid #26314F',
                borderRadius: '18px',
                padding: '20px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.45)',
              }}
            >
              {/* Top Bar: Color Pills + Lamp Switch */}
              <div className="rancang-top-bar">
                <div role="group" aria-label="Warna cahaya" style={{ display: 'flex', gap: '8px' }}>
                  {COLOR_TEMPS.map((t) => {
                    const isSel = t.id === colorTemp;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          onUserInteraction();
                          setColorTemp(t.id);
                        }}
                        aria-pressed={isSel}
                        className={`color-temp-btn ${isSel ? 'selected' : ''}`}
                      >
                        <span
                          aria-hidden="true"
                          style={{
                            width: '9px',
                            height: '9px',
                            borderRadius: '999px',
                            background: t.glow,
                            boxShadow: `0 0 6px ${t.glow}`,
                          }}
                        />
                        {t.label}
                      </button>
                    );
                  })}
                </div>

                {/* Lamp Power Button */}
                <button
                  type="button"
                  onClick={() => setIsLampOn(!isLampOn)}
                  aria-label={isLampOn ? 'Matikan lampu cermin' : 'Nyalakan lampu cermin'}
                    className={`lamp-toggle-btn ${isLampOn ? 'selected' : ''}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                  <span className="lamp-btn-text">
                    {isLampOn ? 'Lampu nyala' : 'Lampu mati'}
                  </span>
                </button>
              </div>

              {/* Canvas SVG Dinding & Cermin */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '320 / 250',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: '#111830',
                }}
              >
                <svg
                  viewBox="0 0 320 250"
                  width="100%"
                  height="100%"
                  preserveAspectRatio="xMidYMid meet"
                  style={{ display: 'block' }}
                >
                  <defs>
                    <linearGradient id="wallGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1B2544" />
                      <stop offset="100%" stopColor="#111830" />
                    </linearGradient>

                    <linearGradient id="mirrorSheen" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
                      <stop offset="35%" stopColor="rgba(255,255,255,0.03)" />
                      <stop offset="65%" stopColor="rgba(255,255,255,0.08)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.01)" />
                    </linearGradient>

                    <linearGradient id="mirrorGlass" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3A4766" />
                      <stop offset="50%" stopColor="#1E2740" />
                      <stop offset="100%" stopColor="#171E33" />
                    </linearGradient>

                    <filter id="wallGlow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="16" />
                    </filter>

                    <filter id="ledGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={activeColorObj.glow} floodOpacity="0.8" />
                    </filter>
                  </defs>

                  {/* Dinding */}
                  <rect width="320" height="250" fill="url(#wallGradient)" />

                  {/* Garis Panel Dinding Tipis per 40 cm */}
                  {[40, 80, 120, 160, 200, 240, 280].map((px) => (
                    <line
                      key={px}
                      x1={px}
                      y1="0"
                      x2={px}
                      y2="232"
                      stroke="rgba(255,255,255,0.035)"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Plint (y 232–240) */}
                  <rect x="0" y="232" width="320" height="8" fill="#172038" />
                  <line x1="0" y1="232" x2="320" y2="232" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />

                  {/* Lantai (y 240–250) */}
                  <rect x="0" y="240" width="320" height="10" fill="#0C1222" />
                  <line x1="0" y1="240" x2="320" y2="240" stroke="#253254" strokeWidth="1" />

                  {/* Siluet Orang 170 cm di x=14 (y 70–240) */}
                  <g aria-hidden="true">
                    <text
                      x="28"
                      y="64"
                      fill="#9FB0C8"
                      fontSize="8"
                      fontWeight="600"
                      textAnchor="middle"
                      fontFamily="system-ui, sans-serif"
                    >
                      170 cm
                    </text>
                    {/* Kepala (y 70–90) */}
                    <circle cx="28" cy="80" r="10" fill="#2A3552" stroke="#5B6A8C" strokeWidth="1" />
                    {/* Badan (y 92–160) */}
                    <rect x="14" y="92" width="28" height="68" rx="10" fill="#2A3552" stroke="#5B6A8C" strokeWidth="1" />
                    {/* Kaki Kiri (y 160–240) */}
                    <rect x="17" y="160" width="10" height="80" rx="5" fill="#2A3552" stroke="#5B6A8C" strokeWidth="1" />
                    {/* Kaki Kanan (y 160–240) */}
                    <rect x="29" y="160" width="10" height="80" rx="5" fill="#2A3552" stroke="#5B6A8C" strokeWidth="1" />
                  </g>

                  {/* Pantulan Cahaya LED di Dinding (Wall Blur) */}
                  <rect
                    x={mirrorLeft - 10}
                    y={mirrorTop - 10}
                    width={mirrorW + 20}
                    height={mirrorH + 20}
                    rx={rx + 6}
                    ry={ry + 6}
                    fill={activeColorObj.glow}
                    filter="url(#wallGlow)"
                    opacity={isLampOn ? 0.55 : 0}
                    style={{ transition: 'opacity 350ms ease, fill 350ms ease' }}
                  />

                  {/* Kaca Cermin */}
                  <rect
                    x={mirrorLeft}
                    y={mirrorTop}
                    width={mirrorW}
                    height={mirrorH}
                    rx={rx}
                    ry={ry}
                    fill="url(#mirrorGlass)"
                    stroke="rgba(191,203,217,0.7)"
                    strokeWidth="1.2"
                  />

                  {/* Kilau Diagonal Kaca */}
                  <rect
                    x={mirrorLeft}
                    y={mirrorTop}
                    width={mirrorW}
                    height={mirrorH}
                    rx={rx}
                    ry={ry}
                    fill="url(#mirrorSheen)"
                    pointerEvents="none"
                  />

                  {/* Garis LED di Dalam Cermin */}
                  <rect
                    x={mirrorLeft + ledInset}
                    y={mirrorTop + ledInset}
                    width={Math.max(1, mirrorW - ledInset * 2)}
                    height={Math.max(1, mirrorH - ledInset * 2)}
                    rx={Math.max(1, rx - ledInset)}
                    ry={Math.max(1, ry - ledInset)}
                    fill="none"
                    stroke={activeColorObj.glow}
                    strokeWidth="2.2"
                    filter="url(#ledGlow)"
                    opacity={isLampOn ? 1 : 0}
                    style={{ transition: 'opacity 350ms ease, stroke 350ms ease' }}
                  />

                  {/* Garis Ukur #9CCFC2 Lebar (Atas) */}
                  <g className="measure-lines">
                    <line
                      x1={mirrorLeft}
                      y1={mirrorTop - 8}
                      x2={mirrorLeft + mirrorW}
                      y2={mirrorTop - 8}
                      stroke="#9CCFC2"
                      strokeWidth="1"
                    />
                    <line
                      x1={mirrorLeft}
                      y1={mirrorTop - 11}
                      x2={mirrorLeft}
                      y2={mirrorTop - 5}
                      stroke="#9CCFC2"
                      strokeWidth="1"
                    />
                    <line
                      x1={mirrorLeft + mirrorW}
                      y1={mirrorTop - 11}
                      x2={mirrorLeft + mirrorW}
                      y2={mirrorTop - 5}
                      stroke="#9CCFC2"
                      strokeWidth="1"
                    />
                    <text
                      x="190"
                      y={mirrorTop - 12}
                      fill="#9CCFC2"
                      className="measure-text"
                      fontWeight="700"
                      textAnchor="middle"
                      fontFamily="system-ui, sans-serif"
                    >
                      {Math.round(numW || 30)} cm
                    </text>
                  </g>

                  {/* Garis Ukur #9CCFC2 Tinggi (Kanan) */}
                  <g className="measure-lines">
                    <line
                      x1={mirrorLeft + mirrorW + 8}
                      y1={mirrorTop}
                      x2={mirrorLeft + mirrorW + 8}
                      y2={mirrorTop + mirrorH}
                      stroke="#9CCFC2"
                      strokeWidth="1"
                    />
                    <line
                      x1={mirrorLeft + mirrorW + 5}
                      y1={mirrorTop}
                      x2={mirrorLeft + mirrorW + 11}
                      y2={mirrorTop}
                      stroke="#9CCFC2"
                      strokeWidth="1"
                    />
                    <line
                      x1={mirrorLeft + mirrorW + 5}
                      y1={mirrorTop + mirrorH}
                      x2={mirrorLeft + mirrorW + 11}
                      y2={mirrorTop + mirrorH}
                      stroke="#9CCFC2"
                      strokeWidth="1"
                    />
                    <text
                      x={mirrorLeft + mirrorW + 13}
                      y={mirrorTop + mirrorH / 2}
                      fill="#9CCFC2"
                      className="measure-text"
                      fontWeight="700"
                      textAnchor="start"
                      dominantBaseline="middle"
                      fontFamily="system-ui, sans-serif"
                    >
                      {Math.round(numH || 30)} cm
                    </text>
                  </g>
                </svg>
              </div>

              {/* Teks Pembanding Bawah (Desktop saja) */}
              <p
                className="pv-hint"
                style={{
                  margin: '14px 0 0',
                  fontSize: '13px',
                  color: '#9FB0C8',
                  textAlign: 'center',
                }}
              >
                Skala sebenarnya. Siluet 170 cm sebagai pembanding, cermin dipasang setinggi mata.
              </p>
            </div>
          </div>

          {/* Kolom Kanan: 4 Kartu Kontrol & Kartu Rancanganmu */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Kartu 01: Bentuk */}
            <div className="control-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span className="badge-num">01</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>Bentuk</span>
              </div>
              <div className="shape-grid">
                {SHAPES.map((s) => {
                  const isSel = s.id === shape;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        onUserInteraction();
                        setShape(s.id);
                      }}
                      aria-pressed={isSel}
                      className={`shape-btn ${isSel ? 'selected' : ''}`}
                    >
                      <svg width="24" height="34" viewBox="0 0 24 34" fill="none" stroke="currentColor" strokeWidth="1.8">
                        {s.id === 'rectangle' && <rect x="3" y="3" width="18" height="28" rx="2" />}
                        {s.id === 'capsul' && <rect x="3" y="3" width="18" height="28" rx="9" />}
                        {s.id === 'oval' && <ellipse cx="12" cy="17" rx="9" ry="14" />}
                        {s.id === 'round' && <circle cx="12" cy="17" r="10" />}
                      </svg>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Kartu 02: Ukuran */}
            <div className="control-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span className="badge-num">02</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>Ukuran</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isRound ? '1fr' : 'repeat(2, 1fr)', gap: '12px' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#C9D2E0', fontWeight: 600 }}>
                  {isRound ? 'Diameter' : 'Lebar'}
                  <div className="input-with-suffix">
                    <input
                      type="number"
                      inputMode="numeric"
                      min="30"
                      max="200"
                      value={w}
                      onChange={(e) => {
                        onUserInteraction();
                        setW(e.target.value);
                      }}
                      className="fld-inner"
                    />
                    <span className="input-suffix">cm</span>
                  </div>
                </label>

                {!isRound && (
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#C9D2E0', fontWeight: 600 }}>
                    Tinggi
                    <div className="input-with-suffix">
                      <input
                        type="number"
                        inputMode="numeric"
                        min="30"
                        max="200"
                        value={h}
                        onChange={(e) => {
                          onUserInteraction();
                          setH(e.target.value);
                        }}
                        className="fld-inner"
                      />
                      <span className="input-suffix">cm</span>
                    </div>
                  </label>
                )}
              </div>

              {/* Warning Pesan di Luar Batas 30-200 */}
              {isOutOfRange && (
                <p style={{ margin: '10px 0 0', fontSize: '13px', color: '#FFC98A', lineHeight: 1.4 }}>
                  Ukuran 30 sampai 200 cm. Lebih besar dari itu? Tanya admin di WhatsApp.
                </p>
              )}

              {/* Ide Ukuran */}
              <div style={{ marginTop: '16px' }}>
                <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#9FB0C8', fontWeight: 600 }}>
                  Ide ukuran
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {isRound ? (
                    <>
                      <button type="button" onClick={() => handleApplyPreset(50, 50)} className="preset-pill">
                        <strong>Ø 50</strong> wastafel
                      </button>
                      <button type="button" onClick={() => handleApplyPreset(60, 60)} className="preset-pill">
                        <strong>Ø 60</strong> kamar mandi
                      </button>
                      <button type="button" onClick={() => handleApplyPreset(80, 80)} className="preset-pill">
                        <strong>Ø 80</strong> rias
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" onClick={() => handleApplyPreset(50, 70)} className="preset-pill">
                        <strong>50×70</strong> wastafel
                      </button>
                      <button type="button" onClick={() => handleApplyPreset(60, 80)} className="preset-pill">
                        <strong>60×80</strong> kamar mandi
                      </button>
                      <button type="button" onClick={() => handleApplyPreset(60, 160)} className="preset-pill">
                        <strong>60×160</strong> badan penuh
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Kartu 03: Lampu dan Kontrol */}
            <div className="control-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span className="badge-num">03</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>Lampu dan kontrol</span>
              </div>

              {/* Pilihan Lampu */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    onUserInteraction();
                    setLed('3_warna');
                  }}
                  aria-pressed={led === '3_warna'}
                  className={`feature-box ${led === '3_warna' ? 'selected' : ''}`}
                >
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>LED 3 warna</span>
                  <span style={{ fontSize: '12px', color: '#9FB0C8', marginTop: '2px' }}>
                    Hangat, natural, putih dalam satu cermin
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onUserInteraction();
                    setLed('1_warna');
                  }}
                  aria-pressed={led === '1_warna'}
                  className={`feature-box ${led === '1_warna' ? 'selected' : ''}`}
                >
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>LED 1 warna</span>
                  <span style={{ fontSize: '12px', color: '#9FB0C8', marginTop: '2px' }}>
                    Satu warna pilihanmu
                  </span>
                </button>
              </div>

              {/* Pilihan Kontrol */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    onUserInteraction();
                    setCtrl('touchscreen');
                  }}
                  aria-pressed={ctrl === 'touchscreen'}
                  className={`feature-box ${ctrl === 'touchscreen' ? 'selected' : ''}`}
                >
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>Touchscreen</span>
                  <span style={{ fontSize: '12px', color: '#9FB0C8', marginTop: '2px' }}>
                    Sentuh untuk nyala dan ganti warna
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onUserInteraction();
                    setCtrl('sensor_baterai');
                  }}
                  aria-pressed={ctrl === 'sensor_baterai'}
                  className={`feature-box ${ctrl === 'sensor_baterai' ? 'selected' : ''}`}
                >
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>Sensor tangan</span>
                  <span style={{ fontSize: '12px', color: '#9FB0C8', marginTop: '2px' }}>
                    Pakai baterai, tanpa colokan
                  </span>
                </button>
              </div>

              {/* Checkbox Antifog */}
              <button
                type="button"
                onClick={() => {
                  onUserInteraction();
                  setFog(!fog);
                }}
                aria-pressed={fog}
                className={`antifog-check-btn ${fog ? 'selected' : ''}`}
                style={{ marginTop: '10px' }}
              >
                <span className={`check-box-indicator ${fog ? 'active' : ''}`}>
                  {fog && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#06301A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                    Tambah antifog
                  </div>
                  <div style={{ fontSize: '12px', color: '#9FB0C8', marginTop: '2px' }}>
                    Kaca tetap jernih setelah mandi air panas
                  </div>
                </div>
              </button>
            </div>

            {/* Kartu 04: Kota Tujuan */}
            <div className="control-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span className="badge-num">04</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>Kota tujuan</span>
              </div>
              <input
                type="text"
                placeholder="contoh: Surabaya, atau ambil sendiri"
                value={city}
                onChange={(e) => {
                  onUserInteraction();
                  setCity(e.target.value);
                }}
                className="fld"
              />
            </div>

            {/* Kartu RANCANGANMU */}
            <div
              style={{
                borderRadius: '16px',
                background: '#0F1528',
                border: '1.5px solid #26314F',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', color: '#9CCFC2', textTransform: 'uppercase' }}>
                RANCANGANMU
              </span>

              <h3
                className="disp"
                aria-live="polite"
                style={{ margin: 0, fontSize: '32px', color: '#FFFFFF', lineHeight: 1.1 }}
              >
                {curShapeObj.label.toLowerCase()} {dimDisplay}
              </h3>

              <p style={{ margin: 0, fontSize: '14px', color: '#C9D2E0', lineHeight: 1.5 }}>
                {specSummary}
              </p>

              {/* Tombol Hijau 56px */}
              <a
                className="wa"
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleSendWhatsApp}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  height: '56px',
                  borderRadius: '12px',
                  background: '#25D366',
                  color: '#06301A',
                  fontWeight: 700,
                  fontSize: '16px',
                  textDecoration: 'none',
                  marginTop: '6px',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#06301A" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
                </svg>
                Kirim rancangan, minta harga
              </a>

              <p style={{ margin: 0, fontSize: '12px', color: '#9FB0C8', textAlign: 'center', lineHeight: 1.5 }}>
                Admin balas dengan harga final dan PDF penawaran. Belum ada kewajiban beli.
              </p>

              {/* Garis putus-putus dan baris gambaran harga */}
              <div style={{ borderTop: '1px dashed rgba(255,255,255,0.18)', marginTop: '4px' }} />

              <p style={{ margin: 0, fontSize: '12px', color: '#8A97A8', lineHeight: 1.5 }}>
                {GAMBARAN_HARGA_CONTOH.teks}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .rancang-container {
          display: grid;
          grid-template-columns: minmax(0, 1.18fr) minmax(0, 0.82fr);
          gap: 40px;
          align-items: start;
        }

        .rancang-preview-col {
          position: sticky;
          top: 24px;
        }

        .rancang-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .color-temp-btn,
        .lamp-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 40px;
          padding: 0 14px;
          border-radius: 999px;
          border: 1.5px solid rgba(191, 203, 217, 0.35);
          background: rgba(255, 255, 255, 0.03);
          color: #ffffff;
          font: 600 13px 'Plus Jakarta Sans', system-ui, sans-serif;
          cursor: pointer;
          transition: background 200ms ease-out, border-color 200ms ease-out;
        }

        .color-temp-btn:hover,
        .lamp-toggle-btn:hover {
          border-color: rgba(156, 207, 194, 0.7);
        }

        .color-temp-btn.selected {
          border-color: #9ccfc2;
          background: rgba(156, 207, 194, 0.14);
        }

        .lamp-toggle-btn.selected {
          border-color: #ffc98a;
          color: #ffe9c7;
        }

        .color-temp-btn:focus-visible,
        .lamp-toggle-btn:focus-visible {
          outline: 3px solid #6e9be0;
          outline-offset: 3px;
        }

        .control-card {
          background: #0F1528;
          border: 1.5px solid #26314F;
          border-radius: 14px;
          padding: 20px;
        }

        .badge-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 2px 7px;
          border-radius: 6px;
          background: rgba(156, 207, 194, 0.15);
          color: #9CCFC2;
          font-size: 11px;
          font-weight: 800;
        }

        .shape-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .shape-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 14px 6px;
          border-radius: 10px;
          border: 1.5px solid rgba(191, 203, 217, 0.25);
          background: rgba(255, 255, 255, 0.02);
          color: #FFFFFF;
          cursor: pointer;
          font-family: inherit;
          transition: all 200ms ease;
        }

        .shape-btn.selected,
        .feature-box.selected,
        .antifog-check-btn.selected {
          border-color: #9CCFC2 !important;
          background: rgba(156, 207, 194, 0.12) !important;
        }

        .input-with-suffix {
          position: relative;
          display: flex;
          align-items: center;
        }

        .fld-inner {
          width: 100%;
          min-height: 48px;
          padding: 0 42px 0 14px;
          border-radius: 10px;
          border: 1.5px solid #3A4766;
          background: #141C33;
          color: #FFFFFF;
          font: 600 16px 'Plus Jakarta Sans', system-ui, sans-serif;
        }

        .fld-inner:focus {
          border-color: #6E9BE0;
          outline: none;
        }

        .input-suffix {
          position: absolute;
          right: 14px;
          font-size: 14px;
          color: #9FB0C8;
          font-weight: 600;
          pointer-events: none;
        }

        .preset-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid rgba(191, 203, 217, 0.25);
          background: rgba(255, 255, 255, 0.03);
          color: #D5DCE8;
          font-size: 12px;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 150ms ease;
        }

        .preset-pill:hover {
          border-color: #9CCFC2;
        }

        .feature-box {
          display: flex;
          flex-direction: column;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1.5px solid rgba(191, 203, 217, 0.25);
          background: rgba(255, 255, 255, 0.02);
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          transition: all 200ms ease;
        }

        .antifog-check-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1.5px solid rgba(191, 203, 217, 0.25);
          background: rgba(255, 255, 255, 0.02);
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          transition: all 200ms ease;
        }

        .check-box-indicator {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          border: 1.5px solid #3A4766;
          background: #141C33;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .check-box-indicator.active {
          background: #9CCFC2;
          border-color: #9CCFC2;
        }

        .measure-text {
          font-size: 7px;
        }

        @media (max-width: 860px) {
          .rancang-container {
            grid-template-columns: minmax(0, 1fr) !important;
            gap: 10px !important;
          }

          .control-card {
            padding: 10px !important;
          }

          .shape-btn {
            padding: 6px 4px !important;
            gap: 3px !important;
          }

          .shape-btn svg {
            width: 18px !important;
            height: 24px !important;
          }

          .fld-inner {
            min-height: 38px !important;
            padding: 0 34px 0 10px !important;
            font-size: 14px !important;
          }

          .feature-box {
            padding: 6px 8px !important;
          }

          .antifog-check-btn {
            padding: 6px 8px !important;
          }
          .rancang-preview-col {
            position: sticky;
            top: 8px;
            z-index: 20;
          }

          .pv-hint {
            display: none !important;
          }

          .shape-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 6px !important;
          }

          .lamp-btn-text {
            display: none !important;
          }

          .measure-text {
            font-size: 10px !important;
          }
        }
      `}</style>
    </section>
  );
}
