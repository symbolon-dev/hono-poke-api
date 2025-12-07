import fs from 'fs/promises';

import type { PokemonData } from '@/types/pokemon';
import { loadAllPokemon } from '@/utils/fetchers';
import { logger } from '@/utils/logger';

const CACHE_FILE = './pokemon-cache.json';

export const loadOrFetchPokemon = async (): Promise<PokemonData[]> => {
    try {
        const cached = await fs.readFile(CACHE_FILE, 'utf-8');
        logger.info('Cache loaded');
        return JSON.parse(cached) as PokemonData[];
    } catch {
        const data = await loadAllPokemon();

        const sortedData = [...data].sort((a, b) => a.id - b.id);

        await fs.writeFile(
            CACHE_FILE,
            JSON.stringify(sortedData, undefined, 4)
        );

        logger.info('Cache saved');
        return sortedData;
    }
};
