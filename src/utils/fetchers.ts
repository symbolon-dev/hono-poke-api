import { chunk } from 'lodash-es';

import { EvolutionSchema, GenerationSchema, GenerationsListSchema, PokemonDetailsSchema, PokemonSpeciesSchema, TypeDetailsApiSchema } from '@/schemas/api';
import type { GenerationData, PokemonData, PokemonDetails, TypeDetails } from '@/types/pokemon';
import { mapPokemonData, mapTypeDetails } from '@/utils/mappers';

const BATCH_SIZE = 25;

const fetchJson = async <T>(url: string): Promise<T | undefined> => {
    try {
        let res = await fetch(url);
        if (!res.ok) {
            console.warn(`⚠️ HTTP ${res.status} at ${url}`);
            if (res.status === 500) {
                const fallbackUrl = url.replace(/\/$/, '');
                if (fallbackUrl !== url) {
                    console.warn(`⚠️ Retry without trailing slash for ${url}`);
                    res = await fetch(fallbackUrl);
                }
            }
        }

        if (!res.ok) {
            console.warn(`⚠️ HTTP ${res.status} at ${url} (after fallback)`);
            return undefined;
        }


        const text = await res.text();
        try {
            return JSON.parse(text) as T;
        } catch (err) {
            console.warn(`⚠️ Error parsing JSON for ${url}:`, err);
            return undefined;
        }
    } catch (err) {
        console.warn(`⚠️ Fetch error for ${url}:`, err);
        return undefined;
    }
}

const fetchGenerationData = async (genId: number): Promise<GenerationData | undefined> => {
    try {
        const data = await fetchJson(`https://pokeapi.co/api/v2/generation/${genId}`);
        return GenerationSchema.parse(data);
    } catch (error) {
        console.warn('⚠️ Error loading generations', error);
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
        console.warn(`⚠️ Error loading details from ${url}:`, error);
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
    const batches = chunk(genData?.pokemon_species, BATCH_SIZE);

    const allPokemon = await Promise.all(
        batches.map(async (batch, index) => {
            const pokemon = await fetchPokemonBatch(batch, genId);
            console.log(`  ✅ Gen ${genId} - Batch ${index + 1}/${batches.length} (${pokemon.length} Pokémon)`);
            return pokemon;
        })
    );
    
    return allPokemon.flat();
};

export const loadAllPokemon = async (): Promise<PokemonData[]> => {
    console.log("ℹ️ Loading all Pokémon from all generations...");

    const data = await fetchJson('https://pokeapi.co/api/v2/generation/');
    const generations = GenerationsListSchema.parse(data);

    const allGenerations = await Promise.all(
        generations.results.map((_, i) =>
            loadGenerationPokemon(i + 1)
        )
    );

    const allPokemon = allGenerations.flat();

    console.log(`✅ Total: ${allPokemon.length} Pokémon loaded.`);

    return allPokemon;
};

export const fetchTypeDetails = async (typeName: string): Promise<TypeDetails | undefined> => {
    try {
        const data = await fetchJson(`https://pokeapi.co/api/v2/type/${typeName}`);
        if (!data) return undefined;

        const parsed = TypeDetailsApiSchema.parse(data);
        return mapTypeDetails(parsed);
    } catch (error) {
        console.warn(`⚠️ Error loading type details for ${typeName}:`, error);
        return undefined;
    }
};
