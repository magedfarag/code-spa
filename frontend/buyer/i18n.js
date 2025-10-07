/* i18n.js — language, direction, formatting (EN / AR—Saudi) */

const LS_LANG_KEY = "storez_lang";

/** dictionaries */
const DICTS = {
  en: {
    // chrome
    demo: "Demo",
    language: "Language",
    theme: "Theme",
    rtl: "RTL",
    sponsor: "Sponsor",
    reset: "Reset",

    // nav
    nav_home: "Home",
    nav_discover: "Discover",
    nav_cart: "Cart",
    nav_messages: "Messages",
    nav_profile: "Profile",

    // feed / cards
    for_you: "For you",
    trending: "Trending ✨",
    top_creators: "Top creators",
    see_all: "See all",
    stock: "Stock",
    add_to_cart: "Add to cart",
    buy: "Buy",
    buy_now: "Buy now",
    by_creator: "By",
    live_now: "Live now ▶",

    // PDP
    what_people_say: "What people say",
    review_1_t: "Great comfort",
    review_1_b: "Exactly like the creator showed.",
    review_2_t: "Fast delivery",
    review_2_b: "Got it in 2 days. Quality is 🔥",

    // discover
    discover_ph: "Search products, creators, tags…",
    results_count: "{n} results",

    // cart / checkout
    your_cart: "Your cart",
    cart_empty: "Cart is empty.",
    subtotal: "Subtotal",
    checkout: "Checkout",
    add_more: "Add more",
    remove: "Remove",
    checkout_title: "Checkout",
    shipping: "Shipping",
    tax: "Tax",
    total: "Total",
    name: "Name",
    address: "Address",
    payment: "Payment",
    wallet: "Wallet",
    card: "Card",
    bnpl: "Buy now, pay later",
    pay: "Pay",
    back: "Back",
    note_sim: "Note: Payment is simulated for demo.",

    // order flow
    order_placed: "Order placed 🎉",
    order_prepared: "Your order ID {id} is being prepared.",
    track_order: "Track order",
    continue_shopping: "Continue shopping",
    your_orders: "Your orders",
    status_processing: "Processing",
    status_delivered: "Delivered",
    status_shipped: "Shipped",
    status_out: "Out for delivery",
    track: "Track",
    review: "Review",
    no_orders: "No orders yet.",
    order_detail: "Order detail",
    items: "Items",
    placed: "Placed",
    shipped: "Shipped",
    out_for_delivery: "Out for delivery",
    delivered: "Delivered",
    start_return: "Start return",
    return_reason: "Reason",
    return_submitted:
      "Return submitted. We created a label and opened a support thread.",
    download_label: "Download label",
    contact_support: "Contact support",

    // messages
    messages: "Messages",
    no_messages: "No messages.",
    chat_with: "Chat with",
    send: "Send",
    ticket_note: "This demo logs a ticket in Messages.",
    describe_issue: "Describe your issue",
    submit: "Submit",
    ticket_recv: "We received your ticket: ",

    // profile
    credits: "Credits",
    orders_btn: "Orders",
    support_btn: "Support",
    referrals: "Referrals",
    share_code: "Share your code. Earn SAR 20 for each friend’s first purchase.",
    copy: "Copy",
    invited_friends: "You have invited {n} friends.",
    support: "Support",
    returns: "Returns & refunds",
    shipping_info: "Shipping",
    contact_us: "Contact us",

    // onboarding / landing
    welcome: "Welcome to StoreZ",
    pick_interests: "Pick interests to personalize your feed.",
    start: "Start",
    landing_title: "Shop drops with your favorite creators",
    landing_sub: "Curated feeds, live shopping, and wallets you already use.",
    action_signup: "Create account",
    action_guest: "Explore as guest",
    guest_badge:
      "You are browsing as a guest. Sign up to unlock messages and order history.",
    landing_point_feed: "Personalized creator feed",
    landing_point_live: "Live drops with tap-to-buy",
    landing_point_wallet: "Wallet-first checkout",

    // wishlist
    wishlist: "Wishlist",
    wishlist_empty: "Your wishlist is empty.",
    save_item: "Save to wishlist",
    unsave_item: "Remove from wishlist",

    // notifications (PDPL)
    notifications: "Notifications",
    notif_desc: "Choose what to get notified about. Your settings honor PDPL.",
    notif_orders: "Order updates",
    notif_live: "Live shopping alerts",
    notif_marketing: "Promotions & recommendations",
    consent_pdpl:
      "I consent to processing my data for these notifications.",

    // profile subpages
    addresses: "Addresses",
    add_address: "Add address",
    payments: "Payment methods",
    add_card: "Add card",
  },

  ar: {
    demo: "تجريبي",
    language: "اللغة",
    theme: "السِّمات",
    rtl: "يمين-يسار",
    sponsor: "الراعي",
    reset: "إعادة تعيين",

    nav_home: "الرئيسية",
    nav_discover: "اكتشف",
    nav_cart: "السلة",
    nav_messages: "الرسائل",
    nav_profile: "الملف",

    for_you: "مختارات لك",
    trending: "الترند ✨",
    top_creators: "أفضل المبدعين",
    see_all: "عرض الكل",
    stock: "المخزون",
    add_to_cart: "أضف للسلة",
    buy: "شراء",
    buy_now: "اشتري الآن",
    by_creator: "من",
    live_now: "بث مباشر ▶",

    what_people_say: "آراء الناس",
    review_1_t: "مريحة جدًا",
    review_1_b: "نفس ما عرضتها المُنشِئة.",
    review_2_t: "توصيل سريع",
    review_2_b: "وصلت خلال يومين. الجودة 🔥",

    discover_ph: "ابحث عن منتجات، مبدعين، أو وسوم…",
    results_count: "{n} نتيجة",

    your_cart: "سلة التسوق",
    cart_empty: "سلة التسوق فاضية.",
    subtotal: "الإجمالي الفرعي",
    checkout: "الدفع",
    add_more: "أضف المزيد",
    remove: "إزالة",
    checkout_title: "إتمام الشراء",
    shipping: "الشحن",
    tax: "الضريبة",
    total: "المجموع",
    name: "الاسم",
    address: "العنوان",
    payment: "طريقة الدفع",
    wallet: "المحفظة",
    card: "بطاقة",
    bnpl: "اشتر الآن وادفع لاحقًا",
    pay: "ادفع",
    back: "رجوع",
    note_sim: "ملاحظة: الدفع تجريبي لهذا العرض.",

    order_placed: "تم الطلب 🎉",
    order_prepared: "رقم الطلب {id} قيد التجهيز.",
    track_order: "تتبع الطلب",
    continue_shopping: "واصل التسوق",
    your_orders: "طلباتي",
    status_processing: "قيد المعالجة",
    status_delivered: "تم التسليم",
    status_shipped: "تم الشحن",
    status_out: "خارج للتسليم",
    track: "تتبع",
    review: "تقييم",
    no_orders: "لا توجد طلبات بعد.",
    order_detail: "تفاصيل الطلب",
    items: "المنتجات",
    placed: "تم الإنشاء",
    shipped: "تم الشحن",
    out_for_delivery: "خارج للتسليم",
    delivered: "تم التسليم",
    start_return: "بدء الاسترجاع",
    return_reason: "السبب",
    return_submitted:
      "تم تقديم الاسترجاع. أصدرنا ملصق شحن وفتحنا محادثة دعم.",
    download_label: "تحميل الملصق",
    contact_support: "تواصل مع الدعم",

    messages: "الرسائل",
    no_messages: "لا توجد رسائل.",
    chat_with: "محادثة مع",
    send: "إرسال",
    ticket_note: "هذا الديمو يسجل تذكرة في الرسائل.",
    describe_issue: "صف مشكلتك",
    submit: "إرسال",
    ticket_recv: "استلمنا تذكرتك: ",

    credits: "رصيد",
    orders_btn: "طلباتي",
    support_btn: "الدعم",
    referrals: "الإحالات",
    share_code:
      "شارك كودك. تربح ٢٠ ر.س لكل صديق يشتري أول مرة.",
    copy: "نسخ",
    invited_friends: "دعوت {n} أصدقاء.",
    support: "الدعم",
    returns: "الاسترجاع والاسترداد",
    shipping_info: "الشحن",
    contact_us: "تواصل معنا",

    welcome: "مرحبًا في StoreZ",
    pick_interests: "اختر اهتماماتك لتخصيص تجربتك.",
    start: "ابدأ",
    landing_title: "تسوّق أحدث العروض من مبدعينك المفضلين",
    landing_sub: "خلاصات مخصصة وبث مباشر ومحافظ دفع مألوفة لك.",
    action_signup: "إنشاء حساب",
    action_guest: "ادخل كضيف",
    guest_badge: "تصفحك كضيف. سجّل لتحصل على الرسائل وسجل الطلبات.",
    landing_point_feed: "خلاصة مخصصة",
    landing_point_live: "بث مباشر مع شراء سريع",
    landing_point_wallet: "دفع بالمحفظة أولًا",

    wishlist: "المحفوظات",
    wishlist_empty: "قائمة الأمنيات فاضية.",
    save_item: "حفظ في المفضلة",
    unsave_item: "إزالة من المفضلة",

    notifications: "الإشعارات",
    notif_desc:
      "اختر الإشعارات التي تبي توصلك. إعداداتك تحترم نظام حماية البيانات السعودي.",
    notif_orders: "تحديثات الطلب",
    notif_live: "تنبيهات البث المباشر",
    notif_marketing: "عروض وتوصيات",
    consent_pdpl: "أوافق على معالجة بياناتي لهذه الإشعارات.",

    addresses: "العناوين",
    add_address: "إضافة عنوان",
    payments: "طرق الدفع",
    add_card: "إضافة بطاقة",
  }
};

let currentLang = localStorage.getItem(LS_LANG_KEY) || "en";

export function setLang(lang) {
  currentLang = DICTS[lang] ? lang : "en";
  localStorage.setItem(LS_LANG_KEY, currentLang);
}
export function getLang() {
  return localStorage.getItem(LS_LANG_KEY) || currentLang || "en";
}
export function t(key) {
  const d = DICTS[currentLang] || DICTS.en;
  return (key in d ? d[key] : (DICTS.en[key] ?? key));
}
export function tn(key, params = {}) {
  return t(key).replace(/\{(\w+)\}/g, (_, k) => (params[k] ?? ""));
}
export function dirForLang(lang) {
  return lang === "ar" ? "rtl" : "ltr";
}
export function locale() {
  return currentLang === "ar" ? "ar-SA" : "en";
}
export function fmtCurrency(n, code = "SAR") {
  const loc = locale();
  return new Intl.NumberFormat(loc, {
    style: "currency",
    currency: code,
    currencyDisplay: currentLang === "en" ? "code" : "symbol",
    maximumFractionDigits: 0
  }).format(Number(n) || 0);
}
export function fmtDate(ts) {
  return new Date(ts).toLocaleString(locale());
}

/* optional access to dictionaries (if routes need arrays like tags/interests) */
export const dict = () => DICTS[currentLang] || DICTS.en;
