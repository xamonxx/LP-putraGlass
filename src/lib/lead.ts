/**
 * Lead capture: tipe, validasi, dan pengiriman.
 *
 * Situs ini static export, jadi tidak ada API route. Lead dikirim ke endpoint
 * eksternal opsional (Cloudflare Worker di `workers/lead`). Kalau endpoint
 * belum diisi, form tetap jalan penuh: user langsung dibawa ke WhatsApp dengan
 * pesan yang sudah lengkap. Jaringan TIDAK pernah jadi penghalang.
 */

// ==========================================
// Nomor WhatsApp Indonesia
// ==========================================

/** Panjang nomor nasional (tanpa kode negara 62) yang diterima. */
export const PHONE_MIN_DIGITS = 9;
export const PHONE_MAX_DIGITS = 15;

/**
 * Ubah `08xx`, `+62xx`, `62xx`, atau `8xx` menjadi `62xxxxxxxxxx`.
 * Mengembalikan `null` kalau tidak bisa dipakai.
 */
export function normalizeWhatsapp(raw: string): string | null {
  if (typeof raw !== 'string') return null;

  // Buang spasi, strip, titik, kurung, dan tanda plus — sisakan angka saja.
  let digits = raw.replace(/\D+/g, '');
  if (!digits) return null;

  if (digits.startsWith('62')) {
    digits = digits.slice(2);
  } else if (digits.startsWith('0')) {
    digits = digits.replace(/^0+/, '');
  }

  // Nomor seluler Indonesia selalu diawali 8 setelah kode negara.
  if (!digits.startsWith('8')) return null;
  if (digits.length < PHONE_MIN_DIGITS || digits.length > PHONE_MAX_DIGITS) return null;

  return `62${digits}`;
}

/** Tampilan ramah: `+62 812-3753-3173`. */
export function formatWhatsappDisplay(normalized: string): string {
  const national = normalized.startsWith('62') ? normalized.slice(2) : normalized;
  const parts = national.match(/^(\d{3})(\d{4})(\d{0,8})$/);
  if (!parts) return `+${normalized}`;
  return `+62 ${parts[1]}-${parts[2]}${parts[3] ? `-${parts[3]}` : ''}`;
}

// ==========================================
// Skema & validasi (tulis tangan, tanpa dependency)
// ==========================================

/** Nilai form 3 langkah. `catatan` opsional. */
export interface LeadFormValues {
  model: string;
  panjangCm: number;
  lebarCm: number;
  catatan?: string;
  nama: string;
  whatsapp: string;
}

/** Nilai mentah dari react-hook-form — tipenya belum tentu sesuai. */
export type LeadFormInput = Partial<Record<keyof LeadFormValues, unknown>>;

/** Hasil validasi: data bersih, atau peta pesan error per nama field. */
export type HasilValidasi<T> =
  | { ok: true; data: T }
  | { ok: false; errors: Record<string, string> };

/** Hasil pemeriksaan satu field. */
type CekField<T> = { ok: true; value: T } | { ok: false; message: string };

export const UKURAN_MIN_CM = 20;
export const UKURAN_MAX_CM = 300;
const CATATAN_MAX = 400;
const NAMA_MIN = 2;
const NAMA_MAX = 60;
const MODEL_MAX = 80;
const LEAD_CODE_MAX = 32;

function cekModel(raw: unknown): CekField<string> {
  const val = typeof raw === 'string' ? raw.trim() : '';
  if (!val) return { ok: false, message: 'Pilih dulu model cerminnya' };
  return { ok: true, value: val };
}

/** Panjang dan lebar memakai aturan sama, hanya labelnya yang berbeda. */
function cekUkuran(raw: unknown, label: 'panjang' | 'lebar'): CekField<number> {
  if (typeof raw !== 'number' || !Number.isFinite(raw)) {
    return { ok: false, message: `Isi ${label} dalam cm` };
  }
  if (!Number.isInteger(raw)) return { ok: false, message: 'Bulatkan ke cm terdekat' };
  if (raw < UKURAN_MIN_CM) return { ok: false, message: `Minimal ${UKURAN_MIN_CM} cm` };
  if (raw > UKURAN_MAX_CM) return { ok: false, message: `Maksimal ${UKURAN_MAX_CM} cm` };
  return { ok: true, value: raw };
}

function cekCatatan(raw: unknown): CekField<string | undefined> {
  if (typeof raw !== 'string') return { ok: true, value: undefined };
  const val = raw.trim();
  if (val.length > CATATAN_MAX) {
    return { ok: false, message: `Catatan maksimal ${CATATAN_MAX} karakter` };
  }
  return { ok: true, value: val };
}

function cekNama(raw: unknown): CekField<string> {
  const val = typeof raw === 'string' ? raw.trim() : '';
  if (!val) return { ok: false, message: 'Nama wajib diisi' };
  if (val.length < NAMA_MIN) return { ok: false, message: `Nama minimal ${NAMA_MIN} huruf` };
  if (val.length > NAMA_MAX) return { ok: false, message: `Nama maksimal ${NAMA_MAX} huruf` };
  return { ok: true, value: val };
}

function cekWhatsapp(raw: unknown): CekField<string> {
  const val = typeof raw === 'string' ? raw.trim() : '';
  if (!val) return { ok: false, message: 'Nomor WhatsApp wajib diisi' };
  if (normalizeWhatsapp(val) === null) {
    return { ok: false, message: 'Nomor WhatsApp belum benar. Contoh: 081237533173' };
  }
  return { ok: true, value: val };
}

/** Satu pemeriksa per field form, dipakai per langkah maupun sekaligus. */
const PEMERIKSA: { [K in keyof LeadFormValues]-?: (raw: unknown) => CekField<LeadFormValues[K]> } = {
  model: cekModel,
  panjangCm: (raw) => cekUkuran(raw, 'panjang'),
  lebarCm: (raw) => cekUkuran(raw, 'lebar'),
  catatan: cekCatatan,
  nama: cekNama,
  whatsapp: cekWhatsapp,
};

const SEMUA_FIELD = Object.keys(PEMERIKSA) as (keyof LeadFormValues)[];

/** Field apa saja yang divalidasi di tiap langkah. */
export const LEAD_STEP_FIELDS: readonly (readonly (keyof LeadFormValues)[])[] = [
  ['model'],
  ['panjangCm', 'lebarCm', 'catatan'],
  ['nama', 'whatsapp'],
] as const;

/** Jalankan pemeriksa untuk sekumpulan field dan kumpulkan semua errornya. */
function periksaField(
  fields: readonly (keyof LeadFormValues)[],
  values: LeadFormInput,
): { data: Partial<LeadFormValues>; errors: Record<string, string> } {
  const data: Partial<LeadFormValues> = {};
  // Penulisan lewat kunci dinamis perlu pandangan longgar; isinya tetap terjaga
  // oleh tipe pengembalian tiap pemeriksa.
  const tulis = data as Record<string, unknown>;
  const errors: Record<string, string> = {};
  for (const field of fields) {
    const hasil = PEMERIKSA[field](values[field]);
    if (hasil.ok) {
      tulis[field] = hasil.value;
    } else {
      errors[field] = hasil.message;
    }
  }
  return { data, errors };
}

/** Validasi field milik satu langkah saja (indeks mengikuti `LEAD_STEP_FIELDS`). */
export function validateLeadStep(
  step: number,
  values: LeadFormInput,
): HasilValidasi<Partial<LeadFormValues>> {
  const fields = LEAD_STEP_FIELDS[step] ?? [];
  const { data, errors } = periksaField(fields, values);
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data };
}

/** Validasi seluruh form sekaligus — dipakai resolver react-hook-form. */
export function validateLeadForm(values: LeadFormInput): HasilValidasi<LeadFormValues> {
  const { data, errors } = periksaField(SEMUA_FIELD, values);
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: data as LeadFormValues };
}

export type LeadPayload = {
  nama: string;
  /** Sudah dalam format `62xxxxxxxxxx`. */
  whatsapp: string;
  model: string;
  panjangCm: number;
  lebarCm: number;
  catatan?: string;
  /** Kode sumber dari UTM, misal `LP-META`. */
  lead_code: string;
  /** Varian A/B yang aktif saat lead dibuat. */
  varian?: Record<string, string>;
  /** Query UTM mentah dari URL pendaratan. */
  utm?: Record<string, string>;
};

/** Peta string→string opsional (varian A/B dan UTM). */
function cekPeta(raw: unknown): CekField<Record<string, string> | undefined> {
  if (raw === undefined || raw === null) return { ok: true, value: undefined };
  if (typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, message: 'Data tambahan tidak valid' };
  }
  const out: Record<string, string> = {};
  for (const [key, val] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof val !== 'string') return { ok: false, message: 'Data tambahan tidak valid' };
    out[key] = val;
  }
  return { ok: true, value: out };
}

/**
 * Validasi payload final sebelum dikirim ke endpoint. Nomor WhatsApp
 * dinormalisasi ke `62xxxxxxxxxx` dan kunci asing dibuang.
 */
export function validateLeadPayload(values: unknown): HasilValidasi<LeadPayload> {
  const v = (values ?? {}) as Partial<Record<keyof LeadPayload, unknown>>;
  const errors: Record<string, string> = {};

  const nama = typeof v.nama === 'string' ? v.nama.trim() : '';
  if (nama.length < NAMA_MIN || nama.length > NAMA_MAX) errors.nama = 'Nama tidak valid';

  const whatsapp = typeof v.whatsapp === 'string' ? normalizeWhatsapp(v.whatsapp.trim()) : null;
  if (!whatsapp) errors.whatsapp = 'Nomor WhatsApp tidak valid';

  const model = typeof v.model === 'string' ? v.model.trim() : '';
  if (!model || model.length > MODEL_MAX) errors.model = 'Model tidak valid';

  const leadCode = typeof v.lead_code === 'string' ? v.lead_code : '';
  if (!leadCode || leadCode.length > LEAD_CODE_MAX) errors.lead_code = 'Kode sumber tidak valid';

  const panjang = cekUkuran(v.panjangCm, 'panjang');
  if (!panjang.ok) errors.panjangCm = panjang.message;
  const lebar = cekUkuran(v.lebarCm, 'lebar');
  if (!lebar.ok) errors.lebarCm = lebar.message;
  const catatan = cekCatatan(v.catatan);
  if (!catatan.ok) errors.catatan = catatan.message;
  const varian = cekPeta(v.varian);
  if (!varian.ok) errors.varian = varian.message;
  const utm = cekPeta(v.utm);
  if (!utm.ok) errors.utm = utm.message;

  if (
    !whatsapp ||
    !panjang.ok ||
    !lebar.ok ||
    !catatan.ok ||
    !varian.ok ||
    !utm.ok ||
    Object.keys(errors).length > 0
  ) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      nama,
      whatsapp,
      model,
      panjangCm: panjang.value,
      lebarCm: lebar.value,
      lead_code: leadCode,
      ...(catatan.value ? { catatan: catatan.value } : {}),
      ...(varian.value ? { varian: varian.value } : {}),
      ...(utm.value ? { utm: utm.value } : {}),
    },
  };
}

// ==========================================
// Kunci sessionStorage yang dipakai bersama
// ==========================================

/** Draft isian form, supaya tidak hilang saat refresh. */
export const LEAD_DRAFT_KEY = 'pg_lead_draft';
/** Ditandai setelah lead terkirim — exit intent tidak boleh muncul lagi. */
export const LEAD_SUBMITTED_KEY = 'pg_lead_submitted';
/** Ditandai begitu user membuka WhatsApp dari mana pun di halaman. */
export const WA_CLICKED_KEY = 'pg_wa_clicked';

/** Tulis penanda sesi tanpa melempar di mode privat / storage penuh. */
export function markSessionFlag(key: string) {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(key, '1');
  } catch {
    // no-op
  }
}

export function hasSessionFlag(key: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

// ==========================================
// Pengiriman
// ==========================================

export interface LeadResult {
  ok: boolean;
  /** `endpoint` kalau lead tersimpan di server, `whatsapp` kalau hanya lewat chat. */
  delivered: 'endpoint' | 'whatsapp';
  error?: string;
}

const SUBMIT_TIMEOUT_MS = 8_000;

/** Baca UTM mentah dari URL sekarang — tanpa PII, hanya parameter kampanye. */
export function readUtmParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const out: Record<string, string> = {};
  try {
    const params = new URLSearchParams(window.location.search);
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
      const val = params.get(key);
      if (val) out[key] = val.slice(0, 80);
    }
  } catch {
    // no-op
  }
  return out;
}

/**
 * Kirim lead ke endpoint kalau `NEXT_PUBLIC_LEAD_ENDPOINT` di-set.
 * Tanpa endpoint: langsung sukses, lead hanya mengalir lewat WhatsApp.
 * Gagal jaringan pun tetap mengembalikan hasil (tidak melempar), supaya
 * pemanggil bisa langsung membuka WhatsApp.
 */
export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  const endpoint = process.env.NEXT_PUBLIC_LEAD_ENDPOINT;
  if (!endpoint) {
    return { ok: true, delivered: 'whatsapp' };
  }

  const parsed = validateLeadPayload(payload);
  if (!parsed.ok) {
    return { ok: false, delivered: 'whatsapp', error: 'payload_tidak_valid' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
      signal: controller.signal,
      keepalive: true,
    });

    if (!res.ok) {
      return { ok: false, delivered: 'whatsapp', error: `http_${res.status}` };
    }
    return { ok: true, delivered: 'endpoint' };
  } catch (err) {
    const reason = err instanceof DOMException && err.name === 'AbortError' ? 'timeout' : 'jaringan';
    return { ok: false, delivered: 'whatsapp', error: reason };
  } finally {
    clearTimeout(timer);
  }
}

// ==========================================
// Pesan WhatsApp
// ==========================================

/** Susun isi chat dari data form. Kode sumber ditambahkan oleh `buildWhatsAppLink`. */
export function buildLeadMessage(payload: LeadPayload): string {
  const baris = [
    'Halo Putra Glass, saya mau pesan cermin LED:',
    `- Nama: ${payload.nama}`,
    `- Model: ${payload.model}`,
    `- Ukuran: ${payload.panjangCm} x ${payload.lebarCm} cm`,
    `- WhatsApp: ${formatWhatsappDisplay(payload.whatsapp)}`,
  ];
  if (payload.catatan) baris.push(`- Catatan: ${payload.catatan}`);
  baris.push('Mohon dibantu penawarannya ya.');
  return baris.join('\n');
}
