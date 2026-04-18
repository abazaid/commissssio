import Redis from 'ioredis';

const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL)
  : null;

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}

export async function cacheSet(key: string, value: unknown, ttl = 3600): Promise<void> {
  if (!redis) return;
  await redis.setex(key, ttl, JSON.stringify(value));
}

export async function cacheDelete(key: string): Promise<void> {
  if (!redis) return;
  await redis.del(key);
}

export default redis;