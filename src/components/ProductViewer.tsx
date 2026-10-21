'use client';
import dynamic from 'next/dynamic';
import { Component, useCallback, useEffect, useRef, useState, type ReactNode, type TouchEvent } from 'react';
import { useExperience } from './ExperienceProvider';
import { getProduct, canModel, VISUALIZATION_LABEL } from '../lib/products';
import { PictureImage } from './PictureImage';
import { PowerIcon } from './PowerIcon';
import type { CameraController, CameraAction } from './MirrorScene';
import { trackEvent } from '../lib/tracking';
import styles from './ProductViewer.module.css';

const Scene = dynamic(() => import('./MirrorScene'), { ssr: false, loading: () => <div className={styles.loading} role="status">Menyiapkan showroom 3D…<br/>Foto dan pilihan produk tetap tersedia.</div> });
class ViewerBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  render() { return this.state.error ? this.props.fallback : this.props.children; }
}
export function ProductViewer() {
  const { config, update } = useExperience();
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(true);
  const [quality, setQuality] = useState(1);
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<CameraController | null>(null);
  const pinch = useRef(0);
  const lastEvent = useRef<Record<string, number>>({});
  const product = getProduct(config.productId ?? '');
  const supported = canModel(config.shape);
  const mode = supported ? config.preview : 'photo';
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const observer = new IntersectionObserver(entries => { const next = entries[0]?.isIntersecting ?? false; setVisible(next && !document.hidden); if (!next) setActive(false); });
    observer.observe(element);
    const resize = () => setQuality(window.matchMedia('(max-width:767px), (pointer:coarse)').matches ? 1 : Math.min(1.5, window.devicePixelRatio || 1));
    const visibility = () => { const rect = element.getBoundingClientRect(); setVisible(!document.hidden && rect.bottom > 0 && rect.top < window.innerHeight); };
    resize(); window.addEventListener('resize', resize); document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => { setFailed(true); setActive(false); setReady(false); }, []);
  const engagement = useCallback((name: string) => { const now = Date.now(); if (now - (lastEvent.current[name] ?? 0) > 5000) { lastEvent.current[name] = now; trackEvent(name, { product_id: config.productId, shape: config.shape }); } }, [config.productId, config.shape]);
  const choose = (next: 'photo' | '3d' | 'room') => {
    update({ preview: next }); setActive(false);
    if (next !== 'photo') { if (mode === 'photo' || failed) setReady(false); setFailed(false); trackEvent('product_3d_open', { product_id: config.productId, mode: next }); }
  };
  const action = (value: CameraAction) => { controller.current?.action(value); engagement(value === 'in' || value === 'out' ? 'product_3d_zoom' : 'product_3d_rotate'); };
  const touchDistance = (event: TouchEvent) => Math.hypot(event.touches[0].clientX - event.touches[1].clientX, event.touches[0].clientY - event.touches[1].clientY);
  const error = <div className={styles.error} role="status"><strong>Tampilan 3D belum tersedia.</strong><span>Gunakan foto produk untuk melanjutkan rancangan dan konsultasi.</span><button className="button-plain" onClick={() => choose('photo')}>Kembali ke foto</button></div>;
  return <div ref={host} className={styles.viewer} data-viewer-mode={mode} onKeyDown={e => { if (e.key === 'Escape') setActive(false); }}>
    <div className={styles.tabs} role="group" aria-label="Mode tampilan produk">{([['photo','Foto'],['3d','3D'],['room','Dalam ruang']] as const).map(([value, label]) => <button key={value} aria-pressed={mode === value} disabled={value !== 'photo' && !supported} onClick={() => choose(value)}>{label}</button>)}</div>
    <div className={styles.stage}>
      {mode === 'photo' ? product ? <div className={styles.photo}><PictureImage name={product.image} alt={`Render katalog ${product.name}`} sizes="(min-width:1024px) 50vw, 100vw"/></div> : <div className={styles.placeholder}><div className={styles.silhouette} data-shape={config.shape}/><span>Sketsa bentuk custom · bukan foto produk</span></div> : failed ? error : <ViewerBoundary fallback={error}>
        <div className={styles.canvas} data-active={active} onKeyDown={e => { if (e.key === 'Escape') setActive(false); }} onTouchStart={e => { if (active && e.touches.length === 2) pinch.current = touchDistance(e); }} onTouchMove={e => { if (!active || e.touches.length !== 2) return; const distance = touchDistance(e); if (pinch.current && distance) { e.preventDefault(); controller.current?.zoom(pinch.current / distance); engagement('product_3d_zoom'); } pinch.current = distance; }} onTouchEnd={() => { pinch.current = 0; }}>
          <Scene config={config} room={mode === 'room'} active={active} visible={visible} controller={controller} onFailure={onFailure} onReady={onReady} onInteract={() => engagement('product_3d_rotate')} onPower={() => update({ power: !config.power })} quality={quality}/>
        </div>
        <span className={styles.hint}>{mode === 'room' ? 'Ruang / biru abu' : 'Studio / refleksi'}</span>
        <button type="button" className={styles.powerButton} aria-label={config.power ? 'Matikan LED preview' : 'Nyalakan LED preview'} aria-pressed={config.power} onClick={() => update({ power: !config.power })}><PowerIcon size={25}/><span>LED {config.power ? 'nyala' : 'mati'}</span></button>
        <button className={styles.activation} aria-pressed={active} disabled={!ready} onClick={() => setActive(value => !value)}>{active ? 'Selesai berinteraksi · gulir halaman' : 'Aktifkan putar & pinch zoom'}</button>
      </ViewerBoundary>}
    </div>
    {mode !== 'photo' && !failed && <div className={styles.controls} role="group" aria-label="Kontrol kamera 3D">{([['left','↶','Putar ke kiri'],['right','↷','Putar ke kanan'],['in','+','Perbesar cermin'],['out','−','Perkecil cermin'],['front','Depan','Tampak depan'],['angle','¾','Tampak tiga perempat'],['side','Samping','Tampak samping'],['reset','Reset','Reset kamera']] as const).map(([value, label, name]) => <button key={value} aria-label={name} disabled={!ready} onClick={() => action(value)}>{label}</button>)}</div>}
    {!supported && <p className={styles.modeNotice}>Model ini tersedia dalam foto. Geometri 3D yang mewakili desainnya belum tersedia.</p>}
    <p className={styles.note}>{mode === 'photo' ? 'Gambar katalog Putra Glass. Ukuran dan fitur pesanan dikonfirmasi bersama admin.' : VISUALIZATION_LABEL}{mode !== 'photo' && ' Roda mouse tetap menggulir halaman. Escape mengakhiri interaksi.'}</p>
  </div>;
}
