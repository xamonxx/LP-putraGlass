import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3333',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'desktop-chrome',
      testMatch: 'landing-page.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'mobile-chrome',
      testMatch: 'landing-page.spec.ts',
      use: {
        ...devices['Pixel 7'],
      },
    },
    {
      name: 'small-mobile',
      testMatch: 'landing-page.spec.ts',
      use: {
        ...devices['Pixel 7'],
        viewport: { width: 320, height: 600 },
        isMobile: true,
      },
    },
    { name: 'resilience', testMatch: 'resilience.spec.ts', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'domain', testMatch: 'domain.spec.ts' },
  ],
  webServer: {
    command: 'node serve.js',
    url: 'http://127.0.0.1:3333',
    reuseExistingServer: true,
    timeout: 30000,
  },
});
