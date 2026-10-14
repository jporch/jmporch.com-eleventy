const panels = [...document.querySelectorAll("[data-content-panel]")];
const panelLinks = [...document.querySelectorAll("[data-panel-link]")];
const nav = document.querySelector("#sidebar-nav");
const navToggle = document.querySelector(".nav-toggle");
document.documentElement.classList.add("js-enabled");

let collapseIndex = 0;
panels.forEach((panel) => {
  const headings = [...panel.querySelectorAll(".viewport > h2.minor-heading")];
  headings.forEach((heading) => {
    const bodyNodes = [];
    let sibling = heading.nextElementSibling;
    while (sibling && sibling.tagName !== "H2") {
      bodyNodes.push(sibling);
      sibling = sibling.nextElementSibling;
    }

    const collapse = document.createElement("div");
    collapse.className = "collapse";
    const body = document.createElement("div");
    body.className = "collapse-body";
    body.id = `collapse-body-${++collapseIndex}`;
    const button = document.createElement("button");
    button.className = "collapse-toggle";
    button.type = "button";
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-controls", body.id);
    const icon = document.createElement("span");
    icon.className = "collapse-icon";
    icon.setAttribute("aria-hidden", "true");

    heading.classList.add("collapse-heading");
    heading.before(collapse);
    collapse.append(heading, body);
    button.append(icon, ...heading.childNodes);
    heading.append(button);
    body.append(...bodyNodes);

    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      body.hidden = expanded;
    });
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

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open") ?? false;
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

window.addEventListener("popstate", showPanelFromLocation);
window.addEventListener("hashchange", showPanelFromLocation);
showPanelFromLocation();
