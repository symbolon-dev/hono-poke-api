import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { etag } from 'hono/etag';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';

import { rateLimiter } from '@/middleware/rate-limiter';
import { pokemonRoutes } from '@/routes/pokemon';
import type { PokemonData } from '@/types/pokemon';

type AppVariables = {
    Variables: {
        pokemonCache: PokemonData[],
    }
}

export const createApp = (pokemonCache: PokemonData[]) => {
    const app = new OpenAPIHono<AppVariables>();

    // Global middleware
    app.use('*', logger());
    app.use('*', rateLimiter({ windowMs: 15 * 60 * 1000, max: 500 }));  // 500 requests per 15 minutes
    app.use('*', secureHeaders());
    app.use('*', cors({
        origin: ['http://localhost:3000', 'http://localhost:5173'], // Dev origins, production should be set via environment variables
        credentials: true,
        maxAge: 600 // 10 minutes
    }));

    // Set pokemon cache in context
    app.use('*', async (c, next) => {
        c.set('pokemonCache', pokemonCache);
        await next();
    });

    // ETag middleware for 304 responses
    app.use('*', etag());

    // Cache-Control headers
    app.use('/api/*', async (c, next) => {
        await next();

        const path = c.req.path;
        if (path.match(/\/api\/pokemon\/\d+$/) ||
            path === '/api/pokemon/types' ||
            path === '/api/pokemon/generations') {
            c.header('Cache-Control', 'public, max-age=3600'); // 1 hour
        }
        else if (path === '/api/pokemon') {
            c.header('Cache-Control', 'public, max-age=300');  // 5 minutes
        }
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

    // Swagger UI
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
