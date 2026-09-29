const pageBody = document.body;
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");
const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
const screenTabs = Array.from(document.querySelectorAll(".bw-screen-tab"));
const screenImage = document.querySelector("#bw-screen-image");
const screenTitle = document.querySelector("#bw-screen-title");
const screenCaption = document.querySelector("#bw-screen-caption");
const screenButton = document.querySelector("#bw-screen-button");
const expandButton = document.querySelector("#bw-expand-screen");
const lightbox = document.querySelector("#bw-lightbox");
const lightboxImage = document.querySelector("#bw-lightbox-image");
const lightboxCaption = document.querySelector("#bw-lightbox-caption");
const purchaseDialog = document.querySelector("#bw-purchase-dialog");
const purchaseTrigger = document.querySelector("[data-purchase]");
const closeDialogButtons = Array.from(document.querySelectorAll("[data-close-dialog]"));
const rollButton = document.querySelector("#bw-roll-button");
const rollName = document.querySelector("#bw-roll-name");
const timerToggle = document.querySelector("#bw-timer-toggle");
const timerReset = document.querySelector("#bw-timer-reset");
const timerDisplay = document.querySelector("#bw-timer");
const pollButtons = Array.from(document.querySelectorAll("#bw-poll-options button[data-poll]"));
const year = document.querySelector("#current-year");

const studentNames = ["张一鸣", "李思远", "王一诺", "陈嘉禾", "刘星辰", "赵子涵", "孙可欣", "周雨桐", "吴俊熙", "徐若溪", "郑亦辰", "林小满", "何书言", "高梓豪", "唐语汐"];

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

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

function setUpReveal() {
  if (revealItems.length === 0) return;
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }
  pageBody.classList.add("bw-reveal-ready");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
  revealItems.forEach((item) => observer.observe(item));
}

function activateScreen(tab, shouldFocus = false) {
  const index = screenTabs.indexOf(tab);
  if (index < 0 || !screenImage) return;

  screenTabs.forEach((item, itemIndex) => {
    const isActive = item === tab;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-selected", String(isActive));
    item.tabIndex = isActive ? 0 : -1;
    if (isActive && itemIndex === index && shouldFocus) item.focus();
  });

  screenImage.classList.remove("is-switching");
  screenImage.src = tab.dataset.screen;
  screenImage.alt = tab.dataset.screenAlt || "";
  if (screenTitle) screenTitle.textContent = tab.dataset.screenTitle || "";
  if (screenCaption) screenCaption.textContent = tab.dataset.screenCaption || "";

  window.requestAnimationFrame(() => screenImage.classList.add("is-switching"));
}

function openLightbox(source, alt, caption) {
  if (!lightbox || !lightboxImage) return;
  lightboxImage.src = source;
  lightboxImage.alt = alt || "";
  if (lightboxCaption) lightboxCaption.textContent = caption || "";
  if (typeof lightbox.showModal === "function") {
    if (!lightbox.open) lightbox.showModal();
    return;
  }
  lightbox.setAttribute("open", "");
}

function openPurchaseDialog() {
  if (!purchaseDialog) return;
  if (typeof purchaseDialog.showModal === "function") {
    if (!purchaseDialog.open) purchaseDialog.showModal();
    return;
  }
  purchaseDialog.setAttribute("open", "");
}

function closeDialog(dialog) {
  if (!dialog) return;
  if (typeof dialog.close === "function") {
    dialog.close();
    return;
  }
  dialog.removeAttribute("open");
}

function setUpScreenTabs() {
  if (screenTabs.length === 0) return;
  screenTabs.forEach((tab, index) => {
    tab.tabIndex = index === 0 ? 0 : -1;
    tab.addEventListener("click", () => activateScreen(tab));
    tab.addEventListener("keydown", (event) => {
      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % screenTabs.length;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + screenTabs.length) % screenTabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = screenTabs.length - 1;
      if (nextIndex === index) return;
      event.preventDefault();
      activateScreen(screenTabs[nextIndex], true);
    });
  });
}

function setUpLightbox() {
  document.querySelectorAll(".bw-screen-button[data-lightbox]").forEach((button) => {
    button.addEventListener("click", () => {
      const image = button.querySelector("img");
      openLightbox(button.dataset.lightbox, image?.alt, button.dataset.caption);
    });
  });

  const currentScreenSource = () => screenImage?.src || "";
  screenButton?.addEventListener("click", () => openLightbox(currentScreenSource(), screenImage?.alt, screenCaption?.textContent));
  expandButton?.addEventListener("click", () => openLightbox(currentScreenSource(), screenImage?.alt, screenCaption?.textContent));

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeDialog(lightbox);
  });
  lightbox?.querySelector("[data-close-lightbox]")?.addEventListener("click", () => closeDialog(lightbox));
}

function setUpPurchaseDialog() {
  purchaseTrigger?.addEventListener("click", openPurchaseDialog);
  closeDialogButtons.forEach((button) => button.addEventListener("click", () => closeDialog(purchaseDialog)));
  purchaseDialog?.addEventListener("click", (event) => {
    if (event.target === purchaseDialog) closeDialog(purchaseDialog);
  });
}

function setUpClassroomDemo() {
  let rollTicker = null;
  rollButton?.addEventListener("click", () => {
    if (!rollName || rollTicker) return;
    let ticks = 0;
    rollButton.disabled = true;
    rollTicker = window.setInterval(() => {
      const name = studentNames[Math.floor(Math.random() * studentNames.length)];
      rollName.textContent = name;
      ticks += 1;
      if (ticks < 14) return;
      window.clearInterval(rollTicker);
      rollTicker = null;
      rollButton.disabled = false;
    }, 70);
  });

  let seconds = 0;
  let timerId = null;
  const renderTimer = () => {
    if (!timerDisplay) return;
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const rest = String(seconds % 60).padStart(2, "0");
    timerDisplay.textContent = `${minutes}:${rest}`;
  };
  const setTimerLabel = (label) => {
    const labelNode = timerToggle?.querySelector("span");
    if (labelNode) labelNode.textContent = label;
  };

  timerToggle?.addEventListener("click", () => {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
      setTimerLabel("继续计时");
      return;
    }
    timerId = window.setInterval(() => {
      seconds += 1;
      renderTimer();
    }, 1000);
    setTimerLabel("暂停计时");
  });

  timerReset?.addEventListener("click", () => {
    if (timerId) window.clearInterval(timerId);
    timerId = null;
    seconds = 0;
    renderTimer();
    setTimerLabel("开始计时");
  });

  const pollCounts = pollButtons.map(() => 0);
  const renderPoll = () => {
    const total = pollCounts.reduce((sum, count) => sum + count, 0) || 1;
    pollButtons.forEach((button, index) => {
      const bar = button.querySelector("i");
      const count = button.querySelector("b");
      if (count) count.textContent = String(pollCounts[index]);
      if (bar) bar.style.width = `${(pollCounts[index] / total) * 100}%`;
    });
  };
  pollButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      pollCounts[index] += 1;
      renderPoll();
    });
  });

  renderTimer();
  renderPoll();
}

menuToggle?.addEventListener("click", toggleMenu);
mobileNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 920) closeMenu();
});

if (year) year.textContent = String(new Date().getFullYear());

setUpReveal();
setUpScreenTabs();
setUpLightbox();
setUpPurchaseDialog();
setUpClassroomDemo();
updateHeader();
