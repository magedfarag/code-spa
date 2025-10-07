/* admin.app.js — StoreZ Admin Console (SPA, single module)
   Destinations: Overview, Moderation, Orders, Support, Settings.
   Includes EN/AR (Saudi) text, RTL, theme switch, notices, impersonation.
*/

/* -------------------- i18n (EN / AR—Saudi) -------------------- */
const I18N = {
  en: {
    nav_overview: "Overview",
    nav_moderation: "Moderation",
    nav_orders: "Orders",
    nav_support: "Support",
    nav_settings: "Settings",

    // Common
    demo: "Demo",
    search: "Search…",
    start: "Start",
    save: "Save",
    back: "Back",
    cancel: "Cancel",
    create: "Create",
    delete: "Delete",
    edit: "Edit",
    export: "Export",
    download: "Download",
    open: "Open",
    status: "Status",
    actions: "Actions",

    // Overview
    revenue: "Revenue",
    orders: "Orders",
    aov: "AOV",
    users: "Users",
    creators: "Creators",
    sellers: "Sellers",
    growth: "Growth",
    open_tickets: "Open tickets",
    open_reports: "Open reports",
    incidents: "Incidents",
    uptime: "Uptime",

    // Moderation
    content_queue: "Content queue",
    seller_queue: "Seller queue",
    reported_item: "Reported item",
    type: "Type",
    risk: "Risk",
    reporter: "Reporter",
    time: "Time",
    approve: "Approve",
    reject: "Reject",
    suspend: "Suspend",
    reinstate: "Reinstate",
    product: "Product",
    creator: "Creator",
    message: "Message",
    active: "Active",
    suspended: "Suspended",

    // Orders
    id: "ID",
    customer: "Customer",
    items: "Items",
    total: "Total",
    placed: "Placed",
    paid: "Paid",
    fulfilled: "Fulfilled",
    delivered: "Delivered",
    refund: "Refund",
    mark_paid: "Mark paid",
    mark_fulfilled: "Mark fulfilled",
    mark_delivered: "Mark delivered",

    // Support
    support_center: "Support center",
    inbox: "Inbox",
    reply: "Reply",
    assign: "Assign",
    unassigned: "Unassigned",
    priority: "Priority",
    high: "High",
    normal: "Normal",
    low: "Low",
    ticket: "Ticket",

    // Settings
    settings_title: "Settings",
    language: "Language",
    theme: "Theme",
    pdpl_logging: "PDPL logging",
    feature_flags: "Feature flags",
    flag_live: "Live shopping",
    flag_ai: "AI add-ons",
    flag_wallet: "Wallet-first checkout",
    data_export: "Data export",
    reset_demo: "Reset demo",

    // Header actions
    impersonate: "Impersonate",
    create_notice: "Create notice",
    notice_title: "Global notice",
    notice_body: "Message",
    post_notice: "Post",
    posted: "Posted",
  },

  ar: {
    nav_overview: "نظرة عامة",
    nav_moderation: "الإشراف",
    nav_orders: "الطلبات",
    nav_support: "الدعم",
    nav_settings: "الإعدادات",

    demo: "تجريبي",
    search: "ابحث…",
    start: "ابدأ",
    save: "حفظ",
    back: "رجوع",
    cancel: "إلغاء",
    create: "إنشاء",
    delete: "حذف",
    edit: "تعديل",
    export: "تصدير",
    download: "تنزيل",
    open: "فتح",
    status: "الحالة",
    actions: "الإجراءات",

    revenue: "الإيراد",
    orders: "الطلبات",
    aov: "متوسط الطلب",
    users: "المستخدمون",
    creators: "المبدعون",
    sellers: "البائعون",
    growth: "النمو",
    open_tickets: "التذاكر المفتوحة",
    open_reports: "البلاغات المفتوحة",
    incidents: "الحوادث",
    uptime: "التوافر",

    content_queue: "قائمة المحتوى",
    seller_queue: "قائمة البائعين",
    reported_item: "عنصر مُبلغ عنه",
    type: "النوع",
    risk: "المخاطر",
    reporter: "المبلّغ",
    time: "الوقت",
    approve: "موافقة",
    reject: "رفض",
    suspend: "إيقاف",
    reinstate: "إعادة تفعيل",
    product: "منتج",
    creator: "مبدع",
    message: "رسالة",
    active: "نشط",
    suspended: "موقوف",

    id: "المعرف",
    customer: "العميل",
    items: "المنتجات",
    total: "الإجمالي",
    placed: "تم الإنشاء",
    paid: "مدفوع",
    fulfilled: "تم التجهيز",
    delivered: "تم التسليم",
    refund: "استرداد",
    mark_paid: "تحديد كمدفوع",
    mark_fulfilled: "تحديد كمجهز",
    mark_delivered: "تحديد كمسلّم",

    support_center: "مركز الدعم",
    inbox: "الوارد",
    reply: "رد",
    assign: "تعيين",
    unassigned: "غير مُعيّن",
    priority: "الأولوية",
    high: "عالية",
    normal: "عادية",
    low: "منخفضة",
    ticket: "تذكرة",

    settings_title: "الإعدادات",
    language: "اللغة",
    theme: "السِّمات",
    pdpl_logging: "سجل نظام حماية البيانات السعودي",
    feature_flags: "خصائص تجريبية",
    flag_live: "البث المباشر",
    flag_ai: "إضافات الذكاء",
    flag_wallet: "الدفع بالمحفظة أولًا",
    data_export: "تصدير البيانات",
    reset_demo: "إعادة تعيين العرض",

    impersonate: "انتحال المستخدم",
    create_notice: "إشعار عام",
    notice_title: "إشعار عام",
    notice_body: "الرسالة",
    post_notice: "نشر",
    posted: "تم النشر",
  }
};
const LS_LANG = "storez_admin_lang";
function t(k){ const d=I18N[getLang()]||I18N.en; return d[k]??k; }
function getLang(){ return localStorage.getItem(LS_LANG) || "en"; }
function setLang(lang){
  const l=I18N[lang]?lang:"en";
  localStorage.setItem(LS_LANG,l);
  document.documentElement.lang = l==="ar"?"ar-SA":"en";
  document.documentElement.dir  = l==="ar"?"rtl":"ltr";
  document.querySelectorAll("[data-i18n]").forEach(el=>{ const k=el.getAttribute("data-i18n"); if(k) el.textContent=t(k); });
}
function fmtCurrency(n, code="SAR"){
  const loc = getLang()==="ar"?"ar-SA":"en";
  return new Intl.NumberFormat(loc,{style:"currency",currency:code,maximumFractionDigits:0}).format(Number(n)||0);
}
const fmtDate = ts => new Date(ts).toLocaleString(getLang()==="ar"?"ar-SA":"en");

/* -------------------- State & persistence -------------------- */
const LS_STATE = "storez_admin_state_v1";
const seed = () => ({
  prefs: { theme: "dark", pdpl: true, flags: { live:true, ai:true, wallet:true } },
  notices: [],
  impersonating: null, // {role:'buyer'|'seller'|'creator', id:'...'}
  metrics: { revenue: 145_200, orders: 1842, aov: 236, users: 420_000, creators: 2_800, sellers: 1_050, growth: 12.4, ticketsOpen: 7, reportsOpen: 5, incidents: 0, uptime: 99.98 },
  moderation: {
    content: [
      rep("p1","product","High","@sara","Misleading price"),
      rep("m7","message","Medium","@ali","Spam link"),
      rep("c5","creator","Low","@moh","Copyright worry")
    ],
    sellers: [
      seller("S-1003","Glow Co.","Active","High risk spike"),
      seller("S-1009","PhoneMods","Active","Chargeback wave")
    ]
  },
  orders: [
    order("A-1001","Maya A.",[{n:"Aura Serum",q:1,p:119}], "Paid"),
    order("A-1002","Saad M.",[{n:"CloudRunner",q:1,p:329}], "Fulfilled"),
    order("A-1003","Lina K.",[{n:"Holo Case",q:2,p:49}], "Placed")
  ],
  tickets: [
    ticket("T-501","Refund request for A-1001","High"),
    ticket("T-502","Address change on A-1003","Normal")
  ],
  pdplLogs: []
});
function rep(id,type,risk,by,reason){ return { id, type, risk, reporter:by, reason, ts: Date.now()-Math.random()*36e5, status:"Open" }; }
function seller(id,name,status, note){ return { id, name, status, note, ts: Date.now()-Math.random()*72e5 }; }
function order(id,customer,items,status="Placed"){ 
  const total = items.reduce((s,i)=>s+i.q*i.p,0);
  return { id, customer, items, total, status, ts: Date.now()-Math.random()*72e5 };
}
function ticket(id,subject,prio="Normal"){ return { id, subject, priority: prio, assignee: null, status:"Open", ts: Date.now()-Math.random()*48e5, thread: [] }; }

let state = load();
function load(){ try{ const raw=localStorage.getItem(LS_STATE); if(raw) return JSON.parse(raw); }catch{} const s=seed(); save(s); return s; }
function save(s=state){ try{ localStorage.setItem(LS_STATE, JSON.stringify(s)); }catch{} }
function reset(){ localStorage.removeItem(LS_STATE); state = seed(); save(); location.reload(); }

/* -------------------- DOM helpers & shell -------------------- */
const qs = (s,el=document)=>el.querySelector(s);
const qsa = (s,el=document)=>Array.from(el.querySelectorAll(s));
function html(strings,...vals){ return String.raw({raw:strings},...vals).trim(); }
function badge(el,n){ if(el) el.textContent=String(n); }
function setActive(path){ qsa("nav.bottom a").forEach(a=>a.classList.toggle("active", a.getAttribute("href")==="#"+path)); }

function showSheet(title, body){
  qs("#sheetTitle").textContent = title || "Sheet";
  qs("#sheetBody").innerHTML = body || "";
  const sh = qs("#sheet");
  sh.classList.add("show"); sh.setAttribute("aria-hidden","false");
}
function closeSheet(){
  const sh = qs("#sheet");
  sh.classList.remove("show"); sh.setAttribute("aria-hidden","true");
}
window.__closeSheet = closeSheet;

let toastTid=null;
function toast(msg){
  clearTimeout(toastTid);
  let tEl = qs("#_toast");
  if(!tEl){ tEl=document.createElement("div"); tEl.id="_toast"; tEl.className="toast"; document.body.appendChild(tEl); }
  tEl.textContent = msg; tEl.style.display="block";
  toastTid=setTimeout(()=>tEl.style.display="none", 1800);
}

/* -------------------- Routing -------------------- */
const routes = {
  "/overview": renderOverview,
  "/moderation": renderModeration,
  "/orders": renderOrders,
  "/support": renderSupport,
  "/settings": renderSettings
};
function parseHash(){
  const h = location.hash.slice(1) || "/overview";
  const parts = h.split("/").filter(Boolean);
  if(parts.length===1) return {path:"/"+parts[0], id:undefined};
  return {path:"/"+parts[0], id:parts[1]};
}
function route(){
  const {path,id} = parseHash();
  const fn = routes[path] || routes["/overview"];
  setActive(path);
  fn(id);
  qs("#view")?.focus();
}
window.addEventListener("hashchange", route);

/* -------------------- Views -------------------- */

function renderOverview(){
  const m = state.metrics;
  qs("#view").innerHTML = html`
    <section class="grid cols-3">
      <div class="metric"><div class="k">${fmtCurrency(m.revenue)}</div><div class="t">${t("revenue")}</div></div>
      <div class="metric"><div class="k">${m.orders}</div><div class="t">${t("orders")}</div></div>
      <div class="metric"><div class="k">${fmtCurrency(m.aov)}</div><div class="t">${t("aov")}</div></div>
      <div class="metric"><div class="k">${m.users.toLocaleString()}</div><div class="t">${t("users")}</div></div>
      <div class="metric"><div class="k">${m.creators.toLocaleString()}</div><div class="t">${t("creators")}</div></div>
      <div class="metric"><div class="k">${m.sellers.toLocaleString()}</div><div class="t">${t("sellers")}</div></div>
      <div class="metric"><div class="k">${m.growth.toFixed(1)}%</div><div class="t">${t("growth")}</div></div>
      <div class="metric"><div class="k">${m.ticketsOpen}</div><div class="t">${t("open_tickets")}</div></div>
      <div class="metric"><div class="k">${m.reportsOpen}</div><div class="t">${t("open_reports")}</div></div>
    </section>

    <section class="panel" style="margin-top:12px">
      <div class="row between"><strong>SLA</strong><span class="muted">${t("uptime")}: ${m.uptime}%</span></div>
      <div class="stack" style="margin-top:10px">
        <label>Moderation backlog<div class="progress"><span style="width:${Math.min(100, m.reportsOpen*15)}%"></span></div></label>
        <label>Support backlog<div class="progress"><span style="width:${Math.min(100, m.ticketsOpen*12)}%"></span></div></label>
      </div>
    </section>
  `;
  refreshBadges();
}

function renderModeration(){
  const tab = new URLSearchParams(location.hash.split("?")[1]||"").get("tab") || "content";
  const isContent = tab==="content";
  const contentRows = state.moderation.content.map(r=>`
    <tr>
      <td data-label="${t("reported_item")}"><strong>#${r.id}</strong></td>
      <td data-label="${t("type")}">${t(r.type)}</td>
      <td data-label="${t("risk")}"><span class="status ${r.risk==='High'?'failed':r.risk==='Medium'?'pending':'paid'}">${r.risk}</span></td>
      <td data-label="${t("reporter")}">${r.reporter}</td>
      <td data-label="${t("time")}">${fmtDate(r.ts)}</td>
      <td data-label="${t("actions")}">
        <button class="small ghost" data-act="approve" data-id="${r.id}">${t("approve")}</button>
        <button class="small ghost danger" data-act="reject" data-id="${r.id}">${t("reject")}</button>
      </td>
    </tr>`).join("");

  const sellerRows = state.moderation.sellers.map(s=>`
    <tr>
      <td data-label="ID"><strong>${s.id}</strong></td>
      <td data-label="${t("seller_queue")}">${s.name}</td>
      <td data-label="${t("status")}"><span class="status ${s.status==='Active'?'paid':'failed'}">${t(s.status.toLowerCase())||s.status}</span></td>
      <td data-label="Note" class="muted">${s.note}</td>
      <td data-label="${t("actions")}">
        ${s.status==='Active'
          ? `<button class="small ghost danger" data-act="suspend" data-id="${s.id}">${t("suspend")}</button>`
          : `<button class="small ghost" data-act="reinstate" data-id="${s.id}">${t("reinstate")}</button>`}
      </td>
    </tr>`).join("");

  qs("#view").innerHTML = html`
    <section class="panel">
      <div class="tabs">
        <a href="#/moderation?tab=content" class="${isContent?'active':''}">${t("content_queue")}</a>
        <a href="#/moderation?tab=sellers" class="${!isContent?'active':''}">${t("seller_queue")}</a>
      </div>
      <table class="table">
        <thead>
          ${isContent
            ? `<tr><th>${t("reported_item")}</th><th>${t("type")}</th><th>${t("risk")}</th><th>${t("reporter")}</th><th>${t("time")}</th><th>${t("actions")}</th></tr>`
            : `<tr><th>ID</th><th>${t("seller_queue")}</th><th>${t("status")}</th><th>Note</th><th>${t("actions")}</th></tr>`}
        </thead>
        <tbody>${isContent ? (contentRows || `<tr><td colspan="6">—</td></tr>`) : (sellerRows || `<tr><td colspan="5">—</td></tr>`)}</tbody>
      </table>
    </section>
  `;

  const host = qs("#view");
  host.addEventListener("click", (e)=>{
    const b = e.target.closest("button[data-act]"); if(!b) return;
    const id = b.getAttribute("data-id"); const act = b.getAttribute("data-act");
    if(act==="approve"||act==="reject"){
      state.moderation.content = state.moderation.content.filter(x=>x.id!==id);
      state.metrics.reportsOpen = Math.max(0, state.metrics.reportsOpen-1);
      save(); renderModeration(); toast(act==="approve"?"Approved":"Rejected");
    }
    if(act==="suspend"){
      const s = state.moderation.sellers.find(x=>x.id===id); if(s){ s.status="Suspended"; save(); renderModeration(); toast(t("suspended")); }
    }
    if(act==="reinstate"){
      const s = state.moderation.sellers.find(x=>x.id===id); if(s){ s.status="Active"; save(); renderModeration(); toast(t("active")); }
    }
  });
  refreshBadges();
}

function renderOrders(){
  const q = new URLSearchParams(location.hash.split("?")[1]||"");
  const term = (q.get("q")||"").toLowerCase();
  const list = state.orders.filter(o => (o.id+o.customer).toLowerCase().includes(term));

  const rows = list.map(o=>`
    <tr>
      <td data-label="${t("id")}"><a href="javascript:void(0)" onclick="__openOrder('${o.id}')"><strong>#${o.id}</strong></a></td>
      <td data-label="${t("customer")}">${o.customer}</td>
      <td data-label="${t("items")}">${o.items.map(i=>`${i.n}×${i.q}`).join(", ")}</td>
      <td data-label="${t("total")}">${fmtCurrency(o.total)}</td>
      <td data-label="${t("status")}"><span class="status ${o.status==='Paid'?'paid':'pending'}">${t(o.status.toLowerCase())||o.status}</span></td>
      <td data-label="${t("actions")}">
        ${o.status==="Placed"?`<button class="small ghost" onclick="__setOrder('${o.id}','Paid')">${t("mark_paid")}</button>`:""}
        ${o.status==="Paid"?`<button class="small ghost" onclick="__setOrder('${o.id}','Fulfilled')">${t("mark_fulfilled")}</button>`:""}
        ${o.status==="Fulfilled"?`<button class="small ghost" onclick="__setOrder('${o.id}','Delivered')">${t("mark_delivered")}</button>`:""}
        <button class="small ghost danger" onclick="__refund('${o.id}')">${t("refund")}</button>
      </td>
    </tr>`).join("");

  qs("#view").innerHTML = html`
    <section class="panel">
      <div class="row between">
        <strong>${t("nav_orders")}</strong>
        <div class="row">
          <input id="ord_q" placeholder="${t("search")}" value="${term || ""}" />
          <button class="small ghost" onclick="location.hash='#/orders?q='+encodeURIComponent(document.getElementById('ord_q').value)">Go</button>
        </div>
      </div>
      <table class="table">
        <thead><tr><th>${t("id")}</th><th>${t("customer")}</th><th>${t("items")}</th><th>${t("total")}</th><th>${t("status")}</th><th>${t("actions")}</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="6">—</td></tr>`}</tbody>
      </table>
    </section>
  `;
  refreshBadges();
}
window.__setOrder = (id,status)=>{ const o=state.orders.find(x=>x.id===id); if(o){ o.status=status; save(); route(); } };
window.__refund = (id)=>{ state.tickets.push(ticket("T-"+Math.floor(Math.random()*900+100), "Refund created for "+id, "High")); state.metrics.ticketsOpen++; save(); toast(t("refund")); route(); };
window.__openOrder = (id)=>{
  const o = state.orders.find(x=>x.id===id);
  if(!o) return;
  showSheet("#"+o.id, html`
    <div class="stack">
      <div class="muted">${fmtDate(o.ts)} · ${o.customer}</div>
      <div>${o.items.map(i=>`${i.n} × ${i.q} — <strong>${fmtCurrency(i.q*i.p)}</strong>`).join("<br/>")}</div>
      <hr/>
      <div class="row" style="gap:8px">
        <button class="secondary" onclick="__setOrder('${o.id}','Paid')">${t("mark_paid")}</button>
        <button class="ghost" onclick="__setOrder('${o.id}','Fulfilled')">${t("mark_fulfilled")}</button>
        <button class="ghost" onclick="__setOrder('${o.id}','Delivered')">${t("mark_delivered")}</button>
        <button class="ghost danger" onclick="__refund('${o.id}')">${t("refund")}</button>
      </div>
    </div>
  `);
};

function renderSupport(){
  const rows = state.tickets.map(x=>`
    <tr>
      <td data-label="${t("ticket")}"><strong>${x.id}</strong></td>
      <td data-label="Subject">${x.subject}</td>
      <td data-label="${t("priority")}"><span class="status ${x.priority==='High'?'failed':x.priority==='Low'?'paid':'pending'}">${t(x.priority.toLowerCase())}</span></td>
      <td data-label="Agent">${x.assignee || t("unassigned")}</td>
      <td data-label="${t("actions")}">
        <button class="small ghost" onclick="__assign('${x.id}')">${t("assign")}</button>
        <button class="small ghost" onclick="__reply('${x.id}')">${t("reply")}</button>
      </td>
    </tr>`).join("");

  qs("#view").innerHTML = html`
    <section class="panel">
      <div class="row between">
        <strong>${t("support_center")}</strong>
        <span class="chip">${t("open_tickets")}: ${state.metrics.ticketsOpen}</span>
      </div>
      <table class="table">
        <thead><tr><th>${t("ticket")}</th><th>Subject</th><th>${t("priority")}</th><th>Agent</th><th>${t("actions")}</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="5">—</td></tr>`}</tbody>
      </table>
    </section>
  `;
  refreshBadges();
}
window.__assign = (id)=>{
  const a = prompt("Agent name?");
  const tix = state.tickets.find(x=>x.id===id);
  if(!tix) return;
  tix.assignee = a || tix.assignee || "Agent A";
  save(); route();
};
window.__reply = (id)=>{
  const tix = state.tickets.find(x=>x.id===id); if(!tix) return;
  showSheet(t("reply"), html`
    <div class="stack">
      <textarea id="r_body" rows="4" placeholder="Type reply…"></textarea>
      <div class="row right" style="gap:8px">
        <button class="ghost" onclick="__closeSheet()">${t("cancel")}</button>
        <button class="secondary" onclick="(function(){ const v=document.getElementById('r_body').value.trim(); if(!v) return; tix.thread.push({from:'Admin', text:v, ts:Date.now()}); toast('Sent'); save(); __closeSheet(); })()">${t("reply")}</button>
      </div>
    </div>
  `);
};

function renderSettings(){
  const p = state.prefs;
  qs("#view").innerHTML = html`
    <section class="panel">
      <strong>${t("settings_title")}</strong>
      <div class="grid cols-2" style="margin-top:10px">
        <div class="panel">
          <label>${t("language")}
            <select id="s_lang">
              <option value="en" ${getLang()==="en"?"selected":""}>English</option>
              <option value="ar" ${getLang()==="ar"?"selected":""}>العربية (السعودية)</option>
            </select>
          </label>
          <label style="margin-top:8px">${t("theme")}
            <select id="s_theme">
              <option value="auto">Auto</option>
              <option value="light">Light</option>
              <option value="dark" ${p.theme==="dark"?"selected":""}>Dark</option>
              <option value="emerald" ${p.theme==="emerald"?"selected":""}>Emerald</option>
              <option value="purple" ${p.theme==="purple"?"selected":""}>Purple</option>
              <option value="contrast" ${p.theme==="contrast"?"selected":""}>High Contrast</option>
            </select>
          </label>
          <label style="margin-top:8px"><input type="checkbox" id="s_pdpl" ${p.pdpl?"checked":""}/> ${t("pdpl_logging")}</label>
        </div>

        <div class="panel">
          <strong>${t("feature_flags")}</strong>
          <label><input type="checkbox" id="f_live" ${p.flags.live?"checked":""}/> ${t("flag_live")}</label>
          <label><input type="checkbox" id="f_ai" ${p.flags.ai?"checked":""}/> ${t("flag_ai")}</label>
          <label><input type="checkbox" id="f_wallet" ${p.flags.wallet?"checked":""}/> ${t("flag_wallet")}</label>
        </div>
      </div>

      <section class="panel" style="margin-top:12px">
        <strong>${t("data_export")}</strong>
        <div class="row" style="gap:8px; margin-top:8px">
          <button class="ghost" onclick="__downloadJSON()">${t("download")}</button>
          <button class="ghost danger" onclick="__resetDemo()">${t("reset_demo")}</button>
        </div>
      </section>
    </section>
  `;

  qs("#s_lang").onchange = (e)=>{ setLang(e.target.value); route(); };
  qs("#s_theme").onchange = (e)=>applyTheme(e.target.value);
  qs("#s_pdpl").onchange = (e)=>{ state.prefs.pdpl = e.target.checked; save(); logPDPL("pdpl_toggle", {enabled:e.target.checked}); };
  qs("#f_live").onchange = (e)=>{ state.prefs.flags.live = e.target.checked; save(); };
  qs("#f_ai").onchange = (e)=>{ state.prefs.flags.ai = e.target.checked; save(); };
  qs("#f_wallet").onchange = (e)=>{ state.prefs.flags.wallet = e.target.checked; save(); };
}
window.__downloadJSON = ()=>{
  const blob = new Blob([JSON.stringify(state,null,2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download="storez-admin-export.json"; a.click();
  URL.revokeObjectURL(url);
};
window.__resetDemo = reset;

/* -------------------- Header wiring & badges -------------------- */
function refreshBadges(){
  badge(qs("#ordersBadge"), state.orders.length);
  badge(qs("#ticketsBadge"), state.tickets.length);
}
function applyTheme(theme){
  const applied = theme==="auto" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark":"light") : theme;
  document.documentElement.setAttribute("data-theme", applied);
  qs("#metaThemeColor")?.setAttribute("content", getComputedStyle(document.documentElement).getPropertyValue("--bg").trim());
  state.prefs.theme = theme; save();
}
function wireHeader(){
  const langSelect = qs("#langSelect"); langSelect.value=getLang(); langSelect.addEventListener("change",e=>{ setLang(e.target.value); route(); });
  const themeSelect= qs("#themeSelect"); themeSelect.value=state.prefs.theme||"dark"; themeSelect.addEventListener("change",e=>applyTheme(e.target.value));

  qs("#btnImpersonate")?.addEventListener("click", ()=> {
    showSheet(t("impersonate"), html`
      <div class="stack">
        <label>Role<select id="imp_role"><option>buyer</option><option>seller</option><option>creator</option></select></label>
        <label>ID<input id="imp_id" placeholder="u123 / s900 / c45"/></label>
        <div class="row right" style="gap:8px">
          <button class="ghost" onclick="__closeSheet()">${t("cancel")}</button>
          <button class="secondary" onclick="(function(){ state.impersonating={role:document.getElementById('imp_role').value,id:document.getElementById('imp_id').value||'demo'}; save(); document.getElementById('envChip').textContent='Impersonating '+state.impersonating.role; __closeSheet(); })()">${t("start")}</button>
        </div>
      </div>
    `);
  });

  qs("#btnCreateNotice")?.addEventListener("click", ()=>{
    showSheet(t("notice_title"), html`
      <div class="stack">
        <input id="n_title" placeholder="${t("notice_title")}" />
        <textarea id="n_body" rows="4" placeholder="${t("notice_body")}"></textarea>
        <div class="row right" style="gap:8px">
          <button class="ghost" onclick="__closeSheet()">${t("cancel")}</button>
          <button class="secondary" onclick="(function(){ const title=document.getElementById('n_title').value||'Notice'; const body=document.getElementById('n_body').value||''; state.notices.unshift({id:'N-'+(state.notices.length+1), title, body, ts:Date.now()}); save(); toast(t('posted')); __closeSheet(); })()">${t("post_notice")}</button>
        </div>
      </div>
    `);
  });

  qs("#btnReset")?.addEventListener("click", reset);
}

/* -------------------- PDPL logging (demo) -------------------- */
function logPDPL(event, payload){
  if(!state.prefs.pdpl) return;
  state.pdplLogs.push({event, payload, ts: Date.now()});
  save();
}

/* -------------------- Boot -------------------- */
function boot(){
  setLang(getLang());
  applyTheme(state.prefs.theme || "dark");
  qs("#envChip").textContent = state.impersonating ? ("Impersonating "+state.impersonating.role) : t("demo");
  wireHeader();
  refreshBadges();
  route();
}
document.addEventListener("DOMContentLoaded", boot);
