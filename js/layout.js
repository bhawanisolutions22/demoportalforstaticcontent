/* layout.js — shared loader for header/footer and small behaviors */
function resolveLayoutUrl(file) {
  // Try to find the layout.js script tag so we can resolve files relative to the script location.
  const script = document.querySelector('script[src$="layout.js"]');
  if (script && script.src) {
    try {
      // layout.js is usually inside /js/ so resolve one level up to reach site root:
      return new URL('../' + file, script.src).href;
    } catch (e) {
      // if URL resolution fails, fall through to root-relative
    }
  }
  // Fallback: use root-relative path (works when header/footer are in site root)
  return new URL('/' + file, location.origin).href;
}

async function loadLayout(id, file) {
  const url = resolveLayoutUrl(file);
  try {
    const resp = await fetch(url, { cache: "no-store" });
    if (!resp.ok) throw new Error(resp.statusText);
    document.getElementById(id).innerHTML = await resp.text();
    if (id === "header") initHeaderBehavior();
  } catch (e) {
    console.error("loadLayout:", file, "resolved->", url, e);
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
loadLayout("sidebar", "sidebar.html");
