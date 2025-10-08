/* data.js — state, persistence, sample catalog, and actions */

/* ---------- sample products ---------- */
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
export function getProductField(product, field, lang = null) {
  const currentLang = lang || localStorage.getItem("storez_lang") || "en";
  if (typeof product[field] === 'object' && product[field] !== null) {
    return product[field][currentLang] || product[field].en;
  }
  return product[field];
}

/* ---------- unsplash helper ---------- */
export const uns = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

const LS_STATE_KEY = "storez_spa_state_v2";

  // UGC Feed with sample posts
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

  metrics: { impressions: 0, addToCart: 0, purchases: 0, revenue: 0, productViews: 0, favorites: 0 }      with: "@linafit", 
      creatorId: "c1",
      unread: 2,
      thread: [
        { from: "@linafit", text: "New drop tonight! Tap "Live" from my profile 👀", ts: Date.now() - 3600e3 },
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
        { from: "support", text: "Your order is currently being prepared and will ship within 24 hours. You'll receive tracking info via SMS.", ts: Date.now() - 6800e3 }
      ]
    }
  ],2205e87b6f", "حذاء كلاود رانر الرياضي", "أحذية"),
    P("p2", "Aura Skin Serum", "Beauty", 119, null, "c3", "1522336572468-97b06e8ef143", "سيروم أورا للبشرة", "جمال"),
    P("p3", "Hologram Phone Case", "Accessories", 49, 69, "c2", "1570197788417-0e82375c9371", "جراب هولوجرام للهاتف", "إكسسوارات"),
    P("p4", "Oversize Tee "Shift"", "Apparel", 89, 119, "c1", "1521572163474-6864f9cf17ab", "تيشيرت شيفت الواسع", "ملابس"),
    P("p5", "Fold Wallet Nano", "Accessories", 79, null, "c2", "1522312346375-d1a52e2b99b3", "محفظة فولد نانو", "إكسسوارات"),
    P("p6", "Active Leggings", "Apparel", 149, 189, "c1", "1521572267360-ee0c2909d518", "ليجنز رياضي", "ملابس"),
    P("p7", "Blue Light Glasses", "Accessories", 99, 129, "c3", "1515879218367-8466d910aaa4", "نظارات الضوء الأزرق", "إكسسوارات"),
    P("p8", "Detox Clay Mask", "Beauty", 79, null, "c3", "1515378791036-0648a3ef77b2", "ماسك الطين المنظف", "جمال")
  ],
  
const LS_STATE_KEY = "storez_spa_state_v2";

/* ---------- helpers ---------- */
export const uns = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

function P(id, name, cat, price, listPrice = null, creatorId = null, img = null, nameAr = null, catAr = null) {
  return {
    id, 
    name: { en: name, ar: nameAr || name }, 
    cat: { en: cat, ar: catAr || cat }, 
    price, 
    listPrice, 
    creatorId,
    img,
    stock: Math.floor(Math.random() * 26) + 5,
    rating: (Math.floor(Math.random() * 13) + 36) / 10 // 3.6–4.8
  };
}

// Helper to get localized product field
export function getProductField(product, field, lang = null) {
  const currentLang = lang || localStorage.getItem("storez_lang") || "en";
  return product[field][currentLang] || product[field].en;
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
    onboardingCompleted: false,
    addresses: [
      {
        name: "Maya Al-Rashid",
        address: "King Fahd Road, Building 123, Apt 45",
        city: "riyadh",
        postal: "12345",
        default: true
      },
      {
        name: "Maya Al-Rashid", 
        address: "Olaya Street, Office Tower 2",
        city: "riyadh",
        postal: "11564",
        default: false
      }
    ],
    paymentMethods: [
      {
        type: "visa",
        last4: "4532",
        expiry: "12/26",
        default: true
      },
      {
        type: "mastercard", 
        last4: "8901",
        expiry: "08/25",
        default: false
      }
    ]
  },

  creators: [
    { id: "c1", handle: "@linafit", name: "Lina", followers: 128000, bio: "Wellness & athleisure", live: true },
    { id: "c2", handle: "@technoz", name: "Tariq", followers: 98000, bio: "Phone mods & cases", live: false },
    { id: "c3", handle: "@seaskin", name: "Sara", followers: 54000, bio: "Clean skincare drops", live: false }
  ],

  products: [
    P("p1", "CloudRunner Sneakers", "Footwear", 329, 399, "c1", "1542291026-7eec264c27ff"),
    P("p2", "Aura Skin Serum", "Beauty", 119, null, "c3", "1522336572468-97b06e8ef143"),
    P("p3", "Hologram Phone Case", "Accessories", 49, 69, "c2", "1570197788417-0e82375c9371"),
    P("p4", "Oversize Tee “Shift”", "Apparel", 89, 119, "c1", "1521572163474-6864f9cf17ab"),
    P("p5", "Fold Wallet Nano", "Accessories", 79, null, "c2", "1522312346375-d1a52e2b99b3"),
    P("p6", "Active Leggings", "Apparel", 149, 189, "c1", "1521572267360-ee0c2909d518"),
    P("p7", "Blue Light Glasses", "Accessories", 99, 129, "c3", "1515879218367-8466d910aaa4"),
    P("p8", "Detox Clay Mask", "Beauty", 79, null, "c3", "1515378791036-0648a3ef77b2")
  ],

  cart: { items: [] },
  wishlist: [],
  orders: [
    {
      id: "o1",
      date: Date.now() - 86400000 * 6,
      ts: Date.now() - 86400000 * 6,
      items: [{ id: "p2", qty: 1, price: 119 }],
      total: 134, // 119 + 15 shipping + tax
      status: "Delivered",
      reviewed: true,
      timeline: ["Processing", "Shipped", "Out for delivery", "Delivered"]
    },
    {
      id: "o2", 
      date: Date.now() - 86400000 * 2,
      ts: Date.now() - 86400000 * 2,
      items: [
        { id: "p1", qty: 1, price: 329 },
        { id: "p6", qty: 1, price: 149 }
      ],
      total: 503, // 478 + 15 shipping + 10 tax
      status: "Shipped",
      timeline: ["Processing", "Shipped", "Out for delivery", "Delivered"]
    },
    {
      id: "o3",
      date: Date.now() - 86400000 * 1, 
      ts: Date.now() - 86400000 * 1,
      items: [{ id: "p3", qty: 2, price: 49 }],
      total: 113, // 98 + 15 shipping + tax
      status: "Processing",
      timeline: ["Processing", "Shipped", "Out for delivery", "Delivered"]
    },
    {
      id: "o4",
      date: Date.now() - 86400000 * 15,
      ts: Date.now() - 86400000 * 15,
      items: [{ id: "p7", qty: 1, price: 99 }],
      total: 114, // 99 + 15 shipping + tax
      status: "Cancelled",
      cancelReason: "Changed my mind",
      timeline: ["Processing", "Cancelled"]
    }
  ],
  messages: [
    { id: "m1", with: "@linafit", thread: [{ from: "@linafit", text: "New drop tonight! Tap “Live” from my profile 👀", ts: Date.now() - 3600e3 }] }
  ],

  metrics: { impressions: 0, addToCart: 0, purchases: 0, revenue: 0, productViews: 0, favorites: 0 }
};

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
export function resetState() {
  try {
    localStorage.removeItem(LS_STATE_KEY);
  } catch {}
}

/* ---------- lookups ---------- */
export function productById(id) { return state.products.find(p => p.id === id); }
export function creatorById(id) { return state.creators.find(c => c.id === id); }
export function cartTotal() {
  return state.cart.items.reduce((sum, it) => sum + it.qty * it.price, 0);
}

/* ---------- actions (used by routes and app shell) ---------- */
function addToCart(id, qty = 1, priceOverride) {
  const p = productById(id);
  if (!p) return;
  const line = state.cart.items.find(i => i.id === id);
  const price = priceOverride ?? p.price;
  if (line) line.qty += qty;
  else state.cart.items.push({ id, qty, price });
  state.metrics.addToCart++;
}

function toggleWishlist(id) {
  const i = state.wishlist.indexOf(id);
  if (i >= 0) state.wishlist.splice(i, 1);
  else state.wishlist.push(id);
}

function setQty(id, qty) {
  const it = state.cart.items.find(i => i.id === id);
  if (!it) return;
  it.qty = Math.max(1, qty | 0);
}

function removeFromCart(id) {
  state.cart.items = state.cart.items.filter(i => i.id !== id);
}

function placeOrderFromCart() {
  const items = state.cart.items.slice();
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
  state.cart.items = [];
  state.metrics.purchases++;
  state.metrics.revenue += total;
  return order;
}

function createSupportTicket(text) {
  const msg = { id: "m" + (state.messages.length + 1), with: "Support", thread: [{ from: "SupportBot", text, ts: Date.now() }] };
  state.messages.push(msg);
  return msg;
}

export const actions = {
  addToCart,
  toggleWishlist,
  setQty,
  removeFromCart,
  placeOrderFromCart,
  createSupportTicket
};
