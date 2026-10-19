'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PictureImage } from './PictureImage';
import { Reveal } from './Reveal';
import styles from './AntifogDemoSection.module.css';

export function AntifogDemoSection() {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const inputRef = useRef<HTMLInputElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle mouse/touch drag
  const handlePointerDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging || !frameRef.current) return;

      const rect = frameRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPos(percent);
    },
    [isDragging]
  );

  // Keyboard support for fine control
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSliderPos((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSliderPos((prev) => Math.min(100, prev + 5));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSliderPos(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setSliderPos(100);
    }
  }, []);

  // Touch/pointer support
  useEffect(() => {
    if (!isDragging) return;

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  // Sync input value
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = String(sliderPos);
    }
  }, [sliderPos]);

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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const sliderVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, delay: 0.15 },
    },
  };
  return (
    <motion.section
      id="antifog"
      className={styles.section}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: '-100px' }}
    >
      <div className={styles.wrap}>
        <motion.div
          className={styles.layout}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Left Column: Text & CTA */}
          <div className={styles.content}>
            <Reveal trackSection="antifog">
              <motion.h2 className={styles.title} variants={itemVariants}>
                tetap jernih setelah mandi air panas.
              </motion.h2>
            </Reveal>

            <Reveal delay={90}>
              <motion.p className={styles.description} variants={itemVariants}>
                Pad pemanas tipis di balik kaca menjaga permukaannya tetap hangat, jadi uap air tidak sempat mengembun. Kamu langsung bisa bercermin selesai mandi.
              </motion.p>
            </Reveal>

            <Reveal delay={180}>
              <motion.ul className={styles.features} variants={itemVariants}>
                <li className={styles.feature}>
                  <span className={styles.featureDot} />
                  Bisa ditambahkan ke cermin LED custom.
                </li>
                <li className={styles.feature}>
                  <span className={styles.featureDot} />
                  Pilih &quot;Tambah antifog&quot; di langkah 03 saat merancang.
                </li>
              </motion.ul>
            </Reveal>

            <Reveal delay={260}>
              <motion.div className={styles.cta} variants={itemVariants}>
                <a href="#rancang" className={styles.ctaButton}>
                  Rancang dengan antifog
                </a>
              </motion.div>
            </Reveal>
          </div>

          {/* Right Column: Slider 5:4 (Max 640px) */}
          <Reveal variant="scale" delay={120}>
            <motion.div className={styles.sliderContainer} variants={sliderVariants}>
              <div
                ref={frameRef}
                className={styles.sliderFrame}
                onPointerDown={handlePointerDown}
                role="application"
                aria-label="Slider perbandingan cermin dengan dan tanpa antifog"
              >
                {/* Bottom Layer: antifog-dengan (Clear) */}
                <div className={styles.imageLayer}>
                  <PictureImage
                    name="antifog-dengan"
                    alt="Kaca cermin LED Putra Glass jernih dengan antifog dari render katalog"
                    sizes="(max-width: 860px) calc(100vw - 40px), 640px"
                    className={styles.image}
                  />
                </div>

                {/* Top Layer: antifog-tanpa (Fogged) - Clipped */}
                <div
                  className={styles.imageLayerClipped}
                  style={{
                    clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                    WebkitClipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                  }}
                >
                  <PictureImage
                    name="antifog-tanpa"
                    alt="Simulasi kaca cermin berembun tanpa antifog dari render katalog"
                    sizes="(max-width: 860px) calc(100vw - 40px), 640px"
                    className={styles.image}
                  />
                </div>

                {/* Left Badge */}
                <span className={`${styles.badge} ${styles.badgeLeft}`}>
                  Tanpa antifog
                </span>

                {/* Right Badge */}
                <span className={`${styles.badge} ${styles.badgeRight}`}>
                  Dengan antifog
                </span>

                {/* Divider Line */}
                <motion.div
                  className={styles.divider}
                  style={{ left: `${sliderPos}%` }}
                  animate={{ left: `${sliderPos}%` }}
                  transition={{ duration: 0.05 }}
                />

                {/* Draggable Handle with Visual Affordance */}
                <motion.div
                  className={styles.handle}
                  style={{
                    left: `${sliderPos}%`,
                    translateX: '-50%',
                  }}
                  animate={{ left: `${sliderPos}%` }}
                  transition={{ duration: 0.05 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </motion.div>

                {/* Invisible Range Input for Accessibility & Touch */}
                <input
                  ref={inputRef}
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  onKeyDown={handleKeyDown}
                  aria-label="Geser untuk membandingkan kaca dengan dan tanpa antifog"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(sliderPos)}
                  aria-valuetext={`${Math.round(sliderPos)}% antifog`}
                  className={styles.input}
                />
              </div>

              <p className={styles.caption}>
                Geser garisnya. Kiri: simulasi kaca berembun. Kanan: kaca dengan antifog. Gambar dari render katalog Putra Glass.
              </p>
            </motion.div>
          </Reveal>
        </motion.div>
      </div>
    </motion.section>
  );
}
