'use client';

/**
 * Tawaran terakhir sebelum pengunjung pergi: konsultasi ukuran gratis lewat
 * WhatsApp. Muncul maksimal sekali per sesi, dan tidak pernah muncul kalau
 * pengunjung sudah mengirim lead atau sudah membuka WhatsApp — orang yang
 * sudah chat tidak perlu diganggu lagi.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

import styles from './ExitIntentDialog.module.css';
import { buildWhatsAppLink, trackEvent } from '../lib/tracking';
import { hasSessionFlag, LEAD_SUBMITTED_KEY, markSessionFlag, WA_CLICKED_KEY } from '../lib/lead';

/** Penanda bahwa dialog sudah pernah tampil di sesi ini. */
const EXIT_SHOWN_KEY = 'pg_exit_intent_shown';

/** Jeda sebelum pemicu aktif, supaya tidak menyergap pengunjung yang baru datang. */
const ARM_DELAY_MS = 6_000;
/** Ambang kecepatan scroll ke atas di HP (px per ms). */
const SCROLL_UP_SPEED = 0.9;
/** Kedalaman minimal sebelum pemicu HP dihitung. */
const MIN_DEPTH = 0.5;

const PESAN_WA =
  'Halo Putra Glass, saya mau konsultasi ukuran cermin dulu sebelum pesan. Ruangannya belum saya ukur, mohon dibantu ya.';

export function ExitIntentDialog() {
  const [open, setOpen] = useState(false);
  const [waLink, setWaLink] = useState('');
  const shownRef = useRef(false);
  const acceptedRef = useRef(false);

  // Klik WhatsApp di mana pun (header, sticky, galeri) mematikan exit intent.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href*="wa.me"], a[href*="whatsapp.com"]');
      if (anchor) markSessionFlag(WA_CLICKED_KEY);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  useEffect(() => {
    if (hasSessionFlag(EXIT_SHOWN_KEY) || hasSessionFlag(LEAD_SUBMITTED_KEY) || hasSessionFlag(WA_CLICKED_KEY)) {
      return;
    }

    let armed = false;
    let kedalamanMaks = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();

    const armTimer = window.setTimeout(() => {
      armed = true;
    }, ARM_DELAY_MS);

    const lepas = () => {
      window.clearTimeout(armTimer);
      document.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('scroll', onScroll);
    };

    const tampilkan = (pemicu: string) => {
      if (!armed || shownRef.current) return;
      if (hasSessionFlag(LEAD_SUBMITTED_KEY) || hasSessionFlag(WA_CLICKED_KEY)) {
        lepas();
        return;
      }
      shownRef.current = true;
      markSessionFlag(EXIT_SHOWN_KEY);
      setWaLink(buildWhatsAppLink(PESAN_WA));
      trackEvent('exit_intent_show', { trigger: pemicu });
      setOpen(true);
      lepas();
    };

    // Desktop: kursor keluar lewat sisi atas viewport (menuju tab/address bar).
    function onMouseOut(e: MouseEvent) {
      if (e.relatedTarget) return;
      if (e.clientY > 8) return;
      tampilkan('desktop_mouseleave');
    }

    // HP: scroll ke atas dengan cepat setelah lewat separuh halaman.
    function onScroll() {
      const y = window.scrollY;
      const t = performance.now();
      const dy = y - lastY;
      const dt = Math.max(t - lastT, 1);
      lastY = y;
      lastT = t;

      const tinggi = document.documentElement.scrollHeight - window.innerHeight;
      if (tinggi > 0) kedalamanMaks = Math.max(kedalamanMaks, y / tinggi);

      if (dy < 0 && -dy / dt >= SCROLL_UP_SPEED && kedalamanMaks > MIN_DEPTH) {
        tampilkan('mobile_scroll_up');
      }
    }

    const halus = window.matchMedia('(pointer: fine)').matches;
    const kasar = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 900;

    if (halus) document.addEventListener('mouseout', onMouseOut);
    if (kasar) window.addEventListener('scroll', onScroll, { passive: true });

    return lepas;
  }, []);

  const onOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next && !acceptedRef.current) {
      trackEvent('exit_intent_dismiss');
    }
  }, []);

  const terima = useCallback(() => {
    acceptedRef.current = true;
    markSessionFlag(WA_CLICKED_KEY);
    trackEvent('exit_intent_accept', { button_source: 'exit_intent' }, { meta: 'Lead', tiktok: 'Contact' });
    setOpen(false);
  }, []);

  const tolak = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content} aria-describedby="exit-intent-desc">
          <Dialog.Close asChild>
            <button type="button" className={styles.close} aria-label="Tutup penawaran">
              ✕
            </button>
          </Dialog.Close>

          <span className={styles.badge}>Gratis, tanpa biaya</span>
          <Dialog.Title className={styles.title}>bingung ukurannya berapa?</Dialog.Title>
          <Dialog.Description id="exit-intent-desc" className={styles.desc}>
            Kirim foto dinding atau ukuran kasarnya ke WhatsApp. Admin workshop bantu tentukan ukuran yang pas
            sebelum kamu memutuskan pesan.
          </Dialog.Description>

          <ul className={styles.list}>
            <li>Saran ukuran untuk kamar mandi, kamar tidur, atau toko</li>
            <li>Estimasi harga langsung di chat, tanpa DP dulu</li>
            <li>Dijawab orang workshop, bukan bot</li>
          </ul>

          <div className={styles.actions}>
            <a
              className={styles.accept}
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={terima}
              aria-label="Konsultasi ukuran gratis lewat WhatsApp"
            >
              Konsultasi ukuran gratis
            </a>
            <button type="button" className={styles.dismiss} onClick={tolak}>
              Nanti saja
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
