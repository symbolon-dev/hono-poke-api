import type { PokemonData, QueryParams } from '@/types/pokemon';

const matchesSearchTerm = (pokemon: PokemonData, searchTerm: string): boolean => {
    const term = searchTerm.toLowerCase();
    return pokemon.name.toLowerCase().includes(term) || pokemon.id.toString() === term;
};

const hasAllTypes = (pokemon: PokemonData, typesToFilter: string[]): boolean => {
    return typesToFilter.every(searchType =>
        pokemon.types.some(pType => pType.toLowerCase() === searchType.toLowerCase())
    );
};

const isGeneration = (pokemon: PokemonData, generation: number): boolean => {
    return pokemon.generation === generation;
};

const sortPokemon = (pokemonList: PokemonData[], field: "id" | "name", direction: "asc" | "desc" = "asc"): PokemonData[] => {
    const multiplier = direction === "desc" ? -1 : 1;
    return [...pokemonList].sort((a, b) => {
        if (field === "name") return a.name.localeCompare(b.name) * multiplier;
        return (a.id - b.id) * multiplier;
    });
};

export const queryPokemon = (params: QueryParams) => (pokemonList: PokemonData[]): PokemonData[] => {
    const { search, types, generation, sort, order } = params;

    let result = pokemonList;

    if (search) {
        result = result.filter(pokemon => matchesSearchTerm(pokemon, search));
    }

    if (types) {
        const typesArray = Array.isArray(types) ? types : [types];
        if (typesArray.length > 0) {
            result = result.filter(pokemon => hasAllTypes(pokemon, typesArray));
        }
    }

    if (generation) {
        result = result.filter(pokemon => isGeneration(pokemon, Number(generation)));
    }

    if (sort) {
        result = sortPokemon(result, sort, order);
    }

    return result;
};
