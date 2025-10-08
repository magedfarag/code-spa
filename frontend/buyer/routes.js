/* routes.js — all view handlers for StoreZ (Buyer SPA)
   Each handler receives:
     ctx = { el, state, actions, t, tn, currency, fmtDate, navigate, showSheet, refresh }
   and optional id from the hash (e.g., #/pdp/p1 => id = "p1")
*/
import { uns, state, actions, productById, creatorById, cartTotal, getProductField } from "./data.js";
import { t, tn, getLang, formatTimeAgo, fmtSAR } from "./i18n.js";
import { aiEngine } from "./ai.js";

/* ---------- tiny DOM helpers ---------- */
const h = (html) => html.trim();

/* ---------- Performance & Analytics Monitoring ---------- */
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoads: 0,
      interactions: 0,
      errors: 0,
      loadTimes: [],
      lcp: 0,
      fid: 0,
      cls: 0
    };
    this.init();
  }

  init() {
    // Track page load performance
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        this.metrics.loadTimes.push(navigation.loadEventEnd - navigation.loadEventStart);
        this.trackMetric('page_load', navigation.loadEventEnd - navigation.loadEventStart);
      }
    });

    // Track Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.lcp = lastEntry.startTime;
          this.trackMetric('lcp', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Track First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            this.metrics.fid = entry.processingStart - entry.startTime;
            this.trackMetric('fid', entry.processingStart - entry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Track Cumulative Layout Shift (CLS)
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          this.metrics.cls = clsValue;
          this.trackMetric('cls', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('Performance Observer not fully supported', e);
      }
    }

    // Track JavaScript errors
    window.addEventListener('error', (e) => {
      this.metrics.errors++;
      this.trackError(e.error || e.message, e.filename, e.lineno);
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
      this.metrics.errors++;
      this.trackError('Unhandled Promise Rejection', e.reason);
    });
  }

  trackMetric(name, value, labels = {}) {
    const metric = {
      name,
      value,
      timestamp: Date.now(),
      labels,
      url: location.pathname + location.hash,
      userAgent: navigator.userAgent.substring(0, 100)
    };
    
    // Store in metrics state
    if (!state.analytics) state.analytics = { metrics: [], errors: [] };
    state.analytics.metrics.push(metric);
    
    // Keep only last 100 metrics to prevent memory issues
    if (state.analytics.metrics.length > 100) {
      state.analytics.metrics = state.analytics.metrics.slice(-100);
    }
    
    // For demo, log to console (in production would send to analytics service)
    console.log(`📊 Analytics: ${name}=${value}`, labels);
  }

  trackError(message, source = '', line = 0) {
    const error = {
      message: String(message).substring(0, 200),
      source,
      line,
      timestamp: Date.now(),
      url: location.pathname + location.hash,
      userAgent: navigator.userAgent.substring(0, 100)
    };
    
    if (!state.analytics) state.analytics = { metrics: [], errors: [] };
    state.analytics.errors.push(error);
    
    // Keep only last 50 errors
    if (state.analytics.errors.length > 50) {
      state.analytics.errors = state.analytics.errors.slice(-50);
    }
    
    console.error('🚨 Error tracked:', error);
  }

  trackInteraction(type, target, details = {}) {
    this.metrics.interactions++;
    this.trackMetric('interaction', 1, { type, target, ...details });
  }

  getReport() {
    const avgLoadTime = this.metrics.loadTimes.length > 0 
      ? this.metrics.loadTimes.reduce((a, b) => a + b, 0) / this.metrics.loadTimes.length 
      : 0;
    
    return {
      ...this.metrics,
      avgLoadTime,
      totalMetrics: state.analytics?.metrics?.length || 0,
      totalErrors: state.analytics?.errors?.length || 0,
      webVitals: {
        lcp: this.metrics.lcp,
        fid: this.metrics.fid,
        cls: this.metrics.cls,
        lcpGrade: this.metrics.lcp <= 2500 ? 'Good' : this.metrics.lcp <= 4000 ? 'Needs Improvement' : 'Poor',
        fidGrade: this.metrics.fid <= 100 ? 'Good' : this.metrics.fid <= 300 ? 'Needs Improvement' : 'Poor',
        clsGrade: this.metrics.cls <= 0.1 ? 'Good' : this.metrics.cls <= 0.25 ? 'Needs Improvement' : 'Poor'
      }
    };
  }
}

// Initialize performance monitor
const performanceMonitor = new PerformanceMonitor();
window.__performanceMonitor = performanceMonitor;

/* ---------- Accessibility Helper Functions ---------- */
class AccessibilityManager {
  constructor() {
    this.init();
  }

  init() {
    // Add skip navigation link
    this.addSkipNavigation();
    
    // Enhanced keyboard navigation
    this.setupKeyboardNavigation();
    
    // Focus management
    this.setupFocusManagement();
    
    // Screen reader announcements
    this.setupScreenReaderSupport();
    
    // Color contrast monitoring
    this.setupContrastMonitoring();
  }

  addSkipNavigation() {
    const skipNav = document.createElement('a');
    skipNav.href = '#view';
    skipNav.textContent = t('skip_to_content') || 'Skip to main content';
    skipNav.className = 'skip-nav';
    skipNav.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--primary);
      color: white;
      padding: 8px 12px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 1000;
      transition: top 0.3s;
    `;
    
    skipNav.addEventListener('focus', () => {
      skipNav.style.top = '6px';
    });
    
    skipNav.addEventListener('blur', () => {
      skipNav.style.top = '-40px';
    });
    
    document.body.insertBefore(skipNav, document.body.firstChild);
  }

  setupKeyboardNavigation() {
    // Enhanced keyboard navigation for interactive elements
    document.addEventListener('keydown', (e) => {
      // ESC key closes modals/sheets
      if (e.key === 'Escape') {
        const sheet = document.getElementById('sheet');
        if (sheet && !sheet.hasAttribute('aria-hidden')) {
          window.__hideSheet?.();
          return;
        }
      }
      
      // Arrow keys for navigation in grids
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        const focused = document.activeElement;
        if (focused && focused.closest('.grid, .posts-grid, .product-grid')) {
          this.handleGridNavigation(e, focused);
        }
      }
      
      // Enter/Space activation for custom buttons
      if (e.key === 'Enter' || e.key === ' ') {
        const focused = document.activeElement;
        if (focused && focused.hasAttribute('role') && focused.getAttribute('role') === 'button') {
          e.preventDefault();
          focused.click();
        }
      }
    });
  }

  handleGridNavigation(e, currentElement) {
    const grid = currentElement.closest('.grid, .posts-grid, .product-grid');
    const items = Array.from(grid.querySelectorAll('a, button, [tabindex="0"]'));
    const currentIndex = items.indexOf(currentElement);
    
    if (currentIndex === -1) return;
    
    const columns = this.getGridColumns(grid);
    let nextIndex = currentIndex;
    
    switch (e.key) {
      case 'ArrowRight':
        nextIndex = currentIndex + 1;
        break;
      case 'ArrowLeft':
        nextIndex = currentIndex - 1;
        break;
      case 'ArrowDown':
        nextIndex = currentIndex + columns;
        break;
      case 'ArrowUp':
        nextIndex = currentIndex - columns;
        break;
    }
    
    if (nextIndex >= 0 && nextIndex < items.length) {
      e.preventDefault();
      items[nextIndex].focus();
    }
  }

  getGridColumns(grid) {
    const style = getComputedStyle(grid);
    const columns = style.gridTemplateColumns;
    return columns ? columns.split(' ').length : 1;
  }

  setupFocusManagement() {
    // Track focus for route changes
    let lastFocusedElement = null;
    
    window.addEventListener('hashchange', () => {
      // Focus main content area after route change
      setTimeout(() => {
        const mainContent = document.getElementById('view');
        if (mainContent) {
          mainContent.focus();
        }
      }, 100);
    });
    
    // Focus trap for modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const sheet = document.getElementById('sheet');
        if (sheet && !sheet.hasAttribute('aria-hidden')) {
          this.trapFocus(e, sheet);
        }
      }
    });
  }

  trapFocus(e, container) {
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  setupScreenReaderSupport() {
    // Live region for dynamic content announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
    
    // Global announcement function
    window.__announceToScreenReader = (message) => {
      const liveRegion = document.getElementById('live-region');
      if (liveRegion) {
        liveRegion.textContent = message;
        // Clear after announcement
        setTimeout(() => {
          liveRegion.textContent = '';
        }, 1000);
      }
    };
  }

  setupContrastMonitoring() {
    // Basic contrast checking (simplified for demo)
    const checkContrast = () => {
      const elements = document.querySelectorAll('button, a, input, .badge');
      elements.forEach(el => {
        const styles = getComputedStyle(el);
        const bgColor = styles.backgroundColor;
        const textColor = styles.color;
        
        // Add high contrast class if needed (simplified check)
        if (bgColor === 'rgb(255, 255, 255)' && textColor === 'rgb(0, 0, 0)') {
          el.classList.add('high-contrast');
        }
      });
    };
    
    // Check on theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          setTimeout(checkContrast, 100);
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
  }

  announceRouteChange(routeName) {
    const message = t('navigated_to') ? 
      t('navigated_to').replace('{route}', routeName) : 
      `Navigated to ${routeName}`;
    window.__announceToScreenReader?.(message);
  }
}

// Initialize accessibility manager
const accessibilityManager = new AccessibilityManager();
window.__accessibilityManager = accessibilityManager;
const stars = (n) => "⭐".repeat(Math.round(Number(n || 4)));

/* ---------- shared UI fragments ---------- */
function Card(p) {
  const discount = p.listPrice ? `<span class="strike">${fmt(p.listPrice)}</span>` : "";
  const saved = state.wishlist.includes(p.id);
  const liked = state.user.likedProducts && state.user.likedProducts.includes(p.id);
  const productName = getProductField(p, 'name');
  const productCat = getProductField(p, 'cat');
  
  return h(`
  <article class="card" aria-label="${productName}">
    <a class="media" href="#/pdp/${p.id}" aria-label="${productName}">
      <img src="${uns(p.img, 900)}" alt="${productName}" />
    </a>
    <div class="body">
      <div class="row between">
        <a href="#/pdp/${p.id}"><strong>${productName}</strong></a>
        <button class="icon-btn ${saved ? "active" : ""}" data-action="toggle-wish" data-id="${p.id}" aria-pressed="${saved}" title="${saved ? t("unsave_item") : t("save_item")}">${saved ? "♥" : "♡"}</button>
      </div>
      <div class="row between">
        <div class="row" style="gap:6px">
          <span class="price">${fmt(p.price)}</span>
          ${discount}
        </div>
        <button class="chip" onclick="window.StoreZ.navigate('#/category/${encodeURIComponent(productCat)}')" title="Browse ${productCat}">${productCat}</button>
      </div>
      <div class="muted">${t("by_creator")} <a href="#/creator/${p.creatorId}" style="color:var(--brand)">${creatorName(p.creatorId)}</a> · ${stars(p.rating)}</div>
      
      <!-- Social actions -->
      <div class="row between" style="margin-top:8px; font-size:12px">
        <div class="row" style="gap:8px">
          <button class="ghost small ${liked ? "active" : ""}" data-action="toggle-like" data-id="${p.id}" 
                  style="display:flex;align-items:center;gap:4px;padding:4px 8px">
            ${liked ? "👍" : "👍"} ${t("like")}
          </button>
          <button class="ghost small" data-action="share-product" data-id="${p.id}"
                  style="display:flex;align-items:center;gap:4px;padding:4px 8px">
            📤 ${t("share")}
          </button>
        </div>
        <span class="muted">${Math.floor(Math.random() * 50) + 10} ${t("likes")}</span>
      </div>
      
      <div class="row" style="gap:8px; margin-top:8px">
        <button class="secondary" data-action="add-to-cart" data-id="${p.id}">${t("add_to_cart")}</button>
        <button class="ghost" data-action="buy-now" data-id="${p.id}">${t("buy_now")}</button>
      </div>
    </div>
  </article>`);
}
const fmt = (n) => new Intl.NumberFormat(
  (localStorage.getItem("storez_lang") || "en") === "ar" ? "ar-SA" : "en",
  { style: "currency", currency: "SAR", currencyDisplay: (localStorage.getItem("storez_lang") || "en") === "en" ? "code" : "symbol", maximumFractionDigits: 0 }
).format(Number(n) || 0);

const creatorName = (cid) => (creatorById(cid)?.name || "Creator");

/* ---------- AI-Enhanced UI Components ---------- */

function CardWithAI(p) {
  const discount = p.listPrice ? `<span class="strike">${fmt(p.listPrice)}</span>` : "";
  const saved = state.wishlist.includes(p.id);
  const liked = state.user.likedProducts && state.user.likedProducts.includes(p.id);
  const productName = getProductField(p, 'name');
  const productCat = getProductField(p, 'cat');
  
  // AI recommendation reason
  const aiReason = p.reason || "";
  const aiScore = p.aiScore ? Math.round(p.aiScore) : 0;
  const isTrending = p.trending || false;
  
  return h(`
  <article class="card" aria-label="${productName}" data-ai-score="${aiScore}">
    <a class="media" href="#/pdp/${p.id}" aria-label="${productName}" 
       onclick="window.__trackAIClick && window.__trackAIClick('${p.id}', 'product', '${aiReason}')">
      <img src="${uns(p.img, 900)}" alt="${productName}" />
      ${isTrending ? `
        <div class="badge trending" style="position:absolute; top:8px; right:8px; background:var(--brand-2); color:white; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:bold;">
          🔥 ${t("trending")}
        </div>
      ` : ''}
      ${aiReason ? `
        <div class="ai-reason" style="position:absolute; bottom:8px; left:8px; background:rgba(0,0,0,0.8); color:white; padding:4px 8px; border-radius:12px; font-size:10px;">
          🤖 ${aiReason}
        </div>
      ` : ''}
    </a>
    <div class="body">
      <div class="row between">
        <a href="#/pdp/${p.id}" onclick="window.__trackAIClick && window.__trackAIClick('${p.id}', 'product', '${aiReason}')">
          <strong>${productName}</strong>
        </a>
        <button class="icon-btn ${saved ? "active" : ""}" data-action="toggle-wish" data-id="${p.id}" aria-pressed="${saved}" title="${saved ? t("unsave_item") : t("save_item")}">${saved ? "♥" : "♡"}</button>
      </div>
      <div class="row between">
        <div class="row" style="gap:6px">
          <span class="price">${fmt(p.price)}</span>
          ${discount}
        </div>
        <button class="chip" onclick="window.__trackCategoryClick('${productCat}'); window.StoreZ.navigate('#/category/${encodeURIComponent(productCat)}')" title="Browse ${productCat}">${productCat}</button>
      </div>
      <div class="muted">${t("by_creator")} <a href="#/creator/${p.creatorId}" style="color:var(--brand)">${creatorName(p.creatorId)}</a> · ${stars(p.rating)}</div>
      
      <!-- Social actions -->
      <div class="row between" style="margin-top:8px; font-size:12px">
        <div class="row" style="gap:8px">
          <button class="ghost small ${liked ? "active" : ""}" data-action="toggle-like" data-id="${p.id}" 
                  style="display:flex;align-items:center;gap:4px;padding:4px 8px">
            ${liked ? "👍" : "👍"} ${t("like")}
          </button>
          <button class="ghost small" data-action="share-product" data-id="${p.id}"
                  style="display:flex;align-items:center;gap:4px;padding:4px 8px">
            📤 ${t("share")}
          </button>
        </div>
        <span class="muted">${Math.floor(Math.random() * 50) + 10} ${t("likes")}</span>
      </div>
      
      <div class="row" style="gap:8px; margin-top:8px">
        <button class="secondary" data-action="add-to-cart" data-id="${p.id}">${t("add_to_cart")}</button>
        <button class="ghost" data-action="buy-now" data-id="${p.id}">${t("buy_now")}</button>
      </div>
    </div>
  </article>`);
}

function CardSmall(p, showTrending = false) {
  const productName = getProductField(p, 'name');
  const isTrending = p.trending || showTrending;
  
  return h(`
  <article class="card-small" style="text-align:center; padding:8px; border-radius:12px; background:var(--panel)">
    <a href="#/pdp/${p.id}" onclick="window.__trackAIClick && window.__trackAIClick('${p.id}', 'trending', 'trending_section')" style="text-decoration:none">
      <div style="position:relative; margin-bottom:8px">
        <img src="${uns(p.img, 400)}" alt="${productName}" style="width:100%; aspect-ratio:1; object-fit:cover; border-radius:8px"/>
        ${isTrending ? `
          <div style="position:absolute; top:4px; right:4px; background:var(--brand-2); color:white; padding:2px 4px; border-radius:6px; font-size:9px; font-weight:bold;">
            🔥
          </div>
        ` : ''}
      </div>
      <div style="font-size:12px; font-weight:bold; margin-bottom:4px; line-height:1.2">${productName}</div>
      <div style="color:var(--brand); font-weight:bold; font-size:14px">${fmt(p.price)}</div>
    </a>
  </article>`);
}

function CreatorCard(creator) {
  return h(`
  <article class="card creator-card" style="border:2px solid var(--brand-2); background:linear-gradient(135deg, var(--panel), var(--bg))">
    <div style="text-align:center; padding:16px">
      <a href="#/creator/${creator.id}" onclick="window.__trackAIClick && window.__trackAIClick('${creator.id}', 'creator', 'ai_recommended')" style="text-decoration:none">
        <div style="position:relative; display:inline-block; margin-bottom:12px">
          <img src="https://images.unsplash.com/photo-${creator.id === 'c1' ? '1494790108755-2616b612b9e3' : creator.id === 'c2' ? '1507003211169-0a1dd7228f2d' : '1438761681033-6461ffad8d80'}?auto=format&fit=crop&w=120&q=70" 
               alt="${creator.name}" style="width:60px; height:60px; border-radius:50%; object-fit:cover; border:3px solid var(--brand-2)"/>
          ${creator.live ? `
            <div style="position:absolute; bottom:0; right:0; width:18px; height:18px; background:var(--danger); border:2px solid white; border-radius:50%; display:flex; align-items:center; justify-content:center">
              <div style="width:6px; height:6px; background:white; border-radius:50%"></div>
            </div>
          ` : ''}
        </div>
        <div style="font-weight:bold; margin-bottom:4px">${creator.name}</div>
        <div style="font-size:12px; color:var(--muted); margin-bottom:8px">${creator.handle}</div>
        <div style="font-size:11px; color:var(--muted); margin-bottom:8px">${(creator.followers / 1000).toFixed(0)}K ${t("followers")}</div>
        <div style="font-size:10px; background:var(--brand-2); color:white; padding:2px 6px; border-radius:8px; display:inline-block">
          🤖 ${t("ai_recommended")}
        </div>
        ${creator.live ? `
          <div style="margin-top:8px">
            <span style="background:var(--danger); color:white; padding:2px 6px; border-radius:6px; font-size:10px; font-weight:bold">
              🔴 ${t("live_now")}
            </span>
          </div>
        ` : ''}
      </a>
    </div>
  </article>`);
}

function renderAIInsights() {
  const insights = aiEngine.getUserInsights();
  
  // Only show if user has some interaction history
  if (insights.activityStats.totalViews < 5) return '';
  
  const topCategory = insights.topCategories[0];
  const sessionCount = insights.activityStats.sessionCount;
  
  return `
    <div style="margin-top:24px; padding:16px; background:linear-gradient(135deg, var(--brand-2), var(--brand)); border-radius:12px; color:white">
      <div class="row between" style="margin-bottom:8px">
        <strong>🤖 ${t("ai_insights")}</strong>
        <button class="ghost small" onclick="window.__showFullInsights && window.__showFullInsights()" style="color:white; border-color:rgba(255,255,255,0.3)">
          ${t("view_all")}
        </button>
      </div>
      <div style="font-size:14px; opacity:0.9">
        ${topCategory ? t("top_category_insight", { category: topCategory.category, sessions: sessionCount }) : t("getting_to_know_you")}
      </div>
    </div>
  `;
}

/* ---------- route handlers ---------- */

function landing(ctx) {
  ctx.el.innerHTML = h(`
    <section class="panel">
      <div class="landing-hero">
        <h1>${t("landing_title")}</h1>
        <p>${t("landing_sub")}</p>
        <div class="actions">
          <button class="secondary" type="button" onclick="(function(){window.StoreZ.state.user.authed=true; window.StoreZ.state.user.guest=false; window.StoreZ.state.user.name='Maya'; window.StoreZ.navigate('#/onboarding'); window.StoreZ.state && window.StoreZ.state.prefs && window.StoreZ.state.prefs.sponsor;})()">${t("action_signup")}</button>
          <button class="ghost" type="button" onclick="(function(){window.StoreZ.state.user.authed=true; window.StoreZ.state.user.guest=true; window.StoreZ.navigate('#/home');})()">${t("action_guest")}</button>
        </div>
      </div>
      <div class="grid" style="grid-template-columns:1fr 1fr 1fr; gap:12px">
        <div class="panel center">${t("landing_point_feed")}</div>
        <div class="panel center">${t("landing_point_live")}</div>
        <div class="panel center">${t("landing_point_wallet")}</div>
      </div>
    </section>
  `);
}

function auth(ctx) {
  ctx.el.innerHTML = h(`
    <section class="panel">
      <div style="text-align:center; margin-bottom:24px">
        <h2>${t("welcome_to_storez")}</h2>
        <p class="muted">${t("auth_subtitle")}</p>
      </div>
      
      <!-- Sign in form -->
      <div id="signInForm">
        <div style="margin-bottom:16px">
          <label for="auth_email">${t("email_or_phone")}</label>
          <input id="auth_email" type="text" placeholder="you@example.com" />
        </div>
        
        <div class="row" style="gap:8px; margin-bottom:16px">
          <button class="secondary" style="flex:1" onclick="window.__startAuth && window.__startAuth('email')">${t("continue_with_email")}</button>
        </div>
        
        <div class="center" style="margin:16px 0">
          <span class="muted">${t("or")}</span>
        </div>
        
        <!-- Social login options -->
        <div class="row" style="gap:8px; margin-bottom:16px">
          <button class="ghost" style="flex:1" onclick="window.__startAuth && window.__startAuth('google')">
            📧 Google
          </button>
          <button class="ghost" style="flex:1" onclick="window.__startAuth && window.__startAuth('apple')">
            🍎 Apple
          </button>
        </div>
        
        <!-- Guest option -->
        <div class="center" style="margin-top:24px">
          <button class="ghost small" onclick="window.__startAuth && window.__startAuth('guest')">
            ${t("continue_as_guest")}
          </button>
        </div>
      </div>
      
      <!-- OTP verification (hidden initially) -->
      <div id="otpForm" style="display:none">
        <div style="text-align:center; margin-bottom:24px">
          <h3>${t("verify_code")}</h3>
          <p class="muted">${t("otp_sent_to")} <span id="contactInfo"></span></p>
        </div>
        
        <div style="margin-bottom:16px">
          <label for="otp_code">${t("verification_code")}</label>
          <input id="otp_code" type="text" placeholder="123456" maxlength="6" />
        </div>
        
        <div class="row" style="gap:8px; margin-bottom:16px">
          <button class="secondary" style="flex:1" onclick="window.__verifyOtp && window.__verifyOtp()">${t("verify")}</button>
          <button class="ghost" onclick="window.__backToAuth && window.__backToAuth()">${t("back")}</button>
        </div>
        
        <div class="center">
          <button class="ghost small" onclick="window.__resendOtp && window.__resendOtp()">
            ${t("resend_code")}
          </button>
        </div>
      </div>
      
      <div class="center" style="margin-top:24px">
        <button class="ghost small" onclick="window.StoreZ.navigate('#/landing')">${t("back_to_home")}</button>
      </div>
    </section>
  `);
  
  // Authentication flow functions
  let currentAuthMethod = "";
  let currentContact = "";
  
  window.__startAuth = (method) => {
    currentAuthMethod = method;
    
    if (method === "guest") {
      // Guest checkout
      state.user.authed = true;
      state.user.guest = true;
      state.user.name = "Guest User";
      actions.saveState(state);
      navigate("#/home");
      return;
    }
    
    if (method === "email") {
      const email = document.getElementById("auth_email")?.value;
      if (!email) {
        alert(t("please_enter_email"));
        return;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        alert(t("invalid_email_format"));
        return;
      }
      currentContact = email;
    } else {
      // Social login simulation
      currentContact = method === "google" ? "your Google account" : "your Apple ID";
    }
    
    // Show OTP form
    document.getElementById("signInForm").style.display = "none";
    document.getElementById("otpForm").style.display = "block";
    document.getElementById("contactInfo").textContent = currentContact;
    
    // Focus on OTP input
    setTimeout(() => {
      document.getElementById("otp_code")?.focus();
    }, 100);
  };
  
  window.__verifyOtp = () => {
    const code = document.getElementById("otp_code")?.value;
    if (!code || code.length !== 6) {
      alert(t("invalid_otp"));
      return;
    }
    
    // Simulate OTP verification (accept any 6-digit code)
    state.user.authed = true;
    state.user.guest = false;
    state.user.email = currentAuthMethod === "email" ? currentContact : "";
    state.user.name = currentAuthMethod === "email" ? "Maya" : `User (${currentAuthMethod})`;
    state.user.authMethod = currentAuthMethod;
    actions.saveState(state);
    
    // Check if user needs onboarding
    if (!state.user.interests || state.user.interests.length === 0) {
      navigate("#/home"); // Skip onboarding for demo, go straight to home
    } else {
      navigate("#/home");
    }
  };
  
  window.__backToAuth = () => {
    document.getElementById("signInForm").style.display = "block";
    document.getElementById("otpForm").style.display = "none";
    document.getElementById("otp_code").value = "";
  };
  
  window.__resendOtp = () => {
    // Simulate resending OTP
    alert(t("otp_resent"));
  };
}

function onboarding(ctx) {
  const interests = ["Sneakers","Minimal","Tech","Beauty","Accessories","Athleisure"];
  const userName = state.user.name || "there";
  
  ctx.el.innerHTML = h(`
    <section class="panel">
      <div style="text-align:center; margin-bottom:24px">
        <h2>${t("welcome")}, ${userName}! 👋</h2>
        <p class="muted">${t("onboarding_subtitle")}</p>
      </div>
      
      <!-- Step 1: Interests -->
      <div style="margin-bottom:24px">
        <h3>${t("pick_interests")}</h3>
        <p class="muted">${t("interests_help")}</p>
        <div id="interestsList" class="row" style="gap:8px; flex-wrap:wrap; margin-top:12px">
          ${interests.map(x => `
            <label class="chip" style="cursor:pointer">
              <input type="checkbox" value="${x}" style="accent-color:var(--brand); margin-inline-end:6px">
              ${x}
            </label>
          `).join("")}
        </div>
      </div>
      
      <!-- Step 2: Preferences -->
      <div style="margin-bottom:24px">
        <h3>${t("preferences")}</h3>
        
        <div style="margin-bottom:16px">
          <label class="row between">
            <span>${t("notifications_marketing")}</span>
            <input type="checkbox" id="pref_marketing" checked style="accent-color:var(--brand)">
          </label>
        </div>
        
        <div style="margin-bottom:16px">
          <label class="row between">
            <span>${t("notifications_orders")}</span>
            <input type="checkbox" id="pref_orders" checked style="accent-color:var(--brand)">
          </label>
        </div>
        
        <div style="margin-bottom:16px">
          <label class="row between">
            <span>${t("notifications_live")}</span>
            <input type="checkbox" id="pref_live" checked style="accent-color:var(--brand)">
          </label>
        </div>
      </div>
      
      <!-- Step 3: Follow suggested creators -->
      <div style="margin-bottom:24px">
        <h3>${t("suggested_creators")}</h3>
        <p class="muted">${t("follow_creators_help")}</p>
        <div id="creatorsList" class="row" style="gap:8px; flex-wrap:wrap; margin-top:12px">
          ${state.creators.map(creator => `
            <label class="chip" style="cursor:pointer">
              <input type="checkbox" value="${creator.id}" style="accent-color:var(--brand); margin-inline-end:6px">
              ${creator.name}
            </label>
          `).join("")}
        </div>
      </div>
      
      <div class="row" style="gap:8px">
        <button class="secondary" style="flex:1" onclick="window.__completeOnboarding && window.__completeOnboarding()">${t("get_started")}</button>
        <button class="ghost" onclick="window.__skipOnboarding && window.__skipOnboarding()">${t("skip")}</button>
      </div>
    </section>
  `);
  
  // Onboarding functions
  window.__completeOnboarding = () => {
    // Save interests
    const selectedInterests = Array.from(document.querySelectorAll('#interestsList input:checked'))
      .map(cb => cb.value);
    
    // Save notification preferences
    const preferences = {
      marketing: document.getElementById('pref_marketing')?.checked || false,
      orders: document.getElementById('pref_orders')?.checked || false,
      live: document.getElementById('pref_live')?.checked || false
    };
    
    // Save followed creators
    const followedCreators = Array.from(document.querySelectorAll('#creatorsList input:checked'))
      .map(cb => cb.value);
    
    // Update state
    state.user.interests = selectedInterests;
    state.user.preferences = preferences;
    state.user.followedCreators = followedCreators;
    state.user.onboardingCompleted = true;
    
    actions.saveState(state);
    navigate("#/home");
  };
  
  window.__skipOnboarding = () => {
    // Set minimal defaults
    state.user.interests = [];
    state.user.preferences = { marketing: false, orders: true, live: false };
    state.user.followedCreators = [];
    state.user.onboardingCompleted = true;
    
    actions.saveState(state);
    navigate("#/home");
  };
}

function home(ctx) {
  // Get AI-powered personalized recommendations
  const personalizedFeed = aiEngine.getPersonalizedRecommendations(state.products, state.creators, 12);
  const trendingProducts = aiEngine.getTrendingProducts(state.products, 6);
  const categories = [...new Set(state.products.map(p => getProductField(p, 'cat')))];
  
  // Track page view for AI
  aiEngine.trackView('home', 'page', { timestamp: Date.now() });
  
  state.metrics.impressions += personalizedFeed.length;
  ctx.refresh();
  
  ctx.el.innerHTML = h(`
    <section class="panel">
      <!-- Quick category access -->
      <div style="margin-bottom:20px">
        <div class="row between" style="margin-bottom:8px">
          <strong>${t("browse_categories")}</strong>
          <a class="chip" href="#/discover">${t("see_all")}</a>
        </div>
        <div class="row" style="gap:8px; flex-wrap:wrap">
          ${categories.map(cat => `
            <button class="chip" onclick="window.__trackCategoryClick('${cat}'); window.StoreZ.navigate('#/category/${encodeURIComponent(cat)}')">
              ${cat}
            </button>
          `).join("")}
        </div>
      </div>
      
      <!-- Trending section -->
      ${trendingProducts.length > 0 ? `
        <div style="margin-bottom:24px">
          <div class="row between" style="margin-bottom:8px">
            <strong>${t("trending")} ✨</strong>
            <span class="chip" style="background:var(--brand-2); color:white; font-size:11px">
              ${t("ai_curated")}
            </span>
          </div>
          <div class="grid cards" style="grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:8px">
            ${trendingProducts.map(product => CardSmall(product, true)).join("")}
          </div>
        </div>
      ` : ''}
      
      <!-- Personalized For You feed -->
      <div class="row between" style="margin-bottom:8px">
        <strong>${t("for_you")}</strong>
        <div class="row" style="gap:8px; align-items:center">
          <span class="chip" style="background:var(--good); color:white; font-size:11px">
            🤖 ${t("ai_powered")}
          </span>
          <a class="chip" href="#/discover">${t("explore_more")}</a>
        </div>
      </div>
      
      <div class="grid cards" style="margin-top:12px">
        ${personalizedFeed.map(item => {
          if (item.type === 'creator') {
            return CreatorCard(item);
          } else {
            return CardWithAI(item);
          }
        }).join("")}
      </div>
      
      <!-- AI Insights (if user has interaction history) -->
      ${renderAIInsights()}
    </section>
  `);
}

function category(ctx, categoryName) {
  const cat = categoryName ? decodeURIComponent(categoryName) : "All";
  const products = cat === "All" ? state.products.slice() : state.products.filter(p => getProductField(p, 'cat') === cat);
  const categories = [...new Set(state.products.map(p => getProductField(p, 'cat')))];
  
  ctx.el.innerHTML = h(`
    <section class="panel">
      <div class="row between" style="margin-bottom:16px">
        <h1>${cat === "All" ? t("all_products") : cat}</h1>
        <button class="ghost small" onclick="window.StoreZ.goBack()">${t("back")}</button>
      </div>
      
      <!-- Category tabs -->
      <div class="row" style="gap:8px; margin-bottom:16px; flex-wrap:wrap">
        <button class="chip ${cat === "All" ? "active" : ""}" onclick="window.StoreZ.navigate('#/category/All')">
          ${t("all_categories")}
        </button>
        ${categories.map(c => `
          <button class="chip ${cat === c ? "active" : ""}" onclick="window.StoreZ.navigate('#/category/${encodeURIComponent(c)}')">
            ${c}
          </button>
        `).join("")}
      </div>
      
      <div id="resCount" role="status" aria-live="polite" class="muted" style="margin-bottom:12px">
        ${tn("results_count", {n: products.length})}
      </div>
      
      <div class="grid cards">
        ${products.length ? products.map(Card).join("") : `<div class="panel center muted">${t("no_products_found")}</div>`}
      </div>
    </section>
  `);
}

function discover(ctx) {
  const categories = [...new Set(state.products.map(p => getProductField(p, 'cat')))];
  const creators = state.creators;
  const trendingTags = ["#trending", "#newdrop", "#sustainable", "#limited", "#popular"];
  
  // Get AI-powered search suggestions and trending searches
  const aiSearchData = aiEngine.getSearchSuggestions();
  const trendingSearches = aiSearchData.trending.slice(0, 5);
  const personalizedSuggestions = aiSearchData.personalized.slice(0, 3);
  
  // Get initial results with AI personalization
  const baseProducts = state.products.slice();
  const personalizedProducts = aiEngine.getPersonalizedRecommendations().slice(0, 8);
  const list = personalizedProducts.length > 0 ? personalizedProducts : baseProducts;
  
  ctx.el.innerHTML = h(`
    <section class="panel">
      <!-- Enhanced Search with AI -->
      <div class="search-container" style="margin-bottom:16px">
        <div class="row" style="gap:8px">
          <div style="flex:1; position:relative">
            <input id="q" placeholder="${t("discover_ph")}" style="width:100%; padding-right:40px" 
                   oninput="window.__aiSearchInput && window.__aiSearchInput(this.value)"
                   onfocus="window.__showSearchSuggestions && window.__showSearchSuggestions()"
                   onblur="window.__hideSearchSuggestions && window.__hideSearchSuggestions()" />
            <button onclick="window.__clearSearch && window.__clearSearch()" 
                    style="position:absolute; right:8px; top:50%; transform:translateY(-50%); background:none; border:none; color:var(--muted)">
              ✕
            </button>
            
            <!-- AI Search Suggestions Dropdown -->
            <div id="searchSuggestions" class="search-suggestions" style="display:none; position:absolute; top:100%; left:0; right:0; background:var(--panel); border:1px solid var(--border); border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1); z-index:100; max-height:300px; overflow-y:auto">
              
              ${personalizedSuggestions.length > 0 ? `
                <div class="suggestion-section">
                  <div class="suggestion-header">${t("suggested_for_you")} 🤖</div>
                  ${personalizedSuggestions.map(term => `
                    <div class="suggestion-item" onclick="window.__selectSuggestion && window.__selectSuggestion('${term}')">
                      <span class="suggestion-icon">🔍</span>
                      <span class="suggestion-text">${term}</span>
                      <span class="suggestion-type">AI</span>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
              
              ${trendingSearches.length > 0 ? `
                <div class="suggestion-section">
                  <div class="suggestion-header">${t("trending_searches")} 📈</div>
                  ${trendingSearches.map(term => `
                    <div class="suggestion-item" onclick="window.__selectSuggestion && window.__selectSuggestion('${term}')">
                      <span class="suggestion-icon">🔥</span>
                      <span class="suggestion-text">${term}</span>
                      <span class="suggestion-type">${t("trending")}</span>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
              
              <div class="suggestion-section">
                <div class="suggestion-header">${t("browse_categories")}</div>
                ${categories.slice(0, 4).map(cat => `
                  <div class="suggestion-item" onclick="window.__selectCategory && window.__selectCategory('${cat}')">
                    <span class="suggestion-icon">📂</span>
                    <span class="suggestion-text">${cat}</span>
                    <span class="suggestion-type">${t("category")}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
          
          <button class="secondary small" onclick="window.__toggleFilters && window.__toggleFilters()">
            ${t("filters")}
          </button>
          <button class="brand small" onclick="window.__showAISearchInsights && window.__showAISearchInsights()" title="${t("ai_search_insights")}">
            🤖 AI
          </button>
        </div>
        
        <!-- Recent searches -->
        <div id="recentSearches" class="recent-searches" style="margin-top:8px; display:none">
          <div class="row" style="gap:6px; flex-wrap:wrap; align-items:center">
            <span class="muted small">${t("recent")}:</span>
            ${aiSearchData.recent.slice(0, 4).map(term => `
              <button class="chip mini" onclick="window.__selectSuggestion && window.__selectSuggestion('${term}')">
                ${term}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
      
      <!-- AI Search Results Summary -->
      <div id="aiSearchSummary" style="display:none; background:linear-gradient(135deg, var(--brand-2), var(--brand)); color:white; padding:12px; border-radius:8px; margin-bottom:16px">
        <div class="row between" style="align-items:center">
          <div>
            <div style="font-weight:500; margin-bottom:4px">${t("ai_enhanced_results")} 🤖</div>
            <div class="small" id="aiSummaryText"></div>
          </div>
          <button onclick="this.parentElement.parentElement.style.display='none'" style="background:rgba(255,255,255,0.2); border:none; color:white; border-radius:4px; padding:4px 8px">✕</button>
        </div>
      </div>
      
      <!-- Smart trending tags with AI -->
      <div style="margin-bottom:16px">
        <h3 style="margin-bottom:8px">${t("trending_now")} 🔥</h3>
        <div class="row" style="gap:8px; flex-wrap:wrap">
          ${trendingTags.map(tag => `
            <button class="chip" onclick="window.__searchTag && window.__searchTag('${tag.slice(1)}')" 
                    style="background:var(--brand-2); color:white;">
              ${tag}
            </button>
          `).join("")}
          
          <!-- AI recommended tags -->
          ${aiSearchData.recommendedTags.slice(0, 3).map(tag => `
            <button class="chip" onclick="window.__searchTag && window.__searchTag('${tag}')" 
                    style="background:linear-gradient(45deg, var(--brand), var(--brand-2)); color:white; position:relative">
              ${tag}
              <span style="position:absolute; top:-4px; right:-4px; background:gold; color:black; border-radius:50%; width:16px; height:16px; font-size:10px; display:flex; align-items:center; justify-content:center">AI</span>
            </button>
          `).join("")}
        </div>
      </div>
      
      <!-- Enhanced category access with AI insights -->
      <div style="margin-bottom:16px">
        <h3 style="margin-bottom:8px">${t("browse_categories")}</h3>
        <div class="row" style="gap:8px; flex-wrap:wrap">
          ${categories.map(cat => {
            const isPersonalized = aiEngine.getCategoryScore(cat) > 0.3;
            return `
              <button class="chip ${isPersonalized ? 'ai-recommended' : ''}" 
                      onclick="window.__trackCategoryClick('${cat}'); window.StoreZ.navigate('#/category/${encodeURIComponent(cat)}')"
                      style="${isPersonalized ? 'background:linear-gradient(45deg, var(--brand-3), var(--brand-2)); color:white' : ''}">
                ${cat}
                ${isPersonalized ? ' ⭐' : ''}
              </button>
            `;
          }).join("")}
        </div>
      </div>
      
      <!-- Filter panel (hidden by default) with AI enhancements -->
      <div id="filterPanel" class="panel" style="display:none; margin-bottom:16px; background:var(--panel);">
        <div class="row between" style="align-items:center; margin-bottom:12px">
          <h4>${t("filters")}</h4>
          <button class="ghost small" onclick="window.__getAIFilterSuggestions && window.__getAIFilterSuggestions()" style="color:var(--brand)">
            🤖 ${t("ai_suggestions")}
          </button>
        </div>
        
        <!-- AI filter insights -->
        <div id="aiFilterInsights" style="display:none; background:var(--brand-3); padding:8px; border-radius:6px; margin-bottom:12px; font-size:14px">
          <div style="font-weight:500; margin-bottom:4px">💡 ${t("ai_filter_suggestion")}</div>
          <div id="aiFilterText"></div>
        </div>
        
        <!-- Price range with AI suggestions -->
        <div class="row between" style="margin-bottom:12px">
          <span>${t("price_range")}</span>
          <div class="row" style="gap:8px; align-items:center">
            <input type="number" id="minPrice" placeholder="Min" style="width:80px" />
            <input type="number" id="maxPrice" placeholder="Max" style="width:80px" />
            <button class="ghost tiny" onclick="window.__setAIRecommendedPriceRange && window.__setAIRecommendedPriceRange()" title="${t("ai_price_suggestion")}">
              🤖
            </button>
          </div>
        </div>
        
        <!-- Rating filter -->
        <div class="row between" style="margin-bottom:12px">
          <span>${t("min_rating")}</span>
          <select id="ratingFilter">
            <option value="">Any</option>
            <option value="4">4+ stars</option>
            <option value="4.5">4.5+ stars</option>
          </select>
        </div>
        
        <!-- Creator filter -->
        <div style="margin-bottom:12px">
          <span>${t("creator")}</span>
          <div class="row" style="gap:8px; flex-wrap:wrap; margin-top:8px">
            ${creators.map(c => {
              const isRecommended = aiEngine.getCreatorScore(c.id) > 0.3;
              return `
                <label class="chip ${isRecommended ? 'ai-recommended' : ''}" style="${isRecommended ? 'background:linear-gradient(45deg, var(--brand-3), var(--brand-2)); color:white' : ''}">
                  <input type="checkbox" data-creator="${c.id}" style="margin-inline-end:6px">
                  ${c.name} ${isRecommended ? '⭐' : ''}
                </label>
              `;
            }).join("")}
          </div>
        </div>
        
        <!-- Sort options with AI -->
        <div class="row between" style="margin-bottom:12px">
          <span>${t("sort_by")}</span>
          <select id="sortBy">
            <option value="ai_personalized">${t("ai_personalized")} 🤖</option>
            <option value="relevance">${t("relevance")}</option>
            <option value="price_low">${t("price_low_high")}</option>
            <option value="price_high">${t("price_high_low")}</option>
            <option value="rating">${t("highest_rated")}</option>
            <option value="newest">${t("newest")}</option>
            <option value="trending">${t("trending")} 🔥</option>
          </select>
        </div>
        
        <div class="row" style="gap:8px">
          <button class="secondary small" onclick="window.__applyFilters && window.__applyFilters()">
            ${t("apply_filters")}
          </button>
          <button class="ghost small" onclick="window.__clearFilters && window.__clearFilters()">
            ${t("clear_filters")}
          </button>
        </div>
      </div>
      
      <div id="resCount" role="status" aria-live="polite" class="muted" style="margin-bottom:8px">
        ${tn("results_count",{n:list.length})}
      </div>
      <div id="discoverResults" class="grid cards">
        ${list.map(p => CardWithAI(p, aiEngine.getRecommendationReason(p.id))).join("")}
      </div>
    </section>
  `);
  
  // Enhanced discover functionality with AI
  let currentFilters = {
    query: "",
    minPrice: null,
    maxPrice: null,
    rating: null,
    creators: [],
    sortBy: "ai_personalized"
  };
  
  let searchTimeout;
  let isShowingSuggestions = false;
  
  function filterAndSortProducts() {
    let results = state.products.slice();
    
    // AI-Enhanced Text search
    if (currentFilters.query) {
      const query = currentFilters.query.toLowerCase();
      
      // Track search
      aiEngine.trackSearch(query);
      
      // Basic text matching
      results = results.filter(p => 
        getProductField(p, 'name').toLowerCase().includes(query) ||
        getProductField(p, 'cat').toLowerCase().includes(query) ||
        creatorName(p.creatorId).toLowerCase().includes(query) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(query)))
      );
      
      // AI semantic search boost
      if (results.length === 0 && query.length > 3) {
        // If no direct matches, try AI-powered semantic search
        const semanticResults = aiEngine.getSemanticSearchResults(query);
        results = semanticResults.slice(0, 10);
      }
    }
    
    // Price range
    if (currentFilters.minPrice !== null) {
      results = results.filter(p => p.price >= currentFilters.minPrice);
    }
    if (currentFilters.maxPrice !== null) {
      results = results.filter(p => p.price <= currentFilters.maxPrice);
    }
    
    // Rating filter
    if (currentFilters.rating) {
      results = results.filter(p => p.rating >= parseFloat(currentFilters.rating));
    }
    
    // Creator filter
    if (currentFilters.creators.length > 0) {
      results = results.filter(p => currentFilters.creators.includes(p.creatorId));
    }
    
    // AI-Enhanced Sort
    switch (currentFilters.sortBy) {
      case "ai_personalized":
        // AI-powered personalized ranking
        results = aiEngine.rankSearchResults(results, currentFilters.query);
        break;
      case "price_low":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        results.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        results.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        results.reverse(); // Assuming products array is in chronological order
        break;
      case "trending":
        // AI-powered trending score
        results.sort((a, b) => aiEngine.getTrendingScore(b.id) - aiEngine.getTrendingScore(a.id));
        break;
      default: // relevance - keep original order
        break;
    }
    
    return results;
  }
  
  function updateResults() {
    const results = filterAndSortProducts();
    const host = document.getElementById("discoverResults");
    const rc = document.getElementById("resCount");
    const aiSummary = document.getElementById("aiSearchSummary");
    const aiSummaryText = document.getElementById("aiSummaryText");
    
    if (host) {
      host.innerHTML = results.length ? 
        results.map(p => CardWithAI(p, aiEngine.getRecommendationReason(p.id))).join("") : 
        `<div class="panel center muted">${t("no_products_found")}</div>`;
    }
    if (rc) {
      rc.textContent = tn("results_count", { n: results.length });
    }
    
    // Show AI insights for search results
    if (currentFilters.query && results.length > 0 && aiSummary && aiSummaryText) {
      const insights = aiEngine.getSearchInsights(currentFilters.query, results);
      aiSummaryText.textContent = insights;
      aiSummary.style.display = 'block';
    } else if (aiSummary) {
      aiSummary.style.display = 'none';
    }
  }
  
  // Enhanced AI-powered search functions
  window.__aiSearchInput = (term) => {
    clearTimeout(searchTimeout);
    
    const recentSearches = document.getElementById("recentSearches");
    if (recentSearches && term.length === 0) {
      recentSearches.style.display = 'block';
    } else if (recentSearches) {
      recentSearches.style.display = 'none';
    }
    
    searchTimeout = setTimeout(() => {
      currentFilters.query = term || "";
      updateResults();
      
      // Auto-show suggestions for certain queries
      if (term.length >= 2) {
        window.__showSearchSuggestions();
      }
    }, 300);
  };

  window.__discoverSearch = (term) => {
    currentFilters.query = term || "";
    updateResults();
  };

  window.__selectSuggestion = (term) => {
    const searchInput = document.getElementById("q");
    if (searchInput) {
      searchInput.value = term;
      currentFilters.query = term;
      aiEngine.trackSearch(term);
      updateResults();
      window.__hideSearchSuggestions();
    }
  };
  
  window.__selectCategory = (category) => {
    window.__trackCategoryClick(category);
    window.StoreZ.navigate(`#/category/${encodeURIComponent(category)}`);
    window.__hideSearchSuggestions();
  };
  
  window.__showSearchSuggestions = () => {
    const suggestions = document.getElementById("searchSuggestions");
    if (suggestions && !isShowingSuggestions) {
      isShowingSuggestions = true;
      suggestions.style.display = 'block';
      
      // Hide after 5 seconds of inactivity
      setTimeout(() => {
        if (isShowingSuggestions) window.__hideSearchSuggestions();
      }, 5000);
    }
  };
  
  window.__hideSearchSuggestions = () => {
    setTimeout(() => {
      const suggestions = document.getElementById("searchSuggestions");
      if (suggestions) {
        suggestions.style.display = 'none';
        isShowingSuggestions = false;
      }
    }, 150); // Small delay to allow clicks
  };
  
  window.__clearSearch = () => {
    const searchInput = document.getElementById("q");
    if (searchInput) {
      searchInput.value = '';
      currentFilters.query = '';
      updateResults();
      window.__hideSearchSuggestions();
    }
  };
  
  window.__showAISearchInsights = () => {
    const searchData = aiEngine.getSearchAnalytics();
    const insights = `
      <div style="padding:20px">
        <h2>🔍 ${t("search_insights")}</h2>
        
        <div style="margin:16px 0">
          <h4>${t("your_search_patterns")}</h4>
          <div class="grid" style="grid-template-columns:1fr 1fr; gap:8px">
            <div style="text-align:center; padding:12px; background:var(--bg-2); border-radius:6px">
              <div style="font-size:24px; font-weight:bold; color:var(--brand)">${searchData.totalSearches}</div>
              <div class="muted small">${t("total_searches")}</div>
            </div>
            <div style="text-align:center; padding:12px; background:var(--bg-2); border-radius:6px">
              <div style="font-size:24px; font-weight:bold; color:var(--brand-2)">${searchData.avgResultClicks}</div>
              <div class="muted small">${t("avg_clicks_per_search")}</div>
            </div>
          </div>
        </div>
        
        <div style="margin:16px 0">
          <h4>${t("top_search_terms")}</h4>
          ${searchData.topSearches.map(search => `
            <div class="row between" style="margin:4px 0; padding:8px; background:var(--bg-2); border-radius:6px">
              <span>${search.term}</span>
              <span class="chip">${search.count} ${t("searches")}</span>
            </div>
          `).join('')}
        </div>
        
        <div style="margin:16px 0">
          <h4>${t("search_recommendations")}</h4>
          <div class="row" style="gap:8px; flex-wrap:wrap">
            ${aiEngine.getSearchSuggestions().personalized.slice(0, 6).map(term => `
              <button class="chip" onclick="window.__selectSuggestion('${term}'); window.__hideSheet()">
                ${term}
              </button>
            `).join('')}
          </div>
        </div>
        
        <button class="ghost" onclick="window.__hideSheet()" style="width:100%; margin-top:20px">${t("close")}</button>
      </div>
    `;
    showSheet(insights);
  };
  
  window.__searchTag = (tag) => {
    const searchInput = document.getElementById("q");
    if (searchInput) {
      searchInput.value = tag;
      currentFilters.query = tag;
      aiEngine.trackSearch(tag);
      updateResults();
    }
  };

  window.__toggleFilters = () => {
    const panel = document.getElementById("filterPanel");
    if (panel) {
      panel.style.display = panel.style.display === "none" ? "block" : "none";
    }
  };
  
  window.__getAIFilterSuggestions = () => {
    const insights = document.getElementById("aiFilterInsights");
    const text = document.getElementById("aiFilterText");
    
    if (insights && text) {
      const suggestions = aiEngine.getFilterSuggestions(currentFilters.query);
      text.textContent = suggestions;
      insights.style.display = 'block';
      
      // Auto-hide after 8 seconds
      setTimeout(() => {
        insights.style.display = 'none';
      }, 8000);
    }
  };
  
  window.__setAIRecommendedPriceRange = () => {
    const priceRange = aiEngine.getRecommendedPriceRange();
    const minPrice = document.getElementById("minPrice");
    const maxPrice = document.getElementById("maxPrice");
    
    if (minPrice && maxPrice) {
      minPrice.value = priceRange.min;
      maxPrice.value = priceRange.max;
      
      // Show feedback
      const feedback = document.createElement('div');
      feedback.style.cssText = 'position:absolute; background:var(--brand); color:white; padding:4px 8px; border-radius:4px; font-size:12px; z-index:1000';
      feedback.textContent = t("ai_price_applied");
      minPrice.parentElement.appendChild(feedback);
      
      setTimeout(() => feedback.remove(), 2000);
    }
  };

  window.__applyFilters = () => {
    // Get filter values
    currentFilters.minPrice = parseFloat(document.getElementById("minPrice")?.value) || null;
    currentFilters.maxPrice = parseFloat(document.getElementById("maxPrice")?.value) || null;
    currentFilters.rating = document.getElementById("ratingFilter")?.value || null;
    currentFilters.sortBy = document.getElementById("sortBy")?.value || "ai_personalized";
    
    // Get selected creators
    const creatorCheckboxes = document.querySelectorAll('[data-creator]:checked');
    currentFilters.creators = Array.from(creatorCheckboxes).map(cb => cb.getAttribute('data-creator'));
    
    // Track filter usage for AI learning
    aiEngine.trackFilterUsage(currentFilters);
    
    updateResults();
  };

  window.__clearFilters = () => {
    // Reset filter values
    currentFilters = { 
      query: currentFilters.query, 
      minPrice: null, 
      maxPrice: null, 
      rating: null, 
      creators: [], 
      sortBy: "ai_personalized" 
    };
    
    // Reset form elements
    const elements = ["minPrice", "maxPrice", "ratingFilter", "sortBy"];
    elements.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = id === "sortBy" ? "ai_personalized" : "";
    });
    
    // Uncheck creator checkboxes
    document.querySelectorAll('[data-creator]').forEach(cb => cb.checked = false);
    
    updateResults();
  };
  
  // Initialize AI-enhanced search
  setTimeout(() => {
    const recentSearches = document.getElementById("recentSearches");
    if (recentSearches && aiEngine.getSearchSuggestions().recent.length > 0) {
      recentSearches.style.display = 'block';
    }
  }, 500);
}

function pdp(ctx, id) {
  const p = productById(id) || state.products[0];
  const c = creatorById(p.creatorId);
  const saved = state.wishlist.includes(p.id);
  const productName = getProductField(p, 'name');
  const productCat = getProductField(p, 'cat');
  
  // Enhanced product details with social commerce features
  const reviews = [
    {user: "Sarah M.", rating: 5, text: "Amazing quality! Perfect fit and great material. Highly recommended! 👌", verified: true, helpful: 12},
    {user: "Ahmed K.", rating: 4, text: "Good product, fast shipping. Love the design!", verified: true, helpful: 8},
    {user: "Fatima A.", rating: 5, text: "Exactly as described. Will definitely buy again! ⭐", verified: false, helpful: 5}
  ];
  
  const relatedProducts = state.products.filter(prod => 
    prod.id !== p.id && 
    getProductField(prod, 'cat') === productCat
  ).slice(0, 3);

  ctx.el.innerHTML = h(`
    <article class="panel">
      <!-- Back button -->
      <div class="row between" style="margin-bottom:16px">
        <button class="ghost small" onclick="window.StoreZ.goBack()" style="display:flex;align-items:center;gap:4px">
          <span>←</span> ${t("back")}
        </button>
        <button class="icon-btn ${saved ? "active" : ""}" data-action="toggle-wish" data-id="${p.id}" aria-pressed="${saved}" title="${saved ? t("unsave_item") : t("save_item")}">${saved ? "♥" : "♡"}</button>
      </div>
      
      <!-- Enhanced product images with gallery -->
      <div class="media" style="aspect-ratio:1/1; border-radius:12px; overflow:hidden; position:relative; margin-bottom:16px">
        <img src="${uns(p.img, 1200)}" alt="${productName}" id="mainProductImg"/>
        <div class="row" style="position:absolute; bottom:8px; left:8px; gap:4px">
          <div style="width:40px; height:40px; border-radius:6px; overflow:hidden; border:2px solid white; opacity:0.8; cursor:pointer" onclick="document.getElementById('mainProductImg').src='${uns(p.img, 1200)}'">
            <img src="${uns(p.img, 200)}" style="width:100%; height:100%; object-fit:cover" alt="View 1"/>
          </div>
          <div style="width:40px; height:40px; border-radius:6px; overflow:hidden; border:2px solid white; opacity:0.8; cursor:pointer" onclick="document.getElementById('mainProductImg').src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=70'">
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=200&q=70" style="width:100%; height:100%; object-fit:cover" alt="View 2"/>
          </div>
        </div>
      </div>
      
      <!-- Product header with enhanced details -->
      <h2 style="margin:0 0 8px">${productName}</h2>
      <div class="muted" style="margin-bottom:8px">
        ${t("by_creator")} ${c ? `<a href="#/creator/${c.id}" style="color:var(--brand); text-decoration:none; font-weight:500">${c.name}</a>` : "—"} · ${stars(p.rating)} (${Math.floor(Math.random() * 200 + 50)} ${t("reviews")})
      </div>
      
      <!-- Breadcrumb -->
      <div class="muted" style="font-size:12px; margin:8px 0">
        <a href="#/home" style="color:var(--brand); text-decoration:none">Home</a> / 
        <a href="#/category/${encodeURIComponent(productCat)}" style="color:var(--brand); text-decoration:none">${productCat}</a> / 
        ${productName}
      </div>

      <!-- Enhanced pricing with badges -->
      <div class="row between" style="margin:16px 0; align-items:center">
        <div class="row" style="gap:8px; align-items:center">
          <span class="price" style="font-size:24px; font-weight:bold">${fmt(p.price)}</span>
          ${p.listPrice ? `<span class="strike" style="font-size:16px; color:var(--muted)">${fmt(p.listPrice)}</span>` : ""}
          ${p.listPrice ? `<span class="chip" style="background:var(--good); color:white; font-size:12px">${Math.round((1-p.price/p.listPrice)*100)}% OFF</span>` : ""}
        </div>
        <div class="row" style="gap:8px">
          <span class="chip" style="background:${p.stock > 10 ? 'var(--good)' : p.stock > 5 ? 'orange' : 'var(--bad)'}; color:white">${t("stock")}: ${p.stock}</span>
          ${p.stock < 10 ? `<span class="chip" style="background:var(--brand); color:white; animation:pulse 2s infinite">🔥 ${t("limited_stock")}</span>` : ""}
        </div>
      </div>

      <hr/>
      
      <!-- Enhanced product options -->
      <div style="margin:16px 0">
        <strong style="display:block; margin-bottom:8px">${t("size")}:</strong>
        <div class="row" style="gap:6px; flex-wrap:wrap; margin-bottom:12px">
          <label class="chip" style="cursor:pointer; transition:all 0.2s"><input type="radio" name="size" checked style="margin-inline-end:6px">S</label>
          <label class="chip" style="cursor:pointer; transition:all 0.2s"><input type="radio" name="size" style="margin-inline-end:6px">M</label>
          <label class="chip" style="cursor:pointer; transition:all 0.2s"><input type="radio" name="size" style="margin-inline-end:6px">L</label>
          <label class="chip" style="cursor:pointer; transition:all 0.2s"><input type="radio" name="size" style="margin-inline-end:6px">XL</label>
        </div>
        
        <strong style="display:block; margin-bottom:8px">${t("color")}:</strong>
        <div class="row" style="gap:6px; flex-wrap:wrap">
          <label class="chip" style="cursor:pointer; transition:all 0.2s"><input type="radio" name="color" checked style="margin-inline-end:6px">${t("black")}</label>
          <label class="chip" style="cursor:pointer; transition:all 0.2s"><input type="radio" name="color" style="margin-inline-end:6px">${t("white")}</label>
          <label class="chip" style="cursor:pointer; transition:all 0.2s"><input type="radio" name="color" style="margin-inline-end:6px">${t("mint")}</label>
        </div>
      </div>

      <hr/>
      
      <!-- Enhanced product details with expandable sections -->
      <details open style="margin:16px 0"><summary style="cursor:pointer; font-weight:bold; padding:8px 0">${t("product_details")}</summary>
        <div style="padding:8px 0">
          <ul style="margin:8px 0; padding-left:20px">
            <li>${t("breathable_upper")} · ${t("lightweight_foam")}</li>
            <li>${t("premium_materials")}</li>
            <li>${t("sustainable_packaging")}</li>
            <li>${t("ethical_manufacturing")}</li>
          </ul>
        </div>
      </details>
      
      <details style="margin:16px 0"><summary style="cursor:pointer; font-weight:bold; padding:8px 0">${t("shipping_returns")}</summary>
        <div style="padding:8px 0">
          <ul style="margin:8px 0; padding-left:20px">
            <li>${t("free_returns_30_days")}</li>
            <li>${t("ships_2_5_days")}</li>
            <li>${t("express_next_day")}</li>
            <li>${t("free_shipping_over")} ${fmt(200)}</li>
          </ul>
        </div>
      </details>
      
      <details style="margin:16px 0"><summary style="cursor:pointer; font-weight:bold; padding:8px 0">${t("size_fit_guide")}</summary>
        <div style="padding:8px 0">
          <p style="margin:8px 0">${t("size_guide_desc")}</p>
          <div style="background:var(--bg2); padding:12px; border-radius:8px; margin:8px 0">
            <strong>S:</strong> 36-38 | <strong>M:</strong> 38-40 | <strong>L:</strong> 40-42 | <strong>XL:</strong> 42-44
          </div>
        </div>
      </details>

      <details style="margin:16px 0"><summary style="cursor:pointer; font-weight:bold; padding:8px 0">${t("qa_section")} (${reviews.length})</summary>
        <div style="padding:8px 0">
          ${reviews.map(review => `
            <div style="border-bottom:1px solid var(--border); padding:12px 0">
              <div class="row between" style="margin-bottom:4px">
                <strong>${review.user}</strong>
                <div class="row" style="gap:4px">
                  ${stars(review.rating)}
                  ${review.verified ? `<span class="chip" style="background:var(--good); color:white; font-size:10px">✓ ${t("verified")}</span>` : ""}
                </div>
              </div>
              <p style="margin:4px 0; color:var(--text-secondary)">${review.text}</p>
              <div class="muted" style="font-size:12px">${review.helpful} ${t("found_helpful")}</div>
            </div>
          `).join("")}
          <button class="ghost small" style="margin-top:8px" onclick="window.StoreZ.showSheet(\`
            <h3>${t("write_review")}</h3>
            <div style='margin:16px 0'>
              <strong>${t("your_rating")}:</strong><br>
              <div class='row' style='gap:4px; margin:8px 0'>
                <span onclick='this.parentElement.setAttribute(\"data-rating\",\"1\")' style='font-size:24px; cursor:pointer'>⭐</span>
                <span onclick='this.parentElement.setAttribute(\"data-rating\",\"2\")' style='font-size:24px; cursor:pointer'>⭐</span>
                <span onclick='this.parentElement.setAttribute(\"data-rating\",\"3\")' style='font-size:24px; cursor:pointer'>⭐</span>
                <span onclick='this.parentElement.setAttribute(\"data-rating\",\"4\")' style='font-size:24px; cursor:pointer'>⭐</span>
                <span onclick='this.parentElement.setAttribute(\"data-rating\",\"5\")' style='font-size:24px; cursor:pointer'>⭐</span>
              </div>
            </div>
            <textarea placeholder='${t("share_experience")}' style='width:100%; min-height:100px; margin:8px 0'></textarea>
            <div class='flex' style='gap:12px; margin-top:16px'>
              <button class='btn secondary flex-1' onclick='window.__hideSheet()'>${t("submit_review")}</button>
              <button class='btn ghost' onclick='window.__hideSheet()'>${t("cancel")}</button>
            </div>
          \`);">${t("write_review")}</button>
        </div>
      </details>

      <hr/>
      
      <!-- Enhanced action buttons -->
      <div class="row" style="gap:8px; margin:16px 0">
        <button class="secondary" data-action="add-to-cart" data-id="${p.id}" style="flex:2; padding:12px; font-weight:bold">${t("add_to_cart")}</button>
        <button class="ghost" data-action="buy-now" data-id="${p.id}" style="flex:1; padding:12px">${t("buy_now")}</button>
        <button class="icon-btn ${saved ? "active" : ""}" data-action="toggle-wish" data-id="${p.id}" aria-pressed="${saved}" title="${saved ? t("unsave_item") : t("save_item")}" style="padding:12px">${saved ? "♥" : "♡"}</button>
        <button class="icon-btn" title="${t("share")}" style="padding:12px" onclick="(function(){const txt='${productName} — ${fmt(p.price)} #StoreZ'; if(navigator.share){navigator.share({title:'${productName}', text:txt, url:location.href}).catch(()=>{});} else {navigator.clipboard.writeText(txt+' '+location.href); window.StoreZ.toast('${t("copied_to_clipboard")}'); } })()">↗</button>
      </div>

      <!-- Related products section -->
      ${relatedProducts.length > 0 ? `
        <hr/>
        <div style="margin:24px 0">
          <h3 style="margin:0 0 16px">${t("you_might_also_like")}</h3>
          <div class="grid cols-3" style="gap:12px">
            ${relatedProducts.map(rp => {
              const rpName = getProductField(rp, 'name');
              return `
                <div class="card" style="cursor:pointer" onclick="window.StoreZ.navigate('#/pdp/${rp.id}')">
                  <div class="media" style="aspect-ratio:1/1">
                    <img src="${uns(rp.img, 400)}" alt="${rpName}"/>
                  </div>
                  <div class="body" style="padding:8px">
                    <strong style="font-size:14px">${rpName}</strong>
                    <div class="price" style="margin-top:4px">${fmt(rp.price)}</div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      ` : ""}
    </article>
  `);
}

function creator(ctx, id) {
  const c = creatorById(id) || state.creators[0];
  const creatorProducts = state.products.filter(p => p.creatorId === c.id);
  const isFollowing = state.user.followedCreators && state.user.followedCreators.includes(c.id);
  const totalSales = creatorProducts.reduce((sum, p) => sum + (p.price * Math.floor(Math.random() * 50)), 0);
  
  ctx.el.innerHTML = h(`
    <section class="panel">
      <!-- Back button -->
      <div style="margin-bottom:16px">
        <button class="ghost small" onclick="window.StoreZ.goBack()" style="display:flex;align-items:center;gap:4px">
          <span>←</span> ${t("back")}
        </button>
      </div>
      
      <!-- Creator header -->
      <div class="row between" style="margin-bottom:20px">
        <div class="row" style="gap:12px">
          <!-- Creator avatar -->
          <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--brand),var(--brand-2));display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:24px">
            ${c.name[0]}
          </div>
          <div>
            <h2 style="margin:0">${c.name}</h2>
            <div class="muted">${c.handle}</div>
            <div class="muted">${c.bio}</div>
            <div class="row" style="gap:16px; margin-top:8px">
              <span class="muted">${tn("followers_count", {n: c.followers})}</span>
              <span class="muted">${creatorProducts.length} ${t("products")}</span>
              ${c.live ? `<span class="chip" style="background:var(--danger,#ff4444); color:white; animation:pulse 2s infinite">● LIVE</span>` : ""}
            </div>
          </div>
        </div>
        
        <!-- Follow button -->
        <div style="text-align:right">
          <button class="secondary ${isFollowing ? 'active' : ''}" 
                  onclick="window.__toggleFollow && window.__toggleFollow('${c.id}')"
                  style="${isFollowing ? 'background:var(--ok,#4caf50); border-color:var(--ok,#4caf50)' : ''}">
            ${isFollowing ? t("following") : t("follow")}
          </button>
          ${c.live ? `
            <button class="chip" onclick="window.StoreZ.navigate('#/live/${c.id}')" 
                    style="background:var(--danger,#ff4444); color:white; display:block; margin-top:8px">
              ${t("join_live")}
            </button>
          ` : ''}
        </div>
      </div>
      
      <!-- Creator stats -->
      <div class="panel" style="background:var(--panel); margin-bottom:20px">
        <div class="grid" style="grid-template-columns:1fr 1fr 1fr; gap:16px; text-align:center">
          <div>
            <strong style="display:block">${fmt(Math.floor(totalSales))}</strong>
            <span class="muted">${t("total_sales")}</span>
          </div>
          <div>
            <strong style="display:block">${(4.2 + Math.random() * 0.6).toFixed(1)} ⭐</strong>
            <span class="muted">${t("avg_rating")}</span>
          </div>
          <div>
            <strong style="display:block">${Math.floor(c.followers / 1000)}K</strong>
            <span class="muted">${t("followers")}</span>
          </div>
        </div>
      </div>
      
      <!-- Creator actions -->
      <div class="row" style="gap:8px; margin-bottom:20px">
        <button class="ghost" onclick="window.__shareCreator && window.__shareCreator('${c.id}')" style="flex:1">
          📤 ${t("share")}
        </button>
        <button class="ghost" onclick="window.StoreZ.navigate('#/messages?creator=${c.id}')" style="flex:1">
          💬 ${t("message")}
        </button>
        ${!state.user.guest ? `
          <button class="ghost" onclick="window.__reportCreator && window.__reportCreator('${c.id}')">
            🚨 ${t("report")}
          </button>
        ` : ''}
      </div>
      
      <!-- Products grid header -->
      <div class="row between" style="margin-bottom:12px">
        <h3>${t("products")} (${creatorProducts.length})</h3>
        <select id="creatorSort" onchange="window.__sortCreatorProducts && window.__sortCreatorProducts(this.value)">
          <option value="newest">${t("newest")}</option>
          <option value="popular">${t("most_popular")}</option>
          <option value="price_low">${t("price_low_high")}</option>
          <option value="price_high">${t("price_high_low")}</option>
        </select>
      </div>
      
      <!-- Products grid -->
      <div id="creatorProductsGrid" class="grid cards">
        ${creatorProducts.length ? creatorProducts.map(Card).join("") : `
          <div class="panel center muted" style="grid-column:1/-1">
            ${t("no_products_yet")}
          </div>
        `}
      </div>
      
      ${creatorProducts.length > 6 ? `
        <div style="text-align:center; margin-top:16px">
          <button class="ghost" onclick="window.__loadMoreProducts && window.__loadMoreProducts()">
            ${t("load_more")}
          </button>
        </div>
      ` : ''}
    </section>
  `);
  
  // Creator profile functions
  window.__toggleFollow = (creatorId) => {
    if (state.user.guest) {
      if (confirm(t("sign_up_to_follow"))) {
        navigate("#/auth");
      }
      return;
    }
    
    if (!state.user.followedCreators) {
      state.user.followedCreators = [];
    }
    
    const isFollowing = state.user.followedCreators.includes(creatorId);
    if (isFollowing) {
      state.user.followedCreators = state.user.followedCreators.filter(id => id !== creatorId);
    } else {
      state.user.followedCreators.push(creatorId);
    }
    
    actions.saveState(state);
    
    // Re-render the page to update follow button
    route();
  };
  
  window.__shareCreator = (creatorId) => {
    const creator = creatorById(creatorId);
    const shareData = {
      title: `Check out ${creator.name} on StoreZ`,
      text: `${creator.bio} - Follow ${creator.handle} for amazing products!`,
      url: `${location.origin}${location.pathname}#/creator/${creatorId}`
    };
    
    if (navigator.share) {
      navigator.share(shareData);
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareData.url).then(() => {
        alert(t("link_copied"));
      });
    }
  };
  
  window.__reportCreator = (creatorId) => {
    const reasons = [t("spam"), t("inappropriate_content"), t("fake_products"), t("other")];
    const reason = prompt(t("report_reason") + "\\n\\n" + reasons.map((r, i) => `${i+1}. ${r}`).join("\\n"));
    
    if (reason) {
      // Simulate reporting
      alert(t("report_submitted"));
    }
  };
  
  window.__sortCreatorProducts = (sortBy) => {
    const creatorId = location.hash.split('/')[2];
    const creator = creatorById(creatorId);
    let products = state.products.filter(p => p.creatorId === creator.id);
    
    switch (sortBy) {
      case "popular":
        products.sort((a, b) => b.rating - a.rating);
        break;
      case "price_low":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        products.sort((a, b) => b.price - a.price);
        break;
      default: // newest
        products.reverse();
        break;
    }
    
    const grid = document.getElementById("creatorProductsGrid");
    if (grid) {
      grid.innerHTML = products.map(Card).join("");
    }
  };
  
  window.__loadMoreProducts = () => {
    // Simulate loading more products
    alert(t("no_more_products"));
  };
}

function cart(ctx) {
  const items = state.cart.slice();
  const rows = items.map(it => {
    const p = productById(it.id);
    return `
    <div class="item">
      <div class="item" style="width:64px;height:64px;border-radius:10px;background:linear-gradient(135deg,#2a2655,#0e3d57)"></div>
      <div style="flex:1">
        <div class="row between">
          <a href="#/pdp/${p.id}"><strong>${p.name}</strong></a>
          <button class="small ghost danger" type="button" onclick="window.StoreZ.actions.removeFromCart('${p.id}'); window.StoreZ.navigate('#/cart')">${t("remove")}</button>
        </div>
        <div class="row between">
          <div class="muted">${fmt(it.price)} · ${p.cat}</div>
          <div class="row">
            <button class="small ghost" type="button" onclick="window.StoreZ.actions.setQty('${p.id}', ${it.qty - 1}); window.StoreZ.navigate('#/cart')">−</button>
            <span style="min-width:28px; text-align:center">${it.qty}</span>
            <button class="small ghost" type="button" onclick="window.StoreZ.actions.setQty('${p.id}', ${it.qty + 1}); window.StoreZ.navigate('#/cart')">＋</button>
          </div>
        </div>
      </div>
    </div>`;
  }).join("");
  ctx.el.innerHTML = h(`
    <section class="panel">
      <strong>${t("your_cart")}</strong>
      <div class="list" style="margin-top:10px">${rows || `<div class="muted center">${t("cart_empty")}</div>`}</div>
      <hr/>
      <div class="row between"><span>${t("subtotal")}</span><span id="totalsLive" aria-live="polite">${fmt(cartTotal())}</span></div>
      <div class="row" style="gap:8px; margin-top:10px">
        <button class="secondary" type="button" ${items.length ? "" : "disabled"} onclick="window.StoreZ.navigate('#/checkout')">${t("checkout")}</button>
        <button class="ghost" type="button" onclick="window.StoreZ.navigate('#/discover')">${t("add_more")}</button>
      </div>
    </section>
  `);
}

function checkout(ctx) {
  const items = state.cart.slice();
  if (!items.length) {
    ctx.el.innerHTML = h(`
      <section class="panel center">
        <p class="muted">${t("cart_empty")}</p>
        <button class="secondary" type="button" onclick="window.StoreZ.navigate('#/discover')">${t("nav_discover")}</button>
      </section>
    `);
    return;
  }

  // Get or initialize checkout step
  const step = parseInt(new URLSearchParams(location.search).get('step')) || 1;
  const maxStep = state.user.guest ? 4 : 3; // Guest needs account step
  
  const shipping = 15;
  const tax = Math.round(cartTotal() * 0.05);
  const total = cartTotal() + shipping + tax;

  // Step navigation
  const stepNav = `
    <div class="checkout-steps" style="display:flex; justify-content:center; margin-bottom:20px; gap:8px;">
      ${Array.from({length: maxStep}, (_, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === step;
        const isCompleted = stepNum < step;
        const isClickable = stepNum <= step;
        
        return `
          <div class="step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}" 
               style="width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; 
                      background:${isCompleted ? 'var(--success)' : isActive ? 'var(--brand)' : 'var(--bg-2)'}; 
                      color:${isCompleted || isActive ? 'white' : 'var(--text-muted)'}; 
                      cursor:${isClickable ? 'pointer' : 'default'};
                      transition: all 0.2s ease;"
               ${isClickable ? `onclick="window.StoreZ.navigate('#/checkout?step=${stepNum}')"` : ''}>
            ${isCompleted ? '✓' : stepNum}
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Step content
  let stepContent = '';
  
  if (step === 1) {
    // Step 1: Cart Review & Quantities
    stepContent = `
      <div class="step-content">
        <h3>${t("review_cart")}</h3>
        <div class="list" style="margin-top:16px">
          ${items.map(it => {
            const p = productById(it.id);
            const productName = getProductField(p, 'name');
            const productImage = p.img || `https://images.unsplash.com/photo-${p.unsplash}?auto=format&fit=crop&w=300&q=70`;
            
            return `
              <div class="item" style="padding:12px; border:1px solid var(--border); border-radius:8px; margin-bottom:8px;">
                <img src="${productImage}" alt="${productName}" style="width:64px; height:64px; object-fit:cover; border-radius:8px;">
                <div style="flex:1; margin-left:12px;">
                  <div class="row between">
                    <strong>${productName}</strong>
                    <button class="small ghost danger" type="button" onclick="window.StoreZ.actions.removeFromCart('${p.id}'); window.StoreZ.navigate('#/checkout?step=1')">${t("remove")}</button>
                  </div>
                  <div class="row between" style="margin-top:8px;">
                    <div class="muted">${fmt(it.price)} ${t("each")}</div>
                    <div class="row" style="align-items:center; gap:8px;">
                      <button class="small ghost" type="button" onclick="window.StoreZ.actions.setQty('${p.id}', ${it.qty - 1}); window.StoreZ.navigate('#/checkout?step=1')" ${it.qty <= 1 ? 'disabled' : ''}>−</button>
                      <span style="min-width:28px; text-align:center; padding:4px 8px; border:1px solid var(--border); border-radius:4px;">${it.qty}</span>
                      <button class="small ghost" type="button" onclick="window.StoreZ.actions.setQty('${p.id}', ${it.qty + 1}); window.StoreZ.navigate('#/checkout?step=1')">+</button>
                    </div>
                  </div>
                  <div class="row between" style="margin-top:4px;">
                    <span>${t("subtotal")}:</span>
                    <strong>${fmt(it.qty * it.price)}</strong>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
        
        <div style="margin-top:20px; padding:16px; background:var(--bg-2); border-radius:8px;">
          <div class="row between"><span>${t("cart_subtotal")}</span><span>${fmt(cartTotal())}</span></div>
          <div class="row between"><span>${t("shipping")}</span><span>${fmt(shipping)}</span></div>
          <div class="row between"><span>${t("tax")}</span><span>${fmt(tax)}</span></div>
          <hr style="margin:8px 0;"/>
          <div class="row between"><strong>${t("total")}</strong><strong>${fmt(total)}</strong></div>
        </div>
      </div>
    `;
  }
  
  else if (step === 2 && state.user.guest) {
    // Step 2: Guest Account Creation (only for guests)
    stepContent = `
      <div class="step-content">
        <h3>${t("guest_checkout")}</h3>
        <p class="muted">${t("guest_checkout_desc")}</p>
        
        <div style="margin-top:20px;">
          <label>${t("email")} *
            <input type="email" id="guest_email" placeholder="${t("email_placeholder")}" style="margin-top:4px;" required>
          </label>
          
          <label style="margin-top:12px;">${t("phone")} *
            <input type="tel" id="guest_phone" placeholder="+966 50 123 4567" style="margin-top:4px;" required>
          </label>
          
          <label style="margin-top:12px; display:flex; align-items:center; gap:8px;">
            <input type="checkbox" id="guest_marketing">
            ${t("marketing_consent")}
          </label>
          
          <div class="row" style="gap:8px; margin-top:20px; padding:12px; background:var(--bg-2); border-radius:8px;">
            <div style="flex:1;">
              <strong>${t("create_account_option")}</strong>
              <p class="muted small">${t("account_benefits")}</p>
            </div>
            <button class="ghost small" onclick="window.StoreZ.navigate('#/auth?redirect=checkout')">${t("sign_up")}</button>
          </div>
        </div>
      </div>
    `;
  }
  
  else if ((step === 2 && !state.user.guest) || (step === 3 && state.user.guest)) {
    // Step 2/3: Shipping Address
    const addresses = state.user.addresses || [];
    const defaultAddr = addresses.find(a => a.default) || addresses[0];
    
    stepContent = `
      <div class="step-content">
        <h3>${t("shipping_address")}</h3>
        
        ${addresses.length > 0 ? `
          <div style="margin-top:16px;">
            <h4>${t("saved_addresses")}</h4>
            ${addresses.map((addr, i) => `
              <div class="address-option" style="padding:12px; border:1px solid var(--border); border-radius:8px; margin-bottom:8px; cursor:pointer;"
                   onclick="window.__selectAddress(${i})">
                <div class="row between">
                  <div>
                    <strong>${addr.name}</strong>
                    ${addr.default ? `<span class="chip small success">${t("default")}</span>` : ''}
                  </div>
                  <input type="radio" name="address" value="${i}" ${addr.default ? 'checked' : ''}>
                </div>
                <div class="muted">${addr.address}</div>
                <div class="muted">${addr.city}, ${addr.postal}</div>
              </div>
            `).join('')}
            
            <button class="ghost" type="button" onclick="window.__toggleNewAddress()" style="margin-top:8px;">
              + ${t("add_new_address")}
            </button>
          </div>
          
          <div id="newAddressForm" style="display:none; margin-top:16px; padding:16px; border:1px dashed var(--border); border-radius:8px;">
        ` : `<div style="margin-top:16px;">`}
        
            <h4>${addresses.length > 0 ? t("new_address") : t("delivery_address")}</h4>
            <div style="margin-top:12px;">
              <label>${t("full_name")} *
                <input type="text" id="addr_name" placeholder="${t("name_placeholder")}" style="margin-top:4px;" required>
              </label>
              
              <label style="margin-top:12px;">${t("address_line")} *
                <input type="text" id="addr_line" placeholder="${t("address_placeholder")}" style="margin-top:4px;" required>
              </label>
              
              <div class="row" style="gap:12px; margin-top:12px;">
                <label style="flex:1;">${t("city")} *
                  <select id="addr_city" style="margin-top:4px;" required>
                    <option value="">${t("select_city")}</option>
                    <option value="riyadh">${t("riyadh")}</option>
                    <option value="jeddah">${t("jeddah")}</option>
                    <option value="dammam">${t("dammam")}</option>
                    <option value="khobar">${t("khobar")}</option>
                    <option value="mecca">${t("mecca")}</option>
                    <option value="medina">${t("medina")}</option>
                  </select>
                </label>
                <label style="flex:1;">${t("postal_code")} *
                  <input type="text" id="addr_postal" placeholder="12345" maxlength="5" style="margin-top:4px;" required>
                </label>
              </div>
              
              <label style="margin-top:12px; display:flex; align-items:center; gap:8px;">
                <input type="checkbox" id="addr_default">
                ${t("set_default_address")}
              </label>
            </div>
            
        ${addresses.length > 0 ? `</div>` : `</div>`}
      </div>
    `;
  }
  
  else if ((step === 3 && !state.user.guest) || (step === 4 && state.user.guest)) {
    // Step 3/4: Saudi Payment Methods
    const cards = state.user.paymentMethods || [];
    const userLang = getLang();
    
    stepContent = `
      <div class="step-content">
        <h3>${t("payment_method")}</h3>
        <p class="muted small">${t("select_payment_method")}</p>
        
        <div style="margin-top:20px;">
          <!-- Saudi Digital Payment Options -->
          <div class="payment-section">
            <h4 style="margin-bottom:12px;">${t("digital_payments")} 💳</h4>
            
            <!-- Mada Pay (Saudi's national payment system) -->
            <div class="payment-option mada-pay" style="padding:16px; border:2px solid #00A651; border-radius:12px; margin-bottom:12px; cursor:pointer; background:linear-gradient(135deg, #00A651, #4CAF50); color:white; position:relative; overflow:hidden;"
                 onclick="window.__selectPayment('mada')">
              <div class="payment-bg" style="position:absolute; top:0; right:0; width:100px; height:100px; background:url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"50\" cy=\"50\" r=\"40\" fill=\"rgba(255,255,255,0.1)\"/></svg>'); background-size:cover;"></div>
              <div class="row between" style="position:relative; z-index:1;">
                <div class="row" style="align-items:center; gap:12px;">
                  <div style="width:48px; height:48px; background:white; border-radius:12px; display:flex; align-items:center; justify-content:center; font-weight:bold; color:#00A651; font-size:14px;">
                    مدى
                  </div>
                  <div>
                    <strong>${t("mada_pay")}</strong>
                    <div class="small" style="opacity:0.9;">${t("mada_desc")}</div>
                    <div class="tiny" style="opacity:0.7; margin-top:2px;">⚡ ${t("instant_payment")} • 🔒 ${t("secure")}</div>
                  </div>
                </div>
                <input type="radio" name="payment" value="mada" checked style="transform:scale(1.2);">
              </div>
            </div>
            
            <!-- Apple Pay (if available) -->
            ${window.ApplePaySession ? `
            <div class="payment-option apple-pay" style="padding:16px; border:2px solid #000; border-radius:12px; margin-bottom:12px; cursor:pointer; background:linear-gradient(135deg, #000, #333); color:white;"
                 onclick="window.__selectPayment('applepay')">
              <div class="row between">
                <div class="row" style="align-items:center; gap:12px;">
                  <div style="width:48px; height:48px; background:white; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:24px;">
                    🍎
                  </div>
                  <div>
                    <strong>Apple Pay</strong>
                    <div class="small" style="opacity:0.9;">${t("applepay_desc")}</div>
                    <div class="tiny" style="opacity:0.7; margin-top:2px;">📱 ${t("touch_id")} • 🔒 ${t("secure")}</div>
                  </div>
                </div>
                <input type="radio" name="payment" value="applepay">
              </div>
            </div>
            ` : ''}
            
            <!-- STC Pay -->
            <div class="payment-option stc-pay" style="padding:16px; border:2px solid #8E44AD; border-radius:12px; margin-bottom:12px; cursor:pointer; background:linear-gradient(135deg, #8E44AD, #9B59B6); color:white;"
                 onclick="window.__selectPayment('stcpay')">
              <div class="row between">
                <div class="row" style="align-items:center; gap:12px;">
                  <div style="width:48px; height:48px; background:white; border-radius:12px; display:flex; align-items:center; justify-content:center; font-weight:bold; color:#8E44AD; font-size:12px;">
                    STC
                  </div>
                  <div>
                    <strong>STC Pay</strong>
                    <div class="small" style="opacity:0.9;">${t("stcpay_desc")}</div>
                    <div class="tiny" style="opacity:0.7; margin-top:2px;">📱 ${t("mobile_wallet")} • 💸 ${t("cashback")}</div>
                  </div>
                </div>
                <input type="radio" name="payment" value="stcpay">
              </div>
            </div>
            
            <!-- Urpay -->
            <div class="payment-option urpay" style="padding:16px; border:2px solid #FF6B35; border-radius:12px; margin-bottom:12px; cursor:pointer; background:linear-gradient(135deg, #FF6B35, #FF8C42); color:white;"
                 onclick="window.__selectPayment('urpay')">
              <div class="row between">
                <div class="row" style="align-items:center; gap:12px;">
                  <div style="width:48px; height:48px; background:white; border-radius:12px; display:flex; align-items:center; justify-content:center; font-weight:bold; color:#FF6B35; font-size:12px;">
                    urpay
                  </div>
                  <div>
                    <strong>urpay</strong>
                    <div class="small" style="opacity:0.9;">${t("urpay_desc")}</div>
                    <div class="tiny" style="opacity:0.7; margin-top:2px;">🎁 ${t("rewards")} • ⚡ ${t("fast_payment")}</div>
                  </div>
                </div>
                <input type="radio" name="payment" value="urpay">
              </div>
            </div>
          </div>
          
          <!-- Credit/Debit Cards -->
          <div class="payment-section" style="margin-top:24px;">
            <h4 style="margin-bottom:12px;">${t("credit_debit_cards")} 💳</h4>
            
            ${cards.length > 0 ? `
              <!-- Saved Cards -->
              ${cards.map((card, i) => `
                <div class="payment-option saved-card" style="padding:14px; border:1px solid var(--border); border-radius:12px; margin-bottom:8px; cursor:pointer; transition:all 0.2s ease;"
                     onclick="window.__selectPayment('card-${i}')">
                  <div class="row between">
                    <div class="row" style="align-items:center; gap:12px;">
                      <div class="card-icon" style="width:40px; height:28px; background:${card.type === 'visa' ? 'linear-gradient(135deg, #1a1f71, #4c6ef5)' : card.type === 'mastercard' ? 'linear-gradient(135deg, #eb001b, #ff6b35)' : card.type === 'mada' ? 'linear-gradient(135deg, #00A651, #4CAF50)' : 'linear-gradient(135deg, #006fcf, #0099ff)'}; border-radius:6px; display:flex; align-items:center; justify-content:center; color:white; font-size:8px; font-weight:bold; text-transform:uppercase;">
                        ${card.type === 'mada' ? 'مدى' : card.type}
                      </div>
                      <div>
                        <strong>•••• •••• •••• ${card.last4}</strong>
                        <div class="muted small">${card.name} • ${t("expires")} ${card.expiry}</div>
                      </div>
                    </div>
                    <div class="row" style="align-items:center; gap:8px;">
                      ${card.isDefault ? `<span class="chip tiny success">${t("default")}</span>` : ''}
                      <input type="radio" name="payment" value="card-${i}">
                    </div>
                  </div>
                </div>
              `).join('')}
            ` : ''}
            
            <!-- Add New Card -->
            <button class="ghost payment-add-btn" type="button" onclick="window.__toggleNewCard()" style="width:100%; padding:14px; border:2px dashed var(--border); border-radius:12px; margin-top:8px; transition:all 0.2s ease;">
              <div class="row center" style="gap:8px;">
                <span style="font-size:20px;">+</span>
                <span>${t("add_new_card")}</span>
              </div>
            </button>
            
            <div id="newCardForm" style="display:none; margin-top:16px; padding:20px; border:1px solid var(--border); border-radius:12px; background:var(--panel);">
              <h4 style="margin-bottom:16px;">${t("add_payment_method")}</h4>
              
              <!-- Card Type Selection -->
              <div style="margin-bottom:16px;">
                <label class="small muted" style="margin-bottom:8px; display:block;">${t("card_type")}</label>
                <div class="row" style="gap:8px; flex-wrap:wrap;">
                  <label class="card-type-option" style="padding:8px 12px; border:2px solid var(--border); border-radius:8px; cursor:pointer; transition:all 0.2s ease;">
                    <input type="radio" name="cardType" value="mada" checked style="margin-right:8px;">
                    <span style="font-weight:bold; color:#00A651;">مدى Mada</span>
                  </label>
                  <label class="card-type-option" style="padding:8px 12px; border:2px solid var(--border); border-radius:8px; cursor:pointer; transition:all 0.2s ease;">
                    <input type="radio" name="cardType" value="visa" style="margin-right:8px;">
                    <span style="font-weight:bold; color:#1a1f71;">Visa</span>
                  </label>
                  <label class="card-type-option" style="padding:8px 12px; border:2px solid var(--border); border-radius:8px; cursor:pointer; transition:all 0.2s ease;">
                    <input type="radio" name="cardType" value="mastercard" style="margin-right:8px;">
                    <span style="font-weight:bold; color:#eb001b;">Mastercard</span>
                  </label>
                </div>
              </div>
              
              <div style="margin-bottom:16px;">
                <label class="small muted">${t("card_number")} *</label>
                <input type="text" id="card_number" placeholder="1234 5678 9012 3456" maxlength="19" 
                       style="margin-top:4px; padding:12px; border:2px solid var(--border); border-radius:8px; font-size:16px; letter-spacing:1px;" 
                       oninput="window.__formatCardNumber(this)" required>
                <div class="tiny muted" style="margin-top:4px;">${t("card_number_secure")}</div>
              </div>
              
              <div class="row" style="gap:12px; margin-bottom:16px;">
                <div style="flex:1;">
                  <label class="small muted">${t("expiry_date")} *</label>
                  <input type="text" id="card_expiry" placeholder="MM/YY" maxlength="5" 
                         style="margin-top:4px; padding:12px; border:2px solid var(--border); border-radius:8px; font-size:16px;" 
                         oninput="window.__formatExpiry(this)" required>
                </div>
                <div style="flex:1;">
                  <label class="small muted">${t("cvv")} *</label>
                  <input type="password" id="card_cvv" placeholder="123" maxlength="4" 
                         style="margin-top:4px; padding:12px; border:2px solid var(--border); border-radius:8px; font-size:16px;" required>
                </div>
              </div>
              
              <div style="margin-bottom:16px;">
                <label class="small muted">${t("cardholder_name")} *</label>
                <input type="text" id="card_name" placeholder="${t("name_on_card")}" 
                       style="margin-top:4px; padding:12px; border:2px solid var(--border); border-radius:8px;" required>
              </div>
              
              <div class="row" style="gap:8px; align-items:center; margin-bottom:16px;">
                <input type="checkbox" id="card_save">
                <label for="card_save" class="small">${t("save_card_future")}</label>
              </div>
              
              <div class="row" style="gap:8px;">
                <button type="button" class="ghost" onclick="window.__hideNewCard()" style="flex:1;">${t("cancel")}</button>
                <button type="button" class="brand" onclick="window.__saveNewCard()" style="flex:1;">${t("save_card")}</button>
              </div>
            </div>
          </div>
          
          <!-- Buy Now Pay Later -->
          <div class="payment-section" style="margin-top:24px;">
            <h4 style="margin-bottom:12px;">${t("buy_now_pay_later")} 📈</h4>
            
            <!-- Tabby -->
            <div class="payment-option bnpl-option" style="padding:16px; border:2px solid #3ECBBC; border-radius:12px; margin-bottom:12px; cursor:pointer; background:linear-gradient(135deg, #3ECBBC, #4ECDC4); color:white;"
                 onclick="window.__selectPayment('tabby')">
              <div class="row between">
                <div class="row" style="align-items:center; gap:12px;">
                  <div style="width:48px; height:48px; background:white; border-radius:12px; display:flex; align-items:center; justify-content:center; font-weight:bold; color:#3ECBBC; font-size:12px;">
                    tabby
                  </div>
                  <div>
                    <strong>Tabby</strong>
                    <div class="small" style="opacity:0.9;">${t("tabby_desc")}</div>
                    <div class="tiny" style="opacity:0.7; margin-top:2px;">💰 ${t("split_4_payments")} • 0% ${t("interest")}</div>
                  </div>
                </div>
                <input type="radio" name="payment" value="tabby">
              </div>
            </div>
            
            <!-- Tamara -->
            <div class="payment-option bnpl-option" style="padding:16px; border:2px solid #39C7AD; border-radius:12px; margin-bottom:12px; cursor:pointer; background:linear-gradient(135deg, #39C7AD, #4DD0B1); color:white;"
                 onclick="window.__selectPayment('tamara')">
              <div class="row between">
                <div class="row" style="align-items:center; gap:12px;">
                  <div style="width:48px; height:48px; background:white; border-radius:12px; display:flex; align-items:center; justify-content:center; font-weight:bold; color:#39C7AD; font-size:10px;">
                    tamara
                  </div>
                  <div>
                    <strong>Tamara</strong>
                    <div class="small" style="opacity:0.9;">${t("tamara_desc")}</div>
                    <div class="tiny" style="opacity:0.7; margin-top:2px;">📅 ${t("flexible_payment")} • ✨ ${t("instant_approval")}</div>
                  </div>
                </div>
                <input type="radio" name="payment" value="tamara">
              </div>
            </div>
          </div>
          
          <!-- Security Notice -->
          <div style="margin-top:24px; padding:16px; background:var(--success-bg); border:1px solid var(--success); border-radius:12px; border-left:4px solid var(--success);">
            <div class="row" style="align-items:center; gap:12px;">
              <span style="font-size:24px;">🔒</span>
              <div>
                <strong style="color:var(--success);">${t("secure_payment")}</strong>
                <div class="small muted">${t("security_notice")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
                  <input type="text" id="card_cvv" placeholder="123" maxlength="4" style="margin-top:4px;" required>
                </label>
              </div>
              
              <label style="margin-top:12px;">${t("cardholder_name")} *
                <input type="text" id="card_name" placeholder="${t("name_on_card")}" style="margin-top:4px;" required>
              </label>
              
              <label style="margin-top:12px; display:flex; align-items:center; gap:8px;">
                <input type="checkbox" id="card_save">
                ${t("save_for_future")}
              </label>
            </div>
          </div>
          
          <!-- BNPL Options -->
          <div style="margin-top:20px;">
            <h4>${t("buy_now_pay_later")}</h4>
            <div class="payment-option" style="padding:12px; border:1px solid var(--border); border-radius:8px; margin-bottom:8px; cursor:pointer;"
                 onclick="window.__selectPayment('tabby')">
              <div class="row between">
                <div class="row" style="align-items:center; gap:12px;">
                  <div style="width:32px; height:32px; background:#3fcbff; border-radius:6px; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold; font-size:12px;">
                    T
                  </div>
                  <div>
                    <strong>Tabby</strong>
                    <div class="muted small">${t("split_4_payments")}</div>
                  </div>
                </div>
                <input type="radio" name="payment" value="tabby">
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Navigation buttons
  const navButtons = `
    <div class="row" style="gap:12px; margin-top:24px;">
      ${step > 1 ? `<button class="ghost" type="button" onclick="window.StoreZ.navigate('#/checkout?step=${step - 1}')">${t("back")}</button>` : ''}
      <button class="secondary" type="button" onclick="window.__proceedCheckout(${step})" style="flex:1;">
        ${step === maxStep ? `${t("place_order")} • ${fmt(total)}` : t("continue")}
      </button>
    </div>
  `;

  ctx.el.innerHTML = h(`
    <section class="panel">
      <div class="row between" style="margin-bottom:16px;">
        <strong>${t("checkout_title")}</strong>
        <button class="ghost small" onclick="window.StoreZ.navigate('#/cart')">${t("edit_cart")}</button>
      </div>
      
      ${stepNav}
      ${stepContent}
      ${navButtons}
      
      <p class="muted" style="margin-top:16px; text-align:center;">${t("secure_checkout_note")}</p>
    </section>
  `);
}

// Checkout interaction functions
window.__selectAddress = (index) => {
  const radios = document.querySelectorAll('input[name="address"]');
  radios[index].checked = true;
  
  // Visual feedback
  document.querySelectorAll('.address-option').forEach((el, i) => {
    el.style.borderColor = i === index ? 'var(--brand)' : 'var(--border)';
    el.style.background = i === index ? 'var(--brand-bg)' : '';
  });
};

window.__toggleNewAddress = () => {
  const form = document.getElementById('newAddressForm');
  const isVisible = form.style.display !== 'none';
  form.style.display = isVisible ? 'none' : 'block';
  
  if (!isVisible) {
    // Focus first input when showing form
    setTimeout(() => document.getElementById('addr_name')?.focus(), 100);
  }
};

window.__selectPayment = (method) => {
  const radios = document.querySelectorAll('input[name="payment"]');
  radios.forEach(radio => {
    if (radio.value === method) {
      radio.checked = true;
    }
  });
  
  // Visual feedback
  document.querySelectorAll('.payment-option').forEach(el => {
    const radio = el.querySelector('input[type="radio"]');
    if (radio?.value === method) {
      el.style.borderColor = 'var(--brand)';
      el.style.background = 'var(--brand-bg)';
    } else {
      el.style.borderColor = 'var(--border)';
      el.style.background = '';
    }
  });
};

window.__toggleNewCard = () => {
  const form = document.getElementById('newCardForm');
  const isVisible = form.style.display !== 'none';
  form.style.display = isVisible ? 'none' : 'block';
  
  if (!isVisible) {
    // Focus first input and format card number
    setTimeout(() => {
      const cardInput = document.getElementById('card_number');
      if (cardInput) {
        cardInput.focus();
        
        // Add card number formatting
        cardInput.addEventListener('input', (e) => {
          let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
          value = value.substring(0, 16);
          value = value.replace(/(.{4})/g, '$1 ').trim();
          e.target.value = value;
        });
        
        // Add expiry formatting
        const expiryInput = document.getElementById('card_expiry');
        if (expiryInput) {
          expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
              value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
          });
        }
      }
    }, 100);
  }
};

window.__proceedCheckout = (currentStep) => {
  const maxStep = state.user.guest ? 4 : 3;
  
  // Validate current step
  if (currentStep === 2 && state.user.guest) {
    // Validate guest information
    const email = document.getElementById('guest_email')?.value;
    const phone = document.getElementById('guest_phone')?.value;
    
    if (!email || !phone) {
      alert(t("fill_required_fields"));
      return;
    }
    
    if (!email.includes('@')) {
      alert(t("invalid_email"));
      return;
    }
    
    // Save guest info to state
    state.checkout = state.checkout || {};
    state.checkout.guestInfo = { email, phone };
    saveState();
  }
  
  else if ((currentStep === 2 && !state.user.guest) || (currentStep === 3 && state.user.guest)) {
    // Validate address
    const selectedAddress = document.querySelector('input[name="address"]:checked');
    const newAddressVisible = document.getElementById('newAddressForm')?.style.display !== 'none';
    
    if (!selectedAddress && !newAddressVisible) {
      alert(t("select_address"));
      return;
    }
    
    if (newAddressVisible) {
      const name = document.getElementById('addr_name')?.value;
      const line = document.getElementById('addr_line')?.value;
      const city = document.getElementById('addr_city')?.value;
      const postal = document.getElementById('addr_postal')?.value;
      
      if (!name || !line || !city || !postal) {
        alert(t("fill_address_fields"));
        return;
      }
      
      // Save new address
      const newAddress = {
        name, 
        address: line,
        city,
        postal,
        default: document.getElementById('addr_default')?.checked || false
      };
      
      state.checkout = state.checkout || {};
      state.checkout.address = newAddress;
      saveState();
    } else {
      // Use selected saved address
      const addressIndex = parseInt(selectedAddress.value);
      state.checkout = state.checkout || {};
      state.checkout.address = state.user.addresses[addressIndex];
      saveState();
    }
  }
  
  else if ((currentStep === 3 && !state.user.guest) || (currentStep === 4 && state.user.guest)) {
    // Validate payment
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    if (!selectedPayment) {
      alert(t("select_payment_method"));
      return;
    }
    
    const newCardVisible = document.getElementById('newCardForm')?.style.display !== 'none';
    if (newCardVisible && selectedPayment.value.startsWith('card-new')) {
      const number = document.getElementById('card_number')?.value.replace(/\s/g, '');
      const expiry = document.getElementById('card_expiry')?.value;
      const cvv = document.getElementById('card_cvv')?.value;
      const name = document.getElementById('card_name')?.value;
      
      if (!number || !expiry || !cvv || !name) {
        alert(t("fill_card_fields"));
        return;
      }
      
      if (number.length !== 16) {
        alert(t("invalid_card_number"));
        return;
      }
    }
    
    // Save payment method
    state.checkout = state.checkout || {};
    state.checkout.paymentMethod = selectedPayment.value;
    saveState();
  }
  
  // Proceed to next step or complete order
  if (currentStep < maxStep) {
    navigate(`#/checkout?step=${currentStep + 1}`);
  } else {
    // Place order
    window.__completeOrder();
  }
};

window.__completeOrder = () => {
  const items = state.cart.slice();
  if (!items.length) {
    alert(t("cart_empty"));
    return;
  }
  
  // Show loading state
  const btn = document.querySelector('button[onclick*="__proceedCheckout"]');
  if (btn) {
    const originalText = btn.textContent;
    btn.textContent = t("processing_order");
    btn.disabled = true;
    
    // Simulate processing time
    setTimeout(() => {
      try {
        // Create order
        const order = actions.placeOrderFromCart();
        if (order) {
          // Clear checkout state
          delete state.checkout;
          saveState();
          
          // Navigate to order confirmation
          navigate(`#/order-confirmation/${order.id}`);
        } else {
          alert(t("order_failed"));
          btn.textContent = originalText;
          btn.disabled = false;
        }
      } catch (e) {
        alert(t("order_failed"));
        btn.textContent = originalText;
        btn.disabled = false;
      }
    }, 1500);
  }
};


function orders(ctx) {
  if (state.user.guest) {
    ctx.el.innerHTML = h(`
      <section class="panel center">
        <p class="muted">${t("sign_in_to_view_orders")}</p>
        <button class="secondary" type="button" onclick="window.StoreZ.navigate('#/auth')">${t("sign_in")}</button>
      </section>
    `);
    return;
  }

  const filterParam = new URLSearchParams(location.search).get('filter') || 'all';
  const statusFilters = ['all', 'active', 'delivered', 'cancelled'];
  
  const statusLabel = (s) =>
    s === "Delivered" ? t("status_delivered")
    : s === "Shipped" ? t("status_shipped")
    : s === "Out for delivery" ? t("status_out")
    : s === "Processing" ? t("status_processing")
    : s === "Cancelled" ? t("status_cancelled")
    : s === "Returned" ? t("status_returned")
    : t("status_processing");

  const getStatusColor = (status) => {
    switch(status) {
      case "Delivered": return "success";
      case "Shipped": 
      case "Out for delivery": return "info";
      case "Processing": return "warning";
      case "Cancelled":
      case "Returned": return "danger";
      default: return "muted";
    }
  };

  // Filter orders based on selected filter
  const filteredOrders = state.orders.filter(o => {
    if (filterParam === 'all') return true;
    if (filterParam === 'active') return !['Delivered', 'Cancelled', 'Returned'].includes(o.status);
    if (filterParam === 'delivered') return o.status === 'Delivered';
    if (filterParam === 'cancelled') return ['Cancelled', 'Returned'].includes(o.status);
    return true;
  });

  // Sort orders by date (newest first)
  const sortedOrders = filteredOrders.sort((a, b) => (b.date || b.ts) - (a.date || a.ts));

  const ordersList = sortedOrders.map(o => {
    const orderDate = new Date(o.date || o.ts);
    const daysSince = Math.floor((Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    const withinReturn = daysSince <= 30 && o.status === 'Delivered';
    const canCancel = ['Processing'].includes(o.status);
    
    // Get primary product image
    const firstProduct = productById(o.items[0]?.id);
    const productImage = firstProduct ? `https://images.unsplash.com/photo-${firstProduct.unsplash}?auto=format&fit=crop&w=80&q=70` : '';
    
    const itemsText = o.items.length === 1 
      ? getProductField(productById(o.items[0].id), 'name')
      : `${o.items.length} ${t("items")}`;

    return `
      <div class="order-card" style="border:1px solid var(--border); border-radius:12px; padding:16px; margin-bottom:12px; background:var(--bg);">
        <div class="row between" style="margin-bottom:12px;">
          <div class="row" style="gap:12px; align-items:center;">
            ${productImage ? `<img src="${productImage}" alt="" style="width:48px; height:48px; object-fit:cover; border-radius:8px;">` : 
              `<div style="width:48px; height:48px; background:var(--bg-2); border-radius:8px; display:flex; align-items:center; justify-content:center; color:var(--text-muted);">📦</div>`}
            <div>
              <strong onclick="window.StoreZ.navigate('#/order/${o.id}')" style="cursor:pointer; color:var(--brand);">#${o.id}</strong>
              <div class="muted small">${orderDate.toLocaleDateString(getLang() === 'ar' ? 'ar-SA' : 'en-US', { 
                year: 'numeric', month: 'short', day: 'numeric' 
              })}</div>
            </div>
          </div>
          <span class="chip ${getStatusColor(o.status)}">${statusLabel(o.status)}</span>
        </div>
        
        <div style="margin-bottom:12px;">
          <div class="muted small">${itemsText}</div>
          <div style="font-weight:500; margin-top:4px;">${fmt(o.total)}</div>
        </div>
        
        <!-- Progress indicator for active orders -->
        ${!['Delivered', 'Cancelled', 'Returned'].includes(o.status) ? `
          <div style="margin-bottom:12px;">
            <div class="progress-bar" style="height:4px; background:var(--bg-2); border-radius:2px; overflow:hidden;">
              <div style="height:100%; background:var(--brand); width:${
                o.status === 'Processing' ? '25%' :
                o.status === 'Shipped' ? '75%' :
                o.status === 'Out for delivery' ? '90%' : '100%'
              }; transition:width 0.3s ease;"></div>
            </div>
            <div class="muted small" style="margin-top:4px;">
              ${o.status === 'Processing' ? t("order_being_prepared") :
                o.status === 'Shipped' ? t("order_in_transit") :
                o.status === 'Out for delivery' ? t("order_out_for_delivery") : ''}
            </div>
          </div>
        ` : ''}
        
        <div class="row" style="gap:8px;">
          <button class="secondary small" onclick="window.StoreZ.navigate('#/order/${o.id}')" style="flex:1;">
            ${['Delivered', 'Cancelled', 'Returned'].includes(o.status) ? t("view_details") : t("track_order")}
          </button>
          
          ${canCancel ? `
            <button class="ghost small danger" onclick="window.__cancelOrder('${o.id}')" style="flex:1;">
              ${t("cancel_order")}
            </button>
          ` : ''}
          
          ${withinReturn ? `
            <button class="ghost small" onclick="window.__startReturn('${o.id}')" style="flex:1;">
              ${t("return_item")}
            </button>
          ` : ''}
          
          ${o.status === 'Delivered' && !o.reviewed ? `
            <button class="ghost small" onclick="window.__reviewOrder('${o.id}')" style="flex:1;">
              ${t("write_review")}
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join("");

  ctx.el.innerHTML = h(`
    <section class="panel">
      <div class="row between" style="margin-bottom:16px;">
        <strong>${t("your_orders")}</strong>
        <button class="ghost small" onclick="window.StoreZ.navigate('#/discover')">${t("shop_more")}</button>
      </div>
      
      <!-- Order filters -->
      <div class="filter-tabs" style="display:flex; gap:4px; margin-bottom:20px; padding:4px; background:var(--bg-2); border-radius:8px;">
        ${statusFilters.map(filter => `
          <button class="filter-tab ${filterParam === filter ? 'active' : ''}" 
                  onclick="window.StoreZ.navigate('#/orders?filter=${filter}')"
                  style="flex:1; padding:8px 12px; border:none; background:${filterParam === filter ? 'var(--brand)' : 'transparent'}; 
                         color:${filterParam === filter ? 'white' : 'var(--text)'}; border-radius:6px; cursor:pointer; 
                         font-size:13px; transition:all 0.2s ease;">
            ${t(`filter_${filter}`)}${filter === 'active' ? ` (${state.orders.filter(o => !['Delivered', 'Cancelled', 'Returned'].includes(o.status)).length})` : ''}
          </button>
        `).join('')}
      </div>
      
      ${sortedOrders.length > 0 ? `
        <div class="orders-list">
          ${ordersList}
        </div>
      ` : `
        <div class="empty-state" style="text-align:center; padding:40px 20px;">
          <div style="font-size:48px; margin-bottom:16px;">📦</div>
          <h3>${filterParam === 'all' ? t("no_orders_yet") : t(`no_orders_${filterParam}`)}</h3>
          <p class="muted">${filterParam === 'all' ? t("no_orders_desc") : t(`no_orders_${filterParam}_desc`)}</p>
          <button class="secondary" onclick="window.StoreZ.navigate('#/discover')" style="margin-top:16px;">
            ${t("start_shopping")}
          </button>
        </div>
      `}
    </section>
  `);
}

function orderDetail(ctx, id) {
  const o = state.orders.find(x => x.id === id);
  if (!o) { 
    ctx.el.innerHTML = h(`
      <section class="panel center">
        <h2>${t("order_not_found")}</h2>
        <p class="muted">${t("order_not_found_desc")}</p>
        <button class="secondary" onclick="window.StoreZ.navigate('#/orders')">${t("view_orders")}</button>
      </section>
    `);
    return; 
  }

  const orderDate = new Date(o.date || o.ts);
  const daysSince = Math.floor((Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
  const withinReturn = daysSince <= 30 && o.status === 'Delivered';
  const canCancel = ['Processing'].includes(o.status);
  
  // Enhanced timeline with more detailed statuses
  const fullTimeline = o.timeline?.length ? o.timeline : ["Processing", "Shipped", "Out for delivery", "Delivered"];
  const currentStepIndex = fullTimeline.findIndex(step => step === o.status);
  
  // Estimated delivery (if not delivered)
  const estimatedDelivery = new Date(orderDate);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);
  
  const statusLabel = (s) =>
    s === "Delivered" ? t("status_delivered")
    : s === "Shipped" ? t("status_shipped")
    : s === "Out for delivery" ? t("status_out")
    : s === "Processing" ? t("status_processing")
    : s === "Cancelled" ? t("status_cancelled")
    : s === "Returned" ? t("status_returned")
    : t("status_processing");

  // Order items with enhanced display
  const items = o.items.map(item => {
    const product = productById(item.id);
    const productName = getProductField(product, 'name');
    const productImage = `https://images.unsplash.com/photo-${product.unsplash}?auto=format&fit=crop&w=80&q=70`;
    
    return `
      <div class="order-item" style="display:flex; gap:12px; padding:12px; border:1px solid var(--border); border-radius:8px; margin-bottom:8px;">
        <img src="${productImage}" alt="${productName}" style="width:60px; height:60px; object-fit:cover; border-radius:6px;">
        <div style="flex:1;">
          <div class="row between">
            <strong onclick="window.StoreZ.navigate('#/pdp/${product.id}')" style="cursor:pointer; color:var(--brand);">${productName}</strong>
            <span>${fmt(item.qty * item.price)}</span>
          </div>
          <div class="muted">${t("quantity")}: ${item.qty} × ${fmt(item.price)}</div>
          <div class="muted small">${product.cat}</div>
          
          ${o.status === 'Delivered' ? `
            <div style="margin-top:8px;">
              <button class="ghost small" onclick="window.__reviewProduct('${product.id}', '${o.id}')" 
                      style="margin-right:8px;">${t("review_product")}</button>
              ${withinReturn ? `
                <button class="ghost small" onclick="window.__returnItem('${o.id}', '${item.id}')">${t("return_this_item")}</button>
              ` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join("");

  // Order timeline with visual progress
  const timelineSteps = fullTimeline.map((step, index) => {
    const isCompleted = index <= currentStepIndex;
    const isCurrent = index === currentStepIndex;
    const isLast = index === fullTimeline.length - 1;
    
    // Mock timestamps for completed steps
    const stepDate = new Date(orderDate);
    stepDate.setHours(stepDate.getHours() + (index * 8)); // 8 hours between steps
    
    return `
      <div class="timeline-step" style="display:flex; align-items:flex-start; gap:12px; margin-bottom:${isLast ? '0' : '20px'}; position:relative;">
        <div class="timeline-icon" style="width:32px; height:32px; border-radius:50%; 
             background:${isCompleted ? 'var(--success)' : isCurrent ? 'var(--brand)' : 'var(--bg-2)'}; 
             border:2px solid ${isCompleted ? 'var(--success)' : isCurrent ? 'var(--brand)' : 'var(--border)'}; 
             display:flex; align-items:center; justify-content:center; color:white; 
             font-size:${isCompleted ? '14px' : '12px'}; flex-shrink:0; z-index:1; background:var(--bg);">
          ${isCompleted ? '✓' : index + 1}
        </div>
        
        ${!isLast ? `
          <div style="position:absolute; left:15px; top:32px; width:2px; height:20px; 
               background:${index < currentStepIndex ? 'var(--success)' : 'var(--border)'};"></div>
        ` : ''}
        
        <div style="flex:1; padding-top:4px;">
          <div style="font-weight:${isCurrent ? '600' : '500'}; 
               color:${isCompleted ? 'var(--success)' : isCurrent ? 'var(--brand)' : 'var(--text-muted)'};">
            ${statusLabel(step)}
          </div>
          
          ${isCompleted && index <= currentStepIndex ? `
            <div class="muted small">${stepDate.toLocaleString(getLang() === 'ar' ? 'ar-SA' : 'en-US', {
              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })}</div>
          ` : isCurrent && !['Delivered', 'Cancelled', 'Returned'].includes(o.status) ? `
            <div class="muted small">${t("in_progress")}</div>
          ` : ''}
          
          ${step === 'Shipped' && isCompleted ? `
            <div style="margin-top:4px;">
              <button class="ghost small" onclick="window.__showTrackingDetails('${o.id}')">${t("tracking_details")}</button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  ctx.el.innerHTML = h(`
    <section class="panel">
      <div class="row between" style="margin-bottom:16px;">
        <div>
          <strong>${t("order")} #${o.id}</strong>
          <div class="muted small">${t("placed_on")} ${orderDate.toLocaleDateString(getLang() === 'ar' ? 'ar-SA' : 'en-US', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
          })}</div>
        </div>
        <span class="chip ${o.status === 'Delivered' ? 'success' : o.status === 'Cancelled' ? 'danger' : 'info'}">
          ${statusLabel(o.status)}
        </span>
      </div>
      
      <!-- Delivery estimation for active orders -->
      ${!['Delivered', 'Cancelled', 'Returned'].includes(o.status) ? `
        <div style="background:var(--brand-bg); border-radius:8px; padding:16px; margin-bottom:20px;">
          <div class="row" style="gap:12px; align-items:center;">
            <span style="font-size:24px;">🚚</span>
            <div>
              <strong>${t("estimated_delivery")}</strong>
              <div class="muted small">${estimatedDelivery.toLocaleDateString(getLang() === 'ar' ? 'ar-SA' : 'en-US', { 
                weekday: 'long', month: 'long', day: 'numeric' 
              })}</div>
            </div>
          </div>
        </div>
      ` : ''}
      
      <!-- Order timeline -->
      <div style="margin-bottom:24px;">
        <h3 style="margin-bottom:16px;">${t("order_progress")}</h3>
        <div class="timeline">
          ${timelineSteps}
        </div>
      </div>
      
      <!-- Order items -->
      <div style="margin-bottom:24px;">
        <h3 style="margin-bottom:16px;">${t("order_items")}</h3>
        ${items}
      </div>
      
      <!-- Order summary -->
      <div style="background:var(--bg-2); border-radius:8px; padding:16px; margin-bottom:20px;">
        <h3 style="margin-bottom:12px;">${t("order_summary")}</h3>
        <div class="row between" style="margin-bottom:8px;">
          <span>${t("subtotal")}</span>
          <span>${fmt(o.total - 15 - Math.round(o.total * 0.05))}</span>
        </div>
        <div class="row between" style="margin-bottom:8px;">
          <span>${t("shipping")}</span>
          <span>${fmt(15)}</span>
        </div>
        <div class="row between" style="margin-bottom:12px;">
          <span>${t("tax")}</span>
          <span>${fmt(Math.round(o.total * 0.05))}</span>
        </div>
        <div class="row between" style="border-top:1px solid var(--border); padding-top:12px;">
          <strong>${t("total")}</strong>
          <strong>${fmt(o.total)}</strong>
        </div>
      </div>
      
      <!-- Action buttons -->
      <div class="row" style="gap:8px; margin-bottom:16px;">
        ${canCancel ? `
          <button class="danger" onclick="window.__cancelOrder('${o.id}')" style="flex:1;">
            ${t("cancel_order")}
          </button>
        ` : ''}
        
        ${withinReturn ? `
          <button class="secondary" onclick="window.__startReturn('${o.id}')" style="flex:1;">
            ${t("return_order")}
          </button>
        ` : ''}
        
        <button class="ghost" onclick="window.StoreZ.navigate('#/messages')" style="flex:1;">
          ${t("contact_support")}
        </button>
        
        ${o.status === 'Delivered' ? `
          <button class="ghost" onclick="window.__reorderItems('${o.id}')" style="flex:1;">
            ${t("reorder")}
          </button>
        ` : ''}
      </div>
      
      <button class="ghost" onclick="window.StoreZ.navigate('#/orders')" style="width:100%;">
        ${t("back_to_orders")}
      </button>
    </section>
  `);
  
  function labelKey(s) {
    const k = s.toLowerCase().replaceAll(" ", "_");
    return t(k) || s;
  }
}

// Order management functions
window.__cancelOrder = (orderId) => {
  if (!confirm(t("confirm_cancel_order"))) return;
  
  const reason = prompt(t("cancel_reason_prompt"));
  if (!reason) return;
  
  const order = state.orders.find(o => o.id === orderId);
  if (order && order.status === 'Processing') {
    order.status = 'Cancelled';
    order.cancelReason = reason;
    order.cancelDate = Date.now();
    saveState();
    
    // Show success message
    alert(t("order_cancelled_success"));
    navigate(`#/order/${orderId}`);
  }
};

window.__startReturn = (orderId) => {
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;
  
  // Show return modal/sheet
  showSheet(`
    <div style="padding:20px;">
      <h2>${t("return_order")} #${orderId}</h2>
      <p class="muted">${t("return_order_desc")}</p>
      
      <div style="margin:20px 0;">
        <label>${t("return_reason")} *
          <select id="returnReason" style="margin-top:8px; width:100%;">
            <option value="">${t("select_reason")}</option>
            <option value="defective">${t("defective_item")}</option>
            <option value="wrong_item">${t("wrong_item")}</option>
            <option value="size_fit">${t("size_fit_issue")}</option>
            <option value="not_as_described">${t("not_as_described")}</option>
            <option value="changed_mind">${t("changed_mind")}</option>
            <option value="other">${t("other")}</option>
          </select>
        </label>
        
        <label style="margin-top:16px;">${t("additional_details")}
          <textarea id="returnDetails" placeholder="${t("return_details_placeholder")}" 
                    style="margin-top:8px; width:100%; height:80px; resize:vertical;"></textarea>
        </label>
        
        <div style="margin-top:16px; padding:12px; background:var(--bg-2); border-radius:8px;">
          <strong>${t("return_policy")}</strong>
          <ul class="muted small" style="margin:8px 0 0 16px;">
            <li>${t("return_within_30_days")}</li>
            <li>${t("items_original_condition")}</li>
            <li>${t("refund_processed_5_7_days")}</li>
          </ul>
        </div>
      </div>
      
      <div class="row" style="gap:12px; margin-top:20px;">
        <button class="ghost" onclick="window.__hideSheet()" style="flex:1;">${t("cancel")}</button>
        <button class="secondary" onclick="window.__submitReturn('${orderId}')" style="flex:1;">${t("submit_return")}</button>
      </div>
    </div>
  `);
};

window.__returnItem = (orderId, itemId) => {
  const order = state.orders.find(o => o.id === orderId);
  const item = order?.items.find(i => i.id === itemId);
  const product = productById(itemId);
  
  if (!order || !item || !product) return;
  
  showSheet(`
    <div style="padding:20px;">
      <h2>${t("return_item")}</h2>
      <div class="row" style="gap:12px; margin:16px 0; padding:12px; background:var(--bg-2); border-radius:8px;">
        <img src="https://images.unsplash.com/photo-${product.unsplash}?auto=format&fit=crop&w=60&q=70" 
             style="width:48px; height:48px; object-fit:cover; border-radius:6px;">
        <div>
          <strong>${getProductField(product, 'name')}</strong>
          <div class="muted small">${t("quantity")}: ${item.qty}</div>
        </div>
      </div>
      
      <label>${t("return_reason")} *
        <select id="itemReturnReason" style="margin-top:8px; width:100%;">
          <option value="">${t("select_reason")}</option>
          <option value="defective">${t("defective_item")}</option>
          <option value="wrong_item">${t("wrong_item")}</option>
          <option value="size_fit">${t("size_fit_issue")}</option>
          <option value="not_as_described">${t("not_as_described")}</option>
          <option value="changed_mind">${t("changed_mind")}</option>
        </select>
      </label>
      
      <label style="margin-top:16px;">${t("quantity_to_return")}
        <input type="number" id="returnQty" min="1" max="${item.qty}" value="${item.qty}" 
               style="margin-top:8px; width:100%;">
      </label>
      
      <div class="row" style="gap:12px; margin-top:20px;">
        <button class="ghost" onclick="window.__hideSheet()" style="flex:1;">${t("cancel")}</button>
        <button class="secondary" onclick="window.__submitItemReturn('${orderId}', '${itemId}')" style="flex:1;">
          ${t("submit_return")}
        </button>
      </div>
    </div>
  `);
};

window.__submitReturn = (orderId) => {
  const reason = document.getElementById('returnReason')?.value;
  const details = document.getElementById('returnDetails')?.value;
  
  if (!reason) {
    alert(t("please_select_reason"));
    return;
  }
  
  const order = state.orders.find(o => o.id === orderId);
  if (order) {
    order.status = 'Returned';
    order.returnReason = reason;
    order.returnDetails = details;
    order.returnDate = Date.now();
    saveState();
    
    window.__hideSheet();
    alert(t("return_submitted_success"));
    navigate(`#/order/${orderId}`);
  }
};

window.__submitItemReturn = (orderId, itemId) => {
  const reason = document.getElementById('itemReturnReason')?.value;
  const qty = parseInt(document.getElementById('returnQty')?.value) || 1;
  
  if (!reason) {
    alert(t("please_select_reason"));
    return;
  }
  
  // For demo purposes, we'll just show success
  window.__hideSheet();
  alert(t("item_return_submitted"));
  navigate(`#/order/${orderId}`);
};

window.__reviewOrder = (orderId) => {
  const order = state.orders.find(o => o.id === orderId);
  if (order) {
    order.reviewed = true;
    saveState();
    
    // Navigate to review form (simplified for demo)
    alert(t("review_thank_you"));
    navigate('#/orders');
  }
};

window.__reviewProduct = (productId, orderId) => {
  // For demo purposes, just show success
  alert(t("product_review_thank_you"));
};

window.__reorderItems = (orderId) => {
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;
  
  // Add all items from the order to cart
  order.items.forEach(item => {
    actions.addToCart(item.id, item.qty, item.price);
  });
  
  saveState();
  alert(t("items_added_to_cart"));
  navigate('#/cart');
};

window.__showTrackingDetails = (orderId) => {
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;
  
  // Mock tracking information
  const trackingNumber = `SZ${orderId.toUpperCase()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  const carrier = getLang() === 'ar' ? 'الشحن السعودي' : 'Saudi Post';
  
  showSheet(`
    <div style="padding:20px;">
      <h2>${t("tracking_details")}</h2>
      <div style="margin:16px 0; padding:16px; background:var(--bg-2); border-radius:8px;">
        <div class="row between" style="margin-bottom:8px;">
          <span>${t("tracking_number")}</span>
          <strong>${trackingNumber}</strong>
        </div>
        <div class="row between" style="margin-bottom:8px;">
          <span>${t("carrier")}</span>
          <span>${carrier}</span>
        </div>
        <div class="row between">
          <span>${t("estimated_delivery")}</span>
          <span>${new Date(Date.now() + 86400000).toLocaleDateString()}</span>
        </div>
      </div>
      
      <button class="secondary" onclick="window.__hideSheet()" style="width:100%; margin-top:16px;">
        ${t("close")}
      </button>
    </div>
  `);
};

function wishlist(ctx) {
  const items = state.wishlist.map(productById).filter(Boolean);
  ctx.el.innerHTML = h(items.length
    ? `
    <section class="panel">
      <div class="row between">
        <strong>${t("wishlist")}</strong>
        <button class="ghost small" type="button" onclick="window.StoreZ.navigate('#/discover')">${t("nav_discover")}</button>
      </div>
      <div class="grid cards" style="margin-top:12px">
        ${items.map(Card).join("")}
      </div>
    </section>`
    : `
    <section class="panel center">
      <p class="muted">${t("wishlist_empty")}</p>
      <button class="secondary" type="button" onclick="window.StoreZ.navigate('#/discover')">${t("nav_discover")}</button>
    </section>`);
}

function messages(ctx) {
  if (state.user.guest) {
    ctx.el.innerHTML = h(`
      <section class="panel center">
        <div style="font-size:48px; margin-bottom:16px;">💬</div>
        <h2>${t("sign_in_to_message")}</h2>
        <p class="muted">${t("messaging_benefits")}</p>
        <button class="secondary" type="button" onclick="window.StoreZ.navigate('#/auth')">${t("sign_in")}</button>
      </section>
    `);
    return;
  }

  const filterParam = new URLSearchParams(location.search).get('filter') || 'all';
  const filters = ['all', 'creators', 'support', 'unread'];
  
  // Get conversation data with enhanced filtering
  const conversations = state.messages || [];
  const filteredConversations = conversations.filter(conv => {
    if (filterParam === 'all') return true;
    if (filterParam === 'creators') return conv.with.startsWith('@');
    if (filterParam === 'support') return conv.with.toLowerCase().includes('support');
    if (filterParam === 'unread') return conv.unread > 0;
    return true;
  });

  // Sort by last message timestamp
  const sortedConversations = filteredConversations.sort((a, b) => {
    const lastA = a.thread[a.thread.length - 1].ts;
    const lastB = b.thread[b.thread.length - 1].ts;
    return lastB - lastA;
  });

  const conversationsList = sortedConversations.map(conv => {
    const lastMessage = conv.thread[conv.thread.length - 1];
    const isCreator = conv.with.startsWith('@');
    const isSupport = conv.with.toLowerCase().includes('support');
    const unreadCount = conv.unread || 0;
    const timeAgo = getTimeAgo(lastMessage.ts);
    
    // Get avatar for creator conversations
    const creator = isCreator ? creatorById(conv.creatorId) : null;
    const avatarUrl = creator ? 
      `https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=64&q=70` :
      isSupport ? '' : 
      `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=64&q=70`;

    return `
      <div class="conversation-item" onclick="window.StoreZ.navigate('#/chat/${conv.id}')" 
           style="padding:16px; border-bottom:1px solid var(--border); cursor:pointer; position:relative;
                  background:${unreadCount > 0 ? 'var(--brand-bg)' : 'transparent'};">
        <div class="row" style="gap:12px; align-items:flex-start;">
          <div class="avatar" style="width:48px; height:48px; border-radius:50%; overflow:hidden; flex-shrink:0; position:relative;">
            ${avatarUrl ? 
              `<img src="${avatarUrl}" alt="${conv.with}" style="width:100%; height:100%; object-fit:cover;">` :
              `<div style="width:100%; height:100%; background:var(--brand); display:flex; align-items:center; justify-content:center; color:white; font-weight:bold;">
                ${isSupport ? '🎧' : conv.with.charAt(0).toUpperCase()}
              </div>`
            }
            ${isCreator && creator?.live ? 
              `<div style="position:absolute; bottom:2px; right:2px; width:12px; height:12px; background:#22c55e; border:2px solid white; border-radius:50%;"></div>` : 
              ''
            }
          </div>
          
          <div style="flex:1; min-width:0;">
            <div class="row between" style="margin-bottom:4px;">
              <div style="font-weight:${unreadCount > 0 ? '600' : '500'}; 
                          color:${unreadCount > 0 ? 'var(--text)' : 'var(--text)'};">
                ${conv.with}
                ${isCreator ? `<span class="chip small" style="margin-left:6px;">Creator</span>` : ''}
                ${isSupport ? `<span class="chip small info" style="margin-left:6px;">Support</span>` : ''}
              </div>
              <span class="muted small">${timeAgo}</span>
            </div>
            
            <div class="row between" style="align-items:flex-end;">
              <div class="message-preview" style="color:var(--text-muted); font-size:14px; 
                                                 overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1;">
                ${lastMessage.from === 'user' ? t("you") + ': ' : ''}${lastMessage.text}
              </div>
              ${unreadCount > 0 ? 
                `<div class="unread-badge" style="background:var(--brand); color:white; border-radius:10px; 
                                                 padding:2px 6px; font-size:11px; font-weight:bold; margin-left:8px;">
                  ${unreadCount}
                </div>` : 
                ''
              }
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Quick actions for starting new conversations
  const quickActions = `
    <div style="padding:16px; border-bottom:1px solid var(--border); background:var(--bg-2);">
      <h4 style="margin-bottom:12px;">${t("quick_actions")}</h4>
      <div class="row" style="gap:8px; flex-wrap:wrap;">
        <button class="ghost small" onclick="window.__startSupportChat()" style="flex:1; min-width:120px;">
          🎧 ${t("contact_support")}
        </button>
        <button class="ghost small" onclick="window.__browseCreators()" style="flex:1; min-width:120px;">
          👥 ${t("message_creator")}
        </button>
      </div>
    </div>
  `;

  ctx.el.innerHTML = h(`
    <section class="panel">
      <div class="row between" style="margin-bottom:16px;">
        <strong>${t("messages")}</strong>
        <button class="ghost small" onclick="window.__showMessageSettings()">⚙️</button>
      </div>
      
      <!-- Message filters -->
      <div class="filter-tabs" style="display:flex; gap:4px; margin-bottom:16px; padding:4px; background:var(--bg-2); border-radius:8px;">
        ${filters.map(filter => {
          const count = filter === 'unread' ? 
            conversations.reduce((sum, conv) => sum + (conv.unread || 0), 0) : 
            '';
          return `
            <button class="filter-tab ${filterParam === filter ? 'active' : ''}" 
                    onclick="window.StoreZ.navigate('#/messages?filter=${filter}')"
                    style="flex:1; padding:8px 12px; border:none; background:${filterParam === filter ? 'var(--brand)' : 'transparent'}; 
                           color:${filterParam === filter ? 'white' : 'var(--text)'}; border-radius:6px; cursor:pointer; 
                           font-size:13px; transition:all 0.2s ease;">
              ${t(`filter_${filter}`)}${count ? ` (${count})` : ''}
            </button>
          `;
        }).join('')}
      </div>
      
      ${sortedConversations.length > 0 ? `
        <div class="conversations-list" style="border:1px solid var(--border); border-radius:8px; overflow:hidden;">
          ${quickActions}
          ${conversationsList}
        </div>
      ` : `
        <div class="empty-state" style="text-align:center; padding:40px 20px;">
          <div style="font-size:48px; margin-bottom:16px;">💬</div>
          <h3>${t("no_conversations")}</h3>
          <p class="muted">${t("no_conversations_desc")}</p>
          ${quickActions}
        </div>
      `}
    </section>
  `);
}

// Helper function to get time ago
function getTimeAgo(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return t("just_now");
  if (minutes < 60) return t("minutes_ago").replace("{0}", minutes);
  if (hours < 24) return t("hours_ago").replace("{0}", hours);
  if (days < 7) return t("days_ago").replace("{0}", days);
  
  return new Date(timestamp).toLocaleDateString(getLang() === 'ar' ? 'ar-SA' : 'en-US', {
    month: 'short', day: 'numeric'
  });
}

function chat(ctx, conversationId) {
  if (state.user.guest) {
    ctx.el.innerHTML = h(`
      <section class="panel center">
        <h2>${t("sign_in_to_chat")}</h2>
        <p class="muted">${t("chat_sign_in_desc")}</p>
        <button class="secondary" onclick="window.StoreZ.navigate('#/auth')">${t("sign_in")}</button>
      </section>
    `);
    return;
  }

  const conversation = state.messages.find(m => m.id === conversationId);
  if (!conversation) {
    ctx.el.innerHTML = h(`
      <section class="panel center">
        <h2>${t("conversation_not_found")}</h2>
        <p class="muted">${t("conversation_not_found_desc")}</p>
        <button class="secondary" onclick="window.StoreZ.navigate('#/messages')">${t("back_to_messages")}</button>
      </section>
    `);
    return;
  }

  // Mark conversation as read
  if (conversation.unread > 0) {
    conversation.unread = 0;
    saveState();
  }

  const isCreator = conversation.with.startsWith('@');
  const isSupport = conversation.with.toLowerCase().includes('support');
  const creator = isCreator ? creatorById(conversation.creatorId) : null;
  
  // Build chat header
  const chatHeader = `
    <div class="chat-header" style="padding:16px; border-bottom:1px solid var(--border); background:var(--bg); position:sticky; top:0; z-index:10;">
      <div class="row between" style="align-items:center;">
        <div class="row" style="gap:12px; align-items:center;">
          <button class="ghost small" onclick="window.StoreZ.navigate('#/messages')" style="padding:8px;">
            ←
          </button>
          
          <div class="avatar" style="width:40px; height:40px; border-radius:50%; overflow:hidden; position:relative;">
            ${isCreator && creator ? 
              `<img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=70" 
                   alt="${conversation.with}" style="width:100%; height:100%; object-fit:cover;">` :
              isSupport ?
              `<div style="width:100%; height:100%; background:var(--info); display:flex; align-items:center; justify-content:center; color:white;">🎧</div>` :
              `<div style="width:100%; height:100%; background:var(--brand); display:flex; align-items:center; justify-content:center; color:white; font-weight:bold;">
                ${conversation.with.charAt(0).toUpperCase()}
              </div>`
            }
            ${isCreator && creator?.live ? 
              `<div style="position:absolute; bottom:0; right:0; width:12px; height:12px; background:#22c55e; border:2px solid white; border-radius:50%;"></div>` : 
              ''
            }
          </div>
          
          <div onclick="${isCreator ? `window.StoreZ.navigate('#/creator/${conversation.creatorId}')` : ''}" 
               style="cursor:${isCreator ? 'pointer' : 'default'};">
            <div style="font-weight:600;">${conversation.with}</div>
            <div class="muted small">
              ${isCreator && creator?.live ? t("live_now") : 
                isCreator ? t("creator") :
                isSupport ? t("support_team") : t("active_now")}
            </div>
          </div>
        </div>
        
        <div class="row" style="gap:8px;">
          ${isCreator ? `
            <button class="ghost small" onclick="window.__viewCreatorProducts('${conversation.creatorId}')" title="${t("view_products")}">
              🛍️
            </button>
            ${creator?.live ? `
              <button class="ghost small" onclick="window.StoreZ.navigate('#/live/${conversation.creatorId}')" title="${t("join_live")}">
                📺
              </button>
            ` : ''}
          ` : ''}
          
          <button class="ghost small" onclick="window.__showChatOptions('${conversationId}')" title="${t("chat_options")}">
            ⋮
          </button>
        </div>
      </div>
    </div>
  `;

  // Build message list
  const messagesList = conversation.thread.map((msg, index) => {
    const isUser = msg.from === 'user';
    const isSystem = msg.from === 'system';
    const timestamp = new Date(msg.ts);
    const showTimestamp = index === 0 || 
      (timestamp.getTime() - new Date(conversation.thread[index - 1].ts).getTime()) > 300000; // 5 minutes
    
    return `
      ${showTimestamp ? `
        <div style="text-align:center; margin:16px 0;">
          <span class="muted small" style="background:var(--bg-2); padding:4px 12px; border-radius:12px;">
            ${timestamp.toLocaleString(getLang() === 'ar' ? 'ar-SA' : 'en-US', {
              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </span>
        </div>
      ` : ''}
      
      <div class="message ${isUser ? 'user' : 'other'} ${isSystem ? 'system' : ''}" 
           style="margin-bottom:8px; display:flex; ${isUser ? 'justify-content:flex-end' : 'justify-content:flex-start'};">
        <div style="max-width:70%; padding:12px 16px; border-radius:18px; 
                    background:${isUser ? 'var(--brand)' : isSystem ? 'var(--bg-2)' : 'var(--bg-2)'}; 
                    color:${isUser ? 'white' : 'var(--text)'}; 
                    border-bottom-${isUser ? 'right' : 'left'}-radius:4px;">
          ${msg.text}
          
          ${msg.type === 'order' ? `
            <div style="margin-top:8px; padding:8px; background:${isUser ? 'rgba(255,255,255,0.1)' : 'var(--border)'}; border-radius:8px;">
              <div style="font-weight:500; margin-bottom:4px;">${t("order")} #${msg.orderId}</div>
              <div class="small">${t("total")}: ${fmt(msg.orderTotal)}</div>
            </div>
          ` : ''}
          
          ${msg.type === 'product' ? `
            <div style="margin-top:8px; padding:8px; background:${isUser ? 'rgba(255,255,255,0.1)' : 'var(--border)'}; border-radius:8px; cursor:pointer;"
                 onclick="window.StoreZ.navigate('#/pdp/${msg.productId}')">
              <div style="font-weight:500; margin-bottom:4px;">${getProductField(productById(msg.productId), 'name')}</div>
              <div class="small">${fmt(productById(msg.productId).price)}</div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  // Message input area
  const messageInput = `
    <div class="message-input" style="padding:16px; border-top:1px solid var(--border); background:var(--bg); position:sticky; bottom:0;">
      <div class="row" style="gap:8px; align-items:flex-end;">
        <div style="flex:1; position:relative;">
          <textarea id="messageText" placeholder="${t("type_message")}" 
                    style="width:100%; min-height:40px; max-height:120px; padding:12px 16px; border:1px solid var(--border); 
                           border-radius:20px; resize:none; outline:none; font-family:inherit;"
                    onkeydown="window.__handleMessageInput(event, '${conversationId}')"></textarea>
        </div>
        
        <button class="send-button" onclick="window.__sendMessage('${conversationId}')" 
                style="width:40px; height:40px; border-radius:50%; background:var(--brand); color:white; border:none; 
                       display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.2s ease;"
                disabled>
          ➤
        </button>
      </div>
      
      <!-- Quick actions -->
      ${isSupport ? `
        <div class="quick-actions" style="margin-top:12px;">
          <div class="row" style="gap:8px; flex-wrap:wrap;">
            <button class="ghost small" onclick="window.__sendQuickMessage('${conversationId}', '${t("order_status_inquiry")}')">${t("order_status")}</button>
            <button class="ghost small" onclick="window.__sendQuickMessage('${conversationId}', '${t("return_request")}')">${t("return_help")}</button>
            <button class="ghost small" onclick="window.__sendQuickMessage('${conversationId}', '${t("product_question")}')">${t("product_question")}</button>
          </div>
        </div>
      ` : isCreator ? `
        <div class="quick-actions" style="margin-top:12px;">
          <div class="row" style="gap:8px; flex-wrap:wrap;">
            <button class="ghost small" onclick="window.__sendQuickMessage('${conversationId}', '👋 ${t("say_hello")}')">${t("say_hello")}</button>
            <button class="ghost small" onclick="window.__sendQuickMessage('${conversationId}', '${t("product_recommendation")}')">${t("get_recommendations")}</button>
            ${creator?.live ? `
              <button class="ghost small" onclick="window.__sendQuickMessage('${conversationId}', '${t("join_live_question")}')">${t("ask_about_live")}</button>
            ` : ''}
          </div>
        </div>
      ` : ''}
    </div>
  `;

  ctx.el.innerHTML = h(`
    <div class="chat-container" style="display:flex; flex-direction:column; height:80vh; border:1px solid var(--border); border-radius:8px; overflow:hidden;">
      ${chatHeader}
      
      <div class="messages-container" style="flex:1; overflow-y:auto; padding:16px;" id="messagesContainer">
        ${messagesList}
      </div>
      
      ${messageInput}
    </div>
  `);

  // Auto-scroll to bottom
  setTimeout(() => {
    const container = document.getElementById('messagesContainer');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, 100);

  // Enable/disable send button based on input
  const textarea = document.getElementById('messageText');
  const sendButton = document.querySelector('.send-button');
  if (textarea && sendButton) {
    textarea.addEventListener('input', () => {
      const hasText = textarea.value.trim().length > 0;
      sendButton.disabled = !hasText;
      sendButton.style.opacity = hasText ? '1' : '0.5';
    });
  }
}

function notifications(ctx) {
  const n = state.prefs.notif || { orders: true, live: true, marketing: false, consent: true };
  ctx.el.innerHTML = h(`
    <section class="panel">
      <strong>${t("notifications")}</strong>
      <p class="muted">${t("notif_desc")}</p>
      <label><input type="checkbox" id="n_orders" ${n.orders ? "checked" : ""}/> ${t("notif_orders")}</label>
      <label><input type="checkbox" id="n_live" ${n.live ? "checked" : ""}/> ${t("notif_live")}</label>
      <label><input type="checkbox" id="n_marketing" ${n.marketing ? "checked" : ""}/> ${t("notif_marketing")}</label>
      <label><input type="checkbox" id="n_consent" ${n.consent ? "checked" : ""}/> ${t("consent_pdpl")}</label>
      <div class="row" style="gap:8px; margin-top:10px">
        <button class="secondary" type="button" onclick="(function(){ const s=window.StoreZ.state; s.prefs.notif={ orders:document.getElementById('n_orders').checked, live:document.getElementById('n_live').checked, marketing:document.getElementById('n_marketing').checked, consent:document.getElementById('n_consent').checked }; window.StoreZ.navigate('#/profile'); })()">${t("submit")}</button>
        <button class="ghost" type="button" onclick="window.StoreZ.navigate('#/profile')">${t("back")}</button>
      </div>
    </section>
  `);
}

function addresses(ctx) {
  ctx.el.innerHTML = h(`
    <section class="panel">
      <strong>${t("addresses")}</strong>
      <div class="list" style="margin-top:10px">
        <div class="item">
          <div style="flex:1">
            <strong>${(localStorage.getItem("storez_lang") || "en") === "ar" ? "الرياض" : "Riyadh"}</strong>
            <div class="muted">${(localStorage.getItem("storez_lang") || "en") === "ar" ? "السعودية" : "Saudi Arabia"}</div>
          </div>
        </div>
      </div>
      <hr/>
      <button class="secondary" type="button">${t("add_address")}</button>
    </section>
  `);
}

function payments(ctx) {
  ctx.el.innerHTML = h(`
    <section class="panel">
      <strong>${t("payments")}</strong>
      <div class="list" style="margin-top:10px">
        <div class="item">
          <div style="flex:1">
            <strong>•••• 4242</strong>
            <div class="muted">Visa</div>
          </div>
        </div>
      </div>
      <hr/>
      <button class="secondary" type="button">${t("add_card")}</button>
    </section>
  `);
}

function profile(ctx) {
  const user = state.user;
  const isGuest = user.guest;
  
  ctx.el.innerHTML = h(`
    <section class="panel">
      <!-- User header -->
      <div class="row between" style="margin-bottom:20px">
        <div>
          <strong>${user.name}</strong>
          <div class="muted">
            ${isGuest ? t("guest_user") : (user.email || `ID: ${user.id}`)}
          </div>
          <div class="muted">${t("credits")}: ${user.credits}</div>
        </div>
        <div style="text-align:right">
          ${isGuest ? `
            <button class="chip" onclick="window.StoreZ.navigate('#/auth')" style="background:var(--brand); color:white">
              ${t("sign_up")}
            </button>
          ` : `
            <span class="chip success">${t("verified")}</span>
          `}
        </div>
      </div>
      
      ${!isGuest && user.interests && user.interests.length > 0 ? `
        <!-- User interests -->
        <div style="margin-bottom:20px">
          <h3>${t("your_interests")}</h3>
          <div class="row" style="gap:8px; flex-wrap:wrap">
            ${user.interests.map(interest => `
              <span class="chip" style="background:var(--brand-2); color:white">${interest}</span>
            `).join("")}
          </div>
          <button class="ghost small" onclick="window.StoreZ.navigate('#/onboarding')" style="margin-top:8px">
            ${t("edit_interests")}
          </button>
        </div>
      ` : ''}
      
      ${!isGuest && user.followedCreators && user.followedCreators.length > 0 ? `
        <!-- Followed creators -->
        <div style="margin-bottom:20px">
          <h3>${t("following")}</h3>
          <div class="row" style="gap:8px; flex-wrap:wrap">
            ${user.followedCreators.map(creatorId => {
              const creator = state.creators.find(c => c.id === creatorId);
              return creator ? `
                <a href="#/creator/${creatorId}" class="chip" style="background:var(--panel)">
                  ${creator.name}
                </a>
              ` : '';
            }).join("")}
          </div>
        </div>
      ` : ''}
      
      <!-- Profile actions -->
      <div class="grid" style="grid-template-columns:1fr 1fr; gap:12px">
        <a class="panel" href="#/orders">
          <strong>${t("orders_btn")}</strong>
          <div class="muted">${t("your_orders")}</div>
        </a>
        <a class="panel" href="#/support">
          <strong>${t("support")}</strong>
          <div class="muted">${t("support_btn")}</div>
        </a>
        <a class="panel" href="#/notifications">
          <strong>${t("notifications")}</strong>
          <div class="muted">${t("preferences")}</div>
        </a>
        <a class="panel" href="#/referrals">
          <strong>${t("referrals")}</strong>
          <div class="muted">${t("invite_friends")}</div>
        </a>
        <a class="panel" href="#/addresses">
          <strong>${t("addresses")}</strong>
          <div class="muted">${t("manage_addresses")}</div>
        </a>
        <a class="panel" href="#/payments">
          <strong>${t("payments")}</strong>
          <div class="muted">${t("manage_payments")}</div>
        </a>
      </div>
      
      ${!isGuest ? `
        <!-- Account actions -->
        <div style="margin-top:24px; text-align:center">
          <button class="ghost small" onclick="window.__signOut && window.__signOut()" style="color:var(--danger,#ff4444)">
            ${t("sign_out")}
          </button>
        </div>
      ` : ''}
    </section>
  `);
  
  // Sign out function
  window.__signOut = () => {
    if (confirm(t("confirm_sign_out"))) {
      // Reset user to guest state
      state.user = {
        id: "guest",
        name: "Guest User",
        email: "",
        authed: true,
        guest: true,
        credits: 0,
        referrals: 0,
        authMethod: "",
        interests: [],
        preferences: { marketing: false, orders: true, live: false },
        followedCreators: [],
        onboardingCompleted: false
      };
      
      actions.saveState(state);
      navigate("#/landing");
    }
  };
}

function support(ctx) {
  ctx.el.innerHTML = h(`
    <section class="panel">
      <strong>${t("support")}</strong>
      <details open><summary>${t("returns")}</summary><p class="muted">30 ${(localStorage.getItem("storez_lang") || "en") === "ar" ? "يومًا" : "days"} — ${(localStorage.getItem("storez_lang") || "en") === "ar" ? "استرجاع المبلغ للوسيلة الأصلية." : "Refund to original payment method."}</p></details>
      <details><summary>${t("shipping_info")}</summary><p class="muted">${(localStorage.getItem("storez_lang") || "en") === "ar" ? "الشحن القياسي ٢–٥ أيام. السريع خلال يوم في المدن الكبرى." : "Standard 2–5 days. Express next-day in major cities."}</p></details>
      <details><summary>${t("contact_us")}</summary>
        <p class="muted">${t("ticket_note")}</p>
        <div class="row" style="gap:8px">
          <input id="ticket" placeholder="${t("describe_issue")}" />
          <button class="secondary" type="button" onclick="(function(){ const txt=document.getElementById('ticket').value.trim(); if(!txt) return; window.StoreZ.actions.createSupportTicket('${t("ticket_recv")}' + txt); window.StoreZ.navigate('#/messages'); })()">${t("submit")}</button>
        </div>
      </details>
    </section>
  `);
}

function referrals(ctx) {
  const code = `STOREZ-${state.user.id.toUpperCase()}`;
  const earn = (localStorage.getItem("storez_lang") || "en") === "ar" ? "٢٠ ر.س" : "SAR 20";
  ctx.el.innerHTML = h(`
    <section class="panel">
      <strong>${t("referrals")}</strong>
      <p class="muted">${(localStorage.getItem("storez_lang") || "en") === "ar" ? "شارك كودك. تربح " + earn + " لكل صديق يشتري أول مرة." : "Share your code. Earn " + earn + " for each friend’s first purchase."}</p>
      <div class="row" style="gap:8px">
        <input id="ref" value="${code}" readonly />
        <button class="secondary" type="button" onclick="navigator.clipboard.writeText(document.getElementById('ref').value)">${t("copy")}</button>
      </div>
    </section>
  `);
}

function live(ctx, id) {
  // If specific stream ID provided, show the live stream viewer
  if (id && id !== 'index') {
    return liveStream(ctx, id);
  }
  
  // Otherwise show live commerce hub with all streams
  const activeStreams = state.live?.activeStreams || [];
  const upcomingStreams = state.live?.upcomingStreams || [];
  const featuredStreams = state.live?.featuredStreams || [];
  
  // Get current Saudi time for scheduling
  const saudiTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Riyadh' });
  const currentHour = new Date(saudiTime).getHours();
  const greeting = currentHour < 12 ? t("good_morning") : currentHour < 17 ? t("good_afternoon") : t("good_evening");
  
  ctx.el.innerHTML = h(`
    <section class="panel">
      <header>
        <h2>${t("live_commerce")} 🔴</h2>
        <p class="muted">${greeting}! ${t("discover_live_shows")}</p>
      </header>
      
      <!-- Active Live Streams -->
      ${activeStreams.length > 0 ? `
        <div style="margin-bottom:24px">
          <div class="row between" style="margin-bottom:12px">
            <h3>${t("live_now")} (${activeStreams.length})</h3>
            <span class="chip pulse" style="background:var(--danger,#ff4444); color:white">● LIVE</span>
          </div>
          
          <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:16px">
            ${activeStreams.map(stream => {
              const creator = creatorById(stream.creatorId);
              const streamProducts = stream.products.map(pid => productById(pid)).filter(Boolean);
              const duration = Math.floor((Date.now() - stream.startTime) / 60000);
              
              return `
                <div class="panel hover" onclick="window.StoreZ.navigate('#/live/${stream.id}')" 
                     style="cursor:pointer; position:relative; overflow:hidden">
                  <div style="position:relative">
                    <img src="${stream.thumbnail}" alt="${stream.title}" 
                         style="width:100%; aspect-ratio:16/9; object-fit:cover; border-radius:8px" />
                    
                    <!-- Live overlay -->
                    <div style="position:absolute; top:8px; left:8px; right:8px; display:flex; justify-content:space-between">
                      <span class="chip" style="background:var(--danger,#ff4444); color:white; font-size:12px">
                        ● LIVE
                      </span>
                      <span class="chip" style="background:rgba(0,0,0,0.7); color:white; font-size:12px">
                        👁 ${stream.viewers.toLocaleString()}
                      </span>
                    </div>
                    
                    <!-- Duration overlay -->
                    <div style="position:absolute; bottom:8px; right:8px">
                      <span class="chip" style="background:rgba(0,0,0,0.7); color:white; font-size:12px">
                        ${duration}m
                      </span>
                    </div>
                    
                    <!-- Play button -->
                    <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); 
                               width:48px; height:48px; border-radius:50%; background:rgba(255,255,255,0.9); 
                               display:flex; align-items:center; justify-content:center; font-size:20px">
                      ▶️
                    </div>
                  </div>
                  
                  <div style="padding:12px">
                    <strong style="display:block; margin-bottom:4px">${stream.title}</strong>
                    <div class="row" style="gap:8px; margin-bottom:8px">
                      <div style="width:24px;height:24px;border-radius:50%;background:var(--brand);display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:12px">
                        ${creator?.name?.[0] || '?'}
                      </div>
                      <span style="color:var(--brand)">${stream.creator}</span>
                    </div>
                    
                    <!-- Stream tags -->
                    <div class="row" style="gap:4px; margin-bottom:8px">
                      ${stream.tags.map(tag => `<span class="chip small" style="font-size:11px">${tag}</span>`).join('')}
                    </div>
                    
                    <!-- Flash deals if any -->
                    ${stream.flashDeals?.length > 0 ? `
                      <div style="background:var(--brand-2); color:white; padding:8px; border-radius:6px; font-size:12px">
                        🔥 ${stream.flashDeals.length} ${t("flash_deals_active")}
                      </div>
                    ` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}
      
      <!-- Upcoming Streams -->
      ${upcomingStreams.length > 0 ? `
        <div style="margin-bottom:24px">
          <h3 style="margin-bottom:12px">${t("upcoming_streams")}</h3>
          
          <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:16px">
            ${upcomingStreams.map(stream => {
              const creator = creatorById(stream.creatorId);
              const timeUntil = Math.floor((stream.scheduledTime - Date.now()) / 60000);
              const saudiScheduleTime = new Date(stream.scheduledTime).toLocaleString('en-US', { 
                timeZone: 'Asia/Riyadh', 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              });
              
              return `
                <div class="panel hover" onclick="window.__setStreamReminder('${stream.id}')" 
                     style="cursor:pointer; opacity:0.9">
                  <div style="position:relative">
                    <img src="${stream.thumbnail}" alt="${stream.title}" 
                         style="width:100%; aspect-ratio:16/9; object-fit:cover; border-radius:8px; filter:brightness(0.8)" />
                    
                    <!-- Scheduled overlay -->
                    <div style="position:absolute; top:8px; left:8px; right:8px; display:flex; justify-content:space-between">
                      <span class="chip" style="background:var(--brand); color:white; font-size:12px">
                        📅 ${t("scheduled")}
                      </span>
                      <span class="chip" style="background:rgba(0,0,0,0.7); color:white; font-size:12px">
                        ${timeUntil > 60 ? Math.floor(timeUntil/60) + 'h' : timeUntil + 'm'}
                      </span>
                    </div>
                    
                    <!-- Schedule time -->
                    <div style="position:absolute; bottom:8px; left:8px; right:8px; text-align:center">
                      <span class="chip" style="background:rgba(0,0,0,0.8); color:white; font-size:12px">
                        🕐 ${saudiScheduleTime} ${t("saudi_time")}
                      </span>
                    </div>
                    
                    <!-- Bell icon -->
                    <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); 
                               width:48px; height:48px; border-radius:50%; background:rgba(255,255,255,0.9); 
                               display:flex; align-items:center; justify-content:center; font-size:20px">
                      🔔
                    </div>
                  </div>
                  
                  <div style="padding:12px">
                    <strong style="display:block; margin-bottom:4px">${stream.title}</strong>
                    <div class="row" style="gap:8px; margin-bottom:8px">
                      <div style="width:24px;height:24px;border-radius:50%;background:var(--brand);display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:12px">
                        ${creator?.name?.[0] || '?'}
                      </div>
                      <span style="color:var(--brand)">${stream.creator}</span>
                    </div>
                    
                    <p style="font-size:14px; color:var(--muted); margin-bottom:8px">${stream.description}</p>
                    
                    <div class="row between">
                      <span style="font-size:12px; color:var(--muted)">${stream.estimatedDuration} ${t("minutes")}</span>
                      <span style="font-size:12px; color:var(--brand)">${stream.reminders} ${t("reminders_set")}</span>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}
      
      <!-- Featured Stream Series -->
      ${featuredStreams.length > 0 ? `
        <div style="margin-bottom:24px">
          <h3 style="margin-bottom:12px">${t("featured_series")}</h3>
          
          ${featuredStreams.map(stream => {
            const creator = creatorById(stream.creatorId);
            const nextDate = new Date(stream.nextEpisode).toLocaleDateString('en-US', { 
              timeZone: 'Asia/Riyadh',
              weekday: 'long',
              month: 'short',
              day: 'numeric'
            });
            
            return `
              <div class="panel" style="background:linear-gradient(135deg, var(--brand), var(--brand-2)); color:white; margin-bottom:16px">
                <div class="row" style="gap:16px">
                  <div style="flex:1">
                    <div class="row" style="gap:8px; margin-bottom:8px">
                      <span class="chip" style="background:rgba(255,255,255,0.2); color:white; font-size:12px">
                        ⭐ ${t("featured_series")}
                      </span>
                      <span class="chip" style="background:rgba(255,255,255,0.2); color:white; font-size:12px">
                        ${stream.episodeCount} ${t("episodes")}
                      </span>
                    </div>
                    
                    <h4 style="margin-bottom:8px">${stream.title}</h4>
                    
                    <div class="row" style="gap:8px; margin-bottom:12px">
                      <div style="width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-weight:bold">
                        ${creator?.name?.[0] || '?'}
                      </div>
                      <div>
                        <div style="font-weight:bold">${stream.creator}</div>
                        <div style="opacity:0.8; font-size:12px">${stream.subscribers.toLocaleString()} ${t("subscribers")}</div>
                      </div>
                    </div>
                    
                    <div class="row between">
                      <span style="opacity:0.9">${t("next_episode")}: ${nextDate}</span>
                      <button class="ghost" style="border-color:white; color:white" 
                              onclick="window.__subscribeToSeries('${stream.id}')">
                        ${t("subscribe")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}
      
      <!-- Live Shopping Stats -->
      <div class="panel" style="background:var(--panel); text-align:center; margin-bottom:16px">
        <h4 style="margin-bottom:12px">${t("live_shopping_today")}</h4>
        <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(120px,1fr)); gap:16px">
          <div>
            <div style="font-size:24px; font-weight:bold; color:var(--brand)">${activeStreams.reduce((sum, s) => sum + s.viewers, 0).toLocaleString()}</div>
            <div style="font-size:12px; color:var(--muted)">${t("total_viewers")}</div>
          </div>
          <div>
            <div style="font-size:24px; font-weight:bold; color:var(--brand)">${activeStreams.length + upcomingStreams.length}</div>
            <div style="font-size:12px; color:var(--muted)">${t("streams_today")}</div>
          </div>
          <div>
            <div style="font-size:24px; font-weight:bold; color:var(--brand)">${activeStreams.reduce((sum, s) => sum + (s.flashDeals?.length || 0), 0)}</div>
            <div style="font-size:12px; color:var(--muted)">${t("active_deals")}</div>
          </div>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="row" style="gap:8px">
        <button class="secondary" onclick="window.__browseLiveCreators()" style="flex:1">
          � ${t("browse_creators")}
        </button>
        <button class="secondary" onclick="window.__goLiveGuide()" style="flex:1">
          � ${t("go_live_guide")}
        </button>
        <button class="secondary" onclick="window.StoreZ.navigate('#/notifications')" style="flex:1">
          � ${t("live_notifications")}
        </button>
      </div>
    </section>
  `);

// Live shopping interaction functions
window.__switchLiveTab = (tab) => {
  // Update tab appearance
  document.getElementById('chatTab')?.classList.toggle('active', tab === 'chat');
  document.getElementById('productsTab')?.classList.toggle('active', tab === 'products');
  document.getElementById('dealTab')?.classList.toggle('active', tab === 'deals');
  
  if (tab === 'chat') {
    document.getElementById('chatTab').style.background = 'var(--brand)';
    document.getElementById('chatTab').style.color = 'white';
    document.getElementById('productsTab').style.background = '';
    document.getElementById('productsTab').style.color = '';
    document.getElementById('dealTab').style.background = '';
    document.getElementById('dealTab').style.color = '';
  } else if (tab === 'products') {
    document.getElementById('productsTab').style.background = 'var(--brand)';
    document.getElementById('productsTab').style.color = 'white';
    document.getElementById('chatTab').style.background = '';
    document.getElementById('chatTab').style.color = '';
    document.getElementById('dealTab').style.background = '';
    document.getElementById('dealTab').style.color = '';
  } else if (tab === 'deals') {
    document.getElementById('dealTab').style.background = 'var(--brand)';
    document.getElementById('dealTab').style.color = 'white';
    document.getElementById('chatTab').style.background = '';
    document.getElementById('chatTab').style.color = '';
    document.getElementById('productsTab').style.background = '';
    document.getElementById('productsTab').style.color = '';
  }
  
  // Show/hide content
  document.getElementById('chatView').style.display = tab === 'chat' ? 'block' : 'none';
  document.getElementById('productsView').style.display = tab === 'products' ? 'block' : 'none';
  document.getElementById('dealView').style.display = tab === 'deals' ? 'block' : 'none';
};

window.__sendLiveMessage = () => {
  const input = document.getElementById('liveMessage');
  const message = input?.value.trim();
  
  if (!message) return;
  
  if (state.user.guest) {
    if (confirm(t("sign_up_to_chat"))) {
      navigate("#/auth");
    }
    return;
  }
  
  const chatContainer = document.querySelector('#chatView > div');
  if (chatContainer) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'live-message';
    messageDiv.innerHTML = `<strong style="color:var(--brand)">@${state.user.name.toLowerCase()}:</strong> <span>${message}</span>`;
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    input.value = '';
  }
};

window.__sendQuickReaction = (emoji = '❤️') => {
  if (state.user.guest) {
    if (confirm(t("sign_up_to_react"))) {
      navigate("#/auth");
    }
    return;
  }
  
  const chatContainer = document.querySelector('#chatView > div');
  if (chatContainer) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'live-message';
    messageDiv.innerHTML = `<strong style="color:var(--brand)">@${state.user.name.toLowerCase()}:</strong> <span>${emoji}</span>`;
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
};

window.__toggleMute = () => {
  const btn = event.target;
  const isMuted = btn.textContent === '🔇';
  btn.textContent = isMuted ? '🔊' : '🔇';
  btn.title = isMuted ? t("unmute") : t("mute");
};

window.__toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
};

window.__togglePlayback = () => {
  const btn = document.getElementById('playButton');
  if (btn) {
    const isPlaying = btn.textContent === '⏸️';
    btn.textContent = isPlaying ? '▶️' : '⏸️';
    btn.style.opacity = isPlaying ? '0.9' : '0.5';
  }
};

window.__shareLive = (streamId) => {
  const shareData = {
    title: `🔴 Live on StoreZ!`,
    text: `Watch amazing products live on StoreZ!`,
    url: `${location.origin}${location.pathname}#/live/${streamId}`
  };
  
  if (navigator.share) {
    navigator.share(shareData);
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(shareData.url).then(() => {
      alert(t("link_copied"));
    });
  }
};

window.__followCreator = (creatorId) => {
  if (state.user.guest) {
    if (confirm(t("sign_up_to_follow"))) {
      navigate("#/auth");
    }
    return;
  }
  
  const creator = creatorById(creatorId);
  if (creator) {
    alert(`${t("following")} ${creator.name}! 🎉`);
  }
};

window.__setStreamReminder = (streamId) => {
  if (state.user.guest) {
    if (confirm(t("sign_up_for_reminders"))) {
      navigate("#/auth");
    }
    return;
  }
  
  const stream = state.live?.upcomingStreams?.find(s => s.id === streamId);
  if (stream) {
    alert(`${t("reminder_set")} ${stream.title}! 🔔`);
  }
};

window.__subscribeToSeries = (seriesId) => {
  if (state.user.guest) {
    if (confirm(t("sign_up_to_subscribe"))) {
      navigate("#/auth");
    }
    return;
  }
  
  const series = state.live?.featuredStreams?.find(s => s.id === seriesId);
  if (series) {
    alert(`${t("subscribed_to")} ${series.title}! 📺`);
  }
};

window.__browseLiveCreators = () => {
  navigate("#/discover?tab=creators&filter=live");
};

window.__goLiveGuide = () => {
  alert(t("go_live_guide_info"));
};

window.__reportLive = (streamId) => {
  if (state.user.guest) {
    if (confirm(t("sign_up_to_report"))) {
      navigate("#/auth");
    }
    return;
  }
  
  const reasons = [t("inappropriate_content"), t("spam"), t("fake_products"), t("harassment"), t("other")];
  const reason = prompt(t("report_live_reason") + "\n\n" + reasons.map((r, i) => `${i+1}. ${r}`).join("\n"));
  
  if (reason) {
    alert(t("report_submitted"));
  }
};


/* ---------- route table ---------- */
export const routes = {
  "/landing": landing,
  "/auth": auth,
  "/onboarding": onboarding,
  "/home": home,
  "/discover": discover,
  "/category": category,
  "/pdp": pdp,
  "/creator": creator,
  "/cart": cart,
  "/checkout": checkout,
  "/orders": orders,
  "/order": orderDetail,
  "/wishlist": wishlist,
  "/messages": messages,
  "/notifications": notifications,
  "/addresses": addresses,
  "/payments": payments,
  "/profile": profile,
  "/support": support,
  "/referrals": referrals,
  "/live": live,
  "/order-confirmation": orderConfirmation,
  "/chat": chat,
  "/ugcfeed": ugcfeed,
  "/createpost": createpost,
  "/analytics": analytics
};

// Performance & Analytics Dashboard
function analytics(ctx) {
  const report = window.__performanceMonitor?.getReport() || {};
  const analyticsData = state.analytics || { metrics: [], errors: [] };
  
  ctx.el.innerHTML = h(`
    <section class="analytics-dashboard">
      <div class="dashboard-header">
        <h2>${t("performance_analytics")}</h2>
        <div class="dashboard-actions">
          <button class="secondary" onclick="window.__exportAnalytics()">${t("export_data")}</button>
          <button class="ghost" onclick="window.__clearAnalytics()">${t("clear_data")}</button>
        </div>
      </div>

      <!-- Web Vitals Section -->
      <div class="vitals-section">
        <h3>${t("web_vitals")}</h3>
        <div class="vitals-grid">
          <div class="vital-card">
            <div class="vital-label">LCP</div>
            <div class="vital-value ${report.webVitals?.lcpGrade?.toLowerCase() || 'unknown'}">${Math.round(report.webVitals?.lcp || 0)}ms</div>
            <div class="vital-grade">${report.webVitals?.lcpGrade || 'Unknown'}</div>
            <div class="vital-desc">${t("lcp_description")}</div>
          </div>
          
          <div class="vital-card">
            <div class="vital-label">FID</div>
            <div class="vital-value ${report.webVitals?.fidGrade?.toLowerCase() || 'unknown'}">${Math.round(report.webVitals?.fid || 0)}ms</div>
            <div class="vital-grade">${report.webVitals?.fidGrade || 'Unknown'}</div>
            <div class="vital-desc">${t("fid_description")}</div>
          </div>
          
          <div class="vital-card">
            <div class="vital-label">CLS</div>
            <div class="vital-value ${report.webVitals?.clsGrade?.toLowerCase() || 'unknown'}">${(report.webVitals?.cls || 0).toFixed(3)}</div>
            <div class="vital-grade">${report.webVitals?.clsGrade || 'Unknown'}</div>
            <div class="vital-desc">${t("cls_description")}</div>
          </div>
        </div>
      </div>

      <!-- Performance Metrics -->
      <div class="metrics-section">
        <h3>${t("performance_metrics")}</h3>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">📊</div>
            <div class="metric-value">${report.totalMetrics || 0}</div>
            <div class="metric-label">${t("total_metrics")}</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">🚨</div>
            <div class="metric-value">${report.totalErrors || 0}</div>
            <div class="metric-label">${t("total_errors")}</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">⚡</div>
            <div class="metric-value">${Math.round(report.avgLoadTime || 0)}ms</div>
            <div class="metric-label">${t("avg_load_time")}</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">👆</div>
            <div class="metric-value">${report.interactions || 0}</div>
            <div class="metric-label">${t("user_interactions")}</div>
          </div>
        </div>
      </div>

      <!-- Accessibility Status -->
      <div class="accessibility-section">
        <h3>${t("accessibility_status")}</h3>
        <div class="accessibility-checklist">
          <div class="check-item">
            <span class="check-icon">✅</span>
            <span>${t("keyboard_navigation")}</span>
          </div>
          <div class="check-item">
            <span class="check-icon">✅</span>
            <span>${t("screen_reader_support")}</span>
          </div>
          <div class="check-item">
            <span class="check-icon">✅</span>
            <span>${t("focus_management")}</span>
          </div>
          <div class="check-item">
            <span class="check-icon">✅</span>
            <span>${t("color_contrast")}</span>
          </div>
          <div class="check-item">
            <span class="check-icon">✅</span>
            <span>${t("semantic_html")}</span>
          </div>
          <div class="check-item">
            <span class="check-icon">✅</span>
            <span>${t("aria_labels")}</span>
          </div>
        </div>
        
        <div class="accessibility-actions">
          <button class="secondary" onclick="window.__runA11yAudit()">${t("run_accessibility_audit")}</button>
          <button class="ghost" onclick="window.__toggleHighContrast()">${t("toggle_high_contrast")}</button>
        </div>
      </div>

      <!-- Recent Errors -->
      ${analyticsData.errors?.length > 0 ? `
        <div class="errors-section">
          <h3>${t("recent_errors")}</h3>
          <div class="errors-list">
            ${analyticsData.errors.slice(-5).map(error => `
              <div class="error-item">
                <div class="error-message">${error.message}</div>
                <div class="error-meta">
                  <span>${new Date(error.timestamp).toLocaleString()}</span>
                  <span>${error.source}</span>
                  ${error.line ? `<span>Line ${error.line}</span>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Performance Tips -->
      <div class="tips-section">
        <h3>${t("optimization_tips")}</h3>
        <div class="tips-list">
          <div class="tip-item">
            <div class="tip-icon">🖼️</div>
            <div>
              <strong>${t("image_optimization")}</strong>
              <p>${t("image_optimization_desc")}</p>
            </div>
          </div>
          
          <div class="tip-item">
            <div class="tip-icon">📱</div>
            <div>
              <strong>${t("mobile_first")}</strong>
              <p>${t("mobile_first_desc")}</p>
            </div>
          </div>
          
          <div class="tip-item">
            <div class="tip-icon">♿</div>
            <div>
              <strong>${t("accessibility_best_practices")}</strong>
              <p>${t("accessibility_best_practices_desc")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <style>
      .analytics-dashboard { padding: 20px; max-width: 1200px; margin: 0 auto; }
      .dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
      .dashboard-header h2 { margin: 0; }
      .dashboard-actions { display: flex; gap: 12px; }
      
      .vitals-section, .metrics-section, .accessibility-section, .errors-section, .tips-section { 
        margin-bottom: 40px; 
      }
      .vitals-section h3, .metrics-section h3, .accessibility-section h3, .errors-section h3, .tips-section h3 { 
        margin: 0 0 20px 0; 
        padding-bottom: 8px; 
        border-bottom: 2px solid var(--primary); 
      }
      
      .vitals-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
      .vital-card { background: var(--bg-secondary); padding: 20px; border-radius: 12px; text-align: center; }
      .vital-label { font-size: 14px; color: var(--text-muted); margin-bottom: 8px; }
      .vital-value { font-size: 32px; font-weight: bold; margin-bottom: 8px; }
      .vital-value.good { color: #22c55e; }
      .vital-value.needs { color: #f59e0b; }
      .vital-value.poor { color: #ef4444; }
      .vital-grade { font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 8px; }
      .vital-desc { font-size: 12px; color: var(--text-muted); }
      
      .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; }
      .metric-card { background: var(--bg-secondary); padding: 16px; border-radius: 8px; text-align: center; }
      .metric-icon { font-size: 24px; margin-bottom: 8px; }
      .metric-value { font-size: 24px; font-weight: bold; color: var(--primary); margin-bottom: 4px; }
      .metric-label { font-size: 12px; color: var(--text-muted); }
      
      .accessibility-checklist { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 12px; margin-bottom: 20px; }
      .check-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--bg-secondary); border-radius: 8px; }
      .check-icon { font-size: 18px; }
      .accessibility-actions { display: flex; gap: 12px; }
      
      .errors-list { display: flex; flex-direction: column; gap: 12px; }
      .error-item { padding: 16px; background: var(--bg-secondary); border-left: 4px solid #ef4444; border-radius: 0 8px 8px 0; }
      .error-message { font-weight: bold; margin-bottom: 8px; }
      .error-meta { display: flex; gap: 16px; font-size: 12px; color: var(--text-muted); }
      
      .tips-list { display: flex; flex-direction: column; gap: 16px; }
      .tip-item { display: flex; gap: 16px; padding: 16px; background: var(--bg-secondary); border-radius: 8px; }
      .tip-icon { font-size: 24px; flex-shrink: 0; }
      .tip-item strong { display: block; margin-bottom: 4px; }
      .tip-item p { margin: 0; color: var(--text-muted); font-size: 14px; }
      
      @media (max-width: 720px) {
        .analytics-dashboard { padding: 16px; }
        .dashboard-header { flex-direction: column; gap: 16px; align-items: stretch; }
        .dashboard-actions { justify-content: center; }
        .vitals-grid, .metrics-grid { grid-template-columns: 1fr; }
        .accessibility-checklist { grid-template-columns: 1fr; }
        .accessibility-actions { flex-direction: column; }
      }
    </style>
  `);
  
  // Track analytics page view
  window.__performanceMonitor?.trackMetric('page_view', 1, { page: 'analytics' });
}

// UGC Feed route for social content
function ugcfeed(ctx) {
  const filter = new URLSearchParams(location.hash.split('?')[1] || '').get('filter') || 'all';
  const ugcPosts = state.ugcFeed || [];
  const trending = ugcPosts.filter(p => p.likes > 80);
  const withProducts = ugcPosts.filter(p => p.taggedProducts?.length > 0);
  
  // Get featured creators and their latest posts
  const featuredCreators = state.creators.filter(c => c.verified || c.followers > 100000);
  
  ctx.el.innerHTML = h(`
    <section class="ugc-feed">
      <!-- Header with create button -->
      <div class="feed-header">
        <h2>${t("ugc_feed")} 📱</h2>
        <button class="create-btn" onclick="window.__createUGCPost()">
          <span class="icon">📷</span>
          ${t("create_post")}
        </button>
      </div>

      <!-- Featured creators section -->
      ${featuredCreators.length > 0 ? `
        <div style="margin-bottom:24px">
          <h3 style="margin-bottom:12px">${t("top_creators")} ⭐</h3>
          <div style="display:flex; gap:12px; overflow-x:auto; padding-bottom:8px">
            ${featuredCreators.slice(0, 5).map(creator => {
              const creatorPosts = ugcPosts.filter(p => p.creatorId === creator.id);
              const latestPost = creatorPosts[0];
              
              return `
                <div class="panel" onclick="window.__viewCreatorProfile('${creator.id}')" 
                     style="min-width:120px; text-align:center; cursor:pointer; background:linear-gradient(135deg, var(--brand), var(--brand-2)); color:white">
                  <div style="position:relative; margin-bottom:8px">
                    <img src="${creator.avatar}" alt="${creator.name}" 
                         style="width:60px; height:60px; border-radius:50%; border:3px solid rgba(255,255,255,0.3)" />
                    ${creator.verified ? '<div style="position:absolute; bottom:-2px; right:8px; background:white; border-radius:50%; padding:2px">✅</div>' : ''}
                  </div>
                  <strong style="font-size:14px; display:block">${creator.name}</strong>
                  <small style="opacity:0.8">${formatNumber(creator.followers)} ${t("followers")}</small>
                  ${latestPost ? `<div style="font-size:12px; margin-top:4px; opacity:0.7">${getTimeAgo(latestPost.timestamp)}</div>` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Filter buttons -->
      <div class="feed-filters">
        <button class="filter-btn ${filter === 'all' ? 'active' : ''}" 
                onclick="window.location.hash = '#/ugcfeed?filter=all'">${t("all_posts")}</button>
        <button class="filter-btn ${filter === 'following' ? 'active' : ''}" 
                onclick="window.location.hash = '#/ugcfeed?filter=following'">${t("following_posts")}</button>
        <button class="filter-btn ${filter === 'trending' ? 'active' : ''}" 
                onclick="window.location.hash = '#/ugcfeed?filter=trending'">${t("trending_posts")}</button>
        <button class="filter-btn ${filter === 'products' ? 'active' : ''}" 
                onclick="window.location.hash = '#/ugcfeed?filter=products'">${t("tagged_products")}</button>
      </div>

      <!-- Posts feed -->
      <div class="posts-container">
        ${(filter === 'all' ? ugcPosts : 
          filter === 'trending' ? trending :
          filter === 'products' ? withProducts :
          ugcPosts.filter(p => state.user.following?.includes(p.creatorId))
        ).map(post => {
          const creator = state.ugcCreators?.find(c => c.id === post.creatorId);
          
          return `
            <div class="post-card">
              <!-- Post header -->
              <div class="post-header">
                <div class="creator-info" onclick="window.__viewCreatorProfile('${post.creatorId}')">
                  <img src="${post.creatorAvatar}" alt="${post.creator}" class="creator-avatar" />
                  <div>
                    <strong class="creator-name">${post.creator}</strong>
                    ${creator?.verified ? ' ✅' : ''}
                    <div class="post-time">${getTimeAgo(post.timestamp)}</div>
                  </div>
                </div>
                <button class="post-menu" onclick="window.__showPostMenu('${post.id}')">⋯</button>
              </div>
              
              <!-- Post media -->
              <div class="post-media" onclick="window.__viewPostDetail('${post.id}')">
                <img src="${post.image}" alt="${post.caption}" />
                ${post.type === 'video' ? '<div class="play-button">▶</div>' : ''}
              </div>
              
              <!-- Post actions -->
              <div class="post-actions">
                <button class="action-btn ${post.liked ? 'liked' : ''}" onclick="window.__toggleLike('${post.id}')">
                  <span class="icon">${post.liked ? '❤️' : '🤍'}</span>
                  <span class="count" style="color:${post.liked ? 'var(--danger,#ff4444)' : 'var(--text)'}">${post.likes}</span>
                </button>
                <button class="action-btn" onclick="window.__showComments('${post.id}')">
                  <span class="icon">💬</span>
                  <span class="count">${post.comments}</span>
                </button>
                <button class="action-btn" onclick="window.__sharePost('${post.id}')">
                  <span class="icon">📤</span>
                  <span class="count">${post.shares || 0}</span>
                </button>
                <button class="action-btn ${post.saved ? 'saved' : ''}" onclick="window.__toggleSave('${post.id}')" style="margin-left:auto">
                  <span class="icon">${post.saved ? '🔖' : '📄'}</span>
                </button>
              </div>
              
              <!-- Post content -->
              <div class="post-content">
                <div class="post-caption">${post.caption}</div>
                
                ${post.taggedProducts?.length > 0 ? `
                  <div class="tagged-products">
                    <strong>${t("tagged_products")}:</strong>
                    <div class="product-tags">
                      ${post.taggedProducts.map(productId => {
                        const product = productById(productId);
                        return product ? `
                          <a href="#/pdp/${productId}" class="product-tag">
                            <img src="${uns(product.img, 200)}" alt="${getProductField(product, 'name')}" class="product-thumb">
                            <span>${getProductField(product, 'name')}</span>
                            <span class="price">${fmtSAR(product.price)}</span>
                          </a>
                        ` : '';
                      }).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}
        
        ${(state.ugcFeed || []).length === 0 ? `
          <div class="empty-feed">
            <div class="empty-icon">📷</div>
            <h3>${t("no_posts_yet") || "No posts yet"}</h3>
            <p>${t("be_first_to_share") || "Be the first to share something amazing!"}</p>
            <button class="secondary" onclick="window.__createUGCPost()">${t("create_post")}</button>
          </div>
        ` : ''}
        
        <!-- Load more button -->
        ${(state.ugcFeed || []).length > 0 ? `
          <div style="text-align:center; margin-top:24px">
            <button class="secondary" onclick="window.__loadMorePosts()">${t("load_more")}</button>
          </div>
        ` : ''}
      </div>
    </section>

    <style>
      .ugc-feed { padding: 20px; max-width: 600px; margin: 0 auto; }
      .feed-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
      .feed-header h2 { margin: 0; }
      .create-btn { display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; }
      .create-btn .icon { font-size: 16px; }
      
      .feed-filters { display: flex; gap: 8px; margin-bottom: 30px; overflow-x: auto; }
      .filter-btn { padding: 8px 16px; background: var(--bg-secondary); border: none; border-radius: 20px; cursor: pointer; white-space: nowrap; }
      .filter-btn.active { background: var(--primary); color: white; }
      
      .posts-container { display: flex; flex-direction: column; gap: 30px; }
      .post-card { background: var(--bg); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
      
      .post-header { display: flex; justify-content: space-between; align-items: center; padding: 16px; }
      .creator-info { display: flex; align-items: center; gap: 12px; cursor: pointer; }
      .creator-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
      .creator-name { display: block; margin: 0; }
      .post-time { font-size: 12px; color: var(--text-muted); }
      .post-menu { background: none; border: none; font-size: 20px; cursor: pointer; padding: 4px; }
      
      .post-media { position: relative; background: #f5f5f5; cursor: pointer; }
      .post-media img { width: 100%; max-height: 500px; object-fit: cover; }
      .play-button { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 48px; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
      
      .post-actions { display: flex; gap: 16px; padding: 16px; }
      .action-btn { display: flex; align-items: center; gap: 6px; background: none; border: none; cursor: pointer; }
      .action-btn.liked .icon { color: #ff3040; }
      .action-btn.saved .icon { color: #1da1f2; }
      .action-btn .count { font-size: 14px; color: var(--text-muted); }
      
      .post-content { padding: 0 16px 16px; }
      .post-caption { margin-bottom: 12px; line-height: 1.4; }
      
      .tagged-products { margin-top: 12px; }
      .tagged-products strong { display: block; margin-bottom: 8px; font-size: 14px; }
      .product-tags { display: flex; gap: 12px; overflow-x: auto; }
      .product-tag { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px; background: var(--bg-secondary); border-radius: 8px; text-decoration: none; min-width: 80px; }
      .product-thumb { width: 40px; height: 40px; border-radius: 6px; object-fit: cover; }
      .product-tag span { font-size: 12px; text-align: center; }
      .product-tag .price { font-weight: bold; color: var(--primary); }
      
      .empty-feed { text-align: center; padding: 60px 20px; }
      .empty-icon { font-size: 48px; margin-bottom: 16px; }
      .empty-feed h3 { margin: 0 0 8px 0; }
      .empty-feed p { color: var(--text-muted); margin-bottom: 20px; }
      
      @media (max-width: 720px) {
        .ugc-feed { padding: 16px; }
        .feed-header { flex-direction: column; gap: 12px; align-items: stretch; }
        .feed-filters { justify-content: center; }
      }
    </style>
  `);
}

// UGC Post Creation route
function createpost(ctx) {
  if (!state.user.authed) {
    ctx.navigate("#/auth");
    return;
  }

  ctx.el.innerHTML = h(`
    <section class="create-post">
      <div class="create-header">
        <button class="back-btn" onclick="history.back()">← ${t("back")}</button>
        <h2>${t("create_post")}</h2>
        <button class="publish-btn" onclick="window.__publishPost()" disabled>${t("publish")}</button>
      </div>

      <div class="create-content">
        <div class="media-upload">
          <div class="upload-area" onclick="window.__selectMedia()">
            <div class="upload-placeholder" id="uploadPlaceholder">
              <div class="upload-icon">📷</div>
              <h3>${t("add_photo_video")}</h3>
              <p>${t("drag_drop_or_click")}</p>
            </div>
            <img id="previewImage" class="preview-image hidden" alt="Preview">
          </div>
          <input type="file" id="mediaInput" accept="image/*,video/*" style="display: none;" onchange="window.__previewMedia(this)">
        </div>

        <div class="post-details">
          <div class="form-group">
            <label for="postCaption">${t("caption")}</label>
            <textarea id="postCaption" placeholder="${t("caption_placeholder")}" maxlength="2200" oninput="window.__updateCaptionCount(this)"></textarea>
            <div class="char-count">0/2200</div>
          </div>

          <div class="form-group">
            <label>${t("tag_products")}</label>
            <div class="product-search">
              <input type="text" id="productSearch" placeholder="${t("search_products_to_tag")}" oninput="window.__searchProductsToTag(this.value)">
              <div class="search-results" id="productSearchResults"></div>
            </div>
            <div class="tagged-products-list" id="taggedProductsList"></div>
          </div>

          <div class="form-group">
            <label>${t("privacy_settings")}</label>
            <div class="privacy-options">
              <label class="radio-option">
                <input type="radio" name="privacy" value="public" checked>
                <span class="radio-label">
                  <strong>🌍 ${t("public")}</strong>
                  <div class="radio-desc">${t("everyone_can_see")}</div>
                </span>
              </label>
              <label class="radio-option">
                <input type="radio" name="privacy" value="followers">
                <span class="radio-label">
                  <strong>👥 ${t("followers_only")}</strong>
                  <div class="radio-desc">${t("only_followers_see")}</div>
                </span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>${t("advanced_options")}</label>
            <div class="advanced-options">
              <label class="checkbox-option">
                <input type="checkbox" id="allowComments" checked>
                <span>${t("allow_comments")}</span>
              </label>
              <label class="checkbox-option">
                <input type="checkbox" id="allowSharing" checked>
                <span>${t("allow_sharing")}</span>
              </label>
              <label class="checkbox-option">
                <input type="checkbox" id="showLikeCount" checked>
                <span>${t("show_like_count")}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>

    <style>
      .create-post { padding: 20px; max-width: 600px; margin: 0 auto; }
      .create-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
      .create-header h2 { margin: 0; }
      .back-btn, .publish-btn { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; }
      .back-btn { background: var(--bg-secondary); }
      .publish-btn { background: var(--primary); color: white; }
      .publish-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      
      .create-content { display: flex; flex-direction: column; gap: 30px; }
      
      .media-upload { }
      .upload-area { position: relative; border: 2px dashed var(--border); border-radius: 12px; cursor: pointer; overflow: hidden; }
      .upload-placeholder { padding: 60px 20px; text-align: center; }
      .upload-icon { font-size: 48px; margin-bottom: 16px; }
      .upload-placeholder h3 { margin: 0 0 8px 0; }
      .upload-placeholder p { color: var(--text-muted); margin: 0; }
      .preview-image { width: 100%; max-height: 400px; object-fit: cover; }
      .preview-image.hidden { display: none; }
      
      .post-details { display: flex; flex-direction: column; gap: 24px; }
      .form-group label { display: block; margin-bottom: 8px; font-weight: 500; }
      .form-group textarea, .form-group input { width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 8px; }
      .form-group textarea { height: 120px; resize: vertical; }
      .char-count { text-align: right; font-size: 12px; color: var(--text-muted); margin-top: 4px; }
      
      .product-search { position: relative; }
      .search-results { position: absolute; top: 100%; left: 0; right: 0; background: var(--bg); border: 1px solid var(--border); border-top: none; border-radius: 0 0 8px 8px; max-height: 200px; overflow-y: auto; z-index: 10; }
      .search-result { padding: 12px; cursor: pointer; display: flex; align-items: center; gap: 12px; }
      .search-result:hover { background: var(--bg-secondary); }
      .search-result img { width: 40px; height: 40px; border-radius: 6px; object-fit: cover; }
      
      .tagged-products-list { display: flex; flex-wrap: gap; margin-top: 12px; }
      .tagged-product { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: var(--primary); color: white; border-radius: 20px; }
      .tagged-product button { background: none; border: none; color: white; cursor: pointer; font-weight: bold; }
      
      .privacy-options, .advanced-options { display: flex; flex-direction: column; gap: 12px; }
      .radio-option, .checkbox-option { display: flex; align-items: flex-start; gap: 12px; }
      .radio-label { flex: 1; }
      .radio-desc { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
      
      @media (max-width: 720px) {
        .create-post { padding: 16px; }
        .create-header { flex-wrap: wrap; gap: 12px; }
        .upload-placeholder { padding: 40px 20px; }
      }
    </style>
  `);
}

// UGC interaction functions
window.__viewCreatorProfile = (creatorId) => {
  navigate(`#/creator/${creatorId}`);
};

window.__viewPostDetail = (postId) => {
  const post = state.ugcFeed?.find(p => p.id === postId);
  if (!post) return;
  
  showSheet(h(`
    <div class="panel" style="max-width:500px; margin:0 auto">
      <div class="row between" style="margin-bottom:16px">
        <h3>${t("post_details")}</h3>
        <button onclick="window.__hideSheet()" style="background:none; border:none; font-size:24px; cursor:pointer">✕</button>
      </div>
      
      <div style="text-align:center; margin-bottom:16px">
        <img src="${post.image}" alt="${post.caption}" 
             style="width:100%; max-width:400px; border-radius:12px" />
      </div>
      
      <div class="row" style="gap:12px; margin-bottom:16px">
        <img src="${post.creatorAvatar}" alt="${post.creator}" 
             style="width:40px; height:40px; border-radius:50%" />
        <div style="flex:1">
          <strong>${post.creator}</strong>
          <p style="margin:8px 0">${post.caption}</p>
          <div style="font-size:12px; color:var(--muted)">${getTimeAgo(post.timestamp)}</div>
        </div>
      </div>
      
      ${post.taggedProducts?.length > 0 ? `
        <div style="margin-bottom:16px">
          <h4>${t("tagged_products")}</h4>
          <div class="grid" style="grid-template-columns:1fr 1fr; gap:12px; margin-top:8px">
            ${post.taggedProducts.map(pid => {
              const product = productById(pid);
              return product ? `
                <div class="panel" onclick="window.__hideSheet(); window.StoreZ.navigate('#/pdp/${product.id}')" 
                     style="padding:8px; cursor:pointer">
                  <img src="${uns(product.img, 200)}" alt="${getProductField(product, 'name')}" 
                       style="width:100%; aspect-ratio:1; border-radius:8px; object-fit:cover; margin-bottom:8px" />
                  <strong style="font-size:14px">${getProductField(product, 'name')}</strong>
                  <div style="color:var(--brand); font-weight:bold">${fmtSAR(product.price)}</div>
                </div>
              ` : '';
            }).join('')}
          </div>
        </div>
      ` : ''}
      
      <div class="row" style="gap:12px">
        <button class="secondary" onclick="window.__sharePost('${post.id}')" style="flex:1">
          📤 ${t("share")}
        </button>
        <button class="primary" onclick="window.__hideSheet(); window.__showComments('${post.id}')" style="flex:1">
          💬 ${t("comments")} (${post.comments})
        </button>
      </div>
    </div>
  `));
};

window.__showPostMenu = (postId) => {
  const post = state.ugcFeed?.find(p => p.id === postId);
  if (!post) return;
  
  const isOwnPost = post.creatorId === state.user.id;
  
  showSheet(h(`
    <div class="panel" style="max-width:400px; margin:0 auto">
      <h3 style="margin-bottom:16px">${t("post_options")}</h3>
      
      <div style="display:flex; flex-direction:column; gap:8px">
        ${isOwnPost ? `
          <button class="ghost" onclick="window.__editPost('${postId}')" style="justify-content:flex-start; padding:12px">
            ✏️ ${t("edit_post")}
          </button>
          <button class="ghost" onclick="window.__deletePost('${postId}')" style="justify-content:flex-start; padding:12px; color:var(--danger,#ff4444)">
            🗑️ ${t("delete_post")}
          </button>
        ` : `
          <button class="ghost" onclick="window.__reportPost('${postId}')" style="justify-content:flex-start; padding:12px">
            🚨 ${t("report_post")}
          </button>
          <button class="ghost" onclick="window.__followCreator('${post.creatorId}')" style="justify-content:flex-start; padding:12px">
            ➕ ${t("follow")} ${post.creator}
          </button>
        `}
        <button class="ghost" onclick="window.__sharePost('${postId}')" style="justify-content:flex-start; padding:12px">
          📤 ${t("share_post")}
        </button>
        <button class="ghost" onclick="window.__hideSheet()" style="justify-content:flex-start; padding:12px">
          ✕ ${t("cancel")}
        </button>
      </div>
    </div>
  `));
};

window.__toggleLike = (postId) => {
  const post = state.ugcFeed?.find(p => p.id === postId);
  if (!post) return;
  
  if (state.user.guest) {
    if (confirm(t("sign_up_to_like"))) {
      navigate("#/auth");
    }
    return;
  }
  
  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;
  
  // Update the UI
  const likeBtn = document.querySelector(`[onclick="window.__toggleLike('${postId}')"]`);
  if (likeBtn) {
    const icon = likeBtn.querySelector('span:first-child');
    const count = likeBtn.querySelector('span:last-child');
    if (icon) icon.textContent = post.liked ? '❤️' : '🤍';
    if (count) {
      count.textContent = post.likes;
      count.style.color = post.liked ? 'var(--danger,#ff4444)' : 'var(--text)';
    }
  }
  
  // Save updated state to localStorage
  actions.saveState();
};

window.__toggleSave = (postId) => {
  const post = state.ugcFeed?.find(p => p.id === postId);
  if (!post) return;
  
  if (state.user.guest) {
    if (confirm(t("sign_up_to_save"))) {
      navigate("#/auth");
    }
    return;
  }
  
  post.saved = !post.saved;
  
  // Update the UI
  const saveBtn = document.querySelector(`[onclick="window.__toggleSave('${postId}')"]`);
  if (saveBtn) {
    saveBtn.textContent = post.saved ? '🔖' : '📄';
  }
  
  actions.saveState();
  alert(post.saved ? t("post_saved") : t("post_unsaved"));
};

window.__sharePost = (postId) => {
  const post = state.ugcFeed?.find(p => p.id === postId);
  if (!post) return;
  
  const shareData = {
    title: `${post.creator} on StoreZ`,
    text: post.caption.substring(0, 100) + (post.caption.length > 100 ? '...' : ''),
    url: `${location.origin}${location.pathname}#/ugcfeed?post=${postId}`
  };
  
  if (navigator.share) {
    navigator.share(shareData);
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(shareData.url).then(() => {
      alert(t("link_copied"));
    });
  }
  
  post.shares = (post.shares || 0) + 1;
  actions.saveState();
};

window.__showComments = (postId) => {
  // Simulate comments for demo
  const comments = [
    { user: "@style_lover", text: "Love this! 😍", time: "2h" },
    { user: "@fashion_fan", text: "Where did you get this?", time: "1h" },
    { user: "@trend_setter", text: "Amazing style! 🔥", time: "45m" },
    { user: "@saudi_shopper", text: "يوصل السعودية؟", time: "30m" },
    { user: "@fitness_guru", text: "Great workout outfit!", time: "15m" }
  ];
  
  showSheet(h(`
    <div class="panel" style="max-width:500px; margin:0 auto">
      <div class="row between" style="margin-bottom:16px">
        <h3>${t("comments")}</h3>
        <button onclick="window.__hideSheet()" style="background:none; border:none; font-size:24px; cursor:pointer">✕</button>
      </div>
      
      <div style="max-height:300px; overflow-y:auto; margin-bottom:16px">
        ${comments.map(comment => `
          <div class="row" style="gap:12px; margin-bottom:12px">
            <div style="width:32px; height:32px; border-radius:50%; background:var(--brand); display:flex; align-items:center; justify-content:center; color:white; font-weight:bold; font-size:14px">
              ${comment.user[1].toUpperCase()}
            </div>
            <div style="flex:1">
              <div><strong>${comment.user}</strong> <span style="color:var(--muted); font-size:12px">${comment.time}</span></div>
              <div>${comment.text}</div>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="row" style="gap:8px">
        <input placeholder="${t("add_comment")}" style="flex:1" />
        <button class="primary">${t("post")}</button>
      </div>
    </div>
  `));
};

window.__createUGCPost = () => {
  navigate("#/createpost");
};

window.__loadMorePosts = () => {
  // Simulate loading more posts
  alert(t("no_more_posts"));
};

window.__editPost = (postId) => {
  window.__hideSheet();
  alert(t("edit_post_feature_coming_soon"));
};

window.__deletePost = (postId) => {
  if (confirm(t("confirm_delete_post"))) {
    const postIndex = state.ugcFeed?.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
      state.ugcFeed.splice(postIndex, 1);
      actions.saveState();
      window.__hideSheet();
      navigate("#/ugcfeed");
      alert(t("post_deleted"));
    }
  }
};

window.__reportPost = (postId) => {
  window.__hideSheet();
  
  const reasons = [
    t("inappropriate_content"),
    t("spam"), 
    t("harassment"),
    t("fake_products"),
    t("copyright_violation"),
    t("other")
  ];
  
  const reason = prompt(t("report_reason") + "\\n\\n" + reasons.map((r, i) => `${i+1}. ${r}`).join("\\n"));
  
  if (reason) {
    alert(t("report_submitted"));
  }
};

window.__followCreator = (creatorId) => {
  if (state.user.guest) {
    if (confirm(t("sign_up_to_follow"))) {
      navigate("#/auth");
    }
    return;
  }
  
  const creator = state.ugcCreators?.find(c => c.id === creatorId);
  if (!creator) return;
  
  if (!state.user.following) state.user.following = [];
  
  const isFollowing = state.user.following.includes(creatorId);
  
  if (isFollowing) {
    state.user.following = state.user.following.filter(id => id !== creatorId);
    creator.followers -= 1;
    alert(t("unfollowed") + " " + creator.name);
  } else {
    state.user.following.push(creatorId);
    creator.followers += 1;
    alert(t("following") + " " + creator.name);
  }
  
  actions.saveState();
};

// Time formatting helpers
function getTimeAgo(timestamp) {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return t("just_now");
  if (diffMins < 60) return `${diffMins}${t("m")}`;
  if (diffHours < 24) return `${diffHours}${t("h")}`;
  if (diffDays < 7) return `${diffDays}${t("d")}`;
  
  return getLang() === "ar" 
    ? past.toLocaleDateString("ar-SA")
    : past.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatNumber(num) {
  if (num >= 1000000) return (num/1000000).toFixed(1) + (getLang() === "ar" ? "م" : "M");
  if (num >= 1000) return (num/1000).toFixed(1) + (getLang() === "ar" ? "ك" : "K");
  return num.toString();
}

// Cleanup function for live shopping
window.__cleanupLive = () => {
  if (window.__liveUpdateInterval) {
    clearInterval(window.__liveUpdateInterval);
    window.__liveUpdateInterval = null;
  }
};

// Performance & Accessibility Helper Functions
window.__exportAnalytics = () => {
  const report = window.__performanceMonitor?.getReport() || {};
  const analyticsData = state.analytics || { metrics: [], errors: [] };
  
  const exportData = {
    timestamp: new Date().toISOString(),
    performanceReport: report,
    analytics: analyticsData,
    userAgent: navigator.userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    connection: navigator.connection ? {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt
    } : null
  };
  
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `storez-analytics-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  window.__announceToScreenReader?.(t("analytics_exported"));
  alert(t("analytics_exported"));
};

window.__clearAnalytics = () => {
  if (!confirm(t("confirm_clear_analytics"))) return;
  
  if (state.analytics) {
    state.analytics.metrics = [];
    state.analytics.errors = [];
    saveState();
  }
  
  // Reset performance monitor metrics
  if (window.__performanceMonitor) {
    window.__performanceMonitor.metrics = {
      pageLoads: 0,
      interactions: 0,
      errors: 0,
      loadTimes: [],
      lcp: 0,
      fid: 0,
      cls: 0
    };
  }
  
  navigate('#/analytics');
  window.__announceToScreenReader?.(t("analytics_cleared"));
  alert(t("analytics_cleared"));
};

window.__runA11yAudit = () => {
  const auditResults = [];
  
  // Check for missing alt text on images
  const images = document.querySelectorAll('img');
  let missingAlt = 0;
  images.forEach(img => {
    if (!img.alt && !img.hasAttribute('aria-hidden')) {
      missingAlt++;
    }
  });
  if (missingAlt > 0) {
    auditResults.push(`${missingAlt} images missing alt text`);
  }
  
  // Check for buttons without accessible names
  const buttons = document.querySelectorAll('button');
  let unnamedButtons = 0;
  buttons.forEach(btn => {
    if (!btn.textContent.trim() && !btn.getAttribute('aria-label') && !btn.getAttribute('aria-labelledby')) {
      unnamedButtons++;
    }
  });
  if (unnamedButtons > 0) {
    auditResults.push(`${unnamedButtons} buttons without accessible names`);
  }
  
  // Check for proper heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let headingIssues = 0;
  let lastLevel = 0;
  headings.forEach(h => {
    const level = parseInt(h.tagName[1]);
    if (level > lastLevel + 1) {
      headingIssues++;
    }
    lastLevel = level;
  });
  if (headingIssues > 0) {
    auditResults.push(`${headingIssues} heading hierarchy issues`);
  }
  
  // Check for form labels
  const inputs = document.querySelectorAll('input, textarea, select');
  let unlabeledInputs = 0;
  inputs.forEach(input => {
    if (input.type !== 'hidden' && !input.labels?.length && !input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
      unlabeledInputs++;
    }
  });
  if (unlabeledInputs > 0) {
    auditResults.push(`${unlabeledInputs} form controls missing labels`);
  }
  
  const resultMessage = auditResults.length > 0 
    ? `${t("accessibility_issues_found")}:\n${auditResults.join('\n')}`
    : t("no_accessibility_issues");
  
  window.__announceToScreenReader?.(auditResults.length > 0 ? t("accessibility_issues_found") : t("no_accessibility_issues"));
  alert(resultMessage);
  
  // Track audit results
  window.__performanceMonitor?.trackMetric('a11y_audit', auditResults.length, { 
    issues: auditResults.join(';') 
  });
};

window.__toggleHighContrast = () => {
  const html = document.documentElement;
  const isHighContrast = html.classList.contains('high-contrast');
  
  if (isHighContrast) {
    html.classList.remove('high-contrast');
    window.__announceToScreenReader?.(t("high_contrast_disabled"));
  } else {
    html.classList.add('high-contrast');
    window.__announceToScreenReader?.(t("high_contrast_enabled"));
  }
  
  // Store preference
  state.user.preferences = state.user.preferences || {};
  state.user.preferences.highContrast = !isHighContrast;
  saveState();
  
  window.__performanceMonitor?.trackMetric('accessibility_toggle', 1, { 
    feature: 'high_contrast',
    enabled: !isHighContrast 
  });
};

// Enhanced interaction tracking
const originalAddEventListener = Element.prototype.addEventListener;
Element.prototype.addEventListener = function(type, listener, options) {
  if (['click', 'touch', 'keydown'].includes(type)) {
    const trackingListener = (e) => {
      // Track user interaction
      window.__performanceMonitor?.trackInteraction(type, this.tagName, {
        id: this.id,
        className: this.className,
        text: this.textContent?.substring(0, 50)
      });
      
      if (typeof listener === 'function') {
        return listener.call(this, e);
      }
    };
    
    return originalAddEventListener.call(this, type, trackingListener, options);
  }
  
  return originalAddEventListener.call(this, type, listener, options);
};

// Accessibility enhancements for existing functions
const originalNavigate = typeof navigate !== 'undefined' ? navigate : () => {};
if (typeof window !== 'undefined') {
  window.navigate = function(hash, save = true) {
    const result = originalNavigate(hash, save);
    
    // Announce route change to screen readers
    const routeName = hash.replace('#/', '').split('/')[0] || 'home';
    window.__accessibilityManager?.announceRouteChange(t(`nav_${routeName}`) || routeName);
    
    // Track navigation
    window.__performanceMonitor?.trackMetric('navigation', 1, { route: routeName });
    
    return result;
  };
}

// UGC Creation & Management Functions
window.__createUGCPost = () => {
  if (!state.user.authed) {
    navigate("#/auth");
    return;
  }
  navigate("#/createpost");
};

window.__selectMedia = () => {
  document.getElementById('mediaInput')?.click();
};

window.__previewMedia = (input) => {
  const file = input.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const placeholder = document.getElementById('uploadPlaceholder');
    const preview = document.getElementById('previewImage');
    
    if (placeholder && preview) {
      placeholder.style.display = 'none';
      preview.src = e.target.result;
      preview.classList.remove('hidden');
      
      // Enable publish button
      const publishBtn = document.querySelector('.publish-btn');
      if (publishBtn) {
        publishBtn.disabled = false;
      }
    }
  };
  reader.readAsDataURL(file);
};

window.__updateCaptionCount = (textarea) => {
  const count = textarea.value.length;
  const counter = document.querySelector('.char-count');
  if (counter) {
    counter.textContent = `${count}/2200`;
    counter.style.color = count > 2000 ? 'var(--danger, #ff4444)' : 'var(--text-muted)';
  }
};

window.__searchProductsToTag = (query) => {
  const resultsContainer = document.getElementById('productSearchResults');
  if (!resultsContainer) return;
  
  if (!query.trim()) {
    resultsContainer.innerHTML = '';
    return;
  }
  
  const matchingProducts = state.products.filter(product => 
    getProductField(product, 'name').toLowerCase().includes(query.toLowerCase()) ||
    getProductField(product, 'brand').toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);
  
  resultsContainer.innerHTML = matchingProducts.map(product => `
    <div class="search-result" onclick="window.__tagProduct('${product.id}')">
      <img src="${product.image}" alt="${getProductField(product, 'name')}">
      <div>
        <strong>${getProductField(product, 'name')}</strong>
        <div style="font-size: 12px; color: var(--text-muted);">${getProductField(product, 'brand')} • ${fmtSAR(product.price)}</div>
      </div>
    </div>
  `).join('');
};

window.__tagProduct = (productId) => {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;
  
  // Get current tagged products
  const taggedList = document.getElementById('taggedProductsList');
  const searchResults = document.getElementById('productSearchResults');
  const searchInput = document.getElementById('productSearch');
  
  if (!taggedList) return;
  
  // Check if already tagged
  const existing = Array.from(taggedList.children).find(el => el.dataset.productId === productId);
  if (existing) return;
  
  // Add to tagged products list
  const tagElement = document.createElement('div');
  tagElement.className = 'tagged-product';
  tagElement.dataset.productId = productId;
  tagElement.innerHTML = `
    <span>${getProductField(product, 'name')}</span>
    <button onclick="window.__untagProduct('${productId}')">×</button>
  `;
  
  taggedList.appendChild(tagElement);
  
  // Clear search
  if (searchInput) searchInput.value = '';
  if (searchResults) searchResults.innerHTML = '';
};

window.__untagProduct = (productId) => {
  const taggedList = document.getElementById('taggedProductsList');
  if (!taggedList) return;
  
  const tagElement = taggedList.querySelector(`[data-product-id="${productId}"]`);
  if (tagElement) {
    tagElement.remove();
  }
};

window.__publishPost = () => {
  const caption = document.getElementById('postCaption')?.value || '';
  const privacy = document.querySelector('input[name="privacy"]:checked')?.value || 'public';
  const allowComments = document.getElementById('allowComments')?.checked;
  const allowSharing = document.getElementById('allowSharing')?.checked;
  const showLikeCount = document.getElementById('showLikeCount')?.checked;
  const previewImage = document.getElementById('previewImage');
  
  if (!previewImage || previewImage.classList.contains('hidden')) {
    alert(t("please_select_media"));
    return;
  }
  
  // Get tagged products
  const taggedProducts = Array.from(document.querySelectorAll('#taggedProductsList .tagged-product'))
    .map(el => el.dataset.productId);
  
  // Create new post
  const newPost = {
    id: `ugc${Date.now()}`,
    creator: state.user.name,
    creatorId: state.user.id,
    creatorAvatar: state.user.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b9e3?auto=format&fit=crop&w=150&q=70',
    image: previewImage.src,
    caption: caption,
    timestamp: Date.now(),
    likes: 0,
    comments: 0,
    shares: 0,
    liked: false,
    saved: false,
    privacy: privacy,
    taggedProducts: taggedProducts,
    settings: {
      allowComments,
      allowSharing,
      showLikeCount
    }
  };
  
  // Initialize UGC feed if it doesn't exist
  if (!state.ugcFeed) {
    state.ugcFeed = [];
  }
  
  // Add post to feed
  state.ugcFeed.unshift(newPost);
  
  // Initialize user posts if they don't exist
  if (!state.user.posts) {
    state.user.posts = [];
  }
  state.user.posts.unshift(newPost);
  
  saveState();
  
  // Show success and navigate to feed
  alert(t("post_published"));
  navigate("#/ugcfeed");
};

window.__viewPost = (postId) => {
  const post = state.ugcFeed?.find(p => p.id === postId);
  if (!post) return;
  
  showSheet(`
    <div class="post-detail">
      <div class="post-header">
        <div class="creator-info">
          <img src="${post.creatorAvatar}" alt="${post.creator}" class="creator-avatar">
          <div>
            <strong>${post.creator}</strong>
            <div class="post-time">${formatTimeAgo(post.timestamp)}</div>
          </div>
        </div>
        <button onclick="window.__hideSheet()" class="close-btn">×</button>
      </div>
      
      <div class="post-image">
        <img src="${post.image}" alt="${post.caption}">
      </div>
      
      <div class="post-actions">
        <button class="action-btn ${post.liked ? 'liked' : ''}" onclick="window.__toggleLike('${post.id}'); window.__viewPost('${post.id}')">
          <span class="icon">${post.liked ? '❤️' : '🤍'}</span>
          <span class="count">${post.likes}</span>
        </button>
        <button class="action-btn" onclick="window.__showComments('${post.id}')">
          <span class="icon">💬</span>
          <span class="count">${post.comments}</span>
        </button>
        <button class="action-btn" onclick="window.__sharePost('${post.id}')">
          <span class="icon">📤</span>
        </button>
        <button class="action-btn ${post.saved ? 'saved' : ''}" onclick="window.__toggleSave('${post.id}'); window.__viewPost('${post.id}')">
          <span class="icon">${post.saved ? '🔖' : '📄'}</span>
        </button>
      </div>
      
      <div class="post-content">
        <div class="post-caption">
          <strong>${post.creator}</strong> ${post.caption}
        </div>
        
        ${post.taggedProducts && post.taggedProducts.length > 0 ? `
          <div class="tagged-products">
            <strong>${t("tagged_products")}:</strong>
            <div class="product-list">
              ${post.taggedProducts.map(productId => {
                const product = state.products.find(p => p.id === productId);
                return product ? `
                  <div class="product-item" onclick="window.__hideSheet(); navigate('#/pdp/${productId}')">
                    <img src="${product.image}" alt="${getProductField(product, 'name')}">
                    <div>
                      <strong>${getProductField(product, 'name')}</strong>
                      <div class="price">${fmtSAR(product.price)}</div>
                    </div>
                  </div>
                ` : '';
              }).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
    
    <style>
      .post-detail { max-width: 500px; }
      .post-header { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid var(--border); }
      .creator-info { display: flex; align-items: center; gap: 12px; }
      .creator-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
      .close-btn { background: none; border: none; font-size: 24px; cursor: pointer; }
      .post-image img { width: 100%; max-height: 70vh; object-fit: cover; }
      .post-actions { display: flex; gap: 16px; padding: 16px; border-bottom: 1px solid var(--border); }
      .action-btn { display: flex; align-items: center; gap: 6px; background: none; border: none; cursor: pointer; }
      .action-btn.liked .icon { color: #ff3040; }
      .action-btn.saved .icon { color: #1da1f2; }
      .post-content { padding: 16px; }
      .post-caption { margin-bottom: 16px; line-height: 1.4; }
      .tagged-products strong { display: block; margin-bottom: 12px; }
      .product-list { display: flex; flex-direction: column; gap: 12px; }
      .product-item { display: flex; gap: 12px; padding: 12px; background: var(--bg-secondary); border-radius: 8px; cursor: pointer; }
      .product-item img { width: 50px; height: 50px; border-radius: 6px; object-fit: cover; }
      .product-item strong { display: block; margin-bottom: 4px; }
      .price { color: var(--primary); font-weight: bold; }
    </style>
  `);
};

window.__toggleLike = (postId) => {
  const post = state.ugcFeed?.find(p => p.id === postId);
  if (!post) return;
  
  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;
  
  saveState();
  
  // Update UI if currently viewing feed
  if (location.hash.includes('#/ugcfeed')) {
    navigate('#/ugcfeed' + (location.hash.includes('?') ? '?' + location.hash.split('?')[1] : ''));
  }
};

window.__toggleSave = (postId) => {
  const post = state.ugcFeed?.find(p => p.id === postId);
  if (!post) return;
  
  post.saved = !post.saved;
  
  // Update user's saved posts
  if (!state.user.saved) state.user.saved = [];
  
  if (post.saved) {
    if (!state.user.saved.includes(postId)) {
      state.user.saved.push(postId);
    }
  } else {
    const index = state.user.saved.indexOf(postId);
    if (index > -1) {
      state.user.saved.splice(index, 1);
    }
  }
  
  saveState();
  
  // Update UI if currently viewing feed
  if (location.hash.includes('#/ugcfeed')) {
    navigate('#/ugcfeed' + (location.hash.includes('?') ? '?' + location.hash.split('?')[1] : ''));
  }
};

window.__sharePost = (postId) => {
  const post = state.ugcFeed?.find(p => p.id === postId);
  if (!post) return;
  
  if (navigator.share) {
    navigator.share({
      title: `${post.creator}'s post`,
      text: post.caption,
      url: `${window.location.origin}${window.location.pathname}#/ugcfeed`
    }).catch(console.error);
  } else {
    const url = `${window.location.origin}${window.location.pathname}#/ugcfeed`;
    navigator.clipboard?.writeText(url);
    alert(t("link_copied"));
  }
  
  post.shares = (post.shares || 0) + 1;
  saveState();
};

window.__showComments = (postId) => {
  alert(t("comments_feature_coming_soon"));
};

window.__showPostMenu = (postId) => {
  const post = state.ugcFeed?.find(p => p.id === postId);
  if (!post) return;
  
  const isOwnPost = post.creatorId === state.user.id;
  
  showSheet(`
    <div style="padding: 20px;">
      <h3>${t("post_options")}</h3>
      <div style="margin: 20px 0;">
        ${isOwnPost ? `
          <button class="ghost" onclick="window.__editPost('${postId}')" style="width: 100%; margin-bottom: 8px; text-align: left;">
            ✏️ ${t("edit_post")}
          </button>
          <button class="ghost" onclick="window.__deletePost('${postId}')" style="width: 100%; margin-bottom: 8px; text-align: left;">
            🗑️ ${t("delete_post")}
          </button>
        ` : `
          <button class="ghost" onclick="window.__reportPost('${postId}')" style="width: 100%; margin-bottom: 8px; text-align: left;">
            🚨 ${t("report_post")}
          </button>
          <button class="ghost" onclick="window.__hidePost('${postId}')" style="width: 100%; margin-bottom: 8px; text-align: left;">
            👁️ ${t("hide_post")}
          </button>
        `}
        <button class="ghost" onclick="window.__copyPostLink('${postId}')" style="width: 100%; text-align: left;">
          🔗 ${t("copy_link")}
        </button>
      </div>
      <button class="secondary" onclick="window.__hideSheet()" style="width: 100%;">${t("cancel")}</button>
    </div>
  `);
};

window.__deletePost = (postId) => {
  if (!confirm(t("confirm_delete_post"))) return;
  
  // Remove from UGC feed
  const feedIndex = state.ugcFeed?.findIndex(p => p.id === postId);
  if (feedIndex >= 0) {
    state.ugcFeed.splice(feedIndex, 1);
  }
  
  // Remove from user's posts
  const userIndex = state.user.posts?.findIndex(p => p.id === postId);
  if (userIndex >= 0) {
    state.user.posts.splice(userIndex, 1);
  }
  
  saveState();
  window.__hideSheet();
  
  // Refresh current view
  if (location.hash.includes('#/ugcfeed')) {
    navigate('#/ugcfeed');
  }
  
  alert(t("post_deleted"));
};

window.__reportPost = (postId) => {
  const reason = prompt(t("report_reason_prompt"));
  if (!reason) return;
  
  window.__hideSheet();
  alert(t("post_reported"));
};

window.__hidePost = (postId) => {
  // For demo purposes, just hide from user's view
  const post = state.ugcFeed?.find(p => p.id === postId);
  if (post) {
    post.hidden = true;
    saveState();
  }
  
  window.__hideSheet();
  
  // Refresh feed
  if (location.hash.includes('#/ugcfeed')) {
    navigate('#/ugcfeed');
  }
  
  alert(t("post_hidden"));
};

window.__copyPostLink = (postId) => {
  const url = `${window.location.origin}${window.location.pathname}#/ugcfeed`;
  navigator.clipboard?.writeText(url);
  window.__hideSheet();
  alert(t("link_copied"));
};

// Messaging system functions
window.__startSupportChat = () => {
  // Check if support conversation already exists
  const existingSupport = state.messages.find(m => m.with.toLowerCase().includes('support'));
  
  if (existingSupport) {
    navigate(`#/chat/${existingSupport.id}`);
    return;
  }
  
  // Create new support conversation
  const supportConversation = {
    id: `m${Date.now()}`,
    with: 'Support Team',
    creatorId: null,
    unread: 0,
    thread: [
      {
        from: 'system',
        text: t("support_welcome_message"),
        ts: Date.now()
      }
    ]
  };
  
  state.messages.push(supportConversation);
  saveState();
  navigate(`#/chat/${supportConversation.id}`);
};

window.__browseCreators = () => {
  navigate('#/discover?filter=creators');
};

window.__showMessageSettings = () => {
  showSheet(`
    <div style="padding:20px;">
      <h2>${t("message_settings")}</h2>
      <div style="margin:20px 0;">
        <label style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
          <input type="checkbox" id="notifMessages" ${state.user.preferences?.messages !== false ? 'checked' : ''}>
          ${t("message_notifications")}
        </label>
        
        <label style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
          <input type="checkbox" id="notifCreators" ${state.user.preferences?.creatorMessages !== false ? 'checked' : ''}>
          ${t("creator_message_notifications")}
        </label>
        
        <label style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
          <input type="checkbox" id="readReceipts" ${state.user.preferences?.readReceipts !== false ? 'checked' : ''}>
          ${t("read_receipts")}
        </label>
      </div>
      
      <div class="row" style="gap:12px; margin-top:20px;">
        <button class="ghost" onclick="window.__hideSheet()" style="flex:1;">${t("cancel")}</button>
        <button class="secondary" onclick="window.__saveMessageSettings()" style="flex:1;">${t("save")}</button>
      </div>
    </div>
  `);
};

window.__saveMessageSettings = () => {
  const messageNotifs = document.getElementById('notifMessages')?.checked;
  const creatorNotifs = document.getElementById('notifCreators')?.checked;
  const readReceipts = document.getElementById('readReceipts')?.checked;
  
  state.user.preferences = state.user.preferences || {};
  state.user.preferences.messages = messageNotifs;
  state.user.preferences.creatorMessages = creatorNotifs;
  state.user.preferences.readReceipts = readReceipts;
  
  saveState();
  window.__hideSheet();
  alert(t("settings_saved"));
};

window.__handleMessageInput = (event, conversationId) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    window.__sendMessage(conversationId);
  }
};

window.__sendMessage = (conversationId) => {
  const textarea = document.getElementById('messageText');
  const message = textarea?.value.trim();
  
  if (!message) return;
  
  const conversation = state.messages.find(m => m.id === conversationId);
  if (!conversation) return;
  
  // Add user message
  const userMessage = {
    from: 'user',
    text: message,
    ts: Date.now()
  };
  
  conversation.thread.push(userMessage);
  textarea.value = '';
  
  // Update send button state
  const sendButton = document.querySelector('.send-button');
  if (sendButton) {
    sendButton.disabled = true;
    sendButton.style.opacity = '0.5';
  }
  
  // Save state and refresh view
  saveState();
  navigate(`#/chat/${conversationId}`);
  
  // Simulate response after a delay
  setTimeout(() => {
    window.__simulateResponse(conversationId, message);
  }, 1000 + Math.random() * 2000);
};

window.__sendQuickMessage = (conversationId, message) => {
  const textarea = document.getElementById('messageText');
  if (textarea) {
    textarea.value = message;
    textarea.focus();
    
    // Enable send button
    const sendButton = document.querySelector('.send-button');
    if (sendButton) {
      sendButton.disabled = false;
      sendButton.style.opacity = '1';
    }
  }
};

window.__simulateResponse = (conversationId, userMessage) => {
  const conversation = state.messages.find(m => m.id === conversationId);
  if (!conversation) return;
  
  const isSupport = conversation.with.toLowerCase().includes('support');
  const isCreator = conversation.with.startsWith('@');
  
  let response = '';
  
  if (isSupport) {
    // Support bot responses
    if (userMessage.toLowerCase().includes('order') || userMessage.toLowerCase().includes('طلب')) {
      response = t("support_order_response");
    } else if (userMessage.toLowerCase().includes('return') || userMessage.toLowerCase().includes('إرجاع')) {
      response = t("support_return_response");
    } else if (userMessage.toLowerCase().includes('product') || userMessage.toLowerCase().includes('منتج')) {
      response = t("support_product_response");
    } else {
      response = t("support_general_response");
    }
  } else if (isCreator) {
    // Creator responses
    const responses = [
      t("creator_response_1"),
      t("creator_response_2"),
      t("creator_response_3"),
      t("creator_response_4")
    ];
    response = responses[Math.floor(Math.random() * responses.length)];
  } else {
    response = t("generic_response");
  }
  
  const botMessage = {
    from: isSupport ? 'support' : conversation.with,
    text: response,
    ts: Date.now()
  };
  
  conversation.thread.push(botMessage);
  conversation.unread = (conversation.unread || 0) + 1;
  
  saveState();
  
  // If user is still on the chat page, refresh
  if (location.hash.includes(`#/chat/${conversationId}`)) {
    navigate(`#/chat/${conversationId}`);
  }
};

window.__viewCreatorProducts = (creatorId) => {
  navigate(`#/creator/${creatorId}`);
};

window.__showChatOptions = (conversationId) => {
  const conversation = state.messages.find(m => m.id === conversationId);
  if (!conversation) return;
  
  showSheet(`
    <div style="padding:20px;">
      <h2>${t("chat_options")}</h2>
      <div style="margin:20px 0;">
        <button class="ghost" onclick="window.__muteConversation('${conversationId}')" style="width:100%; margin-bottom:8px; text-align:left;">
          🔇 ${t("mute_conversation")}
        </button>
        
        <button class="ghost" onclick="window.__blockUser('${conversationId}')" style="width:100%; margin-bottom:8px; text-align:left;">
          🚫 ${t("block_user")}
        </button>
        
        <button class="ghost" onclick="window.__reportConversation('${conversationId}')" style="width:100%; margin-bottom:8px; text-align:left;">
          🚨 ${t("report_conversation")}
        </button>
        
        <button class="ghost danger" onclick="window.__deleteConversation('${conversationId}')" style="width:100%; text-align:left;">
          🗑️ ${t("delete_conversation")}
        </button>
      </div>
      
      <button class="secondary" onclick="window.__hideSheet()" style="width:100%;">${t("close")}</button>
    </div>
  `);
};

window.__muteConversation = (conversationId) => {
  const conversation = state.messages.find(m => m.id === conversationId);
  if (conversation) {
    conversation.muted = true;
    saveState();
    window.__hideSheet();
    alert(t("conversation_muted"));
  }
};

window.__blockUser = (conversationId) => {
  if (!confirm(t("confirm_block_user"))) return;
  
  const conversation = state.messages.find(m => m.id === conversationId);
  if (conversation) {
    conversation.blocked = true;
    saveState();
    window.__hideSheet();
    navigate('#/messages');
    alert(t("user_blocked"));
  }
};

window.__reportConversation = (conversationId) => {
  const reason = prompt(t("report_reason_prompt"));
  if (!reason) return;
  
  // For demo purposes, just show success
  window.__hideSheet();
  alert(t("report_submitted"));
};

window.__deleteConversation = (conversationId) => {
  if (!confirm(t("confirm_delete_conversation"))) return;
  
  const index = state.messages.findIndex(m => m.id === conversationId);
  if (index >= 0) {
    state.messages.splice(index, 1);
    saveState();
    window.__hideSheet();
    navigate('#/messages');
    alert(t("conversation_deleted"));
  }
};

function orderConfirmation(ctx, orderId) {
  const order = state.orders.find(o => o.id === orderId);
  
  if (!order) {
    ctx.el.innerHTML = h(`
      <section class="panel center">
        <h2>${t("order_not_found")}</h2>
        <p class="muted">${t("order_not_found_desc")}</p>
        <button class="secondary" onclick="window.StoreZ.navigate('#/orders')">${t("view_orders")}</button>
      </section>
    `);
    return;
  }

  const estimatedDelivery = new Date(order.date);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);
  
  const orderItems = order.items.map(item => {
    const product = productById(item.id);
    const productName = getProductField(product, 'name');
    return `
      <div class="row between" style="padding:8px 0;">
        <div class="row" style="gap:12px;">
          <img src="https://images.unsplash.com/photo-${product.unsplash}?auto=format&fit=crop&w=64&q=70" 
               alt="${productName}" style="width:32px; height:32px; object-fit:cover; border-radius:4px;">
          <div>
            <div style="font-weight:500;">${productName}</div>
            <div class="muted small">${t("quantity")}: ${item.qty}</div>
          </div>
        </div>
        <div style="text-align:right;">
          <div>${fmt(item.qty * item.price)}</div>
        </div>
      </div>
    `;
  }).join('');

  ctx.el.innerHTML = h(`
    <section class="panel center">
      <!-- Success animation -->
      <div style="width:80px; height:80px; margin:0 auto 20px; background:var(--success); border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:32px;">
        ✓
      </div>
      
      <h2 style="color:var(--success); margin-bottom:8px;">${t("order_confirmed")}</h2>
      <p class="muted" style="margin-bottom:24px;">${t("order_confirmation_desc")}</p>
      
      <!-- Order details -->
      <div style="background:var(--bg-2); border-radius:12px; padding:20px; margin-bottom:20px; text-align:left;">
        <div class="row between" style="margin-bottom:16px;">
          <strong>${t("order")} #${order.id}</strong>
          <span class="chip success">${t("confirmed")}</span>
        </div>
        
        <div style="border-bottom:1px solid var(--border); margin-bottom:12px; padding-bottom:12px;">
          ${orderItems}
        </div>
        
        <div class="row between" style="margin-bottom:8px;">
          <span>${t("subtotal")}</span>
          <span>${fmt(order.total - 15 - Math.round(order.total * 0.05))}</span>
        </div>
        <div class="row between" style="margin-bottom:8px;">
          <span>${t("shipping")}</span>
          <span>${fmt(15)}</span>
        </div>
        <div class="row between" style="margin-bottom:12px;">
          <span>${t("tax")}</span>
          <span>${fmt(Math.round(order.total * 0.05))}</span>
        </div>
        <div class="row between" style="border-top:1px solid var(--border); padding-top:12px;">
          <strong>${t("total")}</strong>
          <strong>${fmt(order.total)}</strong>
        </div>
      </div>
      
      <!-- Delivery info -->
      <div style="background:var(--brand-bg); border-radius:8px; padding:16px; margin-bottom:20px; text-align:left;">
        <div class="row" style="gap:12px; align-items:center; margin-bottom:8px;">
          <span style="font-size:20px;">🚚</span>
          <div>
            <strong>${t("estimated_delivery")}</strong>
            <div class="muted small">${estimatedDelivery.toLocaleDateString(getLang() === 'ar' ? 'ar-SA' : 'en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</div>
          </div>
        </div>
        <div class="muted small">${t("delivery_updates_desc")}</div>
      </div>
      
      <!-- Action buttons -->
      <div class="row" style="gap:12px; width:100%;">
        <button class="secondary" style="flex:1;" onclick="window.StoreZ.navigate('#/order/${order.id}')">
          ${t("track_order")}
        </button>
        <button class="ghost" style="flex:1;" onclick="window.StoreZ.navigate('#/discover')">
          ${t("continue_shopping")}
        </button>
      </div>
      
      <!-- Additional actions -->
      <div style="margin-top:20px; padding-top:20px; border-top:1px solid var(--border); width:100%;">
        <p class="muted small" style="margin-bottom:12px;">${t("order_help_text")}</p>
        <div class="row" style="gap:8px; justify-content:center;">
          <button class="ghost small" onclick="window.StoreZ.navigate('#/messages')">
            ${t("contact_support")}
          </button>
          <button class="ghost small" onclick="window.__shareOrder('${order.id}')">
            ${t("share_order")}
          </button>
        </div>
      </div>
    </section>
  `);
}

// Individual live stream viewer
function liveStream(ctx, streamId) {
  const stream = state.live?.activeStreams?.find(s => s.id === streamId) || 
                 state.live?.activeStreams?.[0] ||
                 { id: streamId, title: "Live Stream", creator: "@creator", viewers: 1247 };
                 
  const creator = creatorById(stream.creatorId) || state.creators[0];
  const streamProducts = (stream.products || []).map(pid => productById(pid)).filter(Boolean);
  const currentProduct = streamProducts[0] || state.products[0];
  const duration = stream.startTime ? Math.floor((Date.now() - stream.startTime) / 60000) : 45;
  
  ctx.el.innerHTML = h(`
    <section class="panel" style="max-width:100%; padding:0">
      <!-- Live video area -->
      <div style="position:relative; background:linear-gradient(135deg, #2a2655, #0e3d57); aspect-ratio:16/9; display:flex; align-items:center; justify-content:center; color:white">
        <!-- Simulated video background -->
        <img src="${stream.thumbnail || uns(currentProduct.img, 1200)}" alt="Live stream" 
             style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; opacity:0.4" />
        
        <!-- Live status and controls -->
        <div style="position:absolute; top:16px; left:16px; right:16px; display:flex; justify-content:space-between; align-items:flex-start">
          <div class="row" style="gap:8px">
            <span class="chip pulse" style="background:var(--danger,#ff4444); color:white">
              ● LIVE
            </span>
            <span class="chip" style="background:rgba(0,0,0,0.6); color:white">
              👁 ${stream.viewers?.toLocaleString() || '1,247'} ${t("viewers")}
            </span>
            <span class="chip" style="background:rgba(0,0,0,0.6); color:white; font-size:12px">
              ${duration}m
            </span>
          </div>
          
          <div class="row" style="gap:8px">
            <button class="icon-btn" onclick="window.__toggleMute && window.__toggleMute()" 
                    style="background:rgba(0,0,0,0.6); color:white" title="${t("mute")}">
              🔊
            </button>
            <button class="icon-btn" onclick="window.__toggleFullscreen && window.__toggleFullscreen()" 
                    style="background:rgba(0,0,0,0.6); color:white" title="${t("fullscreen")}">
              ⛶
            </button>
            <button class="icon-btn" onclick="window.StoreZ.navigate('#/live')" 
                    style="background:rgba(0,0,0,0.6); color:white" title="${t("close")}">
              ✕
            </button>
          </div>
        </div>
        
        <!-- Creator info overlay -->
        <div style="position:absolute; bottom:16px; left:16px">
          <div class="row" style="gap:8px; color:white">
            <div style="width:48px;height:48px;border-radius:50%;background:var(--brand);display:flex;align-items:center;justify-content:center;font-weight:bold">
              ${creator.name[0]}
            </div>
            <div>
              <strong style="font-size:16px">${creator.name}</strong>
              <div style="opacity:0.9">${stream.creator}</div>
              <div style="font-size:12px; opacity:0.8">${stream.title}</div>
            </div>
          </div>
        </div>
        
        <!-- Flash deal alert -->
        ${stream.flashDeals?.length > 0 ? `
          <div style="position:absolute; top:50%; right:16px; transform:translateY(-50%)">
            <div class="panel" style="background:var(--danger,#ff4444); color:white; padding:8px; border-radius:8px; animation:pulse 2s infinite">
              <div style="font-size:12px; font-weight:bold">🔥 FLASH DEAL</div>
              <div style="font-size:11px">${Math.floor((stream.flashDeals[0].endTime - Date.now()) / 60000)}m left</div>
            </div>
          </div>
        ` : ''}
        
        <!-- Large play button simulation -->
        <div id="playButton" style="width:80px; height:80px; border-radius:50%; background:rgba(255,255,255,0.9); display:flex; align-items:center; justify-content:center; font-size:32px; cursor:pointer" 
             onclick="window.__togglePlayback && window.__togglePlayback()">
          ▶️
        </div>
      </div>
      
      <!-- Live shopping interface -->
      <div style="padding:16px">
        <!-- Flash deals notification -->
        ${stream.flashDeals?.length > 0 ? `
          <div class="panel" style="background:linear-gradient(135deg, var(--danger,#ff4444), #ff6b6b); color:white; margin-bottom:16px; position:relative">
            <div style="position:absolute; top:8px; right:8px">
              <span class="chip" style="background:rgba(255,255,255,0.2); color:white; font-size:11px">
                🔥 ${stream.flashDeals.length} ${t("deals")}
              </span>
            </div>
            
            <h4 style="margin-bottom:8px">${t("flash_deals_active")}!</h4>
            <div style="font-size:14px; opacity:0.9; margin-bottom:12px">${t("limited_time_offers")}</div>
            
            <div class="row" style="gap:8px; overflow-x:auto">
              ${stream.flashDeals.map(deal => {
                const product = productById(deal.productId);
                const timeLeft = Math.floor((deal.endTime - Date.now()) / 60000);
                
                return `
                  <div class="panel" style="background:rgba(255,255,255,0.15); color:white; min-width:120px; text-align:center">
                    <div style="font-size:12px; margin-bottom:4px">${getProductField(product, 'name').substring(0, 15)}...</div>
                    <div style="font-size:16px; font-weight:bold">${fmtSAR(deal.salePrice)}</div>
                    <div style="font-size:11px; text-decoration:line-through; opacity:0.8">${fmtSAR(deal.originalPrice)}</div>
                    <div style="font-size:10px; margin-top:4px">${timeLeft}m left</div>
                    <button class="ghost small" style="border-color:white; color:white; margin-top:4px; font-size:10px" 
                            data-action="flash-buy" data-id="${product.id}">
                      ${t("grab_deal")}
                    </button>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}
        
        <!-- Chat and products toggle -->
        <div class="row" style="gap:8px; margin-bottom:16px">
          <button id="chatTab" class="chip active" onclick="window.__switchLiveTab && window.__switchLiveTab('chat')" 
                  style="flex:1; background:var(--brand); color:white">
            💬 ${t("chat")} (${Math.floor(Math.random() * 50) + 20})
          </button>
          <button id="productsTab" class="chip" onclick="window.__switchLiveTab && window.__switchLiveTab('products')" 
                  style="flex:1">
            🛍️ ${t("products")} (${streamProducts.length})
          </button>
          <button id="dealTab" class="chip" onclick="window.__switchLiveTab && window.__switchLiveTab('deals')" 
                  style="flex:1">
            🔥 ${t("deals")} (${stream.flashDeals?.length || 0})
          </button>
        </div>
        
        <!-- Chat view -->
        <div id="chatView" class="live-content">
          <div style="max-height:240px; overflow-y:auto; border:1px solid var(--border); border-radius:12px; padding:12px; margin-bottom:12px; background:var(--panel)">
            <div class="live-message">
              <strong style="color:var(--brand)">@maya_shopper:</strong> <span>Love these products! 😍</span>
            </div>
            <div class="live-message">
              <strong style="color:var(--brand-2)">@style_hunter:</strong> <span>How's the quality?</span>
            </div>
            <div class="live-message">
              <strong style="color:var(--brand)">${stream.creator}:</strong> <span>Excellent quality! Very comfortable 👟</span>
            </div>
            <div class="live-message">
              <strong style="color:var(--brand-2)">@deal_hunter:</strong> <span>Just ordered! Thanks ${creator.name}! 🔥</span>
            </div>
            <div class="live-message">
              <strong style="color:var(--brand)">@saudi_shopper:</strong> <span>Perfect timing! Needed this</span>
            </div>
            <div class="live-message">
              <strong style="color:var(--brand-2)">@fashion_lover:</strong> <span>shipping to Riyadh?</span>
            </div>
            <div class="live-message">
              <strong style="color:var(--brand)">${stream.creator}:</strong> <span>Yes! Free shipping to all Saudi cities 🚚</span>
            </div>
          </div>
          
          <!-- Chat input -->
          <div class="row" style="gap:8px">
            <input id="liveMessage" placeholder="${t("type_message")}" style="flex:1" />
            <button class="secondary" onclick="window.__sendLiveMessage && window.__sendLiveMessage()">
              ${t("send")}
            </button>
            <button class="ghost" onclick="window.__sendQuickReaction && window.__sendQuickReaction()" title="${t("quick_reaction")}">
              ❤️
            </button>
          </div>
          
          <!-- Quick reactions -->
          <div class="row" style="gap:4px; margin-top:8px; justify-content:center">
            <button class="chip small" onclick="window.__sendQuickReaction && window.__sendQuickReaction('🔥')" style="font-size:14px">🔥</button>
            <button class="chip small" onclick="window.__sendQuickReaction && window.__sendQuickReaction('❤️')" style="font-size:14px">❤️</button>
            <button class="chip small" onclick="window.__sendQuickReaction && window.__sendQuickReaction('👏')" style="font-size:14px">👏</button>
            <button class="chip small" onclick="window.__sendQuickReaction && window.__sendQuickReaction('😍')" style="font-size:14px">😍</button>
            <button class="chip small" onclick="window.__sendQuickReaction && window.__sendQuickReaction('🛒')" style="font-size:14px">🛒</button>
          </div>
        </div>
        
        <!-- Products view -->
        <div id="productsView" class="live-content" style="display:none">
          ${currentProduct ? `
            <!-- Featured product -->
            <div class="panel" style="background:var(--brand-2); color:white; margin-bottom:16px; position:relative">
              <div style="position:absolute; top:8px; right:8px">
                <span class="chip" style="background:var(--danger,#ff4444); color:white">
                  🔥 ${t("featured_now")}
                </span>
              </div>
              <div class="row" style="gap:12px">
                <img src="${uns(currentProduct.img, 200)}" alt="${getProductField(currentProduct, 'name')}" 
                     style="width:80px; height:80px; border-radius:12px; object-fit:cover" />
                <div style="flex:1">
                  <strong style="display:block">${getProductField(currentProduct, 'name')}</strong>
                  <div style="opacity:0.9">${getProductField(currentProduct, 'cat')}</div>
                  <div style="font-size:18px; font-weight:bold; margin-top:4px">
                    ${fmtSAR(currentProduct.price)}
                    ${currentProduct.listPrice ? `<span style="text-decoration:line-through; opacity:0.7; margin-left:8px">${fmtSAR(currentProduct.listPrice)}</span>` : ''}
                  </div>
                </div>
              </div>
              <div class="row" style="gap:8px; margin-top:12px">
                <button class="ghost" style="flex:1; border-color:white; color:white" 
                        data-action="add-to-cart" data-id="${currentProduct.id}">
                  ${t("add_to_cart")}
                </button>
                <button class="secondary" style="flex:1; background:white; color:var(--brand-2)" 
                        data-action="buy-now" data-id="${currentProduct.id}">
                  ${t("buy_now")}
                </button>
              </div>
            </div>
          ` : ''}
          
          <!-- Other products -->
          ${streamProducts.length > 1 ? `
            <div>
              <h4>${t("more_from")} ${creator.name}</h4>
              <div class="grid" style="grid-template-columns:1fr 1fr; gap:12px; margin-top:8px">
                ${streamProducts.slice(1).map(p => `
                  <div class="panel" style="padding:8px">
                    <img src="${uns(p.img, 200)}" alt="${getProductField(p, 'name')}" 
                         style="width:100%; aspect-ratio:1; border-radius:8px; object-fit:cover; margin-bottom:8px" />
                    <strong style="font-size:14px; display:block">${getProductField(p, 'name')}</strong>
                    <div style="color:var(--brand); font-weight:bold">${fmtSAR(p.price)}</div>
                    <button class="ghost small" data-action="add-to-cart" data-id="${p.id}" 
                            style="width:100%; margin-top:8px">
                      ${t("add_to_cart")}
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
        
        <!-- Deals view -->
        <div id="dealView" class="live-content" style="display:none">
          ${stream.flashDeals?.length > 0 ? `
            <h4 style="margin-bottom:12px">${t("flash_deals_ending_soon")}</h4>
            ${stream.flashDeals.map(deal => {
              const product = productById(deal.productId);
              const timeLeft = Math.floor((deal.endTime - Date.now()) / 60000);
              const savings = deal.originalPrice - deal.salePrice;
              const discount = Math.round((savings / deal.originalPrice) * 100);
              
              return `
                <div class="panel" style="margin-bottom:12px; position:relative">
                  <div style="position:absolute; top:8px; right:8px">
                    <span class="chip" style="background:var(--danger,#ff4444); color:white; font-size:11px">
                      ${timeLeft}m left
                    </span>
                  </div>
                  
                  <div class="row" style="gap:12px">
                    <img src="${uns(product.img, 200)}" alt="${getProductField(product, 'name')}" 
                         style="width:60px; height:60px; border-radius:8px; object-fit:cover" />
                    <div style="flex:1">
                      <strong style="display:block; margin-bottom:4px">${getProductField(product, 'name')}</strong>
                      <div style="font-size:14px; color:var(--muted); margin-bottom:4px">${getProductField(product, 'cat')}</div>
                      
                      <div class="row" style="gap:8px; align-items:center">
                        <span style="font-size:18px; font-weight:bold; color:var(--danger,#ff4444)">${fmtSAR(deal.salePrice)}</span>
                        <span style="text-decoration:line-through; color:var(--muted)">${fmtSAR(deal.originalPrice)}</span>
                        <span class="chip small" style="background:var(--success,#22c55e); color:white">-${discount}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="row" style="gap:8px; margin-top:12px">
                    <button class="ghost" style="flex:1" data-action="add-to-cart" data-id="${product.id}">
                      ${t("add_to_cart")}
                    </button>
                    <button class="primary" style="flex:2" data-action="flash-buy" data-id="${product.id}">
                      🔥 ${t("grab_deal")} - ${fmtSAR(deal.salePrice)}
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          ` : `
            <div style="text-align:center; padding:32px; color:var(--muted)">
              <div style="font-size:48px; margin-bottom:16px">🔥</div>
              <h4 style="margin-bottom:8px">${t("no_active_deals")}</h4>
              <p>${t("stay_tuned_for_deals")}</p>
            </div>
          `}
        </div>
        
        <!-- Live shopping actions -->
        <div class="row" style="gap:8px; margin-top:16px; padding-top:16px; border-top:1px solid var(--border)">
          <button class="ghost" onclick="window.__shareLive && window.__shareLive('${streamId}')" style="flex:1">
            📤 ${t("share")}
          </button>
          <button class="ghost" onclick="window.__followCreator && window.__followCreator('${creator.id}')" style="flex:1">
            ➕ ${t("follow")}
          </button>
          <button class="ghost" onclick="window.__reportLive && window.__reportLive('${streamId}')" style="flex:1">
            🚨 ${t("report")}
          </button>
        </div>
      </div>
    </section>
  `);
  
  // Auto-scroll chat to bottom
  setTimeout(() => {
    const chatContainer = document.querySelector('#chatView > div');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, 100);
  
  // Simulate live chat updates
  if (window.__liveUpdateInterval) {
    clearInterval(window.__liveUpdateInterval);
  }
  
  window.__liveUpdateInterval = setInterval(() => {
    if (document.getElementById('chatView')?.style.display !== 'none') {
      const messages = [
        "Amazing quality! 🔥",
        "Just added to cart!",
        "Love this brand ❤️",
        "How's the delivery time?",
        "Perfect for my style!",
        "Thanks for the demo!",
        "Ordering now! 🛒",
        "السعر ممتاز! 👌", // Arabic: Great price!
        "شحن مجاني؟", // Arabic: Free shipping?
        "جودة رائعة", // Arabic: Excellent quality
        "تم الطلب! شكراً",  // Arabic: Ordered! Thanks
        "يوصل الرياض؟" // Arabic: Delivers to Riyadh?
      ];
      const users = ["@style_lover", "@trend_setter", "@shop_smart", "@fashion_forward", "@deal_hunter", "@saudi_buyer", "@riyadh_fashion"];
      
      const chatContainer = document.querySelector('#chatView > div');
      if (chatContainer) {
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        const randomUser = users[Math.floor(Math.random() * users.length)];
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'live-message';
        messageDiv.innerHTML = `<strong style="color:var(--brand-2)">${randomUser}:</strong> <span>${randomMessage}</span>`;
        
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // Keep only last 12 messages
        while (chatContainer.children.length > 12) {
          chatContainer.removeChild(chatContainer.firstChild);
        }
      }
    }
  }, 3000 + Math.random() * 3000); // Random interval 3-6 seconds
}

// Order confirmation helper function
window.__shareOrder = (orderId) => {
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;
  
  const shareData = {
    title: t("order_shared_title"),
    text: `${t("order_shared_text")} #${orderId}`,
    url: `${location.origin}${location.pathname}#/order/${orderId}`
  };
  
  if (navigator.share) {
    navigator.share(shareData);
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(shareData.url).then(() => {
      alert(t("link_copied"));
    });
  }
};

/* ---------- AI Tracking Functions ---------- */

window.__trackAIClick = (itemId, itemType, reason) => {
  console.log(`🤖 AI Click: ${itemType} ${itemId} - ${reason}`);
  aiEngine.trackClick(itemId, itemType, { 
    reason, 
    timestamp: Date.now(),
    source: 'ai_recommendation'
  });
};

window.__trackCategoryClick = (category) => {
  console.log(`🏷️ Category Click: ${category}`);
  aiEngine.trackClick(category, 'category', { 
    timestamp: Date.now(),
    source: 'category_navigation'
  });
};

window.__showFullInsights = () => {
  const insights = aiEngine.getUserInsights();
  
  const insightsHTML = `
    <div style="padding:20px;">
      <h2>🤖 ${t("your_ai_insights")}</h2>
      
      <div style="margin:16px 0;">
        <h4>${t("top_categories")}</h4>
        ${insights.topCategories.map(cat => `
          <div class="row between" style="margin:4px 0; padding:8px; background:var(--bg-2); border-radius:6px">
            <span>${cat.category}</span>
            <span class="chip">${cat.score} ${t("interactions")}</span>
          </div>
        `).join('')}
      </div>
      
      <div style="margin:16px 0;">
        <h4>${t("activity_summary")}</h4>
        <div class="grid" style="grid-template-columns:1fr 1fr; gap:8px">
          <div style="text-align:center; padding:12px; background:var(--bg-2); border-radius:6px">
            <div style="font-size:24px; font-weight:bold; color:var(--brand)">${insights.activityStats.totalViews}</div>
            <div class="muted small">${t("products_viewed")}</div>
          </div>
          <div style="text-align:center; padding:12px; background:var(--bg-2); border-radius:6px">
            <div style="font-size:24px; font-weight:bold; color:var(--brand-2)">${insights.activityStats.sessionCount}</div>
            <div class="muted small">${t("shopping_sessions")}</div>
          </div>
        </div>
      </div>
      
      <div style="margin:16px 0;">
        <h4>${t("price_preference")}</h4>
        <div style="padding:12px; background:var(--bg-2); border-radius:6px">
          ${fmt(insights.priceRange.min)} - ${fmt(insights.priceRange.max)}
        </div>
      </div>
      
      <div class="row" style="gap:12px; margin-top:20px">
        <button class="ghost" onclick="window.__hideSheet()" style="flex:1">${t("close")}</button>
        <button class="secondary" onclick="window.__resetAIData()" style="flex:1">${t("reset_ai_data")}</button>
      </div>
    </div>
  `;
  
  showSheet(insightsHTML);
};

window.__resetAIData = () => {
  if (!confirm(t("confirm_reset_ai_data"))) return;
  
  localStorage.removeItem("storez_ai_data_v1");
  aiEngine.data = aiEngine.getDefaultAIData();
  aiEngine.saveAIData();
  
  window.__hideSheet();
  alert(t("ai_data_reset_success"));
  
  // Refresh the current page
  window.location.reload();
};
