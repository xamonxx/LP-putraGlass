/**
 * A/B testing ringan tanpa SDK pihak ketiga.
 *
 * Alasan tidak memakai GrowthBook/Optimizely: keduanya butuh akun + request
 * jaringan untuk ambil definisi eksperimen, sementara situs ini static export
 * murni. Bucketing di sini deterministik dari ID pengunjung yang disimpan di
 * localStorage, jadi varian stabil lintas kunjungan tanpa server.
 */

const VISITOR_KEY = 'pg_visitor_id';

export type ExperimentId = 'hero_headline' | 'cta_style' | 'form_position';

export interface Experiment<V extends string = string> {
  id: ExperimentId;
  variants: readonly V[];
  /** Bobot opsional, panjangnya harus sama dengan variants. Default rata. */
  weights?: readonly number[];
}

export const EXPERIMENTS = {
  hero_headline: {
    id: 'hero_headline',
    variants: ['kontrol', 'harga'],
  },
  cta_style: {
    id: 'cta_style',
    variants: ['kontrol', 'urgensi'],
  },
  form_position: {
    id: 'form_position',
    variants: ['bawah', 'tengah'],
  },
} as const satisfies Record<ExperimentId, Experiment>;

export type VariantOf<T extends ExperimentId> = (typeof EXPERIMENTS)[T]['variants'][number];

/** FNV-1a 32-bit. Cepat, tanpa alokasi, cukup merata untuk bucketing. */
function hash32(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function randomId(): string {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  } catch {
    // lanjut ke fallback
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getVisitorId(): string {
  if (typeof window === 'undefined') return 'ssr';
  try {
    const existing = window.localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;
    const fresh = randomId();
    window.localStorage.setItem(VISITOR_KEY, fresh);
    return fresh;
  } catch {
    return 'anon';
  }
}

/**
 * Varian untuk sebuah eksperimen. Saat SSR / prerender selalu mengembalikan
 * variants[0] supaya HTML statis konsisten; komponen wajib memakai hasil ini
 * lewat useEffect agar tidak memicu hydration mismatch.
 */
export function getVariant<T extends ExperimentId>(id: T): VariantOf<T> {
  const exp = EXPERIMENTS[id] as Experiment;
  const variants = exp.variants;
  if (typeof window === 'undefined') return variants[0] as VariantOf<T>;

  const bucket = hash32(`${getVisitorId()}:${id}`) / 0xffffffff;

  const weights = exp.weights;
  if (weights && weights.length === variants.length) {
    const total = weights.reduce((a, b) => a + b, 0);
    let acc = 0;
    for (let i = 0; i < variants.length; i += 1) {
      acc += weights[i] / total;
      if (bucket < acc) return variants[i] as VariantOf<T>;
    }
    return variants[variants.length - 1] as VariantOf<T>;
  }

  const index = Math.min(variants.length - 1, Math.floor(bucket * variants.length));
  return variants[index] as VariantOf<T>;
}

/** Semua varian aktif, dipakai sebagai dimensi tambahan di setiap event pixel. */
export function getAllVariants(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const out: Record<string, string> = {};
  (Object.keys(EXPERIMENTS) as ExperimentId[]).forEach((id) => {
    out[`exp_${id}`] = getVariant(id);
  });
  return out;
}
