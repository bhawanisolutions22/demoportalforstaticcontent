/* layout.js — shared loader for header/footer and small behaviors */
async function loadLayout(id, file) {
  try {
    const resp = await fetch(file, {cache: "no-store"});
    if (!resp.ok) throw new Error(resp.statusText);
    document.getElementById(id).innerHTML = await resp.text();
    if (id === "header") initHeaderBehavior();
  } catch (e) {
    console.error("loadLayout:", file, e);
  }
}

function initHeaderBehavior() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  // Set active nav link
  const links = header.querySelectorAll(".main-nav a");
  const current = location.pathname.split("/").pop() || "index.html";
  links.forEach(a => {
    const href = a.getAttribute("href");
    if (href === current || (href === "index.html" && current === "")) {
      a.classList.add("active");
    }
  });

  // Mobile nav toggle
  const toggle = header.querySelector(".nav-toggle");
  toggle && toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    document.documentElement.classList.toggle("nav-open");
  });

  // Close mobile nav on link click
  header.querySelectorAll(".main-nav a").forEach(a => a.addEventListener("click", () => {
    document.documentElement.classList.remove("nav-open");
    toggle && toggle.setAttribute("aria-expanded", "false");
  }));
}

// Load header/footer
loadLayout("header", "header.html");
loadLayout("footer", "footer.html");