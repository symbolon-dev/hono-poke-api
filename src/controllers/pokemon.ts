import type { Context } from 'hono';
import type { PokemonData, QueryParams } from '@/types/pokemon.js';

import { queryPokemon } from '@/utils/filters.js';

export const getPokemon = (c: Context) => {
    const pokemonCache: PokemonData[] = c.get('pokemonCache')

    if (!pokemonCache || pokemonCache.length === 0) {
        console.error('Pokemon cache ist nicht initializiert!')
    }

    const params: QueryParams = {
        search: c.req.query('name') || c.req.query('id'), 
        types: c.req.queries('types'), 
        generation: Number(c.req.query('generation')),
        sort: c.req.query('sort') as "id" | "name" | undefined,
        order: c.req.query('order') as "asc" | "desc" | undefined
    }

    const filtered = queryPokemon(params)(pokemonCache)

    const page = Number(c.req.query('page')) || 1
    const limit = Number(c.req.query('limit')) || 20
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
        console.error('Pokemon cache ist nicht initializiert!')
    }

    const id = Number(c.req.param('id'))
    const result = pokemonCache.find((pokemon: PokemonData) => pokemon.id === id)

    if (!result) {
        return c.json({ message: 'Pokémon not found' }, 404)
    }

    return c.json(result, 200)
}

export const getTypes = (c: Context) => {
    const pokemonCache: PokemonData[] = c.get('pokemonCache');
    
    if (!pokemonCache || pokemonCache.length === 0) {
        console.error('Pokemon cache ist nicht initialisiert!');
        return c.json({ types: [] }, 200);
    }

    const typesSet = new Set<string>();
    
    pokemonCache.map((pokemon: PokemonData) => {
        pokemon.types.forEach((type: string) => {
            typesSet.add(type);
        });
    });

    const types = Array.from(typesSet).sort();

    return c.json({ types }, 200);
};

export const getGenerations = (c: Context) => {
    const pokemonCache: PokemonData[] = c.get('pokemonCache');

    if (!pokemonCache || pokemonCache.length === 0) {
        console.error('Pokemon cache ist nicht initialisiert!');
        return c.json({ generations: [] }, 200);
    }

    const generationsSet = new Set<number>();
    
    pokemonCache.map((pokemon: PokemonData) => {
        generationsSet.add(pokemon.generation);
    });

    const generations = Array.from(generationsSet).sort((a, b) => a - b);

    return c.json({ generations }, 200);
};
