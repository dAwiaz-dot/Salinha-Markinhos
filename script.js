const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuButton = document.querySelector("[data-menu-button]");
const navLinks = [...document.querySelectorAll(".nav-links a")];
const floatingCta = document.querySelector(".floating-cta");
const images = [...document.querySelectorAll("img")];

images.forEach((image) => {
  image.setAttribute("draggable", "false");
  image.addEventListener("dragstart", (event) => event.preventDefault());
});

let lastTouchEnd = 0;

document.addEventListener(
  "touchend",
  (event) => {
    const target = event.target;
    const isEditable =
      target instanceof HTMLElement &&
      Boolean(target.closest("input, textarea, select, [contenteditable='true'], .text-column, .teacher-text, .faq-list p"));
    const now = Date.now();

    if (!isEditable && now - lastTouchEnd < 320) {
      event.preventDefault();
    }

    lastTouchEnd = now;
  },
  { passive: false },
);

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 16);
  floatingCta?.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.38);
};

const closeMenu = () => {
  nav?.classList.remove("is-open");
  header?.classList.remove("menu-open");
  menuButton?.classList.remove("is-open");
  menuButton?.setAttribute("aria-expanded", "false");
};

menuButton?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  header?.classList.toggle("menu-open", Boolean(isOpen));
  menuButton.classList.toggle("is-open", Boolean(isOpen));
  menuButton.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("scroll", setHeaderState, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 860) closeMenu();
});

setHeaderState();

const sections = navLinks
  .map((link) => link.getAttribute("href"))
  .filter((href) => href?.startsWith("#"))
  .map((href) => document.querySelector(href))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    },
    {
      rootMargin: "-35% 0px -50% 0px",
      threshold: [0.1, 0.35, 0.6],
    },
  );

  sections.forEach((section) => observer.observe(section));
}
