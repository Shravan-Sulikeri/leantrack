const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = '/Users/shravansulikerisamit/.gemini/antigravity/brain/6ce03a50-3c31-4573-aecf-c50401d5a5d6';
const SCREENSHOT_DIR = path.join(ARTIFACT_DIR, 'screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function verify() {
  console.log('--- Starting LeanTrack v1.2 Verification ---');
  const browser = await chromium.launch({ headless: true });
  // iPhone 15 Pro viewport: 393 x 852
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  // 1. Check Today Screen
  console.log('1. Loading Today Dashboard...');
  await page.goto('http://localhost:4173/');
  await page.waitForTimeout(1500);

  // Take screenshot of Today Screen
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v1_2_01_today_screen.png') });
  console.log('Saved v1_2_01_today_screen.png');

  // Verify breakdown 60m strength + 15m cardio
  const pageContent = await page.content();
  const has60m = pageContent.includes('60 min Strength') || pageContent.includes('60 min');
  const has15m = pageContent.includes('15 min Cardio') || pageContent.includes('15 min');
  const has75m = pageContent.includes('75 min total') || pageContent.includes('75 min');
  console.log(`Today Breakdown Check: 60m=${has60m}, 15m=${has15m}, 75m=${has75m}`);

  // 2. Navigate to Workout Screen
  console.log('2. Navigating to Workout Screen...');
  await page.goto('http://localhost:4173/workout');
  await page.waitForTimeout(1500);

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v1_2_02_workout_screen_overview.png') });
  console.log('Saved v1_2_02_workout_screen_overview.png');

  // Verify exercises present for Upper Body A:
  // Lat Pulldown, Cable Row, Chest Press, DB Shoulder Press, Lateral Raises, Rope Triceps, DB Biceps Curls
  const workoutContent = await page.content();
  const hasLatPulldown = workoutContent.includes('Lat Pulldown');
  const hasCableRow = workoutContent.includes('Seated Cable Row');
  const hasChestPress = workoutContent.includes('Chest Press');
  const hasDbShoulder = workoutContent.includes('Dumbbell Shoulder Press');
  const hasDbLateral = workoutContent.includes('Dumbbell Lateral Raises');
  const hasTriceps = workoutContent.includes('Rope Triceps Pushdown');
  const hasDbBiceps = workoutContent.includes('Dumbbell Biceps Curls');
  const hasPerDumbbellNotice = workoutContent.includes('per dumbbell');
  console.log(`Upper A Exercises Check: Lat=${hasLatPulldown}, Row=${hasCableRow}, Chest=${hasChestPress}, DBShoulder=${hasDbShoulder}, DBLateral=${hasDbLateral}, Triceps=${hasTriceps}, DBBicep=${hasDbBiceps}, PerDumbbell=${hasPerDumbbellNotice}`);

  // 3. Test starting a workout, logging a set, checking rest timer
  console.log('3. Starting a Workout Session...');
  const startBtn = await page.$('button:has-text("Start Workout")');
  if (startBtn) {
    await startBtn.click();
    await page.waitForTimeout(1000);
  }

  // Type weight into first exercise set
  const firstWeightInput = await page.$('input[placeholder*="lbs"], input[type="number"]');
  if (firstWeightInput) {
    await firstWeightInput.fill('45');
    await page.waitForTimeout(300);
  }

  // Mark first set complete -> should trigger Rest Timer
  const checkBtns = await page.$$('button[title*="Mark completed"], button[title*="Mark incomplete"]');
  if (checkBtns.length > 0) {
    await checkBtns[0].click();
    await page.waitForTimeout(1000);
  }

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v1_2_03_active_workout_with_timer.png') });
  console.log('Saved v1_2_03_active_workout_with_timer.png');

  // 4. Test Persistence Across Page Reload
  console.log('4. Testing Persistence Across Page Reload...');
  await page.reload();
  await page.waitForTimeout(2000);

  const reloadedContent = await page.content();
  const isStillActive = reloadedContent.includes('Finish Workout');
  const hasPersistedWeight = reloadedContent.includes('45');
  console.log(`Persistence Check: ActiveSessionRestored=${isStillActive}, SetWeightPersisted=${hasPersistedWeight}`);

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v1_2_04_session_restored_after_reload.png') });
  console.log('Saved v1_2_04_session_restored_after_reload.png');

  // 5. Test Cardio & Finishing Workout
  console.log('5. Testing Cardio Inputs & Finishing Workout...');
  // Scroll to cardio section
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v1_2_05_cardio_section.png') });
  console.log('Saved v1_2_05_cardio_section.png');

  // Scroll back to top and click Finish Workout
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  const finishBtn = await page.$('button:has-text("Finish Workout")');
  if (finishBtn) {
    await finishBtn.click();
    await page.waitForTimeout(1500);
  }

  // 6. Check History Screen to verify completed workout is recorded
  console.log('6. Checking History Screen for Recorded Workout...');
  await page.goto('http://localhost:4173/history');
  await page.waitForTimeout(1500);

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v1_2_06_history_with_completed_session.png') });
  console.log('Saved v1_2_06_history_with_completed_session.png');

  // Open the session detail sheet
  const sessionCard = await page.$('div:has-text("Upper Body A")');
  if (sessionCard) {
    await sessionCard.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v1_2_07_session_detail_sheet.png') });
    console.log('Saved v1_2_07_session_detail_sheet.png');
  }

  // 7. Check Progress Screen
  console.log('7. Checking Progress Screen...');
  await page.goto('http://localhost:4173/progress');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v1_2_08_progress_screen.png') });
  console.log('Saved v1_2_08_progress_screen.png');

  await browser.close();
  console.log('--- Verification Complete! All screenshots captured. ---');
}

verify().catch((err) => {
  console.error('Verification failed with error:', err);
  process.exit(1);
});
