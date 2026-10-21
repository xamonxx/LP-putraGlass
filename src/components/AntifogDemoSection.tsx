'use client';
import { useState } from 'react';
import Link from 'next/link';
import { PictureImage } from './PictureImage';
import styles from './AntifogDemoSection.module.css';
export function AntifogDemoSection() {
  const [position, setPosition] = useState(50);
  return <section id="antifog" className={styles.section}><div className={styles.wrap}><div className={styles.layout}>
    <div className={styles.content}><span className="eyebrow">Detail yang terasa setiap hari</span><h2 className={styles.title}>Tetap jernih.<br/>Setelah air hangat.</h2><p className={styles.description}>Antifog merupakan pemanas tipis di balik kaca yang membantu mengurangi embun. Tambahkan kebutuhan ini ke rancangan, lalu konfirmasikan detailnya saat konsultasi.</p><Link className="text-link" href="/showroom">Rancang dengan antifog ↗</Link></div>
    <div className={styles.sliderContainer}><div className={styles.sliderFrame}>
      <div className={styles.imageLayer}><PictureImage name="antifog-dengan" alt="Render katalog ilustrasi cermin dengan antifog" sizes="(min-width:1024px) 50vw, 100vw" className={styles.image}/></div>
      <div className={styles.imageLayerClipped} style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}><PictureImage name="antifog-tanpa" alt="Simulasi embun pada cermin tanpa antifog" sizes="(min-width:1024px) 50vw, 100vw" className={styles.image}/></div>
      <span className={`${styles.badge} ${styles.badgeLeft}`}>Tanpa antifog</span><span className={`${styles.badge} ${styles.badgeRight}`}>Dengan antifog</span>
      <div className={styles.divider} style={{ left: `${position}%` }}/><div className={styles.handle} style={{ left: `${position}%`, transform: 'translateX(-50%)' }} aria-hidden="true">↔</div>
      <input className={styles.input} type="range" min="0" max="100" value={position} onChange={e => setPosition(Number(e.target.value))} aria-label="Geser untuk membandingkan kaca dengan dan tanpa antifog" aria-valuetext={`${position}% area tanpa antifog`}/>
    </div><p className={styles.caption}>Ilustrasi dari render katalog. Geser garis atau gunakan tombol panah pada keyboard.</p></div>
  </div></div></section>;
}