import { z } from '@hono/zod-openapi';

export const QueryParamsSchema = z.object({
    search: z.string().optional(),
    types: z.union([z.string(), z.array(z.string())]).optional(),
    generation: z.number().optional(),
    sort: z.enum(['id', 'name']).optional(),
    order: z.enum(['asc', 'desc']).optional()
});