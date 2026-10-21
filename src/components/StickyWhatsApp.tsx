'use client';
import { useEffect, useState } from 'react';
import { QuoteLink } from './QuoteLink';
import styles from './StickyWhatsApp.module.css';
export function StickyWhatsApp() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const overlaps = (element: Element | null) => { if (!element) return false; const rect=element.getBoundingClientRect(); return rect.top < window.innerHeight && rect.bottom > 0; };
    const measure = () => {
      const hero = document.getElementById('hero');
      const afterHero = hero ? hero.getBoundingClientRect().bottom < 85 : true;
      setShow(afterHero && !overlaps(document.querySelector('[data-viewer-mode]')) && !overlaps(document.getElementById('konsultasi')) && !overlaps(document.querySelector('footer')));
    };
    const observer = new IntersectionObserver(measure);
    for (const element of document.querySelectorAll('#hero,#konsultasi,footer,[data-viewer-mode]')) observer.observe(element);
    window.addEventListener('scroll',measure,{passive:true}); window.addEventListener('resize',measure); measure();
    return () => { observer.disconnect(); window.removeEventListener('scroll',measure); window.removeEventListener('resize',measure); };
  }, []);
  return <aside className={`${styles.sticky} ${show ? styles.visible : ''}`} aria-label="Konsultasi cepat" aria-hidden={!show} inert={!show}><QuoteLink source="sticky_mobile_wa">Konsultasi & penawaran <span aria-hidden="true">↗</span></QuoteLink></aside>;
}
