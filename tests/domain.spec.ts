import { test, expect } from '@playwright/test';
import { normalizeWhatsapp, validateLeadForm, validateLeadPayload, submitLead } from '../src/lib/lead';
import { resolveLeadSource } from '../src/lib/tracking';
import { validateCatalog } from '../scripts/catalog-schema.cjs';
import catalog from '../src/data/products.json';
import images from '../src/data/images-meta.json';
const input={model:'Rectangle',panjangCm:60,lebarCm:80,nama:'Pengujian',whatsapp:'081234567890'};
test('lead normalization and distinct form boundaries',()=>{
  expect(normalizeWhatsapp('0812-3456-7890')).toBe('6281234567890'); expect(normalizeWhatsapp('123')).toBeNull();
  expect(validateLeadForm(input).ok).toBe(true); expect(validateLeadForm({...input,panjangCm:20}).ok).toBe(true);
  expect(validateLeadForm({...input,panjangCm:19}).ok).toBe(false); expect(validateLeadForm({...input,lebarCm:300}).ok).toBe(true);
  expect(validateLeadForm({...input,lebarCm:301}).ok).toBe(false); expect(validateLeadForm({...input,lebarCm:80.5}).ok).toBe(false);
  const parsed=validateLeadPayload({...input,lead_code:'LP-META',unknown:'discard'}); expect(parsed.ok).toBe(true); if(parsed.ok){expect(parsed.data.whatsapp).toBe('6281234567890');expect(parsed.data).not.toHaveProperty('unknown');}
});
test('UTM maps supported channels',()=>{
  for(const [source,expected] of [['facebook','LP-META'],['instagram','LP-IG'],['tiktok','LP-TIKTOK'],['google','LP-GOOGLE'],['unknown','LP-LANGSUNG']]) expect(resolveLeadSource('?utm_source='+source)).toBe(expected);
});
test('endpoint absence, error and timeout preserve WhatsApp fallback',async()=>{
  const original=process.env.NEXT_PUBLIC_LEAD_ENDPOINT, originalFetch=global.fetch;
  const payload={...input,lead_code:'LP-META'};
  try {
    delete process.env.NEXT_PUBLIC_LEAD_ENDPOINT; expect((await submitLead(payload)).delivered).toBe('whatsapp');
    process.env.NEXT_PUBLIC_LEAD_ENDPOINT='https://example.invalid/test';
    global.fetch=async()=>new Response('',{status:500}); expect(await submitLead(payload)).toEqual({ok:false,delivered:'whatsapp',error:'http_500'});
    global.fetch=async()=>{throw new DOMException('Timeout','AbortError');}; expect(await submitLead(payload)).toEqual({ok:false,delivered:'whatsapp',error:'timeout'});
  } finally {global.fetch=originalFetch;if(original===undefined)delete process.env.NEXT_PUBLIC_LEAD_ENDPOINT;else process.env.NEXT_PUBLIC_LEAD_ENDPOINT=original;}
});
test('catalog rejects duplicates, invented verification and unsupported models',()=>{
  expect(()=>validateCatalog(catalog,images)).not.toThrow();
  expect(()=>validateCatalog([...catalog,catalog[0]],images)).toThrow(/Duplicate/);
  expect(()=>validateCatalog([{...catalog[0],verifiedPrice:100}],images)).toThrow(/verification date/);
  expect(()=>validateCatalog([{...catalog[0],model:{tier:'A',kind:'glb',note:'unreviewed'}}],images)).toThrow(/reviewed/);
  expect(()=>validateCatalog([{...catalog[0],image:'missing'}],images)).toThrow(/image/);
  expect(()=>validateCatalog([{...catalog[0],verifiedSourceUrl:'https://tokopedia.com/another-store/item',lastVerifiedAt:'2026-10-20'}],images)).toThrow(/designated/);
});
