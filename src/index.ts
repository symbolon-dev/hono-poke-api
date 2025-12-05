import { createApp } from './app.js';
import { loadOrFetchPokemon } from './services/pokemon.services.js';

const startServer = async () => {
    const port = process.env.PORT || 8000;
    const pokemonCache = await loadOrFetchPokemon();

    const app = createApp(pokemonCache);

    Bun.serve({
        fetch: app.fetch,
        port: port
    });

    console.log(`✅ API bereit unter http://localhost:${port}`);
    console.log(`📊 ${pokemonCache.length} Pokémon in cache`);
};

startServer().catch(err => console.error('❌ Error on start:', err));