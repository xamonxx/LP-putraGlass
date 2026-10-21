import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PRODUCTS, getProduct, getProductImage } from '../../../lib/products';
import { HeaderNav } from '../../../components/HeaderNav';
import { FooterSection } from '../../../components/FooterSection';
import { PictureImage } from '../../../components/PictureImage';
import { ProductAction } from '../../../components/ModelSection';
import { ConfiguratorSection } from '../../../components/ConfiguratorSection';
import styles from '../../../components/Showroom.module.css';

export const dynamicParams = false;
export function generateStaticParams() { return PRODUCTS.map(product => ({ slug: product.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const product = getProduct(slug);
  if (!product) return {};
  return { title: product.name, description: product.description, alternates: { canonical: `/produk/${product.slug}` }, openGraph: { title: product.name, description: product.description, url: `/produk/${product.slug}`, images: [{ url: getProductImage(product), alt: product.name }] } };
}
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const product = getProduct(slug);
  if (!product) notFound();
  const structured = { '@context': 'https://schema.org', '@type': 'Product', name: product.name, description: product.description, image: `https://putraglass.id${getProductImage(product)}`, brand: { '@type': 'Brand', name: 'Putra Glass' }, url: `https://putraglass.id/produk/${product.slug}` };
  const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Beranda', item: 'https://putraglass.id' }, { '@type': 'ListItem', position: 2, name: 'Katalog', item: 'https://putraglass.id/katalog' }, { '@type': 'ListItem', position: 3, name: product.name, item: `https://putraglass.id/produk/${product.slug}` }] };
  return <><HeaderNav/><main id="main-content"><div className={`wrap ${styles.detailPage}`}>
    <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Beranda</Link><span>/</span><Link href="/katalog">Katalog</Link><span>/</span><span aria-current="page">{product.name}</span></nav>
    <div className={styles.productDetail}><div className={styles.detailImage}><PictureImage name={product.image} alt={`Render katalog ${product.name} Putra Glass`} priority sizes="(min-width:1024px) 55vw, 100vw"/></div><div className={styles.detailCopy}><span className="eyebrow">Koleksi / {product.category}</span><h1 className={styles.title}>{product.name}</h1><p>{product.description}</p>
      <dl className={styles.spec}><div><dt>Pencahayaan</dt><dd>LED</dd></div><div><dt>Ukuran & fitur</dt><dd>Dikonfirmasi saat konsultasi</dd></div><div><dt>Harga & pengiriman</dt><dd>Penawaran sesuai kebutuhan</dd></div><div><dt>Visualisasi</dt><dd>{product.model.tier === 'D' ? 'Foto/render katalog' : 'Simulasi 3D'}</dd></div></dl>
      <ProductAction product={product} mode={product.model.tier === 'D' ? 'photo' : '3d'}>Rancang model ini ↗</ProductAction>
      <p className={styles.source}>Gambar dari katalog Putra Glass. Ukuran dan fitur pesanan dikonfirmasi saat konsultasi. {product.model.note}</p>
      {product.verifiedSourceUrl && <a className="text-link" href={product.verifiedSourceUrl} target="_blank" rel="noopener noreferrer">Lihat di Tokopedia ↗</a>}
    </div></div>
  </div><ConfiguratorSection productId={product.id}/></main><FooterSection/><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, '\\u003c') }}/><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}/></>;
}
