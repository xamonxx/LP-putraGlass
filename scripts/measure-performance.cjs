const { chromium } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

// Same local Chromium/CDP laboratory procedure before and after. Not field CWV.
(async () => {
  const browser = await chromium.launch({ headless: true });
  const runs = [];
  try {
    for (let run = 0; run < 3; run++) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
      const page = await context.newPage();
      const cdp = await context.newCDPSession(page);
      await cdp.send('Network.enable');
      await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
      await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 93750 });
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await page.addInitScript(() => {
        window.__metrics = { lcp: null, cls: 0 };
        new PerformanceObserver(list => { for (const e of list.getEntries()) window.__metrics.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.__metrics.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
      });
      await page.goto('http://127.0.0.1:3333/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      runs.push(await page.evaluate(() => ({ ...window.__metrics, resources: performance.getEntriesByType('resource').length, transferredBytes: performance.getEntriesByType('resource').reduce((sum, e) => sum + e.transferSize, 0) })));
      await context.close();
    }
    const median = key => [...runs].sort((a, b) => a[key] - b[key])[1][key];
    const report = { date: new Date().toISOString(), method: 'Chromium cold cache, 390x844, DPR 1, CPU x4, 150ms latency, 1.6Mbps down; 3 runs', runs, median: { lcp: median('lcp'), cls: median('cls'), transferredBytes: median('transferredBytes') }, inp: 'Not measured: no representative interaction sample; field p75 requires real traffic.' };
    const output = path.join(__dirname, '..', 'docs', process.argv[2] === 'before' ? 'performance-before.json' : 'performance-after.json');
    fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
