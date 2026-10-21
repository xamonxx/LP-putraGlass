'use client';
import type { ReactNode } from 'react';
import { buildWhatsAppLink, getStoredLeadSource, trackLeadClick, trackEvent } from '../lib/tracking';
export function QuoteLink({ children = 'Konsultasi & penawaran', message = 'Halo Putra Glass, saya mau konsultasi cermin LED custom.', source = 'consultation', className }: { children?: ReactNode; message?: string; source?: string; className?: string }) {
  return <a className={className} href={buildWhatsAppLink(message, 'LP-LANGSUNG')} target="_blank" rel="noopener noreferrer" onClick={e => { e.currentTarget.href = buildWhatsAppLink(message, getStoredLeadSource()); trackLeadClick(source); trackEvent('whatsapp_click', { source }); }}>{children}</a>;
}