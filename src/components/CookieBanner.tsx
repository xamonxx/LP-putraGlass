'use client';

import React, { useState, useEffect } from 'react';

export function CookieBanner() {
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem('pg_cookie_consent');
      if (!dismissed) {
        setShow(true);
      }
    } catch {
      // no-op
    }
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem('pg_cookie_consent', 'true');
    } catch {
      // no-op
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Pemberitahuan privasi dan cookie"
      style={{
        position: 'fixed',
        left: '20px',
        bottom: '80px',
        maxWidth: '380px',
        zIndex: 95,
        borderRadius: '14px',
        background: 'rgba(20, 28, 51, 0.95)',
        border: '1.5px solid #3A4766',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        padding: '16px 20px',
        boxShadow: '0 12px 36px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: '#D5DCE8' }}>
        Sesuai UU PDP, situs ini hanya menyimpan kode sumber rujukan iklan dan preferensi tanpa mengumpulkan data pribadi pengunjung.
      </p>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={handleDismiss}
          style={{
            padding: '6px 14px',
            borderRadius: '8px',
            background: '#9CCFC2',
            color: '#06301A',
            border: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Mengerti
        </button>
      </div>
    </div>
  );
}
