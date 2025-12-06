import type { z } from 'zod';

import type { EvolutionChainSchema, GenerationSchema, PokemonDetailsSchema, PokemonSpeciesSchema } from '@/schemas/api';
import type { MappedEvolutionSchema, PokemonDataSchema } from '@/schemas/pokemon';
import type { QueryParamsSchema } from '@/schemas/query';

export type PokemonData = z.infer<typeof PokemonDataSchema>;
export type GenerationData = z.infer<typeof GenerationSchema>;
export type PokemonDetails = z.infer<typeof PokemonDetailsSchema>;
export type PokemonSpecies = z.infer<typeof PokemonSpeciesSchema>;
export type EvolutionChain = z.infer<typeof EvolutionChainSchema>;
export type MappedEvolution = z.infer<typeof MappedEvolutionSchema>;
export type QueryParams = z.infer<typeof QueryParamsSchema>;
