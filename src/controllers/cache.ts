import type { Context } from 'hono';

import { getStats } from '@/utils/cache';

export const getCacheStats = (c: Context) => {
    const stats = getStats();
    return c.json(stats, 200);
};