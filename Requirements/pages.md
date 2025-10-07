Mobile-First Social-Commerce E-Commerce: Pages + Navigation (Spec-Only)
1) Executive Summary

Scope: mobile-first marketplace for Gen-Z with social discovery, creators, UGC, live shopping, and localized checkout.

Primary users: shoppers (Gen-Z), creators/sellers, support agents.

Core tabs (5): Home/Feed, Discover, Cart, Messages, Profile. Five tabs keep primary destinations visible without crowding; Material Design recommends bottom navigation with 3–5 top-level destinations. 
Material Design
+2
Material Design
+2

Accessibility baseline: WCAG 2.2. Include new SC such as 2.5.8 Target Size (Minimum) and 2.5.7 Dragging Movements. 
W3C
+1

Performance budgets (p75): LCP ≤ 2.5s, INP < 200ms, CLS < 0.1 across pages; INP replaced FID in 2024. 
Google for Developers
+2
web.dev
+2

Checkout risk: average cart abandonment ≈ 70%; design for guest checkout, minimal fields, wallet-first. 
Baymard Institute
+1

RTL support: mirror layouts and components when dir=rtl for Arabic; apply bidirectionality rules. 
Material Design
+2
Material Design
+2

Privacy/compliance: PDPL (Saudi) for personal data; PCI DSS v4 for card data scope. 
SDAIA
+2
SDAIA
+2

Success metrics: CVR to order, AOV, D30 retention, creator-attributed GMV share, cart-to-checkout rate, checkout completion rate, INP/LCP/CLS pass rate (p75).

Risk → Mitigation:

Checkout friction → guest checkout, wallet-first, save-later accounts. 
Baymard Institute

UGC abuse/spam → pre/post-moderation flags, rate limits, report flow (see Global Policies).

Attribution disputes → deterministic last-touch within session; override rules for live streams.

Returns gaming → per-seller policy limits, serial-returner scoring, photo proof on high-value items.

Payments failures → idempotent order/create, auth-then-capture, robust reversal paths (partial/failed).

RTL/locale errors → mirrored nav, iconography flip, bidi-safe inputs. 
Material Design
+1

Performance regressions → page budgets and release gates tied to CWV. 
Google for Developers

2) Global Navigation Model
Bottom-Nav Tabs (3–5)

Home/Feed – personalized shoppable feed (UGC, creator cards, promos).

Discover – search, hashtags, categories, trends.

Cart – items, promos, estimator.

Messages – DMs with creators/support + order updates.

Profile – orders, addresses, payments, preferences.

Rationale: five tabs satisfy Material guidance (3–5 top-level destinations). It keeps social (Home/Discover), transaction (Cart), communication (Messages), and account (Profile) one tap away. 
Material Design
+1

Secondary Patterns

In-page tabs for sub-sections (e.g., Orders: Active/History).

Bottom sheets for filters, variant pickers, and quick actions.

Overlays/Full-screen dialogs for sign-in, address edit, and policy views.

Drawer (hamburger) only for seldom-used utilities (legal, labs).

Stateful Nav Rules

Auth gates: posting UGC, messaging, checkout payment step, address save.

Deep links: PDP, creator profile, live session, order detail; preserve return path.

Back: pop to previous page; if entry via deep link, back returns to Home/Feed.

Close: dismisses overlays/bottom sheets without losing parent context.

3) Site Map (Text + Mermaid)
Hierarchy

Home/Feed → PDP, Creator, Live, Discover, Cart.

Discover → Category, PDP, Creator, Search results.

Category → PLP → PDP.

PDP → Cart, Buy Now → Checkout, Creator, Reviews/Q&A.

Cart → Checkout (requires non-empty cart).

Checkout → Success → Orders/Track.

Orders → Detail → Track/Return.

Creator Profile → Storefront grid → PDP; Go Live link (if “now live”).

UGC Post/Upload (auth) → Feed/Creator after moderation.

Live Shopping → PDP/Cart/Checkout.

Messages → Thread → PDP/Order.

Notifications → Deep links to PDP/Orders.

Profile/Settings → Addresses, Payments, Preferences, Referrals, Help.

Referrals & Loyalty → Share → Credit → Cart/Checkout.

Help/Support → FAQ → Contact → Ticket/Thread.

Mermaid
graph TD
  Home((Home/Feed)) -->|tap card| PDP
  Home --> Discover
  Home --> Creator
  Home --> Live
  Home --> Cart

  Discover --> Category
  Discover --> PDP
  Category --> PDP

  PDP -->|Add| Cart
  PDP -->|Buy Now| Checkout
  PDP --> Creator

  Cart -->|Proceed| Checkout
  Checkout -->|Success| Orders
  Orders --> OrderDetail -->|Track/Return| Track

  Creator --> PDP
  Creator --> Live

  Live --> PDP
  Live --> Cart

  Messages --> Thread --> PDP
  Profile --> Orders
  Profile --> Addresses
  Profile --> Payments
  Profile --> Preferences
  Profile --> Referrals
  Profile --> Help

  Referrals --> Cart
  Help --> Messages


Guarded edges: UGC Upload → Feed (auth/moderation); Checkout Payment → Success (auth optional; payment required); Messages → Thread (auth). WCAG and Material govern nav patterns; see citations. 
W3C
+1

4) Navigation Matrix
From \ To	Home	Discover	Category	PDP	Cart	Checkout	Orders	Creator	Live	Messages	Profile
Home	—	Search bar, tag tap	Promo → Category	Card tap	Cart icon	—	—	Creator card	Live banner	DM icon	Avatar
Discover	Tab	—	Category tab	Result tap	Cart	—	—	Creator result	Live row	—	—
Category/PLP	Tab	Search	—	Product tile	Cart	—	—	—	—	—	—
PDP	Home	Discover backstack	Category backstack	—	Add/Add+toast	Buy Now → Checkout	—	Seller badge → Creator	—	Share → Messages	—
Cart	Tab	—	—	Item tap → PDP	—	Proceed (cart > 0)	—	—	—	—	—
Checkout	Back → Cart	—	—	—	Back	—	Success → Orders	—	—	—	—
Orders	Tab	—	—	Reorder → PDP	—	—	—	—	—	Support → Messages	—
Creator	Home	—	—	Grid → PDP	Cart	—	—	—	Join Live	Message → Messages	Follow saved in Profile
Live	Home	—	—	PDP	Cart	Checkout	—	Creator	—	—	—
Messages	Tab	—	—	PDP via shared link	Cart	—	Thread → Order	Creator via link	—	—	—
Profile	Home	—	—	—	—	—	Orders	Seller/Creator switch	—	Messages	—

Blockers: Checkout requires valid shipping + payment; Messages/UGC require auth; Live checkout requires stock. Abandonment controls in Checkout reduce friction. 
Baymard Institute

5) Page Index
ID	Page	Primary User	Purpose	Primary Entry Points	Primary Next Steps
ONB	Onboarding	Shopper	Set interests, consents	First run / Profile	Home
AUTH	Auth	Shopper/Creator	Sign-in/up (OTP/SSO)	Paywall, Post/DM, Profile	Return to caller
HOME	Home/Feed	Shopper	Discovery via social/UGC	Tab default	PDP, Creator, Live
DISC	Discover/Search	Shopper	Intent search & trends	Tab	PDP, Category
CAT	Category/PLP	Shopper	Browse with filters	Discover, Home banners	PDP
PDP	Product Detail	Shopper	Decide & convert	Home, Discover, Creator	Cart/Checkout
CART	Cart	Shopper	Stage order	All pages	Checkout
CO	Checkout	Shopper	Complete purchase	Cart, PDP Buy Now	Success → Orders
ORD	Orders	Shopper	Track/return/reorder	Profile, Success	Track/Return, PDP
CR	Creator Profile	Shopper	Storefront + follow	Home, Discover	PDP, Live
UGC	UGC Post/Upload	Creator/Shopper	Post media	Profile, Creator	Home (post)
LIVE	Live Shopping	Shopper	Real-time selling	Home, Creator	PDP, Cart
MSG	Messages	Shopper/Creator	DM + support	Tab, Help	PDP/Order
NOTIF	Notifications	Shopper	Configure alerts	Profile	—
PROF	Profile/Settings	Shopper	Manage account	Tab	Orders, Addresses
REF	Referrals & Loyalty	Shopper	Share & redeem	Profile, Home CTA	Cart
HELP	Help/Support	Shopper	FAQ + contact	Profile footer	Messages (ticket)
6) PAGE SPECS

Below, each page follows the A–M template. (KPIs align with conversion, engagement, and retention.)

6.1. ONB — Onboarding

A. Purpose & KPIs

Set consents, language, interests.

KPIs: opt-in rate, interest selection rate, time-to-home.

B. Entry & Exit Rules

Entry: first launch, Profile → Onboarding.

Exit: Home; never block shopping.

C. Layout & Components

Header; content list of Interest Chips (multi-select); Consent Toggles (privacy, notifications); Continue.

Empty: show default interests. Error: “Save failed—try again”.

D. Data & Fields

interests[] (enum), consent_marketing (bool), push_opt_in (bool), locale (enum). Required: locale.

E. Business Rules

Use selections as feed hints; do not filter hard.

F. Social-Commerce Elements

“Follow top creators” quick picks.

G. Payments/Checkout

N/A.

H. Accessibility Acceptance Criteria (WCAG 2.2)

24×24px minimum targets (2.5.8). No drag-only gestures (2.5.7). Focus not obscured by sticky bottom bar (2.4.11). 
W3C

I. Performance & Reliability Budgets

LCP ≤ 2.5s; INP < 200ms; CLS < 0.1; preload hero illustration. 
Google for Developers

J. Telemetry & Experimentation

Events: onb_start, onb_interest_select, onb_complete.

K. Edge Cases & Abuse

Under-age users flagged via DOB (if collected) → limited features.

L. Test Scenarios

Given first launch → When continue with no interests → Then feed loads with defaults.

RTL renders mirrored; screen reader announces chips. (dir=rtl verified). 
MDN Web Docs

Target size ≥24px (measure). 
W3C

M. Dependencies

Preferences API; Notifications framework.

6.2. AUTH — Authentication

A. Purpose & KPIs

Authenticate quickly; reduce friction to post, pay, DM.

KPIs: success rate, median time to auth, drop-off.

B. Entry & Exit Rules

Entry: posting UGC, Messages, Checkout payment save.

Exit: return to caller; keep cart and context.

C. Layout & Components

Email/phone field, Send OTP, Continue with social.

Error copy: “Invalid code. Try again.”

D. Data & Fields

email (format), phone (E.164), otp (6-digit). Validation strict.

E. Business Rules

Throttle OTP requests; lockout after N attempts.

F. Social-Commerce Elements

None.

G. Payments/Checkout

Guest checkout allowed; offer account creation after success to lower abandonment. 
Baymard Institute

H. Accessibility

Focus order logical; visible focus (2.4.11/2.4.13); target size (2.5.8). 
W3C

I. Performance

Budget as above; async OTP.

J. Telemetry

auth_initiated, otp_sent, otp_verified, auth_fail.

K. Edge Cases

SIM swap suspicion; step-up verification.

L. Tests

Wrong OTP → error → retry; RTL inputs bidi-safe.

M. Dependencies

Identity provider; rate limit service.

6.3. HOME — Home/Feed

A. Purpose & KPIs

Drive discovery and adds to cart.

KPIs: feed CTR, add-to-cart rate, creator follow rate.

B. Entry & Exit Rules

Entry: app open/tab.

Exit: PDP, Creator, Live, Discover, Cart.

C. Layout & Components

Content zones: For You, Trending, Creator Spotlights, Live Now.

Cards: product tile, creator card, shoppable video.

States: skeletons; empty → “Follow creators to personalize”.

D. Data & Fields

Product core fields; attribution source on each card.

E. Business Rules

Blend recency + relevance; cap repetitive promos.

F. Social-Commerce Elements

Like/Save/Share; quick follow.

G. Payments

“Buy now” allowed → Checkout.

H. Accessibility

Ensure keyboard focus not obscured by sticky bars (2.4.11). Targets ≥24px (2.5.8). 
W3C

I. Performance

Preload first 6 cards; reserve image slots to avoid CLS. Budgets per CWV. 
Google for Developers

J. Telemetry

feed_impression, feed_click, follow_click, video_play.

K. Edge Cases

NSFW/abuse → hide + appeal flow.

L. Tests

Given no follows → show Trending; RTL mirrored.

M. Dependencies

Recommendations; moderation.

6.4. DISC — Discover/Search

A. Purpose & KPIs

Help users find products fast.

KPIs: search success rate, time to first PDP.

B. Entry & Exit

Entry: tab, search from Home.

Exit: PDP, Category.

C. Layout

Search bar, Recent, Trending tags, Filters sheet.

D. Data

Query string, facets, recent queries.

E. Rules

Persist filters per session.

F. Social

Hashtag hubs.

G. Payments

N/A.

H. Accessibility

Announce results count; ensure targets ≥24px. (WCAG 2.2) 
W3C

I. Performance

Debounce input; prefetch top PDPs.

J. Telemetry

search_submit, filter_apply, result_click.

K. Edge

Zero results → suggest broader queries.

L. Tests

RTL search; keyboard nav; screen-reader reads filters.

M. Dependencies

Search service.

6.5. CAT — Category/PLP

A–M condensed; same structure as above

Purpose/KPIs: browse intent → PDP; KPIs: filter usage, PDP CTR.

Entry/Exit: from Discover/Home; to PDP.

Layout: tabs (sub-cats), sort (Relevance/New/Price), sticky filter chips.

Data: category id/slug, sort, filter params.

Rules: persist chips; show low-stock/discount badges.

Accessibility: target size, focus appearance not obscured. 
W3C

Performance: image lazy-load; stable heights (CLS). 
Google for Developers

Tests: empty category; RTL chips wrap; keyboard filter sheet.

6.6. PDP — Product Detail

Purpose/KPIs: convert; KPIs: add-to-cart, buy-now rate.

Entry/Exit: from Feed/Discover/Category/Creator; to Cart/Checkout/Creator.

Layout: gallery, title/price, variant pickers, shipping estimate, seller/creator badge, reviews/Q&A, related.

Data: variants (size/color), stock, pricing (price, compare-at), shipping SLA, return policy.

Rules: block add when variant incomplete; compute estimated delivery.

Social: photo reviews, UGC strip; share; report.

Payments: Add to Cart or Buy Now → Checkout.

Accessibility: ensure variant pickers meet 24px target; focus not obscured. 
W3C

Performance: prefetch cart; preconnect image CDN; LCP budget 2.5s (hero image). 
web.dev

Telemetry: pdp_view, variant_select, add_cart, buy_now.

Edge: out-of-stock; preorder; restricted items.

Tests: RTL gallery mirroring; SR announces price/stock.

6.7. CART — Cart

Purpose/KPIs: stage order; KPIs: cart→checkout rate, promo apply success.

Layout: grouped by seller; qty steppers; promo; totals (items, shipping est., tax).

Rules: update totals instantly; single promo at a time.

Accessibility: steppers 24px; announce totals updates (aria-live). (WCAG 2.2) 
W3C

Performance: defer recommendations; keep CLS < 0.1. 
Google for Developers

Tests: empty cart; invalid promo; RTL math alignment.

6.8. CO — Checkout (address → delivery → payment → review → success)

Purpose/KPIs: complete purchase with minimal friction; KPIs: checkout completion, step drop-off.

Entry/Exit: from Cart/PDP Buy Now; to Success → Orders.

Layout: stepper; address form; delivery options; payment (Wallet, Cards, BNPL per locale); review.

Rules: allow Guest checkout; save account after success to reduce abandonment (~70%). 
Baymard Institute

Totals: items, shipping, tax/VAT, fees, discounts.

Errors & reversals: handle declines; idempotent order create; auth-then-capture; refund flows.

Accessibility: logical focus, target size, redundant entry avoided (3.3.7), accessible auth (3.3.8). 
W3C

Performance: preload payment; mask inputs; budgets per CWV. 
Google for Developers

Tests: guest flow; wallet-first; failure retry; RTL address fields.

6.9. ORD — Orders (list + detail + track + returns)

Purpose/KPIs: reduce WISMO; KPIs: “Where is my order” contacts, self-serve return rate.

Layout: list; detail timeline (Placed→Delivered); Track; Return.

Rules: returns window per policy; instant label for low-risk.

Accessibility: timeline landmarks; target size. 
W3C

Performance: cache last status; poll sparsely.

6.10. CR — Creator Profile & Storefront

Purpose/KPIs: social commerce; KPIs: follow rate, creator-attributed GMV.

Layout: hero (avatar, follow, links), storefront grid, live entry.

Rules: attribute GMV to last-touch creator within session; override when live session active.

Accessibility/Performance: as above.

6.11. UGC — Post/Upload

Purpose/KPIs: content flywheel; KPIs: post publish rate, moderation pass rate.

Rules: auth; content policy; rate limits; report reasons.

Accessibility: captions/transcripts for video; target size; drag-free alternative (2.5.7). 
W3C

6.12. LIVE — Live Shopping

Purpose/KPIs: real-time conversion; KPIs: concurrent viewers, add-to-cart during live.

Layout: video, product carousel, chat; “Tap-to-buy”.

Rules: inventory reserve window; attribution to host creator.

6.13. MSG — Messages/Chat

Purpose/KPIs: assist and convert; KPIs: response time, conversion after chat.

Rules: auth; spam controls; order thread pinning.

6.14. NOTIF — Notifications

Purpose/KPIs: re-engage; KPIs: opt-in rate, open-to-PDP CTR.

Rules: PDPL consent tracking; granular categories. 
SDAIA

6.15. PROF — Profile/Settings

Purpose/KPIs: self-service account; KPIs: successful edits, help deflection.

Sections: Orders, Addresses, Payments, Preferences, Language/RTL toggle, Privacy, Delete account.

6.16. REF — Referrals & Loyalty

Purpose/KPIs: growth/retention; KPIs: invite sends, credit redemptions.

Rules: anti-abuse (device/IP caps), credit expiry, PDPL consent for invitees. 
SDAIA

6.17. HELP — Help/Support

Purpose/KPIs: reduce tickets; KPIs: self-serve resolution rate.

Layout: FAQ accordion; contact form → ticket → Messages thread.

Accessibility: headings, accordion semantics; focus not obscured. (WCAG 2.2) 
W3C

7) REQUIRED PAGE CHECK (all covered)

Onboarding, Auth, Home/Feed, Discover, Category, PDP, Cart, Checkout, Orders, Creator, UGC, Live, Messages, Notifications, Profile, Referrals, Help — all included.

8) GLOBAL POLICIES

Auth gates: require login for UGC, DMs, saving payment methods; allow guest checkout to reduce abandonment. 
Baymard Institute

Error taxonomy: user-fixable (validation, stock), system (timeouts, payment gateway). Provide recovery steps.

Localization & RTL: set dir=rtl for Arabic; mirror layouts/icons; maintain bidi-safe inputs. 
Material Design
+1

Privacy/Security: PDPL compliance for personal data processing; PCI DSS scope limited to tokenized card data or PSP-hosted fields. 
SDAIA
+1

Accessibility baseline: conform to WCAG 2.2 AA; apply new SCs (2.5.8, 2.5.7, 3.3.7, 3.3.8, 2.4.11). 
W3C

Performance: enforce page gates at p75 for LCP ≤ 2.5s, INP < 200ms, CLS < 0.1; INP is the current responsiveness metric (replaced FID in 2024). 
Google for Developers
+1

9) OPEN QUESTIONS & ASSUMPTIONS

BNPL providers and eligibility rules per market.

Wallet priority order (e.g., Apple Pay / local wallets) by device and region.

Returns SLA (days) and categories with stricter policies.

Creator payout model and attribution conflict resolution.

UGC moderation thresholds and appeal SLAs.

Live shopping inventory reservation duration.

Search provider and typo-tolerance strategy.

PDPL data retention limits for logs and analytics. 
SDAIA

PCI scope decision: PSP-hosted checkout vs direct tokenization. 
Middlebury

SMS/Email provider and anti-spam compliance.

Geo-specific shipping/tax calculators.

Support hours and escalation matrix.

Notes on Evidence

Bottom navigation: 3–5 destinations on mobile is Material’s guidance. 
Material Design
+2
Material Design
+2

WCAG 2.2: current W3C Recommendation; adds nine SC including 2.5.7 and 2.5.8. 
W3C

Core Web Vitals thresholds and p75 measurement; INP replaced FID in 2024. 
Google for Developers
+2
web.dev
+2

Abandonment ≈ 70%: long-running Baymard synthesis of 50 studies. 