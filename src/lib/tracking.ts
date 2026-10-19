/**
 * Pelacakan UTM, Pixel (Meta, TikTok, GA4) dan Pembuat Link WhatsApp
 * Bebas PII (hanya menyimpan kode sumber lead)
 */

import { PHONE_NUMBER } from './constants';
import { getAllVariants } from './experiments';

export type LeadSourceCode = 'LP-META' | 'LP-TIKTOK' | 'LP-IG' | 'LP-GOOGLE' | 'LP-LANGSUNG';

const STORAGE_KEY = 'pg_utm_source_code';

const META_SOURCES = new Set(['facebook', 'fb', 'meta', 'facebook_ads', 'fb_ads', 'messenger', 'an']);
const IG_SOURCES = new Set(['instagram', 'ig', 'instagram_ads', 'ig_ads']);
const TIKTOK_SOURCES = new Set(['tiktok', 'tt', 'tiktok_ads', 'tt_ads']);
const GOOGLE_SOURCES = new Set(['google', 'adwords', 'google_ads', 'gads', 'youtube']);

export function resolveLeadSource(urlOrSearch?: string): LeadSourceCode {
  if (typeof window === 'undefined' && urlOrSearch === undefined) return 'LP-LANGSUNG';

  try {
    const search = urlOrSearch !== undefined ? urlOrSearch : window.location.search;
    const params = new URLSearchParams(search);
    const source = (params.get('utm_source') || '').toLowerCase().trim();
    const medium = (params.get('utm_medium') || '').toLowerCase().trim();

    // Instagram dicek sebelum Meta, karena iklan IG juga lewat Meta Ads.
    if (IG_SOURCES.has(source)) return 'LP-IG';
    if (META_SOURCES.has(source) || medium === 'fb_ads' || medium === 'paid_social_meta') return 'LP-META';
    if (TIKTOK_SOURCES.has(source) || medium === 'tt_ads') return 'LP-TIKTOK';
    if (GOOGLE_SOURCES.has(source) || params.has('gclid')) return 'LP-GOOGLE';
    if (params.has('fbclid')) return 'LP-META';
    if (params.has('ttclid')) return 'LP-TIKTOK';
  } catch {
    // abaikan URL rusak
  }

  return 'LP-LANGSUNG';
}

export function initUtmTracking(): LeadSourceCode {
  if (typeof window === 'undefined') return 'LP-LANGSUNG';

  try {
    const detected = resolveLeadSource();
    const existing = window.sessionStorage.getItem(STORAGE_KEY) as LeadSourceCode | null;
    // Kunjungan tanpa UTM tidak boleh menimpa sumber iklan yang sudah tercatat di sesi ini.
    if (existing && detected === 'LP-LANGSUNG') {
      return existing;
    }

    window.sessionStorage.setItem(STORAGE_KEY, detected);
    return detected;
  } catch {
    return 'LP-LANGSUNG';
  }
}

export function getStoredLeadSource(): LeadSourceCode {
  if (typeof window === 'undefined') return 'LP-LANGSUNG';
  try {
    const val = window.sessionStorage.getItem(STORAGE_KEY) as LeadSourceCode | null;
    if (val) return val;
    return initUtmTracking();
  } catch {
    return 'LP-LANGSUNG';
  }
}

/**
 * Buat link WhatsApp dengan format nomor 6281237533173 dan kode sumber UTM
 */
export function buildWhatsAppLink(pesan: string, sourceOverride?: LeadSourceCode): string {
  const code = sourceOverride || getStoredLeadSource();
  const textWithCode = `${pesan}\nKode: ${code}`;
  return `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(textWithCode)}`;
}

// ==========================================
// Pelacakan Pixel & Analytics
// ==========================================

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: {
      track: (event: string, params?: Record<string, unknown>) => void;
      page: () => void;
    };
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    clarity?: (...args: unknown[]) => void;
  }
}

/**
 * Satu pintu untuk semua event funnel. Meta/TikTok/GA4 dikirim sekaligus,
 * selalu disertai kode sumber lead dan varian eksperimen aktif supaya laporan
 * bisa dipecah per kanal iklan dan per varian tanpa join manual.
 */
export function trackEvent(
  name: string,
  params: Record<string, unknown> = {},
  standard: { meta?: string; tiktok?: string } = {},
) {
  if (typeof window === 'undefined') return;
  try {
    const payload = {
      ...params,
      lead_code: getStoredLeadSource(),
      ...getAllVariants(),
    };

    if (window.fbq) {
      if (standard.meta) window.fbq('track', standard.meta, payload);
      else window.fbq('trackCustom', name, payload);
    }
    if (window.ttq?.track) {
      window.ttq.track(standard.tiktok || name, payload);
    }
    if (window.gtag && process.env.NEXT_PUBLIC_GA_ID) {
      window.gtag('event', name, payload);
    }
    if (window.clarity) {
      window.clarity('event', name);
    }
  } catch {
    // no-op
  }
}

export function trackViewContent(sectionName: string = 'konfigurator') {
  trackEvent('view_item', { item_name: sectionName, content_name: sectionName }, { meta: 'ViewContent', tiktok: 'ViewContent' });
}

export function trackConfiguratorStart() {
  trackEvent('configurator_start');
}

export function trackConfiguratorSend() {
  trackEvent('configurator_send');
}

// ==========================================
// Instrumentasi funnel: kedalaman scroll & waktu tinggal
// ==========================================

const SCROLL_MILESTONES = [25, 50, 75, 100] as const;
const DWELL_MILESTONES_MS = [30_000, 90_000] as const;

/**
 * Pasang pengukur scroll-depth dan dwell-time. Keduanya dikirim sekali saja per
 * sesi halaman. Mengembalikan fungsi pembersih untuk dipanggil saat unmount.
 */
export function initFunnelTelemetry(): () => void {
  if (typeof window === 'undefined') return () => {};

  const firedScroll = new Set<number>();
  let ticking = false;

  const measure = () => {
    ticking = false;
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    const percent = scrollable <= 0 ? 100 : ((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100;

    for (const milestone of SCROLL_MILESTONES) {
      if (percent >= milestone && !firedScroll.has(milestone)) {
        firedScroll.add(milestone);
        trackEvent('scroll_depth', { percent_scrolled: milestone });
      }
    }

    if (firedScroll.size === SCROLL_MILESTONES.length) {
      window.removeEventListener('scroll', onScroll);
    }
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(measure);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  measure();

  const timers = DWELL_MILESTONES_MS.map((ms) =>
    window.setTimeout(() => trackEvent('dwell_time', { seconds: ms / 1000 }), ms),
  );

  return () => {
    window.removeEventListener('scroll', onScroll);
    timers.forEach((id) => window.clearTimeout(id));
  };
}

export function trackLeadClick(sourceButton: string) {
  trackEvent('generate_lead', { button_source: sourceButton, source_button: sourceButton }, { meta: 'Lead', tiktok: 'Contact' });
}
