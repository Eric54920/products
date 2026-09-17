const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");
const tabs = Array.from(document.querySelectorAll(".screen-tab"));
const tabList = document.querySelector(".screen-tabs");
const screenImage = document.querySelector("#screen-image");
const screenTitle = document.querySelector("#screen-title");
const heroDownload = document.querySelector(".js-hero-download");
const year = document.querySelector("#current-year");

const releaseDownloads = {
  mac: {
    label: "下载 macOS 版",
    url: "https://github.com/Eric54920/Beatify/releases/download/v0.1.8/Beatify_0.1.8_aarch64.dmg",
  },
  windows: {
    label: "下载 Windows 版",
    url: "https://github.com/Eric54920/Beatify/releases/download/v0.1.8/Beatify_0.1.8_x64-setup.exe",
  },
  linux: {
    label: "下载 Linux 版",
    url: "https://github.com/Eric54920/Beatify/releases/download/v0.1.8/Beatify_0.1.8_amd64.AppImage",
  },
};

function detectPlatform() {
  const platform = navigator.userAgentData?.platform || navigator.platform || navigator.userAgent;
  if (/win/i.test(platform)) return "windows";
  if (/linux/i.test(platform) && !/android/i.test(platform)) return "linux";
  return "mac";
}

function setUpHeroDownload() {
  if (!heroDownload) return;
  const release = releaseDownloads[detectPlatform()];
  heroDownload.href = release.url;
  heroDownload.querySelector("span").textContent = release.label;
}

function closeMenu() {
  if (!menuToggle || !mobileNav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "打开导航");
  mobileNav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

function toggleMenu() {
  if (!menuToggle || !mobileNav) return;
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "打开导航" : "关闭导航");
  mobileNav.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
}

function activateTab(tab, shouldFocus = false) {
  const index = tabs.indexOf(tab);
  if (index < 0 || !screenImage || !screenTitle || !tabList) return;

  tabs.forEach((item, itemIndex) => {
    const isActive = item === tab;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-selected", String(isActive));
    item.tabIndex = isActive ? 0 : -1;
    if (isActive && itemIndex === index && shouldFocus) item.focus();
  });

  tabList.style.setProperty("--tab-index", index);
  screenImage.classList.remove("is-switching");
  screenImage.src = tab.dataset.image;
  screenImage.alt = tab.dataset.alt;
  screenTitle.textContent = tab.dataset.title;

  window.requestAnimationFrame(() => {
    screenImage.classList.add("is-switching");
  });

  tab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
}

menuToggle?.addEventListener("click", toggleMenu);
mobileNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

tabs.forEach((tab, index) => {
  tab.tabIndex = index === 0 ? 0 : -1;
  tab.addEventListener("click", () => activateTab(tab));
  tab.addEventListener("keydown", (event) => {
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex === index) return;
    event.preventDefault();
    activateTab(tabs[nextIndex], true);
  });
});

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 920) closeMenu();
});

if (year) year.textContent = String(new Date().getFullYear());

setUpHeroDownload();
updateHeader();
