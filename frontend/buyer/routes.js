/* routes.js — all view handlers for StoreZ (Buyer SPA)
   Each handler receives:
     ctx = { el, state, actions, t, tn, currency, fmtDate, navigate, showSheet, refresh }
   and optional id from the hash (e.g., #/pdp/p1 => id = "p1")
*/
import { uns, state, actions, productById, creatorById, cartTotal } from "./data.js";
import { t, tn } from "./i18n.js";

/* ---------- tiny DOM helpers ---------- */
const h = (html) => html.trim();
const stars = (n) => "⭐".repeat(Math.round(Number(n || 4)));

/* ---------- shared UI fragments ---------- */
function Card(p) {
  const discount = p.listPrice ? `<span class="strike">${fmt(p.listPrice)}</span>` : "";
  const saved = state.wishlist.includes(p.id);
  return h(`
  <article class="card" aria-label="${p.name}">
    <a class="media" href="#/pdp/${p.id}" aria-label="${p.name}">
      <img src="${uns(p.img, 900)}" alt="${p.name}" />
    </a>
    <div class="body">
      <div class="row between">
        <a href="#/pdp/${p.id}"><strong>${p.name}</strong></a>
        <button class="icon-btn ${saved ? "active" : ""}" data-action="toggle-wish" data-id="${p.id}" aria-pressed="${saved}" title="${saved ? t("unsave_item") : t("save_item")}">${saved ? "♥" : "♡"}</button>
      </div>
      <div class="row between">
        <div class="row" style="gap:6px">
          <span class="price">${fmt(p.price)}</span>
          ${discount}
        </div>
        <span class="chip">${p.cat}</span>
      </div>
      <div class="muted">${t("by_creator")} ${creatorName(p.creatorId)} · ${stars(p.rating)}</div>
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
      <strong>${t("action_signup")}</strong>
      <label>Email<input id="auth_email" type="email" placeholder="you@example.com" /></label>
      <div class="row" style="gap:8px; margin-top:10px">
        <button class="secondary" type="button" onclick="(function(){const v=document.getElementById('auth_email').value||''; if(!v){alert('Enter email');return;} window.StoreZ.state.user.authed=true; window.StoreZ.state.user.guest=false; window.StoreZ.navigate('#/onboarding');})()">${t("start")}</button>
        <button class="ghost" type="button" onclick="window.StoreZ.navigate('#/landing')">${t("back")}</button>
      </div>
    </section>
  `);
}

function onboarding(ctx) {
  const interests = ["Sneakers","Minimal","Tech","Beauty","Accessories","Athleisure"];
  ctx.el.innerHTML = h(`
    <section class="panel">
      <strong>${t("welcome")}</strong>
      <p class="muted">${t("pick_interests")}</p>
      <div class="row" style="gap:8px; flex-wrap:wrap">
        ${interests.map(x => `<label class="chip"><input type="checkbox" checked style="accent-color:var(--brand); margin-inline-end:6px">${x}</label>`).join("")}
      </div>
      <hr/>
      <button class="secondary" type="button" onclick="window.StoreZ.navigate('#/home')">${t("start")}</button>
    </section>
  `);
}

function home(ctx) {
  const feed = state.products.slice(0, 6);
  state.metrics.impressions += feed.length;
  ctx.refresh();
  ctx.el.innerHTML = h(`
    <section class="panel">
      <div class="row between">
        <strong>${t("for_you")}</strong>
        <a class="chip" href="#/discover">${t("see_all")}</a>
      </div>
      <div class="grid cards" style="margin-top:12px">
        ${feed.map(Card).join("")}
      </div>
    </section>
  `);
}

function discover(ctx) {
  const list = state.products.slice();
  ctx.el.innerHTML = h(`
    <section class="panel">
      <label class="sr-only" for="q">${t("nav_discover")}</label>
      <input id="q" placeholder="${t("discover_ph")}" oninput="window.__filterDiscover && window.__filterDiscover(this.value)" />
      <div id="resCount" role="status" aria-live="polite" class="muted" style="margin-top:8px">${tn("results_count",{n:list.length})}</div>
      <div id="discoverResults" class="grid cards" style="margin-top:12px">
        ${list.map(Card).join("")}
      </div>
    </section>
  `);
  window.__filterDiscover = (term) => {
    const res = state.products.filter(p => (p.name + p.cat).toLowerCase().includes((term||"").toLowerCase()));
    const host = document.getElementById("discoverResults");
    const rc = document.getElementById("resCount");
    if (host) host.innerHTML = res.map(Card).join("") || `<div class="panel center muted">${t("no_messages")}</div>`;
    if (rc) rc.textContent = tn("results_count", { n: res.length });
  };
}

function pdp(ctx, id) {
  const p = productById(id) || state.products[0];
  const c = creatorById(p.creatorId);
  const saved = state.wishlist.includes(p.id);
  ctx.el.innerHTML = h(`
    <article class="panel">
      <div class="media" style="aspect-ratio:1/1; border-radius:12px; overflow:hidden">
        <img src="${uns(p.img, 1200)}" alt="${p.name}" />
      </div>
      <h2 style="margin:.6rem 0 .2rem">${p.name}</h2>
      <div class="muted">${t("by_creator")} ${c ? `<a href="#/creator/${c.id}">${c.name}</a>` : "—"} · ${stars(p.rating)}</div>

      <div class="row between" style="margin-top:6px">
        <div class="row" style="gap:6px">
          <span class="price">${fmt(p.price)}</span>
          ${p.listPrice ? `<span class="strike">${fmt(p.listPrice)}</span>` : ""}
        </div>
        <span class="chip">${t("stock")}: ${p.stock}</span>
      </div>

      <hr/>
      <div class="row" style="gap:6px; flex-wrap:wrap">
        <label class="chip"><input type="radio" name="size" checked style="margin-inline-end:6px">S</label>
        <label class="chip"><input type="radio" name="size" style="margin-inline-end:6px">M</label>
        <label class="chip"><input type="radio" name="size" style="margin-inline-end:6px">L</label>
      </div>
      <div class="row" style="gap:6px; flex-wrap:wrap; margin-top:8px">
        <label class="chip"><input type="radio" name="color" checked style="margin-inline-end:6px">Black</label>
        <label class="chip"><input type="radio" name="color" style="margin-inline-end:6px">White</label>
        <label class="chip"><input type="radio" name="color" style="margin-inline-end:6px">Mint</label>
      </div>

      <hr/>
      <details open><summary><strong>Details</strong></summary>
        <ul>
          <li>Breathable upper · lightweight foam</li>
          <li>Free 30-day returns</li>
          <li>Ships in 2–5 days · express next-day major cities</li>
        </ul>
      </details>
      <details><summary><strong>Q&amp;A</strong></summary>
        <div class="list" style="margin-top:8px">
          <div class="item"><div><strong>Q:</strong> Fits true to size?</div><div class="muted">A: Yes. If between sizes, size up.</div></div>
          <div class="item"><div><strong>Q:</strong> Warranty?</div><div class="muted">A: 12 months manufacturer warranty.</div></div>
        </div>
      </details>

      <hr/>
      <div class="row" style="gap:8px">
        <button class="secondary" data-action="add-to-cart" data-id="${p.id}">${t("add_to_cart")}</button>
        <button class="ghost" data-action="buy-now" data-id="${p.id}">${t("buy_now")}</button>
        <button class="icon-btn ${saved ? "active" : ""}" data-action="toggle-wish" data-id="${p.id}" aria-pressed="${saved}" title="${saved ? t("unsave_item") : t("save_item")}">${saved ? "♥" : "♡"}</button>
        <button class="icon-btn" title="Share" onclick="(function(){const txt='${p.name} — ${fmt(p.price)} #StoreZ'; if(navigator.share){navigator.share({title:'${p.name}', text:txt, url:location.href}).catch(()=>{});} else {navigator.clipboard.writeText(txt+' '+location.href); alert('Copied to clipboard'); } })()">↗</button>
      </div>
    </article>
  `);
}

function creator(ctx, id) {
  const c = creatorById(id) || state.creators[0];
  const items = state.products.filter(p => p.creatorId === c.id);
  ctx.el.innerHTML = h(`
    <section class="panel">
      <div class="row between">
        <div class="row" style="gap:8px">
          <div class="item" style="width:44px;height:44px;border-radius:999px;background:linear-gradient(135deg,#2a2655,#0e3d57)"></div>
          <div><strong>${c.name}</strong><div class="muted">${c.handle}</div></div>
        </div>
        ${c.live ? `<a class="chip" href="#/live/${c.id}">${t("live_now")}</a>` : ""}
      </div>
      <div class="grid cards" style="margin-top:12px">
        ${items.map(Card).join("")}
      </div>
    </section>
  `);
}

function cart(ctx) {
  const items = state.cart.items.slice();
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
  const items = state.cart.items.slice();
  if (!items.length) {
    ctx.el.innerHTML = h(`
      <section class="panel center">
        <p class="muted">${t("cart_empty")}</p>
        <button class="secondary" type="button" onclick="window.StoreZ.navigate('#/discover')">${t("nav_discover")}</button>
      </section>
    `);
    return;
  }
  const shipping = 15;
  const tax = Math.round(cartTotal() * 0.05);
  const total = cartTotal() + shipping + tax;
  const walletLabel = (localStorage.getItem("storez_lang") || "en") === "ar" ? "مدى" : (window.ApplePaySession ? "Apple Pay" : t("wallet"));
  ctx.el.innerHTML = h(`
    <section class="panel">
      <strong>${t("checkout_title")}</strong>
      <div class="list" style="margin-top:10px">
        ${items.map(it => {
          const p = productById(it.id);
          return `<div class="row between"><span>${p.name} × ${it.qty}</span><span>${fmt(it.qty * it.price)}</span></div>`;
        }).join("")}
      </div>
      <hr/>
      <div class="row between"><span>${t("shipping")}</span><span>${fmt(shipping)}</span></div>
      <div class="row between"><span>${t("tax")}</span><span>${fmt(tax)}</span></div>
      <div class="row between"><strong>${t("total")}</strong><strong>${fmt(total)}</strong></div>
      <hr/>
      <label>${t("name")}<input id="f_name" value="${(localStorage.getItem("storez_lang") || "en") === "ar" ? "مَيَّا" : "Maya"}" /></label>
      <label>${t("address")}<input id="f_addr" value="${(localStorage.getItem("storez_lang") || "en") === "ar" ? "الرياض، السعودية" : "Riyadh, KSA"}" /></label>
      <label>${t("payment")}<select id="f_pay">
        <option selected>${t("wallet")} — ${walletLabel}</option>
        <option>${t("card")}</option>
        <option>${t("bnpl")}</option>
      </select></label>
      <div class="row" style="gap:8px; margin-top:10px">
        <button class="secondary" type="button" onclick="(function(){ const order = window.StoreZ.state && window.StoreZ.state.cart && window.StoreZ.state.cart.items.length ? window.StoreZ.actions.placeOrderFromCart() : null; if(!order){ alert('Cart empty'); return; } window.StoreZ.navigate('#/orders'); })()">${t("pay")} ${fmt(total)}</button>
        <button class="ghost" type="button" onclick="window.StoreZ.navigate('#/cart')">${t("back")}</button>
      </div>
      <p class="muted" style="margin-top:8px">${t("note_sim")}</p>
    </section>
  `);
}

function orders(ctx) {
  const statusLabel = (s) =>
    s === "Delivered" ? t("status_delivered")
    : s === "Shipped" ? t("status_shipped")
    : s === "Out" ? t("status_out")
    : t("status_processing");

  const list = state.orders.map(o => {
    const items = o.items.map(i => `${productById(i.id).name}×${i.qty}`).join(", ");
    return `
      <div class="item">
        <div class="item" style="width:64px;height:64px;border-radius:10px;background:linear-gradient(135deg,#2a2655,#0e3d57)"></div>
        <div style="flex:1">
          <div class="row between">
            <a href="#/order/${o.id}"><strong>#${o.id}</strong></a>
            <span class="${o.status === "Delivered" ? "success" : "warning"}">${statusLabel(o.status)}</span>
          </div>
          <div class="muted">${new Date(o.ts).toLocaleString()} · ${items}</div>
          <div class="row between" style="margin-top:6px">
            <span><strong>${fmt(o.total)}</strong></span>
            <div class="row" style="gap:8px">
              <button class="small ghost" type="button" onclick="window.StoreZ.navigate('#/order/${o.id}')">${t("track")}</button>
              ${!o.review ? `<button class="small ghost" type="button" onclick="(function(){ const O=window.StoreZ.state.orders.find(x=>x.id==='${o.id}'); if(O){ O.review=true; window.StoreZ.navigate('#/orders'); window.StoreZ.state && window.StoreZ.state.prefs && window.StoreZ.state.prefs.sponsor; } })()">${t("review")}</button>` : ""}
            </div>
          </div>
        </div>
      </div>`;
  }).join("");

  ctx.el.innerHTML = h(`
    <section class="panel">
      <strong>${t("your_orders")}</strong>
      <div class="list" style="margin-top:10px">
        ${list || `<div class="muted center">${t("no_orders")}</div>`}
      </div>
    </section>
  `);
}

function orderDetail(ctx, id) {
  const o = state.orders.find(x => x.id === id) || state.orders[0];
  if (!o) { ctx.navigate("#/orders"); return; }
  const withinReturn = (Date.now() - o.ts) < 1000 * 60 * 60 * 24 * 30;
  const timeline = o.timeline?.length ? o.timeline : ["Placed","Shipped","Out for delivery","Delivered"];
  const items = o.items.map(i => `<div class="row between"><span>${productById(i.id).name} × ${i.qty}</span><strong>${fmt(i.qty * i.price)}</strong></div>`).join("");
  ctx.el.innerHTML = h(`
    <section class="panel">
      <strong>${t("order_detail")} — #${o.id}</strong>
      <div class="muted" style="margin-top:6px">${new Date(o.ts).toLocaleString()}</div>
      <hr/>
      <div class="list">${items}</div>
      <hr/>
      <div>
        <strong>${t("track")}</strong>
        <div class="row" style="flex-wrap:wrap; gap:8px; margin-top:6px">
          ${timeline.map(s => `<span class="chip">${labelKey(s)}</span>`).join("")}
        </div>
      </div>
      <hr/>
      <div class="row" style="gap:8px">
        <button class="secondary" type="button" onclick="alert('Tracking…')">${t("track")}</button>
        <button class="ghost" type="button" onclick="window.StoreZ.navigate('#/messages')">${t("contact_support")}</button>
        ${withinReturn ? `<button class="ghost" type="button" onclick="(function(){ const reason = prompt('${t("return_reason")}'); if(!reason) return; const msg = window.StoreZ.actions.createSupportTicket('Return for ${o.id}: '+reason); const blob = new Blob(['StoreZ RMA for ${o.id}\\nReason: '+reason], {type:'text/plain'}); const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='RMA-${o.id}.txt'; a.click(); URL.revokeObjectURL(url); window.StoreZ.navigate('#/messages'); })()">${t("start_return")}</button>` : ""}
      </div>
    </section>
  `);
  function labelKey(s) {
    const k = s.toLowerCase().replaceAll(" ", "_");
    return t(k) || s;
  }
}

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
        <p class="muted">${(localStorage.getItem("storez_lang") || "en") === "ar" ? "سجّل الدخول لتستخدم الرسائل." : "Sign in to use Messages."}</p>
        <button class="secondary" type="button" onclick="window.StoreZ.navigate('#/profile')">${t("nav_profile")}</button>
      </section>
    `);
    return;
  }
  const threads = state.messages.map(m => `
    <div class="item">
      <div style="flex:1">
        <div class="row between">
          <strong>${m.with}</strong>
          <span class="muted">${new Date(m.thread[m.thread.length-1].ts).toLocaleString()}</span>
        </div>
        <div class="muted">${m.thread[m.thread.length-1].text}</div>
      </div>
      <a class="chip" href="javascript:void(0)" onclick="alert('Open thread: ${m.id}')">Open</a>
    </div>`).join("");
  ctx.el.innerHTML = h(`
    <section class="panel">
      <strong>${t("messages")}</strong>
      <div class="list" style="margin-top:10px">${threads || `<div class="muted center">${t("no_messages")}</div>`}</div>
    </section>
  `);
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
  ctx.el.innerHTML = h(`
    <section class="panel">
      <div class="row between">
        <div>
          <strong>${state.user.name}</strong>
          <div class="muted">${t("credits")}: ${state.user.credits}</div>
        </div>
        <span class="chip">${state.user.guest ? t("action_signup") : "ID: " + state.user.id}</span>
      </div>
      <hr/>
      <div class="grid" style="grid-template-columns:1fr 1fr; gap:12px">
        <a class="panel" href="#/orders"><strong>${t("orders_btn")}</strong><div class="muted">${t("your_orders")}</div></a>
        <a class="panel" href="#/support"><strong>${t("support")}</strong><div class="muted">${t("support_btn")}</div></a>
        <a class="panel" href="#/notifications"><strong>${t("notifications")}</strong><div class="muted">PDPL</div></a>
        <a class="panel" href="#/referrals"><strong>${t("referrals")}</strong><div class="muted">Invite</div></a>
        <a class="panel" href="#/addresses"><strong>${t("addresses")}</strong><div class="muted">Edit</div></a>
        <a class="panel" href="#/payments"><strong>${t("payments")}</strong><div class="muted">Edit</div></a>
      </div>
    </section>
  `);
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
  const c = creatorById(id) || state.creators.find(x => x.live) || state.creators[0];
  const promo = state.products.find(p => p.creatorId === c.id) || state.products[0];
  ctx.el.innerHTML = h(`
    <section class="panel">
      <div class="media" style="aspect-ratio:1/1"><img src="${uns(promo.img, 1200)}" alt="${promo.name}" /></div>
      <h2>${t("live_with")} ${c.name}</h2>
      <p class="muted">${t("ticket_note")}</p>
      <div class="row between">
        <div><strong>${promo.name}</strong><div class="muted">${fmt(promo.price)}</div></div>
        <button class="secondary" type="button" data-action="add-to-cart" data-id="${promo.id}">${t("tap_to_buy")}</button>
      </div>
    </section>
  `);
}

/* ---------- route table ---------- */
export const routes = {
  "/landing": landing,
  "/auth": auth,
  "/onboarding": onboarding,
  "/home": home,
  "/discover": discover,
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
  "/live": live
};
