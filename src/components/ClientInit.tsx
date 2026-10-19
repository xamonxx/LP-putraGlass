'use client';

import { useEffect } from 'react';
import { initUtmTracking, initFunnelTelemetry, trackEvent } from '../lib/tracking';
import { getAllVariants } from '../lib/experiments';

/**
 * Menyimpan kode sumber iklan (UTM) sekali saat halaman dibuka, lalu
 * memperbarui semua link WhatsApp yang di-render statis dengan kode itu.
 * PageView sudah dikirim oleh skrip pixel di layout; jangan kirim dua kali.
 * Di sini juga dipasang telemetri funnel (scroll depth + dwell time) dan
 * pencatatan varian eksperimen aktif.
 */
export function ClientInit() {
  useEffect(() => {
    const code = initUtmTracking();

    if (code !== 'LP-LANGSUNG') {
      const from = encodeURIComponent('Kode: LP-LANGSUNG');
      const to = encodeURIComponent(`Kode: ${code}`);
      document.querySelectorAll<HTMLAnchorElement>('a[href^="https://wa.me/"]').forEach((a) => {
        if (a.href.includes(from)) a.href = a.href.replace(from, to);
      });
    }

    // Satu event pembuka berisi dimensi varian, supaya laporan A/B punya denominator.
    trackEvent('experiment_exposure', getAllVariants());

    return initFunnelTelemetry();
  }, []);

  return null;
}
