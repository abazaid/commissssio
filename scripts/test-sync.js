const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  database: 'commnision',
  user: 'root',
  password: '',
});

const CF_API_KEY = '8f77864791aa44fb9668529b2b1ff4c5';
const BASE_URL = 'https://api.commissionfactory.com/V1/Affiliate';

async function testSyncCoupons() {
  const url = `${BASE_URL}/Coupons?apiKey=${CF_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  const coupons = data.slice(0, 3);
  
  for (const c of coupons) {
    console.log('Coupon:', c.Id, c.Name, 'MerchantId:', c.MerchantId);
    const [rows] = await pool.execute('SELECT id, external_id, name FROM advertisers WHERE external_id = ?', [String(c.MerchantId)]);
    console.log('  Found:', rows);
  }
  
  await pool.end();
}

testSyncCoupons().catch(console.error);