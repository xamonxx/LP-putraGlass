'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import styles from './HeroSection.module.css';
import { COLOR_TEMPS } from '../lib/constants';
import { LeadSourceCode, buildWhatsAppLink, getStoredLeadSource, trackEvent, trackLeadClick } from '../lib/tracking';

export function HeroSection() {
  const [activeTempIndex, setActiveTempIndex] = useState(0);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const heroRef = useRef<HTMLElement>(null);
  const [leadCode, setLeadCode] = useState<LeadSourceCode>('LP-LANGSUNG');

  const cur = COLOR_TEMPS[activeTempIndex];

  useEffect(() => {
    let viewSent = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
        if (!viewSent && entry.intersectionRatio >= 0.5) {
          viewSent = true;
          trackEvent('section_view', { section: 'hero' });
        }
      },
      { threshold: [0.1, 0.5] }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    setLeadCode(getStoredLeadSource());

    return () => observer.disconnect();
  }, []);

  const handleNextTemp = () => {
    setActiveTempIndex((prev) => (prev + 1) % COLOR_TEMPS.length);
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // no-op
      }
    }
  };

  const handleSelectTemp = (index: number) => {
    setActiveTempIndex(index);
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // no-op
      }
    }
  };

  const waUrl = buildWhatsAppLink('Halo Putra Glass, saya mau tanya harga cermin LED.', leadCode);
  const haloClass = `${styles.halo} ${isHeroVisible ? styles.isBreathing : ''}`.trim();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 0.68, 0.24, 1] },
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, ease: [0.22, 0.68, 0.24, 1] },
    },
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '80px 0 96px',
        background: `radial-gradient(640px 560px at 72% 46%, ${isHeroVisible ? cur.wall : 'rgba(20,28,51,0)'}, rgba(20,28,51,0) 70%), #141C33`,
        transition: 'background var(--duration-slow) var(--ease-smooth)',
      }}
    >
      <div className="wrap hero-grid">
        {/* Left Column: Text & CTAs */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h1
            className="disp"
            style={{ 
              margin: '0 0 24px 0',
              fontSize: 'var(--font-display-lg)',
              color: '#FFFFFF',
              lineHeight: 1.2,
            }}
            variants={itemVariants}
          >
            Cermin LED yang ukurannya kamu tentukan.
          </motion.h1>
          <motion.p
            style={{
              margin: '24px 0 0',
              maxWidth: '30em',
              fontSize: 'var(--font-body-lg)',
              lineHeight: 1.6,
              color: '#C9D2E0',
            }}
            variants={itemVariants}
          >
            Dibuat per pesanan di workshop kami di Citatah, Bandung Barat. Bentuk bebas, tiga warna cahaya dalam satu sentuhan.
          </motion.p>

          {/* Trust indicators */}
          <motion.ul
            style={{
              margin: '24px 0 0',
              padding: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: 'var(--font-body-sm)',
              color: '#A0ADBF',
            }}
            variants={itemVariants}
          >
            <li>✓ Produksi 1–5 hari kerja</li>
            <li>✓ Kirim ke seluruh Indonesia</li>
            <li>✓ Garansi kualitas terjamin</li>
          </motion.ul>

          {/* CTA Group */}
          <motion.div
            style={{
              margin: '32px 0 0',
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
            }}
            variants={itemVariants}
          >
            <a
              href="#rancang"
              onClick={() => trackLeadClick('hero_primary_cta')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                minHeight: '48px',
                padding: '12px 28px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--accent-conversion)',
                color: '#FFFFFF',
                fontWeight: 'var(--font-weight-semibold)',
                fontSize: 'var(--font-body-sm)',
                textDecoration: 'none',
                transition: 'all var(--duration-fast) ease',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(22, 199, 132, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Rancang Cermin
            </a>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.currentTarget.href = buildWhatsAppLink('Halo Putra Glass, saya mau tanya harga cermin LED.', leadCode);
                trackLeadClick('hero_secondary_cta');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                minHeight: '48px',
                padding: '12px 28px',
                borderRadius: 'var(--radius-lg)',
                background: 'transparent',
                color: 'var(--accent-conversion)',
                fontWeight: 'var(--font-weight-semibold)',
                fontSize: 'var(--font-body-sm)',
                textDecoration: 'none',
                border: '2px solid var(--accent-conversion)',
                transition: 'all var(--duration-fast) ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(22, 199, 132, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Chat WhatsApp
            </a>
          </motion.div>

          {/* Color Temperature Selector */}
          <motion.div
            style={{
              margin: '48px 0 0',
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              fontSize: 'var(--font-body-sm)',
              color: '#A0ADBF',
            }}
            variants={itemVariants}
          >
            <span>Warna cahaya:</span>
            {COLOR_TEMPS.map((temp, idx) => (
              <button
                key={temp.id}
                onClick={() => handleSelectTemp(idx)}
                aria-label={`Pilih warna ${temp.label}`}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: temp.glow,
                  border: activeTempIndex === idx ? '3px solid #FFFFFF' : '2px solid rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast) ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Right Column: Product Image Preview */}
        <motion.div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            perspective: '1000px',
          }}
          variants={imageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Decorative background circle */}
          <div
            className={styles.haloShift}
            style={{
              position: 'absolute',
              inset: '-20%',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${cur.wall}33, transparent)`,
              zIndex: -1,
            }}
          />

          {/* Halo glow */}
          <div
            className={haloClass}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${cur.glow}40, transparent 70%)`,
              filter: 'blur(40px)',
            }}
          />

          {/* Mirror preview SVG */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 320 400"
            style={{
              maxWidth: '320px',
              maxHeight: '400px',
              filter: `drop-shadow(0 20px 40px rgba(0,0,0,0.3))`,
            }}
            aria-label="Cermin LED preview"
          >
            <defs>
              <linearGradient id="mirrorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={cur.glow} stopOpacity="0.2" />
                <stop offset="100%" stopColor={cur.glow} stopOpacity="0.5" />
              </linearGradient>
            </defs>

            {/* Mirror body */}
            <rect
              x="40"
              y="40"
              width="240"
              height="320"
              rx="16"
              fill="url(#mirrorGradient)"
              stroke={cur.glow}
              strokeWidth="2"
            />

            {/* LED edge highlight */}
            <rect
              x="45"
              y="45"
              width="230"
              height="310"
              rx="12"
              fill="none"
              stroke={cur.glow}
              strokeWidth="1"
              opacity="0.6"
            />

            {/* Light reflection */}
            <ellipse
              cx="100"
              cy="100"
              rx="40"
              ry="60"
              fill={cur.glow}
              opacity="0.15"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
