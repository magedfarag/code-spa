/* routes.js — StoreZ (Buyer SPA) route handlers
   Each handler receives:
     ctx = { el, state, actions, t, tn, currency, fmtDate, navigate, showSheet, refresh }
   and optional id from the hash (e.g., #/pdp/p1 => id = "p1")
*/
import { uns, state, actions, productById, creatorById, cartTotal, getProductField, getProductTitle, getProductImage, loc } from "./data.js?v=20251008";
import { t, tn, getLang, formatTimeAgo, fmtSAR } from "./i18n.js?v=20251008";
import { aiEngine } from "./ai.js?v=20251008";

/* ---------- tiny DOM helpers ---------- */
const h = (html) => html.trim();

/* ---------- utility functions ---------- */
const stars = (n) => "⭐".repeat(Math.round(Number(n || 4)));
const fmt = (n) => new Intl.NumberFormat(
  getLang() === "ar" ? "ar-SA" : "en-US", 
  { minimumFractionDigits: 0, maximumFractionDigits: 0 }
).format(Number(n) || 0);
const formatNumber = (n) => new Intl.NumberFormat(
  getLang() === "ar" ? "ar-SA" : "en-US", 
  { notation: "compact", compactDisplay: "short" }
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

const home = ({ el, state, actions }) => {
  const featuredProducts = state.products?.slice(0, 8) || [];
  const categories = state.search.categories || [];
  const wishlistCount = state.wishlist?.items?.length || 0;
  
  // AI Personalized Content
  const personalizedProducts = actions.getPersonalizedRecommendations(state.user.id, 6);
  const trendingProducts = actions.getTrendingProducts(null, "saudi", 6);
  const recentlyViewed = actions.getRecentlyViewedProducts(state.user.id, 4);
  const priceDrops = actions.getPriceDropAlerts(state.user.id);
  const recommendedCreators = actions.getCreatorRecommendations(state.user.id, 3);
  const personalizedFeed = actions.getPersonalizedFeed(state.user.id, 3);
  
  // Track page view
  actions.trackUserInteraction('page_view', { page: 'home' });

  // Make functions globally available
  window.trackRecommendationClick = (productId, reason) => {
    actions.trackUserInteraction('recommendation_click', { productId, reason });
  };
  
  window.refreshRecommendations = () => {
    location.reload();
  };

  el.innerHTML = h(`
    <div style="padding: 20px;">
      <!-- Welcome Header -->
      <div style="margin-bottom: 32px;">
        <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">
          ${t("welcome_back") || "مرحباً بعودتك"} ${state.user.name || ""}! 👋
        </h1>
        <p style="color: var(--text-muted); font-size: 16px; margin: 0;">
          ${t("home_subtitle") || "اكتشف منتجات جديدة ومثيرة اليوم"}
        </p>
      </div>

      <!-- Quick Stats -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 32px;">
        <div style="background: linear-gradient(135deg, #ff6b6b, #ff8e8e); color: white; padding: 20px; border-radius: 12px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold;">${state.cart?.length || 0}</div>
          <div style="opacity: 0.9; font-size: 14px;">${t("cart_items") || "في السلة"}</div>
        </div>
        <div style="background: linear-gradient(135deg, #4ecdc4, #6bcf7f); color: white; padding: 20px; border-radius: 12px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold;">${wishlistCount}</div>
          <div style="opacity: 0.9; font-size: 14px;">${t("wishlist_items") || "في المفضلة"}</div>
        </div>
        <div style="background: linear-gradient(135deg, #a8e6cf, #7fcdcd); color: white; padding: 20px; border-radius: 12px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold;">${state.orders?.length || 0}</div>
          <div style="opacity: 0.9; font-size: 14px;">${t("total_orders") || "إجمالي الطلبات"}</div>
        </div>
      </div>

      <!-- Price Drop Alerts -->
      ${priceDrops.length > 0 ? `
        <div style="background: linear-gradient(135deg, #ffd700, #ffed4e); border-radius: 12px; padding: 20px; margin-bottom: 32px;">
          <h3 style="margin: 0 0 16px; display: flex; align-items: center; gap: 8px;">
            ⚡ ${t("price_dropped")} 
            <span style="font-size: 14px; background: rgba(255,255,255,0.3); padding: 4px 8px; border-radius: 12px;">
              ${priceDrops.length} ${t("items")}
            </span>
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
            ${priceDrops.slice(0, 3).map(product => `
              <div onclick="location.hash='#/pdp/${product.id}'; trackRecommendationClick('${product.id}', 'price_drop')" 
                   style="background: rgba(255,255,255,0.9); border-radius: 8px; padding: 12px; cursor: pointer;">
                <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${getProductTitle(product)}</div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-weight: bold; color: #ff4757;">${fmtSAR(product.price)}</span>
                  <span style="text-decoration: line-through; font-size: 12px; color: #666;">${fmtSAR(product.originalPrice)}</span>
                  <span style="background: #ff4757; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">
                    -${product.discount}%
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Personalized For You -->
      ${personalizedProducts.length > 0 ? `
        <div style="margin-bottom: 32px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 style="font-size: 20px; font-weight: 600; margin: 0; display: flex; align-items: center; gap: 8px;">
              🤖 ${t("for_you_feed")}
              <span style="background: var(--primary); color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px;">
                ${t("ai_curated")}
              </span>
            </h2>
            <button onclick="refreshRecommendations()" style="color: var(--brand); background: none; border: none; cursor: pointer; font-size: 14px;">
              🔄 ${t("refresh_recommendations")}
            </button>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
            ${personalizedProducts.map(product => `
              <div onclick="location.hash='#/pdp/${product.id}'; trackRecommendationClick('${product.id}', 'personalized')" 
                   style="background: var(--card); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.3s ease; position: relative;">
                <div style="position: absolute; top: 8px; left: 8px; background: var(--primary); color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; z-index: 1;">
                  ${Math.round(product.personalizedScore)}% ${t("match") || "مطابقة"}
                </div>
                <img src="${uns(product.imageId, 300)}" alt="${getProductTitle(product)}" style="width: 100%; height: 180px; object-fit: cover;" loading="lazy">
                <div style="padding: 12px;">
                  <h4 style="margin: 0 0 8px; font-size: 14px; font-weight: 600; line-height: 1.3;">${getProductTitle(product)}</h4>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: bold; color: var(--primary);">${fmtSAR(product.price)}</span>
                    <span style="font-size: 12px; color: var(--text-muted);">${t("by_creator")} @${creatorById(product.creatorId)?.name}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Trending Now -->
      ${trendingProducts.length > 0 ? `
        <div style="margin-bottom: 32px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 style="font-size: 20px; font-weight: 600; margin: 0; display: flex; align-items: center; gap: 8px;">
              📈 ${t("trending_now")}
              <span style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4); color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px;">
                ${t("popular_in_saudi")}
              </span>
            </h2>
            <button onclick="location.hash='#/discover'" style="color: var(--brand); background: none; border: none; cursor: pointer; font-size: 14px;">
              ${t("view_all") || "عرض الكل"} →
            </button>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
            ${trendingProducts.map((product, index) => `
              <div onclick="location.hash='#/pdp/${product.id}'; trackRecommendationClick('${product.id}', 'trending')" 
                   style="background: var(--card); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.3s ease; position: relative;">
                <div style="position: absolute; top: 8px; left: 8px; background: linear-gradient(45deg, #ff6b6b, #4ecdc4); color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; z-index: 1;">
                  #${index + 1} ${t("trending")}
                </div>
                <img src="${uns(product.imageId, 300)}" alt="${getProductTitle(product)}" style="width: 100%; height: 180px; object-fit: cover;" loading="lazy">
                <div style="padding: 12px;">
                  <h4 style="margin: 0 0 8px; font-size: 14px; font-weight: 600; line-height: 1.3;">${getProductTitle(product)}</h4>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-weight: bold; color: var(--primary);">${fmtSAR(product.price)}</span>
                    <span style="font-size: 12px; color: var(--text-muted);">${t("by_creator")} @${creatorById(product.creatorId)?.name}</span>
                  </div>
                  <div style="font-size: 11px; color: var(--success);">
                    🔥 ${Math.round(product.trendingScore)} ${t("engagement_points") || "نقاط التفاعل"}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Recently Viewed -->
      ${recentlyViewed.length > 0 ? `
        <div style="margin-bottom: 32px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 style="font-size: 20px; font-weight: 600; margin: 0;">${t("recently_viewed")}</h2>
            <button onclick="location.hash='#/profile'" style="color: var(--brand); background: none; border: none; cursor: pointer; font-size: 14px;">
              ${t("view_all") || "عرض الكل"} →
            </button>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
            ${recentlyViewed.map(product => `
              <div onclick="location.hash='#/pdp/${product.id}'; trackRecommendationClick('${product.id}', 'recently_viewed')" 
                   style="background: var(--card); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.3s ease;">
                <img src="${uns(product.imageId, 300)}" alt="${getProductTitle(product)}" style="width: 100%; height: 180px; object-fit: cover;" loading="lazy">
                <div style="padding: 12px;">
                  <h4 style="margin: 0 0 8px; font-size: 14px; font-weight: 600; line-height: 1.3;">${getProductTitle(product)}</h4>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: bold; color: var(--primary);">${fmtSAR(product.price)}</span>
                    <span style="font-size: 12px; color: var(--text-muted);">${formatTimeAgo(product.viewedAt)}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Recommended Creators -->
      ${recommendedCreators.length > 0 ? `
        <div style="margin-bottom: 32px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 style="font-size: 20px; font-weight: 600; margin: 0;">${t("recommended_creators")}</h2>
            <button onclick="location.hash='#/discover'" style="color: var(--brand); background: none; border: none; cursor: pointer; font-size: 14px;">
              ${t("discover_more")} →
            </button>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
            ${recommendedCreators.map(creator => `
              <div onclick="location.hash='#/creator/${creator.id}'" 
                   style="background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 16px; cursor: pointer; transition: all 0.3s ease;">
                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                  <img src="${creator.avatar}" alt="${creator.name}" style="width: 48px; height: 48px; border-radius: 50%; margin-right: 12px;" loading="lazy">
                  <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 2px;">${creator.name}</div>
                    <div style="font-size: 12px; color: var(--text-muted);">${creator.handle}</div>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-size: 10px; background: var(--primary); color: white; padding: 2px 6px; border-radius: 4px;">
                      ${Math.round(creator.recommendationScore)}% ${t("match")}
                    </div>
                  </div>
                </div>
                <p style="font-size: 12px; color: var(--text-muted); margin: 0 0 8px; line-height: 1.4;">${creator.bio}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: var(--text-muted);">
                  <span>${formatNumber(creator.followers)} ${t("followers")}</span>
                  <span>${creator.engagement}% ${t("engagement")}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Personalized Social Feed -->
      ${personalizedFeed.length > 0 ? `
        <div style="margin-bottom: 32px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 style="font-size: 20px; font-weight: 600; margin: 0;">${t("for_you_feed")} 📱</h2>
            <button onclick="location.hash='#/social'" style="color: var(--brand); background: none; border: none; cursor: pointer; font-size: 14px;">
              ${t("view_all")} →
            </button>
          </div>
          <div style="display: grid; gap: 16px;">
            ${personalizedFeed.map(post => `
              <div onclick="location.hash='#/social'" class="social-preview" style="background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 16px; cursor: pointer; transition: all 0.3s ease; position: relative;">
                <div style="position: absolute; top: 8px; right: 8px; background: var(--primary); color: white; padding: 2px 6px; border-radius: 4px; font-size: 9px;">
                  ${Math.round(post.personalizedScore)}% ${t("relevance") || "صلة"}
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                  <img src="${post.avatar}" alt="${post.username}" style="width: 32px; height: 32px; border-radius: 50%; margin-right: 8px;" loading="lazy">
                  <div>
                    <div style="font-weight: 600; font-size: 14px;">${post.username}</div>
                    <div style="color: var(--text-muted); font-size: 12px;">${formatTimeAgo(post.timestamp)}</div>
                  </div>
                  ${post.isCreator ? '<span style="color: var(--brand); margin-left: auto;">✓</span>' : ''}
                </div>
                <p style="margin: 0 0 8px; font-size: 14px; line-height: 1.4; color: var(--text);">${post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content}</p>
                <div style="display: flex; align-items: center; gap: 16px; color: var(--text-muted); font-size: 12px;">
                  <span>❤️ ${post.likes}</span>
                  <span>💬 ${post.comments}</span>
                  <span>📤 ${post.shares}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Quick Actions -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px;">
        <button onclick="location.hash='#/discover'" style="padding: 20px; background: var(--card); border: 1px solid var(--border); border-radius: 12px; cursor: pointer; text-align: center; transition: all 0.3s ease;">
          <div style="font-size: 32px; margin-bottom: 8px;">🔍</div>
          <div style="font-weight: 600; margin-bottom: 4px;">${t("discover_products") || "اكتشف المنتجات"}</div>
          <div style="font-size: 12px; color: var(--text-muted);">${t("browse_collections") || "تصفح المجموعات"}</div>
        </button>
        <button onclick="location.hash='#/wishlist'" style="padding: 20px; background: var(--card); border: 1px solid var(--border); border-radius: 12px; cursor: pointer; text-align: center; transition: all 0.3s ease;">
          <div style="font-size: 32px; margin-bottom: 8px;">❤️</div>
          <div style="font-weight: 600; margin-bottom: 4px;">${t("my_wishlist") || "قائمة أمنياتي"}</div>
          <div style="font-size: 12px; color: var(--text-muted);">${wishlistCount} ${t("saved_items") || "عنصر محفوظ"}</div>
        </button>
        <button onclick="location.hash='#/cart'" style="padding: 20px; background: var(--card); border: 1px solid var(--border); border-radius: 12px; cursor: pointer; text-align: center; transition: all 0.3s ease;">
          <div style="font-size: 32px; margin-bottom: 8px;">🛒</div>
          <div style="font-weight: 600; margin-bottom: 4px;">${t("shopping_cart") || "سلة التسوق"}</div>
          <div style="font-size: 12px; color: var(--text-muted);">${state.cart?.length || 0} ${t("items") || "عنصر"}</div>
        </button>
      </div>
    </div>
  `);
};

function setupHomeFunctionality() {
  // Global functions for home page interactions
  window.searchByCategoryFromHome = (categoryId) => {
    const category = state.search.categories.find(c => c.id === categoryId);
    if (category) {
      actions.performSearch("", { category: [getProductField(category, "name")] });
      location.hash = '#/discover';
    }
  };
}

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
            ${searchResults.map(product => renderDiscoverProductCard(product)).join('')}
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

const pdp = ({ el, state, actions }, id) => {
  // Ensure we have a valid id
  if (!id) {
    el.innerHTML = h(`
      <div style="padding: 20px; text-align: center;">
        <h2>${t("product_not_found") || "Product not found"}</h2>
        <p>${t("invalid_product_id") || "Invalid product ID"}</p>
        <button onclick="location.hash='#/home'" class="primary">
          ${t("back_to_home") || "Back to Home"}
        </button>
      </div>
    `);
    return;
  }

  const product = productById(id);
  if (!product) {
    el.innerHTML = h(`
      <div style="padding: 20px; text-align: center;">
        <h2>${t("product_not_found") || "Product not found"}</h2>
        <p>${t("product_id_not_found") || `Product with ID "${id}" not found`}</p>
        <button onclick="location.hash='#/home'" class="primary">
          ${t("back_to_home") || "Back to Home"}
        </button>
      </div>
    `);
    return;
  }

  // Track product view
  actions.trackUserInteraction('product_view', { productId: id });
  actions.addToRecentlyViewed(id);

  // Get enhanced product data
  const reviewStats = actions.getReviewStats(id);
  const filteredReviews = actions.getFilteredReviews(id);
  const variants = actions.getProductVariants(id);
  const sizeGuide = actions.getProductSizeGuide(id);
  const shippingInfo = actions.getShippingInfo(id);
  const similarProducts = actions.getSimilarProducts(id, 4);
  const recommendationReason = actions.getProductRecommendationReason(id);
  
  // State for variant selection
  let selectedVariant = variants.length > 0 ? variants[0] : null;
  let selectedColor = null;
  let selectedSize = null;
  
  // Available options
  const availableColors = actions.getAvailableColors(id);
  const availableSizes = actions.getAvailableSizes(id);

  // Make functions globally available
  window.selectVariant = (variantId) => {
    selectedVariant = actions.selectProductVariant(id, variantId);
    updateProductDisplay();
  };
  
  window.selectColor = (color) => {
    selectedColor = color;
    updateAvailableSizes();
  };
  
  window.selectSize = (size) => {
    selectedSize = size;
    updateAvailableColors();
  };
  
  window.startAR = (feature) => {
    const result = actions.startARSession(id, feature);
    if (result.success) {
      showARInterface(result.sessionId, result.capabilities);
    } else {
      alert(result.message || t("ar_not_supported"));
    }
  };
  
  window.showSizeGuide = () => {
    if (sizeGuide) {
      showSheet({
        title: t("size_guide"),
        content: renderSizeGuide(sizeGuide)
      });
    }
  };
  
  window.showShippingInfo = () => {
    showSheet({
      title: t("shipping_info"),
      content: renderShippingDetails(shippingInfo)
    });
  };
  
  window.compareProduct = (productId) => {
    // Add to comparison (implement comparison logic)
    alert(t("added_to_comparison") || "Added to comparison!");
  };

  el.innerHTML = h(`
    <div style="padding: 20px; max-width: 1200px; margin: 0 auto;">
      <!-- Back Button -->
      <button onclick="history.back()" class="secondary" style="margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
        <span>←</span>
        <span>${t("back") || "Back"}</span>
      </button>

      <!-- Recommendation Reason -->
      ${recommendationReason ? `
        <div style="background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; padding: 12px 20px; border-radius: 8px; margin-bottom: 20px; font-size: 14px;">
          🎯 ${recommendationReason.text}
        </div>
      ` : ''}

      <!-- Product Details Section -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px;" class="product-detail-grid">
        
        <!-- Product Images -->
        <div>
          <div class="product-images">
            <img src="${getProductImage(product, 600)}" alt="${getProductTitle(product)}" 
                 style="width: 100%; border-radius: 12px; margin-bottom: 16px;" class="main-image" id="mainProductImage">
            
            <!-- Image Gallery -->
            ${selectedVariant?.images ? `
              <div style="display: flex; gap: 8px; margin-top: 16px;">
                ${selectedVariant.images.map(imgId => `
                  <img src="${uns(imgId, 150)}" alt="Product variant" 
                       style="width: 80px; height: 80px; border-radius: 8px; cursor: pointer; border: 2px solid transparent;" 
                       onclick="document.getElementById('mainProductImage').src='${uns(imgId, 600)}'">
                `).join('')}
              </div>
            ` : ''}
          </div>

          <!-- AR Features -->
          ${product.arSupported ? `
            <div style="margin-top: 20px; padding: 16px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 12px; color: white;">
              <h4 style="margin: 0 0 12px; display: flex; align-items: center; gap: 8px;">
                📱 ${t("try_with_ar")}
              </h4>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                ${product.arFeatures.includes('virtual_try_on') ? `
                  <button onclick="startAR('virtual_try_on')" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 12px;">
                    ${t("virtual_try_on")}
                  </button>
                ` : ''}
                ${product.arFeatures.includes('placement_preview') ? `
                  <button onclick="startAR('placement_preview')" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 12px;">
                    ${t("see_in_your_space")}
                  </button>
                ` : ''}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Product Info -->
        <div class="product-info">
          <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 16px; line-height: 1.2;">
            ${getProductTitle(product)}
          </h1>
          
          <!-- Rating Summary -->
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 4px;">
              <span style="color: #ffa500; font-size: 18px;">${stars(reviewStats.averageRating)}</span>
              <span style="font-weight: 600; font-size: 16px;">${reviewStats.averageRating}</span>
              <span style="color: var(--text-muted); font-size: 14px;">(${reviewStats.totalReviews} ${t("reviews") || "reviews"})</span>
            </div>
            ${reviewStats.verifiedCount > 0 ? `<span style="background: var(--success); color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">✓ ${reviewStats.verifiedCount} ${t("verified") || "verified"}</span>` : ''}
          </div>

          <!-- Price -->
          <div style="margin: 20px 0;">
            <span style="font-size: 32px; font-weight: 700; color: var(--primary);" id="currentPrice">
              ${fmtSAR(selectedVariant?.price || product.price)}
            </span>
            ${product.listPrice ? `
              <span style="font-size: 18px; color: var(--text-muted); text-decoration: line-through; margin-left: 12px;">
                ${fmtSAR(product.listPrice)}
              </span>
            ` : ''}
          </div>

          <!-- Product Description -->
          <div style="margin: 24px 0;">
            <p style="color: var(--text-muted); line-height: 1.6; font-size: 16px;">
              ${loc(product, "description") || t("no_description")}
            </p>
          </div>

          <!-- Color Selection -->
          ${availableColors.length > 0 ? `
            <div style="margin: 24px 0;">
              <h4 style="margin-bottom: 12px; font-weight: 600;">${t("select_color")}</h4>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                ${availableColors.map(colorOption => `
                  <button onclick="selectColor('${colorOption.color}')" 
                          style="padding: 8px 16px; border: 2px solid ${selectedColor === colorOption.color ? 'var(--primary)' : 'var(--border)'}; 
                                 border-radius: 8px; background: var(--card); cursor: pointer; font-size: 14px;
                                 ${!colorOption.available ? 'opacity: 0.5; cursor: not-allowed;' : ''}"
                          ${!colorOption.available ? 'disabled' : ''}>
                    ${colorOption.color}
                    ${!colorOption.available ? ` (${t("unavailable")})` : ''}
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Size Selection -->
          ${availableSizes.length > 0 ? `
            <div style="margin: 24px 0;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h4 style="margin: 0; font-weight: 600;">${t("select_size")}</h4>
                ${sizeGuide ? `
                  <button onclick="showSizeGuide()" style="background: none; border: none; color: var(--primary); cursor: pointer; font-size: 14px; text-decoration: underline;">
                    ${t("size_guide")}
                  </button>
                ` : ''}
              </div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                ${availableSizes.map(sizeOption => `
                  <button onclick="selectSize('${sizeOption.size}')" 
                          style="padding: 12px 16px; border: 2px solid ${selectedSize === sizeOption.size ? 'var(--primary)' : 'var(--border)'}; 
                                 border-radius: 8px; background: var(--card); cursor: pointer; font-weight: 600;
                                 ${!sizeOption.available ? 'opacity: 0.5; cursor: not-allowed;' : ''}"
                          ${!sizeOption.available ? 'disabled' : ''}>
                    ${sizeOption.size}
                    ${!sizeOption.available ? `<br><span style="font-size: 10px;">${t("unavailable")}</span>` : ''}
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Action Buttons -->
          <div style="display: flex; gap: 12px; margin: 32px 0;">
            <button onclick="window.addToCart?.('${product.id}')" class="primary large" style="flex: 1;">
              <span style="margin-right: 8px;">🛒</span>
              ${t("add_to_cart") || "Add to Cart"}
            </button>
            <button onclick="toggleWishlist('${product.id}')" class="secondary" style="padding: 16px; aspect-ratio: 1;">
              ❤️
            </button>
            <button onclick="compareProduct('${product.id}')" class="secondary" style="padding: 16px; aspect-ratio: 1;">
              ⚖️
            </button>
          </div>

          <!-- Product Features -->
          <div style="margin: 24px 0; padding: 20px; background: var(--card); border-radius: 12px;">
            <h4 style="margin-bottom: 12px; font-weight: 600;">${t("product_features") || "Product Features"}</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
              ${shippingInfo.freeShipping ? `
                <li style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <span style="color: var(--success);">✓</span>
                  <span style="font-size: 14px;">${t("free_shipping")}</span>
                </li>
              ` : ''}
              ${shippingInfo.sameDayAvailable ? `
                <li style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <span style="color: var(--success);">⚡</span>
                  <span style="font-size: 14px;">${t("same_day_delivery")}</span>
                </li>
              ` : ''}
              <li style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <span style="color: var(--success);">✓</span>
                <span style="font-size: 14px;">${t("easy_returns")}</span>
              </li>
              ${product.warranty ? `
                <li style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <span style="color: var(--success);">🛡️</span>
                  <span style="font-size: 14px;">${t("warranty_included")} (${product.warranty.duration})</span>
                </li>
              ` : ''}
              ${product.sustainability?.ecoFriendly ? `
                <li style="display: flex; align-items: center; gap: 8px;">
                  <span style="color: var(--success);">🌱</span>
                  <span style="font-size: 14px;">${t("eco_friendly")}</span>
                </li>
              ` : ''}
            </ul>
            
            <button onclick="showShippingInfo()" style="margin-top: 12px; background: none; border: 1px solid var(--border); padding: 8px 16px; border-radius: 6px; cursor: pointer; width: 100%; color: var(--text);">
              ${t("shipping_info")} & ${t("return_policy")}
            </button>
          </div>
        </div>
      </div>

      <!-- Specifications -->
      ${product.specifications ? `
        <div class="specifications-section" style="margin: 40px 0; padding: 24px; background: var(--card); border-radius: 12px;">
          <h3 style="margin-bottom: 20px; font-weight: 600;">${t("specifications")}</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
            ${Object.entries(product.specifications).map(([key, value]) => `
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border);">
                <span style="font-weight: 500; text-transform: capitalize;">${key.replace('_', ' ')}:</span>
                <span style="color: var(--text-muted);">${loc(value) || value}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Similar Products -->
      ${similarProducts.length > 0 ? `
        <div class="similar-products" style="margin: 40px 0;">
          <h3 style="margin-bottom: 20px; font-weight: 600;">${t("similar_products")}</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
            ${similarProducts.map(similar => `
              <div onclick="location.hash='#/pdp/${similar.id}'" style="background: var(--card); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.3s ease;">
                <img src="${getProductImage(similar, 300)}" alt="${getProductTitle(similar)}" style="width: 100%; height: 150px; object-fit: cover;">
                <div style="padding: 12px;">
                  <h4 style="margin: 0 0 8px; font-size: 14px; font-weight: 600;">${getProductTitle(similar)}</h4>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: bold; color: var(--primary);">${fmtSAR(similar.price)}</span>
                    <span style="font-size: 12px; color: var(--success);">${Math.round(similar.similarityScore)}% ${t("match")}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Reviews Section -->
      <div class="reviews-section" style="border-top: 1px solid var(--border); padding-top: 40px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
          <h2 style="font-size: 24px; font-weight: 700;">${t("customer_reviews") || "Customer Reviews"}</h2>
          <button onclick="showReviewForm('${id}')" class="secondary">
            <span style="margin-right: 8px;">✍️</span>
            ${t("write_review") || "Write a Review"}
          </button>
        </div>

        <!-- Review Statistics -->
        <div class="review-stats" style="display: grid; grid-template-columns: 1fr 2fr; gap: 32px; margin-bottom: 32px; padding: 24px; background: var(--card); border-radius: 12px;">
          <div style="text-align: center;">
            <div style="font-size: 48px; font-weight: 700; color: var(--primary); margin-bottom: 8px;">
              ${reviewStats.averageRating}
            </div>
            <div style="color: #ffa500; font-size: 24px; margin-bottom: 8px;">
              ${stars(reviewStats.averageRating)}
            </div>
            <div style="color: var(--text-muted); font-size: 14px;">
              ${t("based_on_reviews").replace("{n}", reviewStats.totalReviews) || `Based on ${reviewStats.totalReviews} reviews`}
            </div>
            ${product.socialProof ? `
              <div style="margin-top: 16px; font-size: 12px; color: var(--text-muted);">
                ${product.socialProof.recommendationRate}% ${t("recommendation_rate")}
              </div>
            ` : ''}
          </div>
          
          <!-- Rating Breakdown -->
          <div>
            ${[5,4,3,2,1].map(rating => {
              const count = reviewStats.ratingBreakdown[rating] || 0;
              const percentage = reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0;
              return `
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                  <span style="font-size: 14px; width: 60px;">${rating} ${t("stars")}</span>
                  <div style="flex: 1; height: 8px; background: var(--border); border-radius: 4px; overflow: hidden;">
                    <div style="width: ${percentage}%; height: 100%; background: #ffa500; transition: width 0.3s ease;"></div>
                  </div>
                  <span style="font-size: 14px; color: var(--text-muted); width: 40px;">${count}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Individual Reviews -->
        <div class="reviews-list">
          ${filteredReviews.slice(0, 3).map(review => `
            <div style="border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                <div>
                  <div style="font-weight: 600; margin-bottom: 4px;">${review.userName}</div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: #ffa500;">${stars(review.rating)}</span>
                    <span style="color: var(--text-muted); font-size: 14px;">${formatTimeAgo(review.timestamp)}</span>
                    ${review.verified ? `<span style="background: var(--success); color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">${t("verified")}</span>` : ''}
                  </div>
                </div>
              </div>
              <p style="margin: 0; line-height: 1.5; color: var(--text);">${review.comment}</p>
              ${review.helpful > 0 ? `
                <div style="margin-top: 12px; font-size: 12px; color: var(--text-muted);">
                  👍 ${review.helpful} ${t("found_helpful") || "found this helpful"}
                </div>
              ` : ''}
            </div>
          `).join('')}
          
          ${filteredReviews.length > 3 ? `
            <button onclick="location.hash='#/reviews/${id}'" style="background: none; border: 1px solid var(--border); padding: 12px 24px; border-radius: 8px; cursor: pointer; width: 100%; margin-top: 16px;">
              ${t("view_all_reviews") || "View All Reviews"} (${filteredReviews.length})
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `);

  // Helper functions
  function updateProductDisplay() {
    if (selectedVariant) {
      document.getElementById('currentPrice').textContent = fmtSAR(selectedVariant.price);
      document.getElementById('mainProductImage').src = uns(selectedVariant.images[0], 600);
    }
  }
  
  function updateAvailableSizes() {
    // Update available sizes based on selected color
  }
  
  function updateAvailableColors() {
    // Update available colors based on selected size
  }
  
  function showARInterface(sessionId, capabilities) {
    showSheet({
      title: t("ar_experience"),
      content: `
        <div style="text-align: center; padding: 20px;">
          <div style="font-size: 48px; margin: 20px 0;">📱</div>
          <h3>${t("ar_experience")}</h3>
          <p>${t("ar_loading") || "Loading AR experience..."}</p>
          <div style="margin: 20px 0;">
            ${capabilities.map(cap => `
              <div style="background: var(--primary); color: white; padding: 8px 16px; border-radius: 6px; margin: 4px; display: inline-block;">
                ${t(cap) || cap.replace('_', ' ')}
              </div>
            `).join('')}
          </div>
          <button onclick="closeSheet(); actions.endARSession('${sessionId}')" class="primary">
            ${t("close") || "Close"}
          </button>
        </div>
      `
    });
  }
  
  function renderSizeGuide(guide) {
    return `
      <div style="padding: 20px;">
        <div style="margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: var(--card);">
                <th style="padding: 12px; border: 1px solid var(--border); text-align: left;">${t("size")}</th>
                ${Object.keys(guide.sizes[0]).filter(k => k !== 'size').map(key => `
                  <th style="padding: 12px; border: 1px solid var(--border); text-align: left;">${key.replace('_', ' ')}</th>
                `).join('')}
              </tr>
            </thead>
            <tbody>
              ${guide.sizes.map(size => `
                <tr>
                  <td style="padding: 12px; border: 1px solid var(--border); font-weight: 600;">${size.size}</td>
                  ${Object.entries(size).filter(([k]) => k !== 'size').map(([k, v]) => `
                    <td style="padding: 12px; border: 1px solid var(--border);">${v}</td>
                  `).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ${guide.fitAdvice ? `
          <div style="background: var(--card); padding: 16px; border-radius: 8px; margin-top: 16px;">
            <h4 style="margin: 0 0 8px;">${t("fit_advice") || "Fit Advice"}</h4>
            <p style="margin: 0; color: var(--text-muted);">${loc(guide.fitAdvice)}</p>
          </div>
        ` : ''}
      </div>
    `;
  }
  
  function renderShippingDetails(shipping) {
    return `
      <div style="padding: 20px;">
        <h3 style="margin: 0 0 16px;">${t("delivery_options")}</h3>
        <div style="margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border);">
            <span>${t("standard_shipping")}</span>
            <span>${shipping.freeShipping ? t("free") : fmtSAR(shipping.cost || 25)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border);">
            <span>${t("estimated_delivery")}</span>
            <span>${shipping.estimatedDays} ${t("days")}</span>
          </div>
          ${shipping.sameDayAvailable ? `
            <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border);">
              <span>${t("same_day_delivery")}</span>
              <span>${fmtSAR(shipping.sameDayCost || 15)}</span>
            </div>
          ` : ''}
        </div>
        
        <h3 style="margin: 20px 0 16px 0;">${t("return_policy")}</h3>
        <ul style="list-style: none; padding: 0;">
          <li style="padding: 8px 0; display: flex; align-items: center; gap: 8px;">
            <span style="color: var(--success);">✓</span>
            <span>30-day return window</span>
          </li>
          <li style="padding: 8px 0; display: flex; align-items: center; gap: 8px;">
            <span style="color: var(--success);">✓</span>
            <span>Free return shipping</span>
          </li>
          <li style="padding: 8px 0; display: flex; align-items: center; gap: 8px;">
            <span style="color: var(--success);">✓</span>
            <span>Full refund guarantee</span>
          </li>
        </ul>
      </div>
    `;
  }
};

const checkout = ({ el, state, actions }) => {
  const cartItems = state.cart || [];
  const total = cartTotal();
  const paymentMethods = state.cartEnhancements.savedPaymentMethods || [];
  const selectedPayment = state.cartEnhancements.selectedPayment;
  
  // Make payment functions globally available
  window.selectPayment = (methodId) => {
    actions.selectPaymentMethod(methodId);
    setTimeout(() => location.reload(), 100);
  };
  
  window.processCheckout = () => {
    if (!selectedPayment) {
      alert(t("select_payment") || "Please select a payment method");
      return;
    }
    
    const result = actions.processPayment(selectedPayment, total, {
      name: "Maya Ahmad",
      address: "Al Olaya, Riyadh, Saudi Arabia"
    });
    
    if (result.success) {
      window.__showSheet(`
        <div class="row between">
          <strong>${t("payment_successful") || "Payment Successful!"}</strong>
          <button class="small ghost" type="button" aria-label="Close" onclick="window.__hideSheet?.()">✕</button>
        </div>
        <div style="text-align: center; padding: 20px;">
          <div style="font-size: 48px; color: var(--success); margin: 20px 0;">✅</div>
          <h3>${t("payment_successful")}</h3>
          <p>${t("transaction_id")}: ${result.transactionId}</p>
          <p>${t("total_amount")}: ${fmtSAR(result.total)}</p>
          <div class="row" style="gap:8px; justify-content: center; margin-top: 20px;">
            <button onclick="window.__hideSheet?.(); location.hash='#/orders'" class="primary">
              ${t("view_orders") || "View Orders"}
            </button>
            <button onclick="window.__hideSheet?.(); location.hash='#/home'" class="secondary">
              ${t("continue_shopping") || "Continue Shopping"}  
            </button>
          </div>
        </div>
      `);
    } else {
      alert(result.error || t("payment_failed"));
    }
  };
  
  window.addNewPaymentMethod = () => {
    showSheet({
      title: t("add_payment_method"),
      content: `
        <div style="padding: 20px;">
          <h3>Credit/Debit Card</h3>
          <form onsubmit="handleAddCard(event)">
            <input type="text" placeholder="${t("card_number")}" required style="width: 100%; margin: 10px 0; padding: 12px;">
            <div style="display: flex; gap: 10px;">
              <input type="text" placeholder="${t("expiry_date")} (MM/YY)" required style="flex: 1; padding: 12px;">
              <input type="text" placeholder="${t("cvv")}" required style="flex: 1; padding: 12px;">
            </div>
            <input type="text" placeholder="${t("cardholder_name")}" required style="width: 100%; margin: 10px 0; padding: 12px;">
            <button type="submit" class="primary" style="width: 100%; margin-top: 20px;">
              ${t("add_payment_method")}
            </button>
          </form>
        </div>
      `
    });
  };
  
  window.handleAddCard = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    // Simulate adding card
    closeSheet();
    alert(t("payment_method_added") || "Payment method added successfully!");
  };

  el.innerHTML = h(`
    <div style="padding: 20px; max-width: 600px; margin: 0 auto;">
      <h1>${t("checkout") || "Checkout"}</h1>
      
      <!-- Order Summary -->
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
      </div>

      ${cartItems.length > 0 ? `
      <!-- Payment Methods -->
      <div style="margin: 30px 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3>${t("payment_methods")}</h3>
          <button onclick="addNewPaymentMethod()" style="background: none; border: 1px solid var(--primary); color: var(--primary); padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            + ${t("add_payment_method")}
          </button>
        </div>
        
        <!-- Saudi Payment Methods (Priority) -->
        <div style="margin-bottom: 25px;">
          <h4 style="color: var(--text-secondary); font-size: 14px; margin-bottom: 15px; display: flex; align-items: center;">
            🇸🇦 ${t("local_payment_methods") || "Saudi Payment Methods"}
          </h4>
          <div style="display: grid; gap: 12px;">
            ${paymentMethods.filter(method => method.isLocal).map(method => `
              <div onclick="selectPayment('${method.id}')" 
                   style="border: 2px solid ${selectedPayment === method.id ? 'var(--primary)' : 'var(--border)'}; 
                          border-radius: 12px; padding: 16px; cursor: pointer; transition: all 0.2s;
                          background: ${selectedPayment === method.id ? 'var(--primary-light)' : 'var(--bg-secondary)'};">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 24px;">${method.icon || '💳'}</span>
                    <div>
                      <div style="font-weight: 600;">${method.name}</div>
                      <div style="font-size: 12px; color: var(--text-secondary);">${method.description || ''}</div>
                    </div>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-size: 12px; color: var(--success);">${method.fee || '0%'}</div>
                    ${method.isDefault ? `<div style="font-size: 10px; color: var(--primary);">${t("default_payment")}</div>` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- International Payment Methods -->
        <div style="margin-bottom: 25px;">
          <h4 style="color: var(--text-secondary); font-size: 14px; margin-bottom: 15px;">
            🌍 ${t("international_methods") || "International Methods"}
          </h4>
          <div style="display: grid; gap: 12px;">
            ${paymentMethods.filter(method => !method.isLocal).map(method => `
              <div onclick="selectPayment('${method.id}')" 
                   style="border: 2px solid ${selectedPayment === method.id ? 'var(--primary)' : 'var(--border)'}; 
                          border-radius: 12px; padding: 16px; cursor: pointer; transition: all 0.2s;
                          background: ${selectedPayment === method.id ? 'var(--primary-light)' : 'var(--bg-secondary)'};">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 24px;">${method.icon || '💳'}</span>
                    <div>
                      <div style="font-weight: 600;">${method.name}</div>
                      ${method.type === 'bnpl' ? `
                        <div style="font-size: 12px; color: var(--text-secondary);">
                          ${method.installments} ${t("installments") || "installments"} • ${method.fee || '0%'}
                        </div>
                      ` : `
                        <div style="font-size: 12px; color: var(--text-secondary);">${method.description || ''}</div>
                      `}
                    </div>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-size: 12px; color: var(--success);">${method.fee || '0%'}</div>
                    ${method.isDefault ? `<div style="font-size: 10px; color: var(--primary);">${t("default_payment")}</div>` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Payment Security Info -->
        <div style="background: var(--bg-secondary); border-radius: 8px; padding: 16px; margin: 20px 0;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <span style="font-size: 20px;">🔒</span>
            <h4 style="margin: 0;">${t("payment_security")}</h4>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px; font-size: 12px; color: var(--text-secondary);">
            <div>✅ ${t("secure_encryption")}</div>
            <div>✅ ${t("pci_compliant")}</div>
            <div>✅ ${t("fraud_protection")}</div>
            <div>✅ ${t("two_factor_auth")}</div>
          </div>
        </div>

        <!-- Place Order Button -->
        <button onclick="processCheckout()" class="primary large" 
                style="width: 100%; padding: 16px; font-size: 16px; margin-top: 20px;
                       ${!selectedPayment ? 'opacity: 0.5; cursor: not-allowed;' : ''}"
                ${!selectedPayment ? 'disabled' : ''}>
          ${selectedPayment ? 
            `${t("pay_with") || "Pay with"} ${paymentMethods.find(m => m.id === selectedPayment)?.name || ''} • ${fmtSAR(total)}` : 
            t("select_payment") || "Select Payment Method"
          }
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
  const savedForLater = state.wishlist.saveForLater || [];
  const savedItems = savedForLater.map(id => productById(id)).filter(Boolean);
  
  // Update cart summary
  actions.updateCartSummary();
  const summary = state.cartEnhancements.cartSummary;
  
  // Make cart functions globally available
  window.updateCartQuantity = (productId, change) => {
    actions.updateQuantity(productId, change);
    setTimeout(() => location.reload(), 100);
  };
  
  window.removeFromCart = (productId) => {
    actions.removeFromCart(productId);
    setTimeout(() => location.reload(), 100);
  };
  
  window.moveToWishlist = (productId) => {
    actions.moveToWishlist(productId);
    setTimeout(() => location.reload(), 100);
  };
  
  window.saveForLater = (productId) => {
    actions.saveForLater(productId);
    setTimeout(() => location.reload(), 100);
  };
  
  window.moveBackToCart = (productId) => {
    actions.moveBackToCart(productId);
    setTimeout(() => location.reload(), 100);
  };
  
  window.applyPromo = () => {
    const code = document.getElementById('promoInput').value.trim();
    if (!code) return;
    
    const result = actions.applyPromoCode(code);
    const messageEl = document.getElementById('promoMessage');
    
    if (result.success) {
      messageEl.style.color = 'var(--ok)';
      messageEl.textContent = result.message;
      document.getElementById('promoInput').value = '';
      setTimeout(() => location.reload(), 1000);
    } else {
      messageEl.style.color = 'var(--bad)';
      messageEl.textContent = result.message;
    }
  };
  
  window.removePromo = () => {
    actions.removePromoCode();
    setTimeout(() => location.reload(), 100);
  };
  
  window.selectShipping = (optionId) => {
    actions.selectShippingOption(optionId);
    setTimeout(() => location.reload(), 100);
  };
  
  window.selectPayment = (methodId) => {
    actions.selectPaymentMethod(methodId);
    setTimeout(() => location.reload(), 100);
  };
  
  el.innerHTML = h(`
    <div style="padding: 20px; max-width: 800px; margin: 0 auto;">
      <h1>${t("cart") || "السلة"}</h1>
      
      ${cartItems.length === 0 ? `
        <!-- Empty Cart -->
        <div style="text-align: center; padding: 60px 20px;">
          <div style="font-size: 64px; margin-bottom: 16px; opacity: 0.6;">🛒</div>
          <h2 style="margin: 0 0 16px; color: var(--text-muted);">${t("cart_empty") || "سلتك فارغة"}</h2>
          <p style="margin: 0 0 24px; color: var(--text-muted);">${t("cart_empty_message")}</p>
          <button onclick="location.hash='#/home'" class="primary">${t("continue_shopping")}</button>
        </div>
        
        ${savedItems.length > 0 ? `
          <!-- Saved for Later -->
          <div style="margin-top: 40px;">
            <h3 style="margin-bottom: 20px;">${t("saved_for_later")} (${savedItems.length})</h3>
            <div style="display: grid; gap: 16px;">
              ${savedItems.map(product => `
                <div style="display: flex; align-items: center; gap: 16px; padding: 16px; background: var(--card); border: 1px solid var(--border); border-radius: 8px;">
                  <img src="${getProductImage(product, 80)}" alt="${getProductTitle(product)}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;">
                  <div style="flex: 1;">
                    <h4 style="margin: 0 0 4px; font-size: 16px;">${getProductTitle(product)}</h4>
                    <p style="margin: 0; color: var(--text-muted); font-size: 14px;">${fmtSAR(product.price)}</p>
                  </div>
                  <button onclick="moveBackToCart('${product.id}')" class="primary small">${t("move_back_to_cart")}</button>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      ` : `
        <!-- Cart Items -->
        <div style="display: grid; grid-template-columns: 1fr 400px; gap: 32px; margin-top: 24px;">
          <!-- Items List -->
          <div>
            <h2 style="margin: 0 0 20px;">${t("cart_items") || "عناصر السلة"} (${cartItems.length})</h2>
            
            <div style="display: grid; gap: 16px;">
              ${cartItems.map(item => {
                const product = productById(item.productId);
                if (!product) return '';
                
                return `
                  <div style="display: flex; gap: 16px; padding: 20px; background: var(--card); border: 1px solid var(--border); border-radius: 12px;">
                    <img src="${getProductImage(product, 120)}" alt="${getProductTitle(product)}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 8px;">
                    
                    <div style="flex: 1;">
                      <h3 style="margin: 0 0 8px; font-size: 18px;">${getProductTitle(product)}</h3>
                      <p style="margin: 0 0 12px; color: var(--text-muted); font-size: 14px;">${t("by_creator")} ${creatorName(product.creatorId)}</p>
                      <p style="margin: 0 0 16px; font-size: 16px; font-weight: 600; color: var(--brand);">${fmtSAR(product.price)}</p>
                      
                      <!-- Quantity Controls -->
                      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                        <span style="font-size: 14px; color: var(--text-muted);">${t("quantity")}:</span>
                        <div style="display: flex; align-items: center; border: 1px solid var(--border); border-radius: 6px;">
                          <button onclick="updateCartQuantity('${item.productId}', -1)" style="padding: 8px 12px; border: none; background: var(--card); cursor: pointer;" title="${t("decrease_quantity")}">−</button>
                          <span style="padding: 8px 16px; border-left: 1px solid var(--border); border-right: 1px solid var(--border);">${item.quantity}</span>
                          <button onclick="updateCartQuantity('${item.productId}', 1)" style="padding: 8px 12px; border: none; background: var(--card); cursor: pointer;" title="${t("increase_quantity")}">+</button>
                        </div>
                        <span style="margin-left: auto; font-weight: 600;">${fmtSAR(product.price * item.quantity)}</span>
                      </div>
                      
                      <!-- Item Actions -->
                      <div style="display: flex; gap: 12px;">
                        <button onclick="moveToWishlist('${item.productId}')" class="secondary small">${t("move_to_wishlist")}</button>
                        <button onclick="saveForLater('${item.productId}')" class="secondary small">${t("save_for_later")}</button>
                        <button onclick="removeFromCart('${item.productId}')" class="secondary small" style="color: var(--bad);">${t("remove")}</button>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
            
            ${savedItems.length > 0 ? `
              <!-- Saved for Later Section -->
              <div style="margin-top: 40px;">
                <h3 style="margin-bottom: 16px;">${t("saved_for_later")} (${savedItems.length})</h3>
                <div style="display: grid; gap: 12px;">
                  ${savedItems.map(product => `
                    <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--chip); border-radius: 8px;">
                      <img src="${getProductImage(product, 60)}" alt="${getProductTitle(product)}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
                      <div style="flex: 1;">
                        <p style="margin: 0 0 4px; font-weight: 500; font-size: 14px;">${getProductTitle(product)}</p>
                        <p style="margin: 0; color: var(--text-muted); font-size: 12px;">${fmtSAR(product.price)}</p>
                      </div>
                      <button onclick="moveBackToCart('${product.id}')" class="primary small">${t("move_back_to_cart")}</button>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
          
          <!-- Order Summary Sidebar -->
          <div style="position: sticky; top: 20px; height: fit-content;">
            <!-- Promo Code -->
            <div style="background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 12px;">${t("promo_code")}</h3>
              ${state.cartEnhancements.appliedPromoCode ? `
                <div style="display: flex; align-items: center; gap: 8px; padding: 8px; background: var(--ok); color: white; border-radius: 6px;">
                  <span style="flex: 1; font-size: 14px;">${state.cartEnhancements.appliedPromoCode}</span>
                  <button onclick="removePromo()" style="background: none; border: none; color: white; cursor: pointer; padding: 4px;">✕</button>
                </div>
              ` : `
                <div style="display: flex; gap: 8px;">
                  <input id="promoInput" type="text" placeholder="${t("enter_promo_code")}" style="flex: 1; padding: 8px 12px; border: 1px solid var(--border); border-radius: 6px;">
                  <button onclick="applyPromo()" class="primary small">${t("apply_promo")}</button>
                </div>
                <div id="promoMessage" style="margin-top: 8px; font-size: 12px;"></div>
              `}
            </div>
            
            <!-- Shipping Options -->
            <div style="background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 16px;">${t("shipping_options")}</h3>
              ${state.cartEnhancements.shippingOptions.map(option => {
                const isSelected = state.cartEnhancements.selectedShipping === option.id;
                const isFeeFree = option.freeThreshold && summary.subtotal >= option.freeThreshold;
                const displayPrice = isFeeFree ? 0 : option.price;
                
                return `
                  <div onclick="selectShipping('${option.id}')" style="display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid ${isSelected ? 'var(--brand)' : 'var(--border)'}; border-radius: 8px; margin-bottom: 8px; cursor: pointer; background: ${isSelected ? 'var(--chip)' : 'transparent'};">
                    <input type="radio" ${isSelected ? 'checked' : ''} style="margin: 0;">
                    <div style="flex: 1;">
                      <div style="font-weight: 500; margin-bottom: 2px;">${getProductField(option, "name")}</div>
                      <div style="font-size: 12px; color: var(--text-muted);">${getProductField(option, "description")}</div>
                      ${isFeeFree ? `<div style="font-size: 11px; color: var(--ok);">${t("free_shipping")}</div>` : ''}
                    </div>
                    <div style="font-weight: 600; color: ${displayPrice === 0 ? 'var(--ok)' : 'var(--text)'};">
                      ${displayPrice === 0 ? t("free_shipping") : fmtSAR(displayPrice)}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
            
            <!-- Order Summary -->
            <div style="background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 20px;">
              <h3 style="margin: 0 0 16px;">${t("cart_summary")}</h3>
              
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>${t("subtotal")}</span>
                <span>${fmtSAR(summary.subtotal)}</span>
              </div>
              
              ${summary.discount > 0 ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: var(--ok);">
                  <span>${t("discount")}</span>
                  <span>-${fmtSAR(summary.discount)}</span>
                </div>
              ` : ''}
              
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>${t("shipping")}</span>
                <span style="color: ${summary.shipping === 0 ? 'var(--ok)' : 'var(--text)'};">
                  ${summary.shipping === 0 ? t("free_shipping") : fmtSAR(summary.shipping)}
                </span>
              </div>
              
              <div style="display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 12px; color: var(--text-muted);">
                <span>${t("tax")}</span>
                <span>${fmtSAR(summary.tax)}</span>
              </div>
              
              <div style="border-top: 1px solid var(--border); padding-top: 12px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 600;">
                  <span>${t("total")}</span>
                  <span style="color: var(--brand);">${fmtSAR(summary.total)}</span>
                </div>
              </div>
              
              <button onclick="location.hash='#/checkout'" class="primary" style="width: 100%; margin-bottom: 12px;">
                ${t("proceed_to_checkout")}
              </button>
              <button onclick="location.hash='#/home'" class="secondary" style="width: 100%;">
                ${t("continue_shopping")}
              </button>
            </div>
          </div>
        </div>
      `}
    </div>
  `);
  
  // Setup cart enhancement functionality
  setupCartEnhancementFunctionality();
};

const profile = ({ el, state, actions }) => {
  const user = state.user;
  const userPosts = state.social.posts.filter(p => p.userId === user.id);
  const savedPosts = state.social.posts.filter(p => user.savedPosts.includes(p.id));
  
  el.innerHTML = h(`
    <div class="profile-container" style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <!-- Profile Header -->
      <div class="profile-header" style="text-align: center; margin-bottom: 32px;">
        <div class="avatar" style="width: 80px; height: 80px; border-radius: 50%; background: var(--brand); margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 32px; color: white;">
          ${user.name.charAt(0).toUpperCase()}
        </div>
        <h1 style="margin: 0 0 8px;">${user.name}</h1>
        <p style="color: var(--text-muted); margin: 0 0 8px;">@${user.name.toLowerCase()}</p>
        <p style="margin: 0 0 16px;">${user.bio || t("no_bio_yet")}</p>
        
        <div class="profile-stats" style="display: flex; justify-content: center; gap: 24px; margin-bottom: 16px;">
          <div style="text-align: center;">
            <div style="font-weight: bold; font-size: 18px;">${userPosts.length}</div>
            <div style="color: var(--text-muted); font-size: 14px;">${t("posts")}</div>
          </div>
          <div style="text-align: center;">
            <div style="font-weight: bold; font-size: 18px;">${user.followers.length}</div>
            <div style="color: var(--text-muted); font-size: 14px;">${t("followers")}</div>
          </div>
          <div style="text-align: center;">
            <div style="font-weight: bold; font-size: 18px;">${user.following.length}</div>
            <div style="color: var(--text-muted); font-size: 14px;">${t("following_users")}</div>
          </div>
        </div>
        
        <button onclick="editProfile()" class="secondary" style="margin-bottom: 16px;">
          ${t("edit_profile")}
        </button>
      </div>

      <!-- Profile Tabs -->
      <div class="profile-tabs" style="border-bottom: 1px solid var(--border); margin-bottom: 24px;">
        <div style="display: flex; gap: 24px;">
          <button class="tab-btn active" onclick="showProfileTab('posts')" style="padding: 12px 0; border: none; background: none; color: var(--brand); border-bottom: 2px solid var(--brand);">
            ${t("my_posts")}
          </button>
          <button class="tab-btn" onclick="showProfileTab('saved')" style="padding: 12px 0; border: none; background: none; color: var(--text-muted); border-bottom: 2px solid transparent;">
            ${t("saved_posts")}
          </button>
          <button class="tab-btn" onclick="showProfileTab('activity')" style="padding: 12px 0; border: none; background: none; color: var(--text-muted); border-bottom: 2px solid transparent;">
            ${t("activity_feed")}
          </button>
        </div>
      </div>

      <!-- Profile Content -->
      <div id="profileContent">
        <!-- Posts Tab (Default) -->
        <div id="postsTab" class="profile-tab-content">
          ${userPosts.length > 0 ? 
            userPosts.map(post => renderSocialPost(post)).join('') :
            `<div style="text-align: center; padding: 40px; color: var(--text-muted);">
              <p>${t("no_posts_yet")}</p>
              <button onclick="location.hash='#/social'" class="primary">${t("create_post")}</button>
            </div>`
          }
        </div>
        
        <!-- Saved Posts Tab -->
        <div id="savedTab" class="profile-tab-content" style="display: none;">
          ${savedPosts.length > 0 ?
            savedPosts.map(post => renderSocialPost(post)).join('') :
            `<div style="text-align: center; padding: 40px; color: var(--text-muted);">
              <p>${t("no_saved_posts")}</p>
            </div>`
          }
        </div>
        
        <!-- Activity Tab -->
        <div id="activityTab" class="profile-tab-content" style="display: none;">
          ${state.social.activities.slice(0, 10).map(activity => renderActivity(activity)).join('')}
        </div>
      </div>
    </div>
  `);

  // Setup profile functionality
  setupProfileFunctionality();
};

// Social Feed Route Handler
const social = ({ el, state, actions }) => {
  const posts = state.social.posts.sort((a, b) => b.timestamp - a.timestamp);
  
  el.innerHTML = h(`
    <div class="social-feed" style="max-width: 600px; margin: 0 auto; padding: 20px 20px 100px;">
      <!-- Feed Header -->
      <div class="feed-header" style="margin-bottom: 24px;">
        <h1 style="margin: 0 0 16px;">${t("social_feed")}</h1>
        
        <!-- Create Post Button -->
        <button onclick="showCreatePost()" class="primary full-width" style="margin-bottom: 16px; display: flex; align-items: center; justify-content: center; gap: 8px;">
          ✏️ ${t("create_post")}
        </button>
        
        <!-- Feed Filters -->
        <div class="feed-filters" style="display: flex; gap: 8px; overflow-x: auto;">
          <button class="filter-btn active" onclick="filterFeed('all')" style="padding: 8px 16px; border: 1px solid var(--brand); background: var(--brand); color: white; border-radius: 20px; white-space: nowrap;">
            ${t("all_posts")}
          </button>
          <button class="filter-btn" onclick="filterFeed('following')" style="padding: 8px 16px; border: 1px solid var(--border); background: var(--card); color: var(--text); border-radius: 20px; white-space: nowrap;">
            ${t("following_posts")}
          </button>
          <button class="filter-btn" onclick="filterFeed('trending')" style="padding: 8px 16px; border: 1px solid var(--border); background: var(--card); color: var(--text); border-radius: 20px; white-space: nowrap;">
            ${t("trending_posts")}
          </button>
        </div>
      </div>

      <!-- Posts Feed -->
      <div id="socialFeed" class="posts-feed">
        ${posts.map(post => renderSocialPost(post)).join('')}
      </div>
      
      ${posts.length === 0 ? `
        <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <h3>${t("no_posts_yet")}</h3>
          <p>${t("follow_creators_to_see_posts")}</p>
          <button onclick="location.hash='#/discover'" class="primary">${t("discover_creators")}</button>
        </div>
      ` : ''}
    </div>
    
    <!-- Create Post Modal -->
    <div id="createPostModal" class="modal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">
      <div class="modal-content" style="background: var(--card); border-radius: 12px; padding: 24px; margin: 20px; max-width: 500px; width: 100%;">
        <h3 style="margin: 0 0 16px;">${t("create_post")}</h3>
        <textarea id="postContent" placeholder="${t("post_content_placeholder")}" style="width: 100%; min-height: 120px; padding: 12px; border: 1px solid var(--border); border-radius: 8px; resize: vertical; margin-bottom: 16px;"></textarea>
        
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <button onclick="hideCreatePost()" class="secondary">${t("cancel")}</button>
          <button onclick="publishPost()" class="primary">${t("publish_post")}</button>
        </div>
      </div>
    </div>
  `);

  setupSocialFunctionality();
};

// Activity Feed Route Handler  
const activity = ({ el, state }) => {
  const activities = state.social.activities.slice(0, 20);
  
  el.innerHTML = h(`
    <div class="activity-feed" style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="margin: 0 0 24px;">${t("recent_activity")}</h1>
      
      <div class="activity-list">
        ${activities.length > 0 ? 
          activities.map(activity => renderActivity(activity)).join('') :
          `<div style="text-align: center; padding: 40px; color: var(--text-muted);">
            <p>${t("no_activity")}</p>
          </div>`
        }
      </div>
    </div>
  `);
};

const ugcfeed = ({ el }) => {
  // Redirect to new social feed
  location.hash = "#/social";
};

/* ---------- Enhanced Wishlist & Save for Later Route ---------- */
const wishlist = ({ el, navigate }) => {
  const collections = actions.getWishlistCollections();
  const stats = actions.getWishlistStats();
  const saveForLaterItems = state.wishlist.saveForLater.map(id => productById(id)).filter(Boolean);
  const recentlyViewedItems = state.wishlist.recentlyViewed.slice(0, 10).map(id => productById(id)).filter(Boolean);
  
  // Default to showing first collection or create one if none exist
  const currentCollection = collections[0] || {
    id: "default",
    name: { en: "My Wishlist", ar: "قائمة أمنياتي" },
    items: [],
    private: false
  };
  
  const collectionItems = currentCollection.items.map(id => productById(id)).filter(Boolean);
  const isRTL = getLang() === "ar";
  
  el.innerHTML = h(`
    <div style="padding: 20px;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h1 style="margin: 0; display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 28px;">❤️</span>
          ${t("my_wishlist")}
        </h1>
        <div style="display: flex; gap: 12px;">
          <button onclick="createNewWishlist()" style="padding: 8px 16px; border: 1px solid var(--border); background: white; border-radius: 6px; cursor: pointer;">
            ➕ ${t("create_wishlist")}
          </button>
          <button onclick="showWishlistSettings()" style="padding: 8px 16px; border: 1px solid var(--border); background: white; border-radius: 6px; cursor: pointer;">
            ⚙️ ${t("settings")}
          </button>
        </div>
      </div>

      <!-- Wishlist Stats -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px;">
        <div style="background: linear-gradient(135deg, #ff6b6b, #ff8e8e); color: white; padding: 20px; border-radius: 12px;">
          <div style="font-size: 32px; font-weight: bold;">${stats.totalItems}</div>
          <div style="opacity: 0.9;">${t("total_items_saved")}</div>
        </div>
        <div style="background: linear-gradient(135deg, #4ecdc4, #6bcf7f); color: white; padding: 20px; border-radius: 12px;">
          <div style="font-size: 32px; font-weight: bold;">${stats.totalCollections}</div>
          <div style="opacity: 0.9;">${t("total_lists_created")}</div>
        </div>
        <div style="background: linear-gradient(135deg, #a8e6cf, #7fcdcd); color: white; padding: 20px; border-radius: 12px;">
          <div style="font-size: 32px; font-weight: bold;">${stats.totalSaveForLater}</div>
          <div style="opacity: 0.9;">${t("saved_for_later")}</div>
        </div>
        <div style="background: linear-gradient(135deg, #ffd93d, #6bcf7f); color: white; padding: 20px; border-radius: 12px;">
          <div style="font-size: 32px; font-weight: bold;">${stats.recentlyViewedCount}</div>
          <div style="opacity: 0.9;">${t("recently_viewed")}</div>
        </div>
      </div>

      <!-- Collection Tabs -->
      <div style="border-bottom: 1px solid var(--border); margin-bottom: 24px;">
        <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px;">
          ${collections.map(collection => h(`
            <button onclick="switchWishlistCollection('${collection.id}')" 
                    data-collection="${collection.id}"
                    style="padding: 12px 16px; border: none; background: ${collection.id === currentCollection.id ? 'var(--brand)' : 'var(--panel)'}; 
                           color: ${collection.id === currentCollection.id ? 'white' : 'var(--text)'}; border-radius: 6px; cursor: pointer; 
                           white-space: nowrap; transition: all 0.2s ease;">
              ${collection.private ? '🔒' : '📋'} ${getProductField(collection, "name")} (${collection.items.length})
            </button>
          `)).join('')}
        </div>
      </div>

      <!-- Main Content -->
      <div style="display: grid; grid-template-columns: 1fr 300px; gap: 32px;">
        <!-- Collection Items -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2>${getProductField(currentCollection, "name")} (${collectionItems.length} ${t("items_count").replace('{n}', '')})</h2>
            <div style="display: flex; gap: 8px;">
              <select onchange="sortWishlistItems(this.value)" style="padding: 6px 12px; border: 1px solid var(--border); border-radius: 4px;">
                <option value="date">${t("sort_by_date_added")}</option>
                <option value="name">${t("sort_by_name")}</option>
                <option value="price">${t("sort_by_price")}</option>
              </select>
              <button onclick="toggleBulkSelect()" style="padding: 6px 12px; border: 1px solid var(--border); background: white; border-radius: 4px; cursor: pointer;">
                ${t("bulk_actions")}
              </button>
            </div>
          </div>

          ${collectionItems.length === 0 ? h(`
            <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
              <div style="font-size: 64px; margin-bottom: 16px; opacity: 0.5;">💔</div>
              <h3>${t("no_items_in_wishlist")}</h3>
              <p style="margin: 12px 0;">${t("wishlist_empty_desc")}</p>
              <button onclick="location.hash='#/discover'" style="padding: 12px 24px; background: var(--brand); color: white; border: none; border-radius: 6px; cursor: pointer; margin-top: 16px;">
                ${t("start_shopping")}
              </button>
            </div>
          `) : h(`
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
              ${collectionItems.map(product => renderWishlistProductCard(product, currentCollection.id)).join('')}
            </div>
          `)}
        </div>

        <!-- Sidebar -->
        <div style="position: sticky; top: 20px;">
          <!-- Save for Later -->
          <div style="background: var(--card); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <h3 style="display: flex; align-items: center; gap: 8px; margin: 0 0 16px 0;">
              <span>⏰</span> ${t("saved_for_later")} (${saveForLaterItems.length})
            </h3>
            ${saveForLaterItems.length === 0 ? h(`
              <p style="color: var(--text-muted); margin: 0;">${t("no_items_saved_later")}</p>
            `) : h(`
              <div style="display: flex; flex-direction: column; gap: 12px;">
                ${saveForLaterItems.slice(0, 3).map(product => h(`
                  <div style="display: flex; gap: 12px; padding: 8px; border: 1px solid var(--border); border-radius: 6px;">
                    <img src="${getProductImage(product, 80)}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
                    <div style="flex: 1; min-width: 0;">
                      <div style="font-weight: 500; font-size: 14px; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        ${getProductTitle(product)}
                      </div>
                      <div style="color: var(--brand); font-weight: bold; font-size: 14px; margin-bottom: 8px;">
                        ${fmtSAR(product.price)}
                      </div>
                      <div style="display: flex; gap: 4px;">
                        <button onclick="moveSaveForLaterToCart('${product.id}')" style="padding: 4px 8px; font-size: 12px; background: var(--brand); color: white; border: none; border-radius: 3px; cursor: pointer;">
                          ${t("move_to_cart")}
                        </button>
                        <button onclick="moveSaveForLaterToWishlist('${product.id}')" style="padding: 4px 8px; font-size: 12px; border: 1px solid var(--border); background: white; border-radius: 3px; cursor: pointer;">
                          ${t("move_to_wishlist")}
                        </button>
                      </div>
                    </div>
                  </div>
                `)).join('')}
                ${saveForLaterItems.length > 3 ? h(`
                  <button onclick="showAllSaveForLater()" style="padding: 8px; border: 1px solid var(--border); background: white; border-radius: 4px; cursor: pointer;">
                    ${t("view_all")} (${saveForLaterItems.length - 3} ${t("more")})
                  </button>
                `) : ''}
              </div>
            `)}
          </div>

          <!-- Recently Viewed -->
          <div style="background: var(--card); padding: 20px; border-radius: 12px;">
            <h3 style="display: flex; align-items: center; gap: 8px; margin: 0 0 16px 0;">
              <span>👁️</span> ${t("recently_viewed")} (${recentlyViewedItems.length})
            </h3>
            ${recentlyViewedItems.length === 0 ? h(`
              <p style="color: var(--text-muted); margin: 0;">${t("no_recently_viewed")}</p>
            `) : h(`
              <div style="display: flex; flex-direction: column; gap: 12px;">
                ${recentlyViewedItems.slice(0, 4).map(product => h(`
                  <div style="display: flex; gap: 12px; padding: 8px; border: 1px solid var(--border); border-radius: 6px;">
                    <img src="${getProductImage(product, 80)}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
                    <div style="flex: 1; min-width: 0;">
                      <div style="font-weight: 500; font-size: 13px; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        ${getProductTitle(product)}
                      </div>
                      <div style="color: var(--brand); font-weight: bold; font-size: 13px;">
                        ${fmtSAR(product.price)}
                      </div>
                    </div>
                    <button onclick="actions.addToWishlist('${product.id}'); location.reload()" style="padding: 4px; background: none; border: none; cursor: pointer; font-size: 16px;">
                      ${actions.isInWishlist(product.id) ? '❤️' : '🤍'}
                    </button>
                  </div>
                `)).join('')}
              </div>
            `)}
          </div>
        </div>
      </div>
    </div>
  `);

  // Setup wishlist functionality
  setupWishlistFunctionality();
};

function renderWishlistProductCard(product, collectionId) {
  const isInWishlist = actions.isInWishlist(product.id);
  
  return h(`
    <div class="product-card" style="background: var(--card); border-radius: 12px; overflow: hidden; transition: all 0.3s ease; position: relative;">
      <div style="position: absolute; top: 12px; right: 12px; z-index: 2;">
        <input type="checkbox" class="bulk-select" data-product="${product.id}" style="display: none;">
        <button onclick="removeFromWishlistCollection('${product.id}', '${collectionId}')" 
                style="background: rgba(255,255,255,0.9); border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          ❤️
        </button>
      </div>
      
      <div onclick="location.hash='#/pdp/${product.id}'" style="cursor: pointer;">
        <img src="${getProductImage(product, 400)}" style="width: 100%; height: 200px; object-fit: cover;">
        
        <div style="padding: 16px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${getProductTitle(product)}
          </h3>
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span style="color: var(--brand); font-weight: bold; font-size: 18px;">
              ${fmtSAR(product.price)}
            </span>
            ${product.originalPrice ? h(`
              <span style="text-decoration: line-through; color: var(--text-muted); font-size: 14px;">
                ${fmtSAR(product.originalPrice)}
              </span>
            `) : ''}
          </div>
          
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
            <span style="color: var(--text-muted); font-size: 14px;">
              ${stars(product.rating || 4)} (${product.reviewCount || 12})
            </span>
          </div>
          
          <div style="display: flex; gap: 8px;">
            <button onclick="event.stopPropagation(); addToCartFromWishlist('${product.id}')" 
                    style="flex: 1; padding: 10px; background: var(--brand); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
              🛒 ${t("add_to_cart")}
            </button>
            <button onclick="event.stopPropagation(); shareProduct('${product.id}')" 
                    style="padding: 10px 12px; border: 1px solid var(--border); background: white; border-radius: 6px; cursor: pointer;">
              📤
            </button>
          </div>
        </div>
      </div>
    </div>
  `);
}

function setupWishlistFunctionality() {
  // Make functions globally available
  window.createNewWishlist = () => {
    const name = prompt(t("wishlist_name"));
    if (name) {
      actions.createWishlistCollection(name);
      location.reload();
    }
  };

  window.switchWishlistCollection = (collectionId) => {
    // This would refresh the view with the selected collection
    location.reload();
  };

  window.removeFromWishlistCollection = (productId, collectionId) => {
    actions.removeFromWishlist(productId, collectionId);
    showSuccessMessage(t("removed_from_wishlist"));
    setTimeout(() => location.reload(), 1000);
  };

  window.addToCartFromWishlist = (productId) => {
    actions.addToCart(productId);
    showSuccessMessage(t("added_to_cart"));
  };

  window.moveSaveForLaterToCart = (productId) => {
    actions.moveFromSaveForLater(productId, true);
    showSuccessMessage(t("moved_to_cart"));
    location.reload();
  };

  window.moveSaveForLaterToWishlist = (productId) => {
    actions.moveFromSaveForLater(productId, false);
    showSuccessMessage(t("moved_to_wishlist"));
    location.reload();
  };

  window.shareProduct = (productId) => {
    const product = productById(productId);
    if (navigator.share) {
      navigator.share({
        title: getProductTitle(product),
        text: `${t("check_out_product")}: ${getProductTitle(product)}`,
        url: `${window.location.origin}${window.location.pathname}#/pdp/${productId}`
      });
    } else {
      const url = `${window.location.origin}${window.location.pathname}#/pdp/${productId}`;
      navigator.clipboard.writeText(url);
      showSuccessMessage(t("link_copied"));
    }
  };

  window.showWishlistSettings = () => {
    // Show settings modal
    alert("Wishlist settings coming soon!");
  };

  window.toggleBulkSelect = () => {
    const checkboxes = document.querySelectorAll('.bulk-select');
    const isVisible = checkboxes[0]?.style.display !== 'none';
    
    checkboxes.forEach(cb => {
      cb.style.display = isVisible ? 'none' : 'block';
    });
  };

  window.sortWishlistItems = (sortBy) => {
    // This would re-render with sorted items
    console.log('Sorting by:', sortBy);
  };
}

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
  "/wishlist": wishlist,
  "/profile": profile,
  "/social": social,
  "/activity": activity
};

/* ---------- Enhanced Search & Discovery Helper Functions ---------- */

/* ---------- Enhanced Search & Discovery Helper Functions ---------- */

function renderDiscoverProductCard(product) {
  const isInWishlist = actions.isInWishlist(product.id);
  
  return h(`
    <div class="product-card" style="border: 1px solid var(--border); border-radius: 12px; padding: 0; cursor: pointer; background: var(--card); position: relative; overflow: hidden; transition: all 0.3s ease;">
      <!-- Wishlist Button -->
      <div style="position: absolute; top: 12px; right: 12px; z-index: 2;">
        <button onclick="event.stopPropagation(); toggleWishlistFromCard('${product.id}')" 
                style="background: rgba(255,255,255,0.9); border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 18px;">${isInWishlist ? '❤️' : '🤍'}</span>
        </button>
      </div>
      
      <!-- Save for Later Button -->
      <div style="position: absolute; top: 12px; left: 12px; z-index: 2;">
        <button onclick="event.stopPropagation(); saveForLaterFromCard('${product.id}')" 
                style="background: rgba(255,255,255,0.9); border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 16px;">⏰</span>
        </button>
      </div>
      
      <div onclick="location.hash='#/pdp/${product.id}'">
        <img src="${getProductImage(product, 400)}" alt="${getProductTitle(product)}" style="width: 100%; height: 180px; object-fit: cover;">
        
        <div style="padding: 16px;">
          <h3 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${getProductTitle(product)}
          </h3>
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-weight: bold; color: var(--brand); font-size: 16px;">
              ${fmtSAR(product.price)}
            </span>
            ${product.originalPrice ? h(`
              <span style="text-decoration: line-through; color: var(--text-muted); font-size: 14px;">
                ${fmtSAR(product.originalPrice)}
              </span>
            `) : ''}
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 4px;">
              <span style="color: #ffa500;">${stars(product.rating || 4)}</span>
              <span style="font-size: 12px; color: var(--text-muted);">${(product.rating || 4).toFixed(1)}</span>
            </div>
            <span style="font-size: 12px; color: var(--text-muted);">
              @${creatorName(product.creatorId)}
            </span>
          </div>
          
          <button onclick="event.stopPropagation(); addToCartFromCard('${product.id}')" 
                  style="width: 100%; padding: 10px; background: var(--brand); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: all 0.2s ease;">
            🛒 ${t("add_to_cart")}
          </button>
        </div>
      </div>
    </div>
  `);
}

function getCategoryIcon(categoryId) {
  const icons = {
    apparel: "👕",
    footwear: "👟", 
    accessories: "💼",
    home: "🏠",
    beauty: "💄",
    electronics: "📱",
    books: "📚",
    sports: "⚽"
  };
  return icons[categoryId] || "🛍️";
}

// Global functions for product card interactions
window.toggleWishlistFromCard = (productId) => {
  const isInWishlist = actions.isInWishlist(productId);
  
  if (isInWishlist) {
    actions.removeFromWishlist(productId);
    showSuccessMessage(t("removed_from_wishlist"));
  } else {
    actions.addToWishlist(productId);
    showSuccessMessage(t("added_to_wishlist"));
  }
  
  // Update the heart icon
  setTimeout(() => {
    const button = document.querySelector(`button[onclick*="toggleWishlistFromCard('${productId}')"] span`);
    if (button) {
      button.textContent = actions.isInWishlist(productId) ? '❤️' : '🤍';
    }
  }, 100);
};

window.saveForLaterFromCard = (productId) => {
  actions.saveForLater(productId);
  showSuccessMessage(t("saved_for_later"));
};

window.addToCartFromCard = (productId) => {
  actions.addToCart(productId);
  showSuccessMessage(t("added_to_cart"));
};

function showSuccessMessage(message) {
  const successMsg = document.createElement('div');
  successMsg.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 400;
    background: var(--success); color: white; padding: 16px 24px;
    border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideInRight 0.3s ease;
  `;
  successMsg.textContent = message;
  document.body.appendChild(successMsg);
  
  setTimeout(() => {
    if (document.body.contains(successMsg)) {
      document.body.removeChild(successMsg);
    }
  }, 3000);
}

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

/* ---------- Review System Helper Functions ---------- */

function setupReviewFunctionality(productId) {
  // Global review functions for UI interactions
  window.filterReviews = function(productId, filterType, value) {
    const filters = {};
    filters[filterType] = value;
    actions.filterReviews(productId, filters);
    location.hash = `#/pdp/${productId}`; // Refresh to show filtered reviews
  };

  window.markHelpful = function(reviewId, productId, helpful) {
    actions.markReviewHelpful(reviewId, productId, helpful);
    location.hash = `#/pdp/${productId}`; // Refresh to show updated counts
  };

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
          <!-- Rating Selection -->
          <div style="margin-bottom: 24px;">
            <label style="display: block; font-weight: 600; margin-bottom: 12px;">${t("your_rating") || "Your rating"}</label>
            <div class="star-rating" style="display: flex; gap: 4px; margin-bottom: 8px;">
              ${[1, 2, 3, 4, 5].map(star => `
                <button type="button" class="star-btn" data-rating="${star}" 
                        style="background: none; border: none; font-size: 32px; cursor: pointer; color: #ddd; transition: color 0.2s;"
                        onmouseover="highlightStars(${star})" onmouseout="resetStars()" onclick="selectRating(${star})">
                  ⭐
                </button>
              `).join('')}
            </div>
            <p style="color: var(--text-muted); font-size: 14px; margin: 0;" id="ratingText">${t("select_rating") || "Select a rating"}</p>
          </div>

          <!-- Review Title -->
          <div style="margin-bottom: 24px;">
            <label style="display: block; font-weight: 600; margin-bottom: 8px;">${t("review_title") || "Review title"}</label>
            <input type="text" name="title" required maxlength="100" 
                   placeholder="${t("review_title_placeholder") || "Summarize your experience"}"
                   style="width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 16px;">
          </div>

          <!-- Review Content -->
          <div style="margin-bottom: 24px;">
            <label style="display: block; font-weight: 600; margin-bottom: 8px;">${t("review_content") || "Your review"}</label>
            <textarea name="content" required rows="4" maxlength="1000"
                      placeholder="${t("review_content_placeholder") || "Tell others about your experience with this product"}"
                      style="width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 16px; resize: vertical;"></textarea>
            <p style="color: var(--text-muted); font-size: 12px; margin-top: 4px; text-align: right;" id="charCount">0/1000</p>
          </div>

          <!-- Photo Upload Simulation -->
          <div style="margin-bottom: 24px;">
            <label style="display: block; font-weight: 600; margin-bottom: 8px;">${t("add_photos") || "Add photos (optional)"}</label>
            <div style="border: 2px dashed var(--border); border-radius: 8px; padding: 24px; text-align: center; cursor: pointer;" onclick="simulatePhotoUpload()">
              <div style="color: var(--text-muted); margin-bottom: 8px;">📷</div>
              <p style="margin: 0; color: var(--text-muted); font-size: 14px;">${t("click_to_add_photos") || "Click to add photos"}</p>
            </div>
            <div id="uploadedPhotos" style="display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap;"></div>
          </div>

          <!-- Privacy Notice -->
          <div style="background: var(--panel); padding: 16px; border-radius: 8px; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 14px; color: var(--text-muted);">
              <span style="margin-right: 8px;">ℹ️</span>
              ${t("review_privacy_notice") || "Your review will be public and may be used to help other customers make informed decisions."}
            </p>
          </div>

          <!-- Submit Buttons -->
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
    setupReviewFormInteractions();
  };

  window.closeReviewForm = function() {
    const modal = document.querySelector('.review-modal');
    if (modal) {
      document.body.removeChild(modal);
    }
  };

  window.showImageModal = function(imageSrc) {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.9); z-index: 300;
      display: flex; align-items: center; justify-content: center;
      padding: 20px; cursor: pointer;
    `;
    
    modal.innerHTML = `
      <img src="${imageSrc}" alt="Review photo" 
           style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 8px;">
    `;
    
    modal.onclick = () => document.body.removeChild(modal);
    document.body.appendChild(modal);
  };

  window.toggleWishlist = function(productId) {
    // This will be implemented in Phase 1.3
    console.log('Wishlist toggle for product:', productId);
  };
}

function setupReviewFormInteractions() {
  let selectedRating = 0;
  const ratingTexts = {
    1: t("rating_1") || "Poor",
    2: t("rating_2") || "Fair", 
    3: t("rating_3") || "Good",
    4: t("rating_4") || "Very Good",
    5: t("rating_5") || "Excellent"
  };

  window.selectRating = function(rating) {
    selectedRating = rating;
    updateStarDisplay(rating);
    document.getElementById('ratingText').textContent = ratingTexts[rating];
  };

  window.highlightStars = function(rating) {
    updateStarDisplay(rating);
  };

  window.resetStars = function() {
    updateStarDisplay(selectedRating);
  };

  function updateStarDisplay(rating) {
    const stars = document.querySelectorAll('.star-btn');
    stars.forEach((star, index) => {
      if (index < rating) {
        star.style.color = '#ffa500';
      } else {
        star.style.color = '#ddd';
      }
    });
  }

  // Character counter for review content
  const textarea = document.querySelector('textarea[name="content"]');
  const charCount = document.getElementById('charCount');
  
  textarea.addEventListener('input', function() {
    const length = this.value.length;
    charCount.textContent = `${length}/1000`;
    if (length > 900) {
      charCount.style.color = 'var(--warning)';
    } else {
      charCount.style.color = 'var(--text-muted)';
    }
  });

  window.simulatePhotoUpload = function() {
    // Simulate photo upload with random images
    const sampleImages = [
      uns("1571019613454-1cb2f99b2d8b", 200),
      uns("1605296867424-35aaf25826ef", 200),
      uns("1549298916-b41d501f42fb", 200)
    ];
    
    const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    const photosContainer = document.getElementById('uploadedPhotos');
    
    const photoDiv = document.createElement('div');
    photoDiv.style.cssText = 'position: relative; display: inline-block;';
    photoDiv.innerHTML = `
      <img src="${randomImage}" alt="Uploaded photo" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
      <button onclick="this.parentElement.remove()" 
              style="position: absolute; top: -8px; right: -8px; background: var(--error); color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; font-size: 12px;">×</button>
    `;
    
    photosContainer.appendChild(photoDiv);
  };

  window.submitReview = function(event, productId) {
    event.preventDefault();
    
    if (selectedRating === 0) {
      alert(t("please_select_rating") || "Please select a rating");
      return;
    }

    const formData = new FormData(event.target);
    const photos = Array.from(document.querySelectorAll('#uploadedPhotos img')).map(img => img.src);
    
    const reviewData = {
      rating: selectedRating,
      title: { 
        en: formData.get('title'), 
        ar: formData.get('title') // In a real app, this would be translated
      },
      content: {
        en: formData.get('content'),
        ar: formData.get('content') // In a real app, this would be translated
      },
      images: photos,
      verified: state.user.authed,
      tags: [] // Could be auto-generated based on content analysis
    };

    actions.submitReview(productId, reviewData);
    closeReviewForm();
    
    // Show success message
    const successMsg = document.createElement('div');
    successMsg.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 400;
      background: var(--success); color: white; padding: 16px 24px;
      border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    successMsg.textContent = t("review_submitted") || "Review submitted successfully!";
    document.body.appendChild(successMsg);
    
    setTimeout(() => {
      document.body.removeChild(successMsg);
      location.hash = `#/pdp/${productId}`; // Refresh to show new review
    }, 2000);
  };
}

/* ---------- Social Features Helper Functions ---------- */

function renderSocialPost(post) {
  const timeAgo = formatTimeAgo(post.timestamp);
  const isLiked = post.likedBy.includes(state.user.id);
  const isSaved = state.user.savedPosts.includes(post.id);
  
  return h(`
    <div class="social-post" style="background: var(--card); border-radius: 12px; padding: 16px; margin-bottom: 16px; border: 1px solid var(--border);">
      <!-- Post Header -->
      <div class="post-header" style="display: flex; align-items: center; margin-bottom: 12px;">
        <img src="${post.avatar}" alt="${post.username}" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 12px;" loading="lazy">
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <strong>${post.username}</strong>
            ${post.isCreator ? '<span style="color: var(--brand); font-size: 14px;">✓</span>' : ''}
          </div>
          <div style="color: var(--text-muted); font-size: 14px;">${timeAgo}</div>
        </div>
        <button class="post-menu" onclick="showPostMenu('${post.id}')" style="background: none; border: none; color: var(--text-muted); padding: 4px;">⋯</button>
      </div>

      <!-- Post Content -->
      <div class="post-content" style="margin-bottom: 12px;">
        <p style="margin: 0 0 12px; line-height: 1.5;">${post.content}</p>
        
        ${post.images.length > 0 ? `
          <div class="post-images" style="margin-bottom: 12px;">
            ${post.images.map(img => `
              <img src="${img}" alt="Post image" style="width: 100%; border-radius: 8px; margin-bottom: 8px;" loading="lazy">
            `).join('')}
          </div>
        ` : ''}

        ${post.productIds.length > 0 ? `
          <div class="tagged-products" style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
            ${post.productIds.map(pid => {
              const product = productById(pid);
              return product ? `
                <div onclick="location.hash='#/pdp/${pid}'" class="tagged-product" style="display: flex; align-items: center; gap: 8px; padding: 8px; background: var(--bg); border-radius: 8px; cursor: pointer; border: 1px solid var(--border);">
                  <img src="${getProductImage(product)}" alt="${product.name}" style="width: 32px; height: 32px; border-radius: 4px;" loading="lazy">
                  <div>
                    <div style="font-size: 12px; font-weight: 500;">${getProductTitle(product)}</div>
                    <div style="font-size: 11px; color: var(--text-muted);">${fmtSAR(product.price)}</div>
                  </div>
                </div>
              ` : '';
            }).join('')}
          </div>
        ` : ''}
      </div>

      <!-- Post Actions -->
      <div class="post-actions" style="display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid var(--border);">
        <div style="display: flex; align-items: center; gap: 16px;">
          <button onclick="togglePostLike('${post.id}')" class="post-action" style="display: flex; align-items: center; gap: 4px; background: none; border: none; color: ${isLiked ? 'var(--brand)' : 'var(--text-muted)'}; cursor: pointer;">
            ${isLiked ? '❤️' : '🤍'} ${post.likes}
          </button>
          <button onclick="showComments('${post.id}')" class="post-action" style="display: flex; align-items: center; gap: 4px; background: none; border: none; color: var(--text-muted); cursor: pointer;">
            💬 ${post.comments}
          </button>
          <button onclick="sharePost('${post.id}')" class="post-action" style="display: flex; align-items: center; gap: 4px; background: none; border: none; color: var(--text-muted); cursor: pointer;">
            📤 ${post.shares}
          </button>
        </div>
        <button onclick="toggleSavePost('${post.id}')" class="post-action" style="background: none; border: none; color: ${isSaved ? 'var(--brand)' : 'var(--text-muted)'}; cursor: pointer;">
          ${isSaved ? '🔖' : '📑'}
        </button>
      </div>
    </div>
  `);
}

function renderActivity(activity) {
  const timeAgo = formatTimeAgo(activity.timestamp);
  let content = '';
  
  switch (activity.type) {
    case 'follow':
      const targetUser = creatorById(activity.targetUserId) || { name: 'User' };
      content = `${t("you")} ${t("followed")} ${targetUser.name}`;
      break;
    case 'like':
      const post = state.social.posts.find(p => p.id === activity.postId);
      content = `${t("you")} ${t("liked")} ${post ? post.username + "'s" : 'a'} ${t("post")}`;
      break;
    case 'share_product':
      const product = productById(activity.productId);
      content = `${t("you")} ${t("shared")} ${product ? getProductTitle(product) : 'a product'}`;
      break;
    default:
      content = `${activity.type} activity`;
  }
  
  return h(`
    <div class="activity-item" style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border);">
      <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--brand); margin-right: 12px; flex-shrink: 0;"></div>
      <div style="flex: 1;">
        <p style="margin: 0; font-size: 14px;">${content}</p>
        <div style="color: var(--text-muted); font-size: 12px; margin-top: 2px;">${timeAgo}</div>
      </div>
    </div>
  `);
}

function setupSocialFunctionality() {
  // Global functions for social interactions
  window.showCreatePost = function() {
    document.getElementById('createPostModal').style.display = 'flex';
    document.getElementById('postContent').focus();
  };

  window.hideCreatePost = function() {
    document.getElementById('createPostModal').style.display = 'none';
    document.getElementById('postContent').value = '';
  };

  window.publishPost = function() {
    const content = document.getElementById('postContent').value.trim();
    if (!content) return;
    
    actions.createPost(content);
    hideCreatePost();
    location.reload(); // Refresh to show new post
  };

  window.togglePostLike = function(postId) {
    const post = state.social.posts.find(p => p.id === postId);
    if (!post) return;
    
    if (post.likedBy.includes(state.user.id)) {
      actions.unlikePost(postId);
    } else {
      actions.likePost(postId);
    }
    location.reload(); // Refresh to update UI
  };

  window.toggleSavePost = function(postId) {
    if (state.user.savedPosts.includes(postId)) {
      actions.unsavePost(postId);
    } else {
      actions.savePost(postId);
    }
    location.reload(); // Refresh to update UI
  };

  window.sharePost = function(postId) {
    const post = state.social.posts.find(p => p.id === postId);
    if (!post) return;
    
    const shareData = {
      title: `${post.username} on StoreZ`,
      text: post.content.substring(0, 100) + '...',
      url: `${location.origin}${location.pathname}#/social`
    };
    
    if (navigator.share) {
      navigator.share(shareData);
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareData.url).then(() => {
        alert(t("link_copied"));
      });
    }
  };

  window.filterFeed = function(filter) {
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
      btn.style.background = 'var(--card)';
      btn.style.color = 'var(--text)';
    });
    
    event.target.classList.add('active');
    event.target.style.background = 'var(--brand)';
    event.target.style.color = 'white';
    
    // Filter posts (simplified - in real app would re-render)
    const allPosts = document.querySelectorAll('.social-post');
    allPosts.forEach(post => post.style.display = 'block');
  };
}

function setupProfileFunctionality() {
  window.showProfileTab = function(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
      btn.style.color = 'var(--text-muted)';
      btn.style.borderBottom = '2px solid transparent';
    });
    
    event.target.classList.add('active');
    event.target.style.color = 'var(--brand)';
    event.target.style.borderBottom = '2px solid var(--brand)';
    
    // Show corresponding tab content
    document.querySelectorAll('.profile-tab-content').forEach(tab => {
      tab.style.display = 'none';
    });
    
    document.getElementById(tabName + 'Tab').style.display = 'block';
  };

  window.editProfile = function() {
    // Simple profile editing (in real app would show modal)
    const newBio = prompt(t("enter_new_bio"), state.user.bio);
    if (newBio !== null) {
      state.user.bio = newBio;
      actions.saveState();
      location.reload();
    }
  };
}

function setupCartEnhancementFunctionality() {
  // Additional cart-specific functionality can be added here
  
  // Auto-save promo code on enter key
  document.addEventListener('keydown', function(event) {
    if (event.target.id === 'promoInput' && event.key === 'Enter') {
      window.applyPromo();
    }
  });
  
  // Update cart summary when page loads
  if (window.actions && window.actions.updateCartSummary) {
    window.actions.updateCartSummary();
  }
}