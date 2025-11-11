import type { GenerationData, PokemonData, PokemonDetails, QueryParams } from '../types/pokemon.js';

import { GenerationSchema, GenerationsListSchema, PokemonDetailsSchema } from '../schemas/pokemon.schema.js';
import { chunk } from 'lodash-es';
import fs from 'fs/promises';

const CACHE_FILE = './pokemon-cache.json';
const BATCH_SIZE = 25;

// --- Data Loading ---
const fetchGenerationData = async (genId: number): Promise<GenerationData> => {
    const raw = await fetch(`https://pokeapi.co/api/v2/generation/${genId}`);
    const data = await raw.json();
    return GenerationSchema.parse(data);
};

const fetchPokemonDetails = async (url: string): Promise<PokemonDetails | undefined> => {
    try {
        const raw = await fetch(url.replace('pokemon-species', 'pokemon'));
        const data = await raw.json();
        return PokemonDetailsSchema.parse(data);
    } catch (error) {
        console.warn(`⚠️  Fehler beim Laden von ${url}:`, error);
        return undefined;
    }
};

const mapPokemonData = (parsed: PokemonDetails, generation: number): PokemonData => ({
    id: parsed.id,
    name: parsed.name,
    height: parsed.height,
    weight: parsed.weight,
    generation,
    is_default: parsed.is_default,
    types: parsed.types.map((t) => t.type.name),
    stats: Object.fromEntries(
        parsed.stats.map((s) => [s.stat.name, s.base_stat])
    ),
    sprites: {
        default: parsed.sprites.other['official-artwork'].front_default,
        shiny: parsed.sprites.other['official-artwork'].front_shiny,
    }
});

const fetchPokemonBatch = async (
    speciesList: Array<{ name: string; url: string }>,
    generation: number
): Promise<PokemonData[]> => {
    const results = await Promise.all(
        speciesList.map(async species => {
            const details = await fetchPokemonDetails(species.url);
            return details ? mapPokemonData(details, generation) : undefined;
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

const loadAllPokemon = async (): Promise<PokemonData[]> => {
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

// --- Query Functions ---
const byNameSearch = (searchTerm: string) => (pokemon: PokemonData): boolean =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());

const byType = (typeName: string) => (pokemon: PokemonData): boolean =>
    pokemon.types.some(type => type.toLowerCase() === typeName.toLowerCase());

const byGeneration = (generationNumber: number) => (pokemon: PokemonData): boolean =>
    pokemon.generation === generationNumber;

const sortBy = (field: "id" | "name", direction: "asc" | "desc" = "asc") => (pokemonList: PokemonData[]): PokemonData[] => {
    const multiplier = direction === "desc" ? -1 : 1;
    return [...pokemonList].sort((a, b) => {
        if (field === "name") return a.name.localeCompare(b.name) * multiplier;
        return (a.id - b.id) * multiplier;
    });
};

export const queryPokemon = (params: QueryParams) => (pokemonList: PokemonData[]): PokemonData[] => {
    const { search, type, generation, sort, order } = params;
    
    const filters: Array<(list: PokemonData[]) => PokemonData[]> = [
        search ? (list) => list.filter(byNameSearch(search)) : (list) => list,
        type ? (list) => list.filter(byType(type)) : (list) => list,
        generation ? (list) => list.filter(byGeneration(Number(generation))) : (list) => list,
        sort ? sortBy(sort, order) : (list) => list,
    ];
    
    return filters.reduce((result, applyFilter) => applyFilter(result), pokemonList);
};

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
