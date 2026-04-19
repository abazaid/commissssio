const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://aussiedealz.com').replace(/\/$/, '');
}

export async function submitIndexNow(paths: string[]) {
  const key = process.env.INDEXNOW_KEY;
  if (!key || paths.length === 0) return;

  const siteUrl = getSiteUrl();
  const host = siteUrl.replace(/^https?:\/\//, '');
  const uniquePaths = Array.from(new Set(paths)).filter(Boolean);
  const urlList = uniquePaths.map((path) => `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`);

  const payload = {
    host,
    key,
    keyLocation: `${siteUrl}/.well-known/indexnow-key.txt`,
    urlList,
  };

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`IndexNow error: ${response.status} ${response.statusText} - ${body}`);
    } else {
      console.log(`IndexNow submitted for ${urlList.length} URLs`);
    }
  } catch (error) {
    console.error('IndexNow submission failed:', error);
  }
}

