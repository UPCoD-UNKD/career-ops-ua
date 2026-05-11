import { chromium } from 'playwright';

/**
 * SuccessFactors (SAP) Scraper
 * Handles company-specific successfactors.com portals.
 */
export async function scrapeSuccessFactors(companyName, portalToken, keywords) {
  console.log(`\n🏢 SuccessFactors Scraper — ${companyName} for ${keywords}`);
  const jobs = [];
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // SuccessFactors often uses a query-based URL for listings
    const searchUrl = `https://career.successfactors.com/portalcareer?company=${portalToken}&keyword=${encodeURIComponent(keywords)}`;
    console.log(`  🌐 Navigating to: ${searchUrl}`);
    
    await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait for job list elements
    await page.waitForSelector('.jobTitle, .jobListing', { timeout: 10000 }).catch(() => null);

    const results = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.jobTitle, .jobListing'));
      return cards.map(card => {
        const titleEl = card.querySelector('a') || card;
        const companyEl = document.querySelector('.companyName'); // often global on page or in card
        
        if (titleEl && titleEl.href) {
          return {
            title: titleEl.innerText.trim(),
            company: companyEl?.innerText.trim() || 'SuccessFactors Partner',
            url: titleEl.href
          };
        }
        return null;
      }).filter(Boolean);
    });

    console.log(`  ✓ Found ${results.length} jobs.`);
    results.forEach(j => jobs.push({ ...j, company: companyName, source: `SuccessFactors - ${companyName}` }));

  } catch (err) {
    console.error(`  ✗ SuccessFactors Error (${companyName}): ${err.message}`);
  } finally {
    await browser.close();
  }
  return jobs;
}
