const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 393, height: 852 }, isMobile: true });
  const page = await context.newPage();

  console.log('Navigating to live workout...');
  await page.goto('https://shravan-sulikeri.github.io/leantrack/#/workout');
  await page.waitForTimeout(2000);

  const startBtn = await page.$('button:has-text("Start Workout")');
  if (startBtn) {
    await startBtn.click();
    await page.waitForTimeout(1000);
  }

  const weightInput = await page.$('input[placeholder*="lbs"], input[type="number"]');
  if (weightInput) {
    await weightInput.fill('50');
    await page.waitForTimeout(500);
  }

  console.log('Reloading live workout...');
  await page.reload();
  await page.waitForTimeout(2000);

  const content = await page.content();
  const sessionPersisted = content.includes('Finish Workout');
  const weightPersisted = content.includes('50');
  console.log('Active session still present after reload:', sessionPersisted);
  console.log('Weight 50 lb persisted after reload:', weightPersisted);

  const finishBtn = await page.$('button:has-text("Finish Workout")');
  if (finishBtn) {
    await finishBtn.click();
    await page.waitForTimeout(1500);
  }

  console.log('Navigating to live history...');
  await page.goto('https://shravan-sulikeri.github.io/leantrack/#/history');
  await page.waitForTimeout(1500);

  const historyContent = await page.content();
  const recordedInHistory = historyContent.includes('Upper Body A');
  console.log('History has recorded session:', recordedInHistory);

  await browser.close();
  if (sessionPersisted && weightPersisted && recordedInHistory) {
    console.log('VERIFICATION COMPLETE: All workout data persists cleanly!');
  } else {
    console.error('VERIFICATION FAILED');
  }
})();
