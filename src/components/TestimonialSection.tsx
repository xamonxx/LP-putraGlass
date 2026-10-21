'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import type { Variants } from 'motion/react';
import useEmblaCarousel from 'embla-carousel-react';
import { TESTIMONIALS, type Testimonial } from '../data/testimonials';
import { trackEvent } from '../lib/tracking';
import styles from './TestimonialSection.module.css';

const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

/** Format tanggal sendiri supaya hasil server dan browser selalu sama. */
function formatTanggal(iso: string): string {
  const [tahun, bulan, hari] = iso.split('-');
  const indeks = Number(bulan) - 1;
  if (!tahun || Number.isNaN(indeks) || !BULAN[indeks]) return iso;
  return `${Number(hari)} ${BULAN[indeks]} ${tahun}`;
}

function inisial(nama: string): string {
  return nama
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((bagian) => bagian[0]?.toUpperCase() ?? '')
    .join('');
}

function Bintang({ nilai }: { nilai: Testimonial['rating'] }) {
  return (
    <span className={styles.stars} role="img" aria-label={`Rating ${nilai} dari 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={i > nilai ? styles.starOff : undefined}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.45 6.2 20.5l1.1-6.47L2.6 9.45l6.5-.95L12 2.6z" />
        </svg>
      ))}
    </span>
  );
}

export function TestimonialSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    loop: false,
  });

  const [slideAktif, setSlideAktif] = useState(0);
  const [bisaMundur, setBisaMundur] = useState(false);
  const [bisaMaju, setBisaMaju] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const kurangiGerak = useRef(false);
  const indeksTerakhir = useRef(0);

  // Motion variants for stagger animation
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Hormati reduced motion: perpindahan slide dibuat langsung, tanpa animasi geser.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sinkron = () => {
      kurangiGerak.current = mq.matches;
    };
    sinkron();
    mq.addEventListener('change', sinkron);
    return () => mq.removeEventListener('change', sinkron);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const sinkron = () => {
      const index = emblaApi.selectedScrollSnap();
      setSlideAktif(index);
      setBisaMundur(emblaApi.canScrollPrev());
      setBisaMaju(emblaApi.canScrollNext());
      if (index !== indeksTerakhir.current) {
        indeksTerakhir.current = index;
        trackEvent('testimonial_swipe', { index });
      }
    };

    sinkron();
    emblaApi.on('select', sinkron);
    emblaApi.on('reInit', sinkron);

    return () => {
      emblaApi.off('select', sinkron);
      emblaApi.off('reInit', sinkron);
    };
  }, [emblaApi]);

  // Satu kali saja saat bagian ini benar-benar terlihat.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      trackEvent('testimonial_view');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            trackEvent('testimonial_view');
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const keSlide = useCallback(
    (index: number) => emblaApi?.scrollTo(index, kurangiGerak.current),
    [emblaApi],
  );

  const mundur = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollTo(emblaApi.selectedScrollSnap() - 1, kurangiGerak.current);
  }, [emblaApi]);

  const maju = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollTo(emblaApi.selectedScrollSnap() + 1, kurangiGerak.current);
  }, [emblaApi]);

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
    <section id="testimoni" className={styles.section} ref={sectionRef}>
      <div className="wrap">
        <div className={styles.head}>
          <div>
            <h2 className={`disp ${styles.title}`}>kata pembeli</h2>
            <p className={styles.lead}>
              Cerita pembeli yang cerminnya sudah terpasang, dari kamar mandi di rumah sampai lobi hotel.
            </p>
          </div>
        </div>

        <div
          className={styles.carousel}
          role="group"
          aria-roledescription="carousel"
          aria-label="Testimoni pembeli"
          onKeyDown={padaTombolPanah}
        >
          <div className={styles.viewport} ref={emblaRef}>
            <motion.div
              className={styles.container}
              variants={containerVariants}
              initial="hidden"
              animate={isVisible ? 'visible' : 'hidden'}
            >
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  className={styles.slide}
                  key={t.id}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Testimoni ${i + 1} dari ${TESTIMONIALS.length}`}
                  variants={cardVariants}
                >
                  <figure className={styles.card}>
                    <div className={styles.cardTop}>
                      <Bintang nilai={t.rating} />
                      <span className={styles.badge}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        Pembeli terverifikasi
                      </span>
                    </div>

                    <blockquote className={styles.quote}>
                      {t.teks}
                    </blockquote>

                    <figcaption className={styles.cardFoot}>
                      <span className={styles.avatar} aria-hidden="true">
                        {inisial(t.nama)}
                      </span>
                      <span className={styles.who}>
                        <span className={styles.nama}>{t.nama}</span>
                        <span className={styles.meta}>
                          {t.kota} · {t.produk}
                          <br />
                          <time dateTime={t.tanggal}>{formatTanggal(t.tanggal)}</time>
                        </span>
                      </span>
                    </figcaption>
                  </figure>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className={styles.controls}>
            <div className={styles.dots}>
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  className={`${styles.dot} ${i === slideAktif ? styles.dotActive : ''}`}
                  aria-label={`Lihat testimoni ${t.nama} dari ${t.kota}`}
                  aria-current={i === slideAktif ? 'true' : undefined}
                  onClick={() => keSlide(i)}
                />
              ))}
            </div>
            <div className={styles.arrows}>
              <button
                type="button"
                className={styles.arrow}
                aria-label="Testimoni sebelumnya"
                onClick={mundur}
                disabled={!bisaMundur}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                className={styles.arrow}
                aria-label="Testimoni berikutnya"
                onClick={maju}
                disabled={!bisaMaju}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bukti sosial statis. Angka unit mengikuti baris bukti di hero (4.000+ sejak
            Maret 2025). Detail garansi masih "menunggu konfirmasi" di PRD, jadi harus
            dicek ke owner sebelum tayang. */}
        <dl className={styles.proof}>
          <div className={styles.proofItem}>
            <dt className={`disp ${styles.proofAngka}`}>4.000+ unit</dt>
            <dd className={styles.proofTeks} style={{ margin: 0 }}>
              Cermin dan kaca terkirim sejak Maret 2025.
            </dd>
          </div>
          <div className={styles.proofItem}>
            <dt className={`disp ${styles.proofAngka}`}>Seluruh Indonesia</dt>
            <dd className={styles.proofTeks} style={{ margin: 0 }}>
              Dikirim dari workshop Citatah, Bandung Barat. Luar kota dikemas paking kayu bertulang.
            </dd>
          </div>
          <div className={styles.proofItem}>
            <dt className={`disp ${styles.proofAngka}`}>7 hari &amp; 3 bulan</dt>
            <dd className={styles.proofTeks} style={{ margin: 0 }}>
              Garansi pengiriman 7 hari, garansi fungsi lampu 3 bulan.
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
