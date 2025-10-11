# Persona Hub (index.html) — نسخة محدثة (V2)

**لغة الموقع الأساسية:** العربية السعودية البيضاء مع دعم RTL - Arabic Saudi white dialect with RTL is the main website language

### وظائف المحور:
- **بلاطات الدخول:** **مشتري | بائع | مدير** مع أوصاف قصيرة للاستخدام.
- **توجيه واضح:** الأزرار تفتح الـSPAs في تبويبات جديدة وتضيف `?persona=` و`locale` و`theme` للتهيئة الأولى.
- **تذكّر آخر شخصية:** `storez_persona` + إعادة توجيه تلقائي بعد 1s.

### بيانات العينة:
```javascript
const hubData = {
  personas: [
    {
      id: "buyer",
      title: "أريد التسوق",
      subtitle: "تصفح واشتر من آلاف المنتجات",
      description: "اكتشف أحدث المنتجات من البائعين المعتمدين في المملكة",
      icon: "🛒",
      route: "./frontend/buyer/",
      color: "#10B981", // أخضر
      stats: "75,000+ منتج متاح"
    },
    {
      id: "seller", 
      title: "أريد البيع",
      subtitle: "أنشئ متجرك وابدأ البيع",
      description: "ابدأ رحلتك في التجارة الإلكترونية مع أدوات احترافية",
      icon: "🏪",
      route: "./frontend/Seller/",
      color: "#3B82F6", // أزرق
      stats: "5,000+ بائع نشط"
    },
    {
      id: "admin",
      title: "إدارة المنصة", 
      subtitle: "لوحة تحكم شاملة",
      description: "أدر المستخدمين والمحتوى والعمليات بكفاءة عالية",
      icon: "⚙️", 
      route: "./frontend/admin/",
      color: "#8B5CF6", // بنفسجي
      stats: "نظام إدارة متقدم"
    }
  ],
  platformStats: {
    totalUsers: "127,500+",
    totalSellers: "5,000+", 
    totalProducts: "75,000+",
    dailyOrders: "2,500+"
  },
  recentActivity: {
    lastLogin: "2025-10-10T14:30:00Z",
    lastPersona: "buyer",
    visitCount: 15,
    preferredLanguage: "ar"
  }
};
```

### مسارات التنقل:
- **دخول كمشتري** → `openApp('buyer')` → `./frontend/buyer/?persona=buyer&locale=ar&theme=light`
- **دخول كبائع** → `openApp('seller')` → `./frontend/Seller/?persona=seller&locale=ar&theme=light`  
- **دخول كمدير** → `openApp('admin')` → `./frontend/admin/?persona=admin&locale=ar&theme=light`
- **تبديل اللغة** → `toggleLanguage()` + إعادة تحميل المحتوى
- **تبديل السمة** → `toggleTheme()` + تطبيق السمة الجديدة
- **إعادة توجيه تلقائي** → `autoRedirect()` بناءً على آخر شخصية مستخدمة
- **SSO اختياري:** عند وجود `token` يتم تمريره إلى الـSPA عبر `postMessage` لمصادقة سلسة.
- **روابط مساعدة:** وثائق وسياسة خصوصية ودعم فني منبثقة.
fileciteturn1file3L1-L5