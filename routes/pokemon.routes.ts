import type { Router } from 'express';

import express from 'express';

import { getPokemon, getPokemonById } from '../controllers/pokemon.controller.js';

const router: Router = express.Router();

router.get('/', getPokemon)
router.get('/:id', getPokemonById)

export default router;
