import fs from 'fs/promises';

import type { PokemonData } from '@/types/pokemon';
import { fetchAllPokemon } from '@/utils/fetchers';
import { logger } from '@/utils/logger';

const CACHE_FILE = './src/data/pokemon-cache.json';

export const initializePokemonCache = async (): Promise<PokemonData[]> => {
    try {
        const cached = await fs.readFile(CACHE_FILE, 'utf-8');
        logger.info('Pokemon cache loaded from file');
        return JSON.parse(cached) as PokemonData[];
    } catch (err) {
        logger.info(`Cache not found, fetching from PokeAPI: ${err}`);
        const data = await fetchAllPokemon();

        const sortedData = [...data].sort((a, b) => a.id - b.id);

        await fs.writeFile(
            CACHE_FILE,
            JSON.stringify(sortedData, undefined, 4)
        );

        logger.info('Pokemon cache saved to file');
        return sortedData;
    }
};
