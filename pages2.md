# StoreZ Marketplace Prototype Pages (Index)

This index links to role-specific page docs, each mapping screens to exact route handler functions for fast cross-referencing and implementation.

- Buyer SPA pages → `docs/pages-buyer.md`
- Seller SPA pages → `docs/pages-seller.md`
- Admin SPA pages → `docs/pages-admin.md`
- Persona Hub → `docs/pages-hub.md`

---

## Quick Overview

The detailed specifications have been split by role. Use the links above. Below is a short reminder of major surfaces:

- Buyer: Landing/Auth, Home, Discover, PDP, Cart, Checkout, Wishlist, Profile, Social, Activity, AR, UGC redirect
- Seller: Dashboard, Catalog (+new/edit/import), Orders (+detail), Returns, Creator, Live, UGC, Analytics, Settings, Billing
- Admin: Overview, Creators, Live, Moderation, Orders, Support, Settings
- Hub: Persona switcher (Buyer/Seller/Admin)
For full component breakdowns, data flows, i18n keys, and acceptance criteria, see the role-specific files.

---

## 3. Discover Grid

**Purpose:** Explore entire catalog with category filters and sorting.

- **Category Tiles**
  - Large tappable cards: Footwear, Apparel, Home Decor, etc.
- **Filter Sidebar** (slide-in)
  - Price range slider, star rating checkboxes, brand search.
  - Clear all & apply filter buttons.
- **List / Grid Toggle**
  - Switch between list view (one card per row) and grid view (two per row).
- **Infinite Scroll**
  - Automatically loads next page of products when scrolling near bottom.

---

## 4. Product Detail (PDP)

**Purpose:** Show all product information, allow selection, AR preview, and purchase actions.

- **Image Gallery**
  - Main large image on left (desktop) / top (mobile).
  - Thumbnail carousel below main image.
  - Tap thumbnail to change main image.
- **Title & Ratings**
  - Product title in large bold font.
  - Star rating display with average rating and review count.
  - “Verified” count badge if applicable.
- **Pricing**
  - Current price in bold primary color.
  - List price (if on sale) struck through.
- **Description**
  - Localized text (`loc(product, 'description')`).
- **Variant Options**
  - Color swatches: highlight selected.
  - Size selector buttons, disabled if out of stock.
  - **Size Guide** link opens size chart sheet.
- **Action Buttons**
  - “Add to Cart” (updates cart state globally).
  - “Wishlist” heart button.
  - “Compare” scale icon.
- **AR Preview**
  - Section header: “📱 Try with AR”.
  - Buttons for Virtual Try-On and See in Your Space if supported.
  - Calls `actions.startARSession()` and manages session.
- **Product Features Card**
  - List: Free shipping ✓, Easy returns ✓, Warranty info, Eco-friendly.
  - “Shipping & Return Policy” button opens modal sheet.
- **Specifications**
  - Grid of key/value pairs: Origin, Care, Material, etc.
  - Localized via `t(key)` and product.specifications object.
- **Similar Products**
  - Carousel of related items with thumbnail, price, and % match.
- **Customer Reviews**
  - List of reviews with title, body, star rating, and “Write Review” button.

---

## 5. Cart

**Purpose:** Review cart items, adjust quantities, and proceed to checkout.

- **Cart List**
  - Each row shows thumbnail, name, unit price, quantity selector (±), and remove button.
  - Live subtotal updates as quantity changes.
- **Price Summary**
  - Subtotal, estimated shipping (if any), taxes.
  - Promo code input field with “Apply” button and discount display.
- **Actions**
  - Primary “Checkout” button.
  - Secondary “Continue Shopping” link resets hash to `#/home`.

---

## 6. Checkout

**Purpose:** Collect shipping & payment info and finalize the order.

- **Progress Indicator**
  - Steps: Shipping → Payment → Review.
  - Highlight current step.
- **Shipping Form**
  - Fields: Name, Address line 1, line 2, City, ZIP, Country dropdown, Phone.
- **Payment Form**
  - Credit card input (number, expiry, CVV).
  - Option to save card details.
- **Order Summary Panel**
  - List of cart items with thumbnail, qty, price.
  - Editable quantities in-line.
- **Place Order**
  - Confirm all details, then tap “Place Order” to submit.

---

## 7. Order Confirmation

**Purpose:** Confirm successful purchase and next steps.

- **Success Banner**
  - Large checkmark icon and message “Thank you for your purchase!”
- **Order Details**
  - Order number, summary of items, delivery estimate.
- **Actions**
  - “Shop More” returns to home.
  - “Go to Orders” navigates to Profile → Orders tab.

---

## 8. Wishlist

**Purpose:** Save favorite items for later purchase.

- **Grid/List of Saved Items**
  - Same card design as Discover.
  - Remove heart icon to unfavorite.
- **Bulk Actions**
  - Select multiple items, then “Add All to Cart” or “Remove Selected”.
- **Empty State**
  - Illustration with text “Your wishlist is empty.” and “Start Shopping” CTA.

---

## 9. Profile / Account

**Purpose:** Manage user settings, view order history, addresses, and payment methods.

- **Profile Header**
  - Avatar, user name, “Edit Profile” button.
- **Tabs**
  - Orders, Addresses, Payment Methods, Settings.
- **Settings Panel**
  - Language toggle (EN/AR), theme switch (light/dark), notification preferences.

---

## 10. Messages

**Purpose:** In-app messaging for support and social interactions.

- **Thread List**
  - List of active chats with support or creators.
  - Unread message badges.
- **Chat View**
  - Chat bubbles aligned left/right, timestamp, quick input at bottom.
- **New Message**
  - Composer modal to start new conversation.

---

## 11. Social / Live Commerce

**Purpose:** Showcase creator posts, live streams, and social commerce features.

- **Live Player**
  - Full-width video at top with overlay controls: Like, Comment, Join.
- **Creator Feed**
  - Posts with images, tagged products linking to PDP.
  - “Share Product” share sheet triggered on product tap.
- **Engagement**
  - Like, comment, share icons under each post.

---

## 12. AR Experience

**Purpose:** Immersive AR preview of products in physical space.

- **Full-Screen AR View**
  - 3D model overlay on camera feed or environment.
- **Modes**
  - **Virtual Try-On:** Shows product on user (e.g., glasses on face).
  - **Placement Preview:** Allows placement of furniture or decor in room.
- **Controls**
  - Mode switch, capture photo, share snapshot.

---

## 13. Authentication Flow

**Purpose:** Secure user sign-in, sign-up, password recovery, and email verification.

- **Sign In Page**
  - Components: Email input, Password input, "Sign In" button, "Forgot Password" link, "Quick Login (Demo)" button.
  - Validation: Show inline errors for invalid email or empty password.
  - Actions: Calls `actions.signIn(credentials)`, on success navigates to `#/home`, on failure displays `t("auth_error")`.
- **Sign Up Page**
  - Components: Name, Email, Password, Confirm Password fields, "Sign Up" button.
  - Password strength meter using helper `checkPasswordStrength()`.
  - Terms checkbox with link to privacy policy.
  - Actions: Calls `actions.signUp(userInfo)`, sends verification email, navigates to `#/verify-email`.
- **Forgot Password**
  - Components: Email input, "Send Reset Link" button.
  - Actions: Calls `actions.sendPasswordReset(email)`, shows confirmation sheet with `t("reset_link_sent")`.
- **Email Verification**
  - Triggered via `#/verify-email?token=xxx`.
  - Components: Success/failure banner based on `actions.verifyEmail(token)`.
  - CTA: "Go to Sign In" on success, "Resend Verification Email" on failure.

---

## 14. Seller Dashboard (SPA)

**Purpose:** Allow creators/brands to manage products, view orders, and see basic analytics.

- **Dashboard Home**
  - Overview cards: Total sales, pending orders, products live.
  - KPI charts: Sales by day (line chart), Top products (bar chart).
- **Product Management**
  - List view with table columns: ID, Name, Price, Stock, Status, Actions (Edit, Delete).
  - "Add New Product" form: Name, Category, Price, Stock, Description, Specifications, Images.
  - Uses `actions.createProduct`, `actions.updateProduct`, `actions.deleteProduct`.
- **Order Management**
  - Table of orders: Order ID, Customer, Status dropdown, Total amount.
  - Status change triggers `actions.updateOrderStatus(orderId, status)`.

---

## 15. Admin Dashboard

**Purpose:** Platform operations portal for administrators to monitor overall system health, manage users and sellers, and access platform reports.

- **Admin Home**
  - **Metrics Cards:** Total Sellers, Active Buyers, Daily GMV (gross merchandise volume), New Sign-ups.
  - **System Health:** Uptime status indicator, API error rate gauge.
  - Uses `actions.fetchAdminMetrics()` to populate `state.admin.metrics`.
- **User Management**
  - **User Table:** Columns: User ID, Name, Email, Role, Status (Active/Suspended), Actions (Suspend/Reactivate)
  - **Search & Filter:** By email, role (Buyer/Seller/Admin), status.
  - Bulk actions: Suspend selected, Send Warning Email.
  - Calls `actions.updateUserStatus(userId, status)` and `actions.sendUserNotification(userId, message)`.

- **Seller Oversight**
  - **Seller List:** Columns: Seller ID, Brand Name, Subscription Tier, Date Joined, Last Active.
  - Actions: Upgrade/Downgrade subscription, Deactivate account.
  - Uses `actions.fetchSellers()`, `actions.updateSubscription(sellerId, tier)`, `actions.deactivateSeller(sellerId)`.

- **Reporting & Logs**
  - **Download Reports:** Buttons to export CSV for Orders, Transactions, User Activity.
  - **Real-time Logs Panel:** Stream of server logs (info/warning/error) for immediate debugging.
  - Uses `actions.downloadReport(type)` and `actions.streamLogs()` APIs.

- **Access & Auditing**
  - Role-based guard: Admin-only routes/components (`role === 'admin'`).
  - Audit trail: write admin actions (suspensions, tier changes) to `state.admin.audit` and persist.

- **Acceptance Criteria**
  - Admin metrics render under 1s with cached data.
  - Bulk user actions show confirmation and result toast.
  - All admin-only actions are hidden/disabled for non-admin accounts.

---

## 16. Persona Hub / Switcher

**Purpose:** Central entry point to choose or switch between Buyer, Seller, and Admin SPAs.

- **Hub Screen** (`index.html` root)
  - **Persona Tiles:** Three large buttons for Buyer, Seller, and Admin. Each tile shows icon, label, and brief description.
  - **Click Behavior:** Opens respective SPA in new tab or window:
    - Buyer → `#/home`
    - Seller → `frontend/Seller/index.html`
    - Admin → `frontend/admin/index.html`
  - **Persist Selection:** Saves last used persona in `localStorage` under key `storez_persona`. On subsequent visits to `index.html`, auto-redirects to saved persona SPA.
- **UI Layout**
  - Vertically centered grid on desktop, stacked buttons on mobile.
  - Uses CSS custom property `--gap` for consistent spacing and `--card` background for persona tiles.
  - Accessible labels (`aria-label`) for each persona button.
- **Accessibility & i18n**
  - All text keys localized: `t("select_persona")`, `t("buyer_portal")`, `t("seller_portal")`, `t("admin_portal")`.
  - Keyboard navigable using tab order and Enter key activation.

---

## 17. Activity Feed

**Purpose:** Display the user’s recent interactions and network updates in a unified timeline.

- **Route & Data**
  - Route: `#/activity` → handler `activity({ el, state })`.
  - Data source: `state.social.activities` (latest first). Limit 20 items by default.

- **Layout**
  - Container width: max 600px, centered, 20px padding.
  - Header: `t("recent_activity")`.
  - List: Render each activity via `renderActivity(activity)` (icon, title, timestamp, optional CTA).
  - Empty state: `t("no_activity")` centered gray text.

- **Events**
  - Tapping a product-related activity navigates to `#/pdp/:id`.
  - Follow events navigate to creator profile in Social.

- **i18n Keys**
  - `recent_activity`, `no_activity`, plus per-activity verb strings (e.g., `liked_product`, `review_posted`).

- **Acceptance Criteria**
  - Feed renders ≤ 300ms with 20 items.
  - Each item offers a stable target (either PDP or Social) and never dead-ends.

---

## 18. UGC Feed (Legacy Redirect)

**Purpose:** Preserve backward compatibility for older links while consolidating the experience under the new Social feed.

- **Route Behavior**
  - Route: `#/ugcfeed`.
  - Implementation: Immediate redirect to `#/social` (`location.hash = "#/social"`).

- **Notes for Developers**
  - Do not add new navigation entry points to `#/ugcfeed`; link to `#/social` instead.
  - Keep the redirect until external links are fully migrated.

- **Acceptance Criteria**
  - Hitting `#/ugcfeed` should never leave the user stranded—redirect happens synchronously.