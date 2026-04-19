const mysql = require('mysql2/promise');

function toNull(val) {
  return val === undefined ? null : val;
}

function slugify(text) {
  if (!text) return '';
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const CF_API_KEY = process.env.CF_API_KEY;
const CF_BASE_URL = (process.env.CF_BASE_URL || 'https://api.commissionfactory.com').replace(/\/$/, '');
const BASE_URL = `${CF_BASE_URL}/V1/Affiliate`;

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || 'commnision',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 5,
});

async function fetchWithAuth(endpoint) {
  if (!CF_API_KEY) {
    throw new Error('CF_API_KEY is missing');
  }
  const url = `${BASE_URL}/${endpoint}&apiKey=${CF_API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  return response.json();
}

async function syncMerchants() {
  console.log('Syncing merchants...');
  try {
    const data = await fetchWithAuth('Merchants?');
    const merchants = Array.isArray(data) ? data : data.Merchants || [];
    console.log(`Found ${merchants.length} merchants`);
    
    let imported = 0;
    for (const m of merchants) {
      if (!m.Name) continue;
      const slug = slugify(m.Name);
      // Set all to active for display purposes - real status will be determined by CF
      const status = 'active';
      
      await pool.execute(
        `INSERT INTO advertisers (external_id, name, slug, logo_url, commission_rate, conversion_rate, epc, status, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE 
           name=VALUES(name), slug=VALUES(slug), logo_url=VALUES(logo_url), 
           commission_rate=VALUES(commission_rate), conversion_rate=VALUES(conversion_rate), 
           epc=VALUES(epc), status=VALUES(status), updated_at=NOW()`,
        [String(m.Id), m.Name, slug, m.AvatarUrl || null, m.CommissionRate || null, 0, 0, status]
      );
      imported++;
    }
    console.log(`Synced ${imported} merchants`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function syncCoupons() {
  console.log('Syncing coupons...');
  try {
    const data = await fetchWithAuth('Coupons?');
    const coupons = Array.isArray(data) ? data : data.Coupons || [];
    console.log(`Found ${coupons.length} coupons`);
    
    let imported = 0;
for (const c of coupons) {
      if (!c.MerchantId) continue;
      if (imported > 500) break;
      const title = c.Description || c.Code || 'Coupon';
      const [rows] = await pool.execute('SELECT id FROM advertisers WHERE external_id = ?', [String(c.MerchantId)]);
      if (rows.length === 0) continue;
      
      const advertiserId = rows[0].id;
      const endDate = c.EndDate ? new Date(c.EndDate) : null;
      const isExpired = endDate ? endDate < new Date() : false;
      
await pool.query(
        `INSERT INTO offers SET ? ON DUPLICATE KEY UPDATE 
          title=VALUES(title), description=VALUES(description), coupon_code=VALUES(coupon_code), 
          destination_url=VALUES(destination_url), tracking_url=VALUES(tracking_url), 
          start_date=VALUES(start_date), end_date=VALUES(end_date), is_expired=VALUES(is_expired), 
          category=VALUES(category)`,
        {
          external_id: String(c.Id),
          advertiser_id: advertiserId,
          title: title,
          description: toNull(c.Description),
          coupon_code: toNull(c.Code),
          destination_url: c.TargetUrl,
          tracking_url: c.TrackingUrl,
          start_date: toNull(c.StartDate),
          end_date: endDate,
          is_verified: 1,
          is_expired: isExpired ? 1 : 0,
          category: toNull(c.Category)
        }
      );
      imported++;
    }
    console.log(`Synced ${imported} coupons`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function syncBanners() {
  console.log('Syncing banners...');
  try {
    const data = await fetchWithAuth('Banners?');
    const banners = Array.isArray(data) ? data : data.Banners || [];
    console.log(`Found ${banners.length} banners`);
    
    let imported = 0;
    for (const b of banners) {
      if (!b.MerchantId) continue;
      const [rows] = await pool.execute('SELECT id FROM advertisers WHERE external_id = ?', [String(b.MerchantId)]);
      if (rows.length === 0) continue;
      
      const advertiserId = rows[0].id;
      await pool.execute(
        `INSERT INTO creatives (external_id, advertiser_id, type, image_url, width, height, tracking_url, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE 
           type=VALUES(type), image_url=VALUES(image_url), width=VALUES(width), 
           height=VALUES(height), tracking_url=VALUES(tracking_url), updated_at=NOW()`,
        [String(b.Id), advertiserId, b.Size||'banner', b.ImageUrl||null, b.Width||null, b.Height||null, b.TrackingUrl]
      );
      imported++;
    }
    console.log(`Synced ${imported} banners`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function syncPromotions() {
  console.log('Syncing promotions...');
  try {
    const data = await fetchWithAuth('Promotions?');
    const promotions = Array.isArray(data) ? data : data.Promotions || [];
    console.log(`Found ${promotions.length} promotions`);
    
    let imported = 0;
    let pi = 0;
  for (const p of promotions) {
      pi++;
      if (!p.MerchantId || !p.Description || pi > 500) continue;
      const title = p.Description || 'Promotion';
      const [rows] = await pool.execute('SELECT id FROM advertisers WHERE external_id = ?', [String(p.MerchantId)]);
      if (rows.length === 0) continue;
      
      const advertiserId = rows[0].id;
      const endDate = p.EndDate ? new Date(p.EndDate) : null;
      const isExpired = endDate ? endDate < new Date() : false;
      
await pool.query(
        `INSERT INTO offers SET ? ON DUPLICATE KEY UPDATE 
          title=VALUES(title), description=VALUES(description), 
          destination_url=VALUES(destination_url), tracking_url=VALUES(tracking_url), 
          start_date=VALUES(start_date), end_date=VALUES(end_date), is_expired=VALUES(is_expired), 
          category=VALUES(category)`,
        {
          external_id: String(p.Id),
          advertiser_id: advertiserId,
          title: title,
          description: toNull(p.Description),
          destination_url: p.TargetUrl,
          tracking_url: p.TrackingUrl,
          start_date: toNull(p.StartDate),
          end_date: endDate,
          is_verified: 1,
          is_expired: isExpired ? 1 : 0,
          category: toNull(p.Category)
        }
      );
      imported++;
    }
    console.log(`Synced ${imported} promotions`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function fullSync() {
  console.log('=== Starting full sync ===');
  await syncMerchants();
  await syncCoupons();
  await syncBanners();
  await syncPromotions();
  console.log('=== Sync complete! ===');
  await pool.end();
}

fullSync().catch(console.error);
