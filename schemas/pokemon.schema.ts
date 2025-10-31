import { z } from "zod";

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
        other: z.object({
            'official-artwork': z.object({
                front_default: z.string().nullish(),
                front_shiny: z.string().nullish()
            })
        }),
    }),
});

export const GenerationsListSchema = z.object({
    results: z.array(z.object({
        name: z.string(),
        url: z.string()
    }))
});
