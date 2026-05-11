import { chromium } from 'playwright';
import fs from 'fs';

const url = process.argv[2];
if (!url) {
  console.error("Usage: node tailor-job.mjs <url>");
  process.exit(1);
}

async function extractJD(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log(`🔍 Scraping Job Description from: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForLoadState('load').catch(() => {});
    
    // Switch to iframe if it's Greenhouse
    let context = page;
    const iframe = await page.$('iframe#grnhse_iframe');
    if (iframe) {
      context = await iframe.contentFrame();
      console.log("✓ Switched to iframe context.");
    }
    
    // Attempt to find JD text
    const selectors = [
      '#content', '.job-description', '#posting-description', 
      '.description', '#app_body', '[data-qa="job-description"]',
      'section[class*="job"]'
    ];
    
    // Wait for at least one selector to appear
    await Promise.race(selectors.map(s => context.waitForSelector(s, { timeout: 5000 }).catch(() => null)));
    
    let jdText = '';
    for (const s of selectors) {
      const el = await context.$(s);
      if (el) {
        jdText = await el.innerText();
        if (jdText.length > 200) break; 
      }
    }
    
    if (!jdText || jdText.length < 200) {
      // Fallback: get all text from body
      jdText = await context.innerText('body');
    }

    return jdText.trim();
  } catch (e) {
    console.error(`✗ Failed to scrape JD: ${e.message}`);
    return null;
  } finally {
    await browser.close();
  }
}

async function run() {
  const jd = await extractJD(url);
  if (!jd) process.exit(1);

  console.log('\n═══════════════════════════════════════════');
  console.log('  📄 JOB DESCRIPTION EXTRACTED');
  console.log('═══════════════════════════════════════════');
  
  // Show a snippet
  console.log(jd.substring(0, 1000) + (jd.length > 1000 ? '...' : ''));
  
  console.log('\n═══════════════════════════════════════════');
  console.log('  🛠️  TAILORING PROMPT FOR AI');
  console.log('═══════════════════════════════════════════');
  console.log(`"Antigravity, please tailor my resume for this specific role.`);
  console.log(`URL: ${url}`);
  console.log(`REQUIREMENTS SUMMARY:`);
  
  // Simple heuristic for "requirements" block
  const lines = jd.split('\n');
  const reqLines = lines.filter(l => 
    l.toLowerCase().includes('requirement') || 
    l.toLowerCase().includes('qualification') || 
    l.toLowerCase().includes('skills') ||
    l.toLowerCase().includes('what you')
  ).slice(0, 10);
  
  reqLines.forEach(l => console.log(`  - ${l.trim().substring(0, 100)}`));
  
  console.log(`\nFit my profile to these exact keywords and technical stack."`);
  console.log('═══════════════════════════════════════════');
}

run();
