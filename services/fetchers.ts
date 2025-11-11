import type { GenerationData, PokemonDetails } from '../schemas/pokemon.schema.js';
import type { PokemonData } from '../types/pokemon.js';

import { GenerationSchema, GenerationsListSchema, PokemonDetailsSchema, EvolutionSchema } from '../schemas/pokemon.schema.js';

import { mapPokemonData } from './mappers.js';

import { chunk } from 'lodash-es';

const BATCH_SIZE = 25;

const fetchGenerationData = async (genId: number): Promise<GenerationData> => {
    const raw = await fetch(`https://pokeapi.co/api/v2/generation/${genId}`);
    const data = await raw.json();
    return GenerationSchema.parse(data);
};

const fetchPokemon = async (url: string): Promise<PokemonDetails | undefined> => {
    try {
        const rawPokemons = await fetch(url);
        const dataPokemons = await rawPokemons.json();
        
        const rawDetails = await fetch((dataPokemons as any).varieties[0].pokemon.url);
        const dataDetails = await rawDetails.json();
        const details = PokemonDetailsSchema.parse(dataDetails);

        const raw = await fetch((dataPokemons as any).evolution_chain.url);
        const data = await raw.json();
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
    const batches = chunk(genData.pokemon_species, BATCH_SIZE);

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

    const rawGenerations = await fetch('https://pokeapi.co/api/v2/generation/');
    const data = await rawGenerations.json();
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
