# صفحات تطبيق المشتري (Buyer SPA Pages) — نسخة محدثة (V2)

**لغة الموقع الأساسية:** العربية السعودية البيضاء مع دعم RTL - Arabic Saudi white dialect with RTL is the main website language

> الهدف: مواءمة الصفحات مع رحلة المستخدم (المشتري) والـPRD، وسد الثغرات، وتحديد معايير قبول قابلة للاختبار بدون غموض. **اللغة الافتراضية: العربية السعودية (RTL) مع دعم EN.**

---

## 0) مبادئ واجبة التنفيذ (تسري على كل الصفحات)
- **WCAG 2.2:** تلبية جميع معايير AA بما فيها النجاح الإضافي في 2.2 (Focus Appearance، Dragging Movements، Target Size… إلخ). إضافة `skip-to-content` ووضوح التركيز (focus) وتحكم كامل عبر لوحة المفاتيح.
- **الأداء:** زمن تفاعل أولي ≤ 2.5s، وزن JS لكل صفحة ≤ 250KB في الـMVP، صور WebP مع تحميل كسول.
- **التعريب:** `document.dir="rtl"` عند `ar`، ومفاتيح i18n مغطاة 100%.
- **التنقل السفلي (Bottom Nav):** 3–5 وِجهات كحد أقصى على الجوال: `Home | Discover | Cart | Profile | Social`.
- **تتبّع المقاييس:** أحداث أساسية: `view_item`, `add_to_cart`, `begin_checkout`, `purchase`, `request_return`, `refer_share`, `write_review`.

### مخطط التنقل العام (Navigation Flow)
```
Landing (#/landing) 
    ↓ [تجربة سريعة] 
    ↓ [تسجيل دخول]
    ↓
Auth (#/auth) → Home (#/home)
    ↓
Home (#/home) ←→ Discover (#/discover) ←→ Search (#/search)
    ↓ [عرض منتج]         ↓ [فئة]           ↓ [بحث]
    ↓                     ↓                ↓
PDP (#/pdp/:id) ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
    ↓ [إضافة للسلة]
    ↓
Cart (#/cart) → Checkout (#/checkout) → Thank You (#/thankyou)
    ↑                ↓ [فشل الدفع]
    ↑ [تعديل]         ↓
    ↑←←←←←←←←←←←←←←←←←←←
    
Profile (#/profile) → Orders (#/orders) → Order Details (#/order/:id)
    ↓                    ↓ [إرجاع]           ↓ [تتبع]
Wishlist (#/wishlist)   Returns (#/returns)  Live (#/live)
    ↓ [عرض منتج]        ↓ [بيانات إرجاع]    ↓ [مشاهدة بث]
    ↓                   ↓                   ↓
PDP (#/pdp/:id)        Return Form         Live Session
```

> المرجع: WCAG 2.2 ومواد Material Navigation مذكورة في قسم المراجع.

---

## 1) الهبوط / التهيئة (Landing / Onboarding)
- **المسار:** `#/landing`
- **المعالج:** `landing()`
- **الغرض:** بدء التجربة واختيار اللغة وتسجيل الدخول/التجربة السريعة.

### بيانات العينة:
```javascript
const landingData = {
  heroSlides: [
    {
      title: "اكتشف أحدث صيحات الموضة",
      subtitle: "تسوق من أفضل البراندات السعودية",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
      cta: "تسوق الآن",
      targetRoute: "#/discover?category=fashion"
    },
    {
      title: "إلكترونيات بأفضل الأسعار",
      subtitle: "أحدث الأجهزة الذكية والتقنيات",
      image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece",
      cta: "استكشف المنتجات",
      targetRoute: "#/discover?category=electronics"
    }
  ],
  quickStats: {
    totalProducts: "75,000+",
    activeSellers: "5,000+",
    dailyDeliveries: "2,500+",
    userSatisfaction: "98%"
  }
};
```

### مسارات التنقل:
- **تجربة سريعة** → `navigate("#/home")` + `loadGuestUser()`
- **تسجيل الدخول** → `navigate("#/auth?mode=signin")`
- **إنشاء حساب** → `navigate("#/auth?mode=signup")`
- **اختيار اللغة** → `setLanguage(lang)` + إعادة تحميل المحتوى

- **معايير القبول:**
  - تبديل اللغة لحظي مع حفظ `localStorage.storez_lang`.
  - زر "تجربة سريعة" يملأ حالة مستخدم وهمي وينتقل إلى `#/home`.
  - تحميل ≤ 2s مع صور محسّنة. fileciteturn1file4L9-L16

---

## 2) المصادقة (Auth: Sign in / Sign up / Forgot)
- **المسار:** `#/auth`
- **المعالج:** `auth()`
- **المحتوى:** تسجيل الدخول، إنشاء حساب، استعادة كلمة المرور.

### بيانات العينة:
```javascript
const authForms = {
  signin: {
    fields: [
      { name: "email", placeholder: "البريد الإلكتروني", sample: "ahmed.almalki@example.com" },
      { name: "password", placeholder: "كلمة المرور", sample: "••••••••" }
    ],
    socialOptions: ["Google", "Apple", "Twitter"],
    forgotPasswordLink: "#/auth?mode=forgot"
  },
  signup: {
    fields: [
      { name: "firstName", placeholder: "الاسم الأول", sample: "أحمد" },
      { name: "lastName", placeholder: "اسم العائلة", sample: "المالكي" },
      { name: "email", placeholder: "البريد الإلكتروني", sample: "ahmed.almalki@example.com" },
      { name: "phone", placeholder: "رقم الجوال", sample: "+966 55 123 4567" },
      { name: "password", placeholder: "كلمة المرور", sample: "••••••••" },
      { name: "confirmPassword", placeholder: "تأكيد كلمة المرور", sample: "••••••••" }
    ],
    termsLink: "#/terms",
    privacyLink: "#/privacy"
  }
};
```

### مسارات التنقل:
- **تسجيل دخول ناجح** → `navigate("#/home")` + `setUserSession(userData)`
- **تسجيل جديد ناجح** → `navigate("#/welcome")` أو `navigate("#/home")`
- **نسيت كلمة المرور** → `navigate("#/auth?mode=forgot")`
- **رجوع للهبوط** → `navigate("#/landing")`
- **تبديل بين الأوضاع** → `updateAuthMode(mode)` (signin/signup/forgot)

- **معايير القبول:**
  - تحققات فورية، رسائل عربية واضحة، دعم RTL للنماذج. fileciteturn1file4L28-L37

---

## 3) الصفحة الرئيسية (Home Feed + Personalization MVP)
- **المسار:** `#/home`
- **المعالج:** `home()`
- **الغرض:** تغذية شخصية مبدئية (قواعد/Trending) + بحث + وصول سريع للسلة.

### بيانات العينة:
```javascript
const homeFeedData = {
  personalizedSections: [
    {
      title: "مختارات لك",
      subtitle: "بناءً على اهتماماتك",
      products: [
        {
          id: "p001",
          name: "ساعة ذكية آبل سيريز 9",
          price: 1799,
          originalPrice: 1999,
          discount: 10,
          rating: 4.8,
          image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26",
          seller: "متجر التقنية الذكية",
          isWishlisted: false,
          hasLiveSession: true
        },
        {
          id: "p002", 
          name: "عباءة كاجوال أنيقة",
          price: 299,
          originalPrice: 399,
          discount: 25,
          rating: 4.6,
          image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1",
          seller: "أزياء الرياض",
          isWishlisted: true,
          hasLiveSession: false
        }
      ]
    }
  ],
  categories: [
    { id: "electronics", name: "إلكترونيات", icon: "📱", count: "15,000+ منتج" },
    { id: "fashion", name: "أزياء", icon: "👗", count: "25,000+ منتج" }
  ]
};
```

### مسارات التنقل:
- **بحث** → `navigate("#/search?q=" + searchQuery)`
- **فئة معينة** → `navigate("#/discover?category=" + categoryId)`
- **منتج معين** → `navigate("#/pdp/" + productId)`
- **السلة** → `navigate("#/cart")`
- **الملف الشخصي** → `navigate("#/profile")`

- **المكوّنات:**
  - شريط علوي: مبدّل شخصية/Hub، حقل بحث، أيقونة سلة.
  - أقسام: مجموعات أفقية + "مختارات لك" بشبكة متجاوبة.
- **معايير القبول:**
  - استجابة البحث بـ debounce ≤ 300ms.
  - وقت تحميل شبكة "مختارات لك" ≤ 500ms.
  - في الـMVP: خوارزمية rule-based + trending، على أن **المحرّك الذكي مؤجل لمرحلة ما بعد الـMVP**. fileciteturn1file8L133-L141

---

## 4) الاستكشاف (Discover Grid)
- **المسار:** `#/discover`
- **المعالج:** `discover()`
- **الغرض:** التصفية/الفرز بعرض شبكي/قائمة، وحفظ التفضيلات.
- **معايير القبول:**
  - ترشيحات السعر/التقييم/العلامات التجارية تعمل لحظياً.
  - دعم **تمرير لانهائي + زر “عرض المزيد”** وإتاحة **ترقيم الصفحات** كبديل في الإعدادات لسيناريوهات الأداء العالي. fileciteturn1file9L34-L38

---

## 5) تفاصيل المنتج (PDP)
- **المسار:** `#/pdp/:id`
- **المعالج:** `pdp(id)`
- **الغرض:** عرض شامل للسعر/الصور/المراجعات/المتوفر، وإجراءات الشراء.
- **التحديثات على النسخة السابقة:**
  - **إخفاء مزايا AR في الـMVP** (خارج النطاق) مع إبقاء خطاف برمجي معطل `featureFlags.ar=false`. fileciteturn1file5L26-L34
- **معايير القبول:**
  - تحميل تفاصيل المنتج ≤ 300ms، ودليل المقاسات بنموذج منبثق.
  - أزرار: `add_to_cart`, `add_to_wishlist`, `compare` تعمل فوراً. fileciteturn1file12L31-L43

---

## 6) السلة (Cart)
- **المسار:** `#/cart`
- **المعالج:** `cart()`
- **الغرض:** مراجعة العناصر وتعديل الكميات وتطبيق الخصم.
- **معايير القبول:** تحديث الكميات والأسعار لحظي؛ حفظ الحالة في `localStorage`. fileciteturn1file4L117-L130

---

## 7) إتمام الشراء (Checkout)
- **المسار:** `#/checkout`
- **المعالج:** `checkout()`
- **الغرض:** شحن ← دفع ← مراجعة.
- **معايير القبول (MVP):**
  - **جعل “الدفع كضيف” الخيار الأكثر بروزاً** في خطوة اختيار الحساب.
  - **تقليل الحقول**: حقل اسم واحد، إخفاء Address Line 2 افتراضياً، تأجيل إنشاء الحساب لما بعد الإتمام.
  - طرق الدفع: **Mada + بطاقة + Apple Pay** (حسب التوفر). fileciteturn1file5L59-L66
- **إيضاح تجربة ما بعد الدفع:** صفحة التأكيد تشجّع إنشاء حساب ورفع صور المراجعة لاحقاً.

---

## 8) الطلبات والتتبع (Orders & Tracking) — **صفحة جديدة**
- **المسار:** `#/orders` ، وتفصيل `#/order/:id/track`
- **المعالج:** `orders()` و`orderTrack(id)`
- **الغرض:** عرض تاريخ الطلبات وتتبّع الشحن من مزوّد الشحن.
- **معايير القبول:**
  - مزامنة حالة الشحن من مزوّدين (SMSA/Aramex) عند الفتح.
  - تحديث الحالة بعلامة زمنية، وروابط تتبع مباشرة. fileciteturn1file5L121-L129

---

## 9) المرتجعات (Request Return / RMA) — **صفحة جديدة**
- **المسار:** `#/returns/new?orderId=...` و`#/returns`
- **المعالج:** `returnNew()` و`returnsList()`
- **الغرض:** إنشاء طلب إرجاع، متابعة حالته حتى الاسترداد.
- **معايير القبول:**
  - خطوات: اختيار عناصر → سبب الإرجاع → طريقة الإرجاع → تأكيد.
  - إشعار بالبريد/الرسائل وتحديث الحالة. fileciteturn1file8L31-L36

---

## 10) التقييمات والمراجعات (Ratings & Reviews) — **صفحة جديدة**
- **المسار:** `#/reviews/new?orderItemId=...`
- **المعالج:** `reviewNew()`
- **الغرض:** كتابة تقييم 1–5 نجوم ونص مع صور العميل.
- **معايير القبول:** ربط المراجعات بعناصر مشتراة فقط (verified purchase). fileciteturn1file5L73-L77

---

## 11) مركز الدعم (Support Center) — **صفحة جديدة**
- **المسار:** `#/support`
- **المعالج:** `support()`
- **المحتوى:** FAQ + نموذج تذكرة + قناة بريد/دردشة.
- **معايير القبول:** إنشاء تذكرة بالدليل، والرد خلال SLA. fileciteturn1file5L93-L98

---

## 12) الإحالات (Refer Friends) — **صفحة جديدة (Post‑checkout nudges)**
- **المسار:** `#/referrals`
- **المعالج:** `referrals()`
- **الغرض:** مشاركة رابط إحالة فريد؛ إحصاءات الدعوات.
- **معايير القبول:** ظهور بطاقة إحالة في صفحة التأكيد وملف المستخدم.

---

## 13) الولاء والمكافآت (Loyalty/Rewards) — **مرحلة لاحقة**
- **featureFlags.loyalty=false** في الـMVP. تظهر كبطاقة مقفلة في الملف الشخصي.

---

## 14) الملف الشخصي (Profile)
- **المسار:** `#/profile`
- **المعالج:** `profile()`
- **التبويبات:** `Orders`, `Addresses`, `Payments`, `Settings`, `Returns`, `Referrals`.
- **معايير القبول:** تبديل المظهر/اللغة فوري؛ تتبع الطلبات من تبويب Orders. fileciteturn1file4L157-L170

---

## 15) الشبكة الاجتماعية (Social) + تغذية النشاط (Activity)
- **المسار:** `#/social` و`#/activity`
- **المعالج:** `social()` و`activity()`
- **المعايير:** بث مباشر سلس وتعليقات RTL؛ المنشورات المعلّمة تفتح PDP فوراً. fileciteturn1file4L205-L220

---

## قيود/ملاحظات MVP مقارنة بالنسخة السابقة
- إزالة/تعطيل **AR Try‑On** في PDP خلال الـMVP. fileciteturn1file5L26-L34
- الحفاظ على Infinite Scroll ولكن إضافة **زر “عرض المزيد”/ترقيم** لتفادي آثار سلبية على التحويل في بعض الفئات عالية المقارنة.