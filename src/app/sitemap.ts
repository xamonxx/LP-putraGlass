import { MetadataRoute } from 'next';
import { PRODUCTS } from '../lib/products';
import { SITE_PAGES } from '../lib/site-pages';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...[...Object.values(SITE_PAGES).map(page => page.path), '/privasi', ...PRODUCTS.map(p => `/produk/${p.slug}`)].map(path => ({ url: `https://putraglass.id${path}`, changeFrequency: 'monthly' as const, priority: .7 })),
    {
      url: 'https://putraglass.id',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
