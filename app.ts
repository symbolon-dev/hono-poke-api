import type { PokemonData } from './types/pokemon.js';

import { Hono } from 'hono';

type AppVariables = {
    Variables: {
        pokemonCache: PokemonData[],
    }
}

const app = new Hono<AppVariables>()
export default app;
