'use client';

import { useEffect } from 'react';
import { initUtmTracking } from '../lib/tracking';

/**
 * Menyimpan kode sumber iklan (UTM) sekali saat halaman dibuka, lalu
 * memperbarui semua link WhatsApp yang di-render statis dengan kode itu.
 * PageView sudah dikirim oleh skrip pixel di layout; jangan kirim dua kali.
 */
export function ClientInit() {
  useEffect(() => {
    const code = initUtmTracking();
    if (code === 'LP-LANGSUNG') return;

    const from = encodeURIComponent('Kode: LP-LANGSUNG');
    const to = encodeURIComponent(`Kode: ${code}`);
    document.querySelectorAll<HTMLAnchorElement>('a[href^="https://wa.me/"]').forEach((a) => {
      if (a.href.includes(from)) a.href = a.href.replace(from, to);
    });
  }, []);

  return null;
}
