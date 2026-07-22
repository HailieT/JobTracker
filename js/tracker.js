/**
 * tracker.js — Display and manage saved jobs on the tracker page.
 */

const trackedContainer = document.getElementById('tracked-jobs');
const statusFilter = document.getElementById('status-filter');

function renderTrackedJobs() {
  const jobs = getSavedJobs();
  const filter = statusFilter.value;

  const filtered = filter === 'all' ? jobs : jobs.filter(j => j.status === filter);

  if (filtered.length === 0) {
    const message = jobs.length === 0
      ? 'No saved jobs yet. Search for jobs and save them here!'
      : 'No jobs match this filter.';
    trackedContainer.innerHTML = `<p class="placeholder-text">${message}</p>`;
    return;
  }

  trackedContainer.innerHTML = filtered.map(job => `
    <article class="job-card" data-id="${job.id}">
      <h3><a href="${job.url}" target="_blank" rel="noopener">${job.title}</a></h3>
      <p class="company">${job.company}</p>
      <p class="meta">${job.location} &middot; ${job.type}</p>
      <p class="meta">Saved on ${new Date(job.savedAt).toLocaleDateString()}</p>
      <div class="status-row">
        <span class="status-badge status-${job.status}">${job.status}</span>
        <select aria-label="Change status for ${job.title}" data-id="${job.id}">
          <option value="saved" ${job.status === 'saved' ? 'selected' : ''}>Saved</option>
          <option value="applied" ${job.status === 'applied' ? 'selected' : ''}>Applied</option>
          <option value="interview" ${job.status === 'interview' ? 'selected' : ''}>Interview</option>
          <option value="offer" ${job.status === 'offer' ? 'selected' : ''}>Offer</option>
          <option value="rejected" ${job.status === 'rejected' ? 'selected' : ''}>Rejected</option>
        </select>
        <button class="btn-remove" data-id="${job.id}">Remove</button>
      </div>
    </article>
  `).join('');

  // Status change handlers
  trackedContainer.querySelectorAll('select[data-id]').forEach(select => {
    select.addEventListener('change', function() {
      updateJobStatus(this.dataset.id, this.value);
      renderTrackedJobs();
    });
  });

  // Remove handlers
  trackedContainer.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', function() {
      removeJob(this.dataset.id);
      renderTrackedJobs();
    });
  });
}

statusFilter.addEventListener('change', renderTrackedJobs);

// Initial render
renderTrackedJobs();
