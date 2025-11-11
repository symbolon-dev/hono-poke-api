import app from './app.js'
import { loadOrFetchPokemon } from './services/pokemon/pokemon.services.js'

const startServer = async () => {
    const port = process.env.PORT || 8000
    const pokemonCache = await loadOrFetchPokemon()
    
    app.use('*', async (c, next) => {
        c.set('pokemonCache', pokemonCache)
        await next()
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
    console.log(`📊 ${pokemonCache.length} Pokémon im Cache`)
}

startServer().catch(err => console.error('❌ Fehler beim Start:', err))
