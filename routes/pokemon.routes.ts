import { Hono } from 'hono';

import { getPokemon, getPokemonById } from '../controllers/pokemon.controller.js';

export const pokemonRoutes = new Hono();

pokemonRoutes.get('/', (c) => getPokemon(c)); // ?page=2&limit=50
pokemonRoutes.get('/:id', (c) => getPokemonById(c)); 
