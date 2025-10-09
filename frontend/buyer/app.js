/* app.js — StoreZ (Buyer SPA)
   Orchestrates: boot, routing, prefs (lang/theme/rtl), sponsor KPIs,
   and global helpers (sheet, badges). Routes render views.
   Imports are small/strict to keep coupling low.
*/
import { setLang, getLang, t, tn, dirForLang, locale, fmtCurrency as currency, fmtDate } from "./i18n.js?v=20251010-imageFix";
import { state, loadState, saveState, resetState, actions, productById, getProductTitle, getProductImage } from "./data.js?v=20251010-imageFix";
import { routes } from "./routes.js?v=20251010-imageFix";
import { aiEngine } from "./ai.js?v=20251010-imageFix";

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
  const cartCount = (state.cart || []).reduce((s, i) => s + i.quantity, 0);
  const wishCount = (state.wishlist?.items || []).length;
  const cartBadge = qs("#cartBadge");
  const wishBadge = qs("#wishlistBadge");
  if (cartBadge) cartBadge.textContent = String(cartCount);
  if (wishBadge) wishBadge.textContent = String(wishCount);
}
// Expose to global for route handlers
window.refreshBadges = refreshBadges;
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
  
  // If messageKey contains HTML tags, treat it as custom content
  if (typeof messageKey === 'string' && messageKey.includes('<')) {
    // Custom HTML content
    sheetEl.innerHTML = messageKey;
    sheetEl.classList.add("show");
    sheetEl.setAttribute("aria-hidden", "false");
    // Don't auto-close for custom content
    window.clearTimeout(showSheet._tid);
  } else {
    // Original behavior for message keys
    qs("#sheetTitle")?.replaceChildren(document.createTextNode(t("sheet_title")));
    qs("#sheetMsg")?.replaceChildren(document.createTextNode(t(messageKey)));
    sheetEl.classList.add("show");
    sheetEl.setAttribute("aria-hidden", "false");
    // auto-close after 2.2s
    window.clearTimeout(showSheet._tid);
    showSheet._tid = window.setTimeout(hideSheet, 2200);
  }
}

window.__hideSheet = hideSheet; // Make hideSheet globally accessible
window.__showSheet = showSheet; // Make showSheet globally accessible

function hideSheet() {
  if (!sheetEl) return;
  sheetEl.classList.remove("show");
  sheetEl.setAttribute("aria-hidden", "true");
  
  // Reset to original content structure if it was custom
  if (!qs("#sheetTitle")) {
    sheetEl.innerHTML = `
      <div class="sheet-content">
        <h3 id="sheetTitle"></h3>
        <p id="sheetMsg"></p>
        <button type="button" onclick="hideSheet()">Close</button>
      </div>
    `;
  }
}

// expose for HTML buttons
window.__hideSheet = hideSheet;

/* ------------- Routing ------------- */
let navigationHistory = [];
let currentPath = "";

function parseHash() {
  // "#/pdp/p1" -> { path: "/pdp", id: "p1" }
  // Handle empty hash or just "#" -> default to home
  const h = location.hash.slice(1) || "/home";
  if (h === "/" || h === "") return { path: "/home", id: undefined };
  
  const parts = h.split("/").filter(Boolean);
  if (parts.length === 0) return { path: "/home", id: undefined };
  if (parts.length === 1) return { path: "/" + parts[0], id: undefined };
  return { path: "/" + parts[0], id: parts[1] };
}

function highlightTab(path) {
  qsa("nav.bottom a").forEach(a => {
    a.classList.toggle("active", a.getAttribute("href") === `#${path}`);
  });
}

export function navigate(hash, addToHistory = true) { 
  // Clean up live shopping intervals when navigating away
  if (window.__cleanupLive && !hash.includes('/live')) {
    window.__cleanupLive();
  }
  
  if (addToHistory && currentPath && currentPath !== hash.slice(1)) {
    navigationHistory.push(currentPath);
    // Keep history reasonable size
    if (navigationHistory.length > 10) {
      navigationHistory = navigationHistory.slice(-10);
    }
  }
  location.hash = hash; 
}

export function goBack() {
  if (navigationHistory.length > 0) {
    const previous = navigationHistory.pop();
    navigate(`#${previous}`, false);
  } else {
    navigate("#/home", false);
  }
}

function route() {
  const { path, id } = parseHash();
  currentPath = path + (id ? `/${id}` : "");
  
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
  const btnAnalytics = qs("#btnAnalytics");
  const btnReset = qs("#btnReset");

  langSelect?.addEventListener("change", e => applyLang(e.target.value, true, true));
  themeSelect?.addEventListener("change", e => applyTheme(e.target.value, true));

  btnSponsor?.addEventListener("click", () => {
    state.prefs.sponsor = !state.prefs.sponsor;
    saveState(state);
    updateKPI();
    btnSponsor.setAttribute("aria-pressed", String(state.prefs.sponsor));
  });

  btnAnalytics?.addEventListener("click", () => navigate("#/analytics"));

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
    if (action === "toggle-like" && pid) {
      // Initialize liked products if not exists
      if (!state.user.likedProducts) {
        state.user.likedProducts = [];
      }
      
      const liked = state.user.likedProducts.includes(pid);
      if (liked) {
        state.user.likedProducts = state.user.likedProducts.filter(id => id !== pid);
      } else {
        state.user.likedProducts.push(pid);
      }
      
      saveState(state);
      
      // Update button appearance
      el.classList.toggle("active", !liked);
    }
    if (action === "share-product" && pid) {
      const product = productById(pid);
      const shareData = {
        title: product.name,
        text: `Check out ${product.name} on StoreZ - ${fmt(product.price)}`,
        url: `${location.origin}${location.pathname}#/pdp/${pid}`
      };
      
      if (navigator.share) {
        navigator.share(shareData);
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(shareData.url).then(() => {
          showSheet("link_copied");
        });
      }
    }
  });

  // initialize AI engine
  aiEngine.initialize(state);

  // initial route
  route();
}

document.addEventListener("DOMContentLoaded", boot);

/* ------------- Dev handle for quick inspection ------------- */
window.StoreZ = {
  state, actions, navigate, goBack, t, tn, currency, fmtDate, productById, aiEngine,
  showSheet, hideSheet
};

// Expose critical functions to window scope for onclick handlers
window.addToWishlist = (productId) => actions.addToWishlist(productId);
window.toggleWishlist = (productId) => actions.toggleWishlist(productId);
window.removeFilter = (filterType) => {
  // Navigate to discover page without filter
  navigate('discover');
};
window.navigate = navigate;
window.showSheet = showSheet;
window.hideSheet = hideSheet;

// Track recommendation clicks for analytics
window.trackRecommendationClick = function(productId, reason) {
  if (actions.trackUserInteraction) {
    actions.trackUserInteraction('recommendation_click', { productId, reason });
  }
};

// Show comparison modal
window.showComparisonModal = function() {
  const modal = document.createElement('div');
  modal.className = 'comparison-modal';
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.7); z-index: 200;
    display: flex; align-items: center; justify-content: center;
    padding: 20px; box-sizing: border-box;
  `;

  const comparisonItems = (state.comparison || []).map(id => productById(id)).filter(Boolean);

  modal.innerHTML = `
    <div style="background: var(--bg); border-radius: 16px; padding: 32px; max-width: 1000px; width: 100%; max-height: 90vh; overflow-y: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h2 style="margin: 0; font-size: 24px; font-weight: 700;">${t("product_comparison") || "Product Comparison"}</h2>
        <button onclick="closeComparisonModal()" style="background: none; border: none; font-size: 28px; cursor: pointer; color: var(--text-muted);">×</button>
      </div>
      
      ${comparisonItems.length === 0 ? `
        <div style="text-align: center; padding: 40px; color: var(--text-muted);">
          <div style="font-size: 48px; margin-bottom: 16px;">⚖️</div>
          <h3>${t("no_products_to_compare") || "No products to compare"}</h3>
          <p>${t("add_products_to_compare") || "Add products to comparison by clicking the compare button"}</p>
        </div>
      ` : `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
          ${comparisonItems.map(product => `
            <div style="border: 1px solid var(--border); border-radius: 12px; overflow: hidden;">
              <img src="${getProductImage(product, 300)}" style="width: 100%; height: 200px; object-fit: cover;" alt="${getProductTitle(product)}">
              <div style="padding: 16px;">
                <h4 style="margin: 0 0 12px; font-size: 16px; font-weight: 600;">${getProductTitle(product)}</h4>
                <div style="font-size: 18px; font-weight: 700; color: var(--primary); margin-bottom: 12px;">${currency(product.price)}</div>
                <div style="margin-bottom: 8px;">
                  <span style="color: #ffa500;">⭐⭐⭐⭐⭐</span>
                  <span style="margin-left: 8px; color: var(--text-muted); font-size: 14px;">${product.rating || 4.5}/5</span>
                </div>
                <div style="margin-bottom: 12px; font-size: 14px; color: var(--text-muted);">
                  ${Object.entries(product.specs || {}).slice(0, 3).map(([key, value]) => `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                      <span>${key}:</span>
                      <span>${value}</span>
                    </div>
                  `).join('')}
                </div>
                <div style="display: flex; gap: 8px;">
                  <button onclick="location.hash='#/pdp/${product.id}'; closeComparisonModal();" 
                          style="flex: 1; padding: 8px; background: var(--primary); color: white; border: none; border-radius: 6px; cursor: pointer;">
                    ${t("view_details") || "View Details"}
                  </button>
                  <button onclick="removeFromComparison('${product.id}')" 
                          style="padding: 8px; background: var(--card); border: 1px solid var(--border); border-radius: 6px; cursor: pointer;">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;

  document.body.appendChild(modal);
};

window.closeComparisonModal = function() {
  const modal = document.querySelector('.comparison-modal');
  if (modal) {
    document.body.removeChild(modal);
  }
};

window.removeFromComparison = function(productId) {
  if (state.comparison) {
    state.comparison = state.comparison.filter(id => id !== productId);
    saveState(state);
    closeComparisonModal();
    showComparisonModal();
  }
};

// Global function for review form (originally defined in routes.js but moved here for immediate availability)
window.showReviewForm = function(productId) {
  const modal = document.createElement('div');
  modal.className = 'review-modal';
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.7); z-index: 200;
    display: flex; align-items: center; justify-content: center;
    padding: 20px; box-sizing: border-box;
  `;

  modal.innerHTML = `
    <div style="background: var(--bg); border-radius: 16px; padding: 32px; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h2 style="margin: 0; font-size: 24px; font-weight: 700;">${t("write_review") || "Write a Review"}</h2>
        <button onclick="closeReviewForm()" style="background: none; border: none; font-size: 28px; cursor: pointer; color: var(--text-muted);">×</button>
      </div>
      <form id="reviewForm" onsubmit="submitReview(event, '${productId}')">
        <div style="margin-bottom: 24px;">
          <label style="display: block; font-weight: 600; margin-bottom: 12px;">${t("your_rating") || "Your rating"}</label>
          <div class="star-rating" style="display: flex; gap: 4px; margin-bottom: 8px;">
            ${[1, 2, 3, 4, 5].map(star => `
              <button type="button" class="star-btn" data-rating="${star}" 
                      style="background: none; border: none; font-size: 32px; cursor: pointer; color: var(--text-muted); transition: color 0.2s;"
                      onclick="selectRating(${star})">⭐</button>
            `).join('')}
          </div>
        </div>
        <div style="margin-bottom: 24px;">
          <label style="display: block; font-weight: 600; margin-bottom: 8px;">${t("review_title") || "Review title"}</label>
          <input type="text" name="title" required maxlength="100" 
                 placeholder="${t("review_title_placeholder") || "Summarize your experience"}"
                 style="width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 16px;">
        </div>
        <div style="margin-bottom: 24px;">
          <label style="display: block; font-weight: 600; margin-bottom: 8px;">${t("review_content") || "Your review"}</label>
          <textarea name="content" required rows="4" maxlength="1000"
                    placeholder="${t("review_content_placeholder") || "Tell others about your experience"}"
                    style="width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 16px; resize: vertical;"></textarea>
        </div>
        <div style="display: flex; gap: 12px;">
          <button type="button" onclick="closeReviewForm()" 
                  style="flex: 1; padding: 16px; background: var(--card); border: 1px solid var(--border); border-radius: 8px; cursor: pointer;">
            ${t("cancel") || "Cancel"}
          </button>
          <button type="submit" 
                  style="flex: 1; padding: 16px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
            ${t("submit_review") || "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
};

window.closeReviewForm = function() {
  const modal = document.querySelector('.review-modal');
  if (modal) {
    document.body.removeChild(modal);
  }
};

window.selectRating = function(rating) {
  // Simple rating selection - just highlight the selected stars
  const stars = document.querySelectorAll('.star-btn');
  stars.forEach((star, index) => {
    if (index < rating) {
      star.style.color = '#ffd700'; // Gold color for selected stars
    } else {
      star.style.color = 'var(--text-muted)';
    }
  });
};

window.submitReview = function(event, productId) {
  event.preventDefault();
  // Simple submission - just close the modal and show confirmation
  window.closeReviewForm();
  alert(t("review_submitted") || "Review submitted successfully!");
};

// Global function for showing comments (for social page functionality)
window.showComments = function(postId) {
  const modal = document.createElement('div');
  modal.className = 'comments-modal';
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.7); z-index: 200;
    display: flex; align-items: center; justify-content: center;
    padding: 20px; box-sizing: border-box;
  `;

  modal.innerHTML = `
    <div style="background: var(--bg); border-radius: 16px; padding: 32px; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h2 style="margin: 0; font-size: 24px; font-weight: 700;">${t("comments") || "Comments"}</h2>
        <button onclick="closeComments()" style="background: none; border: none; font-size: 28px; cursor: pointer; color: var(--text-muted);">×</button>
      </div>
      
      <div style="margin-bottom: 24px;">
        <div style="display: flex; gap: 12px; margin-bottom: 16px;">
          <img src="https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=40&h=40&fit=crop&crop=face" 
               style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" alt="User">
          <div style="flex: 1;">
            <textarea placeholder="${t("write_comment") || "Write a comment..."}" 
                      style="width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 14px; resize: vertical; min-height: 60px;"></textarea>
            <button onclick="addComment('${postId}')" 
                    style="margin-top: 8px; padding: 8px 16px; background: var(--primary); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
              ${t("post_comment") || "Post Comment"}
            </button>
          </div>
        </div>
      </div>

      <div class="comments-list" style="max-height: 400px; overflow-y: auto;">
        <div style="display: flex; gap: 12px; margin-bottom: 16px; padding: 16px; background: var(--panel); border-radius: 8px;">
          <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" 
               style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" alt="User">
          <div style="flex: 1;">
            <div style="font-weight: 600; margin-bottom: 4px;">@maya_shopper</div>
            <div style="color: var(--text-muted); margin-bottom: 8px;">Love this product! Great quality and fast shipping 👍</div>
            <div style="display: flex; gap: 16px; color: var(--text-muted); font-size: 12px;">
              <span>2h ago</span>
              <button style="background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 12px;">Reply</button>
              <button style="background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 12px;">❤️ 3</button>
            </div>
          </div>
        </div>
        
        <div style="display: flex; gap: 12px; margin-bottom: 16px; padding: 16px; background: var(--panel); border-radius: 8px;">
          <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" 
               style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" alt="User">
          <div style="flex: 1;">
            <div style="font-weight: 600; margin-bottom: 4px;">@sara_k</div>
            <div style="color: var(--text-muted); margin-bottom: 8px;">Thanks for sharing! Adding to my wishlist 🛒</div>
            <div style="display: flex; gap: 16px; color: var(--text-muted); font-size: 12px;">
              <span>5h ago</span>
              <button style="background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 12px;">Reply</button>
              <button style="background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 12px;">❤️ 1</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
};

window.closeComments = function() {
  const modal = document.querySelector('.comments-modal');
  if (modal) {
    document.body.removeChild(modal);
  }
};

window.addComment = function(postId) {
  const textarea = document.querySelector('.comments-modal textarea');
  if (textarea && textarea.value.trim()) {
    // Simulate adding comment
    alert(t("comment_added") || "Comment added successfully!");
    textarea.value = '';
    // In a real app, this would update the comments list
  }
};

// Global functions for wishlist management
window.createNewWishlist = function() {
  const name = prompt(t("enter_wishlist_name") || "Enter wishlist name:");
  if (name && name.trim()) {
    // Simulate creating new wishlist
    alert(t("wishlist_created") || "Wishlist created successfully!");
  }
};

window.showWishlistSettings = function() {
  alert(t("wishlist_settings") || "Wishlist settings (coming soon)");
};

// Note: showReviewForm is now defined here and will be available immediately when app.js loads
