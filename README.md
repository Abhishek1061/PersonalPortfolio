# Abhishek Portfolio Website

A modern, responsive portfolio website tailored to Abhishek Bhaskar Kadam's Java full stack profile.

## Tech Stack (suited to your profile)

- `HTML5` for semantic structure
- `CSS3` for modern custom UI and responsive layout
- `JavaScript (ES Modules)` for dynamic rendering and GitHub API integration
- `GitHub REST API` for live repository updates
- `GitHub Pages` for free hosting

## Project Structure

```text
.
|-- index.html
|-- styles.css
|-- script.js
|-- data/
|   `-- profile.json
|-- assets/
`-- README.md
```

## Run Locally

Because the site fetches JSON (`data/profile.json`), run it with a local server instead of opening `index.html` directly.

### Option 1: Python

```bash
python -m http.server 5500
```

Then open: `http://localhost:5500`

### Option 2: VS Code Live Server

Use "Open with Live Server" from `index.html`.

## Customize Content

Update the following file:

- `data/profile.json`

You can update:

- bio and summary
- skills
- projects
- certifications
- education
- contact links

## Free Publishing (GitHub Pages)

1. Create a new GitHub repository (for example: `portfolio`).
2. Copy these files into that repository.
3. Push code:

```bash
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/Abhishek1061/portfolio.git
git push -u origin main
```

4. Open GitHub repository `Settings -> Pages`.
5. Under `Build and deployment`:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
6. Save and wait 1-3 minutes.
7. Your site URL will appear there, usually:
   - `https://abhishek1061.github.io/portfolio/`

## Optional: Personal Domain (free + paid domain)

If you buy a domain later:

1. Add a `CNAME` file in repo root with your domain.
2. Configure DNS records in your domain provider.
3. Enable HTTPS in GitHub Pages settings.

## Notes

- GitHub API calls are unauthenticated by default and may hit rate limits under heavy traffic.
- If rate-limited, featured projects from `profile.json` still render.
