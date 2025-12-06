import { z } from '@hono/zod-openapi';

export const GenerationsListSchema = z.object({
    results: z.array(
        z.object({
            name: z.string().openapi({ example: 'generation-i' }),
            url: z.string().openapi({ example: 'https://pokeapi.co/api/v2/generation/1/' })
        })
    )
}).openapi('GenerationsList');

export const GenerationSchema = z.object({
    id: z.number().openapi({ example: 1 }),
    name: z.string().openapi({ example: 'generation-i' }),
    pokemon_species: z.array(
        z.object({
            name: z.string().openapi({ example: 'bulbasaur' }),
            url: z.string().openapi({ example: 'https://pokeapi.co/api/v2/pokemon-species/1/' })
        })
    )
}).openapi('Generation');

type EvolutionChainType = {
    species: { name: string; url: string };
    evolution_details: { min_level?: number | null | undefined }[];
    evolves_to: EvolutionChainType[];
};

export const EvolutionChainSchema: z.ZodType<EvolutionChainType> = z.object({
    species: z.object({
        name: z.string().openapi({ example: 'bulbasaur' }),
        url: z.string().openapi({ example: 'https://pokeapi.co/api/v2/pokemon-species/1/' })
    }),
    evolution_details: z.array(
        z.object({
            min_level: z.number().nullable().optional().openapi({ example: 16 })
        })
    ),
    evolves_to: z.array(
        z.lazy(() => EvolutionChainSchema)
    )
});

export const EvolutionSchema = z.object({
    chain: EvolutionChainSchema.optional()
}).openapi('Evolution');

export const PokemonSpeciesSchema = z.object({
    varieties: z.array(
        z.object({
            pokemon: z.object({
                name: z.string().openapi({ example: 'pikachu' }),
                url: z.string().openapi({ example: 'https://pokeapi.co/api/v2/pokemon/25/' })
            })
        })
    ),
    evolution_chain: z.object({
        url: z.string().openapi({ example: 'https://pokeapi.co/api/v2/evolution-chain/10/' })
    })
}).openapi('PokemonSpecies');

export const PokemonDetailsSchema = z.object({
    name: z.string().openapi({ example: 'pikachu' }),
    id: z.number().openapi({ example: 25 }),
    is_default: z.boolean().openapi({ example: true }),
    weight: z.number().openapi({ example: 60, description: 'Weight in hectograms' }),
    height: z.number().openapi({ example: 4, description: 'Height in decimeters' }),
    types: z.array(
        z.object({
            type: z.object({
                name: z.string().openapi({ example: 'electric' })
            })
        })
    ),
    stats: z.array(
        z.object({
            base_stat: z.number().openapi({ example: 35 }),
            stat: z.object({
                name: z.string().openapi({ example: 'hp' })
            })
        })
    ),
    sprites: z.object({
        front_default: z.string().nullable().openapi({
            example: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
        }),
        other: z.object({
            'official-artwork': z.object({
                front_default: z.string().nullable().openapi({
                    example: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
                }),
                front_shiny: z.string().nullable().openapi({
                    example: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/25.png'
                })
            })
        })
    }),
    chain: EvolutionChainSchema.optional()
}).openapi('PokemonDetails');

const TypeReferenceSchema = z.object({
    name: z.string().openapi({ example: 'fire' }),
    url: z.string().openapi({ example: 'https://pokeapi.co/api/v2/type/10/' })
});

export const TypeDetailsApiSchema = z.object({
    id: z.number().openapi({ example: 10 }),
    name: z.string().openapi({ example: 'fire' }),
    damage_relations: z.object({
        double_damage_to: z.array(TypeReferenceSchema),
        double_damage_from: z.array(TypeReferenceSchema),
        half_damage_to: z.array(TypeReferenceSchema),
        half_damage_from: z.array(TypeReferenceSchema),
        no_damage_to: z.array(TypeReferenceSchema),
        no_damage_from: z.array(TypeReferenceSchema)
    })
}).openapi('TypeDetailsApi');