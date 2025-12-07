import type { Context } from 'hono';

import type { PokemonData, QueryParams } from '@/types/pokemon';
import { fetchTypeDetails } from '@/utils/fetchers';
import { queryPokemon } from '@/utils/filters';

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;

export const getPokemon = (c: Context) => {
    const pokemonCache: PokemonData[] = c.get('pokemonCache')

    if (!pokemonCache || pokemonCache.length === 0) {
        c.get('logger').error('Pokemon cache is not initialized!');
        return c.json({ error: 'Service unavailable', status: 503 }, 503)
    }

    const params: QueryParams = {
        search: c.req.query('name') || c.req.query('id'),
        types: c.req.queries('types'),
        generation: Number(c.req.query('generation')),
        sort: c.req.query('sort') as "id" | "name" | undefined,
        order: c.req.query('order') as "asc" | "desc" | undefined
    }

    const filtered = queryPokemon(params)(pokemonCache)

    const page = Math.max(1, Number(c.req.query('page')) || 1)
    const requestedLimit = Math.max(1, Number(c.req.query('limit')) || DEFAULT_LIMIT)
    const limit = Math.min(requestedLimit, MAX_LIMIT)
    const offset = (page - 1) * limit
    const paginated = filtered.slice(offset, offset + limit)

    return c.json({
        count: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
        pokemon: paginated
    }, 200)
}

export const getPokemonById = (c: Context) => {
    const pokemonCache: PokemonData[] = c.get('pokemonCache')

    if (!pokemonCache || pokemonCache.length === 0) {
        c.get('logger').error('Pokemon cache is not initialized!');
        return c.json({ error: 'Service unavailable', status: 503 }, 503)
    }

    const id = Number(c.req.param('id'))
    const result = pokemonCache.find((pokemon: PokemonData) => pokemon.id === id)

    if (!result) {
        return c.json({ error: 'Pokémon not found', status: 404 }, 404)
    }

    return c.json(result, 200)
}

export const getTypes = (c: Context) => {
    const pokemonCache: PokemonData[] = c.get('pokemonCache');

    if (!pokemonCache || pokemonCache.length === 0) {
        c.get('logger').error('Pokemon cache is not initialized!');
        return c.json({ error: 'Service unavailable', status: 503 }, 503);
    }

    const types = [...new Set(
        pokemonCache.flatMap(p => p.types)
    )].sort();

    return c.json({ types }, 200);
};

export const getTypeByName = async (c: Context) => {
    const typeName = c.req.param('type').toLowerCase();

    const typeDetails = await fetchTypeDetails(typeName);

    if (!typeDetails) {
        return c.json({ error: 'Type not found', status: 404 }, 404);
    }

    c.header('Cache-Control', 'public, max-age=604800'); // 1 week
    return c.json(typeDetails, 200);
};

export const getGenerations = (c: Context) => {
    const pokemonCache: PokemonData[] = c.get('pokemonCache');

    if (!pokemonCache || pokemonCache.length === 0) {
        c.get('logger').error('Pokemon cache is not initialized!');
        return c.json({ error: 'Service unavailable', status: 503 }, 503);
    }

    const generations = [...new Set(
        pokemonCache.map(p => p.generation)
    )].sort((a, b) => a - b);

    return c.json({ generations }, 200);
};
