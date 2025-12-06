import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { getGenerations, getPokemon, getPokemonById, getTypes } from '@/controllers/pokemon';
import { GenerationsResponseSchema, PokemonDataSchema, PokemonListResponseSchema, TypesResponseSchema } from '@/schemas/pokemon';
import { ErrorResponseSchema, PokemonIdParamSchema, PokemonListQuerySchema } from '@/schemas/query';

export const pokemonRoutes: OpenAPIHono = new OpenAPIHono();

const getPokemonRoute = createRoute({
    method: 'get',
    path: '/',
    request: {
        query: PokemonListQuerySchema
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: PokemonListResponseSchema
                }
            },
            description: 'Retrieve paginated and filtered list of Pokemon'
        },
        400: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema
                }
            },
            description: 'Invalid query parameters'
        },
        500: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema
                }
            },
            description: 'Internal server error'
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
                    schema: TypesResponseSchema
                }
            },
            description: 'Retrieve all available Pokemon types'
        },
        500: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema
                }
            },
            description: 'Internal server error'
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
                    schema: GenerationsResponseSchema
                }
            },
            description: 'Retrieve all available Pokemon generations'
        },
        500: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema
                }
            },
            description: 'Internal server error'
        }
    }
});


const getPokemonByIdRoute = createRoute({
    method: 'get',
    path: '/{id}',
    request: {
        params: PokemonIdParamSchema
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
        400: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema
                }
            },
            description: 'Invalid Pokemon ID'
        },
        404: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema
                }
            },
            description: 'Pokemon not found'
        },
        500: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema
                }
            },
            description: 'Internal server error'
        }
    }
});

pokemonRoutes.openapi(getPokemonRoute, (c) => getPokemon(c));
pokemonRoutes.openapi(getTypesRoute, (c) => getTypes(c));
pokemonRoutes.openapi(getGenerationsRoute, (c) => getGenerations(c));
pokemonRoutes.openapi(getPokemonByIdRoute, (c) => getPokemonById(c));
