/**
 * search.js — Handle job searching and display results.
 *
 * Uses sample data for demo purposes so the site works on GitHub Pages
 * without needing an API key. You can swap in a real API later.
 */

const searchForm = document.getElementById('search-form');
const resultsContainer = document.getElementById('results');

// Sample job data for demonstration
const SAMPLE_JOBS = [
  {
    id: 'demo-1',
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'Remote',
    type: 'Full-time',
    description: 'We are looking for a skilled frontend developer with experience in React, TypeScript, and modern CSS. You will build user-facing features for our SaaS platform and collaborate closely with designers and backend engineers.',
    url: '#'
  },
  {
    id: 'demo-2',
    title: 'Backend Engineer',
    company: 'DataFlow Inc.',
    location: 'New York, NY',
    type: 'Full-time',
    description: 'Join our backend team to build scalable APIs and microservices using Node.js and Python. Experience with PostgreSQL, Redis, and cloud infrastructure (AWS/GCP) is a plus.',
    url: '#'
  },
  {
    id: 'demo-3',
    title: 'UX Designer',
    company: 'CreativeHub',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description: 'Design intuitive user experiences for our mobile and web applications. You will conduct user research, create wireframes and prototypes, and work with engineers to ship polished interfaces.',
    url: '#'
  },
  {
    id: 'demo-4',
    title: 'DevOps Engineer',
    company: 'CloudScale',
    location: 'Remote',
    type: 'Contract',
    description: 'Help us build and maintain CI/CD pipelines, container orchestration with Kubernetes, and infrastructure as code using Terraform. Strong Linux and networking fundamentals required.',
    url: '#'
  },
  {
    id: 'demo-5',
    title: 'Data Analyst',
    company: 'InsightMetrics',
    location: 'Austin, TX',
    type: 'Full-time',
    description: 'Analyze large datasets to uncover business insights. Proficiency in SQL, Python, and visualization tools like Tableau or Power BI expected. Experience with statistical modeling is a bonus.',
    url: '#'
  },
  {
    id: 'demo-6',
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    location: 'Remote',
    type: 'Full-time',
    description: 'Work across the entire stack building features from database to UI. Our tech stack includes Next.js, Node.js, PostgreSQL, and Tailwind CSS. Early-stage startup with lots of ownership.',
    url: '#'
  },
  {
    id: 'demo-7',
    title: 'Product Manager',
    company: 'BigTech Co.',
    location: 'Seattle, WA',
    type: 'Full-time',
    description: 'Own the product roadmap for our developer tools division. You will gather requirements, prioritize features, and coordinate across engineering, design, and marketing teams.',
    url: '#'
  },
  {
    id: 'demo-8',
    title: 'Mobile Developer',
    company: 'AppWorks',
    location: 'Chicago, IL',
    type: 'Full-time',
    description: 'Build cross-platform mobile applications using React Native. Experience with native iOS or Android development is a strong plus. You will own the entire mobile experience.',
    url: '#'
  }
];

searchForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const query = document.getElementById('query').value.trim().toLowerCase();
  const location = document.getElementById('location').value.trim().toLowerCase();

  resultsContainer.innerHTML = '<div class="loading">Searching</div>';

  // Simulate network delay
  setTimeout(() => {
    const filtered = SAMPLE_JOBS.filter(job => {
      const matchesQuery = !query ||
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query);

      const matchesLocation = !location ||
        job.location.toLowerCase().includes(location);

      return matchesQuery && matchesLocation;
    });

    renderResults(filtered);
  }, 500);
});

function renderResults(jobs) {
  if (jobs.length === 0) {
    resultsContainer.innerHTML = '<p class="placeholder-text">No jobs found. Try different search terms.</p>';
    return;
  }

  resultsContainer.innerHTML = jobs.map(job => {
    const saved = isJobSaved(job.id);
    return `
      <article class="job-card">
        <h3><a href="${job.url}" target="_blank" rel="noopener">${job.title}</a></h3>
        <p class="company">${job.company}</p>
        <p class="meta">${job.location} &middot; ${job.type}</p>
        <p class="description">${job.description}</p>
        <div class="actions">
          <button class="btn-save ${saved ? 'saved' : ''}" data-job='${JSON.stringify(job)}' ${saved ? 'disabled' : ''}>
            ${saved ? '✓ Saved' : 'Save Job'}
          </button>
        </div>
      </article>
    `;
  }).join('');

  // Attach save handlers
  resultsContainer.querySelectorAll('.btn-save:not(.saved)').forEach(btn => {
    btn.addEventListener('click', function() {
      const job = JSON.parse(this.getAttribute('data-job'));
      saveJob(job);
      this.textContent = '✓ Saved';
      this.classList.add('saved');
      this.disabled = true;
    });
  });
}
