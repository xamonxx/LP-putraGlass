'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './Consent.module.css';
export function ConsentSettings() { return <button className={styles.settings} onClick={() => window.dispatchEvent(new Event('pg:consent-settings'))}>Pengaturan cookie</button>; }
export function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try { setShow(!localStorage.getItem('pg_cookie_consent')); } catch { setShow(true); }
    const open = () => setShow(true);
    window.addEventListener('pg:consent-settings', open);
    return () => window.removeEventListener('pg:consent-settings', open);
  }, []);
  const save = (value: 'granted' | 'denied') => {
    try { localStorage.setItem('pg_cookie_consent', value); } catch { /* Trackers stay off without storage. */ }
    window.dispatchEvent(new CustomEvent('pg:consent', { detail: value }));
    setShow(false);
  };
  if (!show) return null;
  return <aside className={styles.banner} aria-label="Pemberitahuan cookie"><div><strong>Pilihan privasi Anda.</strong><p>Izinkan cookie analitik untuk membantu kami memahami kunjungan. Data konsultasi hanya dikirim saat Anda mengisi form atau membuka WhatsApp. <Link href="/privasi">Baca kebijakan privasi.</Link></p></div><div className={styles.actions}><button onClick={() => save('denied')}>Tolak</button><button onClick={() => save('granted')}>Izinkan</button></div></aside>;
}