import { createApp } from '@/app';
import { env } from '@/config/env';
import { initializePokemonCache } from '@/services/pokemon';
import { logger } from '@/utils/logger';

const startServer = async () => {
    const port = env.PORT;
    const pokemonCache = await initializePokemonCache();

    const app = createApp(pokemonCache);

    Bun.serve({
        fetch: app.fetch,
        port: port
    });

    logger.info(`API ready at http://localhost:${port}`);
    logger.info(`${pokemonCache.length} Pokémon in cache`);
};

startServer().catch(err => logger.error({ err }, 'Error on start'));
