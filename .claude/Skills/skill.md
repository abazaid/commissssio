---
name: best-deal-australia
description: >
  Generates a complete, publish-ready programmatic SEO page for the keyword pattern
  "Best deals on [Product Category] Australia". Use this skill whenever the user says
  things like "build a page for [product]", "generate the deals page for [category]",
  "write the SEO page for [product] Australia", or provides a product category and asks
  for a Best Deal Australia page. The skill runs web search to pull fresh data, writes
  real content (no placeholders), outputs full HTML ready to publish, and naturally
  weaves in affiliate conversion elements. Always use this skill — do not attempt to
  write the page from scratch without it.
---

# Best Deal Australia — Programmatic SEO Page Generator

## What This Skill Does

Takes a **product category** as input and produces a **complete, publish-ready HTML page**
targeting the keyword: `Best deals on [Product Category] Australia`

The page:
- Targets Google rankings AND AI citation (ChatGPT, Perplexity, Gemini)
- Contains zero placeholders — every section is written with real content
- Uses fresh web-searched data for prices, retailers, and product specifics
- Naturally converts via affiliate links woven into the content
- Follows a consistent tone: simple English, short sentences, numbers first, no fluff

---

## Step-by-Step Execution

### STEP 1 — Confirm Input

The user provides a product category. Examples:
- "running shoes" → keyword: `Best deals on running shoes Australia`
- "air fryers" → keyword: `Best deals on air fryers Australia`
- "robot vacuum cleaners" → keyword: `Best deals on robot vacuum cleaners Australia`

If the input is ambiguous, ask: *"Which product category should I build the page for?"*

---

### STEP 2 — Web Research (Required)

Before writing a single word of content, run **at least 4 web searches**. Do not skip this step.
Pages built without fresh data look generic and will not rank.

Run these searches (replace `[CATEGORY]` with the product):

```
Search 1: best deals [CATEGORY] Australia [current year]
Search 2: cheapest [CATEGORY] Australia retailer comparison
Search 3: [CATEGORY] sale Australia Rebel Sport / THE ICONIC / Amazon AU
Search 4: [CATEGORY] price Australia [top brand 1] vs [top brand 2]
```

From the search results, extract and note:
- **5 specific products** (with brand, model, approximate AUD price)
- **Previous RRP** for each (to show savings)
- **3–5 retailers** stocking them (with approximate prices)
- **1–2 seasonal sale facts** relevant to this category
- **Any new model launches** that are pushing older stock to clearance

Read the references directory for retailer data before writing:
→ `references/retailers.md` — standard retailer profiles, return policies, URLs

---

### STEP 3 — Build the Page

Follow the **Page Template** in `references/template.md` exactly.

Key rules while writing:

**TONE — apply to every sentence:**
- Simple English. No jargon unless unavoidable.
- Short sentences. If a sentence is over 25 words, split it.
- Numbers first. Lead with price, savings %, or stat wherever possible.
- No fluff. Every sentence earns its place or gets cut.
- Urgent but honest. "Stock is limited" only if true. Never fake scarcity.
- Helpful friend, not salesperson. Recommend the right thing, not the most expensive.

**CONTENT — fill every section with real data:**
- Deal cards: use the 5 products found in Step 2. Real prices, real savings, real retailers.
- Retailer table: pull from `references/retailers.md`, adjust for category relevance.
- Tips: keep the 4 strategy framework but tailor examples to the category.
- What's New: write about actual 2025/2026 model launches found in search.
- Buyer's Guide: write 3–4 sub-sections matching how buyers in this category think.
- FAQ: 5–6 questions. Write answers that directly answer the question in 2–4 sentences.

**CONVERSION — integrated, not bolted on:**
- Every deal card has 3 buttons: 1 primary `btn-fill` + 2 secondary `btn-outline`
- Two CTA strips: one after the deals section, one after the What's New section
- Retailer table has a "Shop →" link on every row
- Never use the word "sponsored" in visible button text

**SEO / AIO:**
- H1 must contain the exact keyword: `Best deals on [Category] Australia`
- Quick Answer box must give a complete standalone answer in 3–4 sentences
- FAQ answers must be self-contained (AI tools extract them verbatim)
- JSON-LD: populate Article, ItemList (5 items), and FAQPage schemas with real data

---

### STEP 4 — Output

Output the complete HTML as a single code block.

**File naming convention:** `best-deals-[category-slug]-australia.html`
Example: `best-deals-running-shoes-australia.html`

After the code block, add a brief **Page Summary** in plain text:
```
KEYWORD:     Best deals on [Category] Australia
SLUG:        best-deals-[category]-australia
DEALS:       [5 product names]
RETAILERS:   [retailer names used]
SCHEMA:      Article + ItemList + FAQPage
UPDATED:     [Month Year]
```

---

## Quality Checklist

Before outputting, verify every item:

- [ ] H1 contains exact keyword
- [ ] Quick Answer is 3–4 sentences, self-contained, has real data
- [ ] All 5 deal cards have: name, badge, description, 3+ price chips, 3 buttons
- [ ] Every price chip has a real approximate AUD price (not $XXX)
- [ ] Retailer table has 7–8 rows, all with Shop → links
- [ ] 4 tips grid is filled with category-specific examples
- [ ] "What's New" section has real 2025/2026 product launches
- [ ] Buyer's Guide has 3–4 sub-sections with real advice
- [ ] FAQ has 5–6 questions, all answers are direct and complete
- [ ] 2 CTA strips present, each with 3 retailer buttons
- [ ] JSON-LD: Article, ItemList (5 items), FAQPage all populated with real data
- [ ] Affiliate disclosure block present at bottom of content
- [ ] Zero placeholders — search "[insert" or "TODO" before outputting
- [ ] Tone check: re-read intro and first deal card. Would a helpful friend say this?

---

## Reference Files

- `references/template.md` — Full HTML template with all CSS and structure
- `references/retailers.md` — Australian retailer profiles, URLs, return policies
- `references/tone-examples.md` — Good vs bad writing examples for the tone guide

Read all three before writing. They contain the complete HTML, CSS variables, and
category-specific guidance you need.