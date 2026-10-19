'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  WORKSHOP_ADDRESS,
  PHONE_DISPLAY,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  TIKTOK_HANDLE,
  TIKTOK_URL,
} from '../lib/constants';
import { buildWhatsAppLink, getStoredLeadSource, trackLeadClick } from '../lib/tracking';
import styles from './FooterSection.module.css';


export function FooterSection() {
  const WA_MSG = 'Halo Putra Glass, saya mau kirim ukuran cermin.';
  const waUrl = buildWhatsAppLink(WA_MSG);

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
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <footer id="proyek" className={styles.footer}>
      <div className="wrap">
        <motion.div
          className={styles.ctaSection}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div className={styles.ctaContent} variants={itemVariants}>
            <h2 className={`h2 disp ${styles.ctaHeading}`}>
              ukuran apa pun, bentuk apa pun. kirim, kami kerjakan.
            </h2>
            <p className={styles.ctaDescription}>
              Cermin LED, kaca es, kaca polos 3–8 mm, sampai kaca moru, dipotong sesuai ukuran di lapangan. Untuk rumah, kantor, toko, hotel, kafe, atau proyek interior. Kirim satu ukuran atau daftar sekaligus, kami siapkan penawaran dan jadwal produksinya.
            </p>
          </motion.div>

          <motion.a
            className={styles.waButton}
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              // Hitung ulang saat diklik supaya kode sumber iklan (UTM) yang terbaru ikut terkirim
              e.currentTarget.href = buildWhatsAppLink(WA_MSG, getStoredLeadSource());
              trackLeadClick('footer_wa_btn');
            }}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Kirim ukuran lewat WhatsApp
          </motion.a>
        </motion.div>

        <motion.div
          className={styles.bottomSection}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className={styles.footerNav}>
            <div className={styles.brand}>
              <svg 
                className={styles.logoSvg}
                viewBox="0 0 44 24" 
                aria-hidden="true"
              >
                <rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" fill="#A6A6A6" />
                <rect x="15" y="5" width="14" height="14" transform="rotate(45 22 12)" fill="#253254" />
                <rect x="25" y="5" width="14" height="14" transform="rotate(45 32 12)" fill="#BFCBD9" />
              </svg>
              <span className={styles.brandName}>PUTRA GLASS</span>
            </div>

            <div className={styles.contactLinks}>
              <span className={styles.contactAddress}>{WORKSHOP_ADDRESS}</span>
              <a
                className={styles.contactLink}
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Hubungi Putra Glass melalui WhatsApp: ${PHONE_DISPLAY}`}
                onClick={(e) => {
                  e.currentTarget.href = buildWhatsAppLink(WA_MSG, getStoredLeadSource());
                  trackLeadClick('footer_wa_text');
                }}
              >
                WhatsApp {PHONE_DISPLAY}
              </a>
              <a 
                className={styles.contactLink}
                href={INSTAGRAM_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label={`Kunjungi Instagram Putra Glass: ${INSTAGRAM_HANDLE}`}
              >
                Instagram {INSTAGRAM_HANDLE}
              </a>
              <a 
                className={styles.contactLink}
                href={TIKTOK_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label={`Kunjungi TikTok Putra Glass: ${TIKTOK_HANDLE}`}
              >
                TikTok {TIKTOK_HANDLE}
              </a>
            </div>
          </div>

          <div className={styles.copyright}>
            © {new Date().getFullYear()} Putra Glass. Seluruh hak cipta dilindungi. Workshop Citatah, Cipatat, Bandung Barat.
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
