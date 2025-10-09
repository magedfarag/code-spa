/* data.js — state, persistence, sample catalog, and actions */

/* ---------- localStorage key ---------- */
const LS_STATE_KEY = "storez_spa_state_v2";

/* ---------- unsplash helper ---------- */
export const uns = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

/* ---------- product helper ---------- */
function P(id, name, cat, price, listPrice = null, creatorId = null, img = null, nameAr = null, catAr = null, enhancedData = {}) {
  return {
    id, 
    price, 
    listPrice, 
    creatorId,
    img,
    rating: 4.2 + Math.random() * 0.6,
    name: { en: name, ar: nameAr || name },
    cat: { en: cat, ar: catAr || cat },
    tags: ["#trending", "#new", "#popular"],
    // Enhanced product data
    ...enhancedData
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
    stats: { 
      productViews: 156, 
      timeSpent: 3240, 
      sessionsCount: 12,
      recentlyViewed: [
        { productId: "p1", timestamp: Date.now() - 1800000 }, // 30 min ago
        { productId: "p3", timestamp: Date.now() - 3600000 }, // 1 hour ago
        { productId: "p5", timestamp: Date.now() - 7200000 }  // 2 hours ago
      ]
    },
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
        avatar: uns("1535713875002-d1d0cf377fde", 100),
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
        avatar: uns("1438761681033-6461ffad8d80", 100),
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
        avatar: uns("1535713875002-d1d0cf377fde", 100),
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
        avatar: uns("1438761681033-6461ffad8d80", 100),
        content: "Traditional kabsa spice blend is now available! 🍛 Made with authentic Saudi spices, just like my grandmother's recipe. Perfect for family dinners! 👨‍👩‍👧‍👦",
        productIds: ["p4"], // Using travel mug as placeholder for spice blend
        images: [uns("1515378791036-0648a3ef77b2", 400)],
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
        avatar: uns("1438761681033-6461ffad8d80", 100),
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
    P("p1", "CloudRunner Sneakers", "Footwear", 329, 399, "c1", "1542291026-7eec264c27ff", "حذاء الجري السحابي", "أحذية", {
      description: {
        en: "Premium running shoes with cloud-like cushioning technology. Perfect for daily runs, gym workouts, and casual wear.",
        ar: "أحذية جري فاخرة بتقنية توسيد تشبه السحاب. مثالية للجري اليومي وتمارين الصالة الرياضية والارتداء العادي."
      },
      specifications: {
        material: { en: "Breathable mesh upper with synthetic overlays", ar: "جزء علوي من الشبك القابل للتنفس مع طبقات اصطناعية" },
        sole: { en: "CloudFoam midsole with rubber outsole", ar: "نعل أوسط من CloudFoam مع نعل خارجي مطاطي" },
        weight: { en: "280g per shoe", ar: "280 جرام لكل حذاء" },
        waterproof: { en: "No", ar: "لا" },
        breathability: { en: "High", ar: "عالية" }
      },
      variants: [
        { id: "p1-black-39", color: "Black", size: "39", price: 329, stock: 12, images: ["1542291026-7eec264c27ff", "1571019613454-1cb2f99b2d8b"] },
        { id: "p1-black-40", color: "Black", size: "40", price: 329, stock: 8, images: ["1542291026-7eec264c27ff", "1571019613454-1cb2f99b2d8b"] },
        { id: "p1-white-39", color: "White", size: "39", price: 329, stock: 15, images: ["1515879218367-8466d910aaa4", "1521572267360-ee0c2909d518"] },
        { id: "p1-white-40", color: "White", size: "40", price: 329, stock: 6, images: ["1515879218367-8466d910aaa4", "1521572267360-ee0c2909d518"] },
        { id: "p1-blue-39", color: "Blue", size: "39", price: 339, stock: 10, images: ["1515378791036-0648a3ef77b2", "1535713875002-d1d0cf377fde"] }
      ],
      sizeGuide: {
        sizes: [
          { size: "39", foot_length: "24.5-25cm", width: "Normal" },
          { size: "40", foot_length: "25-25.5cm", width: "Normal" },
          { size: "41", foot_length: "25.5-26cm", width: "Normal" },
          { size: "42", foot_length: "26-26.5cm", width: "Normal" }
        ],
        fitAdvice: {
          en: "True to size. For wide feet, consider sizing up.",
          ar: "مقاس طبيعي. للأقدام العريضة، فكر في زيادة المقاس."
        }
      },
      arSupported: true,
      arFeatures: ["virtual_try_on", "size_comparison", "color_preview"],
      shipping: {
        freeShipping: true,
        estimatedDays: "2-3",
        sameDay: true,
        locations: ["Riyadh", "Jeddah", "Dammam"]
      },
      socialProof: {
        totalReviews: 156,
        averageRating: 4.8,
        recommendationRate: 94
      }
    }),
    P("p2", "Sunset Hoodie", "Apparel", 149, 189, "c2", "1515879218367-8466d910aaa4", "هودي الغروب", "ملابس", {
      description: {
        en: "Cozy cotton blend hoodie with vintage sunset print. Perfect for casual outings and lounging.",
        ar: "هودي مريح من مزيج القطن مع طباعة غروب الشمس العتيقة. مثالي للنزهات العادية والاسترخاء."
      },
      specifications: {
        material: { en: "70% Cotton, 30% Polyester", ar: "70% قطن، 30% بوليستر" },
        fit: { en: "Regular fit", ar: "مقاس عادي" },
        care: { en: "Machine washable", ar: "قابل للغسل في الغسالة" },
        origin: { en: "Made in Turkey", ar: "صنع في تركيا" }
      },
      variants: [
        { id: "p2-orange-s", color: "Sunset Orange", size: "S", price: 149, stock: 20, images: ["1515879218367-8466d910aaa4"] },
        { id: "p2-orange-m", color: "Sunset Orange", size: "M", price: 149, stock: 18, images: ["1515879218367-8466d910aaa4"] },
        { id: "p2-orange-l", color: "Sunset Orange", size: "L", price: 149, stock: 12, images: ["1515879218367-8466d910aaa4"] },
        { id: "p2-navy-m", color: "Navy", size: "M", price: 159, stock: 8, images: ["1521572163474-6864f9cf17ab"] }
      ],
      sizeGuide: {
        sizes: [
          { size: "S", chest: "96-101cm", length: "66cm" },
          { size: "M", chest: "101-106cm", length: "68cm" },
          { size: "L", chest: "106-111cm", length: "70cm" },
          { size: "XL", chest: "111-116cm", length: "72cm" }
        ]
      },
      arSupported: true,
      arFeatures: ["virtual_try_on", "color_preview"],
      sustainability: {
        ecoFriendly: true,
        materials: "Organic cotton blend",
        packaging: "Recyclable"
      }
    }),
    P("p3", "Mystic Diffuser", "Home", 89, 119, "c3", "1515378791036-0648a3ef77b2", "موزع عطر صوفي", "منزل", {
      description: {
        en: "Ultrasonic essential oil diffuser with LED mood lighting. Creates a calming atmosphere for relaxation.",
        ar: "موزع زيوت عطرية بالموجات فوق الصوتية مع إضاءة LED للمزاج. يخلق جواً مهدئاً للاسترخاء."
      },
      specifications: {
        capacity: { en: "300ml", ar: "300 مل" },
        runtime: { en: "8-10 hours", ar: "8-10 ساعات" },
        coverage: { en: "25-30 sqm", ar: "25-30 متر مربع" },
        power: { en: "24V adapter included", ar: "محول 24 فولت مشمول" },
        features: { en: "Auto shut-off, 7 LED colors", ar: "إغلاق تلقائي، 7 ألوان LED" }
      },
      variants: [
        { id: "p3-white", color: "White", price: 89, stock: 25, images: ["1515378791036-0648a3ef77b2"] },
        { id: "p3-wood", color: "Wood Grain", price: 99, stock: 15, images: ["1570197788417-0e82375c9371"] }
      ],
      arSupported: true,
      arFeatures: ["placement_preview", "size_comparison"],
      warranty: {
        duration: "2 years",
        coverage: "Full replacement for defects"
      }
    }),
    P("p4", "Travel Mug", "Accessories", 45, 65, "c2", "1521572267360-ee0c2909d518", "كوب السفر", "إكسسوارات", {
      description: {
        en: "Insulated stainless steel travel mug with leak-proof lid. Keeps drinks hot for 6 hours, cold for 12 hours.",
        ar: "كوب سفر من الستانلس ستيل معزول مع غطاء مقاوم للتسرب. يحافظ على المشروبات ساخنة لمدة 6 ساعات، باردة لمدة 12 ساعة."
      },
      specifications: {
        capacity: { en: "400ml", ar: "400 مل" },
        material: { en: "Food-grade stainless steel", ar: "ستانلس ستيل صالح للطعام" },
        insulation: { en: "Double-wall vacuum", ar: "فراغ مزدوج الجدار" },
        dishwasher_safe: { en: "Top rack only", ar: "الرف العلوي فقط" }
      },
      variants: [
        { id: "p4-black", color: "Matte Black", price: 45, stock: 30, images: ["1521572267360-ee0c2909d518"] },
        { id: "p4-silver", color: "Brushed Silver", price: 45, stock: 25, images: ["1515879218367-8466d910aaa4"] },
        { id: "p4-blue", color: "Ocean Blue", price: 49, stock: 18, images: ["1515378791036-0648a3ef77b2"] }
      ],
      arSupported: false,
      warranty: {
        duration: "1 year",
        coverage: "Manufacturing defects"
      }
    }),
    P("p5", "Plant Pot Set", "Home", 199, 249, "c3", "1515378791036-0648a3ef77b2", "طقم أصص النباتات", "منزل", {
      description: {
        en: "Set of 3 ceramic planters with drainage holes and matching saucers. Perfect for indoor plants and herbs.",
        ar: "طقم من 3 أصص سيراميك مع فتحات تصريف وأطباق مطابقة. مثالي للنباتات الداخلية والأعشاب."
      },
      specifications: {
        material: { en: "High-quality ceramic", ar: "سيراميك عالي الجودة" },
        sizes: { en: "Small (10cm), Medium (15cm), Large (20cm)", ar: "صغير (10 سم)، متوسط (15 سم)، كبير (20 سم)" },
        drainage: { en: "Pre-drilled holes", ar: "ثقوب محفورة مسبقاً" },
        finish: { en: "Matte glaze", ar: "طلاء غير لامع" }
      },
      variants: [
        { id: "p5-terracotta", color: "Terracotta", price: 199, stock: 12, images: ["1515378791036-0648a3ef77b2"] },
        { id: "p5-white", color: "Pure White", price: 209, stock: 8, images: ["1515879218367-8466d910aaa4"] },
        { id: "p5-sage", color: "Sage Green", price: 219, stock: 6, images: ["1515378791036-0648a3ef77b2"] }
      ],
      arSupported: true,
      arFeatures: ["placement_preview", "size_comparison"],
      careInstructions: {
        en: "Wipe clean with damp cloth. Avoid harsh chemicals.",
        ar: "امسح بقطعة قماش مبللة. تجنب المواد الكيميائية القاسية."
      }
    }),
    P("p6", "Active Leggings", "Apparel", 149, 189, "c1", "1521572267360-ee0c2909d518", "ليجنز رياضي", "ملابس", {
      description: {
        en: "High-performance leggings with moisture-wicking fabric and side pockets. Perfect for workouts and yoga.",
        ar: "ليجنز عالي الأداء مع قماش ماص للرطوبة وجيوب جانبية. مثالي للتمارين واليوغا."
      },
      specifications: {
        material: { en: "88% Polyester, 12% Elastane", ar: "88% بوليستر، 12% إيلاستان" },
        features: { en: "Moisture-wicking, 4-way stretch", ar: "ماص للرطوبة، مرونة في 4 اتجاهات" },
        compression: { en: "Medium support", ar: "دعم متوسط" },
        length: { en: "Full length", ar: "طول كامل" }
      },
      variants: [
        { id: "p6-black-xs", color: "Black", size: "XS", price: 149, stock: 15, images: ["1521572267360-ee0c2909d518"] },
        { id: "p6-black-s", color: "Black", size: "S", price: 149, stock: 20, images: ["1521572267360-ee0c2909d518"] },
        { id: "p6-black-m", color: "Black", size: "M", price: 149, stock: 18, images: ["1521572267360-ee0c2909d518"] },
        { id: "p6-navy-s", color: "Navy", size: "S", price: 149, stock: 12, images: ["1515378791036-0648a3ef77b2"] },
        { id: "p6-gray-m", color: "Heather Gray", size: "M", price: 159, stock: 10, images: ["1515879218367-8466d910aaa4"] }
      ],
      sizeGuide: {
        sizes: [
          { size: "XS", waist: "61-66cm", hips: "86-91cm", length: "96cm" },
          { size: "S", waist: "66-71cm", hips: "91-96cm", length: "98cm" },
          { size: "M", waist: "71-76cm", hips: "96-101cm", length: "100cm" },
          { size: "L", waist: "76-81cm", hips: "101-106cm", length: "102cm" }
        ]
      },
      arSupported: true,
      arFeatures: ["virtual_try_on", "size_comparison"],
      performance: {
        sweatWicking: true,
        breathability: "High",
        compression: "Medium"
      }
    }),
    P("p7", "Blue Light Glasses", "Accessories", 99, 129, "c3", "1515879218367-8466d910aaa4", "نظارات الضوء الأزرق", "إكسسوارات", {
      description: {
        en: "Stylish blue light blocking glasses to reduce eye strain from screens. Perfect for remote work and gaming.",
        ar: "نظارات أنيقة لحجب الضوء الأزرق لتقليل إجهاد العين من الشاشات. مثالية للعمل عن بُعد والألعاب."
      },
      specifications: {
        lens_type: { en: "Anti-blue light coating", ar: "طلاء مضاد للضوء الأزرق" },
        frame_material: { en: "Lightweight acetate", ar: "أسيتات خفيف الوزن" },
        protection: { en: "Blocks 40% blue light", ar: "يحجب 40% من الضوء الأزرق" },
        prescription: { en: "Available (additional cost)", ar: "متوفر (تكلفة إضافية)" }
      },
      variants: [
        { id: "p7-black", color: "Classic Black", price: 99, stock: 22, images: ["1515879218367-8466d910aaa4"] },
        { id: "p7-tortoise", color: "Tortoise Shell", price: 109, stock: 18, images: ["1521572267360-ee0c2909d518"] },
        { id: "p7-clear", color: "Clear Frame", price: 99, stock: 25, images: ["1515378791036-0648a3ef77b2"] }
      ],
      arSupported: true,
      arFeatures: ["virtual_try_on", "face_fit_analysis"],
      warranty: {
        duration: "1 year",
        coverage: "Frame and lens defects"
      }
    }),
    P("p8", "Detox Clay Mask", "Beauty", 79, null, "c3", "1515378791036-0648a3ef77b2", "ماسك الطين المنظف", "جمال", {
      description: {
        en: "Natural clay mask with activated charcoal for deep pore cleansing. Suitable for all skin types.",
        ar: "قناع طين طبيعي مع الفحم المنشط لتنظيف المسام العميق. مناسب لجميع أنواع البشرة."
      },
      specifications: {
        size: { en: "100ml tube", ar: "أنبوب 100 مل" },
        ingredients: { en: "Bentonite clay, activated charcoal, tea tree oil", ar: "طين البنتونيت، الفحم المنشط، زيت شجرة الشاي" },
        usage: { en: "2-3 times per week", ar: "2-3 مرات في الأسبوع" },
        skin_type: { en: "All skin types", ar: "جميع أنواع البشرة" }
      },
      variants: [
        { id: "p8-original", variant: "Original Formula", price: 79, stock: 35, images: ["1515378791036-0648a3ef77b2"] },
        { id: "p8-sensitive", variant: "Sensitive Skin", price: 89, stock: 20, images: ["1515378791036-0648a3ef77b2"] }
      ],
      arSupported: false,
      ingredients: {
        natural: true,
        organic: "70%",
        cruelty_free: true,
        vegan: true
      },
      skinConcerns: ["acne", "blackheads", "oily_skin", "large_pores"]
    })
  ],

  creators: [
    { 
      id: "c1", 
      name: "@linafit", 
      handle: "@linafit",
      avatar: uns("1535713875002-d1d0cf377fde", 150), 
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
      avatar: uns("1438761681033-6461ffad8d80", 150), 
      coverImage: uns("1515378791036-0648a3ef77b2", 800),
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
      avatar: uns("1438761681033-6461ffad8d80", 150),
      coverImage: uns("1571019613454-1cb2f99b2d8b", 800),
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
      creatorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=70",
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
          userAvatar: uns("1535713875002-d1d0cf377fde", 80),
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
          userAvatar: uns("1438761681033-6461ffad8d80", 80),
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
          userAvatar: uns("1535713875002-d1d0cf377fde", 80),
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
      userAvatar: state.user.avatar || uns("1535713875002-d1d0cf377fde", 80),
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
      avatar: uns("1535713875002-d1d0cf377fde", 100),
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
  },

  // AI Personalization Engine
  getPersonalizedRecommendations(userId = state.user.id, limit = 10) {
    const user = state.user;
    const userInterests = user.interests || [];
    const userHistory = this.getUserBehaviorData(userId);
    const followedCreators = user.following || [];
    
    // Get all products and score them based on personalization factors
    const scoredProducts = state.products.map(product => {
      let score = 0;
      
      // Interest matching (40% weight)
      if (product.category && userInterests.includes(product.category.toLowerCase())) {
        score += 40;
      }
      
      // Creator following (30% weight)
      if (followedCreators.includes(product.creatorId)) {
        score += 30;
      }
      
      // Price preference (15% weight)
      const avgSpent = userHistory.avgOrderValue || 200;
      const priceScore = Math.max(0, 15 - Math.abs(product.price - avgSpent) / 50);
      score += priceScore;
      
      // Social proof (10% weight)
      const socialMetrics = this.getProductSocialMetrics(product.id);
      score += Math.min(10, socialMetrics.totalEngagement / 10);
      
      // Recency boost (5% weight)
      const daysSinceAdded = (Date.now() - (product.addedDate || Date.now())) / (1000 * 60 * 60 * 24);
      if (daysSinceAdded < 7) score += 5;
      
      return { ...product, personalizedScore: score };
    });
    
    // Sort by score and return top recommendations
    return scoredProducts
      .sort((a, b) => b.personalizedScore - a.personalizedScore)
      .slice(0, limit);
  },

  getTrendingProducts(category = null, location = "saudi", limit = 10) {
    // Calculate trending score based on recent engagement
    const now = Date.now();
    const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
    
    const trendingProducts = state.products.map(product => {
      // Get recent social activity for this product
      const recentPosts = state.social.posts.filter(post => 
        post.productIds?.includes(product.id) && post.timestamp > weekAgo
      );
      
      const recentLikes = recentPosts.reduce((sum, post) => sum + post.likes, 0);
      const recentComments = recentPosts.reduce((sum, post) => sum + post.comments, 0);
      const recentShares = recentPosts.reduce((sum, post) => sum + post.shares, 0);
      
      // Calculate trending score
      let trendingScore = 0;
      trendingScore += recentLikes * 1; // Like weight
      trendingScore += recentComments * 3; // Comment weight (higher engagement)
      trendingScore += recentShares * 5; // Share weight (viral potential)
      trendingScore += recentPosts.length * 2; // Post frequency
      
      // Boost for creator location matching
      const creator = creatorById(product.creatorId);
      if (creator && creator.location && creator.location.toLowerCase().includes(location.toLowerCase())) {
        trendingScore *= 1.2;
      }
      
      return { ...product, trendingScore };
    });

    // Filter by category if specified
    let filtered = trendingProducts;
    if (category) {
      filtered = trendingProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    
    return filtered
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, limit);
  },

  getSimilarProducts(productId, limit = 6) {
    const targetProduct = productById(productId);
    if (!targetProduct) return [];
    
    const similarProducts = state.products
      .filter(p => p.id !== productId)
      .map(product => {
        let similarityScore = 0;
        
        // Category matching (50% weight)
        if (product.category === targetProduct.category) {
          similarityScore += 50;
        }
        
        // Creator matching (25% weight)
        if (product.creatorId === targetProduct.creatorId) {
          similarityScore += 25;
        }
        
        // Price similarity (15% weight)
        const priceDiff = Math.abs(product.price - targetProduct.price);
        const priceScore = Math.max(0, 15 - (priceDiff / targetProduct.price) * 15);
        similarityScore += priceScore;
        
        // Rating similarity (10% weight)
        const targetRating = this.getProductRating(targetProduct.id);
        const productRating = this.getProductRating(product.id);
        const ratingScore = Math.max(0, 10 - Math.abs(targetRating - productRating) * 2);
        similarityScore += ratingScore;
        
        return { ...product, similarityScore };
      });
    
    return similarProducts
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);
  },

  getProductRating(productId) {
    const product = productById(productId);
    if (!product) return 4.0; // Default rating
    
    // Check if product has avgRating, rating, or use reviews to calculate
    if (product.avgRating) return product.avgRating;
    if (product.rating) return product.rating;
    
    // Calculate from reviews if available
    const reviews = state.reviews.byProduct[productId];
    if (reviews && reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      return totalRating / reviews.length;
    }
    
    // Default rating for products without reviews
    return 4.0;
  },

  getRecentlyViewedProducts(userId = state.user.id, limit = 8) {
    const userStats = state.user.stats || {};
    const recentViews = userStats.recentlyViewed || [];
    
    return recentViews
      .map(view => ({ ...productById(view.productId), viewedAt: view.timestamp }))
      .filter(Boolean)
      .sort((a, b) => b.viewedAt - a.viewedAt)
      .slice(0, limit);
  },

  getPriceDropAlerts(userId = state.user.id) {
    const wishlist = state.user.likedProducts || [];
    const priceDrops = [];
    
    wishlist.forEach(productId => {
      const product = productById(productId);
      if (product && product.originalPrice && product.price < product.originalPrice) {
        const discount = ((product.originalPrice - product.price) / product.originalPrice) * 100;
        priceDrops.push({
          ...product,
          discount: Math.round(discount),
          savings: product.originalPrice - product.price
        });
      }
    });
    
    return priceDrops.sort((a, b) => b.discount - a.discount);
  },

  getUserBehaviorData(userId = state.user.id) {
    const user = state.user;
    const userStats = user.stats || {};
    
    // Calculate behavioral patterns
    const orderHistory = state.cartEnhancements.paymentHistory || [];
    const totalSpent = orderHistory.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = orderHistory.length > 0 ? totalSpent / orderHistory.length : 200;
    
    const categoryPreferences = {};
    state.products.forEach(product => {
      if (user.likedProducts?.includes(product.id)) {
        categoryPreferences[product.category] = (categoryPreferences[product.category] || 0) + 1;
      }
    });
    
    const topCategory = Object.entries(categoryPreferences)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'fashion';
    
    return {
      totalSpent,
      avgOrderValue,
      orderCount: orderHistory.length,
      categoryPreferences,
      topCategory,
      timeSpent: userStats.timeSpent || 0,
      sessionsCount: userStats.sessionsCount || 0,
      engagement: {
        productViews: userStats.productViews || 0,
        likesGiven: this.getUserSocialActivity(userId).likesGiven,
        commentsGiven: this.getUserSocialActivity(userId).commentsGiven
      }
    };
  },

  getUserSocialActivity(userId = state.user.id) {
    const userPosts = state.social.posts.filter(post => post.userId === userId);
    const userActivities = state.social.activities.filter(activity => activity.userId === userId);
    
    const likesGiven = userActivities.filter(a => a.type === 'like').length;
    const commentsGiven = userActivities.filter(a => a.type === 'comment').length;
    const followsGiven = userActivities.filter(a => a.type === 'follow').length;
    
    return {
      postsCount: userPosts.length,
      likesGiven,
      commentsGiven,
      followsGiven,
      totalEngagement: likesGiven + commentsGiven + followsGiven
    };
  },

  getProductSocialMetrics(productId) {
    const productPosts = state.social.posts.filter(post => 
      post.productIds?.includes(productId)
    );
    
    const totalLikes = productPosts.reduce((sum, post) => sum + post.likes, 0);
    const totalComments = productPosts.reduce((sum, post) => sum + post.comments, 0);
    const totalShares = productPosts.reduce((sum, post) => sum + post.shares, 0);
    const totalEngagement = totalLikes + totalComments + totalShares;
    
    return {
      postsCount: productPosts.length,
      totalLikes,
      totalComments,
      totalShares,
      totalEngagement,
      avgEngagementPerPost: productPosts.length > 0 ? totalEngagement / productPosts.length : 0
    };
  },

  getCreatorRecommendations(userId = state.user.id, limit = 5) {
    const user = state.user;
    const following = user.following || [];
    const interests = user.interests || [];
    
    // Score creators based on user preferences
    const scoredCreators = state.creators
      .filter(creator => !following.includes(creator.id))
      .map(creator => {
        let score = 0;
        
        // Interest alignment (40% weight)
        const creatorCategories = creator.categories || [];
        const categoryMatch = creatorCategories.filter(cat => 
          interests.includes(cat.toLowerCase())
        ).length;
        score += categoryMatch * 10;
        
        // Engagement rate (30% weight)
        score += creator.engagement * 3;
        
        // Follower count (20% weight) - but not too high to promote smaller creators
        const followerScore = Math.min(20, creator.followers / 5000);
        score += followerScore;
        
        // Location preference (10% weight)
        if (creator.location?.includes('Saudi') || creator.location?.includes('Riyadh')) {
          score += 10;
        }
        
        return { ...creator, recommendationScore: score };
      });
    
    return scoredCreators
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, limit);
  },

  getPersonalizedFeed(userId = state.user.id, limit = 20) {
    const user = state.user;
    const userBehavior = this.getUserBehaviorData(userId);
    const followedCreators = user.following || [];
    const userInterests = user.interests || [];
    
    // Get posts and score them for personalization
    const scoredPosts = state.social.posts.map(post => {
      let score = 0;
      
      // Following boost (40% weight)
      if (followedCreators.includes(post.userId)) {
        score += 40;
      }
      
      // Interest alignment (25% weight)
      if (post.hashtags && Array.isArray(userInterests)) {
        const interestMatch = post.hashtags.filter(tag => 
          userInterests.some(interest => tag.toLowerCase().includes(interest))
        ).length;
        score += interestMatch * 8;
      }
      
      // Engagement quality (20% weight)
      const engagementRate = (post.likes + post.comments * 2 + post.shares * 3) / 100;
      score += Math.min(20, engagementRate);
      
      // Recency (10% weight)
      const hoursAgo = (Date.now() - post.timestamp) / (1000 * 60 * 60);
      const recencyScore = Math.max(0, 10 - hoursAgo / 6);
      score += recencyScore;
      
      // Product relevance (5% weight)
      if (post.productIds) {
        const relevantProducts = post.productIds.filter(pid => {
          const product = productById(pid);
          return product && product.category && Array.isArray(userInterests) && userInterests.includes(product.category.toLowerCase());
        }).length;
        score += relevantProducts * 2.5;
      }
      
      return { ...post, personalizedScore: score };
    });
    
    return scoredPosts
      .sort((a, b) => b.personalizedScore - a.personalizedScore)
      .slice(0, limit);
  },

  trackUserInteraction(type, data) {
    // Track user behavior for improved recommendations
    if (!state.user.behaviorTracking) {
      state.user.behaviorTracking = {
        interactions: [],
        preferences: {},
        lastUpdated: Date.now()
      };
    }
    
    const interaction = {
      type,
      data,
      timestamp: Date.now(),
      session: state.user.stats.sessionsCount || 1
    };
    
    state.user.behaviorTracking.interactions.push(interaction);
    
    // Keep only last 1000 interactions
    if (state.user.behaviorTracking.interactions.length > 1000) {
      state.user.behaviorTracking.interactions = 
        state.user.behaviorTracking.interactions.slice(-1000);
    }
    
    // Update preferences based on interaction
    this.updateUserPreferences(type, data);
    
    saveState();
  },

  updateUserPreferences(type, data) {
    if (!state.user.behaviorTracking.preferences) {
      state.user.behaviorTracking.preferences = {};
    }
    
    const prefs = state.user.behaviorTracking.preferences;
    
    switch (type) {
      case 'product_view':
        const product = productById(data.productId);
        if (product) {
          prefs[product.category] = (prefs[product.category] || 0) + 1;
        }
        break;
      
      case 'creator_follow':
        const creator = creatorById(data.creatorId);
        if (creator && creator.categories) {
          creator.categories.forEach(cat => {
            prefs[cat] = (prefs[cat] || 0) + 2;
          });
        }
        break;
      
      case 'post_like':
        if (data.hashtags) {
          data.hashtags.forEach(tag => {
            prefs[tag] = (prefs[tag] || 0) + 0.5;
          });
        }
        break;
    }
    
    // Update user interests based on strong preferences
    const topPrefs = Object.entries(prefs)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([key]) => key.toLowerCase());
    
    state.user.interests = [...new Set([...state.user.interests, ...topPrefs])];
  },

  // Enhanced Product Detail Features
  getProductVariants(productId) {
    const product = productById(productId);
    return product?.variants || [];
  },

  getVariantById(variantId) {
    for (const product of state.products) {
      if (product.variants) {
        const variant = product.variants.find(v => v.id === variantId);
        if (variant) {
          return { ...variant, parentProduct: product };
        }
      }
    }
    return null;
  },

  selectProductVariant(productId, variantId) {
    // Track variant selection for analytics
    this.trackUserInteraction('variant_selection', { productId, variantId });
    
    const variant = this.getVariantById(variantId);
    if (variant) {
      // Update recently viewed with variant
      this.addToRecentlyViewed(productId, { variantId });
      saveState();
      return variant;
    }
    return null;
  },

  getProductSizeGuide(productId) {
    const product = productById(productId);
    return product?.sizeGuide || null;
  },

  getAvailableSizes(productId, color = null) {
    const variants = this.getProductVariants(productId);
    let filtered = variants;
    
    if (color) {
      filtered = variants.filter(v => v.color === color);
    }
    
    const sizes = [...new Set(filtered.map(v => v.size))].filter(Boolean);
    return sizes.map(size => {
      const sizeVariants = filtered.filter(v => v.size === size);
      const totalStock = sizeVariants.reduce((sum, v) => sum + v.stock, 0);
      const minPrice = Math.min(...sizeVariants.map(v => v.price));
      
      return {
        size,
        available: totalStock > 0,
        stock: totalStock,
        price: minPrice
      };
    });
  },

  getAvailableColors(productId, size = null) {
    const variants = this.getProductVariants(productId);
    let filtered = variants;
    
    if (size) {
      filtered = variants.filter(v => v.size === size);
    }
    
    const colors = [...new Set(filtered.map(v => v.color))].filter(Boolean);
    return colors.map(color => {
      const colorVariants = filtered.filter(v => v.color === color);
      const totalStock = colorVariants.reduce((sum, v) => sum + v.stock, 0);
      const minPrice = Math.min(...colorVariants.map(v => v.price));
      const firstVariant = colorVariants[0];
      
      return {
        color,
        available: totalStock > 0,
        stock: totalStock,
        price: minPrice,
        images: firstVariant?.images || []
      };
    });
  },

  getShippingInfo(productId, location = "Riyadh") {
    const product = productById(productId);
    const shipping = product?.shipping || {};
    
    const baseShipping = {
      freeShipping: false,
      estimatedDays: "5-7",
      sameDay: false,
      locations: ["Riyadh"],
      cost: 25
    };
    
    const shippingInfo = { ...baseShipping, ...shipping };
    
    // Calculate shipping cost based on location and product
    if (shippingInfo.freeShipping || product.price > 200) {
      shippingInfo.cost = 0;
    }
    
    // Check same-day availability
    if (shippingInfo.sameDay && shippingInfo.locations.includes(location)) {
      shippingInfo.sameDayAvailable = true;
      shippingInfo.sameDayCost = 15;
    }
    
    return shippingInfo;
  },

  startARSession(productId, feature = "virtual_try_on") {
    const product = productById(productId);
    
    if (!product?.arSupported || !product.arFeatures?.includes(feature)) {
      return { success: false, message: "AR not supported for this product" };
    }
    
    // Track AR usage
    this.trackUserInteraction('ar_session', { productId, feature });
    
    // Simulate AR session data
    const arSession = {
      id: `ar_${Date.now()}`,
      productId,
      feature,
      status: "active",
      startTime: Date.now(),
      capabilities: product.arFeatures,
      sessionData: {
        camerPermission: true,
        calibrated: false,
        tracking: false
      }
    };
    
    // Store AR session
    if (!state.user.arSessions) {
      state.user.arSessions = [];
    }
    state.user.arSessions.push(arSession);
    
    saveState();
    return { success: true, sessionId: arSession.id, capabilities: product.arFeatures };
  },

  endARSession(sessionId) {
    if (!state.user.arSessions) return;
    
    const session = state.user.arSessions.find(s => s.id === sessionId);
    if (session) {
      session.status = "completed";
      session.endTime = Date.now();
      session.duration = session.endTime - session.startTime;
    }
    
    saveState();
  },

  addToRecentlyViewed(productId, metadata = {}) {
    if (!state.user.stats.recentlyViewed) {
      state.user.stats.recentlyViewed = [];
    }
    
    // Remove if already exists
    state.user.stats.recentlyViewed = state.user.stats.recentlyViewed.filter(
      item => item.productId !== productId
    );
    
    // Add to beginning
    state.user.stats.recentlyViewed.unshift({
      productId,
      timestamp: Date.now(),
      ...metadata
    });
    
    // Keep only last 20 items
    if (state.user.stats.recentlyViewed.length > 20) {
      state.user.stats.recentlyViewed = state.user.stats.recentlyViewed.slice(0, 20);
    }
    
    saveState();
  },

  getProductComparison(productIds) {
    const products = productIds.map(id => productById(id)).filter(Boolean);
    
    if (products.length < 2) return null;
    
    // Extract comparison data
    const comparison = {
      products: products.map(product => ({
        id: product.id,
        name: getProductTitle(product),
        price: product.price,
        rating: product.rating,
        image: uns(product.img, 300),
        specifications: product.specifications || {},
        features: product.features || [],
        pros: this.getProductPros(product.id),
        cons: this.getProductCons(product.id)
      })),
      commonSpecs: this.getCommonSpecifications(products),
      differences: this.getSpecificationDifferences(products),
      winner: this.determineComparisonWinner(products)
    };
    
    return comparison;
  },

  getCommonSpecifications(products) {
    if (products.length === 0) return {};
    
    const firstProduct = products[0];
    const firstSpecs = firstProduct.specifications || {};
    const commonSpecs = {};
    
    Object.keys(firstSpecs).forEach(spec => {
      const allHaveSpec = products.every(p => p.specifications && p.specifications[spec]);
      if (allHaveSpec) {
        commonSpecs[spec] = products.map(p => p.specifications[spec]);
      }
    });
    
    return commonSpecs;
  },

  getSpecificationDifferences(products) {
    const differences = {};
    
    products.forEach((product, index) => {
      const specs = product.specifications || {};
      Object.keys(specs).forEach(spec => {
        if (!differences[spec]) {
          differences[spec] = {};
        }
        differences[spec][product.id] = specs[spec];
      });
    });
    
    return differences;
  },

  determineComparisonWinner(products) {
    // Simple scoring based on rating and price value
    const scored = products.map(product => {
      let score = 0;
      score += product.rating * 20; // Rating weight
      score += (1000 - product.price) / 10; // Price value (lower price = higher score)
      score += (product.socialProof?.averageRating || 0) * 5; // Social proof
      
      return { product, score };
    });
    
    const winner = scored.reduce((best, current) => 
      current.score > best.score ? current : best
    );
    
    return {
      productId: winner.product.id,
      score: winner.score,
      reasons: ["Highest rating", "Best value for money", "Strong social proof"]
    };
  },

  getProductPros(productId) {
    // Simulate product pros based on reviews and features
    const product = productById(productId);
    const baseProps = [
      "High quality materials",
      "Great value for money", 
      "Fast shipping",
      "Excellent customer service"
    ];
    
    const categoryProps = {
      "Footwear": ["Comfortable fit", "Durable construction", "Good traction"],
      "Apparel": ["Soft fabric", "True to size", "Stylish design"],
      "Home": ["Easy to use", "Elegant design", "Space-saving"],
      "Beauty": ["Effective formula", "Natural ingredients", "Gentle on skin"],
      "Accessories": ["Practical design", "Good build quality", "Versatile use"]
    };
    
    const category = loc(product, "cat", "en");
    const specific = categoryProps[category] || [];
    
    return [...baseProps.slice(0, 2), ...specific.slice(0, 2)];
  },

  getProductCons(productId) {
    // Simulate minor cons to maintain authenticity
    const cons = [
      "Limited color options",
      "Could be more affordable",
      "Packaging could be improved",
      "Instructions could be clearer"
    ];
    
    return cons.slice(0, 1 + Math.floor(Math.random() * 2));
  },

  getProductRecommendationReason(productId, userId = state.user.id) {
    const product = productById(productId);
    const user = state.user;
    
    // Determine recommendation reason
    if (Array.isArray(user.interests) && user.interests.includes(loc(product, "cat", "en").toLowerCase())) {
      return { 
        type: "interest_match", 
        text: "Based on your interests" 
      };
    }
    
    if (user.following.includes(product.creatorId)) {
      const creator = creatorById(product.creatorId);
      return { 
        type: "creator_follow", 
        text: `Because you follow ${creator?.name}` 
      };
    }
    
    const similarProducts = user.likedProducts.filter(likedId => {
      const likedProduct = productById(likedId);
      return likedProduct && loc(likedProduct, "cat") === loc(product, "cat");
    });
    
    if (similarProducts.length > 0) {
      return { 
        type: "similar_likes", 
        text: "Because you liked similar items" 
      };
    }
    
    return { 
      type: "trending", 
      text: "Trending in this category" 
    };
  }
};