import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { getPokemon, getPokemonById } from '../controllers/pokemon.controller.js';
import { PokemonDataSchema } from '../schemas/pokemon.schema.js';

export const pokemonRoutes = new OpenAPIHono();

const getPokemonRoute = createRoute({
    method: 'get',
    path: '/',
    request: {
        query: z.object({
            page: z.string().optional().openapi({ example: '1', description: 'Page number' }),
            limit: z.string().optional().openapi({ example: '20', description: 'Items per page' }),
            type: z.string().optional().openapi({ example: 'electric', description: 'Filter by type' }),
            generation: z.string().optional().openapi({ example: 'generation-i', description: 'Filter by generation' })
        })
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        count: z.number().openapi({ example: 151 }),
                        page: z.number().openapi({ example: 1 }),
                        limit: z.number().openapi({ example: 20 }),
                        totalPages: z.number().openapi({ example: 8 }),
                        pokemon: z.array(PokemonDataSchema)
                    })
                }
            },
            description: 'Retrieve paginated and filtered list of Pokemon'
        }
    }
});

const getPokemonByIdRoute = createRoute({
    method: 'get',
    path: '/{id}',
    request: {
        params: z.object({
            id: z.string().openapi({ example: '25', description: 'Pokemon ID' })
        })
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: PokemonDataSchema
                }
            },
            description: 'Retrieve a Pokemon by ID'
        },
        404: {
            content: {
                'application/json': {
                    schema: z.object({
                        message: z.string().openapi({ example: 'Pokémon not found' })
                    })
                }
            },
            description: 'Pokemon not found'
        }
    }
});

pokemonRoutes.openapi(getPokemonRoute, (c) => getPokemon(c));
pokemonRoutes.openapi(getPokemonByIdRoute, (c) => getPokemonById(c));
