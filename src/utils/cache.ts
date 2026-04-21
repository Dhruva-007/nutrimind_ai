const cache = new Map<string, { value: any; expiry: number }>();

export const cacheSet = (key: string, value: any, ttlMs: number) => {
  cache.set(key, { value, expiry: Date.now() + ttlMs });
};

export const cacheGet = <T>(key: string): T | null => {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }
  return item.value as T;
};

export const cacheHas = (key: string): boolean => {
  return cacheGet(key) !== null;
};

export const cacheInvalidate = (key: string) => {
  cache.delete(key);
};
