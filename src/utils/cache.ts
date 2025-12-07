type CacheStats = {
    hits: number;
    misses: number;
    size: number;
    hitRate: string;
};

const store = new Map<string, unknown>();
let hits = 0;
let misses = 0;

export const cacheGet = <T>(key: string): T | undefined => {
    const data = store.get(key);

    if (data === undefined) {
        misses++;
        return undefined;
    }

    hits++;
    return data as T;
};

export const cacheSet = <T>(key: string, data: T): void => {
    store.set(key, data);
};

export const getStats = (): CacheStats => {
    const total = hits + misses;
    const hitRate = total > 0
        ? ((hits / total) * 100).toFixed(1) + '%'
        : '0%';

    return {
        hits,
        misses,
        size: store.size,
        hitRate
    };
};

export const clear = (): void => {
    store.clear();
    hits = 0;
    misses = 0;
};
