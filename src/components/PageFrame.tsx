import type { ReactNode } from 'react';
import Link from 'next/link';
import { HeaderNav } from './HeaderNav';
import { FooterSection } from './FooterSection';
import type { SitePage } from '../lib/site-pages';
import styles from './Showroom.module.css';

export function PageFrame({ page, children }: { page: SitePage; children: ReactNode }) {
  const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Beranda', item: 'https://putraglass.id' },
    { '@type': 'ListItem', position: 2, name: page.label, item: `https://putraglass.id${page.path}` },
  ] };
  return <><HeaderNav/><main id="main-content"><div className={`wrap ${styles.pageBreadcrumb}`}><nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Beranda</Link><span aria-hidden="true">/</span><span aria-current="page">{page.label}</span></nav></div>{children}</main><FooterSection/><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}/></>;
}
