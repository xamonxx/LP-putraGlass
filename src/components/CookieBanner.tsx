'use client';

import React, { useEffect, useState } from 'react';

const KEY = 'pg_cookie_consent';

function revokeTracking() {
  try {
    window.fbq?.('consent', 'revoke');
  } catch {
    // no-op
  }
  try {
    (window.ttq as unknown as { revokeConsent?: () => void } | undefined)?.revokeConsent?.();
  } catch {
    // no-op
  }
  try {
    window.gtag?.('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  } catch {
    // no-op
  }
}

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      // Penyimpanan diblokir: jangan tampilkan banner berulang-ulang.
    }
  }, []);

  const save = (value: 'granted' | 'denied') => {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      // no-op
    }
    if (value === 'denied') revokeTracking();
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="cookie-bar" role="region" aria-label="Pemberitahuan cookie">
      <p>
        Kami memakai cookie Meta, TikTok, dan Google untuk mengukur iklan. Situs ini tidak meminta nama, nomor, atau data
        pribadi lain.
      </p>
      <div className="cookie-actions">
        <button type="button" className="cookie-no" onClick={() => save('denied')}>
          Tolak
        </button>
        <button type="button" className="cookie-ok" onClick={() => save('granted')}>
          Oke
        </button>
      </div>

      <style jsx>{`
        .cookie-bar {
          position: fixed;
          left: 20px;
          bottom: 20px;
          z-index: 95;
          max-width: 460px;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 14px 12px 18px;
          border-radius: 14px;
          background: rgba(15, 21, 40, 0.96);
          border: 1px solid #3a4766;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        p {
          margin: 0;
          font-size: 12.5px;
          line-height: 1.45;
          color: #d5dce8;
        }
        .cookie-actions {
          display: flex;
          gap: 6px;
          flex-shrink: 0;
        }
        button {
          min-height: 36px;
          padding: 0 14px;
          border-radius: 9px;
          font: 700 13px 'Plus Jakarta Sans', system-ui, sans-serif;
          cursor: pointer;
        }
        .cookie-ok {
          background: #9ccfc2;
          color: #06301a;
          border: none;
        }
        .cookie-no {
          background: transparent;
          color: #c9d2e0;
          border: 1px solid #3a4766;
        }
        button:focus-visible {
          outline: 3px solid #6e9be0;
          outline-offset: 2px;
        }
        @media (max-width: 860px) {
          .cookie-bar {
            left: 12px;
            right: 12px;
            bottom: 88px;
            max-width: none;
            padding: 10px 10px 10px 14px;
          }
          p {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
