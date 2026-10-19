'use client';

import React, { useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { FAQ_ITEMS } from '../data/faq';
import { buildWhatsAppLink, getStoredLeadSource, trackEvent, trackLeadClick } from '../lib/tracking';
import styles from './FaqSection.module.css';

const WA_MSG = 'Halo Putra Glass, saya masih ada pertanyaan sebelum pesan cermin LED.';

export function FaqSection() {
  // Akordeon dikendalikan supaya event `faq_open` bisa dikirim per pertanyaan
  const [terbuka, setTerbuka] = useState('');

  const handleValueChange = (value: string) => {
    setTerbuka(value);
    if (value) {
      trackEvent('faq_open', { question_id: value });
    }
  };

  const waHref = buildWhatsAppLink(WA_MSG);

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Hitung ulang saat diklik supaya kode sumber iklan (UTM) yang terbaru ikut terkirim
    e.currentTarget.href = buildWhatsAppLink(WA_MSG, getStoredLeadSource());
    trackLeadClick('faq_cta');
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

          <div>
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
                    <Accordion.Trigger className={styles.trigger}>
                      {item.pertanyaan}
                      <span className={styles.chevron} aria-hidden="true">
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
                      </span>
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className={styles.content}>
                    <p className={styles.answer}>{item.jawaban}</p>
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
