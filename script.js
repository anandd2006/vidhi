function attachCardHoverFX() {
  const cards = document.querySelectorAll(".project-card");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--x", `${x}%`);
      card.style.setProperty("--y", `${y}%`);
    });
  });
}

function setupPreloader() {
  const preloader = document.querySelector(".preloader");
  if (!preloader) return;
  window.setTimeout(() => {
    preloader.classList.add("is-hidden");
    document.body.classList.add("preloaded");
  }, 850);
}

function splitHeroText() {
  const element = document.querySelector(".split-text");
  if (!element) return;
  const text = element.textContent.trim();
  const words = text.split(" ");
  element.innerHTML = words
    .map((word, index) => `<span style="transition-delay:${index * 40}ms">${word}</span>`)
    .join(" ");
  requestAnimationFrame(() => element.classList.add("is-split-visible"));
}

function setupSmoothScroll() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let target = window.scrollY;
  let current = window.scrollY;
  let ticking = false;

  function animate() {
    current += (target - current) * 0.08;
    if (Math.abs(target - current) < 0.2) current = target;
    window.scrollTo(0, current);
    if (Math.abs(target - current) > 0.2) {
      requestAnimationFrame(animate);
    } else {
      ticking = false;
    }
  }

  window.addEventListener(
    "wheel",
    (event) => {
      target += event.deltaY;
      target = Math.max(0, Math.min(target, document.body.scrollHeight - window.innerHeight));
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(animate);
      }
      event.preventDefault();
    },
    { passive: false }
  );
}

function setupCursor() {
  const cursor = document.querySelector(".cursor");
  if (!cursor || window.matchMedia("(pointer: coarse)").matches) return;
  document.body.classList.add("cursor-ready");

  window.addEventListener("mousemove", (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });

  const interactive = document.querySelectorAll("a, button, .project-card, .magnetic");
  interactive.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.style.width = "34px";
      cursor.style.height = "34px";
    });
    el.addEventListener("mouseleave", () => {
      cursor.style.width = "18px";
      cursor.style.height = "18px";
    });
  });
}

function setupMagnetic() {
  const elements = document.querySelectorAll(".magnetic");
  elements.forEach((el) => {
    el.addEventListener("mousemove", (event) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
}

function setupRevealOnScroll() {
  const nodes = document.querySelectorAll(".reveal");
  if (!nodes.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  nodes.forEach((node) => observer.observe(node));
}

function renderWorkGrid() {
  const container = document.getElementById("project-grid");
  if (!container || !Array.isArray(window.PROJECTS)) return;

  container.innerHTML = window.PROJECTS.map((project, index) => {
    const isLarge = index % 3 === 0 ? "large" : "";
    return `
      <a class="project-card ${isLarge} nav-link" href="project.html?slug=${project.slug}">
        <img src="${project.cover}" alt="${project.title}" />
        <div class="project-overlay">
          <p>${project.category}</p>
          <h3>${project.title}</h3>
        </div>
      </a>
    `;
  }).join("");
}

function renderProjectDetails() {
  const container = document.getElementById("project-content");
  if (!container || !Array.isArray(window.PROJECTS)) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const project = window.PROJECTS.find((item) => item.slug === slug) || window.PROJECTS[0];

  document.title = `${project.title} - AYUSH`;
  container.innerHTML = `
    <section class="hero compact">
      <p class="eyebrow">${project.category} / ${project.year}</p>
      <h1>${project.title}</h1>
      <p class="lead">${project.summary}</p>
    </section>
    <section class="case-hero-image">
      <img src="${project.cover}" alt="${project.title}" />
    </section>
    <section class="case-meta">
      <article>
        <h3>Client</h3>
        <p>${project.client}</p>
      </article>
      <article>
        <h3>Services</h3>
        <p>${project.services.join(", ")}</p>
      </article>
      <article>
        <h3>Impact</h3>
        <p>${project.impact.join(" / ")}</p>
      </article>
    </section>
    <section class="case-story reveal">
      <article>
        <p class="eyebrow">Challenge</p>
        <p>${project.challenge || project.summary}</p>
      </article>
      <article>
        <p class="eyebrow">Process</p>
        <p>${project.process || project.summary}</p>
      </article>
      <article>
        <p class="eyebrow">Outcome</p>
        <p>${project.outcome || project.summary}</p>
      </article>
    </section>
    <section class="contact">
      <p class="eyebrow">Next Project</p>
      <h2>Need this level of design execution for your brand?</h2>
      <a class="btn btn-primary nav-link" href="contact.html">Start a Conversation</a>
    </section>
  `;
}

function setupPageTransitions() {
  const overlay = document.querySelector(".page-transition");
  if (!overlay) return;

  requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });

  document.querySelectorAll("a.nav-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("mailto:") || href.startsWith("http")) return;
      event.preventDefault();
      document.body.classList.remove("is-ready");
      window.setTimeout(() => {
        window.location.href = href;
      }, 220);
    });
  });
}

renderWorkGrid();
renderProjectDetails();
attachCardHoverFX();
setupPageTransitions();
setupCursor();
setupMagnetic();
setupRevealOnScroll();
setupPreloader();
splitHeroText();
setupSmoothScroll();
