'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { PictureImage } from './PictureImage';
import { trackEvent } from '../lib/tracking';
import styles from './ModelSection.module.css';

/** Bentuk katalog yang dipajang. Gambar dan alt mengikuti aset yang sudah ada. */
const MODEL_KATALOG = [
  { id: 'capsul', nama: 'capsul', gambar: 'model-capsul', alt: 'Cermin LED bentuk capsul' },
  { id: 'leaf', nama: 'leaf', gambar: 'model-leaf', alt: 'Cermin LED bentuk leaf' },
  { id: 'halfmoon', nama: 'half moon', gambar: 'model-halfmoon', alt: 'Cermin LED bentuk half moon' },
  { id: 'rectangle', nama: 'rectangle', gambar: 'model-rectangle', alt: 'Cermin LED bentuk rectangle' },
] as const;

// Animation variants for staggered card entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function ModelSection() {
  // Di bawah 768 px kartu bisa digeser; di desktop Embla dimatikan lewat
  // breakpoint supaya tidak ada transform dan listener yang tidak terpakai.
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    loop: false,
    breakpoints: {
      '(min-width: 768px)': { active: false },
    },
  });

  const [slideAktif, setSlideAktif] = useState(0);
  const [bisaMundur, setBisaMundur] = useState(false);
  const [bisaMaju, setBisaMaju] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;

    const sinkron = () => {
      setSlideAktif(emblaApi.selectedScrollSnap());
      setBisaMundur(emblaApi.canScrollPrev());
      setBisaMaju(emblaApi.canScrollNext());
    };

    sinkron();
    emblaApi.on('select', sinkron);
    emblaApi.on('reInit', sinkron);

    return () => {
      emblaApi.off('select', sinkron);
      emblaApi.off('reInit', sinkron);
    };
  }, [emblaApi]);

  const keSlide = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);
  const mundur = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const maju = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const padaTombolPanah = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        mundur();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        maju();
      }
    },
    [mundur, maju],
  );

  return (
    <section
      id="model"
      style={{
        background: 'var(--paper-cold)',
        color: 'var(--navy)',
        padding: 'var(--space-24) 0',
      }}
    >
      <div className="wrap">
        <motion.h2
          className="h2 disp"
          style={{ margin: 0, color: 'var(--navy)' }}
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: '0px 0px -100px 0px' }}
        >
          custom atau model jadi?
        </motion.h2>
        <motion.p
          style={{
            margin: 'var(--space-6) 0 0',
            maxWidth: '36em',
            fontSize: '18px',
            lineHeight: 'var(--line-height-normal)',
            color: 'var(--slate)',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true, margin: '0px 0px -100px 0px' }}
        >
          Pilih custom kalau ukuran dindingmu tidak standar. Pilih model jadi kalau mau cepat dari katalog.
        </motion.p>

        <div className="two model-two" style={{ marginTop: 'var(--space-16)' }}>
          {/* Jalur Custom */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <h3 className="disp" style={{ margin: 0, fontSize: '30px', color: 'var(--navy)' }}>
              custom
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: '16px',
                lineHeight: 'var(--line-height-normal)',
                color: 'var(--slate)',
                maxWidth: '28em',
              }}
            >
              Ukuran dan bentuk bebas. Untuk kamar mandi, kamar tidur, ruang tamu, toko, atau dinding dengan ukuran tidak standar.
            </p>
            <ul
              style={{
                margin: 0,
                paddingLeft: '20px',
                fontSize: '15px',
                lineHeight: '1.8',
                color: 'var(--navy)',
              }}
            >
              <li>LED 3 warna atau LED 1 warna</li>
              <li>Touchscreen, atau sensor tangan dengan baterai</li>
              <li>Antifog bisa ditambahkan</li>
            </ul>
            <a href="#rancang" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--blue)' }}>
              Rancang ukuran custom
            </a>
            <div style={{ marginTop: 'var(--space-4)', width: '100%' }}>
              <PictureImage
                name="custom-octagon"
                alt="Cermin LED bentuk oktagon dengan bingkai cahaya, memantulkan sofa dan dekorasi ruang tamu"
                sizes="(max-width: 860px) calc(100vw - 40px), 520px"
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '4 / 3',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-2xl)',
                  boxShadow: 'var(--shadow-md)',
                  display: 'block',
                }}
              />
            </div>
          </div>

          {/* Jalur Model Jadi */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <h3 className="disp" style={{ margin: 0, fontSize: '30px', color: 'var(--navy)' }}>
              model jadi
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: '16px',
                lineHeight: 'var(--line-height-normal)',
                color: 'var(--slate)',
                maxWidth: '34em',
              }}
            >
              Bentuk dan ukuran katalog, seri sandblast atau tanpa sandblast. Pilih touchscreen, sensor tangan, atau baterai cas Type-C.
            </p>
            <a href="#rancang" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--blue)' }}>
              Lihat semua bentuk katalog
            </a>

            <motion.div
              className={styles.carousel}
              role="group"
              aria-roledescription="carousel"
              aria-label="Bentuk model jadi dari katalog"
              onKeyDown={padaTombolPanah}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '0px 0px -100px 0px' }}
              variants={containerVariants}
            >
              <div className={styles.viewport} ref={emblaRef}>
                <ul className={styles.container}>
                  {MODEL_KATALOG.map((model) => (
                    <motion.li
                      className={styles.slide}
                      key={model.id}
                      variants={cardVariants}
                    >
                      <a
                        href="#rancang"
                        className={styles.card}
                        onClick={() => trackEvent('model_click', { model: model.id })}
                        role="button"
                        tabIndex={0}
                      >
                        <figure style={{ margin: 0 }}>
                          <span className={styles.media}>
                            <PictureImage
                              name={model.gambar}
                              alt={model.alt}
                              sizes="(max-width: 767px) 64vw, (max-width: 860px) calc(50vw - 30px), 300px"
                              className={styles.img}
                            />
                          </span>
                          <figcaption className={styles.caption}>
                            <span>{model.nama}</span>
                            <span
                              className={styles.captionHint}
                              aria-label="Tombol untuk menghitung harga model"
                            >
                              Hitung harga
                            </span>
                          </figcaption>
                        </figure>
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className={styles.controls}>
                <div className={styles.dots}>
                  {MODEL_KATALOG.map((model, i) => (
                    <motion.button
                      key={model.id}
                      type="button"
                      className={`${styles.dot} ${i === slideAktif ? styles.dotActive : ''}`}
                      aria-label={`Lihat model ${model.nama}`}
                      aria-current={i === slideAktif ? 'true' : undefined}
                      onClick={() => keSlide(i)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    />
                  ))}
                </div>
                <div className={styles.arrows}>
                  <motion.button
                    type="button"
                    className={styles.arrow}
                    aria-label="Model sebelumnya"
                    onClick={mundur}
                    disabled={!bisaMundur}
                    whileHover={bisaMundur ? { scale: 1.05, y: -2 } : {}}
                    whileTap={bisaMundur ? { scale: 0.95 } : {}}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </motion.button>
                  <motion.button
                    type="button"
                    className={styles.arrow}
                    aria-label="Model berikutnya"
                    onClick={maju}
                    disabled={!bisaMaju}
                    whileHover={bisaMaju ? { scale: 1.05, y: -2 } : {}}
                    whileTap={bisaMaju ? { scale: 0.95 } : {}}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
