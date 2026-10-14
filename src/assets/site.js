const panels = [...document.querySelectorAll("[data-content-panel]")];
const panelLinks = [...document.querySelectorAll("[data-panel-link]")];
const nav = document.querySelector("#sidebar-nav");
const navToggle = document.querySelector(".nav-toggle");
document.documentElement.classList.add("js-enabled");

function updateScrollFade(panel) {
  if (!panel?.hasAttribute("data-fade")) return;
  const viewport = panel.querySelector(".viewport");
  if (!viewport) return;
  const hasScrolled = viewport.scrollTop > 0;
  const hasMoreBelow = viewport.scrollTop + viewport.clientHeight < viewport.scrollHeight - 1;
  panel.classList.toggle("has-scroll-offset", hasScrolled);
  panel.classList.toggle("has-content-below", hasMoreBelow);
}

document.querySelectorAll(".content-panel[data-fade] .viewport").forEach((viewport) => {
  const panel = viewport.closest(".content-panel");
  viewport.addEventListener("scroll", () => updateScrollFade(panel), { passive: true });
  updateScrollFade(panel);
});

const collapseAnimations = new WeakMap();
document.querySelectorAll(".collapse").forEach((collapse) => {
  const button = collapse.querySelector(".collapse-toggle");
  const body = collapse.querySelector(".collapse-body");
  button?.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    const willExpand = !expanded;
    const currentHeight = body.hidden ? 0 : body.getBoundingClientRect().height;
    collapseAnimations.get(body)?.cancel();
    button.setAttribute("aria-expanded", String(willExpand));
    body.hidden = false;
    body.setAttribute("aria-hidden", String(!willExpand));
    body.style.height = `${currentHeight}px`;
    body.style.overflow = "hidden";

    const targetHeight = willExpand ? body.scrollHeight : 0;
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 400;
    const animation = body.animate(
      [{ height: `${currentHeight}px` }, { height: `${targetHeight}px` }],
      { duration, easing: "ease-in-out" }
    );
    collapseAnimations.set(body, animation);
    animation.onfinish = () => {
      if (collapseAnimations.get(body) !== animation) return;
      body.style.height = `${targetHeight}px`;
      body.hidden = !willExpand;
      body.style.removeProperty("height");
      body.style.removeProperty("overflow");
      collapseAnimations.delete(body);
      updateScrollFade(collapse.closest(".content-panel"));
    };
  });
});

function showPanel(id) {
  const activePanel = panels.find((panel) => panel.id === id) ?? panels[0];
  if (!activePanel) return;

  panels.forEach((panel) => {
    panel.hidden = panel !== activePanel;
  });
  panelLinks.forEach((link) => {
    if (link.hash === `#${activePanel.id}`) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  activePanel.scrollTop = 0;
  const viewport = activePanel.querySelector(".viewport");
  if (viewport) viewport.scrollTop = 0;
  requestAnimationFrame(() => updateScrollFade(activePanel));
}

function showPanelFromLocation() {
  showPanel(decodeURIComponent(window.location.hash.slice(1)) || panels[0]?.id);
}

panelLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (window.location.hash !== link.hash) history.pushState(null, "", link.hash);
    showPanel(link.hash.slice(1));
    nav?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll("[data-panel-item]").forEach((item) => {
  item.addEventListener("click", (event) => {
    if (event.target.closest("a")) return;
    item.querySelector("[data-panel-link]")?.click();
  });
});

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open") ?? false;
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

window.addEventListener("popstate", showPanelFromLocation);
window.addEventListener("hashchange", showPanelFromLocation);
showPanelFromLocation();
