import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { getPokemon, getPokemonById, getTypes, getGenerations } from '../controllers/pokemon.controller.js';
import { PokemonDataSchema } from '../schemas/pokemon.schema.js';

export const pokemonRoutes = new OpenAPIHono();

const getPokemonRoute = createRoute({
    method: 'get',
    path: '/',
    request: {
        query: z.object({
            page: z.string().optional().openapi({ example: '1', description: 'Page number' }),
            limit: z.string().optional().openapi({ example: '20', description: 'Items per page' }),
            name: z.string().optional().openapi({ example: 'Pikachu', description: 'Filter by partial or full name.' }),
            id: z.string().optional().openapi({ example: '25', description: 'Filter by exact Pokemon ID.' }),
            types: z.string().optional().openapi({ 
                example: 'electric', 
                description: 'Filter by one or more types (repeated parameter is allowed).' 
            }),
            generation: z.string().optional().openapi({ example: '1', description: 'Filter by Generation number.' }),
            sort: z.enum(['id', 'name']).optional().openapi({ example: 'id', description: 'Field to sort by (id or name).' }),
            order: z.enum(['asc', 'desc']).optional().openapi({ example: 'asc', description: 'Sort direction (asc or desc).' }),

        }).partial()
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        count: z.number(),
                        page: z.number(),
                        limit: z.number(),
                        totalPages: z.number(),
                        pokemon: z.array(PokemonDataSchema)
                    })
                }
            },
            description: 'Retrieve paginated and filtered list of Pokemon'
        }
    }
});

const getTypesRoute = createRoute({
    method: 'get',
    path: '/types',
    responses: {
        200: {
        content: {
            'application/json': {
                schema: z.object({
                    types: z.array(z.string())
                })
            }
        },
        description: 'Retrieve all available Pokemon types'
        }
    }
});

const getGenerationsRoute = createRoute({
    method: 'get',
    path: '/generations',
    responses: {
        200: {
        content: {
            'application/json': {
                schema: z.object({
                    generations: z.array(z.number())
                })
            }
        },
        description: 'Retrieve all available Pokemon generations'
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
pokemonRoutes.openapi(getTypesRoute, (c) => getTypes(c));
pokemonRoutes.openapi(getGenerationsRoute, (c) => getGenerations(c));
pokemonRoutes.openapi(getPokemonByIdRoute, (c) => getPokemonById(c));
