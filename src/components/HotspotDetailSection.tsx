'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PictureImage } from './PictureImage';
import { DetailIllustration } from './DetailIllustrations';
import styles from './HotspotDetailSection.module.css';

type DetailMode = 0 | 1 | 2 | 3 | 4 | 5;

const DETAILS = [
  { x: 22.5, y: 55, label: 'Kaca', title: 'Lihat bidang pantulnya.', text: 'Bidang cermin menjadi pusat produk. Spesifikasi kaca dan ketebalan untuk pesanan Anda dikonfirmasi bersama admin.', sceneLabel: 'Refleksi & lapisan', sceneHint: 'Pantulan bergerak memperlihatkan karakter bidang kaca.' },
  { x: 86, y: 29, label: 'Tepi', title: 'Perhatikan setiap tepinya.', text: 'Tepi cermin dipoles di workshop. Pilihan finishing dibicarakan sesuai bentuk dan kebutuhan Anda.', sceneLabel: 'Profil tepi', sceneHint: 'Geser model untuk melihat susunan sisi dari sudut dekat.' },
  { x: 53.75, y: 81, label: 'LED', title: 'Cahaya mengikuti bentuk.', text: 'Pilih kebutuhan LED satu warna atau tiga warna pada konfigurator. Simulasi warna membantu Anda membayangkan suasananya.', sceneLabel: 'Spektrum LED', sceneHint: 'Cahaya berganti dari hangat, natural, hingga putih.' },
  { x: 41.25, y: 69, label: 'Kontrol', title: 'Pilih cara menyalakannya.', text: 'Touchscreen atau sensor tangan dengan baterai tersedia sebagai kebutuhan custom. Kombinasi fitur perlu dikonfirmasi sesuai pesanan.', sceneLabel: 'Kontrol sentuh', sceneHint: 'Indikator merespons saat tangan menyentuh permukaan.' },
  { x: 75, y: 45, label: 'Antifog', title: 'Pertimbangkan kebutuhan antifog.', text: 'Pemanas tipis di belakang kaca membantu mengurangi embun. Lihat ilustrasi perbandingannya di bagian berikutnya.', sceneLabel: 'Area antifog', sceneHint: 'Embun menghilang bertahap dari area aktif.' },
  { x: 10, y: 40, label: 'Pemasangan', title: 'Siapkan tempatnya.', text: 'Kirim ukuran dan foto dinding Anda. Admin membantu mengonfirmasi detail gantungan dan kebutuhan pemasangan sebelum pemesanan.', sceneLabel: 'Exploded assembly', sceneHint: 'Kaca, LED, rangka, dan gantungan terurai berurutan.' },
] as const;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
}

export function HotspotDetailSection() {
  const [active, setActive] = useState<DetailMode>(0);
  const [isNear, setIsNear] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const current = DETAILS[active];
  const previous = ((active + DETAILS.length - 1) % DETAILS.length) as DetailMode;
  const next = ((active + 1) % DETAILS.length) as DetailMode;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const revealObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsNear(true);
        revealObserver.disconnect();
      }
    }, { rootMargin: '280px 0px' });
    revealObserver.observe(section);
    return () => revealObserver.disconnect();
  }, []);
  const selectDetail = useCallback((index: number) => {
    setActive(Math.min(Math.max(index, 0), DETAILS.length - 1) as DetailMode);
  }, []);

  return <section ref={sectionRef} id="detail" className={styles.section} data-revealed={isNear} data-reduced-motion={prefersReducedMotion}>
    <div className="wrap">
      <div className={styles.sectionHeader}>
        <div>
          <span className="eyebrow">03 / Lebih dekat dengan detail</span>
          <h2 className="h2">Jelajahi setiap detail.</h2>
        </div>
        <div className={styles.headerNote}>
          <span className={styles.headerIndex}>01—06</span>
          <p>Pilih titik pada gambar untuk mengenal bagian cermin. Visual bersifat ilustratif.</p>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.visualColumn}>
          <div className={styles.photoShell}>
            <div className={styles.baseWrapper}>
              <PictureImage name="detail-base" alt="Render katalog cermin LED untuk ilustrasi bagian produk" sizes="(max-width:1020px) 100vw, 60vw" className={styles.baseImage}/>
              {DETAILS.map((detail, index) => <button
                key={detail.label}
                type="button"
                aria-pressed={active === index}
                aria-controls="mirror-detail-panel"
                aria-label={`Detail ${index + 1}: ${detail.label}`}
                className={styles.hotspotBtn}
                style={{ left: `${detail.x}%`, top: `${detail.y}%` }}
                onClick={() => selectDetail(index)}
              >
                <span className={`${styles.hotspotCircle} ${active === index ? styles.active : ''}`}>
                  {index + 1}
                  {active === index && <><span className={styles.hotspotPulse} aria-hidden="true"/><span className={styles.hotspotConnector} aria-hidden="true"/></>}
                </span>
              </button>)}
            </div>
          </div>

          <div className={styles.tabsBar} role="group" aria-label="Bagian cermin">
            {DETAILS.map((detail, index) => <button
              key={detail.label}
              type="button"
              className={`${styles.tabBtn} ${active === index ? styles.active : ''}`}
              aria-pressed={active === index}
              aria-controls="mirror-detail-panel"
              aria-label={`Bagian ${index + 1}: ${detail.label}`}
              onClick={() => selectDetail(index)}
            >
              <span className={styles.tabNum}>0{index + 1}</span><span>{detail.label}</span>
            </button>)}
          </div>
        </div>

        <article className={styles.panelShell} id="mirror-detail-panel" aria-live="polite">
          <div className={styles.card}>
            <div className={styles.panelMeta}>
              <span className={styles.counter}>Detail 0{active + 1} / 0{DETAILS.length}</span>
              <span className={styles.panelPart}><span aria-hidden="true"/> {current.label}</span>
            </div>

            <div className={styles.stageShell}>
              <div className={styles.mediaWrap} role="group" aria-label={`Ilustrasi detail ${current.label}`}>
                <DetailIllustration key={active} index={active} className={styles.detailIllustration}/>
                <div className={styles.stageTopline}>
                  <span className={styles.animationLabel}>Ilustrasi 2.5D</span>
                </div>
              </div>
            </div>

            <div className={styles.content} key={`content-${active}`}>
              <h3 className={styles.title}>{current.title}</h3>
              <p className={styles.description}>{current.text}</p>
            </div>

            <div className={styles.navControls}>
              <button type="button" className={styles.navBtn} onClick={() => selectDetail(previous)} aria-label={`Detail sebelumnya: ${DETAILS[previous].label}`}>
                <span className={styles.navIcon} aria-hidden="true">←</span><span><small>Sebelumnya</small>{DETAILS[previous].label}</span>
              </button>
              <button type="button" className={styles.navBtn} onClick={() => selectDetail(next)} aria-label={`Detail berikutnya: ${DETAILS[next].label}`}>
                <span><small>Berikutnya</small>{DETAILS[next].label}</span><span className={styles.navIcon} aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </article>
      </div>

      <noscript><div className={styles.noScript}>{DETAILS.map(detail => <article key={detail.label}><h3>{detail.title}</h3><p>{detail.text}</p></article>)}</div></noscript>
    </div>
  </section>;
}
