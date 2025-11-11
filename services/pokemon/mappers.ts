import type { PokemonDetails } from '../../schemas/pokemon.schema.js';
import type { EvolutionNode, MappedEvolution, PokemonData } from '../../types/pokemon.js';

export const mapPokemonData = (parsed: PokemonDetails, generation: number): PokemonData => ({
    id: parsed.id,
    name: parsed.name,
    height: parsed.height,
    weight: parsed.weight,
    generation,
    is_default: parsed.is_default,
    types: parsed.types.map((t) => t.type.name),
    stats: Object.fromEntries(
        parsed.stats.map((s) => [s.stat.name, s.base_stat])
    ),
    sprites: {
        sprite: parsed.sprites.front_default,
        default: parsed.sprites.other['official-artwork'].front_default,
        defaultShiny: parsed.sprites.other['official-artwork'].front_shiny,
    },
    evolutions: parsed.chain
        ? mapEvolutionChain(parsed.chain)
        : [],

});

const mapEvolutionChain = (
    chain: EvolutionNode,
    minLevel?: number
): MappedEvolution[] => {
    const current: MappedEvolution = {
        name: chain.species.name,
        url: chain.species.url,
        minLevel,
    };

    if (!chain.evolves_to?.length) {
        return [current];
    }

    const evolutions = chain.evolves_to.flatMap((evo: EvolutionNode) =>
        mapEvolutionChain(evo, evo.evolution_details?.[0]?.min_level)
    );

    return [current, ...evolutions];
};
