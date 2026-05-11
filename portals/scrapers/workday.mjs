import { chromium } from 'playwright';

/**
 * Workday Scraper
 * Handles company-specific .myworkdayjobs.com portals.
 * Uses API-first approach (wday/cxs) when possible.
 */
export async function scrapeWorkday(companyName, subdomain, keywords) {
  console.log(`\n🏢 Workday Scraper — ${companyName} for ${keywords}`);
  const jobs = [];
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Standard Workday Search URL
    const baseUrl = `https://${subdomain}.myworkdayjobs.com/${companyName}_External`;
    console.log(`  🌐 Probing Workday API for: ${baseUrl}`);

    // Workday often exposes a CXS API for search
    const apiUrl = `https://${subdomain}.myworkdayjobs.com/wday/cxs/${subdomain}/${companyName}_External/jobs`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appliedFacets: {},
        limit: 20,
        offset: 0,
        searchText: keywords
      })
    });

    if (response.ok) {
      const data = await response.json();
      const jobList = data.jobPostings || [];
      console.log(`  ✓ API Success! Found ${jobList.length} jobs.`);
      
      jobList.forEach(job => {
        jobs.push({
          title: job.title,
          company: companyName,
          url: `https://${subdomain}.myworkdayjobs.com/${companyName}_External${job.externalPath}`,
          source: `Workday - ${companyName}`
        });
      });
    } else {
      console.warn(`  ⚠ API fallback — using Playwright for ${companyName}`);
      await page.goto(baseUrl, { waitUntil: 'networkidle' });
      // ... potential fallback CSS scraping if API fails, but CXS is very standard now
    }

  } catch (err) {
    console.error(`  ✗ Workday Error (${companyName}): ${err.message}`);
  } finally {
    await browser.close();
  }
  return jobs;
}
