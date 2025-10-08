/* routes.js — StoreZ (Buyer SPA) route handlers
   Each handler receives:
     ctx = { el, state, actions, t, tn, currency, fmtDate, navigate, showSheet, refresh }
   and optional id from the hash (e.g., #/pdp/p1 => id = "p1")
*/
import { uns, state, actions, productById, creatorById, cartTotal, getProductField, getProductTitle, getProductImage } from "./data.js";
import { t, tn, getLang, formatTimeAgo, fmtSAR } from "./i18n.js";
import { aiEngine } from "./ai.js";

/* ---------- tiny DOM helpers ---------- */
const h = (html) => html.trim();

/* ---------- utility functions ---------- */
const stars = (n) => "⭐".repeat(Math.round(Number(n || 4)));
const fmt = (n) => new Intl.NumberFormat(
  getLang() === "ar" ? "ar-SA" : "en-US", 
  { minimumFractionDigits: 0, maximumFractionDigits: 0 }
).format(Number(n) || 0);
const creatorName = (cid) => (creatorById(cid)?.name || "Creator");

/* ---------- global functions for interactivity ---------- */
window.addToCart = function(productId) {
  if (actions.addToCart) {
    actions.addToCart(productId);
    alert(t("added_to_cart") || "Added to cart!");
  }
};

/* Basic route handlers */
const landing = ({ el }) => {
  el.innerHTML = h(`
    <div style="padding: 40px 20px; text-align: center;">
      <h1>${t("welcome") || "مرحباً بك في StoreZ"}</h1>
      <p style="font-size: 18px; margin: 20px 0; color: var(--text-muted);">
        ${t("landing_subtitle") || "منصة التجارة الاجتماعية الرائدة"}
      </p>
      <div style="margin: 40px 0;">
        <button onclick="location.hash='#/home'" class="primary large">
          ${t("start_shopping") || "ابدأ التسوق"}
        </button>
      </div>
    </div>
  `);
};

const home = ({ el }) => {
  const featuredProducts = state.products?.slice(0, 6) || [];
  el.innerHTML = h(`
    <div style="padding: 20px;">
      <h1>${t("featured_products") || "المنتجات المميزة"}</h1>
      <div class="products-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; margin-top: 20px;">
        ${featuredProducts.map(p => `
          <div class="product-card" onclick="location.hash='#/pdp/${p.id}'" style="border: 1px solid var(--border); border-radius: 8px; padding: 15px; cursor: pointer;">
            <img src="${getProductImage(p, 300)}" alt="${getProductTitle(p)}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px;">
            <h3 style="margin: 10px 0; font-size: 14px;">${getProductTitle(p)}</h3>
            <p style="font-weight: bold; color: var(--primary);">${fmtSAR(p.price)}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `);
};

const discover = ({ el, state, actions }) => {
  const searchQuery = state.search.query || "";
  const searchResults = state.search.results || [];
  const categories = state.search.categories || [];
  const trending = state.search.trending || [];
  const recent = state.search.recentSearches || [];
  
  el.innerHTML = h(`
    <div style="padding: 20px;">
      <!-- Search Header -->
      <div style="margin-bottom: 24px;">
        <h1 style="margin-bottom: 8px;">${t("discover")}</h1>
        <p style="color: var(--text-muted); font-size: 14px;">${t("discover_ph")}</p>
      </div>

      <!-- Enhanced Search Bar -->
      <div class="search-container" style="position: relative; margin-bottom: 24px;">
        <div class="search-bar" style="position: relative; display: flex; align-items: center; background: var(--card); border: 2px solid var(--border); border-radius: 12px; overflow: hidden;">
          <span style="padding: 0 16px; color: var(--text-muted); font-size: 18px;">🔍</span>
          <input 
            type="text" 
            id="searchInput"
            placeholder="${t("discover_ph")}" 
            value="${searchQuery}"
            style="flex: 1; padding: 16px 0; border: none; background: transparent; font-size: 16px; color: var(--text);"
            oninput="handleSearchInput(this.value)"
            onfocus="showSearchSuggestions(true)"
          />
          ${searchQuery ? `<button onclick="clearSearch()" style="padding: 8px 16px; border: none; background: transparent; color: var(--text-muted); cursor: pointer;">✕</button>` : ''}
        </div>
        
        <!-- Search Suggestions Dropdown -->
        <div id="searchSuggestions" class="search-suggestions" style="display: none; position: absolute; top: 100%; left: 0; right: 0; background: var(--card); border: 1px solid var(--border); border-radius: 8px; margin-top: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); z-index: 10;">
          <!-- Dynamic suggestions will be inserted here -->
        </div>
      </div>

      <!-- Quick Access Chips -->
      <div style="margin-bottom: 24px;">
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${trending.slice(0, 6).map(term => `
            <button class="chip-button" onclick="performQuickSearch('${term}')" style="padding: 8px 16px; background: var(--accent-light); color: var(--accent); border: 1px solid var(--accent); border-radius: 20px; font-size: 14px; cursor: pointer; border: none;">
              ${term}
            </button>
          `).join('')}
        </div>
      </div>

      ${searchQuery ? `
        <!-- Search Results -->
        <div class="search-results">
          <!-- Results Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3>${t("results_count").replace("{n}", searchResults.length)}</h3>
            <button onclick="showFilters()" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: var(--card); border: 1px solid var(--border); border-radius: 8px; cursor: pointer;">
              <span>⚙️</span>
              <span>${t("filters")}</span>
            </button>
          </div>

          <!-- Active Filters -->
          <div id="activeFilters" style="margin-bottom: 16px;">
            ${renderActiveFilters(state.search.filters)}
          </div>

          <!-- Results Grid -->
          <div class="products-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;">
            ${searchResults.map(product => `
              <div class="product-card" onclick="location.hash='#/pdp/${product.id}'" style="border: 1px solid var(--border); border-radius: 8px; padding: 15px; cursor: pointer; background: var(--card);">
                <img src="${getProductImage(product, 300)}" alt="${getProductTitle(product)}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px;">
                <h3 style="margin: 10px 0; font-size: 14px; font-weight: 600;">${getProductTitle(product)}</h3>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <p style="font-weight: bold; color: var(--primary);">${fmtSAR(product.price)}</p>
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <span style="color: #ffa500;">${stars(product.rating)}</span>
                    <span style="font-size: 12px; color: var(--text-muted);">${product.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          ${searchResults.length === 0 ? `
            <div style="text-align: center; padding: 40px; color: var(--text-muted);">
              <div style="font-size: 48px; margin-bottom: 16px;">🔍</div>
              <h3>${t("no_products_found") || "No products found"}</h3>
              <p>${t("try_different_search") || "Try adjusting your search or filters"}</p>
            </div>
          ` : ''}
        </div>
      ` : `
        <!-- Discovery Homepage -->
        <div class="discovery-homepage">
          <!-- Trending Searches -->
          <div style="margin-bottom: 32px;">
            <h3 style="margin-bottom: 16px;">${t("trending_searches")}</h3>
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
              ${trending.map(term => `
                <button onclick="performQuickSearch('${term}')" style="padding: 12px 20px; background: var(--card); border: 1px solid var(--border); border-radius: 8px; cursor: pointer; font-size: 14px;">
                  <span style="margin-right: 8px;">📈</span>
                  ${term}
                </button>
              `).join('')}
            </div>
          </div>

          ${recent.length > 0 ? `
            <!-- Recent Searches -->
            <div style="margin-bottom: 32px;">
              <h3 style="margin-bottom: 16px;">${t("recent")}</h3>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                ${recent.slice(0, 5).map(term => `
                  <button onclick="performQuickSearch('${term}')" style="padding: 8px 16px; background: var(--accent-light); color: var(--text-muted); border: 1px solid var(--border); border-radius: 20px; cursor: pointer; font-size: 13px;">
                    <span style="margin-right: 6px;">🕒</span>
                    ${term}
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Browse Categories -->
          <div>
            <h3 style="margin-bottom: 16px;">${t("browse_categories")}</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 16px;">
              ${categories.map(category => `
                <button onclick="searchByCategory('${category.id}')" style="padding: 20px; background: var(--card); border: 1px solid var(--border); border-radius: 12px; cursor: pointer; text-align: center;">
                  <div style="font-size: 24px; margin-bottom: 8px;">${getCategoryIcon(category.id)}</div>
                  <div style="font-weight: 600; margin-bottom: 4px;">${loc(category, "name")}</div>
                  <div style="font-size: 12px; color: var(--text-muted);">${category.count} ${t("products") || "products"}</div>
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      `}
    </div>
  `);

  // Set up search functionality
  setupSearchFunctionality();
};

const auth = ({ el, actions, navigate }) => {
  const handleAuth = () => {
    // Set user as authenticated for demo purposes
    actions.setUserAuth(true);
    navigate("#/home");
  };

  const handleFormAuth = (event) => {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    const password = event.target.querySelector('input[type="password"]').value;
    
    // Demo authentication - accept any email/password
    if (email && password) {
      actions.setUserAuth(true);
      navigate("#/home");
    } else {
      alert(t("please_fill_fields") || "Please fill in all fields");
    }
  };

  el.innerHTML = h(`
    <div style="padding: 40px 20px; max-width: 400px; margin: 0 auto;">
      <h1>${t("sign_in") || "Sign In"}</h1>
      
      <!-- Quick Demo Login -->
      <div style="margin: 20px 0; padding: 20px; background: var(--primary-bg, #f0f4ff); border-radius: 8px; text-align: center;">
        <p style="margin: 0 0 15px 0; color: var(--text-secondary, #666); font-size: 14px;">
          ${t("demo_mode") || "Demo Mode"}
        </p>
        <button onclick="handleQuickAuth()" class="primary" style="padding: 10px 20px;">
          ${t("quick_login") || "Quick Login (Demo)"}
        </button>
      </div>
      
      <div style="margin: 30px 0;">
        <form onsubmit="handleFormAuth(event)">
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px;">${t("email") || "Email"}</label>
            <input type="email" style="width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 4px;" placeholder="demo@storez.com">
          </div>
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px;">${t("password") || "Password"}</label>
            <input type="password" style="width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 4px;" placeholder="password">
          </div>
          <button type="submit" class="primary" style="width: 100%; padding: 12px;">
            ${t("sign_in") || "Sign In"}
          </button>
        </form>
      </div>
      <p style="text-align: center;">
        ${t("no_account") || "Don't have an account?"} 
        <a href="#/signup" style="color: var(--primary);">${t("sign_up") || "Sign Up"}</a>
      </p>
    </div>
  `);

  // Add event handlers to global scope for inline onclick
  window.handleQuickAuth = handleAuth;
  window.handleFormAuth = handleFormAuth;
};

const pdp = ({ el }, id) => {
  const product = productById(id);
  if (!product) {
    el.innerHTML = h(`
      <div style="padding: 20px; text-align: center;">
        <h2>${t("product_not_found") || "Product not found"}</h2>
        <button onclick="location.hash='#/home'" class="primary">
          ${t("back_to_home") || "Back to Home"}
        </button>
      </div>
    `);
    return;
  }
  
  el.innerHTML = h(`
    <div style="padding: 20px;">
      <button onclick="history.back()" class="secondary" style="margin-bottom: 20px;">
        ← ${t("back") || "Back"}
      </button>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; max-width: 800px;">
        <div>
          <img src="${getProductImage(product, 600)}" alt="${getProductTitle(product)}" 
               style="width: 100%; max-width: 400px; border-radius: 8px;">
        </div>
        <div>
          <h1>${getProductTitle(product)}</h1>
          <div style="margin: 15px 0;">
            <span style="font-size: 24px; font-weight: bold; color: var(--primary);">
              ${fmtSAR(product.price)}
            </span>
          </div>
          <p style="margin: 20px 0; color: var(--text-muted);">
            ${product.description || t("no_description")}
          </p>
          <div style="margin: 30px 0;">
            <button onclick="window.addToCart?.('${product.id}')" class="primary large">
              ${t("add_to_cart") || "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  `);
};

const checkout = ({ el }) => {
  const cartItems = state.cart || [];
  const total = cartTotal();
  
  el.innerHTML = h(`
    <div style="padding: 20px; max-width: 600px; margin: 0 auto;">
      <h1>${t("checkout") || "Checkout"}</h1>
      <div style="margin: 30px 0;">
        <h3>${t("order_summary") || "Order Summary"}</h3>
        <div style="border: 1px solid var(--border); border-radius: 8px; padding: 20px; margin: 15px 0;">
          ${cartItems.length === 0 ? `
            <p>${t("cart_empty") || "Your cart is empty"}</p>
          ` : `
            ${cartItems.map(item => {
              const product = productById(item.productId);
              return `
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span>${getProductTitle(product)} (x${item.quantity})</span>
                  <span>${fmtSAR(product.price * item.quantity)}</span>
                </div>
              `;
            }).join('')}
            <hr style="margin: 15px 0;">
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px;">
              <span>${t("total") || "Total"}</span>
              <span>${fmtSAR(total)}</span>
            </div>
          `}
        </div>
        ${cartItems.length > 0 ? `
          <button class="primary large" style="width: 100%;">
            ${t("place_order") || "Place Order"}
          </button>
        ` : `
          <button onclick="location.hash='#/home'" class="primary">
            ${t("continue_shopping") || "Continue Shopping"}
          </button>
        `}
      </div>
    </div>
  `);
};

const cart = ({ el, state, actions }) => {
  const cartItems = state.cart || [];
  const total = cartTotal();
  
  // Make removeFromCart globally available
  window.removeFromCart = (productId) => {
    actions.removeFromCart(productId);
    // Trigger a refresh of the cart view
    setTimeout(() => location.hash = '#/cart', 100);
  };
  
  el.innerHTML = h(`
    <div style="padding: 20px; max-width: 600px; margin: 0 auto;">
      <h1>${t("cart") || "Cart"}</h1>
      <div style="margin: 30px 0;">
        ${cartItems.length === 0 ? `
          <div style="text-align: center; padding: 40px 20px;">
            <p style="font-size: 18px; color: var(--text-muted); margin-bottom: 20px;">
              ${t("cart_empty") || "Your cart is empty"}
            </p>
            <button onclick="location.hash='#/home'" class="primary">
              ${t("continue_shopping") || "Continue Shopping"}
            </button>
          </div>
        ` : `
          <div style="border: 1px solid var(--border); border-radius: 8px; padding: 20px; margin: 15px 0;">
            ${cartItems.map(item => {
              const product = productById(item.productId);
              return `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid var(--border);">
                  <div style="display: flex; align-items: center; gap: 15px;">
                    <img src="${getProductImage(product, 100)}" alt="${getProductTitle(product)}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
                    <div>
                      <h4 style="margin: 0; font-size: 16px;">${getProductTitle(product)}</h4>
                      <p style="margin: 5px 0 0 0; color: var(--text-muted);">${fmtSAR(product.price)}</p>
                    </div>
                  </div>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 14px;">Qty: ${item.quantity}</span>
                    <button onclick="window.removeFromCart('${item.productId}')" style="background: none; border: 1px solid var(--border); border-radius: 4px; padding: 5px 8px; cursor: pointer;">
                      Remove
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; margin-top: 20px; padding-top: 20px; border-top: 2px solid var(--border);">
              <span>${t("total") || "Total"}</span>
              <span>${fmtSAR(total)}</span>
            </div>
            <div style="margin-top: 30px; display: flex; gap: 15px;">
              <button onclick="location.hash='#/home'" class="secondary" style="flex: 1;">
                ${t("continue_shopping") || "Continue Shopping"}
              </button>
              <button onclick="location.hash='#/checkout'" class="primary" style="flex: 1;">
                ${t("checkout") || "Checkout"}
              </button>
            </div>
          </div>
        `}
      </div>
    </div>
  `);
};

const profile = ({ el }) => {
  el.innerHTML = `
    <div style="padding: 20px;">
      <h1>${t("profile") || "Profile"}</h1>
      <p>User profile and settings</p>
    </div>
  `;
};

const ugcfeed = ({ el }) => {
  el.innerHTML = `
    <div style="padding: 20px;">
      <h1>${t("social") || "Social"}</h1>
      <p>Social content feed</p>
    </div>
  `;
};

/* Export routes */
export const routes = {
  "/landing": landing,
  "/auth": auth,
  "/home": home,
  "/discover": discover,
  "/pdp": pdp,
  "/checkout": checkout,
  "/ugcfeed": ugcfeed,
  "/cart": cart,
  "/profile": profile
};

/* ---------- Enhanced Search & Discovery Helper Functions ---------- */

function renderActiveFilters(filters) {
  const activeFilters = [];
  
  if (filters.category?.length) {
    activeFilters.push(`${t("category")}: ${filters.category.join(", ")}`);
  }
  
  if (filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000)) {
    activeFilters.push(`${t("price_range")}: ${fmtSAR(filters.priceRange[0])} - ${fmtSAR(filters.priceRange[1])}`);
  }
  
  if (filters.rating > 0) {
    activeFilters.push(`${t("min_rating")}: ${stars(filters.rating)}`);
  }
  
  if (filters.sortBy && filters.sortBy !== "relevance") {
    activeFilters.push(`${t("sort_by")}: ${t(filters.sortBy)}`);
  }
  
  return activeFilters.map(filter => `
    <span style="display: inline-block; padding: 4px 12px; background: var(--accent-light); color: var(--accent); border-radius: 16px; font-size: 12px; margin: 2px;">
      ${filter} <button onclick="removeFilter('${filter}')" style="margin-left: 6px; background: none; border: none; color: inherit; cursor: pointer;">×</button>
    </span>
  `).join('');
}

function getCategoryIcon(categoryId) {
  const icons = {
    apparel: "👕",
    footwear: "👟", 
    accessories: "👜",
    home: "🏠",
    beauty: "💄"
  };
  return icons[categoryId] || "📦";
}

function setupSearchFunctionality() {
  // Global search functions for UI interactions
  window.handleSearchInput = function(query) {
    if (query.length >= 2) {
      const suggestions = actions.getSearchSuggestions(query);
      displaySearchSuggestions(suggestions);
      showSearchSuggestions(true);
    } else {
      showSearchSuggestions(false);
    }
    
    // Debounce search execution
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      if (query.trim()) {
        actions.performSearch(query);
        // Refresh the discover page to show results
        location.hash = '#/discover';
      }
    }, 500);
  };

  window.performQuickSearch = function(query) {
    actions.performSearch(query);
    location.hash = '#/discover';
  };

  window.searchByCategory = function(categoryId) {
    const category = state.search.categories.find(c => c.id === categoryId);
    if (category) {
      actions.performSearch("", { category: [loc(category, "name")] });
      location.hash = '#/discover';
    }
  };

  window.clearSearch = function() {
    actions.clearSearch();
    document.getElementById('searchInput').value = '';
    location.hash = '#/discover';
  };

  window.showSearchSuggestions = function(show) {
    const suggestions = document.getElementById('searchSuggestions');
    if (suggestions) {
      suggestions.style.display = show ? 'block' : 'none';
    }
  };

  window.showFilters = function() {
    // Create filter modal/sheet
    const filterModal = document.createElement('div');
    filterModal.className = 'filter-modal';
    filterModal.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
      background: rgba(0,0,0,0.5); z-index: 100; 
      display: flex; align-items: flex-end; justify-content: center;
    `;
    
    filterModal.innerHTML = `
      <div style="background: var(--bg); width: 100%; max-width: 480px; border-radius: 16px 16px 0 0; padding: 24px; max-height: 80vh; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <h3>${t("filters")}</h3>
          <button onclick="closeFilters()" style="background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
        </div>
        
        <!-- Category Filter -->
        <div style="margin-bottom: 24px;">
          <h4 style="margin-bottom: 12px;">${t("category")}</h4>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            ${state.search.categories.map(category => `
              <label style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; border: 1px solid var(--border); border-radius: 20px; cursor: pointer;">
                <input type="checkbox" name="category" value="${category.id}" ${state.search.filters.category?.includes(loc(category, "name")) ? 'checked' : ''}>
                <span>${loc(category, "name")}</span>
              </label>
            `).join('')}
          </div>
        </div>
        
        <!-- Price Range -->
        <div style="margin-bottom: 24px;">
          <h4 style="margin-bottom: 12px;">${t("price_range")}</h4>
          <div style="display: flex; gap: 12px; align-items: center;">
            <input type="range" id="minPrice" min="0" max="500" value="${state.search.filters.priceRange[0]}" style="flex: 1;">
            <span>${fmtSAR(state.search.filters.priceRange[0])}</span>
            <span>-</span>
            <input type="range" id="maxPrice" min="500" max="1000" value="${state.search.filters.priceRange[1]}" style="flex: 1;">
            <span>${fmtSAR(state.search.filters.priceRange[1])}</span>
          </div>
        </div>
        
        <!-- Sort By -->
        <div style="margin-bottom: 24px;">
          <h4 style="margin-bottom: 12px;">${t("sort_by")}</h4>
          <select id="sortBy" style="width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 8px;">
            <option value="relevance" ${state.search.filters.sortBy === 'relevance' ? 'selected' : ''}>${t("relevance")}</option>
            <option value="price-low" ${state.search.filters.sortBy === 'price-low' ? 'selected' : ''}>${t("price_low_high")}</option>
            <option value="price-high" ${state.search.filters.sortBy === 'price-high' ? 'selected' : ''}>${t("price_high_low")}</option>
            <option value="rating" ${state.search.filters.sortBy === 'rating' ? 'selected' : ''}>${t("highest_rated")}</option>
            <option value="newest" ${state.search.filters.sortBy === 'newest' ? 'selected' : ''}>${t("newest")}</option>
          </select>
        </div>
        
        <!-- Action Buttons -->
        <div style="display: flex; gap: 12px;">
          <button onclick="clearAllFilters()" style="flex: 1; padding: 12px; background: var(--card); border: 1px solid var(--border); border-radius: 8px; cursor: pointer;">
            ${t("clear_filters")}
          </button>
          <button onclick="applyFilters()" style="flex: 1; padding: 12px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">
            ${t("apply_filters")}
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(filterModal);
    
    // Filter functions
    window.closeFilters = function() {
      document.body.removeChild(filterModal);
    };
    
    window.clearAllFilters = function() {
      actions.clearSearch();
      document.body.removeChild(filterModal);
      location.hash = '#/discover';
    };
    
    window.applyFilters = function() {
      const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
        .map(cb => state.search.categories.find(c => c.id === cb.value))
        .map(c => loc(c, "name"));
      
      const minPrice = parseInt(document.getElementById('minPrice').value);
      const maxPrice = parseInt(document.getElementById('maxPrice').value);
      const sortBy = document.getElementById('sortBy').value;
      
      const filters = {
        category: selectedCategories,
        priceRange: [minPrice, maxPrice],
        sortBy: sortBy
      };
      
      actions.updateSearchFilters(filters);
      document.body.removeChild(filterModal);
      location.hash = '#/discover';
    };
  };
}

function displaySearchSuggestions(suggestions) {
  const container = document.getElementById('searchSuggestions');
  if (!container) return;
  
  if (suggestions.length === 0) {
    container.style.display = 'none';
    return;
  }
  
  container.innerHTML = suggestions.map(suggestion => `
    <div onclick="performQuickSearch('${suggestion.text}')" style="padding: 12px 16px; cursor: pointer; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span>${suggestion.type === 'popular' ? '📈' : '🔍'}</span>
        <span>${suggestion.text}</span>
      </div>
      ${suggestion.count ? `<span style="font-size: 12px; color: var(--text-muted);">${suggestion.count}</span>` : ''}
    </div>
  `).join('');
  
  container.style.display = 'block';
}