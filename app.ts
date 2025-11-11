import type { PokemonData } from './types/pokemon.js';

import { Hono } from 'hono';

import { pokemonRoutes } from "./routes/pokemon.routes.js";

type AppVariables = {
    Variables: {
        pokemonCache: PokemonData[],
    }
}

const app = new Hono<AppVariables>()

app.route("/api/pokemon", pokemonRoutes);

export default app;
