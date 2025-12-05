import type { PokemonData } from './types/pokemon.js';
import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { logger } from 'hono/logger';
import { rateLimiter } from './middleware/rate-limiter.js';
import { pokemonRoutes } from './routes/pokemon.routes.js';

type AppVariables = {
    Variables: {
        pokemonCache: PokemonData[],
    }
}

export const createApp = (pokemonCache: PokemonData[]) => {
    const app = new OpenAPIHono<AppVariables>();

    // Global middleware
    app.use('*', logger());
    app.use('*', secureHeaders());
    app.use('*', cors({
        origin: ['http://localhost:3000', 'http://localhost:5173'],
        credentials: true,
        maxAge: 600
    }));
    app.use('*', rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));

    // Set pokemon cache in context
    app.use('*', async (c, next) => {
        c.set('pokemonCache', pokemonCache);
        await next();
    });

    // Health check
    app.get('/health', (c) => c.json({ status: 'ok', timestamp: Date.now() }));

    // Routes
    app.route('/api/pokemon', pokemonRoutes);

    // OpenAPI documentation
    app.doc('/doc', {
        openapi: '3.0.0',
        info: {
            version: '1.0.0',
            title: 'Pokemon API',
            description: 'API for browsing and filtering Pokemon data'
        }
    });
    app.get('/ui', swaggerUI({ url: '/doc' }));

    // Dummy route for favicon
    app.get('/favicon.ico', c => c.body(null, 204));

    // Error handling
    app.onError((err, c) => {
        console.error('Error:', err);
        return c.json({
            error: process.env.NODE_ENV === 'production'
                ? 'Internal Server Error'
                : err.message,
            status: 500
        }, 500);
    });

    app.notFound((c) => {
        return c.json({
            error: 'Route not found',
            status: 404
        }, 404);
    });

    return app;
};
