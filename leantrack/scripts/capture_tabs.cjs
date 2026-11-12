const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = '/Users/shravansulikerisamit/.gemini/antigravity/brain/6ce03a50-3c31-4573-aecf-c50401d5a5d6';
const SCREENSHOT_DIR = path.join(ARTIFACT_DIR, 'screenshots');

async function captureAllTemplates() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const page = await context.newPage();

  await page.goto('http://localhost:4173/workout');
  await page.waitForTimeout(1000);

  // Tab 1: Upper Body A
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v1_2_tab_upper_a.png') });

  // Tab 2: Lower Body A
  const lowerABtn = await page.$('button:has-text("Lower Body A")');
  if (lowerABtn) {
    await lowerABtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v1_2_tab_lower_a.png') });
  }

  // Tab 3: Upper Body B
  const upperBBtn = await page.$('button:has-text("Upper Body B")');
  if (upperBBtn) {
    await upperBBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v1_2_tab_upper_b.png') });
  }

  // Tab 4: Lower Body B
  const lowerBBtn = await page.$('button:has-text("Lower Body B")');
  if (lowerBBtn) {
    await lowerBBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v1_2_tab_lower_b.png') });
  }

  await browser.close();
  console.log('All 4 template tabs captured!');
}

captureAllTemplates();
