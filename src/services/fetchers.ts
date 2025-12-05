import type { GenerationData, PokemonDetails } from '@/schemas/pokemon.js';
import type { PokemonData } from '@/types/pokemon.js';

import { GenerationSchema, GenerationsListSchema, PokemonDetailsSchema, EvolutionSchema } from '@/schemas/pokemon.js';

import { mapPokemonData } from '@/services/mappers.js';

import { chunk } from 'lodash-es';

const BATCH_SIZE = 25;

const fetchJson = async <T>(url: string): Promise<T | undefined> => {
    try {
        let res = await fetch(url);
        if (!res.ok) {
            console.warn(`HTTP ${res.status} bei ${url}`);
            if (res.status === 500) {
                const fallbackUrl = url.replace(/\/$/, '');
                if (fallbackUrl !== url) {
                    console.warn(`⚠️ Retry ohne trailing slash für ${url}`);
                    res = await fetch(fallbackUrl);
                }
            }
        }

        if (!res.ok) {
            console.warn(`HTTP ${res.status} bei ${url} (nach fallback)`);
            return undefined;
        }


        const text = await res.text();
        try {
            return JSON.parse(text) as T;
        } catch (err) {
            console.warn(`Fehler beim Parsen von JSON für ${url}:`, err);
            return undefined;
        }
    } catch (err) {
        console.warn(`Fetch-Fehler für ${url}:`, err);
        return undefined;
    }
}

const fetchGenerationData = async (genId: number): Promise<GenerationData | undefined> => {
    try {
        const data = await fetchJson(`https://pokeapi.co/api/v2/generation/${genId}`);
        return GenerationSchema.parse(data);
    } catch (error) {
        console.warn('⚠️  Fehler beim Laden der Generationen', error);
        return undefined;
    }
};

const fetchPokemon = async (url: string): Promise<PokemonDetails | undefined> => {
    try {
        const dataPokemons = await fetchJson(url);
        
        const dataDetails = await fetchJson((dataPokemons as any).varieties[0].pokemon.url);
        const details = PokemonDetailsSchema.parse(dataDetails);

        const data = await fetchJson((dataPokemons as any).evolution_chain.url);
        const evolutions = EvolutionSchema.parse(data);

        return { ...details, ...evolutions };
    } catch (error) {
        console.warn(`⚠️  Fehler beim Laden der Details von ${url}:`, error);
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
    console.log("🔄 Lade alle Pokémon aus allen Generationen...");

    const data = await fetchJson('https://pokeapi.co/api/v2/generation/');
    const generations = GenerationsListSchema.parse(data);

    const allGenerations = await Promise.all(
        generations.results.map((_, i) =>
            loadGenerationPokemon(i + 1)
        )
    );

    const allPokemon = allGenerations.flat();
    
    console.log(`🎉 Gesamt: ${allPokemon.length} Pokémon geladen.`);
    
    return allPokemon;
};
