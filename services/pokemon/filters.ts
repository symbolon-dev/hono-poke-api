import type { PokemonData, QueryParams } from '../../types/pokemon.js';

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
