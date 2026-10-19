'use client';

import React, { useState, useRef } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { motion } from 'framer-motion';
import { FAQ_ITEMS } from '../data/faq';
import { buildWhatsAppLink, getStoredLeadSource, trackEvent, trackLeadClick } from '../lib/tracking';
import styles from './FaqSection.module.css';
const WA_MSG = 'Halo Putra Glass, saya masih ada pertanyaan sebelum pesan cermin LED.';

export function FaqSection() {
  const [terbuka, setTerbuka] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const waHref = buildWhatsAppLink(WA_MSG);
  const leadSource = getStoredLeadSource();

  const handleCtaClick = () => {
    trackLeadClick('faq_cta');
  };

  const handleValueChange = (value: string) => {
    setTerbuka(value);
    if (value) {
      trackEvent('faq_open', { question_id: value });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const triggers = rootRef.current?.querySelectorAll('[role="button"]') as NodeListOf<HTMLElement>;
    if (!triggers || triggers.length === 0) return;

    const currentIndex = Array.from(triggers).findIndex((t) => t === document.activeElement);
    let nextIndex = currentIndex;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = (currentIndex + 1) % triggers.length;
        break;
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
        break;
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        nextIndex = triggers.length - 1;
        break;
      default:
        return;
    }

    triggers[nextIndex]?.focus();
  };

  return (
    <section id="faq" className={styles.section}>
      <div className="wrap">
        <div className={styles.layout}>
          <div className={styles.intro}>
            <p className={styles.kicker}>
              <span className={styles.kickerDot} aria-hidden="true" />
              Sebelum kamu pesan
            </p>
            <h2 className={`${styles.title} disp`}>pertanyaan umum</h2>
            <p className={styles.lead}>
              Yang paling sering ditanyakan sebelum DP: harga, lama pengerjaan, pengiriman, dan
              garansi. Kalau jawabannya belum ada di sini, admin siap menjawab di WhatsApp.
            </p>
          </div>
          <div onKeyDown={handleKeyDown} ref={rootRef}>
            <Accordion.Root
              type="single"
              collapsible
              value={terbuka}
              onValueChange={handleValueChange}
              className={styles.root}
            >
              {FAQ_ITEMS.map((item) => (
                <Accordion.Item key={item.id} value={item.id} className={styles.item}>
                  <Accordion.Header className={styles.header}>
                    <Accordion.Trigger className={styles.trigger} aria-expanded={terbuka === item.id}>
                      <span className={styles.triggerText}>{item.pertanyaan}</span>
                      <motion.span
                        className={styles.chevron}
                        animate={{ rotate: terbuka === item.id ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        aria-hidden="true"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </motion.span>
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className={styles.content}>
                    <motion.p
                      className={styles.answer}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, delay: 0.05, ease: [0.4, 0, 0.2, 1] }}
                    >
                      {item.jawaban}
                    </motion.p>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>

            <div className={styles.cta}>
              <p className={styles.ctaText}>
                Masih ada pertanyaan?
                <span className={styles.ctaNote}>
                  Kirim ukuran atau foto ruanganmu, dijawab langsung oleh admin workshop.
                </span>
              </p>
              <a
                className={styles.ctaButton}
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCtaClick}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
                </svg>
                Chat WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
