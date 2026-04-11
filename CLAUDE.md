# GAINAGE — CLAUDE.md

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.
- **Check `brand_assets/`** for logos, SVGs, and colour swatches before designing anything. Use them. Do not invent brand assets.
- **Check `design-reference/`** screenshots before building any page or section. Match them exactly — do not improve or add to the design.

---

## Project

GAINAGE — gym apparel DTC brand on Shopify. Drop-based model organised by **Iterations** (e.g. Iteration 001). Multi-SKU collections (pump covers, tees, hoodies). Store: `gainage.myshopify.com`. Domain: `www.gainage.com`.

**Tagline:** "A SEVERE ADDICTION TO PROGRESS"

**Deployment:** Push to main → GitHub auto-sync → deploys to `gainage-theme/main` (unpublished theme). Must publish via Shopify admin to go live. Page template dropdown only reads from the published theme.

## Commands

```bash
shopify theme dev --store gainage.myshopify.com        # Local dev (hot reload, proxies store data)
shopify theme push --unpublished                        # New unpublished theme
shopify theme push --theme <id>                         # Push to specific theme
shopify theme list                                      # List themes
```

Requires Node.js 18+, Shopify CLI. No local Liquid rendering — dev server requires internet.

---

## Screenshot & Comparison Workflow

### Dev Server
- **Always use the Shopify dev server** — never screenshot a `file:///` URL.
- Start the dev server before taking any screenshots: `shopify theme dev --store gainage.myshopify.com`
- The dev server runs at `http://127.0.0.1:9292` by default.
- If the server is already running, do not start a second instance.

### Screenshot Process
When building or modifying any page or section:

1. Ensure `shopify theme dev` is running and serving at `http://127.0.0.1:9292`.
2. Build the initial output and push changes so the dev server reflects them.
3. Screenshot the relevant page (e.g. `http://127.0.0.1:9292/password`, `http://127.0.0.1:9292/products/[handle]`).
4. Read the screenshot and compare directly against the relevant `design-reference/` image.
5. Be specific when comparing: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px", "accent colour is wrong — should be `#FFA500`".
6. Fix all mismatches. Re-screenshot.
7. Do **at least 2 comparison rounds**. Stop only when no visible differences remain or the user says so.

### Check on Every Pass
- Spacing and padding
- Font size, weight, letter-spacing, line-height
- Exact hex colour values (especially accent gold `#FFA500`)
- Alignment (especially left-nav vertical stack on desktop)
- Border-radius (0px everywhere — no exceptions)
- Shadows and overlays
- Image sizing and cropping
- Mobile layout (price and ATC above fold)

---

## Architecture

**Dawn fork (v15.4.1)** — Dawn provides cart, Liquid, checkout. We own the visual layer via `gainage-*` prefixed files. Dawn's `settings_schema.json` is unmodified.

### Pages (V1)

| Page | Template | Notes |
| --- | --- | --- |
| Homepage | `index.json` | Full-bleed hero + featured collection grid |
| Collection | `collection.json` | 3-col product grid, labelled by Iteration |
| Product | `product.json` | Image left, info right. Size selector + ATC |
| Password / Coming Soon | `password.json` | Custom — centred logo, email sign-up, password link |
| FAQ | `page.faq.json` | Shopify page handle `faq` assigned to `page.faq` template |
| Contact | `page.contact.json` | Unmodified Dawn contact form |
| Size Chart | `page.size-chart.json` | Static table, linked from product page |

Out of scope: lookbook, blog, loyalty programme, account portal (beyond Dawn default).

### Key Sections

- `gainage-header` — Icon logo (G-arrow mark) centred top. Below: GAINAGE wordmark + tagline top-left, nav top-right (SEARCH / CART(count) / CHECKOUT). Secondary left nav: Iteration label, Shipping Policy, Terms of Service, Account, Instagram icon.
- `gainage-hero` — Full-bleed product/campaign image. Overlay copy optional.
- `gainage-collection-grid` — 3-col grid. Product card: image, name (white caps), price (gold/amber). Hover: subtle brightness lift only.
- `gainage-product-hero` — Image 50% left (sticky, thumbnail strip below). Info 50% right: product name (white caps) → price (gold) → spec bullets (white caps, centered) → size selector (inline pills) → ATC button → SIZE CHART / SHIPPING POLICY links (gold underline).
- `gainage-cart-drawer` — Slide-in from right. Gold (`#FFA500`) background. Header: "YOUR CART" / item count. Free shipping progress bar. Line items with qty +/−. Footer: SUBTOTAL + T&C checkbox + VIEW CART / CHECK OUT buttons.
- `gainage-password` — Full black screen, vertically centred. GAINAGE wordmark → "SIGN UP FOR ITERATION : 001" (iteration number in gold) → email input + SIGN UP button → "CLICK FOR PASSWORD ACCESS" (green text link).
- `gainage-footer` — Minimal. "Copyright © 2026, GAINAGE LTD." centred.

### Key Snippets

- `gainage-buy-form` — Wraps Dawn's `<product-form>`. Needs: `<form>`, `<input name="id">`, size variant selector, `<button>` (ATC), `{% render 'loading-spinner' %}`.
- `gainage-size-selector` — Inline pill group. Selected state: white bg / black text. Unselected: black bg / white border / white text. Sold-out: strikethrough, reduced opacity.
- `gainage-product-specs` — Centred uppercase bullet list of material/fit specs above size selector. Hardcoded per product or driven by metafield `custom.specs`.
- `gainage-gallery-desktop` — Main image swap via thumbnail click (`data-media-index`). Thumbnails strip below main image.
- `gainage-gallery-mobile` — Scroll-snap swipe, arrow controls.
- `gainage-free-shipping-bar` — Progress bar in cart drawer. Fills amber/gold as cart total approaches free shipping threshold.

### JS Behaviour

- **Cart drawer:** Opens on ATC. Slide-in from right. Closes on X or outside click. Updates item count in header via `PUB_SUB_EVENTS.cartUpdate`. Cart type: drawer (not page redirect, not toast).
- **Size selector:** Single-select pill. Updates hidden `<input name="id">` with variant ID on selection.
- **Gallery:** Desktop thumbnail click swaps main image. Mobile: `scrollBy()` arrow controls.
- **Password page:** Email submit POSTs to Klaviyo or Shopify newsletter form. No JS redirect needed — password page is Shopify native with custom template.
- **Free shipping bar:** Reads `cart.total_price`, calculates % toward threshold, updates CSS `width` on bar fill element.

---

## Design System

### Colours

| Token | Value | Usage |
| --- | --- | --- |
| `--g-color-bg` | `#000000` | Page background — always black |
| `--g-color-text` | `#FFFFFF` | Primary text, product names, nav |
| `--g-color-accent` | `#FFA500` | Prices, iteration labels, ATC border, cart bg, active states, CTA text |
| `--g-color-accent-hover` | `#CC8400` | Accent hover darkened |
| `--g-color-secondary` | `#333333` | Subdued text, inactive states |
| `--g-color-separator` | `#222222` | Dividers, borders |
| `--g-color-size-border` | `#FFFFFF` | Size pill unselected border |
| `--g-color-green` | `#00AA00` | Password page link only |
| `--g-color-cart-bg` | `#FFA500` | Cart drawer background |
| `--g-color-cart-text` | `#000000` | Text on cart drawer |

### Typography

**Two fonts only:**

- `.g-display` — Custom condensed bold (or `Anton`, `Impact`, fallback `Arial Black`). Used for: GAINAGE wordmark, product names, section headings, size labels, ATC button, nav items. Always uppercase.
- `.g-body` — System font stack (`-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif`). Used for: tagline, spec descriptions, policy text, footer.

No third font. All display text is uppercase. Letter-spacing: `0.05em` on display, `0.1em` on nav/labels.

### Spacing Tokens

```css
--g-margin-desktop: 40px;
--g-margin-mobile: 20px;
--g-nav-height: 60px;
--g-header-icon-height: 40px;
```

### Responsive

Single breakpoint: `1024px`. Mobile-first. Price and ATC must be above fold on mobile. Collection grid: 3-col desktop → 2-col tablet → 1-col mobile (or 2-col mobile for smaller items).

### Interactions

- ATC button: border colour lift on hover, 150ms.
- Product card: brightness `1.1` on hover, 150ms.
- Cart drawer: slide-in 300ms ease.
- Size pill: instant state swap on click.
- Nothing else. 0px border-radius everywhere except size pills.

### Logo / Icon

- **Icon mark:** Stylised "G" with arrow/slash through it (SVG inline). Centred in header bar at top.
- **Wordmark:** "GAINAGE" in condensed bold display font, top-left. Tagline "A SEVERE ADDICTION TO PROGRESS" in small body font directly below wordmark.

---

## Anti-Generic Design Guardrails

These rules stop lazy or AI-default design decisions from entering the codebase.

- **Colours:** Never invent colours outside the design system tokens above. Never use Tailwind default palette (indigo-500, blue-600, etc.).
- **Shadows:** Never use flat `shadow-md`. If shadows are used they must be colour-tinted with low opacity, consistent with the black/dark palette.
- **Animations:** Only animate `transform` and `opacity`. Never use `transition-all`. Easing should feel deliberate — not bouncy or playful. GAINAGE is direct and controlled.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states defined. No exceptions.
- **Border-radius:** 0px everywhere. Size pills: 0px. Buttons: 0px. Cards: 0px. This is non-negotiable to the brand aesthetic.
- **Typography:** Never introduce a third font. Never use system fonts for display text. Always uppercase for `.g-display` contexts.
- **Spacing:** Use the defined spacing tokens. Do not use random Tailwind steps that break the grid.
- **Images:** Hero images may use a gradient overlay (`bg-gradient-to-t from-black/60`) where copy sits over them. Do not add colour treatment layers that alter brand colours.

---

## Layout Patterns

### Header (Desktop)

```
[ ← G-icon mark centred → ]
[GAINAGE + tagline (left)]   [SEARCH | CART(0) | CHECKOUT (right)]
[ITERATION 1 (SHOP) (left)]
[SHIPPING POLICY (left)]
[TERMS OF SERVICE (left)]
[ACCOUNT (left)]
[Instagram icon (left)]
```

The left-side nav is a vertical stack, persistent on desktop. On mobile it collapses into a hamburger or is hidden behind a menu toggle.

### Product Page

```
[LEFT 50% — sticky]              [RIGHT 50% — scrolls]
  Main image                       PRODUCT NAME (white, display)
  [thumb] [thumb]                  £PRICE (gold, display)

                                   SPEC LINE 1.
                                   SPEC LINE 2.
                                   SPEC LINE 3. (centred, white caps, body)

                                   CHOOSE SIZE
                                   [S-M] [L] [XL] [XXL] (pills)

                                   [ADD TO CART] (gold border, gold text, black bg)

                                   SIZE CHART (gold underline link)
                                   SHIPPING POLICY (gold underline link)
```

### Cart Drawer

```
[YOUR CART ————————— 2 ITEMS  ✕]
[████████████████░░░░░░░░░░░░░░]  ← free shipping bar
[YOU'VE UNLOCKED FREE SHIPPING]

  [img]  PRODUCT NAME          £80
         ITERATION 001
         XL
         [−] 2 [+]

[SUBTOTAL ——————————————— £80]
[☐ I agree to the terms and conditions]
[VIEW CART]        [CHECK OUT]
```

Cart drawer background: `#FFA500`. All text on cart: `#000`. Buttons: black bg, white text.

### Password Page

```
(full black, vertically centred)

         GAINAGE
  SIGN UP FOR ITERATION : 001
  [YOUR E-MAIL         ] [SIGN UP]
  CLICK FOR PASSWORD ACCESS
```

---

## Brand Voice

Direct. No-nonsense. Training-first. State the material and what it does — stop there.

**Banned words:** premium, luxury, affordable, budget-friendly, game-changer, revolutionary, elevate, curated, bespoke, unleash, grind, hustle (as marketing speak).

**Tone rules:**
- All product copy in uppercase on-page.
- Specs are facts, not promises. "COTTON 300GSM." not "premium heavyweight cotton."
- No exclamation marks.
- No fake reviews, countdown timers, or manufactured social proof.
- Never reference competitors.
- Drop/Iteration framing: products belong to an Iteration (e.g. "ITERATION 001"). This is core to the brand identity and must be surfaced in collection labels, product subtitles, and cart line items.

---

## Iteration / Drop Model

- Products are grouped into **Iterations** (drops). Current: **Iteration 001**.
- Collection handle for Iteration 001: `iteration-001`.
- Navigation label format: `ITERATION 1 (SHOP)` — gold "ITERATION 1", white "(SHOP)".
- Future iterations get their own collection. Navigation updates to reflect active iteration.
- Product tags: `iteration-001`, category tags: `pump-cover`, `tee`, `hoodie`, etc.

---

## Key Metafields

| Namespace.key | Type | Usage |
| --- | --- | --- |
| `custom.specs` | Multi-line text | Spec bullet list on product page (one spec per line) |
| `custom.iteration` | Single-line text | e.g. "ITERATION 001" — shown under product name on cards |
| `custom.size_chart_image` | File (image) | Size chart image per product or collection |

---

## Currency & Region

- **Currency:** GBP (£)
- **Region:** UK primary market
- Prices displayed as `£XX` — no decimals unless pence apply.

---

## Reference Docs

- `design-reference/` — Screenshots of password page, product page, collection page, cart drawer
- `brand-assets/` — G-icon SVG, GAINAGE wordmark SVG, approved colour swatches
- `copy/` — Approved product copy per Iteration

---

## Hard Rules

- Do not add sections, features, or content not in the reference or explicitly requested
- Do not "improve" a reference design — match it exactly
- Do not stop after one screenshot comparison pass — minimum 2 rounds
- Do not use `transition-all` under any circumstances
- Do not use border-radius anywhere (0px is the brand standard)
- Do not introduce colours outside the design system token list
- Do not introduce a third font
- Do not use Tailwind default colour palette as primary or accent colours
- Do not write copy that uses any banned brand voice words
- Do not surface student or customer data in URLs or query parameters
