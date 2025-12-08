import { createApp } from '@/app';
import { env } from '@/config/env';
import { initializePokemonCache } from '@/services/pokemon';
import { logger } from '@/utils/logger';

const startServer = async () => {
    const port = env.PORT;
    const pokemonCache = await initializePokemonCache();

    const app = createApp(pokemonCache);

    const server = Bun.serve({
        fetch: app.fetch,
        port: port
    });

    logger.info(`API ready at http://localhost:${port}`);
    logger.info(`${pokemonCache.length} Pokémon in cache`);

    const shutdown = async (signal: string) => {
        logger.info(`${signal} received, shutting down gracefully...`);

        server.stop();

        logger.info('Server closed, exiting process');
        process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
};

startServer().catch(err => logger.error({ err }, 'Error on start'));
