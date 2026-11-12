const { chromium } = require('playwright');

async function testPersistence() {
  console.log('Testing live data persistence on https://shravan-sulikeri.github.io/leantrack/ ...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    isMobile: true,
  });
  const page = await context.newPage();

  // 1. Visit live site
  await page.goto('https://shravan-sulikeri.github.io/leantrack/');
  await page.waitForTimeout(2000);

  // 2. Open Weight Log Sheet
  console.log('Opening weight logger...');
  const weightTile = await page.$('button:has-text("Weight")');
  if (weightTile) {
    await weightTile.click();
    await page.waitForTimeout(800);

    // Enter 237.5 lb
    const input = await page.$('input[placeholder="e.g. 240.0"], input[type="number"]');
    if (input) {
      await input.fill('237.5');
      await page.waitForTimeout(300);
      const saveBtn = await page.$('button:has-text("Save Weight")');
      if (saveBtn) {
        await saveBtn.click();
        await page.waitForTimeout(1000);
      }
    }
  }

  // 3. Open Calorie Log Sheet
  console.log('Opening calorie logger...');
  const calorieTile = await page.$('button:has-text("Calories")');
  if (calorieTile) {
    await calorieTile.click();
    await page.waitForTimeout(800);

    const input = await page.$('input[placeholder="e.g. 2250"], input[type="number"]');
    if (input) {
      await input.fill('2150');
      await page.waitForTimeout(300);
      const saveBtn = await page.$('button[type="submit"]');
      if (saveBtn) {
        await saveBtn.click();
        await page.waitForTimeout(1000);
      }
    }
  }

  // Check state before reload
  let content = await page.content();
  console.log('Before reload: contains 237.5 lb =', content.includes('237.5'));
  console.log('Before reload: contains 2150 kcal =', content.includes('2150'));

  // 4. Reload page to test browser persistence
  console.log('Reloading page...');
  await page.reload();
  await page.waitForTimeout(2000);

  content = await page.content();
  const weightPersisted = content.includes('237.5');
  const caloriesPersisted = content.includes('2150');
  console.log('After reload: contains 237.5 lb =', weightPersisted);
  console.log('After reload: contains 2150 kcal =', caloriesPersisted);

  if (weightPersisted && caloriesPersisted) {
    console.log('SUCCESS: Weight and Calorie data survived reload!');
  } else {
    console.error('FAILURE: Data did not persist after reload.');
  }

  await browser.close();
}

testPersistence().catch(console.error);
