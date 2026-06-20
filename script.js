const body = document.body;
const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const revealItems = document.querySelectorAll(".reveal");
const sections = [...document.querySelectorAll("main section[id]")];
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");
const dashboardTime = document.querySelector("[data-dashboard-time]");
const counters = document.querySelectorAll("[data-count]");

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle.addEventListener("click", () => {
  const isOpen = body.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`;
  revealObserver.observe(item);
});

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-42% 0px -48% 0px" }
);

sections.forEach((section) => activeObserver.observe(section));

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;
      const target = Number(counter.dataset.count);
      const duration = 1200;
      const startedAt = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        counter.textContent = Math.floor(progress * target);

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          counter.textContent = target;
        }
      };

      requestAnimationFrame(tick);
      countObserver.unobserve(counter);
    });
  },
  { threshold: 0.55 }
);

counters.forEach((counter) => countObserver.observe(counter));

const updateDashboardTime = () => {
  if (!dashboardTime) return;

  const now = new Date();
  dashboardTime.textContent = `Updated ${now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  })}`;
};

updateDashboardTime();
setInterval(updateDashboardTime, 30000);

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "Thanks. Your message is ready to send from your connected form service.";
  contactForm.reset();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }
});
