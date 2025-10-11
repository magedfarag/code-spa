/* routes.js — StoreZ (Buyer SPA) route handlers
   Each handler receives:
     ctx = { el, state, actions, t, tn, currency, fmtDate, navigate, showSheet, refresh }
   and optional id from the hash (e.g., #/pdp/p1 => id = "p1")
*/
import { uns, state, actions, saveState, productById, creatorById, cartTotal, getProductField, getProductTitle, getProductImage, loc } from "./data.js?v=20251010-imageFix";
import { t, tn, getLang, formatTimeAgo, fmtSAR } from "./i18n.js?v=20251010-imageFix";
import { aiEngine } from "./ai.js?v=20251010-imageFix";

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
const creatorName = (cid) => (creatorById(cid)?.name || t("creator"));

/* ---------- global functions for interactivity ---------- */
window.addToCart = function(productId) {
  if (actions.addToCart) {
    actions.addToCart(productId);
    // refresh cart badge count
    window.refreshBadges();
    
    // Show success message with proper text
    const product = productById(productId);
    const productName = product ? getProductTitle(product) : "";
    const message = t("added_to_cart") || "Added to cart!";
    
    // Use alert with proper text instead of object
    alert(message + (productName ? ` - ${productName}` : ""));
  }
};

/* Basic route handlers */
const landing = ({ el, navigate, state, actions }) => {
  // Landing page data from requirements
  const landingData = {
    heroSlides: [
      {
        title: "اكتشف أحدث صيحات الموضة",
        subtitle: "تسوق من أفضل البراندات السعودية",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
        cta: "تسوق الآن",
        targetRoute: "#/discover?category=fashion"
      },
      {
        title: "إلكترونيات بأفضل الأسعار", 
        subtitle: "أحدث الأجهزة الذكية والتقنيات",
        image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece",
        cta: "استكشف المنتجات",
        targetRoute: "#/discover?category=electronics"
      },
      {
        title: "تجارة اجتماعية جديدة",
        subtitle: "تفاعل مع المنشئين واكتشف منتجات فريدة",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d",
        cta: "ابدأ التجربة",
        targetRoute: "#/home"
      }
    ],
    quickStats: {
      totalProducts: "75,000+",
      activeSellers: "5,000+", 
      dailyDeliveries: "2,500+",
      userSatisfaction: "98%"
    }
  };

  // Current slide state (simple implementation for MVP)
  let currentSlide = 0;
  
  // Make functions globally available for interactivity
  window.loadGuestUser = () => {
    // Set guest user session
    if (actions.setGuestUser) {
      actions.setGuestUser();
    } else {
      // Simple guest user setup
      state.user = {
        id: 'guest_' + Date.now(),
        name: t("guest_user") || "ضيف",
        isGuest: true
      };
      actions.saveState && actions.saveState();
    }
    navigate("#/home");
  };

  window.navigateToAuth = (mode) => {
    navigate(`#/auth?mode=${mode || 'signin'}`);
  };

  window.nextSlide = () => {
    currentSlide = (currentSlide + 1) % landingData.heroSlides.length;
    updateSlideContent();
  };

  window.prevSlide = () => {
    currentSlide = currentSlide === 0 ? landingData.heroSlides.length - 1 : currentSlide - 1;
    updateSlideContent();
  };

  window.goToSlide = (index) => {
    currentSlide = index;
    updateSlideContent();
  };

  const updateSlideContent = () => {
    const slide = landingData.heroSlides[currentSlide];
    const heroContent = document.querySelector('.hero-slide-content');
    const heroImage = document.querySelector('.hero-slide-image');
    const indicators = document.querySelectorAll('.slide-indicator');
    
    if (heroContent && heroImage) {
      heroContent.innerHTML = `
        <h1 class="hero-title">${slide.title}</h1>
        <p class="hero-subtitle">${slide.subtitle}</p>
        <button onclick="location.hash='${slide.targetRoute}'" class="hero-cta">
          ${slide.cta}
        </button>
      `;
      heroImage.src = slide.image + "?auto=format&fit=crop&w=800&q=70";
      
      // Update indicators
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
      });
    }
  };

  el.innerHTML = h(`
    <div class="landing-page">
      <!-- Skip to content link for accessibility -->
      <a href="#main-content" class="skip-link" tabindex="1">
        ${t("skip_to_content") || "تخطي إلى المحتوى الرئيسي"}
      </a>

      <!-- Language Selector -->
      <div class="language-selector">
        <button onclick="setLang('ar')" class="${getLang() === 'ar' ? 'active' : ''}" aria-label="${t("switch_to_arabic") || "التبديل إلى العربية"}">
          العربية
        </button>
        <button onclick="setLang('en')" class="${getLang() === 'en' ? 'active' : ''}" aria-label="${t("switch_to_english") || "Switch to English"}">
          English
        </button>
      </div>

      <!-- Hero Section with Carousel -->
      <section class="hero-section" id="main-content" aria-label="${t("hero_section") || "القسم الرئيسي"}">
        <div class="hero-carousel">
          <div class="hero-slide">
            <div class="hero-content">
              <div class="hero-slide-content">
                <h1 class="hero-title">${landingData.heroSlides[0].title}</h1>
                <p class="hero-subtitle">${landingData.heroSlides[0].subtitle}</p>
                <button onclick="location.hash='${landingData.heroSlides[0].targetRoute}'" class="hero-cta">
                  ${landingData.heroSlides[0].cta}
                </button>
              </div>
              <div class="hero-image-container">
                <img class="hero-slide-image" src="${landingData.heroSlides[0].image}?auto=format&fit=crop&w=800&q=70" 
                     alt="${landingData.heroSlides[0].title}" loading="eager">
              </div>
            </div>
          </div>
          
          <!-- Carousel Controls -->
          <button class="carousel-control prev" onclick="prevSlide()" aria-label="${t("previous_slide") || "الشريحة السابقة"}" tabindex="2">
            ‹
          </button>
          <button class="carousel-control next" onclick="nextSlide()" aria-label="${t("next_slide") || "الشريحة التالية"}" tabindex="3">
            ›
          </button>
          
          <!-- Slide Indicators -->
          <div class="slide-indicators">
            ${landingData.heroSlides.map((_, index) => `
              <button class="slide-indicator ${index === 0 ? 'active' : ''}" 
                      onclick="goToSlide(${index})" 
                      aria-label="${t("go_to_slide") || "اذهب إلى الشريحة"} ${index + 1}"
                      tabindex="${4 + index}"></button>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Quick Stats Section -->
      <section class="stats-section" aria-label="${t("platform_statistics") || "إحصائيات المنصة"}">
        <div class="stats-container">
          <div class="stat-item">
            <div class="stat-number">${landingData.quickStats.totalProducts}</div>
            <div class="stat-label">${t("total_products") || "منتج متاح"}</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${landingData.quickStats.activeSellers}</div>
            <div class="stat-label">${t("active_sellers") || "بائع نشط"}</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${landingData.quickStats.dailyDeliveries}</div>
            <div class="stat-label">${t("daily_deliveries") || "توصيل يومي"}</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${landingData.quickStats.userSatisfaction}</div>
            <div class="stat-label">${t("user_satisfaction") || "رضا العملاء"}</div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section" aria-label="${t("get_started") || "ابدأ الآن"}">
        <div class="cta-container">
          <h2>${t("ready_to_start") || "هل أنت مستعد للبدء؟"}</h2>
          <p>${t("join_thousands") || "انضم إلى آلاف المتسوقين الذين يثقون بنا"}</p>
          
          <div class="cta-buttons">
            <button onclick="loadGuestUser()" class="cta-primary" tabindex="10">
              🚀 ${t("quick_trial") || "تجربة سريعة"}
            </button>
            <button onclick="navigateToAuth('signup')" class="cta-secondary" tabindex="11">
              👤 ${t("create_account") || "إنشاء حساب"}
            </button>
            <button onclick="navigateToAuth('signin')" class="cta-tertiary" tabindex="12">
              🔑 ${t("sign_in") || "تسجيل الدخول"}
            </button>
          </div>
          
          <p class="cta-note">
            ${t("quick_trial_note") || "التجربة السريعة لا تتطلب تسجيل - ابدأ التسوق فوراً!"}
          </p>
        </div>
      </section>
    </div>

    <style>
      .landing-page {
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        position: relative;
      }

      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
      }

      .skip-link:focus {
        top: 6px;
      }

      .language-selector {
        position: absolute;
        top: 20px;
        right: 20px;
        display: flex;
        gap: 8px;
        z-index: 100;
      }

      .language-selector button {
        padding: 8px 16px;
        border: 2px solid rgba(255,255,255,0.3);
        background: rgba(255,255,255,0.1);
        color: white;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
      }

      .language-selector button:hover,
      .language-selector button:focus {
        background: rgba(255,255,255,0.2);
        border-color: rgba(255,255,255,0.5);
        outline: 2px solid rgba(255,255,255,0.3);
        outline-offset: 2px;
      }

      .language-selector button.active {
        background: white;
        color: var(--primary);
        border-color: white;
      }

      .hero-section {
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }

      .hero-carousel {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        position: relative;
        padding: 0 40px;
      }

      .hero-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 60px;
        align-items: center;
        min-height: 500px;
      }

      .hero-title {
        font-size: clamp(2rem, 4vw, 3.5rem);
        font-weight: 700;
        line-height: 1.2;
        margin-bottom: 20px;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      }

      .hero-subtitle {
        font-size: clamp(1rem, 2vw, 1.25rem);
        line-height: 1.5;
        margin-bottom: 30px;
        opacity: 0.9;
      }

      .hero-cta {
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
        color: white;
        border: none;
        padding: 16px 32px;
        font-size: 18px;
        font-weight: 600;
        border-radius: 50px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      }

      .hero-cta:hover,
      .hero-cta:focus {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        outline: 2px solid rgba(255,255,255,0.3);
        outline-offset: 2px;
      }

      .hero-image-container {
        position: relative;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      }

      .hero-slide-image {
        width: 100%;
        height: 400px;
        object-fit: cover;
        border-radius: 20px;
      }

      .carousel-control {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255,255,255,0.2);
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      }

      .carousel-control:hover,
      .carousel-control:focus {
        background: rgba(255,255,255,0.3);
        outline: 2px solid rgba(255,255,255,0.5);
        outline-offset: 2px;
      }

      .carousel-control.prev {
        left: 10px;
      }

      .carousel-control.next {
        right: 10px;
      }

      .slide-indicators {
        position: absolute;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 10px;
      }

      .slide-indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.5);
        background: transparent;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .slide-indicator:hover,
      .slide-indicator:focus {
        border-color: white;
        outline: 2px solid rgba(255,255,255,0.3);
        outline-offset: 2px;
      }

      .slide-indicator.active {
        background: white;
        border-color: white;
      }

      .stats-section {
        padding: 80px 20px;
        background: rgba(255,255,255,0.1);
        backdrop-filter: blur(10px);
      }

      .stats-container {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 40px;
        text-align: center;
      }

      .stat-item {
        padding: 20px;
      }

      .stat-number {
        font-size: clamp(2rem, 4vw, 3rem);
        font-weight: 700;
        margin-bottom: 10px;
        color: #ffd700;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      }

      .stat-label {
        font-size: 16px;
        opacity: 0.9;
      }

      .cta-section {
        padding: 80px 20px;
        text-align: center;
      }

      .cta-container {
        max-width: 600px;
        margin: 0 auto;
      }

      .cta-container h2 {
        font-size: clamp(1.75rem, 3vw, 2.5rem);
        font-weight: 700;
        margin-bottom: 20px;
      }

      .cta-container p {
        font-size: 18px;
        margin-bottom: 40px;
        opacity: 0.9;
      }

      .cta-buttons {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 20px;
      }

      .cta-primary {
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
        color: white;
        border: none;
        padding: 18px 36px;
        font-size: 18px;
        font-weight: 600;
        border-radius: 50px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      }

      .cta-secondary {
        background: rgba(255,255,255,0.2);
        color: white;
        border: 2px solid rgba(255,255,255,0.3);
        padding: 16px 32px;
        font-size: 16px;
        font-weight: 500;
        border-radius: 50px;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      }

      .cta-tertiary {
        background: transparent;
        color: white;
        border: 2px solid rgba(255,255,255,0.3);
        padding: 14px 28px;
        font-size: 16px;
        font-weight: 500;
        border-radius: 50px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .cta-primary:hover,
      .cta-primary:focus {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        outline: 2px solid rgba(255,255,255,0.3);
        outline-offset: 2px;
      }

      .cta-secondary:hover,
      .cta-secondary:focus {
        background: rgba(255,255,255,0.3);
        border-color: rgba(255,255,255,0.5);
        outline: 2px solid rgba(255,255,255,0.3);
        outline-offset: 2px;
      }

      .cta-tertiary:hover,
      .cta-tertiary:focus {
        background: rgba(255,255,255,0.1);
        border-color: rgba(255,255,255,0.5);
        outline: 2px solid rgba(255,255,255,0.3);
        outline-offset: 2px;
      }

      .cta-note {
        font-size: 14px;
        opacity: 0.8;
        font-style: italic;
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .language-selector {
          top: 10px;
          right: 10px;
        }

        .hero-content {
          grid-template-columns: 1fr;
          gap: 40px;
          text-align: center;
          padding: 20px;
        }

        .hero-carousel {
          padding: 0 20px;
        }

        .carousel-control {
          width: 40px;
          height: 40px;
          font-size: 20px;
        }

        .stats-container {
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .cta-buttons {
          gap: 12px;
        }

        .hero-image-container {
          order: -1;
        }
      }

      /* RTL Support */
      [dir="rtl"] .carousel-control.prev {
        right: 10px;
        left: auto;
      }

      [dir="rtl"] .carousel-control.next {
        left: 10px;
        right: auto;
      }

      [dir="rtl"] .language-selector {
        left: 20px;
        right: auto;
      }

      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        .landing-page {
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
        }
      }
    </style>
  `);

  // Auto-advance slides every 5 seconds
  let slideInterval = setInterval(() => {
    window.nextSlide();
  }, 5000);

  // Pause auto-advance on hover
  const heroSection = el.querySelector('.hero-section');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', () => clearInterval(slideInterval));
    heroSection.addEventListener('mouseleave', () => {
      slideInterval = setInterval(() => {
        window.nextSlide();
      }, 5000);
    });
  }

  // Cleanup on route change
  return () => {
    clearInterval(slideInterval);
  };
};

const home = ({ el, state, actions, navigate }) => {
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
  
  // Categories for quick access
  const quickCategories = [
    { id: "electronics", name: t("electronics") || "إلكترونيات", icon: "📱", count: "15,000+ منتج" },
    { id: "fashion", name: t("fashion") || "أزياء", icon: "👗", count: "25,000+ منتج" },
    { id: "home", name: t("home_garden") || "منزل وحديقة", icon: "🏠", count: "8,000+ منتج" },
    { id: "beauty", name: t("beauty") || "جمال", icon: "💄", count: "12,000+ منتج" },
    { id: "sports", name: t("sports") || "رياضة", icon: "⚽", count: "6,000+ منتج" },
    { id: "books", name: t("books") || "كتب", icon: "📚", count: "3,000+ منتج" }
  ];
  
  // Track page view
  actions.trackUserInteraction('page_view', { page: 'home' });

  // Search functionality with debounce
  let searchTimeout;
  window.handleSearch = (event) => {
    clearTimeout(searchTimeout);
    const query = event.target.value.trim();
    
    if (query.length < 2) {
      document.getElementById('search-suggestions').style.display = 'none';
      return;
    }
    
    searchTimeout = setTimeout(() => {
      // Show search suggestions
      const suggestions = state.products
        .filter(p => getProductTitle(p).toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
        .map(p => ({
          id: p.id,
          title: getProductTitle(p),
          price: p.price,
          image: p.img
        }));
        
      const suggestionsEl = document.getElementById('search-suggestions');
      if (suggestions.length > 0) {
        suggestionsEl.innerHTML = suggestions.map(s => `
          <div onclick="location.hash='#/pdp/${s.id}'; hideSuggestions()" class="search-suggestion">
            <img src="${uns(s.image, 50)}" alt="${s.title}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
            <div>
              <div style="font-weight: 500; font-size: 14px;">${s.title}</div>
              <div style="color: var(--primary); font-weight: 600;">${fmtSAR(s.price)}</div>
            </div>
          </div>
        `).join('');
        suggestionsEl.style.display = 'block';
      } else {
        suggestionsEl.style.display = 'none';
      }
    }, 300);
  };

  window.performSearch = (event) => {
    if (event.key === 'Enter' || event.type === 'click') {
      const query = document.getElementById('search-input').value.trim();
      if (query) {
        navigate(`#/search?q=${encodeURIComponent(query)}`);
        hideSuggestions();
      }
    }
  };

  window.hideSuggestions = () => {
    document.getElementById('search-suggestions').style.display = 'none';
  };

  // Make functions globally available
  window.trackRecommendationClick = (productId, reason) => {
    actions.trackUserInteraction('recommendation_click', { productId, reason });
  };
  
  window.refreshRecommendations = () => {
    location.reload();
  };

  window.navigateToCategory = (categoryId) => {
    navigate(`#/discover?category=${categoryId}`);
  };

  window.refreshBadges = () => {
    // Update cart badge in navigation
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
      cartBadge.textContent = state.cart?.length || 0;
    }
  };

  el.innerHTML = h(`
    <div class="home-container">
      <!-- Search Header -->
      <div class="search-header">
        <div class="welcome-section">
          <h1>
            ${t("welcome_back") || "مرحباً بعودتك"} ${state.user.name || ""}! 👋
          </h1>
          <p>${t("home_subtitle") || "اكتشف منتجات جديدة ومثيرة اليوم"}</p>
        </div>
        
        <div class="search-container">
          <div class="search-box">
            <input type="text" 
                   id="search-input"
                   placeholder="${t("search_products") || "ابحث عن المنتجات..."}"
                   oninput="handleSearch(event)"
                   onkeypress="performSearch(event)"
                   autocomplete="off">
            <button onclick="performSearch(event)" class="search-button" aria-label="${t("search") || "بحث"}">
              🔍
            </button>
          </div>
          <div id="search-suggestions" class="search-suggestions"></div>
        </div>
      </div>

      <!-- Quick Stats Cards -->
      <div class="quick-stats">
        <div onclick="navigate('#/cart')" class="stat-card cart-card">
          <div class="stat-icon">🛒</div>
          <div class="stat-content">
            <div class="stat-number">${state.cart?.length || 0}</div>
            <div class="stat-label">${t("cart_items") || "في السلة"}</div>
          </div>
        </div>
        <div onclick="navigate('#/wishlist')" class="stat-card wishlist-card">
          <div class="stat-icon">❤️</div>
          <div class="stat-content">
            <div class="stat-number">${wishlistCount}</div>
            <div class="stat-label">${t("wishlist_items") || "في المفضلة"}</div>
          </div>
        </div>
        <div onclick="navigate('#/profile')" class="stat-card orders-card">
          <div class="stat-icon">📦</div>
          <div class="stat-content">
            <div class="stat-number">${state.orders?.length || 0}</div>
            <div class="stat-label">${t("total_orders") || "إجمالي الطلبات"}</div>
          </div>
        </div>
        <div onclick="navigate('#/discover')" class="stat-card discover-card">
          <div class="stat-icon">🔍</div>
          <div class="stat-content">
            <div class="stat-number">${formatNumber(state.products?.length || 0)}</div>
            <div class="stat-label">${t("products") || "منتجات"}</div>
          </div>
        </div>
      </div>

      <!-- Categories Grid -->
      <section class="categories-section">
        <h2>${t("shop_by_category") || "تسوق حسب الفئة"}</h2>
        <div class="categories-grid">
          ${quickCategories.map(category => `
            <div onclick="navigateToCategory('${category.id}')" class="category-card">
              <div class="category-icon">${category.icon}</div>
              <div class="category-name">${category.name}</div>
              <div class="category-count">${category.count}</div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Price Drop Alerts -->
      ${priceDrops.length > 0 ? `
        <section class="price-drops-section">
          <div class="section-header">
            <h2>⚡ ${t("price_dropped") || "انخفضت الأسعار"}</h2>
            <span class="items-count">${priceDrops.length} ${t("items")}</span>
          </div>
          <div class="products-grid">
            ${priceDrops.slice(0, 6).map(product => `
              <div onclick="location.hash='#/pdp/${product.id}'; trackRecommendationClick('${product.id}', 'price_drop')" 
                   class="product-card price-drop-card">
                <div class="product-badge discount-badge">-${product.discount}%</div>
                <img src="${uns(product.img, 300)}" alt="${getProductTitle(product)}" class="product-image" loading="lazy">
                <div class="product-info">
                  <h4 class="product-title">${getProductTitle(product)}</h4>
                  <div class="product-pricing">
                    <span class="current-price">${fmtSAR(product.price)}</span>
                    <span class="original-price">${fmtSAR(product.originalPrice)}</span>
                  </div>
                  <div class="product-creator">${t("by_creator")} @${creatorById(product.creatorId)?.name}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Personalized For You -->
      ${personalizedProducts.length > 0 ? `
        <section class="personalized-section">
          <div class="section-header">
            <h2>
              🤖 ${t("for_you_feed") || "مختارات لك"}
              <span class="ai-badge">${t("ai_curated") || "منسقة بالذكاء الاصطناعي"}</span>
            </h2>
            <button onclick="refreshRecommendations()" class="refresh-button">
              🔄 ${t("refresh_recommendations") || "تحديث"}
            </button>
          </div>
          <div class="products-grid">
            ${personalizedProducts.map(product => `
              <div onclick="location.hash='#/pdp/${product.id}'; trackRecommendationClick('${product.id}', 'personalized')" 
                   class="product-card personalized-card">
                <div class="product-badge match-badge">${Math.round(product.personalizedScore)}% ${t("match") || "مطابقة"}</div>
                <img src="${uns(product.img, 300)}" alt="${getProductTitle(product)}" class="product-image" loading="lazy">
                <div class="product-info">
                  <h4 class="product-title">${getProductTitle(product)}</h4>
                  <div class="product-pricing">
                    <span class="current-price">${fmtSAR(product.price)}</span>
                    ${product.originalPrice > product.price ? `<span class="original-price">${fmtSAR(product.originalPrice)}</span>` : ''}
                  </div>
                  <div class="product-creator">${t("by_creator")} @${creatorById(product.creatorId)?.name}</div>
                  <button onclick="event.stopPropagation(); addToCart('${product.id}')" class="add-to-cart-btn">
                    ${t("add_to_cart") || "أضف للسلة"}
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Trending Now -->
      ${trendingProducts.length > 0 ? `
        <section class="trending-section">
          <div class="section-header">
            <h2>
              📈 ${t("trending_now") || "الأكثر رواجاً"}
              <span class="trending-badge">${t("popular_in_saudi") || "الأشهر في السعودية"}</span>
            </h2>
            <button onclick="navigate('#/discover')" class="view-all-button">
              ${t("view_all") || "عرض الكل"} →
            </button>
          </div>
          <div class="products-grid">
            ${trendingProducts.map((product, index) => `
              <div onclick="location.hash='#/pdp/${product.id}'; trackRecommendationClick('${product.id}', 'trending')" 
                   class="product-card trending-card">
                <div class="product-badge trending-badge">#${index + 1}</div>
                <img src="${uns(product.img, 300)}" alt="${getProductTitle(product)}" class="product-image" loading="lazy">
                <div class="product-info">
                  <h4 class="product-title">${getProductTitle(product)}</h4>
                  <div class="product-pricing">
                    <span class="current-price">${fmtSAR(product.price)}</span>
                    ${product.originalPrice > product.price ? `<span class="original-price">${fmtSAR(product.originalPrice)}</span>` : ''}
                  </div>
                  <div class="product-creator">${t("by_creator")} @${creatorById(product.creatorId)?.name}</div>
                  <div class="engagement-score">
                    🔥 ${Math.round(product.trendingScore)} ${t("engagement_points") || "نقاط التفاعل"}
                  </div>
                  <button onclick="event.stopPropagation(); addToCart('${product.id}')" class="add-to-cart-btn">
                    ${t("add_to_cart") || "أضف للسلة"}
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Recently Viewed -->
      ${recentlyViewed.length > 0 ? `
        <section class="recent-section">
          <div class="section-header">
            <h2>👁️ ${t("recently_viewed") || "شاهدت مؤخراً"}</h2>
          </div>
          <div class="products-grid horizontal-scroll">
            ${recentlyViewed.map(product => `
              <div onclick="location.hash='#/pdp/${product.id}'" class="product-card recent-card">
                <img src="${uns(product.img, 300)}" alt="${getProductTitle(product)}" class="product-image" loading="lazy">
                <div class="product-info">
                  <h4 class="product-title">${getProductTitle(product)}</h4>
                  <div class="product-pricing">
                    <span class="current-price">${fmtSAR(product.price)}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Recommended Creators -->
      ${recommendedCreators.length > 0 ? `
        <section class="creators-section">
          <div class="section-header">
            <h2>⭐ ${t("recommended_creators") || "منشئون موصى بهم"}</h2>
          </div>
          <div class="creators-grid">
            ${recommendedCreators.map(creator => `
              <div onclick="navigate('#/creator/${creator.id}')" class="creator-card">
                <img src="${uns(creator.avatar, 100)}" alt="${creator.name}" class="creator-avatar">
                <div class="creator-info">
                  <h4 class="creator-name">@${creator.name}</h4>
                  <p class="creator-description">${creator.description}</p>
                  <div class="creator-stats">
                    <span>${formatNumber(creator.followers)} ${t("followers") || "متابع"}</span>
                    <span>${creator.productsCount} ${t("products") || "منتجات"}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}
    </div>

    <style>
      .home-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }

      .search-header {
        margin-bottom: 32px;
      }

      .welcome-section h1 {
        font-size: clamp(1.75rem, 4vw, 2.5rem);
        font-weight: 700;
        margin-bottom: 8px;
        color: var(--text-primary);
      }

      .welcome-section p {
        color: var(--text-muted);
        font-size: 1.1rem;
        margin-bottom: 24px;
      }

      .search-container {
        position: relative;
        max-width: 600px;
      }

      .search-box {
        display: flex;
        background: var(--card);
        border: 2px solid var(--border);
        border-radius: 25px;
        overflow: hidden;
        transition: all 0.3s ease;
      }

      .search-box:focus-within {
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .search-box input {
        flex: 1;
        padding: 16px 20px;
        border: none;
        background: transparent;
        font-size: 16px;
        color: var(--text-primary);
      }

      .search-box input::placeholder {
        color: var(--text-muted);
      }

      .search-box input:focus {
        outline: none;
      }

      .search-button {
        padding: 16px 20px;
        background: var(--primary);
        color: white;
        border: none;
        cursor: pointer;
        transition: background 0.3s ease;
      }

      .search-button:hover {
        background: var(--primary-dark);
      }

      .search-suggestions {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        margin-top: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        z-index: 100;
        display: none;
        max-height: 300px;
        overflow-y: auto;
      }

      .search-suggestion {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        cursor: pointer;
        transition: background 0.2s ease;
        border-bottom: 1px solid var(--border);
      }

      .search-suggestion:last-child {
        border-bottom: none;
      }

      .search-suggestion:hover {
        background: var(--hover);
      }

      .quick-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 16px;
        margin-bottom: 40px;
      }

      .stat-card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 16px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .stat-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--primary), var(--secondary));
      }

      .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.1);
      }

      .cart-card::before { background: linear-gradient(90deg, #ff6b6b, #ff8e8e); }
      .wishlist-card::before { background: linear-gradient(90deg, #4ecdc4, #6bcf7f); }
      .orders-card::before { background: linear-gradient(90deg, #a8e6cf, #7fcdcd); }
      .discover-card::before { background: linear-gradient(90deg, #667eea, #764ba2); }

      .stat-icon {
        font-size: 2rem;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--primary-light);
        border-radius: 12px;
      }

      .stat-content {
        flex: 1;
      }

      .stat-number {
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: 4px;
      }

      .stat-label {
        color: var(--text-muted);
        font-size: 0.9rem;
      }

      .categories-section {
        margin-bottom: 40px;
      }

      .categories-section h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 20px;
        color: var(--text-primary);
      }

      .categories-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 16px;
      }

      .category-card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .category-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        border-color: var(--primary);
      }

      .category-icon {
        font-size: 2.5rem;
        margin-bottom: 12px;
      }

      .category-name {
        font-weight: 600;
        margin-bottom: 6px;
        color: var(--text-primary);
      }

      .category-count {
        font-size: 0.85rem;
        color: var(--text-muted);
      }

      section {
        margin-bottom: 48px;
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        flex-wrap: wrap;
        gap: 12px;
      }

      .section-header h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }

      .ai-badge, .trending-badge {
        background: var(--primary);
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.7rem;
        font-weight: 500;
      }

      .trending-badge {
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
      }

      .items-count {
        background: var(--primary-light);
        color: var(--primary);
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
      }

      .refresh-button, .view-all-button {
        background: none;
        border: 1px solid var(--primary);
        color: var(--primary);
        padding: 8px 16px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s ease;
      }

      .refresh-button:hover, .view-all-button:hover {
        background: var(--primary);
        color: white;
      }

      .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
      }

      .products-grid.horizontal-scroll {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        overflow-x: auto;
        padding-bottom: 8px;
      }

      .product-card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
      }

      .product-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        border-color: var(--primary-light);
      }

      .product-badge {
        position: absolute;
        top: 8px;
        left: 8px;
        color: white;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 600;
        z-index: 1;
      }

      .discount-badge {
        background: #ff4757;
      }

      .match-badge {
        background: var(--primary);
      }

      .trending-badge {
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
      }

      .product-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
      }

      .product-info {
        padding: 16px;
      }

      .product-title {
        font-weight: 600;
        font-size: 0.95rem;
        line-height: 1.3;
        margin-bottom: 8px;
        color: var(--text-primary);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .product-pricing {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }

      .current-price {
        font-weight: 700;
        color: var(--primary);
        font-size: 1.1rem;
      }

      .original-price {
        text-decoration: line-through;
        color: var(--text-muted);
        font-size: 0.9rem;
      }

      .product-creator {
        font-size: 0.8rem;
        color: var(--text-muted);
        margin-bottom: 12px;
      }

      .engagement-score {
        font-size: 0.75rem;
        color: var(--success);
        margin-bottom: 8px;
      }

      .add-to-cart-btn {
        width: 100%;
        background: var(--primary);
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.85rem;
        font-weight: 500;
        transition: background 0.3s ease;
      }

      .add-to-cart-btn:hover {
        background: var(--primary-dark);
      }

      .creators-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
      }

      .creator-card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 16px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .creator-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        border-color: var(--primary);
      }

      .creator-avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        object-fit: cover;
      }

      .creator-info {
        flex: 1;
      }

      .creator-name {
        font-weight: 600;
        margin-bottom: 4px;
        color: var(--text-primary);
      }

      .creator-description {
        font-size: 0.9rem;
        color: var(--text-muted);
        margin-bottom: 8px;
        line-height: 1.3;
      }

      .creator-stats {
        display: flex;
        gap: 16px;
        font-size: 0.8rem;
        color: var(--text-muted);
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .home-container {
          padding: 16px;
        }

        .quick-stats {
          grid-template-columns: repeat(2, 1fr);
        }

        .categories-grid {
          grid-template-columns: repeat(3, 1fr);
        }

        .products-grid {
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 12px;
        }

        .section-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .creator-card {
          flex-direction: column;
          text-align: center;
        }

        .search-container {
          max-width: 100%;
        }
      }

      /* RTL Support */
      [dir="rtl"] .section-header {
        flex-direction: row-reverse;
      }

      [dir="rtl"] .stat-card {
        flex-direction: row-reverse;
      }

      [dir="rtl"] .creator-card {
        flex-direction: row-reverse;
      }

      [dir="rtl"] .search-suggestions {
        text-align: right;
      }
    </style>
  `);
};
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
                <img src="${uns(product.img, 300)}" alt="${getProductTitle(product)}" style="width: 100%; height: 180px; object-fit: cover;" loading="lazy">
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

const discover = ({ el, state, actions, navigate }) => {
  // Get URL parameters for filters and search
  const urlParams = new URLSearchParams(location.hash.split('?')[1] || '');
  const category = urlParams.get('category') || '';
  const searchQuery = urlParams.get('q') || '';
  const sortBy = urlParams.get('sort') || 'relevance';
  const viewMode = urlParams.get('view') || 'grid';
  
  // Filter and sort products
  let filteredProducts = state.products || [];
  
  // Apply category filter
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  
  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      getProductTitle(p).toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query) ||
      p.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  // Apply sorting
  switch (sortBy) {
    case 'price_low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price_high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case 'newest':
      filteredProducts.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      break;
    case 'popular':
      filteredProducts.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      break;
    default: // relevance
      // Keep original order or apply relevance scoring
      break;
  }
  
  // Pagination
  const itemsPerPage = 20;
  const currentPage = parseInt(urlParams.get('page') || '1');
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  
  // Categories for filter
  const categories = [
    { id: 'electronics', name: t('electronics') || 'إلكترونيات', icon: '📱' },
    { id: 'fashion', name: t('fashion') || 'أزياء', icon: '👗' },
    { id: 'home', name: t('home_garden') || 'منزل وحديقة', icon: '🏠' },
    { id: 'beauty', name: t('beauty') || 'جمال', icon: '💄' },
    { id: 'sports', name: t('sports') || 'رياضة', icon: '⚽' },
    { id: 'books', name: t('books') || 'كتب', icon: '📚' }
  ];
  
  // Price ranges for filters
  const priceRanges = [
    { min: 0, max: 100, label: t('under_100') || 'تحت 100 ر.س' },
    { min: 100, max: 500, label: t('100_to_500') || '100 - 500 ر.س' },
    { min: 500, max: 1000, label: t('500_to_1000') || '500 - 1000 ر.س' },
    { min: 1000, max: null, label: t('over_1000') || 'فوق 1000 ر.س' }
  ];

  // Track page view
  actions.trackUserInteraction('page_view', { 
    page: 'discover', 
    category, 
    searchQuery, 
    resultsCount: filteredProducts.length 
  });

  // Search functionality with debounce
  let searchTimeout;
  window.handleDiscoverSearch = (value) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const newUrl = new URLSearchParams();
      if (value.trim()) newUrl.set('q', value.trim());
      if (category) newUrl.set('category', category);
      if (sortBy !== 'relevance') newUrl.set('sort', sortBy);
      if (viewMode !== 'grid') newUrl.set('view', viewMode);
      
      const queryString = newUrl.toString();
      navigate(`#/discover${queryString ? '?' + queryString : ''}`);
    }, 300);
  };

  window.applyFilter = (filterType, value) => {
    const newUrl = new URLSearchParams(location.hash.split('?')[1] || '');
    
    switch (filterType) {
      case 'category':
        if (value === category) {
          newUrl.delete('category'); // Remove if same category clicked
        } else {
          newUrl.set('category', value);
        }
        break;
      case 'sort':
        if (value === 'relevance') {
          newUrl.delete('sort');
        } else {
          newUrl.set('sort', value);
        }
        break;
      case 'view':
        if (value === 'grid') {
          newUrl.delete('view');
        } else {
          newUrl.set('view', value);
        }
        break;
    }
    
    newUrl.delete('page'); // Reset to page 1
    const queryString = newUrl.toString();
    navigate(`#/discover${queryString ? '?' + queryString : ''}`);
  };

  window.clearAllFilters = () => {
    navigate('#/discover');
  };

  window.goToPage = (page) => {
    const newUrl = new URLSearchParams(location.hash.split('?')[1] || '');
    if (page === 1) {
      newUrl.delete('page');
    } else {
      newUrl.set('page', page.toString());
    }
    
    const queryString = newUrl.toString();
    navigate(`#/discover${queryString ? '?' + queryString : ''}`);
    
    // Scroll to top
    window.scrollTo(0, 0);
  };

  window.loadMoreProducts = () => {
    // For infinite scroll implementation
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      window.goToPage(nextPage);
    }
  };

  el.innerHTML = h(`
    <div class="discover-container">
      <!-- Header -->
      <div class="discover-header">
        <div class="header-content">
          <h1>${t('discover') || 'اكتشف'}</h1>
          <p>${t('discover_subtitle') || 'اكتشف منتجات مذهلة من أفضل المنشئين'}</p>
        </div>
        
        <!-- Search Bar -->
        <div class="search-section">
          <div class="search-input-container">
            <input 
              type="text" 
              id="discover-search"
              placeholder="${t('search_products') || 'ابحث عن المنتجات...'}"
              value="${searchQuery}"
              oninput="handleDiscoverSearch(this.value)"
              class="search-input">
            <button class="search-icon">🔍</button>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="filters-section">
        <!-- Categories Filter -->
        <div class="filter-group">
          <h3>${t('categories') || 'الفئات'}</h3>
          <div class="categories-filter">
            <button onclick="applyFilter('category', '')" 
                    class="category-chip ${!category ? 'active' : ''}">
              ${t('all') || 'الكل'}
            </button>
            ${categories.map(cat => `
              <button onclick="applyFilter('category', '${cat.id}')" 
                      class="category-chip ${category === cat.id ? 'active' : ''}">
                ${cat.icon} ${cat.name}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Sort and View Controls -->
        <div class="controls-section">
          <div class="sort-controls">
            <label>${t('sort_by') || 'ترتيب حسب'}:</label>
            <select onchange="applyFilter('sort', this.value)" class="sort-select">
              <option value="relevance" ${sortBy === 'relevance' ? 'selected' : ''}>${t('relevance') || 'الصلة'}</option>
              <option value="newest" ${sortBy === 'newest' ? 'selected' : ''}>${t('newest') || 'الأحدث'}</option>
              <option value="popular" ${sortBy === 'popular' ? 'selected' : ''}>${t('most_popular') || 'الأكثر شعبية'}</option>
              <option value="price_low" ${sortBy === 'price_low' ? 'selected' : ''}>${t('price_low_to_high') || 'السعر: من الأقل للأعلى'}</option>
              <option value="price_high" ${sortBy === 'price_high' ? 'selected' : ''}>${t('price_high_to_low') || 'السعر: من الأعلى للأقل'}</option>
              <option value="rating" ${sortBy === 'rating' ? 'selected' : ''}>${t('highest_rated') || 'الأعلى تقييماً'}</option>
            </select>
          </div>
          
          <div class="view-controls">
            <button onclick="applyFilter('view', 'grid')" 
                    class="view-button ${viewMode === 'grid' ? 'active' : ''}"
                    title="${t('grid_view') || 'عرض شبكي'}">
              ▦
            </button>
            <button onclick="applyFilter('view', 'list')" 
                    class="view-button ${viewMode === 'list' ? 'active' : ''}"
                    title="${t('list_view') || 'عرض قائمة'}">
              ☰
            </button>
          </div>
          
          <div class="results-count">
            ${filteredProducts.length} ${t('products_found') || 'منتج موجود'}
          </div>
        </div>

        <!-- Active Filters -->
        ${(category || searchQuery) ? `
          <div class="active-filters">
            <span class="filters-label">${t('active_filters') || 'المرشحات النشطة'}:</span>
            ${searchQuery ? `
              <span class="filter-tag">
                ${t('search') || 'بحث'}: "${searchQuery}"
                <button onclick="handleDiscoverSearch('')">×</button>
              </span>
            ` : ''}
            ${category ? `
              <span class="filter-tag">
                ${t('category') || 'الفئة'}: ${categories.find(c => c.id === category)?.name || category}
                <button onclick="applyFilter('category', '')">×</button>
              </span>
            ` : ''}
            <button onclick="clearAllFilters()" class="clear-all-filters">
              ${t('clear_all') || 'مسح الكل'}
            </button>
          </div>
        ` : ''}
      </div>

      <!-- Products Grid/List -->
      <div class="products-section">
        ${filteredProducts.length > 0 ? `
          <div class="products-grid ${viewMode}">
            ${paginatedProducts.map(product => `
              <div onclick="location.hash='#/pdp/${product.id}'" 
                   class="product-card ${viewMode}">
                <div class="product-image-container">
                  <img src="${uns(product.img, 300)}" 
                       alt="${getProductTitle(product)}" 
                       class="product-image"
                       loading="lazy">
                  ${product.discount > 0 ? `
                    <div class="discount-badge">-${product.discount}%</div>
                  ` : ''}
                  <button onclick="event.stopPropagation(); toggleWishlist('${product.id}')" 
                          class="wishlist-button ${state.wishlist?.items?.includes(product.id) ? 'active' : ''}"
                          title="${t('add_to_wishlist') || 'أضف للمفضلة'}">
                    ♡
                  </button>
                </div>
                
                <div class="product-info">
                  <h3 class="product-title">${getProductTitle(product)}</h3>
                  <div class="product-creator">${t('by_creator') || 'من'} @${creatorById(product.creatorId)?.name}</div>
                  
                  <div class="product-rating">
                    <span class="stars">${stars(product.rating)}</span>
                    <span class="rating-count">(${product.reviewCount || 0})</span>
                  </div>
                  
                  <div class="product-pricing">
                    <span class="current-price">${fmtSAR(product.price)}</span>
                    ${product.originalPrice > product.price ? `
                      <span class="original-price">${fmtSAR(product.originalPrice)}</span>
                    ` : ''}
                  </div>
                  
                  ${viewMode === 'list' ? `
                    <p class="product-description">${product.description || t('no_description')}</p>
                  ` : ''}
                  
                  <button onclick="event.stopPropagation(); addToCart('${product.id}')" 
                          class="add-to-cart-btn">
                    ${t('add_to_cart') || 'أضف للسلة'}
                  </button>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Pagination -->
          ${totalPages > 1 ? `
            <div class="pagination">
              <button onclick="goToPage(${currentPage - 1})" 
                      ${currentPage === 1 ? 'disabled' : ''} 
                      class="pagination-button">
                ‹ ${t('previous') || 'السابق'}
              </button>
              
              <div class="page-numbers">
                ${Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                  const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return `
                    <button onclick="goToPage(${page})" 
                            class="page-number ${page === currentPage ? 'active' : ''}"
                            ${page === currentPage ? 'disabled' : ''}>
                      ${page}
                    </button>
                  `;
                }).join('')}
              </div>
              
              <button onclick="goToPage(${currentPage + 1})" 
                      ${currentPage === totalPages ? 'disabled' : ''} 
                      class="pagination-button">
                ${t('next') || 'التالي'} ›
              </button>
            </div>
          ` : ''}

          <!-- Load More Button (Alternative to pagination) -->
          ${currentPage < totalPages ? `
            <div class="load-more-section">
              <button onclick="loadMoreProducts()" class="load-more-button">
                ${t('load_more') || 'تحميل المزيد'} (${filteredProducts.length - startIndex - paginatedProducts.length} ${t('remaining') || 'متبقي'})
              </button>
            </div>
          ` : ''}
        ` : `
          <div class="no-results">
            <div class="no-results-icon">🔍</div>
            <h3>${t('no_products_found') || 'لم يتم العثور على منتجات'}</h3>
            <p>${t('try_different_search') || 'جرب البحث بكلمات مختلفة أو قم بتغيير المرشحات'}</p>
            ${(category || searchQuery) ? `
              <button onclick="clearAllFilters()" class="clear-filters-button">
                ${t('clear_filters') || 'مسح المرشحات'}
              </button>
            ` : ''}
          </div>
        `}
      </div>
    </div>

    <style>
      .discover-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }

      .discover-header {
        margin-bottom: 32px;
      }

      .header-content h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 8px;
        color: var(--text-primary);
      }

      .header-content p {
        color: var(--text-muted);
        font-size: 1.1rem;
        margin-bottom: 24px;
      }

      .search-section {
        max-width: 600px;
      }

      .search-input-container {
        display: flex;
        background: var(--card);
        border: 2px solid var(--border);
        border-radius: 25px;
        overflow: hidden;
        transition: all 0.3s ease;
      }

      .search-input-container:focus-within {
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .search-input {
        flex: 1;
        padding: 16px 20px;
        border: none;
        background: transparent;
        font-size: 16px;
        color: var(--text-primary);
      }

      .search-input::placeholder {
        color: var(--text-muted);
      }

      .search-input:focus {
        outline: none;
      }

      .search-icon {
        padding: 16px 20px;
        background: var(--primary);
        color: white;
        border: none;
        cursor: pointer;
      }

      .filters-section {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 32px;
      }

      .filter-group {
        margin-bottom: 24px;
      }

      .filter-group h3 {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 12px;
        color: var(--text-primary);
      }

      .categories-filter {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .category-chip {
        background: var(--card-secondary);
        border: 1px solid var(--border);
        color: var(--text-primary);
        padding: 8px 16px;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
      }

      .category-chip:hover {
        background: var(--primary-light);
        border-color: var(--primary);
      }

      .category-chip.active {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
      }

      .controls-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
      }

      .sort-controls {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .sort-controls label {
        font-weight: 500;
        color: var(--text-primary);
      }

      .sort-select {
        padding: 8px 12px;
        border: 1px solid var(--border);
        border-radius: 6px;
        background: var(--card);
        color: var(--text-primary);
        cursor: pointer;
      }

      .view-controls {
        display: flex;
        gap: 4px;
        background: var(--card-secondary);
        border-radius: 8px;
        padding: 4px;
      }

      .view-button {
        background: transparent;
        border: none;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1.2rem;
        transition: all 0.3s ease;
        color: var(--text-muted);
      }

      .view-button:hover,
      .view-button.active {
        background: var(--primary);
        color: white;
      }

      .results-count {
        font-weight: 500;
        color: var(--text-muted);
        font-size: 0.9rem;
      }

      .active-filters {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        padding-top: 16px;
        border-top: 1px solid var(--border);
      }

      .filters-label {
        font-weight: 500;
        color: var(--text-primary);
      }

      .filter-tag {
        background: var(--primary-light);
        color: var(--primary);
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .filter-tag button {
        background: none;
        border: none;
        color: var(--primary);
        cursor: pointer;
        font-weight: bold;
      }

      .clear-all-filters {
        background: var(--danger);
        color: white;
        border: none;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        cursor: pointer;
      }

      .products-section {
        margin-bottom: 40px;
      }

      .products-grid {
        display: grid;
        gap: 20px;
      }

      .products-grid.grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      }

      .products-grid.list {
        grid-template-columns: 1fr;
      }

      .product-card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
      }

      .product-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        border-color: var(--primary-light);
      }

      .product-card.list {
        display: flex;
        flex-direction: row;
      }

      .product-card.list .product-image-container {
        width: 200px;
        flex-shrink: 0;
      }

      .product-card.list .product-info {
        flex: 1;
        padding: 20px;
      }

      .product-image-container {
        position: relative;
        overflow: hidden;
      }

      .product-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      .product-card:hover .product-image {
        transform: scale(1.05);
      }

      .discount-badge {
        position: absolute;
        top: 8px;
        left: 8px;
        background: #ff4757;
        color: white;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 600;
        z-index: 1;
      }

      .wishlist-button {
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(255,255,255,0.9);
        border: none;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 1.2rem;
        transition: all 0.3s ease;
        z-index: 1;
      }

      .wishlist-button:hover,
      .wishlist-button.active {
        background: var(--danger);
        color: white;
      }

      .product-info {
        padding: 16px;
      }

      .product-title {
        font-weight: 600;
        font-size: 1rem;
        line-height: 1.3;
        margin-bottom: 8px;
        color: var(--text-primary);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .product-creator {
        font-size: 0.8rem;
        color: var(--text-muted);
        margin-bottom: 8px;
      }

      .product-rating {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-bottom: 8px;
      }

      .stars {
        color: #ffd700;
        font-size: 0.8rem;
      }

      .rating-count {
        font-size: 0.8rem;
        color: var(--text-muted);
      }

      .product-pricing {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
      }

      .current-price {
        font-weight: 700;
        color: var(--primary);
        font-size: 1.1rem;
      }

      .original-price {
        text-decoration: line-through;
        color: var(--text-muted);
        font-size: 0.9rem;
      }

      .product-description {
        font-size: 0.9rem;
        color: var(--text-muted);
        line-height: 1.4;
        margin-bottom: 12px;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .add-to-cart-btn {
        width: 100%;
        background: var(--primary);
        color: white;
        border: none;
        padding: 10px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        transition: background 0.3s ease;
      }

      .add-to-cart-btn:hover {
        background: var(--primary-dark);
      }

      .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        margin-top: 40px;
      }

      .pagination-button,
      .page-number {
        background: var(--card);
        border: 1px solid var(--border);
        color: var(--text-primary);
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .pagination-button:hover:not(:disabled),
      .page-number:hover:not(:disabled) {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
      }

      .page-number.active {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
      }

      .pagination-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .load-more-section {
        text-align: center;
        margin-top: 40px;
      }

      .load-more-button {
        background: var(--primary);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        transition: background 0.3s ease;
      }

      .load-more-button:hover {
        background: var(--primary-dark);
      }

      .no-results {
        text-align: center;
        padding: 80px 20px;
        color: var(--text-muted);
      }

      .no-results-icon {
        font-size: 4rem;
        margin-bottom: 20px;
      }

      .no-results h3 {
        font-size: 1.5rem;
        margin-bottom: 12px;
        color: var(--text-primary);
      }

      .no-results p {
        font-size: 1rem;
        margin-bottom: 24px;
        line-height: 1.5;
      }

      .clear-filters-button {
        background: var(--primary);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
      }

      .clear-filters-button:hover {
        background: var(--primary-dark);
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .discover-container {
          padding: 16px;
        }

        .controls-section {
          flex-direction: column;
          align-items: stretch;
        }

        .sort-controls,
        .view-controls {
          justify-content: center;
        }

        .products-grid.grid {
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        }

        .product-card.list {
          flex-direction: column;
        }

        .product-card.list .product-image-container {
          width: 100%;
        }

        .categories-filter {
          justify-content: center;
        }

        .pagination {
          flex-wrap: wrap;
        }
      }

      /* RTL Support */
      [dir="rtl"] .product-card.list {
        flex-direction: row-reverse;
      }

      [dir="rtl"] .controls-section {
        flex-direction: row-reverse;
      }

      [dir="rtl"] .active-filters {
        flex-direction: row-reverse;
      }
    </style>
  `);
};
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
  // Get mode from URL parameters (signin, signup, forgot)
  const urlParams = new URLSearchParams(location.hash.split('?')[1] || '');
  const mode = urlParams.get('mode') || 'signin';
  
  // Auth forms data from requirements
  const authForms = {
    signin: {
      fields: [
        { name: "email", type: "email", placeholder: t("email") || "البريد الإلكتروني", sample: "ahmed.almalki@example.com" },
        { name: "password", type: "password", placeholder: t("password") || "كلمة المرور", sample: "••••••••" }
      ],
      socialOptions: ["Google", "Apple", "Twitter"],
      forgotPasswordLink: "#/auth?mode=forgot"
    },
    signup: {
      fields: [
        { name: "firstName", type: "text", placeholder: t("first_name") || "الاسم الأول", sample: "أحمد" },
        { name: "lastName", type: "text", placeholder: t("last_name") || "اسم العائلة", sample: "المالكي" },
        { name: "email", type: "email", placeholder: t("email") || "البريد الإلكتروني", sample: "ahmed.almalki@example.com" },
        { name: "phone", type: "tel", placeholder: t("phone") || "رقم الجوال", sample: "+966 55 123 4567" },
        { name: "password", type: "password", placeholder: t("password") || "كلمة المرور", sample: "••••••••" },
        { name: "confirmPassword", type: "password", placeholder: t("confirm_password") || "تأكيد كلمة المرور", sample: "••••••••" }
      ],
      termsLink: "#/terms",
      privacyLink: "#/privacy"
    },
    forgot: {
      fields: [
        { name: "email", type: "email", placeholder: t("email") || "البريد الإلكتروني", sample: "ahmed.almalki@example.com" }
      ]
    }
  };

  // Global functions for interactivity
  window.handleQuickAuth = () => {
    // Set user as authenticated for demo purposes
    actions.setUserAuth && actions.setUserAuth(true);
    state.user = {
      id: 'demo_user_' + Date.now(),
      name: 'أحمد المالكي',
      email: 'ahmed.almalki@demo.com',
      isGuest: false
    };
    actions.saveState && actions.saveState();
    navigate("#/home");
  };

  window.handleFormAuth = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // Basic validation
    const form = authForms[mode];
    let isValid = true;
    let errorMessage = '';
    
    // Check required fields
    for (const field of form.fields) {
      if (!data[field.name] || data[field.name].trim() === '') {
        isValid = false;
        errorMessage = t("field_required") || `${field.placeholder} مطلوب`;
        break;
      }
    }
    
    // Mode-specific validation
    if (isValid) {
      switch (mode) {
        case 'signup':
          if (data.password !== data.confirmPassword) {
            isValid = false;
            errorMessage = t("passwords_dont_match") || "كلمات المرور غير متطابقة";
          }
          if (data.password.length < 6) {
            isValid = false;
            errorMessage = t("password_too_short") || "كلمة المرور قصيرة جداً (6 أحرف على الأقل)";
          }
          break;
        case 'signin':
          // Demo validation - accept any email/password combination
          break;
        case 'forgot':
          // Email validation for forgot password
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(data.email)) {
            isValid = false;
            errorMessage = t("invalid_email") || "البريد الإلكتروني غير صحيح";
          }
          break;
      }
    }
    
    if (!isValid) {
      alert(errorMessage);
      return;
    }
    
    // Handle successful submission
    switch (mode) {
      case 'signin':
        actions.setUserAuth && actions.setUserAuth(true);
        state.user = {
          id: 'user_' + Date.now(),
          name: data.firstName ? `${data.firstName} ${data.lastName}` : 'مستخدم',
          email: data.email,
          isGuest: false
        };
        actions.saveState && actions.saveState();
        navigate("#/home");
        break;
      case 'signup':
        actions.setUserAuth && actions.setUserAuth(true);
        state.user = {
          id: 'user_' + Date.now(),
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone,
          isGuest: false
        };
        actions.saveState && actions.saveState();
        alert(t("account_created_success") || "تم إنشاء الحساب بنجاح!");
        navigate("#/home");
        break;
      case 'forgot':
        alert(t("reset_link_sent") || "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
        navigate("#/auth?mode=signin");
        break;
    }
  };

  window.switchAuthMode = (newMode) => {
    navigate(`#/auth?mode=${newMode}`);
  };

  window.handleSocialAuth = (provider) => {
    // Demo social authentication
    alert(t("social_auth_demo") || `تسجيل الدخول عبر ${provider} (عرض توضيحي)`);
    actions.setUserAuth && actions.setUserAuth(true);
    state.user = {
      id: `${provider.toLowerCase()}_${Date.now()}`,
      name: 'مستخدم ' + provider,
      email: `user@${provider.toLowerCase()}.com`,
      isGuest: false,
      provider: provider.toLowerCase()
    };
    actions.saveState && actions.saveState();
    navigate("#/home");
  };

  // Get current form configuration
  const currentForm = authForms[mode];
  
  el.innerHTML = h(`
    <div class="auth-container">
      <!-- Skip to content link for accessibility -->
      <a href="#auth-form" class="skip-link" tabindex="1">
        ${t("skip_to_form") || "تخطي إلى النموذج"}
      </a>

      <!-- Back to landing -->
      <div class="auth-header">
        <button onclick="navigate('#/landing')" class="back-button" aria-label="${t("back_to_landing") || "العودة إلى الصفحة الرئيسية"}" tabindex="2">
          ← ${t("back") || "رجوع"}
        </button>
        <div class="language-selector">
          <button onclick="setLang('ar')" class="${getLang() === 'ar' ? 'active' : ''}" aria-label="${t("switch_to_arabic") || "التبديل إلى العربية"}" tabindex="3">
            العربية
          </button>
          <button onclick="setLang('en')" class="${getLang() === 'en' ? 'active' : ''}" aria-label="${t("switch_to_english") || "Switch to English"}" tabindex="4">
            English
          </button>
        </div>
      </div>

      <div class="auth-content">
        <!-- Logo -->
        <div class="auth-logo">
          <h1>StoreZ</h1>
          <p>${t("auth_subtitle") || "منصة التجارة الاجتماعية الرائدة"}</p>
        </div>

        <!-- Mode Switcher -->
        <div class="auth-mode-switcher" role="tablist" aria-label="${t("auth_modes") || "أنواع المصادقة"}">
          <button onclick="switchAuthMode('signin')" 
                  class="mode-button ${mode === 'signin' ? 'active' : ''}"
                  role="tab"
                  aria-selected="${mode === 'signin'}"
                  tabindex="5">
            ${t("sign_in") || "تسجيل الدخول"}
          </button>
          <button onclick="switchAuthMode('signup')" 
                  class="mode-button ${mode === 'signup' ? 'active' : ''}"
                  role="tab"
                  aria-selected="${mode === 'signup'}"
                  tabindex="6">
            ${t("sign_up") || "إنشاء حساب"}
          </button>
          ${mode === 'forgot' ? `
            <button onclick="switchAuthMode('forgot')" 
                    class="mode-button active"
                    role="tab"
                    aria-selected="true"
                    tabindex="7">
              ${t("forgot_password") || "نسيت كلمة المرور"}
            </button>
          ` : ''}
        </div>

        <!-- Quick Demo Login (only for signin) -->
        ${mode === 'signin' ? `
          <div class="quick-demo">
            <p>${t("demo_mode") || "الوضع التجريبي"}</p>
            <button onclick="handleQuickAuth()" class="demo-button" tabindex="8">
              🚀 ${t("quick_login") || "تسجيل دخول سريع (تجريبي)"}
            </button>
          </div>
          <div class="divider">
            <span>${t("or") || "أو"}</span>
          </div>
        ` : ''}

        <!-- Social Authentication (only for signin/signup) -->
        ${mode !== 'forgot' ? `
          <div class="social-auth">
            <h3>${t("continue_with") || "المتابعة باستخدام"}</h3>
            <div class="social-buttons">
              ${currentForm.socialOptions.map((provider, index) => `
                <button onclick="handleSocialAuth('${provider}')" 
                        class="social-button ${provider.toLowerCase()}"
                        aria-label="${t("sign_in_with") || "تسجيل الدخول عبر"} ${provider}"
                        tabindex="${9 + index}">
                  ${provider === 'Google' ? '🔍' : provider === 'Apple' ? '🍎' : '🐦'} ${provider}
                </button>
              `).join('')}
            </div>
          </div>
          <div class="divider">
            <span>${t("or") || "أو"}</span>
          </div>
        ` : ''}

        <!-- Main Form -->
        <form onsubmit="handleFormAuth(event)" class="auth-form" id="auth-form" role="form">
          <h2>
            ${mode === 'signin' ? (t("sign_in_to_account") || "تسجيل الدخول إلى حسابك") :
              mode === 'signup' ? (t("create_new_account") || "إنشاء حساب جديد") :
              (t("reset_password") || "إعادة تعيين كلمة المرور")}
          </h2>
          
          ${currentForm.fields.map((field, index) => `
            <div class="form-group">
              <label for="${field.name}">${field.placeholder}</label>
              <input type="${field.type}" 
                     id="${field.name}"
                     name="${field.name}" 
                     placeholder="${field.placeholder}"
                     required
                     autocomplete="${field.name === 'confirmPassword' ? 'new-password' : field.name}"
                     tabindex="${mode === 'signin' ? 12 + index : mode === 'forgot' ? 9 + index : 12 + index}"
                     aria-describedby="${field.name}-hint">
              ${field.name === 'password' && mode === 'signup' ? `
                <small id="${field.name}-hint" class="form-hint">
                  ${t("password_requirements") || "6 أحرف على الأقل"}
                </small>
              ` : ''}
            </div>
          `).join('')}

          <!-- Terms and Privacy (signup only) -->
          ${mode === 'signup' ? `
            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" required tabindex="${12 + currentForm.fields.length}">
                <span class="checkmark"></span>
                ${t("agree_to_terms") || "أوافق على"} 
                <a href="${currentForm.termsLink}" target="_blank">${t("terms_of_service") || "شروط الخدمة"}</a>
                ${t("and") || "و"}
                <a href="${currentForm.privacyLink}" target="_blank">${t("privacy_policy") || "سياسة الخصوصية"}</a>
              </label>
            </div>
          ` : ''}

          <!-- Submit Button -->
          <button type="submit" class="submit-button" tabindex="${mode === 'signup' ? 13 + currentForm.fields.length : mode === 'signin' ? 12 + currentForm.fields.length : 10 + currentForm.fields.length}">
            ${mode === 'signin' ? (t("sign_in") || "تسجيل الدخول") :
              mode === 'signup' ? (t("create_account") || "إنشاء حساب") :
              (t("send_reset_link") || "إرسال رابط الإعادة")}
          </button>
        </form>

        <!-- Footer Links -->
        <div class="auth-footer">
          ${mode === 'signin' ? `
            <p>
              ${t("no_account") || "ليس لديك حساب؟"} 
              <a href="#" onclick="switchAuthMode('signup'); return false;">${t("sign_up") || "إنشاء حساب"}</a>
            </p>
            <p>
              <a href="#" onclick="switchAuthMode('forgot'); return false;">${t("forgot_password") || "نسيت كلمة المرور؟"}</a>
            </p>
          ` : mode === 'signup' ? `
            <p>
              ${t("have_account") || "لديك حساب بالفعل؟"} 
              <a href="#" onclick="switchAuthMode('signin'); return false;">${t("sign_in") || "تسجيل الدخول"}</a>
            </p>
          ` : `
            <p>
              ${t("remember_password") || "تذكرت كلمة المرور؟"} 
              <a href="#" onclick="switchAuthMode('signin'); return false;">${t("sign_in") || "تسجيل الدخول"}</a>
            </p>
          `}
        </div>
      </div>
    </div>

    <style>
      .auth-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        flex-direction: column;
      }

      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
      }

      .skip-link:focus {
        top: 6px;
      }

      .auth-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
      }

      .back-button {
        background: rgba(255,255,255,0.2);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
      }

      .back-button:hover,
      .back-button:focus {
        background: rgba(255,255,255,0.3);
        outline: 2px solid rgba(255,255,255,0.3);
        outline-offset: 2px;
      }

      .language-selector {
        display: flex;
        gap: 8px;
      }

      .language-selector button {
        padding: 8px 16px;
        border: 2px solid rgba(255,255,255,0.3);
        background: rgba(255,255,255,0.1);
        color: white;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
      }

      .language-selector button:hover,
      .language-selector button:focus {
        background: rgba(255,255,255,0.2);
        border-color: rgba(255,255,255,0.5);
        outline: 2px solid rgba(255,255,255,0.3);
        outline-offset: 2px;
      }

      .language-selector button.active {
        background: white;
        color: var(--primary);
        border-color: white;
      }

      .auth-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        max-width: 500px;
        margin: 0 auto;
        width: 100%;
      }

      .auth-logo {
        text-align: center;
        margin-bottom: 40px;
      }

      .auth-logo h1 {
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 10px;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      }

      .auth-logo p {
        opacity: 0.9;
        font-size: 1.1rem;
      }

      .auth-mode-switcher {
        display: flex;
        background: rgba(255,255,255,0.1);
        border-radius: 30px;
        padding: 4px;
        margin-bottom: 30px;
        backdrop-filter: blur(10px);
      }

      .mode-button {
        background: transparent;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 26px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
        white-space: nowrap;
      }

      .mode-button:hover,
      .mode-button:focus {
        background: rgba(255,255,255,0.1);
        outline: 2px solid rgba(255,255,255,0.3);
        outline-offset: 2px;
      }

      .mode-button.active {
        background: white;
        color: var(--primary, #667eea);
      }

      .quick-demo {
        background: rgba(255,255,255,0.1);
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        margin-bottom: 20px;
        backdrop-filter: blur(10px);
        width: 100%;
      }

      .demo-button {
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 600;
        margin-top: 10px;
      }

      .demo-button:hover,
      .demo-button:focus {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        outline: 2px solid rgba(255,255,255,0.3);
        outline-offset: 2px;
      }

      .divider {
        position: relative;
        text-align: center;
        margin: 20px 0;
        width: 100%;
      }

      .divider::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background: rgba(255,255,255,0.3);
      }

      .divider span {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 0 15px;
        opacity: 0.8;
      }

      .social-auth {
        width: 100%;
        text-align: center;
        margin-bottom: 20px;
      }

      .social-auth h3 {
        margin-bottom: 15px;
        opacity: 0.9;
      }

      .social-buttons {
        display: flex;
        gap: 10px;
        justify-content: center;
        flex-wrap: wrap;
      }

      .social-button {
        background: rgba(255,255,255,0.2);
        color: white;
        border: 2px solid rgba(255,255,255,0.3);
        padding: 12px 20px;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .social-button:hover,
      .social-button:focus {
        background: rgba(255,255,255,0.3);
        border-color: rgba(255,255,255,0.5);
        outline: 2px solid rgba(255,255,255,0.3);
        outline-offset: 2px;
      }

      .auth-form {
        background: rgba(255,255,255,0.1);
        border-radius: 20px;
        padding: 30px;
        width: 100%;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
      }

      .auth-form h2 {
        text-align: center;
        margin-bottom: 25px;
        font-size: 1.5rem;
      }

      .form-group {
        margin-bottom: 20px;
      }

      .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        opacity: 0.9;
      }

      .form-group input {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 10px;
        background: rgba(255,255,255,0.1);
        color: white;
        font-size: 16px;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      }

      .form-group input::placeholder {
        color: rgba(255,255,255,0.6);
      }

      .form-group input:focus {
        outline: none;
        border-color: rgba(255,255,255,0.6);
        background: rgba(255,255,255,0.15);
        box-shadow: 0 0 0 3px rgba(255,255,255,0.1);
      }

      .form-hint {
        display: block;
        margin-top: 5px;
        font-size: 14px;
        opacity: 0.8;
      }

      .checkbox-group {
        margin: 25px 0;
      }

      .checkbox-label {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        cursor: pointer;
        line-height: 1.5;
      }

      .checkbox-label input[type="checkbox"] {
        width: auto;
        margin: 0;
      }

      .checkbox-label a {
        color: #ffd700;
        text-decoration: none;
      }

      .checkbox-label a:hover,
      .checkbox-label a:focus {
        text-decoration: underline;
        outline: 2px solid rgba(255,255,255,0.3);
        outline-offset: 2px;
      }

      .submit-button {
        width: 100%;
        padding: 16px;
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 18px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 10px;
      }

      .submit-button:hover,
      .submit-button:focus {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        outline: 2px solid rgba(255,255,255,0.3);
        outline-offset: 2px;
      }

      .auth-footer {
        text-align: center;
        margin-top: 25px;
        opacity: 0.9;
      }

      .auth-footer p {
        margin: 10px 0;
      }

      .auth-footer a {
        color: #ffd700;
        text-decoration: none;
        font-weight: 500;
      }

      .auth-footer a:hover,
      .auth-footer a:focus {
        text-decoration: underline;
        outline: 2px solid rgba(255,255,255,0.3);
        outline-offset: 2px;
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .auth-header {
          padding: 15px;
        }

        .auth-content {
          padding: 15px;
        }

        .auth-logo h1 {
          font-size: 2.5rem;
        }

        .auth-form {
          padding: 20px;
        }

        .social-buttons {
          flex-direction: column;
        }

        .social-button {
          justify-content: center;
        }

        .mode-button {
          padding: 10px 16px;
          font-size: 14px;
        }
      }

      /* RTL Support */
      [dir="rtl"] .back-button {
        transform: scaleX(-1);
      }

      [dir="rtl"] .checkbox-label {
        flex-direction: row-reverse;
      }

      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        .auth-container {
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
        }
      }
    </style>
  `);
};

const pdp = ({ el, state, actions }, id) => {
  // Ensure we have a valid id
  if (!id) {
    el.innerHTML = h(`
      <div style="padding: 20px; text-align: center;">
        <h2>${t("product_not_found") || "المنتج غير موجود"}</h2>
        <p>${t("invalid_product_id") || "معرف المنتج غير صحيح"}</p>
        <button onclick="location.hash='#/home'" class="primary">
          ${t("back_to_home") || "العودة للرئيسية"}
        </button>
      </div>
    `);
    return;
  }

  const product = productById(id);
  if (!product) {
    el.innerHTML = h(`
      <div style="padding: 20px; text-align: center;">
        <h2>${t("product_not_found") || "المنتج غير موجود"}</h2>
        <p>${t("product_id_not_found") || `المنتج بالمعرف "${id}" غير موجود`}</p>
        <button onclick="location.hash='#/home'" class="primary">
          ${t("back_to_home") || "العودة للرئيسية"}
        </button>
      </div>
    `);
    return;
  }

  // Track product view
  actions.trackUserInteraction('product_view', { productId: id });
  actions.addToRecentlyViewed(id);

  // Get creator info
  const creator = creatorById(product.creatorId);
  
  // Enhanced product data
  const reviewStats = {
    average: product.rating || 4.5,
    count: product.reviewCount || Math.floor(Math.random() * 100) + 20,
    breakdown: {
      5: 0.65,
      4: 0.20,
      3: 0.10,
      2: 0.03,
      1: 0.02
    }
  };
  
  // Product gallery with multiple images
  const galleryImages = [
    product.img,
    `${product.img}-2`,
    `${product.img}-3`,
    `${product.img}-4`
  ];
  
  // State management
  let currentImageIndex = 0;
  let selectedColor = null;
  let selectedSize = null;
  let quantity = 1;
  let selectedTab = 'description';
  let reviewFilter = 'all';
  
  // Product variants/options
  const availableColors = product.colors || ['Red', 'Blue', 'Black', 'White'];
  const availableSizes = product.sizes || ['S', 'M', 'L', 'XL'];
  
  // Sample reviews
  const reviews = [
    {
      id: 1,
      user: "أحمد محمد",
      rating: 5,
      date: "2024-01-15",
      comment: "منتج ممتاز جداً، جودة عالية وسعر مناسب. أنصح بشرائه",
      verified: true,
      helpful: 15,
      images: [`${product.img}-review1`]
    },
    {
      id: 2,
      user: "فاطمة علي",
      rating: 4,
      date: "2024-01-10",
      comment: "المنتج جيد ولكن التوصيل كان متأخر قليلاً",
      verified: true,
      helpful: 8
    },
    {
      id: 3,
      user: "محمد أحمد",
      rating: 5,
      date: "2024-01-05",
      comment: "Amazing quality! Exactly as described. Fast shipping too.",
      verified: false,
      helpful: 12
    }
  ];
  
  // Global functions
  window.selectImage = (index) => {
    currentImageIndex = index;
    updateGallery();
  };
  
  window.previousImage = () => {
    currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : galleryImages.length - 1;
    updateGallery();
  };
  
  window.nextImage = () => {
    currentImageIndex = currentImageIndex < galleryImages.length - 1 ? currentImageIndex + 1 : 0;
    updateGallery();
  };
  
  window.selectColor = (color) => {
    selectedColor = color;
    updateVariantDisplay();
  };
  
  window.selectSize = (size) => {
    selectedSize = size;
    updateVariantDisplay();
  };
  
  window.updateQuantity = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      quantity = newQuantity;
      updateQuantityDisplay();
    }
  };
  
  window.selectTab = (tab) => {
    selectedTab = tab;
    updateTabContent();
  };
  
  window.filterReviews = (filter) => {
    reviewFilter = filter;
    updateReviewsDisplay();
  };
  
  window.addToCart = () => {
    const cartItem = {
      productId: id,
      quantity: quantity,
      color: selectedColor,
      size: selectedSize,
      price: product.price
    };
    
    actions.addToCart(cartItem);
    showNotification(t('added_to_cart') || 'تم إضافة المنتج للسلة', 'success');
  };
  
  window.buyNow = () => {
    window.addToCart();
    navigate('#/cart');
  };
  
  window.toggleWishlist = () => {
    actions.toggleWishlist(id);
    updateWishlistButton();
  };
  
  window.shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: getProductTitle(product),
        text: product.description,
        url: location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(location.href);
      showNotification(t('link_copied') || 'تم نسخ الرابط', 'success');
    }
  };
  
  window.startAR = (feature) => {
    const result = actions.startARSession(id, feature);
    if (result.success) {
      showARInterface(result.sessionId, result.capabilities);
    } else {
      alert(result.message || t("ar_not_supported"));
    }
  };
  
  window.zoomImage = () => {
    showImageZoom(galleryImages[currentImageIndex]);
  };
  
  window.reportReview = (reviewId) => {
    showNotification(t('review_reported') || 'تم الإبلاغ عن المراجعة', 'info');
  };
  
  window.markHelpful = (reviewId) => {
    showNotification(t('marked_helpful') || 'تم تسجيل أن المراجعة مفيدة', 'success');
  };
  
  // Update functions
  const updateGallery = () => {
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail-image');
    
    if (mainImage) {
      mainImage.src = uns(galleryImages[currentImageIndex], 600);
    }
    
    thumbnails.forEach((thumb, index) => {
      thumb.classList.toggle('active', index === currentImageIndex);
    });
  };
  
  const updateVariantDisplay = () => {
    const colorButtons = document.querySelectorAll('.color-option');
    const sizeButtons = document.querySelectorAll('.size-option');
    
    colorButtons.forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.color === selectedColor);
    });
    
    sizeButtons.forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.size === selectedSize);
    });
    
    updateAddToCartButton();
  };
  
  const updateQuantityDisplay = () => {
    const quantityInput = document.getElementById('quantity-input');
    if (quantityInput) {
      quantityInput.value = quantity;
    }
  };
  
  const updateAddToCartButton = () => {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
      const canAddToCart = !product.colors || selectedColor;
      const needsSize = product.sizes && !selectedSize;
      
      if (needsSize) {
        addToCartBtn.textContent = t('select_size') || 'اختر المقاس';
        addToCartBtn.disabled = true;
      } else if (!canAddToCart) {
        addToCartBtn.textContent = t('select_color') || 'اختر اللون';
        addToCartBtn.disabled = true;
      } else {
        addToCartBtn.textContent = t('add_to_cart') || 'أضف للسلة';
        addToCartBtn.disabled = false;
      }
    }
  };
  
  const updateWishlistButton = () => {
    const wishlistBtn = document.getElementById('wishlist-btn');
    if (wishlistBtn) {
      const isInWishlist = state.wishlist?.items?.includes(id);
      wishlistBtn.classList.toggle('active', isInWishlist);
      wishlistBtn.innerHTML = isInWishlist ? '♥' : '♡';
    }
  };
  
  const updateTabContent = () => {
    const tabs = document.querySelectorAll('.tab-button');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === selectedTab);
    });
    
    contents.forEach(content => {
      content.style.display = content.dataset.tab === selectedTab ? 'block' : 'none';
    });
  };
  
  const updateReviewsDisplay = () => {
    // Implement review filtering logic here
    const reviewElements = document.querySelectorAll('.review-item');
    reviewElements.forEach(element => {
      const rating = parseInt(element.dataset.rating);
      const shouldShow = reviewFilter === 'all' || 
                        (reviewFilter === 'positive' && rating >= 4) ||
                        (reviewFilter === 'negative' && rating <= 2) ||
                        (reviewFilter === rating.toString());
      element.style.display = shouldShow ? 'block' : 'none';
    });
  };
  
  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      z-index: 1000;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };
  
  const showImageZoom = (imageSrc) => {
    const modal = document.createElement('div');
    modal.className = 'image-zoom-modal';
    modal.innerHTML = `
      <div class="zoom-overlay" onclick="this.parentElement.remove()">
        <img src="${uns(imageSrc, 1200)}" alt="${getProductTitle(product)}" class="zoom-image">
        <button onclick="this.parentElement.parentElement.remove()" class="close-zoom">×</button>
      </div>
    `;
    
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.style.opacity = '1', 10);
  };
  
  window.showSizeGuide = () => {
    if (sizeGuide) {
      showSheet({
        title: t("size_guide"),
        content: renderSizeGuide(sizeGuide)
      });
    } else {
      showSheet({
        title: t("size_guide"),
        content: `
          <div style="padding: 24px; text-align: center;">
            <div style="color: var(--text-muted); margin-bottom: 16px;">📏</div>
            <h3 style="margin-bottom: 12px;">${t("size_guide_not_available") || "Size Guide Not Available"}</h3>
            <p style="color: var(--text-muted); margin-bottom: 20px;">
              ${t("size_guide_not_available_msg") || "Size guide is not available for this product. Please contact customer service for sizing assistance."}
            </p>
            <button onclick="closeSheet()" class="primary">${t("ok") || "OK"}</button>
          </div>
        `
      });
    }
  };
  
  window.showShippingInfo = () => {
    // Get current product ID from the URL hash - format: #/pdp/productId
    const hashParts = location.hash.split('/');
    const currentProductId = hashParts.length > 2 ? hashParts[2] : null;
    if (!currentProductId) {
      console.error('Product ID not found in URL');
      return;
    }
    
    const currentShippingInfo = actions.getShippingInfo(currentProductId);
    showSheet({
      title: t("shipping_info") + " & " + t("return_policy"),
      content: renderShippingDetails(currentShippingInfo)
    });
  };
  
  window.compareProduct = (productId) => {
    // Add to comparison and show comparison modal
    if (!state.comparison) {
      state.comparison = [];
    }
    
    if (!state.comparison.includes(productId)) {
      state.comparison.push(productId);
      saveState(state);
    }
    
    showComparisonModal();
  };

  el.innerHTML = h(`
    <div class="pdp-container">
      <!-- Breadcrumb Navigation -->
      <nav class="breadcrumb">
        <a href="#/home">${t('home') || 'الرئيسية'}</a> > 
        <a href="#/discover?category=${product.category}">${t(product.category) || product.category}</a> > 
        <span>${getProductTitle(product)}</span>
      </nav>

      <!-- Main Product Section -->
      <div class="product-main">
        <!-- Image Gallery -->
        <div class="product-gallery">
          <div class="main-image-container">
            <img 
              id="main-product-image" 
              src="${uns(galleryImages[currentImageIndex], 600)}" 
              alt="${getProductTitle(product)}"
              class="main-image"
              onclick="zoomImage()"
              loading="eager">
            
            <!-- Image Navigation -->
            <button class="image-nav prev" onclick="previousImage()" ${galleryImages.length <= 1 ? 'style="display:none"' : ''}>
              <span>‹</span>
            </button>
            <button class="image-nav next" onclick="nextImage()" ${galleryImages.length <= 1 ? 'style="display:none"' : ''}>
              <span>›</span>
            </button>
            
            <!-- Discount Badge -->
            ${product.discount > 0 ? `
              <div class="discount-badge">-${product.discount}%</div>
            ` : ''}
            
            <!-- Zoom Icon -->
            <button class="zoom-icon" onclick="zoomImage()" title="${t('zoom_image') || 'تكبير الصورة'}">
              🔍
            </button>
          </div>
          
          <!-- Thumbnail Gallery -->
          ${galleryImages.length > 1 ? `
            <div class="thumbnail-gallery">
              ${galleryImages.map((img, index) => `
                <img 
                  src="${uns(img, 150)}" 
                  alt="${getProductTitle(product)}"
                  class="thumbnail-image ${index === currentImageIndex ? 'active' : ''}"
                  onclick="selectImage(${index})">
              `).join('')}
            </div>
          ` : ''}

          <!-- AR Features -->
          ${product.arSupported ? `
            <div class="ar-features">
              <h4>${t("try_with_ar") || 'جرب بالواقع المعزز'}</h4>
              <div class="ar-buttons">
                <button onclick="startAR('virtual_try_on')" class="ar-button">
                  📱 ${t("virtual_try_on") || 'تجربة افتراضية'}
                </button>
                <button onclick="startAR('placement_preview')" class="ar-button">
                  🏠 ${t("see_in_your_space") || 'اعرض في مساحتك'}
                </button>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Product Information -->
        <div class="product-info">
          <!-- Title & Creator -->
          <div class="product-header">
            <h1 class="product-title">${getProductTitle(product)}</h1>
            <div class="creator-info">
              <span>${t('by_creator') || 'من'}</span>
              <a href="#/creator/${creator?.id}" class="creator-link">
                ${creator?.name || 'Unknown Creator'}
              </a>
              ${creator?.verified ? '<span class="verified-badge">✓</span>' : ''}
            </div>
          </div>

          <!-- Rating & Reviews -->
          <div class="rating-section">
            <div class="rating-display">
              <span class="stars">${stars(reviewStats.average)}</span>
              <span class="rating-number">${reviewStats.average}</span>
              <span class="review-count">(${reviewStats.count} ${t('reviews') || 'مراجعة'})</span>
            </div>
            ${reviewStats.count > 0 ? `
              <div class="rating-breakdown">
                ${Object.entries(reviewStats.breakdown).map(([rating, percentage]) => `
                  <div class="rating-bar">
                    <span>${rating}★</span>
                    <div class="bar">
                      <div class="fill" style="width: ${percentage * 100}%"></div>
                    </div>
                    <span>${Math.round(percentage * 100)}%</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <!-- Pricing -->
          <div class="pricing-section">
            <div class="current-price">${fmtSAR(product.price)}</div>
            ${product.originalPrice > product.price ? `
              <div class="original-price">${fmtSAR(product.originalPrice)}</div>
              <div class="savings">
                ${t('save') || 'توفير'} ${fmtSAR(product.originalPrice - product.price)} 
                (${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%)
              </div>
            ` : ''}
            
            <!-- Price Protection -->
            <div class="price-protection">
              <span class="icon">🛡️</span>
              <span>${t('price_match_guarantee') || 'ضمان مطابقة السعر'}</span>
            </div>
          </div>

          <!-- Product Description -->
          <div class="description-section">
            <p class="product-description">${product.description || t('no_description') || 'لا يوجد وصف متاح'}</p>
          </div>

          <!-- Color Selection -->
          ${availableColors.length > 0 ? `
            <div class="option-section">
              <h3>${t('select_color') || 'اختر اللون'}: ${selectedColor ? `<span class="selected-value">${selectedColor}</span>` : ''}</h3>
              <div class="color-options">
                ${availableColors.map(color => `
                  <button 
                    class="color-option ${selectedColor === color ? 'selected' : ''}"
                    data-color="${color}"
                    onclick="selectColor('${color}')"
                    title="${color}">
                    <div class="color-swatch" style="background-color: ${color.toLowerCase()}"></div>
                    <span class="color-name">${color}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Size Selection -->
          ${availableSizes.length > 0 ? `
            <div class="option-section">
              <div class="section-header">
                <h3>${t('select_size') || 'اختر المقاس'}: ${selectedSize ? `<span class="selected-value">${selectedSize}</span>` : ''}</h3>
                <button class="size-guide-btn" onclick="showSizeGuide()">
                  📏 ${t('size_guide') || 'دليل المقاسات'}
                </button>
              </div>
              <div class="size-options">
                ${availableSizes.map(size => `
                  <button 
                    class="size-option ${selectedSize === size ? 'selected' : ''}"
                    data-size="${size}"
                    onclick="selectSize('${size}')">
                    ${size}
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Quantity Selection -->
          <div class="quantity-section">
            <h3>${t('quantity') || 'الكمية'}</h3>
            <div class="quantity-controls">
              <button onclick="updateQuantity(-1)" class="quantity-btn" ${quantity <= 1 ? 'disabled' : ''}>-</button>
              <input type="number" id="quantity-input" value="${quantity}" min="1" max="10" readonly>
              <button onclick="updateQuantity(1)" class="quantity-btn" ${quantity >= 10 ? 'disabled' : ''}>+</button>
            </div>
            <span class="stock-info">
              ${product.stock > 10 ? `${t('in_stock') || 'متوفر'}` : 
                product.stock > 0 ? `${t('limited_stock') || 'مخزون محدود'} (${product.stock} ${t('left') || 'متبقي'})` : 
                `${t('out_of_stock') || 'نفد المخزون'}`}
            </span>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button 
              id="add-to-cart-btn" 
              class="add-to-cart-btn primary" 
              onclick="addToCart()"
              ${product.stock === 0 ? 'disabled' : ''}>
              🛒 ${t('add_to_cart') || 'أضف للسلة'}
            </button>
            
            <button class="buy-now-btn secondary" onclick="buyNow()">
              ⚡ ${t('buy_now') || 'اشتر الآن'}
            </button>
            
            <div class="secondary-actions">
              <button 
                id="wishlist-btn" 
                class="icon-btn ${state.wishlist?.items?.includes(id) ? 'active' : ''}" 
                onclick="toggleWishlist()"
                title="${t('add_to_wishlist') || 'أضف للمفضلة'}">
                ${state.wishlist?.items?.includes(id) ? '♥' : '♡'}
              </button>
              
              <button class="icon-btn" onclick="shareProduct()" title="${t('share') || 'مشاركة'}">
                📤
              </button>
              
              <button class="icon-btn" onclick="compareProduct('${id}')" title="${t('compare') || 'مقارنة'}">
                ⚖️
              </button>
            </div>
          </div>

          <!-- Product Features -->
          <div class="features-section">
            <h3>${t('product_features') || 'مميزات المنتج'}</h3>
            <div class="features-list">
              <div class="feature-item">
                <span class="icon">🚚</span>
                <span>${t('free_shipping') || 'شحن مجاني'}</span>
              </div>
              <div class="feature-item">
                <span class="icon">↩️</span>
                <span>${t('easy_returns') || 'إرجاع سهل خلال 30 يوم'}</span>
              </div>
              <div class="feature-item">
                <span class="icon">🛡️</span>
                <span>${t('warranty_included') || 'ضمان سنة'}</span>
              </div>
              <div class="feature-item">
                <span class="icon">⚡</span>
                <span>${t('fast_delivery') || 'توصيل سريع'}</span>
              </div>
            </div>
          </div>

          <!-- Trust Indicators -->
          <div class="trust-section">
            <div class="trust-item">
              <span class="icon">🔒</span>
              <span>${t('secure_payment') || 'دفع آمن'}</span>
            </div>
            <div class="trust-item">
              <span class="icon">✅</span>
              <span>${t('authentic_products') || 'منتجات أصلية'}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Details Tabs -->
      <div class="product-tabs">
        <div class="tab-headers">
          <button class="tab-button ${selectedTab === 'description' ? 'active' : ''}" 
                  data-tab="description" onclick="selectTab('description')">
            ${t('description') || 'الوصف'}
          </button>
          <button class="tab-button ${selectedTab === 'specifications' ? 'active' : ''}" 
                  data-tab="specifications" onclick="selectTab('specifications')">
            ${t('specifications') || 'المواصفات'}
          </button>
          <button class="tab-button ${selectedTab === 'reviews' ? 'active' : ''}" 
                  data-tab="reviews" onclick="selectTab('reviews')">
            ${t('reviews') || 'المراجعات'} (${reviewStats.count})
          </button>
          <button class="tab-button ${selectedTab === 'shipping' ? 'active' : ''}" 
                  data-tab="shipping" onclick="selectTab('shipping')">
            ${t('shipping_returns') || 'الشحن والإرجاع'}
          </button>
        </div>

        <div class="tab-contents">
          <!-- Description Tab -->
          <div class="tab-content ${selectedTab === 'description' ? 'active' : ''}" data-tab="description">
            <div class="description-content">
              <h3>${t('product_description') || 'وصف المنتج'}</h3>
              <p>${product.description || t('no_description') || 'لا يوجد وصف متاح'}</p>
              
              ${product.highlights ? `
                <h4>${t('key_highlights') || 'النقاط الرئيسية'}</h4>
                <ul>
                  ${product.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          </div>

          <!-- Specifications Tab -->
          <div class="tab-content ${selectedTab === 'specifications' ? 'active' : ''}" data-tab="specifications">
            <div class="specifications-content">
              <h3>${t('specifications') || 'المواصفات'}</h3>
              <div class="specs-grid">
                <div class="spec-item">
                  <span class="spec-label">${t('brand') || 'العلامة التجارية'}:</span>
                  <span class="spec-value">${product.brand || 'N/A'}</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">${t('category') || 'الفئة'}:</span>
                  <span class="spec-value">${t(product.category) || product.category}</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">${t('model') || 'الموديل'}:</span>
                  <span class="spec-value">${product.model || 'N/A'}</span>
                </div>
                ${product.specifications ? Object.entries(product.specifications).map(([key, value]) => `
                  <div class="spec-item">
                    <span class="spec-label">${t(key) || key.replace('_', ' ')}:</span>
                    <span class="spec-value">${value}</span>
                  </div>
                `).join('') : ''}
              </div>
            </div>
          </div>

          <!-- Reviews Tab -->
          <div class="tab-content ${selectedTab === 'reviews' ? 'active' : ''}" data-tab="reviews">
            <div class="reviews-content">
              <div class="reviews-header">
                <h3>${t('customer_reviews') || 'مراجعات العملاء'}</h3>
                <button class="write-review-btn" onclick="showReviewForm()">
                  ✍️ ${t('write_review') || 'اكتب مراجعة'}
                </button>
              </div>
              
              <!-- Review Filters -->
              <div class="review-filters">
                <button onclick="filterReviews('all')" class="${reviewFilter === 'all' ? 'active' : ''}">
                  ${t('all_reviews') || 'جميع المراجعات'}
                </button>
                <button onclick="filterReviews('positive')" class="${reviewFilter === 'positive' ? 'active' : ''}">
                  ${t('positive') || 'إيجابية'} (4-5★)
                </button>
                <button onclick="filterReviews('negative')" class="${reviewFilter === 'negative' ? 'active' : ''}">
                  ${t('negative') || 'سلبية'} (1-2★)
                </button>
              </div>

              <!-- Reviews List -->
              <div class="reviews-list">
                ${reviews.map(review => `
                  <div class="review-item" data-rating="${review.rating}">
                    <div class="review-header">
                      <div class="reviewer-info">
                        <span class="reviewer-name">${review.user}</span>
                        ${review.verified ? `<span class="verified-badge">✓ ${t('verified_purchase') || 'مشتري موثق'}</span>` : ''}
                      </div>
                      <div class="review-rating">
                        <span class="stars">${stars(review.rating)}</span>
                        <span class="review-date">${new Date(review.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div class="review-content">
                      <p>${review.comment}</p>
                      ${review.images ? `
                        <div class="review-images">
                          ${review.images.map(img => `
                            <img src="${uns(img, 100)}" alt="Review image" onclick="showImageZoom('${img}')">
                          `).join('')}
                        </div>
                      ` : ''}
                    </div>
                    <div class="review-actions">
                      <button onclick="markHelpful(${review.id})" class="helpful-btn">
                        👍 ${t('helpful') || 'مفيد'} (${review.helpful})
                      </button>
                      <button onclick="reportReview(${review.id})" class="report-btn">
                        🚩 ${t('report') || 'إبلاغ'}
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Shipping Tab -->
          <div class="tab-content ${selectedTab === 'shipping' ? 'active' : ''}" data-tab="shipping">
            <div class="shipping-content">
              <h3>${t('shipping_information') || 'معلومات الشحن'}</h3>
              
              <div class="shipping-options">
                <div class="shipping-option">
                  <div class="option-header">
                    <span class="icon">🚚</span>
                    <span class="option-title">${t('standard_delivery') || 'التوصيل العادي'}</span>
                    <span class="option-price">${t('free') || 'مجاني'}</span>
                  </div>
                  <p>${t('standard_delivery_desc') || '3-5 أيام عمل'}</p>
                </div>
                
                <div class="shipping-option">
                  <div class="option-header">
                    <span class="icon">⚡</span>
                    <span class="option-title">${t('express_delivery') || 'التوصيل السريع'}</span>
                    <span class="option-price">${fmtSAR(25)}</span>
                  </div>
                  <p>${t('express_delivery_desc') || '1-2 أيام عمل'}</p>
                </div>
              </div>

              <h3>${t('return_policy') || 'سياسة الإرجاع'}</h3>
              <div class="return-policy">
                <ul>
                  <li>${t('return_policy_30_days') || 'إرجاع مجاني خلال 30 يوم'}</li>
                  <li>${t('return_policy_condition') || 'يجب أن يكون المنتج في حالته الأصلية'}</li>
                  <li>${t('return_policy_receipt') || 'مطلوب إيصال الشراء'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Similar Products -->
      <div class="similar-products-section">
        <h3>${t('similar_products') || 'منتجات مشابهة'}</h3>
        <div class="similar-products-grid">
          ${(state.products || []).filter(p => p.id !== id && p.category === product.category).slice(0, 4).map(similar => `
            <div class="similar-product-card" onclick="navigate('#/pdp/${similar.id}')">
              <img src="${uns(similar.img, 200)}" alt="${getProductTitle(similar)}">
              <div class="card-content">
                <h4>${getProductTitle(similar)}</h4>
                <div class="card-rating">
                  <span class="stars">${stars(similar.rating || 4.5)}</span>
                  <span class="rating-count">(${similar.reviewCount || 0})</span>
                </div>
                <div class="card-price">${fmtSAR(similar.price)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <style>
      .pdp-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }

      .breadcrumb {
        margin-bottom: 20px;
        font-size: 14px;
        color: var(--text-muted);
      }

      .breadcrumb a {
        color: var(--primary);
        text-decoration: none;
      }

      .product-main {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
        margin-bottom: 40px;
      }

      /* Image Gallery Styles */
      .product-gallery {
        position: sticky;
        top: 20px;
        height: fit-content;
      }

      .main-image-container {
        position: relative;
        margin-bottom: 16px;
        border-radius: 12px;
        overflow: hidden;
        background: var(--card);
      }

      .main-image {
        width: 100%;
        height: 500px;
        object-fit: cover;
        cursor: zoom-in;
        transition: transform 0.3s ease;
      }

      .main-image:hover {
        transform: scale(1.05);
      }

      .image-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0,0,0,0.5);
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      }

      .image-nav:hover {
        background: rgba(0,0,0,0.7);
      }

      .image-nav.prev {
        left: 10px;
      }

      .image-nav.next {
        right: 10px;
      }

      .discount-badge {
        position: absolute;
        top: 16px;
        left: 16px;
        background: #ff4757;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-weight: 600;
        font-size: 14px;
      }

      .zoom-icon {
        position: absolute;
        bottom: 16px;
        right: 16px;
        background: rgba(0,0,0,0.5);
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
      }

      .thumbnail-gallery {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        padding: 8px 0;
      }

      .thumbnail-image {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
        cursor: pointer;
        border: 2px solid transparent;
        transition: all 0.3s ease;
        flex-shrink: 0;
      }

      .thumbnail-image:hover,
      .thumbnail-image.active {
        border-color: var(--primary);
      }

      .ar-features {
        margin-top: 20px;
        padding: 16px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 12px;
        color: white;
      }

      .ar-features h4 {
        margin: 0 0 12px;
        font-size: 16px;
      }

      .ar-buttons {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .ar-button {
        background: rgba(255,255,255,0.2);
        color: white;
        border: 1px solid rgba(255,255,255,0.3);
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.3s ease;
      }

      .ar-button:hover {
        background: rgba(255,255,255,0.3);
      }

      /* Product Info Styles */
      .product-info {
        padding: 0 20px;
      }

      .product-header {
        margin-bottom: 20px;
      }

      .product-title {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 8px;
        line-height: 1.2;
        color: var(--text-primary);
      }

      .creator-info {
        font-size: 14px;
        color: var(--text-muted);
      }

      .creator-link {
        color: var(--primary);
        text-decoration: none;
        font-weight: 500;
      }

      .verified-badge {
        color: var(--success);
        margin-left: 4px;
      }

      .rating-section {
        margin-bottom: 24px;
        padding: 16px;
        background: var(--card);
        border-radius: 8px;
      }

      .rating-display {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
      }

      .stars {
        color: #ffd700;
        font-size: 1.2rem;
      }

      .rating-number {
        font-weight: 600;
        font-size: 1.1rem;
      }

      .review-count {
        color: var(--text-muted);
        font-size: 0.9rem;
      }

      .rating-breakdown {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .rating-bar {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.8rem;
      }

      .bar {
        flex: 1;
        height: 6px;
        background: var(--border);
        border-radius: 3px;
        overflow: hidden;
      }

      .fill {
        height: 100%;
        background: #ffd700;
        transition: width 0.3s ease;
      }

      .pricing-section {
        margin-bottom: 24px;
      }

      .current-price {
        font-size: 2rem;
        font-weight: 700;
        color: var(--primary);
        line-height: 1;
      }

      .original-price {
        font-size: 1.2rem;
        color: var(--text-muted);
        text-decoration: line-through;
        margin-left: 12px;
      }

      .savings {
        color: var(--success);
        font-weight: 600;
        font-size: 0.9rem;
        margin-top: 4px;
      }

      .price-protection {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 12px;
        font-size: 0.9rem;
        color: var(--text-muted);
      }

      .description-section {
        margin-bottom: 24px;
      }

      .product-description {
        color: var(--text-muted);
        line-height: 1.6;
        font-size: 1rem;
      }

      .option-section {
        margin-bottom: 24px;
      }

      .option-section h3 {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 12px;
        color: var(--text-primary);
      }

      .selected-value {
        color: var(--primary);
        font-weight: 500;
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }

      .size-guide-btn {
        background: none;
        border: none;
        color: var(--primary);
        cursor: pointer;
        font-size: 0.9rem;
        text-decoration: underline;
      }

      .color-options, .size-options {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .color-option {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        background: var(--card);
        border: 2px solid var(--border);
        padding: 8px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .color-option:hover,
      .color-option.selected {
        border-color: var(--primary);
      }

      .color-swatch {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 1px solid var(--border);
      }

      .color-name {
        font-size: 0.8rem;
        color: var(--text-muted);
      }

      .size-option {
        background: var(--card);
        border: 2px solid var(--border);
        padding: 12px 16px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
        min-width: 50px;
        text-align: center;
      }

      .size-option:hover,
      .size-option.selected {
        border-color: var(--primary);
        background: var(--primary-light);
      }

      .quantity-section {
        margin-bottom: 32px;
      }

      .quantity-section h3 {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 8px;
      }

      .quantity-controls {
        display: flex;
        align-items: center;
        gap: 0;
        margin-bottom: 8px;
        width: fit-content;
        border: 1px solid var(--border);
        border-radius: 6px;
        overflow: hidden;
      }

      .quantity-btn {
        background: var(--card);
        border: none;
        padding: 12px 16px;
        cursor: pointer;
        font-size: 1.2rem;
        font-weight: 600;
        transition: background 0.3s ease;
      }

      .quantity-btn:hover:not(:disabled) {
        background: var(--primary-light);
      }

      .quantity-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      #quantity-input {
        border: none;
        padding: 12px 16px;
        text-align: center;
        font-weight: 600;
        background: var(--card);
        width: 60px;
      }

      .stock-info {
        font-size: 0.9rem;
        color: var(--text-muted);
      }

      .action-buttons {
        margin-bottom: 32px;
      }

      .add-to-cart-btn {
        width: 100%;
        background: var(--primary);
        color: white;
        border: none;
        padding: 16px 24px;
        border-radius: 8px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        margin-bottom: 12px;
        transition: all 0.3s ease;
      }

      .add-to-cart-btn:hover:not(:disabled) {
        background: var(--primary-dark);
        transform: translateY(-1px);
      }

      .add-to-cart-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .buy-now-btn {
        width: 100%;
        background: var(--accent);
        color: white;
        border: none;
        padding: 16px 24px;
        border-radius: 8px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        margin-bottom: 16px;
        transition: all 0.3s ease;
      }

      .buy-now-btn:hover {
        background: var(--accent-dark);
        transform: translateY(-1px);
      }

      .secondary-actions {
        display: flex;
        justify-content: center;
        gap: 12px;
      }

      .icon-btn {
        background: var(--card);
        border: 1px solid var(--border);
        padding: 12px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1.2rem;
        transition: all 0.3s ease;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .icon-btn:hover {
        background: var(--primary-light);
        border-color: var(--primary);
      }

      .icon-btn.active {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
      }

      .features-section, .trust-section {
        margin-bottom: 24px;
        padding: 16px;
        background: var(--card);
        border-radius: 8px;
      }

      .features-section h3 {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 12px;
      }

      .features-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .feature-item, .trust-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.9rem;
      }

      .trust-section {
        display: flex;
        justify-content: space-around;
        text-align: center;
      }

      /* Product Tabs */
      .product-tabs {
        margin-top: 40px;
        border-top: 1px solid var(--border);
        padding-top: 40px;
      }

      .tab-headers {
        display: flex;
        gap: 0;
        margin-bottom: 32px;
        border-bottom: 1px solid var(--border);
      }

      .tab-button {
        background: none;
        border: none;
        padding: 16px 24px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        color: var(--text-muted);
        border-bottom: 2px solid transparent;
        transition: all 0.3s ease;
      }

      .tab-button:hover,
      .tab-button.active {
        color: var(--primary);
        border-bottom-color: var(--primary);
      }

      .tab-content {
        display: none;
      }

      .tab-content.active {
        display: block;
      }

      .specs-grid {
        display: grid;
        gap: 16px;
      }

      .spec-item {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid var(--border);
      }

      .spec-label {
        font-weight: 500;
        color: var(--text-primary);
      }

      .spec-value {
        color: var(--text-muted);
      }

      /* Reviews */
      .reviews-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .write-review-btn {
        background: var(--primary);
        color: white;
        border: none;
        padding: 10px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.9rem;
      }

      .review-filters {
        display: flex;
        gap: 8px;
        margin-bottom: 24px;
      }

      .review-filters button {
        background: var(--card);
        border: 1px solid var(--border);
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s ease;
      }

      .review-filters button:hover,
      .review-filters button.active {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
      }

      .review-item {
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
      }

      .review-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
      }

      .reviewer-name {
        font-weight: 600;
        margin-right: 8px;
      }

      .verified-badge {
        background: var(--success);
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.7rem;
      }

      .review-rating {
        text-align: right;
      }

      .review-date {
        font-size: 0.8rem;
        color: var(--text-muted);
        margin-left: 8px;
      }

      .review-content p {
        line-height: 1.6;
        color: var(--text-muted);
        margin-bottom: 12px;
      }

      .review-images {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
      }

      .review-images img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 6px;
        cursor: pointer;
        border: 1px solid var(--border);
      }

      .review-actions {
        display: flex;
        gap: 12px;
      }

      .helpful-btn, .report-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        font-size: 0.9rem;
        padding: 4px 8px;
        border-radius: 4px;
        transition: all 0.3s ease;
      }

      .helpful-btn:hover {
        background: var(--success-light);
        color: var(--success);
      }

      .report-btn:hover {
        background: var(--danger-light);
        color: var(--danger);
      }

      /* Shipping Content */
      .shipping-options {
        margin-bottom: 32px;
      }

      .shipping-option {
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 12px;
      }

      .option-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .option-title {
        font-weight: 600;
        margin-left: 8px;
      }

      .option-price {
        color: var(--primary);
        font-weight: 600;
      }

      .return-policy ul {
        padding-left: 20px;
      }

      .return-policy li {
        margin-bottom: 8px;
        line-height: 1.5;
      }

      /* Similar Products */
      .similar-products-section {
        margin-top: 40px;
        border-top: 1px solid var(--border);
        padding-top: 40px;
      }

      .similar-products-section h3 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 24px;
      }

      .similar-products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }

      .similar-product-card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 8px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .similar-product-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }

      .similar-product-card img {
        width: 100%;
        height: 150px;
        object-fit: cover;
      }

      .card-content {
        padding: 12px;
      }

      .card-content h4 {
        font-size: 0.9rem;
        font-weight: 600;
        margin-bottom: 8px;
        line-height: 1.3;
      }

      .card-rating {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-bottom: 8px;
      }

      .card-rating .stars {
        font-size: 0.8rem;
      }

      .rating-count {
        font-size: 0.8rem;
        color: var(--text-muted);
      }

      .card-price {
        font-weight: 600;
        color: var(--primary);
        font-size: 1rem;
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .pdp-container {
          padding: 16px;
        }

        .product-main {
          grid-template-columns: 1fr;
          gap: 24px;
        }

        .product-gallery {
          position: static;
        }

        .main-image {
          height: 300px;
        }

        .product-title {
          font-size: 1.5rem;
        }

        .current-price {
          font-size: 1.5rem;
        }

        .tab-headers {
          overflow-x: auto;
        }

        .tab-button {
          white-space: nowrap;
          min-width: fit-content;
        }

        .similar-products-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      /* RTL Support */
      [dir="rtl"] .product-main {
        grid-template-columns: 1fr 1fr;
      }

      [dir="rtl"] .image-nav.prev {
        right: 10px;
        left: auto;
      }

      [dir="rtl"] .image-nav.next {
        left: 10px;
        right: auto;
      }

      [dir="rtl"] .review-rating {
        text-align: left;
      }

      /* Image Zoom Modal */
      .image-zoom-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        cursor: pointer;
      }

      .zoom-overlay {
        position: relative;
        max-width: 90%;
        max-height: 90%;
      }

      .zoom-image {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }

      .close-zoom {
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(0,0,0,0.5);
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
      }
    </style>
  `);
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
            ${(() => {
              const cartItem = state.cart.find(item => item.productId === product.id);
              const inCart = cartItem ? true : false;
              const cartQty = cartItem ? cartItem.quantity : 0;
              return `<button onclick="window.addToCart?.('${product.id}')" class="primary large" style="flex: 1;" title="${inCart ? `In Cart (${cartQty})` : t("add_to_cart") || "Add to Cart"}">
              <span style="margin-right: 8px;">🛒</span>
              ${inCart ? `${t("add_to_cart") || "Add to Cart"} (${cartQty} in cart)` : t("add_to_cart") || "Add to Cart"}
            </button>`;
            })()}
            <button onclick="toggleWishlist('${product.id}')" class="secondary" style="padding: 16px; aspect-ratio: 1;" title="${t("add_to_wishlist") || "Add to Wishlist"}">
              ❤️
            </button>
            <button onclick="compareProduct('${product.id}')" class="secondary" style="padding: 16px; aspect-ratio: 1;" title="Compare Product">
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
                <span style="font-weight: 500; text-transform: capitalize;">${t(key) || key.replace('_', ' ')}:</span>
                <span style="color: var(--text-muted);">${typeof value === 'object' && value !== null ? (value[getLang()] || value.en || JSON.stringify(value)) : (loc(value) || value)}</span>
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
              const count = (reviewStats.distribution?.[rating]) || 0;
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
          ${filteredReviews?.slice(0, 3).map(review => `
            <div style="border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                <div>
                  <div style="font-weight: 600; margin-bottom: 4px;">${review.userName}</div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: #ffa500;">${stars(review.rating)}</span>
                    <span style="color: var(--text-muted); font-size: 14px;">${formatTimeAgo(review.date)}</span>
                    ${review.verified ? `<span style="background: var(--success); color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">${t("verified")}</span>` : ''}
                  </div>
                </div>
              </div>
              <p style="margin: 0; line-height: 1.5; color: var(--text);">${review.content?.[getLang()] || review.content?.en || review.comment || t("no_review_content")}</p>
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
      if (selectedVariant.images && selectedVariant.images.length > 0) {
        document.getElementById('mainProductImage').src = uns(selectedVariant.images[0], 600);
      }
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
      <div style="padding: 24px;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
          <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">🚚</div>
          <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: var(--text);">${t("delivery_options")}</h3>
        </div>
        
        <div style="background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%); border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
            <span style="font-weight: 500;">${t("standard_shipping")}</span>
            <span style="font-weight: 600; color: ${shipping.freeShipping ? 'var(--ok)' : 'var(--text)'};">${shipping.freeShipping ? t("free") : fmtSAR(shipping.cost || 25)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
            <span style="font-weight: 500;">${t("estimated_delivery")}</span>
            <span style="font-weight: 600;">${shipping.estimatedDays} ${t("days")}</span>
          </div>
          ${shipping.sameDayAvailable ? `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0;">
              <span style="font-weight: 500; color: var(--ok);">${t("same_day_delivery")}</span>
              <span style="font-weight: 600; color: var(--ok);">${fmtSAR(shipping.sameDayCost || 15)}</span>
            </div>
          ` : ''}
        </div>
        
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
          <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">↩️</div>
          <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: var(--text);">${t("return_policy")}</h3>
        </div>
        
        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%); border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px;">
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="padding: 12px 0; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #bbf7d0;">
              <div style="width: 24px; height: 24px; background: var(--ok); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold;">✓</div>
              <span style="font-weight: 500;">${t("thirty_day_return") || "30-day return window"}</span>
            </li>
            <li style="padding: 12px 0; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #bbf7d0;">
              <div style="width: 24px; height: 24px; background: var(--ok); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold;">✓</div>
              <span style="font-weight: 500;">${t("free_return_shipping") || "Free return shipping"}</span>
            </li>
            <li style="padding: 12px 0; display: flex; align-items: center; gap: 12px;">
              <div style="width: 24px; height: 24px; background: var(--ok); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold;">✓</div>
              <span style="font-weight: 500;">${t("full_refund_guarantee") || "Full refund guarantee"}</span>
            </li>
          </ul>
        </div>
        
        <div style="margin-top: 24px; padding: 16px; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 10px;">
          <p style="margin: 0; font-size: 14px; color: var(--text-muted); text-align: center;">
            <strong>${t("need_help") || "Need help?"}:</strong> ${t("contact_support") || "Contact our support team for any questions about shipping or returns."}
          </p>
        </div>
      </div>
    `;
  }
};

const checkout = ({ el, state, actions }) => {
  const cartItems = state.cart || [];
  
  if (cartItems.length === 0) {
    navigate('#/cart');
    return;
  }
  
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const product = productById(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  
  const shippingCost = subtotal > 200 ? 0 : 25;
  const taxRate = 0.15;
  const tax = subtotal * taxRate;
  const total = subtotal + shippingCost + tax;
  
  // Checkout state
  let currentStep = 1;
  let isGuestCheckout = !state.user;
  let shippingInfo = state.user?.address || {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'SA'
  };
  let paymentMethod = null;
  let orderNotes = '';
  
  // Available shipping options
  const shippingOptions = [
    {
      id: 'standard',
      name: t('standard_delivery') || 'التوصيل العادي',
      description: t('standard_delivery_desc') || '3-5 أيام عمل',
      cost: 0,
      duration: '3-5 أيام'
    },
    {
      id: 'express',
      name: t('express_delivery') || 'التوصيل السريع',
      description: t('express_delivery_desc') || '1-2 أيام عمل',
      cost: 25,
      duration: '1-2 أيام'
    },
    {
      id: 'same_day',
      name: t('same_day_delivery') || 'التوصيل في نفس اليوم',
      description: t('same_day_desc') || 'خلال 4 ساعات (الرياض فقط)',
      cost: 50,
      duration: '4 ساعات'
    }
  ];
  
  let selectedShipping = shippingOptions[0];
  
  // Payment methods
  const paymentMethods = [
    {
      id: 'mada',
      name: t('mada_card') || 'بطاقة مدى',
      icon: '💳',
      description: t('mada_desc') || 'بطاقة الخصم السعودية'
    },
    {
      id: 'visa',
      name: t('visa_mastercard') || 'فيزا/ماستركارد',
      icon: '💳',
      description: t('credit_card_desc') || 'بطاقة ائتمان دولية'
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      icon: '📱',
      description: t('apple_pay_desc') || 'دفع سريع وآمن'
    },
    {
      id: 'stc_pay',
      name: 'STC Pay',
      icon: '📱',
      description: t('stc_pay_desc') || 'محفظة رقمية'
    },
    {
      id: 'cod',
      name: t('cash_on_delivery') || 'الدفع عند الاستلام',
      icon: '💵',
      description: t('cod_desc') || 'ادفع نقداً عند التسليم'
    }
  ];
  
  // Global functions
  window.toggleGuestCheckout = () => {
    isGuestCheckout = !isGuestCheckout;
    updateCheckoutForm();
  };
  
  window.updateShippingInfo = (field, value) => {
    shippingInfo[field] = value;
  };
  
  window.selectShippingOption = (optionId) => {
    selectedShipping = shippingOptions.find(opt => opt.id === optionId);
    updateOrderSummary();
  };
  
  window.selectPaymentMethod = (methodId) => {
    paymentMethod = paymentMethods.find(method => method.id === methodId);
    updatePaymentSection();
  };
  
  window.nextStep = () => {
    if (validateCurrentStep()) {
      currentStep++;
      updateCheckoutSteps();
      window.scrollTo(0, 0);
    }
  };
  
  window.prevStep = () => {
    currentStep--;
    updateCheckoutSteps();
    window.scrollTo(0, 0);
  };
  
  window.processCheckout = async () => {
    if (!validateOrder()) return;
    
    // Show loading
    const processBtn = document.getElementById('process-order-btn');
    const originalText = processBtn.textContent;
    processBtn.disabled = true;
    processBtn.textContent = t('processing') || 'جاري المعالجة...';
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create order
      const order = {
        id: `ORD${Date.now()}`,
        items: cartItems,
        shipping: shippingInfo,
        paymentMethod: paymentMethod,
        shippingOption: selectedShipping,
        subtotal,
        shipping: selectedShipping.cost,
        tax,
        total: subtotal + selectedShipping.cost + tax,
        status: 'confirmed',
        trackingNumber: `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        estimatedDelivery: new Date(Date.now() + parseInt(selectedShipping.duration) * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        notes: orderNotes
      };
      
      // Save order and clear cart
      if (!state.orders) state.orders = [];
      state.orders.unshift(order);
      state.cart = [];
      saveState(state);
      
      // Show success
      showOrderSuccess(order);
      
    } catch (error) {
      console.error('Checkout error:', error);
      processBtn.disabled = false;
      processBtn.textContent = originalText;
      showNotification(t('checkout_error') || 'حدث خطأ في المعالجة', 'error');
    }
  };
  
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: // Shipping info
        if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.email || 
            !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city) {
          showNotification(t('fill_required_fields') || 'يرجى ملء جميع الحقول المطلوبة', 'warning');
          return false;
        }
        if (!isValidEmail(shippingInfo.email)) {
          showNotification(t('invalid_email') || 'البريد الإلكتروني غير صحيح', 'warning');
          return false;
        }
        return true;
        
      case 2: // Shipping options
        return !!selectedShipping;
        
      case 3: // Payment
        if (!paymentMethod) {
          showNotification(t('select_payment_method') || 'يرجى اختيار طريقة الدفع', 'warning');
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };
  
  const validateOrder = () => {
    return validateCurrentStep() && cartItems.length > 0;
  };
  
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const showOrderSuccess = (order) => {
    const modal = document.createElement('div');
    modal.className = 'order-success-modal';
    modal.innerHTML = `
      <div class="modal-overlay" onclick="closeOrderSuccess()">
        <div class="modal-content" onclick="event.stopPropagation()">
          <div class="success-icon">✅</div>
          <h2>${t('order_confirmed') || 'تم تأكيد طلبك!'}</h2>
          <p>${t('order_success_message') || 'شكراً لك! تم إنشاء طلبك بنجاح وسيتم شحنه قريباً.'}</p>
          
          <div class="order-details">
            <div class="detail-row">
              <span>${t('order_number') || 'رقم الطلب'}:</span>
              <strong>${order.id}</strong>
            </div>
            <div class="detail-row">
              <span>${t('tracking_number') || 'رقم التتبع'}:</span>
              <strong>${order.trackingNumber}</strong>
            </div>
            <div class="detail-row">
              <span>${t('estimated_delivery') || 'التوصيل المتوقع'}:</span>
              <strong>${order.estimatedDelivery.toLocaleDateString()}</strong>
            </div>
          </div>
          
          <div class="modal-actions">
            <button onclick="navigate('#/orders')" class="primary">
              📦 ${t('view_orders') || 'عرض الطلبات'}
            </button>
            <button onclick="navigate('#/home')" class="secondary">
              🏠 ${t('continue_shopping') || 'متابعة التسوق'}
            </button>
          </div>
        </div>
      </div>
    `;
    
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2000;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.style.opacity = '1', 10);
    
    window.closeOrderSuccess = () => {
      modal.style.opacity = '0';
      setTimeout(() => modal.remove(), 300);
      navigate('#/orders');
    };
  };
  
  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      z-index: 1000;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };
  
  const updateCheckoutForm = () => {
    const formContainer = document.getElementById('shipping-form');
    if (formContainer) {
      formContainer.innerHTML = renderShippingForm();
    }
  };
  
  const updateOrderSummary = () => {
    const summaryContainer = document.getElementById('order-summary');
    if (summaryContainer) {
      summaryContainer.innerHTML = renderOrderSummary();
    }
  };
  
  const updatePaymentSection = () => {
    const paymentButtons = document.querySelectorAll('.payment-method');
    paymentButtons.forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.method === paymentMethod?.id);
    });
  };
  
  const updateCheckoutSteps = () => {
    // Update step indicators
    for (let i = 1; i <= 4; i++) {
      const stepEl = document.getElementById(`step-${i}`);
      if (stepEl) {
        stepEl.classList.toggle('active', i === currentStep);
        stepEl.classList.toggle('completed', i < currentStep);
      }
    }
    
    // Show/hide step content
    for (let i = 1; i <= 4; i++) {
      const contentEl = document.getElementById(`step-content-${i}`);
      if (contentEl) {
        contentEl.style.display = i === currentStep ? 'block' : 'none';
      }
    }
  };
  
  const renderShippingForm = () => {
    return `
      <div class="form-section">
        <div class="guest-checkout-toggle">
          <label class="checkbox-label">
            <input type="checkbox" ${isGuestCheckout ? 'checked' : ''} onchange="toggleGuestCheckout()">
            <span class="checkmark"></span>
            ${t('guest_checkout') || 'الدفع كضيف (بدون تسجيل)'}
          </label>
          <p class="guest-note">${t('guest_checkout_note') || 'يمكنك إنشاء حساب بعد إتمام الطلب'}</p>
        </div>
        
        <div class="form-grid">
          <div class="form-group">
            <label>${t('first_name') || 'الاسم الأول'} *</label>
            <input type="text" value="${shippingInfo.firstName}" 
                   oninput="updateShippingInfo('firstName', this.value)" required>
          </div>
          
          <div class="form-group">
            <label>${t('last_name') || 'اسم العائلة'} *</label>
            <input type="text" value="${shippingInfo.lastName}" 
                   oninput="updateShippingInfo('lastName', this.value)" required>
          </div>
          
          <div class="form-group">
            <label>${t('email') || 'البريد الإلكتروني'} *</label>
            <input type="email" value="${shippingInfo.email}" 
                   oninput="updateShippingInfo('email', this.value)" required>
          </div>
          
          <div class="form-group">
            <label>${t('phone') || 'رقم الهاتف'} *</label>
            <input type="tel" value="${shippingInfo.phone}" 
                   oninput="updateShippingInfo('phone', this.value)" 
                   placeholder="+966 50 123 4567" required>
          </div>
          
          <div class="form-group full-width">
            <label>${t('address') || 'العنوان'} *</label>
            <input type="text" value="${shippingInfo.address}" 
                   oninput="updateShippingInfo('address', this.value)" 
                   placeholder="${t('street_address') || 'عنوان الشارع'}" required>
          </div>
          
          <div class="form-group">
            <label>${t('city') || 'المدينة'} *</label>
            <select onchange="updateShippingInfo('city', this.value)" required>
              <option value="">${t('select_city') || 'اختر المدينة'}</option>
              <option value="Riyadh" ${shippingInfo.city === 'Riyadh' ? 'selected' : ''}>${t('riyadh') || 'الرياض'}</option>
              <option value="Jeddah" ${shippingInfo.city === 'Jeddah' ? 'selected' : ''}>${t('jeddah') || 'جدة'}</option>
              <option value="Dammam" ${shippingInfo.city === 'Dammam' ? 'selected' : ''}>${t('dammam') || 'الدمام'}</option>
              <option value="Mecca" ${shippingInfo.city === 'Mecca' ? 'selected' : ''}>${t('mecca') || 'مكة'}</option>
              <option value="Medina" ${shippingInfo.city === 'Medina' ? 'selected' : ''}>${t('medina') || 'المدينة'}</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>${t('postal_code') || 'الرمز البريدي'}</label>
            <input type="text" value="${shippingInfo.postalCode}" 
                   oninput="updateShippingInfo('postalCode', this.value)" 
                   placeholder="12345">
          </div>
        </div>
        
        <div class="form-group">
          <label>${t('order_notes') || 'ملاحظات الطلب'} (${t('optional') || 'اختياري'})</label>
          <textarea oninput="orderNotes = this.value" 
                    placeholder="${t('order_notes_placeholder') || 'أي تعليمات خاصة للتوصيل...'}">${orderNotes}</textarea>
        </div>
      </div>
    `;
  };
  
  const renderOrderSummary = () => {
    const finalTotal = subtotal + selectedShipping.cost + tax;
    
    return `
      <h3>${t('order_summary') || 'ملخص الطلب'}</h3>
      
      <div class="order-items">
        ${cartItems.map(item => {
          const product = productById(item.productId);
          if (!product) return '';
          
          return `
            <div class="order-item">
              <img src="${uns(product.img, 60)}" alt="${getProductTitle(product)}">
              <div class="item-details">
                <h5>${getProductTitle(product)}</h5>
                <span class="quantity">×${item.quantity}</span>
              </div>
              <div class="item-price">${fmtSAR(product.price * item.quantity)}</div>
            </div>
          `;
        }).join('')}
      </div>
      
      <div class="order-totals">
        <div class="total-line">
          <span>${t('subtotal') || 'المجموع الفرعي'}</span>
          <span>${fmtSAR(subtotal)}</span>
        </div>
        
        <div class="total-line">
          <span>${t('shipping') || 'الشحن'} (${selectedShipping.name})</span>
          <span>${selectedShipping.cost === 0 ? 
            `<span class="free">${t('free') || 'مجاني'}</span>` : 
            fmtSAR(selectedShipping.cost)
          }</span>
        </div>
        
        <div class="total-line">
          <span>${t('vat') || 'ضريبة القيمة المضافة'} (15%)</span>
          <span>${fmtSAR(tax)}</span>
        </div>
        
        <div class="total-line final">
          <span>${t('total') || 'الإجمالي'}</span>
          <span>${fmtSAR(finalTotal)}</span>
        </div>
      </div>
    `;
  };

  el.innerHTML = h(`
    <div class="checkout-container">
      <!-- Header -->
      <div class="checkout-header">
        <h1>${t('checkout') || 'الدفع'}</h1>
        <p>${t('checkout_subtitle') || 'أكمل طلبك بخطوات سهلة وآمنة'}</p>
      </div>
      
      <!-- Progress Steps -->
      <div class="checkout-steps">
        <div class="step ${currentStep === 1 ? 'active' : ''}" id="step-1">
          <div class="step-number">1</div>
          <div class="step-label">${t('shipping_info') || 'معلومات الشحن'}</div>
        </div>
        
        <div class="step ${currentStep === 2 ? 'active' : ''}" id="step-2">
          <div class="step-number">2</div>
          <div class="step-label">${t('shipping_method') || 'طريقة الشحن'}</div>
        </div>
        
        <div class="step ${currentStep === 3 ? 'active' : ''}" id="step-3">
          <div class="step-number">3</div>
          <div class="step-label">${t('payment') || 'الدفع'}</div>
        </div>
        
        <div class="step ${currentStep === 4 ? 'active' : ''}" id="step-4">
          <div class="step-number">4</div>
          <div class="step-label">${t('review') || 'المراجعة'}</div>
        </div>
      </div>
      
      <div class="checkout-content">
        <!-- Main Content -->
        <div class="checkout-main">
          <!-- Step 1: Shipping Information -->
          <div class="step-content" id="step-content-1" ${currentStep !== 1 ? 'style="display:none"' : ''}>
            <div class="step-header">
              <h2>${t('shipping_information') || 'معلومات الشحن'}</h2>
              <p>${t('shipping_info_desc') || 'أدخل عنوان التوصيل ومعلومات الاتصال'}</p>
            </div>
            
            <div id="shipping-form">
              ${renderShippingForm()}
            </div>
            
            <div class="step-actions">
              <button onclick="nextStep()" class="primary continue-btn">
                ${t('continue') || 'متابعة'} →
              </button>
            </div>
          </div>
          
          <!-- Step 2: Shipping Method -->
          <div class="step-content" id="step-content-2" ${currentStep !== 2 ? 'style="display:none"' : ''}>
            <div class="step-header">
              <h2>${t('shipping_method') || 'طريقة الشحن'}</h2>
              <p>${t('shipping_method_desc') || 'اختر سرعة التوصيل المناسبة لك'}</p>
            </div>
            
            <div class="shipping-options">
              ${shippingOptions.map(option => `
                <div class="shipping-option ${selectedShipping.id === option.id ? 'selected' : ''}" 
                     onclick="selectShippingOption('${option.id}')">
                  <div class="option-info">
                    <div class="option-header">
                      <h4>${option.name}</h4>
                      <span class="option-price">
                        ${option.cost === 0 ? 
                          `<span class="free">${t('free') || 'مجاني'}</span>` : 
                          fmtSAR(option.cost)
                        }
                      </span>
                    </div>
                    <p class="option-description">${option.description}</p>
                    <div class="option-duration">⏱️ ${option.duration}</div>
                  </div>
                  <div class="option-radio">
                    <div class="radio ${selectedShipping.id === option.id ? 'checked' : ''}"></div>
                  </div>
                </div>
              `).join('')}
            </div>
            
            <div class="step-actions">
              <button onclick="prevStep()" class="secondary">
                ← ${t('back') || 'رجوع'}
              </button>
              <button onclick="nextStep()" class="primary continue-btn">
                ${t('continue') || 'متابعة'} →
              </button>
            </div>
          </div>
          
          <!-- Step 3: Payment Method -->
          <div class="step-content" id="step-content-3" ${currentStep !== 3 ? 'style="display:none"' : ''}>
            <div class="step-header">
              <h2>${t('payment_method') || 'طريقة الدفع'}</h2>
              <p>${t('payment_method_desc') || 'اختر طريقة الدفع المفضلة لديك'}</p>
            </div>
            
            <div class="payment-methods">
              ${paymentMethods.map(method => `
                <div class="payment-method ${paymentMethod?.id === method.id ? 'selected' : ''}" 
                     data-method="${method.id}"
                     onclick="selectPaymentMethod('${method.id}')">
                  <div class="payment-icon">${method.icon}</div>
                  <div class="payment-info">
                    <h4>${method.name}</h4>
                    <p>${method.description}</p>
                  </div>
                  <div class="payment-radio">
                    <div class="radio ${paymentMethod?.id === method.id ? 'checked' : ''}"></div>
                  </div>
                </div>
              `).join('')}
            </div>
            
            <!-- Security Notice -->
            <div class="security-notice">
              <div class="security-icon">🔒</div>
              <div class="security-text">
                <h4>${t('secure_payment') || 'دفع آمن'}</h4>
                <p>${t('security_notice') || 'جميع معلومات الدفع محمية بتشفير SSL ولن يتم حفظها'}</p>
              </div>
            </div>
            
            <div class="step-actions">
              <button onclick="prevStep()" class="secondary">
                ← ${t('back') || 'رجوع'}
              </button>
              <button onclick="nextStep()" class="primary continue-btn">
                ${t('continue') || 'متابعة'} →
              </button>
            </div>
          </div>
          
          <!-- Step 4: Review Order -->
          <div class="step-content" id="step-content-4" ${currentStep !== 4 ? 'style="display:none"' : ''}>
            <div class="step-header">
              <h2>${t('review_order') || 'مراجعة الطلب'}</h2>
              <p>${t('review_order_desc') || 'تأكد من جميع المعلومات قبل إتمام الطلب'}</p>
            </div>
            
            <div class="order-review">
              <!-- Shipping Details -->
              <div class="review-section">
                <h3>${t('shipping_address') || 'عنوان الشحن'}</h3>
                <div class="review-content">
                  <p><strong>${shippingInfo.firstName} ${shippingInfo.lastName}</strong></p>
                  <p>${shippingInfo.address}</p>
                  <p>${shippingInfo.city}, ${shippingInfo.postalCode}</p>
                  <p>${shippingInfo.phone}</p>
                  <p>${shippingInfo.email}</p>
                </div>
                <button onclick="currentStep=1; updateCheckoutSteps()" class="edit-btn">
                  ✏️ ${t('edit') || 'تعديل'}
                </button>
              </div>
              
              <!-- Shipping Method -->
              <div class="review-section">
                <h3>${t('shipping_method') || 'طريقة الشحن'}</h3>
                <div class="review-content">
                  <p><strong>${selectedShipping.name}</strong></p>
                  <p>${selectedShipping.description}</p>
                  <p>${selectedShipping.cost === 0 ? t('free') || 'مجاني' : fmtSAR(selectedShipping.cost)}</p>
                </div>
                <button onclick="currentStep=2; updateCheckoutSteps()" class="edit-btn">
                  ✏️ ${t('edit') || 'تعديل'}
                </button>
              </div>
              
              <!-- Payment Method -->
              <div class="review-section">
                <h3>${t('payment_method') || 'طريقة الدفع'}</h3>
                <div class="review-content">
                  <p><strong>${paymentMethod.icon} ${paymentMethod.name}</strong></p>
                  <p>${paymentMethod.description}</p>
                </div>
                <button onclick="currentStep=3; updateCheckoutSteps()" class="edit-btn">
                  ✏️ ${t('edit') || 'تعديل'}
                </button>
              </div>
            </div>
            
            <div class="step-actions">
              <button onclick="prevStep()" class="secondary">
                ← ${t('back') || 'رجوع'}
              </button>
              <button id="process-order-btn" onclick="processCheckout()" class="primary place-order-btn">
                🛒 ${t('place_order') || 'إتمام الطلب'}
              </button>
            </div>
          </div>
        </div>
        
        <!-- Order Summary Sidebar -->
        <div class="checkout-sidebar">
          <div class="order-summary-card" id="order-summary">
            ${renderOrderSummary()}
          </div>
          
          <!-- Trust Indicators -->
          <div class="trust-indicators">
            <div class="trust-item">
              <span class="icon">🔒</span>
              <span>${t('secure_checkout') || 'دفع آمن'}</span>
            </div>
            <div class="trust-item">
              <span class="icon">↩️</span>
              <span>${t('easy_returns') || 'إرجاع سهل'}</span>
            </div>
            <div class="trust-item">
              <span class="icon">🚚</span>
              <span>${t('fast_delivery') || 'توصيل سريع'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>
      .checkout-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }

      .checkout-header {
        text-align: center;
        margin-bottom: 40px;
      }

      .checkout-header h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 8px;
        color: var(--text-primary);
      }

      .checkout-header p {
        color: var(--text-muted);
        font-size: 1.1rem;
      }

      /* Progress Steps */
      .checkout-steps {
        display: flex;
        justify-content: center;
        margin-bottom: 40px;
        position: relative;
      }

      .checkout-steps::before {
        content: '';
        position: absolute;
        top: 25px;
        left: 25%;
        right: 25%;
        height: 2px;
        background: var(--border);
        z-index: 1;
      }

      .step {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        flex: 1;
        max-width: 200px;
        position: relative;
        z-index: 2;
      }

      .step-number {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--card);
        border: 2px solid var(--border);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 1.1rem;
        margin-bottom: 8px;
        transition: all 0.3s ease;
      }

      .step.active .step-number {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
      }

      .step.completed .step-number {
        background: var(--success);
        color: white;
        border-color: var(--success);
      }

      .step.completed .step-number::before {
        content: '✓';
      }

      .step-label {
        font-size: 0.9rem;
        color: var(--text-muted);
        font-weight: 500;
      }

      .step.active .step-label {
        color: var(--primary);
        font-weight: 600;
      }

      /* Content Layout */
      .checkout-content {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 40px;
      }

      .checkout-main {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 32px;
      }

      .step-header {
        margin-bottom: 32px;
      }

      .step-header h2 {
        font-size: 1.8rem;
        font-weight: 600;
        margin-bottom: 8px;
        color: var(--text-primary);
      }

      .step-header p {
        color: var(--text-muted);
        font-size: 1rem;
      }

      /* Form Styles */
      .guest-checkout-toggle {
        background: var(--card-secondary);
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 24px;
      }

      .checkbox-label {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-weight: 500;
      }

      .checkbox-label input[type="checkbox"] {
        margin-right: 8px;
      }

      .guest-note {
        margin-top: 8px;
        color: var(--text-muted);
        font-size: 0.9rem;
      }

      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 24px;
      }

      .form-group {
        display: flex;
        flex-direction: column;
      }

      .form-group.full-width {
        grid-column: 1 / -1;
      }

      .form-group label {
        font-weight: 500;
        margin-bottom: 8px;
        color: var(--text-primary);
      }

      .form-group input,
      .form-group select,
      .form-group textarea {
        padding: 12px;
        border: 1px solid var(--border);
        border-radius: 6px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
      }

      .form-group input:focus,
      .form-group select:focus,
      .form-group textarea:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .form-group textarea {
        resize: vertical;
        min-height: 80px;
      }

      /* Shipping Options */
      .shipping-options {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 32px;
      }

      .shipping-option {
        border: 2px solid var(--border);
        border-radius: 8px;
        padding: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .shipping-option:hover {
        border-color: var(--primary-light);
        background: var(--primary-light);
      }

      .shipping-option.selected {
        border-color: var(--primary);
        background: var(--primary-light);
      }

      .option-info {
        flex: 1;
      }

      .option-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .option-header h4 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-primary);
      }

      .option-price {
        font-weight: 600;
        color: var(--primary);
      }

      .option-price .free {
        color: var(--success);
      }

      .option-description {
        color: var(--text-muted);
        margin-bottom: 8px;
      }

      .option-duration {
        font-size: 0.9rem;
        color: var(--text-muted);
      }

      .option-radio {
        margin-left: 16px;
      }

      .radio {
        width: 20px;
        height: 20px;
        border: 2px solid var(--border);
        border-radius: 50%;
        position: relative;
        transition: all 0.3s ease;
      }

      .radio.checked {
        border-color: var(--primary);
      }

      .radio.checked::after {
        content: '';
        position: absolute;
        top: 3px;
        left: 3px;
        width: 10px;
        height: 10px;
        background: var(--primary);
        border-radius: 50%;
      }

      /* Payment Methods */
      .payment-methods {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 32px;
      }

      .payment-method {
        border: 2px solid var(--border);
        border-radius: 8px;
        padding: 16px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .payment-method:hover {
        border-color: var(--primary-light);
        background: var(--primary-light);
      }

      .payment-method.selected {
        border-color: var(--primary);
        background: var(--primary-light);
      }

      .payment-icon {
        font-size: 2rem;
        width: 60px;
        text-align: center;
      }

      .payment-info {
        flex: 1;
      }

      .payment-info h4 {
        margin: 0 0 4px;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-primary);
      }

      .payment-info p {
        margin: 0;
        color: var(--text-muted);
        font-size: 0.9rem;
      }

      .payment-radio {
        margin-left: 16px;
      }

      /* Security Notice */
      .security-notice {
        display: flex;
        align-items: center;
        gap: 16px;
        background: var(--card-secondary);
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 32px;
      }

      .security-icon {
        font-size: 2rem;
        color: var(--success);
      }

      .security-text h4 {
        margin: 0 0 4px;
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-primary);
      }

      .security-text p {
        margin: 0;
        color: var(--text-muted);
        font-size: 0.9rem;
      }

      /* Order Review */
      .order-review {
        display: flex;
        flex-direction: column;
        gap: 24px;
        margin-bottom: 32px;
      }

      .review-section {
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 20px;
        position: relative;
      }

      .review-section h3 {
        margin: 0 0 16px;
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--text-primary);
      }

      .review-content p {
        margin: 4px 0;
        color: var(--text-muted);
      }

      .edit-btn {
        position: absolute;
        top: 16px;
        right: 16px;
        background: none;
        border: 1px solid var(--border);
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8rem;
        color: var(--primary);
        transition: all 0.3s ease;
      }

      .edit-btn:hover {
        background: var(--primary-light);
      }

      /* Step Actions */
      .step-actions {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        margin-top: 32px;
      }

      .step-actions button {
        padding: 14px 28px;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: all 0.3s ease;
      }

      .step-actions .primary {
        background: var(--primary);
        color: white;
        flex: 1;
        max-width: 300px;
        margin-left: auto;
      }

      .step-actions .primary:hover {
        background: var(--primary-dark);
        transform: translateY(-1px);
      }

      .step-actions .secondary {
        background: var(--card);
        color: var(--text-primary);
        border: 1px solid var(--border);
      }

      .step-actions .secondary:hover {
        background: var(--card-secondary);
      }

      .place-order-btn {
        font-size: 1.1rem !important;
        padding: 16px 32px !important;
      }

      /* Sidebar */
      .checkout-sidebar {
        position: sticky;
        top: 20px;
        height: fit-content;
      }

      .order-summary-card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 24px;
      }

      .order-summary-card h3 {
        font-size: 1.3rem;
        font-weight: 600;
        margin-bottom: 20px;
        color: var(--text-primary);
      }

      .order-items {
        margin-bottom: 20px;
      }

      .order-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 0;
        border-bottom: 1px solid var(--border);
      }

      .order-item:last-child {
        border-bottom: none;
      }

      .order-item img {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 6px;
      }

      .item-details {
        flex: 1;
      }

      .item-details h5 {
        margin: 0 0 4px;
        font-size: 0.9rem;
        font-weight: 600;
        line-height: 1.3;
      }

      .quantity {
        font-size: 0.8rem;
        color: var(--text-muted);
      }

      .item-price {
        font-weight: 600;
        color: var(--primary);
      }

      .order-totals {
        padding-top: 16px;
        border-top: 1px solid var(--border);
      }

      .total-line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        font-size: 0.9rem;
      }

      .total-line.final {
        border-top: 1px solid var(--border);
        margin-top: 8px;
        padding-top: 16px;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-primary);
      }

      .free {
        color: var(--success);
        font-weight: 600;
      }

      .trust-indicators {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 16px;
      }

      .trust-item {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        font-size: 0.9rem;
        color: var(--text-muted);
      }

      .trust-item:last-child {
        margin-bottom: 0;
      }

      .trust-item .icon {
        font-size: 1.2rem;
      }

      /* Order Success Modal */
      .order-success-modal .modal-overlay {
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }

      .order-success-modal .modal-content {
        background: var(--card);
        border-radius: 12px;
        padding: 40px;
        max-width: 500px;
        width: 100%;
        text-align: center;
      }

      .success-icon {
        font-size: 4rem;
        margin-bottom: 20px;
      }

      .order-success-modal h2 {
        font-size: 1.8rem;
        font-weight: 600;
        margin-bottom: 12px;
        color: var(--text-primary);
      }

      .order-success-modal p {
        color: var(--text-muted);
        margin-bottom: 24px;
        line-height: 1.5;
      }

      .order-details {
        background: var(--card-secondary);
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 24px;
        text-align: left;
      }

      .detail-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .detail-row:last-child {
        margin-bottom: 0;
      }

      .modal-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
      }

      .modal-actions button {
        padding: 12px 24px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: all 0.3s ease;
      }

      .modal-actions .primary {
        background: var(--primary);
        color: white;
      }

      .modal-actions .secondary {
        background: var(--card-secondary);
        color: var(--text-primary);
        border: 1px solid var(--border);
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .checkout-container {
          padding: 16px;
        }

        .checkout-content {
          grid-template-columns: 1fr;
          gap: 24px;
        }

        .checkout-main {
          padding: 20px;
        }

        .checkout-steps {
          overflow-x: auto;
          padding-bottom: 10px;
        }

        .checkout-steps::before {
          display: none;
        }

        .step {
          min-width: 120px;
        }

        .form-grid {
          grid-template-columns: 1fr;
        }

        .step-actions {
          flex-direction: column;
        }

        .step-actions button {
          width: 100%;
        }

        .checkout-sidebar {
          position: static;
        }
      }

      /* RTL Support */
      [dir="rtl"] .checkout-content {
        grid-template-columns: 1fr 2fr;
      }

      [dir="rtl"] .step-actions {
        flex-direction: row-reverse;
      }

      [dir="rtl"] .order-item {
        flex-direction: row-reverse;
      }

      [dir="rtl"] .payment-method,
      [dir="rtl"] .shipping-option {
        flex-direction: row-reverse;
      }

      [dir="rtl"] .trust-item {
        flex-direction: row-reverse;
      }
    </style>
  `);
  
  // Initialize the checkout
  setTimeout(() => {
    updateCheckoutSteps();
  }, 100);
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
  const savedForLater = state.wishlist?.saveForLater || [];
  const savedItems = savedForLater.map(id => productById(id)).filter(Boolean);
  
  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => {
    const product = productById(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  
  const shippingCost = subtotal > 200 ? 0 : 25; // Free shipping over 200 SAR
  const taxRate = 0.15; // 15% VAT
  const tax = subtotal * taxRate;
  const total = subtotal + shippingCost + tax;
  
  // Promo code state
  let promoCode = state.appliedPromo || null;
  let promoDiscount = 0;
  
  if (promoCode) {
    switch (promoCode.type) {
      case 'percentage':
        promoDiscount = subtotal * (promoCode.value / 100);
        break;
      case 'fixed':
        promoDiscount = Math.min(promoCode.value, subtotal);
        break;
    }
  }
  
  const finalTotal = total - promoDiscount;
  
  // Available promo codes (for demo)
  const availablePromos = [
    { code: 'SAVE10', type: 'percentage', value: 10, description: 'خصم 10%' },
    { code: 'NEW50', type: 'fixed', value: 50, description: 'خصم 50 ر.س للعملاء الجدد' },
    { code: 'FREESHIP', type: 'shipping', value: 0, description: 'شحن مجاني' }
  ];
  
  // Cart item management functions
  window.updateCartQuantity = (productId, change) => {
    const itemIndex = cartItems.findIndex(item => item.productId === productId);
    if (itemIndex >= 0) {
      const newQuantity = cartItems[itemIndex].quantity + change;
      if (newQuantity <= 0) {
        cartItems.splice(itemIndex, 1);
      } else if (newQuantity <= 10) {
        cartItems[itemIndex].quantity = newQuantity;
      }
      actions.saveCart(cartItems);
      setTimeout(() => navigate('#/cart'), 100);
    }
  };
  
  window.removeFromCart = (productId) => {
    const itemIndex = cartItems.findIndex(item => item.productId === productId);
    if (itemIndex >= 0) {
      cartItems.splice(itemIndex, 1);
      actions.saveCart(cartItems);
      showNotification(t('item_removed') || 'تم حذف العنصر', 'info');
      setTimeout(() => navigate('#/cart'), 100);
    }
  };
  
  window.moveToWishlist = (productId) => {
    window.removeFromCart(productId);
    actions.toggleWishlist(productId);
    showNotification(t('moved_to_wishlist') || 'تم النقل للمفضلة', 'success');
  };
  
  window.saveForLater = (productId) => {
    window.removeFromCart(productId);
    if (!state.wishlist.saveForLater) state.wishlist.saveForLater = [];
    if (!state.wishlist.saveForLater.includes(productId)) {
      state.wishlist.saveForLater.push(productId);
    }
    saveState(state);
    showNotification(t('saved_for_later') || 'تم الحفظ للاحقاً', 'info');
    setTimeout(() => navigate('#/cart'), 100);
  };
  
  window.moveBackToCart = (productId) => {
    const product = productById(productId);
    if (product) {
      cartItems.push({ productId, quantity: 1, price: product.price });
      actions.saveCart(cartItems);
      
      // Remove from saved for later
      const index = savedForLater.indexOf(productId);
      if (index >= 0) {
        savedForLater.splice(index, 1);
        state.wishlist.saveForLater = savedForLater;
        saveState(state);
      }
      
      showNotification(t('moved_to_cart') || 'تم النقل للسلة', 'success');
      setTimeout(() => navigate('#/cart'), 100);
    }
  };
  
  window.applyPromoCode = () => {
    const input = document.getElementById('promo-input');
    const code = input.value.trim().toUpperCase();
    const messageEl = document.getElementById('promo-message');
    
    if (!code) {
      messageEl.textContent = t('enter_promo_code') || 'أدخل كود الخصم';
      messageEl.style.color = 'var(--text-muted)';
      return;
    }
    
    const promo = availablePromos.find(p => p.code === code);
    if (promo) {
      state.appliedPromo = promo;
      saveState(state);
      messageEl.textContent = `${t('promo_applied') || 'تم تطبيق الكود'}: ${promo.description}`;
      messageEl.style.color = 'var(--success)';
      input.value = '';
      setTimeout(() => navigate('#/cart'), 500);
    } else {
      messageEl.textContent = t('invalid_promo_code') || 'كود خصم غير صحيح';
      messageEl.style.color = 'var(--danger)';
    }
  };
  
  window.removePromoCode = () => {
    delete state.appliedPromo;
    saveState(state);
    setTimeout(() => navigate('#/cart'), 100);
  };
  
  window.quickAddToCart = (productId) => {
    const product = productById(productId);
    if (product) {
      const existingItem = cartItems.find(item => item.productId === productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartItems.push({ productId, quantity: 1, price: product.price });
      }
      actions.saveCart(cartItems);
      showNotification(t('added_to_cart') || 'تم إضافة المنتج للسلة', 'success');
      setTimeout(() => navigate('#/cart'), 100);
    }
  };
  
  window.clearCart = () => {
    if (confirm(t('confirm_clear_cart') || 'هل أنت متأكد من حذف جميع العناصر؟')) {
      state.cart = [];
      actions.saveCart([]);
      showNotification(t('cart_cleared') || 'تم مسح السلة', 'info');
      setTimeout(() => navigate('#/cart'), 100);
    }
  };
  
  window.proceedToCheckout = () => {
    if (cartItems.length === 0) {
      showNotification(t('cart_empty_checkout') || 'السلة فارغة! أضف منتجات أولاً', 'warning');
      return;
    }
    navigate('#/checkout');
  };
  
  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : type === 'danger' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      z-index: 1000;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  el.innerHTML = h(`
    <div class="cart-container">
      <!-- Header -->
      <div class="cart-header">
        <h1>${t('cart') || 'السلة'} ${cartItems.length > 0 ? `(${cartItems.length})` : ''}</h1>
        ${cartItems.length > 0 ? `
          <button class="clear-cart-btn" onclick="clearCart()">
            🗑️ ${t('clear_cart') || 'مسح السلة'}
          </button>
        ` : ''}
      </div>

      ${cartItems.length === 0 ? `
        <!-- Empty Cart -->
        <div class="empty-cart">
          <div class="empty-cart-icon">🛒</div>
          <h2>${t('cart_empty') || 'سلتك فارغة'}</h2>
          <p>${t('cart_empty_desc') || 'ابدأ بإضافة منتجات رائعة لسلتك'}</p>
          
          <!-- Suggested Actions -->
          <div class="empty-cart-actions">
            <button onclick="navigate('#/home')" class="primary">
              🏠 ${t('continue_shopping') || 'متابعة التسوق'}
            </button>
            <button onclick="navigate('#/discover')" class="secondary">
              🔍 ${t('discover_products') || 'اكتشف المنتجات'}
            </button>
          </div>
          
          <!-- Popular Products -->
          <div class="popular-products">
            <h3>${t('popular_products') || 'منتجات شائعة'}</h3>
            <div class="products-grid">
              ${(state.products || []).filter(p => p.rating >= 4.5).slice(0, 3).map(product => `
                <div class="product-card" onclick="navigate('#/pdp/${product.id}')">
                  <img src="${uns(product.img, 150)}" alt="${getProductTitle(product)}">
                  <div class="card-content">
                    <h4>${getProductTitle(product)}</h4>
                    <div class="rating">
                      <span class="stars">${stars(product.rating)}</span>
                      <span class="rating-count">(${product.reviewCount || 0})</span>
                    </div>
                    <div class="price">${fmtSAR(product.price)}</div>
                    <button onclick="event.stopPropagation(); quickAddToCart('${product.id}')" class="quick-add-btn">
                      ${t('quick_add') || 'إضافة سريعة'}
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      ` : `
        <!-- Cart with Items -->
        <div class="cart-content">
          <!-- Cart Items -->
          <div class="cart-items">
            <div class="items-header">
              <h3>${t('items_in_cart') || 'العناصر في السلة'}</h3>
              <span class="items-count">${cartItems.length} ${t('items') || 'عناصر'}</span>
            </div>
            
            ${cartItems.map(item => {
              const product = productById(item.productId);
              if (!product) return '';
              
              const itemTotal = product.price * item.quantity;
              
              return `
                <div class="cart-item">
                  <div class="item-image">
                    <img src="${uns(product.img, 120)}" alt="${getProductTitle(product)}" 
                         onclick="navigate('#/pdp/${product.id}')">
                  </div>
                  
                  <div class="item-details">
                    <h4 class="item-title" onclick="navigate('#/pdp/${product.id}')">
                      ${getProductTitle(product)}
                    </h4>
                    <div class="item-meta">
                      <span class="creator">${t('by') || 'من'} ${creatorById(product.creatorId)?.name || 'Unknown'}</span>
                      ${item.color ? `<span class="variant">${t('color') || 'اللون'}: ${item.color}</span>` : ''}
                      ${item.size ? `<span class="variant">${t('size') || 'المقاس'}: ${item.size}</span>` : ''}
                    </div>
                    
                    <!-- Stock Status -->
                    <div class="stock-status">
                      ${product.stock > 10 ? 
                        `<span class="in-stock">✅ ${t('in_stock') || 'متوفر'}</span>` :
                        product.stock > 0 ? 
                        `<span class="limited-stock">⚠️ ${t('limited_stock') || 'مخزون محدود'} (${product.stock} ${t('left') || 'متبقي'})</span>` :
                        `<span class="out-of-stock">❌ ${t('out_of_stock') || 'نفد المخزون'}</span>`
                      }
                    </div>
                    
                    <!-- Item Actions -->
                    <div class="item-actions">
                      <button onclick="saveForLater('${item.productId}')" class="action-btn">
                        💾 ${t('save_for_later') || 'احفظ للاحقاً'}
                      </button>
                      <button onclick="moveToWishlist('${item.productId}')" class="action-btn">
                        ♡ ${t('move_to_wishlist') || 'نقل للمفضلة'}
                      </button>
                      <button onclick="removeFromCart('${item.productId}')" class="action-btn remove">
                        🗑️ ${t('remove') || 'حذف'}
                      </button>
                    </div>
                  </div>
                  
                  <div class="item-controls">
                    <!-- Quantity Controls -->
                    <div class="quantity-controls">
                      <button onclick="updateCartQuantity('${item.productId}', -1)" 
                              class="qty-btn" ${item.quantity <= 1 ? 'disabled' : ''}>
                        −
                      </button>
                      <span class="quantity">${item.quantity}</span>
                      <button onclick="updateCartQuantity('${item.productId}', 1)" 
                              class="qty-btn" ${item.quantity >= 10 ? 'disabled' : ''}>
                        +
                      </button>
                    </div>
                    
                    <!-- Price -->
                    <div class="item-pricing">
                      <div class="unit-price">${fmtSAR(product.price)} ${t('each') || 'للقطعة'}</div>
                      <div class="total-price">${fmtSAR(itemTotal)}</div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          
          <!-- Order Summary -->
          <div class="order-summary">
            <h3>${t('order_summary') || 'ملخص الطلب'}</h3>
            
            <!-- Promo Code Section -->
            <div class="promo-section">
              <h4>${t('promo_code') || 'كود الخصم'}</h4>
              ${promoCode ? `
                <div class="applied-promo">
                  <div class="promo-info">
                    <span class="promo-code">${promoCode.code}</span>
                    <span class="promo-desc">${promoCode.description}</span>
                  </div>
                  <button onclick="removePromoCode()" class="remove-promo">×</button>
                </div>
              ` : `
                <div class="promo-input-section">
                  <div class="promo-input-group">
                    <input type="text" id="promo-input" placeholder="${t('enter_promo_code') || 'أدخل كود الخصم'}" 
                           onkeypress="if(event.key==='Enter') applyPromoCode()">
                    <button onclick="applyPromoCode()" class="apply-promo-btn">
                      ${t('apply') || 'تطبيق'}
                    </button>
                  </div>
                  <div id="promo-message" class="promo-message"></div>
                  
                  <!-- Available Promo Codes (for demo) -->
                  <div class="available-promos">
                    <small>${t('try_these_codes') || 'جرب هذه الأكواد'}:</small>
                    ${availablePromos.map(promo => `
                      <button class="promo-suggestion" onclick="document.getElementById('promo-input').value='${promo.code}'; applyPromoCode();">
                        ${promo.code}
                      </button>
                    `).join('')}
                  </div>
                </div>
              `}
            </div>
            
            <!-- Summary Breakdown -->
            <div class="summary-breakdown">
              <div class="summary-line">
                <span>${t('subtotal') || 'المجموع الفرعي'}</span>
                <span>${fmtSAR(subtotal)}</span>
              </div>
              
              <div class="summary-line">
                <span>${t('shipping') || 'الشحن'}</span>
                <span>${shippingCost === 0 ? 
                  `<span class="free">${t('free') || 'مجاني'}</span>` : 
                  fmtSAR(shippingCost)
                }</span>
              </div>
              
              <div class="summary-line">
                <span>${t('vat') || 'ضريبة القيمة المضافة'} (15%)</span>
                <span>${fmtSAR(tax)}</span>
              </div>
              
              ${promoDiscount > 0 ? `
                <div class="summary-line discount">
                  <span>${t('discount') || 'الخصم'}</span>
                  <span>-${fmtSAR(promoDiscount)}</span>
                </div>
              ` : ''}
              
              <div class="summary-line total">
                <span>${t('total') || 'الإجمالي'}</span>
                <span>${fmtSAR(finalTotal)}</span>
              </div>
            </div>
            
            <!-- Shipping Info -->
            <div class="shipping-info">
              <div class="shipping-option">
                <div class="option-icon">🚚</div>
                <div class="option-details">
                  <div class="option-title">${t('free_shipping') || 'شحن مجاني'}</div>
                  <div class="option-desc">
                    ${subtotal >= 200 ? 
                      `${t('free_shipping_eligible') || 'مؤهل للشحن المجاني'}` :
                      `${t('free_shipping_threshold') || 'أضف'} ${fmtSAR(200 - subtotal)} ${t('for_free_shipping') || 'للحصول على الشحن المجاني'}`
                    }
                  </div>
                </div>
              </div>
              
              <div class="delivery-estimate">
                <span class="icon">📅</span>
                <span>${t('estimated_delivery') || 'التوصيل المتوقع'}: ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
              </div>
            </div>
            
            <!-- Checkout Button -->
            <button class="checkout-btn" onclick="proceedToCheckout()">
              🛒 ${t('proceed_to_checkout') || 'متابعة للدفع'}
            </button>
            
            <!-- Trust Indicators -->
            <div class="trust-indicators">
              <div class="trust-item">
                <span class="icon">🔒</span>
                <span>${t('secure_checkout') || 'دفع آمن'}</span>
              </div>
              <div class="trust-item">
                <span class="icon">↩️</span>
                <span>${t('easy_returns') || 'إرجاع سهل'}</span>
              </div>
            </div>
          </div>
        </div>
      `}
      
      <!-- Saved for Later Section -->
      ${savedItems.length > 0 ? `
        <div class="saved-for-later">
          <h3>${t('saved_for_later') || 'محفوظ للاحقاً'} (${savedItems.length})</h3>
          <div class="saved-items">
            ${savedItems.map(product => `
              <div class="saved-item">
                <img src="${uns(product.img, 80)}" alt="${getProductTitle(product)}" 
                     onclick="navigate('#/pdp/${product.id}')">
                <div class="saved-item-details">
                  <h5 onclick="navigate('#/pdp/${product.id}')">${getProductTitle(product)}</h5>
                  <div class="saved-item-price">${fmtSAR(product.price)}</div>
                </div>
                <div class="saved-item-actions">
                  <button onclick="moveBackToCart('${product.id}')" class="move-to-cart-btn">
                    ${t('move_to_cart') || 'نقل للسلة'}
                  </button>
                  <button onclick="removeFromSaved('${product.id}')" class="remove-saved-btn">
                    ${t('remove') || 'حذف'}
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      <!-- Continue Shopping -->
      <div class="continue-shopping">
        <button onclick="navigate('#/discover')" class="continue-shopping-btn">
          ← ${t('continue_shopping') || 'متابعة التسوق'}
        </button>
      </div>
    </div>

    <style>
      .cart-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }

      .cart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 32px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--border);
      }

      .cart-header h1 {
        font-size: 2rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0;
      }

      .clear-cart-btn {
        background: var(--danger);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s ease;
      }

      .clear-cart-btn:hover {
        background: var(--danger-dark);
      }

      /* Empty Cart Styles */
      .empty-cart {
        text-align: center;
        padding: 80px 20px;
      }

      .empty-cart-icon {
        font-size: 5rem;
        margin-bottom: 24px;
        opacity: 0.6;
      }

      .empty-cart h2 {
        font-size: 1.8rem;
        font-weight: 600;
        margin-bottom: 12px;
        color: var(--text-primary);
      }

      .empty-cart p {
        font-size: 1.1rem;
        color: var(--text-muted);
        margin-bottom: 32px;
      }

      .empty-cart-actions {
        display: flex;
        gap: 16px;
        justify-content: center;
        margin-bottom: 48px;
      }

      .empty-cart-actions button {
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: all 0.3s ease;
      }

      .empty-cart-actions .primary {
        background: var(--primary);
        color: white;
      }

      .empty-cart-actions .secondary {
        background: var(--card);
        color: var(--text-primary);
        border: 1px solid var(--border);
      }

      .popular-products {
        margin-top: 48px;
        text-align: left;
      }

      .popular-products h3 {
        font-size: 1.3rem;
        font-weight: 600;
        margin-bottom: 20px;
        color: var(--text-primary);
      }

      .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }

      .product-card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 8px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .product-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }

      .product-card img {
        width: 100%;
        height: 120px;
        object-fit: cover;
      }

      .card-content {
        padding: 12px;
      }

      .card-content h4 {
        font-size: 0.9rem;
        font-weight: 600;
        margin-bottom: 8px;
        line-height: 1.3;
      }

      .rating {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-bottom: 8px;
      }

      .stars {
        color: #ffd700;
        font-size: 0.8rem;
      }

      .rating-count {
        font-size: 0.8rem;
        color: var(--text-muted);
      }

      .price {
        font-weight: 600;
        color: var(--primary);
        margin-bottom: 8px;
      }

      .quick-add-btn {
        width: 100%;
        background: var(--primary);
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8rem;
        transition: background 0.3s ease;
      }

      .quick-add-btn:hover {
        background: var(--primary-dark);
      }

      /* Cart Content */
      .cart-content {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 40px;
      }

      .cart-items {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 24px;
      }

      .items-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--border);
      }

      .items-header h3 {
        font-size: 1.3rem;
        font-weight: 600;
        margin: 0;
        color: var(--text-primary);
      }

      .items-count {
        color: var(--text-muted);
        font-size: 0.9rem;
      }

      .cart-item {
        display: grid;
        grid-template-columns: 80px 1fr auto;
        gap: 16px;
        padding: 20px 0;
        border-bottom: 1px solid var(--border);
      }

      .cart-item:last-child {
        border-bottom: none;
      }

      .item-image img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
        cursor: pointer;
        transition: transform 0.3s ease;
      }

      .item-image img:hover {
        transform: scale(1.05);
      }

      .item-details {
        flex: 1;
      }

      .item-title {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 8px;
        cursor: pointer;
        color: var(--text-primary);
        line-height: 1.3;
      }

      .item-title:hover {
        color: var(--primary);
      }

      .item-meta {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 8px;
      }

      .creator, .variant {
        font-size: 0.9rem;
        color: var(--text-muted);
      }

      .stock-status {
        margin-bottom: 12px;
      }

      .in-stock {
        color: var(--success);
        font-size: 0.8rem;
      }

      .limited-stock {
        color: var(--warning);
        font-size: 0.8rem;
      }

      .out-of-stock {
        color: var(--danger);
        font-size: 0.8rem;
      }

      .item-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      .action-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        font-size: 0.8rem;
        padding: 4px 8px;
        border-radius: 4px;
        transition: all 0.3s ease;
      }

      .action-btn:hover {
        background: var(--primary-light);
        color: var(--primary);
      }

      .action-btn.remove:hover {
        background: var(--danger-light);
        color: var(--danger);
      }

      .item-controls {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 12px;
      }

      .quantity-controls {
        display: flex;
        align-items: center;
        border: 1px solid var(--border);
        border-radius: 6px;
        overflow: hidden;
      }

      .qty-btn {
        background: var(--card);
        border: none;
        width: 32px;
        height: 32px;
        cursor: pointer;
        font-size: 1.1rem;
        font-weight: 600;
        transition: background 0.3s ease;
      }

      .qty-btn:hover:not(:disabled) {
        background: var(--primary-light);
      }

      .qty-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .quantity {
        padding: 0 16px;
        font-weight: 600;
        min-width: 40px;
        text-align: center;
      }

      .item-pricing {
        text-align: right;
      }

      .unit-price {
        font-size: 0.8rem;
        color: var(--text-muted);
        margin-bottom: 4px;
      }

      .total-price {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--primary);
      }

      /* Order Summary */
      .order-summary {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 24px;
        height: fit-content;
        position: sticky;
        top: 20px;
      }

      .order-summary h3 {
        font-size: 1.3rem;
        font-weight: 600;
        margin-bottom: 20px;
        color: var(--text-primary);
      }

      .promo-section {
        margin-bottom: 24px;
        padding-bottom: 20px;
        border-bottom: 1px solid var(--border);
      }

      .promo-section h4 {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 12px;
        color: var(--text-primary);
      }

      .applied-promo {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--success-light);
        padding: 12px;
        border-radius: 6px;
        border: 1px solid var(--success);
      }

      .promo-info {
        display: flex;
        flex-direction: column;
      }

      .promo-code {
        font-weight: 600;
        color: var(--success);
      }

      .promo-desc {
        font-size: 0.8rem;
        color: var(--text-muted);
      }

      .remove-promo {
        background: none;
        border: none;
        color: var(--success);
        cursor: pointer;
        font-size: 1.2rem;
        font-weight: 600;
      }

      .promo-input-group {
        display: flex;
        gap: 8px;
        margin-bottom: 8px;
      }

      #promo-input {
        flex: 1;
        padding: 10px 12px;
        border: 1px solid var(--border);
        border-radius: 6px;
        font-size: 0.9rem;
      }

      .apply-promo-btn {
        background: var(--primary);
        color: white;
        border: none;
        padding: 10px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 500;
      }

      .promo-message {
        font-size: 0.8rem;
        margin-bottom: 8px;
      }

      .available-promos {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .available-promos small {
        color: var(--text-muted);
        font-size: 0.7rem;
      }

      .promo-suggestion {
        background: var(--card-secondary);
        border: 1px dashed var(--border);
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8rem;
        text-align: left;
        color: var(--text-muted);
        transition: all 0.3s ease;
      }

      .promo-suggestion:hover {
        background: var(--primary-light);
        color: var(--primary);
        border-color: var(--primary);
      }

      .summary-breakdown {
        margin-bottom: 24px;
      }

      .summary-line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        font-size: 0.9rem;
      }

      .summary-line.discount {
        color: var(--success);
      }

      .summary-line.total {
        border-top: 1px solid var(--border);
        margin-top: 8px;
        padding-top: 16px;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-primary);
      }

      .free {
        color: var(--success);
        font-weight: 600;
      }

      .shipping-info {
        margin-bottom: 24px;
        padding: 16px;
        background: var(--card-secondary);
        border-radius: 8px;
      }

      .shipping-option {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
      }

      .option-icon {
        font-size: 1.5rem;
      }

      .option-title {
        font-weight: 600;
        font-size: 0.9rem;
        margin-bottom: 4px;
      }

      .option-desc {
        font-size: 0.8rem;
        color: var(--text-muted);
      }

      .delivery-estimate {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.8rem;
        color: var(--text-muted);
      }

      .checkout-btn {
        width: 100%;
        background: var(--primary);
        color: white;
        border: none;
        padding: 16px;
        border-radius: 8px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        margin-bottom: 16px;
        transition: all 0.3s ease;
      }

      .checkout-btn:hover {
        background: var(--primary-dark);
        transform: translateY(-1px);
      }

      .trust-indicators {
        display: flex;
        justify-content: space-around;
        padding-top: 16px;
        border-top: 1px solid var(--border);
      }

      .trust-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        font-size: 0.8rem;
        color: var(--text-muted);
      }

      .trust-item .icon {
        font-size: 1.2rem;
      }

      /* Saved for Later */
      .saved-for-later {
        margin-top: 40px;
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 24px;
      }

      .saved-for-later h3 {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 20px;
        color: var(--text-primary);
      }

      .saved-items {
        display: grid;
        gap: 16px;
      }

      .saved-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
        background: var(--card-secondary);
        border-radius: 8px;
      }

      .saved-item img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 6px;
        cursor: pointer;
      }

      .saved-item-details {
        flex: 1;
      }

      .saved-item-details h5 {
        font-size: 0.9rem;
        font-weight: 600;
        margin-bottom: 4px;
        cursor: pointer;
        color: var(--text-primary);
      }

      .saved-item-details h5:hover {
        color: var(--primary);
      }

      .saved-item-price {
        font-weight: 600;
        color: var(--primary);
        font-size: 0.9rem;
      }

      .saved-item-actions {
        display: flex;
        gap: 8px;
      }

      .move-to-cart-btn, .remove-saved-btn {
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8rem;
        border: none;
        transition: all 0.3s ease;
      }

      .move-to-cart-btn {
        background: var(--primary);
        color: white;
      }

      .remove-saved-btn {
        background: var(--danger);
        color: white;
      }

      .continue-shopping {
        margin-top: 32px;
        text-align: center;
      }

      .continue-shopping-btn {
        background: none;
        border: 1px solid var(--border);
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        color: var(--text-primary);
        font-size: 1rem;
        transition: all 0.3s ease;
      }

      .continue-shopping-btn:hover {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .cart-container {
          padding: 16px;
        }

        .cart-content {
          grid-template-columns: 1fr;
          gap: 24px;
        }

        .cart-item {
          grid-template-columns: 60px 1fr;
          gap: 12px;
        }

        .item-controls {
          grid-column: 1 / -1;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
        }

        .empty-cart-actions {
          flex-direction: column;
          align-items: center;
        }

        .products-grid {
          grid-template-columns: repeat(2, 1fr);
        }

        .trust-indicators {
          flex-direction: column;
          gap: 12px;
        }
      }

      /* RTL Support */
      [dir="rtl"] .cart-content {
        grid-template-columns: 1fr 2fr;
      }

      [dir="rtl"] .cart-item {
        grid-template-columns: auto 1fr 80px;
      }

      [dir="rtl"] .item-controls {
        align-items: flex-start;
      }

      [dir="rtl"] .continue-shopping-btn {
        direction: rtl;
      }
    </style>
  `);
        
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
        <div class="cart-layout" style="display: grid; grid-template-columns: 1fr 400px; gap: 32px; margin-top: 24px;">
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
            <div style="background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
              <h3 style="margin: 0 0 20px; font-size: 18px; font-weight: 600; color: var(--text);">${t("shipping_options")}</h3>
              ${state.cartEnhancements.shippingOptions.map(option => {
                const isSelected = state.cartEnhancements.selectedShipping === option.id;
                const isFeeFree = option.freeThreshold && summary.subtotal >= option.freeThreshold;
                const displayPrice = isFeeFree ? 0 : option.price;
                
                return `
                  <div onclick="selectShipping('${option.id}')" style="
                    display: flex; 
                    align-items: center; 
                    gap: 16px; 
                    padding: 16px; 
                    border: 2px solid ${isSelected ? 'var(--ok)' : 'var(--border)'}; 
                    border-radius: 12px; 
                    margin-bottom: 12px; 
                    cursor: pointer; 
                    background: ${isSelected ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%)' : 'var(--bg)'}; 
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: ${isSelected ? '0 4px 16px rgba(16, 185, 129, 0.15)' : '0 2px 4px rgba(0,0,0,0.05)'};
                    transform: ${isSelected ? 'translateY(-1px)' : 'translateY(0)'};
                  ">
                    <div style="
                      width: 20px; 
                      height: 20px; 
                      border: 2px solid ${isSelected ? 'var(--ok)' : 'var(--border)'}; 
                      border-radius: 50%; 
                      position: relative;
                      transition: all 0.2s ease;
                      background: ${isSelected ? 'var(--ok)' : 'transparent'};
                    ">
                      ${isSelected ? '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 8px; height: 8px; background: white; border-radius: 50%;"></div>' : ''}
                    </div>
                    <div style="flex: 1;">
                      <div style="font-weight: 600; margin-bottom: 4px; color: var(--text); font-size: 15px;">${getProductField(option, "name")}</div>
                      <div style="font-size: 13px; color: var(--text-muted); line-height: 1.4;">${getProductField(option, "description")}</div>
                      ${isFeeFree ? `<div style="font-size: 12px; color: var(--ok); font-weight: 600; margin-top: 4px; display: flex; align-items: center; gap: 4px;"><span style="font-size: 14px;">✓</span> ${t("free_shipping")}</div>` : ''}
                    </div>
                    <div style="
                      font-weight: 700; 
                      color: ${displayPrice === 0 ? 'var(--ok)' : 'var(--text)'}; 
                      font-size: 16px;
                      ${displayPrice === 0 ? 'background: linear-gradient(135deg, var(--ok) 0%, #22c55e 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;' : ''}
                    ">
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
const wishlist = ({ el, navigate, actions }) => {
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
          <button onclick="createNewWishlist()" style="padding: 8px 16px; border: 1px solid var(--border); background: var(--bg); color: var(--text); border-radius: 6px; cursor: pointer;">
            ➕ ${t("create_wishlist")}
          </button>
          <button onclick="showWishlistSettings()" style="padding: 8px 16px; border: 1px solid var(--border); background: var(--bg); color: var(--text); border-radius: 6px; cursor: pointer;">
            ⚙️ ${t("settings")}
          </button>
        </div>
      </div>

      <!-- Wishlist Stats -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px;">
        <div onclick="location.hash='#/wishlist'" style="background: linear-gradient(135deg, #ff6b6b, #ff8e8e); color: white; padding: 20px; border-radius: 12px; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" title="View all wishlist items">
          <div style="font-size: 32px; font-weight: bold;">${stats.totalItems}</div>
          <div style="opacity: 0.9;">${t("total_items_saved")}</div>
        </div>
        <div onclick="switchWishlistCollection('all')" style="background: linear-gradient(135deg, #4ecdc4, #6bcf7f); color: white; padding: 20px; border-radius: 12px; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" title="View all collections">
          <div style="font-size: 32px; font-weight: bold;">${stats.totalCollections}</div>
          <div style="opacity: 0.9;">${t("total_lists_created")}</div>
        </div>
        <div onclick="showAllSaveForLater()" style="background: linear-gradient(135deg, #a8e6cf, #7fcdcd); color: white; padding: 20px; border-radius: 12px; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" title="View saved for later items">
          <div style="font-size: 32px; font-weight: bold;">${stats.totalSaveForLater}</div>
          <div style="opacity: 0.9;">${t("saved_for_later")}</div>
        </div>
        <div onclick="location.hash='#/home'" style="background: linear-gradient(135deg, #ffd93d, #6bcf7f); color: white; padding: 20px; border-radius: 12px; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" title="View recently viewed items">
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
              <button onclick="toggleBulkSelect()" style="padding: 6px 12px; border: 1px solid var(--border); background: var(--bg); color: var(--text); border-radius: 4px; cursor: pointer;">
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
                  <div onclick="location.hash='#/pdp/${product.id}'" style="display: flex; gap: 12px; padding: 8px; border: 1px solid var(--border); border-radius: 6px; cursor: pointer; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='var(--bg-hover)'" onmouseout="this.style.backgroundColor='transparent'">
                    <img src="${getProductImage(product, 80)}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
                    <div style="flex: 1; min-width: 0;">
                      <div style="font-weight: 500; font-size: 13px; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        ${getProductTitle(product)}
                      </div>
                      <div style="color: var(--brand); font-weight: bold; font-size: 13px;">
                        ${fmtSAR(product.price)}
                      </div>
                    </div>
                    <button onclick="event.stopPropagation(); addToWishlist('${product.id}')" title="${actions.isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}" style="padding: 4px; background: none; border: none; cursor: pointer; font-size: 16px;">
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
            ${(() => {
              const cartItem = window.__app__?.state?.cart?.find(item => item.productId === product.id);
              const cartQty = cartItem ? cartItem.quantity : 0;
              const buttonText = cartQty > 0 ? `🛒 ${t("add_to_cart")} (${cartQty})` : `🛒 ${t("add_to_cart")}`;
              const titleText = cartQty > 0 ? `In Cart (${cartQty})` : t("add_to_cart") || "Add to Cart";
              return `<button onclick="event.stopPropagation(); addToCartFromWishlist('${product.id}')" 
                    style="flex: 1; padding: 10px; background: var(--brand); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;"
                    title="${titleText}">
              ${buttonText}
            </button>`;
            })()}
            <button onclick="event.stopPropagation(); shareProduct('${product.id}')" 
                    style="padding: 10px 12px; border: 1px solid var(--border); background: white; border-radius: 6px; cursor: pointer;"
                    title="Share Product">
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
const orders = ({ el, state, actions }) => {
  const userOrders = state.orders || [];
  const orderStatuses = {
    'confirmed': { label: t('order_confirmed') || 'تم تأكيد الطلب', color: '#3b82f6', icon: '✅' },
    'processing': { label: t('processing') || 'قيد المعالجة', color: '#f59e0b', icon: '⏳' },
    'shipped': { label: t('shipped') || 'تم الشحن', color: '#8b5cf6', icon: '🚚' },
    'out_for_delivery': { label: t('out_for_delivery') || 'في الطريق للتوصيل', color: '#06b6d4', icon: '🛵' },
    'delivered': { label: t('delivered') || 'تم التوصيل', color: '#10b981', icon: '📦' },
    'cancelled': { label: t('cancelled') || 'ملغي', color: '#ef4444', icon: '❌' },
    'returned': { label: t('returned') || 'مرتجع', color: '#6b7280', icon: '↩️' }
  };
  
  let selectedFilter = 'all';
  let selectedTimeframe = 'all';
  
  // Global functions
  window.filterOrders = (filter) => {
    selectedFilter = filter;
    updateOrdersList();
    
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
  };
  
  window.filterByTimeframe = (timeframe) => {
    selectedTimeframe = timeframe;
    updateOrdersList();
    
    // Update timeframe select
    const select = document.getElementById('timeframe-select');
    if (select) select.value = timeframe;
  };
  
  window.viewOrderDetails = (orderId) => {
    const order = userOrders.find(o => o.id === orderId);
    if (!order) return;
    
    showOrderDetailModal(order);
  };
  
  window.trackOrder = (orderId) => {
    const order = userOrders.find(o => o.id === orderId);
    if (!order) return;
    
    showTrackingModal(order);
  };
  
  window.reorderItems = (orderId) => {
    const order = userOrders.find(o => o.id === orderId);
    if (!order) return;
    
    // Add items to cart
    order.items.forEach(item => {
      actions.addToCart(item.productId, item.quantity, item.variant);
    });
    
    showNotification(t('items_added_to_cart') || 'تم إضافة العناصر إلى السلة', 'success');
    navigate('#/cart');
  };
  
  window.cancelOrder = (orderId) => {
    const order = userOrders.find(o => o.id === orderId);
    if (!order) return;
    
    if (order.status === 'delivered' || order.status === 'cancelled') {
      showNotification(t('cannot_cancel_order') || 'لا يمكن إلغاء هذا الطلب', 'error');
      return;
    }
    
    if (confirm(t('confirm_cancel_order') || 'هل أنت متأكد من إلغاء هذا الطلب؟')) {
      order.status = 'cancelled';
      order.cancelledAt = new Date();
      saveState(state);
      updateOrdersList();
      showNotification(t('order_cancelled') || 'تم إلغاء الطلب', 'success');
    }
  };
  
  window.requestReturn = (orderId) => {
    const order = userOrders.find(o => o.id === orderId);
    if (!order) return;
    
    if (order.status !== 'delivered') {
      showNotification(t('can_only_return_delivered') || 'يمكن إرجاع الطلبات المُسلّمة فقط', 'warning');
      return;
    }
    
    // Check if return window is still open (30 days)
    const deliveryDate = new Date(order.deliveredAt || order.createdAt);
    const daysSinceDelivery = Math.floor((Date.now() - deliveryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceDelivery > 30) {
      showNotification(t('return_window_expired') || 'انتهت فترة الإرجاع (30 يوماً)', 'warning');
      return;
    }
    
    navigate('#/returns', { orderId });
  };
  
  window.downloadInvoice = (orderId) => {
    // Simulate invoice download
    showNotification(t('downloading_invoice') || 'جاري تحميل الفاتورة...', 'info');
  };
  
  const getFilteredOrders = () => {
    let filtered = userOrders;
    
    // Filter by status
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(order => order.status === selectedFilter);
    }
    
    // Filter by timeframe
    if (selectedTimeframe !== 'all') {
      const now = new Date();
      const timeframeDays = {
        'week': 7,
        'month': 30,
        '3months': 90,
        'year': 365
      };
      
      const days = timeframeDays[selectedTimeframe];
      if (days) {
        const cutoffDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
        filtered = filtered.filter(order => new Date(order.createdAt) >= cutoffDate);
      }
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };
  
  const updateOrdersList = () => {
    const ordersContainer = document.getElementById('orders-container');
    if (!ordersContainer) return;
    
    const filteredOrders = getFilteredOrders();
    ordersContainer.innerHTML = renderOrdersList(filteredOrders);
  };
  
  const renderOrdersList = (orders) => {
    if (orders.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-icon">📦</div>
          <h3>${t('no_orders_found') || 'لا توجد طلبات'}</h3>
          <p>${t('no_orders_desc') || 'لم تقم بأي طلبات بعد، ابدأ التسوق الآن!'}</p>
          <button onclick="navigate('#/home')" class="primary">
            ${t('start_shopping') || 'ابدأ التسوق'} 🛍️
          </button>
        </div>
      `;
    }
    
    return orders.map(order => {
      const status = orderStatuses[order.status] || orderStatuses.confirmed;
      const orderDate = new Date(order.createdAt).toLocaleDateString();
      const orderTime = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      return `
        <div class="order-card" data-order-id="${order.id}">
          <div class="order-header">
            <div class="order-info">
              <h3 class="order-number">${t('order') || 'طلب'} #${order.id}</h3>
              <div class="order-meta">
                <span class="order-date">📅 ${orderDate} ${orderTime}</span>
                <span class="order-total">💰 ${fmtSAR(order.total)}</span>
              </div>
            </div>
            
            <div class="order-status">
              <span class="status-badge" style="background: ${status.color}20; color: ${status.color}; border: 1px solid ${status.color}40;">
                ${status.icon} ${status.label}
              </span>
            </div>
          </div>
          
          <div class="order-items">
            ${order.items.slice(0, 3).map(item => {
              const product = productById(item.productId);
              if (!product) return '';
              
              return `
                <div class="order-item">
                  <img src="${uns(product.img, 60)}" alt="${getProductTitle(product)}">
                  <div class="item-details">
                    <h5>${getProductTitle(product)}</h5>
                    <span class="item-quantity">×${item.quantity}</span>
                  </div>
                </div>
              `;
            }).join('')}
            
            ${order.items.length > 3 ? `
              <div class="more-items">
                +${order.items.length - 3} ${t('more_items') || 'عناصر أخرى'}
              </div>
            ` : ''}
          </div>
          
          ${order.trackingNumber ? `
            <div class="tracking-info">
              <span class="tracking-label">${t('tracking_number') || 'رقم التتبع'}:</span>
              <span class="tracking-number">${order.trackingNumber}</span>
            </div>
          ` : ''}
          
          <div class="order-actions">
            <button onclick="viewOrderDetails('${order.id}')" class="secondary">
              👁️ ${t('view_details') || 'عرض التفاصيل'}
            </button>
            
            ${order.trackingNumber ? `
              <button onclick="trackOrder('${order.id}')" class="secondary">
                📍 ${t('track_order') || 'تتبع الطلب'}
              </button>
            ` : ''}
            
            ${order.status === 'delivered' ? `
              <button onclick="reorderItems('${order.id}')" class="secondary">
                🔄 ${t('reorder') || 'إعادة الطلب'}
              </button>
              
              <button onclick="requestReturn('${order.id}')" class="secondary">
                ↩️ ${t('return') || 'إرجاع'}
              </button>
            ` : ''}
            
            ${['confirmed', 'processing'].includes(order.status) ? `
              <button onclick="cancelOrder('${order.id}')" class="danger secondary">
                ❌ ${t('cancel') || 'إلغاء'}
              </button>
            ` : ''}
            
            <button onclick="downloadInvoice('${order.id}')" class="secondary">
              📄 ${t('invoice') || 'الفاتورة'}
            </button>
          </div>
        </div>
      `;
    }).join('');
  };
  
  const showOrderDetailModal = (order) => {
    const status = orderStatuses[order.status] || orderStatuses.confirmed;
    const orderDate = new Date(order.createdAt).toLocaleDateString();
    
    const modal = document.createElement('div');
    modal.className = 'order-detail-modal';
    modal.innerHTML = `
      <div class="modal-overlay" onclick="closeOrderDetail()">
        <div class="modal-content" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h2>${t('order_details') || 'تفاصيل الطلب'} #${order.id}</h2>
            <button class="close-btn" onclick="closeOrderDetail()">✕</button>
          </div>
          
          <div class="modal-body">
            <div class="order-overview">
              <div class="overview-item">
                <span class="label">${t('order_date') || 'تاريخ الطلب'}:</span>
                <span class="value">${orderDate}</span>
              </div>
              
              <div class="overview-item">
                <span class="label">${t('status') || 'الحالة'}:</span>
                <span class="value">
                  <span class="status-badge" style="background: ${status.color}20; color: ${status.color};">
                    ${status.icon} ${status.label}
                  </span>
                </span>
              </div>
              
              <div class="overview-item">
                <span class="label">${t('total_amount') || 'إجمالي المبلغ'}:</span>
                <span class="value">${fmtSAR(order.total)}</span>
              </div>
              
              ${order.trackingNumber ? `
                <div class="overview-item">
                  <span class="label">${t('tracking_number') || 'رقم التتبع'}:</span>
                  <span class="value">${order.trackingNumber}</span>
                </div>
              ` : ''}
            </div>
            
            <div class="shipping-details">
              <h4>${t('shipping_address') || 'عنوان الشحن'}</h4>
              <div class="address-info">
                <p><strong>${order.shipping.firstName} ${order.shipping.lastName}</strong></p>
                <p>${order.shipping.address}</p>
                <p>${order.shipping.city}, ${order.shipping.postalCode}</p>
                <p>${order.shipping.phone}</p>
                <p>${order.shipping.email}</p>
              </div>
            </div>
            
            <div class="order-items-detail">
              <h4>${t('order_items') || 'عناصر الطلب'}</h4>
              ${order.items.map(item => {
                const product = productById(item.productId);
                if (!product) return '';
                
                return `
                  <div class="detail-item">
                    <img src="${uns(product.img, 80)}" alt="${getProductTitle(product)}">
                    <div class="item-info">
                      <h5>${getProductTitle(product)}</h5>
                      <p class="item-price">${fmtSAR(product.price)} × ${item.quantity}</p>
                      <p class="item-total">${fmtSAR(product.price * item.quantity)}</p>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
            
            <div class="order-summary-detail">
              <h4>${t('order_summary') || 'ملخص الطلب'}</h4>
              <div class="summary-lines">
                <div class="summary-line">
                  <span>${t('subtotal') || 'المجموع الفرعي'}</span>
                  <span>${fmtSAR(order.subtotal)}</span>
                </div>
                
                <div class="summary-line">
                  <span>${t('shipping') || 'الشحن'}</span>
                  <span>${order.shipping ? fmtSAR(order.shipping) : t('free') || 'مجاني'}</span>
                </div>
                
                <div class="summary-line">
                  <span>${t('tax') || 'الضريبة'}</span>
                  <span>${fmtSAR(order.tax)}</span>
                </div>
                
                <div class="summary-line total">
                  <span>${t('total') || 'الإجمالي'}</span>
                  <span>${fmtSAR(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-actions">
            ${order.trackingNumber ? `
              <button onclick="trackOrder('${order.id}'); closeOrderDetail()" class="primary">
                📍 ${t('track_order') || 'تتبع الطلب'}
              </button>
            ` : ''}
            
            <button onclick="downloadInvoice('${order.id}')" class="secondary">
              📄 ${t('download_invoice') || 'تحميل الفاتورة'}
            </button>
          </div>
        </div>
      </div>
    `;
    
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2000;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.style.opacity = '1', 10);
    
    window.closeOrderDetail = () => {
      modal.style.opacity = '0';
      setTimeout(() => modal.remove(), 300);
    };
  };
  
  const showTrackingModal = (order) => {
    // Create tracking timeline
    const trackingSteps = [
      { key: 'confirmed', label: t('order_confirmed') || 'تم تأكيد الطلب', icon: '✅' },
      { key: 'processing', label: t('processing') || 'قيد المعالجة', icon: '⏳' },
      { key: 'shipped', label: t('shipped') || 'تم الشحن', icon: '🚚' },
      { key: 'out_for_delivery', label: t('out_for_delivery') || 'في الطريق للتوصيل', icon: '🛵' },
      { key: 'delivered', label: t('delivered') || 'تم التوصيل', icon: '📦' }
    ];
    
    const currentStepIndex = trackingSteps.findIndex(step => step.key === order.status);
    
    const modal = document.createElement('div');
    modal.className = 'tracking-modal';
    modal.innerHTML = `
      <div class="modal-overlay" onclick="closeTrackingModal()">
        <div class="modal-content" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h2>${t('track_order') || 'تتبع الطلب'} #${order.id}</h2>
            <button class="close-btn" onclick="closeTrackingModal()">✕</button>
          </div>
          
          <div class="modal-body">
            <div class="tracking-info">
              <div class="tracking-meta">
                <span class="tracking-number">${t('tracking_number') || 'رقم التتبع'}: ${order.trackingNumber}</span>
                <span class="estimated-delivery">${t('estimated_delivery') || 'التوصيل المتوقع'}: ${order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : t('calculating') || 'قيد الحساب'}</span>
              </div>
            </div>
            
            <div class="tracking-timeline">
              ${trackingSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                
                return `
                  <div class="timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}">
                    <div class="step-icon">${step.icon}</div>
                    <div class="step-content">
                      <h4>${step.label}</h4>
                      ${isCompleted ? `
                        <p class="step-time">${new Date(order.createdAt).toLocaleDateString()}</p>
                      ` : ''}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
            
            <div class="delivery-map">
              <h4>${t('delivery_route') || 'مسار التوصيل'}</h4>
              <div class="map-placeholder">
                <div class="map-icon">🗺️</div>
                <p>${t('tracking_map_placeholder') || 'خريطة تتبع الطلب (ستتوفر مع شركة الشحن)'}</p>
              </div>
            </div>
            
            <div class="delivery-contact">
              <h4>${t('delivery_contact') || 'معلومات التوصيل'}</h4>
              <div class="contact-info">
                <p><strong>${t('delivery_company') || 'شركة التوصيل'}:</strong> ${order.shippingOption?.name || 'SMSA Express'}</p>
                <p><strong>${t('driver_phone') || 'هاتف السائق'}:</strong> ${order.driverPhone || t('will_be_provided') || 'سيتم توفيره قريباً'}</p>
              </div>
            </div>
          </div>
          
          <div class="modal-actions">
            <button onclick="window.open('https://smsa.com.sa/ar/Track/default.aspx?TracNo=${order.trackingNumber}', '_blank')" class="primary">
              🌐 ${t('track_on_website') || 'تتبع على الموقع'}
            </button>
            
            <button onclick="navigator.share ? navigator.share({title: 'Order Tracking', text: 'Tracking: ${order.trackingNumber}'}) : alert('${t('copied_to_clipboard') || 'تم النسخ'}')" class="secondary">
              📤 ${t('share_tracking') || 'مشاركة التتبع'}
            </button>
          </div>
        </div>
      </div>
    `;
    
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2000;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.style.opacity = '1', 10);
    
    window.closeTrackingModal = () => {
      modal.style.opacity = '0';
      setTimeout(() => modal.remove(), 300);
    };
  };
  
  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      z-index: 1000;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  el.innerHTML = h(`
    <div class="orders-container">
      <!-- Header -->
      <div class="orders-header">
        <h1>${t('my_orders') || 'طلباتي'}</h1>
        <p>${t('orders_subtitle') || 'تتبع ومراجعة جميع طلباتك'}</p>
      </div>
      
      <!-- Stats Overview -->
      <div class="orders-stats">
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-info">
            <div class="stat-number">${userOrders.length}</div>
            <div class="stat-label">${t('total_orders') || 'إجمالي الطلبات'}</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <div class="stat-number">${userOrders.filter(o => o.status === 'delivered').length}</div>
            <div class="stat-label">${t('delivered') || 'مُسلّم'}</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🚚</div>
          <div class="stat-info">
            <div class="stat-number">${userOrders.filter(o => ['shipped', 'out_for_delivery'].includes(o.status)).length}</div>
            <div class="stat-label">${t('in_transit') || 'قيد التوصيل'}</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-info">
            <div class="stat-number">${fmtSAR(userOrders.reduce((sum, o) => sum + o.total, 0))}</div>
            <div class="stat-label">${t('total_spent') || 'إجمالي المبلغ'}</div>
          </div>
        </div>
      </div>
      
      <!-- Filters -->
      <div class="orders-filters">
        <div class="filter-section">
          <h3>${t('filter_by_status') || 'تصفية حسب الحالة'}</h3>
          <div class="filter-buttons">
            <button class="filter-btn active" data-filter="all" onclick="filterOrders('all')">
              ${t('all') || 'الكل'} (${userOrders.length})
            </button>
            <button class="filter-btn" data-filter="confirmed" onclick="filterOrders('confirmed')">
              ✅ ${t('confirmed') || 'مؤكد'} (${userOrders.filter(o => o.status === 'confirmed').length})
            </button>
            <button class="filter-btn" data-filter="shipped" onclick="filterOrders('shipped')">
              🚚 ${t('shipped') || 'مشحون'} (${userOrders.filter(o => o.status === 'shipped').length})
            </button>
            <button class="filter-btn" data-filter="delivered" onclick="filterOrders('delivered')">
              📦 ${t('delivered') || 'مُسلّم'} (${userOrders.filter(o => o.status === 'delivered').length})
            </button>
          </div>
        </div>
        
        <div class="timeframe-section">
          <label for="timeframe-select">${t('timeframe') || 'الفترة الزمنية'}:</label>
          <select id="timeframe-select" onchange="filterByTimeframe(this.value)">
            <option value="all">${t('all_time') || 'كل الأوقات'}</option>
            <option value="week">${t('last_week') || 'الأسبوع الماضي'}</option>
            <option value="month">${t('last_month') || 'الشهر الماضي'}</option>
            <option value="3months">${t('last_3_months') || 'آخر 3 أشهر'}</option>
            <option value="year">${t('last_year') || 'السنة الماضية'}</option>
          </select>
        </div>
      </div>
      
      <!-- Orders List -->
      <div class="orders-content">
        <div id="orders-container">
          ${renderOrdersList(getFilteredOrders())}
        </div>
      </div>
    </div>

    <style>
      .orders-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }

      .orders-header {
        text-align: center;
        margin-bottom: 40px;
      }

      .orders-header h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 8px;
        color: var(--text-primary);
      }

      .orders-header p {
        color: var(--text-muted);
        font-size: 1.1rem;
      }

      /* Stats Overview */
      .orders-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 40px;
      }

      .stat-card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 24px;
        display: flex;
        align-items: center;
        gap: 16px;
        transition: all 0.3s ease;
      }

      .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      }

      .stat-icon {
        font-size: 2.5rem;
        background: var(--primary-light);
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .stat-info {
        flex: 1;
      }

      .stat-number {
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: 4px;
      }

      .stat-label {
        color: var(--text-muted);
        font-size: 0.9rem;
        font-weight: 500;
      }

      /* Filters */
      .orders-filters {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 32px;
        display: flex;
        gap: 32px;
        align-items: center;
        flex-wrap: wrap;
      }

      .filter-section {
        flex: 1;
        min-width: 200px;
      }

      .filter-section h3 {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 12px;
        color: var(--text-primary);
      }

      .filter-buttons {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .filter-btn {
        padding: 8px 16px;
        border: 1px solid var(--border);
        border-radius: 6px;
        background: var(--card);
        color: var(--text-muted);
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        white-space: nowrap;
      }

      .filter-btn:hover {
        border-color: var(--primary);
        color: var(--primary);
      }

      .filter-btn.active {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
      }

      .timeframe-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-width: 200px;
      }

      .timeframe-section label {
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--text-primary);
      }

      .timeframe-section select {
        padding: 8px 12px;
        border: 1px solid var(--border);
        border-radius: 6px;
        background: var(--card);
        color: var(--text-primary);
        font-size: 0.9rem;
      }

      /* Orders List */
      .orders-content {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 24px;
      }

      .order-card {
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 16px;
        transition: all 0.3s ease;
      }

      .order-card:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 12px rgba(0,0,0,0.1);
      }

      .order-card:last-child {
        margin-bottom: 0;
      }

      .order-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 16px;
      }

      .order-number {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 8px;
        color: var(--text-primary);
      }

      .order-meta {
        display: flex;
        gap: 16px;
        font-size: 0.9rem;
        color: var(--text-muted);
      }

      .status-badge {
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        white-space: nowrap;
      }

      .order-items {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;
        flex-wrap: wrap;
        align-items: center;
      }

      .order-item {
        display: flex;
        align-items: center;
        gap: 8px;
        background: var(--card-secondary);
        padding: 8px;
        border-radius: 6px;
        min-width: 120px;
      }

      .order-item img {
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: 4px;
      }

      .item-details h5 {
        font-size: 0.8rem;
        font-weight: 600;
        margin-bottom: 2px;
        line-height: 1.2;
      }

      .item-quantity {
        font-size: 0.7rem;
        color: var(--text-muted);
      }

      .more-items {
        background: var(--card-secondary);
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.8rem;
        color: var(--text-muted);
        font-weight: 500;
      }

      .tracking-info {
        background: var(--primary-light);
        padding: 12px;
        border-radius: 6px;
        margin-bottom: 16px;
        font-size: 0.9rem;
      }

      .tracking-label {
        font-weight: 500;
        color: var(--text-primary);
      }

      .tracking-number {
        font-weight: 600;
        color: var(--primary);
        margin-left: 8px;
      }

      .order-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .order-actions button {
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 0.85rem;
        font-weight: 500;
        cursor: pointer;
        border: 1px solid var(--border);
        transition: all 0.3s ease;
      }

      .order-actions .secondary {
        background: var(--card);
        color: var(--text-primary);
      }

      .order-actions .secondary:hover {
        background: var(--card-secondary);
      }

      .order-actions .danger {
        color: var(--error);
        border-color: var(--error);
      }

      .order-actions .danger:hover {
        background: var(--error);
        color: white;
      }

      /* Empty State */
      .empty-state {
        text-align: center;
        padding: 60px 20px;
      }

      .empty-icon {
        font-size: 4rem;
        margin-bottom: 20px;
        opacity: 0.5;
      }

      .empty-state h3 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 12px;
        color: var(--text-primary);
      }

      .empty-state p {
        color: var(--text-muted);
        margin-bottom: 24px;
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
      }

      .empty-state button {
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        background: var(--primary);
        color: white;
        transition: all 0.3s ease;
      }

      .empty-state button:hover {
        background: var(--primary-dark);
        transform: translateY(-1px);
      }

      /* Modal Styles */
      .order-detail-modal .modal-overlay,
      .tracking-modal .modal-overlay {
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }

      .order-detail-modal .modal-content,
      .tracking-modal .modal-content {
        background: var(--card);
        border-radius: 12px;
        max-width: 700px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px 24px 0;
        border-bottom: 1px solid var(--border);
        margin-bottom: 24px;
      }

      .modal-header h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-primary);
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-muted);
        padding: 4px;
      }

      .close-btn:hover {
        color: var(--text-primary);
      }

      .modal-body {
        padding: 0 24px 24px;
      }

      .order-overview {
        background: var(--card-secondary);
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 24px;
      }

      .overview-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }

      .overview-item:last-child {
        margin-bottom: 0;
      }

      .overview-item .label {
        font-weight: 500;
        color: var(--text-muted);
      }

      .overview-item .value {
        font-weight: 600;
        color: var(--text-primary);
      }

      .shipping-details {
        margin-bottom: 24px;
      }

      .shipping-details h4 {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 12px;
        color: var(--text-primary);
      }

      .address-info {
        background: var(--card-secondary);
        border-radius: 6px;
        padding: 16px;
      }

      .address-info p {
        margin-bottom: 4px;
        color: var(--text-primary);
      }

      .order-items-detail {
        margin-bottom: 24px;
      }

      .order-items-detail h4 {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 16px;
        color: var(--text-primary);
      }

      .detail-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border: 1px solid var(--border);
        border-radius: 6px;
        margin-bottom: 8px;
      }

      .detail-item:last-child {
        margin-bottom: 0;
      }

      .detail-item img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 6px;
      }

      .item-info {
        flex: 1;
      }

      .item-info h5 {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 4px;
        color: var(--text-primary);
      }

      .item-price {
        color: var(--text-muted);
        font-size: 0.9rem;
      }

      .item-total {
        color: var(--primary);
        font-weight: 600;
        font-size: 0.9rem;
      }

      .order-summary-detail {
        margin-bottom: 24px;
      }

      .order-summary-detail h4 {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 16px;
        color: var(--text-primary);
      }

      .summary-lines {
        background: var(--card-secondary);
        border-radius: 6px;
        padding: 16px;
      }

      .summary-line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        font-size: 0.9rem;
      }

      .summary-line:last-child {
        margin-bottom: 0;
      }

      .summary-line.total {
        border-top: 1px solid var(--border);
        padding-top: 8px;
        margin-top: 8px;
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-primary);
      }

      .modal-actions {
        padding: 0 24px 24px;
        display: flex;
        gap: 12px;
        justify-content: center;
      }

      .modal-actions button {
        padding: 12px 24px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: all 0.3s ease;
      }

      .modal-actions .primary {
        background: var(--primary);
        color: white;
      }

      .modal-actions .secondary {
        background: var(--card-secondary);
        color: var(--text-primary);
        border: 1px solid var(--border);
      }

      /* Tracking Modal Specific */
      .tracking-info {
        margin-bottom: 24px;
      }

      .tracking-meta {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        background: var(--card-secondary);
        padding: 16px;
        border-radius: 6px;
        font-size: 0.9rem;
      }

      .tracking-timeline {
        margin-bottom: 24px;
      }

      .timeline-step {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px 0;
        position: relative;
        opacity: 0.4;
      }

      .timeline-step.completed {
        opacity: 1;
      }

      .timeline-step.current {
        opacity: 1;
        background: var(--primary-light);
        border-radius: 6px;
        padding: 16px;
        margin: 0 -16px;
      }

      .timeline-step:not(:last-child)::after {
        content: '';
        position: absolute;
        left: 24px;
        top: 60px;
        width: 2px;
        height: 20px;
        background: var(--border);
      }

      .timeline-step.completed:not(:last-child)::after {
        background: var(--primary);
      }

      .step-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--card-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        border: 2px solid var(--border);
      }

      .timeline-step.completed .step-icon {
        background: var(--primary-light);
        border-color: var(--primary);
      }

      .step-content h4 {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 4px;
        color: var(--text-primary);
      }

      .step-time {
        font-size: 0.8rem;
        color: var(--text-muted);
      }

      .delivery-map {
        margin-bottom: 24px;
      }

      .delivery-map h4 {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 12px;
        color: var(--text-primary);
      }

      .map-placeholder {
        background: var(--card-secondary);
        border: 2px dashed var(--border);
        border-radius: 8px;
        padding: 40px;
        text-align: center;
      }

      .map-icon {
        font-size: 3rem;
        margin-bottom: 12px;
        opacity: 0.6;
      }

      .delivery-contact h4 {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 12px;
        color: var(--text-primary);
      }

      .contact-info {
        background: var(--card-secondary);
        border-radius: 6px;
        padding: 16px;
      }

      .contact-info p {
        margin-bottom: 8px;
        color: var(--text-primary);
      }

      .contact-info p:last-child {
        margin-bottom: 0;
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .orders-container {
          padding: 16px;
        }

        .orders-stats {
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .stat-card {
          padding: 16px;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          font-size: 2rem;
        }

        .stat-number {
          font-size: 1.4rem;
        }

        .orders-filters {
          flex-direction: column;
          gap: 20px;
          align-items: stretch;
        }

        .filter-buttons {
          flex-direction: column;
        }

        .filter-btn {
          justify-content: center;
        }

        .order-header {
          flex-direction: column;
          gap: 12px;
        }

        .order-meta {
          flex-direction: column;
          gap: 8px;
        }

        .order-actions {
          flex-direction: column;
        }

        .order-actions button {
          width: 100%;
          justify-content: center;
        }

        .modal-content {
          margin: 10px;
          max-height: calc(100vh - 20px);
        }

        .tracking-meta {
          flex-direction: column;
          gap: 8px;
        }
      }

      /* RTL Support */
      [dir="rtl"] .order-header {
        flex-direction: row-reverse;
      }

      [dir="rtl"] .order-item {
        flex-direction: row-reverse;
      }

      [dir="rtl"] .detail-item {
        flex-direction: row-reverse;
      }

      [dir="rtl"] .timeline-step {
        flex-direction: row-reverse;
      }

      [dir="rtl"] .timeline-step:not(:last-child)::after {
        left: auto;
        right: 24px;
      }

      [dir="rtl"] .overview-item {
        flex-direction: row-reverse;
      }

      [dir="rtl"] .summary-line {
        flex-direction: row-reverse;
      }

      [dir="rtl"] .tracking-meta {
        flex-direction: row-reverse;
      }
    </style>
  `);
};

const returns = ({ el, state, actions }) => {
  const userOrders = (state.orders || []).filter(o => o.status === 'delivered');
  const returns = state.returns || [];
  
  // Return flow state
  let currentStep = 1;
  let selectedOrder = null;
  let selectedItems = [];
  let returnReason = '';
  let returnDetails = '';
  let refundMethod = 'original';
  let uploadedPhotos = [];
  
  // Return reasons
  const returnReasons = [
    { id: 'wrong_item', label: t('wrong_item_received') || 'استلمت المنتج الخطأ', icon: '❌' },
    { id: 'defective', label: t('defective_damaged') || 'منتج معيب أو تالف', icon: '🔧' },
    { id: 'not_as_described', label: t('not_as_described') || 'المنتج لا يطابق الوصف', icon: '📝' },
    { id: 'size_fit', label: t('wrong_size_fit') || 'المقاس أو القياس غير مناسب', icon: '📏' },
    { id: 'quality', label: t('poor_quality') || 'جودة رديئة', icon: '⚠️' },
    { id: 'changed_mind', label: t('changed_mind') || 'غيّرت رأيي', icon: '💭' },
    { id: 'late_delivery', label: t('arrived_too_late') || 'وصل متأخراً جداً', icon: '⏰' },
    { id: 'other', label: t('other_reason') || 'سبب آخر', icon: '❓' }
  ];
  
  // Refund methods
  const refundMethods = [
    { id: 'original', label: t('refund_original') || 'الإرجاع للطريقة الأصلية', desc: t('refund_original_desc') || '3-7 أيام عمل' },
    { id: 'wallet', label: t('refund_wallet') || 'محفظة ستورز', desc: t('refund_wallet_desc') || 'فوري + مكافأة 5%' },
    { id: 'bank', label: t('refund_bank') || 'تحويل بنكي', desc: t('refund_bank_desc') || '5-10 أيام عمل' }
  ];
  
  // Global functions
  window.selectOrderForReturn = (orderId) => {
    selectedOrder = userOrders.find(o => o.id === orderId);
    if (selectedOrder) {
      selectedItems = selectedOrder.items.map((item, index) => ({
        ...item,
        selected: false,
        itemIndex: index
      }));
      currentStep = 2;
      updateReturnForm();
    }
  };
  
  window.toggleItemSelection = (itemIndex) => {
    const item = selectedItems[itemIndex];
    if (item) {
      item.selected = !item.selected;
      updateItemsSelection();
    }
  };
  
  window.selectReturnReason = (reasonId) => {
    returnReason = reasonId;
    updateReasonSelection();
  };
  
  window.selectRefundMethod = (methodId) => {
    refundMethod = methodId;
    updateRefundSelection();
  };
  
  window.handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      if (file.type.startsWith('image/') && uploadedPhotos.length < 5) {
        const reader = new FileReader();
        reader.onload = (e) => {
          uploadedPhotos.push({
            url: e.target.result,
            name: file.name
          });
          updatePhotosPreview();
        };
        reader.readAsDataURL(file);
      }
    });
  };
  
  window.removePhoto = (index) => {
    uploadedPhotos.splice(index, 1);
    updatePhotosPreview();
  };
  
  window.nextReturnStep = () => {
    if (validateReturnStep()) {
      currentStep++;
      updateReturnForm();
      window.scrollTo(0, 0);
    }
  };
  
  window.prevReturnStep = () => {
    currentStep--;
    updateReturnForm();
    window.scrollTo(0, 0);
  };
  
  window.submitReturnRequest = () => {
    if (!validateReturnRequest()) return;
    
    // Create return request
    const returnRequest = {
      id: `RET${Date.now()}`,
      orderId: selectedOrder.id,
      items: selectedItems.filter(item => item.selected),
      reason: returnReasons.find(r => r.id === returnReason),
      details: returnDetails,
      refundMethod: refundMethods.find(m => m.id === refundMethod),
      photos: uploadedPhotos,
      status: 'pending',
      createdAt: new Date(),
      estimatedRefund: calculateRefund(),
      trackingNumber: `RTRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    };
    
    // Save return
    if (!state.returns) state.returns = [];
    state.returns.unshift(returnRequest);
    saveState(state);
    
    // Show success
    showReturnSuccess(returnRequest);
  };
  
  window.viewReturnDetails = (returnId) => {
    const returnReq = returns.find(r => r.id === returnId);
    if (returnReq) {
      showReturnDetailModal(returnReq);
    }
  };
  
  window.cancelReturn = (returnId) => {
    if (confirm(t('confirm_cancel_return') || 'هل تريد إلغاء طلب الإرجاع؟')) {
      const returnReq = returns.find(r => r.id === returnId);
      if (returnReq) {
        returnReq.status = 'cancelled';
        returnReq.cancelledAt = new Date();
        saveState(state);
        location.reload();
      }
    }
  };
  
  const validateReturnStep = () => {
    switch (currentStep) {
      case 2: // Items selection
        const hasSelected = selectedItems.some(item => item.selected);
        if (!hasSelected) {
          showNotification(t('select_items_to_return') || 'يرجى اختيار العناصر للإرجاع', 'warning');
          return false;
        }
        return true;
        
      case 3: // Reason
        if (!returnReason) {
          showNotification(t('select_return_reason') || 'يرجى اختيار سبب الإرجاع', 'warning');
          return false;
        }
        return true;
        
      case 4: // Details & photos
        return true;
        
      case 5: // Refund method
        if (!refundMethod) {
          showNotification(t('select_refund_method') || 'يرجى اختيار طريقة الاسترداد', 'warning');
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };
  
  const validateReturnRequest = () => {
    return selectedItems.some(item => item.selected) && returnReason && refundMethod;
  };
  
  const calculateRefund = () => {
    const selectedProducts = selectedItems.filter(item => item.selected);
    const total = selectedProducts.reduce((sum, item) => {
      const product = productById(item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    
    // Add bonus for wallet refund
    if (refundMethod === 'wallet') {
      return total * 1.05; // 5% bonus
    }
    
    return total;
  };
  
  const updateReturnForm = () => {
    const formContainer = document.getElementById('return-form-container');
    if (formContainer) {
      formContainer.innerHTML = renderReturnSteps();
    }
    
    // Update step indicators
    for (let i = 1; i <= 6; i++) {
      const stepEl = document.getElementById(`return-step-${i}`);
      if (stepEl) {
        stepEl.classList.toggle('active', i === currentStep);
        stepEl.classList.toggle('completed', i < currentStep);
      }
    }
  };
  
  const updateItemsSelection = () => {
    selectedItems.forEach((item, index) => {
      const checkbox = document.getElementById(`item-checkbox-${index}`);
      if (checkbox) {
        checkbox.checked = item.selected;
      }
    });
  };
  
  const updateReasonSelection = () => {
    document.querySelectorAll('.reason-option').forEach(option => {
      option.classList.toggle('selected', option.dataset.reason === returnReason);
    });
  };
  
  const updateRefundSelection = () => {
    document.querySelectorAll('.refund-option').forEach(option => {
      option.classList.toggle('selected', option.dataset.method === refundMethod);
    });
  };
  
  const updatePhotosPreview = () => {
    const photosContainer = document.getElementById('photos-preview');
    if (photosContainer) {
      photosContainer.innerHTML = `
        ${uploadedPhotos.map((photo, index) => `
          <div class="photo-preview">
            <img src="${photo.url}" alt="${photo.name}">
            <button class="remove-photo-btn" onclick="removePhoto(${index})">✕</button>
          </div>
        `).join('')}
        
        ${uploadedPhotos.length < 5 ? `
          <label class="add-photo-btn">
            <input type="file" accept="image/*" multiple onchange="handlePhotoUpload(event)" style="display:none;">
            <div class="add-photo-icon">📷</div>
            <span>${t('add_photos') || 'إضافة صور'}</span>
            <small>${uploadedPhotos.length}/5</small>
          </label>
        ` : ''}
      `;
    }
  };
  
  const renderReturnSteps = () => {
    switch (currentStep) {
      case 1: // Select Order
        return `
          <div class="return-step-content">
            <h3>${t('select_order') || 'اختر الطلب'}</h3>
            <p>${t('select_order_desc') || 'اختر الطلب الذي تريد إرجاعه'}</p>
            
            <div class="orders-list">
              ${userOrders.map(order => `
                <div class="order-option" onclick="selectOrderForReturn('${order.id}')">
                  <div class="order-info">
                    <h4>${t('order') || 'طلب'} #${order.id}</h4>
                    <span class="order-date">${new Date(order.createdAt).toLocaleDateString()}</span>
                    <span class="order-total">${fmtSAR(order.total)}</span>
                  </div>
                  <div class="order-arrow">→</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
        
      case 2: // Select Items
        return `
          <div class="return-step-content">
            <h3>${t('select_items') || 'اختر العناصر'}</h3>
            <p>${t('select_items_desc') || 'حدد العناصر التي تريد إرجاعها'}</p>
            
            <div class="items-list">
              ${selectedItems.map((item, index) => {
                const product = productById(item.productId);
                if (!product) return '';
                
                return `
                  <div class="item-option">
                    <label class="item-checkbox">
                      <input type="checkbox" id="item-checkbox-${index}" 
                             ${item.selected ? 'checked' : ''}
                             onchange="toggleItemSelection(${index})">
                    </label>
                    
                    <img src="${uns(product.img, 80)}" alt="${getProductTitle(product)}">
                    
                    <div class="item-info">
                      <h5>${getProductTitle(product)}</h5>
                      <p class="item-meta">
                        ${t('quantity') || 'الكمية'}: ${item.quantity} | 
                        ${fmtSAR(product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
            
            <div class="step-actions">
              <button onclick="prevReturnStep()" class="secondary">
                ← ${t('back') || 'رجوع'}
              </button>
              <button onclick="nextReturnStep()" class="primary">
                ${t('continue') || 'متابعة'} →
              </button>
            </div>
          </div>
        `;
        
      case 3: // Reason
        return `
          <div class="return-step-content">
            <h3>${t('return_reason') || 'سبب الإرجاع'}</h3>
            <p>${t('return_reason_desc') || 'ساعدنا على فهم سبب الإرجاع'}</p>
            
            <div class="reasons-grid">
              ${returnReasons.map(reason => `
                <div class="reason-option ${returnReason === reason.id ? 'selected' : ''}"
                     data-reason="${reason.id}"
                     onclick="selectReturnReason('${reason.id}')">
                  <div class="reason-icon">${reason.icon}</div>
                  <div class="reason-label">${reason.label}</div>
                </div>
              `).join('')}
            </div>
            
            <div class="step-actions">
              <button onclick="prevReturnStep()" class="secondary">
                ← ${t('back') || 'رجوع'}
              </button>
              <button onclick="nextReturnStep()" class="primary">
                ${t('continue') || 'متابعة'} →
              </button>
            </div>
          </div>
        `;
        
      case 4: // Details & Photos
        return `
          <div class="return-step-content">
            <h3>${t('return_details') || 'تفاصيل الإرجاع'}</h3>
            <p>${t('return_details_desc') || 'أضف تفاصيل وصور لتسريع المعالجة'}</p>
            
            <div class="details-section">
              <label>${t('additional_details') || 'تفاصيل إضافية'}</label>
              <textarea oninput="returnDetails = this.value" 
                        placeholder="${t('describe_issue') || 'اشرح المشكلة بالتفصيل...'}"
                        style="width: 100%; min-height: 120px; padding: 12px; border-radius: 6px; border: 1px solid var(--border);">${returnDetails}</textarea>
            </div>
            
            <div class="photos-section">
              <label>${t('upload_photos') || 'رفع صور (اختياري)'}</label>
              <p class="helper-text">${t('photos_help') || 'الصور تساعد في تسريع معالجة الإرجاع (حتى 5 صور)'}</p>
              
              <div class="photos-grid" id="photos-preview">
                <label class="add-photo-btn">
                  <input type="file" accept="image/*" multiple onchange="handlePhotoUpload(event)" style="display:none;">
                  <div class="add-photo-icon">📷</div>
                  <span>${t('add_photos') || 'إضافة صور'}</span>
                  <small>0/5</small>
                </label>
              </div>
            </div>
            
            <div class="step-actions">
              <button onclick="prevReturnStep()" class="secondary">
                ← ${t('back') || 'رجوع'}
              </button>
              <button onclick="nextReturnStep()" class="primary">
                ${t('continue') || 'متابعة'} →
              </button>
            </div>
          </div>
        `;
        
      case 5: // Refund Method
        return `
          <div class="return-step-content">
            <h3>${t('refund_method') || 'طريقة الاسترداد'}</h3>
            <p>${t('refund_method_desc') || 'اختر كيف تريد استرداد أموالك'}</p>
            
            <div class="refund-options">
              ${refundMethods.map(method => `
                <div class="refund-option ${refundMethod === method.id ? 'selected' : ''}"
                     data-method="${method.id}"
                     onclick="selectRefundMethod('${method.id}')">
                  <div class="refund-content">
                    <h5>${method.label}</h5>
                    <p>${method.desc}</p>
                    ${method.id === 'wallet' ? `
                      <div class="refund-bonus">⭐ +5% ${t('bonus') || 'مكافأة'}!</div>
                    ` : ''}
                  </div>
                  <div class="refund-radio">
                    <div class="radio ${refundMethod === method.id ? 'checked' : ''}"></div>
                  </div>
                </div>
              `).join('')}
            </div>
            
            <div class="step-actions">
              <button onclick="prevReturnStep()" class="secondary">
                ← ${t('back') || 'رجوع'}
              </button>
              <button onclick="nextReturnStep()" class="primary">
                ${t('continue') || 'متابعة'} →
              </button>
            </div>
          </div>
        `;
        
      case 6: // Review & Confirm
        const selectedProducts = selectedItems.filter(item => item.selected);
        const refundAmount = calculateRefund();
        const selectedReason = returnReasons.find(r => r.id === returnReason);
        const selectedRefundMethod = refundMethods.find(m => m.id === refundMethod);
        
        return `
          <div class="return-step-content">
            <h3>${t('review_return') || 'مراجعة الإرجاع'}</h3>
            <p>${t('review_return_desc') || 'راجع طلب الإرجاع قبل التأكيد'}</p>
            
            <div class="return-review">
              <div class="review-section">
                <h4>${t('order') || 'الطلب'} #${selectedOrder.id}</h4>
                <p class="order-date">${new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
              </div>
              
              <div class="review-section">
                <h4>${t('items_to_return') || 'العناصر للإرجاع'}</h4>
                <div class="review-items">
                  ${selectedProducts.map(item => {
                    const product = productById(item.productId);
                    return product ? `
                      <div class="review-item">
                        <img src="${uns(product.img, 50)}" alt="${getProductTitle(product)}">
                        <span>${getProductTitle(product)} ×${item.quantity}</span>
                      </div>
                    ` : '';
                  }).join('')}
                </div>
              </div>
              
              <div class="review-section">
                <h4>${t('return_reason') || 'سبب الإرجاع'}</h4>
                <p>${selectedReason.icon} ${selectedReason.label}</p>
                ${returnDetails ? `<p class="return-details">${returnDetails}</p>` : ''}
              </div>
              
              <div class="review-section">
                <h4>${t('refund_method') || 'طريقة الاسترداد'}</h4>
                <p>${selectedRefundMethod.label}</p>
                <p class="refund-desc">${selectedRefundMethod.desc}</p>
              </div>
              
              <div class="review-section refund-summary">
                <h4>${t('refund_amount') || 'مبلغ الاسترداد'}</h4>
                <div class="refund-amount">${fmtSAR(refundAmount)}</div>
                ${refundMethod === 'wallet' ? `
                  <p class="refund-note">✨ ${t('includes_bonus') || 'يشمل مكافأة 5%'}</p>
                ` : ''}
              </div>
            </div>
            
            <div class="step-actions">
              <button onclick="prevReturnStep()" class="secondary">
                ← ${t('back') || 'رجوع'}
              </button>
              <button onclick="submitReturnRequest()" class="primary">
                ✅ ${t('submit_return') || 'إرسال طلب الإرجاع'}
              </button>
            </div>
          </div>
        `;
        
      default:
        return '';
    }
  };
  
  const showReturnSuccess = (returnRequest) => {
    const modal = document.createElement('div');
    modal.className = 'return-success-modal';
    modal.innerHTML = `
      <div class="modal-overlay" onclick="closeReturnSuccess()">
        <div class="modal-content" onclick="event.stopPropagation()">
          <div class="success-icon">✅</div>
          <h2>${t('return_submitted') || 'تم إرسال طلب الإرجاع!'}</h2>
          <p>${t('return_success_message') || 'سنراجع طلبك ونرسل لك تعليمات الشحن قريباً'}</p>
          
          <div class="return-info">
            <div class="info-row">
              <span>${t('return_id') || 'رقم الإرجاع'}:</span>
              <strong>${returnRequest.id}</strong>
            </div>
            <div class="info-row">
              <span>${t('tracking_number') || 'رقم التتبع'}:</span>
              <strong>${returnRequest.trackingNumber}</strong>
            </div>
            <div class="info-row">
              <span>${t('refund_amount') || 'مبلغ الاسترداد'}:</span>
              <strong>${fmtSAR(returnRequest.estimatedRefund)}</strong>
            </div>
          </div>
          
          <div class="modal-actions">
            <button onclick="location.hash='#/returns'" class="primary">
              ${t('view_returns') || 'عرض الإرجاعات'}
            </button>
            <button onclick="location.hash='#/home'" class="secondary">
              ${t('continue_shopping') || 'متابعة التسوق'}
            </button>
          </div>
        </div>
      </div>
    `;
    
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2000;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.style.opacity = '1', 10);
    
    window.closeReturnSuccess = () => {
      modal.style.opacity = '0';
      setTimeout(() => {
        modal.remove();
        location.hash = '#/returns';
        location.reload();
      }, 300);
    };
  };
  
  const showReturnDetailModal = (returnReq) => {
    // Similar to order detail modal
    console.log('Show return details:', returnReq);
  };
  
  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      z-index: 1000;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  el.innerHTML = h(`
    <div class="returns-container">
      <div class="returns-header">
        <h1>${t('returns_refunds') || 'الإرجاع والاسترداد'}</h1>
        <p>${t('returns_subtitle') || 'إدارة طلبات الإرجاع والاسترداد'}</p>
      </div>
      
      ${currentStep === 1 && userOrders.length === 0 ? `
        <div class="empty-state">
          <div class="empty-icon">📦</div>
          <h3>${t('no_delivered_orders') || 'لا توجد طلبات مُسلّمة'}</h3>
          <p>${t('no_delivered_orders_desc') || 'يمكنك إرجاع الطلبات بعد استلامها'}</p>
          <button onclick="navigate('#/orders')" class="primary">
            ${t('view_orders') || 'عرض الطلبات'}
          </button>
        </div>
      ` : currentStep === 1 && returns.length > 0 ? `
        <!-- Show returns history first -->
        <div class="returns-tabs">
          <button class="tab-btn active" onclick="showReturnsTab('active')">
            ${t('active_returns') || 'الإرجاعات النشطة'}
          </button>
          <button class="tab-btn" onclick="showReturnsTab('history')">
            ${t('returns_history') || 'سجل الإرجاعات'}
          </button>
          <button class="tab-btn" onclick="currentStep=1; updateReturnForm()">
            ➕ ${t('new_return') || 'إرجاع جديد'}
          </button>
        </div>
        
        <div class="returns-list">
          ${returns.map(ret => `
            <div class="return-card">
              <div class="return-header">
                <h3>${t('return_request') || 'طلب إرجاع'} #${ret.id}</h3>
                <span class="status-badge ${ret.status}">${t(ret.status) || ret.status}</span>
              </div>
              
              <div class="return-info">
                <p><strong>${t('order') || 'الطلب'}:</strong> #${ret.orderId}</p>
                <p><strong>${t('submitted') || 'تم الإرسال'}:</strong> ${new Date(ret.createdAt).toLocaleDateString()}</p>
                <p><strong>${t('refund_amount') || 'مبلغ الاسترداد'}:</strong> ${fmtSAR(ret.estimatedRefund)}</p>
              </div>
              
              <div class="return-actions">
                <button onclick="viewReturnDetails('${ret.id}')" class="secondary">
                  ${t('view_details') || 'التفاصيل'}
                </button>
                ${ret.status === 'pending' ? `
                  <button onclick="cancelReturn('${ret.id}')" class="danger secondary">
                    ${t('cancel_return') || 'إلغاء'}
                  </button>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="new-return-button">
          <button onclick="currentStep=1; updateReturnForm()" class="primary large">
            ➕ ${t('start_new_return') || 'بدء إرجاع جديد'}
          </button>
        </div>
      ` : `
        <!-- Return request flow -->
        <div class="return-progress">
          <div class="progress-steps">
            ${[1, 2, 3, 4, 5, 6].map(step => `
              <div class="progress-step ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}" 
                   id="return-step-${step}">
                <div class="step-number">${step}</div>
                <div class="step-label">${
                  step === 1 ? t('select_order') || 'اختر الطلب' :
                  step === 2 ? t('select_items') || 'اختر العناصر' :
                  step === 3 ? t('reason') || 'السبب' :
                  step === 4 ? t('details') || 'التفاصيل' :
                  step === 5 ? t('refund') || 'الاسترداد' :
                  t('review') || 'المراجعة'
                }</div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="return-form" id="return-form-container">
          ${renderReturnSteps()}
        </div>
      `}
      
      <!-- Return Policy Info -->
      <div class="return-policy">
        <h3>📋 ${t('return_policy') || 'سياسة الإرجاع'}</h3>
        <ul>
          <li>✅ ${t('policy_30_days') || 'يمكنك إرجاع المنتجات خلال 30 يوماً من الاستلام'}</li>
          <li>✅ ${t('policy_condition') || 'يجب أن يكون المنتج في حالته الأصلية مع التغليف'}</li>
          <li>✅ ${t('policy_free_return') || 'الإرجاع مجاني في حالة العيوب أو الخطأ في الشحن'}</li>
          <li>⚠️ ${t('policy_fee') || 'رسوم إرجاع 15 ريال في حالة تغيير الرأي'}</li>
          <li>⏱️ ${t('policy_refund_time') || 'يتم الاسترداد خلال 3-7 أيام عمل'}</li>
        </ul>
      </div>
    </div>

    <style>
      .returns-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 20px;
      }

      .returns-header {
        text-align: center;
        margin-bottom: 40px;
      }

      .returns-header h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 8px;
        color: var(--text-primary);
      }

      .returns-header p {
        color: var(--text-muted);
        font-size: 1.1rem;
      }

      /* Empty State */
      .empty-state {
        text-align: center;
        padding: 60px 20px;
        background: var(--card);
        border-radius: 12px;
        border: 1px solid var(--border);
      }

      .empty-icon {
        font-size: 4rem;
        margin-bottom: 20px;
        opacity: 0.5;
      }

      .empty-state h3 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 12px;
        color: var(--text-primary);
      }

      .empty-state p {
        color: var(--text-muted);
        margin-bottom: 24px;
      }

      .empty-state button {
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        background: var(--primary);
        color: white;
      }

      /* Progress Steps */
      .return-progress {
        margin-bottom: 40px;
      }

      .progress-steps {
        display: flex;
        justify-content: space-between;
        position: relative;
        padding: 0 20px;
      }

      .progress-steps::before {
        content: '';
        position: absolute;
        top: 25px;
        left: 10%;
        right: 10%;
        height: 2px;
        background: var(--border);
        z-index: 1;
      }

      .progress-step {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        flex: 1;
        max-width: 120px;
        position: relative;
        z-index: 2;
      }

      .step-number {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--card);
        border: 2px solid var(--border);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        margin-bottom: 8px;
      }

      .progress-step.active .step-number {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
      }

      .progress-step.completed .step-number {
        background: var(--success);
        color: white;
        border-color: var(--success);
      }

      .progress-step.completed .step-number::before {
        content: '✓';
      }

      .step-label {
        font-size: 0.8rem;
        color: var(--text-muted);
        font-weight: 500;
      }

      .progress-step.active .step-label {
        color: var(--primary);
        font-weight: 600;
      }

      /* Return Form */
      .return-form {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 32px;
        margin-bottom: 32px;
      }

      .return-step-content h3 {
        font-size: 1.8rem;
        font-weight: 600;
        margin-bottom: 8px;
        color: var(--text-primary);
      }

      .return-step-content > p {
        color: var(--text-muted);
        margin-bottom: 32px;
      }

      /* Orders List */
      .orders-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .order-option {
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .order-option:hover {
        border-color: var(--primary);
        background: var(--primary-light);
      }

      .order-info h4 {
        margin-bottom: 8px;
        color: var(--text-primary);
      }

      .order-date, .order-total {
        display: inline-block;
        margin-right: 16px;
        color: var(--text-muted);
        font-size: 0.9rem;
      }

      .order-arrow {
        font-size: 1.5rem;
        color: var(--primary);
      }

      /* Items List */
      .items-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 32px;
      }

      .item-option {
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .item-checkbox input {
        width: 20px;
        height: 20px;
        cursor: pointer;
      }

      .item-option img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 6px;
      }

      .item-info {
        flex: 1;
      }

      .item-info h5 {
        margin-bottom: 4px;
        color: var(--text-primary);
      }

      .item-meta {
        color: var(--text-muted);
        font-size: 0.9rem;
      }

      /* Reasons Grid */
      .reasons-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        margin-bottom: 32px;
      }

      .reason-option {
        border: 2px solid var(--border);
        border-radius: 8px;
        padding: 20px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .reason-option:hover {
        border-color: var(--primary-light);
        background: var(--primary-light);
      }

      .reason-option.selected {
        border-color: var(--primary);
        background: var(--primary-light);
      }

      .reason-icon {
        font-size: 2.5rem;
        margin-bottom: 12px;
      }

      .reason-label {
        font-weight: 500;
        color: var(--text-primary);
      }

      /* Photos */
      .photos-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 12px;
        margin-top: 16px;
      }

      .photo-preview {
        position: relative;
        aspect-ratio: 1;
        border-radius: 8px;
        overflow: hidden;
      }

      .photo-preview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .remove-photo-btn {
        position: absolute;
        top: 4px;
        right: 4px;
        background: rgba(0,0,0,0.7);
        color: white;
        border: none;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        cursor: pointer;
        font-size: 14px;
      }

      .add-photo-btn {
        aspect-ratio: 1;
        border: 2px dashed var(--border);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .add-photo-btn:hover {
        border-color: var(--primary);
        background: var(--primary-light);
      }

      .add-photo-icon {
        font-size: 2rem;
        margin-bottom: 8px;
      }

      .helper-text {
        font-size: 0.85rem;
        color: var(--text-muted);
        margin-top: 4px;
        margin-bottom: 12px;
      }

      /* Refund Options */
      .refund-options {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 32px;
      }

      .refund-option {
        border: 2px solid var(--border);
        border-radius: 8px;
        padding: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .refund-option:hover {
        border-color: var(--primary-light);
        background: var(--primary-light);
      }

      .refund-option.selected {
        border-color: var(--primary);
        background: var(--primary-light);
      }

      .refund-content h5 {
        margin-bottom: 4px;
        color: var(--text-primary);
      }

      .refund-content p {
        color: var(--text-muted);
        font-size: 0.9rem;
      }

      .refund-bonus {
        margin-top: 8px;
        color: var(--primary);
        font-weight: 600;
        font-size: 0.9rem;
      }

      .refund-radio .radio {
        width: 20px;
        height: 20px;
        border: 2px solid var(--border);
        border-radius: 50%;
        position: relative;
      }

      .refund-radio .radio.checked {
        border-color: var(--primary);
      }

      .refund-radio .radio.checked::after {
        content: '';
        position: absolute;
        top: 3px;
        left: 3px;
        width: 10px;
        height: 10px;
        background: var(--primary);
        border-radius: 50%;
      }

      /* Return Review */
      .return-review {
        background: var(--card-secondary);
        border-radius: 8px;
        padding: 24px;
        margin-bottom: 32px;
      }

      .review-section {
        margin-bottom: 24px;
      }

      .review-section:last-child {
        margin-bottom: 0;
      }

      .review-section h4 {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 12px;
        color: var(--text-primary);
      }

      .review-items {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .review-item {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .review-item img {
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: 4px;
      }

      .refund-summary {
        border-top: 2px solid var(--border);
        padding-top: 24px;
      }

      .refund-amount {
        font-size: 2rem;
        font-weight: 700;
        color: var(--primary);
        margin: 12px 0;
      }

      .refund-note {
        color: var(--success);
        font-weight: 600;
      }

      /* Step Actions */
      .step-actions {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        margin-top: 32px;
      }

      .step-actions button {
        padding: 14px 28px;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: all 0.3s ease;
      }

      .step-actions .primary {
        background: var(--primary);
        color: white;
        flex: 1;
      }

      .step-actions .secondary {
        background: var(--card);
        color: var(--text-primary);
        border: 1px solid var(--border);
      }

      /* Return Policy */
      .return-policy {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 24px;
      }

      .return-policy h3 {
        font-size: 1.3rem;
        font-weight: 600;
        margin-bottom: 16px;
        color: var(--text-primary);
      }

      .return-policy ul {
        list-style: none;
        padding: 0;
      }

      .return-policy li {
        padding: 8px 0;
        color: var(--text-primary);
        line-height: 1.6;
      }

      /* Success Modal */
      .return-success-modal .modal-overlay {
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }

      .return-success-modal .modal-content {
        background: var(--card);
        border-radius: 12px;
        padding: 40px;
        max-width: 500px;
        width: 100%;
        text-align: center;
      }

      .success-icon {
        font-size: 4rem;
        margin-bottom: 20px;
      }

      .return-success-modal h2 {
        font-size: 1.8rem;
        font-weight: 600;
        margin-bottom: 12px;
        color: var(--text-primary);
      }

      .return-success-modal p {
        color: var(--text-muted);
        margin-bottom: 24px;
        line-height: 1.5;
      }

      .return-info {
        background: var(--card-secondary);
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 24px;
        text-align: left;
      }

      .info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .info-row:last-child {
        margin-bottom: 0;
      }

      .modal-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
      }

      .modal-actions button {
        padding: 12px 24px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        border: none;
      }

      .modal-actions .primary {
        background: var(--primary);
        color: white;
      }

      .modal-actions .secondary {
        background: var(--card-secondary);
        color: var(--text-primary);
        border: 1px solid var(--border);
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .returns-container {
          padding: 16px;
        }

        .return-form {
          padding: 20px;
        }

        .progress-steps {
          flex-wrap: wrap;
          gap: 12px;
        }

        .progress-step {
          max-width: 80px;
        }

        .step-number {
          width: 40px;
          height: 40px;
        }

        .step-label {
          font-size: 0.7rem;
        }

        .reasons-grid {
          grid-template-columns: 1fr 1fr;
        }

        .photos-grid {
          grid-template-columns: repeat(3, 1fr);
        }

        .step-actions {
          flex-direction: column;
        }

        .step-actions button {
          width: 100%;
        }
      }

      /* RTL Support */
      [dir="rtl"] .step-actions {
        flex-direction: row-reverse;
      }

      [dir="rtl"] .order-option {
        flex-direction: row-reverse;
      }

      [dir="rtl"] .item-option {
        flex-direction: row-reverse;
      }

      [dir="rtl"] .refund-option {
        flex-direction: row-reverse;
      }

      [dir="rtl"] .review-item {
        flex-direction: row-reverse;
      }

      [dir="rtl"] .info-row {
        flex-direction: row-reverse;
      }
    </style>
  `);
};

const reviews_page = ({ el, state, actions }) => {
  const userReviews = state.reviews || [];
  const deliveredOrders = (state.orders || []).filter(o => o.status === 'delivered');
  const ordersNeedingReviews = deliveredOrders.filter(order => {
    return order.items.some(item => {
      return !userReviews.some(review => 
        review.orderId === order.id && review.productId === item.productId
      );
    });
  });
  
  let currentTab = 'pending';
  let currentlyWriting = null;
  let reviewRating = 0;
  let reviewText = '';
  let reviewPhotos = [];
  let reviewRecommend = true;
  
  // Global functions
  window.switchReviewTab = (tab) => {
    currentTab = tab;
    document.querySelectorAll('.review-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    updateReviewsDisplay();
  };
  
  window.startWritingReview = (orderId, productId) => {
    const order = deliveredOrders.find(o => o.id === orderId);
    const item = order?.items.find(i => i.productId === productId);
    const product = productById(productId);
    
    if (!product || !order || !item) return;
    
    currentlyWriting = { order, item, product };
    reviewRating = 0;
    reviewText = '';
    reviewPhotos = [];
    reviewRecommend = true;
    
    showReviewModal();
  };
  
  window.setReviewRating = (rating) => {
    reviewRating = rating;
    updateRatingStars();
  };
  
  window.setReviewRecommend = (value) => {
    reviewRecommend = value;
    updateRecommendButtons();
  };
  
  window.handleReviewPhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      if (file.type.startsWith('image/') && reviewPhotos.length < 5) {
        const reader = new FileReader();
        reader.onload = (e) => {
          reviewPhotos.push({
            url: e.target.result,
            name: file.name
          });
          updateReviewPhotosPreview();
        };
        reader.readAsDataURL(file);
      }
    });
  };
  
  window.removeReviewPhoto = (index) => {
    reviewPhotos.splice(index, 1);
    updateReviewPhotosPreview();
  };
  
  window.submitReview = () => {
    if (!reviewRating) {
      showNotification(t('please_rate_product') || 'يرجى تقييم المنتج', 'warning');
      return;
    }
    
    if (!reviewText.trim()) {
      showNotification(t('please_write_review') || 'يرجى كتابة مراجعة', 'warning');
      return;
    }
    
    const review = {
      id: `REV${Date.now()}`,
      orderId: currentlyWriting.order.id,
      productId: currentlyWriting.product.id,
      rating: reviewRating,
      text: reviewText,
      recommend: reviewRecommend,
      photos: reviewPhotos,
      verified: true,
      helpful: 0,
      createdAt: new Date(),
      author: state.user || { name: t('anonymous_buyer') || 'مشتري مجهول' }
    };
    
    if (!state.reviews) state.reviews = [];
    state.reviews.unshift(review);
    saveState(state);
    
    closeReviewModal();
    showNotification(t('review_submitted_success') || 'تم إرسال المراجعة بنجاح!', 'success');
    location.reload();
  };
  
  window.editReview = (reviewId) => {
    const review = userReviews.find(r => r.id === reviewId);
    if (!review) return;
    
    reviewRating = review.rating;
    reviewText = review.text;
    reviewRecommend = review.recommend;
    reviewPhotos = [...review.photos];
    
    const product = productById(review.productId);
    const order = deliveredOrders.find(o => o.id === review.orderId);
    const item = order?.items.find(i => i.productId === review.productId);
    
    currentlyWriting = { order, item, product, editingId: reviewId };
    showReviewModal(true);
  };
  
  window.deleteReview = (reviewId) => {
    if (confirm(t('confirm_delete_review') || 'هل تريد حذف هذه المراجعة؟')) {
      const index = userReviews.findIndex(r => r.id === reviewId);
      if (index !== -1) {
        userReviews.splice(index, 1);
        saveState(state);
        location.reload();
      }
    }
  };
  
  const updateReviewsDisplay = () => {
    const container = document.getElementById('reviews-content');
    if (!container) return;
    
    container.innerHTML = renderReviewsContent();
  };
  
  const updateRatingStars = () => {
    for (let i = 1; i <= 5; i++) {
      const star = document.getElementById(`rating-star-${i}`);
      if (star) {
        star.classList.toggle('filled', i <= reviewRating);
      }
    }
  };
  
  const updateRecommendButtons = () => {
    document.querySelectorAll('.recommend-btn').forEach(btn => {
      const value = btn.dataset.value === 'true';
      btn.classList.toggle('selected', value === reviewRecommend);
    });
  };
  
  const updateReviewPhotosPreview = () => {
    const container = document.getElementById('review-photos-preview');
    if (!container) return;
    
    container.innerHTML = `
      ${reviewPhotos.map((photo, index) => `
        <div class="review-photo-preview">
          <img src="${photo.url}" alt="${photo.name}">
          <button class="remove-photo-btn" onclick="removeReviewPhoto(${index})">✕</button>
        </div>
      `).join('')}
      
      ${reviewPhotos.length < 5 ? `
        <label class="add-review-photo-btn">
          <input type="file" accept="image/*" multiple onchange="handleReviewPhotoUpload(event)" style="display:none;">
          <div class="add-icon">📷</div>
          <span>${t('add_photo') || 'إضافة صورة'}</span>
        </label>
      ` : ''}
    `;
  };
  
  const renderReviewsContent = () => {
    if (currentTab === 'pending') {
      if (ordersNeedingReviews.length === 0) {
        return `
          <div class="empty-state">
            <div class="empty-icon">✅</div>
            <h3>${t('all_caught_up') || 'أنت على اطلاع بكل شيء!'}</h3>
            <p>${t('no_pending_reviews') || 'لا توجد طلبات تحتاج إلى مراجعة'}</p>
          </div>
        `;
      }
      
      return `
        <div class="pending-reviews">
          <h3>${t('products_to_review') || 'منتجات للمراجعة'}</h3>
          <p class="subtitle">${t('share_experience_help_others') || 'شارك تجربتك وساعد الآخرين'}</p>
          
          ${ordersNeedingReviews.map(order => {
            const unreviewedItems = order.items.filter(item => {
              return !userReviews.some(review => 
                review.orderId === order.id && review.productId === item.productId
              );
            });
            
            return unreviewedItems.map(item => {
              const product = productById(item.productId);
              if (!product) return '';
              
              return `
                <div class="review-needed-card">
                  <div class="product-info">
                    <img src="${uns(product.img, 80)}" alt="${getProductTitle(product)}">
                    <div class="info">
                      <h4>${getProductTitle(product)}</h4>
                      <p class="order-info">
                        ${t('order') || 'طلب'} #${order.id} • 
                        ${t('delivered_on') || 'تم التوصيل في'} ${new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <button onclick="startWritingReview('${order.id}', '${product.id}')" class="primary">
                    ✍️ ${t('write_review') || 'كتابة مراجعة'}
                  </button>
                </div>
              `;
            }).join('');
          }).join('')}
        </div>
      `;
    } else {
      // My Reviews tab
      if (userReviews.length === 0) {
        return `
          <div class="empty-state">
            <div class="empty-icon">📝</div>
            <h3>${t('no_reviews_yet') || 'لا توجد مراجعات بعد'}</h3>
            <p>${t('start_reviewing') || 'ابدأ بكتابة مراجعاتك لمساعدة الآخرين'}</p>
          </div>
        `;
      }
      
      return `
        <div class="my-reviews-list">
          ${userReviews.map(review => {
            const product = productById(review.productId);
            if (!product) return '';
            
            return `
              <div class="my-review-card">
                <div class="review-product">
                  <img src="${uns(product.img, 80)}" alt="${getProductTitle(product)}">
                  <div class="review-header">
                    <h4>${getProductTitle(product)}</h4>
                    <div class="review-rating">
                      ${'⭐'.repeat(review.rating)}
                      <span class="rating-text">${review.rating}.0</span>
                    </div>
                    <p class="review-date">${new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div class="review-content">
                  <p class="review-text">${review.text}</p>
                  
                  ${review.photos.length > 0 ? `
                    <div class="review-photos">
                      ${review.photos.map(photo => `
                        <img src="${photo.url}" alt="${photo.name}">
                      `).join('')}
                    </div>
                  ` : ''}
                  
                  ${review.recommend ? `
                    <div class="review-recommend">
                      👍 ${t('recommend_product') || 'أوصي بهذا المنتج'}
                    </div>
                  ` : ''}
                  
                  ${review.helpful > 0 ? `
                    <div class="review-helpful">
                      ${review.helpful} ${t('found_helpful') || 'وجدوها مفيدة'}
                    </div>
                  ` : ''}
                </div>
                
                <div class="review-actions">
                  <button onclick="editReview('${review.id}')" class="secondary">
                    ✏️ ${t('edit') || 'تعديل'}
                  </button>
                  <button onclick="deleteReview('${review.id}')" class="secondary danger">
                    🗑️ ${t('delete') || 'حذف'}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }
  };
  
  const showReviewModal = (isEditing = false) => {
    const modal = document.createElement('div');
    modal.className = 'review-modal';
    modal.id = 'review-modal';
    
    modal.innerHTML = `
      <div class="modal-overlay" onclick="closeReviewModal()">
        <div class="modal-content" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h2>${isEditing ? t('edit_review') : t('write_review') || 'كتابة مراجعة'}</h2>
            <button class="close-btn" onclick="closeReviewModal()">✕</button>
          </div>
          
          <div class="modal-body">
            <!-- Product Info -->
            <div class="review-product-info">
              <img src="${uns(currentlyWriting.product.img, 80)}" alt="${getProductTitle(currentlyWriting.product)}">
              <div class="product-details">
                <h4>${getProductTitle(currentlyWriting.product)}</h4>
                <p>${t('order') || 'طلب'} #${currentlyWriting.order.id}</p>
              </div>
            </div>
            
            <!-- Rating -->
            <div class="review-section">
              <label>${t('your_rating') || 'تقييمك'} *</label>
              <div class="rating-input">
                ${[1, 2, 3, 4, 5].map(star => `
                  <span class="rating-star ${star <= reviewRating ? 'filled' : ''}" 
                        id="rating-star-${star}"
                        onclick="setReviewRating(${star})">⭐</span>
                `).join('')}
              </div>
            </div>
            
            <!-- Review Text -->
            <div class="review-section">
              <label>${t('your_review') || 'مراجعتك'} *</label>
              <textarea id="review-text-input"
                        oninput="reviewText = this.value"
                        placeholder="${t('share_thoughts') || 'شارك أفكارك حول المنتج...'}"
                        style="width: 100%; min-height: 150px; padding: 12px; border-radius: 6px; border: 1px solid var(--border); resize: vertical;">${reviewText}</textarea>
              <p class="char-count">${reviewText.length} / 500</p>
            </div>
            
            <!-- Photos -->
            <div class="review-section">
              <label>${t('add_photos') || 'إضافة صور'} (${t('optional') || 'اختياري'})</label>
              <p class="helper-text">${t('photos_help_others') || 'الصور تساعد المشترين الآخرين'}</p>
              
              <div class="review-photos-grid" id="review-photos-preview">
                ${reviewPhotos.map((photo, index) => `
                  <div class="review-photo-preview">
                    <img src="${photo.url}" alt="${photo.name}">
                    <button class="remove-photo-btn" onclick="removeReviewPhoto(${index})">✕</button>
                  </div>
                `).join('')}
                
                ${reviewPhotos.length < 5 ? `
                  <label class="add-review-photo-btn">
                    <input type="file" accept="image/*" multiple onchange="handleReviewPhotoUpload(event)" style="display:none;">
                    <div class="add-icon">📷</div>
                    <span>${t('add_photo') || 'إضافة صورة'}</span>
                  </label>
                ` : ''}
              </div>
            </div>
            
            <!-- Recommend -->
            <div class="review-section">
              <label>${t('would_recommend') || 'هل توصي بهذا المنتج؟'}</label>
              <div class="recommend-buttons">
                <button class="recommend-btn ${reviewRecommend ? 'selected' : ''}" 
                        data-value="true"
                        onclick="setReviewRecommend(true)">
                  👍 ${t('yes') || 'نعم'}
                </button>
                <button class="recommend-btn ${!reviewRecommend ? 'selected' : ''}" 
                        data-value="false"
                        onclick="setReviewRecommend(false)">
                  👎 ${t('no') || 'لا'}
                </button>
              </div>
            </div>
          </div>
          
          <div class="modal-actions">
            <button onclick="closeReviewModal()" class="secondary">
              ${t('cancel') || 'إلغاء'}
            </button>
            <button onclick="submitReview()" class="primary">
              ✅ ${isEditing ? t('update_review') : t('submit_review') || 'إرسال المراجعة'}
            </button>
          </div>
        </div>
      </div>
    `;
    
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2000;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.style.opacity = '1', 10);
  };
  
  window.closeReviewModal = () => {
    const modal = document.getElementById('review-modal');
    if (modal) {
      modal.style.opacity = '0';
      setTimeout(() => modal.remove(), 300);
    }
  };
  
  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      z-index: 1000;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  el.innerHTML = h(`
    <div class="reviews-page-container">
      <div class="reviews-header">
        <h1>${t('reviews_ratings') || 'المراجعات والتقييمات'}</h1>
        <p>${t('reviews_subtitle') || 'شارك تجاربك وساعد مجتمع المتسوقين'}</p>
      </div>
      
      <!-- Stats -->
      <div class="reviews-stats">
        <div class="stat-card">
          <div class="stat-icon">✍️</div>
          <div class="stat-info">
            <div class="stat-number">${userReviews.length}</div>
            <div class="stat-label">${t('total_reviews') || 'إجمالي المراجعات'}</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-info">
            <div class="stat-number">${ordersNeedingReviews.length}</div>
            <div class="stat-label">${t('pending_reviews') || 'مراجعات معلقة'}</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">👍</div>
          <div class="stat-info">
            <div class="stat-number">${userReviews.reduce((sum, r) => sum + (r.helpful || 0), 0)}</div>
            <div class="stat-label">${t('helpful_votes') || 'تصويتات مفيدة'}</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-info">
            <div class="stat-number">${userReviews.length > 0 ? (userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length).toFixed(1) : '0.0'}</div>
            <div class="stat-label">${t('avg_rating') || 'متوسط التقييم'}</div>
          </div>
        </div>
      </div>
      
      <!-- Tabs -->
      <div class="reviews-tabs">
        <button class="review-tab-btn active" data-tab="pending" onclick="switchReviewTab('pending')">
          ⏳ ${t('pending_reviews') || 'مراجعات معلقة'} (${ordersNeedingReviews.length})
        </button>
        <button class="review-tab-btn" data-tab="my-reviews" onclick="switchReviewTab('my-reviews')">
          ✅ ${t('my_reviews') || 'مراجعاتي'} (${userReviews.length})
        </button>
      </div>
      
      <!-- Content -->
      <div class="reviews-content" id="reviews-content">
        ${renderReviewsContent()}
      </div>
    </div>

    <style>
      .reviews-page-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 20px;
      }

      .reviews-header {
        text-align: center;
        margin-bottom: 40px;
      }

      .reviews-header h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 8px;
        color: var(--text-primary);
      }

      .reviews-header p {
        color: var(--text-muted);
        font-size: 1.1rem;
      }

      /* Stats */
      .reviews-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 32px;
      }

      .stat-card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .stat-icon {
        font-size: 2.5rem;
      }

      .stat-number {
        font-size: 2rem;
        font-weight: 700;
        color: var(--text-primary);
      }

      .stat-label {
        color: var(--text-muted);
        font-size: 0.9rem;
      }

      /* Tabs */
      .reviews-tabs {
        display: flex;
        gap: 12px;
        margin-bottom: 24px;
        border-bottom: 2px solid var(--border);
      }

      .review-tab-btn {
        padding: 12px 24px;
        border: none;
        background: none;
        color: var(--text-muted);
        cursor: pointer;
        font-weight: 500;
        border-bottom: 2px solid transparent;
        margin-bottom: -2px;
        transition: all 0.3s ease;
      }

      .review-tab-btn.active {
        color: var(--primary);
        border-bottom-color: var(--primary);
      }

      /* Content */
      .reviews-content {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 24px;
      }

      /* Empty State */
      .empty-state {
        text-align: center;
        padding: 60px 20px;
      }

      .empty-icon {
        font-size: 4rem;
        margin-bottom: 20px;
        opacity: 0.5;
      }

      .empty-state h3 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 12px;
        color: var(--text-primary);
      }

      .empty-state p {
        color: var(--text-muted);
      }

      /* Pending Reviews */
      .pending-reviews h3 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 8px;
        color: var(--text-primary);
      }

      .subtitle {
        color: var(--text-muted);
        margin-bottom: 24px;
      }

      .review-needed-card {
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
      }

      .product-info {
        display: flex;
        align-items: center;
        gap: 16px;
        flex: 1;
      }

      .product-info img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 6px;
      }

      .info h4 {
        margin-bottom: 4px;
        color: var(--text-primary);
      }

      .order-info {
        color: var(--text-muted);
        font-size: 0.9rem;
      }

      .review-needed-card button {
        padding: 10px 20px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        background: var(--primary);
        color: white;
        white-space: nowrap;
      }

      /* My Reviews List */
      .my-review-card {
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 16px;
      }

      .review-product {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 16px;
      }

      .review-product img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 6px;
      }

      .review-header h4 {
        margin-bottom: 4px;
        color: var(--text-primary);
      }

      .review-rating {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
        font-size: 1.1rem;
      }

      .rating-text {
        font-weight: 600;
        color: var(--text-primary);
      }

      .review-date {
        color: var(--text-muted);
        font-size: 0.85rem;
      }

      .review-content {
        margin-bottom: 16px;
      }

      .review-text {
        line-height: 1.6;
        margin-bottom: 12px;
        color: var(--text-primary);
      }

      .review-photos {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
      }

      .review-photos img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 6px;
        cursor: pointer;
      }

      .review-recommend {
        display: inline-block;
        background: var(--success-light);
        color: var(--success);
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 0.9rem;
        font-weight: 500;
        margin-bottom: 8px;
      }

      .review-helpful {
        color: var(--text-muted);
        font-size: 0.9rem;
      }

      .review-actions {
        display: flex;
        gap: 8px;
      }

      .review-actions button {
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        border: 1px solid var(--border);
        background: var(--card);
        color: var(--text-primary);
      }

      .review-actions button.danger {
        color: var(--error);
        border-color: var(--error);
      }

      /* Review Modal */
      .review-modal .modal-overlay {
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }

      .review-modal .modal-content {
        background: var(--card);
        border-radius: 12px;
        max-width: 600px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px 24px 0;
        border-bottom: 1px solid var(--border);
        margin-bottom: 24px;
      }

      .modal-header h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-primary);
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-muted);
      }

      .modal-body {
        padding: 0 24px 24px;
      }

      .review-product-info {
        display: flex;
        align-items: center;
        gap: 16px;
        background: var(--card-secondary);
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 24px;
      }

      .review-product-info img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 6px;
      }

      .product-details h4 {
        margin-bottom: 4px;
        color: var(--text-primary);
      }

      .product-details p {
        color: var(--text-muted);
        font-size: 0.9rem;
      }

      .review-section {
        margin-bottom: 24px;
      }

      .review-section label {
        display: block;
        font-weight: 600;
        margin-bottom: 8px;
        color: var(--text-primary);
      }

      .helper-text {
        font-size: 0.85rem;
        color: var(--text-muted);
        margin-top: 4px;
      }

      .rating-input {
        display: flex;
        gap: 8px;
      }

      .rating-star {
        font-size: 2rem;
        cursor: pointer;
        opacity: 0.3;
        transition: opacity 0.3s ease;
      }

      .rating-star.filled {
        opacity: 1;
      }

      .char-count {
        text-align: right;
        color: var(--text-muted);
        font-size: 0.85rem;
        margin-top: 4px;
      }

      .review-photos-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 12px;
      }

      .review-photo-preview {
        position: relative;
        aspect-ratio: 1;
        border-radius: 8px;
        overflow: hidden;
      }

      .review-photo-preview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .remove-photo-btn {
        position: absolute;
        top: 4px;
        right: 4px;
        background: rgba(0,0,0,0.7);
        color: white;
        border: none;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        cursor: pointer;
      }

      .add-review-photo-btn {
        aspect-ratio: 1;
        border: 2px dashed var(--border);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .add-review-photo-btn:hover {
        border-color: var(--primary);
        background: var(--primary-light);
      }

      .add-icon {
        font-size: 2rem;
        margin-bottom: 8px;
      }

      .recommend-buttons {
        display: flex;
        gap: 12px;
      }

      .recommend-btn {
        flex: 1;
        padding: 12px;
        border: 2px solid var(--border);
        border-radius: 8px;
        background: var(--card);
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
      }

      .recommend-btn.selected {
        border-color: var(--primary);
        background: var(--primary-light);
        color: var(--primary);
      }

      .modal-actions {
        padding: 0 24px 24px;
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }

      .modal-actions button {
        padding: 12px 24px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        border: none;
      }

      .modal-actions .primary {
        background: var(--primary);
        color: white;
      }

      .modal-actions .secondary {
        background: var(--card-secondary);
        color: var(--text-primary);
        border: 1px solid var(--border);
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .reviews-page-container {
          padding: 16px;
        }

        .reviews-stats {
          grid-template-columns: 1fr 1fr;
        }

        .review-needed-card {
          flex-direction: column;
          align-items: stretch;
        }

        .review-needed-card button {
          width: 100%;
        }

        .reviews-tabs {
          flex-direction: column;
        }

        .modal-content {
          margin: 10px;
        }
      }

      /* RTL Support */
      [dir="rtl"] .product-info {
        flex-direction: row-reverse;
      }

      [dir="rtl"] .review-product {
        flex-direction: row-reverse;
      }

      [dir="rtl"] .review-actions {
        flex-direction: row-reverse;
      }

      [dir="rtl"] .modal-actions {
        flex-direction: row-reverse;
      }
    </style>
  `);
};

const support = ({ el, state, actions }) => {
  const supportTickets = state.supportTickets || [];
  const faqs = [
    {
      category: 'orders',
      icon: '📦',
      title: t('order_questions') || 'أسئلة الطلبات',
      items: [
        { q: t('how_track_order') || 'كيف أتتبع طلبي؟', a: t('track_order_answer') || 'يمكنك تتبع طلبك من صفحة الطلبات أو استخدام رقم التتبع على موقع شركة الشحن.' },
        { q: t('change_delivery_address') || 'هل يمكن تغيير عنوان التوصيل؟', a: t('change_address_answer') || 'يمكنك تغيير العنوان قبل شحن الطلب من صفحة تفاصيل الطلب.' },
        { q: t('cancel_order_question') || 'كيف ألغي طلبي؟', a: t('cancel_order_answer') || 'يمكنك إلغاء الطلب من صفحة الطلبات إذا لم يتم شحنه بعد.' }
      ]
    },
    {
      category: 'payment',
      icon: '💳',
      title: t('payment_questions') || 'أسئلة الدفع',
      items: [
        { q: t('payment_methods_available') || 'ما طرق الدفع المتاحة؟', a: t('payment_methods_answer') || 'نقبل مدى، فيزا، ماستركارد، Apple Pay، STC Pay، والدفع عند الاستلام.' },
        { q: t('payment_secure') || 'هل الدفع آمن؟', a: t('payment_secure_answer') || 'نعم، جميع المعاملات مشفرة بأحدث تقنيات الأمان.' },
        { q: t('refund_how_long') || 'متى أستلم استردادي؟', a: t('refund_time_answer') || 'يتم معالجة الاسترداد خلال 3-7 أيام عمل.' }
      ]
    },
    {
      category: 'shipping',
      icon: '🚚',
      title: t('shipping_questions') || 'أسئلة الشحن',
      items: [
        { q: t('shipping_cost') || 'كم تكلفة الشحن؟', a: t('shipping_cost_answer') || 'الشحن مجاني للطلبات فوق 200 ريال، وإلا 25 ريال.' },
        { q: t('delivery_time') || 'كم يستغرق التوصيل؟', a: t('delivery_time_answer') || 'التوصيل العادي 3-5 أيام، السريع 1-2 يوم، ونفس اليوم متاح في الرياض.' },
        { q: t('international_shipping') || 'هل تشحنون دولياً؟', a: t('international_answer') || 'حالياً نوفر الشحن داخل السعودية فقط.' }
      ]
    },
    {
      category: 'returns',
      icon: '↩️',
      title: t('return_questions') || 'أسئلة الإرجاع',
      items: [
        { q: t('return_policy_question') || 'ما هي سياسة الإرجاع؟', a: t('return_policy_answer') || 'يمكنك إرجاع المنتجات خلال 30 يوماً من الاستلام في حالتها الأصلية.' },
        { q: t('return_shipping_cost') || 'من يدفع تكلفة الإرجاع؟', a: t('return_cost_answer') || 'الإرجاع مجاني للمنتجات المعيبة، و15 ريال لتغيير الرأي.' },
        { q: t('exchange_possible') || 'هل يمكن استبدال المنتج؟', a: t('exchange_answer') || 'نعم، يمكنك طلب الاستبدال عند إنشاء طلب الإرجاع.' }
      ]
    },
    {
      category: 'account',
      icon: '👤',
      title: t('account_questions') || 'أسئلة الحساب',
      items: [
        { q: t('create_account') || 'كيف أنشئ حساباً؟', a: t('create_account_answer') || 'اضغط على زر التسجيل واملأ البيانات المطلوبة أو استخدم الدخول السريع.' },
        { q: t('reset_password') || 'نسيت كلمة المرور؟', a: t('reset_password_answer') || 'استخدم خيار نسيت كلمة المرور في صفحة الدخول وسنرسل لك رابط إعادة التعيين.' },
        { q: t('delete_account') || 'كيف أحذف حسابي؟', a: t('delete_account_answer') || 'تواصل معنا عبر الدعم وسنساعدك في حذف حسابك.' }
      ]
    }
  ];
  
  let activeTab = 'faq';
  let searchQuery = '';
  let selectedFaqCategory = null;
  let expandedFaq = null;
  let newTicket = {
    subject: '',
    category: 'general',
    description: '',
    orderId: '',
    priority: 'normal'
  };
  
  // Global functions
  window.switchSupportTab = (tab) => {
    activeTab = tab;
    document.querySelectorAll('.support-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    updateSupportContent();
  };
  
  window.searchFAQ = (query) => {
    searchQuery = query.toLowerCase();
    updateFAQDisplay();
  };
  
  window.selectFaqCategory = (category) => {
    selectedFaqCategory = category;
    updateFAQDisplay();
  };
  
  window.toggleFaq = (categoryIndex, itemIndex) => {
    const key = `${categoryIndex}-${itemIndex}`;
    expandedFaq = expandedFaq === key ? null : key;
    updateFAQDisplay();
  };
  
  window.startLiveChat = () => {
    showNotification(t('live_chat_starting') || 'جاري فتح الدردشة المباشرة...', 'info');
    setTimeout(() => {
      showChatWindow();
    }, 1000);
  };
  
  window.openWhatsApp = () => {
    window.open('https://wa.me/966500000000?text=' + encodeURIComponent(t('whatsapp_greeting') || 'مرحباً، أحتاج مساعدة'), '_blank');
  };
  
  window.callSupport = () => {
    window.location.href = 'tel:920000000';
  };
  
  window.updateTicketField = (field, value) => {
    newTicket[field] = value;
  };
  
  window.submitTicket = () => {
    if (!newTicket.subject.trim() || !newTicket.description.trim()) {
      showNotification(t('fill_required_fields') || 'يرجى ملء جميع الحقول المطلوبة', 'warning');
      return;
    }
    
    const ticket = {
      id: `TKT${Date.now()}`,
      ...newTicket,
      status: 'open',
      createdAt: new Date(),
      messages: [
        {
          from: 'user',
          text: newTicket.description,
          time: new Date()
        }
      ]
    };
    
    if (!state.supportTickets) state.supportTickets = [];
    state.supportTickets.unshift(ticket);
    saveState(state);
    
    // Reset form
    newTicket = {
      subject: '',
      category: 'general',
      description: '',
      orderId: '',
      priority: 'normal'
    };
    
    showNotification(t('ticket_submitted') || 'تم إرسال طلب الدعم بنجاح!', 'success');
    switchSupportTab('tickets');
  };
  
  window.viewTicket = (ticketId) => {
    const ticket = supportTickets.find(t => t.id === ticketId);
    if (ticket) {
      showTicketModal(ticket);
    }
  };
  
  const updateSupportContent = () => {
    const container = document.getElementById('support-content');
    if (!container) return;
    container.innerHTML = renderSupportContent();
  };
  
  const updateFAQDisplay = () => {
    const container = document.getElementById('faq-content');
    if (!container) return;
    container.innerHTML = renderFAQContent();
  };
  
  const renderSupportContent = () => {
    switch (activeTab) {
      case 'faq':
        return renderFAQContent();
      case 'contact':
        return renderContactContent();
      case 'tickets':
        return renderTicketsContent();
      case 'new-ticket':
        return renderNewTicketForm();
      default:
        return '';
    }
  };
  
  const renderFAQContent = () => {
    let filteredFaqs = faqs;
    
    if (selectedFaqCategory) {
      filteredFaqs = faqs.filter(cat => cat.category === selectedFaqCategory);
    }
    
    if (searchQuery) {
      filteredFaqs = faqs.map(cat => ({
        ...cat,
        items: cat.items.filter(item => 
          item.q.toLowerCase().includes(searchQuery) || 
          item.a.toLowerCase().includes(searchQuery)
        )
      })).filter(cat => cat.items.length > 0);
    }
    
    return `
      <div class="faq-section">
        <div class="faq-search">
          <input type="text" 
                 placeholder="${t('search_faqs') || 'ابحث في الأسئلة الشائعة...'}"
                 oninput="searchFAQ(this.value)"
                 value="${searchQuery}">
          <span class="search-icon">🔍</span>
        </div>
        
        <div class="faq-categories">
          <button class="category-chip ${!selectedFaqCategory ? 'active' : ''}" 
                  onclick="selectFaqCategory(null)">
            ${t('all') || 'الكل'}
          </button>
          ${faqs.map(cat => `
            <button class="category-chip ${selectedFaqCategory === cat.category ? 'active' : ''}"
                    onclick="selectFaqCategory('${cat.category}')">
              ${cat.icon} ${cat.title}
            </button>
          `).join('')}
        </div>
        
        <div class="faq-list">
          ${filteredFaqs.map((cat, catIndex) => `
            <div class="faq-category">
              <h3>${cat.icon} ${cat.title}</h3>
              ${cat.items.map((item, itemIndex) => {
                const key = `${catIndex}-${itemIndex}`;
                const isExpanded = expandedFaq === key;
                
                return `
                  <div class="faq-item ${isExpanded ? 'expanded' : ''}">
                    <div class="faq-question" onclick="toggleFaq(${catIndex}, ${itemIndex})">
                      <span>${item.q}</span>
                      <span class="faq-icon">${isExpanded ? '−' : '+'}</span>
                    </div>
                    ${isExpanded ? `
                      <div class="faq-answer">
                        ${item.a}
                      </div>
                    ` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          `).join('')}
        </div>
        
        <div class="faq-footer">
          <p>${t('didnt_find_answer') || 'لم تجد إجابة لسؤالك؟'}</p>
          <button onclick="switchSupportTab('new-ticket')" class="primary">
            ${t('contact_support') || 'تواصل مع الدعم'}
          </button>
        </div>
      </div>
    `;
  };
  
  const renderContactContent = () => {
    return `
      <div class="contact-section">
        <h3>${t('contact_methods') || 'طرق التواصل'}</h3>
        
        <div class="contact-methods">
          <div class="contact-card" onclick="startLiveChat()">
            <div class="contact-icon">💬</div>
            <h4>${t('live_chat') || 'دردشة مباشرة'}</h4>
            <p>${t('live_chat_desc') || 'تحدث مع فريق الدعم فوراً'}</p>
            <span class="availability online">${t('available_now') || 'متاح الآن'}</span>
          </div>
          
          <div class="contact-card" onclick="openWhatsApp()">
            <div class="contact-icon">📱</div>
            <h4>WhatsApp</h4>
            <p>${t('whatsapp_desc') || 'راسلنا على واتساب'}</p>
            <span class="contact-info">+966 50 000 0000</span>
          </div>
          
          <div class="contact-card" onclick="callSupport()">
            <div class="contact-icon">📞</div>
            <h4>${t('phone_support') || 'الاتصال الهاتفي'}</h4>
            <p>${t('phone_desc') || 'اتصل بنا مباشرة'}</p>
            <span class="contact-info">920000000</span>
          </div>
          
          <div class="contact-card" onclick="window.location.href='mailto:support@storez.sa'">
            <div class="contact-icon">✉️</div>
            <h4>${t('email_support') || 'البريد الإلكتروني'}</h4>
            <p>${t('email_desc') || 'راسلنا عبر البريد'}</p>
            <span class="contact-info">support@storez.sa</span>
          </div>
        </div>
        
        <div class="support-hours">
          <h4>${t('support_hours') || 'ساعات الدعم'}</h4>
          <div class="hours-list">
            <div class="hour-item">
              <span>${t('sunday_thursday') || 'الأحد - الخميس'}:</span>
              <strong>9:00 ${t('am') || 'ص'} - 11:00 ${t('pm') || 'م'}</strong>
            </div>
            <div class="hour-item">
              <span>${t('friday_saturday') || 'الجمعة - السبت'}:</span>
              <strong>2:00 ${t('pm') || 'م'} - 10:00 ${t('pm') || 'م'}</strong>
            </div>
          </div>
        </div>
      </div>
    `;
  };
  
  const renderTicketsContent = () => {
    if (supportTickets.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-icon">🎫</div>
          <h3>${t('no_tickets') || 'لا توجد تذاكر دعم'}</h3>
          <p>${t('no_tickets_desc') || 'لم تقم بإنشاء أي تذاكر دعم بعد'}</p>
          <button onclick="switchSupportTab('new-ticket')" class="primary">
            ${t('create_ticket') || 'إنشاء تذكرة دعم'}
          </button>
        </div>
      `;
    }
    
    return `
      <div class="tickets-section">
        <div class="tickets-header">
          <h3>${t('my_tickets') || 'تذاكر الدعم'}</h3>
          <button onclick="switchSupportTab('new-ticket')" class="primary">
            + ${t('new_ticket') || 'تذكرة جديدة'}
          </button>
        </div>
        
        <div class="tickets-list">
          ${supportTickets.map(ticket => `
            <div class="ticket-card" onclick="viewTicket('${ticket.id}')">
              <div class="ticket-header">
                <div class="ticket-info">
                  <h4>#${ticket.id}</h4>
                  <span class="ticket-subject">${ticket.subject}</span>
                </div>
                <span class="ticket-status ${ticket.status}">${t(ticket.status) || ticket.status}</span>
              </div>
              
              <div class="ticket-meta">
                <span class="ticket-category">${ticket.icon || '📋'} ${t(ticket.category) || ticket.category}</span>
                <span class="ticket-date">${new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>
              
              ${ticket.messages.length > 0 ? `
                <div class="ticket-preview">
                  ${ticket.messages[ticket.messages.length - 1].text.substring(0, 100)}${ticket.messages[ticket.messages.length - 1].text.length > 100 ? '...' : ''}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  };
  
  const renderNewTicketForm = () => {
    return `
      <div class="new-ticket-section">
        <h3>${t('create_support_ticket') || 'إنشاء تذكرة دعم'}</h3>
        <p class="subtitle">${t('ticket_desc') || 'املأ النموذج وسيتواصل معك فريق الدعم'}</p>
        
        <form class="ticket-form" onsubmit="event.preventDefault(); submitTicket();">
          <div class="form-group">
            <label>${t('subject') || 'الموضوع'} *</label>
            <input type="text" 
                   value="${newTicket.subject}"
                   oninput="updateTicketField('subject', this.value)"
                   placeholder="${t('ticket_subject_placeholder') || 'مثال: مشكلة في الطلب #12345'}"
                   required>
          </div>
          
          <div class="form-group">
            <label>${t('category') || 'الفئة'} *</label>
            <select onchange="updateTicketField('category', this.value)" required>
              <option value="general" ${newTicket.category === 'general' ? 'selected' : ''}>${t('general') || 'عام'}</option>
              <option value="order" ${newTicket.category === 'order' ? 'selected' : ''}>${t('order_issue') || 'مشكلة في الطلب'}</option>
              <option value="payment" ${newTicket.category === 'payment' ? 'selected' : ''}>${t('payment_issue') || 'مشكلة في الدفع'}</option>
              <option value="delivery" ${newTicket.category === 'delivery' ? 'selected' : ''}>${t('delivery_issue') || 'مشكلة في التوصيل'}</option>
              <option value="product" ${newTicket.category === 'product' ? 'selected' : ''}>${t('product_issue') || 'مشكلة في المنتج'}</option>
              <option value="account" ${newTicket.category === 'account' ? 'selected' : ''}>${t('account_issue') || 'مشكلة في الحساب'}</option>
              <option value="other" ${newTicket.category === 'other' ? 'selected' : ''}>${t('other') || 'أخرى'}</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>${t('order_number') || 'رقم الطلب'} (${t('optional') || 'اختياري'})</label>
            <input type="text" 
                   value="${newTicket.orderId}"
                   oninput="updateTicketField('orderId', this.value)"
                   placeholder="${t('order_number_placeholder') || 'مثال: ORD1234567890'}">
          </div>
          
          <div class="form-group">
            <label>${t('priority') || 'الأولوية'}</label>
            <div class="priority-buttons">
              <button type="button" 
                      class="priority-btn ${newTicket.priority === 'low' ? 'active' : ''}"
                      onclick="updateTicketField('priority', 'low')">
                ${t('low') || 'منخفضة'}
              </button>
              <button type="button"
                      class="priority-btn ${newTicket.priority === 'normal' ? 'active' : ''}"
                      onclick="updateTicketField('priority', 'normal')">
                ${t('normal') || 'عادية'}
              </button>
              <button type="button"
                      class="priority-btn ${newTicket.priority === 'high' ? 'active' : ''}"
                      onclick="updateTicketField('priority', 'high')">
                ${t('high') || 'عالية'}
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label>${t('description') || 'الوصف'} *</label>
            <textarea oninput="updateTicketField('description', this.value)"
                      placeholder="${t('ticket_desc_placeholder') || 'اشرح المشكلة بالتفصيل...'}"
                      required>${newTicket.description}</textarea>
          </div>
          
          <div class="form-actions">
            <button type="button" onclick="switchSupportTab('faq')" class="secondary">
              ${t('cancel') || 'إلغاء'}
            </button>
            <button type="submit" class="primary">
              ${t('submit_ticket') || 'إرسال التذكرة'}
            </button>
          </div>
        </form>
      </div>
    `;
  };
  
  const showTicketModal = (ticket) => {
    const modal = document.createElement('div');
    modal.className = 'ticket-modal';
    modal.innerHTML = `
      <div class="modal-overlay" onclick="closeTicketModal()">
        <div class="modal-content" onclick="event.stopPropagation()">
          <div class="modal-header">
            <div>
              <h2>${t('ticket') || 'تذكرة'} #${ticket.id}</h2>
              <span class="ticket-status ${ticket.status}">${t(ticket.status) || ticket.status}</span>
            </div>
            <button class="close-btn" onclick="closeTicketModal()">✕</button>
          </div>
          
          <div class="modal-body">
            <div class="ticket-details">
              <div class="detail-row">
                <span>${t('subject') || 'الموضوع'}:</span>
                <strong>${ticket.subject}</strong>
              </div>
              <div class="detail-row">
                <span>${t('category') || 'الفئة'}:</span>
                <strong>${t(ticket.category) || ticket.category}</strong>
              </div>
              <div class="detail-row">
                <span>${t('created') || 'تم الإنشاء'}:</span>
                <strong>${new Date(ticket.createdAt).toLocaleString()}</strong>
              </div>
              ${ticket.orderId ? `
                <div class="detail-row">
                  <span>${t('order_number') || 'رقم الطلب'}:</span>
                  <strong>${ticket.orderId}</strong>
                </div>
              ` : ''}
            </div>
            
            <div class="ticket-messages">
              ${ticket.messages.map(msg => `
                <div class="message ${msg.from}">
                  <div class="message-header">
                    <strong>${msg.from === 'user' ? t('you') || 'أنت' : t('support') || 'الدعم'}</strong>
                    <span class="message-time">${new Date(msg.time).toLocaleString()}</span>
                  </div>
                  <div class="message-text">${msg.text}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
    
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2000;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.style.opacity = '1', 10);
    
    window.closeTicketModal = () => {
      modal.style.opacity = '0';
      setTimeout(() => modal.remove(), 300);
    };
  };
  
  const showChatWindow = () => {
    const chatWindow = document.createElement('div');
    chatWindow.className = 'chat-window';
    chatWindow.innerHTML = `
      <div class="chat-header">
        <div class="chat-title">
          <span class="chat-icon">💬</span>
          <div>
            <strong>${t('live_chat') || 'دردشة مباشرة'}</strong>
            <span class="chat-status">${t('online') || 'متصل'}</span>
          </div>
        </div>
        <button onclick="closeChatWindow()" class="chat-close">✕</button>
      </div>
      
      <div class="chat-messages" id="chat-messages">
        <div class="message support">
          <div class="message-text">${t('chat_greeting') || 'مرحباً! كيف يمكنني مساعدتك؟'}</div>
        </div>
      </div>
      
      <div class="chat-input-container">
        <input type="text" 
               id="chat-input"
               placeholder="${t('type_message') || 'اكتب رسالتك...'}"
               onkeypress="if(event.key==='Enter') sendChatMessage()">
        <button onclick="sendChatMessage()" class="send-btn">➤</button>
      </div>
    `;
    
    chatWindow.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 350px;
      height: 500px;
      background: var(--card);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      z-index: 1999;
      display: flex;
      flex-direction: column;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
    `;
    
    document.body.appendChild(chatWindow);
    setTimeout(() => {
      chatWindow.style.opacity = '1';
      chatWindow.style.transform = 'translateY(0)';
    }, 10);
    
    window.closeChatWindow = () => {
      chatWindow.style.opacity = '0';
      chatWindow.style.transform = 'translateY(20px)';
      setTimeout(() => chatWindow.remove(), 300);
    };
    
    window.sendChatMessage = () => {
      const input = document.getElementById('chat-input');
      const message = input.value.trim();
      if (!message) return;
      
      const messagesContainer = document.getElementById('chat-messages');
      const userMessage = document.createElement('div');
      userMessage.className = 'message user';
      userMessage.innerHTML = `<div class="message-text">${message}</div>`;
      messagesContainer.appendChild(userMessage);
      
      input.value = '';
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      // Simulate support response
      setTimeout(() => {
        const supportMessage = document.createElement('div');
        supportMessage.className = 'message support';
        supportMessage.innerHTML = `<div class="message-text">${t('chat_response') || 'شكراً على رسالتك. سيرد عليك أحد موظفي الدعم قريباً.'}</div>`;
        messagesContainer.appendChild(supportMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 1500);
    };
  };
  
  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      z-index: 1000;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 10);
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  el.innerHTML = h(`
    <div class="support-container">
      <div class="support-header">
        <h1>${t('customer_support') || 'دعم العملاء'}</h1>
        <p>${t('support_subtitle') || 'نحن هنا لمساعدتك في أي وقت'}</p>
      </div>
      
      <div class="support-tabs">
        <button class="support-tab-btn active" data-tab="faq" onclick="switchSupportTab('faq')">
          ❓ ${t('faqs') || 'الأسئلة الشائعة'}
        </button>
        <button class="support-tab-btn" data-tab="contact" onclick="switchSupportTab('contact')">
          📞 ${t('contact_us') || 'تواصل معنا'}
        </button>
        <button class="support-tab-btn" data-tab="tickets" onclick="switchSupportTab('tickets')">
          🎫 ${t('my_tickets') || 'تذاكري'} ${supportTickets.length > 0 ? `(${supportTickets.length})` : ''}
        </button>
        <button class="support-tab-btn" data-tab="new-ticket" onclick="switchSupportTab('new-ticket')">
          ➕ ${t('new_ticket') || 'تذكرة جديدة'}
        </button>
      </div>
      
      <div class="support-content" id="support-content">
        ${renderSupportContent()}
      </div>
    </div>

    <style>
      .support-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 20px;
      }

      .support-header {
        text-align: center;
        margin-bottom: 40px;
      }

      .support-header h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 8px;
      }

      .support-header p {
        color: var(--text-muted);
        font-size: 1.1rem;
      }

      .support-tabs {
        display: flex;
        gap: 12px;
        margin-bottom: 32px;
        border-bottom: 2px solid var(--border);
        overflow-x: auto;
      }

      .support-tab-btn {
        padding: 12px 24px;
        border: none;
        background: none;
        color: var(--text-muted);
        cursor: pointer;
        font-weight: 500;
        border-bottom: 2px solid transparent;
        margin-bottom: -2px;
        white-space: nowrap;
        transition: all 0.3s ease;
      }

      .support-tab-btn.active {
        color: var(--primary);
        border-bottom-color: var(--primary);
      }

      .support-content {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 32px;
      }

      /* FAQ Section */
      .faq-search {
        position: relative;
        margin-bottom: 24px;
      }

      .faq-search input {
        width: 100%;
        padding: 14px 50px 14px 20px;
        border: 1px solid var(--border);
        border-radius: 8px;
        font-size: 1rem;
      }

      .search-icon {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 1.2rem;
      }

      .faq-categories {
        display: flex;
        gap: 12px;
        margin-bottom: 32px;
        flex-wrap: wrap;
      }

      .category-chip {
        padding: 8px 16px;
        border: 1px solid var(--border);
        border-radius: 20px;
        background: var(--card);
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s ease;
      }

      .category-chip.active {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
      }

      .faq-category {
        margin-bottom: 32px;
      }

      .faq-category h3 {
        font-size: 1.3rem;
        font-weight: 600;
        margin-bottom: 16px;
      }

      .faq-item {
        border: 1px solid var(--border);
        border-radius: 8px;
        margin-bottom: 12px;
        overflow: hidden;
        transition: all 0.3s ease;
      }

      .faq-question {
        padding: 16px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 500;
      }

      .faq-question:hover {
        background: var(--card-secondary);
      }

      .faq-icon {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--primary);
      }

      .faq-answer {
        padding: 0 16px 16px;
        color: var(--text-muted);
        line-height: 1.6;
        animation: fadeIn 0.3s ease;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      .faq-footer {
        text-align: center;
        margin-top: 40px;
        padding-top: 32px;
        border-top: 1px solid var(--border);
      }

      .faq-footer p {
        margin-bottom: 16px;
        color: var(--text-muted);
      }

      /* Contact Section */
      .contact-methods {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 32px;
      }

      .contact-card {
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 24px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .contact-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        border-color: var(--primary);
      }

      .contact-icon {
        font-size: 3rem;
        margin-bottom: 16px;
      }

      .contact-card h4 {
        font-size: 1.2rem;
        margin-bottom: 8px;
      }

      .contact-card p {
        color: var(--text-muted);
        margin-bottom: 12px;
        font-size: 0.9rem;
      }

      .availability {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 0.85rem;
        font-weight: 500;
      }

      .availability.online {
        background: #10b98120;
        color: #10b981;
      }

      .contact-info {
        color: var(--primary);
        font-weight: 600;
      }

      .support-hours {
        background: var(--card-secondary);
        border-radius: 8px;
        padding: 24px;
      }

      .support-hours h4 {
        font-size: 1.2rem;
        margin-bottom: 16px;
      }

      .hours-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .hour-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      /* Tickets */
      .tickets-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .tickets-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .ticket-card {
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .ticket-card:hover {
        border-color: var(--primary);
        background: var(--primary-light);
      }

      .ticket-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
      }

      .ticket-info h4 {
        font-size: 1.1rem;
        margin-bottom: 4px;
      }

      .ticket-subject {
        color: var(--text-muted);
        font-size: 0.9rem;
      }

      .ticket-status {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 0.85rem;
        font-weight: 500;
      }

      .ticket-status.open {
        background: #3b82f620;
        color: #3b82f6;
      }

      .ticket-status.closed {
        background: #6b728020;
        color: #6b7280;
      }

      .ticket-meta {
        display: flex;
        gap: 16px;
        margin-bottom: 12px;
        font-size: 0.9rem;
        color: var(--text-muted);
      }

      .ticket-preview {
        color: var(--text-muted);
        font-size: 0.9rem;
        line-height: 1.5;
      }

      /* New Ticket Form */
      .new-ticket-section h3 {
        font-size: 1.8rem;
        margin-bottom: 8px;
      }

      .subtitle {
        color: var(--text-muted);
        margin-bottom: 32px;
      }

      .ticket-form {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .form-group label {
        display: block;
        font-weight: 600;
        margin-bottom: 8px;
      }

      .form-group input,
      .form-group select,
      .form-group textarea {
        width: 100%;
        padding: 12px;
        border: 1px solid var(--border);
        border-radius: 6px;
        font-size: 1rem;
      }

      .form-group textarea {
        min-height: 150px;
        resize: vertical;
      }

      .priority-buttons {
        display: flex;
        gap: 12px;
      }

      .priority-btn {
        flex: 1;
        padding: 10px;
        border: 1px solid var(--border);
        border-radius: 6px;
        background: var(--card);
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .priority-btn.active {
        border-color: var(--primary);
        background: var(--primary-light);
        color: var(--primary);
      }

      .form-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }

      .form-actions button {
        padding: 12px 24px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        border: none;
      }

      .form-actions .primary {
        background: var(--primary);
        color: white;
      }

      .form-actions .secondary {
        background: var(--card-secondary);
        color: var(--text-primary);
        border: 1px solid var(--border);
      }

      /* Chat Window */
      .chat-header {
        padding: 16px;
        background: var(--primary);
        color: white;
        border-radius: 12px 12px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .chat-title {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .chat-icon {
        font-size: 1.5rem;
      }

      .chat-status {
        font-size: 0.85rem;
        opacity: 0.9;
      }

      .chat-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
      }

      .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .message {
        max-width: 80%;
        padding: 10px 14px;
        border-radius: 12px;
        line-height: 1.4;
      }

      .message.user {
        align-self: flex-end;
        background: var(--primary);
        color: white;
      }

      .message.support {
        align-self: flex-start;
        background: var(--card-secondary);
      }

      .chat-input-container {
        padding: 16px;
        border-top: 1px solid var(--border);
        display: flex;
        gap: 12px;
      }

      .chat-input-container input {
        flex: 1;
        padding: 10px 14px;
        border: 1px solid var(--border);
        border-radius: 20px;
      }

      .send-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--primary);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
      }

      /* Empty State */
      .empty-state {
        text-align: center;
        padding: 60px 20px;
      }

      .empty-icon {
        font-size: 4rem;
        margin-bottom: 20px;
        opacity: 0.5;
      }

      .empty-state h3 {
        font-size: 1.5rem;
        margin-bottom: 12px;
      }

      .empty-state p {
        color: var(--text-muted);
        margin-bottom: 24px;
      }

      .empty-state button {
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        background: var(--primary);
        color: white;
      }

      /* Modal */
      .ticket-modal .modal-overlay {
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }

      .ticket-modal .modal-content {
        background: var(--card);
        border-radius: 12px;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
      }

      .modal-header {
        padding: 24px;
        border-bottom: 1px solid var(--border);
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }

      .modal-header h2 {
        font-size: 1.5rem;
        margin-bottom: 8px;
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-muted);
      }

      .modal-body {
        padding: 24px;
      }

      .ticket-details {
        background: var(--card-secondary);
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 24px;
      }

      .detail-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
      }

      .ticket-messages {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .message-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 0.9rem;
      }

      .message-time {
        color: var(--text-muted);
        font-size: 0.85rem;
      }

      .message-text {
        line-height: 1.6;
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .support-container {
          padding: 16px;
        }

        .support-content {
          padding: 20px;
        }

        .support-tabs {
          flex-wrap: nowrap;
          overflow-x: auto;
        }

        .contact-methods {
          grid-template-columns: 1fr;
        }

        .chat-window {
          width: calc(100% - 40px) !important;
          height: calc(100vh - 40px) !important;
        }
      }

      /* RTL Support */
      [dir="rtl"] .faq-search input {
        padding: 14px 20px 14px 50px;
      }

      [dir="rtl"] .search-icon {
        right: auto;
        left: 20px;
      }

      [dir="rtl"] .form-actions {
        flex-direction: row-reverse;
      }
    </style>
  `);
};

const referral = ({ el, state, actions }) => {
  // Initialize referral data
  if (!state.referralCode) {
    state.referralCode = generateReferralCode();
    saveState(state);
  }
  
  const referrals = state.referrals || [];
  const referralStats = {
    totalReferrals: referrals.length,
    completedOrders: referrals.filter(r => r.ordered).length,
    pending: referrals.filter(r => !r.ordered).length,
    totalEarnings: referrals.reduce((sum, r) => sum + (r.earned || 0), 0)
  };
  
  const rewardTiers = [
    { count: 1, bonus: 50, icon: '🌟', title: t('bronze_tier') || 'البرونزي', active: referrals.length >= 1 },
    { count: 5, bonus: 100, icon: '⭐', title: t('silver_tier') || 'الفضي', active: referrals.length >= 5 },
    { count: 10, bonus: 200, icon: '💎', title: t('gold_tier') || 'الذهبي', active: referrals.length >= 10 },
    { count: 20, bonus: 500, icon: '👑', title: t('platinum_tier') || 'البلاتيني', active: referrals.length >= 20 }
  ];
  
  let activeTab = 'overview';
  
  // Global functions
  window.switchReferralTab = (tab) => {
    activeTab = tab;
    document.querySelectorAll('.referral-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    updateReferralContent();
  };
  
  window.copyReferralCode = () => {
    navigator.clipboard.writeText(state.referralCode).then(() => {
      showNotification(t('code_copied') || 'تم نسخ الكود!', 'success');
    });
  };
  
  window.copyReferralLink = () => {
    const link = `https://storez.sa?ref=${state.referralCode}`;
    navigator.clipboard.writeText(link).then(() => {
      showNotification(t('link_copied') || 'تم نسخ الرابط!', 'success');
    });
  };
  
  window.shareVia = (platform) => {
    const link = `https://storez.sa?ref=${state.referralCode}`;
    const text = t('referral_message') || `انضم إلى StoreZ واحصل على خصم 50 ريال باستخدام كودي: ${state.referralCode}`;
    
    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + link)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
      snapchat: `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(link)}`,
      instagram: '' // Instagram doesn't support direct sharing
    };
    
    if (platform === 'instagram') {
      showNotification(t('copy_and_share_instagram') || 'انسخ الرابط وشاركه في ستوري الإنستغرام!', 'info');
      copyReferralLink();
    } else if (urls[platform]) {
      window.open(urls[platform], '_blank');
    }
  };
  
  window.downloadQRCode = () => {
    showNotification(t('qr_download_started') || 'جاري تحميل رمز QR...', 'info');
    // In real app, generate and download QR code
  };
  
  const generateReferralCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };
  
  const updateReferralContent = () => {
    const container = document.getElementById('referral-content');
    if (!container) return;
    container.innerHTML = renderReferralContent();
  };
  
  const renderReferralContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'share':
        return renderShareContent();
      case 'history':
        return renderHistory();
      case 'leaderboard':
        return renderLeaderboard();
      default:
        return '';
    }
  };
  
  const renderOverview = () => {
    return `
      <div class="referral-overview">
        <div class="referral-hero">
          <h2>${t('invite_friends_earn') || 'ادعُ أصدقاءك واكسب'}</h2>
          <p>${t('referral_hero_desc') || 'احصل على 50 ريال عن كل صديق يسجل ويتسوق!'}</p>
          
          <div class="referral-code-card">
            <div class="code-label">${t('your_referral_code') || 'كود الإحالة الخاص بك'}</div>
            <div class="code-display">
              <span class="code">${state.referralCode}</span>
              <button onclick="copyReferralCode()" class="copy-btn">
                📋 ${t('copy') || 'نسخ'}
              </button>
            </div>
          </div>
          
          <div class="quick-actions">
            <button onclick="switchReferralTab('share')" class="primary-action">
              🔗 ${t('share_now') || 'شارك الآن'}
            </button>
          </div>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-value">${referralStats.totalReferrals}</div>
            <div class="stat-label">${t('total_referrals') || 'إجمالي الإحالات'}</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-value">${referralStats.completedOrders}</div>
            <div class="stat-label">${t('completed_orders') || 'طلبات مكتملة'}</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">⏳</div>
            <div class="stat-value">${referralStats.pending}</div>
            <div class="stat-label">${t('pending') || 'معلق'}</div>
          </div>
          
          <div class="stat-card highlight">
            <div class="stat-icon">💰</div>
            <div class="stat-value">${fmtSAR(referralStats.totalEarnings)}</div>
            <div class="stat-label">${t('total_earnings') || 'إجمالي الأرباح'}</div>
          </div>
        </div>
        
        <div class="rewards-section">
          <h3>${t('reward_tiers') || 'مستويات المكافآت'}</h3>
          <p class="subtitle">${t('unlock_bonus_rewards') || 'افتح مكافآت إضافية عند الوصول لكل مستوى'}</p>
          
          <div class="tiers-grid">
            ${rewardTiers.map(tier => `
              <div class="tier-card ${tier.active ? 'active' : 'locked'}">
                <div class="tier-icon">${tier.icon}</div>
                <h4>${tier.title}</h4>
                <div class="tier-count">${tier.count} ${t('referrals') || 'إحالة'}</div>
                <div class="tier-bonus">+${tier.bonus} ${t('sar_bonus') || 'ريال مكافأة'}</div>
                ${tier.active ? `
                  <div class="tier-status unlocked">🎉 ${t('unlocked') || 'مفتوح'}</div>
                ` : `
                  <div class="tier-status">${Math.max(0, tier.count - referrals.length)} ${t('more_needed') || 'متبقي'}</div>
                `}
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="how-it-works">
          <h3>${t('how_it_works') || 'كيف يعمل'}</h3>
          <div class="steps-grid">
            <div class="step-card">
              <div class="step-number">1</div>
              <h4>${t('share_code') || 'شارك كودك'}</h4>
              <p>${t('share_code_desc') || 'شارك كود الإحالة أو الرابط مع أصدقائك'}</p>
            </div>
            
            <div class="step-card">
              <div class="step-number">2</div>
              <h4>${t('friend_shops') || 'صديقك يتسوق'}</h4>
              <p>${t('friend_shops_desc') || 'يسجل صديقك ويقوم بأول طلب بـ 200 ريال أو أكثر'}</p>
            </div>
            
            <div class="step-card">
              <div class="step-number">3</div>
              <h4>${t('both_earn') || 'كلاكما يكسب'}</h4>
              <p>${t('both_earn_desc') || 'تحصل أنت وصديقك على 50 ريال في محفظتك'}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  };
  
  const renderShareContent = () => {
    return `
      <div class="share-section">
        <h2>${t('share_referral') || 'شارك الإحالة'}</h2>
        <p class="subtitle">${t('choose_platform') || 'اختر طريقة المشاركة المفضلة'}</p>
        
        <div class="share-code-section">
          <div class="share-code-card">
            <h3>${t('your_code') || 'كودك'}</h3>
            <div class="big-code">${state.referralCode}</div>
            <button onclick="copyReferralCode()" class="copy-btn-large">
              📋 ${t('copy_code') || 'نسخ الكود'}
            </button>
          </div>
          
          <div class="share-link-card">
            <h3>${t('your_link') || 'رابطك'}</h3>
            <div class="link-display">
              <input type="text" 
                     value="https://storez.sa?ref=${state.referralCode}" 
                     readonly
                     onclick="this.select()">
            </div>
            <button onclick="copyReferralLink()" class="copy-btn-large">
              🔗 ${t('copy_link') || 'نسخ الرابط'}
            </button>
          </div>
        </div>
        
        <div class="share-platforms">
          <h3>${t('share_on_social') || 'شارك على السوشيال ميديا'}</h3>
          <div class="platforms-grid">
            <button class="platform-btn whatsapp" onclick="shareVia('whatsapp')">
              <div class="platform-icon">💬</div>
              <span>WhatsApp</span>
            </button>
            
            <button class="platform-btn twitter" onclick="shareVia('twitter')">
              <div class="platform-icon">🐦</div>
              <span>Twitter</span>
            </button>
            
            <button class="platform-btn facebook" onclick="shareVia('facebook')">
              <div class="platform-icon">📘</div>
              <span>Facebook</span>
            </button>
            
            <button class="platform-btn snapchat" onclick="shareVia('snapchat')">
              <div class="platform-icon">👻</div>
              <span>Snapchat</span>
            </button>
            
            <button class="platform-btn instagram" onclick="shareVia('instagram')">
              <div class="platform-icon">📷</div>
              <span>Instagram</span>
            </button>
          </div>
        </div>
        
        <div class="qr-code-section">
          <h3>${t('qr_code') || 'رمز QR'}</h3>
          <div class="qr-container">
            <div class="qr-placeholder">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <rect width="200" height="200" fill="white"/>
                <text x="100" y="100" text-anchor="middle" fill="black" font-size="14">QR Code</text>
                <text x="100" y="120" text-anchor="middle" fill="gray" font-size="10">${state.referralCode}</text>
              </svg>
            </div>
            <button onclick="downloadQRCode()" class="download-qr">
              ⬇️ ${t('download_qr') || 'تحميل QR'}
            </button>
          </div>
        </div>
        
        <div class="referral-tips">
          <h3>💡 ${t('sharing_tips') || 'نصائح للمشاركة'}</h3>
          <ul>
            <li>${t('tip_1') || 'شارك في مجموعات العائلة والأصدقاء على واتساب'}</li>
            <li>${t('tip_2') || 'انشر في ستوري سناب شات وإنستغرام'}</li>
            <li>${t('tip_3') || 'أرسل الكود مباشرة للأشخاص المهتمين بالتسوق'}</li>
            <li>${t('tip_4') || 'اطبع رمز QR وشاركه في مناسباتك'}</li>
          </ul>
        </div>
      </div>
    `;
  };
  
  const renderHistory = () => {
    if (referrals.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-icon">👥</div>
          <h3>${t('no_referrals_yet') || 'لا إحالات بعد'}</h3>
          <p>${t('start_sharing') || 'ابدأ بمشاركة كودك مع أصدقائك!'}</p>
          <button onclick="switchReferralTab('share')" class="primary">
            ${t('share_now') || 'شارك الآن'}
          </button>
        </div>
      `;
    }
    
    return `
      <div class="history-section">
        <h2>${t('referral_history') || 'سجل الإحالات'}</h2>
        <p class="subtitle">${referrals.length} ${t('total_referrals') || 'إجمالي الإحالات'}</p>
        
        <div class="referrals-list">
          ${referrals.map((ref, index) => `
            <div class="referral-item ${ref.ordered ? 'completed' : 'pending'}">
              <div class="referral-avatar">
                ${ref.name ? ref.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div class="referral-info">
                <div class="referral-name">${ref.name || t('friend') || 'صديق'} #${index + 1}</div>
                <div class="referral-date">${new Date(ref.date).toLocaleDateString()}</div>
              </div>
              <div class="referral-status">
                ${ref.ordered ? `
                  <span class="status-badge completed">✅ ${t('completed') || 'مكتمل'}</span>
                  <span class="earnings">+${ref.earned} ${t('sar') || 'ريال'}</span>
                ` : `
                  <span class="status-badge pending">⏳ ${t('pending') || 'معلق'}</span>
                `}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  };
  
  const renderLeaderboard = () => {
    const mockLeaderboard = [
      { rank: 1, name: 'أحمد العلي', referrals: 47, earnings: 4200, avatar: 'A' },
      { rank: 2, name: 'سارة الأحمد', referrals: 39, earnings: 3650, avatar: 'S' },
      { rank: 3, name: 'محمد الخالد', referrals: 32, earnings: 3000, avatar: 'M' },
      { rank: 4, name: 'فاطمة الحسن', referrals: 28, earnings: 2600, avatar: 'F' },
      { rank: 5, name: 'عبدالله السالم', referrals: 24, earnings: 2200, avatar: 'E' },
      { rank: 6, name: t('you') || 'أنت', referrals: referralStats.totalReferrals, earnings: referralStats.totalEarnings, avatar: '👤', isYou: true }
    ];
    
    return `
      <div class="leaderboard-section">
        <h2>🏆 ${t('leaderboard') || 'لوحة المتصدرين'}</h2>
        <p class="subtitle">${t('leaderboard_desc') || 'تنافس مع مستخدمين آخرين واربح جوائز شهرية!'}</p>
        
        <div class="podium">
          <div class="podium-place second">
            <div class="podium-avatar">🥈 ${mockLeaderboard[1].avatar}</div>
            <div class="podium-name">${mockLeaderboard[1].name}</div>
            <div class="podium-stats">${mockLeaderboard[1].referrals} ${t('referrals') || 'إحالة'}</div>
          </div>
          
          <div class="podium-place first">
            <div class="podium-avatar">👑 ${mockLeaderboard[0].avatar}</div>
            <div class="podium-name">${mockLeaderboard[0].name}</div>
            <div class="podium-stats">${mockLeaderboard[0].referrals} ${t('referrals') || 'إحالة'}</div>
            <div class="crown">👑</div>
          </div>
          
          <div class="podium-place third">
            <div class="podium-avatar">🥉 ${mockLeaderboard[2].avatar}</div>
            <div class="podium-name">${mockLeaderboard[2].name}</div>
            <div class="podium-stats">${mockLeaderboard[2].referrals} ${t('referrals') || 'إحالة'}</div>
          </div>
        </div>
        
        <div class="leaderboard-list">
          ${mockLeaderboard.slice(3).map(user => `
            <div class="leaderboard-item ${user.isYou ? 'highlight' : ''}">
              <div class="rank">#${user.rank}</div>
              <div class="user-avatar">${user.avatar}</div>
              <div class="user-info">
                <div class="user-name">${user.name} ${user.isYou ? '(${t("you") || "أنت"})' : ''}</div>
                <div class="user-stats">${user.referrals} ${t('referrals') || 'إحالات'}</div>
              </div>
              <div class="user-earnings">${fmtSAR(user.earnings)}</div>
            </div>
          `).join('')}
        </div>
        
        <div class="monthly-prizes">
          <h3>🎁 ${t('monthly_prizes') || 'جوائز شهرية'}</h3>
          <div class="prizes-grid">
            <div class="prize-card">
              <div class="prize-rank">🥇 ${t('first_place') || 'المركز الأول'}</div>
              <div class="prize-amount">${t('sar_5000') || '5,000 ريال'}</div>
            </div>
            <div class="prize-card">
              <div class="prize-rank">🥈 ${t('second_place') || 'المركز الثاني'}</div>
              <div class="prize-amount">${t('sar_3000') || '3,000 ريال'}</div>
            </div>
            <div class="prize-card">
              <div class="prize-rank">🥉 ${t('third_place') || 'المركز الثالث'}</div>
              <div class="prize-amount">${t('sar_1000') || '1,000 ريال'}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  };
  
  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      z-index: 1000;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 10);
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  el.innerHTML = h(`
    <div class="referral-container">
      <div class="referral-header">
        <h1>${t('referral_program') || 'برنامج الإحالة'}</h1>
        <p>${t('earn_by_referring') || 'اكسب المال بدعوة أصدقائك للتسوق!'}</p>
      </div>
      
      <div class="referral-tabs">
        <button class="referral-tab-btn active" data-tab="overview" onclick="switchReferralTab('overview')">
          📊 ${t('overview') || 'نظرة عامة'}
        </button>
        <button class="referral-tab-btn" data-tab="share" onclick="switchReferralTab('share')">
          🔗 ${t('share') || 'شارك'}
        </button>
        <button class="referral-tab-btn" data-tab="history" onclick="switchReferralTab('history')">
          📜 ${t('history') || 'السجل'} ${referrals.length > 0 ? `(${referrals.length})` : ''}
        </button>
        <button class="referral-tab-btn" data-tab="leaderboard" onclick="switchReferralTab('leaderboard')">
          🏆 ${t('leaderboard') || 'المتصدرون'}
        </button>
      </div>
      
      <div class="referral-content" id="referral-content">
        ${renderReferralContent()}
      </div>
    </div>

    <style>
      .referral-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }

      .referral-header {
        text-align: center;
        margin-bottom: 40px;
      }

      .referral-header h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 8px;
      }

      .referral-header p {
        color: var(--text-muted);
        font-size: 1.1rem;
      }

      .referral-tabs {
        display: flex;
        gap: 12px;
        margin-bottom: 32px;
        border-bottom: 2px solid var(--border);
        overflow-x: auto;
      }

      .referral-tab-btn {
        padding: 12px 24px;
        border: none;
        background: none;
        color: var(--text-muted);
        cursor: pointer;
        font-weight: 500;
        border-bottom: 2px solid transparent;
        margin-bottom: -2px;
        white-space: nowrap;
        transition: all 0.3s ease;
      }

      .referral-tab-btn.active {
        color: var(--primary);
        border-bottom-color: var(--primary);
      }

      /* Overview */
      .referral-hero {
        background: linear-gradient(135deg, var(--primary) 0%, #667eea 100%);
        color: white;
        border-radius: 16px;
        padding: 48px 32px;
        text-align: center;
        margin-bottom: 32px;
      }

      .referral-hero h2 {
        font-size: 2rem;
        margin-bottom: 12px;
      }

      .referral-code-card {
        background: rgba(255,255,255,0.15);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 24px;
        margin: 32px 0;
      }

      .code-label {
        font-size: 0.9rem;
        opacity: 0.9;
        margin-bottom: 12px;
      }

      .code-display {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        flex-wrap: wrap;
      }

      .code {
        font-size: 2.5rem;
        font-weight: 700;
        letter-spacing: 4px;
        font-family: monospace;
      }

      .copy-btn {
        padding: 10px 20px;
        background: white;
        color: var(--primary);
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .copy-btn:hover {
        transform: scale(1.05);
      }

      .quick-actions {
        margin-top: 24px;
      }

      .primary-action {
        padding: 14px 32px;
        background: white;
        color: var(--primary);
        border: none;
        border-radius: 8px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .primary-action:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 40px;
      }

      .stat-card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 24px;
        text-align: center;
        transition: all 0.3s ease;
      }

      .stat-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.1);
      }

      .stat-card.highlight {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        border: none;
      }

      .stat-icon {
        font-size: 2.5rem;
        margin-bottom: 12px;
      }

      .stat-value {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 8px;
      }

      .stat-label {
        font-size: 0.9rem;
        opacity: 0.8;
      }

      .rewards-section,
      .how-it-works {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 32px;
        margin-bottom: 32px;
      }

      .rewards-section h3,
      .how-it-works h3 {
        font-size: 1.5rem;
        margin-bottom: 8px;
      }

      .subtitle {
        color: var(--text-muted);
        margin-bottom: 24px;
      }

      .tiers-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 20px;
      }

      .tier-card {
        border: 2px solid var(--border);
        border-radius: 12px;
        padding: 24px;
        text-align: center;
        transition: all 0.3s ease;
        position: relative;
      }

      .tier-card.locked {
        opacity: 0.6;
      }

      .tier-card.active {
        border-color: var(--primary);
        background: var(--primary-light);
      }

      .tier-icon {
        font-size: 3rem;
        margin-bottom: 12px;
      }

      .tier-card h4 {
        font-size: 1.2rem;
        margin-bottom: 8px;
      }

      .tier-count {
        color: var(--text-muted);
        margin-bottom: 12px;
      }

      .tier-bonus {
        font-weight: 700;
        font-size: 1.1rem;
        color: var(--primary);
        margin-bottom: 12px;
      }

      .tier-status {
        padding: 6px 12px;
        background: var(--card-secondary);
        border-radius: 12px;
        font-size: 0.85rem;
      }

      .tier-status.unlocked {
        background: #10b98120;
        color: #10b981;
      }

      .steps-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 24px;
      }

      .step-card {
        text-align: center;
        padding: 24px;
      }

      .step-number {
        width: 48px;
        height: 48px;
        background: var(--primary);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: 700;
        margin: 0 auto 16px;
      }

      .step-card h4 {
        font-size: 1.2rem;
        margin-bottom: 8px;
      }

      .step-card p {
        color: var(--text-muted);
        line-height: 1.6;
      }

      /* Share Section */
      .share-section {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 32px;
      }

      .share-section h2 {
        font-size: 2rem;
        margin-bottom: 8px;
      }

      .share-code-section {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
        margin: 32px 0;
      }

      .share-code-card,
      .share-link-card {
        border: 2px solid var(--border);
        border-radius: 12px;
        padding: 24px;
        text-align: center;
      }

      .share-code-card h3,
      .share-link-card h3 {
        font-size: 1.1rem;
        margin-bottom: 16px;
        color: var(--text-muted);
      }

      .big-code {
        font-size: 2.5rem;
        font-weight: 700;
        letter-spacing: 4px;
        font-family: monospace;
        color: var(--primary);
        margin: 24px 0;
      }

      .link-display input {
        width: 100%;
        padding: 12px;
        border: 1px solid var(--border);
        border-radius: 8px;
        text-align: center;
        margin-bottom: 16px;
        font-family: monospace;
      }

      .copy-btn-large {
        width: 100%;
        padding: 14px;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.3s ease;
      }

      .copy-btn-large:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      }

      .share-platforms {
        margin: 40px 0;
      }

      .share-platforms h3 {
        font-size: 1.3rem;
        margin-bottom: 20px;
      }

      .platforms-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 16px;
      }

      .platform-btn {
        padding: 20px;
        border: 2px solid var(--border);
        border-radius: 12px;
        background: var(--card);
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
      }

      .platform-btn:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.1);
      }

      .platform-btn.whatsapp:hover { border-color: #25D366; }
      .platform-btn.twitter:hover { border-color: #1DA1F2; }
      .platform-btn.facebook:hover { border-color: #4267B2; }
      .platform-btn.snapchat:hover { border-color: #FFFC00; }
      .platform-btn.instagram:hover { border-color: #E4405F; }

      .platform-icon {
        font-size: 2.5rem;
      }

      .qr-code-section {
        margin: 40px 0;
        text-align: center;
      }

      .qr-code-section h3 {
        font-size: 1.3rem;
        margin-bottom: 20px;
      }

      .qr-container {
        display: inline-block;
        border: 2px solid var(--border);
        border-radius: 12px;
        padding: 24px;
      }

      .qr-placeholder {
        margin-bottom: 16px;
      }

      .download-qr {
        padding: 12px 24px;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
      }

      .referral-tips {
        background: var(--card-secondary);
        border-radius: 12px;
        padding: 24px;
        margin-top: 40px;
      }

      .referral-tips h3 {
        font-size: 1.2rem;
        margin-bottom: 16px;
      }

      .referral-tips ul {
        list-style: none;
        padding: 0;
      }

      .referral-tips li {
        padding: 8px 0;
        padding-left: 24px;
        position: relative;
      }

      .referral-tips li:before {
        content: '✓';
        position: absolute;
        left: 0;
        color: var(--primary);
        font-weight: bold;
      }

      /* History */
      .history-section {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 32px;
      }

      .history-section h2 {
        font-size: 2rem;
        margin-bottom: 8px;
      }

      .referrals-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 24px;
      }

      .referral-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
        border: 1px solid var(--border);
        border-radius: 8px;
        transition: all 0.3s ease;
      }

      .referral-item:hover {
        background: var(--card-secondary);
      }

      .referral-item.completed {
        border-left: 4px solid #10b981;
      }

      .referral-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--primary);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        font-weight: 700;
      }

      .referral-info {
        flex: 1;
      }

      .referral-name {
        font-weight: 600;
        margin-bottom: 4px;
      }

      .referral-date {
        font-size: 0.85rem;
        color: var(--text-muted);
      }

      .referral-status {
        text-align: right;
      }

      .status-badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 0.85rem;
        font-weight: 500;
        margin-bottom: 4px;
      }

      .status-badge.completed {
        background: #10b98120;
        color: #10b981;
      }

      .status-badge.pending {
        background: #f59e0b20;
        color: #f59e0b;
      }

      .earnings {
        display: block;
        color: #10b981;
        font-weight: 600;
      }

      /* Leaderboard */
      .leaderboard-section {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 32px;
      }

      .leaderboard-section h2 {
        font-size: 2rem;
        margin-bottom: 8px;
      }

      .podium {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        gap: 16px;
        margin: 40px 0;
      }

      .podium-place {
        text-align: center;
        padding: 24px;
        border-radius: 12px;
        background: var(--card-secondary);
        min-width: 140px;
        position: relative;
      }

      .podium-place.first {
        background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
        color: white;
        transform: scale(1.1);
        padding-top: 32px;
        padding-bottom: 32px;
      }

      .podium-place.second {
        background: linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%);
        color: white;
      }

      .podium-place.third {
        background: linear-gradient(135deg, #CD7F32 0%, #B8722A 100%);
        color: white;
      }

      .podium-avatar {
        font-size: 3rem;
        margin-bottom: 8px;
      }

      .podium-name {
        font-weight: 600;
        margin-bottom: 4px;
      }

      .podium-stats {
        font-size: 0.9rem;
        opacity: 0.9;
      }

      .crown {
        position: absolute;
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 2rem;
      }

      .leaderboard-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 32px;
      }

      .leaderboard-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
        border: 1px solid var(--border);
        border-radius: 8px;
        transition: all 0.3s ease;
      }

      .leaderboard-item:hover {
        background: var(--card-secondary);
      }

      .leaderboard-item.highlight {
        background: var(--primary-light);
        border-color: var(--primary);
        border-width: 2px;
      }

      .rank {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--text-muted);
        min-width: 40px;
      }

      .user-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--primary);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
      }

      .user-info {
        flex: 1;
      }

      .user-name {
        font-weight: 600;
        margin-bottom: 4px;
      }

      .user-stats {
        font-size: 0.85rem;
        color: var(--text-muted);
      }

      .user-earnings {
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--primary);
      }

      .monthly-prizes {
        margin-top: 40px;
        padding-top: 32px;
        border-top: 1px solid var(--border);
      }

      .monthly-prizes h3 {
        font-size: 1.3rem;
        margin-bottom: 20px;
      }

      .prizes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }

      .prize-card {
        background: var(--card-secondary);
        border-radius: 12px;
        padding: 20px;
        text-align: center;
      }

      .prize-rank {
        font-size: 1.5rem;
        margin-bottom: 12px;
      }

      .prize-amount {
        font-size: 1.3rem;
        font-weight: 700;
        color: var(--primary);
      }

      /* Empty State */
      .empty-state {
        text-align: center;
        padding: 60px 20px;
      }

      .empty-icon {
        font-size: 4rem;
        margin-bottom: 20px;
        opacity: 0.5;
      }

      .empty-state h3 {
        font-size: 1.5rem;
        margin-bottom: 12px;
      }

      .empty-state p {
        color: var(--text-muted);
        margin-bottom: 24px;
      }

      .empty-state button {
        padding: 12px 24px;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .referral-container {
          padding: 16px;
        }

        .referral-hero {
          padding: 32px 20px;
        }

        .code {
          font-size: 1.8rem;
          letter-spacing: 2px;
        }

        .stats-grid {
          grid-template-columns: repeat(2, 1fr);
        }

        .podium {
          flex-direction: column;
          align-items: center;
        }

        .podium-place.first {
          order: -1;
          transform: scale(1);
        }
      }

      /* RTL Support */
      [dir="rtl"] .referral-tips li {
        padding-left: 0;
        padding-right: 24px;
      }

      [dir="rtl"] .referral-tips li:before {
        left: auto;
        right: 0;
      }

      [dir="rtl"] .referral-item.completed {
        border-left: none;
        border-right: 4px solid #10b981;
      }
    </style>
  `);
};

const analytics = ({ el, state, actions }) => {
  // Calculate analytics data
  const orders = state.orders || [];
  const completedOrders = orders.filter(o => o.status === 'delivered');
  
  const totalSpent = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = completedOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
  
  // Calculate savings
  const totalSavings = completedOrders.reduce((sum, o) => {
    const itemSavings = o.items.reduce((s, item) => {
      const product = productById(item.productId);
      if (product && product.originalPrice) {
        return s + ((product.originalPrice - product.price) * item.quantity);
      }
      return s;
    }, 0);
    return sum + itemSavings + (o.discount || 0);
  }, 0);
  
  // Category breakdown
  const categorySpending = {};
  completedOrders.forEach(order => {
    order.items.forEach(item => {
      const product = productById(item.productId);
      if (product) {
        const category = product.category || 'other';
        categorySpending[category] = (categorySpending[category] || 0) + (product.price * item.quantity);
      }
    });
  });
  
  // Monthly spending
  const monthlySpending = {};
  completedOrders.forEach(order => {
    const month = new Date(order.createdAt).toLocaleDateString('en', { year: 'numeric', month: 'short' });
    monthlySpending[month] = (monthlySpending[month] || 0) + order.total;
  });
  
  // Environmental impact (mock calculations)
  const carbonSaved = totalOrders * 2.5; // kg CO2 saved per order
  const packagingReduced = totalOrders * 0.3; // kg packaging reduced
  
  let activeTab = 'overview';
  
  // Global functions
  window.switchAnalyticsTab = (tab) => {
    activeTab = tab;
    document.querySelectorAll('.analytics-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    updateAnalyticsContent();
  };
  
  window.downloadReport = () => {
    showNotification(t('generating_report') || 'جاري إنشاء التقرير...', 'info');
    // In real app, generate and download PDF report
  };
  
  window.shareInsights = () => {
    showNotification(t('insights_shared') || 'تم مشاركة الإحصائيات!', 'success');
  };
  
  const updateAnalyticsContent = () => {
    const container = document.getElementById('analytics-content');
    if (!container) return;
    container.innerHTML = renderAnalyticsContent();
  };
  
  const renderAnalyticsContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'spending':
        return renderSpending();
      case 'impact':
        return renderImpact();
      case 'insights':
        return renderInsights();
      default:
        return '';
    }
  };
  
  const renderOverview = () => {
    return `
      <div class="analytics-overview">
        <div class="stats-cards">
          <div class="stat-card primary">
            <div class="stat-icon">💰</div>
            <div class="stat-value">${fmtSAR(totalSpent)}</div>
            <div class="stat-label">${t('total_spent') || 'إجمالي الإنفاق'}</div>
            <div class="stat-trend positive">+${((totalSpent / (totalSpent + 100)) * 100).toFixed(1)}% ${t('vs_last_month') || 'مقارنة بالشهر الماضي'}</div>
          </div>
          
          <div class="stat-card success">
            <div class="stat-icon">💸</div>
            <div class="stat-value">${fmtSAR(totalSavings)}</div>
            <div class="stat-label">${t('total_savings') || 'إجمالي التوفير'}</div>
            <div class="stat-trend">${((totalSavings / totalSpent) * 100).toFixed(1)}% ${t('savings_rate') || 'معدل التوفير'}</div>
          </div>
          
          <div class="stat-card info">
            <div class="stat-icon">📦</div>
            <div class="stat-value">${totalOrders}</div>
            <div class="stat-label">${t('total_orders') || 'إجمالي الطلبات'}</div>
            <div class="stat-trend">${fmtSAR(avgOrderValue)} ${t('avg_order') || 'متوسط الطلب'}</div>
          </div>
          
          <div class="stat-card accent">
            <div class="stat-icon">🌱</div>
            <div class="stat-value">${carbonSaved.toFixed(1)} kg</div>
            <div class="stat-label">${t('carbon_saved') || 'كربون موفر'}</div>
            <div class="stat-trend positive">${t('eco_friendly') || 'صديق للبيئة'}</div>
          </div>
        </div>
        
        <div class="chart-section">
          <h3>${t('spending_trend') || 'اتجاه الإنفاق'}</h3>
          <div class="chart-container">
            <div class="bar-chart">
              ${Object.entries(monthlySpending).slice(-6).map(([month, amount]) => {
                const maxAmount = Math.max(...Object.values(monthlySpending));
                const height = (amount / maxAmount) * 200;
                return `
                  <div class="bar-column">
                    <div class="bar" style="height: ${height}px;" title="${fmtSAR(amount)}">
                      <span class="bar-value">${fmtSAR(amount)}</span>
                    </div>
                    <div class="bar-label">${month}</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
        
        <div class="quick-insights">
          <h3>${t('quick_insights') || 'رؤى سريعة'}</h3>
          <div class="insights-grid">
            <div class="insight-card">
              <div class="insight-icon">🔥</div>
              <div class="insight-content">
                <h4>${t('most_shopped_category') || 'الفئة الأكثر تسوقاً'}</h4>
                <p>${Object.keys(categorySpending).sort((a, b) => categorySpending[b] - categorySpending[a])[0] || t('none') || 'لا شيء'}</p>
              </div>
            </div>
            
            <div class="insight-card">
              <div class="insight-icon">⏰</div>
              <div class="insight-content">
                <h4>${t('shopping_frequency') || 'تكرار التسوق'}</h4>
                <p>${totalOrders > 0 ? `${(30 / totalOrders).toFixed(1)} ${t('days_between_orders') || 'أيام بين الطلبات'}` : t('no_orders') || 'لا طلبات'}</p>
              </div>
            </div>
            
            <div class="insight-card">
              <div class="insight-icon">💎</div>
              <div class="insight-content">
                <h4>${t('loyalty_status') || 'حالة الولاء'}</h4>
                <p>${totalOrders >= 10 ? t('gold_member') || 'عضو ذهبي' : totalOrders >= 5 ? t('silver_member') || 'عضو فضي' : t('bronze_member') || 'عضو برونزي'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };
  
  const renderSpending = () => {
    return `
      <div class="spending-section">
        <div class="spending-header">
          <h3>${t('spending_analysis') || 'تحليل الإنفاق'}</h3>
          <button onclick="downloadReport()" class="download-btn">
            ⬇️ ${t('download_report') || 'تحميل التقرير'}
          </button>
        </div>
        
        <div class="category-breakdown">
          <h4>${t('spending_by_category') || 'الإنفاق حسب الفئة'}</h4>
          <div class="category-chart">
            ${Object.entries(categorySpending).sort((a, b) => b[1] - a[1]).map(([category, amount]) => {
              const percentage = (amount / totalSpent) * 100;
              return `
                <div class="category-row">
                  <div class="category-info">
                    <span class="category-icon">${getCategoryIcon(category)}</span>
                    <span class="category-name">${t(category) || category}</span>
                  </div>
                  <div class="category-bar-container">
                    <div class="category-bar" style="width: ${percentage}%; background: var(--primary);"></div>
                  </div>
                  <div class="category-amount">
                    <strong>${fmtSAR(amount)}</strong>
                    <span class="category-percent">${percentage.toFixed(1)}%</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <div class="payment-methods">
          <h4>${t('payment_breakdown') || 'تفصيل طرق الدفع'}</h4>
          <div class="payment-stats">
            <div class="payment-card">
              <div class="payment-icon">💳</div>
              <div class="payment-details">
                <div class="payment-name">${t('credit_card') || 'بطاقة ائتمان'}</div>
                <div class="payment-value">${fmtSAR(totalSpent * 0.6)}</div>
                <div class="payment-usage">60% ${t('of_transactions') || 'من المعاملات'}</div>
              </div>
            </div>
            
            <div class="payment-card">
              <div class="payment-icon">📱</div>
              <div class="payment-details">
                <div class="payment-name">Apple Pay</div>
                <div class="payment-value">${fmtSAR(totalSpent * 0.3)}</div>
                <div class="payment-usage">30% ${t('of_transactions') || 'من المعاملات'}</div>
              </div>
            </div>
            
            <div class="payment-card">
              <div class="payment-icon">💵</div>
              <div class="payment-details">
                <div class="payment-name">${t('cash_on_delivery') || 'الدفع عند الاستلام'}</div>
                <div class="payment-value">${fmtSAR(totalSpent * 0.1)}</div>
                <div class="payment-usage">10% ${t('of_transactions') || 'من المعاملات'}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="spending-tips">
          <h4>💡 ${t('savings_tips') || 'نصائح للتوفير'}</h4>
          <ul class="tips-list">
            <li>${t('tip_use_promos') || 'استخدم أكواد الخصم عند كل عملية شراء'}</li>
            <li>${t('tip_wait_sales') || 'انتظر عروض نهاية الموسم للمشتريات الكبيرة'}</li>
            <li>${t('tip_bulk_save') || 'الشراء بالجملة يوفر على الشحن'}</li>
            <li>${t('tip_referral') || 'استخدم برنامج الإحالة لكسب رصيد مجاني'}</li>
          </ul>
        </div>
      </div>
    `;
  };
  
  const renderImpact = () => {
    return `
      <div class="impact-section">
        <div class="impact-hero">
          <h3>🌍 ${t('environmental_impact') || 'التأثير البيئي'}</h3>
          <p>${t('impact_desc') || 'تسوقك الذكي يساعد في حماية البيئة'}</p>
        </div>
        
        <div class="impact-stats">
          <div class="impact-card">
            <div class="impact-icon">🌱</div>
            <div class="impact-value">${carbonSaved.toFixed(1)} kg</div>
            <div class="impact-label">${t('co2_reduced') || 'كربون مُوفر'}</div>
            <div class="impact-comparison">${t('equivalent_trees', { count: Math.floor(carbonSaved / 20) }) || `يعادل ${Math.floor(carbonSaved / 20)} شجرة`}</div>
          </div>
          
          <div class="impact-card">
            <div class="impact-icon">📦</div>
            <div class="impact-value">${packagingReduced.toFixed(1)} kg</div>
            <div class="impact-label">${t('packaging_reduced') || 'تقليل التغليف'}</div>
            <div class="impact-comparison">${t('plastic_bottles', { count: Math.floor(packagingReduced * 20) }) || `${Math.floor(packagingReduced * 20)} زجاجة بلاستيك`}</div>
          </div>
          
          <div class="impact-card">
            <div class="impact-icon">🚚</div>
            <div class="impact-value">${(totalOrders * 5).toFixed(1)} km</div>
            <div class="impact-label">${t('delivery_optimized') || 'تحسين التوصيل'}</div>
            <div class="impact-comparison">${t('fuel_saved') || 'وقود موفر'}</div>
          </div>
          
          <div class="impact-card">
            <div class="impact-icon">♻️</div>
            <div class="impact-value">${((totalOrders / (totalOrders + 5)) * 100).toFixed(0)}%</div>
            <div class="impact-label">${t('sustainable_purchases') || 'مشتريات مستدامة'}</div>
            <div class="impact-comparison">${t('eco_friendly_products') || 'منتجات صديقة للبيئة'}</div>
          </div>
        </div>
        
        <div class="impact-timeline">
          <h4>${t('eco_journey') || 'رحلتك البيئية'}</h4>
          <div class="timeline">
            ${[
              { month: t('jan') || 'يناير', co2: 5.2, icon: '🌱' },
              { month: t('feb') || 'فبراير', co2: 7.8, icon: '🌿' },
              { month: t('mar') || 'مارس', co2: 12.4, icon: '🌳' },
              { month: t('apr') || 'أبريل', co2: 15.6, icon: '🌲' }
            ].map(month => `
              <div class="timeline-item">
                <div class="timeline-icon">${month.icon}</div>
                <div class="timeline-content">
                  <div class="timeline-month">${month.month}</div>
                  <div class="timeline-value">${month.co2} kg CO₂</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="impact-actions">
          <h4>${t('eco_actions') || 'إجراءات بيئية'}</h4>
          <div class="actions-grid">
            <div class="action-card">
              <div class="action-badge completed">✓</div>
              <h5>${t('paperless_receipts') || 'فواتير إلكترونية'}</h5>
              <p>${t('saved_trees') || 'وفرت الأشجار'}</p>
            </div>
            
            <div class="action-card">
              <div class="action-badge completed">✓</div>
              <h5>${t('consolidated_shipping') || 'شحن موحد'}</h5>
              <p>${t('reduced_emissions') || 'قللت الانبعاثات'}</p>
            </div>
            
            <div class="action-card">
              <div class="action-badge pending">○</div>
              <h5>${t('reusable_packaging') || 'تغليف قابل لإعادة الاستخدام'}</h5>
              <p>${t('coming_soon') || 'قريباً'}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  };
  
  const renderInsights = () => {
    const favoriteProducts = completedOrders
      .flatMap(o => o.items)
      .reduce((acc, item) => {
        acc[item.productId] = (acc[item.productId] || 0) + item.quantity;
        return acc;
      }, {});
    
    const topProduct = Object.entries(favoriteProducts).sort((a, b) => b[1] - a[1])[0];
    const topProductObj = topProduct ? productById(topProduct[0]) : null;
    
    return `
      <div class="insights-section">
        <h3>${t('personalized_insights') || 'رؤى شخصية'}</h3>
        
        <div class="insights-cards">
          <div class="insight-detail-card">
            <div class="insight-header">
              <span class="insight-badge">${t('favorite') || 'المفضل'}</span>
              <h4>${t('your_favorite_product') || 'منتجك المفضل'}</h4>
            </div>
            ${topProductObj ? `
              <div class="insight-product">
                <img src="${getProductImage(topProductObj, 200)}" alt="${getProductTitle(topProductObj)}">
                <div class="insight-product-info">
                  <h5>${getProductTitle(topProductObj)}</h5>
                  <p>${t('purchased_times', { count: topProduct[1] }) || `تم شراؤه ${topProduct[1]} مرات`}</p>
                </div>
              </div>
            ` : `<p>${t('no_purchases_yet') || 'لم تقم بأي مشتريات بعد'}</p>`}
          </div>
          
          <div class="insight-detail-card">
            <div class="insight-header">
              <span class="insight-badge shopping">${t('habits') || 'العادات'}</span>
              <h4>${t('shopping_patterns') || 'أنماط التسوق'}</h4>
            </div>
            <div class="pattern-list">
              <div class="pattern-item">
                <span class="pattern-icon">🕐</span>
                <div>
                  <strong>${t('peak_time') || 'وقت الذروة'}</strong>
                  <p>${t('evening_shopper') || 'تتسوق غالباً في المساء'}</p>
                </div>
              </div>
              
              <div class="pattern-item">
                <span class="pattern-icon">📅</span>
                <div>
                  <strong>${t('shopping_day') || 'يوم التسوق'}</strong>
                  <p>${t('weekend_preference') || 'تفضل عطلة نهاية الأسبوع'}</p>
                </div>
              </div>
              
              <div class="pattern-item">
                <span class="pattern-icon">💸</span>
                <div>
                  <strong>${t('budget_conscious') || 'واعي بالميزانية'}</strong>
                  <p>${t('seeks_deals') || 'تبحث عن العروض والخصومات'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="recommendations-section">
          <h4>${t('personalized_recommendations') || 'توصيات شخصية'}</h4>
          <div class="recommendations-grid">
            ${state.products.slice(0, 4).map(product => `
              <div class="recommendation-card" onclick="location.hash='#/pdp/${product.id}'">
                <img src="${getProductImage(product, 300)}" alt="${getProductTitle(product)}">
                <div class="recommendation-content">
                  <h5>${getProductTitle(product)}</h5>
                  <div class="recommendation-reason">${t('based_on_history') || 'بناءً على سجلك'}</div>
                  <div class="recommendation-price">${fmtSAR(product.price)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="achievements-section">
          <h4>🏆 ${t('achievements') || 'الإنجازات'}</h4>
          <div class="achievements-grid">
            <div class="achievement-card ${totalOrders >= 1 ? 'unlocked' : 'locked'}">
              <div class="achievement-icon">${totalOrders >= 1 ? '✓' : '🔒'}</div>
              <h5>${t('first_order') || 'أول طلب'}</h5>
              <p>${t('placed_first_order') || 'قمت بأول طلب لك'}</p>
            </div>
            
            <div class="achievement-card ${totalOrders >= 5 ? 'unlocked' : 'locked'}">
              <div class="achievement-icon">${totalOrders >= 5 ? '✓' : '🔒'}</div>
              <h5>${t('frequent_shopper') || 'متسوق متكرر'}</h5>
              <p>${t('completed_5_orders') || 'أكملت 5 طلبات'}</p>
            </div>
            
            <div class="achievement-card ${totalSavings >= 100 ? 'unlocked' : 'locked'}">
              <div class="achievement-icon">${totalSavings >= 100 ? '✓' : '🔒'}</div>
              <h5>${t('smart_saver') || 'موفر ذكي'}</h5>
              <p>${t('saved_100_sar') || 'وفرت 100 ريال'}</p>
            </div>
            
            <div class="achievement-card ${carbonSaved >= 10 ? 'unlocked' : 'locked'}">
              <div class="achievement-icon">${carbonSaved >= 10 ? '✓' : '🔒'}</div>
              <h5>${t('eco_warrior') || 'محارب بيئي'}</h5>
              <p>${t('reduced_10kg_co2') || 'قللت 10 كجم كربون'}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  };
  
  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      z-index: 1000;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 10);
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  el.innerHTML = h(`
    <div class="analytics-container">
      <div class="analytics-header">
        <div>
          <h1>${t('analytics_insights') || 'التحليلات والرؤى'}</h1>
          <p>${t('analytics_subtitle') || 'افهم عادات التسوق وحسّن قراراتك'}</p>
        </div>
        <button onclick="shareInsights()" class="share-btn">
          📤 ${t('share') || 'مشاركة'}
        </button>
      </div>
      
      <div class="analytics-tabs">
        <button class="analytics-tab-btn active" data-tab="overview" onclick="switchAnalyticsTab('overview')">
          📊 ${t('overview') || 'نظرة عامة'}
        </button>
        <button class="analytics-tab-btn" data-tab="spending" onclick="switchAnalyticsTab('spending')">
          💰 ${t('spending') || 'الإنفاق'}
        </button>
        <button class="analytics-tab-btn" data-tab="impact" onclick="switchAnalyticsTab('impact')">
          🌍 ${t('impact') || 'التأثير'}
        </button>
        <button class="analytics-tab-btn" data-tab="insights" onclick="switchAnalyticsTab('insights')">
          💡 ${t('insights') || 'الرؤى'}
        </button>
      </div>
      
      <div class="analytics-content" id="analytics-content">
        ${renderAnalyticsContent()}
      </div>
      
      <div class="privacy-notice">
        <p>🔒 ${t('privacy_notice') || 'جميع بياناتك محمية ولا تُشارك مع أطراف ثالثة'}</p>
      </div>
    </div>

    <style>
      .analytics-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }

      .analytics-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 32px;
      }

      .analytics-header h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 8px;
      }

      .analytics-header p {
        color: var(--text-muted);
        font-size: 1.1rem;
      }

      .share-btn {
        padding: 12px 24px;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .share-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      }

      .analytics-tabs {
        display: flex;
        gap: 12px;
        margin-bottom: 32px;
        border-bottom: 2px solid var(--border);
        overflow-x: auto;
      }

      .analytics-tab-btn {
        padding: 12px 24px;
        border: none;
        background: none;
        color: var(--text-muted);
        cursor: pointer;
        font-weight: 500;
        border-bottom: 2px solid transparent;
        margin-bottom: -2px;
        white-space: nowrap;
        transition: all 0.3s ease;
      }

      .analytics-tab-btn.active {
        color: var(--primary);
        border-bottom-color: var(--primary);
      }

      /* Stats Cards */
      .stats-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 40px;
      }

      .stat-card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 24px;
        text-align: center;
        transition: all 0.3s ease;
      }

      .stat-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.1);
      }

      .stat-card.primary { border-top: 3px solid var(--primary); }
      .stat-card.success { border-top: 3px solid #10b981; }
      .stat-card.info { border-top: 3px solid #3b82f6; }
      .stat-card.accent { border-top: 3px solid #10b981; }

      .stat-icon {
        font-size: 2.5rem;
        margin-bottom: 12px;
      }

      .stat-value {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 8px;
        color: var(--text-primary);
      }

      .stat-label {
        font-size: 0.9rem;
        color: var(--text-muted);
        margin-bottom: 8px;
      }

      .stat-trend {
        font-size: 0.85rem;
        color: var(--text-muted);
      }

      .stat-trend.positive {
        color: #10b981;
      }

      /* Chart Section */
      .chart-section {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 32px;
        margin-bottom: 32px;
      }

      .chart-section h3 {
        font-size: 1.5rem;
        margin-bottom: 24px;
      }

      .chart-container {
        overflow-x: auto;
      }

      .bar-chart {
        display: flex;
        align-items: flex-end;
        gap: 24px;
        min-height: 250px;
        padding: 20px 0;
      }

      .bar-column {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 80px;
      }

      .bar {
        width: 100%;
        background: linear-gradient(180deg, var(--primary) 0%, #667eea 100%);
        border-radius: 8px 8px 0 0;
        position: relative;
        transition: all 0.3s ease;
        cursor: pointer;
      }

      .bar:hover {
        opacity: 0.8;
      }

      .bar-value {
        position: absolute;
        top: -25px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.75rem;
        font-weight: 600;
        white-space: nowrap;
      }

      .bar-label {
        margin-top: 12px;
        font-size: 0.85rem;
        color: var(--text-muted);
        text-align: center;
      }

      /* Quick Insights */
      .quick-insights {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 32px;
        margin-bottom: 32px;
      }

      .quick-insights h3 {
        font-size: 1.5rem;
        margin-bottom: 24px;
      }

      .insights-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
      }

      .insight-card {
        background: var(--card-secondary);
        border-radius: 8px;
        padding: 20px;
        display: flex;
        gap: 16px;
      }

      .insight-icon {
        font-size: 2rem;
        flex-shrink: 0;
      }

      .insight-content h4 {
        font-size: 1rem;
        margin-bottom: 4px;
      }

      .insight-content p {
        color: var(--text-muted);
        font-size: 0.9rem;
        margin: 0;
      }

      /* Spending Section */
      .spending-section {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 32px;
      }

      .spending-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 32px;
      }

      .spending-header h3 {
        font-size: 1.8rem;
        margin: 0;
      }

      .download-btn {
        padding: 10px 20px;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
      }

      .category-breakdown {
        margin-bottom: 40px;
      }

      .category-breakdown h4 {
        font-size: 1.3rem;
        margin-bottom: 20px;
      }

      .category-chart {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .category-row {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .category-info {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 150px;
      }

      .category-icon {
        font-size: 1.5rem;
      }

      .category-name {
        font-weight: 500;
      }

      .category-bar-container {
        flex: 1;
        height: 32px;
        background: var(--card-secondary);
        border-radius: 16px;
        overflow: hidden;
      }

      .category-bar {
        height: 100%;
        border-radius: 16px;
        transition: width 0.5s ease;
      }

      .category-amount {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        min-width: 120px;
      }

      .category-percent {
        font-size: 0.85rem;
        color: var(--text-muted);
      }

      /* Payment Methods */
      .payment-methods {
        margin-bottom: 40px;
      }

      .payment-methods h4 {
        font-size: 1.3rem;
        margin-bottom: 20px;
      }

      .payment-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
      }

      .payment-card {
        background: var(--card-secondary);
        border-radius: 12px;
        padding: 20px;
        display: flex;
        gap: 16px;
      }

      .payment-icon {
        font-size: 2.5rem;
        flex-shrink: 0;
      }

      .payment-name {
        font-weight: 600;
        margin-bottom: 8px;
      }

      .payment-value {
        font-size: 1.3rem;
        font-weight: 700;
        color: var(--primary);
        margin-bottom: 4px;
      }

      .payment-usage {
        font-size: 0.85rem;
        color: var(--text-muted);
      }

      /* Tips */
      .spending-tips {
        background: var(--primary-light);
        border-radius: 8px;
        padding: 24px;
      }

      .spending-tips h4 {
        font-size: 1.2rem;
        margin-bottom: 16px;
      }

      .tips-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .tips-list li {
        padding: 8px 0 8px 28px;
        position: relative;
        line-height: 1.6;
      }

      .tips-list li:before {
        content: '✓';
        position: absolute;
        left: 0;
        color: var(--primary);
        font-weight: bold;
        font-size: 1.2rem;
      }

      /* Impact Section */
      .impact-section {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 32px;
      }

      .impact-hero {
        text-align: center;
        margin-bottom: 40px;
      }

      .impact-hero h3 {
        font-size: 2rem;
        margin-bottom: 12px;
      }

      .impact-hero p {
        color: var(--text-muted);
        font-size: 1.1rem;
      }

      .impact-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 20px;
        margin-bottom: 40px;
      }

      .impact-card {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        border-radius: 12px;
        padding: 24px;
        text-align: center;
      }

      .impact-icon {
        font-size: 3rem;
        margin-bottom: 12px;
      }

      .impact-value {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 8px;
      }

      .impact-label {
        font-size: 0.9rem;
        opacity: 0.9;
        margin-bottom: 8px;
      }

      .impact-comparison {
        font-size: 0.85rem;
        opacity: 0.8;
      }

      /* Timeline */
      .impact-timeline {
        margin-bottom: 40px;
      }

      .impact-timeline h4 {
        font-size: 1.3rem;
        margin-bottom: 20px;
      }

      .timeline {
        display: flex;
        gap: 24px;
        overflow-x: auto;
        padding: 20px 0;
      }

      .timeline-item {
        text-align: center;
        min-width: 120px;
      }

      .timeline-icon {
        font-size: 2.5rem;
        margin-bottom: 12px;
      }

      .timeline-month {
        font-weight: 600;
        margin-bottom: 4px;
      }

      .timeline-value {
        color: #10b981;
        font-size: 0.9rem;
      }

      /* Actions */
      .impact-actions h4 {
        font-size: 1.3rem;
        margin-bottom: 20px;
      }

      .actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
      }

      .action-card {
        background: var(--card-secondary);
        border-radius: 12px;
        padding: 20px;
        position: relative;
      }

      .action-badge {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        font-weight: bold;
      }

      .action-badge.completed {
        background: #10b981;
        color: white;
      }

      .action-badge.pending {
        background: var(--border);
        color: var(--text-muted);
      }

      .action-card h5 {
        font-size: 1.1rem;
        margin-bottom: 8px;
        padding-right: 40px;
      }

      .action-card p {
        color: var(--text-muted);
        font-size: 0.9rem;
        margin: 0;
      }

      /* Insights Section */
      .insights-section {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 32px;
      }

      .insights-section > h3 {
        font-size: 2rem;
        margin-bottom: 32px;
      }

      .insights-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 24px;
        margin-bottom: 40px;
      }

      .insight-detail-card {
        background: var(--card-secondary);
        border-radius: 12px;
        padding: 24px;
      }

      .insight-header {
        margin-bottom: 20px;
      }

      .insight-badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 0.85rem;
        font-weight: 600;
        background: var(--primary-light);
        color: var(--primary);
        margin-bottom: 12px;
      }

      .insight-badge.shopping {
        background: #3b82f620;
        color: #3b82f6;
      }

      .insight-header h4 {
        font-size: 1.3rem;
        margin: 0;
      }

      .insight-product {
        display: flex;
        gap: 16px;
        align-items: center;
      }

      .insight-product img {
        width: 80px;
        height: 80px;
        border-radius: 8px;
        object-fit: cover;
      }

      .insight-product-info h5 {
        font-size: 1.1rem;
        margin-bottom: 4px;
      }

      .insight-product-info p {
        color: var(--text-muted);
        font-size: 0.9rem;
        margin: 0;
      }

      .pattern-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .pattern-item {
        display: flex;
        gap: 12px;
      }

      .pattern-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
      }

      .pattern-item strong {
        display: block;
        margin-bottom: 4px;
      }

      .pattern-item p {
        color: var(--text-muted);
        font-size: 0.9rem;
        margin: 0;
      }

      /* Recommendations */
      .recommendations-section {
        margin-bottom: 40px;
      }

      .recommendations-section h4 {
        font-size: 1.3rem;
        margin-bottom: 20px;
      }

      .recommendations-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 16px;
      }

      .recommendation-card {
        background: var(--card-secondary);
        border-radius: 12px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .recommendation-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.1);
      }

      .recommendation-card img {
        width: 100%;
        height: 150px;
        object-fit: cover;
      }

      .recommendation-content {
        padding: 16px;
      }

      .recommendation-content h5 {
        font-size: 1rem;
        margin-bottom: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .recommendation-reason {
        font-size: 0.85rem;
        color: var(--text-muted);
        margin-bottom: 8px;
      }

      .recommendation-price {
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--primary);
      }

      /* Achievements */
      .achievements-section h4 {
        font-size: 1.3rem;
        margin-bottom: 20px;
      }

      .achievements-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 16px;
      }

      .achievement-card {
        background: var(--card-secondary);
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        transition: all 0.3s ease;
      }

      .achievement-card.unlocked {
        background: linear-gradient(135deg, var(--primary) 0%, #667eea 100%);
        color: white;
      }

      .achievement-card.locked {
        opacity: 0.5;
      }

      .achievement-icon {
        font-size: 3rem;
        margin-bottom: 12px;
      }

      .achievement-card h5 {
        font-size: 1.1rem;
        margin-bottom: 8px;
      }

      .achievement-card p {
        font-size: 0.85rem;
        opacity: 0.9;
        margin: 0;
      }

      /* Privacy Notice */
      .privacy-notice {
        background: var(--card-secondary);
        border-radius: 8px;
        padding: 16px;
        text-align: center;
        margin-top: 32px;
      }

      .privacy-notice p {
        margin: 0;
        color: var(--text-muted);
        font-size: 0.9rem;
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .analytics-container {
          padding: 16px;
        }

        .analytics-header {
          flex-direction: column;
          gap: 16px;
        }

        .stats-cards {
          grid-template-columns: repeat(2, 1fr);
        }

        .bar-chart {
          overflow-x: auto;
        }

        .insights-cards {
          grid-template-columns: 1fr;
        }

        .recommendations-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      /* RTL Support */
      [dir="rtl"] .tips-list li {
        padding-left: 0;
        padding-right: 28px;
      }

      [dir="rtl"] .tips-list li:before {
        left: auto;
        right: 0;
      }

      [dir="rtl"] .action-badge {
        right: auto;
        left: 12px;
      }

      [dir="rtl"] .action-card h5 {
        padding-right: 0;
        padding-left: 40px;
      }
    </style>
  `);
};

export const routes = {
  "/landing": landing,
  "/auth": auth,
  "/home": home,
  "/discover": discover,
  "/pdp": pdp,
  "/checkout": checkout,
  "/orders": orders,
  "/returns": returns,
  "/reviews": reviews_page,
  "/support": support,
  "/referral": referral,
  "/analytics": analytics,
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
                style="background: rgba(255,255,255,0.9); border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center;"
                title="${isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}">
          <span style="font-size: 18px;">${isInWishlist ? '❤️' : '🤍'}</span>
        </button>
      </div>
      
      <!-- Save for Later Button -->
      <div style="position: absolute; top: 12px; left: 12px; z-index: 2;">
        <button onclick="event.stopPropagation(); saveForLaterFromCard('${product.id}')" 
                style="background: rgba(255,255,255,0.9); border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center;"
                title="Save for Later">
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
          
          ${(() => {
            const cartItem = window.__app__?.state?.cart?.find(item => item.productId === product.id);
            const cartQty = cartItem ? cartItem.quantity : 0;
            const buttonText = cartQty > 0 ? `🛒 ${t("add_to_cart")} (${cartQty})` : `🛒 ${t("add_to_cart")}`;
            const titleText = cartQty > 0 ? `In Cart (${cartQty})` : t("add_to_cart") || "Add to Cart";
            return `<button onclick="event.stopPropagation(); addToCartFromCard('${product.id}')" 
                  style="width: 100%; padding: 10px; background: var(--brand); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: all 0.2s ease;"
                  title="${titleText}">
            ${buttonText}
          </button>`;
          })()}
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
    if (location.hash === '#/discover') {
      // Force re-render if already on discover page
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } else {
      location.hash = '#/discover';
    }
  };

  window.searchByCategory = function(categoryId) {
    const category = state.search.categories.find(c => c.id === categoryId);
    if (category) {
      actions.performSearch("", { category: [loc(category, "name")] });
      if (location.hash === '#/discover') {
        // Force re-render if already on discover page
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      } else {
        location.hash = '#/discover';
      }
    }
  };

  window.clearSearch = function() {
    actions.clearSearch();
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    if (location.hash === '#/discover') {
      // Force re-render if already on discover page
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } else {
      location.hash = '#/discover';
    }
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
        .filter(c => c) // Remove undefined values
        .map(c => loc(c, "name"));
      
      const minPrice = parseInt(document.getElementById('minPrice').value) || 0;
      const maxPrice = parseInt(document.getElementById('maxPrice').value) || 1000;
      const sortBy = document.getElementById('sortBy').value || 'relevance';
      
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
                        style="background: none; border: none; font-size: 32px; cursor: pointer; color: var(--text-muted); transition: color 0.2s;"
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
    const { state, actions } = window.__app__;
    if (!actions || !actions.toggleWishlist) {
      console.error('Actions not available');
      return;
    }
    
    actions.toggleWishlist(productId);
    
    // Update button appearance
    const button = document.querySelector(`button[onclick*="toggleWishlist('${productId}')"]`);
    if (button) {
      const isInWishlist = state.wishlist.items.includes(productId);
      button.innerHTML = isInWishlist ? '❤️' : '🤍';
      button.title = isInWishlist ? (window.t?.("remove_from_wishlist") || "Remove from Wishlist") : (window.t?.("add_to_wishlist") || "Add to Wishlist");
    }
  };

  // Global helper for adding to wishlist from onclick handlers
  window.addToWishlist = function(productId) {
    const { actions } = window.__app__;
    if (!actions || !actions.addToWishlist) {
      console.error('Actions not available');
      return;
    }
    actions.addToWishlist(productId);
    location.reload();
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
      uns("1515879218367-8466d910aaa4", 200),
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
    <div class="social-post" data-post-id="${post.id}" style="background: var(--card); border-radius: 12px; padding: 16px; margin-bottom: 16px; border: 1px solid var(--border);">
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
              if (!product) return '';
              const productImage = getProductImage(product);
              const productTitle = getProductTitle(product);
              return `
                <div onclick="location.hash='#/pdp/${pid}'" class="tagged-product" style="display: flex; align-items: center; gap: 8px; padding: 8px; background: var(--bg); border-radius: 8px; cursor: pointer; border: 1px solid var(--border);">
                  <img src="${productImage}" alt="${productTitle}" style="width: 32px; height: 32px; border-radius: 4px;" loading="lazy">
                  <div>
                    <div style="font-size: 12px; font-weight: 500;">${productTitle}</div>
                    <div style="font-size: 11px; color: var(--text-muted);">${fmtSAR(product.price)}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}
      </div>

      <!-- Post Actions -->
      <div class="post-actions" style="display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid var(--border);">
        <div style="display: flex; align-items: center; gap: 16px;">
          <button onclick="togglePostLike('${post.id}')" class="post-action" style="display: flex; align-items: center; gap: 4px; background: none; border: none; color: ${isLiked ? 'var(--brand)' : 'var(--text-muted)'}; cursor: pointer;" title="${isLiked ? 'Unlike' : 'Like'} post">
            ${isLiked ? '❤️' : '🤍'} ${post.likes}
          </button>
          <button onclick="showComments('${post.id}')" class="post-action" style="display: flex; align-items: center; gap: 4px; background: none; border: none; color: var(--text-muted); cursor: pointer;" title="View comments">
            💬 ${post.comments}
          </button>
          <button onclick="sharePost('${post.id}')" class="post-action" style="display: flex; align-items: center; gap: 4px; background: none; border: none; color: var(--text-muted); cursor: pointer;" title="Share post">
            📤 ${post.shares}
          </button>
        </div>
        <button onclick="toggleSavePost('${post.id}')" class="post-action" style="background: none; border: none; color: ${isSaved ? 'var(--brand)' : 'var(--text-muted)'}; cursor: pointer;" title="${isSaved ? 'Unsave' : 'Save'} post">
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

  window.showPostMenu = function(postId) {
    // Show post menu options
    const modal = document.createElement('div');
    modal.className = 'post-menu-modal';
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5); z-index: 200;
      display: flex; align-items: center; justify-content: center;
      padding: 20px; box-sizing: border-box;
    `;

    modal.innerHTML = `
      <div style="background: var(--bg); border-radius: 12px; padding: 20px; min-width: 250px;">
        <h3 style="margin: 0 0 16px; text-align: center;">${t("post_options") || "خيارات المنشور"}</h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <button onclick="sharePost('${postId}')" style="padding: 12px; background: none; border: 1px solid var(--border); border-radius: 6px; cursor: pointer; text-align: right;">
            📤 ${t("share_post") || "مشاركة المنشور"}
          </button>
          <button onclick="reportPost('${postId}')" style="padding: 12px; background: none; border: 1px solid var(--border); border-radius: 6px; cursor: pointer; text-align: right;">
            🚨 ${t("report_post") || "الإبلاغ عن المنشور"}
          </button>
          <button onclick="hidePost('${postId}')" style="padding: 12px; background: none; border: 1px solid var(--border); border-radius: 6px; cursor: pointer; text-align: right;">
            👁️‍🗨️ ${t("hide_post") || "إخفاء المنشور"}
          </button>
          <button onclick="closePostMenu()" style="padding: 12px; background: var(--bg); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; text-align: center; margin-top: 8px;">
            ${t("cancel") || "إلغاء"}
          </button>
        </div>
      </div>
    `;

    modal.onclick = (e) => {
      if (e.target === modal) closePostMenu();
    };

    document.body.appendChild(modal);
  };

  window.closePostMenu = function() {
    const modal = document.querySelector('.post-menu-modal');
    if (modal) document.body.removeChild(modal);
  };

  window.sharePost = function(postId) {
    closePostMenu();
    // Implement post sharing
    if (navigator.share) {
      navigator.share({
        title: t("check_out_post") || "اطلع على هذا المنشور",
        url: `${location.origin}${location.pathname}#/social`
      });
    } else {
      alert(t("post_shared") || "تم نسخ رابط المنشور");
    }
  };

  window.reportPost = function(postId) {
    closePostMenu();
    alert(t("post_reported") || "تم الإبلاغ عن المنشور");
  };

  window.hidePost = function(postId) {
    closePostMenu();
    const postElement = document.querySelector(`[data-post-id="${postId}"]`);
    if (postElement) {
      postElement.style.display = 'none';
    }
    alert(t("post_hidden") || "تم إخفاء المنشور");
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
      saveState();
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

// Global function for showing all Save for Later items
window.showAllSaveForLater = function() {
  window.location.hash = '#/wishlist';
  // Wait for navigation, then scroll to Save for Later section
  setTimeout(() => {
    const saveForLaterSection = document.querySelector('[data-section="save-for-later"]');
    if (saveForLaterSection) {
      saveForLaterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 300);
};