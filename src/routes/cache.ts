import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { getCacheStats } from '@/controllers/cache';
import { CacheStatsSchema } from '@/schemas/pokemon';

export const cacheRoutes: OpenAPIHono = new OpenAPIHono();

const getCacheStatsRoute = createRoute({
    method: 'get',
    path: '/stats',
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: CacheStatsSchema
                }
            },
            description: 'Retrieve cache statistics including hits, misses, size, and hit rate'
        }
    }
});

cacheRoutes.openapi(getCacheStatsRoute, getCacheStats);