import type { Request, Response, NextFunction } from "express";
import type { PokemonData } from "../types/pokemon.js";

import { queryPokemon } from "../servives/pokemon.services.js";

export const getPokemon = (req: Request, res: Response, _: NextFunction) => {
    const pokemonCache = req.app.locals.pokemonCache;
    const result = queryPokemon(req.query)(pokemonCache);
    res.status(200).json({ count: result.length, pokemon: result });
}

export const getPokemonById = (req: Request, res: Response, next: NextFunction) => {
    const pokemonCache = req.app.locals.pokemonCache;
    const id = Number(req.params.id);
    const result = pokemonCache.find((pokemon: PokemonData) => pokemon.id === id);

    if (!result) {
        return next({ message: "Pokémon not found", status: 404 });
    }

    res.status(200).json(result);
}

