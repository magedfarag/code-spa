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

const discover = ({ el }) => {
  el.innerHTML = h(`
    <div style="padding: 20px;">
      <h1>${t("discover") || "Discover"}</h1>
      <p>Explore products and creators</p>
      <div style="margin-top: 20px;">
        <div class="tabs" style="display: flex; gap: 10px; margin-bottom: 20px;">
          <button class="tab active" style="padding: 10px 20px; border: 1px solid var(--primary); background: var(--primary); color: white; border-radius: 4px;">
            ${t("products") || "Products"}
          </button>
          <button class="tab" style="padding: 10px 20px; border: 1px solid var(--border); background: transparent; border-radius: 4px;">
            ${t("creators") || "Creators"}
          </button>
        </div>
        <p>${t("discover_desc") || "Find trending products and popular creators"}</p>
      </div>
    </div>
  `);
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