/**
 * search.js — Search real job listings from company career pages.
 *
 * Uses three free, public ATS APIs (no key required):
 * - Greenhouse (boards-api.greenhouse.io)
 * - Lever (api.lever.co)
 * - Ashby (api.ashbyhq.com)
 *
 * Pre-fetches data on page load for instant search results.
 */

const searchForm = document.getElementById('search-form');
const resultsContainer = document.getElementById('results');
const toggleFiltersBtn = document.getElementById('toggle-filters');
const advancedFilters = document.getElementById('advanced-filters');
const loadStatus = document.getElementById('load-status');

// Toggle advanced filters panel
toggleFiltersBtn.addEventListener('click', function() {
  const isHidden = advancedFilters.classList.toggle('hidden');
  this.setAttribute('aria-expanded', !isHidden);
  this.textContent = isHidden ? '⚙ Advanced Filters' : '⚙ Hide Filters';
});

// ============================================================
// GREENHOUSE COMPANIES (slug → display name)
// API: https://boards-api.greenhouse.io/v1/boards/{slug}/jobs
// ============================================================
const GREENHOUSE_COMPANIES = {
  'stripe': 'Stripe',
  'spotify': 'Spotify',
  'cloudflare': 'Cloudflare',
  'airbnb': 'Airbnb',
  'figma': 'Figma',
  'notion': 'Notion',
  'duolingo': 'Duolingo',
  'discord': 'Discord',
  'netlify': 'Netlify',
  'hashicorp': 'HashiCorp',
  'twitch': 'Twitch',
  'squarespace': 'Squarespace',
  'github': 'GitHub',
  'elastic': 'Elastic',
  'cockroachlabs': 'Cockroach Labs',
  'mongodb': 'MongoDB',
  'datadog': 'Datadog',
  'hubspot': 'HubSpot',
  'lyft': 'Lyft',
  'doordashusa': 'DoorDash',
  'coinbase': 'Coinbase',
  'robinhood': 'Robinhood',
  'okta': 'Okta',
  'pagerduty': 'PagerDuty',
  'confluent': 'Confluent',
  'snyk': 'Snyk',
  'gusto': 'Gusto',
  'plaid': 'Plaid',
  'nerdwallet': 'NerdWallet',
  'chime': 'Chime',
  'pinterest': 'Pinterest',
  'databricks': 'Databricks',
  'anthropic': 'Anthropic',
  'openai': 'OpenAI',
  'vercel': 'Vercel',
  'gitlab': 'GitLab',
  'andurilindustries': 'Anduril',
  'airtable': 'Airtable',
  'asana': 'Asana',
  'brex': 'Brex',
  'canva': 'Canva',
  'flexport': 'Flexport',
  'grammarly': 'Grammarly',
  'instacart': 'Instacart',
  'intercom': 'Intercom',
  'klarna': 'Klarna',
  'miro': 'Miro',
  'ramp': 'Ramp',
  'scale': 'Scale AI',
  'snap': 'Snap Inc.',
  'sourcegraph': 'Sourcegraph',
  'supabase': 'Supabase',
  'webflow': 'Webflow',
  'zapier': 'Zapier',
  'zoominfo': 'ZoomInfo',
  'affirm': 'Affirm',
  'braze': 'Braze',
  'marqeta': 'Marqeta',
  'mercury': 'Mercury',
  'rippling': 'Rippling',
  'sofi': 'SoFi',
  'wise': 'Wise',
  'etsy': 'Etsy',
  'faire': 'Faire',
  'gopuff': 'Gopuff',
  'peloton': 'Peloton',
  'stitchfix': 'Stitch Fix',
  'sweetgreen': 'Sweetgreen',
  'warbyparker': 'Warby Parker',
  'wayfair': 'Wayfair',
  'flatiron': 'Flatiron Health',
  'hims': 'Hims & Hers',
  'modernhealth': 'Modern Health',
  'noom': 'Noom',
  'oscarhealth': 'Oscar Health',
  'ro': 'Ro',
  'tempus': 'Tempus',
  'dbt': 'dbt Labs',
  'grafanalabs': 'Grafana Labs',
  'launchdarkly': 'LaunchDarkly',
  'linearapp': 'Linear',
  'planetscale': 'PlanetScale',
  'postman': 'Postman',
  'sentry': 'Sentry',
  'tailscale': 'Tailscale',
  'crowdstrike': 'CrowdStrike',
  'onepassword': '1Password',
  'sentinelone': 'SentinelOne',
  'tanium': 'Tanium',
  'reddit': 'Reddit',
  'roblox': 'Roblox',
  'vimeo': 'Vimeo',
  'amplitude': 'Amplitude',
  'calendly': 'Calendly',
  'contentful': 'Contentful',
  'docusign': 'DocuSign',
  'fivetran': 'Fivetran',
  'gong': 'Gong',
  'lattice': 'Lattice',
  'mixpanel': 'Mixpanel',
  'outreach': 'Outreach',
  'productboard': 'Productboard',
  'retool': 'Retool',
  'servicetitan': 'ServiceTitan',
  'toast': 'Toast',
  'zendesk': 'Zendesk',
  'aurora': 'Aurora',
  'cruise': 'Cruise',
  'nuro': 'Nuro',
  'relativityspace': 'Relativity Space',
  'rivian': 'Rivian',
  'waymo': 'Waymo',
  'compassinc': 'Compass',
  'opendoor': 'Opendoor',
  'redfin': 'Redfin',
  'coursera': 'Coursera',
  'khanacademy': 'Khan Academy',
  'benchling': 'Benchling',
  'carta': 'Carta',
  'coda': 'Coda',
  'descript': 'Descript',
  'loom': 'Loom',
  'palantir': 'Palantir',
  'samsara': 'Samsara',
  'snowflake': 'Snowflake',
  'uipath': 'UiPath',
  'unity': 'Unity',
  'verkada': 'Verkada',
  'wealthfront': 'Wealthfront'
};

// ============================================================
// LEVER COMPANIES (slug → display name)
// API: https://api.lever.co/v0/postings/{slug}
// ============================================================
const LEVER_COMPANIES = {
  'netflix': 'Netflix',
  'shopify': 'Shopify',
  'twilio': 'Twilio',
  'github': 'GitHub',
  'quora': 'Quora',
  'eventbrite': 'Eventbrite',
  'box': 'Box',
  'kayak': 'KAYAK',
  'upwork': 'Upwork',
  'podium': 'Podium',
  'lululemon': 'Lululemon',
  'bluebottlecoffee': 'Blue Bottle Coffee',
  'earnin': 'Earnin',
  'checkout': 'Checkout.com',
  'relativity6': 'Relativity6',
  'clearbit': 'Clearbit',
  'newrelic': 'New Relic',
  'segment': 'Segment',
  'wework': 'WeWork',
  'lever': 'Lever',
  'color': 'Color Health',
  'getaround': 'Getaround',
  'greenhouse-2': 'Greenhouse',
  'yelp': 'Yelp',
  'looker': 'Looker',
  'thumbtack': 'Thumbtack',
  'purestorage': 'Pure Storage',
  'lucidmotors': 'Lucid Motors',
  'gojek': 'Gojek',
  'scopely': 'Scopely',
  'movableink': 'Movable Ink',
  'automox': 'Automox',
  'highspot': 'Highspot',
  'celonis': 'Celonis',
  'niantic': 'Niantic',
  'applovin': 'AppLovin',
  'remitly': 'Remitly',
  'dutchie': 'Dutchie',
  'vanta': 'Vanta',
  'handshake': 'Handshake',
  'deel': 'Deel',
  'faire': 'Faire',
  'aledade': 'Aledade',
  'applied-intuition': 'Applied Intuition',
  'figment': 'Figment',
  'tailoredbrands': 'Tailored Brands',
  'costar-group': 'CoStar Group',
  'redhat': 'Red Hat',
  'verkada': 'Verkada',
  'angi': 'Angi',
  'ziprecruiter': 'ZipRecruiter',
  'toast': 'Toast',
  'trueup': 'TrueUp',
  'petal': 'Petal',
  'sonderinc': 'Sonder',
  'taxbit': 'TaxBit',
  'velocityglobal': 'Velocity Global',
  'plume': 'Plume',
  'replit': 'Replit',
  'whatnot': 'Whatnot',
  'goguardian': 'GoGuardian',
  'relativityhq': 'Relativity',
  'knowbe4': 'KnowBe4',
  'navan': 'Navan',
  'motive': 'Motive',
  'applyboard': 'ApplyBoard',
  'figma': 'Figma',
  'carvana': 'Carvana',
  'ironclad': 'Ironclad',
  'justworks': 'Justworks',
  'kavak': 'Kavak',
  'liveramp': 'LiveRamp',
  'lemonade': 'Lemonade',
  'mapbox': 'Mapbox',
  'outschool': 'Outschool',
  'paxos': 'Paxos',
  'procore': 'Procore',
  'seatgeek': 'SeatGeek',
  'trinet': 'TriNet',
  'weights-and-biases': 'Weights & Biases',
  'calm': 'Calm',
  'betterup': 'BetterUp',
  'flywire': 'Flywire',
  'tipalti': 'Tipalti',
  'benchling': 'Benchling',
  'dataminr': 'Dataminr',
  'patreon': 'Patreon',
  'ripple': 'Ripple',
  'sumo-logic': 'Sumo Logic',
  'grafana-labs': 'Grafana Labs',
  'loom': 'Loom',
  'dropbox': 'Dropbox',
  'notion': 'Notion',
  'squarespace': 'Squarespace',
  'cockroach-labs': 'Cockroach Labs',
  'segment': 'Twilio Segment',
  'sourcegraph': 'Sourcegraph',
  'lattice': 'Lattice',
  'algolia': 'Algolia',
  'amplitude': 'Amplitude',
  'dataiku': 'Dataiku',
  'elastic': 'Elastic',
  'fastly': 'Fastly',
  'harness': 'Harness',
  'heap': 'Heap',
  'iterable': 'Iterable',
  'jumpcloud': 'JumpCloud',
  'rally-health': 'Rally Health',
  'scribd': 'Scribd',
  'splice': 'Splice',
  'talkdesk': 'Talkdesk',
  'vectra': 'Vectra AI',
  'vidyard': 'Vidyard',
  'webflow': 'Webflow',
  'whoop': 'WHOOP',
  'cultureamp': 'Culture Amp',
  'gitlab': 'GitLab',
  'clearco': 'Clearco',
  'brightwheel': 'Brightwheel',
  'gorgiasio': 'Gorgias'
};

// ============================================================
// ASHBY COMPANIES (slug → display name)
// API: https://api.ashbyhq.com/posting-api/job-board/{slug}
// ============================================================
const ASHBY_COMPANIES = {
  'notion': 'Notion',
  'ramp': 'Ramp',
  'linear': 'Linear',
  'deel': 'Deel',
  'vanta': 'Vanta',
  'cursor': 'Cursor',
  'openai': 'OpenAI',
  'deliveroo': 'Deliveroo',
  'sambanova': 'SambaNova',
  'cohere': 'Cohere',
  'mistral': 'Mistral AI',
  'perplexity': 'Perplexity',
  'replicate': 'Replicate',
  'dune': 'Dune Analytics',
  'modal': 'Modal',
  'replit': 'Replit',
  'resend': 'Resend',
  'railway': 'Railway',
  'loops': 'Loops',
  'causal': 'Causal',
  'commandbar': 'CommandBar',
  'sequoia': 'Sequoia Capital',
  'opensea': 'OpenSea',
  'phantom': 'Phantom',
  'alchemy': 'Alchemy',
  'worldcoin': 'Worldcoin',
  'helicone': 'Helicone',
  'langchain': 'LangChain',
  'elevenLabs': 'ElevenLabs',
  'stability': 'Stability AI',
  'huggingface': 'Hugging Face',
  'together': 'Together AI',
  'labelbox': 'Labelbox',
  'baseten': 'Baseten',
  'runwayml': 'Runway',
  'jasper': 'Jasper AI',
  'snorkel': 'Snorkel AI',
  'anyscale': 'Anyscale',
  'deepgram': 'Deepgram',
  'assembly': 'AssemblyAI',
  'wiz': 'Wiz',
  'tailscale': 'Tailscale',
  'fly': 'Fly.io',
  'render': 'Render',
  'stytch': 'Stytch',
  'neon': 'Neon',
  'turso': 'Turso',
  'supabase': 'Supabase',
  'axiom': 'Axiom',
  'vercel': 'Vercel',
  'stripe': 'Stripe',
  'figma': 'Figma',
  'liveblocks': 'Liveblocks',
  'cal': 'Cal.com',
  'clerk': 'Clerk',
  'inngest': 'Inngest',
  'tinybird': 'Tinybird',
  'planetscale': 'PlanetScale',
  'retool': 'Retool',
  'airtable': 'Airtable',
  'brex': 'Brex',
  'mercury': 'Mercury',
  'ramp': 'Ramp',
  'plaid': 'Plaid',
  'coinbase': 'Coinbase',
  'pylon': 'Pylon',
  'midjourney': 'Midjourney',
  'runway': 'Runway',
  'character': 'Character.AI',
  'anthropic': 'Anthropic',
  'databricks': 'Databricks',
  'snowflake': 'Snowflake',
  'datadog': 'Datadog'
};

// ============================================================
// KEYWORD PATTERNS FOR FILTERS
// ============================================================
const EDUCATION_KEYWORDS = {
  'high-school': ['high school', 'ged', 'diploma'],
  'associate': ['associate', "associate's"],
  'bachelor': ['bachelor', "bachelor's", 'b.s.', 'b.a.', 'bs ', 'ba ', 'undergraduate'],
  'master': ['master', "master's", 'm.s.', 'm.a.', 'ms ', 'ma ', 'mba', 'graduate degree'],
  'phd': ['phd', 'ph.d', 'doctorate', 'doctoral']
};

const DEGREE_KEYWORDS = {
  'computer-science': ['computer science', 'cs ', 'cs,', 'software engineering', 'informatics', 'computing', 'computer engineering', 'information technology', 'information systems', 'software development', 'programming', 'software engineer', 'backend', 'frontend', 'full stack', 'fullstack', 'web developer', 'mobile developer', 'devops', 'sre', 'data engineer', 'machine learning engineer'],
  'engineering': ['engineering', 'mechanical', 'electrical', 'civil', 'chemical engineering', 'aerospace', 'industrial engineering', 'systems engineering'],
  'business': ['business', 'mba', 'management', 'administration', 'commerce', 'organizational'],
  'design': ['design', 'ux', 'ui', 'hci', 'human-computer', 'graphic design', 'visual design', 'interaction design', 'product design', 'creative'],
  'data-science': ['data science', 'statistics', 'machine learning', 'analytics', 'mathematics', 'math', 'quantitative', 'applied math', 'computational'],
  'marketing': ['marketing', 'communications', 'advertising', 'digital marketing', 'public relations', 'content strategy', 'brand'],
  'finance': ['finance', 'accounting', 'economics', 'financial', 'cpa', 'actuarial', 'quantitative finance']
};

const EXPERIENCE_KEYWORDS = {
  'entry': ['entry level', 'entry-level', 'junior', '0-2 years', '1-2 years', '0-1 years', '1 year', '2 years', 'new grad', 'early career', 'no experience required', 'associate', 'i ', ' i,', 'level 1', 'level 2', 'early in career', 'recent graduate', 'fresh graduate'],
  'mid': ['mid level', 'mid-level', '3-5 years', '2-4 years', '3+ years', '4+ years', '3 years', '4 years', '5 years'],
  'senior': ['senior', '6-10 years', '5-8 years', '5+ years', '7+ years', '8+ years', '6 years', '7 years', '8 years'],
  'lead': ['lead', 'staff', 'principal', '10+ years', '10-15 years', 'director', 'head of', 'vp ', 'vice president', 'manager']
};

const JOB_TYPE_KEYWORDS = {
  'full-time': ['full-time', 'full time', 'permanent'],
  'part-time': ['part-time', 'part time'],
  'contract': ['contract', 'contractor', 'freelance', 'temporary', 'temp'],
  'internship': ['intern', 'internship', 'co-op', 'coop']
};

// ============================================================
// API FETCH FUNCTIONS
// ============================================================

/** Fetch jobs from a single Greenhouse company board. */
async function fetchGreenhouseJobs(slug, companyName, signal) {
  const url = `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`;
  const response = await fetch(url, { signal });
  if (!response.ok) return [];
  const data = await response.json();
  return (data.jobs || []).map(job => ({
    id: `gh-${slug}-${job.id}`,
    title: job.title,
    company: companyName,
    location: job.location?.name || 'Not specified',
    type: 'Full-time',
    description: stripHtml(job.content || ''),
    url: job.absolute_url || '#',
    source: 'greenhouse'
  }));
}

/** Fetch jobs from a single Lever company board. */
async function fetchLeverJobs(slug, companyName, signal) {
  const url = `https://api.lever.co/v0/postings/${slug}`;
  const response = await fetch(url, { signal });
  if (!response.ok) return [];
  const data = await response.json();
  if (!Array.isArray(data)) return [];
  return data.map(job => ({
    id: `lv-${slug}-${job.id}`,
    title: job.text || '',
    company: companyName,
    location: job.categories?.location || 'Not specified',
    type: job.categories?.commitment || 'Full-time',
    description: job.descriptionPlain || stripHtml(job.description || ''),
    url: job.hostedUrl || job.applyUrl || '#',
    source: 'lever'
  }));
}

/** Fetch jobs from a single Ashby company board. */
async function fetchAshbyJobs(slug, companyName, signal) {
  const url = `https://api.ashbyhq.com/posting-api/job-board/${slug}`;
  const response = await fetch(url, { signal });
  if (!response.ok) return [];
  const data = await response.json();
  const jobs = data.jobs || [];
  return jobs.map(job => ({
    id: `ab-${slug}-${job.id}`,
    title: job.title || '',
    company: companyName,
    location: job.location || 'Not specified',
    type: job.employmentType || 'Full-time',
    description: stripHtml(job.descriptionHtml || ''),
    url: job.jobUrl || '#',
    source: 'ashby'
  }));
}

/**
 * Fetch jobs from all three ATS platforms in parallel batches.
 * Throws an error if no jobs can be fetched from any source.
 * Accepts an AbortSignal to cancel in-flight requests.
 */
async function fetchAllJobs(signal) {
  let allJobs = [];
  let successCount = 0;
  const BATCH_SIZE = 40;

  // Build a unified task list
  const tasks = [];
  for (const [slug, name] of Object.entries(GREENHOUSE_COMPANIES)) {
    tasks.push(() => fetchGreenhouseJobs(slug, name, signal));
  }
  for (const [slug, name] of Object.entries(LEVER_COMPANIES)) {
    tasks.push(() => fetchLeverJobs(slug, name, signal));
  }
  for (const [slug, name] of Object.entries(ASHBY_COMPANIES)) {
    tasks.push(() => fetchAshbyJobs(slug, name, signal));
  }

  // Process in batches with progress updates
  const totalBatches = Math.ceil(tasks.length / BATCH_SIZE);
  for (let i = 0; i < tasks.length; i += BATCH_SIZE) {
    // Check if aborted before starting next batch
    if (signal && signal.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    if (loadStatus) {
      const jobCount = allJobs.length > 0 ? ` — ${allJobs.length.toLocaleString()} jobs found so far` : '';
      loadStatus.textContent = `Loading companies (${batchNum}/${totalBatches})${jobCount}`;
    }

    const batch = tasks.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(batch.map(fn => fn()));

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value.length > 0) {
        allJobs = allJobs.concat(result.value);
        successCount++;
      }
    }
  }

  if (loadStatus) {
    loadStatus.textContent = successCount > 0 
      ? `✓ Ready — ${allJobs.length.toLocaleString()} jobs loaded from ${successCount} companies`
      : '';
  }

  if (successCount === 0) {
    throw new Error('API_DOWN');
  }

  return allJobs;
}

/** Strip HTML tags from a string. */
function stripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

// ============================================================
// FILTER HELPERS
// ============================================================

function textMatchesKeywords(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.some(kw => lower.includes(kw));
}

function extractSalaryNumbers(text) {
  const salaries = [];
  let match;

  const kPattern = /\$\s*([\d,]+)\s*k/gi;
  while ((match = kPattern.exec(text)) !== null) {
    const num = parseFloat(match[1].replace(/,/g, '')) * 1000;
    if (num >= 20000 && num <= 1000000) salaries.push(num);
  }

  const dollarPattern = /\$\s*([\d,]+)/g;
  while ((match = dollarPattern.exec(text)) !== null) {
    const num = parseFloat(match[1].replace(/,/g, ''));
    if (num >= 20000 && num <= 500000) salaries.push(num);
  }

  return salaries;
}

function getFilters() {
  return {
    education: document.getElementById('filter-education').value,
    degree: document.getElementById('filter-degree').value,
    payMin: document.getElementById('filter-pay-min').value ? parseInt(document.getElementById('filter-pay-min').value) : null,
    payMax: document.getElementById('filter-pay-max').value ? parseInt(document.getElementById('filter-pay-max').value) : null,
    experience: document.getElementById('filter-experience').value,
    jobType: document.getElementById('filter-type').value,
  };
}

function jobMatchesFilters(job, filters) {
  const fullText = `${job.title} ${job.description}`.toLowerCase();

  if (filters.education !== 'any') {
    const keywords = EDUCATION_KEYWORDS[filters.education];
    if (keywords && !textMatchesKeywords(fullText, keywords)) return false;
  }

  if (filters.degree !== 'any') {
    const keywords = DEGREE_KEYWORDS[filters.degree];
    if (keywords) {
      // Also check if the job title implies this field
      const titleLower = job.title.toLowerCase();
      const titleMatchesDegree = keywords.some(kw => titleLower.includes(kw));
      if (!titleMatchesDegree && !textMatchesKeywords(fullText, keywords)) return false;
    }
  }

  if (filters.payMin !== null || filters.payMax !== null) {
    const salaries = extractSalaryNumbers(job.description);
    if (salaries.length === 0) return false;
    const maxSalary = Math.max(...salaries);
    const minSalary = Math.min(...salaries);
    if (filters.payMin !== null && maxSalary < filters.payMin) return false;
    if (filters.payMax !== null && minSalary > filters.payMax) return false;
  }

  if (filters.experience !== 'any') {
    const keywords = EXPERIENCE_KEYWORDS[filters.experience];
    if (filters.experience === 'entry') {
      // For entry level: exclude jobs with senior/lead/staff in the title
      const titleLower = job.title.toLowerCase();
      const hasSeniorSignals = ['senior', 'sr.', 'sr ', 'staff', 'principal', 'lead', 'director', 'head of', 'vp ', 'manager', 'architect'].some(kw => titleLower.includes(kw));
      if (hasSeniorSignals) return false;
    } else {
      if (keywords && !textMatchesKeywords(fullText, keywords)) return false;
    }
  }

  if (filters.jobType !== 'any') {
    const keywords = JOB_TYPE_KEYWORDS[filters.jobType];
    if (keywords && !textMatchesKeywords(fullText, keywords)) return false;
  }

  return true;
}

// ============================================================
// COUNTRY & WORK AUTHORIZATION HELPERS
// ============================================================

const COUNTRY_KEYWORDS = {
  'us': ['united states', 'usa', ', us', 'u.s.', 'new york', 'san francisco', 'los angeles', 'chicago', 'seattle', 'austin', 'boston', 'denver', 'atlanta', 'miami', 'dallas', 'houston', 'phoenix', 'philadelphia', ', ca', ', ny', ', tx', ', wa', ', ma', ', co', ', il', ', ga', ', fl', ', az', ', pa'],
  'ca': ['canada', 'toronto', 'vancouver', 'montreal', 'ottawa', 'calgary', ', on', ', bc', ', qc', ', ab'],
  'uk': ['united kingdom', ', uk', 'london', 'manchester', 'edinburgh', 'bristol', 'birmingham', 'england', 'scotland', 'wales'],
  'de': ['germany', 'berlin', 'munich', 'hamburg', 'frankfurt', 'deutschland'],
  'nl': ['netherlands', 'amsterdam', 'rotterdam', 'the hague', 'utrecht', 'holland'],
  'au': ['australia', 'sydney', 'melbourne', 'brisbane', 'perth', 'adelaide'],
  'ie': ['ireland', 'dublin', 'cork', 'galway'],
  'sg': ['singapore'],
  'in': ['india', 'bangalore', 'bengaluru', 'mumbai', 'hyderabad', 'pune', 'delhi', 'chennai', 'gurgaon', 'noida']
};

// Which countries can citizens work in without sponsorship
const WORK_RIGHTS = {
  'us': ['us'],           // US citizens can work in US
  'ca': ['ca'],           // Canadian citizens can work in Canada
  'uk': ['uk', 'ie'],     // UK citizens can work in UK and Ireland (CTA)
  'eu': ['de', 'nl', 'ie'], // EU citizens can work in EU countries
  'au': ['au'],           // Australian citizens can work in Australia
  'other': []             // Other citizenship — no automatic rights
};

function matchJobCountry(job, country, isRemoteJob) {
  if (country === 'any') return true;
  // Remote jobs with no specific country mentioned are shown for any country
  if (isRemoteJob) return true;

  const locationLower = job.location.toLowerCase();
  const keywords = COUNTRY_KEYWORDS[country];
  if (!keywords) return true;

  return keywords.some(kw => locationLower.includes(kw));
}

function matchWorkAuthorization(job, citizenship, country, isRemoteJob) {
  if (citizenship === 'any') return true;

  const locationLower = job.location.toLowerCase();
  const descLower = job.description.toLowerCase();

  // Determine which country the job is in
  let jobCountry = detectJobCountry(locationLower);

  // If job country can't be determined, don't filter it out
  if (!jobCountry) return true;

  // If it's remote and the user has the target country selected, show it
  if (isRemoteJob) return true;

  // Check if user has work rights in the job's country
  const allowedCountries = WORK_RIGHTS[citizenship] || [];
  if (allowedCountries.includes(jobCountry)) return true;

  // Check if job mentions visa sponsorship
  const sponsorsVisa = descLower.includes('visa sponsorship') ||
    descLower.includes('sponsor visa') ||
    descLower.includes('sponsorship available') ||
    descLower.includes('will sponsor') ||
    descLower.includes('immigration sponsorship');

  if (sponsorsVisa) return true;

  // If the job explicitly requires specific authorization the user doesn't have, exclude
  const requiresAuth = descLower.includes('must be authorized to work') ||
    descLower.includes('work authorization required') ||
    descLower.includes('no sponsorship') ||
    descLower.includes('without sponsorship') ||
    descLower.includes('not sponsor') ||
    descLower.includes('cannot sponsor') ||
    descLower.includes('will not sponsor');

  if (requiresAuth && !allowedCountries.includes(jobCountry)) return false;

  return true;
}

function detectJobCountry(locationLower) {
  for (const [code, keywords] of Object.entries(COUNTRY_KEYWORDS)) {
    if (keywords.some(kw => locationLower.includes(kw))) {
      return code;
    }
  }
  return null;
}

function updateCitizenshipHint(citizenship, country) {
  const hint = document.getElementById('citizenship-hint');
  if (!hint) return;

  if (citizenship === 'any' || country === 'any') {
    hint.textContent = '';
    return;
  }

  const allowedCountries = WORK_RIGHTS[citizenship] || [];
  if (allowedCountries.includes(country)) {
    hint.textContent = '✓ You can work here without sponsorship';
    hint.style.color = '#16a34a';
  } else {
    hint.textContent = '⚠ You may need a visa or work permit for this country';
    hint.style.color = '#ea580c';
  }
}

// Update hint when either dropdown changes
document.getElementById('citizenship').addEventListener('change', function() {
  updateCitizenshipHint(this.value, document.getElementById('country').value);
});
document.getElementById('country').addEventListener('change', function() {
  updateCitizenshipHint(document.getElementById('citizenship').value, this.value);
});

// ============================================================
// SEARCH EVENT HANDLER
// ============================================================

let cachedJobs = null;
let lastFetchTime = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
let isFetching = false;
let currentAbortController = null;

// Pre-fetch jobs as soon as the page loads
async function prefetchJobs() {
  if (isFetching) return;
  isFetching = true;
  currentAbortController = new AbortController();
  try {
    if (loadStatus) loadStatus.textContent = 'Pre-loading job listings...';
    cachedJobs = await fetchAllJobs(currentAbortController.signal);
    lastFetchTime = Date.now();
  } catch (e) {
    if (e.name === 'AbortError') {
      console.log('Pre-fetch aborted');
    } else {
      console.error('Pre-fetch failed:', e);
    }
    if (loadStatus) loadStatus.textContent = '';
  }
  isFetching = false;
  currentAbortController = null;
}

// Start pre-fetching immediately
prefetchJobs();

searchForm.addEventListener('submit', async function(e) {
  e.preventDefault();

  // Abort any in-progress fetch
  if (currentAbortController) {
    currentAbortController.abort();
    currentAbortController = null;
    isFetching = false;
  }

  const query = document.getElementById('query').value.trim().toLowerCase();
  const city = document.getElementById('city').value.trim().toLowerCase();
  const state = document.getElementById('state').value.trim().toLowerCase();
  const country = document.getElementById('country').value;
  const workMode = document.getElementById('work-mode').value;
  const citizenship = document.getElementById('citizenship').value;
  const filters = getFilters();

  // Update citizenship hint
  updateCitizenshipHint(citizenship, country);

  resultsContainer.innerHTML = '<div class="loading">Searching</div>';

  try {
    const now = Date.now();
    if (!cachedJobs || (now - lastFetchTime) > CACHE_DURATION) {
      currentAbortController = new AbortController();
      isFetching = true;
      cachedJobs = await fetchAllJobs(currentAbortController.signal);
      lastFetchTime = now;
      isFetching = false;
      currentAbortController = null;
    }

    const filtered = cachedJobs.filter(job => {
      const matchesQuery = !query ||
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query);

      const locationLower = job.location.toLowerCase();
      const descLower = job.description.toLowerCase();

      // Remote jobs should show up regardless of city/state filters
      const isRemoteJob = locationLower.includes('remote') ||
        job.title.toLowerCase().includes('remote') ||
        descLower.includes('fully remote') ||
        descLower.includes('100% remote');

      const matchesCity = !city || isRemoteJob ||
        locationLower.includes(city) ||
        descLower.includes(city);

      const matchesState = !state || isRemoteJob ||
        locationLower.includes(state) ||
        descLower.includes(state);

      // Country filter
      const matchesCountry = matchJobCountry(job, country, isRemoteJob);

      // Work authorization based on citizenship
      const matchesCitizenship = matchWorkAuthorization(job, citizenship, country, isRemoteJob);

      let matchesWorkMode = true;
      if (workMode === 'remote') {
        matchesWorkMode = isRemoteJob;
      } else if (workMode === 'in-person') {
        matchesWorkMode = !locationLower.includes('remote') &&
          !locationLower.includes('hybrid') &&
          !descLower.includes('fully remote');
      } else if (workMode === 'hybrid') {
        matchesWorkMode = locationLower.includes('hybrid') ||
          descLower.includes('hybrid');
      }

      const matchesFilters = jobMatchesFilters(job, filters);
      return matchesQuery && matchesCity && matchesState && matchesCountry && matchesCitizenship && matchesWorkMode && matchesFilters;
    });

    const limited = filtered.slice(0, 80);
    renderResults(limited, filtered.length);
  } catch (error) {
    if (error.name === 'AbortError') {
      // Search was cancelled by a newer search — do nothing
      return;
    }
    console.error('Search error:', error);
    resultsContainer.innerHTML = `
      <div class="error-message">
        <h3>Unable to load job listings</h3>
        <p>The job search APIs are currently unavailable. Please try again in a few minutes.</p>
        <button class="btn retry-btn" onclick="searchForm.requestSubmit()">Retry Search</button>
      </div>
    `;
  }
});

// ============================================================
// RENDER RESULTS
// ============================================================

function renderResults(jobs, totalCount) {
  if (jobs.length === 0) {
    resultsContainer.innerHTML = '<p class="placeholder-text">No jobs found. Try different search terms or adjust your filters.</p>';
    return;
  }

  let html = '';
  if (totalCount > jobs.length) {
    html += `<p class="results-count">Showing ${jobs.length} of ${totalCount.toLocaleString()} results — narrow your search for more specific matches.</p>`;
  } else {
    html += `<p class="results-count">${jobs.length} job${jobs.length !== 1 ? 's' : ''} found</p>`;
  }

  html += jobs.map(job => {
    const saved = isJobSaved(job.id);
    const truncatedDesc = job.description.length > 180
      ? job.description.substring(0, 180) + '...'
      : job.description;
    const initials = job.company.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    const jobData = JSON.stringify({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      description: truncatedDesc,
      url: job.url
    }).replace(/'/g, '&#39;').replace(/"/g, '&quot;');

    return `
      <article class="job-card">
        <div class="card-avatar">${initials}</div>
        <div class="card-body">
          <h3><a href="${job.url}" target="_blank" rel="noopener">${escapeHtml(job.title)}</a></h3>
          <p class="company">${escapeHtml(job.company)}</p>
          <p class="meta">
            <span>${escapeHtml(job.location)}</span>
            <span class="tag">${escapeHtml(job.type)}</span>
            <span class="tag">${job.source}</span>
          </p>
          <p class="description">${escapeHtml(truncatedDesc)}</p>
          <div class="actions">
            <button class="btn-save ${saved ? 'saved' : ''}" data-job="${jobData}" ${saved ? 'disabled' : ''}>
              ${saved ? '✓ Saved' : '+ Save'}
            </button>
            ${job.url !== '#' ? `<a href="${job.url}" target="_blank" rel="noopener" class="btn-apply">View Posting ↗</a>` : ''}
          </div>
        </div>
      </article>
    `;
  }).join('');

  resultsContainer.innerHTML = html;

  resultsContainer.querySelectorAll('.btn-save:not(.saved)').forEach(btn => {
    btn.addEventListener('click', function() {
      const job = JSON.parse(this.getAttribute('data-job').replace(/&quot;/g, '"').replace(/&#39;/g, "'"));
      saveJob(job);
      this.textContent = '✓ Saved';
      this.classList.add('saved');
      this.disabled = true;
    });
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
