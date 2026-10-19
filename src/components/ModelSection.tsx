'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
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
    <section id="model" style={{ background: '#F3F5F8', color: '#1B2233', padding: '96px 0' }}>
      <div className="wrap">
        <h2 className="h2 disp" style={{ margin: 0, color: '#253254' }}>
          custom atau model jadi?
        </h2>
        <p style={{ margin: '18px 0 0', maxWidth: '36em', fontSize: '18px', lineHeight: 1.6, color: '#4A5468' }}>
          Pilih custom kalau ukuran dindingmu tidak standar. Pilih model jadi kalau mau cepat dari katalog.
        </p>

        <div className="two model-two" style={{ marginTop: '56px' }}>
          {/* Jalur Custom */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <h3 className="disp" style={{ margin: 0, fontSize: '30px', color: '#253254' }}>
              custom
            </h3>
            <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.6, color: '#4A5468', maxWidth: '28em' }}>
              Ukuran dan bentuk bebas. Untuk kamar mandi, kamar tidur, ruang tamu, toko, atau dinding dengan ukuran tidak standar.
            </p>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '15px', lineHeight: 1.8, color: '#1B2233' }}>
              <li>LED 3 warna atau LED 1 warna</li>
              <li>Touchscreen, atau sensor tangan dengan baterai</li>
              <li>Antifog bisa ditambahkan</li>
            </ul>
            <a href="#rancang" style={{ fontSize: '16px', fontWeight: 600, color: '#275087' }}>
              Rancang ukuran custom
            </a>
            <div style={{ marginTop: '14px', width: '100%' }}>
              <PictureImage
                name="custom-octagon"
                alt="Cermin LED bentuk oktagon dengan bingkai cahaya, memantulkan sofa dan dekorasi ruang tamu"
                sizes="(max-width: 860px) calc(100vw - 40px), 520px"
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '4 / 3',
                  objectFit: 'cover',
                  borderRadius: '16px',
                  boxShadow: '0 16px 40px rgba(20, 28, 51, 0.08)',
                  display: 'block',
                }}
              />
            </div>
          </div>

          {/* Jalur Model Jadi */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <h3 className="disp" style={{ margin: 0, fontSize: '30px', color: '#253254' }}>
              model jadi
            </h3>
            <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.6, color: '#4A5468', maxWidth: '34em' }}>
              Bentuk dan ukuran katalog, seri sandblast atau tanpa sandblast. Pilih touchscreen, sensor tangan, atau baterai cas Type-C.
            </p>
            <a href="#rancang" style={{ fontSize: '16px', fontWeight: 600, color: '#275087' }}>
              Lihat semua bentuk katalog
            </a>

            <div
              className={styles.carousel}
              role="group"
              aria-roledescription="carousel"
              aria-label="Bentuk model jadi dari katalog"
              onKeyDown={padaTombolPanah}
            >
              <div className={styles.viewport} ref={emblaRef}>
                <ul className={styles.container}>
                  {MODEL_KATALOG.map((model) => (
                    <li className={styles.slide} key={model.id}>
                      <a
                        href="#rancang"
                        className={styles.card}
                        onClick={() => trackEvent('model_click', { model: model.id })}
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
                            <span className={styles.captionHint}>Hitung harga</span>
                          </figcaption>
                        </figure>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.controls}>
                <div className={styles.dots}>
                  {MODEL_KATALOG.map((model, i) => (
                    <button
                      key={model.id}
                      type="button"
                      className={`${styles.dot} ${i === slideAktif ? styles.dotActive : ''}`}
                      aria-label={`Lihat model ${model.nama}`}
                      aria-current={i === slideAktif ? 'true' : undefined}
                      onClick={() => keSlide(i)}
                    />
                  ))}
                </div>
                <div className={styles.arrows}>
                  <button
                    type="button"
                    className={styles.arrow}
                    aria-label="Model sebelumnya"
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
                    aria-label="Model berikutnya"
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
          </div>
        </div>
      </div>
    </section>
  );
}
