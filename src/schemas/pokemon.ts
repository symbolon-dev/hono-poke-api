import type { EvolutionChainType } from '@/types/pokemon';
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

const EvolutionChainSchema: z.ZodType<EvolutionChainType> = z.object({
    species: z.object({
        name: z.string().openapi({ example: 'bulbasaur' }),
        url: z.string().openapi({ example: 'https://pokeapi.co/api/v2/pokemon-species/1/' })
    }),
    evolution_details: z.array(
        z.object({
            min_level: z.number().nullable().openapi({ example: 16 })
        })
    ),
    evolves_to: z.array(
        z.lazy(() => EvolutionChainSchema)
    )
});

export const EvolutionSchema = z.object({
    chain: EvolutionChainSchema
}).openapi('Evolution');

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
    chain: z.any()
}).openapi('PokemonDetails');

export const PokemonDataSchema = z.object({
    id: z.number().openapi({ example: 25 }),
    name: z.string().openapi({ example: 'pikachu' }),
    height: z.number().openapi({ example: 4, description: 'Height in decimeters' }),
    weight: z.number().openapi({ example: 60, description: 'Weight in hectograms' }),
    generation: z.number().openapi({ example: 1 }),
    is_default: z.boolean().openapi({ example: true }),
    types: z.array(z.string()).openapi({ example: ['electric'] }),
    stats: z.record(z.string(), z.number()).openapi({ 
        example: { hp: 35, attack: 55, defense: 40, 'special-attack': 50, 'special-defense': 50, speed: 90 } 
    }),
    sprites: z.object({
        sprite: z.string().nullable().openapi({ 
            example: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' 
        }),
        default: z.string().nullable().openapi({ 
            example: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' 
        }),
        defaultShiny: z.string().nullable().openapi({ 
            example: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/25.png' 
        })
    }).openapi({ description: 'Pokemon sprite URLs' }),
    evolutions: z.array(
        z.object({
            name: z.string().openapi({ example: 'raichu' }),
            url: z.string().openapi({ example: 'https://pokeapi.co/api/v2/pokemon-species/26/' }),
            minLevel: z.number().optional().openapi({ example: 16 })
        }).openapi({ description: 'Evolution details' })
    ).openapi({ description: 'List of possible evolutions' })
}).openapi('PokemonData');

export type PokemonData = z.infer<typeof PokemonDataSchema>;
export type GenerationData = z.infer<typeof GenerationSchema>;
export type PokemonDetails = z.infer<typeof PokemonDetailsSchema>;
