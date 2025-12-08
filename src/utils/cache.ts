const store = new Map<string, unknown>();

export const cacheGet = <T>(key: string): T | undefined => {
    return store.get(key) as T | undefined;
};

export const cacheSet = <T>(key: string, data: T): void => {
    store.set(key, data);
};
