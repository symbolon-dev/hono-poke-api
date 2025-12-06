import type { EvolutionChain, MappedEvolution, PokemonData, PokemonDetails, TypeDetails, TypeDetailsApi } from '@/types/pokemon';

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
    chain: EvolutionChain,
    minLevel?: number | null
): MappedEvolution[] => {
    const current: MappedEvolution = {
        name: chain.species.name,
        url: chain.species.url,
        minLevel: minLevel ?? undefined,
    };

    if (!chain.evolves_to?.length) {
        return [current];
    }

    const evolutions = chain.evolves_to.flatMap((evo: EvolutionChain) =>
        mapEvolutionChain(evo, evo.evolution_details?.[0]?.min_level)
    );

    return [current, ...evolutions];
};

export const mapTypeDetails = (apiData: TypeDetailsApi): TypeDetails => ({
    id: apiData.id,
    name: apiData.name,
    damageRelations: {
        doubleDamageTo: apiData.damage_relations.double_damage_to.map(t => t.name),
        doubleDamageFrom: apiData.damage_relations.double_damage_from.map(t => t.name),
        halfDamageTo: apiData.damage_relations.half_damage_to.map(t => t.name),
        halfDamageFrom: apiData.damage_relations.half_damage_from.map(t => t.name),
        noDamageTo: apiData.damage_relations.no_damage_to.map(t => t.name),
        noDamageFrom: apiData.damage_relations.no_damage_from.map(t => t.name)
    }
});
