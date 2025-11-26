import type { PokemonData } from './types/pokemon.js';

import { OpenAPIHono } from '@hono/zod-openapi'

type AppVariables = {
    Variables: {
        pokemonCache: PokemonData[],
    }
}

const app = new OpenAPIHono<AppVariables>()
export default app;
