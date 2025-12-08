import { chunk } from 'lodash-es';

import { EvolutionSchema, GenerationSchema, GenerationsListSchema, PokemonDetailsSchema, PokemonSpeciesSchema, TypeDetailsApiSchema } from '@/schemas/api';
import type { GenerationData, PokemonData, PokemonDetails, TypeDetails } from '@/types/pokemon';
import { cacheGet, cacheSet } from '@/utils/cache';
import { logger } from '@/utils/logger';
import { mapPokemonData, mapTypeDetails } from '@/utils/mappers';

const BATCH_SIZE = 25;
const REQUEST_TIMEOUT_MS = 5000; // 5 seconds
const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
    const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), ms)
    );
    return Promise.race([promise, timeout]);
};

const fetchJson = async <T>(url: string): Promise<T | undefined> => {
    try {
        let res = await withTimeout(fetch(url), REQUEST_TIMEOUT_MS);
        if (!res.ok) {
            logger.warn({ status: res.status, url }, 'HTTP error');
            if (res.status === 500) {
                const fallbackUrl = url.replace(/\/$/, '');
                if (fallbackUrl !== url) {
                    logger.warn({ url }, 'Retry without trailing slash');
                    res = await withTimeout(fetch(fallbackUrl), REQUEST_TIMEOUT_MS);
                }
            }
        }

        if (!res.ok) {
            logger.warn({ status: res.status, url }, 'HTTP error after fallback');
            return undefined;
        }


        const text = await res.text();
        try {
            const data = JSON.parse(text) as T;
            return data;
        } catch (err) {
            logger.warn({ err, url }, 'Error parsing JSON');
            return undefined;
        }
    } catch (err) {
        logger.warn({ err, url }, 'Fetch error');
        return undefined;
    }
}

const fetchGenerationData = async (genId: number): Promise<GenerationData | undefined> => {
    try {
        const data = await fetchJson(`${POKEAPI_BASE_URL}/generation/${genId}`);
        return GenerationSchema.parse(data);
    } catch (error) {
        logger.warn({ error, genId }, 'Error loading generation');
        return undefined;
    }
};

const fetchPokemon = async (url: string): Promise<PokemonDetails | undefined> => {
    try {
        const speciesData = await fetchJson(url);
        if (!speciesData) return undefined;

        const species = PokemonSpeciesSchema.parse(speciesData);
        if (!species.varieties[0]) return undefined;

        const dataDetails = await fetchJson(species.varieties[0].pokemon.url);
        const details = PokemonDetailsSchema.parse(dataDetails);

        const data = await fetchJson(species.evolution_chain.url);
        const evolutions = EvolutionSchema.parse(data);

        return { ...details, ...evolutions };
    } catch (error) {
        logger.warn({ error, url }, 'Error loading pokemon details');
        return undefined;
    }
};

const fetchPokemonBatch = async (
    speciesList: Array<{ name: string; url: string }>,
    generation: number
): Promise<PokemonData[]> => {
    const results = await Promise.all(
        speciesList.map(async species => {
            const pokemon = await fetchPokemon(species.url);
            return pokemon ? mapPokemonData(pokemon, generation) : undefined;
        })
    );

    return results.filter((p): p is PokemonData => p !== undefined);
};

const loadGenerationPokemon = async (genId: number): Promise<PokemonData[]> => {
    const genData = await fetchGenerationData(genId);

    if (!genData?.pokemon_species) {
        logger.warn({ genId }, 'No Pokemon species data for generation');
        return [];
    }

    const batches = chunk(genData.pokemon_species, BATCH_SIZE);

    const allPokemon = await Promise.all(
        batches.map(async (batch, index) => {
            const pokemon = await fetchPokemonBatch(batch, genId);
            logger.debug(`Gen ${genId} - Batch ${index + 1}/${batches.length} (${pokemon.length} Pokémon)`);
            return pokemon;
        })
    );
    
    return allPokemon.flat();
};

export const fetchAllPokemon = async (): Promise<PokemonData[]> => {
    logger.info('Fetching all Pokémon from PokeAPI...');

    const data = await fetchJson(`${POKEAPI_BASE_URL}/generation/`);
    const generations = GenerationsListSchema.parse(data);

    const allGenerations = await Promise.all(
        generations.results.map((_, i) =>
            loadGenerationPokemon(i + 1)
        )
    );

    const allPokemon = allGenerations.flat();

    logger.info(`Total: ${allPokemon.length} Pokémon fetched`);

    return allPokemon;
};

export const fetchTypeDetails = async (typeName: string): Promise<TypeDetails | undefined> => {
    const cacheKey = `type:${typeName}`;
    const cached = cacheGet<TypeDetails>(cacheKey);
    if (cached) return cached;

    try {
        const data = await fetchJson(`${POKEAPI_BASE_URL}/type/${typeName}`);
        if (!data) return undefined;

        const parsed = TypeDetailsApiSchema.parse(data);
        const typeDetails = mapTypeDetails(parsed);

        cacheSet(cacheKey, typeDetails);
        return typeDetails;
    } catch (error) {
        logger.warn({ error, typeName }, 'Error loading type details');
        return undefined;
    }
};
