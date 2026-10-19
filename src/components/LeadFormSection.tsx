'use client';

/**
 * Form lead 3 langkah: model → ukuran → kontak.
 *
 * Tujuannya satu: mengubah pengunjung jadi chat WhatsApp yang sudah berisi
 * ukuran dan model. Pengiriman ke server bersifat opsional (lihat `lib/lead`),
 * jadi tanpa endpoint pun alurnya tetap selesai sampai WhatsApp terbuka.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm, type DefaultValues, type FieldErrors, type Resolver } from 'react-hook-form';

import styles from './LeadFormSection.module.css';
import { buildWhatsAppLink, getStoredLeadSource, trackEvent } from '../lib/tracking';
import { getAllVariants, getVariant, type VariantOf } from '../lib/experiments';
import {
  buildLeadMessage,
  hasSessionFlag,
  validateLeadForm,
  LEAD_DRAFT_KEY,
  LEAD_STEP_FIELDS,
  LEAD_SUBMITTED_KEY,
  markSessionFlag,
  normalizeWhatsapp,
  readUtmParams,
  submitLead,
  UKURAN_MAX_CM,
  UKURAN_MIN_CM,
  WA_CLICKED_KEY,
  type LeadFormValues,
  type LeadPayload,
} from '../lib/lead';

const MODELS = [
  { id: 'Rectangle', desc: 'Persegi panjang, paling banyak dipesan' },
  { id: 'Capsul', desc: 'Sudut membulat penuh atas–bawah' },
  { id: 'Oval', desc: 'Lonjong, lembut untuk kamar mandi' },
  { id: 'Round', desc: 'Bulat, cukup isi diameter' },
  { id: 'Leaf', desc: 'Daun, dua sudut lancip' },
  { id: 'Bentuk lain', desc: 'Tulis detailnya di catatan' },
] as const;

const STEP_META = [
  { title: 'Mau model yang mana?', hint: 'Pilih satu. Bisa diubah lagi saat chat dengan admin.' },
  { title: 'Berapa ukurannya?', hint: 'Isi dalam sentimeter. Untuk bentuk bulat, isi diameternya di kedua kolom.' },
  { title: 'Ke mana penawarannya dikirim?', hint: 'Kami balas lewat WhatsApp, biasanya di jam kerja workshop.' },
] as const;

const DEFAULTS = {
  model: '',
  catatan: '',
  nama: '',
  whatsapp: '',
} satisfies DefaultValues<LeadFormValues>;

const TOTAL_STEPS = LEAD_STEP_FIELDS.length;

/**
 * Resolver react-hook-form tulis tangan (tanpa library skema): bentuk errornya
 * `{ type, message }` per field, sehingga `trigger` per langkah, `mode:
 * 'onTouched'`, dan fokus otomatis tetap berperilaku identik.
 */
const leadResolver: Resolver<LeadFormValues> = (values) => {
  const hasil = validateLeadForm(values);
  if (hasil.ok) return { values: hasil.data, errors: {} };

  const errors: FieldErrors<LeadFormValues> = {};
  for (const [field, message] of Object.entries(hasil.errors)) {
    (errors as Record<string, { type: string; message: string }>)[field] = {
      type: 'validasi',
      message,
    };
  }
  return { values: {}, errors };
};

export function LeadFormSection() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [waLink, setWaLink] = useState('');
  const [tersimpanDiServer, setTersimpanDiServer] = useState(false);
  const [ctaVariant, setCtaVariant] = useState<VariantOf<'cta_style'>>('kontrol');

  const startedRef = useRef(false);
  const submittedRef = useRef(false);
  const stepRef = useRef(0);

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: leadResolver,
    defaultValues: DEFAULTS,
    mode: 'onTouched',
    // Jangan menandai merah di tengah pengetikan: "2" dari "20" bukan kesalahan.
    reValidateMode: 'onBlur',
  });

  const model = watch('model');
  const panjangCm = watch('panjangCm');
  const lebarCm = watch('lebarCm');

  // Varian A/B hanya dibaca di klien supaya HTML statis tetap netral.
  useEffect(() => {
    setCtaVariant(getVariant('cta_style'));
  }, []);

  // Pulihkan draft dari sesi sebelumnya (refresh tidak menghapus isian).
  useEffect(() => {
    if (hasSessionFlag(LEAD_SUBMITTED_KEY)) return;
    try {
      const raw = window.sessionStorage.getItem(LEAD_DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as Partial<Record<keyof LeadFormValues, unknown>>;
      reset({
        ...DEFAULTS,
        model: typeof draft.model === 'string' ? draft.model : '',
        catatan: typeof draft.catatan === 'string' ? draft.catatan : '',
        nama: typeof draft.nama === 'string' ? draft.nama : '',
        whatsapp: typeof draft.whatsapp === 'string' ? draft.whatsapp : '',
        panjangCm: typeof draft.panjangCm === 'number' ? draft.panjangCm : undefined,
        lebarCm: typeof draft.lebarCm === 'number' ? draft.lebarCm : undefined,
      });
    } catch {
      // Draft rusak — abaikan, form mulai kosong.
    }
  }, [reset]);

  // Draft disimpan tiap perubahan, termasuk saat pindah langkah.
  useEffect(() => {
    const sub = watch((values) => {
      if (submittedRef.current) return;
      try {
        window.sessionStorage.setItem(LEAD_DRAFT_KEY, JSON.stringify(values));
      } catch {
        // Mode privat / kuota penuh — form tetap jalan tanpa draft.
      }
    });
    return () => sub.unsubscribe();
  }, [watch]);

  /** Sentuhan pertama di form apa pun: tandai funnel sudah mulai. */
  const tandaiMulai = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent('lead_form_start');
  }, []);

  // Lead yang ditinggal sebelum dikirim tetap tercatat, lengkap dengan langkahnya.
  useEffect(() => {
    const onLeave = () => {
      if (!startedRef.current || submittedRef.current) return;
      trackEvent('lead_form_abandon', { step: stepRef.current + 1 });
    };
    window.addEventListener('beforeunload', onLeave);
    return () => window.removeEventListener('beforeunload', onLeave);
  }, []);

  const goTo = useCallback(
    (next: number) => {
      // Error langkah tujuan dibersihkan: pengunjung belum menyentuh field di sana
      // pada kunjungan ini, jadi tidak boleh disambut kolom merah.
      clearErrors(LEAD_STEP_FIELDS[next] as (keyof LeadFormValues)[]);
      stepRef.current = next;
      setStep(next);
    },
    [clearErrors],
  );

  const goNext = useCallback(async () => {
    const ok = await trigger(LEAD_STEP_FIELDS[step] as (keyof LeadFormValues)[], { shouldFocus: true });
    if (!ok) return;
    const next = Math.min(step + 1, TOTAL_STEPS - 1);
    goTo(next);
    trackEvent('lead_form_step', { step: next + 1 });
  }, [goTo, step, trigger]);

  const goBack = useCallback(() => {
    goTo(Math.max(step - 1, 0));
  }, [goTo, step]);

  // Enter di langkah 1–2 berarti "lanjut", bukan "kirim".
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key !== 'Enter') return;
      if (step >= TOTAL_STEPS - 1) return;
      if ((e.target as HTMLElement).tagName === 'TEXTAREA') return;
      e.preventDefault();
      void goNext();
    },
    [goNext, step],
  );

  const pilihModel = useCallback(
    (id: string) => {
      tandaiMulai();
      setValue('model', id, { shouldValidate: true, shouldDirty: true });
    },
    [setValue, tandaiMulai],
  );

  const onSubmit = handleSubmit(async (values) => {
    const nomor = normalizeWhatsapp(values.whatsapp);
    if (!nomor) {
      setError('whatsapp', { message: 'Nomor WhatsApp belum benar. Contoh: 081237533173' });
      setFocus('whatsapp');
      return;
    }

    const payload: LeadPayload = {
      nama: values.nama.trim(),
      whatsapp: nomor,
      model: values.model,
      panjangCm: values.panjangCm,
      lebarCm: values.lebarCm,
      catatan: values.catatan?.trim() || undefined,
      lead_code: getStoredLeadSource(),
      varian: getAllVariants(),
      utm: readUtmParams(),
    };

    const link = buildWhatsAppLink(buildLeadMessage(payload));

    submittedRef.current = true;
    markSessionFlag(LEAD_SUBMITTED_KEY);
    markSessionFlag(WA_CLICKED_KEY);
    try {
      window.sessionStorage.removeItem(LEAD_DRAFT_KEY);
    } catch {
      // no-op
    }

    trackEvent(
      'lead_submit',
      { model: payload.model, panjang_cm: payload.panjangCm, lebar_cm: payload.lebarCm },
      { meta: 'Lead', tiktok: 'SubmitForm' },
    );

    // Gagal kirim ke server tidak boleh menahan user: link WhatsApp tetap dibuka.
    const hasil = await submitLead(payload);
    setTersimpanDiServer(hasil.ok && hasil.delivered === 'endpoint');

    setWaLink(link);
    setDone(true);
    window.open(link, '_blank', 'noopener,noreferrer');
  });

  const ulangi = useCallback(() => {
    submittedRef.current = false;
    startedRef.current = false;
    setDone(false);
    setWaLink('');
    setTersimpanDiServer(false);
    reset(DEFAULTS);
    goTo(0);
  }, [goTo, reset]);

  const persen = Math.round(((step + 1) / TOTAL_STEPS) * 100);
  // Luas hanya ditampilkan bila kedua ukuran sudah masuk akal; 2 × 2 cm yang
  // menghasilkan "0,00 m²" cuma bikin bingung.
  const ukuranSah = (n: unknown): n is number =>
    typeof n === 'number' && Number.isInteger(n) && n >= UKURAN_MIN_CM && n <= UKURAN_MAX_CM;
  const luas =
    ukuranSah(panjangCm) && ukuranSah(lebarCm)
      ? ((panjangCm * lebarCm) / 10000).toFixed(2).replace('.', ',')
      : null;

  const labelKirim = ctaVariant === 'urgensi' ? 'Kirim sekarang, slot produksi terbatas' : 'Kirim & lanjut ke WhatsApp';

  return (
    <section id="konsultasi" className={styles.section} aria-labelledby="konsultasi-judul">
      <div className={styles.inner}>
        <div className={styles.layout}>
          <div className={styles.intro}>
            <h2 id="konsultasi-judul">minta penawaran dalam 3 langkah.</h2>
            <p className={styles.lead}>
              Isi model dan ukuran yang kamu butuhkan. Pesan WhatsApp-nya kami siapkan otomatis, jadi admin
              langsung bisa menghitung dan membalas dengan harga.
            </p>
            <ul className={styles.points}>
              <li>Dibuat per pesanan di workshop Citatah, Bandung Barat</li>
              <li>Produksi 1–5 hari kerja setelah DP</li>
              <li>Kirim ke seluruh Indonesia, luar kota pakai paking kayu</li>
            </ul>
          </div>

          <div className={styles.card}>
            {done ? (
              <div className={styles.success}>
                <div className={styles.successMark} aria-hidden="true">
                  ✓
                </div>
                <h3 className={styles.successTitle}>Siap, tinggal kirim chatnya.</h3>
                <p className={styles.successText}>
                  {tersimpanDiServer
                    ? 'Datamu sudah kami terima. Tab WhatsApp seharusnya terbuka dengan pesan yang sudah lengkap — kalau tidak muncul, tekan tombol di bawah.'
                    : 'Tab WhatsApp seharusnya terbuka dengan pesan yang sudah lengkap. Kalau tidak muncul, tekan tombol di bawah.'}
                </p>
                <a
                  className={styles.waLink}
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Buka WhatsApp dengan pesan yang sudah terisi"
                >
                  Buka WhatsApp
                </a>
                <button type="button" className={styles.restart} onClick={ulangi}>
                  Isi lagi untuk ukuran lain
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} onFocusCapture={tandaiMulai} onKeyDown={onKeyDown} noValidate>
                <div className={styles.progress}>
                  <div
                    className={styles.progressTrack}
                    role="progressbar"
                    aria-valuemin={1}
                    aria-valuemax={TOTAL_STEPS}
                    aria-valuenow={step + 1}
                    aria-label={`Langkah ${step + 1} dari ${TOTAL_STEPS}`}
                  >
                    <div className={styles.progressFill} style={{ width: `${persen}%` }} />
                  </div>
                  <span className={styles.progressLabel}>
                    Langkah {step + 1}/{TOTAL_STEPS}
                  </span>
                </div>

                <h3 className={styles.stepTitle}>{STEP_META[step].title}</h3>
                <p className={styles.stepHint}>{STEP_META[step].hint}</p>

                {/* Langkah 1 — model */}
                <div className={styles.stepPanel} hidden={step !== 0}>
                  <div className={styles.modelGrid} role="group" aria-label="Pilihan model cermin">
                    {MODELS.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        className={`${styles.modelBtn} ${model === m.id ? styles.modelBtnActive : ''}`}
                        aria-pressed={model === m.id}
                        onClick={() => pilihModel(m.id)}
                      >
                        {m.id}
                        <span className={styles.modelDesc}>{m.desc}</span>
                      </button>
                    ))}
                  </div>
                  <input type="hidden" {...register('model')} />
                  {errors.model && (
                    <p className={styles.error} role="alert">
                      {errors.model.message}
                    </p>
                  )}
                </div>

                {/* Langkah 2 — ukuran dan catatan */}
                <div className={styles.stepPanel} hidden={step !== 1}>
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="lead-panjang">
                        Panjang (cm)
                      </label>
                      <input
                        id="lead-panjang"
                        type="number"
                        inputMode="numeric"
                        placeholder="80"
                        className={`${styles.input} ${errors.panjangCm ? styles.inputError : ''}`}
                        aria-invalid={Boolean(errors.panjangCm)}
                        {...register('panjangCm', { valueAsNumber: true })}
                      />
                      {errors.panjangCm && (
                        <p className={styles.error} role="alert">
                          {errors.panjangCm.message}
                        </p>
                      )}
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="lead-lebar">
                        Lebar (cm)
                      </label>
                      <input
                        id="lead-lebar"
                        type="number"
                        inputMode="numeric"
                        placeholder="60"
                        className={`${styles.input} ${errors.lebarCm ? styles.inputError : ''}`}
                        aria-invalid={Boolean(errors.lebarCm)}
                        {...register('lebarCm', { valueAsNumber: true })}
                      />
                      {errors.lebarCm && (
                        <p className={styles.error} role="alert">
                          {errors.lebarCm.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="lead-catatan">
                      Catatan <span className={styles.optional}>(opsional)</span>
                    </label>
                    <textarea
                      id="lead-catatan"
                      className={`${styles.textarea} ${errors.catatan ? styles.inputError : ''}`}
                      placeholder="Misalnya: pakai antifog, sensor tangan, atau dipasang di kamar mandi hotel."
                      aria-invalid={Boolean(errors.catatan)}
                      {...register('catatan')}
                    />
                    {errors.catatan && (
                      <p className={styles.error} role="alert">
                        {errors.catatan.message}
                      </p>
                    )}
                  </div>

                  <p className={styles.preview} aria-live="polite">
                    {luas ? `Luas cermin sekitar ${luas} m².` : 'Isi panjang dan lebar untuk melihat luasnya.'}
                  </p>
                </div>

                {/* Langkah 3 — kontak */}
                <div className={styles.stepPanel} hidden={step !== 2}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="lead-nama">
                      Nama
                    </label>
                    <input
                      id="lead-nama"
                      type="text"
                      autoComplete="name"
                      placeholder="Nama panggilan saja boleh"
                      className={`${styles.input} ${errors.nama ? styles.inputError : ''}`}
                      aria-invalid={Boolean(errors.nama)}
                      {...register('nama')}
                    />
                    {errors.nama && (
                      <p className={styles.error} role="alert">
                        {errors.nama.message}
                      </p>
                    )}
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="lead-wa">
                      Nomor WhatsApp
                    </label>
                    <input
                      id="lead-wa"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="081237533173"
                      className={`${styles.input} ${errors.whatsapp ? styles.inputError : ''}`}
                      aria-invalid={Boolean(errors.whatsapp)}
                      {...register('whatsapp')}
                    />
                    {errors.whatsapp && (
                      <p className={styles.error} role="alert">
                        {errors.whatsapp.message}
                      </p>
                    )}
                  </div>

                  <p className={styles.note}>
                    Nomor hanya dipakai untuk membalas penawaran ini. Tidak dikirim ke pihak lain.
                  </p>
                </div>

                <div className={styles.actions}>
                  {step > 0 && (
                    <button type="button" className={styles.back} onClick={goBack}>
                      Kembali
                    </button>
                  )}
                  {step < TOTAL_STEPS - 1 ? (
                    <button type="button" className={styles.next} onClick={goNext}>
                      Lanjut
                    </button>
                  ) : (
                    <button type="submit" className={styles.submit} disabled={isSubmitting}>
                      {isSubmitting ? 'Mengirim…' : labelKirim}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
