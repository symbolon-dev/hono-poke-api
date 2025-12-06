import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { getGenerations, getPokemon, getPokemonById, getTypeByName, getTypes } from '@/controllers/pokemon';
import { GenerationsResponseSchema, PokemonDataSchema, PokemonListResponseSchema, TypeDetailsSchema, TypesResponseSchema } from '@/schemas/pokemon';
import { ErrorResponseSchema, PokemonIdParamSchema, PokemonListQuerySchema, TypeParamSchema } from '@/schemas/query';

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
        },
        503: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema
                }
            },
            description: 'Service unavailable - cache not loaded'
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
        },
        503: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema
                }
            },
            description: 'Service unavailable - cache not loaded'
        }
    }
});

const getTypeByNameRoute = createRoute({
    method: 'get',
    path: '/types/{type}',
    request: {
        params: TypeParamSchema
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: TypeDetailsSchema
                }
            },
            description: 'Retrieve detailed information about a specific type including damage relations'
        },
        404: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema
                }
            },
            description: 'Type not found'
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
        },
        503: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema
                }
            },
            description: 'Service unavailable - cache not loaded'
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
        },
        503: {
            content: {
                'application/json': {
                    schema: ErrorResponseSchema
                }
            },
            description: 'Service unavailable - cache not loaded'
        }
    }
});

pokemonRoutes.openapi(getPokemonRoute, getPokemon);
pokemonRoutes.openapi(getTypesRoute, getTypes);
pokemonRoutes.openapi(getTypeByNameRoute, getTypeByName);
pokemonRoutes.openapi(getGenerationsRoute, getGenerations);
pokemonRoutes.openapi(getPokemonByIdRoute, getPokemonById);
