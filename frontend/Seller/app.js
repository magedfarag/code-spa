/* StoreZ — Seller Console (single ES module)
   - Routing + state + i18n + views in one file for easy drop-in.
   - Open over http:// (not file://) to avoid CORS for modules.
*/

/* ---------- Tiny helpers ---------- */
const qs = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));
const html = (x) => x.trim();
const fmtSAR = (n) =>
  new Intl.NumberFormat(getLocale(), {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 0,
    currencyDisplay: getLang() === "en" ? "code" : "symbol",
  }).format(Number(n || 0));

/* ---------- i18n ---------- */
const DICT = {
  en: {
    nav_dashboard: "Dashboard",
    nav_catalog: "Catalog",
    nav_orders: "Orders",
    nav_live: "Live",
    nav_inbox: "Inbox",

    kpi_gmv: "GMV (30d)",
    kpi_orders: "Orders",
    kpi_aov: "AOV",
    kpi_ret: "Return rate",

    quick_add: "Add product",
    quick_import: "Import CSV",
    quick_announce: "Announcement",

    catalog_title: "Catalog",
    add_product: "Add product",
    import_catalog: "Import catalog",
    ai_addons: "AI add-ons",
    search_catalog: "Search products…",

    orders_title: "Orders",
    order: "Order",
    customer: "Customer",
    status: "Status",
    total: "Total",
    created: "Created",
    actions: "Actions",
    view: "View",
    fulfill: "Fulfill",
    refund: "Refund",
    label: "Label",
    approve: "Approve",
    deny: "Deny",

    order_detail: "Order detail",
    items: "Items",
    placed: "Placed",
    shipped: "Shipped",
    out_for_delivery: "Out for delivery",
    delivered: "Delivered",
    processing: "Processing",
    start_return: "Create return",
    mark_fulfilled: "Mark fulfilled",
    create_label: "Create label",

    returns_title: "Returns",
    inbox_title: "Inbox",
    live_title: "Live",
    live_go: "Start live session",
    live_end: "End live session",
    pick_product: "Pick product to feature",

    analytics_title: "Analytics",
    settings_title: "Settings",
    store_name: "Store name",
    save: "Save",
    billing_title: "Billing",
    plan: "Plan",
    upgrade: "Upgrade",
    renew: "Renew",

    import_hint: "Paste CSV with columns: name,price,category,imageId",
    parse: "Parse & add",

    pdpl_note: "PDPL: Only necessary data is processed for order fulfillment.",
    enable_ai: "Enable AI add-ons",
    ai_title_rewrite: "Title rewrite",
    ai_image_enhance: "Image enhance",
    ai_auto_translate: "Auto-translate",
  },
  ar: {
    nav_dashboard: "لوحة التحكم",
    nav_catalog: "المنتجات",
    nav_orders: "الطلبات",
    nav_live: "البث",
    nav_inbox: "الرسائل",

    kpi_gmv: "المبيعات (٣٠ يوم)",
    kpi_orders: "الطلبات",
    kpi_aov: "متوسط قيمة الطلب",
    kpi_ret: "معدل الاسترجاع",

    quick_add: "إضافة منتج",
    quick_import: "استيراد CSV",
    quick_announce: "إعلان",

    catalog_title: "المنتجات",
    add_product: "إضافة منتج",
    import_catalog: "استيراد المنتجات",
    ai_addons: "إضافات الذكاء",
    search_catalog: "ابحث في المنتجات…",

    orders_title: "الطلبات",
    order: "طلب",
    customer: "العميل",
    status: "الحالة",
    total: "الإجمالي",
    created: "أُنشىء",
    actions: "الإجراءات",
    view: "عرض",
    fulfill: "تنفيذ",
    refund: "استرجاع",
    label: "ملصق شحن",
    approve: "موافقة",
    deny: "رفض",

    order_detail: "تفاصيل الطلب",
    items: "المنتجات",
    placed: "تم الإنشاء",
    shipped: "تم الشحن",
    out_for_delivery: "خارج للتسليم",
    delivered: "تم التسليم",
    processing: "قيد المعالجة",
    start_return: "إنشاء استرجاع",
    mark_fulfilled: "وضع تم التنفيذ",
    create_label: "إنشاء ملصق",

    returns_title: "الاسترجاعات",
    inbox_title: "الرسائل",
    live_title: "البث",
    live_go: "ابدأ البث",
    live_end: "إنهاء البث",
    pick_product: "اختر منتج للعرض",

    analytics_title: "التحليلات",
    settings_title: "الإعدادات",
    store_name: "اسم المتجر",
    save: "حفظ",
    billing_title: "الفوترة",
    plan: "الخطة",
    upgrade: "ترقية",
    renew: "تجديد",

    import_hint: "الصق CSV بالأعمدة: name,price,category,imageId",
    parse: "تحليل وإضافة",

    pdpl_note: "نظام حماية البيانات: نعالج البيانات اللازمة فقط لتنفيذ الطلب.",
    enable_ai: "تفعيل إضافات الذكاء",
    ai_title_rewrite: "تحسين العنوان",
    ai_image_enhance: "تحسين الصور",
    ai_auto_translate: "ترجمة تلقائية",
  },
};
const LANG_KEY = "storez_seller_lang";
function setLang(lang) {
  const L = DICT[lang] ? lang : "en";
  localStorage.setItem(LANG_KEY, L);
  return L;
}
function getLang() { return localStorage.getItem(LANG_KEY) || "en"; }
function getLocale() { return getLang() === "ar" ? "ar-SA" : "en"; }
function t(k) { const L = getLang(); return (DICT[L][k] ?? DICT.en[k] ?? k); }

/* ---------- Theme ---------- */
const THEME_KEY = "storez_seller_theme";
const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)");
function osTheme(){ return prefersDark?.matches ? "dark" : "light"; }
function applyTheme(theme){
  const applied = theme === "auto" ? osTheme() : theme;
  document.documentElement.dataset.theme = applied;
  localStorage.setItem(THEME_KEY, theme);
  // set meta color
  const m = qs("#metaThemeColor"); if(m){
    const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim() || "#0b0c10";
    m.setAttribute("content", bg);
  }
}

/* ---------- State ---------- */
const LS_KEY = "storez_seller_state_v1";
const state = loadState() || seed();
saveState(); // ensure presence

function seed(){
  const now = Date.now();
  return {
    prefs: { sponsor: true },
    store: { name: "Maya Fit Co.", tier: "Starter", live: false, ai: { title: true, image: true, translate: false } },
    catalog: [
      P("s1","CloudRunner Sneakers","Footwear",329,399,"1519744792095-2f2205e87b6f"),
      P("s2","Aura Skin Serum","Beauty",119,null,"1522336572468-97b06e8ef143"),
      P("s3","Hologram Phone Case","Accessories",49,69,"1580894895111-1fc068d51666"),
      P("s4","Oversize Tee “Shift”","Apparel",89,119,"1521572163474-6864f9cf17ab"),
    ],
    orders: [
      O("o101", now-86400e3*2, [{id:"s1",name:"CloudRunner Sneakers",qty:1,price:329}], 329, "Processing", "Fahad A."),
      O("o102", now-86400e3*5, [{id:"s2",name:"Aura Skin Serum",qty:2,price:119}], 238, "Shipped", "Sara K."),
      O("o103", now-86400e3*9, [{id:"s3",name:"Hologram Case",qty:1,price:49}], 49, "Delivered", "Omar M."),
    ],
    returns: [
      { id:"r1", orderId:"o103", customer:"Omar M.", reason:"Size issue", status:"Pending", ts: now-86400e3*3, total:49 }
    ],
    inbox: [
      { id:"t1", with:"@linafit", last:"When is the new colorway?", ts: now-3*3600e3 }
    ],
    metrics: { gmv30: 6150, orders30: 58, aov: 106, ret: 3.8, spark: buildSpark(24) },
  };
}
function P(id,name,cat,price,listPrice,imgId){
  return { id, name, cat, price, listPrice, imgId, stock: rnd(10,40) };
}
function O(id,ts,items,total,status,customer){
  return { id, ts, items, total, status, customer, timeline: ["Placed"].concat(status==="Shipped"?["Shipped"]:[]).concat(status==="Delivered"?["Shipped","Out for delivery","Delivered"]:[]) };
}
function rnd(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
function uns(id,w=900){ return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`; }

function loadState(){
  try { const raw = localStorage.getItem(LS_KEY); return raw? JSON.parse(raw): null; } catch { return null; }
}
function saveState(){ try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch {} }

/* ---------- Router ---------- */
function parseHash(){
  const h = location.hash.slice(1) || "/dashboard";
  const parts = h.split("/").filter(Boolean);
  if(parts.length===1) return { path:"/"+parts[0] };
  return { path:"/"+parts[0], id: parts[1] };
}
const routes = {
  "/dashboard": renderDashboard,
  "/catalog": renderCatalog,
  "/catalog-new": renderCatalogNew,
  "/catalog-import": renderCatalogImport,
  "/orders": renderOrders,
  "/order": renderOrderDetail,
  "/returns": renderReturns,
  "/live": renderLive,
  "/inbox": renderInbox,
  "/analytics": renderAnalytics,
  "/settings": renderSettings,
  "/billing": renderBilling,
};
function navigate(h){ location.hash = h; }
function route(){
  const { path, id } = parseHash();
  highlightTab(path);
  (routes[path] || renderDashboard)(id);
  qs("#view")?.focus();
}
window.addEventListener("hashchange", route);

/* ---------- Header wiring ---------- */
function wireHeader(){
  qs("#btnReset")?.addEventListener("click", ()=>{ localStorage.removeItem(LS_KEY); location.reload(); });
  qs("#btnQuickAdd")?.addEventListener("click", ()=>navigate("#/catalog-new"));
  qs("#btnQuickLive")?.addEventListener("click", ()=>navigate("#/live"));

  const langSel = qs("#langSelect");
  if(langSel){
    langSel.value = getLang();
    langSel.addEventListener("change", e=>{
      const L = setLang(e.target.value);
      document.documentElement.lang = (L==="ar"?"ar-SA":"en");
      document.documentElement.dir = (L==="ar"?"rtl":"ltr");
      renderStaticLabels();
      route();
    });
  }
  const themeSel = qs("#themeSelect");
  if(themeSel){
    const pref = localStorage.getItem(THEME_KEY) || "dark";
    themeSel.value = pref;
    applyTheme(pref);
    prefersDark?.addEventListener("change", ()=>{ if((localStorage.getItem(THEME_KEY)||"auto")==="auto") applyTheme("auto"); });
    themeSel.addEventListener("change", e=>applyTheme(e.target.value));
  }
  renderStaticLabels();
}
function renderStaticLabels(){
  qsa("[data-i18n]").forEach(el=> el.textContent = t(el.dataset.i18n));
  qs("#chipTier")?.replaceChildren(document.createTextNode(state.store.tier));
}

/* ---------- UI helpers ---------- */
function highlightTab(path){ qsa("nav.bottom a").forEach(a=>a.classList.toggle("active", a.getAttribute("href")==="#"+path)); }
function setSheet(title, bodyHTML){
  const s=qs("#sheet"); if(!s) return;
  qs("#sheetTitle").textContent = title;
  qs("#sheetBody").innerHTML = bodyHTML;
  s.classList.add("show"); s.setAttribute("aria-hidden","false");
  window.__closeSheet = ()=>{ s.classList.remove("show"); s.setAttribute("aria-hidden","true"); };
}

/* ---------- Views ---------- */
function renderDashboard(){
  const v = qs("#view");
  const m = state.metrics;
  v.innerHTML = html(`
    <section class="panel">
      <div class="kpis">
        <div class="kpi"><div class="head">${t("kpi_gmv")}</div><div class="val">${fmtSAR(m.gmv30)}</div></div>
        <div class="kpi"><div class="head">${t("kpi_orders")}</div><div class="val">${state.orders.length}</div></div>
        <div class="kpi"><div class="head">${t("kpi_aov")}</div><div class="val">${fmtSAR(m.aov)}</div></div>
        <div class="kpi"><div class="head">${t("kpi_ret")}</div><div class="val">${m.ret}%</div></div>
      </div>
      <canvas id="spark" height="60" style="width:100%; margin-top:12px"></canvas>
      <hr/>
      <div class="grid cols-2">
        <a class="panel" href="#/catalog"><strong>${t("catalog_title")}</strong><div class="muted">${state.catalog.length} items</div></a>
        <a class="panel" href="#/orders"><strong>${t("orders_title")}</strong><div class="muted">${state.orders.length} total</div></a>
        <a class="panel" href="#/analytics"><strong>${t("analytics_title")}</strong><div class="muted">CTR / CVR</div></a>
        <a class="panel" href="#/billing"><strong>${t("billing_title")}</strong><div class="muted">${t("plan")}: ${state.store.tier}</div></a>
      </div>
    </section>
  `);
  drawSpark("spark", state.metrics.spark);
}
function drawSpark(id, arr){
  const c = qs(`#${id}`); if(!c) return;
  const ctx = c.getContext("2d");
  const w = c.width = c.offsetWidth;
  const h = c.height;
  const max = Math.max(...arr)+1, min = Math.min(...arr);
  ctx.clearRect(0,0,w,h);
  ctx.lineWidth = 2;
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--brand-2") || "#22c55e";
  ctx.beginPath();
  arr.forEach((v,i)=>{
    const x = (i/(arr.length-1))*w;
    const y = h - ((v-min)/(max-min))*h;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();
}
function buildSpark(n){ const a=[]; let v=100; for(let i=0;i<n;i++){ v += (Math.random()-0.4)*8; a.push(Math.max(40, Math.min(160, Math.round(v)))); } return a; }

function renderCatalog(){
  const v=qs("#view");
  const items = state.catalog.map(p=>`
    <article class="card">
      <a class="media" href="#/catalog-edit/${p.id}"><img src="${uns(p.imgId, 600)}" alt="${p.name}"></a>
      <div class="body">
        <div class="row between">
          <strong>${p.name}</strong>
          <span class="chip">${p.cat}</span>
        </div>
        <div class="row between">
          <div class="row" style="gap:6px"><span class="price">${fmtSAR(p.price)}</span>${p.listPrice?`<span class="muted" style="text-decoration:line-through">${fmtSAR(p.listPrice)}</span>`:""}</div>
          <button class="small ghost" onclick="(function(){ const i=state.catalog.findIndex(x=>x.id==='${p.id}'); state.catalog.splice(i,1); saveState(); location.hash='#/catalog'; })()">✕</button>
        </div>
      </div>
    </article>
  `).join("");
  v.innerHTML = html(`
    <section class="panel">
      <div class="row between">
        <strong>${t("catalog_title")}</strong>
        <div class="row">
          <a class="small secondary" href="#/catalog-new">+ ${t("add_product")}</a>
          <a class="small ghost" style="margin-inline-start:8px" href="#/catalog-import">⇪ ${t("import_catalog")}</a>
        </div>
      </div>
      <div class="grid cols-3" style="margin-top:12px">${items}</div>
    </section>
  `);
}

function renderCatalogNew(){
  const v=qs("#view");
  v.innerHTML = html(`
    <section class="panel">
      <strong>${t("add_product")}</strong>
      <label>${t("store_name")}<input id="p_name" placeholder="Product name"></label>
      <label>Price (SAR)<input id="p_price" type="number" value="99"></label>
      <label>Category<select id="p_cat"><option>Apparel</option><option>Footwear</option><option>Accessories</option><option>Beauty</option></select></label>
      <label>Unsplash Image ID<input id="p_img" placeholder="1519744792095-2f2205e87b6f"></label>
      <div class="row" style="gap:8px; margin-top:10px">
        <button class="secondary" onclick="(function(){ const id='s'+(Date.now()%100000); state.catalog.unshift({ id, name:qs('#p_name').value||'New Product', cat:qs('#p_cat').value, price:Number(qs('#p_price').value||0), listPrice:null, imgId:qs('#p_img').value||'1519744792095-2f2205e87b6f', stock:20 }); saveState(); navigate('#/catalog'); })()">${t("save")}</button>
        <button class="ghost" onclick="navigate('#/catalog')">Cancel</button>
      </div>
    </section>
  `);
}

function renderCatalogImport(){
  const v=qs("#view");
  v.innerHTML = html(`
    <section class="panel">
      <strong>${t("import_catalog")}</strong>
      <p class="muted">${t("import_hint")}</p>
      <textarea id="csv" rows="6" placeholder="CloudRunner Sneakers,329,Footwear,1519744792095-2f2205e87b6f&#10;Aura Skin Serum,119,Beauty,1522336572468-97b06e8ef143"></textarea>
      <div class="row" style="gap:8px; margin-top:10px">
        <button class="secondary" onclick="(function(){ const raw=qs('#csv').value.trim(); if(!raw){alert('Empty');return;} raw.split(/\\r?\\n/).forEach(line=>{ const [name,price,cat,img]=line.split(','); if(!name||!price) return; state.catalog.push({id:'s'+(Date.now()%100000)+Math.floor(Math.random()*9), name:name.trim(), cat:(cat||'Apparel').trim(), price:Number(price), listPrice:null, imgId:(img||'1519744792095-2f2205e87b6f').trim(), stock:rnd(10,30)}); }); saveState(); navigate('#/catalog'); })()">${t("parse")}</button>
        <button class="ghost" onclick="navigate('#/catalog')">Cancel</button>
      </div>
    </section>
  `);
}

function renderOrders(){
  const v=qs("#view");
  const rows = state.orders.map(o=>`
    <tr>
      <td><a href="#/order/${o.id}">${o.id}</a></td>
      <td>${o.customer}</td>
      <td>${o.status}</td>
      <td>${fmtSAR(o.total)}</td>
      <td>${new Date(o.ts).toLocaleString(getLocale())}</td>
      <td>
        <button class="small ghost" onclick="navigate('#/order/${o.id}')">${t("view")}</button>
      </td>
    </tr>
  `).join("");
  v.innerHTML = html(`
    <section class="panel">
      <div class="row between"><strong>${t("orders_title")}</strong><a class="chip" href="#/returns">${t("returns_title")}</a></div>
      <div style="overflow:auto">
        <table class="tbl">
          <thead><tr><th>${t("order")}</th><th>${t("customer")}</th><th>${t("status")}</th><th>${t("total")}</th><th>${t("created")}</th><th>${t("actions")}</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `);
  qs("#ordersBadge")?.replaceChildren(document.createTextNode(String(state.orders.length)));
}

function renderOrderDetail(id){
  const o = state.orders.find(x=>x.id===id) || state.orders[0];
  if(!o){ navigate("#/orders"); return; }
  const items = o.items.map(i=>`<div class="row between"><span>${i.name} × ${i.qty}</span><strong>${fmtSAR(i.qty*i.price)}</strong></div>`).join("");
  const timeline = (o.timeline?.length? o.timeline: ["Placed","Shipped","Out for delivery","Delivered"]).map(s=>`<span class="chip">${s}</span>`).join(" ");
  qs("#view").innerHTML = html(`
    <section class="panel">
      <strong>${t("order_detail")} — #${o.id}</strong>
      <div class="muted" style="margin-top:6px">${new Date(o.ts).toLocaleString(getLocale())}</div>
      <hr/>
      <div class="list">${items}</div>
      <hr/>
      <div><strong>${t("status")}:</strong> <span class="chip">${o.status}</span></div>
      <div style="margin-top:8px">${timeline}</div>
      <hr/>
      <div class="row" style="gap:8px">
        <button class="secondary" onclick="(function(){ o.status='Shipped'; (o.timeline=o.timeline||[]).push('Shipped'); saveState(); route(); })()">${t("mark_fulfilled")}</button>
        <button class="ghost" onclick="(function(){ const blob=new Blob(['StoreZ label for ${o.id}'],{type:'text/plain'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url;a.download='LABEL-${o.id}.txt'; a.click(); URL.revokeObjectURL(url); })()">${t("create_label")}</button>
        <button class="ghost danger" onclick="(function(){ const reason=prompt('Reason?'); if(!reason) return; state.returns.unshift({ id:'r'+(Date.now()%100000), orderId:o.id, customer:o.customer, reason, status:'Pending', ts:Date.now(), total:o.total }); saveState(); navigate('#/returns'); })()">${t("start_return")}</button>
      </div>
    </section>
  `);
}

function renderReturns(){
  const rows = state.returns.map(r=>`
    <tr>
      <td>${r.id}</td>
      <td><a href="#/order/${r.orderId}">${r.orderId}</a></td>
      <td>${r.customer}</td>
      <td>${fmtSAR(r.total)}</td>
      <td>${r.status}</td>
      <td>
        <button class="small secondary" onclick="(function(){ r.status='Approved'; saveState(); route(); })()">${t("approve")}</button>
        <button class="small ghost danger" onclick="(function(){ r.status='Denied'; saveState(); route(); })()">${t("deny")}</button>
      </td>
    </tr>
  `).join("");
  qs("#view").innerHTML = html(`
    <section class="panel">
      <strong>${t("returns_title")}</strong>
      <div style="overflow:auto">
        <table class="tbl">
          <thead><tr><th>ID</th><th>${t("order")}</th><th>${t("customer")}</th><th>${t("total")}</th><th>${t("status")}</th><th>${t("actions")}</th></tr></thead>
          <tbody>${rows || `<tr><td colspan="6" class="muted">${t("returns_title")} — 0</td></tr>`}</tbody>
        </table>
      </div>
    </section>
  `);
}

function renderLive(){
  const live = state.store.live;
  const options = state.catalog.map(p=>`<option value="${p.id}">${p.name} — ${fmtSAR(p.price)}</option>`).join("");
  qs("#view").innerHTML = html(`
    <section class="panel">
      <strong>${t("live_title")}</strong>
      <div class="row" style="gap:8px; margin-top:8px">
        <select id="live_product">${options}</select>
        <button class="secondary" onclick="(function(){ state.store.live=!state.store.live; saveState(); route(); })()">${live? t("live_end"): t("live_go")}</button>
      </div>
      <p class="muted" style="margin-top:8px">${t("pick_product")}</p>
      ${live? `<div class="panel" style="margin-top:12px"><strong>Live now</strong><div class="muted">Featuring: ${state.catalog.find(x=>x.id===qs('#live_product').value)?.name || state.catalog[0].name}</div></div>`:""}
    </section>
  `);
}

function renderInbox(){
  const rows = state.inbox.map(ti=>`
    <div class="item">
      <div style="flex:1">
        <div class="row between"><strong>${ti.with}</strong><span class="muted">${new Date(ti.ts).toLocaleTimeString(getLocale())}</span></div>
        <div class="muted">${ti.last}</div>
      </div>
      <a class="chip" href="javascript:void(0)" onclick="alert('Open thread ${ti.id}')">Open</a>
    </div>
  `).join("");
  qs("#view").innerHTML = html(`
    <section class="panel">
      <strong>${t("inbox_title")}</strong>
      <div class="list" style="margin-top:10px">${rows || `<div class="muted">0</div>`}</div>
    </section>
  `);
  qs("#inboxBadge")?.replaceChildren(document.createTextNode(String(state.inbox.length)));
}

function renderAnalytics(){
  const v=qs("#view"); const m=state.metrics;
  v.innerHTML = html(`
    <section class="panel">
      <strong>${t("analytics_title")}</strong>
      <div class="kpis" style="margin-top:10px">
        <div class="kpi"><div class="head">CTR</div><div class="val">${(Math.random()*4+2).toFixed(1)}%</div></div>
        <div class="kpi"><div class="head">CVR</div><div class="val">${(Math.random()*3+1).toFixed(1)}%</div></div>
        <div class="kpi"><div class="head">AOV</div><div class="val">${fmtSAR(m.aov)}</div></div>
        <div class="kpi"><div class="head">GMV</div><div class="val">${fmtSAR(m.gmv30)}</div></div>
      </div>
      <canvas id="spark2" height="60" style="width:100%; margin-top:12px"></canvas>
    </section>
  `);
  drawSpark("spark2", buildSpark(30));
}

function renderSettings(){
  const s=state.store;
  qs("#view").innerHTML = html(`
    <section class="panel">
      <strong>${t("settings_title")}</strong>
      <label>${t("store_name")}<input id="s_name" value="${s.name}"></label>
      <p class="muted" style="margin:.5rem 0">${t("pdpl_note")}</p>
      <label><input id="ai_title" type="checkbox" ${s.ai.title?"checked":""}/> ${t("ai_title_rewrite")}</label>
      <label><input id="ai_image" type="checkbox" ${s.ai.image?"checked":""}/> ${t("ai_image_enhance")}</label>
      <label><input id="ai_tr" type="checkbox" ${s.ai.translate?"checked":""}/> ${t("ai_auto_translate")}</label>
      <div class="row" style="gap:8px; margin-top:10px">
        <button class="secondary" onclick="(function(){ s.name=qs('#s_name').value||s.name; s.ai={ title:qs('#ai_title').checked, image:qs('#ai_image').checked, translate:qs('#ai_tr').checked }; saveState(); alert('Saved'); })()">${t("save")}</button>
        <a class="ghost" href="#/billing">${t("billing_title")}</a>
      </div>
    </section>
  `);
}

function renderBilling(){
  const s=state.store;
  qs("#view").innerHTML = html(`
    <section class="panel">
      <strong>${t("billing_title")}</strong>
      <div class="row between" style="margin-top:8px"><span>${t("plan")}</span><span class="chip">${s.tier}</span></div>
      <div class="row" style="gap:8px; margin-top:10px">
        <button class="secondary" onclick="(function(){ s.tier='Pro'; saveState(); renderStaticLabels(); route(); })()">${t("upgrade")}</button>
        <button class="ghost" onclick="alert('Renewed for 12 months')">${t("renew")}</button>
      </div>
    </section>
  `);
}

/* ---------- Boot ---------- */
function boot(){
  // language
  const L = setLang(getLang());
  document.documentElement.lang = (L==="ar"?"ar-SA":"en");
  document.documentElement.dir = (L==="ar"?"rtl":"ltr");
  // theme
  applyTheme(localStorage.getItem(THEME_KEY) || "dark");
  // header and first render
  wireHeader();
  route();
}
document.addEventListener("DOMContentLoaded", boot);
