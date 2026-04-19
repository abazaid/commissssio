export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  readTime: string;
  content: string[];
};

export const BLOG_AUTHOR = {
  name: 'Sarah Mitchell',
  role: 'Deals Editor',
  slug: 'sarah-mitchell',
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'best-deals-this-week',
    title: 'Best Deals This Week in Australia',
    description:
      'A weekly editorial roundup of current high-value coupon and deal opportunities for Australian shoppers.',
    publishedAt: '2026-04-19',
    updatedAt: '2026-04-19',
    category: 'Weekly Roundup',
    readTime: '6 min read',
    content: [
      'This weekly roundup highlights active offers that are currently showing the strongest value signal across major Australian retailers. We prioritise deals with clear terms, visible expiry windows, and stable redemption behavior.',
      'For this cycle, apparel and beauty continue to produce the most frequent promo-code opportunities, while electronics merchants are leaning more on direct markdowns than checkout code mechanics. If your goal is maximum savings, compare both deal types before purchasing.',
      'Our editorial workflow combines feed-based discovery with manual quality checks. We remove stale listings, check destination relevance, and flag offers that are likely to expire soon. This process helps reduce false positives and improves checkout confidence.',
      'When evaluating weekly offers, start with essentials and repeat-purchase categories before discretionary buying. Grocery and household campaigns can outperform headline seasonal promotions because they apply to baskets you already planned to purchase.',
      'If you find a code mismatch, send feedback through our contact page. We use that signal to re-test, re-rank, or remove listings quickly.',
    ],
  },
  {
    slug: 'how-to-check-if-a-coupon-is-real',
    title: 'How to Check if a Coupon Code Is Legit',
    description:
      'A practical validation checklist to avoid expired or misleading promo codes before checkout.',
    publishedAt: '2026-04-18',
    updatedAt: '2026-04-19',
    category: 'How-To',
    readTime: '5 min read',
    content: [
      'Not all coupon codes are equal. The fastest way to avoid failed checkout attempts is to validate campaign scope before copying any code. Start by checking expiry date, eligible product categories, and minimum spend requirements.',
      'Next, confirm that the destination page matches the retailer and campaign context. If a code claims broad discounts but links to a narrow collection page, treat that as a warning sign and compare alternatives.',
      'Look for conflict conditions: some codes cannot be combined with sale items, loyalty discounts, or free shipping promotions. These constraints are common and often buried in terms text.',
      'Use trusted deal sources that publish update frequency and remove stale listings. At Aussie Dealz, we update feeds on schedule and review user signals to remove broken codes faster.',
      'Final check: if a code fails at checkout, try one alternate from the same store page, then stop. Repeated random attempts can trigger merchant anti-abuse controls.',
    ],
  },
  {
    slug: 'australian-retail-sale-calendar',
    title: 'Australian Retail Sale Calendar (2026 Edition)',
    description:
      'Major Australian sale windows and campaign periods to plan discount-led purchasing across the year.',
    publishedAt: '2026-04-17',
    updatedAt: '2026-04-19',
    category: 'Reference',
    readTime: '8 min read',
    content: [
      'Planning purchases around predictable sale windows is one of the most reliable savings strategies in Australia. The strongest discount periods typically cluster around Click Frenzy events, EOFY, Afterpay Day, Black Friday, and Boxing Day.',
      'EOFY is usually strongest for appliances, furniture, and tech accessories due to inventory and financial-year turnover. Black Friday and Cyber Monday tend to produce the broadest cross-category markdown depth, especially in fashion and beauty.',
      'Afterpay Day often drives short campaign bursts with coupon overlays, while Click Frenzy promotions vary by merchant depth and stock profile. We recommend tracking category pages in the week before each event to identify repeating retailer patterns.',
      'For high-ticket buys, build a watchlist 2-4 weeks before major events and compare base price drift versus campaign discount claims. This prevents overestimating savings from inflated reference pricing.',
      'Use this calendar as a planning guide, not a guarantee. Campaign exact dates can shift by retailer and partner network update schedules.',
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
