export type PokemonData = {
    id: number;
    name: string;
    height: number;
    weight: number;
    generation: number;
    is_default: boolean;
    types: string[];
    stats: Record<string, number>;
    sprites: {
        sprite: string | null;
        default: string | null;
        defaultShiny: string | null;
    };
    evolutions: {
        name: string;
        url: string;
        minLevel: number | undefined;
    }[]
};

export type EvolutionChainType = {
    species: { name: string; url: string };
    evolution_details: { min_level?: number | null }[];
    evolves_to: EvolutionChainType[];
};

export type EvolutionNode = {
    species: {
        name: string;
        url: string;
    };
    evolution_details: { min_level?: number }[];
    evolves_to: EvolutionNode[];
};

export type MappedEvolution = {
    name: string;
    url: string;
    minLevel: number | undefined;
};

export type QueryParams = {
    search?: string;
    type?: string;
    generation?: string;
    sort?: 'id' | 'name';
    order?: 'asc' | 'desc';
};
