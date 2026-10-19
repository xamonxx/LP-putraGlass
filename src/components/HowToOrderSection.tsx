'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LeadSourceCode,
  buildWhatsAppLink,
  getStoredLeadSource,
  trackLeadClick,
} from '../lib/tracking';
import styles from './HowToOrderSection.module.css';
const TIMELINE_STEPS = [
  {
    num: '02',
    title: 'DP 50%',
    badge: 'Transfer BCA',
    desc: 'Transfer DP, pesananmu langsung masuk antrean produksi.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Produksi',
    badge: '1–5 hari kerja',
    desc: 'Dipotong, dibevel, dan dirakit di workshop Citatah. Kamu dapat foto dan video saat cerminnya dikerjakan.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <line x1="12" y1="2" x2="12" y2="6" />
        <line x1="12" y1="18" x2="12" y2="22" />
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
        <line x1="2" y1="12" x2="6" y2="12" />
        <line x1="18" y1="12" x2="22" y2="12" />
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Pelunasan dan kirim',
    badge: 'Foto packing + resi',
    desc: 'Foto produk dan packing dikirim dulu, baru pelunasan. Luar kota dikemas packing kayu.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    num: '05',
    title: 'Pasang dan pakai',
    badge: 'Garansi aktif',
    desc: 'Garansi aktif sejak barang sampai. Simpan video unboxing untuk klaim.',
    isSuccess: true,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06301A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
];

export function HowToOrderSection() {
  const [leadCode, setLeadCode] = useState<LeadSourceCode>('LP-LANGSUNG');

  useEffect(() => {
    setLeadCode(getStoredLeadSource());
  }, []);

  const waMsg = 'Halo Putra Glass, saya mau konsultasi cermin LED.';
  const waHref = buildWhatsAppLink(waMsg, leadCode);

  const handleSendWA = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackLeadClick('cara_pesan_konsultasi');
    e.currentTarget.href = buildWhatsAppLink(waMsg, getStoredLeadSource());
  };

  return (
    <section id="cara-pesan" className={styles.section}>
      <div className="wrap">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className={`h2 disp ${styles.header}`}>
            cara pesan
          </h2>
          <p className={styles.description}>
            Dari chat pertama sampai cermin terpasang. Di setiap tahap kamu dapat kabar dan fotonya.
          </p>
        </motion.div>

        <div className={styles.layout}>
          {/* Kolom Kiri: Kartu Navy 01 MULAI DI SINI */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className={styles.startCard}
          >
            {/* Badge 01 MULAI DI SINI */}
            <div className={styles.startBadge}>
              <span className={styles.badgeNumber}>
                01
              </span>
              <span className={styles.badgeLabel}>
                MULAI DI SINI
              </span>
            </div>

            <h3 className={`disp ${styles.startHeading}`}>
              konsultasi gratis di WhatsApp.
            </h3>

            <p className={styles.startDescription}>
              Kirim ukuran dinding, foto ruangan, atau rancangan dari website. Admin bantu pilih bentuk, ukuran, dan lampu, lalu kirim harga final dan PDF penawaran.
            </p>

            {/* 3 Poin Centang */}
            <ul className={styles.checkList}>
              <li className={styles.checkItem}>
                <span className={styles.checkIcon}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9CCFC2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Bisa tanya dulu, belum ada kewajiban beli
              </li>
              <li className={styles.checkItem}>
                <span className={styles.checkIcon}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9CCFC2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Harga final dan PDF penawaran resmi
              </li>
              <li className={styles.checkItem}>
                <span className={styles.checkIcon}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9CCFC2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Saran ukuran sesuai dinding dan wastafelmu
              </li>
            </ul>

            {/* Tombol Hijau Mulai Konsultasi */}
            <div className={styles.ctaWrapper}>
              <a
                className={styles.waButton}
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleSendWA}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06301A" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
                </svg>
                Mulai konsultasi
              </a>
            </div>
          </motion.div>

          {/* Kolom Kanan: Timeline Vertikal 02 - 05 */}
          <div className={styles.timelineContainer}>
            {/* Garis LED Penghubung Vertikal */}
            <div className={styles.timelineLine} aria-hidden="true" />

            <div className={styles.timelineList}>
              {TIMELINE_STEPS.map((step, idx) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2 + idx * 0.1,
                  }}
                  className={styles.timelineRow}
                >
                  {/* Node Berikon */}
                  <div className={`${styles.timelineNode} ${step.isSuccess ? styles.successNode : ''}`}>
                    {step.icon}
                  </div>

                  {/* Kartu Putih */}
                  <div className={styles.timelineCard}>
                    <div className={styles.cardHeader}>
                      <span className={`disp ${styles.cardTitle}`}>
                        {step.num} {step.title}
                      </span>
                      <span
                        className={`${styles.stepBadge} ${
                          step.isSuccess ? styles.stepBadgeSuccess : styles.stepBadgeDefault
                        }`}
                      >
                        {step.badge}
                      </span>
                    </div>
                    <p className={styles.cardDescription}>
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
