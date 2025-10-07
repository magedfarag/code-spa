/* app.js — StoreZ (Buyer SPA)
   Orchestrates: boot, routing, prefs (lang/theme/rtl), sponsor KPIs,
   and global helpers (sheet, badges). Routes render views.
   Imports are small/strict to keep coupling low.
*/
import { setLang, getLang, t, tn, dirForLang, locale, fmtCurrency as currency, fmtDate } from "./i18n.js";
import { state, loadState, saveState, resetState, actions, productById } from "./data.js";
import { routes } from "./routes.js";

/* ------------- tiny DOM helpers ------------- */
const qs = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));

/* ------------- Theme handling ------------- */
const themeSelect = qs("#themeSelect");
const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)");
function osTheme() { return prefersDark?.matches ? "dark" : "light"; }
function applyTheme(theme, persist = true) {
  const applied = theme === "auto" ? osTheme() : theme;
  document.documentElement.dataset.theme = applied;
  if (themeSelect) themeSelect.value = theme;
  if (persist) { state.prefs.theme = theme; saveState(state); }
  // meta theme-color for nice mobile chrome
  const m = qs("#metaThemeColor");
  if (m) {
    const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim() || "#0b0c10";
    m.setAttribute("content", bg);
  }
}

/* ------------- Language & direction ------------- */
const langSelect = qs("#langSelect");
function applyLang(lang, persist = true, rerender = true) {
  setLang(lang);
  document.documentElement.lang = locale();
  const rtl = dirForLang(lang) === "rtl";
  document.documentElement.dir = rtl ? "rtl" : "ltr";
  if (langSelect) langSelect.value = lang;
  // static labels
  qsa("[data-i18n]").forEach(el => { const key = el.dataset.i18n; if (key) el.textContent = t(key); });
  qs("#chipDemo")?.replaceChildren(document.createTextNode(t("demo") || "Demo"));
  if (persist) { state.prefs.lang = lang; saveState(state); }
  if (rerender) route();
}
function toggleDir() {
  const now = document.documentElement.getAttribute("dir") === "rtl";
  const next = !now;
  document.documentElement.dir = next ? "rtl" : "ltr";
  state.prefs.rtlOverride = next;
  saveState(state);
}

/* ------------- KPIs & badges ------------- */
function refreshBadges() {
  const cartCount = state.cart.items.reduce((s, i) => s + i.qty, 0);
  const wishCount = state.wishlist.length;
  const cartBadge = qs("#cartBadge");
  const wishBadge = qs("#wishlistBadge");
  if (cartBadge) cartBadge.textContent = String(cartCount);
  if (wishBadge) wishBadge.textContent = String(wishCount);
}
function updateKPI() {
  const m = state.metrics;
  const impr = Math.max(m.impressions, 1);
  const ctr = (m.addToCart / impr) * 100;
  const cvr = (m.purchases / Math.max(m.productViews, 1)) * 100;
  qs("#k_impr") && (qs("#k_impr").textContent = String(m.impressions));
  qs("#k_ctr") && (qs("#k_ctr").textContent = `${ctr.toFixed(1)}%`);
  qs("#k_cvr") && (qs("#k_cvr").textContent = `${cvr.toFixed(1)}%`);
  qs("#k_aov") && (qs("#k_aov").textContent = currency(m.purchases ? (m.revenue / m.purchases) : 0));
  const kpi = qs("#kpi");
  if (kpi) kpi.hidden = !state.prefs.sponsor;
}

/* ------------- Bottom sheet (global) ------------- */
const sheetEl = qs("#sheet");
function showSheet(messageKey = "sheet_msg") {
  if (!sheetEl) return;
  qs("#sheetTitle")?.replaceChildren(document.createTextNode(t("sheet_title")));
  qs("#sheetMsg")?.replaceChildren(document.createTextNode(t(messageKey)));
  sheetEl.classList.add("show");
  sheetEl.setAttribute("aria-hidden", "false");
  // auto-close after 2.2s
  window.clearTimeout(showSheet._tid);
  showSheet._tid = window.setTimeout(hideSheet, 2200);
}
function hideSheet() {
  if (!sheetEl) return;
  sheetEl.classList.remove("show");
  sheetEl.setAttribute("aria-hidden", "true");
}
// expose for HTML buttons
window.__hideSheet = hideSheet;

/* ------------- Routing ------------- */
function parseHash() {
  // "#/pdp/p1" -> { path: "/pdp", id: "p1" }
  const h = location.hash.slice(1) || "/home";
  const parts = h.split("/").filter(Boolean);
  if (parts.length === 1) return { path: "/" + parts[0], id: undefined };
  return { path: "/" + parts[0], id: parts[1] };
}
function highlightTab(path) {
  qsa("nav.bottom a").forEach(a => {
    a.classList.toggle("active", a.getAttribute("href") === `#${path}`);
  });
}
export function navigate(hash) { location.hash = hash; }
function route() {
  const { path, id } = parseHash();
  // simple auth gate for demo
  if (!state.user.authed && path !== "/landing" && path !== "/auth") {
    return navigate("#/landing");
  }
  const handler = routes[path] || routes["/home"];
  highlightTab(path);
  const ctx = {
    el: qs("#view"),
    state,
    actions,
    t, tn, currency, fmtDate,
    navigate,
    showSheet,
    refresh: () => { saveState(state); refreshBadges(); updateKPI(); },
  };
  handler(ctx, id);
  qs("#view")?.focus();
}
window.addEventListener("hashchange", route);

/* ------------- Header controls ------------- */
function wireHeader() {
  const btnWishlist = qs("#btnWishlist");
  const btnSponsor = qs("#btnSponsor");
  const btnReset = qs("#btnReset");
  const btnRtl = qs("#btnRtl");

  langSelect?.addEventListener("change", e => applyLang(e.target.value, true, true));
  themeSelect?.addEventListener("change", e => applyTheme(e.target.value, true));
  btnRtl?.addEventListener("click", () => toggleDir());

  btnSponsor?.addEventListener("click", () => {
    state.prefs.sponsor = !state.prefs.sponsor;
    saveState(state);
    updateKPI();
    btnSponsor.setAttribute("aria-pressed", String(state.prefs.sponsor));
  });

  btnReset?.addEventListener("click", () => {
    resetState();
    location.reload();
  });

  btnWishlist?.addEventListener("click", () => navigate("#/wishlist"));
}

/* ------------- Boot ------------- */
function boot() {
  // load + default prefs
  loadState(state);
  // language & dir
  const initialLang = state.prefs.lang || getLang() || "en";
  applyLang(initialLang, false, false);
  if (state.prefs.rtlOverride != null) {
    document.documentElement.dir = state.prefs.rtlOverride ? "rtl" : "ltr";
  }
  // theme
  const prefTheme = state.prefs.theme || "auto";
  applyTheme(prefTheme, false);
  prefersDark?.addEventListener("change", () => { if ((state.prefs.theme || "auto") === "auto") applyTheme("auto", false); });

  // UI bindings
  wireHeader();
  refreshBadges();
  updateKPI();

  // global click helpers for delegated actions (cards, etc.)
  document.body.addEventListener("click", (ev) => {
    const el = ev.target.closest("[data-action]");
    if (!el) return;
    const action = el.getAttribute("data-action");
    const pid = el.getAttribute("data-id");
    if (action === "add-to-cart" && pid) {
      actions.addToCart(pid);
      saveState(state);
      refreshBadges();
      showSheet();
    }
    if (action === "buy-now" && pid) {
      actions.addToCart(pid);
      saveState(state);
      refreshBadges();
      navigate("#/checkout");
    }
    if (action === "toggle-wish" && pid) {
      actions.toggleWishlist(pid);
      saveState(state);
      refreshBadges();
    }
  });

  // initial route
  route();
}

document.addEventListener("DOMContentLoaded", boot);

/* ------------- Dev handle for quick inspection ------------- */
window.StoreZ = {
  state, actions, navigate, t, tn, currency, fmtDate, productById
};
