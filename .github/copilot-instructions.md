# StoreZ Demo: AI Coding Instructions

## Architecture Overview

StoreZ is a **mobile-first social commerce showcase** with three separate SPAs sharing common patterns:
- **Buyer SPA** (`frontend/buyer/`) - Shopper journey with i18n routing
- **Seller SPA** (`frontend/Seller/`) - Creator console (monolithic single file)
- **Admin SPA** (`frontend/admin/`) - Platform operations dashboard
- **Hub** (`index.html`) - Persona switcher that launches SPAs in new tabs

Each SPA is completely standalone with no shared dependencies or build system. All code runs client-side using ES modules.

## Development Workflow

### Local Development
Always serve via HTTP to avoid CORS issues with ES modules:
```bash
python -m http.server 8080
# Browse to: http://localhost:8080/frontend/index.html
```

### Module Structure Patterns
- **Buyer**: Modular architecture (`app.js` + `routes.js` + `data.js` + `i18n.js`)
- **Seller/Admin**: Monolithic single-file SPAs (all code in `app.js`)

### State Management
- **LocalStorage keys**: `storez_spa_state_v2` (buyer), `storez_seller_*` (seller), `storez_admin_*` (admin)
- **State persistence**: Use `loadState()`/`saveState()` pattern in `data.js`
- **Cross-SPA communication**: via localStorage keys for language/theme preferences

## Key Conventions

### Internationalization (i18n)
```javascript
// Buyer pattern (i18n.js)
setLang(lang); // Sets global language
t(key); // Translate string
dirForLang(lang); // Returns "rtl" for Arabic, "ltr" for others

// Seller/Admin pattern (inline dictionaries)
const DICT = { en: {...}, ar: {...} };
getLang() === "ar" ? "rtl" : "ltr";
```

### Theme System
```css
/* CSS custom properties pattern */
html[data-theme="dark"] { --bg:#0b0c10; --text:#f1f3f4; }
html[data-theme="light"] { --bg:#ffffff; --text:#101114; }
```

### Routing Patterns
```javascript
// Hash-based routing: #/pdp/p1, #/cart, #/profile
// Route handlers receive: { el, state, actions, t, navigate, showSheet }
const routes = { 
  "home": homeHandler,
  "pdp": (ctx, id) => pdpHandler(ctx, id) 
};
```

### Currency Formatting
Always use SAR (Saudi Riyal) with locale-aware formatting:
```javascript
// English: "SAR 299" | Arabic: "٢٩٩ ر.س"
fmtSAR(299); // or currency(299) in buyer
```

### Image Assets
Use Unsplash with consistent sizing:
```javascript
const uns = (id, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;
```

## File Locations & Patterns

### Adding New Features
- **Buyer routes**: Add to `routes.js` exports object
- **Seller/Admin views**: Add function + route case in monolithic `app.js`
- **Data models**: Extend `state` object in respective data management

### Styling Approach
- Inline styles in HTML head (no external CSS frameworks)
- CSS custom properties for theming
- Mobile-first responsive design with `@media (min-width:720px)`

### Common Components
- **Cards**: Product cards with wishlist toggle, add-to-cart actions
- **Sheets**: Modal overlays for detailed views (`showSheet()` pattern)
- **Navigation**: Bottom tab navigation on mobile, sidebar on desktop

## Business Context

This is a **Saudi Arabian social commerce platform** demo focusing on:
- Gen-Z mobile shopping experiences
- Creator-driven product discovery
- Live commerce and social features
- Arabic/English bilingual support with RTL layout
- PDPL (Saudi data protection) compliance considerations

## Performance Targets
- LCP ≤ 2.5s, INP < 200ms, CLS < 0.1
- Guest checkout optimization (70% cart abandonment mitigation)
- Minimal bundle approach (no build tools, direct ES modules)

## Critical Files to Understand
- `frontend/buyer/data.js` - State management patterns
- `frontend/buyer/routes.js` - SPA routing and view rendering
- `index.html` - Hub architecture and persona switching
- `Requirements/pages.md` - Business requirements and success metrics