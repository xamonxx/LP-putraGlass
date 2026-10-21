'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LEGACY_PAGE_PATHS } from '../lib/site-pages';
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
  const pathname = usePathname();
  useEffect(() => {
    if (pathname !== '/') return;
    const redirect = () => {
      const fragment = window.location.hash.slice(1);
      const path = Object.hasOwn(LEGACY_PAGE_PATHS, fragment) ? LEGACY_PAGE_PATHS[fragment] : undefined;
      // An incoming legacy anchor starts with the homepage's server metadata.
      // Load destination HTML so early hydration cannot retain that canonical.
      if (path) window.location.replace(path + window.location.search);
    };
    redirect();
    window.addEventListener('hashchange', redirect);
    return () => window.removeEventListener('hashchange', redirect);
  }, [pathname]);
  useEffect(() => {
    document.documentElement.dataset.hydrated = 'true';
    const code = initUtmTracking();

    if (code !== 'LP-LANGSUNG') {
      const from = encodeURIComponent('Kode: LP-LANGSUNG');
      const to = encodeURIComponent(`Kode: ${code}`);
      document.querySelectorAll<HTMLAnchorElement>('a[href^="https://wa.me/"]').forEach((a) => {
        if (a.href.includes(from)) a.href = a.href.replace(from, to);
      });
    }

    // Satu event pembuka berisi dimensi varian, supaya laporan A/B punya denominator.
    const exposure = () => {
      try { if (localStorage.getItem('pg_cookie_consent') === 'granted') queueMicrotask(() => trackEvent('experiment_exposure', getAllVariants())); } catch { /* Consent defaults to denied. */ }
    };
    exposure();
    window.addEventListener('pg:consent', exposure);

    const cleanup = initFunnelTelemetry();
    return () => { cleanup(); window.removeEventListener('pg:consent', exposure); };
  }, []);

  return null;
}
