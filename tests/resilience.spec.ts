import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
test.beforeEach(async ({ context }) => {
  await context.route(/^https:\/\/(?!127\.0\.0\.1|localhost)/, route => route.abort());
});
async function ready(page: import('@playwright/test').Page) { await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true'); }
test('all eight target widths have no overflow or clipped primary controls', async ({ page }) => {
  fs.mkdirSync('docs/screenshots', { recursive:true });
  await page.addInitScript(() => localStorage.setItem('pg_cookie_consent', 'denied'));
  await page.goto('/'); await ready(page);
  for (const width of [320,360,390,430,768,1024,1440,1920]) {
    await page.setViewportSize({ width,height:900 });
    await expect.poll(() => page.evaluate(() => [...document.querySelectorAll('main *,header *')].filter(el => { if (el.parentElement?.closest('svg[aria-hidden="true"]')) return false; const rect=el.getBoundingClientRect(); return rect.width > 0 && (rect.right > innerWidth + 1 || rect.left < -1); }).map(el => ({ tag:el.tagName, cls:el.className, right:Math.round(el.getBoundingClientRect().right), width:innerWidth })).slice(0,8)), { message:`overflow at ${width}px` }).toEqual([]);
    const config = page.locator('#rancang'); await config.getByRole('button', { name:'Pilih bentuk Round',exact:true }).click();
    await expect(config.getByRole('link',{name:/Kirim rancangan/})).toBeVisible();
    await page.evaluate(() => window.scrollTo({ top:0,behavior:'instant' }));
    if ([390,1440].includes(width)) await page.screenshot({ path:`docs/screenshots/home-${width}.png` });
  }
});
test('pin handles resize, short viewport, reduced motion and direct story anchors', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('pg_cookie_consent', 'denied'));
  await page.goto('/tentang'); await ready(page);
  const story = page.locator('#workshop');
  await expect(story).toHaveAttribute('data-pinned','true');
  for (const [width,height,pin] of [[1440,650,false],[390,844,false],[1440,900,true]] as const) {
    await page.setViewportSize({width,height}); await expect(story).toHaveAttribute('data-pinned',String(pin));
  }
  await page.emulateMedia({ reducedMotion:'reduce' });
  await expect(story).toHaveAttribute('data-pinned','false');
  for (const chapter of await story.locator('article').all()) await expect(chapter).toBeVisible();
  const box=await story.boundingBox(); expect(box!.height).toBeLessThan(5000);
});
test('without JavaScript all eight story chapters and consultation links remain available', async ({ browser }) => {
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:1440,height:900}});
  try { const page=await context.newPage(); await page.goto('/');
    for(const id of ['cerita-cahaya','workshop']) { const story=page.locator('#'+id); await expect(story).toHaveAttribute('data-pinned','false'); for(const chapter of await story.locator('article').all()) await expect(chapter).toBeVisible(); }
    await expect(page.locator('#rancang a[href^="https://wa.me/"]')).toHaveAttribute('href',/Produk/);
    await expect(page.locator('h1')).toBeVisible(); await expect(page.locator('canvas')).toHaveCount(0);
  } finally { await context.close(); }
});
test('unsupported WebGL gives a usable photo fallback', async ({ page }) => {
  await page.addInitScript({content:"localStorage.setItem('pg_cookie_consent','denied'); const original=HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext=function(kind,...args){if(String(kind).includes('webgl'))return null;return original.call(this,kind,...args)};"});
  await page.goto('/'); await ready(page);
  await page.locator('#rancang').getByRole('button',{name:'3D',exact:true}).click();
  await expect(page.getByText('Tampilan 3D belum tersedia.',{exact:true})).toBeVisible({timeout:15000});
  await page.getByRole('button',{name:'Kembali ke foto',exact:true}).click();
  await expect(page.locator('#rancang img')).toBeVisible();
  await expect(page.locator('#rancang a[href^="https://wa.me/"]')).toBeVisible();
});
test('failed 3D chunk and slow network do not block quotation', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('pg_cookie_consent','denied'));
  await page.goto('/'); await ready(page); await page.waitForLoadState('networkidle');
  await page.route('**/_next/static/chunks/*.js',route=>route.abort());
  await page.locator('#rancang').getByRole('button',{name:'3D',exact:true}).click();
  await expect(page.getByText('Tampilan 3D belum tersedia.',{exact:true})).toBeVisible({timeout:15000});
  await page.getByRole('button',{name:'Kembali ke foto',exact:true}).click();
  await expect(page.locator('#rancang a[href^="https://wa.me/"]')).toBeVisible();
});
test('wheel scroll, drag rotation, light changes and room mode work', async ({ page }) => {
  test.setTimeout(60000);
  await page.addInitScript(()=>localStorage.setItem('pg_cookie_consent','denied'));
  await page.goto('/'); await ready(page);
  const config=page.locator('#rancang'); await config.getByRole('button',{name:'3D',exact:true}).click();
  const activate=config.getByRole('button',{name:/Aktifkan putar/}); await expect(activate).toBeEnabled({timeout:20000});
  const canvas=config.locator('canvas'); await canvas.scrollIntoViewIfNeeded(); const box=(await canvas.boundingBox())!;
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2); const scroll=await page.evaluate(()=>window.scrollY); await page.mouse.wheel(0,200);
  await expect.poll(()=>page.evaluate(()=>window.scrollY)).toBeGreaterThan(scroll);
  await activate.click(); const image=await canvas.screenshot(); const current=(await canvas.boundingBox())!;
  await page.mouse.move(current.x+current.width/2,current.y+current.height/2); await page.mouse.down(); await page.mouse.move(current.x+current.width/2+100,current.y+current.height/2,{steps:12}); await page.mouse.up();
  await expect.poll(async()=>!(await canvas.screenshot()).equals(image)).toBe(true);
  await config.getByRole('button',{name:/Selesai berinteraksi/}).focus(); await page.keyboard.press('Escape');
  await expect(config.getByRole('button',{name:/Aktifkan putar/})).toHaveAttribute('aria-pressed','false');
  await config.getByRole('button',{name:'Dalam ruang',exact:true}).click(); await expect(config.getByRole('button',{name:'Reset kamera',exact:true})).toBeEnabled();
  await config.getByRole('button',{name:'Matikan lampu cermin',exact:true}).click(); await expect(config.getByRole('button',{name:'Nyalakan lampu cermin',exact:true})).toHaveAttribute('aria-pressed','false');
  await config.getByRole('button',{name:'Nyalakan lampu cermin',exact:true}).click();
  await config.getByRole('button',{name:'Tampak tiga perempat',exact:true}).click();
  let previousFrame: Buffer | undefined;
  await expect.poll(async()=>{const frame=await canvas.screenshot();const stable=previousFrame?.equals(frame)??false;previousFrame=frame;return stable;}).toBe(true);
  await canvas.scrollIntoViewIfNeeded(); await page.screenshot({path:'docs/screenshots/showroom-3d.png'});
});
test('all four parametric silhouettes and changed dimensions render without errors', async ({ page }) => {
  test.setTimeout(60000);
  const errors: string[]=[]; page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>localStorage.setItem('pg_cookie_consent','denied'));
  await page.goto('/'); await ready(page);
  const config=page.locator('#rancang'); await config.getByRole('button',{name:'3D',exact:true}).click();
  await expect(config.getByRole('button',{name:'Reset kamera',exact:true})).toBeEnabled({timeout:20000});
  const canvas=config.locator('canvas'); let previous=await canvas.screenshot();
  for(const shape of ['Rectangle','Oval','Round','Capsul']) {
    await config.getByRole('button',{name:'Pilih bentuk '+shape,exact:true}).click();
    await expect.poll(async()=>!(await canvas.screenshot()).equals(previous)).toBe(true); previous=await canvas.screenshot();
  }
  await config.getByLabel('Lebar cm',{exact:true}).fill('100');
  await expect.poll(async()=>!(await canvas.screenshot()).equals(previous)).toBe(true);
  expect(errors).toEqual([]);
});
test('touch rotation and pinch zoom change the rendered model', async ({ browser }) => {
  test.setTimeout(60000);
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  try {
    await context.addInitScript(()=>localStorage.setItem('pg_cookie_consent','denied'));
    const page=await context.newPage(); await page.goto('/'); await ready(page);
    const config=page.locator('#rancang'); await config.getByRole('button',{name:'3D',exact:true}).click(); await expect(config.getByRole('button',{name:/Aktifkan putar/})).toBeEnabled({timeout:20000}); await config.getByRole('button',{name:/Aktifkan putar/}).click();
    const canvas=config.locator('canvas'); await canvas.scrollIntoViewIfNeeded(); const box=(await canvas.boundingBox())!, x=box.x+box.width/2,y=box.y+box.height/2;
    const cdp=await context.newCDPSession(page); const before=await canvas.screenshot();
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});
    for(let i=1;i<=5;i++) await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+i*12,y,id:1}]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]}); await expect.poll(async()=>!(await canvas.screenshot()).equals(before)).toBe(true);
    const rotated=await canvas.screenshot(); await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x-25,y,id:1},{x:x+25,y,id:2}]});
    for(let i=1;i<=5;i++) await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-25-i*5,y,id:1},{x:x+25+i*5,y,id:2}]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]}); await expect.poll(async()=>!(await canvas.screenshot()).equals(rotated)).toBe(true);
  } finally { await context.close(); }
});
test('product pages, open FAQ and viewer controls pass automated accessibility scan', async ({ page }) => {
  await page.addInitScript(()=>localStorage.setItem('pg_cookie_consent','denied'));
  for(const path of ['/katalog','/produk/leaf','/privasi']) {
    await page.goto(path); await ready(page); const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
    expect(result.violations.filter(v=>['serious','critical'].includes(v.impact??'')).map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  }
});
for (const colorScheme of ['light', 'dark'] as const) {
  test(`FAQ remains readable when OS prefers ${colorScheme}`, async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('pg_cookie_consent', 'denied'));
    await page.emulateMedia({ colorScheme });
    for (const width of [1440,390]) {
      await page.setViewportSize({width,height:900});
      await page.goto('/faq'); await ready(page);
      const faq=page.locator('#faq');
      await expect(faq.getByRole('heading',{name:'pertanyaan umum',exact:true})).toBeVisible();
      await expect(faq).toHaveCSS('background-color','rgb(245, 247, 250)');
      const question=faq.getByRole('button',{name:'Berapa harga cermin LED custom?',exact:true});
      await question.hover(); await question.click();
      await expect(question).toHaveAttribute('aria-expanded','true');
      const answer=faq.locator('[role="region"][data-state="open"]');
      await expect(answer).toHaveCSS('opacity','1');
      await expect(answer.locator('p')).toHaveCSS('opacity','1');
      const result=await new AxeBuilder({page}).include('#faq').withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
      expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
      await question.click();
      await faq.evaluate(element=>window.scrollTo({top:element.getBoundingClientRect().top+window.scrollY-document.querySelector('header')!.getBoundingClientRect().height,behavior:'instant'}));
      if(colorScheme==='dark') await page.screenshot({path:`docs/screenshots/faq-fixed-${width}.png`});
    }
  });
}

test('mobile drawer hides sticky WhatsApp and keeps links reachable on short screens', async ({ browser }) => {
  const context=await browser.newContext({viewport:{width:320,height:600},isMobile:true,hasTouch:true,colorScheme:'dark'});
  try {
    await context.addInitScript(()=>localStorage.setItem('pg_cookie_consent','denied'));
    const page=await context.newPage();
    for(const [width,height] of [[320,600],[390,844]]) {
      await page.setViewportSize({width,height}); await page.goto('/faq'); await ready(page);
      await page.mouse.wheel(0,180);
      await expect.poll(()=>page.evaluate(()=>window.scrollY)).toBeGreaterThan(0);
      const sticky=page.locator('aside[aria-label="Konsultasi cepat"]');
      await expect(sticky).toBeVisible();
      const scrollPosition=await page.evaluate(()=>window.scrollY);
      const menu=page.getByRole('button',{name:'Buka menu navigasi',exact:true}); await menu.tap();
      const dialog=page.getByRole('dialog'); await expect(dialog).toBeVisible();
      expect(await page.evaluate(()=>window.scrollY)).toBeCloseTo(scrollPosition,0);
      await expect(page.locator('body')).toHaveAttribute('data-mobile-menu-open','true');
      await expect(sticky).toBeHidden();
      const quote=dialog.getByRole('link',{name:/Konsultasi & penawaran/}); await quote.scrollIntoViewIfNeeded();
      const box=(await quote.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0); expect(box.x+box.width).toBeLessThanOrEqual(width); expect(box.y+box.height).toBeLessThanOrEqual(height);
      const result=await new AxeBuilder({page}).include('[role="dialog"]').withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
      expect(result.violations.map(v=>v.id)).toEqual([]);
      if(width===390) await page.screenshot({path:'docs/screenshots/mobile-menu-fixed.png'});
      await page.keyboard.press('Escape'); await expect(dialog).toBeHidden(); await expect(menu).toBeFocused(); await expect(sticky).toBeVisible();
      expect(await page.evaluate(()=>window.scrollY)).toBeCloseTo(scrollPosition,0);
      await menu.tap(); await dialog.getByRole('link',{name:'Koleksi',exact:true}).tap(); await expect(dialog).toBeHidden(); await expect(page).toHaveURL(/\/katalog$/);
      await menu.tap(); await page.setViewportSize({width:1440,height:900}); await expect(dialog).toBeHidden();
    }
  } finally { await context.close(); }
});

test('public navigation uses crawlable paths instead of hash destinations', async ({ page }) => {
  await page.addInitScript(()=>localStorage.setItem('pg_cookie_consent','denied'));
  await page.goto('/'); await ready(page);
  const nav=page.getByRole('navigation',{name:'Menu utama',exact:true});
  for(const [label,path] of [['Koleksi','/katalog'],['Showroom 3D','/showroom'],['Cerita kami','/tentang'],['Cara pesan','/cara-pesan'],['FAQ','/faq']]) {
    await expect(nav.getByRole('link',{name:label,exact:true})).toHaveAttribute('href',path);
  }
  await expect(page.locator('a[href*="#"]:not(.skip-link)')).toHaveCount(0);
  await page.getByRole('link',{name:'Eksplorasi cermin 3D',exact:true}).click();
  await expect(page).toHaveURL(/\/showroom$/); await expect(page.locator('h1')).toContainText('Satu cermin.');
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://putraglass.id/showroom');
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.getByRole('navigation',{name:'Menu utama',exact:true}).getByRole('link',{name:'FAQ',exact:true}).click();
  await expect(page).toHaveURL(/\/faq$/); await expect(page.locator('h1')).toHaveText('pertanyaan umum');
  await page.goBack(); await expect(page).toHaveURL(/\/showroom$/);
  await page.reload(); await expect(page.locator('#rancang')).toBeVisible();
});

test('every destination exports distinct server HTML, canonical, Open Graph, breadcrumb and sitemap entry', async ({ browser, request }) => {
  const paths=['/katalog','/showroom','/tentang','/cara-pesan','/konsultasi','/faq'];
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:1440,height:900}});
  try {
    const page=await context.newPage(); const titles=new Set<string>();
    for(const path of paths) {
      const response=await page.goto(path); expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1); await expect(page.locator('h1')).toBeVisible();
      titles.add(await page.title());
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://putraglass.id'+path);
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content','https://putraglass.id'+path);
      const schemas=(await page.locator('script[type="application/ld+json"]').allTextContents()).map(text=>JSON.parse(text));
      const breadcrumb=schemas.find(schema=>schema['@type']==='BreadcrumbList');
      expect(breadcrumb.itemListElement.at(-1).item).toBe('https://putraglass.id'+path);
      if(path==='/faq') expect(schemas.some(schema=>schema['@type']==='FAQPage')).toBe(true);
    }
    expect(titles.size).toBe(paths.length);
    const sitemap=await request.get('/sitemap.xml'); expect(sitemap.status()).toBe(200);
    expect(sitemap.headers()['content-type']).toContain('application/xml');
    const flight=await request.get('/showroom.txt'); expect(flight.status()).toBe(200); expect(flight.headers()['content-type']).toContain('text/plain');
    expect(flight.headers()['cache-control']).toBe('no-cache');
    const xml=await sitemap.text(); for(const path of paths) expect(xml).toContain('<loc>https://putraglass.id'+path+'</loc>'); expect(xml).not.toContain('#');
    expect((await request.get('/nonexistent-page')).status()).toBe(404);
  } finally { await context.close(); }
});

test('old campaign fragment links resolve to clean pages and preserve UTM', async ({ page }) => {
  await page.addInitScript(()=>localStorage.setItem('pg_cookie_consent','denied'));
  for(const [fragment,path] of [['model','/katalog'],['rancang','/showroom'],['workshop','/tentang'],['cara-pesan','/cara-pesan'],['konsultasi','/konsultasi'],['faq','/faq']]) {
    await page.goto('/?utm_source=facebook#'+fragment);
    await expect(page).toHaveURL('http://127.0.0.1:3333'+path+'?utm_source=facebook');
    expect(new URL(page.url()).hash).toBe(''); await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://putraglass.id'+path);
  }
});

test('new pages remain usable at 320px and pass automated accessibility scans', async ({ page }) => {
  await page.addInitScript(()=>localStorage.setItem('pg_cookie_consent','denied'));
  await page.setViewportSize({width:320,height:600});
  for(const path of ['/showroom','/tentang','/cara-pesan','/konsultasi','/faq']) {
    await page.goto(path); await ready(page);
    await expect.poll(()=>page.evaluate(()=>[...document.querySelectorAll('main *,header *')].filter(el=>{const rect=el.getBoundingClientRect();return rect.width>0&&(rect.right>innerWidth+1||rect.left< -1)}).map(el=>el.tagName))).toEqual([]);
    const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
    expect(result.violations.filter(v=>['serious','critical'].includes(v.impact??'')).map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  }
});

test('catalog to showroom retains configuration across page navigation', async ({ page }) => {
  await page.addInitScript(()=>localStorage.setItem('pg_cookie_consent','denied'));
  await page.goto('/showroom'); await ready(page);
  await page.locator('#rancang').getByLabel('Lebar cm',{exact:true}).fill('95');
  await page.locator('#rancang').getByPlaceholder(/contoh: Surabaya/).fill('Bandung');
  await page.getByRole('navigation',{name:'Menu utama',exact:true}).getByRole('link',{name:'Koleksi',exact:true}).click();
  await expect(page).toHaveURL(/\/katalog$/);
  await page.locator('article[data-product="leaf"]').getByRole('link',{name:/Minta penawaran/}).click();
  await expect(page).toHaveURL(/\/showroom$/);
  const config=page.locator('#rancang');
  await expect(config.getByLabel('Lebar cm',{exact:true})).toHaveValue('95');
  await expect(config.getByPlaceholder(/contoh: Surabaya/)).toHaveValue('Bandung');
  expect(decodeURIComponent((await config.getByRole('link',{name:/Kirim rancangan/}).getAttribute('href'))!)).toContain('Cermin LED Leaf');
});

test('hero selects portrait artwork for phones/tablets and landscape artwork for desktop', async ({ page }) => {
  await page.addInitScript(()=>localStorage.setItem('pg_cookie_consent','denied'));
  for(const [width,height,art] of [[320,600,'mobile'],[390,844,'mobile'],[390,668,'mobile'],[768,1024,'mobile'],[1024,768,'desktop'],[1440,900,'desktop'],[1920,1080,'desktop'],[844,390,'desktop']] as const) {
    await page.setViewportSize({width,height}); await page.goto('/'); await ready(page);
    const hero=page.locator('#hero'); const image=hero.locator('img');
    await expect(page.locator('header')).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
    await expect.poll(()=>image.evaluate(el=>(el as HTMLImageElement).currentSrc)).toContain('/img/hero/lighting/'+art+'-');
    await expect.poll(()=>image.evaluate(el=>(el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await expect(hero.getByRole('heading',{level:1})).toBeVisible();
    const heroBox=(await hero.boundingBox())!, titleBox=(await hero.locator('h1').boundingBox())!, headerBox=(await page.locator('header').boundingBox())!;
    expect(heroBox.y).toBe(0); expect(titleBox.y).toBeGreaterThan(headerBox.height);
    for(const label of ['Eksplorasi cermin 3D','Lihat katalog']) {
      const box=(await hero.getByRole('link',{name:label,exact:true}).boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0); expect(box.x+box.width).toBeLessThanOrEqual(width); expect(box.y+box.height).toBeLessThan(heroBox.height);
    }
    if([390,768,1440].includes(width)) await page.screenshot({path:width===390&&height<700?'docs/screenshots/hero-background-short-mobile.png':`docs/screenshots/hero-background-${width}.png`});
  }
});

test('homepage navbar changes from transparent to solid on scroll and returns without layout shift', async ({ page }) => {
  await page.addInitScript(()=>localStorage.setItem('pg_cookie_consent','denied'));
  await page.goto('/'); await ready(page);
  const header=page.locator('header'); await expect(header).toHaveAttribute('data-overlay','true');
  await expect(header).toHaveCSS('position','fixed'); await expect(header).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
  const top=await page.locator('#hero').evaluate(el=>el.getBoundingClientRect().top+scrollY);
  await page.mouse.wheel(0,300); await expect(header).toHaveAttribute('data-scrolled','true');
  await expect(header).toHaveCSS('background-color','rgba(245, 247, 250, 0.96)');
  expect(await page.locator('#hero').evaluate(el=>el.getBoundingClientRect().top+scrollY)).toBeCloseTo(top,0);
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'})); await expect(header).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
  await page.goto('/showroom'); await ready(page); await expect(header).toHaveAttribute('data-overlay','false');
  await expect(header).toHaveCSS('position','sticky'); await expect(header).toHaveCSS('background-color','rgba(245, 247, 250, 0.96)');
});

test('without JavaScript the hero artwork and links load with a solid accessible navbar', async ({ browser }) => {
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844},isMobile:true});
  try {
    const page=await context.newPage(); await page.goto('/');
    await expect(page.locator('header')).toHaveCSS('background-color','rgb(245, 247, 250)');
    await expect.poll(()=>page.locator('#hero img').evaluate(el=>(el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await expect(page.locator('#hero').getByRole('link',{name:'Eksplorasi cermin 3D',exact:true})).toHaveAttribute('href','/showroom');
    await expect(page.locator('#hero')).toContainText('ilustrasi digital');
  } finally { await context.close(); }
});
