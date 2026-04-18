You are a senior full-stack engineer and system architect.

Your task is to build a production-ready affiliate coupon and deals website targeting the Australian market, integrated with Commission Factory API.

The system must be scalable, SEO-optimized, automated, and designed for high conversion.

---

# 🎯 PROJECT OVERVIEW

Build a "Coupons + Deals + Banners" website for Australia using Commission Factory API as the primary data source.

The platform must:

* Automatically fetch advertisers, offers, and creatives
* Store data locally
* Rank offers intelligently
* Generate SEO-friendly pages
* Track clicks and performance

---

# 🧱 TECH STACK (MANDATORY)

Frontend:

* Next.js (App Router)
* Server-side rendering (SSR) + Static Generation (ISR)

Backend:

* Node.js (Next.js API routes OR Express)

Database:

* PostgreSQL

Caching:

* Redis (or in-memory fallback if not available)

Scheduling:

* Cron jobs (or queue workers)

Deployment-ready structure required.

---

# 🔐 ENVIRONMENT VARIABLES

Use environment variables:

CF_API_KEY=your_api_key_here
CF_BASE_URL=https://api.commissionfactory.com

Never expose API key to frontend.

---

# 📦 CORE FEATURES

## 1. DATA SYNC SYSTEM (CRITICAL)

Create background jobs to fetch data from Commission Factory API.

Endpoints to integrate:

* Advertisers
* Offers / Promotions
* Creatives (banners, links)

Create a sync script:

* Runs every 6 hours
* Fetches fresh data
* Updates database (UPSERT logic)
* Removes or flags expired offers

---

## 2. DATABASE SCHEMA

Create these tables:

### advertisers

* id (PK)
* name
* slug (unique)
* logo_url
* commission_rate
* avg_order_value
* conversion_rate
* epc
* status
* created_at
* updated_at

---

### offers

* id (PK)
* advertiser_id (FK)
* title
* description
* coupon_code (nullable)
* destination_url
* tracking_url
* start_date
* end_date
* is_verified (boolean)
* is_expired (boolean)
* created_at
* updated_at

---

### creatives

* id (PK)
* advertiser_id (FK)
* type (banner, text, etc)
* image_url
* width
* height
* tracking_url

---

### clicks

* id (PK)
* offer_id
* sub_id
* ip_address
* user_agent
* created_at

---

## 3. SMART RANKING SYSTEM

Implement ranking formula:

Score = (EPC * 0.4) + (Conversion Rate * 0.3) + (Commission * 0.2) + (Freshness * 0.1)

Use this to:

* Sort offers
* Highlight top deals
* Show best coupons first

---

## 4. AUTO EXPIRY SYSTEM

* Mark offers as expired if end_date < current date
* Do NOT delete expired offers
* Replace expired offers with active alternatives

---

## 5. TRACKING SYSTEM (IMPORTANT)

Every outbound link must include sub_id tracking.

Generate sub_id dynamically:

* homepage_banner_1
* store_theiconic_topbutton
* category_fashion_card_3

Store click data in "clicks" table.

---

## 6. API LAYER (INTERNAL)

Create internal API routes:

GET /api/stores
GET /api/stores/[slug]
GET /api/offers
GET /api/offers?category=fashion
GET /api/top-deals

These APIs must read from database only (NOT Commission Factory directly).

---

# 🖥️ FRONTEND PAGES (SEO STRUCTURE)

## Homepage

* Trending deals
* Top stores
* Best coupons today

---

## Store Page

Route: /store/[slug]

Show:

* Store info
* All offers
* Best working coupon
* Banners

---

## Category Pages

* /fashion-coupons
* /beauty-coupons
* /electronics-deals

---

## Aggregation Pages

* /today-deals
* /best-working-coupons
* /top-discounts-australia

---

# ⚡ PERFORMANCE REQUIREMENTS

* Use ISR (Incremental Static Regeneration)
* Cache database queries
* Lazy load images
* Optimize for Core Web Vitals

---

# 🔍 SEO REQUIREMENTS

Each page must include:

* Dynamic title
* Meta description
* Open Graph tags

Example:
"Up to 50% Off Nike Australia – Verified Coupons April 2026"

---

# 🤖 OPTIONAL (BONUS)

* AI-generated descriptions for offers
* Automatic title generation
* Tagging system

---

# 🧪 TESTING

* Validate API responses
* Handle rate limits
* Handle empty data
* Fallback UI if no offers exist

---

# 🚀 FINAL DELIVERABLE

You must deliver:

* Full project structure
* Backend + frontend
* Database schema
* API integration
* Cron job scripts
* Example pages

Code must be clean, modular, and production-ready.

---

# ❗ IMPORTANT RULES

* NEVER call Commission Factory API from frontend
* ALWAYS cache data
* DO NOT hardcode any data
* Ensure scalability

---

Build this like a real startup product, not a demo.

Focus on performance, automation, and SEO dominance.

---

END OF SPECIFICATION
