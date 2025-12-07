import { z } from '@hono/zod-openapi';

export const QueryParamsSchema = z.object({
    search: z.string().optional(),
    types: z.union([z.string(), z.array(z.string())]).optional(),
    generation: z.number().optional(),
    sort: z.enum(['id', 'name']).optional(),
    order: z.enum(['asc', 'desc']).optional()
});

export const PokemonListQuerySchema = z.object({
    page: z.coerce.number().int().positive().optional().openapi({ example: 1, description: 'Page number' }),
    limit: z.coerce.number().int().positive().optional().openapi({ example: 20, description: 'Items per page' }),
    name: z.string().optional().openapi({ example: 'Pikachu', description: 'Filter by partial or full name.' }),
    id: z.coerce.number().int().positive().optional().openapi({ example: 25, description: 'Filter by exact Pokemon ID.' }),
    types: z.union([z.string(), z.array(z.string())]).optional().openapi({
        example: 'electric',
        description: 'Filter by one or more types. Use repeated parameter (types=fire&types=flying) to filter Pokemon with ALL specified types.'
    }),
    generation: z.coerce.number().int().positive().optional().openapi({ example: 1, description: 'Filter by Generation number.' }),
    sort: z.enum(['id', 'name']).optional().openapi({ example: 'id', description: 'Field to sort by (id or name).' }),
    order: z.enum(['asc', 'desc']).optional().openapi({ example: 'asc', description: 'Sort direction (asc or desc).' })
});

export const PokemonIdParamSchema = z.object({
    id: z.coerce.number().int().positive().openapi({ example: 25, description: 'Pokemon ID' })
});

export const TypeParamSchema = z.object({
    type: z.string().openapi({ example: 'fire', description: 'Type name' })
});

export const ErrorResponseSchema = z.object({
    error: z.string(),
    status: z.number()
});