/* data.js — state, persistence, sample catalog, and actions */

/* ---------- localStorage key ---------- */
const LS_STATE_KEY = "storez_spa_state_v2";

/* ---------- unsplash helper ---------- */
export const uns = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

/* ---------- product helper ---------- */
function P(id, name, cat, price, listPrice = null, creatorId = null, img = null, nameAr = null, catAr = null) {
  return {
    id, 
    price, 
    listPrice, 
    creatorId,
    img,
    rating: 4.2 + Math.random() * 0.6,
    name: { en: name, ar: nameAr || name },
    cat: { en: cat, ar: catAr || cat },
    tags: ["#trending", "#new", "#popular"]
  };
}

// Helper to get localized product field
export function loc(product, field, fallback = "en") {
  if (!product || !product[field]) return "";
  const lang = getCurrentLang();
  return product[field][lang] || product[field][fallback] || "";
}

// Helper to get product title in current language
export function getProductTitle(product) {
  return loc(product, "name");
}

// Helper to get product image URL
export function getProductImage(product, width = 900) {
  if (!product || !product.img) return "";
  return `https://images.unsplash.com/photo-${product.img}?auto=format&fit=crop&w=${width}&q=70`;
}

// Helper to get current language (simplified)
function getCurrentLang() {
  return localStorage.getItem("storez_spa_lang") || "en";
}
export function getProductField(product, field, lang = null) {
  const currentLang = lang || localStorage.getItem("storez_lang") || "en";
  if (typeof product[field] === 'object' && product[field] !== null) {
    return product[field][currentLang] || product[field].en;
  }
  return product[field];
}

/* ---------- initial state ---------- */
export const state = {
  prefs: {
    lang: "en",
    theme: "auto",
    rtlOverride: null,
    sponsor: false,
    notif: { orders: true, live: true, marketing: false, consent: true }
  },
  user: { 
    id: "u1", 
    name: "Maya", 
    email: "",
    authed: false, 
    guest: false, 
    credits: 45, 
    referrals: 2,
    authMethod: "",
    interests: [],
    preferences: { marketing: false, orders: true, live: false },
    followedCreators: [],
    likedProducts: [],
    stats: { productViews: 0, timeSpent: 0, sessionsCount: 0 }
  },
  
  products: [
    P("p1", "CloudRunner Sneakers", "Footwear", 329, 399, "c1", "1519744792095-ee0c2909d518", "حذاء الجري السحابي", "أحذية"),
    P("p2", "Sunset Hoodie", "Apparel", 149, 189, "c2", "1515879218367-8466d910aaa4", "هودي الغروب", "ملابس"),
    P("p3", "Mystic Diffuser", "Home", 89, 119, "c3", "1515378791036-0648a3ef77b2", "موزع عطر صوفي", "منزل"),
    P("p4", "Travel Mug", "Accessories", 45, 65, "c2", "1521572267360-ee0c2909d518", "كوب السفر", "إكسسوارات"),
    P("p5", "Plant Pot Set", "Home", 199, 249, "c3", "1519744792095-ee0c2909d518", "طقم أصص النباتات", "منزل"),
    P("p6", "Active Leggings", "Apparel", 149, 189, "c1", "1521572267360-ee0c2909d518", "ليجنز رياضي", "ملابس"),
    P("p7", "Blue Light Glasses", "Accessories", 99, 129, "c3", "1515879218367-8466d910aaa4", "نظارات الضوء الأزرق", "إكسسوارات"),
    P("p8", "Detox Clay Mask", "Beauty", 79, null, "c3", "1515378791036-0648a3ef77b2", "ماسك الطين المنظف", "جمال")
  ],

  creators: [
    { 
      id: "c1", 
      name: "@linafit", 
      handle: "@linafit",
      avatar: uns("1494790108755-2616b612b9e3", 150), 
      followers: 128000, 
      verified: true,
      bio: "Wellness & athleisure",
      live: true
    },
    { 
      id: "c2", 
      name: "@saudichef", 
      handle: "@saudichef",
      avatar: uns("1507003211169-0a1dd7bf0ec3", 150), 
      followers: 98000, 
      verified: false,
      bio: "Traditional Saudi cuisine",
      live: false
    },
    { 
      id: "c3", 
      name: "@homeguru", 
      handle: "@homeguru",
      avatar: uns("1472099645785-5658abf4ff4e", 150), 
      followers: 54000, 
      verified: true,
      bio: "Clean home & lifestyle",
      live: false
    }
  ],

  cart: [],
  wishlist: [],
  orders: [],
  
  messages: [
    { 
      id: "m1", 
      with: "@linafit", 
      creatorId: "c1",
      unread: 2,
      thread: [
        { from: "@linafit", text: "New drop tonight! Tap \"Live\" from my profile 👀", ts: Date.now() - 3600e3 },
        { from: "user", text: "Can't wait! What time?", ts: Date.now() - 3500e3 },
        { from: "@linafit", text: "Starting at 8 PM! I'll be showing the new active wear collection with special prices 🔥", ts: Date.now() - 1800e3 },
        { from: "@linafit", text: "Don't miss the flash deals during the stream!", ts: Date.now() - 900e3 }
      ] 
    },
    {
      id: "m2",
      with: "@saudichef",
      creatorId: "c2", 
      unread: 0,
      thread: [
        { from: "user", text: "Love your cooking videos! Do you ship ingredients?", ts: Date.now() - 86400e3 },
        { from: "@saudichef", text: "Thank you! Yes, we have spice kits and specialty ingredients. Check my store!", ts: Date.now() - 82800e3 },
        { from: "user", text: "Perfect! Just ordered the traditional spice collection", ts: Date.now() - 82200e3 },
        { from: "@saudichef", text: "Excellent choice! I'll include the recipe card for Kabsa 😊", ts: Date.now() - 82000e3 }
      ]
    },
    {
      id: "m3",
      with: "Support Team",
      creatorId: null,
      unread: 1,
      thread: [
        { from: "user", text: "I need help with my recent order #12345", ts: Date.now() - 7200e3 },
        { from: "support", text: "I'd be happy to help! Let me check your order status.", ts: Date.now() - 7000e3 },
        { from: "support", text: "Your order is being prepared and will ship tomorrow. You'll get tracking details via SMS.", ts: Date.now() - 6800e3 }
      ]
    }
  ],

  ugcFeed: [
    {
      id: "ugc1",
      creator: "@linafit",
      creatorId: "c1", 
      creatorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b9e3?auto=format&fit=crop&w=150&q=70",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=70",
      caption: "New workout routine using these amazing CloudRunner sneakers! Perfect for morning runs 🏃‍♀️✨ #fitness #running",
      timestamp: Date.now() - 7200000, // 2 hours ago
      likes: 127,
      comments: 23,
      shares: 8,
      liked: false,
      saved: false,
      privacy: "public",
      taggedProducts: ["p1"],
      settings: {
        allowComments: true,
        allowSharing: true,
        showLikeCount: true
      }
    },
    {
      id: "ugc2", 
      creator: "@saudichef",
      creatorId: "c2",
      creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=70",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=70",
      caption: "Cooking up something special tonight! Can't wait to share this recipe with you all 👨‍🍳🔥",
      timestamp: Date.now() - 14400000, // 4 hours ago
      likes: 89,
      comments: 15,
      shares: 5,
      liked: true,
      saved: false,
      privacy: "public",
      taggedProducts: [],
      settings: {
        allowComments: true,
        allowSharing: true,
        showLikeCount: true
      }
    },
    {
      id: "ugc3",
      creator: "@maya_style", 
      creatorId: "u1",
      creatorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=70",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=70",
      caption: "Saturday outfit vibes! Loving this new style combination 💫 What do you think?",
      timestamp: Date.now() - 21600000, // 6 hours ago
      likes: 45,
      comments: 8,
      shares: 2,
      liked: false,
      saved: true,
      privacy: "public", 
      taggedProducts: ["p3", "p5"],
      settings: {
        allowComments: true,
        allowSharing: true,
        showLikeCount: true
      }
    },
    {
      id: "ugc4",
      creator: "@techsaudi",
      creatorId: "c3",
      creatorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=70",
      image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=600&q=70",
      caption: "Unboxing the latest tech! This wireless headset is a game changer for productivity 🎧⚡",
      timestamp: Date.now() - 43200000, // 12 hours ago
      likes: 203,
      comments: 41,
      shares: 18,
      liked: true,
      saved: false,
      privacy: "public",
      taggedProducts: ["p6"],
      settings: {
        allowComments: true,
        allowSharing: true,
        showLikeCount: true
      }
    }
  ],
  
  live: {
    activeStreams: [
      {
        id: "live1",
        creatorId: "c1",
        creator: "@linafit",
        title: "New Active Wear Collection Drop! 🔥",
        viewers: 1247,
        startTime: Date.now() - 2400000, // 40 mins ago
        thumbnail: uns("1571019613454-1cb2f99b2d8b", 600),
        tags: ["#newdrop", "#activewear", "#fitness"],
        products: ["p1", "p6"],
        flashDeals: [
          { productId: "p1", originalPrice: 329, salePrice: 249, endTime: Date.now() + 600000 },
          { productId: "p6", originalPrice: 149, salePrice: 99, endTime: Date.now() + 1200000 }
        ],
        isLive: true
      }
    ],
    upcomingStreams: [
      {
        id: "upcoming1",
        creatorId: "c2",
        creator: "@saudichef",
        title: "Traditional Kabsa Cooking Master Class",
        scheduledTime: Date.now() + 7200000, // 2 hours from now
        thumbnail: uns("1556909114-f6e7ad7d3136", 600),
        description: "Learn authentic Saudi Kabsa recipe with traditional spices",
        products: ["p4"], // Spice collection
        estimatedDuration: 60, // minutes
        reminders: 156
      },
      {
        id: "upcoming2", 
        creatorId: "c3",
        creator: "@homeguru",
        title: "Home Organization & Minimalist Living",
        scheduledTime: Date.now() + 21600000, // 6 hours from now
        thumbnail: uns("1586023492239-4922ffb4d83b", 600),
        description: "Transform your space with these organization tips",
        products: ["p5"], // Plant pot set
        estimatedDuration: 45,
        reminders: 89
      }
    ],
    featuredStreams: [
      {
        id: "featured1",
        creatorId: "c1", 
        creator: "@linafit",
        title: "Weekly Fitness Challenge",
        type: "series",
        nextEpisode: Date.now() + 86400000, // Tomorrow
        episodeCount: 4,
        subscribers: 2341
      }
    ]
  },

  // Enhanced search and discovery state
  search: {
    query: "",
    filters: {
      category: [],
      priceRange: [0, 1000],
      rating: 0,
      availability: "all", // all, in-stock, sale
      sortBy: "relevance" // relevance, price-low, price-high, rating, newest
    },
    history: ["حذاء رياضي", "سويت شيرت", "جاكيت", "sneakers", "hoodie"],
    trending: ["حذاء رياضي", "سويت شيرت", "جينز", "sneakers", "activewear", "home decor"],
    suggestions: [],
    results: [],
    categories: [
      { id: "apparel", name: { en: "Apparel", ar: "ملابس" }, count: 3 },
      { id: "footwear", name: { en: "Footwear", ar: "أحذية" }, count: 1 },
      { id: "accessories", name: { en: "Accessories", ar: "إكسسوارات" }, count: 2 },
      { id: "home", name: { en: "Home", ar: "منزل" }, count: 2 },
      { id: "beauty", name: { en: "Beauty", ar: "جمال" }, count: 1 }
    ],
    recentSearches: [],
    popularSearches: [
      { query: "حذاء رياضي", count: 1250 },
      { query: "سويت شيرت", count: 890 },
      { query: "جينز", count: 672 },
      { query: "sneakers", count: 1340 },
      { query: "hoodie", count: 756 }
    ]
  },

  // Product Reviews & Ratings System
  reviews: {
    // Product reviews organized by productId
    byProduct: {
      "p1": [
        {
          id: "r1",
          productId: "p1",
          userId: "u1",
          userName: "سارة أحمد",
          userAvatar: uns("1494790108755-2616b612b9e3", 80),
          rating: 5,
          title: { en: "Perfect for running!", ar: "مثالي للجري!" },
          content: { 
            en: "These sneakers are incredibly comfortable and perfect for my daily runs. The cushioning is amazing and they look great too!",
            ar: "هذه الأحذية مريحة بشكل لا يصدق ومثالية لجري اليومي. التبطين رائع وتبدو جميلة أيضاً!"
          },
          images: [
            uns("1571019613454-1cb2f99b2d8b", 400),
            uns("1605296867424-35aaf25826ef", 400)
          ],
          verified: true,
          helpful: 24,
          notHelpful: 2,
          date: Date.now() - 86400000 * 3, // 3 days ago
          tags: ["comfort", "quality", "style"]
        },
        {
          id: "r2", 
          productId: "p1",
          userId: "u2",
          userName: "أحمد السعد",
          userAvatar: uns("1507003211169-0a1dd7bf0ec3", 80),
          rating: 4,
          title: { en: "Great quality", ar: "جودة ممتازة" },
          content: {
            en: "Really good shoes, fit well and look stylish. Only minus is they run a bit small, so order half size up.",
            ar: "أحذية جيدة حقاً، مناسبة وأنيقة. العيب الوحيد أنها صغيرة قليلاً، لذا اطلب نصف مقاس أكبر."
          },
          images: [],
          verified: true,
          helpful: 18,
          notHelpful: 1,
          date: Date.now() - 86400000 * 7, // 1 week ago
          tags: ["sizing", "style"]
        },
        {
          id: "r3",
          productId: "p1", 
          userId: "u3",
          userName: "Maya K.",
          userAvatar: uns("1438761681033-6461ffad8d80", 80),
          rating: 5,
          title: { en: "Love them!", ar: "أحبها!" },
          content: {
            en: "Best sneakers I've ever owned. Super comfortable for long walks and the design is trendy.",
            ar: "أفضل أحذية رياضية امتلكتها على الإطلاق. مريحة جداً للمشي الطويل والتصميم عصري."
          },
          images: [uns("1549298916-b41d501f42fb", 400)],
          verified: false,
          helpful: 12,
          notHelpful: 0,
          date: Date.now() - 86400000 * 14, // 2 weeks ago
          tags: ["comfort", "design"]
        }
      ],
      "p2": [
        {
          id: "r4",
          productId: "p2",
          userId: "u4", 
          userName: "فاطمة علي",
          userAvatar: uns("1544005313-94dc875841af", 80),
          rating: 5,
          title: { en: "Cozy and stylish", ar: "مريح وأنيق" },
          content: {
            en: "This hoodie is so soft and comfortable. Perfect for chilly evenings and the color is exactly as shown.",
            ar: "هذا الهودي ناعم ومريح جداً. مثالي للأمسيات الباردة واللون تماماً كما هو موضح."
          },
          images: [uns("1515879218367-8466d910aaa4", 400)],
          verified: true,
          helpful: 16,
          notHelpful: 0,
          date: Date.now() - 86400000 * 5, // 5 days ago
          tags: ["comfort", "color", "quality"]
        }
      ],
      "p3": [
        {
          id: "r5",
          productId: "p3",
          userId: "u5",
          userName: "نورا محمد", 
          userAvatar: uns("1487412720-8a98462a3baa", 80),
          rating: 4,
          title: { en: "Nice ambiance", ar: "أجواء جميلة" },
          content: {
            en: "Creates a lovely atmosphere in my room. The scent lasts long and it looks elegant on my nightstand.",
            ar: "يخلق أجواء جميلة في غرفتي. الرائحة تدوم طويلاً ويبدو أنيقاً على طاولة السرير."
          },
          images: [],
          verified: true,
          helpful: 9,
          notHelpful: 1,
          date: Date.now() - 86400000 * 10, // 10 days ago
          tags: ["ambiance", "scent", "design"]
        }
      ]
    },
    
    // Review statistics by product
    stats: {
      "p1": {
        averageRating: 4.7,
        totalReviews: 3,
        distribution: { 5: 2, 4: 1, 3: 0, 2: 0, 1: 0 },
        verifiedCount: 2,
        photoCount: 3,
        helpfulCount: 54
      },
      "p2": {
        averageRating: 5.0,
        totalReviews: 1,
        distribution: { 5: 1, 4: 0, 3: 0, 2: 0, 1: 0 },
        verifiedCount: 1,
        photoCount: 1,
        helpfulCount: 16
      },
      "p3": {
        averageRating: 4.0,
        totalReviews: 1,
        distribution: { 5: 0, 4: 1, 3: 0, 2: 0, 1: 0 },
        verifiedCount: 1,
        photoCount: 0,
        helpfulCount: 9
      }
    },

    // Review filters and sorting
    filters: {
      rating: "all", // all, 5, 4, 3, 2, 1
      verified: false, // true/false
      withPhotos: false, // true/false
      sortBy: "helpful" // helpful, newest, oldest, rating-high, rating-low
    }
  },

  analytics: {
    pageViews: 0,
    sessionStart: Date.now(),
    interactions: [],
    performance: [],
    metrics: [],
    errors: []
  },

  metrics: { 
    impressions: 0, 
    addToCart: 0, 
    purchases: 0, 
    revenue: 0, 
    productViews: 0, 
    favorites: 0 
  }
};

/* ---------- helpers ---------- */
export function productById(id) { 
  return state.products.find(p => p.id === id); 
}

export function creatorById(id) { 
  return state.creators.find(c => c.id === id); 
}

export function cartTotal() {
  return state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

/* ---------- persistence ---------- */
export function loadState(target = state) {
  try {
    const raw = localStorage.getItem(LS_STATE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    Object.assign(target, saved);
  } catch (e) {
    console.warn("loadState failed", e);
  }
}

export function saveState(s = state) {
  try {
    localStorage.setItem(LS_STATE_KEY, JSON.stringify(s));
  } catch (e) {
    console.warn("saveState failed", e);
  }
}

export function clearState() {
  localStorage.removeItem(LS_STATE_KEY);
}

export function resetState() {
  clearState();
  // Reset to default values
  Object.assign(state, {
    cart: [],
    wishlist: [],
    orders: [],
    metrics: { impressions: 0, addToCart: 0, purchases: 0, revenue: 0, productViews: 0, favorites: 0 }
  });
}

/* ---------- actions ---------- */
export const actions = {
  addToCart(productId, qty = 1) {
    const product = productById(productId);
    if (!product) return;
    
    const existing = state.cart.find(item => item.productId === productId);
    if (existing) {
      existing.quantity += qty;
    } else {
      state.cart.push({ 
        productId: productId,
        quantity: qty,
        price: product.price,
        title: getProductTitle(product)
      });
    }
    
    state.metrics.addToCart++;
    saveState();
  },

  removeFromCart(productId) {
    const index = state.cart.findIndex(item => item.productId === productId);
    if (index > -1) {
      state.cart.splice(index, 1);
      saveState();
    }
  },

  setQty(productId, qty) {
    const item = state.cart.find(i => i.productId === productId);
    if (!item) return;
    item.quantity = Math.max(1, qty | 0);
    saveState();
  },

  toggleWishlist(productId) {
    const index = state.wishlist.indexOf(productId);
    if (index > -1) {
      state.wishlist.splice(index, 1);
    } else {
      state.wishlist.push(productId);
      state.metrics.favorites++;
    }
    saveState();
  },

  updateUser(updates) {
    Object.assign(state.user, updates);
    saveState();
  },

  setUserAuth(isAuthenticated) {
    state.user.authed = isAuthenticated;
    if (isAuthenticated) {
      // Set some demo user data for testing
      state.user.name = state.user.name || "Demo User";
      state.user.email = state.user.email || "demo@storez.com";
    }
    saveState();
  },

  updatePrefs(updates) {
    Object.assign(state.prefs, updates);
    saveState();
  },

  trackView(productId) {
    state.metrics.productViews++;
    state.user.stats.productViews++;
    saveState();
  },

  placeOrder(orderData) {
    const order = {
      id: `order_${Date.now()}`,
      items: [...state.cart],
      total: cartTotal(),
      status: "processing",
      timestamp: Date.now(),
      ...orderData
    };
    
    state.orders.push(order);
    state.cart = [];
    state.metrics.purchases++;
    state.metrics.revenue += order.total;
    
    saveState();
    return order;
  },

  placeOrderFromCart() {
    const items = state.cart.slice();
    if (!items.length) return null;
    const shipping = 15;
    const tax = Math.round(cartTotal() * 0.05);
    const total = cartTotal() + shipping + tax;
    const id = "o" + (state.orders.length + 1);
    const order = {
      id,
      ts: Date.now(),
      items,
      total,
      status: "Processing",
      review: false,
      timeline: ["Placed"]
    };
    state.orders.unshift(order);
    state.cart = [];
    state.metrics.purchases++;
    state.metrics.revenue += total;
    saveState();
    return order;
  },

  createSupportTicket(text) {
    const msg = { 
      id: "m" + (state.messages.length + 1), 
      with: "Support", 
      creatorId: null,
      unread: 1,
      thread: [{ from: "SupportBot", text, ts: Date.now() }] 
    };
    state.messages.push(msg);
    saveState();
    return msg;
  },

  // Search and discovery actions
  performSearch(query, filters = {}) {
    if (query.trim()) {
      // Add to search history
      state.search.recentSearches = [
        query,
        ...state.search.recentSearches.filter(q => q !== query)
      ].slice(0, 10);
    }

    state.search.query = query;
    state.search.filters = { ...state.search.filters, ...filters };
    
    // Filter products based on search criteria
    let results = state.products.filter(product => {
      const title = getProductTitle(product).toLowerCase();
      const category = loc(product, "cat").toLowerCase();
      const matchesQuery = !query || 
        title.includes(query.toLowerCase()) || 
        category.includes(query.toLowerCase());
      
      const matchesCategory = !filters.category?.length || 
        filters.category.includes(loc(product, "cat"));
      
      const matchesPrice = (!filters.priceRange || 
        (product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]));
      
      const matchesRating = !filters.rating || product.rating >= filters.rating;
      
      return matchesQuery && matchesCategory && matchesPrice && matchesRating;
    });

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price-low":
          results.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          results.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          results.sort((a, b) => b.rating - a.rating);
          break;
        case "newest":
          results.sort((a, b) => b.id.localeCompare(a.id));
          break;
        default: // relevance
          break;
      }
    }

    state.search.results = results;
    saveState();
    return results;
  },

  updateSearchFilters(filters) {
    state.search.filters = { ...state.search.filters, ...filters };
    // Re-run search with updated filters
    return this.performSearch(state.search.query, state.search.filters);
  },

  clearSearch() {
    state.search.query = "";
    state.search.results = [];
    state.search.filters = {
      category: [],
      priceRange: [0, 1000],
      rating: 0,
      availability: "all",
      sortBy: "relevance"
    };
    saveState();
  },

  getSearchSuggestions(query) {
    const suggestions = [];
    
    // Add popular searches that match
    state.search.popularSearches.forEach(search => {
      if (search.query.toLowerCase().includes(query.toLowerCase())) {
        suggestions.push({ type: "popular", text: search.query, count: search.count });
      }
    });
    
    // Add product name matches
    state.products.forEach(product => {
      const title = getProductTitle(product);
      if (title.toLowerCase().includes(query.toLowerCase())) {
        suggestions.push({ type: "product", text: title, productId: product.id });
      }
    });
    
    return suggestions.slice(0, 8);
  },

  // Review & Rating Actions
  submitReview(productId, reviewData) {
    const review = {
      id: `r${Date.now()}`,
      productId,
      userId: state.user.id,
      userName: state.user.name || "Anonymous User",
      userAvatar: state.user.avatar || uns("1494790108755-2616b612b9e3", 80),
      rating: reviewData.rating,
      title: reviewData.title,
      content: reviewData.content,
      images: reviewData.images || [],
      verified: state.user.authed && reviewData.verified,
      helpful: 0,
      notHelpful: 0,
      date: Date.now(),
      tags: reviewData.tags || []
    };

    // Add review to product reviews
    if (!state.reviews.byProduct[productId]) {
      state.reviews.byProduct[productId] = [];
    }
    state.reviews.byProduct[productId].unshift(review);

    // Update review statistics
    this.updateReviewStats(productId);
    saveState();
    return review;
  },

  updateReviewStats(productId) {
    const reviews = state.reviews.byProduct[productId] || [];
    if (reviews.length === 0) return;

    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const verifiedCount = reviews.filter(r => r.verified).length;
    const photoCount = reviews.filter(r => r.images && r.images.length > 0).length;
    const helpfulCount = reviews.reduce((sum, r) => sum + r.helpful, 0);

    reviews.forEach(review => {
      distribution[review.rating]++;
    });

    state.reviews.stats[productId] = {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      distribution,
      verifiedCount,
      photoCount,
      helpfulCount
    };

    // Update product rating
    const product = state.products.find(p => p.id === productId);
    if (product) {
      product.rating = averageRating;
    }
  },

  markReviewHelpful(reviewId, productId, helpful = true) {
    const reviews = state.reviews.byProduct[productId] || [];
    const review = reviews.find(r => r.id === reviewId);
    
    if (review) {
      if (helpful) {
        review.helpful++;
      } else {
        review.notHelpful++;
      }
      this.updateReviewStats(productId);
      saveState();
    }
  },

  filterReviews(productId, filters) {
    state.reviews.filters = { ...state.reviews.filters, ...filters };
    return this.getFilteredReviews(productId);
  },

  getFilteredReviews(productId) {
    let reviews = state.reviews.byProduct[productId] || [];
    const filters = state.reviews.filters;

    // Filter by rating
    if (filters.rating && filters.rating !== "all") {
      reviews = reviews.filter(r => r.rating === parseInt(filters.rating));
    }

    // Filter by verified status
    if (filters.verified) {
      reviews = reviews.filter(r => r.verified);
    }

    // Filter by photos
    if (filters.withPhotos) {
      reviews = reviews.filter(r => r.images && r.images.length > 0);
    }

    // Sort reviews
    switch (filters.sortBy) {
      case "newest":
        reviews.sort((a, b) => b.date - a.date);
        break;
      case "oldest":
        reviews.sort((a, b) => a.date - b.date);
        break;
      case "rating-high":
        reviews.sort((a, b) => b.rating - a.rating);
        break;
      case "rating-low":
        reviews.sort((a, b) => a.rating - b.rating);
        break;
      case "helpful":
      default:
        reviews.sort((a, b) => b.helpful - a.helpful);
        break;
    }

    return reviews;
  },

  getReviewStats(productId) {
    return state.reviews.stats[productId] || {
      averageRating: 0,
      totalReviews: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      verifiedCount: 0,
      photoCount: 0,
      helpfulCount: 0
    };
  }
};