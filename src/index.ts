import { createApp } from '@/app';
import { env } from '@/config/env';
import { loadOrFetchPokemon } from '@/services/pokemon';

const startServer = async () => {
    const port = env.PORT;
    const pokemonCache = await loadOrFetchPokemon();

    const app = createApp(pokemonCache);

    Bun.serve({
        fetch: app.fetch,
        port: port
    });

    console.log(`✅ API ready at http://localhost:${port}`);
    console.log(`ℹ️ ${pokemonCache.length} Pokémon in cache`);
};

startServer().catch(err => console.error('❌ Error on start:', err));
