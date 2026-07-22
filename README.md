# JobTracker

A simple, static website that helps people search for jobs and track their applications — all from the browser. No server or database required.

## Features

- **Job Search** — Search sample listings by title, company, or location
- **Save Jobs** — Save interesting jobs to your personal tracker (stored in your browser)
- **Track Status** — Mark jobs as Saved, Applied, Interview, Offer, or Rejected
- **Responsive** — Works great on desktop and mobile
- **No Backend** — Runs entirely in the browser using localStorage

## Live Demo

Once deployed to GitHub Pages, your site will be available at:

```
https://<your-username>.github.io/JobTracker/
```

## Deploy to GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Under "Source", select **Deploy from a branch**
4. Choose the `main` branch and `/ (root)` folder
5. Click Save — your site will be live in a few minutes

## Project Structure

```
JobTracker/
├── index.html        # Search page
├── tracker.html      # Saved jobs / tracker page
├── css/
│   └── style.css     # All styles
├── js/
│   ├── storage.js    # localStorage helper functions
│   ├── search.js     # Search logic and results rendering
│   └── tracker.js    # Tracker page logic
└── README.md
```

## Customization

The site uses sample job data for demonstration. To connect a real job API:

1. Sign up for a job search API (e.g., JSearch on RapidAPI, Adzuna, or The Muse)
2. Update `js/search.js` to fetch from the API instead of filtering sample data
3. If using an API key, consider using a serverless function to keep it secret

## License

MIT
