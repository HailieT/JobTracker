/**
 * storage.js — Manage saved jobs in localStorage.
 */

const STORAGE_KEY = 'jobtracker_saved_jobs';

function getSavedJobs() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveJob(job) {
  const jobs = getSavedJobs();
  // Avoid duplicates based on id
  if (jobs.find(j => j.id === job.id)) return false;
  job.status = job.status || 'saved';
  job.savedAt = new Date().toISOString();
  jobs.push(job);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  return true;
}

function removeJob(jobId) {
  let jobs = getSavedJobs();
  jobs = jobs.filter(j => j.id !== jobId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

function updateJobStatus(jobId, status) {
  const jobs = getSavedJobs();
  const job = jobs.find(j => j.id === jobId);
  if (job) {
    job.status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  }
}

function isJobSaved(jobId) {
  return getSavedJobs().some(j => j.id === jobId);
}
