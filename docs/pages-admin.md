# صفحات تطبيق الإدارة (Admin SPA Pages) — نسخة محدثة (V2)

**لغة الموقع الأساسية:** العربية السعودية البيضاء مع دعم RTL - Arabic Saudi white dialect with RTL is the main website language

> الهدف: تمكين إدارة منصة B2B2C: الاشتراكات، الإعلانات، الإضافات، مزوّدي الدفع والشحن، دعم العملاء، الإشراف، والتقارير.

### مخطط التنقل العام للإدارة (Admin Navigation Flow)
```
Overview (#/overview) ←→ Analytics (#/analytics)
    ↓ [إدارة المنصة]        ↓ [تقارير مفصلة]
    ↓                       ↓
Platform Management ←→ User Management (#/users)
    ↓                       ↓ [عرض مستخدم]
Billing (#/billing) ←→ User Details (#/user/:id)
    ↓ [إدارة اشتراكات]      ↓ [معلجة مشكلة]
    ↓                       ↓
Subscriptions ←→ Support (#/support) ←→ Moderation (#/moderation)
    ↓               ↓ [تذكرة دعم]      ↓ [مراجعة محتوى]
    ↓               ↓                  ↓
AI Catalog (#/ai-catalog)  Ticket Details  Content Review
    ↓ [إضافة]               ↓ [حل]           ↓ [موافقة/رفض]
    ↓                       ↓               ↓
Add-on Configuration      Resolution       Content Decision

Announcements (#/announcements-admin) ←→ Shipping Providers (#/shipping)
    ↓ [إنشاء إعلان]                        ↓ [إدارة مزودين]
    ↓                                      ↓
Campaign Management                       Provider Settings
```

---

## 1) نظرة عامة (Overview)
- **المسار:** `#/overview`
- **الغرض:** مؤشرات المنصة وSLA وروابط سريعة.

### بيانات العينة:
```javascript
const adminOverviewData = {
  platformMetrics: {
    totalUsers: { value: 127500, change: 8.5, period: "هذا الشهر" },
    activeSellers: { value: 4250, change: 12.3, total: 5000 },
    monthlyRevenue: { value: 2750000, currency: "SAR", change: 15.7 },
    systemUptime: { value: 99.97, unit: "%", target: 99.9 }
  },
  slaMetrics: {
    supportResponseTime: { current: 1.8, target: 2.0, unit: "ساعة", status: "good" },
    ticketResolutionTime: { current: 18.5, target: 24.0, unit: "ساعة", status: "excellent" },
    sellerApprovalTime: { current: 36, target: 48, unit: "ساعة", status: "good" },
    contentModerationTime: { current: 4.2, target: 8.0, unit: "ساعة", status: "excellent" }
  },
  pendingTasks: [
    { type: "seller_approval", count: 23, priority: "high", route: "#/moderation?type=sellers" },
    { type: "content_review", count: 156, priority: "medium", route: "#/moderation?type=content" },
    { type: "support_tickets", count: 89, priority: "high", route: "#/support?status=open" },
    { type: "payment_disputes", count: 12, priority: "critical", route: "#/billing?view=disputes" }
  ],
  quickActions: [
    { title: "مراجعة البائعين", icon: "👤", route: "#/moderation?type=sellers" },
    { title: "دعم العملاء", icon: "🎧", route: "#/support" },
    { title: "التحليلات المتقدمة", icon: "📊", route: "#/analytics" },
    { title: "إعدادات المنصة", icon: "⚙️", route: "#/settings" }
  ]
};
```

### مسارات التنقل:
- **مراجعة البائعين** → `navigate("#/moderation?type=sellers")`
- **دعم العملاء** → `navigate("#/support")`
- **إدارة المستخدمين** → `navigate("#/users")`
- **التحليلات** → `navigate("#/analytics")`
- **إعدادات النظام** → `navigate("#/settings")` fileciteturn1file1L11-L29

---

## 2) إدارة الاشتراكات والفوترة (Subscriptions & Billing) — **جديد**
- **المسار:** `#/billing`
- **المحتوى:** إدارة خطط (Basic/Standard/Premium)، التسعير، الدفعات الدورية، حالات التعثر، الفواتير الضريبية.
- **الغاية:** دعم تيار الإيرادات الرئيسي (اشتراكات البائعين). fileciteturn1file10L48-L56

---

## 3) كتالوج إضافات الذكاء الاصطناعي (AI Add‑ons Catalog) — **جديد**
- **المسار:** `#/ai-catalog`
- **المحتوى:** تعريف الإضافات، التسعير، إسناد الحقوق (entitlements) للبائعين. fileciteturn1file10L56-L60

---

## 4) إدارة الإعلانات داخل التطبيق (Announcements/Promotions) — **جديد**
- **المسار:** `#/announcements-admin`
- **المحتوى:** أماكن وأولويات الظهور، مراجعة إعلانات البائعين، تقارير الأداء. fileciteturn1file10L62-L64

---

## 5) مزوّدو الدفع (Payments) ومزوّدو الشحن (Couriers)
- **المسارات:** `#/providers/payments`, `#/providers/couriers`
- **المحتوى:** تفعيل/تعطيل Mada/Apple Pay وبطاقات؛ إدارة تكامل SMSA/Aramex وإعدادات مناطق الخدمة. fileciteturn1file5L5-L13

---

## 6) مركز الدعم (Support) وإدارة SLA
- **المسار:** `#/support`
- **المحتوى:** لوحة التذاكر، زمن الاستجابة/الحل، التقارير. (متسق مع مؤشرات SLA في النظرة العامة). fileciteturn1file1L24-L33

---

## 7) الإشراف والمحتوى (Moderation) + إدارة المبدعين (Creators)
- **المسارات:** `#/moderation`, `#/creators`
- **المحتوى:** مراجعة المحتوى/البث المباشر/UGC وحالات القبول/الرفض.

---

## 8) الرقابة والمخاطر (Risk/Fraud) — **جديد**
- **المسار:** `#/risk`
- **المحتوى:** تنبيهات أنماط احتيال المدفوعات/المرتجعات/الحسابات.

---

## 9) التقارير والتحليلات الشاملة (Platform Analytics)
- **المسار:** `#/analytics-platform`
- **المحتوى:** نمو المستخدمين/البائعين، المبيعات الإجمالية، معدلات الإرجاع، أداء القنوات.