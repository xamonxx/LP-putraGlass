# Putra Glass â€” Interactive Mirror Showroom

Next.js 15 / React 19 / TypeScript strict. Warm architectural design, two desktop scroll stories, local catalog, lazy Three.js viewer and quotation through WhatsApp. Output remains static HTML in out/.

## Run and verify

```sh
npm ci
npm run dev
npm run catalog:validate
npm run build
npm start
npm test
```

Development: http://localhost:3000 . Export preview: http://127.0.0.1:3333 . Build before running browser tests; they test the exported artifact. Playwright can start the preview server automatically. Install Chromium with `npx playwright install chromium` if absent. Tests use desktop, Pixel 7 and 320px projects, an eight-width resilience matrix, touch gestures, reduced motion, no-JavaScript/WebGL, failure fallbacks, axe accessibility scans and domain validation. No live customer message is sent by tests.

`npm run measure -- after` measures three cold-cache mobile Chromium runs against a running preview server. See docs/performance-before.json and docs/performance-after.json for the exact laboratory settings. This is not field Core Web Vitals or a physical-device FPS measurement.

## Product data

Central catalog: src/data/products.json. Image metadata: src/data/images-meta.json. Import validation runs before every production build.

```sh
npm run catalog:import -- owner-catalog.json
npm run catalog:import -- owner-catalog.json --write
```

First command is a dry run. The second imports a complete validated catalog and optimizes owner-supplied assetPath images locally. See docs/PRODUCT_ASSET_MANIFEST.md for format, provenance, deduplication and limitations. No remote scrape or image hotlink is used. Current catalog: Capsul / Rectangle / Leaf / Half Moon. Only the first two have approximate product geometry; Oval/Round are existing custom shapes. Leaf/Half Moon stay in photo mode. No price, availability, dimensions, reviews or marketplace URL is fabricated.

## Pages and experience

- `/`: hero, light story, collection, configurator, details, antifog, workshop story, ordering, lead form, FAQ.
- `/katalog`: category browsing.
- `/showroom`: configurator, viewer, details and antifog.
- `/tentang`: workshop story.
- `/cara-pesan`: ordering process.
- `/konsultasi`: quotation form.
- `/faq`: frequently asked questions.
- `/showroom`: configurator, viewer, details and antifog.
- `/tentang`: workshop story.
- `/cara-pesan`: ordering process.
- `/konsultasi`: quotation form.
- `/faq`: frequently asked questions.
- `/produk/capsul`, `/produk/rectangle`, `/produk/leaf`, `/produk/half-moon`: static product pages.
- `/privasi`: data use and cookie settings.

Pinned stories require >=1024px width, >=700px height and no reduced-motion setting. Otherwise the same content stacks normally. Viewer uses motion/react, three, Fiber 9 and Drei. Only an explicitly opened viewer downloads its 3D engine. Reflection environment is generated locally. Activate drag/touch interaction deliberately; wheel scrolling remains native. Buttons provide rotation, zoom, presets and reset; Escape releases interaction. Simulations are labeled and do not establish manufacturing accuracy.

## Configuration and tracking

Copy .env.example to .env.local only when configuration is needed. Never commit environment values.

- NEXT_PUBLIC_META_PIXEL_ID
- NEXT_PUBLIC_TIKTOK_PIXEL_ID
- NEXT_PUBLIC_GA_ID
- NEXT_PUBLIC_CLARITY_ID
- NEXT_PUBLIC_LEAD_ENDPOINT

Absent IDs disable the vendor integration. Trackers wait for affirmative cookie permission; footer preferences can revoke it. Configure Clarity Consent Mode in the owner account when using that service. Form fields and destination input are masked for session recording; event payloads omit contact data. UTM source codes still accompany WhatsApp links without optional analytics.

The optional lead Worker remains in workers/lead/. Its payload contract is preserved. Without an endpoint or on network failure, the form still supplies the WhatsApp handoff. Existing illustration price data remains internal, not a public price calculator. No sale is inferred from a click.

## Deployment

Run `npm ci` and `npm run build`, then deploy the complete contents of out/ to the existing static host. There is no production Next.js server or new checkout/payment service. Keep `_next/static` filenames intact. Nginx example:

```nginx
root /var/www/putraglass.id/html;
index index.html;
location / { try_files $uri $uri.html $uri/ =404; }
error_page 404 /404.html;
location /_next/static/ { expires 1y; add_header Cache-Control "public, immutable"; }
```

Set HTML/TXT/XML caching to revalidate and enable compression on the real host. Deploy the exported `.txt` navigation files as `text/plain`, and sitemap XML as `application/xml`; keep ordinary page paths resolving to their HTML. Never rewrite navigation TXT requests to index.html. Preview serve.js supports extensionless pages, proper 404 status and GLB/GLTF MIME types. The shipped V3 viewer uses parametric geometry; a verified GLB loader is not yet implemented.

## Reports

See docs/IMPLEMENTATION_V3.md, docs/QA_REPORT.md, docs/REDESIGN_AUDIT.md, docs/DESIGN_SYSTEM.md, docs/PRODUCT_ASSET_MANIFEST.md, docs/3D_ARCHITECTURE.md and docs/CRO_TRACKING.md. URL migration and Search Console handoff: docs/SEO_URLS.md. Responsive hero artwork and navbar behavior: docs/HERO_REDESIGN.md. URL migration and Search Console handoff: docs/SEO_URLS.md. Responsive hero artwork and navbar behavior: docs/HERO_REDESIGN.md. Screenshots are in docs/screenshots/. Existing uncommitted work was preserved and no production publication was performed.