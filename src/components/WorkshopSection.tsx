'use client';

import React, { useCallback, useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import type { Variants } from 'motion/react';
import * as Dialog from '@radix-ui/react-dialog';
import { MAPS_URL } from '../lib/constants';
import { trackEvent } from '../lib/tracking';
import { PictureImage } from './PictureImage';
import styles from './WorkshopSection.module.css';

/** Foto yang bisa dibuka besar di lightbox, urutannya sama dengan urutan di halaman. */
const FOTO_WORKSHOP = [
  {
    name: 'pasang-hotel',
    judul: 'Cermin LED panjang terpasang di area wastafel',
    alt: 'Cermin LED panjang hasil workshop Putra Glass terpasang di area wastafel komersial',
    keterangan: 'Hasil pemasangan di area wastafel komersial, cermin dibuat per pesanan di workshop Citatah.',
  },
  {
    name: 'workshop-poles',
    judul: 'Potong dan bevel',
    alt: 'Pekerja memoles tepi kaca cermin',
    keterangan: 'Kaca dipotong sesuai ukuranmu, tepinya dibevel 10 mm lalu dipoles mesin.',
  },
  {
    name: 'proses-led',
    judul: 'Pasang LED',
    alt: 'Strip LED menyala di cermin persegi yang sedang dirakit',
    keterangan: 'Strip LED dipasang lurus mengikuti bentuk, lengkap dengan touchscreen atau sensor tangan.',
  },
  {
    name: 'workshop-led',
    judul: 'Uji nyala',
    alt: 'Uji nyala cermin bentuk leaf pada malam hari',
    keterangan: 'Setiap cermin dinyalakan dan dicek tiga warnanya sebelum dikemas.',
  },
  {
    name: 'pasang-cafe',
    judul: 'Terpasang di tempatmu',
    alt: 'Cermin LED kapsul terpasang di dinding kafe',
    keterangan: 'Dikirim dengan paking kayu bertulang, atau ambil sendiri di workshop.',
  },
] as const;

export function WorkshopSection() {
  const [indexFoto, setIndexFoto] = useState<number | null>(null);
  const fotoAktif = indexFoto === null ? null : FOTO_WORKSHOP[indexFoto];

  const bukaFoto = useCallback((index: number) => {
    setIndexFoto(index);
    trackEvent('workshop_photo_open', { photo: FOTO_WORKSHOP[index].name });
  }, []);

  // Pindah foto berputar (prev dari foto pertama lompat ke foto terakhir)
  const geserFoto = useCallback(
    (arah: 1 | -1) => {
      if (indexFoto === null) return;
      const berikut = (indexFoto + arah + FOTO_WORKSHOP.length) % FOTO_WORKSHOP.length;
      setIndexFoto(berikut);
      trackEvent('workshop_photo_open', { photo: FOTO_WORKSHOP[berikut].name });
    },
    [indexFoto],
  );

  // Panah kiri/kanan ikut jalan selain tombol prev/next
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      geserFoto(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      geserFoto(-1);
    }
  };

  return (
    <section id="workshop" className={styles.section}>
      <div className="wrap">
        {/* Large Hero Card */}
        <div className="ws-hero">
          <PictureImage
            name="pasang-hotel"
            alt="Cermin LED panjang hasil workshop Putra Glass terpasang di area wastafel komersial"
            sizes="(max-width: 860px) calc(100vw - 40px), 1144px"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(10,14,28,0.94) 0%, rgba(10,14,28,0.62) 42%, rgba(10,14,28,0.12) 100%), linear-gradient(to right, rgba(10,14,28,0.55), rgba(10,14,28,0) 60%)',
            }}
          />
          <button
            type="button"
            className={styles.zoomHero}
            onClick={() => bukaFoto(0)}
            aria-label="Perbesar foto: cermin LED panjang terpasang di area wastafel"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.6-3.6M11 8.4v5.2M8.4 11h5.2" />
            </svg>
            Perbesar foto
          </button>
          <motion.div
            className={styles.content}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 0.68, 0.24, 1] }}
          >
            <p style={{ margin: 0, display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 600, color: '#FFE9C7' }}>
              <span
                aria-hidden="true"
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '999px',
                  background: '#FFC98A',
                  boxShadow: '0 0 10px #FFC98A, 0 0 22px #FFC98A',
                }}
              />
              Workshop Citatah, Bandung Barat
            </p>
            <h2 className="ws-h disp" style={{ margin: '16px 0 0', lineHeight: 0.98 }}>
              dipotong, dipoles, dan dinyalakan di Citatah.
            </h2>
            <p style={{ margin: '20px 0 0', maxWidth: '34em', fontSize: '18px', lineHeight: 1.6, color: '#D5DCE8' }}>
              Setiap cermin dikerjakan dan diuji nyala di workshop kami sendiri, lalu dikemas paking kayu bertulang untuk kiriman luar kota.
            </p>
            <ul className="specs" style={{ listStyle: 'none', margin: '32px 0 0', padding: 0 }}>
              <li>
                <span className="disp" style={{ fontSize: '30px' }}>5 mm</span>
                <span style={{ fontSize: '13px', color: '#B7C3D6' }}>kaca cermin grade 1</span>
              </li>
              <li>
                <span className="disp" style={{ fontSize: '30px' }}>10 mm</span>
                <span style={{ fontSize: '13px', color: '#B7C3D6' }}>bevel dipoles rapi</span>
              </li>
              <li>
                <span className="disp" style={{ fontSize: '30px' }}>3 warna</span>
                <span style={{ fontSize: '13px', color: '#B7C3D6' }}>LED 5050 lurus</span>
              </li>
              <li>
                <span className="disp" style={{ fontSize: '30px' }}>4.000+</span>
                <span style={{ fontSize: '13px', color: '#B7C3D6' }}>unit terkirim sejak 2025</span>
              </li>
            </ul>
            <a
              className="ghost"
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '32px',
                minHeight: '48px',
                padding: '0 20px',
                borderRadius: '12px',
                border: '1.5px solid rgba(255,255,255,0.55)',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '15px',
                textDecoration: 'none',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                background: 'rgba(255,255,255,0.06)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
                <circle cx="12" cy="9.5" r="2.5" />
              </svg>
              Lihat lokasi workshop
            </a>
          </motion.div>
        </div>

        {/* 4 Process Cards connected by continuous glowing line */}
        <motion.h3
          className={styles.processTitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 0.68, 0.24, 1] }}
        >
          dari lembar kaca sampai menyala di tempatmu
        </motion.h3>
        <ol className={styles.processSteps}>
          <ProcessStep index={0} foto={FOTO_WORKSHOP[1]} bukaFoto={bukaFoto}>
            <p className={styles.stepTitle}>1. Potong dan bevel</p>
            <p className={styles.stepDesc}>
              Kaca dipotong sesuai ukuranmu, tepinya dibevel 10 mm lalu dipoles mesin.
            </p>
          </ProcessStep>

          <ProcessStep index={1} foto={FOTO_WORKSHOP[2]} bukaFoto={bukaFoto}>
            <p className={styles.stepTitle}>2. Pasang LED</p>
            <p className={styles.stepDesc}>
              Strip LED dipasang lurus mengikuti bentuk, lengkap dengan touchscreen atau sensor.
            </p>
          </ProcessStep>

          <ProcessStep index={2} foto={FOTO_WORKSHOP[3]} bukaFoto={bukaFoto}>
            <p className={styles.stepTitle}>3. Uji nyala</p>
            <p className={styles.stepDesc}>
              Setiap cermin dinyalakan dan dicek tiga warnanya sebelum dikemas.
            </p>
          </ProcessStep>

          <ProcessStep index={3} foto={FOTO_WORKSHOP[4]} bukaFoto={bukaFoto}>
            <p className={styles.stepTitle}>4. Terpasang di tempatmu</p>
            <p className={styles.stepDesc}>
              Dikirim dengan paking kayu bertulang, atau ambil sendiri di workshop.
            </p>
          </ProcessStep>
        </ol>
      </div>

      {/* Lightbox foto workshop: Esc, klik overlay, dan panah kiri/kanan menutup atau berpindah */}
      <Dialog.Root
        open={indexFoto !== null}
        onOpenChange={(terbuka) => {
          if (!terbuka) setIndexFoto(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className={styles.overlay} />
          <Dialog.Content className={styles.lightbox} onKeyDown={handleKeyDown}>
            {fotoAktif && (
              <>
                <div className={styles.topbar}>
                  <Dialog.Close className={styles.close} aria-label="Tutup foto">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </Dialog.Close>
                </div>

                <div className={styles.stage}>
                  <PictureImage
                    key={fotoAktif.name}
                    name={fotoAktif.name}
                    alt={fotoAktif.alt}
                    priority
                    sizes="(max-width: 860px) calc(100vw - 24px), 1080px"
                    style={{ width: 'auto', maxWidth: '100%', height: 'auto', objectFit: 'contain', display: 'block' }}
                  />
                </div>

                <div className={styles.info}>
                  <Dialog.Title className={styles.judul}>{fotoAktif.judul}</Dialog.Title>
                  <Dialog.Description className={styles.keterangan}>{fotoAktif.keterangan}</Dialog.Description>
                </div>

                <div className={styles.controls}>
                  <button
                    type="button"
                    className={styles.nav}
                    onClick={() => geserFoto(-1)}
                    aria-label="Foto sebelumnya"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="15 6 9 12 15 18" />
                    </svg>
                  </button>
                  <span className={styles.hitung} aria-live="polite">
                    {(indexFoto ?? 0) + 1} / {FOTO_WORKSHOP.length}
                  </span>
                  <button
                    type="button"
                    className={styles.nav}
                    onClick={() => geserFoto(1)}
                    aria-label="Foto berikutnya"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="9 6 15 12 9 18" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}

interface ProcessStepProps {
  index: number;
  foto: typeof FOTO_WORKSHOP[number];
  bukaFoto: (index: number) => void;
  children: React.ReactNode;
}

function ProcessStep({ index, foto, bukaFoto, children }: ProcessStepProps) {
  const ref = useRef<HTMLLIElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.li
      ref={ref}
      className={styles.step}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: [0.22, 0.68, 0.24, 1],
      }}
    >
      <span className={styles.stepDot} aria-hidden="true" />
      <button
        type="button"
        className={styles.stepImage}
        onClick={() => bukaFoto(index + 1)}
        aria-label={`Perbesar foto: ${foto.judul.toLowerCase()}`}
      >
        <PictureImage
          name={foto.name}
          alt={foto.alt}
          sizes="(max-width: 860px) 72vw, 280px"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </button>
      {children}
    </motion.li>
  );
}
