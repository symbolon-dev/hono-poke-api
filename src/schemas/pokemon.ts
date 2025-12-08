import { z } from '@hono/zod-openapi';

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

export const PokemonListResponseSchema = z.object({
    count: z.number().openapi({ example: 150, description: 'Total number of Pokemon matching filters' }),
    page: z.number().openapi({ example: 1, description: 'Current page number' }),
    limit: z.number().openapi({ example: 20, description: 'Items per page' }),
    totalPages: z.number().openapi({ example: 8, description: 'Total number of pages' }),
    pokemon: z.array(PokemonDataSchema).openapi({ description: 'List of Pokemon on this page' })
}).openapi('PokemonListResponse');

export const TypesResponseSchema = z.object({
    types: z.array(z.string()).openapi({ example: ['electric', 'fire', 'water'], description: 'List of all Pokemon types' })
}).openapi('TypesResponse');

export const GenerationsResponseSchema = z.object({
    generations: z.array(z.number()).openapi({ example: [1, 2, 3, 4, 5], description: 'List of all Pokemon generations' })
}).openapi('GenerationsResponse');

export const MappedEvolutionSchema = z.object({
    name: z.string(),
    url: z.string(),
    minLevel: z.number().optional()
});

export const DamageRelationsSchema = z.object({
    doubleDamageTo: z.array(z.string()).openapi({
        example: ['grass', 'ice', 'bug', 'steel'],
        description: 'Types that take double damage from this type'
    }),
    doubleDamageFrom: z.array(z.string()).openapi({
        example: ['water', 'ground', 'rock'],
        description: 'Types that deal double damage to this type'
    }),
    halfDamageTo: z.array(z.string()).openapi({
        example: ['fire', 'water', 'rock', 'dragon'],
        description: 'Types that take half damage from this type'
    }),
    halfDamageFrom: z.array(z.string()).openapi({
        example: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'],
        description: 'Types that deal half damage to this type'
    }),
    noDamageTo: z.array(z.string()).openapi({
        example: [],
        description: 'Types that take no damage from this type'
    }),
    noDamageFrom: z.array(z.string()).openapi({
        example: [],
        description: 'Types that deal no damage to this type'
    })
}).openapi('DamageRelations');

export const TypeDetailsSchema = z.object({
    id: z.number().openapi({ example: 10, description: 'Type ID' }),
    name: z.string().openapi({ example: 'fire', description: 'Type name' }),
    damageRelations: DamageRelationsSchema
}).openapi('TypeDetails');