# PokeAPI Hono + Bun

A minimal API server for [PokeAPI](https://pokeapi.co/) with in-memory caching.

## Features

- Hono + Bun server
- Routes:
  - `/pokemon` → list of all Pokémon
  - `/pokemon/:id` → details of a single Pokémon
- In-memory caching

## Run

```bash
bun install
bun dev
