# StoreZ Demo Hub

StoreZ is a mobile-first social commerce showcase. The repo contains three single-page demos—Buyer, Seller, and SysAdmin—plus a control hub that lets non-technical stakeholders jump between personas instantly. No build, backend, or package installation is required.

---

## Quick Start (2 minutes)

1. **Download or clone** the repository to your computer.
2. **Open the main hub:** double-click `frontend/index.html`. It loads in any modern browser (Chrome, Edge, Safari, Firefox).
3. **Pick a persona** in the hub and press the “Open …” button. The demo launches in a new tab.

ℹ️ Everything runs client-side—no terminals, servers, or credentials needed. If you prefer to use a local HTTP server (optional), instructions are below.

---

## Persona Overview

| Persona | Entry Point | Highlights |
|---------|-------------|------------|
| **Buyer** | `frontend/index.buyer.html` | Shopper journey with onboarding, wishlist, cart/checkout, loyalty & support flows. |
| **Seller** | `frontend/index.seller.html` | Creator console covering catalog setup, live commerce, order ops, marketing, and subscription management. |
| **SysAdmin** | `frontend/index.sysadmin.html` | Platform ops dashboard for moderation, compliance, security, and support oversight. |

Use the hub (`frontend/index.html`) when presenting—stakeholders can bounce between personas without typing URLs.

---

## Optional: Serve via Local HTTP

Some browsers restrict clipboard or storage features when opening files from the filesystem. To run everything under `http://localhost`:

```bash
# Python 3 (already included in macOS / many PCs)
python -m http.server 8080
# or, using Node.js if installed
npx serve frontend
```

Then browse to:

```
http://localhost:8080/frontend/index.html
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Hub doesn’t switch personas | Make sure you are opening `frontend/index.html` (not the old demo root). |
| Images fail to load offline | An internet connection is required for the hosted product imagery (Unsplash). |
| LocalStorage reset | Use the “Reset demo data” button in each persona header to start fresh. |
| RTL or Arabic not toggling | Use the profile page (Buyer) or settings to toggle RTL; refresh to persist across sessions. |

---

## Project Structure

```
frontend/
├─ index.html         # Persona hub (controls all demos)
├─ index.buyer.html   # Buyer SPA
├─ index.seller.html  # Seller SPA
├─ index.sysadmin.html# SysAdmin SPA
└─ admin/             # (Optional) admin-specific assets
tasks/                # Persona backlog & planning docs
Requirements/         # Business requirements & diagrams
```

---

## Feedback & Next Steps

The demo reflects the business journey diagram captured in `Requirements/diagram-export-10-4-2025-1_34_28-PM.png`. For roadmap ideas and coverage gaps check the persona task lists inside `tasks/`. Feel free to branch from this repo and continue iterating—the hub will automatically pick up changes when you update the persona files.

Enjoy the tour! 🎉
