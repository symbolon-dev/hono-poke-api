import { app } from "./app.js";

import { loadOrFetchPokemon } from './servives/pokemon.services.js';

const startServer = async () => {
    const port = process.env.PORT || 8000;

    const pokemonCache = await loadOrFetchPokemon();

    app.listen(port, () => {
        console.log(`✅ API bereit unter http://localhost:${port}`);
        console.log(`📊 ${pokemonCache.length} Pokémon im Cache`);
    });
};

startServer().catch(err => console.error("❌ Fehler beim Start:", err));
