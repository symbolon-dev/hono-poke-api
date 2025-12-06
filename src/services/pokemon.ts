import fs from 'fs/promises';

import type { PokemonData } from '@/types/pokemon';
import { loadAllPokemon } from '@/utils/fetchers';

const CACHE_FILE = './pokemon-cache.json';

export const loadOrFetchPokemon = async (): Promise<PokemonData[]> => {
    try {
        const cached = await fs.readFile(CACHE_FILE, 'utf-8');
        console.log('ℹ️ Cache loaded');
        return JSON.parse(cached) as PokemonData[];
    } catch {
        const data = await loadAllPokemon();

        const sortedData = [...data].sort((a, b) => a.id - b.id);

        await fs.writeFile(
            CACHE_FILE, 
            JSON.stringify(sortedData, undefined, 4)
        );

        console.log('✅ Cache saved');
        return sortedData;
    }
};
