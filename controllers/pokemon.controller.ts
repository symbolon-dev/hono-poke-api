import type { Context } from 'hono';
import type { PokemonData } from '../types/pokemon.js';

import { queryPokemon } from '../services/filters.js';

export const getPokemon = (c: Context) => {
    const pokemonCache: PokemonData[] = c.get('pokemonCache') || []

    const result = queryPokemon(c.req.query())(pokemonCache)

    return c.json({ count: result.length, pokemon: result }, 200)
}

export const getPokemonById = (c: Context) => {
    const pokemonCache: PokemonData[] = c.get('pokemonCache') || []

    const id = Number(c.req.param('id'))
    const result = pokemonCache.find((pokemon: PokemonData) => pokemon.id === id)

    if (!result) {
        return c.json({ message: 'Pokémon not found' }, 404)
    }

    return c.json(result, 200)
}
