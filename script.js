const PROFILE_URL = "./data/profile.json";
const GITHUB_USER = "Abhishek1061";
const GITHUB_PROFILE_URL = `https://api.github.com/users/${GITHUB_USER}`;
const GITHUB_REPOS_URL = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`;

const state = {
  profile: null,
  repos: [],
  activeLanguage: "All"
};

const el = {
  brandName: document.querySelector("#brand-name"),
  name: document.querySelector("#name"),
  headline: document.querySelector("#headline"),
  tagline: document.querySelector("#tagline"),
  location: document.querySelector("#location"),
  emailLink: document.querySelector("#email-link"),
  phoneNumber: document.querySelector("#phone-number"),
  summary: document.querySelector("#summary-text"),
  resumeLink: document.querySelector("#resume-link"),
  githubLink: document.querySelector("#github-link"),
  linkedinLink: document.querySelector("#linkedin-link"),
  leetcodeLink: document.querySelector("#leetcode-link"),
  contactMailLink: document.querySelector("#contact-mail-link"),
  contactLinkedinLink: document.querySelector("#contact-linkedin-link"),
  avatar: document.querySelector("#profile-avatar"),
  footerName: document.querySelector("#footer-name"),
  footerYear: document.querySelector("#footer-year"),
  metricsGrid: document.querySelector("#metrics-grid"),
  achievementList: document.querySelector("#achievement-list"),
  timeline: document.querySelector("#experience-timeline"),
  skillsGrid: document.querySelector("#skills-grid"),
  featuredProjects: document.querySelector("#featured-projects"),
  liveProjects: document.querySelector("#live-projects"),
  repoFilters: document.querySelector("#repo-filters"),
  repoStatus: document.querySelector("#repo-status"),
  certificationList: document.querySelector("#certification-list"),
  educationList: document.querySelector("#education-list")
};

document.addEventListener("DOMContentLoaded", init);

async function init() {
  setFooterYear();
  setupRevealObserver();

  try {
    const profile = await fetchJson(PROFILE_URL);
    state.profile = profile;
    renderProfile(profile);
    renderBaseMetrics(profile);
    renderAchievements(profile.achievements);
    renderExperience(profile.experience);
    renderSkills(profile.skills);
    renderFeaturedProjects(profile.projects);
    renderCertifications(profile.certifications);
    renderEducation(profile.education);
  } catch (error) {
    console.error("Profile data error:", error);
    el.repoStatus.textContent =
      "Could not load local profile data. Please check data/profile.json.";
    return;
  }

  await loadGithubData();
}

async function loadGithubData() {
  try {
    const [githubProfile, githubRepos] = await Promise.all([
      fetchJson(GITHUB_PROFILE_URL),
      fetchJson(GITHUB_REPOS_URL)
    ]);

    state.repos = githubRepos.filter((repo) => !repo.fork);
    applyGithubProfile(githubProfile);
    renderGithubMetrics(githubProfile);
    renderRepoFilters(state.repos);
    renderLiveProjects();
  } catch (error) {
    console.error("GitHub fetch error:", error);
    el.repoStatus.textContent =
      "Live GitHub data is currently unavailable. Featured projects are still shown above.";
  }
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json"
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${url}`);
  }

  return response.json();
}

function renderProfile(profile) {
  document.title = `${profile.name} | Java Full Stack Developer`;
  el.brandName.textContent = profile.name.split(" ")[0];
  el.name.textContent = profile.name;
  el.headline.textContent = profile.headline;
  el.tagline.textContent = profile.tagline;
  el.location.textContent = profile.location;
  el.phoneNumber.textContent = profile.phone;
  el.summary.textContent = profile.summary;
  el.footerName.textContent = profile.name;

  el.emailLink.textContent = profile.email;
  el.emailLink.href = `mailto:${profile.email}`;
  el.resumeLink.href = profile.resumeFile;
  el.resumeLink.setAttribute("download", "");

  el.githubLink.href = profile.social.github;
  el.linkedinLink.href = profile.social.linkedin;
  el.leetcodeLink.href = profile.social.leetcode;

  el.contactMailLink.href = `mailto:${profile.email}?subject=Opportunity%20for%20${encodeURIComponent(profile.name)}`;
  el.contactLinkedinLink.href = profile.social.linkedin;
}

function renderBaseMetrics(profile) {
  const firstRole = profile.experience[0];
  const years = yearsSince(firstRole.startDate);
  const certCount = profile.certifications.length;

  const cards = [
    { value: `${years}+`, label: "Years Experience" },
    { value: "25+", label: "Java Classes Refactored" },
    { value: "2400+", label: "Legacy Lines Removed" },
    { value: `${certCount}`, label: "Certifications" }
  ];

  el.metricsGrid.innerHTML = cards
    .map(
      (card) => `
        <article class="metric-card panel">
          <span class="metric-value">${card.value}</span>
          <span class="metric-label">${card.label}</span>
        </article>
      `
    )
    .join("");
}

function renderGithubMetrics(githubProfile) {
  const repoCard = makeMetricCard(`${githubProfile.public_repos}`, "Public Repositories");
  const followerCard = makeMetricCard(`${githubProfile.followers}`, "GitHub Followers");

  el.metricsGrid.insertAdjacentHTML("beforeend", repoCard + followerCard);
}

function makeMetricCard(value, label) {
  return `
    <article class="metric-card panel">
      <span class="metric-value">${value}</span>
      <span class="metric-label">${label}</span>
    </article>
  `;
}

function applyGithubProfile(githubProfile) {
  if (githubProfile.avatar_url) {
    el.avatar.src = githubProfile.avatar_url;
  }
}

function renderAchievements(achievements) {
  el.achievementList.innerHTML = achievements
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
}

function renderExperience(experienceList) {
  el.timeline.innerHTML = experienceList
    .map((job) => {
      const bullets = job.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
      const dateLabel = `${formatDate(job.startDate)} - ${job.endDate}`;
      return `
        <article class="timeline-item panel">
          <div class="timeline-head">
            <p class="timeline-role">${escapeHtml(job.title)} | ${escapeHtml(job.company)}</p>
            <span class="timeline-meta">${escapeHtml(dateLabel)}</span>
          </div>
          <p class="timeline-meta">${escapeHtml(job.domain)}</p>
          <ul class="list">${bullets}</ul>
        </article>
      `;
    })
    .join("");
}

function renderSkills(skills) {
  const entries = Object.entries(skills);
  el.skillsGrid.innerHTML = entries
    .map(([category, values]) => {
      const chips = values.map((skill) => `<span class="chip">${escapeHtml(skill)}</span>`).join("");
      return `
        <article class="skill-card panel">
          <h3>${escapeHtml(category)}</h3>
          <div class="chip-list">${chips}</div>
        </article>
      `;
    })
    .join("");
}

function renderFeaturedProjects(projects) {
  el.featuredProjects.innerHTML = projects
    .map((project) => {
      const tags = project.tech.map((item) => `<span class="chip">${escapeHtml(item)}</span>`).join("");
      return `
        <article class="project-card panel">
          <h3>${escapeHtml(project.name)}</h3>
          <p>${escapeHtml(project.description)}</p>
          <div class="chip-list">${tags}</div>
          <div class="project-meta">
            <span>${escapeHtml(project.period)}</span>
            <a class="project-link" href="${project.repo}" target="_blank" rel="noreferrer">Repository</a>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderRepoFilters(repos) {
  const languageSet = new Set(["All"]);

  repos.forEach((repo) => {
    if (repo.language) {
      languageSet.add(repo.language);
    }
  });

  const ordered = [...languageSet].sort((a, b) => {
    if (a === "All") return -1;
    if (b === "All") return 1;
    return a.localeCompare(b);
  });

  el.repoFilters.innerHTML = ordered
    .map(
      (lang) => `
        <button
          type="button"
          class="chip filter-chip ${lang === state.activeLanguage ? "active" : ""}"
          data-language="${escapeHtml(lang)}"
        >
          ${escapeHtml(lang)}
        </button>
      `
    )
    .join("");

  el.repoFilters.querySelectorAll(".filter-chip").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeLanguage = button.dataset.language ?? "All";
      renderRepoFilters(state.repos);
      renderLiveProjects();
    });
  });
}

function renderLiveProjects() {
  const sorted = [...state.repos].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

  const filtered = sorted.filter((repo) => {
    if (state.activeLanguage === "All") {
      return true;
    }
    return repo.language === state.activeLanguage;
  });

  const top = filtered.slice(0, 9);

  if (top.length === 0) {
    el.liveProjects.innerHTML = "";
    el.repoStatus.textContent = "No repositories match this language filter.";
    return;
  }

  el.liveProjects.innerHTML = top
    .map((repo) => {
      const description = repo.description || "Repository available on GitHub.";
      const language = repo.language || "Mixed";
      const updated = formatDate(repo.updated_at);
      return `
        <article class="project-card panel">
          <h3>${escapeHtml(repo.name.replaceAll("-", " "))}</h3>
          <p>${escapeHtml(description)}</p>
          <div class="project-meta">
            <span>${escapeHtml(language)} | Updated ${escapeHtml(updated)}</span>
            <a class="project-link" href="${repo.html_url}" target="_blank" rel="noreferrer">Open</a>
          </div>
        </article>
      `;
    })
    .join("");

  el.repoStatus.textContent = `Showing ${top.length} repositories from GitHub profile: ${GITHUB_USER}.`;
}

function renderCertifications(certifications) {
  el.certificationList.innerHTML = certifications
    .map((cert) => `<li><strong>${escapeHtml(cert.title)}</strong> - ${escapeHtml(cert.issuer)} (${escapeHtml(cert.date)})</li>`)
    .join("");
}

function renderEducation(educationList) {
  el.educationList.innerHTML = educationList
    .map(
      (item) =>
        `<li><strong>${escapeHtml(item.school)}</strong><br>${escapeHtml(item.degree)}<br>${escapeHtml(item.score)}<br>${escapeHtml(item.period)}</li>`
    )
    .join("");
}

function setupRevealObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));
}

function setFooterYear() {
  el.footerYear.textContent = String(new Date().getFullYear());
}

function yearsSince(startDate) {
  const start = new Date(startDate);
  const now = new Date();
  const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  return Math.max(1, Math.ceil(months / 12));
}

function formatDate(rawDate) {
  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) {
    return rawDate;
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short"
  }).format(date);
}

function escapeHtml(input) {
  const safeText = String(input ?? "");

  return safeText
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
