import type { PokemonData, QueryParams } from '@/types/pokemon.js';

const bySearchTerm = (searchTerm: string) => (pokemon: PokemonData): boolean => {
    const term = searchTerm.toLowerCase();
    return pokemon.name.toLowerCase().includes(term) || pokemon.id.toString() === term;
};

const byType = (typeInput: string | string[]) => (pokemon: PokemonData): boolean => {
    const typesToFilter = Array.isArray(typeInput) ? typeInput : [typeInput];
    
    return typesToFilter.every(searchType => 
        pokemon.types.some(pType => pType.toLowerCase() === searchType.toLowerCase())
    );
};

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
    const { search, types, generation, sort, order } = params;
    
    const filters: Array<(list: PokemonData[]) => PokemonData[]> = [
        search ? (list) => list.filter(bySearchTerm(search)) : (list) => list,
        types ? (list) => list.filter(byType(types)) : (list) => list,
        generation ? (list) => list.filter(byGeneration(Number(generation))) : (list) => list,
        sort ? sortBy(sort, order) : (list) => list,
    ];
    
    return filters.reduce((result, applyFilter) => applyFilter(result), pokemonList);
};
