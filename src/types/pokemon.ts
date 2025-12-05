import type { z } from 'zod';
import {
    PokemonDataSchema,
    GenerationSchema,
    PokemonDetailsSchema,
    EvolutionChainSchema,
    MappedEvolutionSchema,
    QueryParamsSchema
} from '@/schemas/pokemon';

export type PokemonData = z.infer<typeof PokemonDataSchema>;
export type GenerationData = z.infer<typeof GenerationSchema>;
export type PokemonDetails = z.infer<typeof PokemonDetailsSchema>;
export type EvolutionChain = z.infer<typeof EvolutionChainSchema>;
export type MappedEvolution = z.infer<typeof MappedEvolutionSchema>;
export type QueryParams = z.infer<typeof QueryParamsSchema>;
