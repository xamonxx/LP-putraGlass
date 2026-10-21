'use client';
import { useEffect, useRef } from 'react';
import { useExperience } from './ExperienceProvider';
import { ProductViewer } from './ProductViewer';
import { PowerIcon } from './PowerIcon';
import { CatalogSelect } from './CatalogSelect';
import { getProduct, SHAPE_NAMES, type Shape } from '../lib/products';
import { buildWhatsAppLink, getStoredLeadSource, trackConfiguratorStart, trackConfiguratorSend, trackLeadClick, trackViewContent, trackEvent } from '../lib/tracking';
import styles from './ConfiguratorSection.module.css';
const SHAPES: Shape[] = ['rectangle', 'capsul', 'oval', 'round'];
const COLORS = [{ id: 'hangat', label: 'Hangat', glow: '#FFC98A' }, { id: 'natural', label: 'Natural', glow: '#FFE9C7' }, { id: 'putih', label: 'Putih', glow: '#D6E6FF' }] as const;
export function ConfiguratorSection({ productId, asPage = false }: { productId?: string; asPage?: boolean }) {
  const Title = asPage ? 'h1' : 'h2';
  const { config: c, update, selectProduct } = useExperience();
  const started = useRef(false);
  const section = useRef<HTMLElement>(null);
  useEffect(() => { if (productId) selectProduct(productId); /* The route selects once; later visitor choices remain editable. */ }, [productId]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) { trackViewContent('konfigurator'); observer.disconnect(); } }, { threshold: .15 });
    if (section.current) observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  const start = () => { if (!started.current) { started.current = true; trackConfiguratorStart(); } };
  const width = Number(c.width), height = c.shape === 'round' ? width : Number(c.height);
  const valid = [width, height].every(n => Number.isFinite(n) && Number.isInteger(n) && n >= 30 && n <= 200);
  const dimensions = c.shape === 'round' ? `Ø ${c.width || '—'} cm` : `${c.width || '—'} × ${c.height || '—'} cm`;
  const product = getProduct(c.productId ?? '');
  const identity = product?.name ?? `Cermin custom ${SHAPE_NAMES[c.shape]}`;
  const lamp = c.led === '3_warna' ? 'LED 3 warna' : `LED 1 warna ${c.color}`;
  const control = c.control === 'touchscreen' ? 'Touchscreen' : 'Sensor tangan + baterai';
  const message = ['Halo Putra Glass, saya mau minta penawaran cermin LED custom:', `- Produk: ${identity}`, `- Bentuk: ${SHAPE_NAMES[c.shape]}`, `- Ukuran: ${dimensions}`, `- Lampu: ${lamp}`, `- Kontrol: ${control}`, `- Antifog: ${c.antifog ? 'Ya' : 'Tidak'}`, `- Kota: ${c.city.trim() || '-'}`, 'Mohon konfirmasi detail dan harga akhirnya.'].join('\n');
  return <section ref={section} id="rancang" className={styles.section}><div className="wrap">
    <div className={styles.headerRow}><div><span className="eyebrow">02 / Showroom interaktif</span><Title className={styles.title}>Satu cermin.<br/>Banyak kemungkinan.</Title></div><p className={styles.leadText}>Mulai dari model pilihan Anda. Sesuaikan ukuran dan kebutuhannya, lalu kirim rancangan untuk mendapatkan penawaran.</p></div>
    <div className={styles.container}>
      <div className={styles.previewCol}><ProductViewer/><p className={styles.previewHint}>Ukuran rancangan: {dimensions}. Ini bukan ukuran stok. Visualisasi tidak menggantikan konfirmasi spesifikasi.</p></div>
      <div className={styles.controlsCol} onChangeCapture={start} onClickCapture={start}>
        <div className={styles.controlCard}><div className={styles.cardHeader}><span>01</span><h3>Model & bentuk</h3></div>
          <CatalogSelect value={c.productId} onChange={selectProduct}/>
          <p className={styles.hint}>Atau pilih bentuk custom:</p>
          <div className={styles.shapeGrid}>{SHAPES.map(shape => <button key={shape} type="button" className={styles.choice} aria-label={`Pilih bentuk ${SHAPE_NAMES[shape]}`} aria-pressed={c.shape === shape} onClick={() => update({ shape, productId: getProduct(shape)?.id ?? null })}><span className={styles.shapeIcon} data-shape={shape} aria-hidden="true"/>{SHAPE_NAMES[shape]}</button>)}</div>
        </div>
        <div className={styles.controlCard}><div className={styles.cardHeader}><span>02</span><h3>Ukuran Anda</h3></div><div className={styles.dimensionRow}>
          <label className={styles.label}>{c.shape === 'round' ? 'Diameter' : 'Lebar'}<div className={styles.inputUnit}><input type="number" inputMode="numeric" min="30" max="200" step="1" value={c.width} onChange={e => update({ width: e.target.value })} aria-label={c.shape === 'round' ? 'Diameter cm' : 'Lebar cm'} aria-invalid={!valid} aria-describedby={!valid ? 'dimension-error' : undefined}/><span>cm</span></div></label>
          {c.shape !== 'round' && <label className={styles.label}>Tinggi<div className={styles.inputUnit}><input type="number" inputMode="numeric" min="30" max="200" step="1" value={c.height} onChange={e => update({ height: e.target.value })} aria-label="Tinggi cm" aria-invalid={!valid} aria-describedby={!valid ? 'dimension-error' : undefined}/><span>cm</span></div></label>}
        </div>{!valid && <p id="dimension-error" className={styles.error} role="alert">Isi ukuran bulat antara 30–200 cm. Untuk kebutuhan lain, konsultasikan dengan admin.</p>}
          <div className={styles.presets}>{(c.shape === 'round' ? [[50,50],[60,60],[80,80]] : [[50,70],[60,80],[60,160]]).map(([w,h]) => <button key={`${w}x${h}`} type="button" onClick={() => update({ width: String(w), height: String(h) })}>{c.shape === 'round' ? `Ø ${w}` : `${w}×${h}`}</button>)}</div>
        </div>
        <div className={styles.controlCard}><div className={styles.cardHeader}><span>03</span><h3>Lampu & kebutuhan</h3></div>
          <div className={styles.pair} role="group" aria-label="Pilihan LED">{([['3_warna', 'LED 3 warna'], ['1_warna', 'LED 1 warna']] as const).map(([value,label]) => <button key={value} type="button" className={styles.choice} aria-label={`Pilih ${label}`} aria-pressed={c.led === value} onClick={() => update({ led: value })}>{label}</button>)}</div>
          <div className={styles.colorRow} role="group" aria-label="Warna cahaya">{COLORS.map(color => <button key={color.id} type="button" className={styles.color} aria-pressed={c.color === color.id} onClick={() => { update({ color: color.id }); trackEvent('lighting_option_change', { color: color.id }); }}><span style={{ background: color.glow }} aria-hidden="true"/>{color.label}</button>)}</div>
          <button type="button" className={styles.power} aria-label={c.power ? 'Matikan lampu cermin' : 'Nyalakan lampu cermin'} aria-pressed={c.power} onClick={() => update({ power: !c.power })}><PowerIcon/> Lampu {c.power ? 'nyala' : 'mati'}</button>
          <div className={styles.pair} role="group" aria-label="Pilihan kontrol">{([['touchscreen','Touchscreen'], ['sensor_baterai','Sensor tangan']] as const).map(([value,label]) => <button key={value} type="button" className={styles.choice} aria-label={`Pilih kontrol ${label.toLowerCase()}`} aria-pressed={c.control === value} onClick={() => update({ control: value })}>{label}</button>)}</div>
          <button type="button" className={styles.antifog} aria-pressed={c.antifog} aria-label="Tambah antifog" onClick={() => update({ antifog: !c.antifog })}><span aria-hidden="true">{c.antifog ? '☑' : '□'}</span> Tambahkan antifog</button>
          <p className={styles.hint}>Pilihan kebutuhan custom; ketersediaan kombinasi fitur dikonfirmasi saat konsultasi.</p>
        </div>
        <div className={styles.controlCard}><div className={styles.cardHeader}><span>04</span><h3>Kota tujuan</h3></div><label className={styles.label}>Ke mana cermin dikirim?<input className={styles.input} type="text" value={c.city} maxLength={80} placeholder="contoh: Surabaya / ambil di workshop" autoComplete="address-level2" data-clarity-mask="true" onChange={e => update({ city: e.target.value })}/></label></div>
        <div className={styles.summaryCard}><span className="eyebrow">Rancangan Anda</span><h3 className={styles.summaryTitle} aria-live="polite">{SHAPE_NAMES[c.shape]} {dimensions}</h3><p className={styles.summarySpecs}>{identity} · {lamp.toLowerCase()} · {control.toLowerCase()}{c.antifog ? ' · antifog' : ''}</p>
          <a className="button-primary" href={buildWhatsAppLink(message, 'LP-LANGSUNG')} aria-disabled={!valid} tabIndex={valid ? 0 : -1} target="_blank" rel="noopener noreferrer" onClick={e => { if (!valid) { e.preventDefault(); return; } e.currentTarget.href = buildWhatsAppLink(message, getStoredLeadSource()); trackLeadClick('configurator_wa_btn'); trackConfiguratorSend(); trackEvent('configurator_complete', { product_id: c.productId, shape: c.shape }); trackEvent('quote_request_click', { source: 'configurator' }); }}>Kirim rancangan, minta harga ↗</a>
          <p className={styles.hint}>Harga akhir dan ongkir dikonfirmasi admin. Belum ada kewajiban membeli.</p>
        </div>
      </div>
    </div>
  </div></section>;
}
