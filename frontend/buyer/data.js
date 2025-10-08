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
    email: "maya@example.com",
    authed: true, 
    guest: false, 
    credits: 45, 
    referrals: 2,
    authMethod: "",
    interests: ["fashion", "wellness", "home"],
    preferences: { marketing: false, orders: true, live: false },
    followedCreators: ["c1", "c3"],
    likedProducts: ["p1", "p2", "p5"],
    stats: { productViews: 156, timeSpent: 3240, sessionsCount: 12 },
    // Social features
    bio: "Fashion enthusiast & wellness lover 🌟",
    isPublic: true,
    followers: [],
    following: ["c1", "c3", "u2", "u3"],
    posts: [],
    savedPosts: ["post1", "post3"],
    notifications: {
      likes: true,
      follows: true,
      comments: true,
      mentions: true,
      liveStreams: true
    },
    // Enhanced social commerce properties
    blockedUsers: [],
    recentlyViewedCreators: ["c2", "c4"],
    socialPreferences: {
      showActivity: true,
      allowMessages: true,
      publicWishlist: false,
      showPurchases: false
    }
  },

  // Social content & activity
  social: {
    posts: [
      {
        id: "post1",
        userId: "u2",
        username: "@sara_style",
        avatar: uns("1494790108755-2616b612b9e3", 100),
        content: "Just got these amazing CloudRunner sneakers! Perfect for my morning jogs 🏃‍♀️ The cushioning is incredible and they're so stylish! #fitness #style #running",
        productIds: ["p1"],
        images: [uns("1515879218367-8466d910aaa4", 400), uns("1571019613454-1cb2f99b2d8b", 400)],
        likes: 24,
        comments: 8,
        shares: 3,
        views: 450,
        timestamp: Date.now() - 7200000, // 2 hours ago
        likedBy: ["u1", "u3", "u4"],
        location: "Riyadh, Saudi Arabia",
        hashtags: ["#fitness", "#style", "#running", "#newshoes"],
        mentions: ["@linafit"],
        isSponsored: false,
        commentsPreview: [
          {
            id: "c1",
            userId: "u3", 
            username: "@ahmed_home",
            content: "They look amazing! How's the arch support?",
            timestamp: Date.now() - 6000000,
            likes: 2
          },
          {
            id: "c2",
            userId: "c1",
            username: "@linafit", 
            content: "Great choice! I love these for my workouts too! 💪",
            timestamp: Date.now() - 5400000,
            likes: 8,
            isCreator: true
          }
        ]
      },
      {
        id: "post2", 
        userId: "u3",
        username: "@ahmed_home",
        avatar: uns("1507003211169-0a1dd7bf0ec3", 100),
        content: "Transformed my living room with this gorgeous diffuser! The scent is incredible and it adds such a zen vibe to the space 🌸✨",
        productIds: ["p3"],
        images: [uns("1515378791036-0648a3ef77b2", 400)],
        likes: 18,
        comments: 5,
        shares: 2,
        views: 320,
        timestamp: Date.now() - 14400000, // 4 hours ago
        likedBy: ["u1", "u2"],
        location: "Jeddah, Saudi Arabia",
        hashtags: ["#homedecor", "#aromatherapy", "#zen"],
        mentions: ["@homeguru"],
        isSponsored: false,
        commentsPreview: [
          {
            id: "c3",
            userId: "c3",
            username: "@homeguru",
            content: "Love seeing how you styled it! That corner looks perfect 🏠",
            timestamp: Date.now() - 12000000,
            likes: 4,
            isCreator: true
          }
        ]
      },
      {
        id: "post3",
        userId: "c1",
        username: "@linafit",
        avatar: uns("1494790108755-2616b612b9e3", 100),
        content: "New active leggings collection dropping tomorrow! Who's excited? 💪 Early access for followers! Use code LINA20 for 20% off 🔥",
        productIds: ["p6"],
        images: [uns("1521572267360-ee0c2909d518", 400), uns("1571019613454-1cb2f99b2d8b", 400)],
        likes: 89,
        comments: 23,
        shares: 12,
        views: 1250,
        timestamp: Date.now() - 3600000, // 1 hour ago
        likedBy: ["u1", "u2", "u3", "u4"],
        location: "Riyadh, Saudi Arabia",
        hashtags: ["#newdrop", "#activewear", "#fitness", "#discount"],
        mentions: [],
        isCreator: true,
        isSponsored: true,
        live: false,
        promoCode: "LINA20",
        discount: 20,
        commentsPreview: [
          {
            id: "c4",
            userId: "u1",
            username: "@maya_user",
            content: "Can't wait! Your leggings are the best quality! 😍",
            timestamp: Date.now() - 3000000,
            likes: 12
          },
          {
            id: "c5", 
            userId: "u4",
            username: "@fitness_sara",
            content: "What sizes will be available?",
            timestamp: Date.now() - 2400000,
            likes: 3
          }
        ]
      },
      {
        id: "post4",
        userId: "c2",
        username: "@saudichef",
        avatar: uns("1507003211169-0a1dd7bf0ec3", 100),
        content: "Traditional kabsa spice blend is now available! 🍛 Made with authentic Saudi spices, just like my grandmother's recipe. Perfect for family dinners! 👨‍👩‍👧‍👦",
        productIds: ["p4"], // Using travel mug as placeholder for spice blend
        images: [uns("1556760524-dcb8b3bb3e45", 400)],
        likes: 67,
        comments: 18,
        shares: 8,
        views: 890,
        timestamp: Date.now() - 21600000, // 6 hours ago
        likedBy: ["u1", "u2", "u3"],
        location: "Jeddah, Saudi Arabia",
        hashtags: ["#kabsa", "#saudifood", "#spices", "#tradition"],
        mentions: [],
        isCreator: true,
        isSponsored: false,
        commentsPreview: [
          {
            id: "c6",
            userId: "u2",
            username: "@sara_style", 
            content: "My family loved this! Tastes just like my mom's kabsa ❤️",
            timestamp: Date.now() - 18000000,
            likes: 15
          }
        ]
      },
      {
        id: "post5",
        userId: "c4",
        username: "@techtalks_sa",
        avatar: uns("1507003211169-0a1dd7bf0ec3", 100),
        content: "Blue light glasses review! 👓 After 30 days of testing, here's my honest opinion. Perfect for long screen sessions. Link in bio for discount! 💻",
        productIds: ["p7"],
        images: [uns("1515879218367-8466d910aaa4", 400)],
        likes: 156,
        comments: 34,
        shares: 22,
        views: 2100,
        timestamp: Date.now() - 86400000, // 1 day ago
        likedBy: ["u1", "u2", "u3", "u4"],
        location: "Riyadh, Saudi Arabia",
        hashtags: ["#tech", "#review", "#bluelight", "#eyecare"],
        mentions: [],
        isCreator: true,
        isSponsored: true,
        promoCode: "TECH15",
        discount: 15,
        commentsPreview: [
          {
            id: "c7",
            userId: "u3",
            username: "@ahmed_home",
            content: "Been looking for good blue light glasses! Thanks for the review 🙏",
            timestamp: Date.now() - 82800000,
            likes: 8
          }
        ]
      }
    ],
    activities: [
      {
        id: "act1",
        type: "follow",
        userId: "u1",
        targetUserId: "c1",
        timestamp: Date.now() - 86400000
      },
      {
        id: "act2", 
        type: "like",
        userId: "u1",
        postId: "post1",
        timestamp: Date.now() - 7200000
      },
      {
        id: "act3",
        type: "save_product",
        userId: "u1", 
        productId: "p1",
        timestamp: Date.now() - 3600000
      }
    ],
    // Enhanced social commerce tracking
    reportedPosts: [],
    creatorViews: {},
    promoCodeUsage: {},
    engagementMetrics: {
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      totalFollows: 0
    },
    feedAlgorithm: {
      weightLikes: 0.3,
      weightComments: 0.4,
      weightShares: 0.2,
      weightRecency: 0.1
    }
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
      coverImage: uns("1571019613454-1cb2f99b2d8b", 800),
      followers: 128000, 
      following: 245,
      verified: true,
      bio: "Wellness & athleisure enthusiast 💪 Helping you live your best active life",
      location: "Riyadh, Saudi Arabia",
      joinedDate: "2023-01-15",
      live: true,
      totalSales: 156750,
      avgRating: 4.8,
      productsCount: 23,
      postsCount: 89,
      engagement: 8.4, // percentage
      categories: ["fitness", "fashion", "wellness"],
      earnings: {
        thisMonth: 12500,
        lastMonth: 11200,
        total: 156750
      },
      socialLinks: {
        instagram: "linafit_official",
        tiktok: "linafit",
        youtube: "LinaFitness"
      },
      badges: ["verified", "top_seller", "sustainability_champion"]
    },
    { 
      id: "c2", 
      name: "@saudichef", 
      handle: "@saudichef",
      avatar: uns("1507003211169-0a1dd7bf0ec3", 150), 
      coverImage: uns("1556760524-dcb8b3bb3e45", 800),
      followers: 98000, 
      following: 156,
      verified: false,
      bio: "Traditional Saudi cuisine with modern twists 🍽️ Sharing family recipes passed down through generations",
      location: "Jeddah, Saudi Arabia",
      joinedDate: "2023-03-22",
      live: false,
      totalSales: 89340,
      avgRating: 4.6,
      productsCount: 31,
      postsCount: 134,
      engagement: 6.2,
      categories: ["food", "cooking", "culture"],
      earnings: {
        thisMonth: 8900,
        lastMonth: 9500,
        total: 89340
      },
      socialLinks: {
        instagram: "saudichef_authentic",
        youtube: "SaudiChefChannel"
      },
      badges: ["rising_star", "cultural_ambassador"]
    },
    { 
      id: "c3", 
      name: "@homeguru", 
      handle: "@homeguru",
      avatar: uns("1472099645785-5658abf4ff4e", 150), 
      coverImage: uns("1560449752-7b3e516ceee6", 800),
      followers: 54000, 
      following: 89,
      verified: true,
      bio: "Clean home & sustainable lifestyle 🌱 Making eco-friendly living accessible for everyone",
      location: "Dammam, Saudi Arabia",
      joinedDate: "2022-11-08",
      live: false,
      totalSales: 67800,
      avgRating: 4.9,
      productsCount: 18,
      postsCount: 67,
      engagement: 12.1,
      categories: ["home", "sustainability", "lifestyle"],
      earnings: {
        thisMonth: 7200,
        lastMonth: 6800,
        total: 67800
      },
      socialLinks: {
        instagram: "homeguru_sa",
        tiktok: "homeguruSA"
      },
      badges: ["verified", "eco_champion", "quality_curator"]
    },
    {
      id: "c4",
      name: "@techtalks_sa",
      handle: "@techtalks_sa", 
      avatar: uns("1507003211169-0a1dd7bf0ec3", 150),
      coverImage: uns("1518199266325-65595ac2dfa7", 800),
      followers: 87000,
      following: 312,
      verified: true,
      bio: "Latest tech reviews & gadgets 📱 Your guide to the digital world in Arabic",
      location: "Riyadh, Saudi Arabia", 
      joinedDate: "2023-02-14",
      live: false,
      totalSales: 134500,
      avgRating: 4.7,
      productsCount: 42,
      postsCount: 156,
      engagement: 7.8,
      categories: ["tech", "gadgets", "electronics"],
      earnings: {
        thisMonth: 15200,
        lastMonth: 13800,
        total: 134500
      },
      socialLinks: {
        youtube: "TechTalksSA",
        twitter: "techtalkssa"
      },
      badges: ["verified", "tech_expert", "early_adopter"]
    }
  ],

  cart: [],

  // Enhanced Cart Features
  cartEnhancements: {
    savedPaymentMethods: [
      {
        id: "pm1",
        type: "card",
        name: "Visa ****1234",
        isDefault: true,
        cardType: "visa",
        lastFour: "1234",
        expiry: "12/26",
        holderName: "Maya Ahmad",
        bank: "Al Rajhi Bank",
        isLocal: true
      },
      {
        id: "pm2", 
        type: "digital",
        name: "Apple Pay",
        isDefault: false,
        provider: "apple",
        icon: "🍎",
        fee: "0%",
        setupRequired: false
      },
      {
        id: "pm3",
        type: "bnpl",
        name: "Tamara - Pay in 3",
        isDefault: false,
        provider: "tamara",
        installments: 3,
        icon: "💳",
        fee: "0%",
        eligibleAmount: { min: 100, max: 10000 }
      },
      // Enhanced Saudi-specific payment methods
      {
        id: "pm4",
        type: "digital",
        name: "mada Pay",
        isDefault: false,
        provider: "mada",
        icon: "🇸🇦",
        fee: "0%",
        description: "Saudi national payment scheme",
        setupRequired: false,
        isLocal: true,
        priority: 1
      },
      {
        id: "pm5",
        type: "digital", 
        name: "STC Pay",
        isDefault: false,
        provider: "stc",
        icon: "📱",
        fee: "0%",
        description: "Digital wallet by STC",
        setupRequired: true,
        phoneRequired: true,
        isLocal: true,
        priority: 2
      },
      {
        id: "pm6",
        type: "digital",
        name: "SADAD",
        isDefault: false,
        provider: "sadad",
        icon: "🏦",
        fee: "2 SAR",
        description: "Saudi Electronic Bill Presentment & Payment",
        setupRequired: false,
        isLocal: true,
        priority: 3
      },
      {
        id: "pm7",
        type: "bnpl",
        name: "Tabby - Pay in 4",
        isDefault: false,
        provider: "tabby",
        installments: 4,
        icon: "⚡",
        fee: "0%",
        description: "Split your purchase into 4 payments",
        eligibleAmount: { min: 200, max: 15000 },
        processingTime: "instant"
      },
      {
        id: "pm8",
        type: "card",
        name: "Mastercard ****5678", 
        isDefault: false,
        cardType: "mastercard",
        lastFour: "5678",
        expiry: "08/27",
        holderName: "Maya Ahmad",
        bank: "SAMBA Financial Group",
        isLocal: true
      },
      {
        id: "pm9",
        type: "bank",
        name: "Bank Transfer",
        isDefault: false,
        provider: "wire",
        icon: "🏛️",
        fee: "5 SAR",
        description: "Direct bank transfer",
        processingTime: "1-2 business days",
        isLocal: true
      }
    ],
    // Payment security and verification
    paymentSecurity: {
      twoFactorEnabled: true,
      biometricEnabled: false,
      pinRequired: true,
      fraudProtection: true,
      encryptionLevel: "256-bit SSL",
      complianceStandards: ["PCI DSS", "PDPL", "SAMA"]
    },
    // Payment preferences and limits
    paymentPreferences: {
      preferredCurrency: "SAR",
      secondaryCurrency: "USD", 
      autoSaveCards: true,
      requireCVV: true,
      allowInternationalCards: true,
      enableQuickPay: true,
      defaultPaymentType: "digital" // digital, card, bnpl
    },
    // Transaction limits and fees
    paymentLimits: {
      dailyLimit: 50000, // SAR
      monthlyLimit: 200000, // SAR
      singleTransactionLimit: 25000, // SAR
      bnplMaxAmount: 15000, // SAR
      internationalFee: 2.5, // percentage
      currencyConversionFee: 1.5 // percentage
    },
    shippingOptions: [
      {
        id: "standard",
        name: { en: "Standard Delivery", ar: "التوصيل العادي" },
        description: { en: "3-5 business days", ar: "٣-٥ أيام عمل" },
        price: 0,
        freeThreshold: 200, // Free shipping over SAR 200
        estimatedDays: [3, 5],
        isDefault: true
      },
      {
        id: "express",
        name: { en: "Express Delivery", ar: "التوصيل السريع" },
        description: { en: "1-2 business days", ar: "١-٢ أيام عمل" },
        price: 25,
        freeThreshold: null,
        estimatedDays: [1, 2],
        isDefault: false
      },
      {
        id: "sameday",
        name: { en: "Same Day Delivery", ar: "التوصيل في نفس اليوم" },
        description: { en: "Within 6 hours", ar: "خلال ٦ ساعات" },
        price: 50,
        freeThreshold: null,
        estimatedDays: [0, 0],
        isDefault: false,
        availableUntil: "15:00", // Cutoff time
        cities: ["riyadh", "jeddah", "dammam"]
      }
    ],
    promoCodes: [
      {
        code: "WELCOME10",
        type: "percentage", 
        value: 10,
        minOrder: 100,
        maxDiscount: 50,
        description: { en: "10% off your first order", ar: "خصم ١٠٪ على طلبك الأول" },
        validUntil: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
        isActive: true,
        usageLimit: 1,
        usedCount: 0
      },
      {
        code: "SAVE20",
        type: "fixed",
        value: 20,
        minOrder: 150,
        maxDiscount: null,
        description: { en: "SAR 20 off orders over SAR 150", ar: "خصم ٢٠ ريال على الطلبات أكثر من ١٥٠ ريال" },
        validUntil: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        isActive: true,
        usageLimit: null,
        usedCount: 0
      }
    ],
    appliedPromoCode: null,
    selectedShipping: "standard",
    selectedPayment: "pm1",
    cartSummary: {
      subtotal: 0,
      shipping: 0,
      discount: 0,
      tax: 0,
      total: 0
    }
  },
  
  // Enhanced Wishlist & Save for Later
  wishlist: {
    items: [], // Array of product IDs
    collections: [ // Organized wishlist collections
      {
        id: "default",
        name: { en: "My Wishlist", ar: "قائمة أمنياتي" },
        items: ["p1", "p3"], // Default items for demo
        isDefault: true,
        private: false,
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now() - 3600000
      },
      {
        id: "spring",
        name: { en: "Spring Collection", ar: "مجموعة الربيع" },
        items: ["p2", "p6"],
        isDefault: false,
        private: false,
        createdAt: Date.now() - 604800000,
        updatedAt: Date.now() - 7200000
      }
    ],
    sharedLists: [], // Lists shared with user
    recentlyViewed: ["p1", "p3", "p2", "p7"], // Recently viewed products
    saveForLater: ["p4", "p8"], // Items moved from cart
    settings: {
      emailNotifications: true,
      priceDropAlerts: true,
      stockAlerts: true,
      sharePermissions: "friends", // public, friends, private
      defaultPrivacy: false
    },
    stats: {
      totalSaved: 8,
      totalShared: 2,
      averageItemsPerList: 2.5,
      mostSavedCategory: "apparel"
    }
  },
  
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
    this.updateCartSummary();
    saveState();
  },

  // Enhanced Cart Actions
  updateQuantity(productId, change) {
    const item = state.cart.find(i => i.productId === productId);
    if (!item) return;
    const newQty = Math.max(1, item.quantity + change);
    item.quantity = newQty;
    this.updateCartSummary();
    saveState();
  },

  moveToWishlist(productId) {
    const item = state.cart.find(i => i.productId === productId);
    if (item) {
      this.removeFromCart(productId);
      this.addToWishlist(productId);
    }
    saveState();
  },

  saveForLater(productId) {
    const item = state.cart.find(i => i.productId === productId);
    if (item) {
      this.removeFromCart(productId);
      if (!state.wishlist.saveForLater.includes(productId)) {
        state.wishlist.saveForLater.push(productId);
      }
    }
    saveState();
  },

  moveBackToCart(productId) {
    const index = state.wishlist.saveForLater.indexOf(productId);
    if (index > -1) {
      state.wishlist.saveForLater.splice(index, 1);
      this.addToCart(productId, 1);
    }
    saveState();
  },

  applyPromoCode(code) {
    const promo = state.cartEnhancements.promoCodes.find(p => 
      p.code.toUpperCase() === code.toUpperCase() && 
      p.isActive && 
      p.validUntil > Date.now()
    );
    
    if (!promo) {
      return { success: false, message: "Invalid or expired promo code" };
    }

    const subtotal = this.getCartSubtotal();
    if (promo.minOrder && subtotal < promo.minOrder) {
      return { 
        success: false, 
        message: `Minimum order of ${fmtSAR(promo.minOrder)} required` 
      };
    }

    if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
      return { success: false, message: "Promo code usage limit exceeded" };
    }

    state.cartEnhancements.appliedPromoCode = promo.code;
    this.updateCartSummary();
    saveState();
    
    return { 
      success: true, 
      message: `Promo code applied! You saved ${this.calculateDiscount()}`,
      discount: this.calculateDiscount()
    };
  },

  removePromoCode() {
    state.cartEnhancements.appliedPromoCode = null;
    this.updateCartSummary();
    saveState();
  },

  selectShippingOption(optionId) {
    const option = state.cartEnhancements.shippingOptions.find(o => o.id === optionId);
    if (option) {
      state.cartEnhancements.selectedShipping = optionId;
      this.updateCartSummary();
      saveState();
    }
  },

  selectPaymentMethod(methodId) {
    const method = state.cartEnhancements.savedPaymentMethods.find(m => m.id === methodId);
    if (method) {
      state.cartEnhancements.selectedPayment = methodId;
      saveState();
    }
  },

  // Enhanced Payment Interface Actions
  addPaymentMethod(paymentData) {
    const newMethod = {
      id: `pm_${Date.now()}`,
      type: paymentData.type,
      name: paymentData.name,
      isDefault: false,
      addedDate: Date.now(),
      ...paymentData
    };

    state.cartEnhancements.savedPaymentMethods.push(newMethod);
    
    // Set as default if it's the first method
    if (state.cartEnhancements.savedPaymentMethods.length === 1) {
      newMethod.isDefault = true;
      state.cartEnhancements.selectedPayment = newMethod.id;
    }
    
    saveState();
    return { success: true, methodId: newMethod.id };
  },

  removePaymentMethod(methodId) {
    const index = state.cartEnhancements.savedPaymentMethods.findIndex(m => m.id === methodId);
    if (index > -1) {
      const method = state.cartEnhancements.savedPaymentMethods[index];
      state.cartEnhancements.savedPaymentMethods.splice(index, 1);
      
      // If removing default method, set another as default
      if (method.isDefault && state.cartEnhancements.savedPaymentMethods.length > 0) {
        state.cartEnhancements.savedPaymentMethods[0].isDefault = true;
        state.cartEnhancements.selectedPayment = state.cartEnhancements.savedPaymentMethods[0].id;
      }
      
      saveState();
      return { success: true };
    }
    return { success: false, message: "Payment method not found" };
  },

  setDefaultPaymentMethod(methodId) {
    // Remove default from all methods
    state.cartEnhancements.savedPaymentMethods.forEach(m => m.isDefault = false);
    
    // Set new default
    const method = state.cartEnhancements.savedPaymentMethods.find(m => m.id === methodId);
    if (method) {
      method.isDefault = true;
      state.cartEnhancements.selectedPayment = methodId;
      saveState();
      return { success: true };
    }
    return { success: false, message: "Payment method not found" };
  },

  validatePaymentEligibility(methodId, amount) {
    const method = state.cartEnhancements.savedPaymentMethods.find(m => m.id === methodId);
    if (!method) return { eligible: false, reason: "Payment method not found" };

    const limits = state.cartEnhancements.paymentLimits;
    
    // Check amount limits
    if (amount > limits.singleTransactionLimit) {
      return { 
        eligible: false, 
        reason: `Amount exceeds single transaction limit of ${fmtSAR(limits.singleTransactionLimit)}` 
      };
    }

    // Check BNPL specific limits
    if (method.type === "bnpl" && method.eligibleAmount) {
      if (amount < method.eligibleAmount.min || amount > method.eligibleAmount.max) {
        return { 
          eligible: false, 
          reason: `${method.name} is available for amounts between ${fmtSAR(method.eligibleAmount.min)} - ${fmtSAR(method.eligibleAmount.max)}` 
        };
      }
    }

    return { eligible: true, method: method };
  },

  calculatePaymentFees(methodId, amount) {
    const method = state.cartEnhancements.savedPaymentMethods.find(m => m.id === methodId);
    if (!method) return { fee: 0, total: amount };

    let fee = 0;
    
    // Calculate fees based on payment method
    if (method.fee && method.fee !== "0%") {
      if (method.fee.includes("%")) {
        const percentage = parseFloat(method.fee.replace("%", ""));
        fee = (amount * percentage) / 100;
      } else if (method.fee.includes("SAR")) {
        fee = parseFloat(method.fee.replace(/[^\d.]/g, ""));
      }
    }

    // Add international card fees if applicable
    if (method.type === "card" && !method.isLocal) {
      const intlFee = (amount * state.cartEnhancements.paymentLimits.internationalFee) / 100;
      fee += intlFee;
    }

    return { 
      fee: Math.round(fee * 100) / 100, 
      total: amount + fee,
      breakdown: {
        subtotal: amount,
        paymentFee: fee,
        total: amount + fee
      }
    };
  },

  processPayment(methodId, amount, billingAddress) {
    const eligibility = this.validatePaymentEligibility(methodId, amount);
    if (!eligibility.eligible) {
      return { success: false, error: eligibility.reason };
    }

    const method = eligibility.method;
    const fees = this.calculatePaymentFees(methodId, amount);
    
    // Simulate payment processing
    const processingTime = method.processingTime || "instant";
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Add transaction record
    if (!state.cartEnhancements.paymentHistory) {
      state.cartEnhancements.paymentHistory = [];
    }

    const transaction = {
      id: transactionId,
      methodId: methodId,
      methodName: method.name,
      amount: amount,
      fees: fees.fee,
      total: fees.total,
      status: "completed",
      timestamp: Date.now(),
      processingTime: processingTime,
      billingAddress: billingAddress,
      cartItems: [...state.cart] // Snapshot of cart
    };

    state.cartEnhancements.paymentHistory.unshift(transaction);
    
    // Clear cart after successful payment
    state.cart = [];
    state.cartEnhancements.appliedPromoCode = null;
    
    saveState();
    
    return { 
      success: true, 
      transactionId: transactionId,
      processingTime: processingTime,
      total: fees.total,
      receipt: transaction
    };
  },

  getBNPLSchedule(methodId, amount) {
    const method = state.cartEnhancements.savedPaymentMethods.find(m => m.id === methodId);
    if (!method || method.type !== "bnpl") return null;

    const installmentAmount = amount / method.installments;
    const schedule = [];
    
    for (let i = 0; i < method.installments; i++) {
      schedule.push({
        installment: i + 1,
        amount: Math.round(installmentAmount * 100) / 100,
        dueDate: new Date(Date.now() + (i * 30 * 24 * 60 * 60 * 1000)), // Monthly
        status: i === 0 ? "due_now" : "pending"
      });
    }
    
    return {
      provider: method.provider,
      totalAmount: amount,
      installmentAmount: Math.round(installmentAmount * 100) / 100,
      installments: method.installments,
      schedule: schedule,
      fees: 0 // Most BNPL are fee-free
    };
  },

  getPaymentMethodsByType(type) {
    return state.cartEnhancements.savedPaymentMethods
      .filter(method => method.type === type)
      .sort((a, b) => {
        // Sort by priority, then by default status
        if (a.priority && b.priority) return a.priority - b.priority;
        if (a.isDefault) return -1;
        if (b.isDefault) return 1;
        return 0;
      });
  },

  getSaudiPaymentMethods() {
    return state.cartEnhancements.savedPaymentMethods
      .filter(method => method.isLocal)
      .sort((a, b) => (a.priority || 999) - (b.priority || 999));
  },

  enableTwoFactorAuth() {
    state.cartEnhancements.paymentSecurity.twoFactorEnabled = true;
    saveState();
    return { success: true, message: "Two-factor authentication enabled" };
  },

  enableBiometricAuth() {
    // Simulate biometric capability check
    const biometricSupported = 'TouchID' in window || 'FaceID' in window || navigator.credentials;
    
    if (biometricSupported) {
      state.cartEnhancements.paymentSecurity.biometricEnabled = true;
      saveState();
      return { success: true, message: "Biometric authentication enabled" };
    }
    
    return { success: false, message: "Biometric authentication not supported on this device" };
  },

  getCartSubtotal() {
    return state.cart.reduce((total, item) => {
      const product = productById(item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  },

  calculateDiscount() {
    const appliedCode = state.cartEnhancements.appliedPromoCode;
    if (!appliedCode) return 0;

    const promo = state.cartEnhancements.promoCodes.find(p => p.code === appliedCode);
    if (!promo) return 0;

    const subtotal = this.getCartSubtotal();
    let discount = 0;

    if (promo.type === "percentage") {
      discount = (subtotal * promo.value) / 100;
      if (promo.maxDiscount) {
        discount = Math.min(discount, promo.maxDiscount);
      }
    } else if (promo.type === "fixed") {
      discount = promo.value;
    }

    return Math.min(discount, subtotal);
  },

  calculateShipping() {
    const selectedOption = state.cartEnhancements.shippingOptions.find(
      o => o.id === state.cartEnhancements.selectedShipping
    );
    
    if (!selectedOption) return 0;

    const subtotal = this.getCartSubtotal();
    
    // Check if free shipping threshold is met
    if (selectedOption.freeThreshold && subtotal >= selectedOption.freeThreshold) {
      return 0;
    }

    return selectedOption.price;
  },

  calculateTax() {
    const subtotal = this.getCartSubtotal();
    const discount = this.calculateDiscount();
    const taxableAmount = subtotal - discount;
    return Math.max(0, taxableAmount * 0.15); // 15% VAT in Saudi Arabia
  },

  updateCartSummary() {
    const subtotal = this.getCartSubtotal();
    const discount = this.calculateDiscount();
    const shipping = this.calculateShipping();
    const tax = this.calculateTax();
    const total = subtotal - discount + shipping + tax;

    state.cartEnhancements.cartSummary = {
      subtotal,
      discount,
      shipping,
      tax,
      total
    };
  },

  toggleWishlist(productId) {
    const index = state.wishlist.items.indexOf(productId);
    if (index > -1) {
      state.wishlist.items.splice(index, 1);
    } else {
      state.wishlist.items.push(productId);
      state.metrics.favorites++;
    }
    saveState();
  },

  // Enhanced Wishlist & Save for Later Actions
  addToWishlist(productId, collectionId = "default") {
    // Add to legacy wishlist array for compatibility
    if (!state.wishlist.items.includes(productId)) {
      state.wishlist.items.push(productId);
    }
    
    // Add to wishlist collection
    const collection = state.wishlist.collections.find(c => c.id === collectionId);
    if (collection && !collection.items.includes(productId)) {
      collection.items.push(productId);
      collection.updatedAt = Date.now();
      state.metrics.favorites++;
    }
    
    // Track recently viewed
    this.trackRecentView(productId);
    saveState();
  },

  removeFromWishlist(productId, collectionId = null) {
    // Remove from legacy wishlist array
    const index = state.wishlist.items.indexOf(productId);
    if (index > -1) {
      state.wishlist.items.splice(index, 1);
    }
    
    if (collectionId) {
      // Remove from specific collection
      const collection = state.wishlist.collections.find(c => c.id === collectionId);
      if (collection) {
        const itemIndex = collection.items.indexOf(productId);
        if (itemIndex > -1) {
          collection.items.splice(itemIndex, 1);
          collection.updatedAt = Date.now();
        }
      }
    } else {
      // Remove from all collections
      state.wishlist.collections.forEach(collection => {
        const itemIndex = collection.items.indexOf(productId);
        if (itemIndex > -1) {
          collection.items.splice(itemIndex, 1);
          collection.updatedAt = Date.now();
        }
      });
    }
    
    saveState();
  },

  createWishlistCollection(name, isPrivate = false) {
    const collection = {
      id: `wl_${Date.now()}`,
      name: typeof name === 'string' ? { en: name, ar: name } : name,
      items: [],
      isDefault: false,
      private: isPrivate,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    state.wishlist.collections.push(collection);
    saveState();
    return collection;
  },

  deleteWishlistCollection(collectionId) {
    if (collectionId === "default") return false; // Can't delete default
    
    const index = state.wishlist.collections.findIndex(c => c.id === collectionId);
    if (index > -1) {
      state.wishlist.collections.splice(index, 1);
      saveState();
      return true;
    }
    return false;
  },

  renameWishlistCollection(collectionId, newName) {
    const collection = state.wishlist.collections.find(c => c.id === collectionId);
    if (collection) {
      collection.name = typeof newName === 'string' ? { en: newName, ar: newName } : newName;
      collection.updatedAt = Date.now();
      saveState();
      return true;
    }
    return false;
  },

  moveToWishlistCollection(productId, fromCollectionId, toCollectionId) {
    this.removeFromWishlist(productId, fromCollectionId);
    this.addToWishlist(productId, toCollectionId);
  },

  addMultipleToWishlist(productIds, collectionId = "default") {
    productIds.forEach(productId => {
      this.addToWishlist(productId, collectionId);
    });
  },

  saveForLater(productId) {
    // Remove from cart if present
    this.removeFromCart(productId);
    
    // Add to save for later
    if (!state.wishlist.saveForLater.includes(productId)) {
      state.wishlist.saveForLater.push(productId);
      this.trackRecentView(productId);
      saveState();
    }
  },

  moveFromSaveForLater(productId, toCart = false) {
    const index = state.wishlist.saveForLater.indexOf(productId);
    if (index > -1) {
      state.wishlist.saveForLater.splice(index, 1);
      
      if (toCart) {
        this.addToCart(productId);
      } else {
        this.addToWishlist(productId);
      }
      saveState();
    }
  },

  trackRecentView(productId) {
    const recent = state.wishlist.recentlyViewed;
    const index = recent.indexOf(productId);
    
    if (index > -1) {
      recent.splice(index, 1);
    }
    
    recent.unshift(productId);
    
    // Keep only last 20 items
    if (recent.length > 20) {
      recent.splice(20);
    }
    
    saveState();
  },

  toggleWishlistPrivacy(collectionId) {
    const collection = state.wishlist.collections.find(c => c.id === collectionId);
    if (collection) {
      collection.private = !collection.private;
      collection.updatedAt = Date.now();
      saveState();
      return collection.private;
    }
    return false;
  },

  getWishlistCollection(collectionId) {
    return state.wishlist.collections.find(c => c.id === collectionId);
  },

  getWishlistCollections() {
    return state.wishlist.collections;
  },

  getWishlistItems(collectionId = null) {
    if (collectionId) {
      const collection = state.wishlist.collections.find(c => c.id === collectionId);
      return collection ? collection.items.map(id => productById(id)).filter(Boolean) : [];
    }
    
    // Return all unique items across collections
    const allItems = new Set();
    state.wishlist.collections.forEach(collection => {
      collection.items.forEach(item => allItems.add(item));
    });
    
    return Array.from(allItems).map(id => productById(id)).filter(Boolean);
  },

  isInWishlist(productId, collectionId = null) {
    if (collectionId) {
      const collection = state.wishlist.collections.find(c => c.id === collectionId);
      return collection ? collection.items.includes(productId) : false;
    }
    
    // Check if in any collection
    return state.wishlist.collections.some(collection => 
      collection.items.includes(productId)
    );
  },

  getWishlistStats() {
    const totalItems = new Set();
    state.wishlist.collections.forEach(collection => {
      collection.items.forEach(item => totalItems.add(item));
    });
    
    return {
      totalCollections: state.wishlist.collections.length,
      totalItems: totalItems.size,
      totalSaveForLater: state.wishlist.saveForLater.length,
      recentlyViewedCount: state.wishlist.recentlyViewed.length
    };
  },

  shareWishlistCollection(collectionId, shareType = "link") {
    const collection = state.wishlist.collections.find(c => c.id === collectionId);
    if (!collection || collection.private) return null;
    
    const shareData = {
      type: shareType,
      collectionId: collectionId,
      collectionName: collection.name,
      itemCount: collection.items.length,
      shareUrl: `https://storez.com/wishlist/${collectionId}`,
      timestamp: Date.now()
    };
    
    // Track sharing stats
    state.wishlist.stats.totalShared++;
    saveState();
    
    return shareData;
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
  },

  // Social Features Actions
  followUser(userId) {
    if (!state.user.following.includes(userId)) {
      state.user.following.push(userId);
      
      // Add activity
      state.social.activities.unshift({
        id: `act_${Date.now()}`,
        type: "follow",
        userId: state.user.id,
        targetUserId: userId,
        timestamp: Date.now()
      });
    }
    saveState();
  },

  unfollowUser(userId) {
    const index = state.user.following.indexOf(userId);
    if (index > -1) {
      state.user.following.splice(index, 1);
    }
    saveState();
  },

  likePost(postId) {
    const post = state.social.posts.find(p => p.id === postId);
    if (post && !post.likedBy.includes(state.user.id)) {
      post.likedBy.push(state.user.id);
      post.likes++;
      
      // Add activity
      state.social.activities.unshift({
        id: `act_${Date.now()}`,
        type: "like",
        userId: state.user.id,
        postId: postId,
        timestamp: Date.now()
      });
    }
    saveState();
  },

  unlikePost(postId) {
    const post = state.social.posts.find(p => p.id === postId);
    if (post) {
      const index = post.likedBy.indexOf(state.user.id);
      if (index > -1) {
        post.likedBy.splice(index, 1);
        post.likes--;
      }
    }
    saveState();
  },

  shareProduct(productId, message = "") {
    const activity = {
      id: `act_${Date.now()}`,
      type: "share_product",
      userId: state.user.id,
      productId: productId,
      message: message,
      timestamp: Date.now()
    };
    state.social.activities.unshift(activity);
    saveState();
    return activity;
  },

  createPost(content, productIds = [], images = []) {
    const post = {
      id: `post_${Date.now()}`,
      userId: state.user.id,
      username: `@${state.user.name.toLowerCase()}`,
      avatar: uns("1494790108755-2616b612b9e3", 100),
      content: content,
      productIds: productIds,
      images: images,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: Date.now(),
      likedBy: [],
      isCreator: false
    };
    
    state.social.posts.unshift(post);
    saveState();
    return post;
  },

  savePost(postId) {
    if (!state.user.savedPosts.includes(postId)) {
      state.user.savedPosts.push(postId);
    }
    saveState();
  },

  unsavePost(postId) {
    const index = state.user.savedPosts.indexOf(postId);
    if (index > -1) {
      state.user.savedPosts.splice(index, 1);
    }
    saveState();
  },

  // Enhanced Social Commerce Actions
  addComment(postId, content) {
    const post = state.social.posts.find(p => p.id === postId);
    if (post) {
      const comment = {
        id: `c_${Date.now()}`,
        userId: state.user.id,
        username: `@${state.user.name.toLowerCase()}`,
        content: content,
        timestamp: Date.now(),
        likes: 0,
        likedBy: []
      };
      
      if (!post.commentsPreview) {
        post.commentsPreview = [];
      }
      post.commentsPreview.unshift(comment);
      post.comments++;
      
      // Add activity
      state.social.activities.unshift({
        id: `act_${Date.now()}`,
        type: "comment",
        userId: state.user.id,
        postId: postId,
        content: content.substring(0, 50),
        timestamp: Date.now()
      });
    }
    saveState();
  },

  likeComment(postId, commentId) {
    const post = state.social.posts.find(p => p.id === postId);
    if (post && post.commentsPreview) {
      const comment = post.commentsPreview.find(c => c.id === commentId);
      if (comment && !comment.likedBy.includes(state.user.id)) {
        comment.likedBy.push(state.user.id);
        comment.likes++;
      }
    }
    saveState();
  },

  reportPost(postId, reason) {
    // Add to reported posts tracking
    if (!state.social.reportedPosts) {
      state.social.reportedPosts = [];
    }
    
    state.social.reportedPosts.push({
      postId: postId,
      userId: state.user.id,
      reason: reason,
      timestamp: Date.now()
    });
    
    saveState();
    return { success: true, message: "Post reported successfully" };
  },

  blockUser(userId) {
    if (!state.user.blockedUsers) {
      state.user.blockedUsers = [];
    }
    
    if (!state.user.blockedUsers.includes(userId)) {
      state.user.blockedUsers.push(userId);
      
      // Remove from following if following
      const followingIndex = state.user.following.indexOf(userId);
      if (followingIndex > -1) {
        state.user.following.splice(followingIndex, 1);
      }
    }
    saveState();
  },

  viewCreatorProfile(creatorId) {
    // Track creator profile views
    if (!state.social.creatorViews) {
      state.social.creatorViews = {};
    }
    
    if (!state.social.creatorViews[creatorId]) {
      state.social.creatorViews[creatorId] = 0;
    }
    state.social.creatorViews[creatorId]++;
    
    // Add to recently viewed creators
    if (!state.user.recentlyViewedCreators) {
      state.user.recentlyViewedCreators = [];
    }
    
    const index = state.user.recentlyViewedCreators.indexOf(creatorId);
    if (index > -1) {
      state.user.recentlyViewedCreators.splice(index, 1);
    }
    state.user.recentlyViewedCreators.unshift(creatorId);
    
    // Keep only last 10
    if (state.user.recentlyViewedCreators.length > 10) {
      state.user.recentlyViewedCreators = state.user.recentlyViewedCreators.slice(0, 10);
    }
    
    saveState();
  },

  usePromoCode(postId) {
    const post = state.social.posts.find(p => p.id === postId);
    if (post && post.promoCode) {
      // Apply the promo code to cart enhancements
      const result = this.applyPromoCode(post.promoCode);
      
      // Track promo code usage from social posts
      if (!state.social.promoCodeUsage) {
        state.social.promoCodeUsage = {};
      }
      
      if (result.success) {
        state.social.promoCodeUsage[post.promoCode] = (state.social.promoCodeUsage[post.promoCode] || 0) + 1;
        
        // Add activity
        state.social.activities.unshift({
          id: `act_${Date.now()}`,
          type: "promo_used",
          userId: state.user.id,
          postId: postId,
          promoCode: post.promoCode,
          timestamp: Date.now()
        });
      }
      
      saveState();
      return result;
    }
    
    return { success: false, message: "Promo code not found" };
  },

  getCreatorInsights(creatorId) {
    const creator = creatorById(creatorId);
    if (!creator) return null;
    
    const creatorPosts = state.social.posts.filter(p => p.userId === creatorId);
    const totalLikes = creatorPosts.reduce((sum, post) => sum + post.likes, 0);
    const totalComments = creatorPosts.reduce((sum, post) => sum + post.comments, 0);
    const totalShares = creatorPosts.reduce((sum, post) => sum + post.shares, 0);
    const totalViews = creatorPosts.reduce((sum, post) => sum + (post.views || 0), 0);
    
    return {
      id: creatorId,
      name: creator.name,
      followers: creator.followers,
      engagement: creator.engagement,
      postsCount: creatorPosts.length,
      totalLikes,
      totalComments,
      totalShares,
      totalViews,
      avgLikesPerPost: creatorPosts.length > 0 ? Math.round(totalLikes / creatorPosts.length) : 0,
      recentPosts: creatorPosts.slice(0, 3),
      trending: creatorPosts.some(p => p.likes > 50),
      categories: creator.categories || [],
      badges: creator.badges || []
    };
  },

  getSuggestedCreators() {
    // Simple suggestion algorithm based on user interests and current follows
    const allCreators = state.creators.filter(c => !state.user.following.includes(c.id));
    
    // Sort by engagement and follower count
    return allCreators
      .sort((a, b) => (b.engagement * b.followers) - (a.engagement * a.followers))
      .slice(0, 5)
      .map(creator => ({
        ...creator,
        reason: this.getSuggestionReason(creator)
      }));
  },

  getSuggestionReason(creator) {
    const reasons = [
      "Popular in your area",
      "Similar interests", 
      "Trending creator",
      "High engagement",
      "New creator"
    ];
    
    if (creator.location && creator.location.includes("Riyadh")) return "Popular in your area";
    if (creator.engagement > 10) return "High engagement";
    if (creator.followers > 100000) return "Trending creator";
    
    return reasons[Math.floor(Math.random() * reasons.length)];
  },

  getTrendingHashtags() {
    const hashtagCounts = {};
    
    state.social.posts.forEach(post => {
      if (post.hashtags) {
        post.hashtags.forEach(tag => {
          hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
        });
      }
    });
    
    return Object.entries(hashtagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));
  },

  searchSocialContent(query) {
    const lowerQuery = query.toLowerCase();
    
    // Search posts by content, hashtags, and mentions
    const matchingPosts = state.social.posts.filter(post => {
      return (
        post.content.toLowerCase().includes(lowerQuery) ||
        (post.hashtags && post.hashtags.some(tag => tag.toLowerCase().includes(lowerQuery))) ||
        (post.mentions && post.mentions.some(mention => mention.toLowerCase().includes(lowerQuery)))
      );
    });
    
    // Search creators by name, handle, and bio
    const matchingCreators = state.creators.filter(creator => {
      return (
        creator.name.toLowerCase().includes(lowerQuery) ||
        creator.handle.toLowerCase().includes(lowerQuery) ||
        creator.bio.toLowerCase().includes(lowerQuery)
      );
    });
    
    return {
      posts: matchingPosts.slice(0, 10),
      creators: matchingCreators.slice(0, 5),
      hashtags: this.getTrendingHashtags().filter(h => h.tag.toLowerCase().includes(lowerQuery)).slice(0, 5)
    };
  }
};