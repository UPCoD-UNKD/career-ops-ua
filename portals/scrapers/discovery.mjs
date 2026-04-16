import { chromium } from 'playwright';

/**
 * Universal Discovery Engine
 * Executes 'site:domain' queries to find new jobs without direct APIs.
 */
export async function discoverJobs(query, portalName = 'General') {
  console.log(`\n🔍 Discovery Engine — Searching: ${query}`);
  const jobs = [];
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  try {
    // Navigate to Google/Bing for the query
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    console.log(`  🌐 Searching: ${searchUrl}`);
    
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Extract result links (H3 tags in Google)
    const results = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('div.g'));
      return items.map(div => {
        const titleEl = div.querySelector('h3');
        const linkEl = div.querySelector('a');
        
        if (titleEl && linkEl) {
          const title = titleEl.innerText || '';
          const url = linkEl.href;
          // Extract company name if possible (heuristic: "Job Title at Company Name")
          let company = 'Unknown';
          if (title.includes(' at ')) company = title.split(' at ')[1].split('|')[0].trim();
          else if (title.includes(' - ')) company = title.split(' - ')[0].trim();
          
          return { title, company, url };
        }
        return null;
      }).filter(Boolean);
    });

    console.log(`  ✓ Found ${results.length} discovery links for ${portalName}`);
    results.forEach(j => jobs.push({ ...j, source: `Discovery - ${portalName}` }));

  } catch (err) {
    console.error(`  ✗ Discovery Error (${portalName}): ${err.message}`);
  } finally {
    await browser.close();
  }
  return jobs;
}
