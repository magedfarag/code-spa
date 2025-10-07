/* data.js — state, persistence, sample catalog, and actions */

const LS_STATE_KEY = "storez_spa_state_v2";

/* ---------- helpers ---------- */
export const uns = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

function P(id, name, cat, price, listPrice = null, creatorId = null, img = null) {
  return {
    id, name, cat, price, listPrice, creatorId,
    img,
    stock: Math.floor(Math.random() * 26) + 5,
    rating: (Math.floor(Math.random() * 13) + 36) / 10 // 3.6–4.8
  };
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
  user: { id: "u1", name: "Maya", authed: false, guest: false, credits: 45, referrals: 2 },

  creators: [
    { id: "c1", handle: "@linafit", name: "Lina", followers: 128000, bio: "Wellness & athleisure", live: true },
    { id: "c2", handle: "@technoz", name: "Tariq", followers: 98000, bio: "Phone mods & cases", live: false },
    { id: "c3", handle: "@seaskin", name: "Sara", followers: 54000, bio: "Clean skincare drops", live: false }
  ],

  products: [
    P("p1", "CloudRunner Sneakers", "Footwear", 329, 399, "c1", "1519744792095-2f2205e87b6f"),
    P("p2", "Aura Skin Serum", "Beauty", 119, null, "c3", "1522336572468-97b06e8ef143"),
    P("p3", "Hologram Phone Case", "Accessories", 49, 69, "c2", "1580894895111-1fc068d51666"),
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
      ts: Date.now() - 86400000 * 6,
      items: [{ id: "p2", qty: 1, price: 119 }],
      total: 119,
      status: "Delivered",
      review: true,
      timeline: ["Placed", "Shipped", "Out for delivery", "Delivered"]
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
