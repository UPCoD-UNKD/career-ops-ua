import { chromium } from 'playwright';

export async function scrapeFlexiple(keywords) {
  console.log(`\n💎 Flexiple Scraper — ${keywords}`);
  const jobs = [];
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const searchUrl = `https://flexiple.com/remote-jobs?query=${encodeURIComponent(keywords)}`;
    console.log(`  🌐 Navigating to: ${searchUrl}`);
    
    await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait for job cards (using common Flexiple selectors)
    await page.waitForSelector('a[href^="/remote-jobs/"]', { timeout: 10000 }).catch(() => null);

    const results = await page.evaluate(() => {
      // Flexiple often uses a list of <a> tags for job cards
      const cards = Array.from(document.querySelectorAll('a[href^="/remote-jobs/"]'));
      return cards.map(card => {
        // Try to find title and company inside the card
        const title = card.querySelector('h2, h3, .job-title')?.innerText.trim();
        const company = card.querySelector('.company-name, .company')?.innerText.trim() || 'Flexiple Partner';
        const url = card.href;
        
        if (title && url) {
          return { title, company, url };
        }
        return null;
      }).filter(Boolean);
    });

    console.log(`  ✓ Found ${results.length} jobs`);
    results.forEach(j => jobs.push({ ...j, source: 'Flexiple' }));

  } catch (err) {
    console.error(`  ✗ Flexiple Error: ${err.message}`);
  } finally {
    await browser.close();
  }
  return jobs;
}
