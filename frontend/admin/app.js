/* admin.app.js — StoreZ Admin Console (SPA, single module)
   Destinations: Overview, Moderation, Orders, Support, Settings.
   Includes EN/AR (Saudi) text, RTL, theme switch, notices, impersonation.
*/

/* -------------------- i18n (EN / AR—Saudi) -------------------- */
const I18N = {
  en: {
    nav_overview: "Overview",
    nav_creators: "Creators",
    nav_live: "Live Commerce",
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
    ugc_queue: "UGC Queue",
    live_queue: "Live Sessions",
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
    ugc_post: "UGC Post",
    live_stream: "Live Stream",
    active: "Active",
    suspended: "Suspended",
    view_details: "View Details",
    take_action: "Take Action",
    escalate: "Escalate",
    content_details: "Content Details",
    moderation_history: "Moderation History",
    live_session_control: "Live Session Control",

    // Creator Management
    creators: "Creators",
    creator_applications: "Creator Applications", 
    active_creators: "Active Creators",
    creator_onboarding: "Creator Onboarding",
    applications: "Applications",
    pending: "Pending",
    approved: "Approved",
    under_review: "Under Review",
    followers: "Followers",
    category: "Category",
    applied_date: "Applied Date",
    documents: "Documents",
    tier: "Tier",
    performance: "Performance",
    total_sales: "Total Sales",
    products_listed: "Products Listed",
    live_sessions: "Live Sessions",
    avg_rating: "Avg Rating",
    creator_stats: "Creator Stats",
    onboard_creator: "Onboard Creator",
    verify_documents: "Verify Documents",
    creator_profile: "Creator Profile",

    // Live Commerce Operations
    live_commerce: "Live Commerce",
    active_sessions: "Active Sessions", 
    scheduled_sessions: "Scheduled Sessions",
    session_history: "Session History",
    live_operations: "Live Operations",
    session_title: "Session Title",
    viewers: "Viewers",
    duration: "Duration",
    revenue: "Revenue", 
    emergency_stop: "Emergency Stop",
    session_details: "Session Details",
    chat_moderation: "Chat Moderation",
    technical_support: "Technical Support",
    stream_quality: "Stream Quality",
    end_session: "End Session",

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
    nav_creators: "المبدعون",
    nav_live: "التجارة المباشرة",
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
    ugc_queue: "قائمة المحتوى المُنشأ",
    live_queue: "الجلسات المباشرة",
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
    ugc_post: "منشور مُنشأ",
    live_stream: "بث مباشر",
    active: "نشط",
    suspended: "موقوف",
    view_details: "عرض التفاصيل",
    take_action: "اتخاذ إجراء",
    escalate: "تصعيد",
    content_details: "تفاصيل المحتوى",
    moderation_history: "تاريخ الإشراف",
    live_session_control: "التحكم في الجلسة المباشرة",

    // Creator Management
    creator_applications: "طلبات المبدعين",
    active_creators: "المبدعون النشطون",
    creator_onboarding: "إدراج المبدعين",
    applications: "الطلبات",
    pending: "قيد الانتظار",
    approved: "موافق عليه",
    under_review: "قيد المراجعة",
    followers: "المتابعون",
    category: "الفئة",
    applied_date: "تاريخ التقديم",
    documents: "المستندات",
    tier: "المستوى",
    performance: "الأداء",
    total_sales: "إجمالي المبيعات",
    products_listed: "المنتجات المدرجة",
    live_sessions: "الجلسات المباشرة",
    avg_rating: "متوسط التقييم",
    creator_stats: "إحصائيات المبدعين",
    onboard_creator: "إدراج مبدع",
    verify_documents: "التحقق من المستندات",
    creator_profile: "ملف المبدع",

    // Live Commerce Operations
    live_commerce: "التجارة المباشرة",
    active_sessions: "الجلسات النشطة",
    scheduled_sessions: "الجلسات المجدولة", 
    session_history: "تاريخ الجلسات",
    live_operations: "العمليات المباشرة",
    session_title: "عنوان الجلسة",
    viewers: "المشاهدون",
    duration: "المدة",
    emergency_stop: "إيقاف طارئ",
    session_details: "تفاصيل الجلسة", 
    chat_moderation: "إشراف الدردشة",
    technical_support: "الدعم التقني",
    stream_quality: "جودة البث",
    end_session: "إنهاء الجلسة",

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
  creators: {
    applications: [
      {id:"CR001", name:"Sarah Al-Mahmoud", email:"sarah.m@email.com", followers:15400, category:"Fashion", status:"Pending", appliedAt:new Date("2024-12-15").getTime(), documents:["ID","Portfolio"], note:"Strong engagement rate"},
      {id:"CR002", name:"Ahmed Hassan", email:"ahmed.h@email.com", followers:8900, category:"Tech", status:"Approved", appliedAt:new Date("2024-12-10").getTime(), documents:["ID","Portfolio","Contract"], note:"Approved for electronics category"},
      {id:"CR003", name:"Fatima Al-Zahra", email:"fatima.z@email.com", followers:22100, category:"Beauty", status:"Under Review", appliedAt:new Date("2024-12-18").getTime(), documents:["ID"], note:"Pending document verification"}
    ],
    activeCreators: [
      {id:"CR010", name:"Layla Fashion", email:"layla@email.com", followers:45600, totalSales:156780, avgRating:4.8, productsListed:67, liveSessionsMonth:12, status:"Active", tier:"Gold", joinedAt:new Date("2024-08-15").getTime()},
      {id:"CR011", name:"Tech Omar", email:"omar.tech@email.com", followers:31200, totalSales:89340, avgRating:4.6, productsListed:23, liveSessionsMonth:8, status:"Active", tier:"Silver", joinedAt:new Date("2024-09-20").getTime()},
      {id:"CR012", name:"Beauty by Nour", email:"nour.beauty@email.com", followers:67800, totalSales:234560, avgRating:4.9, productsListed:89, liveSessionsMonth:15, status:"Warning", tier:"Platinum", joinedAt:new Date("2024-07-10").getTime()}
    ],
    stats: {
      totalApplications: 47,
      pendingReview: 12,
      approvedThisMonth: 8,
      activeCreators: 156,
      topTier: 23,
      avgApprovalTime: "3.2 days",
      creatorRetention: "87%"
    }
  },
  liveCommerce: {
    activeSessions: [
      {id:"LIVE001", creatorId:"CR010", creatorName:"Layla Fashion", title:"Summer Fashion Haul - Live Shopping", viewers:1247, duration:23, startTime:new Date().getTime()-23*60*1000, status:"Live", products:[{id:"P1",name:"Summer Dress",sales:12,views:890},{id:"P2",name:"Sandals",sales:8,views:567}], revenue:2340, chatMessages:456, moderationFlags:0},
      {id:"LIVE002", creatorId:"CR011", creatorName:"Tech Omar", title:"Latest Gadgets Review & Sale", viewers:892, duration:18, startTime:new Date().getTime()-18*60*1000, status:"Live", products:[{id:"P3",name:"Wireless Earbuds",sales:15,views:623},{id:"P4",name:"Phone Case",sales:23,views:445}], revenue:1890, chatMessages:234, moderationFlags:1},
      {id:"LIVE003", creatorId:"CR012", creatorName:"Beauty by Nour", title:"Skincare Routine Live Demo", viewers:2156, duration:35, startTime:new Date().getTime()-35*60*1000, status:"Live", products:[{id:"P5",name:"Face Serum",sales:45,views:1123},{id:"P6",name:"Moisturizer",sales:38,views:987}], revenue:4520, chatMessages:789, moderationFlags:0}
    ],
    scheduledSessions: [
      {id:"SCHED001", creatorId:"CR010", creatorName:"Layla Fashion", title:"Evening Wear Collection Launch", scheduledTime:new Date().getTime()+2*60*60*1000, estimatedDuration:60, status:"Scheduled", products:12},
      {id:"SCHED002", creatorId:"CR015", creatorName:"Home Decor Hub", title:"Interior Design Tips & Products", scheduledTime:new Date().getTime()+4*60*60*1000, estimatedDuration:45, status:"Scheduled", products:8}
    ],
    recentSessions: [
      {id:"HIST001", creatorId:"CR011", creatorName:"Tech Omar", title:"Holiday Tech Deals", endTime:new Date().getTime()-2*60*60*1000, duration:42, totalViewers:3456, revenue:8940, status:"Completed"},
      {id:"HIST002", creatorId:"CR010", creatorName:"Layla Fashion", title:"Winter Fashion Trends", endTime:new Date().getTime()-6*60*60*1000, duration:38, totalViewers:2890, revenue:6750, status:"Completed"}
    ],
    stats: {
      totalSessionsToday: 8,
      activeSessions: 3,
      totalViewersOnline: 4295,
      revenueToday: 34567,
      averageSessionLength: 42,
      conversionRate: 12.8,
      emergencyStops: 0,
      moderationActions: 2
    }
  },
  moderation: {
    content: [
      rep("ugc1","ugc_post","High","@sara_k","Inappropriate content in product review"),
      rep("ugc2","ugc_post","Medium","@maya_style","Potential fake testimonial"),
      rep("live1","live_stream","High","@techsaudi","Inappropriate behavior during live session"),
      rep("p1","product","Medium","@customer123","Misleading product claims"),
      rep("m7","message","Low","@ali","Spam in creator DMs"),
      rep("c5","creator","Medium","@moh","Copyright infringement in posts"),
      rep("ugc3","ugc_post","Low","@styleuser","Minor content guideline violation"),
      rep("live2","live_stream","Medium","@fashionista","Inappropriate language in live chat")
    ],
    sellers: [
      seller("S-1003","Glow Co.","Active","High risk spike - unusual order patterns"),
      seller("S-1009","PhoneMods","Active","Chargeback wave - investigating"),
      seller("S-1015","StyleHub","Suspended","Multiple UGC policy violations"),
      seller("S-1021","TechGear","Active","Under review for fake reviews")
    ],
    ugcStats: {
      totalPosts: 1247,
      pendingReview: 23,
      approvedToday: 89,
      rejectedToday: 7,
      flaggedContent: 12,
      averageReviewTime: 3.2
    },
    liveStats: {
      activeSessions: 5,
      totalViewers: 2847,
      moderationActions: 12,
      emergencyStops: 0,
      averageSessionLength: 45
    }
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
  "/creators": renderCreators,
  "/live": renderLiveCommerce,
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

function renderCreators(){
  const tab = new URLSearchParams(location.hash.split("?")[1]||"").get("tab") || "applications";
  const isApplications = tab==="applications";
  const isActive = tab==="active";
  
  // Enhanced creator application rows with social commerce context
  const applicationRows = state.creators.applications.map(app=>{
    const statusColor = app.status === 'Approved' ? 'paid' : 
                       app.status === 'Pending' ? 'pending' : 'failed';
    const documentsStatus = app.documents.length >= 2 ? '✅' : '⚠️';
    
    return `
      <tr>
        <td data-label="ID"><strong>${app.id}</strong></td>
        <td data-label="${t("creator")}">${app.name}</td>
        <td data-label="${t("followers")}">${app.followers.toLocaleString()}</td>
        <td data-label="${t("category")}">${app.category}</td>
        <td data-label="${t("status")}"><span class="status ${statusColor}">${t(app.status.toLowerCase().replace(' ', '_'))}</span></td>
        <td data-label="${t("documents")}">${documentsStatus} ${app.documents.length}/3</td>
        <td data-label="${t("applied_date")}">${fmtDate(app.appliedAt)}</td>
        <td data-label="${t("actions")}" style="min-width:200px">
          <button class="small ghost" data-act="view-app" data-id="${app.id}">${t("view_details")}</button>
          ${app.status === 'Pending' ? `
            <button class="small secondary" data-act="approve-app" data-id="${app.id}">${t("approve")}</button>
            <button class="small ghost danger" data-act="reject-app" data-id="${app.id}">${t("reject")}</button>
          ` : ''}
        </td>
      </tr>`;
  }).join("");

  // Enhanced active creator rows with performance metrics
  const activeRows = state.creators.activeCreators.map(creator=>{
    const statusColor = creator.status === 'Active' ? 'paid' : 'failed';
    const tierBadge = creator.tier === 'Platinum' ? 'style="background:var(--good);color:white"' :
                     creator.tier === 'Gold' ? 'style="background:#ffd700;color:black"' :
                     'style="background:var(--muted);color:white"';

    return `
      <tr>
        <td data-label="ID"><strong>${creator.id}</strong></td>
        <td data-label="${t("creator")}">
          ${creator.name}
          <br><span class="chip" ${tierBadge}>${creator.tier}</span>
        </td>
        <td data-label="${t("followers")}">${creator.followers.toLocaleString()}</td>
        <td data-label="${t("total_sales")}">${fmtCurrency(creator.totalSales)}</td>
        <td data-label="${t("products_listed")}">${creator.productsListed}</td>
        <td data-label="${t("live_sessions")}">${creator.liveSessionsMonth}/month</td>
        <td data-label="${t("avg_rating")}">${creator.avgRating} ⭐</td>
        <td data-label="${t("status")}"><span class="status ${statusColor}">${t(creator.status.toLowerCase())}</span></td>
        <td data-label="${t("actions")}" style="min-width:200px">
          <button class="small ghost" data-act="view-creator" data-id="${creator.id}">${t("view_details")}</button>
          ${creator.status === 'Active' && creator.status !== 'Warning' ? 
            `<button class="small ghost danger" data-act="warn-creator" data-id="${creator.id}">Warn</button>` :
            `<button class="small secondary" data-act="clear-warning" data-id="${creator.id}">Clear Warning</button>`}
        </td>
      </tr>`;
  }).join("");

  // Creator management stats
  const stats = state.creators.stats;

  qs("#view").innerHTML = html`
    <section class="panel">
      <!-- Enhanced Tab Navigation -->
      <div class="tabs">
        <a href="#/creators?tab=applications" class="${isApplications?'active':''}">${t("creator_applications")} (${state.creators.applications.length})</a>
        <a href="#/creators?tab=active" class="${isActive?'active':''}">${t("active_creators")} (${state.creators.activeCreators.length})</a>
      </div>
      
      <!-- Creator Management Stats Dashboard -->
      <div class="grid cols-4" style="margin:16px 0; gap:12px">
        <div class="metric">
          <div class="k">${stats.totalApplications}</div>
          <div class="t">Total Applications</div>
        </div>
        <div class="metric">
          <div class="k">${stats.pendingReview}</div>
          <div class="t">Pending Review</div>
        </div>
        <div class="metric">
          <div class="k">${stats.approvedThisMonth}</div>
          <div class="t">Approved This Month</div>
        </div>
        <div class="metric">
          <div class="k">${stats.avgApprovalTime}</div>
          <div class="t">Avg Approval Time</div>
        </div>
        <div class="metric">
          <div class="k">${stats.activeCreators}</div>
          <div class="t">Active Creators</div>
        </div>
        <div class="metric">
          <div class="k">${stats.topTier}</div>
          <div class="t">Top Tier Creators</div>
        </div>
        <div class="metric">
          <div class="k">${stats.creatorRetention}</div>
          <div class="t">Creator Retention</div>
        </div>
        <div class="metric">
          <div class="k" style="color:var(--good)">+${stats.approvedThisMonth}</div>
          <div class="t">Monthly Growth</div>
        </div>
      </div>
      
      <!-- Enhanced Creator Table -->
      <table class="table">
        <thead>
          ${isApplications
            ? `<tr><th>ID</th><th>${t("creator")}</th><th>${t("followers")}</th><th>${t("category")}</th><th>${t("status")}</th><th>${t("documents")}</th><th>${t("applied_date")}</th><th>${t("actions")}</th></tr>`
            : `<tr><th>ID</th><th>${t("creator")}</th><th>${t("followers")}</th><th>${t("total_sales")}</th><th>${t("products_listed")}</th><th>${t("live_sessions")}</th><th>${t("avg_rating")}</th><th>${t("status")}</th><th>${t("actions")}</th></tr>`}
        </thead>
        <tbody>${isApplications ? (applicationRows || `<tr><td colspan="8">—</td></tr>`) : (activeRows || `<tr><td colspan="9">—</td></tr>`)}</tbody>
      </table>
    </section>
  `;

  const host = qs("#view");
  host.addEventListener("click", (e)=>{
    const b = e.target.closest("button[data-act]"); if(!b) return;
    const id = b.getAttribute("data-id"); const act = b.getAttribute("data-act");
    
    if(act==="approve-app"){
      const app = state.creators.applications.find(x=>x.id===id);
      if(app) {
        app.status = "Approved";
        state.creators.stats.approvedThisMonth += 1;
        state.creators.stats.pendingReview -= 1;
        save(); renderCreators(); toast("Creator application approved");
      }
    }
    if(act==="reject-app"){
      if(confirm("Reject this creator application?")) {
        state.creators.applications = state.creators.applications.filter(x=>x.id!==id);
        state.creators.stats.pendingReview -= 1;
        save(); renderCreators(); toast("Application rejected");
      }
    }
    if(act==="view-app"){
      const app = state.creators.applications.find(x=>x.id===id);
      if(app) showCreatorApplicationDetails(app);
    }
    if(act==="view-creator"){
      const creator = state.creators.activeCreators.find(x=>x.id===id);
      if(creator) showCreatorProfile(creator);
    }
    if(act==="warn-creator"){
      const creator = state.creators.activeCreators.find(x=>x.id===id);
      if(creator) {
        creator.status = "Warning";
        save(); renderCreators(); toast("Warning issued to creator");
      }
    }
    if(act==="clear-warning"){
      const creator = state.creators.activeCreators.find(x=>x.id===id);
      if(creator) {
        creator.status = "Active";
        save(); renderCreators(); toast("Warning cleared");
      }
    }
  });
  refreshBadges();
}

// Enhanced creator management detail sheets
function showCreatorApplicationDetails(app) {
  const documentsStatus = app.documents.map(doc => 
    `<span class="chip" style="background:var(--good);color:white;font-size:10px;margin:2px">${doc}</span>`
  ).join(' ');
  
  const missingDocs = ['ID', 'Portfolio', 'Contract'].filter(doc => !app.documents.includes(doc));
  const missingDocsHtml = missingDocs.length > 0 ? 
    `<div style="margin:8px 0"><strong>Missing:</strong> ${missingDocs.map(doc => 
      `<span class="chip" style="background:var(--bad);color:white;font-size:10px;margin:2px">${doc}</span>`
    ).join(' ')}</div>` : '';

  showSheet(`
    <h3>Creator Application - ${app.name}</h3>
    
    <div class="grid cols-2" style="gap:12px; margin:16px 0">
      <div><strong>Application ID:</strong> ${app.id}</div>
      <div><strong>Status:</strong> <span class="status ${app.status==='Approved'?'paid':app.status==='Pending'?'pending':'failed'}">${app.status}</span></div>
      <div><strong>Email:</strong> ${app.email}</div>
      <div><strong>Category:</strong> ${app.category}</div>
      <div><strong>Followers:</strong> ${app.followers.toLocaleString()}</div>
      <div><strong>Applied:</strong> ${fmtDate(app.appliedAt)}</div>
    </div>
    
    <div style="margin:16px 0">
      <strong>Admin Note:</strong><br>
      "${app.note}"
    </div>

    <div style="margin:16px 0">
      <strong>Documents Submitted:</strong><br>
      ${documentsStatus}
      ${missingDocsHtml}
    </div>
    
    <div class="metric-grid" style="margin:16px 0">
      <div class="metric">
        <div class="k">${(app.followers / 1000).toFixed(1)}K</div>
        <div class="t">Followers</div>
      </div>
      <div class="metric">
        <div class="k">4.3</div>
        <div class="t">Engagement Rate</div>
      </div>
      <div class="metric">
        <div class="k">156</div>
        <div class="t">Posts Last 30d</div>
      </div>
    </div>
    
    <div class="flex" style="gap:12px; margin-top:24px">
      ${app.status === 'Pending' ? `
        <button class="btn secondary flex-1" onclick="approveCreatorApp('${app.id}')">
          ${t("approve")} Application
        </button>
        <button class="btn ghost danger flex-1" onclick="rejectCreatorApp('${app.id}')">
          ${t("reject")} Application
        </button>
      ` : `
        <button class="btn ghost" onclick="hideSheet()">Close</button>
      `}
    </div>
  `);
}

function showCreatorProfile(creator) {
  showSheet(`
    <h3>Creator Profile - ${creator.name}</h3>
    
    <div class="grid cols-2" style="gap:12px; margin:16px 0">
      <div><strong>Creator ID:</strong> ${creator.id}</div>
      <div><strong>Tier:</strong> <span class="chip" style="background:${creator.tier==='Platinum'?'var(--good)':creator.tier==='Gold'?'#ffd700':'var(--muted)'};color:${creator.tier==='Gold'?'black':'white'}">${creator.tier}</span></div>
      <div><strong>Email:</strong> ${creator.email}</div>
      <div><strong>Status:</strong> <span class="status ${creator.status==='Active'?'paid':'failed'}">${creator.status}</span></div>
      <div><strong>Joined:</strong> ${fmtDate(creator.joinedAt)}</div>
      <div><strong>Followers:</strong> ${creator.followers.toLocaleString()}</div>
    </div>
    
    <div class="metric-grid" style="margin:16px 0">
      <div class="metric">
        <div class="k">${fmtCurrency(creator.totalSales)}</div>
        <div class="t">Total Sales</div>
      </div>
      <div class="metric">
        <div class="k">${creator.productsListed}</div>
        <div class="t">Products Listed</div>
      </div>
      <div class="metric">
        <div class="k">${creator.liveSessionsMonth}</div>
        <div class="t">Live Sessions/Month</div>
      </div>
      <div class="metric">
        <div class="k">${creator.avgRating}</div>
        <div class="t">Avg Rating ⭐</div>
      </div>
    </div>

    <div style="margin:16px 0">
      <strong>Recent Activity:</strong><br>
      <div style="background:var(--bg2); padding:12px; border-radius:8px; margin:8px 0">
        • Posted 3 new products this week<br>
        • Completed 2 live shopping sessions<br>
        • Responded to all customer inquiries within 2 hours<br>
        • Maintained 4.8+ rating across all products
      </div>
    </div>
    
    <div class="flex" style="gap:12px; margin-top:24px">
      ${creator.status === 'Active' ? `
        <button class="btn ghost danger flex-1" onclick="warnCreator('${creator.id}')">
          Issue Warning
        </button>
      ` : `
        <button class="btn secondary flex-1" onclick="clearCreatorWarning('${creator.id}')">
          Clear Warning
        </button>
      `}
      <button class="btn ghost" onclick="hideSheet()">Close</button>
    </div>
  `);
}

// Quick action functions for creator management
function approveCreatorApp(id) {
  const app = state.creators.applications.find(x=>x.id===id);
  if(app) {
    app.status = "Approved";
    state.creators.stats.approvedThisMonth += 1;
    state.creators.stats.pendingReview = Math.max(0, state.creators.stats.pendingReview - 1);
    save(); hideSheet(); renderCreators(); toast("Creator application approved");
  }
}

function rejectCreatorApp(id) {
  if(confirm("Reject this creator application? This action cannot be undone.")) {
    state.creators.applications = state.creators.applications.filter(x=>x.id!==id);
    state.creators.stats.pendingReview = Math.max(0, state.creators.stats.pendingReview - 1);
    save(); hideSheet(); renderCreators(); toast("Application rejected");
  }
}

function warnCreator(id) {
  const creator = state.creators.activeCreators.find(x=>x.id===id);
  if(creator) {
    creator.status = "Warning";
    save(); hideSheet(); renderCreators(); toast("Warning issued to creator");
  }
}

function clearCreatorWarning(id) {
  const creator = state.creators.activeCreators.find(x=>x.id===id);
  if(creator) {
    creator.status = "Active";
    save(); hideSheet(); renderCreators(); toast("Warning cleared");
  }
}

function renderLiveCommerce(){
  const tab = new URLSearchParams(location.hash.split("?")[1]||"").get("tab") || "active";
  const isActive = tab==="active";
  const isScheduled = tab==="scheduled";
  const isHistory = tab==="history";
  
  // Format duration helper
  const formatDuration = (minutes) => `${Math.floor(minutes/60)}h ${minutes%60}m`;
  const formatTime = (timestamp) => new Date(timestamp).toLocaleTimeString(getLang()==="ar"?"ar-SA":"en", {hour:'2-digit', minute:'2-digit'});
  
  // Enhanced active session rows with real-time monitoring
  const activeRows = state.liveCommerce.activeSessions.map(session=>{
    const statusColor = session.status === 'Live' ? 'paid' : 'pending';
    const flagsWarning = session.moderationFlags > 0 ? 'style="color:var(--bad)"' : '';
    
    return `
      <tr>
        <td data-label="ID"><strong>${session.id}</strong></td>
        <td data-label="${t("creator")}">${session.creatorName}</td>
        <td data-label="${t("session_title")}">${session.title}</td>
        <td data-label="${t("viewers")}" style="font-weight:bold;color:var(--good)">${session.viewers.toLocaleString()}</td>
        <td data-label="${t("duration")}">${formatDuration(session.duration)}</td>
        <td data-label="${t("revenue")}">${fmtCurrency(session.revenue)}</td>
        <td data-label="Chat" ${flagsWarning}>${session.chatMessages} ${session.moderationFlags > 0 ? '⚠️' : ''}</td>
        <td data-label="${t("status")}"><span class="status ${statusColor}">🔴 ${session.status}</span></td>
        <td data-label="${t("actions")}" style="min-width:250px">
          <button class="small ghost" data-act="view-session" data-id="${session.id}">${t("session_details")}</button>
          <button class="small secondary" data-act="moderate-chat" data-id="${session.id}">Chat</button>
          <button class="small danger" data-act="emergency-stop" data-id="${session.id}">${t("emergency_stop")}</button>
        </td>
      </tr>`;
  }).join("");

  // Enhanced scheduled session rows
  const scheduledRows = state.liveCommerce.scheduledSessions.map(session=>{
    const timeUntil = Math.floor((session.scheduledTime - Date.now()) / (60*1000));
    const timeDisplay = timeUntil > 60 ? `${Math.floor(timeUntil/60)}h ${timeUntil%60}m` : `${timeUntil}m`;
    
    return `
      <tr>
        <td data-label="ID"><strong>${session.id}</strong></td>
        <td data-label="${t("creator")}">${session.creatorName}</td>
        <td data-label="${t("session_title")}">${session.title}</td>
        <td data-label="Start Time">${formatTime(session.scheduledTime)}</td>
        <td data-label="Time Until">in ${timeDisplay}</td>
        <td data-label="Products">${session.products} items</td>
        <td data-label="${t("status")}"><span class="status pending">${session.status}</span></td>
        <td data-label="${t("actions")}" style="min-width:200px">
          <button class="small ghost" data-act="view-scheduled" data-id="${session.id}">${t("view_details")}</button>
          <button class="small secondary" data-act="start-early" data-id="${session.id}">Start Early</button>
        </td>
      </tr>`;
  }).join("");

  // Enhanced session history rows
  const historyRows = state.liveCommerce.recentSessions.map(session=>{
    const statusColor = session.status === 'Completed' ? 'paid' : 'failed';
    
    return `
      <tr>
        <td data-label="ID"><strong>${session.id}</strong></td>
        <td data-label="${t("creator")}">${session.creatorName}</td>
        <td data-label="${t("session_title")}">${session.title}</td>
        <td data-label="End Time">${formatTime(session.endTime)}</td>
        <td data-label="${t("duration")}">${formatDuration(session.duration)}</td>
        <td data-label="Total Viewers">${session.totalViewers.toLocaleString()}</td>
        <td data-label="${t("revenue")}">${fmtCurrency(session.revenue)}</td>
        <td data-label="${t("status")}"><span class="status ${statusColor}">${session.status}</span></td>
        <td data-label="${t("actions")}">
          <button class="small ghost" data-act="view-analytics" data-id="${session.id}">Analytics</button>
        </td>
      </tr>`;
  }).join("");

  // Live commerce stats
  const stats = state.liveCommerce.stats;

  qs("#view").innerHTML = html`
    <section class="panel">
      <!-- Enhanced Tab Navigation -->
      <div class="tabs">
        <a href="#/live?tab=active" class="${isActive?'active':''}">${t("active_sessions")} (${state.liveCommerce.activeSessions.length})</a>
        <a href="#/live?tab=scheduled" class="${isScheduled?'active':''}">${t("scheduled_sessions")} (${state.liveCommerce.scheduledSessions.length})</a>
        <a href="#/live?tab=history" class="${isHistory?'active':''}">${t("session_history")}</a>
      </div>
      
      <!-- Live Commerce Operations Dashboard -->
      <div class="grid cols-4" style="margin:16px 0; gap:12px">
        <div class="metric">
          <div class="k" style="color:var(--good)">${stats.activeSessions}</div>
          <div class="t">Active Sessions</div>
        </div>
        <div class="metric">
          <div class="k">${stats.totalViewersOnline.toLocaleString()}</div>
          <div class="t">Viewers Online</div>
        </div>
        <div class="metric">
          <div class="k">${fmtCurrency(stats.revenueToday)}</div>
          <div class="t">Revenue Today</div>
        </div>
        <div class="metric">
          <div class="k">${stats.conversionRate}%</div>
          <div class="t">Conversion Rate</div>
        </div>
        <div class="metric">
          <div class="k">${stats.totalSessionsToday}</div>
          <div class="t">Sessions Today</div>
        </div>
        <div class="metric">
          <div class="k">${formatDuration(stats.averageSessionLength)}</div>
          <div class="t">Avg Session Length</div>
        </div>
        <div class="metric">
          <div class="k" style="color:${stats.emergencyStops > 0 ? 'var(--bad)' : 'var(--good)'}">${stats.emergencyStops}</div>
          <div class="t">Emergency Stops</div>
        </div>
        <div class="metric">
          <div class="k">${stats.moderationActions}</div>
          <div class="t">Moderation Actions</div>
        </div>
      </div>
      
      <!-- Enhanced Live Sessions Table -->
      <table class="table">
        <thead>
          ${isActive
            ? `<tr><th>ID</th><th>${t("creator")}</th><th>${t("session_title")}</th><th>${t("viewers")}</th><th>${t("duration")}</th><th>${t("revenue")}</th><th>Chat</th><th>${t("status")}</th><th>${t("actions")}</th></tr>`
            : isScheduled 
            ? `<tr><th>ID</th><th>${t("creator")}</th><th>${t("session_title")}</th><th>Start Time</th><th>Time Until</th><th>Products</th><th>${t("status")}</th><th>${t("actions")}</th></tr>`
            : `<tr><th>ID</th><th>${t("creator")}</th><th>${t("session_title")}</th><th>End Time</th><th>${t("duration")}</th><th>Total Viewers</th><th>${t("revenue")}</th><th>${t("status")}</th><th>${t("actions")}</th></tr>`}
        </thead>
        <tbody>
          ${isActive ? (activeRows || `<tr><td colspan="9">No active sessions</td></tr>`) : 
            isScheduled ? (scheduledRows || `<tr><td colspan="7">No scheduled sessions</td></tr>`) :
            (historyRows || `<tr><td colspan="8">No recent sessions</td></tr>`)}
        </tbody>
      </table>
    </section>
  `;

  const host = qs("#view");
  host.addEventListener("click", (e)=>{
    const b = e.target.closest("button[data-act]"); if(!b) return;
    const id = b.getAttribute("data-id"); const act = b.getAttribute("data-act");
    
    if(act==="view-session"){
      const session = state.liveCommerce.activeSessions.find(x=>x.id===id);
      if(session) showLiveSessionDetails(session);
    }
    if(act==="moderate-chat"){
      const session = state.liveCommerce.activeSessions.find(x=>x.id===id);
      if(session) showChatModeration(session);
    }
    if(act==="emergency-stop"){
      if(confirm("Emergency stop this live session? This will immediately end the broadcast and notify viewers.")) {
        state.liveCommerce.activeSessions = state.liveCommerce.activeSessions.filter(x=>x.id!==id);
        state.liveCommerce.stats.activeSessions -= 1;
        state.liveCommerce.stats.emergencyStops += 1;
        save(); renderLiveCommerce(); toast("Live session stopped");
      }
    }
    if(act==="view-scheduled"){
      const session = state.liveCommerce.scheduledSessions.find(x=>x.id===id);
      if(session) showScheduledSessionDetails(session);
    }
    if(act==="start-early"){
      if(confirm("Start this session early?")) {
        const session = state.liveCommerce.scheduledSessions.find(x=>x.id===id);
        if(session) {
          // Move to active sessions
          state.liveCommerce.activeSessions.push({
            ...session,
            viewers: 0,
            duration: 0,
            startTime: Date.now(),
            status: "Live",
            revenue: 0,
            chatMessages: 0,
            moderationFlags: 0,
            products: [{id:"P1",name:"Sample Product",sales:0,views:0}]
          });
          state.liveCommerce.scheduledSessions = state.liveCommerce.scheduledSessions.filter(x=>x.id!==id);
          state.liveCommerce.stats.activeSessions += 1;
          save(); renderLiveCommerce(); toast("Session started early");
        }
      }
    }
    if(act==="view-analytics"){
      const session = state.liveCommerce.recentSessions.find(x=>x.id===id);
      if(session) showSessionAnalytics(session);
    }
  });
  refreshBadges();
}

function renderModeration(){
  const isContent = tab==="content";
  const isSellers = tab==="sellers";
  const isUGC = tab==="ugc";
  const isLive = tab==="live";
  
  // Enhanced moderation detail sheets
function showContentDetails(item) {
  const isUGC = item.type === 'ugc_post';
  const isLive = item.type === 'live_stream';
  
  const content = isUGC ? `
    <div class="metric-grid" style="margin:16px 0">
      <div class="metric">
        <div class="k">${item.engagement || '247'}</div>
        <div class="t">Likes</div>
      </div>
      <div class="metric">
        <div class="k">${item.shares || '89'}</div>
        <div class="t">Shares</div>
      </div>
      <div class="metric">
        <div class="k">${item.comments || '156'}</div>
        <div class="t">Comments</div>
      </div>
    </div>
    <div style="margin:16px 0">
      <strong>Content Preview:</strong><br>
      <div style="background:var(--bg2); padding:12px; border-radius:8px; margin:8px 0">
        "${item.content || 'Check out this amazing product! Perfect for summer 🌞 #StoreZ #Fashion'}"
      </div>
      <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=70" 
           style="width:100%; max-width:300px; border-radius:8px" alt="UGC Content">
    </div>
  ` : isLive ? `
    <div class="metric-grid" style="margin:16px 0">
      <div class="metric">
        <div class="k">${item.viewers || '1,247'}</div>
        <div class="t">Current Viewers</div>
      </div>
      <div class="metric">
        <div class="k">${item.duration || '23m'}</div>
        <div class="t">Stream Duration</div>
      </div>
      <div class="metric">
        <div class="k">${item.sales || '12'}</div>
        <div class="t">Products Sold</div>
      </div>
    </div>
    <div style="margin:16px 0">
      <strong>Stream Title:</strong><br>
      "${item.title || 'Summer Fashion Haul - Live Shopping Session'}"<br><br>
      <strong>Current Status:</strong> 
      <span class="status paid">LIVE</span>
      <span style="color:var(--good)">● Broadcasting</span>
    </div>
  ` : `
    <div style="margin:16px 0">
      <strong>Content:</strong><br>
      "${item.content || 'Reported content details would appear here'}"
    </div>
  `;

  showSheet(`
    <h3>Content Review - #${item.id}</h3>
    
    <div class="grid cols-2" style="gap:12px; margin:16px 0">
      <div><strong>Type:</strong> ${t(item.type)}</div>
      <div><strong>Risk Level:</strong> <span class="status ${item.risk==='High'?'failed':item.risk==='Medium'?'pending':'paid'}">${item.risk}</span></div>
      <div><strong>Reporter:</strong> ${item.reporter}</div>
      <div><strong>Report Time:</strong> ${fmtDate(item.ts)}</div>
    </div>
    
    <div style="margin:16px 0">
      <strong>Report Reason:</strong><br>
      "${item.reason}"
    </div>
    
    ${content}
    
    <div class="flex" style="gap:12px; margin-top:24px">
      <button class="btn secondary flex-1" onclick="approveContent('${item.id}')">
        ${t("approve")} Content
      </button>
      ${isLive ? `
        <button class="btn danger" onclick="emergencyStop('${item.id}')">
          Emergency Stop
        </button>
      ` : ''}
      <button class="btn ghost danger flex-1" onclick="rejectContent('${item.id}')">
        ${t("reject")} Content
      </button>
    </div>
  `);
}

function showSellerDetails(seller) {
  showSheet(`
    <h3>Seller Profile - ${seller.name}</h3>
    
    <div class="grid cols-2" style="gap:12px; margin:16px 0">
      <div><strong>Seller ID:</strong> ${seller.id}</div>
      <div><strong>Status:</strong> <span class="status ${seller.status==='Active'?'paid':'failed'}">${seller.status}</span></div>
      <div><strong>Join Date:</strong> March 2024</div>
      <div><strong>Products:</strong> 127</div>
      <div><strong>Total Sales:</strong> SAR 45,670</div>
      <div><strong>Rating:</strong> 4.7/5 ⭐</div>
    </div>
    
    <div style="margin:16px 0">
      <strong>Admin Note:</strong><br>
      "${seller.note}"
    </div>
    
    <div class="metric-grid" style="margin:16px 0">
      <div class="metric">
        <div class="k">127</div>
        <div class="t">Active Products</div>
      </div>
      <div class="metric">
        <div class="k">892</div>
        <div class="t">Total Orders</div>
      </div>
      <div class="metric">
        <div class="k">4.7</div>
        <div class="t">Avg Rating</div>
      </div>
    </div>
    
    <div class="flex" style="gap:12px; margin-top:24px">
      ${seller.status === 'Active' ? `
        <button class="btn danger flex-1" onclick="suspendSeller('${seller.id}')">
          ${t("suspend")} Seller
        </button>
      ` : `
        <button class="btn secondary flex-1" onclick="reinstateSeller('${seller.id}')">
          ${t("reinstate")} Seller
        </button>
      `}
      <button class="btn ghost" onclick="hideSheet()">Close</button>
    </div>
  `);
}

// Quick action functions for sheet buttons
function approveContent(id) {
  state.moderation.content = state.moderation.content.filter(x=>x.id!==id);
  state.metrics.reportsOpen = Math.max(0, state.metrics.reportsOpen-1);
  save(); hideSheet(); renderModeration(); toast("Content Approved");
}

function rejectContent(id) {
  state.moderation.content = state.moderation.content.filter(x=>x.id!==id);
  state.metrics.reportsOpen = Math.max(0, state.metrics.reportsOpen-1);
  save(); hideSheet(); renderModeration(); toast("Content Rejected");
}

function emergencyStop(id) {
  if(confirm("Emergency stop live session? This will immediately end the broadcast.")) {
    state.moderation.content = state.moderation.content.filter(x=>x.id!==id);
    state.moderation.liveStats.activeSessions = Math.max(0, state.moderation.liveStats.activeSessions-1);
    state.moderation.liveStats.emergencyStops += 1;
    save(); hideSheet(); renderModeration(); toast("Live session stopped");
  }
}

function suspendSeller(id) {
  const s = state.moderation.sellers.find(x=>x.id===id);
  if(s) {
    s.status = "Suspended";
    save(); hideSheet(); renderModeration(); toast(t("suspended"));
  }
}

function reinstateSeller(id) {
  const s = state.moderation.sellers.find(x=>x.id===id);
  if(s) {
    s.status = "Active";
    save(); hideSheet(); renderModeration(); toast(t("active"));
  }
}
  const contentRows = state.moderation.content.map(r=>{
    const isUGCContent = r.type === 'ugc_post';
    const isLiveContent = r.type === 'live_stream';
    const actionButtons = isUGCContent || isLiveContent ? 
      `<button class="small ghost" data-act="view" data-id="${r.id}">${t("view_details")}</button>
       <button class="small secondary" data-act="approve" data-id="${r.id}">${t("approve")}</button>
       <button class="small ghost danger" data-act="reject" data-id="${r.id}">${t("reject")}</button>
       ${isLiveContent ? `<button class="small danger" data-act="emergency" data-id="${r.id}">Emergency Stop</button>` : ''}` :
      `<button class="small secondary" data-act="approve" data-id="${r.id}">${t("approve")}</button>
       <button class="small ghost danger" data-act="reject" data-id="${r.id}">${t("reject")}</button>`;
    
    return `
      <tr>
        <td data-label="${t("reported_item")}">
          <strong>#${r.id}</strong>
          ${isUGCContent ? '<span class="chip" style="background:var(--brand);color:white;font-size:10px">UGC</span>' : ''}
          ${isLiveContent ? '<span class="chip" style="background:var(--bad);color:white;font-size:10px">LIVE</span>' : ''}
        </td>
        <td data-label="${t("type")}">${t(r.type)}</td>
        <td data-label="${t("risk")}"><span class="status ${r.risk==='High'?'failed':r.risk==='Medium'?'pending':'paid'}">${r.risk}</span></td>
        <td data-label="${t("reporter")}">${r.reporter}</td>
        <td data-label="${t("time")}">${fmtDate(r.ts)}</td>
        <td data-label="Reason" class="muted small">${r.reason}</td>
        <td data-label="${t("actions")}" style="min-width:200px">
          ${actionButtons}
        </td>
      </tr>`;
  }).join("");

  const sellerRows = state.moderation.sellers.map(s=>`
    <tr>
      <td data-label="ID"><strong>${s.id}</strong></td>
      <td data-label="${t("seller_queue")}">${s.name}</td>
      <td data-label="${t("status")}"><span class="status ${s.status==='Active'?'paid':'failed'}">${t(s.status.toLowerCase())||s.status}</span></td>
      <td data-label="Note" class="muted">${s.note}</td>
      <td data-label="${t("actions")}">
        <button class="small ghost" data-act="view-seller" data-id="${s.id}">${t("view_details")}</button>
        ${s.status==='Active'
          ? `<button class="small ghost danger" data-act="suspend" data-id="${s.id}">${t("suspend")}</button>`
          : `<button class="small secondary" data-act="reinstate" data-id="${s.id}">${t("reinstate")}</button>`}
      </td>
    </tr>`).join("");

  // UGC-specific stats and overview
  const ugcStats = state.moderation.ugcStats;
  const liveStats = state.moderation.liveStats;

  qs("#view").innerHTML = html`
    <section class="panel">
      <!-- Enhanced Tab Navigation -->
      <div class="tabs">
        <a href="#/moderation?tab=content" class="${isContent?'active':''}">${t("content_queue")} (${state.moderation.content.length})</a>
        <a href="#/moderation?tab=sellers" class="${isSellers?'active':''}">${t("seller_queue")} (${state.moderation.sellers.length})</a>
      </div>
      
      <!-- Moderation Stats Dashboard -->
      ${isContent ? `
        <div class="grid cols-3" style="margin:16px 0; gap:12px">
          <div class="metric">
            <div class="k">${ugcStats.pendingReview}</div>
            <div class="t">Pending Review</div>
          </div>
          <div class="metric">
            <div class="k">${ugcStats.approvedToday}</div>
            <div class="t">Approved Today</div>
          </div>
          <div class="metric">
            <div class="k">${ugcStats.averageReviewTime}h</div>
            <div class="t">Avg Review Time</div>
          </div>
          <div class="metric">
            <div class="k">${liveStats.activeSessions}</div>
            <div class="t">Active Live Sessions</div>
          </div>
          <div class="metric">
            <div class="k">${liveStats.totalViewers}</div>
            <div class="t">Total Live Viewers</div>
          </div>
          <div class="metric">
            <div class="k">${liveStats.emergencyStops}</div>
            <div class="t">Emergency Stops Today</div>
          </div>
        </div>
      ` : ''}
      
      <!-- Enhanced Content Table -->
      <table class="table">
        <thead>
          ${isContent
            ? `<tr><th>${t("reported_item")}</th><th>${t("type")}</th><th>${t("risk")}</th><th>${t("reporter")}</th><th>${t("time")}</th><th>Reason</th><th>${t("actions")}</th></tr>`
            : `<tr><th>ID</th><th>${t("seller_queue")}</th><th>${t("status")}</th><th>Note</th><th>${t("actions")}</th></tr>`}
        </thead>
        <tbody>${isContent ? (contentRows || `<tr><td colspan="7">—</td></tr>`) : (sellerRows || `<tr><td colspan="5">—</td></tr>`)}</tbody>
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
    if(act==="view"){
      const item = state.moderation.content.find(x=>x.id===id);
      if(item) showContentDetails(item);
    }
    if(act==="view-seller"){
      const seller = state.moderation.sellers.find(x=>x.id===id);
      if(seller) showSellerDetails(seller);
    }
    if(act==="emergency"){
      if(confirm("Emergency stop live session? This will immediately end the broadcast.")){
        state.moderation.content = state.moderation.content.filter(x=>x.id!==id);
        state.moderation.liveStats.activeSessions = Math.max(0, state.moderation.liveStats.activeSessions-1);
        state.moderation.liveStats.emergencyStops += 1;
        save(); renderModeration(); toast("Live session stopped");
      }
    }
    if(act==="suspend"){
      const s = state.moderation.sellers.find(x=>x.id===id); 
      if(s){ 
        s.status="Suspended"; 
        save(); renderModeration(); toast(t("suspended")); 
      }
    }
    if(act==="reinstate"){
      const s = state.moderation.sellers.find(x=>x.id===id); 
      if(s){ 
        s.status="Active"; 
        save(); renderModeration(); toast(t("active")); 
      }
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
  badge(qs("#creatorsBadge"), state.creators.stats.pendingReview);
  badge(qs("#liveBadge"), state.liveCommerce.activeSessions.length);
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
