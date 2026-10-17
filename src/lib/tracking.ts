/**
 * Pelacakan UTM, Pixel (Meta, TikTok, GA4) dan Pembuat Link WhatsApp
 * Bebas PII (hanya menyimpan kode sumber lead)
 */

import { PHONE_NUMBER } from './constants';

export type LeadSourceCode = 'LP-META' | 'LP-TIKTOK' | 'LP-IG' | 'LP-GOOGLE' | 'LP-LANGSUNG';

const STORAGE_KEY = 'pg_utm_source_code';

export function resolveLeadSource(urlOrSearch?: string): LeadSourceCode {
  if (typeof window === 'undefined') return 'LP-LANGSUNG';

  try {
    const search = urlOrSearch !== undefined ? urlOrSearch : window.location.search;
    const params = new URLSearchParams(search);
    const utmSource = (params.get('utm_source') || '').toLowerCase().trim();
    const utmMedium = (params.get('utm_medium') || '').toLowerCase().trim();

    if (utmSource.includes('meta') || utmSource.includes('fb') || utmSource.includes('facebook') || utmMedium.includes('fb_ads')) {
      return 'LP-META';
    }
    if (utmSource.includes('tiktok') || utmMedium.includes('tt_ads')) {
      return 'LP-TIKTOK';
    }
    if (utmSource.includes('instagram') || utmSource.includes('ig')) {
      return 'LP-IG';
    }
    if (utmSource.includes('google') || utmSource.includes('adwords') || utmMedium.includes('cpc')) {
      return 'LP-GOOGLE';
    }
  } catch {
    // fallback
  }

  return 'LP-LANGSUNG';
}

export function initUtmTracking(): LeadSourceCode {
  if (typeof window === 'undefined') return 'LP-LANGSUNG';

  try {
    const existing = window.sessionStorage.getItem(STORAGE_KEY) as LeadSourceCode | null;
    if (existing) {
      return existing;
    }

    const detected = resolveLeadSource();
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
  }
}

export function trackPageView() {
  if (typeof window === 'undefined') return;
  try {
    if (window.fbq) window.fbq('track', 'PageView');
    if (window.ttq?.page) window.ttq.page();
    if (window.gtag && process.env.NEXT_PUBLIC_GA_ID) {
      window.gtag('event', 'page_view', { page_path: window.location.pathname });
    }
  } catch {
    // no-op
  }
}

export function trackViewContent(sectionName: string = 'konfigurator') {
  if (typeof window === 'undefined') return;
  try {
    if (window.fbq) {
      window.fbq('track', 'ViewContent', { content_name: sectionName });
    }
    if (window.ttq?.track) {
      window.ttq.track('ViewContent', { content_name: sectionName });
    }
    if (window.gtag && process.env.NEXT_PUBLIC_GA_ID) {
      window.gtag('event', 'view_item', { item_name: sectionName });
    }
  } catch {
    // no-op
  }
}

export function trackConfiguratorStart() {
  if (typeof window === 'undefined') return;
  try {
    if (window.fbq) {
      window.fbq('trackCustom', 'configurator_start');
    }
    if (window.ttq?.track) {
      window.ttq.track('configurator_start');
    }
    if (window.gtag && process.env.NEXT_PUBLIC_GA_ID) {
      window.gtag('event', 'configurator_start');
    }
  } catch {
    // no-op
  }
}
export function trackConfiguratorSend() {
  if (typeof window === 'undefined') return;
  try {
    if (window.fbq) {
      window.fbq('trackCustom', 'configurator_send');
    }
    if (window.ttq?.track) {
      window.ttq.track('configurator_send');
    }
    if (window.gtag && process.env.NEXT_PUBLIC_GA_ID) {
      window.gtag('event', 'configurator_send');
    }
  } catch {
    // no-op
  }
}


export function trackLeadClick(sourceButton: string) {
  if (typeof window === 'undefined') return;
  try {
    const leadCode = getStoredLeadSource();
    if (window.fbq) {
      window.fbq('track', 'Lead', {
        button_source: sourceButton,
        lead_code: leadCode,
      });
    }
    if (window.ttq?.track) {
      window.ttq.track('Contact', {
        button_source: sourceButton,
        lead_code: leadCode,
      });
    }
    if (window.gtag && process.env.NEXT_PUBLIC_GA_ID) {
      window.gtag('event', 'generate_lead', {
        source_button: sourceButton,
        lead_code: leadCode,
      });
    }
  } catch {
    // no-op
  }
}
