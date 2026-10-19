'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './Reveal.module.css';
import { trackEvent } from '../lib/tracking';

export type RevealVariant = 'fade-up' | 'fade' | 'scale' | 'blur';

const VARIANT_CLASS: Record<RevealVariant, string> = {
  'fade-up': '',
  fade: styles.fade,
  scale: styles.scale,
  blur: styles.blur,
};

export interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  /** Tag yang dirender. Default `div`. */
  as?: React.ElementType;
  /** Jeda berurutan antar kartu, dalam milidetik. */
  delay?: number;
  variant?: RevealVariant;
  /**
   * Kalau diisi, kirim `section_view` sekali saat section terdekat pertama kali
   * terlihat 50%. Yang diamati adalah elemen `<section>` induk, bukan pembungkus
   * ini, supaya angkanya benar-benar mewakili section.
   */
  trackSection?: string;
}

/** Ambang "sudah dilihat": separuh elemen, atau separuh layar untuk section tinggi. */
function isHalfSeen(entry: IntersectionObserverEntry): boolean {
  if (entry.intersectionRatio >= 0.5) return true;
  const viewportHalf = (entry.rootBounds?.height ?? window.innerHeight) / 2;
  return entry.intersectionRect.height >= viewportHalf;
}

export function Reveal({
  as,
  delay = 0,
  variant = 'fade-up',
  className,
  trackSection,
  style,
  children,
  ...rest
}: RevealProps) {
  const nodeRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const supportsViewTimeline =
      typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      CSS.supports('animation-timeline: view()');

    const observers: IntersectionObserver[] = [];

    // Jalur cadangan: hanya dipasang kalau CSS scroll-driven tidak tersedia.
    if (!supportsViewTimeline && !reduceMotion) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setIsVisible(true);
              revealObserver.disconnect();
              break;
            }
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
      );
      revealObserver.observe(node);
      observers.push(revealObserver);
    }

    if (trackSection) {
      const target: Element = node.closest('section') ?? node;
      const viewObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && isHalfSeen(entry)) {
              trackEvent('section_view', { section: trackSection });
              viewObserver.disconnect();
              break;
            }
          }
        },
        { threshold: [0.1, 0.25, 0.5, 0.75] }
      );
      viewObserver.observe(target);
      observers.push(viewObserver);
    }

    return () => observers.forEach((observer) => observer.disconnect());
  }, [trackSection]);

  // Jeda diterjemahkan jadi dua hal: geseran rentang scroll (jalur utama) dan
  // animation-delay (jalur cadangan). Dibatasi supaya kartu terakhir tidak
  // tertinggal terlalu jauh.
  const shift = Math.min(Math.round(delay / 10), 24);
  const vars = {
    '--reveal-shift': `${shift}%`,
    '--reveal-delay': `${Math.min(delay, 420)}ms`,
    ...style,
  } as React.CSSProperties;

  const Tag = (as ?? 'div') as React.ElementType;
  const classes = [styles.reveal, VARIANT_CLASS[variant], isVisible ? styles.isVisible : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag ref={nodeRef} className={classes} style={vars} {...rest}>
      {children}
    </Tag>
  );
}
