# /create-ai-page — Best Deal Australia Page Generator

Generate a complete, publish-ready SEO page for the keyword `Best deals on [Product Category] Australia`.

**Usage:** `/create-ai-page [product category]`
**Example:** `/create-ai-page running shoes`

---

## EXECUTION RULES (follow in order — do not skip steps)

---

### STEP 1 — Confirm the product category

Accept the category from the command argument. If missing, ask:
> "Which product category should I build the page for?"

Set:
- **KEYWORD:** `Best deals on [Category] Australia`
- **SLUG:** `best-deals-[category-slug]-australia`

---

### STEP 2 — Query the database for matching offers and stores

The database is hosted on Coolify (remote MySQL 8 at `77.42.44.53:3306`, database `default`).
Connection details are in `.env` — `src/lib/db.ts` reads them automatically.

**Database schema (actual):**
- `advertisers`: id, name, slug, logo_url, status, epc, conversion_rate — 570 rows
- `offers`: id, advertiser_id, title, description, coupon_code, destination_url, tracking_url, start_date, end_date, is_expired, category — 7,457 rows
- Note: most offers have `category = NULL`, so search by `title` and `description` is essential.

**Get relevant offers for this category:**
```sql
SELECT
  o.id         AS offer_id,
  o.title,
  o.description,
  o.coupon_code,
  o.end_date,
  o.is_verified,
  a.id         AS advertiser_id,
  a.name       AS store_name,
  a.slug       AS store_slug,
  a.logo_url
FROM offers o
JOIN advertisers a ON o.advertiser_id = a.id
WHERE o.is_expired = 0
  AND (
    o.title LIKE '%[CATEGORY]%'
    OR o.description LIKE '%[CATEGORY]%'
    OR o.category LIKE '%[CATEGORY]%'
  )
ORDER BY a.epc DESC, a.conversion_rate DESC
LIMIT 20;
```

**Get all active stores (for internal links section):**
```sql
SELECT id, name, slug, logo_url
FROM advertisers
WHERE status = 'active'
ORDER BY name ASC
LIMIT 50;
```

Record from the results:
- **Matched offers** — `offer_id`, `store_name`, `store_slug`, `title`, `coupon_code`
- **All active stores** — `name`, `slug` (used for internal store links)

---

### STEP 3 — Web research (minimum 4 searches)

Run these searches to get real product data, prices, and retailer info:

```
Search 1: best deals [CATEGORY] Australia [current year]
Search 2: cheapest [CATEGORY] Australia retailer price comparison
Search 3: [CATEGORY] sale Australia [top brand 1] vs [top brand 2]
Search 4: [CATEGORY] Australia new arrivals clearance 2025 2026
```

Extract and record:
- 5 specific products with brand, model, approximate AUD price, and previous RRP
- 3–5 retailers stocking them (names only — no external URLs)
- 1–2 seasonal sale facts
- Any new model launches pushing older stock to clearance

---

### STEP 4 — Build affiliate links from database results

For every offer from Step 2 that is relevant to the page, build the affiliate click URL in this exact format:

```
https://aussiedealz.com/api/click?offer_id=[offer_id]&sub_id=store_[store_slug]_deal_[offer_id]
```

**Examples:**
```
https://aussiedealz.com/api/click?offer_id=9436&sub_id=store_amber-sceats_deal_9436
https://aussiedealz.com/api/click?offer_id=1120&sub_id=store_the-iconic_deal_1120
```

Rules:
- Every outbound link on the page **must** use this format — no direct external URLs.
- If the page has a "Shop Now" or "Get Deal" button, it links to this affiliate URL.
- Use the `offer_id` from the database query result (Step 2).
- Never link directly to a retailer's website (e.g., `theiconic.com.au`) — always route through `aussiedealz.com/api/click`.

---

### STEP 5 — Build the page

Follow `skill.md` for the full page structure and quality checklist. Apply these additional rules:

#### LINKS — strict rules

| Link type | Format | Example |
|-----------|--------|---------|
| Deal / Shop button | `https://aussiedealz.com/api/click?offer_id=[id]&sub_id=store_[slug]_deal_[id]` | See Step 4 |
| Store internal link | `https://aussiedealz.com/stores/[store_slug]` | `/stores/the-iconic` |
| Stores directory link | `https://aussiedealz.com/stores` | Browse all stores |
| Any other page | `https://aussiedealz.com/[path]` | Internal only |

**NEVER add any URL outside `https://aussiedealz.com/`.**
This includes: retailer domains, brand websites, Wikipedia, review sites, or any third-party URL.

#### DEAL CARDS (5 cards required)

For each card, use a matched offer from the database if available. If fewer than 5 database matches exist, use web research data for the remainder but still link all buttons through the affiliate URL of the closest matching offer.

Each card must include:
- Product name, badge (e.g., "Best Value", "Top Pick"), short description
- Price chips: Current AUD price, Previous RRP, Saving %
- 3 buttons — all linking to `https://aussiedealz.com/api/click?offer_id=...`
  - Primary `btn-fill`: "Get Deal →"
  - Secondary `btn-outline`: "Compare Price" (same or different offer_id if multiple offers exist for the store)
  - Secondary `btn-outline`: "Shop [Store Name]" → `https://aussiedealz.com/stores/[store_slug]`

#### STORES SECTION (required — after deal cards)

Add a "Top Stores for [Category] in Australia" section listing stores from the database query (Step 2).

Format each store as an internal link:
```html
<a href="https://aussiedealz.com/stores/[store_slug]">[Store Name]</a>
```

End the section with:
```html
<a href="https://aussiedealz.com/stores">Browse all Australian stores →</a>
```

#### RETAILER TABLE

List retailers discovered in web research. Each row:
- "Shop →" button links to the **affiliate click URL** of that store's best matching offer
- If no database offer exists for that retailer, omit the row or show it without a link

#### CTA STRIPS (2 required)

- Strip 1: After deal cards section
- Strip 2: After "What's New" section
- Each strip has 3 buttons — all linking to affiliate click URLs from the database

#### NO EXTERNAL LINKS ANYWHERE

Scan the entire output before returning. Search for any URL not starting with `https://aussiedealz.com/`. Remove or replace every one found.

---

### STEP 6 — Output

Output the complete page as a single HTML code block.

**Filename:** `best-deals-[category-slug]-australia.html`

After the code block, print this summary:

```
KEYWORD:     Best deals on [Category] Australia
SLUG:        best-deals-[category]-australia
DEALS:       [5 product names]
DB OFFERS:   [offer IDs used]
STORES USED: [store slugs linked]
SCHEMA:      Article + ItemList + FAQPage
UPDATED:     [Month Year]
EXTERNAL LINKS CHECK: PASS (all links are aussiedealz.com only)
```

---

## QUALITY CHECKLIST

Before outputting, verify every item:

- [ ] H1 contains exact keyword
- [ ] Quick Answer box is 3–4 sentences with real data
- [ ] All 5 deal cards have: name, badge, description, 3 price chips, 3 buttons
- [ ] Every "Get Deal" button uses `https://aussiedealz.com/api/click?offer_id=...`
- [ ] No button or link points to an external domain
- [ ] Stores section present with internal links to `/stores/[slug]`
- [ ] "Browse all stores" link points to `https://aussiedealz.com/stores`
- [ ] Retailer table rows only include stores that have a matching database offer
- [ ] 2 CTA strips present with affiliate links
- [ ] FAQ has 5–6 questions, answers are direct and self-contained
- [ ] JSON-LD: Article + ItemList (5 items) + FAQPage — all real data
- [ ] Affiliate disclosure block present
- [ ] Zero placeholders — search for `[insert`, `TODO`, `$XXX` before outputting
- [ ] All prices are real AUD figures from web research
- [ ] Tone: simple English, short sentences, numbers first, no fluff
