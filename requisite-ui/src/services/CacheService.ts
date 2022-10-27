// This implementation caches promises instead of the returned values in order
// to avoid race conditions as recommended in this article:
// https://www.jonmellman.com/posts/promise-memoization

// TODO Look at using memoizee instead of manual caching

const cache = new Map<string, Promise<unknown>>();

export function cached<T>(key: string, afn: () => Promise<T>): Promise<T> {
    if (!cache.has(key)) {
        const promise = afn();
        cache.set(key, promise);
        // if a promise fails, remove it from the cache
        promise.catch(() => {
            cache.delete(key);
        });
    }
    return cache.get(key) as Promise<T>;
}

export function uncached(key: string): void {
    cache.delete(key);
}
