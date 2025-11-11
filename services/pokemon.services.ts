import type { PokemonData } from '../types/pokemon.js';

import { loadAllPokemon } from './fetchers.js';

import fs from 'fs/promises';

const CACHE_FILE = './pokemon-cache.json';

export const loadOrFetchPokemon = async (): Promise<PokemonData[]> => {
    try {
        const cached = await fs.readFile(CACHE_FILE, 'utf-8');
        console.log('📦 Cache geladen');
        return JSON.parse(cached) as PokemonData[];
    } catch {
        const data = await loadAllPokemon();

        const sortedData = [...data].sort((a, b) => a.id - b.id);

        await fs.writeFile(
            CACHE_FILE, 
            JSON.stringify(sortedData, undefined, 4)
        );
        console.log('💾 Cache gespeichert');
        return data;
    }
};
