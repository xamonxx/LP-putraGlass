'use client';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ScrollToButton } from './ScrollToButton';
import { trackEvent } from '../lib/tracking';
import styles from './HeroSection.module.css';

const MotionLink = motion.create(Link);
const portraitMedia = '(max-width: 1023px) and (orientation: portrait)';
// Desktop and mobile artwork share one aspect ratio each (16:9 / 9:16); sizes accounts for cover-cropping.
const mobileWidths = [320, 480, 768, 941];
const desktopWidths = [768, 1280, 1672];
const imageSet = (art: 'mobile' | 'desktop', format: 'avif' | 'webp', widths: number[]) => widths.map(width => `/img/hero/lighting/${art}-${width}.${format} ${width}w`).join(', ');

export function HeroSection() {
  return <section id="hero" className={styles.hero} aria-labelledby="hero-title">
    <picture className={styles.background}>
      <source media={portraitMedia} type="image/avif" srcSet={imageSet('mobile', 'avif', mobileWidths)} sizes="max(100vw, 56.25vh)"/>
      <source media={portraitMedia} type="image/webp" srcSet={imageSet('mobile', 'webp', mobileWidths)} sizes="max(100vw, 56.25vh)"/>
      <source type="image/avif" srcSet={imageSet('desktop', 'avif', desktopWidths)} sizes="max(100vw, 177.78vh)"/>
      <source type="image/webp" srcSet={imageSet('desktop', 'webp', desktopWidths)} sizes="max(100vw, 177.78vh)"/>
      {/* eslint-disable-next-line @next/next/no-img-element -- art direction and optimized local files for static export */}
      <img src="/img/hero/lighting/desktop-1672.webp" width="1672" height="941" alt="" loading="eager" fetchPriority="high" decoding="async"/>
    </picture>
    <div className={styles.glow} aria-hidden="true"/>
    <div className={styles.wash} aria-hidden="true"/>
    <div className={`wrap ${styles.layout}`}>
      <div className={styles.content}>
        <div className={styles.copy}>
          <span className={styles.kicker}>Putra Glass — cermin LED custom</span>
          <h1 id="hero-title" className={styles.title}>Cahaya yang<br/>membentuk <em>ruang.</em></h1>
          <p className={styles.description}>Cermin LED, dirancang untuk menyatu dengan ruang Anda. Temukan bentuk dan cahaya yang terasa tepat.</p>
        </div>
        <div className={styles.actions}>
          <MotionLink href="/showroom" className={`button-primary ${styles.primary}`} whileTap={{ scale: .98 }} onClick={() => trackEvent('showroom_entry', { source: 'hero' })}>Eksplorasi cermin 3D <span aria-hidden="true">↗</span></MotionLink>
          <Link href="/katalog" className={`text-link ${styles.secondary}`}>Lihat katalog <span aria-hidden="true">→</span></Link>
        </div>
      </div>
      <div className={styles.footer}>
        <p className={styles.caption}>Visualisasi suasana · ilustrasi digital</p>
        <ScrollToButton target="model" className={`text-link ${styles.scroll}`}>Jelajahi koleksi <span aria-hidden="true">↓</span></ScrollToButton>
      </div>
    </div>
  </section>;
}
