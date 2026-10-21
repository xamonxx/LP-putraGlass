'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import { SITE_PAGES } from '../lib/site-pages';
import styles from './Showroom.module.css';
const LINKS = [{ label: 'Home', href: '/' }, ...[SITE_PAGES.catalog, SITE_PAGES.showroom, SITE_PAGES.about, SITE_PAGES.order, SITE_PAGES.faq].map(page => ({ label: page.label, href: page.path }))];
// Mark traced from the official logo (aset-img-for-website/LOGO PUTRA GLASS): three overlapping diamonds.
export function Brand() { return <><svg viewBox="0 0 65 38" fill="none" aria-hidden="true"><path d="M0 19 19 0l19 19-19 19Z" fill="#a6a6a6"/><path d="M13.5 19 32.5 0l19 19-19 19Z" fill="#273153"/><path d="M26.8 19 45.8 0l19 19-19 19Z" fill="#c0cbda"/></svg><span>PUTRA GLASS</span></>; }
export function HeaderNav({ overlay = false }: { overlay?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    document.body.dataset.mobileMenuOpen = String(open);
    return () => { delete document.body.dataset.mobileMenuOpen; };
  }, [open]);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 761px)');
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);
  useEffect(() => {
    const measure = () => document.documentElement.style.setProperty('--header-height', `${ref.current?.offsetHeight ?? 85}px`);
    const observer = new ResizeObserver(measure);
    if (ref.current) observer.observe(ref.current);
    measure();
    const scroll = () => setScrolled(window.scrollY > 20);
    scroll(); window.addEventListener('scroll', scroll, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener('scroll', scroll); };
  }, []);
  return <header ref={ref} className={`${styles.header} ${overlay ? styles.headerHome : ''}`} data-overlay={overlay} data-scrolled={scrolled}>
    <div className={`wrap ${styles.nav}`}>
      <Link href="/" className={styles.brand} aria-label="Putra Glass Beranda"><Brand /></Link>
      <nav className={styles.links} aria-label="Menu utama">{LINKS.map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}</nav>
      <Link className={styles.navCta} href="/konsultasi">Konsultasi <span aria-hidden="true">↗</span></Link>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild><button className={styles.menuButton} aria-label="Buka menu navigasi">Menu ☰</button></Dialog.Trigger>
        <Dialog.Portal><Dialog.Overlay className={styles.overlay}/><Dialog.Content className={styles.drawer} aria-describedby={undefined}>
          <Dialog.Close asChild><button className="button-plain" aria-label="Tutup menu navigasi">Tutup ×</button></Dialog.Close>
          <Dialog.Title>Jelajahi Putra Glass</Dialog.Title>
          <nav aria-label="Navigasi mobile" className="mobile-links">{LINKS.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}</nav>
          <Link href="/konsultasi" onClick={() => setOpen(false)}>Konsultasi & penawaran ↗</Link>
        </Dialog.Content></Dialog.Portal>
      </Dialog.Root>
    </div>
  </header>;
}
