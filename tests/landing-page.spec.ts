import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const runtimeErrors = new WeakMap<import('@playwright/test').Page, string[]>();
test.beforeEach(async ({ page, context }) => {
  const errors: string[] = []; runtimeErrors.set(page, errors); page.on('pageerror', error => errors.push(error.message));
  await context.route(/^https:\/\/(?!127\.0\.0\.1|localhost)/, route => route.abort());
  await page.addInitScript(() => localStorage.setItem('pg_cookie_consent', 'granted'));
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true');
});
test.afterEach(async ({ page }) => { expect(runtimeErrors.get(page) ?? []).toEqual([]); });
test('homepage metadata, authentic catalog and no public prices', async ({ page }) => {
  await expect(page).toHaveTitle(/Putra Glass/); await expect(page.locator('h1')).toContainText('Cahaya yang');
  await expect(page.locator('#model article')).toHaveCount(6); await expect(page.locator('canvas')).toHaveCount(0); await expect(page.locator('#testimoni')).toHaveCount(0);
  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(schemas.map(text => JSON.parse(text)['@type'])).toEqual(expect.arrayContaining(['LocalBusiness','FAQPage']));
  expect(schemas.join('')).not.toMatch(/lowPrice|AggregateOffer|InStock|aggregateRating/);
  expect(await page.locator('main').textContent()).not.toMatch(/Rp[\d.]+|pembeli terverifikasi/i);
});
test('navigation and mobile drawer focus', async ({ page }) => {
  const button = page.getByRole('button', { name: 'Buka menu navigasi' });
  if ((page.viewportSize()?.width ?? 1440) <= 760) {
    await button.click(); await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).toHaveCount(0); await expect(button).toBeFocused();
  } else await expect(page.getByRole('navigation', { name: 'Menu utama' })).toBeVisible();
  await page.evaluate(() => window.scrollTo({ top:400, behavior:'instant' }));
  await expect(page.locator('header')).toHaveAttribute('data-scrolled', 'true');
});
test('catalog selection preserves Leaf identity', async ({ page }) => {
  await page.locator('article[data-product="leaf"]').getByRole('link', { name:/Minta penawaran/ }).click();
  await expect(page).toHaveURL(/\/showroom$/);
  const config = page.locator('#rancang');
  await expect(config.getByRole('heading', { level:3 }).filter({ hasText:/^Leaf/ })).toBeVisible();
  await expect(config.getByRole('button', { name:'3D', exact:true })).toBeDisabled();
  expect(decodeURIComponent((await config.getByRole('link', { name:/Kirim rancangan/ }).getAttribute('href'))!)).toContain('Cermin LED Leaf');
});
test('configuration options and UTM reach WhatsApp', async ({ page, context }) => {
  await page.goto('/?utm_source=facebook&utm_campaign=showroom'); await expect(page.locator('html')).toHaveAttribute('data-hydrated','true');
  const config = page.locator('#rancang');
  const rect = config.getByRole('button', { name:'Pilih bentuk Rectangle',exact:true });
  await rect.click(); await expect(rect).toHaveAttribute('aria-pressed','true');
  await config.getByRole('button',{name:'60×80',exact:true}).click();
  await config.getByRole('button',{name:'Pilih LED 1 warna',exact:true}).click();
  await config.getByRole('button',{name:'Natural',exact:true}).click();
  await config.getByRole('button',{name:'Pilih kontrol sensor tangan',exact:true}).click();
  await config.getByRole('button',{name:'Tambah antifog',exact:true}).click();
  await config.getByPlaceholder(/contoh: Surabaya/).fill('Bandung');
  const link = config.getByRole('link',{name:/Kirim rancangan/});
  const href=decodeURIComponent((await link.getAttribute('href'))!);
  for(const text of ['Rectangle','60 × 80 cm','LED 1 warna natural','Sensor tangan + baterai','Antifog: Tidak','Bandung']) expect(href).toContain(text);
  const outbound=context.waitForEvent('request', { predicate: request=>request.url().startsWith('https://wa.me/') }); await link.click();
  expect(decodeURIComponent((await outbound).url())).toContain('Kode: LP-META');
});
test('invalid dimensions and round diameter', async ({ page }) => {
  const config=page.locator('#rancang'); await config.getByLabel('Lebar cm',{exact:true}).fill('2');
  await expect(config.getByRole('alert')).toContainText('30–200'); await expect(config.getByRole('link',{name:/Kirim rancangan/})).toHaveAttribute('aria-disabled','true');
  await config.getByRole('button',{name:'Pilih bentuk Round',exact:true}).click();
  await expect(config.getByLabel('Tinggi cm',{exact:true})).toHaveCount(0); await config.getByLabel('Diameter cm',{exact:true}).fill('90');
  expect(decodeURIComponent((await config.getByRole('link',{name:/Kirim rancangan/}).getAttribute('href'))!)).toContain('Ø 90 cm');
});
test('2.5D detail illustrations, hotspots and navigation stay synchronized', async ({ page }) => {
  const slider=page.getByRole('slider',{name:/Geser untuk membandingkan/}); await slider.focus(); await page.keyboard.press('ArrowRight'); await expect(slider).toHaveValue('51'); await page.keyboard.press('Home'); await expect(slider).toHaveValue('0');
  const detail=page.locator('#detail'); const panel=detail.locator('#mirror-detail-panel');
  await detail.scrollIntoViewIfNeeded();
  await expect(detail.locator('canvas')).toHaveCount(0);
  const scenes=[['Kaca','Lihat bidang pantulnya.'],['Tepi','Perhatikan setiap tepinya.'],['LED','Cahaya mengikuti bentuk.'],['Kontrol','Pilih cara menyalakannya.'],['Antifog','Pertimbangkan kebutuhan antifog.'],['Pemasangan','Siapkan tempatnya.']];
  for (const [index,[label,title]] of scenes.entries()) {
    const hotspot=detail.getByRole('button',{name:`Detail ${index+1}: ${label}`,exact:true}); await hotspot.click();
    await expect(hotspot).toHaveAttribute('aria-pressed','true'); await expect(panel).toContainText(title);
    await expect(panel.locator('svg[data-detail-scene]')).toHaveAttribute('data-detail-scene',String(index+1));
    await expect(panel.locator('svg[data-detail-scene]')).toBeVisible();
  }
  await detail.getByRole('button',{name:'Detail berikutnya: Kaca',exact:true}).click(); await expect(panel.locator('svg[data-detail-scene]')).toHaveAttribute('data-detail-scene','1');
  await detail.getByRole('button',{name:'Detail sebelumnya: Pemasangan',exact:true}).click(); await expect(panel.locator('svg[data-detail-scene]')).toHaveAttribute('data-detail-scene','6');
  await detail.getByRole('button',{name:'Bagian 3: LED',exact:true}).click(); await expect(panel.locator('svg[data-detail-scene]')).toHaveAttribute('data-detail-scene','3');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  const faq=page.locator('#faq').getByRole('button',{name:'Berapa harga cermin LED custom?',exact:true}); await faq.click(); await expect(faq).toHaveAttribute('aria-expanded','true');
  await expect(page.locator('#faq')).toContainText('Admin mengonfirmasi harga akhir');
});
test('detail 2.5D respects reduced motion and never mounts a canvas', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  const detail=page.locator('#detail'); await detail.scrollIntoViewIfNeeded();
  await expect(detail.locator('canvas')).toHaveCount(0);
  const illustration=detail.locator('svg[data-detail-scene]'); await expect(illustration).toBeVisible();
  const still=await illustration.screenshot(); await page.waitForTimeout(650); expect((await illustration.screenshot()).equals(still)).toBe(true);
});
test('lead form validation, persisted draft and complete handoff', async ({ page }) => {
  await page.addInitScript(() => { window.open=(url?:string|URL)=>{ (window as unknown as {opened:string}).opened=String(url); return null; }; });
  await page.reload(); await expect(page.locator('html')).toHaveAttribute('data-hydrated','true');
  const form=page.locator('#konsultasi'); await form.getByRole('button',{name:'Lanjut',exact:true}).click();
  await expect(form.getByText('Pilih dulu model cerminnya',{exact:true})).toBeVisible();
  await form.getByRole('button',{name:/Rectangle Persegi/}).click(); await page.reload(); await expect(page.locator('html')).toHaveAttribute('data-hydrated','true');
  await expect(form.getByRole('button',{name:/Rectangle Persegi/})).toHaveAttribute('aria-pressed','true');
  await form.getByRole('button',{name:'Lanjut',exact:true}).click();
  await form.getByLabel(/Panjang/).fill('60'); await form.getByLabel(/Lebar/).fill('80');
  await form.getByRole('button',{name:'Lanjut',exact:true}).click(); await form.getByLabel(/Nama/).fill('Pengujian Putra'); await form.getByLabel(/WhatsApp/).fill('081234567890');
  if (test.info().project.name.includes('mobile')) await form.getByRole('button',{name:/Kirim.*WhatsApp/}).tap(); else await form.getByRole('button',{name:/Kirim.*WhatsApp/}).click();
  await expect.poll(()=>page.evaluate(()=>(window as unknown as {opened?:string}).opened)).toContain('wa.me/');
  const opened=decodeURIComponent(await page.evaluate(()=>(window as unknown as {opened:string}).opened)); expect(opened).toContain('Rectangle'); expect(opened).toContain('60 x 80 cm');
  expect(await page.evaluate(()=>sessionStorage.getItem('pg_lead_draft'))).toBeNull();
});
test('consent gating and revocation', async ({ page }) => {
  await page.addInitScript(()=>{localStorage.removeItem('pg_cookie_consent'); (window as unknown as {calls:unknown[]}).calls=[]; window.fbq=(...args:unknown[])=>(window as unknown as {calls:unknown[]}).calls.push(args);});
  await page.reload(); await expect(page.locator('html')).toHaveAttribute('data-hydrated','true');
  await expect(page.getByRole('complementary',{name:'Pemberitahuan cookie'})).toBeVisible();
  await expect(page.locator('script[src*="facebook"],script[src*="tiktok"],script[src*="googletagmanager"],script[src*="clarity.ms"]')).toHaveCount(0);
  await page.getByRole('button',{name:'Tolak',exact:true}).click(); await page.locator('#rancang').getByRole('button',{name:'Natural',exact:true}).click();
  const events=()=>page.evaluate(()=>(window as unknown as {calls:unknown[][]}).calls.filter(call=>call[0]==='trackCustom').length);
  expect(await events()).toBe(0);
  await page.getByRole('button',{name:'Pengaturan cookie',exact:true}).click(); await page.getByRole('button',{name:'Izinkan',exact:true}).click();
  await page.locator('#rancang').getByRole('button',{name:'Putih',exact:true}).click(); expect(await events()).toBeGreaterThan(0);
  await page.getByRole('button',{name:'Pengaturan cookie',exact:true}).click(); await page.getByRole('button',{name:'Tolak',exact:true}).click();
  const count=await events(); await page.locator('#rancang').getByRole('button',{name:'Hangat',exact:true}).click(); expect(await events()).toBe(count);
});
test('two pinned stories progress and reverse, or stack on mobile', async ({ page }) => {
  const pinned=(page.viewportSize()?.width??0)>=1024 && (page.viewportSize()?.height??0)>=700;
  for(const id of ['cerita-cahaya','workshop']) {
    const story=page.locator('#'+id); await expect(story).toHaveAttribute('data-pinned',String(pinned)); await expect(story.locator('article')).toHaveCount(4);
    if(pinned) for(const index of [0,1,2,3,1]) {
      await story.evaluate((el,index)=>{const header=document.querySelector('header')!.getBoundingClientRect().height; const top=el.getBoundingClientRect().top+window.scrollY-header; const travel=el.getBoundingClientRect().height-(window.innerHeight-header); window.scrollTo({top:top+travel*(index/4+.1),behavior:'instant'});},index);
      await expect(story).toHaveAttribute('data-active-chapter',String(index));
      const top=await story.locator('[class*="stage"]').evaluate(el=>el.getBoundingClientRect().top); const height=await page.locator('header').evaluate(el=>el.getBoundingClientRect().height); expect(Math.abs(top-height)).toBeLessThan(3);
    } else for(const chapter of await story.locator('article').all()) await expect(chapter).toBeVisible();
  }
  await page.locator('#cerita-cahaya').getByRole('button',{name:/Lewati cerita/}).click(); await expect(page.locator('#model')).toBeInViewport({ratio:.1}); expect(new URL(page.url()).hash).toBe('');
});
test('3D renders on demand, camera works, context loss falls back', async ({ page }) => {
  test.setTimeout(60000);
  const config=page.locator('#rancang'); await config.getByRole('button',{name:'3D',exact:true}).click();
  const canvas=config.locator('canvas'); await expect(canvas).toBeVisible({timeout:20000});
  await expect(config.getByRole('button',{name:'Tampak samping',exact:true})).toBeEnabled({timeout:20000});
  const before=await canvas.screenshot(); await config.getByRole('button',{name:'Tampak samping',exact:true}).click();
  await expect.poll(async()=>!(await canvas.screenshot()).equals(before)).toBe(true);
  await config.getByRole('button',{name:'Reset kamera',exact:true}).click(); await expect(config.getByText(/Simulasi visual — detail akhir/)).toBeVisible();
  await canvas.evaluate(el=>{const ext=(el as HTMLCanvasElement).getContext('webgl2')?.getExtension('WEBGL_lose_context'); if(!ext) throw new Error('Context-loss test extension unavailable'); ext.loseContext();});
  await expect(config.getByText('Tampilan 3D belum tersedia.',{exact:true})).toBeVisible();
  await config.getByRole('button',{name:'Kembali ke foto',exact:true}).click(); await expect(config.locator('canvas')).toHaveCount(0);
  await expect(config.getByRole('link',{name:/Kirim rancangan/})).toBeVisible();
});
test('WCAG A/AA scan: no serious or critical issues', async ({ page }) => {
  const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  expect(scan.violations.filter(v=>['serious','critical'].includes(v.impact??'')).map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
});
test('catalog filtering and all static product URLs', async ({ page, request }) => {
  await page.goto('/katalog'); await page.getByRole('button',{name:'Organik',exact:true}).click(); await expect(page.locator('#model article')).toHaveCount(2);
  for(const slug of ['capsul','oval','round','rectangle','leaf','half-moon']) {
    await page.goto('/produk/'+slug); await expect(page.locator('h1')).toContainText('Cermin LED');
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://putraglass.id/produk/'+slug);
    const schemas=await page.locator('script[type="application/ld+json"]').allTextContents(); expect(schemas.join('')).toContain('BreadcrumbList'); expect(schemas.join('')).not.toMatch(/AggregateOffer|InStock|lowPrice/);
  }
  expect((await request.get('/produk/not-a-product')).status()).toBe(404);
});
