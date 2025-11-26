import app from './app.js'

import { pokemonRoutes } from './routes/pokemon.routes.js'
import { loadOrFetchPokemon } from './services/pokemon.services.js'

import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { logger } from 'hono/logger'
import { rateLimiter } from './middleware/rate-limiter.js'

const startServer = async () => {
    const port = process.env.PORT || 8000
    const pokemonCache = await loadOrFetchPokemon()

    app.use('*', logger())
    app.use('*', secureHeaders())
    app.use('*', cors({
        origin: ['http://localhost:3000', 'http://localhost:5173'],
        credentials: true,
        maxAge: 600
    }))

    app.use('*', rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }))

    app.use('*', async (c, next) => {
        c.set('pokemonCache', pokemonCache)
        await next()
    })
    app.route("/api/pokemon", pokemonRoutes);

    app.onError((err, c) => {
        console.error('Error:', err)
        return c.json({
            error: process.env.NODE_ENV === 'production' 
                ? 'Internal Server Error' 
                : err.message,
            status: 500
        }, 500)
    })

    app.notFound((c) => {
        return c.json({
            error: 'Route not found',
            status: 404
        }, 404)
    })

    // Bun (default)
    Bun.serve({
        fetch: app.fetch,
        port: port
    })

    // Deno (uncomment to use)
    // Deno.serve({ port: ProcessEnv.PORT }, app.fetch)

    // Node.js (uncomment to use, requires: npm i @hono/node-server)
    // import { serve } from '@hono/node-server'
    // serve({ fetch: app.fetch, port: ProcessEnv.PORT })
    
    console.log(`✅ API bereit unter http://localhost:${port}`)
    console.log(`📊 ${pokemonCache.length} Pokémon in cache`)
}

startServer().catch(err => console.error('❌ Error on start:', err))
