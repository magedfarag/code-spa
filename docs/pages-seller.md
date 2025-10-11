# صفحات تطبيق البائع (Seller SPA Pages) — نسخة محدثة (V2)

**لغة الموقع الأساسية:** العربية السعودية البيضاء مع دعم RTL - Arabic Saudi white dialect with RTL is the main website language

> الهدف: تغطية رحلة البائع من التسجيل إلى الاشتراك وتجهيز المتجر والبيع وخدمات ما بعد البيع وفق الـPRD.

---

## 0) مبادئ عامة
- **التشغيل الأول:** معالج إعداد متجر بعد التسجيل.
- **الأداء/إمكانية الوصول:** نفس مبادئ المشتري (WCAG 2.2، RTL).

### مخطط التنقل العام للبائع (Seller Navigation Flow)
```
Auth/Registration → Store Setup Wizard (#/setup)
    ↓ [إكمال الإعداد]
    ↓
Dashboard (#/dashboard) ←→ Analytics (#/analytics)
    ↓ [إضافة منتج]        ↓ [عرض التقارير]
    ↓                     ↓
Catalog (#/catalog) ←→ Orders (#/orders) ←→ Returns (#/returns)
    ↓ [منتج جديد]        ↓ [تفاصيل طلب]      ↓ [معالجة إرجاع]
    ↓                    ↓                   ↓
New Product (#/catalog-new)  Order Details (#/order/:id)  RMA Processing
    ↑ [تحرير منتج]        ↓ [شحن]              ↓ [موافقة/رفض]
    ↑                     ↓                    ↓
Edit Product (#/catalog-edit/:id)  Shipping Label  Refund Processing

Live Commerce (#/live) ←→ Creator Tools (#/creator) ←→ UGC (#/ugc)
    ↓ [بدء بث]             ↓ [إنشاء محتوى]        ↓ [إدارة محتوى العملاء]
    ↓                      ↓                      ↓
Live Session              Content Creation       Content Moderation

Settings (#/settings) ←→ Billing (#/billing)
    ↓ [إعدادات متجر]       ↓ [إدارة اشتراك]
    ↓                     ↓
Store Profile           Subscription Management
```

---

## 1) لوحة التحكم (Dashboard)
- **المسار:** `#/dashboard`
- **الغرض:** نظرة عامة، مؤشرات، إجراءات سريعة (إضافة منتج/بدء بث).

### بيانات العينة:
```javascript
const dashboardData = {
  kpis: {
    totalSales: { value: 45750, currency: "SAR", change: 12.5, period: "هذا الشهر" },
    ordersToday: { value: 23, change: 8.2, status: "pending" },
    activeProducts: { value: 156, change: 2.1, total: 180 },
    conversionRate: { value: 3.8, change: -0.5, unit: "%" },
    averageOrderValue: { value: 285, currency: "SAR", change: 15.3 }
  },
  recentOrders: [
    {
      id: "ORD-2025-001234",
      customer: "سارة أحمد المطيري",
      items: 2,
      total: 459,
      status: "pending_shipment",
      orderDate: "2025-10-10T14:30:00Z"
    },
    {
      id: "ORD-2025-001235", 
      customer: "محمد فهد العتيبي",
      items: 1,
      total: 189,
      status: "shipped",
      orderDate: "2025-10-10T11:15:00Z",
      trackingNumber: "SM12345678SA"
    }
  ],
  topProducts: [
    {
      id: "p001",
      name: "ساعة ذكية آبل سيريز 9",
      sales: 45,
      revenue: 80955,
      image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26"
    }
  ],
  quickActions: [
    { title: "إضافة منتج جديد", icon: "➕", route: "#/catalog-new" },
    { title: "بدء بث مباشر", icon: "📹", route: "#/live" },
    { title: "معالجة الطلبات", icon: "📦", route: "#/orders?status=pending" },
    { title: "عرض التحليلات", icon: "📊", route: "#/analytics" }
  ]
};
```

### مسارات التنقل:
- **إضافة منتج** → `navigate("#/catalog-new")`
- **بدء بث مباشر** → `navigate("#/live")`
- **عرض الطلبات** → `navigate("#/orders")`
- **تفاصيل طلب** → `navigate("#/order/" + orderId)`
- **التحليلات المفصلة** → `navigate("#/analytics")`
- **إعدادات المتجر** → `navigate("#/settings")` fileciteturn1file0L11-L30

---

## 2) معالج الإعداد (Store Setup Wizard) — **جديد**
- **المسار:** `#/setup`
- **الخطوات:** بيانات المتجر → الهوية/الضرائب → الشحن → المدفوعات (payout/KYC) → مراجعة.

### بيانات العينة:
```javascript
const setupWizardData = {
  steps: [
    {
      id: "store_info",
      title: "بيانات المتجر",
      fields: [
        { name: "storeName", placeholder: "اسم المتجر", sample: "متجر الأناقة العصرية" },
        { name: "storeDescription", placeholder: "وصف المتجر", sample: "متجر متخصص في الأزياء النسائية العصرية" },
        { name: "category", placeholder: "فئة المتجر", sample: "أزياء وموضة" },
        { name: "logo", placeholder: "شعار المتجر", type: "file" }
      ]
    },
    {
      id: "business_verification", 
      title: "التحقق من الهوية والضرائب",
      fields: [
        { name: "businessLicense", placeholder: "رقم السجل التجاري", sample: "1010123456" },
        { name: "taxNumber", placeholder: "الرقم الضريبي", sample: "300123456789003" },
        { name: "ownerID", placeholder: "رقم الهوية الوطنية", sample: "1234567890" },
        { name: "bankAccount", placeholder: "رقم الحساب البنكي", sample: "SA1234567890123456789012" }
      ]
    },
    {
      id: "shipping_settings",
      title: "إعدادات الشحن", 
      options: [
        { provider: "SMSA", name: "شركة البريد السعودي", pricing: "15-25 ريال" },
        { provider: "Aramex", name: "أرامكس", pricing: "20-30 ريال" },
        { provider: "DHL", name: "دي إتش إل", pricing: "25-40 ريال" }
      ]
    },
    {
      id: "payment_setup",
      title: "إعداد المدفوعات",
      methods: [
        { type: "mada", name: "مدى", fee: "2.5%" },
        { type: "visa", name: "فيزا/ماستركارد", fee: "3.5%" },
        { type: "apple_pay", name: "آبل باي", fee: "3.0%" }
      ]
    }
  ]
};
```

### مسارات التنقل:
- **إكمال الإعداد** → `navigate("#/dashboard")` + `markStoreAsActive()`
- **التالي** → `goToNextStep(currentStep + 1)`
- **السابق** → `goToPreviousStep(currentStep - 1)`
- **حفظ وإكمال لاحقاً** → `saveDraft()` + `navigate("#/dashboard")`

- **المخرجات:** تفعيل المتجر عند اكتمال جميع الخطوات.

---

## 3) الكتالوج (قائمة/إضافة/تحرير/استيراد)
- **المسارات:** 
  - `#/catalog`, `#/catalog-new`, `#/catalog-edit/:id`, `#/catalog-import`
- **المحتوى:** كما في النسخة السابقة مع استيراد CSV/Excel. fileciteturn1file14L4-L21

---

## 4) الطلبات (Orders) + تفاصيل الطلب + الوفاء بالشحن
- **المسارات:** `#/orders`, `#/order/:id`
- **التحديث:** إضافة **إنشاء بوليصة شحن** وتحديث الحالة من مزوّد الشحن؛ حقل رقم التتبع وإشعار العميل. fileciteturn1file13L18-L22

---

## 5) المرتجعات (RMA) 
- **المسار:** `#/returns` — الموافقة/الرفض/الاسترداد؛ تتبع تقدم الحالة. fileciteturn1file13L26-L41

---

## 6) البث المباشر وأدوات المبدع/UGC
- **المسارات:** `#/live`, `#/creator`, `#/ugc` — كما في النسخة السابقة. fileciteturn1file0L29-L30

---

## 7) التحليلات (Analytics)
- **المسار:** `#/analytics` — مخططات المبيعات/المصادر/القمع. (لا تغيير جوهري).

---

## 8) الاشتراك والفوترة (Subscription & Billing) — **جديد/ضروري للـB2B**
- **المسار:** `#/billing`
- **المحتوى:** عرض الخطة الحالية، الاستخدام، ترقية/تخفيض الخطة، إدارة الدفع الآلي، فواتير قابلة للتنزيل.
- **المعايير:** نجاح الترقية ينعكس فورياً على الحدود (عدد المنتجات/مزايا). fileciteturn1file10L48-L56

---

## 9) الإعلانات داخل التطبيق (Store Announcements) — **جديد**
- **المسار:** `#/announcements`
- **الغرض:** إنشاء لافتات/إعلانات مدفوعة تظهر في واجهة المشترين حسب الحزم. fileciteturn1file10L62-L64

---

## 10) إضافات الذكاء الاصطناعي (AI Add‑ons) — **جديد**
- **المسار:** `#/ai-addons`
- **الغرض:** تمكين/تعطيل إضافات مدفوعة (توصية/تحسين أسعار/تحليلات).
- **المعايير:** إظهار الأسعار حسب الخطة وتفعيل تجريبي إن وُجد. fileciteturn1file10L56-L60

---

## 11) الشحن ومزوّدو الخدمات (Couriers)
- **المسار:** `#/shipping`
- **المحتوى:** ربط حسابات Aramex/SMSA، تهيئة سياسات الشحن والإرجاع، مناطق الخدمة داخل السعودية. fileciteturn1file5L7-L17

---

## 12) المدفوعات والتحويلات البنكية (Payouts/KYC)
- **المسار:** `#/payouts`
- **المحتوى:** تهيئة حسابات السحب، التحقق (KYC)، سجل التحويلات.

---

## 13) الإعدادات (Settings)
- **المسار:** `#/settings` — هوية المتجر/شعار/تفضيلات/الخصوصية. (كما السابق).