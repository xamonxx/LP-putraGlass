/**
 * Worker penerima lead landing page Putra Glass.
 *
 * Landing page-nya static export, jadi tidak punya server sendiri. Worker ini
 * yang menerima POST dari form, memvalidasi ulang isinya, menahan spam per IP,
 * menyimpan lead ke KV, lalu (opsional) mengirim notifikasi ke Telegram admin.
 *
 * Tidak ada dependency npm: hanya API bawaan Workers, supaya `wrangler deploy`
 * jalan tanpa langkah build tambahan.
 */

// ==========================================
// Tipe lingkungan (minimal, tanpa @cloudflare/workers-types)
// ==========================================

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  list(options?: { prefix?: string; limit?: number }): Promise<{ keys: { name: string }[] }>;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
}

export interface Env {
  LEADS_KV: KVNamespace;
  /** Daftar origin yang boleh, dipisah koma. Contoh: `https://putraglass.id,https://www.putraglass.id` */
  ALLOWED_ORIGIN?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
}

// ==========================================
// Aturan
// ==========================================

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_S = 600; // 10 menit
/** Lead disimpan 1 tahun; setelah itu sudah pindah ke aplikasi CS. */
const LEAD_TTL_S = 60 * 60 * 24 * 365;

const PHONE_MIN_DIGITS = 9;
const PHONE_MAX_DIGITS = 15;

interface LeadPayload {
  nama: string;
  whatsapp: string;
  model: string;
  panjangCm: number;
  lebarCm: number;
  catatan?: string;
  lead_code: string;
  varian?: Record<string, string>;
  utm?: Record<string, string>;
}

// ==========================================
// Validasi (disalin sengaja dari src/lib/lead.ts — worker harus berdiri sendiri)
// ==========================================

function normalizeWhatsapp(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  let digits = raw.replace(/\D+/g, '');
  if (!digits) return null;
  if (digits.startsWith('62')) digits = digits.slice(2);
  else if (digits.startsWith('0')) digits = digits.replace(/^0+/, '');
  if (!digits.startsWith('8')) return null;
  if (digits.length < PHONE_MIN_DIGITS || digits.length > PHONE_MAX_DIGITS) return null;
  return `62${digits}`;
}

function bersihkanTeks(nilai: unknown, maks: number): string {
  if (typeof nilai !== 'string') return '';
  // Buang karakter kontrol supaya tidak merusak notifikasi dan log.
  return nilai.replace(/[\u0000-\u001F\u007F]+/g, ' ').trim().slice(0, maks);
}

function bersihkanPeta(nilai: unknown, maksKunci: number): Record<string, string> | undefined {
  if (!nilai || typeof nilai !== 'object' || Array.isArray(nilai)) return undefined;
  const out: Record<string, string> = {};
  let n = 0;
  for (const [k, v] of Object.entries(nilai as Record<string, unknown>)) {
    if (n >= maksKunci) break;
    const kunci = bersihkanTeks(k, 40);
    const isi = bersihkanTeks(v, 120);
    if (kunci && isi) {
      out[kunci] = isi;
      n += 1;
    }
  }
  return n > 0 ? out : undefined;
}

type HasilValidasi = { ok: true; data: LeadPayload } | { ok: false; error: string };

function validasiLead(body: unknown): HasilValidasi {
  if (!body || typeof body !== 'object') return { ok: false, error: 'body_bukan_objek' };
  const raw = body as Record<string, unknown>;

  const nama = bersihkanTeks(raw.nama, 60);
  if (nama.length < 2) return { ok: false, error: 'nama_tidak_valid' };

  const whatsapp = normalizeWhatsapp(raw.whatsapp);
  if (!whatsapp) return { ok: false, error: 'whatsapp_tidak_valid' };

  const model = bersihkanTeks(raw.model, 80);
  if (!model) return { ok: false, error: 'model_kosong' };

  const panjangCm = Number(raw.panjangCm);
  const lebarCm = Number(raw.lebarCm);
  for (const ukuran of [panjangCm, lebarCm]) {
    if (!Number.isInteger(ukuran) || ukuran < 20 || ukuran > 300) {
      return { ok: false, error: 'ukuran_tidak_valid' };
    }
  }

  const catatan = bersihkanTeks(raw.catatan, 400);
  const leadCode = bersihkanTeks(raw.lead_code, 32) || 'LP-LANGSUNG';

  return {
    ok: true,
    data: {
      nama,
      whatsapp,
      model,
      panjangCm,
      lebarCm,
      catatan: catatan || undefined,
      lead_code: leadCode,
      varian: bersihkanPeta(raw.varian, 10),
      utm: bersihkanPeta(raw.utm, 10),
    },
  };
}

// ==========================================
// CORS
// ==========================================

function daftarOrigin(env: Env): string[] {
  return (env.ALLOWED_ORIGIN || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
}

function headerCors(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get('Origin') || '';
  const allow = daftarOrigin(env);
  const cocok = allow.includes('*') ? '*' : allow.includes(origin) ? origin : '';

  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
  if (cocok) headers['Access-Control-Allow-Origin'] = cocok;
  return headers;
}

function jsonResponse(
  data: Record<string, unknown>,
  status: number,
  cors: Record<string, string>,
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors },
  });
}

// ==========================================
// Rate limit per IP
// ==========================================

interface JendelaRate {
  n: number;
  /** Epoch detik saat jendela berakhir. */
  reset: number;
}

async function lewatRateLimit(env: Env, ip: string): Promise<boolean> {
  const key = `rl:${ip}`;
  const sekarang = Math.floor(Date.now() / 1000);

  let jendela: JendelaRate = { n: 0, reset: sekarang + RATE_LIMIT_WINDOW_S };
  const tersimpan = await env.LEADS_KV.get(key);
  if (tersimpan) {
    try {
      const parsed = JSON.parse(tersimpan) as JendelaRate;
      if (parsed && typeof parsed.n === 'number' && typeof parsed.reset === 'number' && parsed.reset > sekarang) {
        jendela = parsed;
      }
    } catch {
      // Nilai rusak — mulai jendela baru.
    }
  }

  if (jendela.n >= RATE_LIMIT_MAX) return false;

  jendela.n += 1;
  const sisa = Math.max(jendela.reset - sekarang, 60); // KV minimal 60 detik
  await env.LEADS_KV.put(key, JSON.stringify(jendela), { expirationTtl: sisa });
  return true;
}

// ==========================================
// Notifikasi Telegram (opsional)
// ==========================================

function escapeHtml(teks: string): string {
  return teks.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function kirimTelegram(env: Env, lead: LeadPayload, key: string): Promise<void> {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return;

  const baris = [
    '<b>Lead baru dari landing page</b>',
    `Nama: ${escapeHtml(lead.nama)}`,
    `WhatsApp: <a href="https://wa.me/${lead.whatsapp}">+${escapeHtml(lead.whatsapp)}</a>`,
    `Model: ${escapeHtml(lead.model)}`,
    `Ukuran: ${lead.panjangCm} x ${lead.lebarCm} cm`,
  ];
  if (lead.catatan) baris.push(`Catatan: ${escapeHtml(lead.catatan)}`);
  baris.push(`Sumber: ${escapeHtml(lead.lead_code)}`);
  if (lead.utm) {
    baris.push(`UTM: ${escapeHtml(Object.entries(lead.utm).map(([k, v]) => `${k}=${v}`).join(', '))}`);
  }
  baris.push(`<code>${escapeHtml(key)}</code>`);

  try {
    await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text: baris.join('\n'),
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
  } catch {
    // Notifikasi gagal tidak boleh menggagalkan penyimpanan lead.
  }
}

// ==========================================
// Handler
// ==========================================

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const cors = headerCors(request, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ ok: false, error: 'metode_tidak_didukung' }, 405, cors);
    }

    // Tanpa header Allow-Origin berarti origin tidak ada di allowlist.
    if (!cors['Access-Control-Allow-Origin']) {
      return jsonResponse({ ok: false, error: 'origin_tidak_diizinkan' }, 403, cors);
    }

    if (!env.LEADS_KV) {
      return jsonResponse({ ok: false, error: 'kv_belum_terpasang' }, 500, cors);
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ ok: false, error: 'json_rusak' }, 400, cors);
    }

    const hasil = validasiLead(body);
    if (!hasil.ok) {
      return jsonResponse({ ok: false, error: hasil.error }, 422, cors);
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'tanpa-ip';
    if (!(await lewatRateLimit(env, ip))) {
      return jsonResponse(
        { ok: false, error: 'terlalu_sering', retry_after_s: RATE_LIMIT_WINDOW_S },
        429,
        { ...cors, 'Retry-After': String(RATE_LIMIT_WINDOW_S) },
      );
    }

    const key = `lead:${Date.now()}:${crypto.randomUUID().slice(0, 8)}`;
    const record = {
      ...hasil.data,
      diterima: new Date().toISOString(),
      negara: request.headers.get('CF-IPCountry') || null,
      ua: (request.headers.get('User-Agent') || '').slice(0, 200),
    };

    try {
      await env.LEADS_KV.put(key, JSON.stringify(record), { expirationTtl: LEAD_TTL_S });
    } catch {
      return jsonResponse({ ok: false, error: 'gagal_simpan' }, 500, cors);
    }

    ctx.waitUntil(kirimTelegram(env, hasil.data, key));

    return jsonResponse({ ok: true, key, whatsapp: hasil.data.whatsapp }, 200, cors);
  },
};
