import type { Context } from 'hono';
import type { PokemonData } from '../types/pokemon.js';

import { queryPokemon } from '../services/filters.js';

export const getPokemon = (c: Context) => {
    const pokemonCache: PokemonData[] = c.get('pokemonCache')

    if (!pokemonCache || pokemonCache.length === 0) {
        console.error('Pokemon cache ist nicht initializiert!')
    }

    const page = Number(c.req.query('page')) || 1
    const limit = Number(c.req.query('limit')) || 20
    const offset = (page - 1) * limit

    const filtered = queryPokemon(c.req.query())(pokemonCache)
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
