const PROFILE_URL = "./data/profile.json";
const GITHUB_USER = "Abhishek1061";
const GITHUB_PROFILE_URL = `https://api.github.com/users/${GITHUB_USER}`;
const GITHUB_REPOS_URL = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`;
const EXCLUDED_REPOS = new Set([
  "free-for-dev",
  "git-demo",
  "git-tutorial",
  "localrepo",
  "test",
  "gitProject",
  "first-contributions",
  "markdown-here",
  "typed.js",
  "javascript-course",
  "Angular_Notes",
  "AngularJson",
  "Java_Practice",
  "HomePage_MiniProject",
  "AddToCart_Mini_Project",
  "Temperature_Converter_Angular_Project",
  "excursion",
  "personalnest-website",
  "My_Portfolio",
  "Portfolio"
]);

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
  hackerrankLink: document.querySelector("#hackerrank-link"),
  contactMailLink: document.querySelector("#contact-mail-link"),
  contactLinkedinLink: document.querySelector("#contact-linkedin-link"),
  avatar: document.querySelector("#profile-avatar"),
  footerName: document.querySelector("#footer-name"),
  footerYear: document.querySelector("#footer-year"),
  themeToggle: document.querySelector("#theme-toggle"),
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

function applyTheme(isDark) {
  document.body.classList.toggle("theme-dark", isDark);
  document.documentElement.style.backgroundColor = isDark ? "#0b0f14" : "";
  document.body.style.background = isDark
    ? "linear-gradient(180deg, #0b0f14 0%, #111821 100%)"
    : "";
  document.body.style.color = isDark ? "#f2f7ff" : "";
  document.body.style.setProperty("--bg", isDark ? "#0b0f14" : "#f6f9fc");
  document.body.style.setProperty("--surface", isDark ? "#121821" : "#ffffff");
  document.body.style.setProperty("--surface-soft", isDark ? "#171f2a" : "#f1f6fb");
  document.body.style.setProperty("--text-strong", isDark ? "#f2f7ff" : "#10233f");
  document.body.style.setProperty("--text", isDark ? "#dfe9f5" : "#29405f");
  document.body.style.setProperty("--muted", isDark ? "#a7b4c4" : "#6e7f99");
  document.body.style.setProperty("--primary", isDark ? "#7ecbff" : "#0b8fd9");
  document.body.style.setProperty("--accent", isDark ? "#ffb46d" : "#f97316");
  document.body.style.setProperty("--line", isDark ? "rgba(255,255,255,0.08)" : "#d8e4f0");
}

function setupThemeToggle() {
  const savedTheme = localStorage.getItem("portfolio-theme");
  const shouldUseDark = savedTheme === "dark";
  applyTheme(shouldUseDark);

  if (el.themeToggle) {
    updateThemeButtonLabel();
    el.themeToggle.addEventListener("click", () => {
      const isDark = !document.body.classList.contains("theme-dark");
      applyTheme(isDark);
      localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
      updateThemeButtonLabel();
    });
  }
}

function updateThemeButtonLabel() {
  if (!el.themeToggle) return;

  const isDark = document.body.classList.contains("theme-dark");
  const icon = el.themeToggle.querySelector(".theme-toggle-icon");
  const text = el.themeToggle.querySelector(".theme-toggle-text");

  if (icon) icon.textContent = isDark ? "☀️" : "🌙";
  if (text) text.textContent = isDark ? "Light" : "Dark";
}

async function init() {
  setFooterYear();
  setupThemeToggle();
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

    state.repos = githubRepos.filter(
      (repo) => !repo.fork && !EXCLUDED_REPOS.has(repo.name)
    );
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
  el.hackerrankLink.href = profile.social.hackerrank;

  const gmailSubject = encodeURIComponent(`Opportunity for ${profile.name}`);
  const gmailTo = encodeURIComponent(profile.email);
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${gmailTo}&su=${gmailSubject}`;

  el.contactMailLink.href = gmailUrl;
  el.contactMailLink.target = "_blank";
  el.contactMailLink.rel = "noopener noreferrer";
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
      const projectType = project.name.includes("Analytics")
        ? "Data & Streaming"
        : project.name.includes("Bank")
          ? "FinTech"
          : project.name.includes("Event")
            ? "Business Workflow"
            : "Full-Stack";

      return `
        <article class="project-card panel premium-card">
          <div class="project-head">
            <span class="project-type">${escapeHtml(projectType)}</span>
            <a class="project-link" href="${project.repo}" target="_blank" rel="noreferrer">Repo</a>
          </div>
          <h3>${escapeHtml(project.name)}</h3>
          <p class="project-description">${escapeHtml(project.description)}</p>
          <div class="chip-list">${tags}</div>
          <div class="project-meta">
            <span>${escapeHtml(project.period)}</span>
            <span class="impact-pill">Impact-driven</span>
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

  if (filtered.length === 0) {
    el.liveProjects.innerHTML = "";
    el.repoStatus.textContent = "No repositories match this language filter.";
    return;
  }

  el.liveProjects.innerHTML = filtered
    .map((repo) => {
      const description = repo.description || "Repository available on GitHub.";
      const language = repo.language || "Mixed";
      const updated = formatDate(repo.updated_at);
      const repoType = ["Java", "Spring Boot", "Kotlin", "Python"].includes(language)
        ? "Backend / API"
        : language === "JavaScript" || language === "HTML"
          ? "Frontend / UI"
          : "Learning / Practice";

      return `
        <article class="project-card panel premium-card">
          <div class="project-head">
            <span class="project-type">${escapeHtml(repoType)}</span>
            <a class="project-link" href="${repo.html_url}" target="_blank" rel="noreferrer">Open</a>
          </div>
          <h3>${escapeHtml(repo.name.replaceAll("-", " "))}</h3>
          <p class="project-description">${escapeHtml(description)}</p>
          <div class="project-meta">
            <span>${escapeHtml(language)} | Updated ${escapeHtml(updated)}</span>
            <span class="impact-pill">GitHub</span>
          </div>
        </article>
      `;
    })
    .join("");

  el.repoStatus.textContent = `Showing ${filtered.length} repositories from GitHub profile: ${GITHUB_USER}.`;
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

  document.querySelectorAll(".reveal").forEach((node, index) => {
    node.style.transitionDelay = `${index * 70}ms`;
    observer.observe(node);
  });

  const navLinks = document.querySelectorAll(".site-nav a");
  const sectionTargets = document.querySelectorAll("main section[id]");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((navLink) => navLink.classList.remove("active"));
      link.classList.add("active");
    });
  });

  const activeNavObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      const id = visible.target.getAttribute("id");
      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("active", isActive);
      });
    },
    {
      threshold: [0.25, 0.45, 0.7],
      rootMargin: "-20% 0px -45% 0px"
    }
  );

  sectionTargets.forEach((section) => activeNavObserver.observe(section));
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
