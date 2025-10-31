import { z } from "zod";

import { GenerationSchema, PokemonDetailsSchema } from "../schemas/pokemon.schema.js";

export type GenerationData = z.infer<typeof GenerationSchema>;
export type PokemonDetails = z.infer<typeof PokemonDetailsSchema>;

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
        default: string | undefined | null;
        shiny: string | undefined | null;
    };
};

export type QueryParams = {
    search?: string;
    type?: string;
    generation?: string;
    sort?: 'id' | 'name';
    order?: 'asc' | 'desc';
};
