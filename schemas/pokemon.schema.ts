import type { EvolutionChainType } from '../types/pokemon.js';

import { z } from "zod";

export const GenerationsListSchema = z.object({
    results: z.array(z.object({
        name: z.string(),
        url: z.string()
    }))
});

export const GenerationSchema = z.object({
    id: z.number(),
    name: z.string(),
    pokemon_species: z.array(
        z.object({
            name: z.string(),
            url: z.string(),
        })
    ),
});

const EvolutionChainSchema: z.ZodType<EvolutionChainType> = z.object({
    species: z.object({
        name: z.string(),
        url: z.string(),
    }),
    evolution_details: z.array(
        z.object({
            min_level: z.number().nullable(),
        })
    ),
    evolves_to: z.array(
        z.lazy(() => EvolutionChainSchema)
    ),
});

export const EvolutionSchema = z.object({
    chain: EvolutionChainSchema,
});

export const PokemonDetailsSchema = z.object({
    name: z.string(),
    id: z.number(),
    is_default: z.boolean(),
    weight: z.number(),
    height: z.number(),
    types: z.array(
        z.object({
            type: z.object({
                name: z.string(),
            }),
        })
    ),
    stats: z.array(
        z.object({
            base_stat: z.number(),
            stat: z.object({
                name: z.string(),
            }),
        })
    ),
    sprites: z.object({
        front_default: z.string().nullable(),
        other: z.object({
            'official-artwork': z.object({
                front_default: z.string().nullable(),
                front_shiny: z.string().nullable()
            })
        }),
    }),
    chain: z.any(),
});

export type GenerationData = z.infer<typeof GenerationSchema>;
export type PokemonDetails = z.infer<typeof PokemonDetailsSchema>;
