'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { PRODUCTS, type Product } from '../lib/products';
import { useExperience } from './ExperienceProvider';
import { PictureImage } from './PictureImage';
import { trackEvent } from '../lib/tracking';
import styles from './Showroom.module.css';
export function ProductAction({ product, mode = 'photo', children }: { product: Product; mode?: 'photo' | '3d'; children?: React.ReactNode }) {
  const { selectProduct, update } = useExperience();
  return <Link className={styles.textButton} href="/showroom" onClick={() => { selectProduct(product.id); update({ preview: mode }); trackEvent('product_select', { product_id: product.id, mode }); }}>{children ?? 'Minta penawaran ↗'}</Link>;
}
export function ModelSection({ full = false }: { full?: boolean }) {
  const Title = full ? 'h1' : 'h2';
  const [filter, setFilter] = useState('Semua');
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { trackEvent('product_catalog_view', { location: full ? 'catalog' : 'homepage' }); observer.disconnect(); } }, { threshold: .15 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [full]);
  return <section ref={ref} id="model" className={styles.section}><div className="wrap">
    <div className={styles.sectionHead}><div><span className="eyebrow">01 / Koleksi pilihan</span><Title className={styles.title}>Bentuk yang Anda suka.<br/>Ruang yang Anda bayangkan.</Title></div><p>Dari lengkung yang lembut hingga garis geometris. Kenali koleksinya, lalu bicarakan ukuran dan detail pilihan Anda.</p></div>
    {full && <div className={styles.filters} role="group" aria-label="Filter koleksi">{['Semua', 'Lengkung', 'Geometris', 'Organik'].map(category => <button key={category} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}</button>)}</div>}
    <div className={styles.collection}>{PRODUCTS.filter(product => filter === 'Semua' || product.category === filter).map((product, index) => <article className={styles.product} key={product.id} data-product={product.id}>
      <Link href={`/produk/${product.slug}`} className={styles.productImage} aria-label={`Lihat detail ${product.name}`}><PictureImage name={product.image} alt={`Render katalog ${product.name} Putra Glass`} sizes="(max-width:380px) 100vw, (max-width:1023px) 50vw, 25vw"/><span className={styles.productIndex}>0{index + 1} / {product.category}</span></Link>
      <h3 className={styles.productTitle}><Link href={`/produk/${product.slug}`}>{product.name.replace('Cermin LED ', '')}</Link><span aria-hidden="true">↗</span></h3>
      <p className={styles.productMeta}>Cermin LED · ukuran melalui konsultasi</p>
      <div className={styles.productActions}>{product.model.tier !== 'D' && <ProductAction product={product} mode="3d">Lihat 3D ↗</ProductAction>}<ProductAction product={product}/></div>
    </article>)}</div>
    <div className={styles.collectionNote}><span>Ingin bentuk lain? Mulai dari rancangan Anda sendiri.</span>{!full ? <Link href="/katalog" className="text-link">Seluruh koleksi →</Link> : <Link href="/showroom" className="text-link">Rancang ukuran custom →</Link>}</div>
  </div></section>;
}
